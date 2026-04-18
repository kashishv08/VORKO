import { LucideIcon } from "lucide-react";
import { Card } from "../ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <Card
      className={`
        relative overflow-hidden
        bg-[var(--surface-glass)]
        border border-[var(--border)]
        rounded-2xl
        p-8
        text-center
        text-foreground
        shadow-[0_4px_20px_var(--shadow)]
        backdrop-blur-md
        transition-all
        duration-500
        hover:shadow-[0_8px_40px_var(--shadow)]
        hover:translate-y-[-4px]
        hover:border-[var(--highlight)]
      `}
    >
      {/* Animated gradient glow behind icon */}
      <div
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-all duration-700"
        style={{
          background:
            "radial-gradient(circle at center, var(--highlight) 0%, transparent 70%)",
        }}
      ></div>

      {/* Icon container */}
      <div
        className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl 
        bg-gradient-to-br from-[var(--primary)] to-[var(--highlight)]
        shadow-[0_4px_12px_rgba(46,163,111,0.25)]
        text-white
        transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
      >
        <Icon className="h-7 w-7" />
      </div>

      {/* Title */}
      <h3
        className="text-xl font-semibold mb-3 
        bg-gradient-to-r from-[var(--primary)] via-[var(--highlight)] to-[var(--secondary)]
        bg-clip-text text-transparent"
      >
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted leading-relaxed max-w-xs mx-auto">
        {description}
      </p>

      {/* Accent line at the bottom */}
      <div
        className="absolute bottom-0 left-0 w-full h-[2px] rounded-full opacity-70
        bg-gradient-to-r from-[var(--primary)] via-[var(--highlight)] to-[var(--secondary)]
        transition-opacity duration-700 group-hover:opacity-100"
      />
    </Card>
  );
}
