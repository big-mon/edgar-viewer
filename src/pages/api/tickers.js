import fetch from "isomorphic-unfetch";
import { fetcher } from "../../utils/fetcher";

/** EDGARからティッカー情報を取得 */
export default async function tickers(req, res) {
  const url = `https://tickers.damonge.workers.dev/`;
  const fetched = await fetch(url, fetcher);
  const json = await fetched.json();

  res.status(200).json(json);
}
