import { callMethod, viewMethod } from "@/contracts/contract";
import { WalletSelector } from "@near-wallet-selector/core";

export const getGreeting = async (
  walletSelector: WalletSelector,
  contractId: string
) => {
  return viewMethod(walletSelector, {
    contractId,
    method: "get_greeting",
    args: {},
  });
};

export const setGreeting = async (
  walletSelector: WalletSelector,
  contractId: string,
  accountId: string,
  amount: string
) => {
  await callMethod(walletSelector, accountId, {
    contractId,
    method: "deposit_and_stake",
    args: {},
    deposit: amount, // Specify the amount to deposit
  });
};
