import getInterfaceElements from './get-interface-elements';
import TestHandler from './test-handler';

const init = () => {
  const ie = getInterfaceElements();
  const th = new TestHandler(ie);

  ie.button.start.addEventListener('click', (event) => {
    th.startTest();
  });

  ie.button.answer.addEventListener('click', (event) => {
    th.answer();
  });

  ie.button.openSymbol.addEventListener('click', (event) => {
    th.openNextSymbol();
  });

  ie.button.openWord.addEventListener('click', (event) => {
    th.openNextWord();
  });

  ie.button.openSentence.addEventListener('click', (event) => {
    th.openAll();
  });

  ie.input.answer.addEventListener('keyup', (event) => {
    th.processFieldChange(event.keyCode);
  });
};

window.addEventListener('load', init);
