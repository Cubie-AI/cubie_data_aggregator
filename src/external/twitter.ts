import { TweetV2, TwitterApi } from "twitter-api-v2";
import { SOCRATES_TWITTER_ID, TWITTER_BEARER_TOKEN } from "../contants.js";

const twitter = new TwitterApi(TWITTER_BEARER_TOKEN);

// Externalize the recentTweets stored in memory
export let recentTweets: string[] = [];

async function getRecentTweets() {
  let result: string[] = [];
  try {
    const request = await twitter.v2.userTimeline(SOCRATES_TWITTER_ID, {
      expansions: ["referenced_tweets.id", "referenced_tweets.id.author_id"],
      "tweet.fields": ["referenced_tweets"],
      max_results: 50,
    });

    const references = request.tweets.flatMap(
      (tweet: TweetV2) =>
        tweet.referenced_tweets?.map((referencedTweet) => referencedTweet.id) ||
        []
    );

    const referencedTweets = await twitter.v2.tweets(references, {
      expansions: ["author_id"],
    });

    const usersIds = [];
    for (const tweet of referencedTweets.data) {
      if (tweet.author_id) {
        usersIds.push(tweet.author_id);
      }
    }

    const users = await twitter.v2.users(usersIds);

    result = request.tweets.map((reference) => {
      const quote = referencedTweets.data.find(
        (ref) => ref.id === reference.id
      );
      const user = users.data.find((u) => u.id === quote?.author_id);

      return `
      [MAIN TWEET BODY]
      Content: ${reference.text}
      
      [QUOTED TWEET]
      Author: ${user?.username}
      Content: ${quote?.text}
      `;
    });
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
