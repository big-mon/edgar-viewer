import merge from "lodash.merge";
import keyBy from "lodash.keyby";

/** 決算データの生成クラス */
export class CompanyFacts {
  constructor(data) {
    this.baseData = this.deconstructOriginalFacts(data);
  }

  /** 当初データから必要なタグのみに切り分けて整理 */
  deconstructOriginalFacts = (data) => {
    if (data === undefined) return {};

    const dei = data.facts?.dei ?? {};
    const gaap = data.facts["us-gaap"] ?? {};
    if (!Object.keys(dei).length || !Object.keys(gaap).length) return {};

    return {
      /** 会社名 */
      CompanyName: data.entityName ?? "Unknown",

      /** 株式 */
      Shares: {
        /** 希薄化後の発行株式数(加重平均) */
        DilutedShares:
          gaap.WeightedAverageNumberOfDilutedSharesOutstanding ?? {},
        /** 株式分割比率 */
        Split: gaap.StockholdersEquityNoteStockSplitConversionRatio1 ?? {},
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
        /** 1株辺り配当 */
        DividendsPerShare: gaap.CommonStockDividendsPerShareDeclared ?? {},
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
  createRevenueData = (data) => {
    // 売上
    const revenue = this.extractDetailData(data.Revenue.Revenue, "Revenue");
    const revenueOld1 = this.extractDetailData(
      data.Revenue.Revenue2016,
      "Revenue"
    );
    const revenueOld2 = this.extractDetailData(
      data.Revenue.Revenue2015,
      "Revenue"
    );
    // 営業利益
    const incomeOpe = this.extractDetailData(
      data.Operating.Income,
      "Operating Income"
    );
    // 純利益
    const income = this.extractDetailData(data.NetIncome.Final, "Net Income");

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
  createCashFlowData = (data) => {
    // 営業CF
    const opeCF = this.extractDetailData(data.CashFlow.Operating, "OCF");
    // 投資CF
    const invCF = this.extractDetailData(data.CashFlow.Investing, "ICF");
    // CapEX
    const pay01 = this.extractDetailData(
      data.PaymentsToAcquire.ProductiveAssets,
      "PtA"
    );
    const pay02 = this.extractDetailData(
      data.PaymentsToAcquire.PropertyPlant,
      "PtA"
    );
    // 売上
    const revenue = this.extractDetailData(data.Revenue.Revenue, "Revenue");
    const revenueOld1 = this.extractDetailData(
      data.Revenue.Revenue2016,
      "Revenue"
    );
    const revenueOld2 = this.extractDetailData(
      data.Revenue.Revenue2015,
      "Revenue"
    );

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

  /** 1株辺りの業績データを生成 */
  createPerSahareData = (data) => {
    // 株式分割比率
    const split = this.extractDetailData(data.Shares.Split, `SplitRatio`, true);

    // 発行株式数
    const shares = this.extractDetailData(
      data.Shares.DilutedShares,
      `Shares`,
      true
    );
    // 発行株式数を補正
    const fixShares = this.fixSplitShares(shares, split, `Shares`);

    // dividend per share
    const dividends = this.extractDetailData(
      data.Dividends.DividendsPerShare,
      `Dividends`,
      true
    );
    const fixDividends = this.fixSplitShares(dividends, split, `Dividends`);
    console.log(split, fixShares);

    // EPS
    // CFPS
    // SPS
  };

  /** 階層をシンプルに整理 */
  extractDetailData = (data, label) => {
    if (data === undefined || !Object.keys(data).length) return [];

    const detail = data.units;
    const units = Object.keys(detail)[0];
    const lists = detail[units];

    const annual = this.extractDetailDataForm10k(lists, label);

    return annual;
  };

  /** 年次報告を取得 */
  extractDetailDataForm10k = (data, label) => {
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

  /** 非年次報告を取得 */
  extractDetailDataOptional = (data, label) => {
    // フィルターを作成
    const frame = new Set(data.filter((d) => d.frame).map((d) => d.frame));

    // フィルターを適用
    const filtered = data
      .filter((d) => frame.has(d.frame))
      .map((d) => ({
        frame: d.frame,
        original: d.val,
        sort: d.end,
        [label]: d.val,
      }));

    return filtered;
  };

  /** 対象データを分割比率で補正 */
  fixSplitShares = (target, split, label) => {
    let edited = target;

    split
      .slice()
      .reverse()
      .forEach((timing) => {
        const frame = timing.sort;
        const ratio = timing.SplitRatio;
        console.log(frame);

        edited = edited.map((d) => ({
          frame: d.frame,
          original: d.original,
          sort: d.sort,
          [label]: d.sort <= frame ? d[label] * ratio : d[label],
        }));
      });

    return edited;
  };
}
