import getJSON from "./getJSON.js";
import clickWord from "./clickWord.js";
import inspectElement from "./inspectElement.js";

const environment = {
  development: () => {
    // getJSON.init();
    clickWord.init();
    // inspectElement();
  },
  production: () => {},
  init: () => {
    environment.development();
  },
};

export default environment;
