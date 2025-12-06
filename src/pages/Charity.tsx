import { useNavigate, useLocation } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import background from "@/assets/background.png";

const Charity = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { networkId, networkName, symbol, networkLogo } = location.state || {};

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="bg-zinc-900/90 backdrop-blur-sm border border-border rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
            <h1 className="text-2xl font-bold text-white">Charity Donation</h1>
            {networkLogo && (
              <div className="w-8 h-8 rounded-full overflow-hidden ml-auto">
                <img src={networkLogo} alt={networkName} className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="bg-pink-600/20 border border-pink-500 rounded-lg p-4">
            <p className="text-pink-100 text-sm">
              Support charitable causes through cryptocurrency donations. Your contribution makes a difference.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">How It Works</h2>
            <ul className="space-y-3 text-zinc-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-pink-500 font-bold">1.</span>
                Choose your preferred donation amount
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 font-bold">2.</span>
                Connect your wallet to proceed
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 font-bold">3.</span>
                Confirm the transaction in your wallet
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 font-bold">4.</span>
                Your donation goes directly to the charity
              </li>
            </ul>
          </div>

          {networkName && (
            <div className="bg-zinc-800 rounded-lg p-3 text-center">
              <p className="text-zinc-400 text-sm">Donating on</p>
              <p className="text-white font-medium">{networkName} Network</p>
            </div>
          )}

          <Button
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6 text-lg font-bold"
            onClick={() => {
              // Future: implement wallet connection for donation
            }}
          >
            <Heart className="w-5 h-5 mr-2" />
            Connect Wallet to Donate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Charity;
