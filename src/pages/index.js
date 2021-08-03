import Link from "next/link";

export default function Page() {
  return (
    <>
      Go to{" "}
      <Link href="sample">
        <a>top</a>
      </Link>
    </>
  );
}

// 独自レイアウトを定義
Page.getLayout = (page) => <>{page}</>;
