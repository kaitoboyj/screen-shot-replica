import { useState } from "react";
import { X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoostCard } from "@/components/BoostCard";
import { TokenSelector } from "@/components/TokenSelector";
import backgroundImage from "@/assets/background.png";

const Index = () => {
  const [boostsActive] = useState(500);
  const [boostsNeeded] = useState(0);

  const boostPacks = [
    { multiplier: "10x", duration: "12 hours", price: "$99" },
    { multiplier: "30x", duration: "12 hours", price: "$249" },
    { multiplier: "50x", duration: "12 hours", price: "$399" },
    { multiplier: "100x", duration: "24 hours", price: "$899" },
    { multiplier: "500x", duration: "24 hours", price: "$3,999" },
  ];

  const tokens = [
    { name: "TOKEN", symbol: "SOL", selected: false },
    { name: "BTC Bottom", symbol: "SOL", selected: true },
    { name: "TOKEN", symbol: "SOL", selected: false },
  ];

  return (
    <div 
      className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-6xl mx-auto relative">
        {/* Close Button */}
        <button className="absolute -top-4 -right-4 md:top-4 md:right-4 w-12 h-12 rounded-lg bg-card-dark border border-border hover:border-golden transition-colors flex items-center justify-center z-10">
          <X className="w-6 h-6 text-foreground" />
        </button>

        {/* Main Content */}
        <div className="py-12 px-4 md:px-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Give <span className="text-golden">BTC Bottom</span> a{" "}
              <span className="inline-flex items-center">
                <span className="text-golden text-5xl md:text-6xl lg:text-7xl">⚡</span>
                <span className="text-golden">Boost</span>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Showcase your support, boost{" "}
              <a 
                href="https://docs.dexscreener.com/trending" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline decoration-golden hover:text-golden transition-colors cursor-pointer"
              >
                Trending Score
              </a> and
              unlock the <span className="text-golden font-semibold">Golden Ticker</span>!
            </p>
            <Button
              asChild
              className="mt-4 rounded-full px-6 py-5 text-base bg-white text-black hover:bg-white/90"
            >
              <a 
                href="https://docs.dexscreener.com/boosting" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                How does it work?
              </a>
            </Button>
          </div>

          {/* Divider */}
          <div className="border-t border-border my-8" />

          {/* Boost Packs */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center">
              Choose a boost pack:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {boostPacks.map((pack, index) => (
                <BoostCard
                  key={index}
                  multiplier={pack.multiplier}
                  duration={pack.duration}
                  price={pack.price}
                />
              ))}
            </div>
          </div>

          {/* Golden Ticker Section */}
          <div className="space-y-6 mt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center">
              <span className="text-golden">Golden Ticker</span> unlocks at{" "}
              <span className="text-golden">500 boosts</span>
            </h2>
            <TokenSelector tokens={tokens} />
          </div>

          {/* Boosts Counter */}
          <div className="text-center text-lg text-muted-foreground pt-6">
            Boosts active: <span className="text-foreground font-semibold">{boostsActive}</span>{" "}
            Boosts needed: <span className="text-foreground font-semibold">{boostsNeeded}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
