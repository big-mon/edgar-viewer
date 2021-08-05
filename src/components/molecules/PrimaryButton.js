import React from "react";
import { Button } from "antd";

export class PrimaryButton extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChange(e) {
    this.props.onValueChange(e.value);
  }

  render() {
    const disabled = this.props.disabled;

    return (
      <>
        <Button
          type="primary"
          disabled={disabled}
          size={this.props.size}
          onClick={this.props.onClick}
        >
          {this.props.children}
        </Button>
      </>
    );
  }
}
