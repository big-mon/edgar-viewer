import { Layout } from "antd";
import Link from "next/link";
import styles from "../../styles/footer.module.scss";

const { Footer } = Layout;

export default function TopFooter() {
  return (
    <>
      <Footer className={styles.footer}>
        <Link href="/">
          <a>Alpha Gazer</a>
        </Link>{" "}
        Created by{" "}
        <a
          href="//twitter.com/BIG_MON"
          target="_blank"
          rel="noopener noreferrer"
        >
          Mon
        </a>
      </Footer>
    </>
  );
}
