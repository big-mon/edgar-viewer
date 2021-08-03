import { Layout } from "antd";
import Link from "next/link";
import styles from "../../styles/footer.module.scss";

const { Footer } = Layout;

export default function TopFooter() {
  return (
    <>
      <Footer className={styles.footer}>
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
