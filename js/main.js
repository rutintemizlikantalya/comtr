(function () {
  var page = document.body.getAttribute("data-page");
  var regions = ["konyaalti", "muratpasa", "kepez"];

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
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

  /* Sayfa header videoları: görünürde oynat */
  document.querySelectorAll(".page-hero__media").forEach(function (media) {
    if (media.tagName !== "VIDEO") return;
    media.muted = true;
    var play = function () {
      var p = media.play();
      if (p && p.catch) p.catch(function () {});
    };
    play();
  });

  /* Scroll-scrub video: kaydırınca ileri/geri sarar, durunca karede kalır */
  var scrub = document.querySelector("[data-scrub]");
  var scrubVideo = scrub ? scrub.querySelector("video") : null;
  if (scrub && scrubVideo) {
    var scrubReady = false;
    var scrubTick = false;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function scrubFrame() {
      scrubTick = false;
      if (!scrubReady || reduceMotion || !scrubVideo.duration) return;
      var total = Math.max(1, scrub.offsetHeight - window.innerHeight);
      var scrolled = Math.min(total, Math.max(0, -scrub.getBoundingClientRect().top));
      var progress = scrolled / total;
      var target = progress * scrubVideo.duration;
      if (Math.abs(scrubVideo.currentTime - target) > 0.04) {
        try {
          scrubVideo.currentTime = target;
        } catch (err) {
          /* seek henüz hazır değilse yoksay */
        }
      }
    }

    function onScrubScroll() {
      if (!scrubTick) {
        scrubTick = true;
        window.requestAnimationFrame(scrubFrame);
      }
    }

    scrubVideo.pause();
    scrubVideo.setAttribute("playsinline", "");
    scrubVideo.muted = true;
    scrubVideo.addEventListener("loadedmetadata", function () {
      scrubReady = true;
      try {
        scrubVideo.currentTime = 0.05;
      } catch (err) {}
      scrubFrame();
    });
    if (scrubVideo.readyState >= 1) {
      scrubReady = true;
      scrubFrame();
    }
    window.addEventListener("scroll", onScrubScroll, { passive: true });
    window.addEventListener("resize", onScrubScroll, { passive: true });
  }

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

    var url = "https://wa.me/" + line.value + "?text=" + encodeURIComponent(text);
    if (status) {
      status.textContent = "WhatsApp açılıyor. Pencere gelmezse tarayıcının açılır pencere engelini kapatıp yeniden deneyin.";
    }

    var popup = window.open(url, "_blank", "noopener,noreferrer");
    if (!popup) window.location.assign(url);
  });
})();
