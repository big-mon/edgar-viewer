import Head from "next/head";

/** 業績情報ボード */
export function Board({ data, isQuarter }) {
  const facts = deconstructOriginalFacts(data);

  return (
    <>
      <Head>
        {data && facts != [] ? (
          <title>{facts.CompanyName ?? ""} - Alpha Gazer</title>
        ) : (
          <title>loading... - Alpha Gazer</title>
        )}
      </Head>

      {JSON.stringify(facts)}
    </>
  );
}

/** 当初データから必要なタグのみに切り分けて整理 */
function deconstructOriginalFacts(data) {
  if (data === undefined) return {};

  const dei = data.facts.dei;
  const gaap = data.facts["us-gaap"];

  return {
    /** 会社名 */
    CompanyName: data.entityName,

    /** 株式 */
    Shares: {
      /** 発行済み株式数 */
      Total: dei.EntityCommonStockSharesOutstanding,
      /** 浮動株式の時価総額 */
      FloatValue: dei.EntityPublicFloat,
    },

    /** 売上高 */
    NetSales: {
      /** 純売上高 */
      NetSales: gaap.RevenueFromContractWithCustomerExcludingAssessedTax,
      /** 売上原価 */
      COGS: gaap.CostOfGoodsAndServicesSold,
      /** 粗利益 */
      GrossProfit: gaap.GrossProfit,
    },

    /** 営業経費・利益 */
    Operating: {
      /** 研究開発費 */
      RaD: gaap.ResearchAndDevelopmentExpense,
      /** 販売費及び一般管理費 */
      SGA: gaap.SellingGeneralAndAdministrativeExpense,
      /** 総事業費 */
      ExpensesTotal: gaap.OperatingExpenses,
      /** 営業利益 */
      Income: gaap.OperatingIncomeLoss,
      /** 営業外収入 */
      IncomeNonOperating: gaap.NonoperatingIncomeExpense,
    },

    /** 純利益 */
    NetIncome: {
      /** 税引前純利益 */
      Before:
        gaap.IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest,
      /** 純利益 */
      Final: gaap.NetIncomeLoss,
    },

    /** EPS */
    EPS: {
      /** EPS(普通) */
      basic: gaap.EarningsPerShareBasic,
      /** EPS(希薄化) */
      diluted: gaap.EarningsPerShareDiluted,
    },

    /** 資産 */
    Assets: {
      /** 資産の合計 */
      Total: gaap.Assets,

      /** 流動資産 */
      Current: {
        /** 現金及び現金同等物 */
        Cash: gaap.CashAndCashEquivalentsAtCarryingValue,
        /** 有価証券(流動資産) */
        Marketable: gaap.MarketableSecuritiesCurrent,
        /** 売掛金 */
        AccountsReceivable: gaap.AccountsReceivableNetCurrent,
        /** 棚卸資産 */
        Inventory: gaap.InventoryNet,
        /** 非売掛金 */
        NonTrade: gaap.NontradeReceivablesCurrent,
        /** その他の流動資産 */
        Other: gaap.OtherAssetsCurrent,
        /** 流動資産の合計 */
        Total: gaap.AssetsCurrent,
      },

      /** 固定資産 */
      NonCurrent: {
        /** 有価証券(固定資産) */
        Marketable: gaap.MarketableSecuritiesNoncurrent,
        /** 有形固定資産 */
        Property: gaap.PropertyPlantAndEquipmentNet,
        /** その他の資産 */
        Other: gaap.OtherAssetsNoncurrent,
        /** 固定資産の合計 */
        Total: gaap.AssetsNoncurrent,
      },
    },

    /** 負債及び株主資本 */
    Liabilities: {
      /** 負債の合計 */
      Liabilities: gaap.Liabilities,
      /** 株主資本の合計 */
      StockHolders: gaap.StockholdersEquity,
      /** 負債及び株主資本の合計 */
      Total: gaap.LiabilitiesAndStockholdersEquity,

      /** 流動負債 */
      Current: {
        /** 買掛金 */
        AccountsPayable: gaap.AccountsPayableCurrent,
        /** その他の流動負債 */
        Other: gaap.OtherLiabilitiesCurrent,
        /** 前受収益 */
        Contract: gaap.ContractWithCustomerLiabilityCurrent,
        /** コマーシャル・ペーパー */
        CommercialPaper: gaap.CommercialPaper,
        /** 短期債 */
        LongTermDebt: gaap.LongTermDebtCurrent,
        /** 流動資産の合計 */
        Total: gaap.LiabilitiesCurrent,
      },

      /** 固定負債 */
      NonCurrent: {
        /** 長期債 */
        LongTermDebt: gaap.LongTermDebtNoncurrent,
        /** その他の固定負債 */
        Other: gaap.OtherLiabilitiesNoncurrent,
        /** 固定負債の合計 */
        Total: gaap.LiabilitiesNoncurrent,
      },

      /** 契約義務と偶発債務 */
      Contingencies: gaap.CommitmentsAndContingencies,

      /** 株主資本 */
      Equity: {
        /** 株式 */
        Stock: gaap.CommonStocksIncludingAdditionalPaidInCapital,
        /** 内部留保 */
        RetainedEarning: gaap.RetainedEarningsAccumulatedDeficit,
        /** その他の包括利益 */
        Other: gaap.AccumulatedOtherComprehensiveIncomeLossNetOfTax,
        /** 株主資本の合計 */
        Total: gaap.StockholdersEquity,
      },
    },

    /** 株主還元 */
    Dividends: {
      /** 配当 */
      Dividends: gaap.Dividends,
      /** 自社株買い */
      Repurchased: gaap.StockRepurchasedAndRetiredDuringPeriodValue,
    },

    /** キャッシュフロー */
    CashFlow: {
      /** 営業キャッシュフロー */
      Operating: gaap.NetCashProvidedByUsedInOperatingActivities,
      /** 投資キャッシュフロー */
      Investing: gaap.NetCashProvidedByUsedInOperatingActivities,
      /** 財務キャッシュフロー */
      Financing: gaap.NetCashProvidedByUsedInOperatingActivities,
      /** 配当キャッシュフロー支出 */
      Dividends: gaap.PaymentsOfDividends,
      /** 自社株買いキャッシュフロー支出 */
      Repurchase: gaap.PaymentsForRepurchaseOfCommonStock,
    },
  };
}
