import randomUseragent from "random-useragent";

export function fetcher(url) {
  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      "Access-Control-Allow-Methods": "PUT, POST, PATCH, DELETE, GET",
      "User-Agent": randomUseragent.getRandom(),
    },
    mode: "cors",
  }).then((response) => response.json());
}
