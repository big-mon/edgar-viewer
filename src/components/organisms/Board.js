import React from "react";
import Head from "next/head";
import { PageHeader } from "antd";
import { DataGraph } from "../molecules/DataGraph";
import merge from "lodash.merge";
import keyBy from "lodash.keyby";

/** 情報ボード */
export class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const data = this.props.data ?? {};
    const facts = deconstructOriginalFacts(data);
    const revenues = createRevenueData(facts);
    const cashflow = createCashFlowData(facts);

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

/** 当初データから必要なタグのみに切り分けて整理 */
const deconstructOriginalFacts = (data) => {
  if (data === undefined) return {};

  const dei = data.facts?.dei ?? {};
  const gaap = data.facts["us-gaap"] ?? {};
  if (!Object.keys(dei).length || !Object.keys(gaap).length) return {};

  return {
    /** 会社名 */
    CompanyName: data.entityName ?? "Unknown",

    /** 株式 */
    Shares: {
      /** 発行済み株式数 */
      Total: dei.EntityCommonStockSharesOutstanding ?? {},
      /** 浮動株式の時価総額 */
      FloatValue: dei.EntityPublicFloat ?? {},
    },

    /** 売上高 */
    Revenue: {
      /** 純売上高(2018-) */
      Revenue: gaap.RevenueFromContractWithCustomerExcludingAssessedTax ?? {},
      Revenue2016: gaap.Revenues ?? {},
      Revenue2015: gaap.SalesRevenueNet ?? {},
      /** 売上原価 */
      COGS: gaap.CostOfGoodsAndServicesSold ?? {},
      /** 粗利益 */
      GrossProfit: gaap.GrossProfit ?? {},
    },

    /** 営業経費・利益 */
    Operating: {
      /** 研究開発費 */
      RaD: gaap.ResearchAndDevelopmentExpense ?? {},
      /** 販売費及び一般管理費 */
      SGA: gaap.SellingGeneralAndAdministrativeExpense ?? {},
      /** 総事業費 */
      ExpensesTotal: gaap.OperatingExpenses ?? {},
      /** 営業利益 */
      Income: gaap.OperatingIncomeLoss ?? {},
      /** 営業外収入 */
      IncomeNonOperating: gaap.NonoperatingIncomeExpense ?? {},
    },

    /** 純利益 */
    NetIncome: {
      /** 税引前純利益 */
      Before:
        gaap.IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest ??
        {},
      /** 純利益 */
      Final: gaap.NetIncomeLoss ?? {},
    },

    /** EPS */
    EPS: {
      /** EPS(普通) */
      basic: gaap.EarningsPerShareBasic ?? {},
      /** EPS(希薄化) */
      diluted: gaap.EarningsPerShareDiluted ?? {},
    },

    /** 資産 */
    Assets: {
      /** 資産の合計 */
      Total: gaap.Assets ?? {},

      /** 流動資産 */
      Current: {
        /** 現金及び現金同等物 */
        Cash: gaap.CashAndCashEquivalentsAtCarryingValue ?? {},
        /** 有価証券(流動資産) */
        Marketable: gaap.MarketableSecuritiesCurrent ?? {},
        /** 売掛金 */
        AccountsReceivable: gaap.AccountsReceivableNetCurrent ?? {},
        /** 棚卸資産 */
        Inventory: gaap.InventoryNet ?? {},
        /** 非売掛金 */
        NonTrade: gaap.NontradeReceivablesCurrent ?? {},
        /** その他の流動資産 */
        Other: gaap.OtherAssetsCurrent ?? {},
        /** 流動資産の合計 */
        Total: gaap.AssetsCurrent ?? {},
      },

      /** 固定資産 */
      NonCurrent: {
        /** 有価証券(固定資産) */
        Marketable: gaap.MarketableSecuritiesNoncurrent ?? {},
        /** 有形固定資産 */
        Property: gaap.PropertyPlantAndEquipmentNet ?? {},
        /** その他の資産 */
        Other: gaap.OtherAssetsNoncurrent ?? {},
        /** 固定資産の合計 */
        Total: gaap.AssetsNoncurrent ?? {},
      },
    },

    /** 負債及び株主資本 */
    Liabilities: {
      /** 負債の合計 */
      Liabilities: gaap.Liabilities ?? {},
      /** 株主資本の合計 */
      StockHolders: gaap.StockholdersEquity ?? {},
      /** 負債及び株主資本の合計 */
      Total: gaap.LiabilitiesAndStockholdersEquity ?? {},

      /** 流動負債 */
      Current: {
        /** 買掛金 */
        AccountsPayable: gaap.AccountsPayableCurrent ?? {},
        /** その他の流動負債 */
        Other: gaap.OtherLiabilitiesCurrent ?? {},
        /** 前受収益 */
        Contract: gaap.ContractWithCustomerLiabilityCurrent ?? {},
        /** コマーシャル・ペーパー */
        CommercialPaper: gaap.CommercialPaper ?? {},
        /** 短期債 */
        LongTermDebt: gaap.LongTermDebtCurrent ?? {},
        /** 流動資産の合計 */
        Total: gaap.LiabilitiesCurrent ?? {},
      },

      /** 固定負債 */
      NonCurrent: {
        /** 長期債 */
        LongTermDebt: gaap.LongTermDebtNoncurrent ?? {},
        /** その他の固定負債 */
        Other: gaap.OtherLiabilitiesNoncurrent ?? {},
        /** 固定負債の合計 */
        Total: gaap.LiabilitiesNoncurrent ?? {},
      },

      /** 契約義務と偶発債務 */
      Contingencies: gaap.CommitmentsAndContingencies ?? {},

      /** 株主資本 */
      Equity: {
        /** 株式 */
        Stock: gaap.CommonStocksIncludingAdditionalPaidInCapital ?? {},
        /** 内部留保 */
        RetainedEarning: gaap.RetainedEarningsAccumulatedDeficit ?? {},
        /** その他の包括利益 */
        Other: gaap.AccumulatedOtherComprehensiveIncomeLossNetOfTax ?? {},
        /** 株主資本の合計 */
        Total: gaap.StockholdersEquity ?? {},
      },
    },

    /** 株主還元 */
    Dividends: {
      /** 配当 */
      Dividends: gaap.Dividends ?? {},
      /** 自社株買い */
      Repurchased: gaap.StockRepurchasedAndRetiredDuringPeriodValue ?? {},
    },

    /** キャッシュフロー */
    CashFlow: {
      /** 営業キャッシュフロー */
      Operating: gaap.NetCashProvidedByUsedInOperatingActivities ?? {},
      /** 投資キャッシュフロー */
      Investing: gaap.NetCashProvidedByUsedInInvestingActivities ?? {},
      /** 財務キャッシュフロー */
      Financing: gaap.NetCashProvidedByUsedInFinancingActivities ?? {},
      /** 配当キャッシュフロー支出 */
      Dividends: gaap.PaymentsOfDividends ?? {},
      /** 自社株買いキャッシュフロー支出 */
      Repurchase: gaap.PaymentsForRepurchaseOfCommonStock ?? {},
    },

    /** 減価償却 */
    PaymentsToAcquire: {
      ProductiveAssets: gaap.PaymentsToAcquireProductiveAssets ?? {},
      PropertyPlant: gaap.PaymentsToAcquirePropertyPlantAndEquipment ?? {},
    },
  };
};

/** 業績データを生成 */
const createRevenueData = (data) => {
  // 売上
  const revenue = extractDetailData(data.Revenue.Revenue, "Revenue");
  const revenueOld1 = extractDetailData(data.Revenue.Revenue2016, "Revenue");
  const revenueOld2 = extractDetailData(data.Revenue.Revenue2015, "Revenue");
  // 営業利益
  const incomeOpe = extractDetailData(
    data.Operating.Income,
    "Operating Income"
  );
  // 純利益
  const income = extractDetailData(data.NetIncome.Final, "Net Income");

  // マージ及びソート
  const merged = merge(
    keyBy(revenue, "frame"),
    keyBy(revenueOld1, "frame"),
    keyBy(revenueOld2, "frame"),
    keyBy(incomeOpe, "frame"),
    keyBy(income, "frame")
  );
  const sorted = Object.values(merged).sort((a, b) => a.sort - b.sort);

  // 粗利益率を算出
  const result = sorted.map((d) => ({
    ...d,
    "Operating Profit Margin":
      Math.round((d["Operating Income"] / d.Revenue) * 1000) / 10,
  }));

  return result;
};

/** キャッシュフローデータを生成 */
const createCashFlowData = (data) => {
  // 営業CF
  const opeCF = extractDetailData(data.CashFlow.Operating, "OCF");
  // 投資CF
  const invCF = extractDetailData(data.CashFlow.Investing, "ICF");
  // CapEX
  const pay01 = extractDetailData(
    data.PaymentsToAcquire.ProductiveAssets,
    "PtA"
  );
  const pay02 = extractDetailData(data.PaymentsToAcquire.PropertyPlant, "PtA");
  // 売上
  const revenue = extractDetailData(data.Revenue.Revenue, "Revenue");
  const revenueOld1 = extractDetailData(data.Revenue.Revenue2016, "Revenue");
  const revenueOld2 = extractDetailData(data.Revenue.Revenue2015, "Revenue");

  // マージ及びソート
  const merged = merge(
    keyBy(opeCF, "frame"),
    keyBy(invCF, "frame"),
    keyBy(pay01, "frame"),
    keyBy(pay02, "frame"),
    keyBy(revenue, "frame"),
    keyBy(revenueOld1, "frame"),
    keyBy(revenueOld2, "frame")
  );
  const sorted = Object.values(merged).sort((a, b) => a.sort - b.sort);

  // フリーCFと営業CFマージンを算出
  const result = sorted
    .map((d) => ({ ...d, FCF: d["OCF"] - d["PtA"] }))
    .filter((d) => !isNaN(d.FCF))
    .map((d) => ({
      ...d,
      "OCF Margin": Math.round((d.OCF / d.Revenue) * 1000) / 10,
    }));

  return result;
};

/** 階層をシンプルに整理 */
const extractDetailData = (data, label) => {
  if (data === undefined || !Object.keys(data).length) return [];

  const detail = data.units;
  const units = Object.keys(detail)[0];
  const lists = detail[units];

  const annual = extractDetailDataForm10k(lists, label);

  return annual;
};

/** 年次報告を取得 */
const extractDetailDataForm10k = (data, label) => {
  // フィルターを作成
  const frame = new Set(
    data
      .filter((d) => d.frame)
      .filter((d) => d.frame.length === 6)
      .filter((d) => d.fp === "FY")
      .map((d) => d.frame)
  );

  // フィルターを適用
  const filtered = data
    .filter((d) => frame.has(d.frame))
    .map((d) => ({
      frame: d.frame,
      sort: d.frame.replace(`CY`, "").replace(`Q`, ""),
      [label]: d.val,
    }));
  return filtered;
};
