import { Layout } from "antd";
import Head from "next/head";
import Link from "next/link";
import styles from "../../styles/TopHeader.module.scss";

const { Header } = Layout;

export function TopHeader({ children, home }) {
  const name = "Alpha Gazer";

  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>

      {home ? (
        <>
          <div className={styles.index}>
            <h1>{name}</h1>
            <p>
              {name} provides the financial history data. Check your favorite
              companies, market quotes, key ratios. More confident, and faster
              your investing decision.
            </p>
          </div>
        </>
      ) : (
        <>
          <Header className={styles.fixed}>
            <Link href="/">
              <a>{name}</a>
            </Link>
          </Header>
        </>
      )}
    </>
  );
}
