import useSWR from "swr";
import { useRouter } from "next/router";
import { Board } from "../../components/organisms/Board";
import { Skeleton } from "antd";
import { fetcher } from "../../utils/fetcher";

export default function Page() {
  return (
    <>
      <Content />
    </>
  );
}

/** コンテンツ */
function Content() {
  // CIKを整形
  const router = useRouter();
  const { cik } = router.query;

  // データを取得
  const { data, isLoading } = useStock(cik);
  if (isLoading || data === undefined)
    return <Skeleton active loading={true} paragraph={{ rows: 20 }} />;

  return <Board data={data} />;
}

/** 0埋め、右から切り取り */
function zeroPadding(num, length) {
  return (`0000000000` + num).slice(-length);
}

/** 決算情報の取得 */
function useStock(cik) {
  const padCik = zeroPadding(cik, 10);

  // APIからデータを取得
  const url = `/api/companyfacts?cik=${padCik}`;
  const { data, error } = useSWR(cik ? url : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    errorRetryCount: 2,
    dedupingInterval: 3600000,
  });

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}
