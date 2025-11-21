import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProject } from "@/contexts/ProjectContext";
import backgroundImage from "@/assets/background.png";
import { X } from "lucide-react";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { network } = useProject();
  const { price } = location.state || { price: "$0" };

  // Network options with their respective icons
  const networks = [
    { name: "Solana", id: "solana", icon: "◎" },
    { name: "Ethereum", id: "ethereum", icon: "Ξ" },
    { name: "Polygon", id: "polygon", icon: "⬡" },
    { name: "Base", id: "base", icon: "⬢" },
  ];

  // Determine selected network based on API data
  const selectedNetwork = networks.find(n => 
    network?.toLowerCase().includes(n.id)
  ) || networks[0];

  // Convert price to crypto (mock conversion)
  const cryptoPrice = price === "$3,999" ? "31.6426" : 
                     price === "$899" ? "7.19" :
                     price === "$399" ? "3.19" :
                     price === "$249" ? "1.99" : "0.79";

  return (
    <div 
      className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-2xl mx-auto relative">
        {/* Close Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute -top-4 -right-4 md:top-4 md:right-4 w-12 h-12 rounded-lg bg-card-dark border border-border hover:border-golden transition-colors flex items-center justify-center z-10"
        >
          <X className="w-6 h-6 text-foreground" />
        </button>

        {/* Payment Card */}
        <div className="bg-black/90 rounded-2xl p-8 border border-border space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-white text-xl">{selectedNetwork.icon}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Pay with {selectedNetwork.name.toUpperCase()}</h2>
          </div>

          {/* Price Display */}
          <div className="bg-zinc-800 rounded-lg p-4 flex items-center justify-between">
            <span className="text-white text-lg">
              Total price: <span className="font-bold">{cryptoPrice} {selectedNetwork.name.toUpperCase()} ({price} USDC)</span>
            </span>
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-white text-sm">{selectedNetwork.icon}</span>
            </div>
          </div>

          {/* Network Selection */}
          <div className="space-y-3">
            <label className="text-white text-sm font-medium">Network</label>
            <div className="flex gap-3 flex-wrap">
              {networks.map((net) => (
                <button
                  key={net.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    selectedNetwork.id === net.id
                      ? "bg-purple-600/20 border-purple-600 text-white"
                      : "bg-transparent border-border text-muted-foreground hover:border-purple-600/50"
                  }`}
                >
                  <span className="text-lg">{net.icon}</span>
                  <span className="font-medium">{net.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pay with Selection */}
          <div className="space-y-3">
            <label className="text-white text-sm font-medium">Pay with</label>
            <div className="bg-zinc-800 rounded-lg p-4 flex items-center justify-between border border-border">
              <span className="text-white font-medium">
                {cryptoPrice} {selectedNetwork.name.toUpperCase()} ({selectedNetwork.name})
              </span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                  <span className="text-white text-xs">{selectedNetwork.icon}</span>
                </div>
                <span className="text-white">▼</span>
              </div>
            </div>
          </div>

          {/* Connect Wallet Button */}
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-6 rounded-lg font-bold">
            CONNECT WALLET
          </Button>

          {/* Pay with QR */}
          <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-4 rounded-lg font-medium flex items-center justify-center gap-2 border border-border transition-colors">
            <span className="text-xl">⊞</span>
            Pay with QR
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
