interface BadgeListProps {
  ecoPoints: number;
  treesCount: number;
  missionsCount: number;
}

const BADGES = [
  {
    id: "first-tree",
    label: "Primer árbol plantado",
    icon: "🌱",
    condition: (props: BadgeListProps) => props.treesCount >= 1,
  },
  {
    id: "eco-novato",
    label: "10 puntos ecológicos",
    icon: "🏅",
    condition: (props: BadgeListProps) => props.ecoPoints >= 10,
  },
  {
    id: "misiones-3",
    label: "3 misiones completadas",
    icon: "🎯",
    condition: (props: BadgeListProps) => props.missionsCount >= 3,
  },
  {
    id: "eco-experto",
    label: "50 puntos ecológicos",
    icon: "🥇",
    condition: (props: BadgeListProps) => props.ecoPoints >= 50,
  },
];

export default function BadgeList(props: BadgeListProps) {
  return (
    <div className="flex flex-wrap gap-4 mt-4 justify-center">
      {BADGES.filter(b => b.condition(props)).map(badge => (
        <div key={badge.id} className="flex flex-col items-center bg-green-50 rounded-xl px-4 py-2 shadow">
          <span className="text-3xl mb-1">{badge.icon}</span>
          <span className="text-green-800 text-sm font-semibold text-center">{badge.label}</span>
        </div>
      ))}
      {BADGES.filter(b => !b.condition(props)).length === BADGES.length && (
        <span className="text-gray-400 text-sm">¡Aún no has desbloqueado medallas!</span>
      )}
    </div>
  );
} 