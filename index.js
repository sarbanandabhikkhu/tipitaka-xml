// Icons
webFXTreeConfig.rootIcon = "./assets/svg/folderIcon.svg";
webFXTreeConfig.openRootIcon = "./assets/svg/openFolderIcon.svg";
webFXTreeConfig.folderIcon = "./assets/svg/folderIcon.svg";
webFXTreeConfig.openFolderIcon = "./assets/svg/openFolderIcon.svg";
webFXTreeConfig.fileIcon = "./assets/svg/fileIcon.svg";
webFXTreeConfig.lMinusIcon = "./assets/svg/lMinusIcon.svg";
webFXTreeConfig.lPlusIcon = "./assets/svg/lPlusIcon.svg";
webFXTreeConfig.tMinusIcon = "./assets/svg/tMinusIcon.svg";
webFXTreeConfig.tPlusIcon = "./assets/svg/tPlusIcon.svg";
webFXTreeConfig.blankIcon = "./assets/svg/blankIcon.svg";
webFXTreeConfig.iIcon = "./assets/svg/iIcon.svg";
webFXTreeConfig.lIcon = "./assets/svg/lIcon.svg";
webFXTreeConfig.tIcon = "./assets/svg/tIcon.svg";

let rti;
let tree = new WebFXLoadTree("Tipiṭaka (Roman)", "./cscd/tipitaka_toc.xml");
document.write(tree);
