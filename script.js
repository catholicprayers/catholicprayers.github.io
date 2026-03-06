// CatholicPrayers main script

document.addEventListener("DOMContentLoaded", () => {

  const path = (location.pathname || "").toLowerCase();

  const isIndex =
    path.endsWith("/") ||
    path.endsWith("/index.html") ||
    path === "/" ||
    path === "";

  /* =========================================
     AUTO LAYOUT FOR PRAYER PAGES
  ========================================= */

  if (!isIndex && !document.querySelector(".shell")) {

    const body = document.body;
    body.classList.add("prayer-page");

    const footer = body.querySelector("footer");

    /* ---------- Detect title automatically ---------- */

    let titleText = "";

    // 1. First priority: old header title div
    const headerTitle = document.querySelector("header .title");
    if (headerTitle) {
      titleText = headerTitle.textContent.trim();
    }

    // 2. Then normal headings
    if (!titleText) {
      const existingHeading = document.querySelector("h1,h2,h3");
      if (existingHeading) {
        titleText = existingHeading.textContent.trim();
      }
    }

    // 3. Then fallback to first meaningful text
    if (!titleText) {
      const bodyText = Array.from(
        document.body.querySelectorAll("p, div, span")
      )
        .map(el => el.textContent.trim())
        .find(text =>
          text &&
          text.length > 4 &&
          text !== "Home" &&
          !text.includes("Catholic Prayers Malayalam") &&
          !text.includes("©")
        );

      if (bodyText) titleText = bodyText;
    }

    // 4. Final fallback
    if (!titleText) {
      titleText = (document.title || "Prayer")
        .replace("Catholic Prayers Malayalam", "")
        .replace("-", "")
        .trim();
    }

    /* ---------- Detect first image ---------- */

    const firstImage = document.querySelector("img");

    const heroImgSrc = firstImage
      ? firstImage.getAttribute("src")
      : "";

    const heroImgAlt = firstImage
      ? firstImage.getAttribute("alt") || titleText
      : titleText;

    /* ---------- Collect old nodes ---------- */

    const nodes = Array.from(body.children).filter(el => {
      if (el === footer) return false;
      return el.tagName !== "SCRIPT";
    });

    /* ---------- Build new page shell ---------- */

    const shell = document.createElement("div");
    shell.className = "shell";

    /* ---------- Navigation ---------- */

    const nav = document.createElement("nav");
    nav.className = "topbar";

    nav.innerHTML = `
      <div class="topbar-left">

        <a href="index.html" class="pill-button">
          <span class="pill-icon">🏠</span>
          Home
        </a>

        <button class="pill-button pill-button-btn" id="prayersBtn">
          <span class="pill-icon">📖</span>
          Prayers
          <span class="pill-caret">▾</span>
        </button>

      </div>

      <div class="prayers-menu" id="prayersMenu">

        <a href="Karunayude japamala.html">കരുണയുടെ ജപമാല</a>
        <a href="ജപമാല.html">ജപമാല</a>
        <a href="പരിശുദ്ധാത്മാവിനോടുള്ള പ്രാർഥന.html">പരിശുദ്ധാത്മാവിനോടുള്ള പ്രാർഥന</a>
        <a href="കുരിശിൻ്റെ വഴി.html">കുരിശിൻ്റെ വഴി</a>
        <a href="Prayer for the Souls in Purgatory.html">ശുദ്ധീകരണാത്മാക്കൾക്ക് വേണ്ടിയുള്ള പ്രാർത്ഥന</a>
        <a href="prayer after holy communion.html">വിശുദ്ധ കുർബാന സ്വീകരിച്ചതിനുശേഷമുള്ള നന്ദി പ്രാർത്ഥന</a>
        <a href="prayer to St. Cupertino.html">വിശുദ്ധ കുപ്പർത്തീനോസിനോടുള്ള ജപം</a>

      </div>
    `;

    /* ---------- Hero card ---------- */

    const hero = document.createElement("section");
    hero.className = "prayer-hero";

    hero.innerHTML = `
      <div class="prayer-hero-card">
        ${
          heroImgSrc
            ? `<img class="prayer-hero-img" src="${heroImgSrc}" alt="${heroImgAlt}">`
            : ""
        }
        <div class="prayer-hero-title">${titleText}</div>
      </div>
    `;

    /* ---------- Reader ---------- */

    const reader = document.createElement("main");
    reader.className = "reader";

    const readerBody = document.createElement("div");
    readerBody.className = "reader-body";

    nodes.forEach(n => readerBody.appendChild(n));

    reader.appendChild(readerBody);

    /* ---------- Build page ---------- */

    shell.appendChild(nav);
    shell.appendChild(hero);
    shell.appendChild(reader);

    body.innerHTML = "";
    body.appendChild(shell);

    if (footer) body.appendChild(footer);

    /* ---------- Remove old elements ---------- */

    const oldHeader = reader.querySelector("header");
    if (oldHeader) oldHeader.remove();

    const oldList = reader.querySelector("ul");
    if (oldList) oldList.remove();

    const oldNav = reader.querySelector("nav");
    if (oldNav) oldNav.remove();

    const oldCheckbox = reader.querySelector('input[type="checkbox"]');
    if (oldCheckbox) oldCheckbox.remove();

    const oldHomeLink = Array.from(reader.querySelectorAll("a"))
      .find(a => a.textContent.trim() === "Home");
    if (oldHomeLink) oldHomeLink.remove();
  }

  /* =========================================
     PRAYERS DROPDOWN
  ========================================= */

  const prayersBtn = document.getElementById("prayersBtn");
  const prayersMenu = document.getElementById("prayersMenu");

  if (prayersBtn && prayersMenu) {

    prayersBtn.addEventListener("click", (e) => {
      e.preventDefault();
      prayersMenu.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (!prayersMenu.contains(e.target) &&
          !prayersBtn.contains(e.target)) {
        prayersMenu.classList.remove("open");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        prayersMenu.classList.remove("open");
      }
    });
  }

  /* =========================================
     INDEX SEARCH
  ========================================= */

  const input = document.getElementById("prayerSearch");
  const cards = Array.from(document.querySelectorAll(".prayer-card"));
  const count = document.getElementById("searchCount");

  if (!input || cards.length === 0) return;

  const updateCount = (visible, total) => {
    if (!count) return;
    count.textContent =
      visible === total
        ? `${total} prayers`
        : `${visible} of ${total} prayers`;
  };

  updateCount(cards.length, cards.length);

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach(card => {
      const t = (card.getAttribute("data-title") || "").toLowerCase();
      const show = q === "" || t.includes(q);

      const row = card.closest(".image-item");
      if (row) row.style.display = show ? "" : "none";

      if (show) visible++;
    });

    updateCount(visible, cards.length);
  });

});
