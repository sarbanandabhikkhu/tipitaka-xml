function saveFile(data, fileType) {
  if (window.DOMParser) {
    const parser = new DOMParser(),
      xmlDoc = parser.parseFromString(data, "text/xml"),
      xmlText = new XMLSerializer().serializeToString(xmlDoc);

    const path = window.location.pathname,
      blob = new Blob([xmlText], { fileType }),
      anchor = document.createElement("a"),
      webUrl = window.webkitURL;

    null !== webUrl && (anchor.href = webUrl.createObjectURL(blob));
    anchor.download = path.substring(path.lastIndexOf("/") + 1);
    anchor.href = window.URL.createObjectURL(blob);
    anchor.style = "display:none";
    document.body.appendChild(anchor);

    anchor.click();
    anchor.remove();
  }
}

export default saveFile;
