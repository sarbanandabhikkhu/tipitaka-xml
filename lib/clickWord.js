const cped = [
  {
    w: "so",
    m: `he. ((nom. sin. of ta), m.)`,
  },
  {
    w: "bhagavā",
    m: `fortunate. (m.), the Buddha. (adj.)`,
  },
  {
    w: "arahaṃ",
    m: `worthy of; deserving. (adj.)`,
  },
  {
    w: "sammāsambuddho",
    m: `the perfectly Enlightened One. (m.)`,
  },
  {
    w: "sugato",
    m: `faring well; happy. (m.), the Buddha. (adj.)`,
  },
  {
    w: "anuttaro",
    m: `incomparable; unsurpassed. (adj.)`,
  },
  {
    w: "tena",
    m: `on account of it; because of it. (ind.)`,
  },
  {
    w: "kho",
    m: `indeed; really; surely; (an enclictic particle of affirmative and emphasis). (ind.)`,
  },
  {
    w: "pana",
    m: `and; yet; but; out the contrary; and now; more over. [(Adversative and interogative particle) ind.] (ind.)`,
  },
  {
    w: "samayena",
    m: `time; congregation; season; occasion; religion. (m.)`,
  },
];

const clickWord = {};

clickWord.search = (word) => {
  const item = [];
  cped.map(({ w, m }) => {
    if (word === w) item.push({ w, m });
  });
  if (item.length) {
    alert(item.map(({ w, m }) => `${w}: ${m}\n`));
  }
};

clickWord.getWord = ({ target }) => {
  if (target.parentNode.tagName !== "BODY") alert("Not clickable area!");

  let selection = window.getSelection(),
    text = selection.anchorNode.data,
    index = selection.anchorOffset,
    symbol = "a";

  while (/[a-zA-z0-9āīūñṅṇṭḍṃḷঅ-ৰ]/.test(symbol) && symbol !== undefined) {
    symbol = text[index--];
  }
  index += 2;
  let word = "";
  symbol = "a";
  while (/[a-zA-Z0-9āīūñṅṇṭḍṃḷঅ-ৰ]/.test(symbol) && index < text.length) {
    symbol = text[index++];
    word += symbol;
  }
  return word.replace(/[\,\;\.\!\?\’\”\{\}\[\]]/g, ``).trim();
};

clickWord.init = () => {
  document.addEventListener("click", (e) => {
    const word = clickWord.getWord(e);
    clickWord.search(word.toLowerCase());
  });
};

export default clickWord;
