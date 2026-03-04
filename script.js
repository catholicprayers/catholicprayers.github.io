// CatholicPrayers main script

document.addEventListener("DOMContentLoaded", () => {

  const path = (location.pathname || "").toLowerCase();
  const isIndex =
    path.endsWith("/") ||
    path.endsWith("/index.html") ||
    path === "/" ||
    path === "";

  /* -----------------------------
     AUTO LAYOUT FOR PRAYER PAGES
  ------------------------------*/

  if (!isIndex && !document.querySelector(".shell")) {

    const body = document.body;
    body.classList.add("prayer-page");

    const footer = body.querySelector("footer");

    const nodes = Array.from(body.children).filter(el => {
      if (el === footer) return false;
      return el.tagName !== "SCRIPT";
    });

    const shell = document.createElement("div");
    shell.className = "shell";

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

    const reader = document.createElement("main");
    reader.className = "reader";

    const heading = document.querySelector("h1,h2,h3");
    const titleText = (heading?.textContent || document.title || "Prayer").trim();

    const title = document.createElement("h1");
    title.className = "reader-title";
    title.textContent = titleText;

    const bodyWrap = document.createElement("div");
    bodyWrap.className = "reader-body";

    nodes.forEach(n => bodyWrap.appendChild(n));

    reader.appendChild(title);
    reader.appendChild(bodyWrap);

    shell.appendChild(nav);
    shell.appendChild(reader);

    body.innerHTML = "";
    body.appendChild(shell);
    if (footer) body.appendChild(footer);
  }

  /* -----------------------------
     PRAYERS DROPDOWN
  ------------------------------*/

  const prayersBtn = document.getElementById("prayersBtn");
  const prayersMenu = document.getElementById("prayersMenu");

  if (prayersBtn && prayersMenu) {

    prayersBtn.addEventListener("click", () => {
      prayersMenu.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (!prayersMenu.contains(e.target) && !prayersBtn.contains(e.target)) {
        prayersMenu.classList.remove("open");
      }
    });
  }

  /* -----------------------------
     INDEX SEARCH FILTER
  ------------------------------*/

  const input = document.getElementById("prayerSearch");
  const cards = Array.from(document.querySelectorAll(".prayer-card"));
  const count = document.getElementById("searchCount");

  if (!input || cards.length === 0) return;

  const updateCount = (visible, total) => {
    if (!count) return;
    count.textContent = visible === total
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

      card.closest(".image-item").style.display = show ? "" : "none";

      if (show) visible++;
    });

    updateCount(visible, cards.length);
  });

});
