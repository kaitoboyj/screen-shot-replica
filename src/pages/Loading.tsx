import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import backgroundImage from "@/assets/background.png";

const Loading = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { price } = location.state || { price: "$0" };

  useEffect(() => {
    // Navigate to payment page after 2 seconds
    const timer = setTimeout(() => {
      navigate("/payment", { state: { price } });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, price]);

  return (
    <div 
      className="min-h-screen bg-background text-foreground flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Blue Circular Spinner */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-white text-xl font-medium">Processing your payment...</p>
      </div>
    </div>
  );
};

export default Loading;
