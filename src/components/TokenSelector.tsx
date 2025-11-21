import { Card } from "@/components/ui/card";

interface TokenSelectorProps {
  tokens: Array<{
    name: string;
    symbol: string;
    selected: boolean;
  }>;
}

export const TokenSelector = ({ tokens }: TokenSelectorProps) => {
  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {tokens.map((token, index) => (
        <Card
          key={index}
          className={`p-4 border-border transition-all ${
            token.selected
              ? "bg-card-dark border-golden"
              : "bg-card/50 opacity-30"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-golden flex items-center justify-center text-black font-bold">
              {token.selected ? "◉" : "○"}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-golden font-bold text-lg">{token.name}</span>
              <span className="text-muted-foreground">/ {token.symbol}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
