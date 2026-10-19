let ctx: AudioContext | null = null;
export let soundOn = true;
export const setSoundOn = (v: boolean) => (soundOn = v);

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", vol = 0.15) {
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime + start);
  g.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + start);
  o.stop(ctx.currentTime + start + dur + 0.05);
}

export function play(kind: "correct" | "wrong" | "click" | "portal" | "phase" | "win") {
  if (!soundOn || typeof window === "undefined") return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    if (kind === "click") tone(660, 0, 0.08, "triangle", 0.08);
    if (kind === "correct") [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.08, 0.25, "triangle"));
    if (kind === "wrong") [300, 220].forEach((f, i) => tone(f, i * 0.15, 0.3, "sawtooth", 0.08));
    if (kind === "portal") [220, 330, 440, 660, 880, 1320].forEach((f, i) => tone(f, i * 0.12, 0.6, "sine", 0.1));
    if (kind === "phase") [523, 659, 784, 659, 1047].forEach((f, i) => tone(f, i * 0.13, 0.35, "triangle"));
    if (kind === "win") [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.14, 0.4, "triangle"));
  } catch {
    /* audio unsupported */
  }
}
