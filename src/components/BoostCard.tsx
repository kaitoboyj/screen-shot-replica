import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface BoostCardProps {
  multiplier: string;
  duration: string;
  price: string;
  onClick?: () => void;
}

export const BoostCard = ({ multiplier, duration, price, onClick }: BoostCardProps) => {
  return (
    <Card
      className="bg-card-dark border-border hover:border-golden/50 transition-all cursor-pointer p-6 flex flex-col items-center gap-3 group"
      onClick={onClick}
    >
      <div className="text-golden text-6xl font-bold group-hover:scale-110 transition-transform">
        ⚡
      </div>
      <div className="text-4xl font-bold text-foreground">
        {multiplier}
      </div>
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Clock className="w-4 h-4" />
        <span>{duration}</span>
      </div>
      <div className="text-2xl font-bold text-foreground mt-2">
        {price}
      </div>
    </Card>
  );
};
