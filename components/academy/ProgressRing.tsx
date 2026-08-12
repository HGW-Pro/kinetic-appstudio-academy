type ProgressRingProps = {
  value: number;
  label?: string;
  size?: number;
};

export default function ProgressRing({ value, label = "Progress", size = 76 }: ProgressRingProps) {
  const percentage = Math.max(0, Math.min(100, Math.round(value)));
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative shrink-0"
      style={{ height: size, width: size }}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentage}
    >
      <svg aria-hidden="true" className="-rotate-90" height={size} width={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="var(--surface-3)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="var(--primary)"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={stroke}
          style={{ transition: "stroke-dashoffset 500ms ease" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[var(--text-hi)]">
        {percentage}%
      </span>
    </div>
  );
}
