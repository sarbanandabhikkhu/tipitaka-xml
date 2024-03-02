import readData from "./readData.js";

const cped = [];

const clickWord = {};

clickWord.search = (word) => {
  let item = [];
  cped.map(({ w, g, m }) => {
    if (word === w) item.push({ w, g, m });
  });
  return item;
};

clickWord.getWord = () => {
  let selection = window.getSelection(),
    text = selection.anchorNode.data,
    index = selection.anchorOffset,
    symbols = /[a-zA-Z0-9āīūñṅṇṭḍṃḷঅ-ৰ]/,
    pmarks = /[\.\,\;\!\?\’\”\(\)\{\}\[\]\-\—\…]/g,
    symbol = "a",
    word = "";

  while (symbols.test(symbol) && symbol !== undefined) {
    symbol = text[index--];
  }
  index += 2;
  symbol = "a";
  while (symbols.test(symbol) && index < text.length) {
    symbol = text[index++];
    word += symbol;
  }
  return word.replace(pmarks, ``).trim();
};

clickWord.init = () => {
  readData("../dic/cped.json", (data) => cped.push(...data));

  document.addEventListener("click", (e) => {
    // if (e.target.parentNode.tagName !== "ARTICLE") return;

    const panel = document.querySelector("#dic-panel");

    if (e.target.getAttribute("id") === "dic-back-btn") {
      panel.style.display = "none";
      panel.innerHTML = "";
      return;
    }

    const { getWord, search } = clickWord,
      items = search(getWord().toLowerCase()),
      dics = ["All", "CPED", "PED", "PBD"];

    panel.style.display = "block";
    panel.innerHTML = `
      <div id="dic-action">
        <div id="dic-action-left">
          <img id="dic-back-btn" src="../icons/angle-left.svg" />
          <input type="search" value="${getWord()}"/>
        </div>
        <div id="dic-action-btns">
          ${dics.map((d) => `<button>${d}</button>`).join("")}
        </div>
      </div>
      <div id="dic-body">${
        items.length
          ? items.map(({ w, g, m }) => {
              return `<h3>${items.length} entries for ${w} in ${dics[1]}</h3>
              <div><b>${w}</b>: ${m}</div>`;
            })
          : `<h3>404</h3><div>Data is not found!</div>`
      }</div>
    `;
  });
};

export default clickWord;
