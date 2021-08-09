export function fetcher(url) {
  return fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      "User-Agent": "estrilda@damonge.com",
      "Accept-Encoding": "gzip, deflate",
      Host: "damonge.com",
    },
    mode: "cors",
  }).then((response) => {
    if (!response.ok) return response.text();
    response.json();
  });
}
