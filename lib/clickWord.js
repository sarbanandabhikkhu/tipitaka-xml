import readData from "./readData.js";

const cped = [];

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

clickWord.search = (word) => {
  let item = [];

  function wordOption(del) {
    let word1 = "";
    [...word].map((char, i) => {
      if (word.length > i + del) {
        word1 += char;
      }
    });

    return word1;
  }

  cped.map(({ w, m }) => {
    [...Array(25)].map((_, i) => {
      if (w === wordOption(i)) {
        let vowels = "aāiīuūeoṃ";
        let sub = word.slice(0, -1);
        [...vowels].map((v) => {
          console.log(`${sub + v} ${word}`);
        });

        item.push({ w, m, word });
      }
    });
  });

  return item;
};

clickWord.init = () => {
  readData("../dic/cped.json", (data) => cped.push(...data));

  document.addEventListener("click", (e) => {
    const { getWord, search } = clickWord;
    const dics = ["All", "CPED", "PED", "PBD"];
    const items = search(getWord().toLowerCase());
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
        <h3>${items.length ? `${items.length} entries for "${items[0].word}" in ${dics[1]}` : `404`}</h3>
        <div>${
          items.length
            ? items.map(({ w, m }, i) => `<p><b>${w}</b>: ${m}</p>`).join("")
            : `
          <p>Data is not found!</p>`
        }
        </div>
      </div>
    `;
  });
};

export default clickWord;
