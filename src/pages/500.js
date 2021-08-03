import { Result, Button } from "antd";
import Link from "next/link";

export default function Custom404() {
  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, something went wrong."
      extra={
        <Button type="primary">
          <Link href="/">
            <a>Back Home</a>
          </Link>
        </Button>
      }
    />
  );
}
