import { Layout } from "antd";
import { TopHeader } from "../organisms/TopHeader";
import { TopFooter } from "../organisms/TopFooter";
import styles from "../../styles/BaseLayout.module.scss";

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
