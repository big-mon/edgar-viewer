import TopHeader from "../components/organisms/header";
import TopFooter from "../components/organisms/footer";
import { Row, Col } from "antd";
import Image from "next/image";
import styles from "../styles/index.module.scss";

export default function Page() {
  return (
    <>
      <div className={styles.cover_content}>
        <Row align="middle" className={styles.full_height}>
          <Col xs={{ span: 23, offset: 1 }} lg={{ span: 12, offset: 1 }}>
            <TopHeader home />
            <TopFooter home />
          </Col>
        </Row>
      </div>

      <Image
        className={styles.cover_image}
        src="/bg.jpg"
        alt="picture of background"
        layout="fill"
        objectFit="cover"
        objectPosition="cover"
      />
    </>
  );
}

// 独自レイアウトを定義
Page.getLayout = (page) => <>{page}</>;
