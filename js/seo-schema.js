(function () {
  const cfg = window.SITE_CONFIG;
  const seo = window.SEO_CONFIG;
  if (!cfg || !seo) return;

  const org = seo.organization;
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${org.url}/#organization`,
    name: org.name,
    url: org.url,
    logo: org.logo,
    image: org.logo,
    telephone: org.phone,
    email: org.email,
    priceRange: org.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: org.address.street,
      addressLocality: org.address.city,
      addressRegion: org.address.region,
      postalCode: org.address.postalCode,
      addressCountry: org.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: org.geo.lat,
      longitude: org.geo.lon,
    },
    areaServed: org.areaServed.map((name) => ({ "@type": "City", name })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "18:00",
      },
    ],
    sameAs: [cfg.telegram?.url, cfg.max?.url].filter(Boolean),
    knowsAbout: [
      "1С:Предприятие",
      "1С:Управление торговлей",
      "Bitrix24",
      "Интеграция 1С и Bitrix24",
      "Автоматизация бизнес-процессов",
      "n8n",
      "AI-агенты",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${org.url}/#website`,
    url: org.url,
    name: org.name,
    publisher: { "@id": `${org.url}/#organization` },
    inLanguage: "ru-RU",
    potentialAction: {
      "@type": "SearchAction",
      target: `${org.url}/blog.html?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  window.SEO_SCHEMA = { localBusiness, website };
})();
