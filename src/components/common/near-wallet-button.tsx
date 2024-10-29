"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/components/providers/near-wallet-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Unplug } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NearWalletButton() {
  const { selector, modal, accountId } = useWallet();
  const { toast } = useToast();

  const handleConnect = () => {
    modal.show();
  };

  const handleDisconnect = async () => {
    const wallet = await selector.wallet();
    await wallet.signOut();
  };

  const handleCopyAddress = () => {
    if (accountId) {
      navigator.clipboard.writeText(accountId);
      toast({
        description: "Wallet address has been copied!",
      });
    }
  };

  // Địa chỉ ví không quá dài để dùng cái này
  //   const truncateAddress = (address: string) => {
  //     if (!address) return "";
  //     return `${address.slice(0, 6)}...${address.slice(-4)}`;
  //   };

  if (!accountId) {
    return <Button onClick={handleConnect}>Connect to NEAR</Button>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{accountId}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-popover" align="end">
        <DropdownMenuItem onClick={handleCopyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDisconnect}>
          <Unplug className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
