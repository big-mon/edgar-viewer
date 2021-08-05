import fetch from "isomorphic-unfetch";
import randomUseragent from "random-useragent";

/** EDGARからティッカー情報を取得 */
export default async function tickers(req, res) {
  const url = `https://www.sec.gov/files/company_tickers.json`;
  const fetched = await fetch(url, {
    headers: { "User-Agent": randomUseragent.getRandom() },
  });
  const json = await fetched.json();

  res.status(200).json(json);
}
