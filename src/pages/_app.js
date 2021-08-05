import Layout from "../components/templates/BaseLayout";
import "antd/dist/antd.css";
import "../styles/global.scss";

/** 共有レイアウトを定義 */
export default function App({ Component, pageProps }) {
  // 独自レイアウトが取得できた場合、そのレイアウトを使用
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  return getLayout(<Component {...pageProps} />);
}
