import { useRouter } from "next/dist/client/router";

/** 0埋め、右から切り取り */
function zeroPadding(num, length) {
  return (`0000000000` + num).slice(-length);
}

export default function Page() {
  // CIKを整形
  const { cik } = useRouter().query;
  const padCik = zeroPadding(cik, 10);

  return (
    <>
      {cik} - {padCik}
    </>
  );
}
