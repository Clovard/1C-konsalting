(function () {
  const cfg = window.SITE_CONFIG;

  if (cfg) {
    initAbout(cfg.about);
    initLocation(cfg.location);
    const tg = document.querySelector('[data-contact="telegram"]');
    if (tg && cfg.telegram) {
      tg.href = cfg.telegram.url;
      tg.querySelector(".contact-value").textContent = `@${cfg.telegram.username}`;
    }

    const max = document.querySelector('[data-contact="max"]');
    if (max && cfg.max) {
      max.href = cfg.max.url;
      max.querySelector(".contact-value").textContent = cfg.max.label;
    }

    const email = document.querySelector('[data-contact="email"]');
    if (email && cfg.email) {
      email.href = `mailto:${cfg.email}`;
      email.querySelector(".contact-value").textContent = cfg.email;
    }

    const phone = document.querySelector('[data-contact="phone"]');
    if (phone && cfg.phone) {
      phone.href = `tel:${cfg.phone.tel}`;
      phone.querySelector(".contact-value").textContent = cfg.phone.display;
    }
  }

  function initLocation(location) {
    if (!location) return;

    const addressEl = document.getElementById("locationAddress");
    const scheduleEl = document.getElementById("locationSchedule");
    const linkEl = document.getElementById("locationLink");
    const mapEl = document.getElementById("yandexMap");

    if (addressEl) {
      addressEl.textContent = `${location.city}, ${location.street}`;
    }
    if (scheduleEl) {
      scheduleEl.textContent = location.schedule;
    }
    if (linkEl && location.yandexUrl) {
      linkEl.href = location.yandexUrl;
    }
    if (mapEl && location.coords) {
      const { lon, lat } = location.coords;
      const query = encodeURIComponent(`${location.city}, ${location.street}`);
      mapEl.src = `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=16&pt=${lon},${lat},pm2rdm&text=${query}`;
    }
  }

  function initAbout(about) {
    if (!about) return;

    const titleEl = document.getElementById("aboutTitle");
    const leadEl = document.getElementById("aboutLead");
    const textEl = document.getElementById("aboutText");
    const factsEl = document.getElementById("aboutFacts");
    const cardsEl = document.getElementById("aboutCards");

    if (titleEl && about.title) titleEl.textContent = about.title;
    if (leadEl) leadEl.textContent = about.lead || "";
    if (textEl) textEl.textContent = about.text || "";
    if (factsEl && about.facts) {
      factsEl.innerHTML = about.facts.map((fact) => `<li>${fact}</li>`).join("");
    }
    if (cardsEl && about.cards) {
      cardsEl.innerHTML = about.cards
        .map(
          (card, index) => `
          <article class="about-card reveal">
            <span class="about-card__num">${String(index + 1).padStart(2, "0")}</span>
            <h3>${card.title}</h3>
            <p>${card.text}</p>
          </article>`
        )
        .join("");
    }
  }

  const header = document.querySelector(".header");
  const burger = document.querySelector(".burger");
  const modal = document.getElementById("formModal");
  const infoPopup = document.getElementById("infoPopup");
  const infoTitle = document.getElementById("infoTitle");
  const infoText = document.getElementById("infoText");
  const infoList = document.getElementById("infoList");
  const marqueeTrack = document.getElementById("marqueeTrack");
  const marqueeBar = document.getElementById("marqueeBar");
  const form = document.getElementById("feedback-form");
  const formStatus = document.getElementById("form-status");
  const yearEl = document.getElementById("year");
  const typingEl = document.getElementById("typingText");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  window.addEventListener("scroll", () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
    marqueeBar?.classList.toggle("marquee--floated", window.scrollY > 60);
  }, { passive: true });

  let activeMarqueeBtn = null;

  function closeInfoPopup() {
    infoPopup?.classList.remove("is-open");
    infoPopup?.setAttribute("aria-hidden", "true");
    marqueeBar?.classList.remove("is-paused", "is-open");
    activeMarqueeBtn?.classList.remove("is-active");
    activeMarqueeBtn = null;
    if (!modal?.classList.contains("is-open")) {
      document.body.style.overflow = "";
    }
  }

  function openInfoPopup(topic, btn) {
    if (!infoPopup || !topic) return;
    activeMarqueeBtn?.classList.remove("is-active");
    activeMarqueeBtn = btn || null;
    activeMarqueeBtn?.classList.add("is-active");
    infoTitle.textContent = topic.title;
    infoText.textContent = topic.text;
    infoList.innerHTML = topic.points.map((point) => `<li>${point}</li>`).join("");
    infoPopup.classList.add("is-open");
    infoPopup.setAttribute("aria-hidden", "false");
    marqueeBar?.classList.add("is-paused", "is-open");
    document.body.style.overflow = "hidden";
  }

  function openModal() {
    closeInfoPopup();
    modal?.classList.add("is-open");
    modal?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal?.classList.remove("is-open");
    modal?.setAttribute("aria-hidden", "true");
    if (!infoPopup?.classList.contains("is-open")) {
      document.body.style.overflow = "";
    }
  }

  document.querySelectorAll("[data-open-modal]").forEach((el) => {
    el.addEventListener("click", openModal);
  });

  document.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.querySelectorAll("[data-close-info]").forEach((el) => {
    el.addEventListener("click", closeInfoPopup);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeInfoPopup();
      closeModal();
    }
  });

  function buildMarqueeItem(topic) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "marquee__item";
    btn.textContent = topic.label;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openInfoPopup(topic, btn);
    });
    return btn;
  }

  function initMarquee() {
    const topics = window.MARQUEE_TOPICS;
    if (!marqueeTrack || !topics?.length) return;

    marqueeTrack.innerHTML = "";

    const createSet = () => {
      const frag = document.createDocumentFragment();
      topics.forEach((topic, index) => {
        frag.appendChild(buildMarqueeItem(topic));
        if (index < topics.length - 1) {
          const dot = document.createElement("span");
          dot.className = "marquee__dot";
          dot.textContent = "◆";
          frag.appendChild(dot);
        }
      });
      const gap = document.createElement("span");
      gap.className = "marquee__dot";
      gap.textContent = "◆";
      frag.appendChild(gap);
      return frag;
    };

    marqueeTrack.appendChild(createSet());
    marqueeTrack.appendChild(createSet());
  }

  initMarquee();

  const mobileOverlay = document.createElement("div");
  mobileOverlay.className = "mobile-overlay";
  const mobileNav = document.createElement("nav");
  mobileNav.className = "mobile-nav";
  mobileNav.setAttribute("aria-label", "Мобильное меню");
  mobileNav.innerHTML = `
    <a href="#about">О нас</a>
    <a href="#services">Услуги</a>
    <a href="#expertise">Стек</a>
    <a href="#process">Процесс</a>
    <a href="#contact">Контакты</a>
    <button type="button" class="nav-link nav-link--accent" data-open-modal>Заявка</button>
  `;
  document.body.append(mobileOverlay, mobileNav);

  function closeMobile() {
    burger?.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("is-open");
    mobileOverlay.classList.remove("is-open");
  }

  burger?.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!open));
    mobileNav.classList.toggle("is-open", !open);
    mobileOverlay.classList.toggle("is-open", !open);
  });

  mobileOverlay.addEventListener("click", closeMobile);
  mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMobile));
  mobileNav.querySelector("[data-open-modal]")?.addEventListener("click", () => {
    closeMobile();
    openModal();
  });

  const phrases = [
    "Нужен отчёт по продажам?",
    "Интеграция с маркетплейсом?",
    "Ошибка после обновления?",
    "Автоматизация склада?",
    "Доработка без снятия с поддержки?",
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function typeLoop() {
    if (!typingEl) return;
    const current = phrases[phraseIdx];

    if (!deleting) {
      typingEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(typeLoop, 2000);
        return;
      }
    } else {
      typingEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    setTimeout(typeLoop, deleting ? 40 : 70);
  }

  typeLoop();

  function animateCounters() {
    document.querySelectorAll(".stat__value[data-count]").forEach((el) => {
      const target = Number(el.dataset.count);
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }

  const statsBlock = document.querySelector(".stats");
  if (statsBlock) {
    const statsObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    statsObs.observe(statsBlock);
  }

  const revealEls = document.querySelectorAll(
    ".card, .step, .quote, .cta-block, .hero-panel, .hero__content, .about__intro, .about-card, .location__grid"
  );
  revealEls.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );

  function observeReveal() {
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => observer.observe(el));
  }

  observeReveal();

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    formStatus.className = "form-status";
    formStatus.textContent = "";

    const name = form.name.value.trim();
    const contact = form.contact.value.trim();
    const message = form.message.value.trim();

    if (!name || !contact || !message) {
      formStatus.className = "form-status is-error";
      formStatus.textContent = "Заполните все поля.";
      return;
    }

    const emailLink = document.querySelector('[data-contact="email"]');
    const targetEmail = emailLink?.href.replace("mailto:", "") || cfg?.email || "your@email.ru";

    const subject = encodeURIComponent("Заявка с сайта 1С IT-консалтинг");
    const body = encodeURIComponent(`Имя: ${name}\nКонтакт: ${contact}\n\n${message}`);

    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

    formStatus.className = "form-status is-success";
    formStatus.textContent = "Открывается почтовый клиент. Или напишите в Telegram.";
    form.reset();
    setTimeout(closeModal, 1500);
  });
})();
