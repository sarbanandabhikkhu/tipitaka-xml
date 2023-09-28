const readXML = (xmlFile) => {
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", xmlFile, false);
  if (xmlhttp.overrideMimeType) {
    xmlhttp.overrideMimeType("text/xml");
  }
  xmlhttp.send();
  return xmlhttp.responseXML.xml;
};

export default readXML;
