/* VOUCHERA — renders offers from offers-data.js into voucher cards.
   All text is inserted with textContent (never innerHTML) and links are
   restricted to https:// so content in the data file cannot inject markup. */
(function () {
  "use strict";

  var CATEGORIES = {
    all: "All offers",
    fashion: "Fashion",
    electronics: "Electronics",
    beauty: "Beauty",
    home: "Home & Kitchen",
    travel: "Travel",
    food: "Food & Grocery",
    books: "Books & Learning",
    gifts: "Gifts & More"
  };

  var SVG_NS = "http://www.w3.org/2000/svg";
  var ICONS = {
    clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    check: "M20 7 10 17l-5-5",
    calendar: "M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
    external: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"
  };

  function icon(name) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    var p = document.createElementNS(SVG_NS, "path");
    p.setAttribute("d", ICONS[name]);
    svg.appendChild(p);
    return svg;
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = String(text);
    return node;
  }

  function safeUrl(url) {
    try {
      var u = new URL(String(url));
      return u.protocol === "https:" ? u.href : null;
    } catch (e) {
      return null;
    }
  }

  function isLive(offer) {
    if (!offer || !offer.store || !offer.headline || !safeUrl(offer.url)) return false;
    if (!offer.validUntil) return true;
    var end = new Date(offer.validUntil + "T23:59:59+05:30");
    return !isNaN(end) && end.getTime() >= Date.now();
  }

  function formatDate(iso) {
    var d = new Date(iso + "T00:00:00+05:30");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  function list(items) {
    var ul = el("ul");
    (items || []).forEach(function (t) {
      if (t) ul.appendChild(el("li", null, t));
    });
    return ul;
  }

  function card(offer) {
    var wrap = el("article", "offer-card voucher-shadow");
    var v = el("div", "voucher");
    var main = el("div", "voucher-main");

    var top = el("div", "offer-top");
    top.appendChild(el("div", "offer-logo", offer.store.trim().charAt(0).toUpperCase()));
    var names = el("div");
    names.appendChild(el("div", "offer-store", offer.store));
    names.appendChild(el("div", "offer-cat", CATEGORIES[offer.category] || "Offer"));
    top.appendChild(names);
    main.appendChild(top);

    main.appendChild(el("h3", "offer-headline", offer.headline));

    var meta = el("div", "offer-meta");
    if (offer.tracksIn) {
      var a = el("span", "meta-pill");
      a.appendChild(icon("clock"));
      a.appendChild(document.createTextNode("Tracks: " + offer.tracksIn));
      meta.appendChild(a);
    }
    if (offer.confirmsIn) {
      var b = el("span", "meta-pill");
      b.appendChild(icon("check"));
      b.appendChild(document.createTextNode("Confirms: " + offer.confirmsIn));
      meta.appendChild(b);
    }
    if (offer.validUntil) {
      var c = el("span", "meta-pill");
      c.appendChild(icon("calendar"));
      c.appendChild(document.createTextNode("Valid till " + formatDate(offer.validUntil)));
      meta.appendChild(c);
    }
    main.appendChild(meta);

    var details = el("details", "offer-details");
    details.appendChild(el("summary", null, "Eligibility & conditions"));
    if (offer.eligibility && offer.eligibility.length) {
      details.appendChild(el("h4", null, "Who is eligible"));
      details.appendChild(list(offer.eligibility));
    }
    if (offer.conditions && offer.conditions.length) {
      details.appendChild(el("h4", null, "Conditions"));
      details.appendChild(list(offer.conditions));
    }
    details.appendChild(el("h4", null, "Always applies"));
    details.appendChild(list([
      "Cashback is paid only after the store confirms the order.",
      "Returned, cancelled or exchanged orders are not eligible.",
      "Withdraw via UPI once your confirmed balance reaches ₹100."
    ]));
    main.appendChild(details);

    var stub = el("div", "voucher-stub");
    stub.appendChild(el("div", "offer-rate-label", "Cashback"));
    stub.appendChild(el("div", "offer-rate", offer.rate || "—"));
    if (offer.rateLabel) stub.appendChild(el("div", "offer-stub-note", offer.rateLabel));
    var link = el("a", "btn btn-primary btn-sm");
    link.href = safeUrl(offer.url);
    link.target = "_blank";
    link.rel = "sponsored noopener noreferrer";
    link.appendChild(document.createTextNode("Shop"));
    link.appendChild(icon("external"));
    link.setAttribute("aria-label", "Shop at " + offer.store + " (opens in a new tab)");
    stub.appendChild(link);

    v.appendChild(main);
    v.appendChild(stub);
    wrap.appendChild(v);
    return wrap;
  }

  var all = (Array.isArray(window.VOUCHERA_OFFERS) ? window.VOUCHERA_OFFERS : []).filter(isLive);

  // Compact feeds (e.g. Home page). The wrapping section stays hidden when nothing is live.
  document.querySelectorAll("[data-offer-feed]").forEach(function (grid) {
    var limit = parseInt(grid.getAttribute("data-limit"), 10) || 4;
    var section = grid.closest("[data-offer-section]");
    if (!all.length) return;
    all.slice(0, limit).forEach(function (o) { grid.appendChild(card(o)); });
    if (section) section.hidden = false;
  });

  // Full explorer (Explore Offers page)
  var explorer = document.getElementById("offer-explorer");
  if (!explorer) return;

  var grid = document.getElementById("offer-grid");
  var chipsWrap = document.getElementById("offer-chips");
  var search = document.getElementById("offer-search");
  var count = document.getElementById("offer-count");
  var empty = document.getElementById("offers-empty");
  var emptyTitle = document.getElementById("offers-empty-title");

  var params = new URLSearchParams(window.location.search);
  var state = {
    cat: CATEGORIES[params.get("cat")] ? params.get("cat") : "all",
    q: ""
  };

  Object.keys(CATEGORIES).forEach(function (key) {
    var chip = el("button", "chip", CATEGORIES[key]);
    chip.type = "button";
    chip.setAttribute("data-cat", key);
    chip.setAttribute("aria-pressed", String(key === state.cat));
    chip.addEventListener("click", function () {
      state.cat = key;
      chipsWrap.querySelectorAll(".chip").forEach(function (c) {
        c.setAttribute("aria-pressed", String(c.getAttribute("data-cat") === key));
      });
      var url = new URL(window.location.href);
      if (key === "all") url.searchParams.delete("cat"); else url.searchParams.set("cat", key);
      try { window.history.replaceState(null, "", url); } catch (e) { /* ignore */ }
      render();
    });
    chipsWrap.appendChild(chip);
  });

  if (search) {
    search.addEventListener("input", function () {
      state.q = search.value.trim().toLowerCase();
      render();
    });
  }

  function render() {
    grid.textContent = "";
    var shown = all.filter(function (o) {
      if (state.cat !== "all" && o.category !== state.cat) return false;
      if (!state.q) return true;
      var hay = [o.store, o.headline, CATEGORIES[o.category] || ""].join(" ").toLowerCase();
      return hay.indexOf(state.q) !== -1;
    });
    shown.forEach(function (o) { grid.appendChild(card(o)); });

    var label = state.cat === "all" ? "all categories" : CATEGORIES[state.cat];
    count.textContent = shown.length === 1 ? "1 live offer in " + label : shown.length + " live offers in " + label;

    var none = shown.length === 0;
    count.hidden = none;
    empty.hidden = !none;
    grid.hidden = none;
    if (none) {
      if (state.q) {
        emptyTitle.textContent = "No offers match “" + search.value.trim() + "”";
      } else if (state.cat !== "all") {
        emptyTitle.textContent = "No live " + CATEGORIES[state.cat] + " offers right now";
      } else {
        emptyTitle.textContent = "Fresh offers are being stamped";
      }
    }
  }

  render();
})();
