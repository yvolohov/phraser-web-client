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
    console.log('open symbol');
  });

  ie.button.openWord.addEventListener('click', (event) => {
    console.log('open word');
  });

  ie.button.openSentence.addEventListener('click', (event) => {
    console.log('open sentence');
  });
};

window.addEventListener('load', init);
