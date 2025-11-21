import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useProject } from '@/contexts/ProjectContext';
import backgroundImage from '@/assets/background.png';

const ContractInput = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setProjectName, setContractAddress: setGlobalContractAddress } = useProject();

  const fetchProjectName = async () => {
    if (!contractAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a contract address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`);
      const data = await response.json();
      
      if (data.pairs && data.pairs.length > 0) {
        const projectName = data.pairs[0].baseToken.name;
        setProjectName(projectName);
        setGlobalContractAddress(contractAddress);
        navigate('/boost');
      } else {
        toast({
          title: "Error",
          description: "No project found for this contract address",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch project details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Enter Contract Address
          </h1>
          <p className="text-lg text-white/80">
            Enter the contract address of your crypto project to continue
          </p>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm p-8 rounded-lg border border-white/10">
          <Input
            type="text"
            placeholder="0x..."
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchProjectName()}
            className="mb-4 bg-background/50 text-white border-white/20 placeholder:text-white/40"
          />
          
          <Button
            onClick={fetchProjectName}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Loading...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContractInput;
