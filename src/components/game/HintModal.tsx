import { useEffect, useRef, useState } from "react";
import { Hamster } from "./Hamster";

const AD_SECONDS = 15;
const SCENES = [
  { t: "Sua pele merece um ritual.", s: "Sérum • Hidratante • Protetor" },
  { t: "Leveza que se sente.", s: "Texturas suaves para o dia a dia" },
  { t: "Principia", s: "Conheça sua rotina de cuidados com a pele" },
];

type Stage = "intro" | "ad" | "aborted" | "hint";

export function HintModal({ hint, onReward, onClose }: { hint: string; onReward: () => void; onClose: () => void }) {
  const [stage, setStage] = useState<Stage>("intro");
  const [left, setLeft] = useState(AD_SECONDS);
  const rewarded = useRef(false);

  useEffect(() => {
    if (stage !== "ad") return;
    setLeft(AD_SECONDS);
    const id = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          clearInterval(id);
          if (!rewarded.current) {
            rewarded.current = true; // count reward only once per request
            onReward();
          }
          setStage("hint");
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [stage, onReward]);

  const scene = SCENES[Math.min(SCENES.length - 1, Math.floor(((AD_SECONDS - left) / AD_SECONDS) * SCENES.length))];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-night/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="panel pop-in w-full max-w-lg rounded-3xl p-6">
        {stage === "intro" && (
          <div className="flex flex-col items-center text-center">
            <Hamster mood="sign" />
            <h3 className="mt-2 text-2xl font-extrabold text-gold">Uma ajudinha mágica está a caminho!</h3>
            <p className="mt-2 text-sm text-muted-foreground">Assista a um anúncio curto ({AD_SECONDS}s) para liberar uma dica. Você não perde pontos nem vidas — só não recebe o bônus de +25 nesta pergunta.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={onClose} className="btn-ghost rounded-xl px-5 py-3">Agora não</button>
              <button onClick={() => setStage("ad")} className="btn-gold rounded-xl px-5 py-3">▶ Assistir anúncio</button>
            </div>
          </div>
        )}

        {stage === "ad" && (
          <div>
            <div className="mb-2 flex items-center justify-between text-xs font-bold">
              <span className="rounded bg-gold px-2 py-0.5 text-primary-foreground">PUBLICIDADE · DEMONSTRATIVO</span>
              <span className="text-muted-foreground">Recompensa em {left}s</span>
            </div>
            <div className="ad-stage relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-2xl">
              <div className="absolute bottom-6 flex items-end gap-3">
                <div className="ad-bottle relative h-24 w-10 rounded-xl"><div className="ad-cap absolute -top-3 left-2 h-4 w-6 rounded" /></div>
                <div className="ad-bottle relative h-32 w-14 rounded-2xl"><div className="ad-cap absolute -top-4 left-3 h-5 w-8 rounded" /></div>
                <div className="ad-bottle h-16 w-20 rounded-full" />
              </div>
              <div key={scene.t} className="ad-fade -mt-16 text-center">
                <p className="font-display text-2xl font-extrabold tracking-wide">{scene.t}</p>
                <p className="text-sm opacity-80">{scene.s}</p>
              </div>
              <div className="absolute bottom-0 left-0 h-1 bg-gold-deep transition-all" style={{ width: `${((AD_SECONDS - left) / AD_SECONDS) * 100}%` }} />
            </div>
            <p className="mt-2 text-[11px] leading-tight text-muted-foreground">Anúncio demonstrativo criado para este jogo, inspirado em comerciais de skincare. Não é um criativo oficial, não há parceria com a marca e nenhuma recompensa financeira é gerada.</p>
            <button onClick={() => setStage("aborted")} className="btn-ghost mt-3 w-full rounded-xl py-2 text-sm">Fechar anúncio</button>
          </div>
        )}

        {stage === "aborted" && (
          <div className="text-center">
            <Hamster mood="sad" />
            <h3 className="mt-2 text-xl font-extrabold">O anúncio não foi concluído</h3>
            <p className="mt-1 text-sm text-muted-foreground">A dica só é liberada ao final do anúncio. Tudo bem — você não perdeu nada!</p>
            <div className="mt-4 flex justify-center gap-3">
              <button onClick={onClose} className="btn-ghost rounded-xl px-5 py-3">Continuar sem dica</button>
              <button onClick={() => setStage("ad")} className="btn-gold rounded-xl px-5 py-3">Tentar novamente</button>
            </div>
          </div>
        )}

        {stage === "hint" && (
          <div className="flex flex-col items-center text-center">
            <Hamster mood="happy" />
            <p className="mt-2 text-sm font-bold uppercase tracking-widest text-gold">💡 Sua dica</p>
            <p className="mt-2 text-lg font-bold">{hint}</p>
            <button onClick={onClose} className="btn-gold mt-5 rounded-xl px-6 py-3">Voltar à pergunta</button>
          </div>
        )}
      </div>
    </div>
  );
}
