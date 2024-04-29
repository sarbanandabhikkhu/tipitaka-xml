import readData from "./readData.js";

const dics = ["All", "CPED", "PED", "PBD"];
const cped = [];
const ped = [];

const clickWord = {};

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

  if (word.trim() !== "") return word.replace(pmarks, ``).trim();
};

clickWord.search = (word, dic) => {
  const VOWELS = "aāiīuūeoṃ";
  const LENGTH = 25;
  let ITEMS = [];

  function wordOption(del) {
    let word1 = "";
    [...word].map((char, i) => {
      if (word.length > i + del) {
        word1 += char;
      }
    });

    return word1;
  }

  function pushItem(w, m, word, dic) {
    [...Array(LENGTH)].map((_, i) => {
      if (w === wordOption(i)) {
        [...VOWELS].map((v) => console.log(`${word.slice(0, -1) + v} ${word}`));
        ITEMS.push({ w, m, word, d: dic });
      }
    });
  }

  if (dic === "All") {
    cped.map(({ w, m }) => pushItem(w, m, word, dics[1]));
    ped.map(({ w, m }) => pushItem(w, m, word, dics[2]));
  }

  return ITEMS;
};

clickWord.init = () => {
  readData("../dic/cped.json", (data) => cped.push(...data));
  readData("../dic/ped.json", (data) => ped.push(...data));

  document.addEventListener("click", (e) => {
    const { getWord, search } = clickWord;
    const items = search(getWord().toLowerCase(), dics[0]);
    const panel = document.querySelector("#dic-panel");

    if (e.target.getAttribute("id") === "dic-back-btn") {
      panel.style.display = "none";
      panel.innerHTML = "";
      return;
    }

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
      <div id="dic-body">
        <h3>${items.length ? `${items.length} entries for "${items[0].word}" in ${dics[0]} Dictioneries` : `404`}</h3>
        <div>${
          items.length
            ? items
                .map(
                  ({ w, m, d }, i) =>
                    `<p><b>${i + 1}.${d === "CPED" ? ` ${w}:` : ""}</b> ${m} <b class="ref-dic">[${d}]</b></p>`
                )
                .join("")
            : `<p>Data is not found!</p>`
        }
        </div>
      </div>
    `;
  });
};

export default clickWord;
