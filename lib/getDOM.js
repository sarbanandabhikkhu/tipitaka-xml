const getDOM = (target) => {
  const { nodeName, nodeType, textContent, attributes, childNodes } = target;
  const types = [
    null,
    "Element",
    "Attribute",
    "Text",
    "CDATA",
    "EntityReference", // Deprecated
    "Entity", // Deprecated
    "ProcessingInstruction",
    "Comment",
    "Document",
    "DocumentType",
    "DocumentFragment",
    "Notation", // Deprecated
  ];
  try {
    const obj = {};
    obj.name = nodeName;
    obj.type = types[nodeType];

    if (nodeType === (3 || 4 || 8)) {
      obj.text = textContent;
    } else {
      if (attributes) {
        obj.attributes = {};
        for (const attr of attributes) {
          obj.attributes[attr.name] = attr.value;
        }
      }
      if (childNodes.length) {
        obj.children = [];
        for (const child of childNodes) {
          obj.children.push(getDOM(child));
        }
      }
    }
    return obj;
  } catch (err) {
    console.error(err);
  }
};

console.log(getDOM(document.body));
