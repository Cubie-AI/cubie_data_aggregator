import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { CUBIE_DAO_PUBLIC_KEY, SOLANA_RPC_URL } from "./contants.js";

const solanaConnection = new Connection(SOLANA_RPC_URL, {
  commitment: "confirmed",
});

export async function getDaoHoldings() {
  const account = await solanaConnection.getAccountInfo(CUBIE_DAO_PUBLIC_KEY, {
    commitment: "confirmed",
  });

  console.dir(account, { depth: null });
  const solanaBalance = (account?.lamports || 0) / LAMPORTS_PER_SOL;

  const tokenHoldings = await solanaConnection.getParsedTokenAccountsByOwner(
    CUBIE_DAO_PUBLIC_KEY,
    {
      programId: TOKEN_PROGRAM_ID,
    },
    "confirmed"
  );
  console.dir(tokenHoldings, { depth: null });

  const tokens = tokenHoldings.value.map((token) => {
    const tokenAccount = token.account.data.parsed.info;
    return {
      mint: tokenAccount.mint,
      amount: tokenAccount.tokenAmount.uiAmount,
    };
  });

  return {
    solanaBalance,
    tokens,
  };
}
