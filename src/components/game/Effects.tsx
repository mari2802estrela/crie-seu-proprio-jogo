import { useEffect, useState } from "react";

export function Fireflies({ count = 22 }: { count?: number }) {
  const [dots, setDots] = useState<{ l: number; s: number; d: number; delay: number }[]>([]);
  useEffect(() => {
    setDots(Array.from({ length: count }, () => ({ l: Math.random() * 100, s: 2 + Math.random() * 4, d: 10 + Math.random() * 14, delay: -Math.random() * 20 })));
  }, [count]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((f, i) => (
        <span key={i} className="firefly" style={{ left: `${f.l}%`, bottom: "-10px", width: f.s, height: f.s, animationDuration: `${f.d}s`, animationDelay: `${f.delay}s` }} />
      ))}
    </div>
  );
}

const COLORS = ["var(--gold)", "var(--mystic)", "var(--success)", "var(--cream)", "var(--emerald)"];
export function Confetti({ count = 80 }: { count?: number }) {
  const [bits, setBits] = useState<{ l: number; d: number; delay: number; c: string; r: boolean }[]>([]);
  useEffect(() => {
    setBits(Array.from({ length: count }, () => ({ l: Math.random() * 100, d: 2.5 + Math.random() * 3, delay: Math.random() * 1.5, c: COLORS[Math.floor(Math.random() * COLORS.length)]!, r: Math.random() > 0.5 })));
  }, [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {bits.map((b, i) => (
        <span key={i} className="confetti" style={{ left: `${b.l}%`, background: b.c, borderRadius: b.r ? "50% 0" : "2px", animationDuration: `${b.d}s`, animationDelay: `${b.delay}s` }} />
      ))}
    </div>
  );
}
