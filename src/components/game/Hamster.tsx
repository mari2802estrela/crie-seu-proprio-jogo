import hamsterImg from "@/assets/hamster.png";

export type Mood = "idle" | "happy" | "sad" | "think" | "point" | "dance" | "sleep" | "sign" | "wave" | "spin" | "cheer" | "scared" | "faint";

export function Hamster({ mood, speech, size = "sm" }: { mood: Mood; speech?: string | undefined; size?: "sm" | "lg" }) {
  const dim = size === "lg" ? "w-56 sm:w-72" : "w-24 sm:w-36";
  const cls = mood === "sign" ? "h-think" : `h-${mood}`;
  return (
    <div className="relative flex flex-col items-center select-none pointer-events-none">
      {speech && (
        <div key={speech} className="pop-in mb-1 max-w-[180px] rounded-2xl bg-cream px-3 py-2 text-center text-xs font-extrabold text-night shadow-lg sm:text-sm">
          {speech}
        </div>
      )}
      <div className="relative">
        <img key={mood} src={hamsterImg} alt="Hamster Explorador" width={1024} height={1024} className={`${dim} ${cls} drop-shadow-2xl`} />
        {mood === "sign" && (
          <div className="absolute -left-4 top-1/3 rounded-lg border-4 border-gold-deep bg-cream px-2 font-display text-2xl font-extrabold text-gold-deep">?</div>
        )}
        {mood === "cheer" && <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce text-3xl">🎉</div>}
        {mood === "scared" && <div className="absolute -right-2 top-2 animate-pulse text-2xl">💦</div>}
        {mood === "faint" && <div className="absolute right-2 top-0 animate-spin text-2xl">💫</div>}
        {mood === "wave" && <div className="absolute -right-2 top-1/4 origin-bottom text-3xl h-wave-hand">👋</div>}
        {mood === "sleep" && <div className="absolute right-0 top-0 animate-pulse font-display text-2xl font-extrabold text-cream">Zzz</div>}
        {mood === "sleep" && <div className="absolute -bottom-2 left-1/2 h-6 w-3/4 -translate-x-1/2 rounded-[50%] bg-emerald" />}
      </div>
    </div>
  );
}
