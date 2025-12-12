import { PrivyProvider as PrivyAuthProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { ReactNode } from "react";

const PRIVY_APP_ID = "cmist4vpq007nl70bguvm7uco";

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: true,
});

interface PrivyProviderProps {
  children: ReactNode;
}

export const PrivyProvider = ({ children }: PrivyProviderProps) => {
  return (
    <PrivyAuthProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#7c3aed",
          walletList: [
            "phantom",
            "solflare",
            "metamask",
            "coinbase_wallet",
            "rainbow",
            "wallet_connect",
          ],
        },
        loginMethods: ["wallet"],
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
      }}
    >
      {children}
    </PrivyAuthProvider>
  );
};
