import { Clock, Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";
import backgroundImage from "@/assets/background.png";

interface BoostDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  multiplier: string;
  duration: string;
  price: string;
}

export const BoostDetailsDialog = ({
  open,
  onOpenChange,
  multiplier,
  duration,
  price,
}: BoostDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-full w-screen h-screen border-0 p-8 bg-cover bg-center bg-no-repeat overflow-y-auto [&>button]:hidden"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">
            Give <span className="text-golden">BTC Bottom</span> a{" "}
            <span className="inline-flex items-center">
              <span className="text-golden text-5xl">⚡</span>
              <span className="text-golden">Boost</span>
            </span>
          </h1>
          <p className="text-lg text-white font-medium">
            Showcase your support, boost{" "}
            <a
              href="https://docs.dexscreener.com/trending"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white underline-offset-2 hover:text-golden transition-colors cursor-pointer"
            >
              Trending Score
            </a>{" "}
            and unlock the <span className="text-golden font-semibold">Golden Ticker</span>!
          </p>
          <Button
            asChild
            className="mt-4 rounded-lg px-6 py-3 text-base font-medium bg-white text-black hover:bg-white/90"
          >
            <a
              href="https://docs.dexscreener.com/boosting"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <HelpCircle className="w-5 h-5" />
              How does it work?
            </a>
          </Button>
        </div>

        {/* Selected Pack Card */}
        <div className="bg-card-dark border border-border rounded-lg p-8 flex flex-col items-center gap-3 mb-6">
          <div className="text-golden text-6xl">⚡</div>
          <div className="text-5xl font-bold text-foreground">{multiplier}</div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="text-3xl font-bold text-foreground mt-2">{price}</div>
        </div>

        {/* Choose another pack button */}
        <DialogClose asChild>
          <button className="flex items-center gap-2 text-foreground hover:text-golden transition-colors mx-auto mb-6 focus:outline-none">
            <ChevronLeft className="w-4 h-4" />
            <span>Choose another pack</span>
          </button>
        </DialogClose>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Trending Boost</h3>
            <p className="text-white">
              This pack will boost this token's Trending Score
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Golden Ticker</h3>
            <p className="text-white">
              This pack will unlock the Golden Ticker
            </p>
          </div>
        </div>

        {/* Terms checkbox */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Checkbox id="terms" />
          <label
            htmlFor="terms"
            className="text-sm text-foreground cursor-pointer"
          >
            I agree to the{" "}
            <a
              href="#"
              className="underline hover:text-golden transition-colors"
            >
              Boosting Terms and Conditions
            </a>
          </label>
        </div>

        {/* Proceed button */}
        <Button className="w-full max-w-md mx-auto bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 rounded-lg">
          Proceed to Payment →
        </Button>
      </DialogContent>
    </Dialog>
  );
};
