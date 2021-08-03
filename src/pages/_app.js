import Layout from "../components/templates/layout";
import "../styles/global.scss";
import "antd/dist/antd.css";

/** 共有レイアウトを定義 */
export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
