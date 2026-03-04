// Catholic Prayers search filter

// Apply common layout to all pages automatically
document.addEventListener("DOMContentLoaded", () => {

  // If shell already exists (index page), do nothing
  if (document.querySelector(".shell")) return;

  const body = document.body;

  // Create shell container
  const shell = document.createElement("div");
  shell.className = "shell";

  // Create top navigation
  const nav = document.createElement("nav");
  nav.className = "topbar";

  nav.innerHTML = `
    <div class="topbar-left">

      <a href="index.html" class="pill-button">
        <span class="pill-icon">🏠</span>
        Home
      </a>

      <a href="index.html#prayers" class="pill-button">
        <span class="pill-icon">📖</span>
        Prayers
      </a>

    </div>
  `;

  // Move page content into shell
  const contentNodes = [...body.children];

  contentNodes.forEach(node => {
    if (node.tagName !== "SCRIPT") {
      shell.appendChild(node);
    }
  });

  // Clear body
  body.innerHTML = "";

  // Add nav + shell
  body.appendChild(nav);
  body.appendChild(shell);

});

document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("prayerSearch");
  const cards = Array.from(document.querySelectorAll(".prayer-card"));
  const count = document.getElementById("searchCount");

  if (!input) return;

  const updateCount = (visible, total) => {
    if (!count) return;

    if (visible === total) {
      count.textContent = `${total} prayers`;
    } else {
      count.textContent = `${visible} of ${total} prayers`;
    }
  };

  updateCount(cards.length, cards.length);

  input.addEventListener("input", () => {

    const q = input.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach(card => {

      const title = (card.getAttribute("data-title") || "").toLowerCase();
      const show = q === "" || title.includes(q);

      card.closest(".image-item").style.display = show ? "" : "none";

      if (show) visible++;

    });

    updateCount(visible, cards.length);

  });

});
