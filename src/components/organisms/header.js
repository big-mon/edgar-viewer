import { Layout } from "antd";
import Link from "next/link";
import styles from "../../styles/header.module.scss";

const { Header } = Layout;

export default function TopHeader() {
  return (
    <>
      <Header className={styles.header}>
        <Link href="/">
          <a>Header</a>
        </Link>
      </Header>
    </>
  );
}
