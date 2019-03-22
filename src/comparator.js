import Tokenizer from './tokenizer';

export default class Comparator {
  constructor() {
    this.tokenizer = new Tokenizer();
  }

  compareSentences(base, users) {
    let addedSymbol = '';
    let addedWord = '';
    let addedAll = base;

    const baseTokens = this.tokenizer.tokenizeSentence(base);
    const usersTokens = this.tokenizer.tokenizeSentence(users);

    console.log(baseTokens, usersTokens);

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
