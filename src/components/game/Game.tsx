import { useCallback, useEffect, useRef, useState } from "react";
import bg1 from "@/assets/bg-fase1.jpg";
import bg2 from "@/assets/bg-fase2.jpg";
import bg3 from "@/assets/bg-fase3.jpg";
import { PHASES } from "@/data/questions";
import { play, setSoundOn } from "@/lib/sound";
import { Hamster, type Mood } from "./Hamster";
import { Fireflies, Confetti } from "./Effects";
import { HintModal } from "./HintModal";

const BGS = [bg1, bg2, bg3];
const LETTERS = ["A", "B", "C", "D", "E"];
const LIVES = 3;
const TIME_LIMIT = 30;
const PROGRESS_KEY = "hamster-explorador-progresso";
const loadProgress = () => { try { return Math.min(PHASES.length - 1, Math.max(0, Number(localStorage.getItem(PROGRESS_KEY) || 0))); } catch { return 0; } };
const REC_KEY = "hamster-explorador-recordes";
const WALLET_KEY = "hamster-explorador-wallet-v1";
const SKINS = [
  { id: "original", name: "Explorador Original", icon: "🐹", price: 0 },
  { id: "bunny", name: "Hamster Coelhinho", icon: "🐰", price: 100 },
  { id: "pirate", name: "Hamster Pirata", icon: "🏴‍☠️", price: 150 },
  { id: "wizard", name: "Hamster Mago", icon: "🧙", price: 200 },
  { id: "astronaut", name: "Hamster Astronauta", icon: "👨‍🚀", price: 300 },
  { id: "king", name: "Rei da Floresta", icon: "👑", price: 450 },
  { id: "dragon", name: "Dragão Mágico", icon: "🐉", price: 600 },
  { id: "gold", name: "Hamster Dourado", icon: "🌟", price: 1000 },
];
const SCENES = [
  { id: "forest", name: "Floresta Encantada", icon: "🌳", price: 0, bg: 0, filter: "none" },
  { id: "fairy", name: "Bosque das Fadas", icon: "🧚", price: 150, bg: 0, filter: "hue-rotate(35deg) saturate(1.15)" },
  { id: "crystal", name: "Floresta de Cristais", icon: "💎", price: 250, bg: 1, filter: "hue-rotate(35deg) saturate(1.2)" },
  { id: "night", name: "Reino Noturno", icon: "🌙", price: 350, bg: 2, filter: "brightness(.72) saturate(1.25)" },
  { id: "cherry", name: "Vale das Cerejeiras", icon: "🌸", price: 450, bg: 0, filter: "hue-rotate(300deg) saturate(1.2)" },
  { id: "ice", name: "Reino Gelado", icon: "❄️", price: 550, bg: 1, filter: "hue-rotate(155deg) saturate(.85) brightness(1.08)" },
  { id: "cloud", name: "Castelo das Nuvens", icon: "☁️", price: 700, bg: 2, filter: "hue-rotate(190deg) brightness(1.12)" },
  { id: "golden", name: "Floresta Dourada", icon: "✨", price: 900, bg: 0, filter: "sepia(.45) saturate(1.5)" },
];
type Wallet = { coins: number; ownedSkins: string[]; ownedScenes: string[]; skin: string; scene: string };
const DEFAULT_WALLET: Wallet = { coins: 0, ownedSkins: ["original"], ownedScenes: ["forest"], skin: "original", scene: "forest" };
const loadWallet = (): Wallet => {
  try { return { ...DEFAULT_WALLET, ...JSON.parse(localStorage.getItem(WALLET_KEY) || "{}") }; } catch { return DEFAULT_WALLET; }
};

type Screen = "home" | "howto" | "records" | "shop" | "play" | "phaseDone" | "phaseFail" | "final" | "review";
type AnswerLog = { phase: number; q: number; chosen: number; correct: boolean; hint: boolean };
type Records = { best: number; phases: number; bestCorrect: number };

const loadRec = (): Records => {
  try { return { best: 0, phases: 0, bestCorrect: 0, ...JSON.parse(localStorage.getItem(REC_KEY) || "{}") }; } catch { return { best: 0, phases: 0, bestCorrect: 0 }; }
};

export function Game() {
  const [screen, setScreen] = useState<Screen>("home");
  const [wallet, setWallet] = useState<Wallet>(DEFAULT_WALLET);
  const [sound, setSound] = useState(true);
  const [phase, setPhase] = useState(0);
  const [qi, setQi] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [score, setScore] = useState(0);
  const [phaseStartScore, setPhaseStartScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [hints, setHints] = useState(0);
  const [log, setLog] = useState<AnswerLog[]>([]);
  const [badges, setBadges] = useState<number[]>([]);
  const [startAt, setStartAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mood, setMood] = useState<Mood>("idle");
  const [speech, setSpeech] = useState<string | undefined>("Vamos descobrir!");
  const [records, setRecords] = useState<Records>({ best: 0, phases: 0, bestCorrect: 0 });
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [savedPhase, setSavedPhase] = useState(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setRecords(loadRec()); setWallet(loadWallet()); setSavedPhase(loadProgress()); }, []);
  useEffect(() => { localStorage.setItem(WALLET_KEY, JSON.stringify(wallet)); }, [wallet]);
  const earnCoins = (amount: number) => setWallet((w) => ({ ...w, coins: w.coins + amount }));
  const buyOrEquip = (kind: "skin" | "scene", id: string, price: number) => {
    const ownedKey = kind === "skin" ? "ownedSkins" : "ownedScenes";
    const selectedKey = kind === "skin" ? "skin" : "scene";
    const owned = wallet[ownedKey];
    if (owned.includes(id)) {
      setWallet((w) => ({ ...w, [selectedKey]: id }));
      return;
    }
    if (wallet.coins < price) {
      window.alert("Você precisa de mais moedas mágicas!");
      return;
    }
    setWallet((w) => {
      if (w[ownedKey].includes(id) || w.coins < price) return w;
      return { ...w, coins: w.coins - price, [ownedKey]: [...w[ownedKey], id], [selectedKey]: id };
    });
  };
  const goHome = () => {
    if (screen === "play" && !confirmed && !window.confirm("Deseja sair da partida e voltar ao início? Seu progresso desta partida não será mantido.")) return;
    setPaused(false); setScreen("home");
  };
  const restartCurrentPhase = () => {
    if (!window.confirm("Reiniciar esta fase? As moedas já conquistadas serão mantidas.")) return;
    retryPhase();
  };
  useEffect(() => { setSoundOn(sound); }, [sound]);

  const P = PHASES[phase]!;
  const Q = P.questions[qi]!;

  // Hamster reacts to waiting
  useEffect(() => {
    if (screen !== "play" || confirmed || paused) return;
    setMood(qi % 3 === 2 ? "think" : "idle");
    setSpeech(qi === 0 ? "Vamos descobrir!" : qi % 3 === 2 ? "Hmm... essa é difícil!" : "Pense com cuidado!");
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => { setMood("point"); setSpeech("Leia a pergunta de novo 👀"); }, 15000);
    const t2 = setTimeout(() => { setMood("sign"); setSpeech("Precisa de uma dica?"); }, 30000);
    return () => { if (idleTimer.current) clearTimeout(idleTimer.current); clearTimeout(t2); };
  }, [screen, qi, phase, confirmed, paused]);

  const saveRecords = useCallback((finalScore: number, phasesDone: number, correct: number) => {
    const cur = loadRec();
    const next = { best: Math.max(cur.best, finalScore), phases: Math.max(cur.phases, phasesDone), bestCorrect: Math.max(cur.bestCorrect, correct) };
    localStorage.setItem(REC_KEY, JSON.stringify(next));
    setRecords(next);
  }, []);

  const resetQuestion = () => { setSelected(null); setConfirmed(false); setHintUsed(false); setTimeLeft(TIME_LIMIT); };

  // Countdown per question
  useEffect(() => {
    if (screen !== "play" || confirmed || paused || hintOpen) return;
    const t = setInterval(() => setTimeLeft((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, [screen, confirmed, paused, hintOpen, qi, phase]);
  useEffect(() => {
    if (screen !== "play" || confirmed || paused) return;
    if (timeLeft === 10) { setMood("scared"); setSpeech("Corre! O tempo está acabando! ⏳"); }
    if (timeLeft === 0) {
      setConfirmed(true);
      setLog((l) => [...l, { phase, q: qi, chosen: -1, correct: false, hint: hintUsed }]);
      setSelected(null);
      play("wrong");
      setLives((l) => l - 1);
      setMood("faint");
      setSpeech("O tempo acabou! ⌛");
    }
  }, [timeLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  const startGame = () => {
    play("click");
    const start = loadProgress();
    setPhase(start); setQi(0); setLives(LIVES); setScore(0); setPhaseStartScore(0); setHints(0); setLog([]); setBadges([]);
    setStartAt(Date.now()); resetQuestion(); setScreen("play");
  };

  const confirm = () => {
    if (selected === null || confirmed) return;
    setConfirmed(true);
    const ok = selected === Q.answer;
    setLog((l) => [...l, { phase, q: qi, chosen: selected, correct: ok, hint: hintUsed }]);
    if (ok) {
      play("correct");
      setScore((s) => s + 100 + (hintUsed ? 0 : 25));
      earnCoins(20);
      setMood((["happy", "spin", "cheer", "wave"] as Mood[])[Math.floor(Math.random() * 4)]!);
      setSpeech(hintUsed ? "Acertou! 🎉" : "Sem dica! +25 bônus! ✨");
    } else {
      play("wrong");
      setLives((l) => l - 1);
      setMood("sad");
      setSpeech(lives - 1 > 0 ? "Ah não! Quase lá..." : "Oh não... sem vidas!");
    }
  };

  const next = () => {
    play("click");
    if (lives <= 0) { saveRecords(score, badges.length, log.filter((l) => l.correct).length); setScreen("phaseFail"); setMood("sad"); return; }
    if (qi + 1 < P.questions.length) { setQi(qi + 1); resetQuestion(); return; }
    // phase complete
    const nb = [...badges, phase];
    setBadges(nb);
    if (phase === PHASES.length - 1) {
      play("win");
      setElapsed(Date.now() - startAt);
      saveRecords(score, PHASES.length, log.filter((l) => l.correct).length);
      localStorage.setItem(PROGRESS_KEY, "0"); setSavedPhase(0);
      setMood("dance"); setSpeech("Você conseguiu!"); setScreen("final");
    } else {
      play("phase");
      saveRecords(score, nb.length, log.filter((l) => l.correct).length);
      localStorage.setItem(PROGRESS_KEY, String(phase + 1)); setSavedPhase(phase + 1);
      setMood("cheer"); setSpeech("Você conseguiu!"); setScreen("phaseDone");
    }
  };

  const nextPhase = () => {
    play("portal");
    setPhase(phase + 1); setQi(0); setLives(LIVES); setPhaseStartScore(score); resetQuestion(); setScreen("play");
  };

  const retryPhase = () => {
    play("click");
    setLog((l) => l.filter((x) => x.phase !== phase));
    setScore(phaseStartScore); setQi(0); setLives(LIVES); resetQuestion(); setScreen("play");
  };

  const togglePause = () => {
    setPaused((p) => {
      const np = !p;
      setMood(np ? "sleep" : "idle");
      setSpeech(np ? "Zzz... (jogo pausado)" : "Voltei! Vamos lá!");
      return np;
    });
  };

  const onReward = useCallback(() => { setHintUsed(true); setHints((h) => h + 1); }, []);

  const activeScene = SCENES.find((x) => x.id === wallet.scene) ?? SCENES[0]!;
  const bg = screen === "home" || screen === "howto" || screen === "records" || screen === "shop" ? BGS[activeScene.bg] : BGS[activeScene.bg] || BGS[phase % BGS.length];
  const correctCount = log.filter((l) => l.correct).length;
  const fmt = (ms: number) => `${Math.floor(ms / 60000)}min ${Math.floor((ms % 60000) / 1000)}s`;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <img src={bg} alt="" aria-hidden style={{ filter: activeScene.filter }} className="absolute inset-0 h-full w-full object-cover transition-all duration-1000" width={1920} height={1088} />
      <div className="absolute inset-0 bg-gradient-to-b from-night/40 via-night/20 to-night/70" />
      <Fireflies />

      <div className="fixed left-3 top-3 z-30 flex items-center gap-2">
        <div className="rounded-full border border-gold/50 bg-night/80 px-3 py-2 text-sm font-extrabold text-gold shadow-lg" aria-label={`${wallet.coins} moedas mágicas`}>🪙 {wallet.coins}</div>
        {screen !== "home" && <button onClick={goHome} className="btn-ghost rounded-full px-3 py-2 text-sm" aria-label="Voltar ao início">🏠 Início</button>}
        {screen === "play" && <button onClick={restartCurrentPhase} className="btn-ghost rounded-full px-3 py-2 text-sm" aria-label="Reiniciar fase">🔄 Reiniciar</button>}
      </div>

      <button
        onClick={() => setSound(!sound)}
        className="btn-ghost absolute right-3 top-3 z-30 rounded-full px-3 py-2 text-sm"
        aria-label={sound ? "Desligar sons" : "Ligar sons"}
      >
        {sound ? "🔊" : "🔇"}
      </button>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-6">
        {screen === "home" && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="pop-in font-display text-sm font-bold uppercase tracking-[0.3em] text-cream">O Desafio dos Países</p>
            <h1 className="pop-in text-gold-gradient text-6xl font-extrabold leading-none sm:text-8xl">HAMSTER<br />EXPLORADOR</h1>
            <p className="mt-3 text-lg font-bold text-cream drop-shadow">{PHASES.length * 10} desafios. {PHASES.length} fases. Um mundo de mistérios!</p>
            <div className="my-4"><Hamster mood="wave" size="lg" speech={savedPhase > 0 ? `Vamos continuar da Fase ${savedPhase + 1}! 🗺️` : "Pronto para a aventura? 🗺️"} /></div>
            <div className="flex w-full max-w-xs flex-col gap-3">
              <button onClick={startGame} className="btn-gold rounded-2xl py-4 text-2xl">{savedPhase > 0 ? `Continuar · Fase ${savedPhase + 1}` : "Jogar agora"}</button>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { play("click"); setScreen("howto"); }} className="btn-ghost rounded-xl py-3">Como jogar</button>
                <button onClick={() => { play("click"); setScreen("records"); }} className="btn-ghost rounded-xl py-3">Recordes</button>
              </div>
              <button onClick={() => { play("click"); setScreen("shop"); }} className="btn-gold rounded-xl py-3">🛍️ Loja Mágica</button>
              <button onClick={() => setSound(!sound)} className="btn-ghost rounded-xl py-2 text-sm">Sons: {sound ? "ligado" : "desligado"}</button>
            </div>
          </div>
        )}

        {screen === "howto" && (
          <div className="panel pop-in my-auto rounded-3xl p-6">
            <h2 className="text-3xl font-extrabold text-gold">Como jogar</h2>
            <ul className="mt-4 space-y-3 text-sm sm:text-base">
              <li>🌳 <b>{PHASES.length} fases</b> com <b>10 perguntas</b> cada, sempre com 5 alternativas (A–E) e só uma correta.</li>
              <li>✅ Escolha uma alternativa e toque em <b>Confirmar</b>. Depois disso, não dá para mudar.</li>
              <li>⭐ Cada acerto vale <b>100 pontos</b>. Acertou sem dica? <b>+25 de bônus</b>!</li>
              <li>❤️ Você tem <b>3 vidas por fase</b>. Errar tira uma vida. Sem vidas, tente a fase de novo.</li>
              <li>💡 <b>Pedir uma dica</b>: assista a um anúncio curto (demonstrativo) para liberar uma dica. Não tira pontos nem vidas — só não dá o bônus naquela pergunta.</li>
              <li>🏅 Complete as fases para ganhar os emblemas: Explorador da Floresta, Guardião dos Mistérios e Mestre dos Países.</li>
            </ul>
            <button onClick={() => setScreen("home")} className="btn-gold mt-6 rounded-xl px-6 py-3">Voltar</button>
          </div>
        )}

        {screen === "shop" && (
          <div className="panel pop-in my-auto rounded-3xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="text-sm font-bold uppercase tracking-widest text-gold">Personalize sua aventura</p><h2 className="text-3xl font-extrabold text-gold">🛍️ Loja Mágica</h2></div>
              <div className="rounded-full bg-gold/20 px-4 py-2 font-extrabold text-gold">🪙 {wallet.coins} moedas</div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Ganhe 20 moedas a cada resposta correta e desbloqueie novos visuais. As compras ficam salvas neste dispositivo.</p>
            <h3 className="mt-6 text-xl font-extrabold">🐹 Skins do hamster</h3>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SKINS.map((item) => { const owned = wallet.ownedSkins.includes(item.id); const equipped = wallet.skin === item.id; return <div key={item.id} className="rounded-2xl border border-border bg-night/50 p-3 text-center"><div className="flex h-16 items-center justify-center text-4xl">{item.icon}</div><p className="mt-2 min-h-10 text-sm font-extrabold">{item.name}</p><p className="my-2 text-xs font-bold text-gold">{item.price === 0 ? "Grátis" : `🪙 ${item.price}`}</p><button onClick={() => buyOrEquip("skin", item.id, item.price)} disabled={equipped} className={`${equipped ? "btn-ghost" : "btn-gold"} w-full rounded-lg px-2 py-2 text-xs`}>{equipped ? "Equipado ✓" : owned ? "Equipar" : "Comprar"}</button></div>; })}
            </div>
            <h3 className="mt-7 text-xl font-extrabold">🌌 Cenários de fundo</h3>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SCENES.map((item) => { const owned = wallet.ownedScenes.includes(item.id); const equipped = wallet.scene === item.id; return <div key={item.id} className="rounded-2xl border border-border bg-night/50 p-3 text-center"><div className="flex h-16 items-center justify-center text-4xl">{item.icon}</div><p className="mt-2 min-h-10 text-sm font-extrabold">{item.name}</p><p className="my-2 text-xs font-bold text-gold">{item.price === 0 ? "Grátis" : `🪙 ${item.price}`}</p><button onClick={() => buyOrEquip("scene", item.id, item.price)} disabled={equipped} className={`${equipped ? "btn-ghost" : "btn-gold"} w-full rounded-lg px-2 py-2 text-xs`}>{equipped ? "Equipado ✓" : owned ? "Equipar" : "Comprar"}</button></div>; })}
            </div>
            <button onClick={() => setScreen("home")} className="btn-ghost mt-6 w-full rounded-xl py-3">⬅ Voltar ao início</button>
          </div>
        )}

        {screen === "records" && (
          <div className="panel pop-in my-auto rounded-3xl p-6 text-center">
            <h2 className="text-3xl font-extrabold text-gold">🏆 Recordes</h2>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Stat label="Maior pontuação" value={records.best} />
              <Stat label="Fases concluídas" value={`${records.phases}/3`} />
              <Stat label="Mais acertos" value={`${records.bestCorrect}/30`} />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Recordes salvos neste dispositivo.</p>
            <button onClick={() => setScreen("home")} className="btn-gold mt-5 rounded-xl px-6 py-3">Voltar</button>
          </div>
        )}

        {screen === "play" && (
          <>
            <header className="panel mb-4 rounded-2xl p-3 pr-14 sm:pr-16">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gold">Fase {P.id} · {P.subtitle}</p>
                  <h2 className="text-lg font-extrabold leading-tight sm:text-xl">{P.name}</h2>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold">
                  <span aria-label={`${lives} vidas`}>{Array.from({ length: LIVES }, (_, i) => <span key={i} className={i < lives ? "" : "opacity-25 grayscale"}>❤️</span>)}</span>
                  <span className="rounded-lg bg-gold/20 px-2 py-1 text-gold">⭐ {score}</span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <span className="whitespace-nowrap text-xs font-bold">Pergunta {qi + 1} de 10</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${((qi + (confirmed ? 1 : 0)) / 10) * 100}%`, background: "var(--gradient-gold)" }} />
                </div>
                <span className={`rounded-lg px-2 py-1 text-xs font-extrabold ${timeLeft <= 10 ? "animate-pulse bg-destructive/30 text-destructive" : "bg-gold/20 text-gold"}`} aria-label={`${timeLeft} segundos restantes`}>⏱ {timeLeft}s</span>
                <button onClick={togglePause} className="btn-ghost rounded-lg px-2 py-1 text-xs" aria-label="Pausar">{paused ? "▶" : "⏸"}</button>
              </div>
            </header>

            {paused ? (
              <div className="panel pop-in my-auto rounded-3xl p-8 text-center">
                <Hamster mood="sleep" size="lg" />
                <h2 className="mt-4 text-3xl font-extrabold">Jogo pausado</h2>
                <button onClick={togglePause} className="btn-gold mt-4 rounded-xl px-6 py-3">Continuar</button>
              </div>
            ) : (
              <section key={`${phase}-${qi}`} className="panel pop-in rounded-3xl p-5 sm:p-7">
                <h3 className="text-xl font-extrabold leading-snug sm:text-2xl">{Q.q}</h3>
                <div className="mt-5 flex flex-col gap-2.5">
                  {Q.options.map((opt, i) => {
                    const isSel = selected === i;
                    const isRight = confirmed && i === Q.answer;
                    const isWrong = confirmed && isSel && i !== Q.answer;
                    const state = isRight
                      ? "border-success bg-success/25 pop-in"
                      : isWrong
                        ? "border-destructive bg-destructive/25 shake"
                        : isSel
                          ? "border-gold bg-gold/15"
                          : "border-border bg-night/40 hover:border-gold/70 hover:bg-night/60";
                    return (
                      <button
                        key={i}
                        disabled={confirmed}
                        onClick={() => { play("click"); setSelected(i); }}
                        className={`flex items-center gap-3 rounded-2xl border-2 px-3 py-3 text-left font-bold transition-all ${state} ${confirmed && !isRight && !isWrong ? "opacity-60" : ""}`}
                      >
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display text-lg font-extrabold ${isRight ? "bg-success text-night" : isWrong ? "bg-destructive text-cream" : isSel ? "bg-gold text-primary-foreground" : "bg-muted text-gold"}`}>{LETTERS[i]}</span>
                        <span>{opt}</span>
                        {isRight && <span className="ml-auto">✅</span>}
                        {isWrong && <span className="ml-auto">❌</span>}
                      </button>
                    );
                  })}
                </div>

                {confirmed ? (
                  <div className="pop-in mt-5 rounded-2xl border border-border bg-night/50 p-4">
                    <p className={`font-display text-lg font-extrabold ${selected === Q.answer ? "text-success" : "text-destructive"}`}>
                      {selected === Q.answer ? `Correto! +${hintUsed ? 100 : 125}` : `${selected === null ? "Tempo esgotado! " : ""}Resposta correta: ${LETTERS[Q.answer]}) ${Q.options[Q.answer]}`}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{Q.explanation}</p>
                    <button onClick={next} className="btn-gold mt-4 w-full rounded-xl py-3 text-lg">
                      {lives <= 0 ? "Ver resultado" : qi === 9 ? "Concluir fase ✨" : "Próxima pergunta →"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button onClick={() => { play("click"); setHintOpen(true); }} disabled={hintUsed} className="btn-ghost rounded-xl px-4 py-3 disabled:opacity-50">
                      {hintUsed ? "💡 Dica usada" : "💡 Pedir uma dica"}
                    </button>
                    <button onClick={confirm} disabled={selected === null} className="btn-gold flex-1 rounded-xl py-3 text-lg disabled:opacity-50 disabled:hover:transform-none">Confirmar resposta</button>
                  </div>
                )}
              </section>
            )}
            <div className="h-36 sm:h-44" />
          </>
        )}

        {screen === "phaseDone" && (
          <div className="panel pop-in my-auto rounded-3xl p-6 text-center">
            <Confetti />
            <div className="text-6xl">{P.badgeIcon}</div>
            <h2 className="mt-2 text-3xl font-extrabold text-gold">Fase {P.id} concluída!</h2>
            <p className="mt-2 font-bold">{P.finale}</p>
            <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-gold/20 px-4 py-2 font-bold text-gold">{P.badgeIcon} Emblema: {P.badge}</div>
            <p className="mt-3 text-sm text-muted-foreground">Pontuação: {score}</p>
            <button onClick={nextPhase} className="btn-gold mt-5 rounded-xl px-6 py-3 text-lg">Seguir para {PHASES[phase + 1]?.name} →</button>
          </div>
        )}

        {screen === "phaseFail" && (
          <div className="panel pop-in my-auto rounded-3xl p-6 text-center">
            <Hamster mood="sad" size="lg" speech="Não desista, explorador!" />
            <h2 className="mt-2 text-3xl font-extrabold">Suas vidas acabaram</h2>
            <p className="mt-2 text-sm text-muted-foreground">As fases já vencidas continuam desbloqueadas. Tente a fase “{P.name}” novamente. Sua pontuação volta para {phaseStartScore}.</p>
            <div className="mt-5 flex justify-center gap-3">
              <button onClick={() => setScreen("home")} className="btn-ghost rounded-xl px-5 py-3">Início</button>
              <button onClick={retryPhase} className="btn-gold rounded-xl px-5 py-3">Tentar novamente</button>
            </div>
          </div>
        )}

        {screen === "final" && (
          <div className="my-auto text-center">
            <Confetti count={140} />
            <div className="relative mx-auto flex h-64 w-64 items-center justify-center">
              <div className="portal-ring absolute inset-0 rounded-full opacity-80 blur-md" />
              <div className="absolute inset-4 rounded-full bg-gold/30 blur-xl" />
              <Hamster mood="dance" />
            </div>
            <div className="panel pop-in mt-4 rounded-3xl p-6">
              <h2 className="text-gold-gradient text-4xl font-extrabold">Vitória!</h2>
              <p className="mt-2 font-bold">Parabéns, explorador! Você desvendou os segredos da floresta e provou que conhece o mundo!</p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Pontuação" value={score} />
                <Stat label="Acertos" value={`${correctCount}/30`} />
                <Stat label="Dicas" value={hints} />
                <Stat label="Tempo" value={fmt(elapsed)} />
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {PHASES.map((p, i) => (
                  <span key={p.id} className={`rounded-full px-3 py-1 text-sm font-bold ${badges.includes(i) ? "bg-gold/20 text-gold" : "bg-muted opacity-50"}`}>{p.badgeIcon} {p.badge}</span>
                ))}
              </div>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button onClick={() => setScreen("review")} className="btn-ghost rounded-xl px-5 py-3">Revisar minhas respostas</button>
                <button onClick={startGame} className="btn-gold rounded-xl px-5 py-3">Jogar novamente</button>
              </div>
            </div>
          </div>
        )}

        {screen === "review" && (
          <div className="panel pop-in rounded-3xl p-5">
            <h2 className="text-3xl font-extrabold text-gold">Suas respostas</h2>
            {PHASES.map((p, pi) => (
              <div key={p.id} className="mt-4">
                <h3 className="font-extrabold">{p.badgeIcon} {p.name}</h3>
                <ol className="mt-2 space-y-2">
                  {log.filter((l) => l.phase === pi).map((l) => {
                    const q = p.questions[l.q]!;
                    return (
                      <li key={l.q} className="rounded-xl bg-night/50 p-3 text-sm">
                        <p className="font-bold">{l.correct ? "✅" : "❌"} {q.q}</p>
                        {!l.correct && <p className="text-destructive">Sua resposta: {q.options[l.chosen]}</p>}
                        <p className="text-success">Correta: {q.options[q.answer]}{l.hint ? " · 💡 com dica" : ""}</p>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
            <button onClick={() => setScreen("final")} className="btn-gold mt-5 rounded-xl px-6 py-3">Voltar</button>
          </div>
        )}
      </main>

      {screen === "play" && !paused && (
        <div className="fixed bottom-2 right-2 z-20 sm:bottom-4 sm:right-4">
          <div className="relative"><div className="absolute -right-1 top-8 z-10 rounded-full border border-gold/50 bg-night/90 px-2 py-1 text-xl shadow-lg" title={SKINS.find((x) => x.id === wallet.skin)?.name}>{SKINS.find((x) => x.id === wallet.skin)?.icon ?? "🐹"}</div><Hamster mood={mood} speech={speech} /></div>
        </div>
      )}

      {hintOpen && <HintModal hint={Q.hint} onReward={onReward} onClose={() => setHintOpen(false)} />}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-night/50 p-3">
      <p className="font-display text-2xl font-extrabold text-gold">{value}</p>
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
