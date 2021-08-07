import React from "react";
import {
  ComposedChart,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

/** 数値単位のフォーマット */
const dataFormatter = (number) => {
  const abs = number < 0 ? -number : number;

  if (abs > 1000000000) {
    return (number / 1000000000).toString() + "Bil";
  } else if (abs > 1000000) {
    return (number / 1000000).toString() + "Mil";
  } else if (abs > 1000) {
    return (number / 1000).toString() + "K";
  } else {
    return number.toString();
  }
};

/** グラフのマージン定義 */
const margin = { top: 50, right: 20, left: 20, bottom: 50 };

/** チャートパターンを生成 */
const createChartPattern = (type, data) => {
  switch (type) {
    case "revenue":
      return (
        <BarChart data={data.slice(-10)} margin={margin}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="frame" />
          <YAxis tickFormatter={dataFormatter} />
          <Tooltip formatter={dataFormatter} />
          <Legend />
          <Bar dataKey="Revenue" fill="#2B2E4A" />
          <Bar dataKey="Operating Income" fill="#E84545" />
          <Bar dataKey="Net Income" fill="#878ECD" />
        </BarChart>
      );

    case "cashflow":
      return (
        <BarChart data={data.slice(-10)} margin={margin}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="frame" />
          <YAxis tickFormatter={dataFormatter} />
          <Tooltip formatter={dataFormatter} />
          <Legend />
          <Bar dataKey="OCF" fill="#E84545" />
          <Bar dataKey="ICF" fill="#F07B3F" />
          <Bar dataKey="FCF" fill="#878ECD" />
        </BarChart>
      );

    default:
      return (
        <ComposedChart data={data} margin={margin}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="frame" />
          <YAxis yAxisId={1} tickFormatter={dataFormatter} />
          <YAxis
            yAxisId={2}
            tickFormatter={dataFormatter}
            orientation="right"
          />
          <Tooltip formatter={dataFormatter} />
          <Legend />
          <Bar yAxisId={1} dataKey="粗利益" fill="#8884d8" />
          <Bar yAxisId={2} dataKey="粗利益" fill="#82ca9d" />
        </ComposedChart>
      );
  }
};

export class DataGraph extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const chart = createChartPattern(this.props.type, this.props.data);

    return (
      <ResponsiveContainer width={"100%"} height={400}>
        {chart}
      </ResponsiveContainer>
    );
  }
}
