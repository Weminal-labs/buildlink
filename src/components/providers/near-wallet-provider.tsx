"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal, Theme } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { useTheme } from "next-themes";

type WalletContextType = {
  selector: any;
  modal: any;
  accounts: any[];
  accountId: string | null;
};

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [selector, setSelector] = useState<any>(null);
  const [modal, setModal] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountId, setAccountId] = useState<string | null>(null);
  const { theme } = useTheme();
  useEffect(() => {
    setupWalletSelector({
      network: "testnet",
      modules: [setupMyNearWallet()],
      languageCode: "en",
    }).then((selector) => {
      setSelector(selector);
      const modal = setupModal(selector, {
        contractId: "test.near",
        theme: theme as Theme,
      });
      setModal(modal);

      const state = selector.store.getState();
      setAccounts(state.accounts);
      setAccountId(state.accounts[0]?.accountId || null);

      selector.store.observable.subscribe((state: any) => {
        setAccounts(state.accounts);
        setAccountId(state.accounts[0]?.accountId || null);
      });
    });
  }, []);

  return (
    <WalletContext.Provider value={{ selector, modal, accounts, accountId }}>
      {children}
    </WalletContext.Provider>
  );
}
