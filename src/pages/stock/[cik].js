import useSWR from "swr";
import { useRouter } from "next/dist/client/router";
import { Board } from "../../components/organisms/Board";
import { Skeleton } from "antd";

/** 0埋め、右から切り取り */
function zeroPadding(num, length) {
  return (`0000000000` + num).slice(-length);
}

export default function Page() {
  // CIKを整形
  const { cik } = useRouter().query;
  const padCik = zeroPadding(cik, 10);

  // APIからデータを取得
  const fetcher = async (url) => await fetch(url).then((res) => res.json());
  const { data, error } = useSWR(`/api/companyfacts?cik=${padCik}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    dedupingInterval: 5000,
  });

  return (
    <>
      {data ? (
        <>
          <Board data={data} />
        </>
      ) : (
        <>
          <Skeleton active loading={!data} paragraph={{ rows: 20 }} />
        </>
      )}
    </>
  );
}
