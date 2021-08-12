import merge from "lodash.merge";
import keyBy from "lodash.keyby";

/** 決算データの生成クラス */
export class CompanyFacts {
  constructor(data) {
    this.baseData = this.deconstructOriginalFacts(data);
    this.data = this.cleanUp();
  }

  /** API結果から必要なタグのみ抽出 */
  deconstructOriginalFacts = (data) => {
    if (data === undefined) return {};

    const dei = data.facts?.dei ?? {};
    const gaap = data.facts["us-gaap"] ?? {};
    if (!Object.keys(gaap).length) return {};

    return {
      /** 会社名 */
      CompanyName: data.entityName ?? "Unknown",

      /** 株式 */
      Shares: {
        /** 希薄化後株式数 */
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
        Operating2014:
          gaap.NetCashProvidedByUsedInOperatingActivitiesContinuingOperations ??
          {},
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

  /** データ構造を整形 */
  cleanUp = () => {
    const data = this.baseData;

    // 企業名
    const name = data.CompanyName;

    // 売上高
    const revenue = this.extractRevenue();
    // 営業利益
    const operatingIncome = this.extract(
      data.Operating.Income,
      "Operating Income"
    );
    // 純利益
    const income = this.extract(data.NetIncome.Final, "Net Income");
    // 営業利益率
    const operatingMargin = this.calOperatingMargin(revenue, operatingIncome);

    // CapEx
    const capEx = this.extractCapitalExpense();
    // CF
    const cashflowOperating = this.extractOperatingCashFlow();
    const cashflowInvesting = this.extract(data.CashFlow.Investing, "ICF");
    const cashflowFree = this.calcFreeCashFLow(cashflowOperating, capEx);
    const cashflowOperatingMargin = this.calcOperatingCashFlowMargin(
      cashflowOperating,
      revenue
    );
    // 配当CF
    const cashflowDividends = this.extract(
      data.CashFlow.Dividends,
      "Dividends"
    );

    // 株式分割履歴
    const stockSplitTiming = this.extractSplittedTiming();
    // 希薄化後株式数
    const sharesDiluted = this.extractDilutedShares(stockSplitTiming);

    // DPS
    const dps = this.calcDps(cashflowDividends, sharesDiluted);
    // EPS
    const eps = this.calcEps(income, sharesDiluted);
    // CFPS
    const cfps = this.calcCfps(cashflowFree, sharesDiluted);
    // SPS
    const sps = this.calcSps(revenue, sharesDiluted);

    return {
      /** 企業名 */
      CompanyName: name,

      /** 売上高 */
      Revenue: revenue,
      /** 営業利益 */
      OperatingIncome: operatingIncome,
      /** 営業利益率 */
      OperatingProfitMargin: operatingMargin,
      /** 純利益 */
      NetIncome: income,

      /** 営業CF */
      OCF: cashflowOperating,
      /** 営業CFマージン */
      OCFMargin: cashflowOperatingMargin,
      /** 投資CF */
      ICF: cashflowInvesting,
      /** フリーCF */
      FCF: cashflowFree,

      /** 希薄化後の株式数 */
      Shares: sharesDiluted,

      /** DPS(希薄化後) */
      DPS: dps,
      /** EPS(希薄化後) */
      EPS: eps,
      /** CFPS(希薄化後) */
      CFPS: cfps,
      /** SPS(希薄化後) */
      SPS: sps,
    };
  };

  /** 売上高の抽出 */
  extractRevenue = () => {
    const data = this.baseData.Revenue;
    const label = `Revenue`;
    const key = `frame`;

    const revenue = this.extract(data.Revenue, label);
    const revenueOld1 = this.extract(data.Revenue2016, label);
    const revenueOld2 = this.extract(data.Revenue2015, label);

    // マージ及びソート
    const merged = merge(
      keyBy(revenue, key),
      keyBy(revenueOld1, key),
      keyBy(revenueOld2, key)
    );
    const sorted = Object.values(merged).sort((a, b) => a.sort - b.sort);

    return sorted;
  };

  /** CapEXの抽出 */
  extractCapitalExpense = () => {
    const data = this.baseData.PaymentsToAcquire;
    const label = `PtA`;
    const key = `frame`;

    const pay01 = this.extract(data.ProductiveAssets, label);
    const pay02 = this.extract(data.PropertyPlant, label);

    // マージ及びソート
    const merged = merge(keyBy(pay01, key), keyBy(pay02, key));
    const sorted = Object.values(merged).sort((a, b) => a.sort - b.sort);

    return sorted;
  };

  /** 営業CFを抽出 */
  extractOperatingCashFlow = () => {
    const data = this.baseData.CashFlow;
    const label = `OCF`;
    const key = `frame`;

    const ocf = this.extract(data.Operating, label);
    const ocfOld = this.extract(data.Operating2014, label);

    // マージ及びソート
    const merged = merge(keyBy(ocf, key), keyBy(ocfOld, key));
    const sorted = Object.values(merged).sort((a, b) => a.sort - b.sort);

    return sorted;
  };

  /** 株式分割履歴を抽出 */
  extractSplittedTiming = () => {
    const data = this.baseData.Shares.Split;
    const label = `SplitRatio`;

    const result = this.extractAllTime(data, label)
      .filter((d) => d.frame)
      .reverse();

    return result;
  };

  /** 希薄化後の発行株式数を抽出 */
  extractDilutedShares = (split) => {
    const beforeDiluted = this.extractAllTime(
      this.baseData.Shares.DilutedShares,
      "DilutedShares"
    );

    const afterDiluted = this.calcLayGroundworkDilutedShares(
      beforeDiluted,
      split
    );

    const paddedDiluted = this.paddedFrame(afterDiluted);

    const fixDiluted = this.fixSplitShares(
      paddedDiluted,
      split,
      "DilutedShares"
    ).filter((d) => d.frame.length === 6);

    return fixDiluted;
  };

  /** 営業利益率を算出 */
  calOperatingMargin = (revenue, operatingIncome) => {
    const mergeKey = `frame`;
    const key = `Operating Income`;

    // マージ及びソート
    const merged = merge(
      keyBy(revenue, mergeKey),
      keyBy(operatingIncome, mergeKey)
    );
    const sorted = Object.values(merged).sort((a, b) => a.sort - b.sort);

    // 算出
    const result = sorted.map((d) => ({
      frame: d.frame,
      "Operating Profit Margin": Math.round((d[key] / d.Revenue) * 1000) / 10,
    }));

    return result;
  };

  /** フリーCFを算出 */
  calcFreeCashFLow = (ocf, capEx) => {
    const mergeKey = `frame`;
    const keyOCF = `OCF`;
    const keyCapEx = `PtA`;

    // マージ及びソート
    const merged = merge(keyBy(ocf, mergeKey), keyBy(capEx, mergeKey));
    const sorted = Object.values(merged).sort((a, b) => a.sort - b.sort);

    // 算出
    const result = sorted
      .map((d) => ({
        frame: d.frame,
        FCF: d[keyOCF] - d[keyCapEx],
      }))
      .filter((d) => !isNaN(d.FCF));

    return result;
  };

  /** 営業CFマージンを算出 */
  calcOperatingCashFlowMargin = (ocf, revenue) => {
    const mergeKey = `frame`;
    const keyOCF = `OCF`;
    const keyRevenue = `Revenue`;
    const label = `OCF Margin`;

    // マージ及びソート
    const merged = merge(keyBy(ocf, mergeKey), keyBy(revenue, mergeKey));
    const sorted = Object.values(merged).sort((a, b) => a.sort - b.sort);

    // 算出
    const result = sorted
      .map((d) => ({
        [mergeKey]: d[mergeKey],
        [label]: Math.round((d[keyOCF] / d[keyRevenue]) * 1000) / 10,
      }))
      .filter((d) => !isNaN(d[label]));

    return result;
  };

  /** 希薄化考慮済みの発行株式数を算出 */
  calcLayGroundworkDilutedShares = (shares, split) => {
    const keyFrame = `frame`;
    const keyStart = `start`;
    const keyEnd = `end`;
    const keyFiled = `filed`;
    const keyDiluted = `DilutedShares`;
    const keySplit = `SplitRatio`;
    const keySort = `sort`;
    let editedShares = shares.slice();

    // 元データで過年度数値が再度件発表された場合、調整後株式数が最新化されている。
    // 株式分割の比率計算の対象とする時期がずれるため、当初掲載値に戻す。
    split.forEach((timing) => {
      const splittedEnd = timing[keyEnd];
      const splittedRatio = timing[keySplit];
      const splitterdFiled = timing[keyFiled];

      editedShares.forEach((row) => {
        const judge =
          row[keyEnd] > splittedEnd ||
          row[keyFiled].slice(0, 4) <= splitterdFiled.slice(0, 4) - 2;
        if (judge) return row;

        // 当初掲載値
        const sameData = shares.find(
          (s) =>
            s[keyStart] === row[keyStart] &&
            s[keyEnd] === row[keyEnd] &&
            s[keyDiluted] !== row[keyDiluted] &&
            s[keyFiled] < row[keyFiled]
        );
        if (sameData === undefined) return row;

        // 最新値に対して分割比率を除算して戻す
        row[keyDiluted] = Math.round(row[keyDiluted] / splittedRatio);
        return row;
      });
    });

    // 期間情報の含むデータのみに絞り込む
    const result = editedShares
      .filter((d) => d[keyFrame])
      .map((d) => ({
        [keyFrame]: d[keyFrame],
        [keySort]: d[keySort],
        [keyDiluted]: d[keyDiluted],
      }));

    return result;
  };

  /** 希薄化後DPS */
  calcDps = (dividends, shares) => {
    const mergeKey = `frame`;
    const keyShares = `DilutedShares`;
    const keyDividends = `Dividends`;
    const label = `DPS`;

    // マージ及びソート
    const merged = merge(keyBy(dividends, mergeKey), keyBy(shares, mergeKey));
    const sorted = Object.values(merged).sort((a, b) => a.sort - b.sort);

    // 算出
    const result = sorted
      .map((d) => ({
        [mergeKey]: d[mergeKey],
        [label]: Math.round((d[keyDividends] / d[keyShares]) * 100) / 100,
      }))
      .filter((d) => !isNaN(d[label]));

    return result;
  };

  /** 希薄化後EPS */
  calcEps = (netIncome, shares) => {
    const mergeKey = `frame`;
    const keyShares = `DilutedShares`;
    const keyEarning = `Net Income`;
    const label = `EPS`;

    // マージ及びソート
    const merged = merge(keyBy(netIncome, mergeKey), keyBy(shares, mergeKey));
    const sorted = Object.values(merged).sort((a, b) => a.sort - b.sort);

    // 算出
    const result = sorted
      .map((d) => ({
        [mergeKey]: d[mergeKey],
        [label]: Math.round((d[keyEarning] / d[keyShares]) * 100) / 100,
      }))
      .filter((d) => !isNaN(d[label]));

    return result;
  };

  /** 希薄化後CFPS */
  calcCfps = (fcf, shares) => {
    const mergeKey = `frame`;
    const keyShares = `DilutedShares`;
    const keyFcf = `FCF`;
    const label = `CFPS`;

    // マージ及びソート
    const merged = merge(keyBy(fcf, mergeKey), keyBy(shares, mergeKey));
    const sorted = Object.values(merged).sort((a, b) => a.sort - b.sort);

    // 算出
    const result = sorted
      .map((d) => ({
        [mergeKey]: d[mergeKey],
        [label]: Math.round((d[keyFcf] / d[keyShares]) * 100) / 100,
      }))
      .filter((d) => !isNaN(d[label]));

    return result;
  };

  /** 希薄化後SPS */
  calcSps = (revenue, shares) => {
    const mergeKey = `frame`;
    const keyShares = `DilutedShares`;
    const keyRevenue = `Revenue`;
    const label = `SPS`;

    // マージ及びソート
    const merged = merge(keyBy(revenue, mergeKey), keyBy(shares, mergeKey));
    const sorted = Object.values(merged).sort((a, b) => a.sort - b.sort);

    // 算出
    const result = sorted
      .map((d) => ({
        [mergeKey]: d[mergeKey],
        [label]: Math.round((d[keyRevenue] / d[keyShares]) * 100) / 100,
      }))
      .filter((d) => !isNaN(d[label]));

    return result;
  };

  /** 業績データを生成 */
  loadChartDataRevenue = () => {
    const data = this.data;
    const mergeKey = `frame`;

    const revenue = data.Revenue;
    const operatingIncome = data.OperatingIncome;
    const operatingProfitMargin = data.OperatingProfitMargin;
    const netIncome = data.NetIncome;

    // マージ及びソート
    const merged = merge(
      keyBy(revenue, mergeKey),
      keyBy(operatingIncome, mergeKey),
      keyBy(operatingProfitMargin, mergeKey),
      keyBy(netIncome, mergeKey)
    );
    const sorted = Object.values(merged).sort(
      (a, b) => a[mergeKey] - b[mergeKey]
    );

    return sorted;
  };

  /** キャッシュフローデータを生成 */
  loadChartDataCF = () => {
    const data = this.data;
    const mergeKey = `frame`;

    const ocf = data.OCF;
    const ocfMargin = data.OCFMargin;
    const icf = data.ICF;
    const fcf = data.FCF;

    // マージ及びソート
    const merged = merge(
      keyBy(ocf, mergeKey),
      keyBy(ocfMargin, mergeKey),
      keyBy(icf, mergeKey),
      keyBy(fcf, mergeKey)
    );
    const sorted = Object.values(merged).sort(
      (a, b) => a[mergeKey] - b[mergeKey]
    );

    return sorted;
  };

  /** 1株辺り業績データを生成 */
  loadChartDataPerShare = () => {
    const data = this.data;
    const mergeKey = `frame`;

    const dps = data.DPS;
    const eps = data.EPS;
    const cfps = data.CFPS;
    const sps = data.SPS;

    // マージ及びソート
    const merged = merge(
      keyBy(dps, mergeKey),
      keyBy(eps, mergeKey),
      keyBy(cfps, mergeKey),
      keyBy(sps, mergeKey)
    );
    const sorted = Object.values(merged).sort(
      (a, b) => a[mergeKey].replace(`CY`, "") - b[mergeKey].replace(`CY`, "")
    );

    return sorted;
  };

  /** 指定要素を抽出(1株辺りの考慮不要) */
  extract = (data, label) => {
    if (data === undefined || !Object.keys(data).length) return [];

    const detail = data.units;
    const units = Object.keys(detail)[0];
    const lists = detail[units];

    const extracted = this.extractForm10k(lists, label);

    return extracted;
  };

  /** 指定要素を抽出(1株辺りの考慮が必要) */
  extractAllTime = (data, label) => {
    if (data === undefined || !Object.keys(data).length) return [];

    const detail = data.units;
    const units = Object.keys(detail)[0];
    const lists = detail[units];

    const extracted = this.extractOptional(lists, label);

    return extracted;
  };

  /** 年次報告を取得 */
  extractForm10k = (data, label) => {
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
  extractOptional = (data, label) => {
    // フィルターを適用
    const filtered = data.map((d) => ({
      frame: d.frame ?? "",
      sort: d.frame,
      [label]: d.val,
      start: d.start,
      end: d.end,
      filed: d.filed,
    }));

    return filtered;
  };

  /** 対象データを分割比率で補正 */
  fixSplitShares = (target, split, label) => {
    const keyFrame = `frame`;
    const keySort = `fixSort`;
    const keySplit = `SplitRatio`;

    let edited = target;

    split.slice().forEach((timing) => {
      const frame = timing[keyFrame].slice(0, 8);
      const ratio = timing[keySplit];

      edited = edited.map((d) => {
        return {
          [keyFrame]: d[keyFrame],
          [keySort]: d[keySort],
          original: d[label],
          [label]: d[keySort] < frame ? d[label] * ratio : d[label],
        };
      });
    });

    return edited;
  };

  /** frameをQで埋めた補正キーバリューペアを追加 */
  paddedFrame = (target) => {
    const result = target.map((d) => {
      if (d.frame.length === 8) return { ...d, fixSort: d.frame };

      const quarters = target.filter(
        (f) => d.frame === f.frame.slice(0, 6) && f.frame.length === 8
      );
      if (quarters.length !== 3) return { ...d, fixSort: d.frame };

      // Form 10-Kと重なるQを算出
      const f10qSeason = new Set(quarters.map((q) => q.frame.slice(-1)));
      const f10kSeason = !f10qSeason.has("1")
        ? 1
        : !f10qSeason.has("2")
        ? 2
        : !f10qSeason.has("3")
        ? 3
        : 4;

      // キーを追加
      return { ...d, fixSort: d.frame + "Q" + f10kSeason };
    });

    return result;
  };
}
