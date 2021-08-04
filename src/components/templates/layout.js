import { Layout } from "antd";
import { TopHeader } from "../organisms/header";
import { TopFooter } from "../organisms/footer";
import styles from "../../styles/layout.module.scss";

const { Content } = Layout;

export default function BaseLayout({ children }) {
  return (
    <>
      <Layout>
        <TopHeader />
        <Content style={{ padding: "0 50px", marginTop: 64 }}>
          <div
            className={styles.contentBackground}
            style={{ padding: 24, minHeight: 380 }}
          >
            {children}
          </div>
        </Content>
        <TopFooter />
      </Layout>
    </>
  );
}
