(function () {
  const cfg = window.SITE_CONFIG;
  const page = document.body.dataset.page || "1c";

  if (cfg) {
    initContacts(cfg);

    if (page === "hub") {
      initHub(cfg.hub);
      initAbout(cfg.about);
      initLocation(cfg.location);
    }

    if (page === "cases") {
      initCases(cfg.cases);
      initProducts(cfg.products);
    }

    if (page === "blog") {
      initBlog(cfg.blog, cfg.siteUrl);
    }

    if (page === "automation") {
      initAutomation(cfg.automation);
    }
  }

  function initContacts(config) {
    const tg = document.querySelector('[data-contact="telegram"]');
    if (tg && config.telegram) {
      tg.href = config.telegram.url;
      tg.querySelector(".contact-value").textContent = `@${config.telegram.username}`;
    }

    const max = document.querySelector('[data-contact="max"]');
    if (max && config.max) {
      max.href = config.max.url;
      max.querySelector(".contact-value").textContent = config.max.label;
    }

    const email = document.querySelector('[data-contact="email"]');
    if (email && config.email) {
      email.href = `mailto:${config.email}`;
      email.querySelector(".contact-value").textContent = config.email;
    }

    const phone = document.querySelector('[data-contact="phone"]');
    if (phone && config.phone) {
      phone.href = `tel:${config.phone.tel}`;
      phone.querySelector(".contact-value").textContent = config.phone.display;
    }
  }

  function initHub(hub) {
    if (!hub) return;

    const titleEl = document.getElementById("hubTitle");
    const leadEl = document.getElementById("hubLead");
    const aboutTitleEl = document.getElementById("hubAboutTitle");
    const aboutTextEl = document.getElementById("hubAboutText");
    const factsEl = document.getElementById("hubAboutFacts");
    const gridEl = document.getElementById("directionsGrid");

    if (titleEl && hub.title) titleEl.textContent = hub.title;
    if (leadEl) leadEl.textContent = hub.lead || "";
    if (aboutTitleEl && hub.aboutTitle) aboutTitleEl.textContent = hub.aboutTitle;
    if (aboutTextEl) aboutTextEl.textContent = hub.aboutText || "";
    if (factsEl && hub.facts) {
      factsEl.innerHTML = hub.facts.map((fact) => `<li>${fact}</li>`).join("");
    }

    if (gridEl && hub.directions && hub.directions.length) {
      gridEl.innerHTML = hub.directions
        .map(
          (dir) => `
          <a class="direction-card reveal ${dir.theme || ""}" href="${dir.href}">
            <span class="direction-card__label">${dir.label}</span>
            <h3 class="direction-card__title">${dir.title}</h3>
            <p class="direction-card__subtitle">${dir.subtitle || ""}</p>
            <p class="direction-card__text">${dir.text}</p>
            ${
              dir.tags && dir.tags.length
                ? `<ul class="direction-card__tags">${dir.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>`
                : ""
            }
            <span class="direction-card__cta">Перейти →</span>
          </a>`
        )
        .join("");
    }
  }

  function initAutomation(automation) {
    if (!automation) return;

    const heroTitle = document.getElementById("automationHeroTitle");
    const heroLead = document.getElementById("automationHeroLead");
    const highlightsEl = document.getElementById("automationHighlights");
    const servicesTitle = document.getElementById("automationServicesTitle");
    const servicesLead = document.getElementById("automationServicesLead");
    const servicesGrid = document.getElementById("automationServicesGrid");

    if (heroTitle && automation.heroTitle) heroTitle.textContent = automation.heroTitle;
    if (heroLead) heroLead.textContent = automation.heroLead || "";

    if (highlightsEl && automation.highlights) {
      highlightsEl.innerHTML = automation.highlights
        .map((item) => `<li>${item}</li>`)
        .join("");
    }

    if (automation.about) {
      const about = automation.about;
      const titleEl = document.getElementById("automationAboutTitle");
      const leadEl = document.getElementById("automationAboutLead");
      const textEl = document.getElementById("automationAboutText");
      const factsEl = document.getElementById("automationAboutFacts");
      const cardsEl = document.getElementById("automationAboutCards");

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

    if (automation.services) {
      if (servicesTitle && automation.services.title) {
        servicesTitle.textContent = automation.services.title;
      }
      if (servicesLead) servicesLead.textContent = automation.services.lead || "";

      if (servicesGrid && automation.services.items) {
        const iconClass = {
          primary: "card__icon--primary",
          blue: "card__icon--blue",
          green: "card__icon--green",
        };

        servicesGrid.innerHTML = automation.services.items
          .map(
            (item) => `
            <article class="card reveal">
              <div class="card__icon ${iconClass[item.icon] || "card__icon--primary"}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h3>${item.title}</h3>
              <p>${item.text}</p>
              <span class="tag tag-primary">${item.tag}</span>
            </article>`
          )
          .join("");
      }
    }
  }

  function initBlog(blog, siteUrl) {
    if (!blog) return;

    const titleEl = document.getElementById("blogHeroTitle");
    const leadEl = document.getElementById("blogHeroLead");
    const gridEl = document.getElementById("blogGrid");
    const schemaEl = document.getElementById("blogSchema");

    if (titleEl && blog.title) titleEl.textContent = blog.title;
    if (leadEl) leadEl.textContent = blog.lead || "";

    if (!gridEl || !blog.posts || !blog.posts.length) return;

    const baseUrl = siteUrl || "https://1c-konsalting.ru";

    gridEl.innerHTML = blog.posts
      .map(
        (post) => `
        <article class="blog-card card reveal">
          <span class="blog-card__category">${post.category}</span>
          <h2 class="blog-card__title">
            <a href="blog/${post.slug}.html">${post.title}</a>
          </h2>
          <p class="blog-card__excerpt">${post.excerpt}</p>
          <p class="blog-card__meta">
            <time datetime="${post.date}">${formatBlogDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>${post.readTime}</span>
          </p>
          <a class="blog-card__link" href="blog/${post.slug}.html">Читать статью →</a>
        </article>`
      )
      .join("");

    if (schemaEl) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: `Блог ${blog.title || "IT-консалтинга"}`,
        description: blog.metaDescription || blog.lead,
        url: `${baseUrl}/blog.html`,
        blogPost: blog.posts.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          url: `${baseUrl}/blog/${post.slug}.html`,
        })),
      };
      schemaEl.textContent = JSON.stringify(schema);
    }
  }

  function formatBlogDate(isoDate) {
    if (!isoDate) return "";
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(isoDate));
  }

  function initCases(cases) {
    if (!cases) return;

    const titleEl = document.getElementById("casesHeroTitle");
    const leadEl = document.getElementById("casesHeroLead");

    if (titleEl && cases.title) titleEl.textContent = cases.title;
    if (leadEl) leadEl.textContent = cases.lead || "";

    initClientCases(cases.clientCases);
  }

  function initClientCases(clientCases) {
    if (!clientCases) return;

    const titleEl = document.getElementById("clientCasesTitle");
    const leadEl = document.getElementById("clientCasesLead");
    const gridEl = document.getElementById("clientCasesGrid");
    const viewportEl = document.getElementById("clientCasesViewport");

    if (titleEl && clientCases.title) titleEl.textContent = clientCases.title;
    if (leadEl) leadEl.textContent = clientCases.lead || "";

    if (!gridEl || !clientCases.items || !clientCases.items.length) return;

    const detailEl = document.getElementById("clientCaseDetail");

    gridEl.innerHTML = clientCases.items
      .map((item, index) => {
        const logo = item.logo
          ? `<img class="case-card__logo" src="${item.logo}" alt="${item.name}" width="48" height="48" loading="lazy">`
          : `<span class="case-card__initials" aria-hidden="true">${item.initials || item.name.slice(0, 2)}</span>`;

        const summary = item.summary || item.description;

        return `
          <article class="case-card reveal ${item.theme || ""}${index === 0 ? " is-active" : ""}" id="${item.id}">
            <button type="button" class="case-card__pick" data-case-id="${item.id}" aria-pressed="${index === 0 ? "true" : "false"}">
              <div class="case-card__head">
                ${logo}
                <div>
                  ${item.badge ? `<span class="case-card__badge">${item.badge}</span>` : ""}
                  <h3 class="case-card__title">${item.name}</h3>
                  ${item.industry ? `<p class="case-card__industry">${item.industry}</p>` : ""}
                </div>
              </div>
              <p class="case-card__summary">${summary}</p>
            </button>
          </article>`;
      })
      .join("");

    initCasesCarousel(viewportEl);
    bindCaseCards(gridEl, detailEl, clientCases);
    renderCaseDetail(detailEl, clientCases.items[0], clientCases);
  }

  function caseCardLogo(item) {
    if (item.logo) {
      return `<img class="case-detail__logo" src="${item.logo}" alt="${item.name}" width="56" height="56" loading="lazy">`;
    }
    return `<span class="case-detail__initials" aria-hidden="true">${item.initials || item.name.slice(0, 2)}</span>`;
  }

  function renderCaseDetail(detailEl, item, clientCases) {
    if (!detailEl || !item) return;

    const link = item.link
      ? `<a class="case-detail__link" href="${item.link}" target="_blank" rel="noopener noreferrer">${item.linkLabel || "Подробнее"} →</a>`
      : "";

    const related = item.relatedProduct
      ? `<a class="case-detail__link" href="#${item.relatedProduct}">Смотреть модуль →</a>`
      : "";

    detailEl.hidden = false;
    detailEl.innerHTML = `
      <div class="case-detail__head">
        ${caseCardLogo(item)}
        <div>
          ${item.badge ? `<span class="case-card__badge">${item.badge}</span>` : ""}
          <h3 class="case-detail__title">${item.name}</h3>
          ${item.industry ? `<p class="case-detail__industry">${item.industry}</p>` : ""}
        </div>
      </div>
      <p class="case-detail__desc">${item.description}</p>
      ${
        item.work && item.work.length
          ? `<ul class="case-detail__list">${item.work.map((w) => `<li>${w}</li>`).join("")}</ul>`
          : ""
      }
      ${item.result ? `<p class="case-detail__result">${item.result}</p>` : ""}
      <div class="case-detail__actions">
        <button type="button" class="btn" data-case-order="${item.id}">Обсудить похожий проект</button>
        ${link}${related}
      </div>`;

    detailEl.querySelector("[data-case-order]")?.addEventListener("click", () => {
      openModal({
        title: `Проект: ${item.name}`,
        message: item.orderMessage || "Интересует проект из ваших кейсов.\n\nКратко о задаче:\n",
        resetForm: true,
      });
    });
  }

  function selectCase(cardId, gridEl, detailEl, clientCases) {
    const item = clientCases.items.find((entry) => entry.id === cardId);
    if (!item) return;

    gridEl.querySelectorAll(".case-card").forEach((card) => {
      const active = card.id === cardId;
      card.classList.toggle("is-active", active);
      card.querySelector(".case-card__pick")?.setAttribute("aria-pressed", active ? "true" : "false");
    });

    renderCaseDetail(detailEl, item, clientCases);

    const cardEl = document.getElementById(cardId);
    cardEl?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  function initCasesCarousel(viewportEl) {
    if (!viewportEl) return;

    const carousel = viewportEl.closest(".cases-carousel");
    const track = viewportEl.querySelector(".case-studies");
    const prevBtn = carousel?.querySelector(".cases-carousel__nav--prev");
    const nextBtn = carousel?.querySelector(".cases-carousel__nav--next");
    if (!carousel || !track) return;

    const updateNav = () => {
      const maxScroll = viewportEl.scrollWidth - viewportEl.clientWidth;
      carousel.classList.toggle("cases-carousel--scrollable", maxScroll > 8);
      if (prevBtn) prevBtn.disabled = viewportEl.scrollLeft <= 1;
      if (nextBtn) nextBtn.disabled = viewportEl.scrollLeft >= maxScroll - 1;
    };

    const scrollStep = () => {
      const card = track.querySelector(".case-card");
      const gap = parseFloat(getComputedStyle(track).gap) || 16;
      return card ? card.offsetWidth + gap : 280;
    };

    prevBtn?.addEventListener("click", () => {
      viewportEl.scrollBy({ left: -scrollStep(), behavior: "smooth" });
    });
    nextBtn?.addEventListener("click", () => {
      viewportEl.scrollBy({ left: scrollStep(), behavior: "smooth" });
    });

    viewportEl.addEventListener("scroll", updateNav, { passive: true });
    window.addEventListener("resize", updateNav);
    updateNav();
  }

  function bindCaseCards(gridEl, detailEl, clientCases) {
    gridEl.addEventListener("click", (event) => {
      const pickBtn = event.target.closest(".case-card__pick");
      if (!pickBtn) return;
      selectCase(pickBtn.dataset.caseId, gridEl, detailEl, clientCases);
    });
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

  function initProducts(products) {
    if (!products) return;

    const titleEl = document.getElementById("productsTitle");
    const leadEl = document.getElementById("productsLead");
    const noteEl = document.getElementById("productsNote");
    const gridEl = document.getElementById("productsGrid");
    const viewportEl = document.getElementById("productsViewport");
    const detailEl = document.getElementById("productDetail");
    const customBtn = document.getElementById("productsCustomOrder");

    if (titleEl && products.title) titleEl.textContent = products.title;
    if (leadEl) leadEl.textContent = products.lead || "";
    if (noteEl) noteEl.textContent = products.note || "";

    if (!gridEl || !products.items || !products.items.length) return;

    const hashId = window.location.hash.slice(1);
    const initialIndex = Math.max(
      0,
      products.items.findIndex((item) => item.id === hashId)
    );
    const initialItem = products.items[initialIndex];

    gridEl.classList.toggle("case-studies--duo", products.items.length === 2);
    gridEl.innerHTML = products.items
      .map((item, index) => {
        const active = index === initialIndex;

        return `
          <article class="case-card case-card--module reveal${active ? " is-active" : ""}" id="${item.id}">
            <button type="button" class="case-card__pick case-card__pick--module" data-product-id="${item.id}" aria-pressed="${active ? "true" : "false"}">
              <div class="module-pick__meta">
                ${item.badge ? `<span class="product-card__badge">${item.badge}</span>` : ""}
                ${item.subtitle ? `<p class="product-card__subtitle product-card__subtitle--sm">${item.subtitle}</p>` : ""}
              </div>
              <h3 class="case-card__title">${item.title}</h3>
              <p class="case-card__summary">${item.summary || item.description}</p>
            </button>
          </article>`;
      })
      .join("");

    initCasesCarousel(viewportEl);
    bindProductPicks(gridEl, detailEl, products);
    renderProductDetail(detailEl, initialItem, products);

    if (hashId && initialItem?.id === hashId) {
      document.getElementById(hashId)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }

    customBtn?.addEventListener("click", () => {
      openModal({
        title: "Индивидуальная разработка",
        message: products.customOrderMessage || "",
        resetForm: true,
      });
    });
  }

  function renderProductDetail(detailEl, item, products) {
    if (!detailEl || !item) return;

    detailEl.hidden = false;
    detailEl.innerHTML = `
      <div class="case-detail__head case-detail__head--module">
        <div>
          ${item.badge ? `<span class="product-card__badge">${item.badge}</span>` : ""}
          ${item.subtitle ? `<p class="case-detail__industry">${item.subtitle}</p>` : ""}
          <h3 class="case-detail__title">${item.title}</h3>
        </div>
      </div>
      <p class="case-detail__desc">${item.description}</p>
      ${
        item.features && item.features.length
          ? `<ul class="case-detail__list">${item.features.map((f) => `<li>${f}</li>`).join("")}</ul>`
          : ""
      }
      ${item.unique ? `<p class="product-detail__unique">${item.unique}</p>` : ""}
      <div class="case-detail__actions">
        <button type="button" class="btn" data-order-product="${item.id}" data-order-title="${item.title}">Уточнить цену</button>
      </div>`;
  }

  function selectProduct(productId, gridEl, detailEl, products) {
    const item = products.items.find((entry) => entry.id === productId);
    if (!item) return;

    gridEl.querySelectorAll(".case-card").forEach((card) => {
      const active = card.id === productId;
      card.classList.toggle("is-active", active);
      card.querySelector(".case-card__pick")?.setAttribute("aria-pressed", active ? "true" : "false");
    });

    renderProductDetail(detailEl, item, products);
    document.getElementById(productId)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  function bindProductPicks(gridEl, detailEl, products) {
    gridEl.addEventListener("click", (event) => {
      const pickBtn = event.target.closest(".case-card__pick");
      if (!pickBtn) return;
      selectProduct(pickBtn.dataset.productId, gridEl, detailEl, products);
    });
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
  const modalTitle = document.getElementById("modalTitle");
  const messageField = document.getElementById("message");
  const yearEl = document.getElementById("year");
  const typingEl = document.getElementById("typingText");
  const DEFAULT_MODAL_TITLE = "Оставить заявку";
  let activeOrderProduct = null;

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

  function openModal({ title, message, resetForm = true, product = null } = {}) {
    closeInfoPopup();
    activeOrderProduct = product || null;
    if (modalTitle) modalTitle.textContent = title || DEFAULT_MODAL_TITLE;
    if (resetForm) form?.reset();
    if (messageField && message) messageField.value = message;
    modal?.classList.add("is-open");
    modal?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function openOrderModal(product) {
    if (!product) {
      openModal();
      return;
    }

    const title = product.title || product;
    openModal({
      title: `Заказ: ${title}`,
      message: `Интересует: ${title}\n\nХочу уточнить стоимость и возможность внедрения под нашу базу.`,
      resetForm: true,
      product: typeof product === "object" ? product : { title },
    });
  }

  document.getElementById("products")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-order-product]");
    if (!btn) return;

    const items = cfg && cfg.products && cfg.products.items;
    const product = items && items.find((p) => p.id === btn.dataset.orderProduct);
    if (product) {
      openOrderModal(product);
      return;
    }

    if (btn.dataset.orderTitle) {
      openOrderModal({ title: btn.dataset.orderTitle, id: btn.dataset.orderProduct });
    }
  });

  function closeModal() {
    modal?.classList.remove("is-open");
    modal?.setAttribute("aria-hidden", "true");
    activeOrderProduct = null;
    if (modalTitle) modalTitle.textContent = DEFAULT_MODAL_TITLE;
    form?.reset();
    if (!infoPopup?.classList.contains("is-open")) {
      document.body.style.overflow = "";
    }
  }

  document.querySelectorAll("[data-open-modal]").forEach((el) => {
    el.addEventListener("click", () => openModal());
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
    const topics =
      page === "automation"
        ? window.AUTOMATION_MARQUEE_TOPICS
        : window.MARQUEE_TOPICS;
    if (!marqueeTrack || !topics || !topics.length) return;

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
  const MOBILE_NAV = {
    hub: `
      <a href="index.html">Главная</a>
      <a href="1c.html">1С</a>
      <a href="automation.html">Автоматизация</a>
      <a href="cases.html">Кейсы</a>
      <a href="blog.html">Блог</a>
      <a href="#contact">Контакты</a>
      <button type="button" class="nav-link nav-link--accent" data-open-modal>Заявка</button>
    `,
    "1c": `
      <a href="index.html">Главная</a>
      <a href="1c.html">1С</a>
      <a href="automation.html">Автоматизация</a>
      <a href="cases.html">Кейсы</a>
      <a href="blog.html">Блог</a>
      <a href="#services">Услуги</a>
      <a href="index.html#contact">Контакты</a>
      <button type="button" class="nav-link nav-link--accent" data-open-modal>Заявка</button>
    `,
    automation: `
      <a href="index.html">Главная</a>
      <a href="1c.html">1С</a>
      <a href="automation.html">Автоматизация</a>
      <a href="cases.html">Кейсы</a>
      <a href="blog.html">Блог</a>
      <a href="#services">Услуги</a>
      <a href="index.html#contact">Контакты</a>
      <button type="button" class="nav-link nav-link--accent" data-open-modal>Заявка</button>
    `,
    cases: `
      <a href="index.html">Главная</a>
      <a href="1c.html">1С</a>
      <a href="automation.html">Автоматизация</a>
      <a href="cases.html">Кейсы</a>
      <a href="blog.html">Блог</a>
      <a href="index.html#contact">Контакты</a>
      <button type="button" class="nav-link nav-link--accent" data-open-modal>Заявка</button>
    `,
    blog: `
      <a href="index.html">Главная</a>
      <a href="1c.html">1С</a>
      <a href="automation.html">Автоматизация</a>
      <a href="cases.html">Кейсы</a>
      <a href="blog.html">Блог</a>
      <a href="index.html#contact">Контакты</a>
      <button type="button" class="nav-link nav-link--accent" data-open-modal>Заявка</button>
    `,
    "blog-post": `
      <a href="../index.html">Главная</a>
      <a href="../1c.html">1С</a>
      <a href="../automation.html">Автоматизация</a>
      <a href="../cases.html">Кейсы</a>
      <a href="../blog.html">Блог</a>
      <a href="../index.html#contact">Контакты</a>
      <button type="button" class="nav-link nav-link--accent" data-open-modal>Заявка</button>
    `,
    landing: `
      <a href="index.html">Главная</a>
      <a href="1c.html">1С</a>
      <a href="automation.html">Автоматизация</a>
      <a href="cases.html">Кейсы</a>
      <a href="blog.html">Блог</a>
      <a href="index.html#contact">Контакты</a>
      <button type="button" class="nav-link nav-link--accent" data-open-modal>Заявка</button>
    `,
  };

  mobileNav.innerHTML = MOBILE_NAV[page] || MOBILE_NAV["1c"];
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

  const phrases =
    page === "automation"
      ? [
          "Настроить воронку в Bitrix24?",
          "AI-агент для заявок?",
          "Связать CRM с 1С?",
          "Автоматизировать согласования?",
          "Роботы на сделках?",
        ]
      : [
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
    ".card, .step, .quote, .cta-block, .hero-panel, .hero__content, .about__intro, .about-card, .location__grid, .promo-banner, .case-detail, .blog-card, .direction-card, .page-hero__content, .page-hero__panel, .integration-banner, .hub-about, .case-card"
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

  document.querySelectorAll(".case-card.reveal:not(.is-visible)").forEach((el) => observer.observe(el));

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

    const subjectText = activeOrderProduct
      ? `Заказ: ${activeOrderProduct.title} — IT-консалтинг`
      : "Заявка с сайта IT-консалтинг";
    const subject = encodeURIComponent(subjectText);
    const body = encodeURIComponent(`Имя: ${name}\nКонтакт: ${contact}\n\n${message}`);

    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

    formStatus.className = "form-status is-success";
    formStatus.textContent = "Открывается почтовый клиент. Или напишите в Telegram.";
    form.reset();
    setTimeout(closeModal, 1500);
  });
})();
