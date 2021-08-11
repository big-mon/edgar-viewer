import React from "react";
import { Card } from "antd";
import {
  CartesianGridProps,
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
const margin = { top: 20, right: 20, left: 20, bottom: 20 };

/** グラフのカラーパレット定義 */
const colors = {
  revenue: "#001E6C",
  opeIncome: "#B83B5E",
  opeIncome2: "#903749",
  netIncome: "#878ECD",
};

/** チャートパターンを生成 */
const createChartPattern = (type, data) => {
  switch (type) {
    case "revenue":
      return (
        <ComposedChart data={data.slice(-10)} margin={margin}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="frame" />
          <YAxis tickFormatter={dataFormatter} />
          <YAxis yAxisId={2} orientation="right" unit="%" />
          <Tooltip formatter={dataFormatter} />
          <Legend verticalAlign="top" height={40} />
          <Bar dataKey="Revenue" fill={colors.revenue} />
          <Bar dataKey="Operating Income" fill={colors.opeIncome} />
          <Bar dataKey="Net Income" fill={colors.netIncome} />
          <Line
            yAxisId={2}
            dataKey="Operating Profit Margin"
            type="linear"
            strokeWidth={2}
            stroke={colors.opeIncome2}
            unit="%"
          />
        </ComposedChart>
      );

    case "cashflow":
      return (
        <ComposedChart data={data.slice(-10)} margin={margin}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="frame" />
          <YAxis tickFormatter={dataFormatter} />
          <YAxis yAxisId={2} orientation="right" unit="%" />
          <Tooltip formatter={dataFormatter} />
          <Legend verticalAlign="top" height={40} />
          <Bar dataKey="OCF" fill={colors.opeIncome} />
          <Bar dataKey="FCF" fill={colors.netIncome} />
          <Line
            yAxisId={2}
            dataKey="OCF Margin"
            type="linear"
            strokeWidth={3}
            stroke={colors.opeIncome2}
            unit="%"
          />
        </ComposedChart>
      );

    case "pershare":
    // 1株辺りの業績推移

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
      <Card title={this.props.title} style={{ marginBottom: "2rem" }}>
        <ResponsiveContainer width={"100%"} height={400}>
          {chart}
        </ResponsiveContainer>
      </Card>
    );
  }
}
