import { Layout } from "antd";
import Link from "next/link";
import styles from "../../styles/footer.module.scss";

const { Footer } = Layout;

export default function TopFooter({ children, home }) {
  const name = "Alpha Gazer";

  return (
    <>
      <div className={styles.footerWrapper}>
        {home ? (
          <Footer className={styles.index}>
            Created by{" "}
            <a
              href="//twitter.com/BIG_MON"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mon
            </a>
          </Footer>
        ) : (
          <Footer className={styles.footer}>
            <Link href="/">
              <a>{name}</a>
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
        )}
      </div>
    </>
  );
}
