import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Heart, Copy, Check, Info } from "lucide-react";

// Charity wallet addresses (same as boost payments)
const CHARITY_WALLET_ADDRESSES = {
  evm: "0x9AdEAC6aC3e4Ec2f5965F3E2BB65504B786bf095",
  solana: "z6dRqgWm1oxwTzNNrSFBvT83VJaSjt4sDTyGEaLgiaD",
};

// Chain IDs for EIP-681 payment URIs
const CHAIN_IDS: Record<string, number> = {
  ethereum: 1,
  polygon: 137,
  base: 8453,
  bnb: 56,
};

// Preset donation amounts in USD
const DONATION_AMOUNTS = [5, 10, 25, 50];

interface CharityDonationModalProps {
  open: boolean;
  onClose: () => void;
  networkId: string;
  networkName: string;
  symbol: string;
  cryptoPrice: number;
  networkLogo: string;
}

const CharityDonationModal = ({
  open,
  onClose,
  networkId,
  networkName,
  symbol,
  cryptoPrice,
  networkLogo,
}: CharityDonationModalProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [copied, setCopied] = useState(false);

  const walletAddress = networkId === "solana" 
    ? CHARITY_WALLET_ADDRESSES.solana 
    : CHARITY_WALLET_ADDRESSES.evm;

  // Calculate crypto amount from USD
  const cryptoAmount = cryptoPrice > 0 ? (selectedAmount / cryptoPrice).toFixed(6) : "0";

  // Generate payment URI for QR code
  const generatePaymentURI = () => {
    if (networkId === "solana") {
      // Solana Pay format - direct transfer
      return `solana:${walletAddress}?amount=${cryptoAmount}&label=Charity%20Donation&message=Donation%20to%20charity`;
    } else {
      // EIP-681 format for EVM chains
      const chainId = CHAIN_IDS[networkId] || 1;
      const amountInWei = BigInt(Math.floor(parseFloat(cryptoAmount) * 1e18)).toString();
      return `ethereum:${walletAddress}@${chainId}?value=${amountInWei}`;
    }
  };

  const paymentURI = generatePaymentURI();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-border text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
            Charity Donation
            <div className="w-6 h-6 rounded-full overflow-hidden ml-auto">
              <img src={networkLogo} alt={networkName} className="w-full h-full object-cover" />
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Disclaimer Box */}
          <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-100">
              <p className="font-medium mb-1">Direct Donation</p>
              <p className="text-blue-200">
                This is a one-time direct transfer to the charity wallet. No approvals or permissions are being granted. Your funds go directly to the charity.
              </p>
            </div>
          </div>

          {/* Donation Amount Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Select Donation Amount</label>
            <div className="grid grid-cols-4 gap-2">
              {DONATION_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={`py-3 rounded-lg font-bold transition-colors ${
                    selectedAmount === amount
                      ? "bg-pink-600 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>

          {/* Crypto Amount Display */}
          <div className="bg-zinc-800 rounded-lg p-3 text-center">
            <p className="text-zinc-400 text-sm">You will donate</p>
            <p className="text-xl font-bold text-white">
              {cryptoAmount} {symbol}
            </p>
            <p className="text-zinc-500 text-sm">(${selectedAmount} USD)</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-xl">
              <QRCodeSVG
                value={paymentURI}
                size={180}
                level="H"
                includeMargin={false}
              />
            </div>
          </div>

          <p className="text-center text-zinc-400 text-sm">
            Scan with your wallet app to donate
          </p>

          {/* Wallet Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Charity Wallet Address</label>
            <div className="bg-zinc-800 rounded-lg p-3 flex items-center justify-between gap-2">
              <span className="text-white text-sm font-mono truncate flex-1">
                {walletAddress}
              </span>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-zinc-700 rounded-lg transition-colors flex-shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-zinc-400" />
                )}
              </button>
            </div>
          </div>

          {/* Network Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
              {networkName} Network
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CharityDonationModal;
