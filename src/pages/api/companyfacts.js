import fetch from "isomorphic-unfetch";
import { fetcher } from "../../utils/fetcher";

const API_ROOT = `https://data.sec.gov/api/xbrl/companyfacts/`;

/** EDGARから決算内容を取得 */
export default async function companyfacts(req, res) {
  const { cik } = req.query;
  if (cik === undefined) return res.status(400).json({});

  //const url = `${API_ROOT}CIK${cik}.json`;
  const url = `https://companyfacts.damonge.workers.dev/?cik=${cik}`;
  //const url = `https://pastebin.pl/view/raw/6a3b2cd2`; // AAPL
  //const url = `https://pastebin.pl/view/raw/af95e8f3`; // AMZN
  //const url = `https://pastebin.pl/view/raw/1702175c`; // GOOG
  //const url = `https://pastebin.pl/view/raw/02fb93ac`; // GD

  const fetched = await fetch(url, fetcher);
  const text = await fetched.text();

  try {
    const json = JSON.parse(text);
    return res.status(200).json(json);
  } catch (e) {
    console.log("Error:", text);
    return res.status(400).json({});
  }
}
