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

    // collect page nodes except footer/script
    const nodes = Array.from(body.children).filter(el => {
      if (el === footer) return false;
      return el.tagName !== "SCRIPT";
    });

    // try to find heading + first image before moving nodes
    const existingHeading = document.querySelector("h1,h2,h3");
    let titleText = (existingHeading?.textContent || "").trim();

    // fallback to page title if needed
    if (!titleText) {
      titleText = document.title;
    }
    
    // remove site name if present
    titleText = titleText.replace("Catholic Prayers Malayalam", "").trim();

    const firstImage = document.querySelector("img");
    const heroImgSrc = firstImage ? firstImage.getAttribute("src") : "";
    const heroImgAlt = firstImage ? (firstImage.getAttribute("alt") || titleText) : titleText;

    // shell
    const shell = document.createElement("div");
    shell.className = "shell";

    // topbar
    const nav = document.createElement("nav");
    nav.className = "topbar";
    nav.innerHTML = `
      <div class="topbar-left">
        <a href="index.html" class="pill-button">
          <span class="pill-icon" aria-hidden="true">🏠</span>
          Home
        </a>

        <button class="pill-button pill-button-btn" id="prayersBtn" type="button">
          <span class="pill-icon" aria-hidden="true">📖</span>
          Prayers
          <span class="pill-caret" aria-hidden="true">▾</span>
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

    // hero card like home tiles
    const prayerHero = document.createElement("section");
    prayerHero.className = "prayer-hero";
    prayerHero.innerHTML = `
      <div class="prayer-hero-card">
        ${heroImgSrc ? `<img class="prayer-hero-img" src="${heroImgSrc}" alt="${heroImgAlt}">` : ""}
        <div class="prayer-hero-title">${titleText}</div>
      </div>
    `;

    // reader content
    const reader = document.createElement("main");
    reader.className = "reader";

    const readerBody = document.createElement("div");
    readerBody.className = "reader-body";

    // move old content into reader body
    nodes.forEach(n => readerBody.appendChild(n));

    reader.appendChild(readerBody);

    // rebuild body
    shell.appendChild(nav);
    shell.appendChild(prayerHero);
    shell.appendChild(reader);

    body.innerHTML = "";
    body.appendChild(shell);
    if (footer) body.appendChild(footer);

    // remove duplicated old heading/image/list inside reader
    const oldHeadings = reader.querySelectorAll("h1, h2, h3");
    oldHeadings.forEach((el, idx) => {
      if (idx === 0) el.remove();
    });

    const oldImgs = reader.querySelectorAll("img");
    oldImgs.forEach((img, idx) => {
      if (idx === 0) img.remove();
    });

    const oldFirstList = reader.querySelector("ul");
    if (oldFirstList) oldFirstList.remove();
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
      if (!prayersMenu.contains(e.target) && !prayersBtn.contains(e.target)) {
        prayersMenu.classList.remove("open");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") prayersMenu.classList.remove("open");
    });
  }

  /* =========================================
     INDEX SEARCH FILTER
  ========================================= */
  const input = document.getElementById("prayerSearch");
  const cards = Array.from(document.querySelectorAll(".prayer-card"));
  const count = document.getElementById("searchCount");

  if (!input || cards.length === 0) return;

  const updateCount = (visible, total) => {
    if (!count) return;
    count.textContent = visible === total ? `${total} prayers` : `${visible} of ${total} prayers`;
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
