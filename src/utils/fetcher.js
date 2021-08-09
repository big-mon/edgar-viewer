export const fetcher = (url) =>
  fetch(url, {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "User-Agent": "estrilda@damonge.com",
      "Accept-Encoding": "gzip, deflate",
      Host: "damonge.com",
    },
  }).then((res) => res.json());
