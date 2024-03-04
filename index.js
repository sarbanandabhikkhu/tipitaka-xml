// application init
document.getElementById("app").innerHTML = new WebFXLoadTree("Tipiṭaka (Roman)", "./cscd/tipitaka_toc.xml");

fetch("https://sarbanandabhikkhu.github.io/tipitaka-xml/playground/mul.vin0.xml")
  .then((response) => response.text())
  .then((data) => {
    //console.log(data);
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, "application/xml");
    console.log(xml);
  });
