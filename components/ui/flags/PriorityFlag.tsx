// components/PriorityBadge.tsx

type Priority = "normal" | "medium" | "high";

const PRIORITY_STYLES: Record<
  Priority,
  { badge: string; label: string; activeColor: string; activeCount: number }
> = {
  normal: {
    badge: "bg-green-100 text-green-700 ring-green-300",
    label: "Normal",
    activeColor: "bg-green-500",
    activeCount: 1,
  },
  medium: {
    badge: "bg-yellow-100 text-yellow-700 ring-yellow-300",
    label: "Medium",
    activeColor: "bg-yellow-500",
    activeCount: 2,
  },
  high: {
    badge: "bg-red-100 text-red-700 ring-red-300",
    label: "High",
    activeColor: "bg-red-500",
    activeCount: 3,
  },
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  const styles = PRIORITY_STYLES[priority];

  return (
    <div className="flex items-center justify-between w-full gap-3">
      <span
        className={`text-xs font-semibold w-40 text-center px-3 py-1 rounded-full ring-1 ${styles.badge}`}
      >
        {styles.label}
      </span>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              level <= styles.activeCount
                ? styles.activeColor
                : "bg-gray-300 dark:bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
