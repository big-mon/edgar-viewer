import React from "react";
import Head from "next/head";
import { PageHeader } from "antd";
import { DataGraph } from "../molecules/DataGraph";
import { CompanyFacts } from "../../utils/CompanyFacts";

/** 情報ボード */
export class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const model = new CompanyFacts(this.props.data ?? {});
    const facts = model.baseData;
    const revenues = model.createRevenueData(facts);
    const cashflow = model.createCashFlowData(facts);
    const perShare = model.createPerSahareData(facts);

    return (
      <>
        <Head>
          <title>{facts.CompanyName} | Alpha Gazer</title>
        </Head>

        <PageHeader
          onBack={() => window.history.back()}
          title={facts.CompanyName}
          style={{ borderBottom: "1px gray solid", marginBottom: "3rem" }}
        />

        <DataGraph title="業績の推移" type={"revenue"} data={revenues} />
        <DataGraph
          title="キャッシュフローの推移"
          type={"cashflow"}
          data={cashflow}
        />
      </>
    );
  }
}
