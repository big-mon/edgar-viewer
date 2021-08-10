import { TopHeader } from "../components/organisms/TopHeader";
import { TopFooter } from "../components/organisms/TopFooter";
import { Row, Col } from "antd";
import Image from "next/image";
import styles from "../styles/index.module.scss";
import background from "../../public/bg.jpg";
import { TickerSearcher } from "../components/organisms/TickerSearcher";
import useSWR from "swr";

export default function Page() {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(`/api/tickers`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    errorRetryCount: 2,
    dedupingInterval: 3600000,
  });
  const tickers = error || !data ? [] : Object.values(data);

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

// 独自レイアウトを定義
Page.getLayout = function indexLayout(page) {
  return <>{page}</>;
};
