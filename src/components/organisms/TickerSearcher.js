import React from "react";
import { SearchInput } from "../molecules/SearchInput";
import styles from "../../styles/TickerSearcher.module.scss";

/** ティッカー検索欄及び検索ボタン */
export class TickerSearcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: undefined,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  /** 選択値変更時 */
  handleChange = (value) => {
    this.setState({ value: value });
  };

  render() {
    const data = Object.values(tmp);

    return (
      <div className={styles.input}>
        <SearchInput
          isAutoFocus
          label="ticker"
          filter="filter"
          data={data}
          placeholder="Search for symbols..."
          optionLabelProp="ticker"
          onChange={this.handleChange.bind(this)}
        />
      </div>
    );
  }
}

const tmp = {
  0: { cik_str: 320193, ticker: "AAPL", title: "Apple Inc." },
  1: { cik_str: 789019, ticker: "MSFT", title: "MICROSOFT CORP" },
  2: { cik_str: 1018724, ticker: "AMZN", title: "AMAZON COM INC" },
  3: { cik_str: 1652044, ticker: "GOOG", title: "Alphabet Inc." },
  4: { cik_str: 1318605, ticker: "TSLA", title: "Tesla, Inc." },
};
