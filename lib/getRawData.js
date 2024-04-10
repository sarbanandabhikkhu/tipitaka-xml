import saveFile from "./saveFile.js";

const chapter = [];

function getRawData() {
  Array.from(document.querySelectorAll("p")).map((ele, i) => {
    const { outerText, attributes, childNodes } = ele;

    chapter.push({
      raw: outerText,
      tag: attributes[0].value !== "text" ? attributes[0].value : "para",
      nodes: Array.from(childNodes).map((ele, i) => {
        const { nodeType, tagName, attributes, outerText } = ele;

        if (nodeType === 1 && tagName === "A") {
          const anchor = attributes[0].value.split(".");

          if (anchor[0].match(/para*/)) {
            return `para=>${anchor[0].split("para")[1]}`;
          }

          return `${anchor[0]}=>${anchor[1]}`;
        }

        if (nodeType === 1 && tagName === "SPAN") {
          return `${attributes[0].value}=>${outerText}`;
        }

        if (nodeType === 3) return `text=>${ele.textContent}`;
      }),
    });
  });

  const data = `
    <page>${chapter
      .map(({ raw, tag }) => {
        return `
          <${tag}>
            <rmn>${raw}</rmn>
            <ben>বাংলা</ben>
            <cha>Chakma</cha>
          </${tag}>`;
      })
      .join("")}
    </page>`;
  const actionBtn = document.querySelector(".action-btn");
  let button = document.createElement("button");
  button.setAttribute("class", "get-raw-xml");
  button.textContent = `Get Raw XML`;

  actionBtn.addEventListener("click", () => {
    if (!document.querySelector(".get-raw-xml")) {
      document.body.appendChild(button);
    } else {
      button.remove();
    }
  });

  button.addEventListener("click", () => {
    saveFile(data, "text/xml");
    button.remove();
  });
}

export default getRawData;
