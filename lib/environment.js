import getJSON from "./getJSON.js";
import clickWord from "./clickWord.js";
import getRawData from "./getRawData.js";
import inspectElement from "./inspectElement.js";

const environment = {
  development: () => {
    // getJSON.init();
    clickWord.init();
    getRawData();
    // inspectElement();
  },
  production: () => {},
  init: () => {
    const actionBtn = document.createElement("button");
    actionBtn.setAttribute("class", "action-btn");
    actionBtn.innerHTML = `<img src="../../icons/info.svg" />`;
    document.body.appendChild(actionBtn);

    environment.development();
  },
};

export default environment;
