const webFXTreeConfig = {
  ic_i: "./assets/svg/iIcon.svg",
  ic_l: "./assets/svg/lIcon.svg",
  ic_t: "./assets/svg/tIcon.svg",
  ic_lplus: "./assets/svg/lPlusIcon.svg",
  ic_tplus: "./assets/svg/tPlusIcon.svg",
  ic_lminus: "./assets/svg/lMinusIcon.svg",
  ic_tminus: "./assets/svg/tMinusIcon.svg",
  ic_blank: "./assets/svg/blankIcon.svg",
  ic_file: "./assets/svg/fileIcon.svg",
  ic_folder: "./assets/svg/folderIcon.svg",
  ic_openfolder: "./assets/svg/openFolderIcon.svg",
  defaultText: "Tree Item",
  loadingText: "Loading...",
  loadErrorText: "loading Error...!",
  emptyErrorText: "Does not contain any tree items!",
  defaultAction: "javascript:void(0)",
  defaultBehavior: "classic",
  usePersistence: !0,
};

const webFXTreeHandler = {
  all: {},
  idCounter: 0,
  idPrefix: "webfx-tree-object-",
  behavior: null,
  selected: null,
  onSelect: null,
  getId: function () {
    return this.idPrefix + this.idCounter++;
  },
  toggle: function (e) {
    this.all[e.id.replace("-plus", "")].toggle();
  },
  select: function (e) {
    this.all[e.id.replace("-icon", "")].select();
  },
  focus: function (e) {
    this.all[e.id.replace("-anchor", "")].focus();
  },
  blur: function (e) {
    this.all[e.id.replace("-anchor", "")].blur();
  },
  keydown: function (e, t) {
    return this.all[e.id].keydown(t.keyCode);
  },
  cookies: new WebFXCookie(),
  insertHTMLBeforeEnd: function (e, t) {
    if (null === e.insertAdjacentHTML) {
      let i = e.ownerDocument.createRange();
      i.selectNodeContents(e);
      i.collapse(!1);
      e.appendChild(i.createContextualFragment(t));
    } else e.insertAdjacentHTML("BeforeEnd", t);
  },
};

function WebFXCookie() {
  document.cookie.length && `${this.cookies} ${document.cookie}`;
}

function WebFXTreeAbstractNode(e, t) {
  this.childNodes = [];
  this.id = webFXTreeHandler.getId();
  this.text = e || webFXTreeConfig.defaultText;
  this.action = t || webFXTreeConfig.defaultAction;
  this._last = !1;
  webFXTreeHandler.all[this.id] = this;
}

function WebFXTree(e, t, o, i, n) {
  this.base = WebFXTreeAbstractNode;
  this.base(e, t);
  this.icon = i || webFXTreeConfig.ic_folder;
  this.openIcon = n || webFXTreeConfig.ic_openfolder;
  if (webFXTreeConfig.usePersistence) {
    const { getCookie } = webFXTreeHandler.cookies;
    this.open = "0" !== getCookie(this.id.substr(18, this.id.length - 18));
  } else this.open = !0;
  this.folder = !0;
  this.rendered = !1;
  this.onSelect = null;
  webFXTreeHandler.behavior ||
    (webFXTreeHandler.behavior = o || webFXTreeConfig.defaultBehavior);
}

function WebFXTreeItem(e, t, o, i, n) {
  this.base = WebFXTreeAbstractNode;
  this.base(e, t);
  if (webFXTreeConfig.usePersistence) {
    const { getCookie } = webFXTreeHandler.cookies;
    this.open = "1" === getCookie(this.id.substr(18, this.id.length - 18));
  } else this.open = !1;
  i && (this.icon = i);
  n && (this.openIcon = n);
  o && o.add(this);
}

function WebFXLoadTree(e, t, o, i, n, r) {
  this.WebFXTree = WebFXTree;
  this.WebFXTree(e, o, i, n, r);
  this.src = t;
  this.loading = !1;
  this.loaded = !1;
  this.errorText = "";
  this.open
    ? _startLoadXmlTree(this.src, this)
    : ((this._loadingItem = new WebFXTreeItem(webFXTreeConfig.loadingText)),
      this.add(this._loadingItem));
}

function WebFXLoadTreeItem(e, t, o, i, n, r) {
  this.WebFXTreeItem = WebFXTreeItem;
  this.WebFXTreeItem(e, o, i, n, r);
  this.src = t;
  this.loading = !1;
  this.loaded = !1;
  this.errorText = "";
  this.open
    ? _startLoadXmlTree(this.src, this)
    : ((this._loadingItem = new WebFXTreeItem(webFXTreeConfig.loadingText)),
      this.add(this._loadingItem));
}

function _startLoadXmlTree(e, t) {
  if (!t.loading && !t.loaded) {
    t.loading = !0;
    const o = XmlHttp.create();
    o.open("GET", e, !0);
    o.onreadystatechange = () => {
      4 === o.readyState && _xmlFileLoaded(o.responseXML, t);
    };
    window.setTimeout(() => o.send(null), 10);
  }
}

function _xmlTreeToJsTree(e) {
  let o = e.getAttribute("text"),
    i = e.getAttribute("action"),
    n = e.getAttribute("icon"),
    r = e.getAttribute("openIcon"),
    s = e.getAttribute("src"),
    d = e.getAttribute("target"),
    m = null !== s && "" !== s,
    l = e.childNodes,
    c = l.length,
    h = 0,
    t = m
      ? new WebFXLoadTreeItem(o, s, i, null, n, r)
      : new WebFXTreeItem(o, i, null, n, r);
  "" !== d && (t.target = d);
  for (l, c, h; h < c; h++)
    "tree" === l[h].tagName && t.add(_xmlTreeToJsTree(l[h]), !0);
  return t;
}

function _xmlFileLoaded(e, t) {
  if (!t.loaded) {
    let l = null === e || null === e.documentElement,
      o = !1,
      i = !1;
    if (((t.loaded = !0), (t.loading = !1), l)) {
      alert(e.xml);
      t.errorText = webFXTreeConfig.loadErrorText;
    } else {
      let n = e.documentElement.childNodes,
        r = n.length,
        s = 0;
      for (n, r, s; s < r; s++)
        "tree" === n[s].tagName &&
          ((i = !0), (o = !0), t.add(_xmlTreeToJsTree(n[s]), !0));
      i || (t.errorText = webFXTreeConfig.emptyErrorText);
    }
    null != t._loadingItem && (t._loadingItem.remove(), (o = !0));
    o && t.indent();
    "" !== t.errorText && (window.status = t.errorText);
  }
}

function getDomDocumentPrefix() {
  if (getDomDocumentPrefix.prefix) return getDomDocumentPrefix.prefix;
  const e = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
  for (e, t = 0; t < e.length; t++)
    try {
      return (
        new ActiveXObject(e[t] + ".DomDocument"),
        (getDomDocumentPrefix.prefix = e[t])
      );
    } catch (e) {}
  throw new Error("Could not find an installed XML parser");
}

function getXmlHttpPrefix() {
  if (getXmlHttpPrefix.prefix) return getXmlHttpPrefix.prefix;
  const e = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
  for (e, t = 0; t < e.length; t++)
    try {
      return (
        new ActiveXObject(e[t] + ".XmlHttp"), (getXmlHttpPrefix.prefix = e[t])
      );
    } catch (e) {}
  throw new Error("Could not find an installed XML parser");
}

function XmlHttp() {}
function XmlDocument() {}

WebFXCookie.prototype.setCookie = function (e, t) {
  document.cookie = `${e}=${escape(t)}`;
};

WebFXCookie.prototype.getCookie = function (e) {
  if (this.cookies) {
    let t = this.cookies.indexOf(` ${e}=`);
    if (-1 === t) return null;
    let o = this.cookies.indexOf(";", t);
    -1 === o && (o = this.cookies.length), (o -= t);
    let i = this.cookies.substr(t, o);
    return unescape(
      i.substr(i.indexOf("=") + 1, i.length - i.indexOf("=") + 1)
    );
  }
  return null;
};

WebFXTreeAbstractNode.prototype.add = function (e, t) {
  e.parentNode = this;
  this.childNodes[this.childNodes.length] = e;
  let o = this,
    m = this.childNodes.length >= 2,
    n = this.childNodes[this.childNodes.length - 2];
  for (m && (n._last = !1); o.parentNode; ) o = o.parentNode;
  if (o.rendered) {
    const cn = this.childNodes,
      { ic_t, ic_tplus, ic_tminus, ic_folder, ic_openfolder } = webFXTreeConfig;
    cn.length >= 2 &&
      ((document.getElementById(cn[cn.length - 2].id + "-plus").src = cn[
        cn.length - 2
      ].folder
        ? cn[cn.length - 2].open
          ? ic_tminus
          : ic_tplus
        : ic_t),
      (cn[cn.length - 2].plusIcon = ic_tplus),
      (cn[cn.length - 2].minusIcon = ic_tminus),
      (cn[cn.length - 2]._last = !1));
    this._last = !0;
    for (let i = this; i.parentNode; ) {
      let l = i.parentNode.childNodes.length,
        m = i.parentNode.childNodes,
        n = 0;
      for (n; n < l && i.id !== m[n].id; n++);
      n == l - 1 ? (i.parentNode._last = !0) : (i.parentNode._last = !1);
      i = i.parentNode;
    }
    webFXTreeHandler.insertHTMLBeforeEnd(
      document.getElementById(this.id + "-cont"),
      e.toString()
    );
    this.folder ||
      this.openIcon ||
      ((this.icon = ic_folder), (this.openIcon = ic_openfolder)),
      this.folder || ((this.folder = !0), this.collapse(!0)),
      t || this.indent();
  }
  return e;
};

WebFXTreeAbstractNode.prototype.toggle = function () {
  this.folder && (this.open ? this.collapse() : this.expand());
};

WebFXTreeAbstractNode.prototype.select = function () {
  document.getElementById(this.id + "-anchor").focus();
};

WebFXTreeAbstractNode.prototype.deSelect = function () {
  (document.getElementById(this.id + "-anchor").className = ""),
    (webFXTreeHandler.selected = null);
};

WebFXTreeAbstractNode.prototype.focus = function () {
  webFXTreeHandler.selected &&
    webFXTreeHandler.selected != this &&
    webFXTreeHandler.selected.deSelect(),
    (webFXTreeHandler.selected = this),
    this.openIcon &&
      "classic" != webFXTreeHandler.behavior &&
      (document.getElementById(this.id + "-icon").src = this.openIcon),
    (document.getElementById(this.id + "-anchor").className = "selected"),
    document.getElementById(this.id + "-anchor").focus(),
    webFXTreeHandler.onSelect && webFXTreeHandler.onSelect(this);
};

WebFXTreeAbstractNode.prototype.blur = function () {
  this.openIcon &&
    "classic" != webFXTreeHandler.behavior &&
    (document.getElementById(this.id + "-icon").src = this.icon),
    (document.getElementById(this.id + "-anchor").className =
      "selected-inactive");
};

WebFXTreeAbstractNode.prototype.doExpand = function () {
  "classic" == webFXTreeHandler.behavior &&
    (document.getElementById(this.id + "-icon").src = this.openIcon),
    this.childNodes.length &&
      (document.getElementById(this.id + "-cont").style.display = "block"),
    (this.open = !0),
    webFXTreeConfig.usePersistence &&
      webFXTreeHandler.cookies.setCookie(
        this.id.substr(18, this.id.length - 18),
        "1"
      );
};

WebFXTreeAbstractNode.prototype.doCollapse = function () {
  "classic" == webFXTreeHandler.behavior &&
    (document.getElementById(this.id + "-icon").src = this.icon),
    this.childNodes.length &&
      (document.getElementById(this.id + "-cont").style.display = "none"),
    (this.open = !1),
    webFXTreeConfig.usePersistence &&
      webFXTreeHandler.cookies.setCookie(
        this.id.substr(18, this.id.length - 18),
        "0"
      );
};

WebFXTreeAbstractNode.prototype.expandAll = function () {
  this.expandChildren(), this.folder && !this.open && this.expand();
};

WebFXTreeAbstractNode.prototype.expandChildren = function () {
  for (let e = 0; e < this.childNodes.length; e++)
    this.childNodes[e].expandAll();
};

WebFXTreeAbstractNode.prototype.collapseAll = function () {
  this.collapseChildren(), this.folder && this.open && this.collapse(!0);
};

WebFXTreeAbstractNode.prototype.collapseChildren = function () {
  for (let e = 0; e < this.childNodes.length; e++)
    this.childNodes[e].collapseAll();
};

WebFXTreeAbstractNode.prototype.indent = function (e, t, o, i, n) {
  null == e && (e = -2);
  for (let r = this.childNodes.length - 1; r >= 0; r--)
    if (this.childNodes[r].indent(e + 1, t, o, i)) return;
  if (t && i >= this._level && document.getElementById(this.id + "-plus"))
    return (
      this.folder
        ? ((document.getElementById(this.id + "-plus").src = this.open
            ? webFXTreeConfig.ic_lminus
            : webFXTreeConfig.ic_lplus),
          (this.plusIcon = webFXTreeConfig.ic_lplus),
          (this.minusIcon = webFXTreeConfig.ic_lminus))
        : n &&
          (document.getElementById(this.id + "-plus").src =
            webFXTreeConfig.ic_l),
      1
    );
  const s = document.getElementById(this.id + "-indent-" + e);
  return (
    s &&
      (s._last || (t && o)
        ? (s.src = webFXTreeConfig.ic_blank)
        : (s.src = webFXTreeConfig.ic_i)),
    0
  );
};

WebFXTree.prototype = new WebFXTreeAbstractNode();
WebFXTree.prototype.setBehavior = function (e) {
  webFXTreeHandler.behavior = e;
};
WebFXTree.prototype.getBehavior = function (e) {
  return webFXTreeHandler.behavior;
};
WebFXTree.prototype.getSelected = function () {
  return webFXTreeHandler.selected ? webFXTreeHandler.selected : null;
};
WebFXTree.prototype.remove = function () {};
WebFXTree.prototype.expand = function () {
  this.doExpand();
};

WebFXTree.prototype.collapse = function (e) {
  e || this.focus(), this.doCollapse();
};
WebFXTree.prototype.getFirst = function () {
  return null;
};
WebFXTree.prototype.getLast = function () {
  return null;
};
WebFXTree.prototype.getNextSibling = function () {
  return null;
};
WebFXTree.prototype.getPreviousSibling = function () {
  return null;
};
WebFXTree.prototype.keydown = function (e) {
  return 39 == e
    ? (this.open
        ? this.childNodes.length && this.childNodes[0].select()
        : this.expand(),
      !1)
    : 37 == e
    ? (this.collapse(), !1)
    : 40 != e ||
      !this.open ||
      !this.childNodes.length ||
      (this.childNodes[0].select(), !1);
};

WebFXTree.prototype.toString = function () {
  for (
    var e = `<div id="${
        this.id
      }" ondblclick="webFXTreeHandler.toggle(this)" class="webfx-tree-item" onkeydown="return webFXTreeHandler.keydown(this, event)">
          <img id="${this.id}-icon" class="webfx-tree-icon" src="${
        "classic" == webFXTreeHandler.behavior && this.open
          ? this.openIcon
          : this.icon
      }" onclick="webFXTreeHandler.select(this)"><a href="${this.action}" id="${
        this.id
      }-anchor" onfocus="webFXTreeHandler.focus(this)" onblur="webFXTreeHandler.blur(this)"${
        this.target ? ' target="' + this.target + '"' : ""
      }">${this.text}</a></div><div id="${
        this.id
      }-cont" class="webfx-tree-container" style="display: ${
        this.open ? "block" : "none"
      }">`,
      t = [],
      o = 0;
    o < this.childNodes.length;
    o++
  )
    t[o] = this.childNodes[o].toString(o, this.childNodes.length);
  return (this.rendered = !0), e + t.join("") + "</div>";
};

WebFXTreeItem.prototype = new WebFXTreeAbstractNode();
WebFXTreeItem.prototype.remove = function () {
  var e = document.getElementById(this.id + "-plus").src,
    t = this.parentNode,
    o = this.getPreviousSibling(!0),
    i = this.getNextSibling(!0),
    n =
      (this.parentNode.folder, !i || !i.parentNode || i.parentNode.id != t.id);
  this.getPreviousSibling().focus(),
    this._remove(),
    0 == t.childNodes.length &&
      ((document.getElementById(t.id + "-cont").style.display = "none"),
      t.doCollapse(),
      (t.folder = !1),
      (t.open = !1)),
    (i && !n) || t.indent(null, !0, n, this._level, t.childNodes.length),
    o != t ||
      t.childNodes.length ||
      ((o.folder = !1),
      (o.open = !1),
      (e = (e = document.getElementById(o.id + "-plus").src)
        .replace("minus", "")
        .replace("plus", "")),
      (document.getElementById(o.id + "-plus").src = e),
      (document.getElementById(o.id + "-icon").src = webFXTreeConfig.ic_file)),
    document.getElementById(o.id + "-plus") &&
      t == o.parentNode &&
      ((e = e.replace("minus", "").replace("plus", "")),
      (document.getElementById(o.id + "-plus").src = e));
};

WebFXTreeItem.prototype._remove = function () {
  for (var e = this.childNodes.length - 1; e >= 0; e--)
    this.childNodes[e]._remove();
  for (e = 0; e < this.parentNode.childNodes.length; e++)
    if (this == this.parentNode.childNodes[e]) {
      for (var t = e; t < this.parentNode.childNodes.length; t++)
        this.parentNode.childNodes[t] = this.parentNode.childNodes[t + 1];
      (this.parentNode.childNodes.length -= 1),
        e + 1 == this.parentNode.childNodes.length &&
          (this.parentNode._last = !0);
      break;
    }
  webFXTreeHandler.all[this.id] = null;
  var o = document.getElementById(this.id);
  o && o.parentNode.removeChild(o),
    (o = document.getElementById(this.id + "-cont")) &&
      o.parentNode.removeChild(o);
};

WebFXTreeItem.prototype.expand = function () {
  this.doExpand(),
    (document.getElementById(this.id + "-plus").src = this.minusIcon);
};

WebFXTreeItem.prototype.collapse = function (e) {
  e || this.focus(),
    this.doCollapse(),
    (document.getElementById(this.id + "-plus").src = this.plusIcon);
};

WebFXTreeItem.prototype.getFirst = function () {
  return this.childNodes[0];
};

WebFXTreeItem.prototype.getLast = function () {
  return this.childNodes[this.childNodes.length - 1].open
    ? this.childNodes[this.childNodes.length - 1].getLast()
    : this.childNodes[this.childNodes.length - 1];
};

WebFXTreeItem.prototype.getNextSibling = function () {
  for (
    var e = 0;
    e < this.parentNode.childNodes.length &&
    this != this.parentNode.childNodes[e];
    e++
  );
  return ++e == this.parentNode.childNodes.length
    ? this.parentNode.getNextSibling()
    : this.parentNode.childNodes[e];
};

WebFXTreeItem.prototype.getPreviousSibling = function (e) {
  for (
    var t = 0;
    t < this.parentNode.childNodes.length &&
    this != this.parentNode.childNodes[t];
    t++
  );
  return 0 == t
    ? this.parentNode
    : this.parentNode.childNodes[--t].open ||
      (e && this.parentNode.childNodes[t].folder)
    ? this.parentNode.childNodes[t].getLast()
    : this.parentNode.childNodes[t];
};

WebFXTreeItem.prototype.keydown = function (e) {
  if (39 == e && this.folder)
    return this.open ? this.getFirst().select() : this.expand(), !1;
  if (37 == e)
    return this.open ? this.collapse() : this.parentNode.select(), !1;
  if (40 == e) {
    if (this.open) this.getFirst().select();
    else {
      var t = this.getNextSibling();
      t && t.select();
    }
    return !1;
  }
  return 38 != e || (this.getPreviousSibling().select(), !1);
};

WebFXTreeItem.prototype.toString = function (e, t) {
  var o = this.parentNode,
    i = "";
  e + 1 == t && (this.parentNode._last = !0);
  for (var n = 0; o.parentNode; )
    (o = o.parentNode),
      (i =
        `<img id="${this.id}-indent-${n}" src="${
          o._last ? webFXTreeConfig.ic_blank : webFXTreeConfig.ic_i
        }">` + i),
      n++;
  (this._level = n),
    this.childNodes.length ? (this.folder = 1) : (this.open = !1),
    this.folder || "classic" != webFXTreeHandler.behavior
      ? (this.icon || (this.icon = webFXTreeConfig.ic_folder),
        this.openIcon || (this.openIcon = webFXTreeConfig.ic_openfolder))
      : this.icon || (this.icon = webFXTreeConfig.ic_file);
  var r = this.text.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
    s = `<div id="${
      this.id
    }" ondblclick="webFXTreeHandler.toggle(this)" class="webfx-tree-item" onkeydown="return webFXTreeHandler.keydown(this, event)">${i}<img id="${
      this.id
    }-plus" src="${
      this.folder
        ? this.open
          ? this.parentNode._last
            ? webFXTreeConfig.ic_lminus
            : webFXTreeConfig.ic_tminus
          : this.parentNode._last
          ? webFXTreeConfig.ic_lplus
          : webFXTreeConfig.ic_tplus
        : this.parentNode._last
        ? webFXTreeConfig.ic_l
        : webFXTreeConfig.ic_t
    }" onclick="webFXTreeHandler.toggle(this)"><img id="${
      this.id
    }-icon" class="webfx-tree-icon" src="${
      "classic" == webFXTreeHandler.behavior && this.open
        ? this.openIcon
        : this.icon
    }" onclick="webFXTreeHandler.select(this)"><a href="${this.action}" id="${
      this.id
    }-anchor" onfocus="webFXTreeHandler.focus(this)" onblur="webFXTreeHandler.blur(this)"${
      this.target ? ` target="${this.target}"` : ""
    }>${r}</a></div><div id="${
      this.id
    }-cont" class="webfx-tree-container" style="display:${
      this.open ? "block" : "none"
    }">`,
    d = [];
  for (n = 0; n < this.childNodes.length; n++)
    d[n] = this.childNodes[n].toString(n, this.childNodes.length);
  return (
    (this.plusIcon = this.parentNode._last
      ? webFXTreeConfig.ic_lplus
      : webFXTreeConfig.ic_tplus),
    (this.minusIcon = this.parentNode._last
      ? webFXTreeConfig.ic_lminus
      : webFXTreeConfig.ic_tminus),
    s + d.join("") + "</div>"
  );
};

WebFXLoadTree.prototype = new WebFXTree();
WebFXLoadTree.prototype._webfxtree_expand = WebFXTree.prototype.expand;
WebFXLoadTree.prototype.expand = function () {
  this.loaded || this.loading || _startLoadXmlTree(this.src, this),
    this._webfxtree_expand();
};
WebFXLoadTreeItem.prototype = new WebFXTreeItem();
WebFXLoadTreeItem.prototype._webfxtreeitem_expand =
  WebFXTreeItem.prototype.expand;
WebFXLoadTreeItem.prototype.expand = function () {
  this.loaded || this.loading || _startLoadXmlTree(this.src, this),
    this._webfxtreeitem_expand();
};

WebFXLoadTree.prototype.reload = WebFXLoadTreeItem.prototype.reload =
  function () {
    if (this.loaded) {
      for (var e = this.open; this.childNodes.length > 0; )
        this.childNodes[this.childNodes.length - 1].remove();
      (this.loaded = !1),
        (this._loadingItem = new WebFXTreeItem(webFXTreeConfig.loadingText)),
        this.add(this._loadingItem),
        e && this.expand();
    } else this.open && !this.loading && _startLoadXmlTree(this.src, this);
  };

XmlHttp.create = function () {
  try {
    if (window.XMLHttpRequest) {
      var e = new XMLHttpRequest();
      return (
        null == e.readyState &&
          ((e.readyState = 1),
          e.addEventListener(
            "load",
            function () {
              (e.readyState = 4),
                "function" == typeof e.onreadystatechange &&
                  e.onreadystatechange();
            },
            !1
          )),
        e
      );
    }
    if (window.ActiveXObject)
      return new ActiveXObject(getXmlHttpPrefix() + ".XmlHttp");
  } catch (e) {}
  throw new Error("Your browser does not support XmlHttp objects");
};

XmlDocument.create = function () {
  try {
    if (document.implementation && document.implementation.createDocument) {
      var e = document.implementation.createDocument("", "", null);
      return (
        null == e.readyState &&
          ((e.readyState = 1),
          e.addEventListener(
            "load",
            function () {
              (e.readyState = 4),
                "function" == typeof e.onreadystatechange &&
                  e.onreadystatechange();
            },
            !1
          )),
        e
      );
    }
    if (window.ActiveXObject)
      return new ActiveXObject(getDomDocumentPrefix() + ".DomDocument");
  } catch (e) {}
  throw new Error("Your browser does not support XmlDocument objects");
};

window.DOMParser &&
  window.XMLSerializer &&
  window.Node &&
  Node.prototype &&
  Node.prototype.__defineGetter__ &&
  ((XMLDocument.prototype.loadXML = Document.prototype.loadXML =
    function (e) {
      for (
        var t = new DOMParser().parseFromString(e, "text/xml");
        this.hasChildNodes();

      )
        this.removeChild(this.lastChild);
      for (var o = 0; o < t.childNodes.length; o++)
        this.appendChild(this.importNode(t.childNodes[o], !0));
    }),
  XMLDocument.prototype.__defineGetter__("xml", function () {
    return new XMLSerializer().serializeToString(this);
  }),
  Document.prototype.__defineGetter__("xml", function () {
    return new XMLSerializer().serializeToString(this);
  }));
