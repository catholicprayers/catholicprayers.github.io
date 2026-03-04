// CatholicPrayers Modern UI Enhancer
(function () {
  const path = (location.pathname || "").toLowerCase();
  const isHome =
    path.endsWith("/") ||
    path.endsWith("/index.html") ||
    path === "" ||
    path === "/";

  if (isHome) document.body.classList.add("cp-home");

  // Wrap main content (everything after the first UL menu) into a container + surface.
  const menu = document.querySelector("body > ul:first-of-type");
  if (menu) {
    const container = document.createElement("div");
    container.className = "cp-container";

    // Collect siblings after menu
    const nodes = [];
    let n = menu.nextSibling;
    while (n) {
      const next = n.nextSibling;
      // keep only meaningful nodes
      if (!(n.nodeType === Node.TEXT_NODE && !n.textContent.trim())) nodes.push(n);
      n = next;
    }

    // Surface card for inner content on non-home pages
    const surface = document.createElement("div");
    surface.className = "cp-surface";

    // If home, we will build a hero + grid from menu items; keep content but style it
    if (isHome) {
      // HERO
      const hero = document.createElement("section");
      hero.className = "cp-hero";
      hero.innerHTML = `
        <div class="cp-heroCard">
          <div class="cp-heroKicker">✝︎ <span>Catholic Prayers</span> • <span>Malayalam</span></div>
          <h1 class="cp-title">Catholic Prayers</h1>
          <p class="cp-subtitle">A calm, modern place to read and share prayers. Choose a prayer below or search.</p>
          <div class="cp-actions">
            <input class="cp-search" id="cpSearch" type="search" placeholder="Search prayers (e.g., ജപമാല, കരുണ, കുരിശിൻ്റെ വഴി)..." />
            <button class="cp-btn cp-btnPrimary" id="cpScroll">Browse prayers</button>
          </div>
        </div>
      `;

      // GRID from menu list items (excluding Home)
      const grid = document.createElement("section");
      grid.className = "cp-grid";
      grid.id = "cpGrid";

      const links = [...menu.querySelectorAll("a")]
        .filter(a => (a.textContent || "").trim().length > 0)
        .filter(a => (a.textContent || "").trim().toLowerCase() !== "home");

      links.forEach(a => {
        const title = a.textContent.trim();
        const href = a.getAttribute("href") || "#";
        const tile = document.createElement("a");
        tile.className = "cp-tile";
        tile.href = href;

        // Optional “meta” line — simple heuristic
        const meta =
          title.includes("ജപമാല") ? "Rosary & devotions" :
          title.includes("കുരിശ") ? "Stations / way of the cross" :
          title.includes("പ്രാർഥന") || title.includes("പ്രാർത്ഥന") ? "Prayer" :
          "Open";

        tile.innerHTML = `
          <h3 class="cp-tileTitle">${title}</h3>
          <p class="cp-tileMeta">${meta}</p>
        `;
        grid.appendChild(tile);
      });

      // Put hero + grid into container
      container.appendChild(hero);
      container.appendChild(grid);

      // Keep any existing content below (but inside surface)
      nodes.forEach(node => surface.appendChild(node));
      container.appendChild(surface);

      // Insert container right after menu
      menu.insertAdjacentElement("afterend", container);

      // Search filter
      const search = document.getElementById("cpSearch");
      if (search) {
        search.addEventListener("input", () => {
          const q = search.value.trim().toLowerCase();
          const tiles = [...grid.querySelectorAll(".cp-tile")];
          tiles.forEach(t => {
            const text = t.textContent.toLowerCase();
            t.style.display = text.includes(q) ? "" : "none";
          });
        });
      }

      // Scroll button
      const btn = document.getElementById("cpScroll");
      if (btn) btn.addEventListener("click", () => grid.scrollIntoView({ behavior: "smooth" }));

    } else {
      // Non-home: wrap content in a nice surface card
      nodes.forEach(node => surface.appendChild(node));
      container.appendChild(surface);
      menu.insertAdjacentElement("afterend", container);
    }
  }
})();
