// CatholicPrayers — script.js

document.addEventListener("DOMContentLoaded", () => {
  const path = (location.pathname || "").toLowerCase();
  const isIndex =
    path.endsWith("/") ||
    path.endsWith("/index.html") ||
    path === "/" ||
    path === "";

  // -----------------------------
  // A) AUTO-LAYOUT (Prayer pages)
  // -----------------------------
  // Only run on non-index pages, and only if they don't already have the new layout.
  if (!isIndex && !document.querySelector(".shell")) {
    const body = document.body;

    // Keep footer outside shell if it exists
    const footer = body.querySelector("footer");

    // Collect all body children except scripts and footer
    const nodes = Array.from(body.children).filter(el => {
      if (el === footer) return false;
      return el.tagName !== "SCRIPT";
    });

    // Create shell
    const shell = document.createElement("div");
    shell.className = "shell";

    // Create topbar
    const topbar = document.createElement("nav");
    topbar.className = "topbar";
    topbar.innerHTML = `
      <div class="topbar-left">
        <a href="index.html" class="pill-button">
          <span class="pill-icon" aria-hidden="true">🏠</span>
          Home
        </a>
        <a href="index.html#prayers" class="pill-button">
          <span class="pill-icon" aria-hidden="true">📖</span>
          Prayers
        </a>
      </div>
    `;

    // Create reader card (optional but makes prayer text look nice)
    const reader = document.createElement("main");
    reader.className = "reader";

    // Try to find a good title from existing headings (if any)
    const existingHeading = body.querySelector("h1,h2,h3");
    const titleText = (existingHeading?.textContent || document.title || "Prayer").trim();

    const title = document.createElement("h1");
    title.className = "reader-title";
    title.textContent = titleText;

    const readerBody = document.createElement("div");
    readerBody.className = "reader-body";

    // Move all old nodes into reader body
    nodes.forEach(n => readerBody.appendChild(n));

    reader.appendChild(title);
    reader.appendChild(readerBody);

    // Build shell
    shell.appendChild(topbar);
    shell.appendChild(reader);

    // Rebuild body
    body.innerHTML = "";
    body.appendChild(shell);
    if (footer) body.appendChild(footer);
  }

  // --------------------------------
  // B) INDEX SEARCH FILTER (Homepage)
  // --------------------------------
  const input = document.getElementById("prayerSearch");
  const cards = Array.from(document.querySelectorAll(".prayer-card"));
  const count = document.getElementById("searchCount");

  // If this page doesn't have the search UI, do nothing.
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
