import React from "react";
import Link from "next/link";
import { SearchInput } from "../molecules/SearchInput";
import { PrimaryButton } from "../molecules/PrimaryButton";
import styles from "../../styles/TickerSearcher.module.scss";
import { SearchOutlined } from "@ant-design/icons";

/** ティッカー検索欄及び検索ボタン */
export class TickerSearcher extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: undefined,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  /** 選択値変更時 */
  handleChange = (value) => {
    this.setState({ value: value });
  };

  render() {
    const data = this.props.data === undefined ? [] : this.props.data;

    return (
      <div className={styles.input}>
        <SearchInput
          showArrow={false}
          label="ticker"
          filter="filter"
          data={data}
          placeholder="Search for symbols..."
          optionLabelProp="ticker"
          onChange={this.handleChange.bind(this)}
        />

        <Link href={"/stock/" + this.state.value}>
          <PrimaryButton
            onValueChange={this.handleChange}
            disabled={this.state.value === undefined}
            size="large"
          >
            <SearchOutlined />
          </PrimaryButton>
        </Link>
      </div>
    );
  }
}
