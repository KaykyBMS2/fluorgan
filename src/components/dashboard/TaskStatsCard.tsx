
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface TaskStatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  iconBgClass: string;
  iconColor: string;
  className?: string;
  children?: ReactNode;
}

export function TaskStatsCard({
  title,
  value,
  icon,
  iconBgClass,
  iconColor,
  className,
  children
}: TaskStatsCardProps) {
  return (
    <Card className={`p-6 bg-card hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex items-center space-x-4">
        <div className={`p-3 ${iconBgClass} rounded-xl`}>
          <div className={`${iconColor}`}>{icon}</div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="space-y-2">
            <p className="text-2xl font-bold">{value}</p>
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
}
