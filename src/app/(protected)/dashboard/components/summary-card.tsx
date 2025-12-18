import { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  descriptionColor?: "green" | "red" | "orange" | "blue" | "default";
}

const descriptionColorClasses = {
  green: "text-emerald-500",
  red: "text-red-500",
  orange: "text-orange-500",
  blue: "text-blue-500",
  default: "text-muted-foreground",
};

export function SummaryCard({
  title,
  value,
  icon: Icon,
  description,
  descriptionColor = "default",
}: SummaryCardProps) {
  return (
    <Card className="gap-4 py-5">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-2xl font-bold">{value}</p>
        {description && (
          <p
            className={cn("text-sm", descriptionColorClasses[descriptionColor])}
          >
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
