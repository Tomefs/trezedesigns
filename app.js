document.documentElement.classList.add("js");

const projects = window.portfolioProjects || [];
const projectList = document.querySelector(".portfolio[data-project-list]");
const projectDetail = document.querySelector("[data-project-detail]");

const createProjectTags = (tags) => {
  const list = document.createElement("ul");
  list.className = "project-tags";
  list.setAttribute("aria-label", "Project themes");
  tags.forEach((tag) => {
    const item = document.createElement("li");
    item.textContent = tag;
    list.append(item);
  });
  return list;
};

const getGridProjects = () => [
  ...projects.filter((project) => project.id === "signature-collection"),
  ...projects.filter((project) => project.id !== "signature-collection"),
];

const createProjectNavigation = (project) => {
  const gridProjects = getGridProjects();
  const projectIndex = gridProjects.findIndex((item) => item.id === project.id);
  const navigation = document.createElement("nav");
  navigation.className = "project-navigation";
  navigation.setAttribute("aria-label", "Project navigation");

  const createLink = (neighbor, direction) => {
    if (!neighbor) {
      return;
    }

    const link = document.createElement("a");
    link.className = `project-navigation__link project-navigation__link--${direction}`;
    link.href = `project.html?id=${encodeURIComponent(neighbor.id)}`;

    const label = document.createElement("span");
    label.textContent =
      direction === "previous" ? "Previous project" : "Next project";

    const title = document.createElement("span");
    title.textContent = neighbor.title;
    link.append(label, title);
    navigation.append(link);
  };

  createLink(gridProjects[projectIndex - 1], "previous");
  createLink(gridProjects[projectIndex + 1], "next");
  return navigation;
};

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

  getGridProjects().forEach((project, index) => {
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
    text.append(title, createProjectTags(project.tags));
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

  const title = project.title;
  const tags = project.tags;
  const subtitle = tags.join(", ");
  const descriptionText = project.description;
  const paragraphs = project.paragraphs;
  const baseUrl = "https://tomefs.github.io/trezedesigns/";
  const englishUrl = `${baseUrl}project.html?id=${encodeURIComponent(project.id)}`;
  const canonicalUrl = englishUrl;

  document.title = `${title} | Tomé Simões`;
  document.documentElement.lang = "en";
  document.querySelector('meta[name="description"]').content = descriptionText;
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = descriptionText;
  document.querySelector('meta[property="og:image"]').content =
    new URL(project.cover, baseUrl).href;
  document.querySelector('meta[property="og:image:alt"]').content =
    project.coverAlt;

  const canonical = document.querySelector('link[rel="canonical"]') ||
    document.head.appendChild(
      Object.assign(document.createElement("link"), { rel: "canonical" }),
    );
  canonical.href = canonicalUrl;
  let openGraphUrl = document.querySelector('meta[property="og:url"]');
  if (!openGraphUrl) {
    openGraphUrl = document.createElement("meta");
    openGraphUrl.setAttribute("property", "og:url");
    document.head.append(openGraphUrl);
  }
  openGraphUrl.content = canonicalUrl;

  let projectSchema = document.querySelector("[data-project-schema]");
  if (!projectSchema) {
    projectSchema = document.createElement("script");
    projectSchema.type = "application/ld+json";
    projectSchema.dataset.projectSchema = "";
    document.head.append(projectSchema);
  }
  projectSchema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    abstract: subtitle,
    description: descriptionText,
    image: new URL(project.cover, baseUrl).href,
    url: canonicalUrl,
    inLanguage: "en",
    creator: {
      "@type": "Person",
      name: "Tomé Simões",
      url: baseUrl,
    },
  });

  const addAlternateLink = (language, href) => {
    let alternate = document.querySelector(
      `link[rel="alternate"][hreflang="${language}"]`,
    );
    if (!alternate) {
      alternate = document.createElement("link");
      alternate.rel = "alternate";
      alternate.hreflang = language;
      document.head.append(alternate);
    }
    alternate.href = href;
  };
  addAlternateLink("en", englishUrl);
  addAlternateLink("x-default", englishUrl);

  const heading = document.createElement("h1");
  heading.textContent = title;
  const description = document.querySelector("[data-project-description]");
  description.append(heading);

  description.append(createProjectTags(tags));

  paragraphs.forEach((paragraph) => {
    const element = document.createElement("p");
    element.textContent = paragraph;
    description.append(element);
  });

  if (project.externalLink) {
    const appendix = document.createElement("p");
    appendix.className = "project-appendix";
    const link = document.createElement("a");
    link.href = project.externalLink.href;
    link.textContent =
      project.externalLink.text;
    appendix.append(link);
    description.append(appendix);
  }

  description.append(createProjectNavigation(project));

  const media = document.querySelector("[data-project-media]");
  project.media.forEach((item) =>
    media.append(createMediaElement(item)),
  );
  renderPanels(project);
};

renderProjectList();
renderProjectDetail();

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const initializeBannerWord = () => {
  const wordElement = document.querySelector("[data-rotating-word]");
  if (!wordElement || reducedMotion) {
    return;
  }

  const words = ["strategy", "identity", "design", "motion", "storytelling"];
  let wordIndex = 0;
  let characterIndex = words[0].length;
  let deleting = true;

  const typeNextCharacter = () => {
    const word = words[wordIndex];
    characterIndex += deleting ? -1 : 1;
    wordElement.textContent = word.slice(0, characterIndex);

    let delay = 65;
    if (!deleting && characterIndex === word.length) {
      deleting = true;
      delay = 1400;
    } else if (deleting && characterIndex === 0) {
      wordIndex = (wordIndex + 1) % words.length;
      deleting = false;
      delay = 300;
    }

    window.setTimeout(typeNextCharacter, delay);
  };

  window.setTimeout(typeNextCharacter, 1500);
};

initializeBannerWord();

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
        const delay = reducedMotion ? 0 : index * 180;

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
