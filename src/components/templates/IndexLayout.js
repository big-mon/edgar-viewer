import { TopHeader } from "../organisms/TopHeader";
import { TopFooter } from "../organisms/TopFooter";
import { BackgroundImage } from "../atoms/BackgeoundImage";
import { TickerSearcher } from "../organisms/TickerSearcher";
import { Row, Col } from "antd";
import styles from "../../styles/IndexLayout.module.scss";

export function IndexLayout({ tickers }) {
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

      <BackgroundImage />
    </>
  );
}
