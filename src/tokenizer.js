export default class Tokenizer {
  constructor() {
    this.pattern = new RegExp("^[A-Za-zА-Яа-я0-9\'\"\-]$");
    this.SPACE = 0;
    this.LETTER = 1;
    this.ANOTHER = 2;
  }

  tokenizeSentence(sentence) {
    let tokens = [];
    let token = '';
    let isDivider = false;
    let tsentence = sentence.trim();

    for (let idx = 1; idx < tsentence.length; idx++) {
      let previousSymbol = tsentence.substr(idx - 1, 1);
      let currentSymbol = tsentence.substr(idx, 1);
      let previousSymbolType = this._getSymbolType(previousSymbol);
      let currentSymbolType = this._getSymbolType(currentSymbol);

      if (previousSymbolType !== currentSymbolType && !(isDivider)) {
        tokens.push(token);
        token = '';
        isDivider = true;
      }

      if (currentSymbolType > 0) {
        token += ((idx === 1) ? previousSymbol + currentSymbol : currentSymbol);
        isDivider = false;
      }
    }

    if (token.length > 0) {
      tokens.push(token);
    }
    return tokens;
  }

  _getSymbolType(symbol) {
    const charCode = symbol.charCodeAt(0);

    if (charCode === 9 || charCode === 32) {
      return this.SPACE;
    }
    else if (this.pattern.exec(symbol) !== null) {
      return this.LETTER;
    }
    else {
      return this.ANOTHER;
    }
  }
}
