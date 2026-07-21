import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const blogDir = path.join(root, "blog");

const MODAL = `
  <div class="modal" id="formModal" aria-hidden="true">
    <div class="modal__backdrop" data-close-modal></div>
    <div class="modal__content" role="dialog" aria-labelledby="modalTitle">
      <button type="button" class="modal__close" data-close-modal aria-label="Закрыть">×</button>
      <div class="modal__head">
        <div class="modal__icon">✉</div>
        <h3 id="modalTitle">Оставить заявку</h3>
        <p>Заполните форму — свяжусь с вами в ближайшее время</p>
      </div>
      <form id="feedback-form" novalidate>
        <div class="field">
          <label for="name">Имя</label>
          <input type="text" id="name" name="name" class="form-input" placeholder="Иван" required autocomplete="name">
        </div>
        <div class="field">
          <label for="contact-field">Телефон или Telegram</label>
          <input type="text" id="contact-field" name="contact" class="form-input" placeholder="+7 … или @username" required>
        </div>
        <div class="field">
          <label for="message">Комментарий</label>
          <textarea id="message" name="message" class="form-input" rows="3" placeholder="Кратко опишите задачу" required></textarea>
        </div>
        <button type="submit" class="btn btn--full">Отправить</button>
        <p class="form-status" id="form-status" role="status" aria-live="polite"></p>
      </form>
    </div>
  </div>`;

function formatRuDate(iso) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

function renderPost(post) {
  const url = `https://1c-konsalting.ru/blog/${post.slug}.html`;
  const keywords = post.keywords.join(", ");
  const ogTitle = post.ogTitle || post.title;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${post.description}">
  <meta name="keywords" content="${keywords}">
  <meta name="robots" content="index, follow">
  <meta name="author" content="IT-консалтинг">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:site_name" content="IT-консалтинг">
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${post.excerpt}">
  <meta property="og:url" content="${url}">
  <meta property="article:published_time" content="${post.date}">
  <meta property="article:section" content="${post.category}">
  <title>${post.title} | Блог IT-консалтинг</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Rajdhani:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/styles.css">
  <link rel="icon" href="../assets/logo.svg" type="image/svg+xml">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": ${JSON.stringify(post.title)},
    "description": ${JSON.stringify(post.description)},
    "datePublished": "${post.date}",
    "dateModified": "${post.date}",
    "author": { "@type": "Organization", "name": "IT-консалтинг" },
    "publisher": { "@type": "Organization", "name": "IT-консалтинг", "url": "https://1c-konsalting.ru" },
    "mainEntityOfPage": { "@type": "WebPage", "@id": "${url}" },
    "keywords": ${JSON.stringify(keywords)}
  }
  </script>
</head>
<body data-page="blog-post">
  <header class="header" id="top">
    <div class="container header__inner">
      <a class="logo" href="../index.html" aria-label="На главную">
        <img class="logo__mark" src="../assets/logo.svg" width="40" height="40" alt="">
        <span class="logo__wordmark">
          <span class="logo__name">IT <em>консалтинг</em></span>
          <span class="logo__tagline">Блог</span>
        </span>
      </a>
      <nav class="nav" aria-label="Основная навигация">
        <a href="../index.html" class="nav-link">Главная</a>
        <a href="../1c.html" class="nav-link">1С</a>
        <a href="../automation.html" class="nav-link">Автоматизация</a>
        <a href="../cases.html" class="nav-link">Кейсы</a>
        <a href="../blog.html" class="nav-link nav-link--active">Блог</a>
        <a href="../index.html#contact" class="nav-link">Контакты</a>
        <button type="button" class="nav-link nav-link--accent" data-open-modal>Заявка</button>
      </nav>
      <button class="burger" aria-label="Открыть меню" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <main id="main-content">
    <article class="section article-page" itemscope itemtype="https://schema.org/BlogPosting">
      <div class="container article-page__inner">
        <nav class="breadcrumb" aria-label="Хлебные крошки">
          <ol class="breadcrumb__list">
            <li><a href="../index.html">Главная</a></li>
            <li><a href="../blog.html">Блог</a></li>
            <li aria-current="page">${post.breadcrumb}</li>
          </ol>
        </nav>

        <header class="article-page__header">
          <span class="blog-card__category">${post.category}</span>
          <h1 class="article-page__title" itemprop="headline">${post.title}</h1>
          <p class="article-page__meta">
            <time datetime="${post.date}" itemprop="datePublished">${formatRuDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>${post.readTime}</span>
          </p>
        </header>

        <div class="article-page__content" itemprop="articleBody">
          ${post.body}
          <div class="article-seo-cta">
            <p><strong>IT-консалтинг в Новосибирске и по России</strong> — интеграция 1С и Bitrix24, настройка CRM, доработки и AI-автоматизация. <a href="../integraciya-1c-bitrix24.html">Интеграция 1С и Bitrix24</a> · <a href="../1c.html">Услуги 1С</a> · <a href="../index.html#contact">Оставить заявку</a></p>
          </div>
        </div>

        <footer class="article-page__footer">
          <a class="btn" href="../blog.html">← Все статьи</a>
          ${post.footerLink ? `<a class="article-page__link" href="${post.footerLink.href}">${post.footerLink.label}</a>` : ""}
        </footer>
      </div>
    </article>
  </main>

  <footer class="footer">
    <div class="container footer__inner">
      <a class="logo logo--sm" href="../index.html" aria-label="На главную">
        <img class="logo__mark" src="../assets/logo.svg" width="32" height="32" alt="">
        <span class="logo__wordmark"><span class="logo__name">IT <em>консалтинг</em></span></span>
      </a>
      <p>© <span id="year"></span> IT-консалтинг</p>
      <nav class="footer-seo" aria-label="Услуги и разделы">
        <a href="../integraciya-1c-bitrix24.html">Интеграция 1С Bitrix24</a>
        <a href="../1c.html">Программист 1С</a>
        <a href="../automation.html">Настройка Bitrix24</a>
        <a href="../cases.html">Кейсы</a>
        <a href="../blog.html">Блог</a>
      </nav>
      <a href="#top" class="footer__top">Наверх ↑</a>
    </div>
  </footer>
${MODAL}

  <script src="../js/config.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
`;
}

const posts = [
  {
    slug: "integraciya-1c-bitrix24",
    breadcrumb: "Интеграция 1С и Bitrix24",
    title: "Интеграция 1С и Bitrix24: с чего начать и как не утонуть в хаосе",
    description:
      "Пошаговый разбор запуска связки 1С и Bitrix24: подготовка баз, воронки, обмен сущностями, типовые ошибки и чек-лист перед стартом проекта.",
    excerpt:
      "Как подготовить 1С и CRM, спроектировать обмен и запустить интеграцию без «сломанных» процессов у отдела продаж.",
    date: "2026-07-10",
    category: "1С · Bitrix24",
    readTime: "7 мин",
    keywords: ["интеграция 1с bitrix24", "битрикс24комплексут", "обмен 1с crm"],
    footerLink: { href: "../integraciya-1c-bitrix24.html", label: "Заказать интеграцию →" },
    body: `
          <p>Связка 1С и Bitrix24 — один из самых частых запросов от торговых и сервисных компаний. CRM нужна для лидов и задач менеджеров, 1С — для учёта, документов и склада. Проблема в том, что интеграцию часто запускают «с модуля», не подготовив процессы.</p>
          <h2>1. Подготовка баз и данных</h2>
          <p>До настройки обмена приведите в порядок контрагентов, номенклатуру и дубли в CRM. В 1С проверьте актуальность типового модуля Битрикс24КомплексУТ.</p>
          <h2>2. Глоссарий и карта сущностей</h2>
          <p>Зафиксируйте, что считается лидом, сделкой, заказом и счётом. Кто создаёт документ — CRM или 1С? Какие статусы синхронизируются?</p>
          <h2>3. Воронки и роли</h2>
          <p>Для опта часто нужны две воронки: входящий поток и активные продажи. Назначьте ответственных и SLA до включения обмена.</p>
          <h2>4. Запуск поэтапно</h2>
          <p>Контрагенты по ИНН → заказы и статусы → КП и счета в таймлайн. Так проще локализовать ошибки.</p>
          <h2>5. Типовые ошибки</h2>
          <ul>
            <li>Обмен включили до обучения менеджеров.</li>
            <li>Нет контроля просрочек и «забытых» сделок.</li>
            <li>Игнорируют доработки под реальный процесс.</li>
          </ul>
          <p>Нужна помощь с запуском — смотрите <a href="../cases.html">кейсы</a> или оставьте заявку.</p>`,
  },
  {
    slug: "avtomatizaciya-kp-1c",
    breadcrumb: "Автоматизация КП в 1С",
    title: "Как автоматизировать КП и счета из 1С в Bitrix24",
    description:
      "Зачем выводить коммерческие предложения и счета из 1С в таймлайн сделки Bitrix24 автоматически и как это сокращает ручную работу менеджеров.",
    excerpt:
      "PDF из заказа и счёта — в CRM без лишних кликов: логика, типовые сценарии и авторские доработки поверх обмена.",
    date: "2026-07-05",
    category: "1С · УТ 11",
    readTime: "5 мин",
    keywords: ["кп из 1с", "счёт bitrix24", "автоматизация продаж 1с"],
    footerLink: { href: "../cases.html#products", label: "Модули Б24КП и Б24АЭ →" },
    body: `
          <p>Менеджер формирует заказ в 1С, печатает КП, сохраняет PDF, прикрепляет в Bitrix24 — знакомый сценарий? Каждый лишний шаг увеличивает время ответа клиенту.</p>
          <h2>Зачем PDF в таймлайне сделки</h2>
          <p>Таймлайн Bitrix24 — единая история общения. Когда КП и счёт попадают туда автоматически, руководитель видит полную картину без переключения между системами.</p>
          <h2>Что умеет типовой модуль</h2>
          <p>Битрикс24КомплексУТ синхронизирует заказы и контрагентов. Автоформирование КП и экспорт счёта при печати часто требуют доработок.</p>
          <h2>Авторские сценарии</h2>
          <ul>
            <li><strong>КП из заказа</strong> — PDF в сделку по ИНН или новая сделка через вебхук.</li>
            <li><strong>Автоэкспорт счёта</strong> — PDF в таймлайн без ручной кнопки.</li>
          </ul>
          <p>Подробнее — модули <a href="../cases.html#b24-kp-formirovanie-kp">Б24КП</a> и <a href="../cases.html#b24-ae-autoexport-scheta">Б24АЭ</a>.</p>`,
  },
  {
    slug: "crm-bitrix24-servis",
    breadcrumb: "CRM для сервиса",
    title: "CRM Bitrix24 для сервисного бизнеса: воронка, поля и автоматизация",
    description:
      "Как спроектировать CRM для автосервиса, детейлинга или сервисной компании: этапы сделки, карточка заказа, напоминания и интеграции.",
    excerpt:
      "От первого обращения до выдачи и оплаты — структура воронки, обязательные поля и роботы для ежедневной работы команды.",
    date: "2026-06-28",
    category: "Bitrix24 · CRM",
    readTime: "6 мин",
    keywords: ["crm bitrix24", "воронка сервис", "автоматизация bitrix24"],
    footerLink: { href: "../cases.html#case-autostyle-detailing", label: "Кейс AutoStyle Detailing →" },
    body: `
          <p>Автосервис и детейлинг требуют своей воронки: консультация → запись → в работе → выдача и оплата. Универсальная CRM «новая → успех» не работает.</p>
          <h2>Этапы воронки</h2>
          <p>На каждом этапе — свои поля и задачи: авто, услуги, филиал, источник лида, срок выдачи.</p>
          <h2>Автоматизация</h2>
          <p>Напоминания в MAX и Telegram, печать актов, интеграция с Я.Метрикой и Я.Директ для ретаргетинга «тёплых» клиентов.</p>
          <p>Пример — <a href="../cases.html#case-autostyle-detailing">кейс AutoStyle Detailing</a>.</p>`,
  },
  {
    slug: "n8n-ai-agenty-biznes",
    breadcrumb: "n8n и AI-агенты",
    title: "n8n и AI-агенты: как автоматизировать рутину без армии разработчиков",
    description:
      "Обзор n8n для бизнеса: сценарии с AI, cron-задачи, интеграция CRM, мессенджеров и сайтов. Когда low-code выгоднее классической разработки.",
    excerpt: "Low-code автоматизация + AI: ежедневные отчёты, контент, обработка заявок и связка сервисов без монолитного кода.",
    date: "2026-07-18",
    category: "AI · n8n",
    readTime: "6 мин",
    keywords: ["n8n", "ai агент", "автоматизация бизнеса", "low-code"],
    footerLink: { href: "../automation.html", label: "Услуги автоматизации →" },
    body: `
          <p>n8n — open-source платформа автоматизации с визуальными сценариями. В связке с AI-моделями она закрывает задачи, для которых раньше писали отдельные скрипты и интеграции.</p>
          <h2>Типовые сценарии</h2>
          <ul>
            <li>Ежедневный контент для соцсетей на основе данных с сайта.</li>
            <li>Классификация входящих заявок и маршрутизация в CRM.</li>
            <li>Сводки для руководителя: продажи, просрочки, KPI.</li>
            <li>Синхронизация между Bitrix24, Google Sheets, Telegram и 1С через API.</li>
          </ul>
          <h2>Когда n8n — хороший выбор</h2>
          <p>Если процесс меняется часто, участников несколько, а бюджет на «большую разработку» ограничен. Для тяжёлой транзакционной логики в 1С n8n дополняет, но не заменяет учётную систему.</p>
          <h2>Хостинг и безопасность</h2>
          <p>Сценарии можно развернуть на Timeweb, VPS или облаке. Важно: ключи API, персональные данные и логи ошибок — не в публичных webhook без авторизации.</p>
          <p>Пример — кейс <a href="../cases.html#case-automated-travel">Automated Travel</a> с AI-контентом для турагентства.</p>`,
  },
  {
    slug: "bitrix24-copilot-ai-2026",
    breadcrumb: "Bitrix24 CoPilot",
    title: "Bitrix24 и AI в 2026: CoPilot, чат-боты и умная автоматизация CRM",
    description:
      "Что даёт встроенный AI в Bitrix24: CoPilot в задачах и CRM, генерация текстов, анализ переписки. Как использовать без хаоса в данных.",
    excerpt: "CoPilot, роботы и AI-скрипты в Bitrix24 — что уже работает в CRM и что лучше настраивать с интегратором.",
    date: "2026-07-16",
    category: "Bitrix24 · AI",
    readTime: "5 мин",
    keywords: ["bitrix24 copilot", "ai bitrix24", "crm ai", "новости bitrix24"],
    footerLink: { href: "../automation.html", label: "Автоматизация Bitrix24 →" },
    body: `
          <p>Bitrix24 активно развивает AI-функции: CoPilot помогает формулировать письма, резюмировать звонки и заполнять поля CRM. Но технология не отменяет настройку процессов — без чистой базы AI усиливает беспорядок.</p>
          <h2>CoPilot в ежедневной работе</h2>
          <ul>
            <li>Черновики писем клиентам и коммерческих предложений.</li>
            <li>Краткое резюме длинной переписки в сделке.</li>
            <li>Подсказки по следующему шагу в воронке.</li>
          </ul>
          <h2>Чат-боты и открытые линии</h2>
          <p>Боты принимают заявки с сайта, квалифицируют лид и создают сделку. Связка с 1С — через обмен или webhook после согласования состава полей.</p>
          <h2>На что смотреть при внедрении</h2>
          <p>Единые шаблоны полей, запрет на «ручной хаос» в стадиях, обучение менеджеров проверять AI-тексты перед отправкой клиенту.</p>`,
  },
  {
    slug: "1c-fresh-vs-server",
    breadcrumb: "1С Fresh vs сервер",
    title: "1С Fresh или свой сервер: что выбрать малому и среднему бизнесу",
    description:
      "Сравнение 1С Fresh и локальной базы: стоимость, обновления, доработки, интеграции с Bitrix24 и когда нужен выделенный сервер.",
    excerpt: "Облако или on-premise: плюсы, минусы и критерии выбора для торговли и производства.",
    date: "2026-07-14",
    category: "1С",
    readTime: "6 мин",
    keywords: ["1с fresh", "1с облако", "1с сервер", "аренда 1с"],
    footerLink: { href: "../1c.html", label: "Услуги 1С →" },
    body: `
          <p>Выбор между 1С Fresh и серверной базой — не только про цену подписки. Это про доработки, интеграции, объём данных и требования к безопасности.</p>
          <h2>1С Fresh — когда подходит</h2>
          <ul>
            <li>Типовая конфигурация без тяжёлых доработок.</li>
            <li>Небольшой штат пользователей, нужны быстрые обновления от вендора.</li>
            <li>Нет своей IT-инфраструктуры.</li>
          </ul>
          <h2>Свой сервер — когда нужен</h2>
          <ul>
            <li>Нетиповые доработки, расширения, RDP/тонкий клиент для десятков пользователей.</li>
            <li>Сложный обмен с WMS, маркетплейсами, Bitrix24 с кастомной логикой.</li>
            <li>Требования к хранению данных on-premise.</li>
          </ul>
          <h2>Интеграция с Bitrix24</h2>
          <p>В обоих вариантах возможна связка с CRM; важнее стабильность API и версия конфигурации (УТ 11, ERP и т.д.).</p>`,
  },
  {
    slug: "roistat-bitrix24-analytika",
    breadcrumb: "Roistat + Bitrix24",
    title: "Roistat и Bitrix24: сквозная аналитика для отдела продаж",
    description:
      "Как связать Roistat с Bitrix24: коллтрекинг, UTM, ROI рекламы и передача лидов в CRM. Настройка без потери данных.",
    excerpt: "От клика по рекламе до сделки в CRM — как настроить Roistat и Bitrix24 для прозрачной аналитики.",
    date: "2026-07-12",
    category: "Bitrix24 · Аналитика",
    readTime: "5 мин",
    keywords: ["roistat bitrix24", "сквозная аналитика", "utm crm", "коллтрекинг"],
    footerLink: { href: "../cases.html#case-stroysnab", label: "Кейс со Roistat →" },
    body: `
          <p>Roistat показывает, какая реклама приносит реальные сделки, а не только заявки. В связке с Bitrix24 менеджеры видят источник в карточке, а маркетолог — ROI по каналам.</p>
          <h2>Что настроить в первую очередь</h2>
          <ul>
            <li>Передача лидов и сделок из форм и звонков в Bitrix24.</li>
            <li>UTM-метки и коллтрекинг на сайте.</li>
            <li>Сопоставление статусов сделки с этапами в Roistat.</li>
          </ul>
          <h2>Типовые проблемы</h2>
          <p>Дубли лидов, ручное создание сделок без источника, расхождение сумм между 1С и CRM. Решается правилами роботов и синхронизацией оплат из учёта.</p>
          <p>В проекте <a href="../cases.html#case-stroysnab">СтройСнаб</a> Roistat входил в комплекс настройки CRM.</p>`,
  },
  {
    slug: "oshibki-vnedreniya-crm",
    breadcrumb: "Ошибки CRM",
    title: "7 ошибок при внедрении CRM, из-за которых Bitrix24 «не взлетает»",
    description:
      "Почему CRM не используют менеджеры: нет процесса, лишние поля, отсутствие KPI и интеграции с учётом. Как исправить до и после запуска.",
    excerpt: "CRM купили — Excel остался? Разбор частых провалов внедрения и что делать на практике.",
    date: "2026-07-08",
    category: "Bitrix24 · CRM",
    readTime: "6 мин",
    keywords: ["ошибки crm", "внедрение bitrix24", "crm не работает"],
    footerLink: { href: "../automation.html", label: "Помощь с CRM →" },
    body: `
          <p>Bitrix24 «не работает» редко из-за софта. Чаще — из-за процесса, который не спроектировали или не контролируют.</p>
          <h2>Типичные ошибки</h2>
          <ol>
            <li><strong>CRM без воронки под бизнес</strong> — оставили шаблон «продажи».</li>
            <li><strong>Слишком много полей</strong> — менеджеры заполняют минимум.</li>
            <li><strong>Нет связи с 1С</strong> — двойной ввод заказов и счетов.</li>
            <li><strong>Руководитель не смотрит отчёты</strong> — дисциплина падает за неделю.</li>
            <li><strong>Нет роботов</strong> — всё на памяти менеджера.</li>
            <li><strong>Обучение «за час»</strong> — без сценариев по ролям.</li>
            <li><strong>Игнор чистки базы</strong> — дубли и мусор с первого дня.</li>
          </ol>
          <h2>Как повысить adoption</h2>
          <p>KPI по заполнению CRM, простые обязательные поля, автозадачи, интеграция документов из 1С — менеджер видит выгоду, а не «ещё одну систему».</p>`,
  },
  {
    slug: "telegram-max-bitrix24",
    breadcrumb: "Telegram и MAX в B24",
    title: "Telegram и MAX в Bitrix24: каналы связи с клиентами в 2026",
    description:
      "Как подключить Telegram и мессенджер MAX к Bitrix24: открытые линии, уведомления менеджерам, роботы и типовые сценарии для продаж и сервиса.",
    excerpt: "Клиент пишет в Telegram или MAX — менеджер отвечает из CRM, история сохраняется в сделке.",
    date: "2026-07-06",
    category: "Bitrix24 · Мессенджеры",
    readTime: "5 мин",
    keywords: ["telegram bitrix24", "max bitrix24", "открытые линии", "мессенджер crm"],
    footerLink: { href: "../cases.html", label: "Кейсы с MAX/TG →" },
    body: `
          <p>Клиенты всё чаще пишут в мессенджеры, а не на почту. Bitrix24 собирает переписку в сделку через открытые линии — если каналы настроены правильно.</p>
          <h2>Telegram</h2>
          <p>Бот для заявок, личные чаты менеджеров, уведомления о смене стадии. Роботы могут слать клиенту напоминание о записи или статус заказа.</p>
          <h2>MAX</h2>
          <p>Российский мессенджер всё активнее используют для B2C. Интеграция через коннекторы и webhook — сценарии те же: лид → сделка → задача ответственному.</p>
          <h2>Лучшие практики</h2>
          <ul>
            <li>Единый номер/бот для маркетинга, персональные линии для ключевых клиентов.</li>
            <li>SLA на первый ответ в CRM.</li>
            <li>Запрет ответов «мимо CRM» для контроля качества.</li>
          </ul>`,
  },
  {
    slug: "1c-erp-proizvodstvo-start",
    breadcrumb: "1С ERP производство",
    title: "1С:ERP для производства: с чего начать внедрение",
    description:
      "Первые шаги внедрения 1С:ERP на производстве: номенклатура, спецификации, планирование, склад и типовые ошибки на старте.",
    excerpt: "ERP — не «купить и работать»: подготовка данных, процессы цеха и склада, поэтапный запуск.",
    date: "2026-07-04",
    category: "1С · ERP",
    readTime: "7 мин",
    keywords: ["1с erp", "erp производство", "внедрение erp", "1с производство"],
    footerLink: { href: "../1c.html", label: "Консалтинг 1С →" },
    body: `
          <p>1С:ERP — мощный инструмент, но внедрение «сразу всё» paralyzes производство. Рабочий подход — поэтапный запуск по контурам.</p>
          <h2>Этап 0: Нормативно-справочная информация</h2>
          <p>Номенклатура, единицы измерения, спецификации, маршруты — без этого MRP и заказы не взлетят.</p>
          <h2>Этап 1: Склад и закупки</h2>
          <p>Поступления, резервы, минимальные остатки. Связь с продажами — через УТ или интегрированный контур ERP.</p>
          <h2>Этап 2: Производство</h2>
          <p>Заказы на производство, выпуск, брак, калькуляция. Отчётность для директора — только после стабильного ввода данных с цеха.</p>
          <h2>Связь с CRM</h2>
          <p>Коммерческие заказы из Bitrix24 → заказ клиента в 1С — типовой сценарий для производственных компаний с отделом продаж.</p>`,
  },
  {
    slug: "bitrix24-robots-prodazhi",
    breadcrumb: "Роботы Bitrix24",
    title: "Роботы Bitrix24 для продаж: 10 сценариев, которые окупаются быстро",
    description:
      "Практические роботы CRM: напоминания, смена стадий, создание задач, контроль просрочек, уведомления в мессенджеры и интеграция с 1С.",
    excerpt: "Автоматизация без программирования: роботы и триггеры для входящего и активного потока.",
    date: "2026-07-02",
    category: "Bitrix24",
    readTime: "6 мин",
    keywords: ["роботы bitrix24", "автоматизация crm", "триггеры bitrix24"],
    footerLink: { href: "../automation.html", label: "Настройка роботов →" },
    body: `
          <p>Роботы Bitrix24 — самый быстрый ROI в CRM. Не требуют кода, но требуют понимания процесса продаж.</p>
          <h2>Сценарии для входящего потока</h2>
          <ul>
            <li>Новый лид → задача «перезвонить за 15 минут».</li>
            <li>Нет активности 2 дня → уведомление РОП.</li>
            <li>Стадия «КП отправлено» → контроль через 3 дня.</li>
          </ul>
          <h2>Для активных продаж</h2>
          <ul>
            <li>Плановый follow-up по базе «спящих» клиентов.</li>
            <li>Автозадача при изменении суммы сделки.</li>
            <li>Передача сделки при отпуске менеджера.</li>
          </ul>
          <h2>Связь с 1С</h2>
          <p>Роботы реагируют на статусы оплаты и отгрузки, приходящие из обмена — менеджер не проверяет 1С вручную.</p>`,
  },
  {
    slug: "avtomatizaciya-kontenta-n8n",
    breadcrumb: "Контент на n8n",
    title: "Автоматизация контента на n8n: посты, AI и соцсети без ручного копирования",
    description:
      "Как собрать конвейер контента: парсинг сайта, генерация текста AI, публикация в Telegram, VK и Max. Кейс турагентства.",
    excerpt: "Cron → AI → Max/TG/VK: ежедневные посты о турах и услугах без рутины копирайтера.",
    date: "2026-06-25",
    category: "AI · n8n",
    readTime: "5 мин",
    keywords: ["автоматизация контента", "n8n ai", "smm автоматизация"],
    footerLink: { href: "../cases.html#case-automated-travel", label: "Кейс Automated Travel →" },
    body: `
          <p>Малый бизнес тонет в SMM: нужен контент каждый день, а данные уже есть на сайте — тарифы, акции, кейсы.</p>
          <h2>Архитектура сценария</h2>
          <ol>
            <li>Cron запускает сценарий n8n по расписанию.</li>
            <li>Сбор данных с сайта или CRM.</li>
            <li>AI формирует текст и подбирает структуру поста.</li>
            <li>Публикация в Max, Telegram, VK.</li>
          </ol>
          <h2>Риски</h2>
          <p>Проверяйте факты (цены, даты), храните черновики для спорных тем, не публикуйте персональные данные клиентов.</p>
          <p>Реализовано в <a href="../cases.html#case-automated-travel">кейсе Automated Travel</a>.</p>`,
  },
  {
    slug: "1c-edo-dokumenty",
    breadcrumb: "ЭДО в 1С",
    title: "ЭДО в 1С в 2026: электронные документы, маркировка и типовые конфигурации",
    description:
      "Обзор электронного документооборота в 1С: УПД, счета-фактуры, интеграция с операторами ЭДО, маркировка и что проверить в базе.",
    excerpt: "ЭДО перестал быть «опцией» — как подготовить 1С:УТ и БП к обмену юридически значимыми документами.",
    date: "2026-06-22",
    category: "1С · ЭДО",
    readTime: "6 мин",
    keywords: ["эдо 1с", "электронные документы", "упд 1с", "маркировка 1с"],
    footerLink: { href: "../1c.html", label: "Сопровождение 1С →" },
    body: `
          <p>ЭДО в 1С — обязательный контур для многих B2B-поставщиков. Ошибки в настройке тормозят отгрузки и оплаты.</p>
          <h2>Что проверить</h2>
          <ul>
            <li>Подключение к оператору (СБИС, Диадок, Калuga Аstral и др.).</li>
            <li>Сопоставление контрагентов и договоров.</li>
            <li>Форматы УПД и статусы подписания.</li>
            <li>Маркировка «Честный знак» для нужных категорий товаров.</li>
          </ul>
          <h2>Связь с CRM</h2>
          <p>Bitrix24 не заменяет ЭДО, но статус «документы подписаны» может возвращаться в сделку для менеджера через интеграцию или робота.</p>`,
  },
  {
    slug: "migraciya-1c-ut-11",
    breadcrumb: "Миграция на УТ 11",
    title: "Миграция на 1С:УТ 11: этапы, риски и интеграция с Bitrix24",
    description:
      "Как перейти на 1С:Управление торговлей 11 с older версий или других конфигураций: перенос данных, обмен, тестовый контур, запуск.",
    excerpt: "УТ 11 + Bitrix24: что переносить, что перенастроить и как не остановить продажи на переезде.",
    date: "2026-06-18",
    category: "1С · УТ 11",
    readTime: "7 мин",
    keywords: ["ут 11", "миграция 1с", "управление торговлей 11", "переход ут"],
    footerLink: { href: "../cases.html", label: "Кейсы УТ 11 →" },
    body: `
          <p>Переход на УТ 11 — часто точка, где одновременно перезапускают интеграцию с Bitrix24. Без плана получают двойной простой.</p>
          <h2>Этапы миграции</h2>
          <ol>
            <li>Аудит доработок старой базы — что переносим в расширения.</li>
            <li>Тестовый контур УТ 11 + копия CRM.</li>
            <li>Перенос НСИ, остатков, незакрытых заказов.</li>
            <li>Настройка Битрикс24КомплексУТ и авторских модулей.</li>
            <li>Обучение и параллельный запуск (короткое окно).</li>
          </ol>
          <h2>Риски</h2>
          <p>Несопоставленная номенклатура, «зависшие» обмены, печатные формы КП/счетов — всё это лучше закрыть до продуктива.</p>`,
  },
  {
    slug: "trendy-avtomatizacii-2026",
    breadcrumb: "Тренды 2026",
    title: "Тренды бизнес-автоматизации в 2026: AI, CRM и low-code",
    description:
      "Обзор трендов: AI в CRM и 1С, low-code (n8n), сквозная аналитика, мессенджеры как канал продаж, интеграция учёта и маркетинга.",
    excerpt: "Что внедряют SMB в 2026: не «модно», а что реально снижает cost of sales.",
    date: "2026-06-15",
    category: "Автоматизация",
    readTime: "5 мин",
    keywords: ["тренды автоматизации 2026", "цифровизация бизнеса", "ai crm"],
    footerLink: { href: "../index.html", label: "Направления услуг →" },
    body: `
          <p>2026 год — автоматизация перестала быть «про IT». Это про скорость ответа клиенту, прозрачность для собственника и меньше ручного труда в бэкофисе.</p>
          <h2>Ключевые тренды</h2>
          <ul>
            <li><strong>AI в CRM</strong> — черновики, резюме звонков, но с контролем качества человеком.</li>
            <li><strong>Low-code интеграции</strong> — n8n и аналоги для связки сервисов без месяцев разработки.</li>
            <li><strong>Единый контур 1С + CRM</strong> — документы и статусы в одной истории клиента.</li>
            <li><strong>Мессенджеры как витрина</strong> — Telegram, MAX рядом с сайтом и телефоном.</li>
            <li><strong>Сквозная аналитика</strong> — Roistat и аналоги tied to реальной выручке из учёта.</li>
          </ul>
          <h2>Что не стоит откладывать</h2>
          <p>Чистка CRM и 1С, описание воронки, базовые роботы и одна измеримая метрика (скорость ответа, конверсия, повторные продажи).</p>
          <p>Готовы обсудить roadmap — <a href="../index.html#contact">свяжитесь с нами</a>.</p>`,
  },
];

if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

for (const post of posts) {
  const file = path.join(blogDir, `${post.slug}.html`);
  fs.writeFileSync(file, renderPost(post), "utf8");
  console.log("Wrote", file);
}

console.log(`Generated ${posts.length} blog posts.`);
