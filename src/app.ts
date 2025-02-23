import "dotenv/config";
import express from "express";
import { getDaoHoldings } from "./solana.js";
import { getRecentTweets } from "./twitter.js";

const app = express();

app.get("/", async (_req, res) => {
  const daoInfo = await getDaoHoldings();

  const tweets = await getRecentTweets();

  console.dir(tweets, { depth: null });
  const data = `
  Current DAO holdings: ${daoInfo.solanaBalance} SOL
  Token holdings: ${JSON.stringify(
    daoInfo.tokens.map((t) => `${t.amount} ${t.mint}`)
  )}

  RECENT TWEETS BY YOUR CREATOR:
  ${tweets.join("\n")}
  `;
  res.status(200).json({ data });
});

app.listen(process.env.PORT || 8082, () => {
  console.log(
    `Cubie data aggregator is running on port ${process.env.PORT || 8082}`
  );
});
