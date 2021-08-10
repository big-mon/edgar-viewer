export const fetcher = (url) =>
  fetch(url, {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "User-Agent": "alpha-gazer@damonge.com",
      "Accept-Encoding": "gzip, deflate",
      Host: "www.sec.gov",
    },
  }).then((res) => res.json());
