export function fetcher(url) {
  return fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
    },
    mode: "cors",
  }).then((response) => {
    if (!response.ok) return response.text();
    response.json();
  });
}
