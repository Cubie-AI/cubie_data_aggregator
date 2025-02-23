import "dotenv/config";
import express from "express";
import { getTokenomicsDoc } from "./external/github.js";
import { getDaoHoldings } from "./external/solana.js";
import { recentTweets, startTweetTimer } from "./external/twitter.js";

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

  MOST RECENT TOKENOMICS DOC:
  ${await getTokenomicsDoc()}
  `;

  console.log("Created aggregate data: ", data);
  res.status(200).json({ data });
});

app.listen(process.env.PORT || 8082, () => {
  console.log(
    `Cubie data aggregator is running on port ${process.env.PORT || 8082}`
  );
});
