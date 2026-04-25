const SITE_CONFIG = {
  email: "hello@vowsandveil.com",
  phoneDisplay: "09456918967",
  phoneHref: "09456918967",
  nav: [
    {
      id: "home",
      label: "Home",
      hint: "Hero, planning calculator, and signature overview",
      href: "index.html",
      icon: "home",
    },
    {
      id: "about",
      label: "About",
      hint: "Studio story, values, and lead team",
      href: "about.html",
      icon: "about",
    },
    {
      id: "venues",
      label: "Venues",
      hint: "Garden, beach, church, and ballroom inspiration",
      href: "venues.html",
      icon: "venue",
    },
    {
      id: "services",
      label: "Services",
      hint: "Planning, coordination, styling, and support levels",
      href: "services.html",
      icon: "services",
    },
    {
      id: "gallery",
      label: "Gallery",
      hint: "Curated albums of ceremony, reception, and details",
      href: "gallery.html",
      icon: "gallery",
    },
    {
      id: "contact",
      label: "Contact",
      hint: "Real contact details and online inquiry form",
      href: "contact.html",
      icon: "contact",
    },
  ],
};

const PAGE_CONFIG = {
  home: {
    title: "Home",
    eyebrow: "Luxury wedding planner",
    sidebarTitle: "Now booking 2026 to 2027.",
    sidebarScript: "Plan the day with clarity, style, and real calm.",
    ctaHref: "contact.html",
    ctaLabel: "Start your inquiry",
  },
  about: {
    title: "About",
    eyebrow: "Luxury wedding planner",
    sidebarTitle: "A team that stays calm under pressure.",
    sidebarScript: "Meet the planners, coordinators, and stylists behind the work.",
    ctaHref: "contact.html",
    ctaLabel: "Meet with the team",
  },
  venues: {
    title: "Venues",
    eyebrow: "Luxury wedding planner",
    sidebarTitle: "The venue shapes everything.",
    sidebarScript: "Choose a setting that works for both emotion and logistics.",
    ctaHref: "contact.html",
    ctaLabel: "Ask for venue guidance",
  },
  services: {
    title: "Services",
    eyebrow: "Luxury wedding planner",
    sidebarTitle: "Choose support that fits your stage.",
    sidebarScript: "From full planning to final-week coordination, we scale with you.",
    ctaHref: "contact.html",
    ctaLabel: "Ask about services",
  },
  gallery: {
    title: "Gallery",
    eyebrow: "Luxury wedding planner",
    sidebarTitle: "Albums, not just random images.",
    sidebarScript: "Open each set to see consistent inspiration for that exact wedding moment.",
    ctaHref: "contact.html",
    ctaLabel: "Ask about your date",
  },
  contact: {
    title: "Contact",
    eyebrow: "Luxury wedding planner",
    sidebarTitle: "Tell us what you need.",
    sidebarScript: "Share your date, venue style, and guest count so we can guide the next step.",
    ctaHref: "#inquiry-form",
    ctaLabel: "Send inquiry",
  },
};

renderSiteShell();

document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  initReveal();
  initImageLoading();
  initHeroMedia();
  initBudgetCalculator();
  initGalleryFilters();
  initGalleryLightbox();
  initContactForm();
  syncYear();
});

function renderSiteShell() {
  const body = document.body;
  const shellRoot = document.querySelector("[data-shell-root]");
  const main = document.querySelector("[data-main]");
  const pageId = body.dataset.page;
  const page = PAGE_CONFIG[pageId];

  if (!shellRoot || !main || !page) {
    return;
  }

  const sidebar = document.createElement("aside");
  sidebar.className = "sidebar";
  sidebar.id = "site-sidebar";
  sidebar.setAttribute("aria-label", "Sidebar navigation");
  sidebar.setAttribute("data-sidebar", "");
  sidebar.innerHTML = buildSidebarMarkup(pageId, page);

  const backdrop = document.createElement("button");
  backdrop.className = "sidebar-backdrop";
  backdrop.type = "button";
  backdrop.setAttribute("aria-label", "Close navigation");
  backdrop.setAttribute("data-sidebar-backdrop", "");

  const siteContent = document.createElement("div");
  siteContent.className = "site-content";
  siteContent.append(createTopbar(page), main, createFooter());

  shellRoot.append(backdrop, sidebar, siteContent);
}

function createTopbar(page) {
  const header = document.createElement("header");
  header.className = "page-topbar";
  header.innerHTML = `
    <div class="page-topbar__panel">
      <div class="page-topbar__left">
        <button class="sidebar-toggle" type="button" data-sidebar-toggle aria-controls="site-sidebar">
          <span></span>
        </button>
        <div>
          <p class="topbar__eyebrow">${page.eyebrow}</p>
          <p class="topbar__title">${page.title}</p>
        </div>
      </div>

      <div class="page-topbar__right">
        <a class="topbar__contact" href="tel:${SITE_CONFIG.phoneHref}">${SITE_CONFIG.phoneDisplay}</a>
        <a class="button button--soft" href="${page.ctaHref}">${page.ctaLabel}</a>
      </div>
    </div>
  `;

  return header;
}

function createFooter() {
  const footer = document.createElement("footer");
  footer.className = "page-footer";
  footer.innerHTML = `
    <div class="page-footer__panel">
      <p>&copy; <span data-year></span> Vows &amp; Veil. Luxury wedding planning, styling, and coordination.</p>
      <div class="footer-links">
        ${SITE_CONFIG.nav.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
      </div>
    </div>
  `;

  return footer;
}

function buildSidebarMarkup(currentPageId, page) {
  return `
    <div class="sidebar__panel">
      <a class="brand" href="index.html">
        <img src="assets/images/brand-mark.svg" alt="Vows &amp; Veil brand mark" />
        <span class="brand__meta">
          <strong>Vows &amp; Veil</strong>
          <span>Wedding Planning Studio</span>
        </span>
      </a>

      <p class="sidebar__eyebrow">Luxury celebrations, thoughtfully managed</p>

      <nav class="sidebar__nav">
        ${SITE_CONFIG.nav.map((item) => buildNavLink(item, currentPageId)).join("")}
      </nav>

      <div class="sidebar__cta">
        <p>${page.sidebarTitle}</p>
        <h2>${page.sidebarScript}</h2>
        <a class="button button--primary button--block" href="${page.ctaHref}">${page.ctaLabel}</a>
      </div>

      <div class="sidebar__footer">
        <a class="sidebar__contact" href="mailto:${SITE_CONFIG.email}">
          ${getIcon("contact")}
          ${SITE_CONFIG.email}
        </a>
        <a class="sidebar__contact" href="tel:${SITE_CONFIG.phoneHref}">
          ${getIcon("phone")}
          ${SITE_CONFIG.phoneDisplay}
        </a>
      </div>
    </div>
  `;
}

function buildNavLink(item, currentPageId) {
  const current = item.id === currentPageId ? ' aria-current="page"' : "";

  return `
    <a class="sidebar-link" href="${item.href}" title="${item.label}"${current}>
      <span class="sidebar-link__icon" aria-hidden="true">
        ${getIcon(item.icon)}
      </span>
      <span class="sidebar-link__copy">
        <span class="sidebar-link__label">${item.label}</span>
        <span class="sidebar-link__hint">${item.hint}</span>
      </span>
    </a>
  `;
}

function getIcon(name) {
  const icons = {
    home: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5.5 9.5V20h13V9.5" />
      </svg>
    `,
    about: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4 20a8 8 0 0 1 16 0" />
      </svg>
    `,
    venue: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
        <path d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      </svg>
    `,
    services: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M8 6h12" />
        <path d="M8 12h12" />
        <path d="M8 18h12" />
        <path d="M4 6h.01" />
        <path d="M4 12h.01" />
        <path d="M4 18h.01" />
      </svg>
    `,
    gallery: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
        <path d="m7 15 3-3 2.5 2.5L15 12l4 4" />
        <path d="M15.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
      </svg>
    `,
    contact: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M4 6.5h16v11H4z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    `,
    phone: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M5 4h4l2 5-2.5 1.5A15.4 15.4 0 0 0 13.5 16L15 13.5l5 2v4a2 2 0 0 1-2 2C10.3 21.5 3.5 14.7 3.5 7A2 2 0 0 1 5 4Z" />
      </svg>
    `,
    pause: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M8 5v14" />
        <path d="M16 5v14" />
      </svg>
    `,
    play: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="m8 5 10 7-10 7V5Z" />
      </svg>
    `,
    volume: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M5 10h4l5-4v12l-5-4H5z" />
        <path d="M18 9a4 4 0 0 1 0 6" />
        <path d="M20 6a8 8 0 0 1 0 12" />
      </svg>
    `,
    mute: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M5 10h4l5-4v12l-5-4H5z" />
        <path d="m19 9-6 6" />
        <path d="m13 9 6 6" />
      </svg>
    `,
  };

  return icons[name] || "";
}

function initSidebar() {
  const body = document.body;
  const sidebar = document.querySelector("[data-sidebar]");
  const toggles = Array.from(document.querySelectorAll("[data-sidebar-toggle]"));
  const backdrop = document.querySelector("[data-sidebar-backdrop]");
  const desktopQuery = window.matchMedia("(min-width: 1025px)");
  const storageKey = "vows-veil-sidebar-collapsed";

  if (!sidebar || !toggles.length) {
    return;
  }

  const readStoredState = () => {
    try {
      return window.localStorage.getItem(storageKey) === "true";
    } catch {
      return false;
    }
  };

  const storeState = (collapsed) => {
    try {
      window.localStorage.setItem(storageKey, String(collapsed));
    } catch {
      // Ignore storage issues.
    }
  };

  const setDesktopCollapsed = (collapsed) => {
    body.classList.toggle("sidebar-collapsed", collapsed);
    storeState(collapsed);
    updateToggleLabels();
  };

  const closeMobileSidebar = () => {
    body.classList.remove("sidebar-mobile-open");
    updateToggleLabels();
  };

  const openMobileSidebar = () => {
    body.classList.add("sidebar-mobile-open");
    updateToggleLabels();
    const firstLink = sidebar.querySelector(".sidebar-link");
    firstLink?.focus({ preventScroll: true });
  };

  const updateToggleLabels = () => {
    const expanded = desktopQuery.matches
      ? !body.classList.contains("sidebar-collapsed")
      : body.classList.contains("sidebar-mobile-open");

    toggles.forEach((button) => {
      const label = desktopQuery.matches
        ? expanded
          ? "Collapse sidebar"
          : "Expand sidebar"
        : expanded
          ? "Close navigation"
          : "Open navigation";

      button.setAttribute("aria-expanded", String(expanded));
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    });
  };

  if (desktopQuery.matches) {
    body.classList.toggle("sidebar-collapsed", readStoredState());
  } else {
    body.classList.remove("sidebar-collapsed");
    body.classList.remove("sidebar-mobile-open");
  }

  toggles.forEach((button) => {
    button.addEventListener("click", () => {
      if (desktopQuery.matches) {
        setDesktopCollapsed(!body.classList.contains("sidebar-collapsed"));
      } else if (body.classList.contains("sidebar-mobile-open")) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    });
  });

  backdrop?.addEventListener("click", closeMobileSidebar);

  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (!desktopQuery.matches) {
        closeMobileSidebar();
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("sidebar-mobile-open")) {
      closeMobileSidebar();
    }
  });

  window.addEventListener("resize", () => {
    if (desktopQuery.matches) {
      body.classList.remove("sidebar-mobile-open");
      body.classList.toggle("sidebar-collapsed", readStoredState());
    } else {
      body.classList.remove("sidebar-collapsed");
    }

    updateToggleLabels();
  });

  updateToggleLabels();
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");

  if (!items.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  items.forEach((item) => observer.observe(item));
}

function initImageLoading() {
  document.querySelectorAll('img[loading="lazy"]').forEach((image) => {
    if (image.complete) {
      image.classList.add("is-loaded");
      return;
    }

    image.addEventListener("load", () => image.classList.add("is-loaded"), { once: true });
    image.addEventListener("error", () => image.classList.add("is-loaded"), { once: true });
  });
}

function initHeroMedia() {
  const video = document.querySelector("[data-hero-video]");
  const playButton = document.querySelector("[data-video-toggle]");
  const audioButton = document.querySelector("[data-audio-toggle]");

  if (!video) {
    return;
  }

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const updateVideoButtons = () => {
    if (playButton) {
      const paused = video.paused;
      playButton.innerHTML = `${getIcon(paused ? "play" : "pause")}<span>${paused ? "Play video" : "Pause video"}</span>`;
      playButton.setAttribute("aria-pressed", String(!paused));
    }

    if (audioButton) {
      const muted = video.muted;
      audioButton.innerHTML = `${getIcon(muted ? "mute" : "volume")}<span>${muted ? "Unmute" : "Mute"}</span>`;
      audioButton.setAttribute("aria-pressed", String(!muted));
    }
  };

  if (reducedMotionQuery.matches) {
    video.pause();
  }

  playButton?.addEventListener("click", () => {
    if (video.paused) {
      video.play().catch(() => {
        // Ignore failed play requests.
      });
    } else {
      video.pause();
    }

    updateVideoButtons();
  });

  audioButton?.addEventListener("click", () => {
    video.muted = !video.muted;
    updateVideoButtons();
  });

  video.addEventListener("play", updateVideoButtons);
  video.addEventListener("pause", updateVideoButtons);
  updateVideoButtons();
}

function initBudgetCalculator() {
  const totalInput = document.querySelector("[data-budget-total]");
  const guestInput = document.querySelector("[data-budget-guests]");
  const venueInput = document.querySelector("[data-budget-venue]");
  const serviceInput = document.querySelector("[data-budget-service]");
  const priorityInput = document.querySelector("[data-budget-priority]");
  const travelInput = document.querySelector("[data-budget-travel]");
  const totalValue = document.querySelector("[data-budget-total-value]");
  const guestValue = document.querySelector("[data-budget-guest-value]");
  const reserveValue = document.querySelector("[data-budget-reserve-value]");
  const healthValue = document.querySelector("[data-budget-health-value]");
  const tableBody = document.querySelector("[data-budget-breakdown]");
  const noteValue = document.querySelector("[data-budget-note]");

  if (
    !totalInput ||
    !guestInput ||
    !venueInput ||
    !serviceInput ||
    !priorityInput ||
    !travelInput ||
    !totalValue ||
    !guestValue ||
    !reserveValue ||
    !healthValue ||
    !tableBody ||
    !noteValue
  ) {
    return;
  }

  const currency = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  });

  const base = [
    { name: "Venue and site fees", percent: 0.18 },
    { name: "Food and beverage", percent: 0.28 },
    { name: "Photo and video", percent: 0.12 },
    { name: "Styling and florals", percent: 0.12 },
    { name: "Attire and beauty", percent: 0.08 },
    { name: "Coordination and planning", percent: 0.08 },
    { name: "Guest comfort and logistics", percent: 0.06 },
    { name: "Reserve and contingency", percent: 0.08 },
  ];

  const venueAdjustments = {
    garden: { venue: 0.02, styling: 0.03, logistics: 0.02, reserve: 0.01 },
    beach: { venue: 0.01, logistics: 0.04, reserve: 0.03, styling: 0.01 },
    church: { venue: 0.03, logistics: 0.01, styling: -0.01, reserve: 0.01 },
    ballroom: { venue: 0.05, food: 0.02, styling: -0.02, logistics: -0.01, reserve: -0.01 },
  };

  const serviceAdjustments = {
    full: { planning: 0.04, reserve: -0.01, styling: 0.01 },
    partial: { planning: 0.02 },
    coordination: { planning: -0.02, reserve: 0.01 },
  };

  const priorityAdjustments = {
    balanced: {},
    design: { styling: 0.04, photo: 0.01, reserve: -0.02, logistics: -0.01 },
    guest: { food: 0.03, logistics: 0.03, styling: -0.02, attire: -0.01 },
    media: { photo: 0.04, styling: -0.02, attire: -0.01, reserve: -0.01 },
  };

  const categoryKeys = {
    "Venue and site fees": "venue",
    "Food and beverage": "food",
    "Photo and video": "photo",
    "Styling and florals": "styling",
    "Attire and beauty": "attire",
    "Coordination and planning": "planning",
    "Guest comfort and logistics": "logistics",
    "Reserve and contingency": "reserve",
  };

  const render = () => {
    const totalBudget = Math.max(Number(totalInput.value) || 0, 0);
    const guestCount = Math.max(Number(guestInput.value) || 1, 1);
    const venueType = venueInput.value;
    const serviceTier = serviceInput.value;
    const priority = priorityInput.value;
    const destination = travelInput.checked;

    const guestFactor = (guestCount - 120) / 200;

    const rows = base.map((category) => ({
      ...category,
      percent: category.percent,
    }));

    const applySet = (set) => {
      Object.entries(set).forEach(([key, value]) => {
        const row = rows.find((entry) => categoryKeys[entry.name] === key);
        if (row) {
          row.percent += value;
        }
      });
    };

    applySet(venueAdjustments[venueType] || {});
    applySet(serviceAdjustments[serviceTier] || {});
    applySet(priorityAdjustments[priority] || {});

    rows.forEach((row) => {
      const key = categoryKeys[row.name];

      if (key === "food") {
        row.percent += guestFactor * 0.07;
      }

      if (key === "venue") {
        row.percent += guestFactor * 0.02;
      }

      if (key === "logistics") {
        row.percent += guestFactor * 0.02;
      }

      if (key === "styling") {
        row.percent -= guestFactor * 0.03;
      }

      if (key === "reserve") {
        row.percent -= guestFactor * 0.03;
      }
    });

    if (destination) {
      applySet({ logistics: 0.05, reserve: 0.02, venue: -0.02, styling: -0.02, attire: -0.01, food: -0.02 });
    }

    const totalPercent = rows.reduce((sum, row) => sum + row.percent, 0);
    rows.forEach((row) => {
      row.percent = row.percent / totalPercent;
      row.amount = totalBudget * row.percent;
    });

    tableBody.innerHTML = rows
      .map((row) => {
        const note = getBudgetNote(row.name, venueType, destination);

        return `
          <tr>
            <td>${row.name}</td>
            <td>${Math.round(row.percent * 100)}%</td>
            <td>${currency.format(row.amount)}</td>
            <td>${note}</td>
          </tr>
        `;
      })
      .join("");

    const perGuest = totalBudget / guestCount;
    const recommendedReserve = rows.find((row) => row.name === "Reserve and contingency")?.amount || 0;
    const health = getBudgetHealth(totalBudget, guestCount, venueType, serviceTier, destination);

    totalValue.textContent = currency.format(totalBudget);
    guestValue.textContent = `${guestCount} guests`;
    reserveValue.textContent = currency.format(recommendedReserve);
    healthValue.textContent = health.label;
    noteValue.textContent = `${health.note} Estimated spend per guest: ${currency.format(perGuest)}.`;
  };

  [totalInput, guestInput, venueInput, serviceInput, priorityInput, travelInput].forEach((input) => {
    input.addEventListener("input", render);
    input.addEventListener("change", render);
  });

  render();
}

function getBudgetNote(categoryName, venueType, destination) {
  const notes = {
    "Venue and site fees":
      venueType === "ballroom"
        ? "Ballroom packages, site fees, ingress windows, and mandatory service charges."
        : "Venue rental, permits, basic site access, and layout considerations.",
    "Food and beverage":
      destination
        ? "Meals, drinks, service team, and added hospitality for travelling guests."
        : "Catering, drinks, cake service, and guest dining comfort.",
    "Photo and video": "Coverage, editing, same-day highlights, and add-on content capture.",
    "Styling and florals": "Ceremony flowers, reception styling, candles, and focal design pieces.",
    "Attire and beauty": "Gown, suit, HMUA, touch-ups, and wardrobe details.",
    "Coordination and planning": "Planner time, coordination manpower, cue sheets, and supplier management.",
    "Guest comfort and logistics":
      destination
        ? "Transport, welcome details, accommodation support, and shuttle planning."
        : "Signage, transport, favors, family flow, and guest-facing touches.",
    "Reserve and contingency": "A protected buffer for weather, overtime, revisions, or price changes.",
  };

  return notes[categoryName] || "";
}

function getBudgetHealth(totalBudget, guestCount, venueType, serviceTier, destination) {
  const serviceWeight = {
    full: 1.12,
    partial: 1.04,
    coordination: 0.96,
  };

  const venueWeight = {
    garden: 1,
    beach: 1.03,
    church: 1.05,
    ballroom: 1.12,
  };

  let score = totalBudget / Math.max(guestCount, 1);
  score /= serviceWeight[serviceTier];
  score /= venueWeight[venueType];

  if (destination) {
    score /= 1.08;
  }

  if (score >= 6500) {
    return {
      label: "Comfortable premium range",
      note: "This budget comfortably supports polished styling, strong hospitality, and room for a real reserve.",
    };
  }

  if (score >= 4200) {
    return {
      label: "Balanced and workable",
      note: "This range can produce a beautiful wedding if priorities stay focused and the venue choice is disciplined.",
    };
  }

  return {
    label: "Needs tighter scope",
    note: "To keep this comfortable, reduce guest count, simplify venue logistics, or trim add-on styling requests.",
  };
}

function initGalleryFilters() {
  const buttons = Array.from(document.querySelectorAll("[data-gallery-filter]"));
  const items = Array.from(document.querySelectorAll("[data-gallery-item]"));

  if (!buttons.length || !items.length) {
    return;
  }

  const applyFilter = (filter) => {
    items.forEach((item) => {
      item.hidden = !(filter === "all" || item.dataset.category === filter);
    });
  };

  buttons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
    button.addEventListener("click", () => {
      const filter = button.dataset.galleryFilter || "all";
      buttons.forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
      applyFilter(filter);
    });
  });

  applyFilter("all");
}

function initGalleryLightbox() {
  const lightbox = document.querySelector("[data-lightbox]");
  const triggers = Array.from(document.querySelectorAll("[data-gallery-trigger]"));

  if (!lightbox || !triggers.length) {
    return;
  }

  const image = lightbox.querySelector("[data-lightbox-image]");
  const title = lightbox.querySelector("[data-lightbox-title]");
  const caption = lightbox.querySelector("[data-lightbox-caption]");
  const counter = lightbox.querySelector("[data-lightbox-counter]");
  const closeButton = lightbox.querySelector("[data-lightbox-close]");
  const previousButton = lightbox.querySelector("[data-lightbox-prev]");
  const nextButton = lightbox.querySelector("[data-lightbox-next]");
  const zoomButton = lightbox.querySelector("[data-lightbox-zoom]");
  const fullscreenButton = lightbox.querySelector("[data-lightbox-fullscreen]");
  const viewport = lightbox.querySelector("[data-lightbox-viewport]");

  let albumItems = [];
  let activeIndex = 0;
  let lastFocus = null;

  const readAlbum = (trigger) => {
    const album = trigger.closest("[data-gallery-album]");
    const sources = album ? Array.from(album.querySelectorAll("[data-gallery-source]")) : [];

    return sources.map((source) => ({
      src: source.dataset.src || "",
      title: source.dataset.title || "",
      caption: source.dataset.caption || "",
      alt: source.dataset.alt || "",
    }));
  };

  const updateLightbox = () => {
    const current = albumItems[activeIndex];

    if (!current) {
      return;
    }

    image.src = current.src;
    image.alt = current.alt;
    title.textContent = current.title;
    caption.textContent = current.caption;
    counter.textContent = `${activeIndex + 1} / ${albumItems.length}`;
    lightbox.classList.remove("is-zoomed");
    zoomButton?.setAttribute("aria-pressed", "false");
  };

  const openLightbox = (trigger) => {
    albumItems = readAlbum(trigger);
    activeIndex = Number(trigger.dataset.startIndex || 0);
    lastFocus = document.activeElement;

    if (!albumItems.length) {
      return;
    }

    updateLightbox();
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton?.focus({ preventScroll: true });
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightbox.classList.remove("is-zoomed");
    document.body.classList.remove("lightbox-open");
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {
        // Ignore fullscreen exit errors.
      });
    }
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  };

  const next = () => {
    if (!albumItems.length) {
      return;
    }
    activeIndex = (activeIndex + 1) % albumItems.length;
    updateLightbox();
  };

  const previous = () => {
    if (!albumItems.length) {
      return;
    }
    activeIndex = (activeIndex - 1 + albumItems.length) % albumItems.length;
    updateLightbox();
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openLightbox(trigger));
  });

  closeButton?.addEventListener("click", closeLightbox);
  nextButton?.addEventListener("click", next);
  previousButton?.addEventListener("click", previous);

  zoomButton?.addEventListener("click", () => {
    const zoomed = lightbox.classList.toggle("is-zoomed");
    zoomButton.setAttribute("aria-pressed", String(zoomed));
  });

  image?.addEventListener("click", () => {
    const zoomed = lightbox.classList.toggle("is-zoomed");
    zoomButton?.setAttribute("aria-pressed", String(zoomed));
  });

  fullscreenButton?.addEventListener("click", async () => {
    if (!viewport || !viewport.requestFullscreen) {
      return;
    }

    if (document.fullscreenElement && document.exitFullscreen) {
      await document.exitFullscreen();
      return;
    }

    await viewport.requestFullscreen();
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowRight") {
      next();
    }

    if (event.key === "ArrowLeft") {
      previous();
    }
  });
}

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-form-status]");

  if (!form || !status) {
    return;
  }

  const fields = Array.from(form.querySelectorAll("input, textarea, select")).filter(
    (field) => !["hidden", "submit"].includes(field.type)
  );
  const submitButton = form.querySelector('button[type="submit"]');
  const ajaxAction = form.dataset.ajaxAction || form.action;
  const weddingDateField = form.querySelector('[name="wedding-date"]');

  if (weddingDateField) {
    weddingDateField.min = new Date().toISOString().split("T")[0];
  }

  const setStatus = (message, state = "") => {
    status.textContent = message;
    if (state) {
      status.dataset.state = state;
    } else {
      status.removeAttribute("data-state");
    }
  };

  const ensureError = (field) => {
    const wrapper = field.closest(".field");
    if (!wrapper) {
      return null;
    }

    let error = wrapper.querySelector(".field__error");
    if (!error) {
      error = document.createElement("p");
      error.className = "field__error";
      wrapper.appendChild(error);
    }

    if (field.id) {
      error.id = `${field.id}-error`;
      field.setAttribute("aria-describedby", error.id);
    }

    return error;
  };

  const clearValidation = (field) => {
    const wrapper = field.closest(".field");
    const error = ensureError(field);

    wrapper?.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
    if (error) {
      error.textContent = "";
    }
  };

  const validateField = (field) => {
    const wrapper = field.closest(".field");
    const error = ensureError(field);
    const label = wrapper?.querySelector("label")?.textContent?.trim() || field.name;
    const value = field.value.trim();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let message = "";

    if (field.hasAttribute("required") && !value) {
      message = `${label} is required.`;
    } else if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = "Enter a valid email address.";
    } else if (field.name === "wedding-date" && value) {
      const selected = new Date(`${value}T00:00:00`);
      if (selected < today) {
        message = "Please choose an upcoming wedding date.";
      }
    } else if (field.name === "budget" && value && Number(value) < 50000) {
      message = "Budget must be at least PHP 50,000.";
    }

    if (!message) {
      clearValidation(field);
      return true;
    }

    wrapper?.classList.add("is-invalid");
    field.setAttribute("aria-invalid", "true");
    if (error) {
      error.textContent = message;
    }
    return false;
  };

  const validateForm = () => {
    let firstInvalid = null;
    let isValid = true;

    fields.forEach((field) => {
      const valid = validateField(field);
      if (!valid && !firstInvalid) {
        firstInvalid = field;
      }
      isValid = isValid && valid;
    });

    firstInvalid?.focus();
    return isValid;
  };

  fields.forEach((field) => {
    ensureError(field);
    field.addEventListener("input", () => validateField(field));
    field.addEventListener("blur", () => validateField(field));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("");

    if (!validateForm()) {
      setStatus("Please correct the highlighted fields before sending your inquiry.", "error");
      return;
    }

    if (!submitButton) {
      return;
    }

    const originalLabel = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {
      const response = await fetch(ajaxAction, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: new FormData(form),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || "Unable to send inquiry.");
      }

      form.reset();
      fields.forEach((field) => clearValidation(field));
      setStatus("Your inquiry was sent successfully. We will reply within one business day.", "success");
    } catch {
      setStatus("The direct form request could not finish here, so we are opening the secure fallback form handler.", "success");
      submitButton.textContent = "Opening...";
      window.setTimeout(() => form.submit(), 250);
      return;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
    }
  });
}

function syncYear() {
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}
