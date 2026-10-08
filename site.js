/* Site chrome modelled on brompton.com/why-brompton: trust strip, header, mega menu, mobile drawer.
   Links point to the live brompton.com pages (structure captured 8 Oct 2026). */
(function () {
  "use strict";
  var B = "https://www.brompton.com";

  var TRUST = [
    { text: "Brompton x and wander", href: B + "/collaborations/brompton-x-and-wander" },
    { text: "28 day satisfaction guarantee", href: B + "/why-brompton/buy-direct" },
    { text: "7-year frame warranty" },
    { text: "Flexible ways to pay", href: B + "/payment-and-financing" },
  ];

  var NAV = [
    {
      label: "Bikes",
      columns: [
        { title: "Useful links", links: [
          ["About Brompton bikes", "/bikes"], ["Help me choose", "/bikes/help-me-choose"], ["Register your bike", "/bike-registration"],
          ["Take a test ride", "/find-a-store/test-ride"], ["Bike support", "/support"], ["Premium Brompton Service", "/p/1161/premium-brompton-service"],
          ["Warranty and guarantee", "/why-brompton/buy-direct"], ["Cyclescheme", "/payment-and-financing/cyclescheme"],
          ["Collaborations", "/collaborations"], ["Brompton with Business", "/brompton-with-business"] ] },
        { title: "Shop by line", links: [
          ["Shop all bikes", "/c/bikes"], ["A Line", "/p/1029/a-line-23"], ["C Line", "/c/bikes/c-line"], ["P Line", "/c/bikes/p-line"],
          ["G Line", "/c/bikes/g-line"], ["T Line", "/c/bikes/t-line"], ["Renewed", "/c/bikes/renewed"] ] },
        { title: "Explore", links: [
          ["A Line", "/a-line"], ["C Line", "/c-line"], ["P Line", "/p-line"], ["G Line", "/g-line"],
          ["Brompton x and wander", "/c/bikes/brompton-x-and-wander"], ["T Line", "/t-line"], ["Brompton Renewed", "/bikes/brompton-renewed"] ] },
      ],
    },
    {
      label: "Electric Bikes",
      columns: [
        { title: "Useful links", links: [
          ["About Brompton Electric", "/electric-bikes"], ["Register your bike", "/bike-registration"], ["Help me choose", "/bikes/help-me-choose"],
          ["Test ride Brompton Electric", "/find-a-store/test-ride"], ["Flexible ways to pay", "/payment-and-financing"],
          ["Warranty and guarantee", "/why-brompton/buy-direct"], ["Battery passport", "#start", true] ] },
        { title: "Shop by line", links: [
          ["Shop all electric bikes", "/c/electric-bikes"], ["Electric C Line", "/c/electric-bikes/c-line"], ["Electric P Line", "/c/electric-bikes/p-line"],
          ["Electric T Line", "/c/electric-bikes/t-line"], ["Electric G Line", "/c/electric-bikes/g-line"], ["Renewed", "/c/bikes/renewed"] ] },
        { title: "Explore", links: [
          ["Electric C Line", "/electric-c-line"], ["Electric P Line", "/electric-p-line"], ["Electric T Line", "/electric-t-line"],
          ["Electric G Line", "/electric-g-line"], ["Brompton Renewed", "/bikes/brompton-renewed"] ] },
      ],
    },
    {
      label: "Parts & Accessories",
      columns: [
        { title: "Discover", links: [
          ["Brompton Click System", "/accessories/brompton-click-system"], ["Why Brompton", "/why-brompton"],
          ["Parts & Accessories support", "/support/parts-and-accessories"], ["Gifting", "/c/parts-and-accessories/gifting"],
          ["Merchandise", "/c/parts-and-accessories/merchandise"], ["Last Chance", "/c/parts-and-accessories/last-chance"],
          ["Shop all", "/c/parts-and-accessories"] ] },
        { title: "Accessories", links: [
          ["Bags", "/c/parts-and-accessories/bike-accessories/bags"], ["Lighting", "/c/parts-and-accessories/bike-accessories/lighting"],
          ["Phone mounts", "/c/parts-and-accessories/bike-accessories/phone-mounts"], ["Helmets", "/c/parts-and-accessories/bike-accessories/helmets"],
          ["Toolkits & multitools", "/c/parts-and-accessories/bike-accessories/toolkits-and-multitools"], ["Pumps", "/c/parts-and-accessories/bike-accessories/pumps"],
          ["Shop all accessories", "/c/parts-and-accessories/bike-accessories"] ] },
        { title: "Parts", links: [
          ["Components", "/c/parts-and-accessories/parts/components"], ["Racks and rollers", "/c/parts-and-accessories/parts/racks-and-rollers"],
          ["Tyres & inner tubes", "/c/parts-and-accessories/parts/tyres-and-inner-tubes"], ["Electric components", "/c/parts-and-accessories/parts/electric-components"],
          ["Front carrier block", "/c/parts-and-accessories/parts/front-carrier-block"], ["Shop all parts", "/c/parts-and-accessories/parts"] ] },
      ],
    },
    {
      label: "Stories",
      columns: [
        { title: "Featured", links: [["Brompton World Championships 2026", "/stories/events/brompton-world-championship/2026"]] },
        { title: "Stories", links: [
          ["All stories", "/stories"], ["Guides", "/stories/guides"], ["Life Unfolded", "/stories/life-unfolded"],
          ["Design & Engineering", "/stories/design-and-engineering"], ["Events", "/stories/events"] ] },
      ],
    },
  ];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function href(path) { return path.charAt(0) === "#" ? path : B + path; }

  /* ---------- trust strip ---------- */
  var strip = document.getElementById("trust-strip");
  strip.innerHTML = '<ul class="trust-list">' + TRUST.map(function (t, i) {
    var inner = t.href ? '<a href="' + esc(t.href) + '">' + esc(t.text) + "</a>" : esc(t.text);
    return '<li class="trust-item' + (i === 0 ? " is-active" : "") + '">' + inner + "</li>";
  }).join("") + "</ul>";
  var items = strip.querySelectorAll(".trust-item"), ti = 0;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) setInterval(function () {
    items[ti].classList.remove("is-active"); ti = (ti + 1) % items.length; items[ti].classList.add("is-active");
  }, 4000);

  /* ---------- desktop nav + mega menu ---------- */
  function panel(item, idx) {
    return '<div class="mega" id="mega-' + idx + '" hidden><div class="mega-inner">' +
      item.columns.map(function (c) {
        return '<div class="mega-col"><h3>' + esc(c.title) + "</h3><ul>" +
          c.links.map(function (l) { return '<li><a href="' + esc(href(l[1])) + '"' + (l[2] ? ' class="is-new"' : "") + ">" + esc(l[0]) + (l[2] ? ' <span class="new-tag">New</span>' : "") + "</a></li>"; }).join("") +
          "</ul></div>";
      }).join("") + "</div></div>";
  }
  var nav = document.getElementById("main-nav");
  nav.innerHTML = "<ul>" + NAV.map(function (n, i) {
    return '<li><button type="button" class="nav-btn" aria-expanded="false" aria-controls="mega-' + i + '" data-idx="' + i + '">' + esc(n.label) + "</button></li>";
  }).join("") + "</ul>";
  document.getElementById("mega-host").innerHTML = NAV.map(panel).join("");

  var openIdx = -1, closeTimer;
  function setOpen(i) {
    clearTimeout(closeTimer);
    nav.querySelectorAll(".nav-btn").forEach(function (b, j) { b.setAttribute("aria-expanded", String(i === j)); });
    document.querySelectorAll(".mega").forEach(function (m, j) { m.hidden = i !== j; });
    document.body.classList.toggle("mega-open", i >= 0);
    openIdx = i;
  }
  nav.querySelectorAll(".nav-btn").forEach(function (b) {
    var i = +b.getAttribute("data-idx");
    var hoverAt = 0;
    b.addEventListener("click", function () {
      // A click straight after hover-open keeps the menu open instead of toggling it shut.
      if (openIdx === i && Date.now() - hoverAt < 600) return;
      setOpen(openIdx === i ? -1 : i);
    });
    b.addEventListener("mouseenter", function () {
      if (window.matchMedia("(hover: hover)").matches && openIdx !== i) { hoverAt = Date.now(); setOpen(i); }
    });
  });
  var headerEl = document.querySelector(".site-header");
  headerEl.addEventListener("mouseleave", function () { closeTimer = setTimeout(function () { setOpen(-1); }, 200); });
  headerEl.addEventListener("mouseenter", function () { clearTimeout(closeTimer); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setOpen(-1); closeDrawer(); } });
  document.addEventListener("click", function (e) { if (openIdx >= 0 && !headerEl.contains(e.target)) setOpen(-1); });

  /* ---------- mobile drawer ---------- */
  var drawer = document.getElementById("drawer");
  var drawerBody = document.getElementById("drawer-body");
  drawerBody.innerHTML = NAV.map(function (n) {
    return '<details class="drawer-group"><summary>' + esc(n.label) + "</summary>" +
      n.columns.map(function (c) {
        return '<div class="drawer-col"><h3>' + esc(c.title) + "</h3><ul>" +
          c.links.map(function (l) { return '<li><a href="' + esc(href(l[1])) + '">' + esc(l[0]) + (l[2] ? ' <span class="new-tag">New</span>' : "") + "</a></li>"; }).join("") + "</ul></div>";
      }).join("") + "</details>";
  }).join("") +
  '<ul class="drawer-extra"><li><a href="' + B + '/find-a-store">Find a store</a></li><li><a href="' + B + '/account">My account</a></li></ul>';

  var menuBtn = document.getElementById("menu-btn");
  function openDrawer() { drawer.hidden = false; document.body.classList.add("drawer-open"); menuBtn.setAttribute("aria-expanded", "true"); document.getElementById("drawer-close").focus(); }
  function closeDrawer() { if (drawer.hidden) return; drawer.hidden = true; document.body.classList.remove("drawer-open"); menuBtn.setAttribute("aria-expanded", "false"); }
  menuBtn.addEventListener("click", openDrawer);
  document.getElementById("drawer-close").addEventListener("click", closeDrawer);
  drawer.addEventListener("click", function (e) {
    if (e.target === drawer) closeDrawer();
    var a = e.target.closest("a"); if (a && a.getAttribute("href").charAt(0) === "#") closeDrawer();
  });
  // In-page links (e.g. "Battery passport" in the menu) close the mega menu too.
  document.getElementById("mega-host").addEventListener("click", function (e) {
    var a = e.target.closest("a"); if (a && a.getAttribute("href").charAt(0) === "#") setOpen(-1);
  });

  /* ---------- logo fallback if the hosted SVG can't load ---------- */
  var logo = document.getElementById("logo-img");
  function logoFallback() { logo.replaceWith(Object.assign(document.createElement("span"), { className: "logo-text", textContent: "BROMPTON" })); }
  if (logo) {
    if (logo.complete && logo.naturalWidth === 0) logoFallback();
    else logo.addEventListener("error", logoFallback);
  }

  /* ---------- hero CTA ---------- */
  var cta = document.getElementById("hero-cta");
  if (cta) cta.addEventListener("click", function (e) {
    e.preventDefault();
    if (location.hash !== "#start" && location.hash !== "") location.hash = "start";
    else window.dppScrollToApp && window.dppScrollToApp();
  });
})();
