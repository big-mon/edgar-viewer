import { withSentry } from "@sentry/nextjs";
import fetch from "isomorphic-unfetch";
import { fetcher } from "../../utils/fetcher";

/** EDGARからティッカー情報を取得 */
const handler = async (req, res) => {
  const url = `https://tickers.damonge.workers.dev/`;
  const fetched = await fetch(url, fetcher);
  const json = await fetched.json();

  res.status(200).json(json);
};

export default withSentry(handler);
