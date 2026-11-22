/* ==========================================================
   1. Liquid-glass refraction (Chrome / Edge / Arc only).
      Safari and Firefox can't run an SVG filter as a
      backdrop-filter, so there the glass stays frosted —
      which still looks right. This only adds the bent edges.
   2. Light / dark appearance switch.
   3. Depth: titles and glass drift slightly slower than the paper.
   4. Title block that follows the scroll.
   ========================================================== */

(function () {
  "use strict";

  // ---------- 1. Refraction ----------

  var canRefract =
    !!navigator.userAgentData &&                      // Chromium-only API
    !window.matchMedia("(prefers-reduced-transparency: reduce)").matches;

  if (canRefract) {
    var SVG_NS = "http://www.w3.org/2000/svg";
    var defs = document.createElementNS(SVG_NS, "svg");
    defs.setAttribute("width", "0");
    defs.setAttribute("height", "0");
    defs.setAttribute("aria-hidden", "true");
    defs.style.position = "absolute";
    document.body.appendChild(defs);

    var counter = 0;

    // A displacement map for a rounded rectangle: neutral grey in the
    // middle, and near the rim it points inward, so the edge of the glass
    // "pulls in" what's behind it, like the thick edge of a lens.
    function makeMap(w, h, r, bezel) {
      var s = 0.5; // half resolution is plenty
      var cw = Math.max(2, Math.ceil(w * s));
      var ch = Math.max(2, Math.ceil(h * s));
      var c = document.createElement("canvas");
      c.width = cw;
      c.height = ch;
      var ctx = c.getContext("2d");
      var img = ctx.createImageData(cw, ch);
      var d = img.data;
      r = Math.min(r, w / 2, h / 2);
      var hw = w / 2, hh = h / 2;

      for (var j = 0; j < ch; j++) {
        for (var i = 0; i < cw; i++) {
          var px = (i + 0.5) / s - hw;
          var py = (j + 0.5) / s - hh;
          var qx = Math.abs(px) - (hw - r);
          var qy = Math.abs(py) - (hh - r);
          var ox = Math.max(qx, 0), oy = Math.max(qy, 0);
          var outside = Math.sqrt(ox * ox + oy * oy) + Math.min(Math.max(qx, qy), 0) - r;
          var inside = -outside; // distance from the rim, inward
          var nx = 0, ny = 0, mag = 0;
          if (inside < bezel) {
            var t = 1 - Math.max(inside, 0) / bezel;
            mag = t * t;
            if (qx > 0 && qy > 0) {
              var len = Math.sqrt(qx * qx + qy * qy) || 1;
              nx = (qx / len) * Math.sign(px);
              ny = (qy / len) * Math.sign(py);
            } else if (qx > qy) {
              nx = Math.sign(px);
            } else {
              ny = Math.sign(py);
            }
          }
          var k = (j * cw + i) * 4;
          d[k]     = 128 - nx * mag * 127; // sample from further inside
          d[k + 1] = 128 - ny * mag * 127;
          d[k + 2] = 128;
          d[k + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      return c.toDataURL();
    }

    function applyGlass(el) {
      var rect = el.getBoundingClientRect();
      var w = Math.round(rect.width), h = Math.round(rect.height);
      if (w < 4 || h < 4) return;
      if (el._lgSize === w + "x" + h) return;
      el._lgSize = w + "x" + h;

      var cs = getComputedStyle(el);
      var radius = parseFloat(cs.borderTopLeftRadius) || 0;
      var blur = (parseFloat(cs.getPropertyValue("--glass-blur")) || 5) / 2.5;
      var bezel = Math.min(22, Math.min(w, h) / 3);
      var scale = Math.round(bezel * 1.4);
      var id = el._lgId || (el._lgId = "lg-" + ++counter);

      var old = document.getElementById(id);
      if (old) old.remove();

      var f = document.createElementNS(SVG_NS, "filter");
      f.setAttribute("id", id);
      f.setAttribute("x", "0");
      f.setAttribute("y", "0");
      f.setAttribute("width", w);
      f.setAttribute("height", h);
      f.setAttribute("filterUnits", "userSpaceOnUse");
      f.setAttribute("primitiveUnits", "userSpaceOnUse");
      f.setAttribute("color-interpolation-filters", "sRGB");
      f.innerHTML =
        '<feGaussianBlur in="SourceGraphic" stdDeviation="' + blur + '" result="b"/>' +
        '<feImage href="' + makeMap(w, h, radius, bezel) + '" x="0" y="0" width="' + w + '" height="' + h + '" preserveAspectRatio="none" result="m"/>' +
        '<feDisplacementMap in="b" in2="m" scale="' + scale + '" xChannelSelector="R" yChannelSelector="G" result="d"/>' +
        '<feColorMatrix in="d" type="saturate" values="1.7"/>';
      defs.appendChild(f);

      el.style.backdropFilter = "url(#" + id + ") brightness(1.08)";
    }

    var glass = Array.prototype.slice.call(document.querySelectorAll(".glass"));
    var ro = new ResizeObserver(function (entries) {
      entries.forEach(function (e) { applyGlass(e.target); });
    });
    glass.forEach(function (el) { ro.observe(el); });
  }

  // ---------- 2. Appearance: Automatic → Light → Dark ----------

  var root = document.documentElement;
  var LABELS = { auto: "Appearance: Automatic", light: "Appearance: Light", dark: "Appearance: Dark" };
  var NEXT = { auto: "light", light: "dark", dark: "auto" };
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function currentChoice() { return root.getAttribute("data-choice") || "auto"; }

  function applyChoice(choice, save) {
    root.setAttribute("data-choice", choice);
    if (choice === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", choice);
    if (save) {
      try { localStorage.setItem("theme", choice); } catch (e) { /* private mode: fine */ }
    }
    document.querySelectorAll(".theme-toggle").forEach(function (b) {
      b.setAttribute("aria-label", LABELS[choice]);
      b.setAttribute("title", LABELS[choice]);
    });
    if (themeMeta) {
      var dark = choice === "dark" || (choice === "auto" && systemDark.matches);
      themeMeta.setAttribute("content", dark ? "#111821" : "#eef4fb");
    }
  }

  document.querySelectorAll(".theme-toggle").forEach(function (b) {
    b.addEventListener("click", function () { applyChoice(NEXT[currentChoice()], true); });
  });
  if (systemDark.addEventListener) {
    systemDark.addEventListener("change", function () { applyChoice(currentChoice(), false); });
  }
  applyChoice(currentChoice(), false);

  // ---------- 3. Depth: titles and glass drift a little slower than the paper ----------

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DEPTHS = [
    // [selector, depth]  — 0 = moves with the page; 0.1 = 10% slower
    [".hero > .eyebrow", 0.14],
    [".hero > h1", 0.12],
    [".hero > .lede", 0.09],
    [".hero > .spec", 0.07],
    ["section > .eyebrow, section > h1, section > h2, section > .lede, section > p.muted, section > .updated", 0.08],
    [".app-card, .panel", 0.04]
  ];
  var layers = [];

  if (!reduceMotion) {
    DEPTHS.forEach(function (pair) {
      document.querySelectorAll(pair[0]).forEach(function (el) {
        if (el.hasAttribute("data-depth")) return; // first match wins
        el.setAttribute("data-depth", pair[1]);
        layers.push({ el: el, depth: pair[1], top: 0, height: 0, shift: 0 });
      });
    });
  }

  function measure() {
    var y = window.scrollY;
    layers.forEach(function (l) {
      var r = l.el.getBoundingClientRect();
      l.top = r.top + y - l.shift; // position without our own shift
      l.height = r.height;
    });
  }

  function drift() {
    var y = window.scrollY;
    var mid = window.innerHeight / 2;
    layers.forEach(function (l) {
      // 0 when the element is in the middle of the screen, so the layout
      // there is exactly as designed; it lags a little above and below.
      var center = l.top + l.height / 2 - y;
      var shift = (mid - center) * l.depth;
      shift = Math.max(-90, Math.min(90, shift));
      l.shift = shift;
      l.el.style.transform = "translate3d(0," + shift.toFixed(1) + "px,0)";
    });
  }

  // ---------- 4. Title block ----------

  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-sheet]"));
  var sheetName = document.getElementById("tb-sheet");
  var sheetNo = document.getElementById("tb-no");
  var yReadout = document.getElementById("tb-y");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a.link[href^='#']"));
  var total = sections.length;

  function pad(n, len) { n = String(n); while (n.length < len) n = "0" + n; return n; }

  function onScroll() {
    var y = window.scrollY;
    if (layers.length) drift();
    if (yReadout) yReadout.textContent = pad(Math.round(y), 5);

    if (!sections.length) return;
    var line = window.innerHeight * 0.4;
    var current = sections[0];
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= line) current = s;
    });
    // At the very bottom, the last sheet wins.
    if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) current = sections[total - 1];

    var i = sections.indexOf(current) + 1;
    if (sheetName) sheetName.textContent = current.getAttribute("data-sheet");
    if (sheetNo) sheetNo.textContent = pad(i, 2) + " / " + pad(total, 2);
    navLinks.forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + current.id);
    });
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () { ticking = false; onScroll(); });
    }
  }, { passive: true });

  function remeasure() { measure(); onScroll(); }
  window.addEventListener("resize", remeasure);
  window.addEventListener("load", remeasure);       // after images and fonts
  if (window.ResizeObserver) new ResizeObserver(remeasure).observe(document.body);
  remeasure();

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
