const getJSON = {
  fileName: () => {
    const e = window.location.pathname;
    return e.substring(e.lastIndexOf("/") + 1).replace(/\.xml$/, ".json");
  },
  save: (e) => {
    const t = JSON.stringify(e, null, 2),
      a = new Blob([t], { fileType: "application/json" }),
      n = document.createElement("a");
    (n.download = getJSON.fileName()),
      null !== window.webkitURL && (n.href = window.webkitURL.createObjectURL(a)),
      (n.href = window.URL.createObjectURL(a)),
      (n.style.display = "none"),
      document.body.appendChild(n),
      n.click();
  },
  attributes: (e) => {
    const t = Array.from(e);
    if (t.length > 1) {
      const e = [];
      return (
        t.map((t) => {
          e.push({ name: t.name, value: t.value });
        }),
        e
      );
    }
    return { name: t[0].name, value: t[0].value };
  },
  init: () => {
    const e = [];
    Array.from(document.querySelectorAll("p")).map((t) => {
      const { childNodes: a, tagName: n, attributes: r, innerText: o } = t;
      if (Array.from(a).length > 1) {
        const t = [];
        Array.from(a).map((e) => {
          const { nodeType: a, tagName: n, attributes: r, innerText: o, wholeText: i } = e;
          1 === a &&
            "" !== o &&
            t.push({
              tagName: n.toLowerCase(),
              attributes: getJSON.attributes(r),
              innerText: o,
            }),
            3 === a && t.push(i);
        }),
          e.push({
            tagName: n.toLowerCase(),
            attributes: getJSON.attributes(r),
            children: t,
            innerText: o,
          });
      } else
        e.push({
          tagName: n.toLowerCase(),
          attributes: getJSON.attributes(r),
          innerText: o,
        });
    }),
      getJSON.save(e);
  },
};

export default getJSON;
