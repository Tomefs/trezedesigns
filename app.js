document.documentElement.classList.add("js");

const revealItems = document.querySelectorAll(
  ".reveal, .Animations img, .Animations video",
);
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const startReveals = () => {
  const grids = new Map();

  revealItems.forEach((item) => {
    const grid = item.closest(".portfolio, .motion-grid, .Animations");

    if (!grids.has(grid)) {
      grids.set(grid, []);
    }

    grids.get(grid).push(item);
  });

  grids.forEach((items) => {
    items
      .sort((first, second) => {
        const firstRect = first.getBoundingClientRect();
        const secondRect = second.getBoundingClientRect();

        return (
          firstRect.top - secondRect.top ||
          firstRect.left - secondRect.left
        );
      })
      .forEach((item, index) => {
        const delay = reducedMotion ? 0 : index * 270;

        item.style.setProperty("--reveal-delay", `${delay}ms`);
        item.classList.add("active");
      });
  });
};

if (document.readyState === "complete") {
  startReveals();
} else {
  window.addEventListener("load", startReveals, { once: true });
}
