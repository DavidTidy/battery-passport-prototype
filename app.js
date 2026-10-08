/* Battery passport prototype — tiny hash router, no build step.
   Routes: #start · #passport · #signin · #restricted  */
(function () {
  "use strict";
  var P = window.PASSPORT;
  var app = document.getElementById("app");
  var DESKTOP = window.matchMedia("(min-width: 1024px)");

  /* ---------- state (role survives refresh where storage allows) ---------- */
  var state = { role: null, email: "" };
  try {
    var saved = JSON.parse(sessionStorage.getItem("dpp-session") || "null");
    if (saved && P.roles[saved.role]) state = saved;
  } catch (e) {}
  function saveState() {
    try { sessionStorage.setItem("dpp-session", JSON.stringify(state)); } catch (e) {}
  }

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function go(route) { location.hash = route; }
  function passportUrl() { return location.href.split("#")[0] + "#passport"; }
  function tierClass(tier) { return tier === "Authority" ? "authority" : tier === "Public" ? "public" : "legit"; }

  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2200);
  }

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast("Copied"); }, function () { toast(text); });
    } else { toast(text); }
  }

  function drawQR(el, size) {
    el.innerHTML = "";
    if (window.qrcode) {
      var qr = window.qrcode(0, "M");
      qr.addData(passportUrl()); qr.make();
      el.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true, alt: "QR code that opens this battery passport" });
      var svg = el.querySelector("svg");
      if (svg) { svg.setAttribute("width", size); svg.setAttribute("height", size); svg.style.display = "block"; }
    } else {
      el.innerHTML = '<p class="hint" style="width:' + size + 'px">QR library didn’t load. Open the passport link directly.</p>';
    }
  }

  var chev = '<span class="chev" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></span>';
  var lockSvg = '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="5" width="8" height="6" rx="1" fill="currentColor"/><path d="M4 5V3.5a2 2 0 014 0V5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';

  function renderField(f) {
    var label, value, html;
    if (Array.isArray(f)) {
      label = f[0]; html = esc(f[1]) + (f[2] ? '<span class="note">' + esc(f[2]) + "</span>" : "");
    } else {
      label = f.label;
      if (typeof f.meter === "number") {
        html = '<div class="meter"><div class="track" role="img" aria-label="' + esc(f.value) + '"><div class="fill" style="width:' + Math.max(0, Math.min(100, f.meter)) + '%"></div></div><span>' + esc(f.value) + "</span></div>";
      } else if (f.link) {
        html = '<a href="' + esc(f.link) + '" data-dummy>' + esc(f.value) + "</a>";
      } else { html = esc(f.value); }
    }
    return '<div class="row"><dt>' + esc(label) + "</dt><dd>" + html + "</dd></div>";
  }

  function renderSection(sec, tier, opts) {
    opts = opts || {};
    var body = opts.locked
      ? '<div class="locked">' + lockSvg + "<b>Not available for your role</b>" + esc(opts.lockedMsg) + "</div>"
      : '<dl class="fields">' + sec.fields.map(renderField).join("") + "</dl>";
    return '<details class="sec" id="sec-' + sec.id + '"' + (opts.open ? " open" : "") + ">" +
      "<summary>" +
        '<div><div class="tierline"><span class="pill ' + tierClass(tier) + '">' + esc(tier) + "</span></div>" +
        "<h2>" + esc(sec.title) + "</h2></div>" + chev +
        '<span class="sum">' + esc(sec.summary) + "</span>" +
      "</summary>" + body + "</details>";
  }

  function header() {
    var m = P.meta;
    return '<section class="pp-head" aria-labelledby="pp-title">' +
      '<div class="pp-head-top"><span class="eyebrow">Digital battery passport</span><span class="pill status">' + esc(m.status) + "</span></div>" +
      '<div><h2 id="pp-title">' + esc(m.product) + '</h2><p class="variant">' + esc(m.variant) + "</p></div>" +
      '<dl class="pp-meta">' +
        "<div><dt>Serial</dt><dd>" + esc(m.serial) + "</dd></div>" +
        "<div><dt>Passport ID</dt><dd>" + esc(m.passportId) + "</dd></div>" +
        "<div><dt>Version</dt><dd>" + esc(m.version) + "</dd></div>" +
        "<div><dt>Last updated</dt><dd>" + esc(m.lastUpdated) + "</dd></div>" +
      "</dl>" +
      '<div class="copy-row"><button class="btn ghost small" id="copy-id" type="button">Copy passport ID</button>' +
      '<button class="btn ghost small" id="copy-link" type="button">Copy link</button></div>' +
    "</section>";
  }

  function sideNav(items) {
    return '<nav class="side-nav" aria-label="Passport sections"><h3>On this passport</h3><ul>' +
      items.map(function (i) {
        return '<li><button type="button" data-jump="' + i.id + '"><span>' + esc(i.title) + "</span>" + (i.locked ? '<span class="lock">' + lockSvg + "</span>" : "") + "</button></li>";
      }).join("") + "</ul></nav>";
  }

  function sidePanel() {
    return '<aside class="side-panel"><h3>Open on your phone</h3><div class="qr-box" id="qr-side"></div>' +
      "<p>This is the same code printed on the battery. Scanning it opens this passport.</p></aside>";
  }

  /* ---------- views ---------- */
  function viewStart() {
    return '<div class="start-hero"><span class="eyebrow">Start here</span>' +
      "<h2>Find your battery passport</h2>" +
      "<p>Every Brompton Electric battery carries a QR code. It opens a passport with the battery’s identity, materials, carbon footprint and recycling information. Repairers, recyclers and authorities can sign in to see more.</p></div>" +

      '<div class="entry-grid">' +
        '<section class="entry"><div class="who"><span class="pill public">Public</span></div><h2>Scan the battery</h2>' +
          "<p>Owners and buyers scan the QR code on the battery with their phone camera.</p>" +
          '<div class="qr-box" id="qr-start"></div>' +
          '<div class="entry-actions"><button class="btn block" data-go="passport" type="button">Simulate a scan</button></div></section>' +

        '<section class="entry"><div class="who"><span class="pill public">Public</span></div><h2>Look up a serial number</h2>' +
          "<p>On a desktop, enter the serial number printed under the QR code.</p>" +
          '<form id="lookup" class="entry-actions" novalidate>' +
            '<label class="field" for="serial">Battery serial number<input class="input mono" id="serial" name="serial" value="' + esc(P.meta.serial) + '" autocomplete="off" spellcheck="false"></label>' +
            '<span class="hint">Example serial shown. Any other value shows the not-found state.</span>' +
            '<span class="error" id="lookup-err" hidden></span>' +
            '<button class="btn block" type="submit">Find passport</button></form></section>' +

        '<section class="entry"><div class="who"><span class="pill legit">Legitimate interest</span><span class="pill authority">Authority</span></div><h2>Sign in for restricted data</h2>' +
          "<p>Repairers, second-life operators, recyclers and market surveillance authorities see state of health, composition and dismantling information.</p>" +
          '<div class="entry-actions"><button class="btn ghost block" data-go="signin" type="button">Sign in</button></div></section>' +
      "</div>" +

      '<section class="journey" aria-labelledby="j-title"><h2 id="j-title">Journeys in this prototype</h2><ol>' +
        "<li><div><b>Scan or look up</b>QR on mobile, serial number on desktop</div></li>" +
        "<li><div><b>Read the public passport</b>Six public sections from Annex XIII</div></li>" +
        "<li><div><b>Sign in by role</b>Repairer, second life, recycler or authority</div></li>" +
        "<li><div><b>See restricted data</b>Sections unlock by tier; access is logged</div></li>" +
      "</ol></section>";
  }

  function viewPassport() {
    var navItems = P.public.map(function (s) { return { id: s.id, title: s.title }; })
      .concat(P.restricted.map(function (s) { return { id: "teaser", title: s.title, locked: true }; }));
    var sections = P.public.map(function (s, i) { return renderSection(s, "Public", { open: i === 0 || DESKTOP.matches }); }).join("");
    var signedIn = !!state.role;
    var note = signedIn
      ? '<div class="access-note signed"><p>You’re signed in as <b>' + esc(P.roles[state.role].label) + "</b>. Restricted sections are available.</p>" +
        '<button class="btn small" data-go="restricted" type="button">View restricted data</button></div>'
      : '<div class="access-note"><p>You’re viewing the public passport. Repairers, recyclers and authorities can sign in for more.</p>' +
        '<button class="btn ghost small" data-go="signin" type="button">Sign in</button></div>';
    var teaser = signedIn ? "" :
      '<section class="teaser" id="sec-teaser"><h2>Available after sign-in</h2><ul>' +
      P.restricted.map(function (s) {
        var tier = s.roles.length === 1 && s.roles[0] === "authority" ? "Authority" : "Legitimate interest";
        return "<li><span>" + lockSvg + " " + esc(s.title) + '</span><span class="pill ' + tierClass(tier) + '">' + tier + "</span></li>";
      }).join("") + "</ul></section>";

    return '<div class="passport-layout">' + sideNav(navItems) +
      '<div style="min-width:0">' + header() + note + '<div class="sections">' + sections + "</div>" + teaser + "</div>" +
      sidePanel() + "</div>";
  }

  function viewSignin() {
    var roles = Object.keys(P.roles).map(function (k, i) {
      var r = P.roles[k];
      return '<label class="role-opt" for="role-' + k + '"><input type="radio" name="role" id="role-' + k + '" value="' + k + '"' + (i === 0 ? " checked" : "") + ">" +
        "<span>" + esc(r.label) + '</span><span class="pill ' + tierClass(r.tier) + '">' + esc(r.tier) + "</span></label>";
    }).join("");
    return '<div class="signin">' +
      '<a class="back" href="#passport">← Back to public passport</a>' +
      '<div><span class="eyebrow">Restricted access</span><h2>Sign in to see more of this passport</h2></div>' +
      '<div class="context"><span class="hint">Battery</span><span>' + esc(P.meta.product) + " · <code>" + esc(P.meta.serial) + "</code></span></div>" +
      '<form id="signin-form" novalidate>' +
        '<label class="field" for="email">Work email<input class="input" type="email" id="email" name="email" autocomplete="username" placeholder="name@organisation.com" value="' + esc(state.email || "") + '"></label>' +
        '<label class="field" for="password">Password<input class="input" type="password" id="password" name="password" autocomplete="current-password"></label>' +
        '<fieldset class="roles"><legend>I’m accessing this as a</legend>' + roles + "</fieldset>" +
        '<span class="error" id="signin-err" hidden></span>' +
        '<button class="btn block" type="submit">Sign in</button>' +
        '<span class="hint">Prototype: any email and password work. In a live service, roles come from a verified account, not a choice on this screen.</span>' +
      "</form>" +
      '<p class="hint">No account? Organisations apply for access through the passport provider. (Not built in this prototype.)</p>' +
    "</div>";
  }

  function viewRestricted() {
    if (!state.role) { go("signin"); return ""; }
    var role = P.roles[state.role];
    var navItems = P.restricted.map(function (s) { return { id: s.id, title: s.title, locked: s.roles.indexOf(state.role) < 0 }; })
      .concat(P.public.map(function (s) { return { id: s.id, title: s.title }; }));
    var restrictedHtml = P.restricted.map(function (s, i) {
      var allowed = s.roles.indexOf(state.role) >= 0;
      var tier = s.roles.length === 1 && s.roles[0] === "authority" ? "Authority" : "Legitimate interest";
      return renderSection(s, tier, {
        open: i === 0 || DESKTOP.matches,
        locked: !allowed,
        lockedMsg: "Only market surveillance authorities can see this section."
      });
    }).join("");
    var publicHtml = P.public.map(function (s) { return renderSection(s, "Public", { open: DESKTOP.matches }); }).join("");
    return '<div class="passport-layout">' + sideNav(navItems) +
      '<div style="min-width:0">' + header() +
        '<div class="access-note signed"><p>Signed in as <b>' + esc(role.label) + "</b>" + (state.email ? " (" + esc(state.email) + ")" : "") +
        ". Your access to this passport is logged.</p>" +
        '<button class="btn ghost small" id="signout" type="button">Sign out</button></div>' +
        '<div class="sections">' + restrictedHtml + publicHtml + "</div>" +
      "</div>" + sidePanel() + "</div>";
  }

  /* ---------- page position + breadcrumb (site chrome sits above the app) ---------- */
  function scrollToApp() {
    var dpp = document.getElementById("dpp");
    var header = document.querySelector(".site-header");
    var top = dpp.getBoundingClientRect().top + window.pageYOffset - (header ? header.offsetHeight : 0) - 8;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
  }
  function renderCrumbs(route) {
    var el = document.getElementById("crumbs"); if (!el) return;
    var trail = [["Home", "https://www.brompton.com/"], ["Electric Bikes", "https://www.brompton.com/electric-bikes"], ["Digital Product Passport", "#start"]];
    if (route === "passport" || route === "restricted") trail.push(["Battery " + P.meta.serial, "#passport"]);
    if (route === "signin") trail.push(["Sign in", null]);
    if (route === "restricted") trail.push(["Restricted data", null]);
    el.innerHTML = "<ol>" + trail.map(function (t, i) {
      var last = i === trail.length - 1;
      return "<li>" + (last ? '<span aria-current="page">' + esc(t[0]) + "</span>" : '<a href="' + esc(t[1]) + '">' + esc(t[0]) + "</a>") + "</li>";
    }).join("") + "</ol>";
  }

  /* ---------- router ---------- */
  var routes = { start: viewStart, passport: viewPassport, signin: viewSignin, restricted: viewRestricted };

  function render() {
    var route = (location.hash || "#start").slice(1);
    if (!routes[route]) route = "start";
    var html = routes[route]();
    if (html === "") return;
    app.innerHTML = html;
    document.title = { start: "Digital Product Passport", passport: "Battery " + P.meta.serial + " | Digital Product Passport", signin: "Sign in | Digital Product Passport", restricted: "Restricted data | Digital Product Passport" }[route] + " | Brompton (prototype)";
    renderCrumbs(route);
    bind(route);
  }

  function bind(route) {
    app.querySelectorAll("[data-go]").forEach(function (b) {
      b.addEventListener("click", function () { go(b.getAttribute("data-go")); });
    });
    app.querySelectorAll("[data-jump]").forEach(function (b) {
      b.addEventListener("click", function () {
        var el = document.getElementById("sec-" + b.getAttribute("data-jump"));
        if (el) { if (el.tagName === "DETAILS") el.open = true; el.scrollIntoView({ behavior: "smooth", block: "start" }); }
      });
    });
    app.querySelectorAll("[data-dummy]").forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); toast("Dummy link in this prototype"); });
    });
    // On desktop every section stays open (summary acts as a heading).
    app.querySelectorAll(".sec > summary").forEach(function (s) {
      s.addEventListener("click", function (e) { if (DESKTOP.matches) e.preventDefault(); });
    });

    var qrStart = document.getElementById("qr-start"); if (qrStart) drawQR(qrStart, 148);
    var qrSide = document.getElementById("qr-side"); if (qrSide) drawQR(qrSide, 148);

    var cid = document.getElementById("copy-id"); if (cid) cid.addEventListener("click", function () { copy(P.meta.passportId); });
    var clk = document.getElementById("copy-link"); if (clk) clk.addEventListener("click", function () { copy(passportUrl()); });

    var lookup = document.getElementById("lookup");
    if (lookup) lookup.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = document.getElementById("serial").value.trim().toUpperCase();
      var err = document.getElementById("lookup-err");
      if (!v) { err.textContent = "Enter the serial number printed under the QR code."; err.hidden = false; return; }
      if (v !== P.meta.serial) { err.textContent = "No passport found for " + v + ". Check the number on the battery label and try again."; err.hidden = false; return; }
      go("passport");
    });

    var form = document.getElementById("signin-form");
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("email").value.trim();
      var pw = document.getElementById("password").value;
      var err = document.getElementById("signin-err");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = "Enter your work email, for example name@organisation.com."; err.hidden = false; return; }
      if (!pw) { err.textContent = "Enter your password."; err.hidden = false; return; }
      state.role = form.querySelector("input[name=role]:checked").value;
      state.email = email; saveState();
      toast("Signed in as " + P.roles[state.role].label);
      go("restricted");
    });

    var so = document.getElementById("signout");
    if (so) so.addEventListener("click", function () {
      state = { role: null, email: "" }; saveState(); toast("Signed out"); go("passport");
    });
  }

  // Re-render when crossing the desktop breakpoint so sections open/close correctly.
  if (DESKTOP.addEventListener) DESKTOP.addEventListener("change", render);
  window.addEventListener("hashchange", function () { render(); scrollToApp(); });
  window.dppScrollToApp = scrollToApp;
  var first = (location.hash || "#start").slice(1);
  render();
  if (first !== "start" && routes[first]) scrollToApp();
})();
