import Lotto from './Lotto.js';

import { LOTTO_NUMBERS, ALERT_MESSAGES } from './utils/constants.js';
import {
  isCorrectPurchaseUnit,
  isUniqueWinningNumber,
} from './utils/lottoValidation.js';
import { $ } from './utils/dom.js';
import { compareNumbers } from './utils/utils.js';

import WinningNumberInput from './views/WinningNumberInput.js';
import InputPriceView from './views/InputPriceView.js';
import PurchasedLottosView from './views/PurchasedLottosView.js';
export default class LottoController {
  constructor() {
    this.inputPriceView = new InputPriceView($('#input-price-form'));
    this.purchasedLottosView = new PurchasedLottosView($('#purchased-lottos'));
    this.winningNumberInput = new WinningNumberInput($('#input-lotto-nums'));
    this.lottos = [];
    this.winningNumbers = {};
  }

  init() {
    this.inputPriceView.show().resetInputPrice();
    this.purchasedLottosView.hide();
    this.winningNumberInput.hide();
    this.bindEvents();
  }

  bindEvents() {
    this.inputPriceView.on('submitPrice', e =>
      this.inputPriceHandler(e.detail)
    );

    this.winningNumberInput.on('submitNumbers', e =>
      this.inputNumbersHandler(e.detail)
    );
  }

  createLottos(lottoCount) {
    this.lottos = Array.from({ length: lottoCount }, () => {
      const lotto = new Lotto();
      return lotto;
    });
  }

  inputPriceHandler(inputPrice) {
    if (!isCorrectPurchaseUnit(inputPrice)) {
      this.inputPriceView.resetInputPrice();
      alert(ALERT_MESSAGES.INCORRECT_UNIT);
      return;
    }

    this.createLottos(inputPrice / LOTTO_NUMBERS.LOTTO_UNIT);
    this.purchasedLottosView.show();
    this.purchasedLottosView.renderTotalLottoCount(this.lottos.length);
    this.purchasedLottosView.renderLottoIcons(this.lottos);
    this.winningNumberInput.show();
  }

  inputNumbersHandler(winningNumbers) {
    if (!isUniqueWinningNumber(winningNumbers)) {
      alert(ALERT_MESSAGES.DUPLICATE_NUMS);
      return;
    }
    this.winningNumbers = winningNumbers;
    compareNumbers(this.lottos, this.winningNumbers);
    this.lottos.forEach(lotto => lotto.updateRank());
    this.winningNumberInput.showModal(this.countByRank());
    console.log(this.lottos);
  }

  countByRank() {
    const rankCounts = Array(5).fill(0);

    this.lottos.forEach(lotto => {
      if (lotto.rank !== Infinity) {
        rankCounts[lotto.rank - 1] += 1;
      }
    });

    return rankCounts;
  }
}
