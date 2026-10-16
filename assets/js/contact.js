/* VOUCHERA — contact form.
   The site has no server, so the form validates input in the browser and then
   opens the visitor's email app with a ready-to-send message addressed to
   support@vouchera.in. Nothing is stored or sent anywhere else. */
(function () {
  "use strict";

  var TO = "support@vouchera.in";
  var form = document.getElementById("contact-form");
  if (!form) return;

  var topic = form.elements.topic;
  var groups = form.querySelectorAll("[data-topic]");
  var status = document.getElementById("form-status");
  var preview = document.getElementById("form-preview");
  var copyBtn = document.getElementById("copy-message");
  var openBtn = document.getElementById("open-mail");

  var TOPICS = {
    general: "General question",
    missing: "Missing cashback",
    withdrawal: "Withdrawal request",
    partnership: "Store partnership",
    privacy: "Privacy / data request",
    feedback: "Feedback"
  };

  // Pre-select a topic from ?topic=… links
  var pre = new URLSearchParams(window.location.search).get("topic");
  if (pre && TOPICS[pre]) topic.value = pre;

  function syncGroups() {
    groups.forEach(function (g) {
      var on = g.getAttribute("data-topic") === topic.value;
      g.hidden = !on;
      g.querySelectorAll("input, select, textarea").forEach(function (f) {
        f.disabled = !on;
        if (f.hasAttribute("data-required")) f.required = on;
      });
    });
  }
  topic.addEventListener("change", syncGroups);
  syncGroups();

  var rules = {
    name: function (v) { return v.length >= 2 || "Please enter your name."; },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Please enter a valid email address.";
    },
    topic: function (v) { return !!TOPICS[v] || "Please choose a topic."; },
    message: function (v) { return v.length >= 10 || "Please write a few words (at least 10 characters)."; },
    store: function (v) { return v.length >= 2 || "Please enter the store name."; },
    orderId: function (v) { return v.length >= 3 || "Please enter the order ID from the store."; },
    orderDate: function (v) {
      if (!v) return "Please enter the order date.";
      var d = new Date(v + "T00:00:00");
      return (!isNaN(d) && d.getTime() <= Date.now()) || "The order date can’t be in the future.";
    },
    upi: function (v) {
      return /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z][a-zA-Z0-9]{1,63}$/.test(v) || "Please enter a valid UPI ID, e.g. name@bank.";
    },
    amount: function (v) {
      var n = Number(v);
      return (v !== "" && isFinite(n) && n >= 100) || "Withdrawals start at ₹100.";
    },
    consent: function (_, f) { return f.checked || "Please confirm to continue."; }
  };

  function validateField(f) {
    if (f.disabled || !rules[f.name]) return true;
    var value = f.type === "checkbox" ? "" : String(f.value || "").trim();
    var res = rules[f.name](value, f);
    var wrap = f.closest(".field") || f.closest(".full");
    var msg = wrap ? wrap.querySelector(".field-error") : null;
    var ok = res === true;
    if (wrap) wrap.classList.toggle("has-error", !ok);
    f.setAttribute("aria-invalid", String(!ok));
    if (msg) msg.textContent = ok ? "" : res;
    return ok;
  }

  Array.prototype.forEach.call(form.elements, function (f) {
    if (!f.name) return;
    f.addEventListener("blur", function () { if (f.value) validateField(f); });
    f.addEventListener("change", function () { if (f.closest(".has-error")) validateField(f); });
  });

  function val(name) {
    var f = form.elements[name];
    return f && !f.disabled ? String(f.value || "").trim() : "";
  }

  function compose() {
    var lines = [
      "Name: " + val("name"),
      "Email: " + val("email"),
      "Topic: " + TOPICS[val("topic")]
    ];
    if (val("topic") === "missing") {
      lines.push("Store: " + val("store"));
      lines.push("Order ID: " + val("orderId"));
      lines.push("Order date: " + val("orderDate"));
      if (val("orderValue")) lines.push("Order value (₹): " + val("orderValue"));
    }
    if (val("topic") === "withdrawal") {
      lines.push("UPI ID: " + val("upi"));
      lines.push("Amount requested (₹): " + val("amount"));
    }
    lines.push("", "Message:", val("message"));
    return lines.join("\n");
  }

  var last = { subject: "", body: "" };

  function mailtoHref() {
    // Keep the URL within limits most email apps accept.
    var body = last.body.length > 1800 ? last.body.slice(0, 1800) + "\n…" : last.body;
    return "mailto:" + TO + "?subject=" + encodeURIComponent(last.subject) + "&body=" + encodeURIComponent(body);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var firstBad = null;
    Array.prototype.forEach.call(form.elements, function (f) {
      if (f.name && !validateField(f) && !firstBad) firstBad = f;
    });
    if (firstBad) {
      firstBad.focus();
      return;
    }
    last.subject = "[VOUCHERA] " + TOPICS[val("topic")] + " — " + val("name");
    last.body = compose();
    preview.textContent = "To: " + TO + "\nSubject: " + last.subject + "\n\n" + last.body;
    status.classList.add("is-visible");
    status.setAttribute("tabindex", "-1");
    status.focus();
    window.location.href = mailtoHref();
  });

  if (openBtn) {
    openBtn.addEventListener("click", function () {
      if (last.body) window.location.href = mailtoHref();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = preview.textContent;
      var done = function () {
        copyBtn.textContent = "Copied — paste it into an email to " + TO;
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () {});
      } else {
        var range = document.createRange();
        range.selectNodeContents(preview);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        try { document.execCommand("copy"); done(); } catch (err) { /* no-op */ }
      }
    });
  }
})();
