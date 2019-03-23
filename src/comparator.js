import Tokenizer from './tokenizer';

export default class Comparator {
  constructor() {
    this.tokenizer = new Tokenizer();
    this.STATE_BLUE = '#436EEE';
    this.STATE_RED = '#FF0000';
    this.STATE_GREEN = '#008000';
  }

  getState(base, users) {
    const baseTokens = this.tokenizer.tokenizeSentence(base);
    const usersTokens = this.tokenizer.tokenizeSentence(users);

    if (baseTokens.length < usersTokens.length) {
      return this.STATE_RED;
    }

    for (let idx = 0; idx < baseTokens.length; idx++) {
      let baseToken = baseTokens[idx];
      let usersToken = (idx < usersTokens.length) ? usersTokens[idx] : '';
      let upperBaseToken = baseToken.toUpperCase();
      let upperUsersToken = usersToken.toUpperCase();

      /* base token isn't equal users token */
      if (upperBaseToken === upperUsersToken) {
        continue;
      }

      /* this is not a last users token so it's wrong in any case */
      if (idx < usersTokens.length - 1) {
        return this.STATE_RED;
      }

      /* check if the last users token isn't finished */
      return (upperBaseToken.indexOf(upperUsersToken) === 0)
        ? this.STATE_BLUE : this.STATE_RED;
    }
    return this.STATE_GREEN;
  }

  getHints(base, users) {
    let addedSymbol = '';
    let addedWord = '';
    let addedAll = base;

    const baseTokens = this.tokenizer.tokenizeSentence(base);
    const usersTokens = this.tokenizer.tokenizeSentence(users);

    for (let idx = 0; idx < baseTokens.length; idx++) {
      let baseToken = baseTokens[idx];
      let usersToken = (idx < usersTokens.length) ? usersTokens[idx] : '';
      let upperBaseToken = baseToken.toUpperCase();
      let upperUsersToken = usersToken.toUpperCase();

      if (upperBaseToken === upperUsersToken) {
        addedSymbol = addedSymbol + ((idx > 0) ? ' ' : '') + baseToken;
        addedWord = addedWord + ((idx > 0) ? ' ' : '') + baseToken;
        continue;
      }

      let incompleteToken = '';

      for (let sIdx = 0; sIdx < baseToken.length; sIdx++) {
        let baseSymbol = baseToken.charAt(sIdx);
        let usersSymbol = (sIdx < usersToken.length) ? usersToken.charAt(sIdx) : '';
        let upperBaseSymbol = baseSymbol.toUpperCase();
        let upperUsersSymbol = usersSymbol.toUpperCase();
        incompleteToken += baseSymbol;

        if (upperBaseSymbol !== upperUsersSymbol) {
          break;
        }
      }
      addedSymbol = addedSymbol + ((idx > 0) ? ' ' : '') + incompleteToken;
      addedWord = addedWord + ((idx > 0) ? ' ' : '') + baseToken;
      break;
    }
    return {addedSymbol, addedWord, addedAll};
  }
}
