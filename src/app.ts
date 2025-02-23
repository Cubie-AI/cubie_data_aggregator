import "dotenv/config";
import express from "express";
import { getDaoHoldings } from "./solana.js";
import { recentTweets, startTweetTimer } from "./twitter.js";

const app = express();

// start polling the Twitter API
startTweetTimer();

// mount our rag endpoints
app.get("/", async (_req, res) => {
  const daoInfo = await getDaoHoldings();

  const data = `
  Current DAO holdings: ${daoInfo.solanaBalance} SOL
  Token holdings: ${JSON.stringify(
    daoInfo.tokens.map((t) => `${t.amount} ${t.mint}`)
  )}

  RECENT TWEETS BY YOUR CREATOR:
  ${recentTweets.join("\n")}
  `;

  res.status(200).json({ data });
});

app.listen(process.env.PORT || 8082, () => {
  console.log(
    `Cubie data aggregator is running on port ${process.env.PORT || 8082}`
  );
});
