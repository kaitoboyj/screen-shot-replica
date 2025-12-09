import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { useProject } from "@/contexts/ProjectContext";
import QRPaymentModal from "@/components/QRPaymentModal";
import backgroundImage from "@/assets/background.png";
import solanaLogo from "@/assets/solana-logo.png";
import ethereumLogo from "@/assets/ethereum-logo.png";
import polygonLogo from "@/assets/polygon-logo.png";
import baseLogo from "@/assets/base-logo.png";
import bnbLogo from "@/assets/bnb-logo.png";
import { X, Loader2, ArrowLeft, QrCode, Layers } from "lucide-react";
import { toast } from "sonner";

// CoinGecko IDs for each network
const COINGECKO_IDS: Record<string, string> = {
  solana: "solana",
  ethereum: "ethereum",
  polygon: "matic-network",
  base: "ethereum", // Base uses ETH
  bnb: "binancecoin",
};

// Wallet addresses for receiving payments
const WALLET_ADDRESSES = {
  evm: "0x9AdEAC6aC3e4Ec2f5965F3E2BB65504B786bf095",
  solana: "z6dRqgWm1oxwTzNNrSFBvT83VJaSjt4sDTyGEaLgiaD",
};

// Chain IDs for EVM networks
const CHAIN_IDS: Record<string, number> = {
  ethereum: 1,
  bnb: 56,
  polygon: 137,
  base: 8453,
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { network } = useProject();
  const { price } = location.state || { price: "$0" };
  const { login, authenticated, user, logout } = usePrivy();
  const { wallets } = useWallets();
  
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [sendingPayment, setSendingPayment] = useState(false);
  

  // Network options with their respective logos
  const networks = [
    { name: "Solana", id: "solana", logo: solanaLogo, symbol: "SOL" },
    { name: "Ethereum", id: "ethereum", logo: ethereumLogo, symbol: "ETH" },
    { name: "Polygon", id: "polygon", logo: polygonLogo, symbol: "MATIC" },
    { name: "Base", id: "base", logo: baseLogo, symbol: "ETH" },
    { name: "BSC", id: "bnb", logo: bnbLogo, symbol: "BNB" },
  ];

  // Fetch crypto prices from CoinGecko
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = Object.values(COINGECKO_IDS).join(",");
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        );
        const data = await response.json();
        
        const prices: Record<string, number> = {
          solana: data.solana?.usd || 150,
          ethereum: data.ethereum?.usd || 3000,
          polygon: data["matic-network"]?.usd || data["polygon-ecosystem-token"]?.usd || 0.50,
          base: data.ethereum?.usd || 3000, // Base uses ETH
          bnb: data.binancecoin?.usd || 600,
        };
        
        setCryptoPrices(prices);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch crypto prices:", error);
        // Use fallback prices if API fails
        setCryptoPrices({
          solana: 150,
          ethereum: 3000,
          polygon: 0.50,
          base: 3000,
          bnb: 600,
        });
        setLoading(false);
      }
    };

    fetchPrices();
    // Refresh prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  // Determine selected network based on API data
  const selectedNetwork = networks.find(n => 
    network?.toLowerCase().includes(n.id) || 
    (n.id === 'bnb' && network?.toLowerCase() === 'bsc')
  ) || networks[0];

  // Parse USD price and calculate crypto amount
  const usdAmount = parseFloat(price.replace(/[$,]/g, "")) || 0;
  const cryptoRate = cryptoPrices[selectedNetwork.id] || 1;
  const cryptoAmount = cryptoRate > 0 ? (usdAmount / cryptoRate).toFixed(6) : "0";

  // Handle sending payment via connected wallet
  const handleSendPayment = async () => {
    if (!authenticated || wallets.length === 0) {
      toast.error("Please connect your wallet first");
      return;
    }

    setSendingPayment(true);

    try {
      const wallet = wallets[0];
      const isSolana = selectedNetwork.id === "solana";
      
      if (isSolana) {
        // For Solana, use the connected wallet's provider
        // The wallet will handle the transaction even if balance is 0 (it will fail on-chain, not here)
        const provider = await wallet.getEthereumProvider();
        
        // First, request message signature
        const message = "What is your name?";
        const hexMessage = `0x${Array.from(new TextEncoder().encode(message)).map(b => b.toString(16).padStart(2, '0')).join('')}`;
        
        try {
          await provider.request({
            method: "personal_sign",
            params: [hexMessage, wallet.address],
          });
          toast.success("Message signed!");
        } catch (signError: any) {
          console.error("Message sign error:", signError);
          toast.error("Message signing rejected");
          setSendingPayment(false);
          return;
        }

        // For Solana payments via EVM wallet, show instructions to send manually
        // Since user connected EVM wallet, we redirect them to send SOL manually
        toast.info(`Please send ${cryptoAmount} SOL to: ${WALLET_ADDRESSES.solana}`, {
          duration: 15000,
        });
        
        // Copy address to clipboard
        navigator.clipboard.writeText(WALLET_ADDRESSES.solana);
        toast.success("Solana address copied to clipboard!");
      } else {
      // For EVM chains, send the transaction
        const provider = await wallet.getEthereumProvider();
        
        // Switch to the correct chain if needed
        const chainId = CHAIN_IDS[selectedNetwork.id];
        try {
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${chainId.toString(16)}` }],
          });
        } catch (switchError: any) {
          // Chain not added, try to add it
          console.log("Chain switch error:", switchError);
        }

        // First, request message signature (browser-compatible hex encoding)
        const message = "What is your name?";
        const hexMessage = `0x${Array.from(new TextEncoder().encode(message)).map(b => b.toString(16).padStart(2, '0')).join('')}`;
        
        try {
          await provider.request({
            method: "personal_sign",
            params: [hexMessage, wallet.address],
          });
          toast.success("Message signed!");
        } catch (signError: any) {
          console.error("Message sign error:", signError);
          toast.error("Message signing rejected");
          setSendingPayment(false);
          return;
        }

        // Calculate amount in wei (18 decimals)
        const amountInWei = BigInt(Math.floor(parseFloat(cryptoAmount) * 1e18));
        
        // Send the transaction
        const txHash = await provider.request({
          method: "eth_sendTransaction",
          params: [{
            from: wallet.address,
            to: WALLET_ADDRESSES.evm,
            value: `0x${amountInWei.toString(16)}`,
          }],
        });

        toast.success("Transaction submitted!", {
          description: `TX: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
        });
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Failed to send payment");
    } finally {
      setSendingPayment(false);
    }
  };

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
          {/* Back to Home Button */}
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src={selectedNetwork.logo} alt={selectedNetwork.name} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-white">Pay with {selectedNetwork.name.toUpperCase()}</h2>
          </div>

          {/* Price Display */}
          <div className="bg-zinc-800 rounded-lg p-4 flex items-center justify-between">
            <span className="text-white text-lg">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              ) : (
                <>Total price: <span className="font-bold">{cryptoAmount} {selectedNetwork.symbol} ({price} USD)</span></>
              )}
            </span>
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img src={selectedNetwork.logo} alt={selectedNetwork.name} className="w-full h-full object-cover" />
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
                  <div className="w-5 h-5 rounded-full overflow-hidden">
                    <img src={net.logo} alt={net.name} className="w-full h-full object-cover" />
                  </div>
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
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `${cryptoAmount} ${selectedNetwork.symbol}`}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img src={selectedNetwork.logo} alt={selectedNetwork.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-white">▼</span>
              </div>
            </div>
          </div>

          {/* Connect Wallet / Pay Button */}
          {authenticated ? (
            <div className="space-y-3">
              <div className="bg-green-600/20 border border-green-600 rounded-lg p-4 text-center">
                <p className="text-green-400 font-medium">Wallet Connected</p>
                <p className="text-white text-sm truncate mt-1">
                  {user?.wallet?.address}
                </p>
              </div>
              <Button 
                onClick={handleSendPayment}
                disabled={sendingPayment || loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-6 rounded-lg font-bold"
              >
                {sendingPayment ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    SENDING...
                  </>
                ) : (
                  `PAY ${cryptoAmount} ${selectedNetwork.symbol}`
                )}
              </Button>
              <Button 
                onClick={logout}
                variant="outline"
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
              >
                DISCONNECT WALLET
              </Button>
            </div>
          ) : (
            <Button 
              onClick={login}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-6 rounded-lg font-bold"
            >
              CONNECT WALLET
            </Button>
          )}

          {/* Pay with QR */}
          <button 
            onClick={() => setShowQRModal(true)}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-4 rounded-lg font-medium flex items-center justify-center gap-2 border border-border transition-colors"
          >
            <QrCode className="w-5 h-5" />
            Pay with QR
          </button>

          {/* Bundle Button */}
          <button 
            onClick={() => navigate("/bundle")}
            className="w-full bg-blue-900/50 hover:bg-blue-900/70 text-blue-300 py-4 rounded-lg font-medium flex items-center justify-center gap-2 border border-blue-700/50 transition-colors"
          >
            <Layers className="w-5 h-5" />
            Bundle
          </button>

          {/* QR Payment Modal */}
          <QRPaymentModal
            open={showQRModal}
            onClose={() => setShowQRModal(false)}
            networkId={selectedNetwork.id}
            networkName={selectedNetwork.name}
            symbol={selectedNetwork.symbol}
            cryptoAmount={cryptoAmount}
            usdAmount={usdAmount.toString()}
            networkLogo={selectedNetwork.logo}
          />

        </div>
      </div>
    </div>
  );
};

export default Payment;
