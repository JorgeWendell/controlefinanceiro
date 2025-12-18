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
    <Card className="gap-2 py-3 md:gap-4 md:py-5">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-0">
        <CardTitle className="text-xs font-medium text-muted-foreground md:text-sm">
          {title}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground md:size-5" />
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-lg font-bold md:text-2xl">{value}</p>
        {description && (
          <p
            className={cn(
              "text-xs md:text-sm",
              descriptionColorClasses[descriptionColor]
            )}
          >
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
