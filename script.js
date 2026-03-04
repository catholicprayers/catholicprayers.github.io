// Catholic Prayers search filter

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
