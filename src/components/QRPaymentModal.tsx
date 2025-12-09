import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

// Wallet addresses for receiving payments
const WALLET_ADDRESSES = {
  evm: "0x9AdEAC6aC3e4Ec2f5965F3E2BB65504B786bf095",
  solana: "z6dRqgWm1oxwTzNNrSFBvT83VJaSjt4sDTyGEaLgiaD",
};

// Chain IDs for EIP-681 URIs
const CHAIN_IDS: Record<string, number> = {
  ethereum: 1,
  bnb: 56,
  polygon: 137,
  base: 8453,
};

interface QRPaymentModalProps {
  open: boolean;
  onClose: () => void;
  networkId: string;
  networkName: string;
  symbol: string;
  cryptoAmount: string;
  usdAmount: string;
  networkLogo: string;
}

const QRPaymentModal = ({
  open,
  onClose,
  networkId,
  networkName,
  symbol,
  cryptoAmount,
  usdAmount,
  networkLogo,
}: QRPaymentModalProps) => {
  const [copied, setCopied] = useState(false);

  const isSolana = networkId === "solana";
  const walletAddress = isSolana ? WALLET_ADDRESSES.solana : WALLET_ADDRESSES.evm;

  // Generate payment URI based on network with message
  const generatePaymentURI = () => {
    const message = encodeURIComponent("What is your name?");
    
    if (isSolana) {
      // Solana Pay URI format with memo/message
      return `solana:${walletAddress}?amount=${cryptoAmount}&label=Boost%20Payment&message=${message}&memo=${message}`;
    } else {
      // EIP-681 format for EVM chains with data field for message
      const chainId = CHAIN_IDS[networkId] || 1;
      const amountInWei = BigInt(Math.floor(parseFloat(cryptoAmount) * 1e18)).toString();
      // Add message as data field (hex encoded using browser-compatible method)
      const messageBytes = new TextEncoder().encode("What is your name?");
      const messageHex = Array.from(messageBytes).map(b => b.toString(16).padStart(2, '0')).join('');
      return `ethereum:${walletAddress}@${chainId}?value=${amountInWei}&data=0x${messageHex}`;
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
      <DialogContent className="bg-zinc-900 border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-center flex items-center justify-center gap-2">
            <img src={networkLogo} alt={networkName} className="w-6 h-6 rounded-full" />
            Pay with {networkName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-xl">
              <QRCodeSVG
                value={paymentURI}
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>
          </div>

          {/* Instructions */}
          <p className="text-center text-muted-foreground text-sm">
            Scan this QR code with your {isSolana ? "Solana" : "crypto"} wallet app to pay
          </p>

          {/* Amount Display */}
          <div className="bg-zinc-800 rounded-lg p-4 text-center space-y-1">
            <p className="text-white text-2xl font-bold">
              {cryptoAmount} {symbol}
            </p>
            <p className="text-muted-foreground text-sm">≈ ${usdAmount} USD</p>
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs text-center">
              Or send manually to this address:
            </p>
            <div className="bg-zinc-800 rounded-lg p-3 flex items-center gap-2">
              <code className="text-white text-xs flex-1 break-all">
                {walletAddress}
              </code>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Network Badge */}
          <div className="flex justify-center">
            <span className="bg-purple-600/20 text-purple-400 text-xs px-3 py-1 rounded-full border border-purple-600/50">
              {networkName} Network
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRPaymentModal;
