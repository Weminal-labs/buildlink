"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { setGreeting } from "@/contracts/greeting-contract";
import { useWallet } from "@/components/providers/near-wallet-provider";
import { Toast } from "@/components/ui/toast";

interface ProtocolInfo {
  name: string;
  apy: string;
  minStake: number;
  totalStaked: string;
  description: string;
}

const protocolsInfo: Record<string, ProtocolInfo> = {
  "LiNEAR Protocol": {
    name: "LiNEAR Protocol",
    apy: "10.5%",
    minStake: 1,
    totalStaked: "2.5M NEAR",
    description: "Liquid staking solution for NEAR Protocol",
  },
  "Meta Pool": {
    name: "Meta Pool",
    apy: "11.2%",
    minStake: 1,
    totalStaked: "1.8M NEAR",
    description: "First liquid staking solution on NEAR",
  },
  Everstake: {
    name: "Everstake",
    apy: "9.8%",
    minStake: 5,
    totalStaked: "3.2M NEAR",
    description: "Professional staking provider for PoS networks",
  },
};
export default function ActionCard() {
  const [stakeAmount, setStakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const protocol = protocolsInfo["LiNEAR Protocol"];
  const { selector, accountId } = useWallet();
  const contractName = "linear-protocol.testnet";

  const handleStakeClick = (amount: string) => {
    setStakeAmount(amount);
  };

  const handleStakeSubmit = async () => {
    if (!selector) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your NEAR wallet to stake",
        variant: "destructive",
      });
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      Toast({
        title: "Invalid amount",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsStaking(true);
      const wallet = await selector.wallet();

      // Convert NEAR amount to yoctoNEAR (1 NEAR = 10^24 yoctoNEAR)
      const yoctoAmount =
        BigInt(Math.round(parseFloat(stakeAmount) * 1e6)) * BigInt(1e18);

      await setGreeting(
        selector,
        contractName,
        accountId as string,
        yoctoAmount.toString()
      );

      const transactionHash = new URLSearchParams(window.location.search).get(
        "transactionHashes"
      );

      toast({
        title: "Stake successful",
        description: `Successfully staked ${stakeAmount} NEAR. Transaction Hash: ${transactionHash}`,
      });
      setStakeAmount("");
    } catch (error) {
      console.error("Staking failed:", error);
      toast({
        title: "Staking failed",
        description:
          error instanceof Error ? error.message : "Failed to stake NEAR",
        variant: "destructive",
      });
    } finally {
      setIsStaking(false);
    }
  };

  if (!protocol) return null;

  return (
    <div className="w-[300px]">
      <div className="aspect-video w-full mb-4 bg-gray-200 rounded-lg overflow-hidden">
        <img
          src="https://public.bnbstatic.com/static/academy/uploads-original/e196996f8ae34464b849c4b6e0ea9112.png"
          alt="Staking visual"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">{protocol.name}</h3>
          <Badge variant="secondary" className="text-sm">
            APY: {protocol.apy}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          {protocol.description}
        </p>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Min Stake: {protocol.minStake} NEAR</span>
          <span>TVL: {protocol.totalStaked}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {[1, 5, 10].map((value) => (
            <Button
              key={value}
              variant="outline"
              onClick={() => handleStakeClick(value.toString())}
              className="flex-1"
              disabled={isStaking}
            >
              {value} NEAR
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Enter amount"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            className="flex-1"
            disabled={isStaking}
            min={protocol.minStake}
          />
          <Button
            onClick={handleStakeSubmit}
            disabled={isStaking || !stakeAmount}
            className="whitespace-nowrap"
          >
            {isStaking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Staking...
              </>
            ) : (
              "Stake Now"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
