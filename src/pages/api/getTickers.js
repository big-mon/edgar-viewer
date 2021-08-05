import fetch from "isomorphic-unfetch";

/** EDGARからティッカー情報を取得 */
export default async function getTickers(req, res) {
  const fetched = await fetch(`https://www.sec.gov/files/company_tickers.json`);
  const json = await fetched.json();

  res.status(200).json(json);
}
