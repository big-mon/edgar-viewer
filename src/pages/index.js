import useSWR from "swr";
import { fetcher } from "../utils/fetcher";
import { IndexLayout } from "../components/templates/IndexLayout";

export default function Page() {
  const { data, error } = useSWR(`/api/tickers`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    errorRetryCount: 2,
    dedupingInterval: 3600000,
  });
  const tickers = error || !data ? [] : Object.values(data);

  return (
    <>
      <IndexLayout tickers={tickers} />
    </>
  );
}

// 独自レイアウトを定義
Page.getLayout = function indexLayout(page) {
  return <>{page}</>;
};
