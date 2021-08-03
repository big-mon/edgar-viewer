import Link from "next/link";

export default function Home() {
  return (
    <>
      Go to{" "}
      <Link href="/">
        <a>top</a>
      </Link>
    </>
  );
}
