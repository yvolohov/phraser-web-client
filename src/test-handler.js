import Comparator from './comparator';

export default class TestHandler {
  constructor(ie) {
    this.comparator = new Comparator();
    this.ie = ie;
    this.root = 'http://localhost:8000';
    this.questions = [];
    this.questionIndex = -1;
  }

  startTest() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${this.root}/api/phrases`, true);
    xhr.send();
    xhr.onreadystatechange = this._start.bind(this, xhr);
  }

  answer() {
    let baseSentence = this.questions[this.questionIndex].phrase;
    let usersSentence = this.ie.input.answer.value;
    let state = this.comparator.getState(baseSentence, usersSentence);

    if (state === this.comparator.STATE_GREEN) {
      this._next();
    }
    this.ie.input.answer.focus();
  }

  processFieldChange(keyCode) {
    this._updateFieldColor();

    if (keyCode !== 13) {
      return;
    }
    this.answer();
  }

  openNextSymbol() {
    this._updateFieldValueFromHint('addedSymbol');
    this._updateFieldColor();
  }

  openNextWord() {
    this._updateFieldValueFromHint('addedWord');
    this._updateFieldColor();
  }

  openAll() {
    this._updateFieldValueFromHint('addedAll');
    this._updateFieldColor();
  }

  _start(xhr) {
    if (xhr.readyState !== 4) {
      return;
    }

    if (xhr.status !== 200) {
      console.log(xhr.status + ': ' + xhr.responseText);
      return;
    }

    const data = JSON.parse(xhr.responseText);
    this._setVisibility(this.ie.div.startScreenElements, false);
    this._setVisibility(this.ie.div.mainScreenElements, true);

    if (data.length === 0) {
      this.ie.div.progress.innerText = '';
      this.ie.div.question.innerText = 'Error: Cannot load questions from DB !!!';
      return;
    }

    this.ie.input.answer.removeAttribute('disabled');
    this.ie.input.answer.focus();
    this.ie.button.answer.removeAttribute('disabled');
    this.ie.button.openSymbol.removeAttribute('disabled');
    this.ie.button.openWord.removeAttribute('disabled');
    this.ie.button.openSentence.removeAttribute('disabled');
    this.questions = data;
    this._next();
  }

  _next() {
    this.questionIndex++;

    if (this.questionIndex >= this.questions.length) {
      this._end();
      return;
    }

    const progress = `Q. ${this.questionIndex + 1} : ${this.questions.length}`;
    const question = this.questions[this.questionIndex].translation;
    this.ie.div.progress.innerText = progress;
    this.ie.div.question.innerText = question;
    this.ie.input.answer.value = '';
    this._updateFieldColor();
  }

  _end() {

  }

  _updateFieldValueFromHint(key) {
    let baseSentence = this.questions[this.questionIndex].phrase;
    let usersSentence = this.ie.input.answer.value;
    let hints = this.comparator.getHints(baseSentence, usersSentence);
    this.ie.input.answer.value = hints[key];
  }

  _updateFieldColor() {
    let baseSentence = this.questions[this.questionIndex].phrase;
    let usersSentence = this.ie.input.answer.value;
    let state = this.comparator.getState(baseSentence, usersSentence);
    this.ie.input.answer.style.color = state;
  }  

  _setVisibility(elements, status) {
    for (let element of elements) {
      element.style.display = (status) ? 'block' : 'none';
    }
  }
}
