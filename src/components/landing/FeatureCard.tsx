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
    p-6
    bg-[rgba(22,41,19,0.09)]           // Slightly darker, earthy green for light mode
    dark:bg-[rgba(121,85,72,0.13)]     // Very light, brownish shade for dark mode
    text-foreground
    shadow-md
    transition
    duration-200
    hover:shadow-2xl
    hover:scale-105
    hover:bg-[rgba(22,41,19,0.14)]
    dark:hover:bg-[rgba(121,85,72,0.20)]
    cursor-pointer
    border-0
  `}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className="p-3 rounded-lg mb-4 transition-colors"
          style={{ backgroundColor: "rgba(34, 197, 94, 0.18)" }}
        >
          <Icon className="h-6 w-6" style={{ color: "rgb(34, 197, 94)" }} />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}
