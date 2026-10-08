(function () {
  var page = document.body.getAttribute("data-page");
  var regions = ["konyaalti", "muratpasa", "kepez"];
  var WA_ALLOW = { "905330978924": true, "905050680307": true };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* JSON-LD: schema/*.json → DOM’a inline enjekte (Google + CSP uyumlu) */
  var schemaSrc = document.body.getAttribute("data-schema");
  if (schemaSrc && typeof fetch === "function") {
    fetch(schemaSrc, { credentials: "same-origin" })
      .then(function (res) {
        if (!res.ok) throw new Error("schema");
        return res.json();
      })
      .then(function (data) {
        var el = document.createElement("script");
        el.type = "application/ld+json";
        el.setAttribute("data-schema-injected", "1");
        el.textContent = JSON.stringify(data);
        document.head.appendChild(el);
      })
      .catch(function () {});
  }

  document.querySelectorAll("[data-nav]").forEach(function (el) {
    if (el.getAttribute("data-nav") === page) {
      el.setAttribute("aria-current", "page");
    }
  });

  if (regions.indexOf(page) !== -1) {
    var sub = document.querySelector(".nav-sub");
    if (sub) sub.classList.add("is-here");
  }

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  /* Kaydırınca bölümlerin belirmesi */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
      );
      reveals.forEach(function (el) {
        io.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add("is-in");
      });
    }
  }

  /* Header videoları: sessiz autoplay; reduced-motion’da oynatma yok (pause) */
  document.querySelectorAll(".page-hero__media, .home-hero__media").forEach(function (media) {
    if (media.tagName !== "VIDEO") return;
    media.muted = true;
    media.setAttribute("playsinline", "");
    media.setAttribute("webkit-playsinline", "");
    if (reduceMotion) {
      media.pause();
      media.removeAttribute("autoplay");
      return;
    }
    var play = function () {
      var p = media.play();
      if (p && p.catch) p.catch(function () {});
    };
    play();
    media.addEventListener("loadeddata", play);
  });

  var filter = document.querySelector("#mahalle-ara");
  var list = document.querySelector(".mahalle-list");
  var result = document.querySelector("#mahalle-sonuc");
  if (filter && list && result) {
    var items = Array.prototype.slice.call(list.querySelectorAll("li"));
    var total = items.length;
    result.textContent = total + " mahalle listeleniyor.";

    filter.addEventListener("input", function () {
      var query = filter.value.trim().toLocaleLowerCase("tr-TR");
      var visible = 0;
      items.forEach(function (item) {
        var name = item.textContent.toLocaleLowerCase("tr-TR");
        var match = !query || name.indexOf(query) !== -1;
        item.hidden = !match;
        if (match) visible += 1;
      });
      if (!query) {
        result.textContent = total + " mahalle listeleniyor.";
      } else if (visible === 0) {
        result.textContent = "Bu isimle mahalle yok. Yazımı kontrol edin.";
      } else {
        result.textContent = visible + " mahalle eşleşti.";
      }
    });
  }

  var form = document.querySelector("#randevu-form");
  if (!form) return;

  var status = document.querySelector("#form-status");

  function cleanLine(value, max) {
    return String(value || "")
      .replace(/[<>]/g, "")
      .replace(/[\u0000-\u001F\u007F]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, max);
  }

  function cleanBlock(value, max) {
    return String(value || "")
      .replace(/[<>]/g, "")
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .trim()
      .slice(0, max);
  }

  function setError(input, message) {
    var slot = form.querySelector('[data-error-for="' + input.name + '"]');
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (slot) slot.textContent = message || "";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var trap = form.querySelector('[name="hp_field"]');
    if (trap && trap.value) return;

    var name = form.querySelector('[name="ad"]');
    var phone = form.querySelector('[name="telefon"]');
    var district = form.querySelector('[name="ilce"]');
    var quarter = form.querySelector('[name="mahalle"]');
    var service = form.querySelector('[name="hizmet"]');
    var note = form.querySelector('[name="mesaj"]');
    var line = form.querySelector('[name="hat"]');
    var consent = form.querySelector('[name="onay"]');

    var ad = cleanLine(name.value, 80);
    var telefon = cleanLine(phone.value, 20);
    var mahalle = cleanLine(quarter.value, 80);
    var mesaj = cleanBlock(note.value, 600);
    var phoneOk = /^(?:\+90|0)?[\s.-]*\(?5\d{2}\)?[\s.-]*\d{3}[\s.-]*\d{2}[\s.-]*\d{2}$/.test(telefon);
    var hat = String(line && line.value ? line.value : "").replace(/\D/g, "");
    if (!WA_ALLOW[hat]) hat = "905330978924";

    setError(name, ad.length < 2 ? "Adınızı yazın." : "");
    setError(phone, phoneOk ? "" : "Telefonu +90 (5xx) xxx xx xx biçiminde yazın.");
    setError(district, district.value ? "" : "İlçe seçin.");
    setError(quarter, mahalle.length < 2 ? "Mahalle adını yazın." : "");
    setError(service, service.value ? "" : "Hizmet seçin.");
    setError(consent, consent.checked ? "" : "WhatsApp ile gönderimi onaylayın.");

    var invalid = form.querySelector('[aria-invalid="true"]');
    if (invalid) {
      if (status) status.textContent = "Eksik alanlar var.";
      invalid.focus();
      return;
    }

    var text = [
      "Merhaba, Rutin Temizlik için randevu istiyorum.",
      "Ad: " + ad,
      "Telefon: " + telefon,
      "İlçe: " + district.value,
      "Mahalle: " + mahalle,
      "Hizmet: " + service.value,
      "Not: " + (mesaj || "—")
    ].join("\n");

    var url = "https://wa.me/" + hat + "?text=" + encodeURIComponent(text);
    if (status) {
      status.textContent = "WhatsApp açılıyor. Pencere gelmezse tarayıcının açılır pencere engelini kapatıp yeniden deneyin.";
    }

    var popup = window.open(url, "_blank", "noopener,noreferrer");
    if (!popup) window.location.assign(url);
  });
})();
