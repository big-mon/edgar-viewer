import React from "react";
import { Select } from "antd";
import styles from "../../styles/searchInput.module.scss";
const { Option } = Select;

export class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  /** 選択値変更時 */
  handleChange = (value) => {
    // 親コンポーネントから渡されたonChangeを実行
    this.props.onChange(value);
  };

  render() {
    const options = this.props.data.map((d) => (
      <Option
        className={styles.option}
        key={d.cik_str}
        ticker={d.ticker}
        filter={d.ticker + d.title}
      >
        <span className={styles.ticker}>{d.ticker}</span>
        <span className={styles.title}>{d.title}</span>
      </Option>
    ));

    return (
      <Select
        showSearch
        placeholder={this.props.placeholder}
        allowClear={true}
        autoFocus={this.props.isAutoFocus}
        style={this.props.style}
        filterOption={true}
        optionFilterProp={this.props.filter}
        optionLabelProp={this.props.label}
        onChange={this.handleChange}
        size="large"
      >
        {options}
      </Select>
    );
  }
}
