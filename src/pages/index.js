import { TopHeader } from "../components/organisms/TopHeader";
import { TopFooter } from "../components/organisms/TopFooter";
import { Row, Col } from "antd";
import Image from "next/image";
import styles from "../styles/index.module.scss";
import background from "../../public/bg.jpg";
import { TickerSearcher } from "../components/organisms/TickerSearcher";

export default function Page({ tickers }) {
  return (
    <>
      <div className={styles.cover_content}>
        <Row align="middle" className={styles.full_height}>
          <Col xs={{ span: 23, offset: 1 }} lg={{ span: 12, offset: 1 }}>
            <TopHeader home />

            <TickerSearcher data={tickers} />

            <TopFooter home />
          </Col>
        </Row>
      </div>

      <Image
        className={styles.cover_image}
        src={background}
        alt="picture of background"
        placeholder="blur"
        layout="fill"
        objectFit="cover"
        objectPosition="cover"
      />
    </>
  );
}

/** アクセス毎に実行 */
export async function getServerSideProps(context) {
  const res = await fetch(`https://www.sec.gov/files/company_tickers.json`);
  const json = await res.json();

  return {
    props: {
      tickers: Object.values(json),
    },
  };
}

// 独自レイアウトを定義
Page.getLayout = (page) => <>{page}</>;
