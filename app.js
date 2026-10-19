document.documentElement.classList.add("js");

const projects = window.portfolioProjects || [];
const projectList = document.querySelector(".portfolio[data-project-list]");
const projectDetail = document.querySelector("[data-project-detail]");

const createMediaElement = (media) => {
  if (media.type === "group") {
    const group = document.createElement("div");
    group.className = media.className || "";
    media.items.forEach((item) => group.append(createMediaElement(item)));
    return group;
  }

  const wrapper = media.caption ? document.createElement("figure") : document.createElement("div");
  if (media.className) {
    wrapper.className = media.className;
  }

  let element;
  if (media.type === "video") {
    element = document.createElement("video");
    element.autoplay = media.autoplay !== false;
    element.loop = Boolean(media.loop);
    element.muted = true;
    element.playsInline = true;
    if (media.controls) {
      element.controls = true;
    }

    const source = document.createElement("source");
    source.src = media.src;
    source.type = media.mime || "video/mp4";
    element.append(source, "Your browser does not support HTML video.");
  } else {
    element = document.createElement("img");
    element.src = media.src;
    element.alt = media.alt || "";
    element.loading = "lazy";
    element.decoding = "async";
  }
  wrapper.append(element);

  if (media.caption) {
    const caption = document.createElement("figcaption");
    caption.textContent = media.caption;
    wrapper.append(caption);
  }
  return wrapper;
};

const renderProjectList = () => {
  if (!projectList) {
    return;
  }

  projects.forEach((project, index) => {
    const card = document.createElement("section");
    card.className = "box reveal";

    const box = document.createElement("div");
    box.className = "box";
    const link = document.createElement("a");
    link.href = `project.html?id=${encodeURIComponent(project.id)}`;

    if (project.cardVideo) {
      const video = document.createElement("video");
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      const source = document.createElement("source");
      source.src = project.cardVideo;
      source.type = "video/mp4";
      video.append(source, "Your browser does not support HTML video.");
      link.append(video);
    }

    const image = document.createElement("img");
    image.src = project.cover;
    image.alt = project.coverAlt;
    image.loading = index === 0 ? "eager" : "lazy";
    image.decoding = "async";
    link.append(image);

    const text = document.createElement("div");
    text.className = "text";
    const title = document.createElement("h3");
    title.textContent = project.cardTitle;
    const subtitle = document.createElement("p");
    subtitle.textContent = project.subtitle;
    text.append(title, subtitle);
    link.append(text);
    box.append(link);
    card.append(box);
    projectList.append(card);
  });
};

const renderPanels = (project) => {
  if (!project.panelPairs) {
    return;
  }

  const panels = document.createElement("section");
  panels.className = "paineis";
  panels.setAttribute("aria-label", "Interactive panel designs");

  project.panelPairs.forEach((pair) => {
    const panel = document.createElement("div");
    panel.className = "edit";
    panel.tabIndex = 0;

    const base = document.createElement("div");
    base.className = "base";
    const baseImage = document.createElement("img");
    baseImage.src = pair.base;
    baseImage.alt = `${pair.alt} base design`;
    baseImage.loading = "lazy";
    baseImage.decoding = "async";
    base.append(baseImage);

    const overlay = document.createElement("div");
    overlay.className = "hover";
    const overlayImage = document.createElement("img");
    overlayImage.src = pair.overlay;
    overlayImage.alt = `${pair.alt} interactive design`;
    overlayImage.loading = "lazy";
    overlayImage.decoding = "async";
    overlay.append(overlayImage);

    panel.append(base, overlay);
    panels.append(panel);
  });

  projectDetail.after(panels);
};

const renderProjectDetail = () => {
  if (!projectDetail) {
    return;
  }

  const id = new URLSearchParams(window.location.search).get("id") || "scfz";
  const project = projects.find((item) => item.id === id);
  if (!project) {
    const message = document.createElement("p");
    message.className = "project-error";
    message.textContent = "Project not found. Return to the projects page.";
    const link = document.createElement("a");
    link.href = "index.html";
    link.textContent = "View all projects";
    projectDetail.replaceChildren(message, link);
    return;
  }

  document.title = `${project.title} | Tomé Simões`;
  document.querySelector('meta[name="description"]').content = project.description;

  const heading = document.createElement("h2");
  heading.textContent = project.title;
  const description = document.querySelector("[data-project-description]");
  description.append(heading);

  project.paragraphs.forEach((paragraph) => {
    const element = document.createElement("p");
    element.textContent = paragraph;
    description.append(element);
  });

  if (project.externalLink) {
    const link = document.createElement("a");
    link.href = project.externalLink.href;
    const linkHeading = document.createElement("h2");
    linkHeading.textContent = project.externalLink.text;
    link.append(linkHeading);
    description.append(link);
  }

  const media = document.querySelector("[data-project-media]");
  project.media.forEach((item) => media.append(createMediaElement(item)));
  renderPanels(project);
};

renderProjectList();
renderProjectDetail();

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const startReveals = () => {
  const revealItems = document.querySelectorAll(
    ".reveal, .Animations img, .Animations video",
  );
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
