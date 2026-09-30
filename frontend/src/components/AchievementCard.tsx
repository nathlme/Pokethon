import {type Achievement } from "../types/Achievement";

const images = import.meta.glob<string>("../assets/badges/*.png", {
  eager: true,
  import: "default",
});

function slug(code: string) {
  return code
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function imageFor(code: string): string | undefined {
  return (
    images[`../assets/badges/${slug(code)}.png`] ??
    images["../assets/badges/default.png"]
  );
}

interface Props {
  achievement: Achievement;
  unlockedAt?: string | undefined; // défini seulement si le badge est débloqué
}

function AchievementCard({ achievement, unlockedAt }: Props) {
  const isUnlocked = Boolean(unlockedAt);
  const src = imageFor(achievement.code);

  return (
    <div
      className={`card flex flex-col items-center gap-1 text-center ${
        isUnlocked ? "" : "opacity-40 grayscale"
      }`}
    >
      {src && (
        <img
          src={src}
          alt={achievement.label}
          className="h-16 w-16 object-contain"
        />
      )}
      <span className="font-semibold">{achievement.label}</span>
      <p className="text-sm text-black/60 dark:text-white/60">
        {achievement.description}
      </p>
      {isUnlocked ? (
        <span className="text-xs text-black/50 dark:text-white/50">
          Débloqué le {new Date(unlockedAt!).toLocaleDateString("fr-FR")}
        </span>
      ) : (
        <span className="text-xs">Verrouillé</span>
      )}
    </div>
  );
}

export default AchievementCard;