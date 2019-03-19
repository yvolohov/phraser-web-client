export default () => {
  return {
    button: {
      start: document.getElementById('button-start'),
      answer: document.getElementById('button-answer'),
      openSymbol: document.getElementById('button-open-symbol'),
      openWord: document.getElementById('button-open-word'),
      openSentence: document.getElementById('button-open-sentence')
    },
    input: {
      answer: document.getElementById('input-answer')
    },
    div: {
      startScreenElements: document.getElementsByClassName('start-screen'),
      mainScreenElements: document.getElementsByClassName('main-screen'),
      question: document.getElementById('text-question'),
      progress: document.getElementById('text-progress')
    }
  };
};
