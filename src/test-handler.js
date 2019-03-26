import Comparator from './comparator';

export default class TestHandler {
  constructor(ie) {
    this.comparator = new Comparator();
    this.ie = ie;
    this.root = '';
    this.questions = [];
    this.questionIndex = -1;
  }

  startTest() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${this.root}/api/phrases`, true);
    xhr.send();
    xhr.onreadystatechange = this._start.bind(this, xhr);
  }

  startTestByStudied() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${this.root}/api/studied`, true);
    xhr.send();
    xhr.onreadystatechange = this._start.bind(this, xhr);
  }

  answer() {
    let sentenceId = this.questions[this.questionIndex].id;
    let baseSentence = this.questions[this.questionIndex].phrase;
    let usersSentence = this.ie.input.answer.value;
    let state = this.comparator.getState(baseSentence, usersSentence);
    let _update = function (xhr) {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status !== 200) {
        console.log(xhr.status + ': ' + xhr.responseText);
      }
    };

    if (state === this.comparator.STATE_GREEN) {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', `${this.root}/api/phrases/${sentenceId}`, true);
      xhr.send();
      xhr.onreadystatechange = _update.bind(this, xhr);
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
    this.ie.input.answer.focus();
  }

  openNextWord() {
    this._updateFieldValueFromHint('addedWord');
    this._updateFieldColor();
    this.ie.input.answer.focus();
  }

  openAll() {
    this._updateFieldValueFromHint('addedAll');
    this._updateFieldColor();
    this.ie.input.answer.focus();
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
    this.ie.div.question.innerText = 'Test is passed !!!';
    this.ie.input.answer.value = '';
    this.ie.input.answer.setAttribute('disabled', 'disabled');
    this.ie.button.answer.setAttribute('disabled', 'disabled');
    this.ie.button.openSymbol.setAttribute('disabled', 'disabled');
    this.ie.button.openWord.setAttribute('disabled', 'disabled');
    this.ie.button.openSentence.setAttribute('disabled', 'disabled');
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
