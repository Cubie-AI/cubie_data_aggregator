import { PublicKey } from "@solana/web3.js";

export const CUBIE_DAO_PUBLIC_KEY = new PublicKey(
  process.env.CUBIE_DAO_PUBLIC_KEY || ""
);

export const CUBIE_CONTRACT_ADDRESS = new PublicKey(
  process.env.CUBIE_CONTRACT_ADDRESS || ""
);

export const SOLANA_RPC_URL =
  process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";

export const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN || "";

export const SOCRATES_TWITTER_ID = "1481073075311501326";
