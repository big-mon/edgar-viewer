import fetch from "isomorphic-unfetch";
import randomUseragent from "random-useragent";

const API_ROOT = `https://data.sec.gov/api/xbrl/companyfacts/`;

/** EDGARから決算内容を取得 */
export default async function companyfacts(req, res) {
  const { cik } = req.query;
  const url = `${API_ROOT}CIK${cik}.json`;
  const fetched = await fetch(url, {
    headers: { "User-Agent": randomUseragent.getRandom() },
  });
  const json = await fetched.json();

  res.status(200).json(json);
}
