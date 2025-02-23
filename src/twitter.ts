import { TweetV2, TwitterApi } from "twitter-api-v2";
import { SOCRATES_TWITTER_ID, TWITTER_BEARER_TOKEN } from "./contants.js";

const twitter = new TwitterApi(TWITTER_BEARER_TOKEN);

// Externalize the recentTweets stored in memory
export let recentTweets: string[] = [];

async function getRecentTweets() {
  let result: string[] = [];
  try {
    const tweets = await twitter.v2.userTimeline(SOCRATES_TWITTER_ID);
    result = tweets.data.data.map((tweet: TweetV2) => tweet.text);
  } catch (error) {
    if (error instanceof Error) {
    }
    console.error(error);
  }

  return result;
}

// We create a time to fetch 0xSoc tweets every 16 minutes (due to Twitter API rate limits)
export async function startTweetTimer() {
  recentTweets = await getRecentTweets();
  setTimeout(startTweetTimer, 1000 * 60 * 16);
}
