document.documentElement.classList.add("js");

const projects = window.portfolioProjects || [];
const isPortuguese = document.documentElement.lang === "pt-PT";
const projectList = document.querySelector(".portfolio[data-project-list]");
const projectDetail = document.querySelector("[data-project-detail]");

const createMediaElement = (media, localizedAlt) => {
  if (media.type === "group") {
    const group = document.createElement("div");
    group.className = media.className || "";
    media.items.forEach((item) => group.append(createMediaElement(item, localizedAlt)));
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
    element.alt = localizedAlt || media.alt || "";
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
    const localized = isPortuguese
      ? window.portfolioPortuguese?.[project.id]
      : undefined;
    const card = document.createElement("section");
    card.className = "box reveal";

    const box = document.createElement("div");
    box.className = "box";
    const link = document.createElement("a");
    link.href = `${isPortuguese ? "pt/" : ""}project.html?id=${encodeURIComponent(project.id)}`;

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
    image.alt = localized?.coverAlt || project.coverAlt;
    image.loading = index === 0 ? "eager" : "lazy";
    image.decoding = "async";
    link.append(image);

    const text = document.createElement("div");
    text.className = "text";
    const title = document.createElement("h3");
    title.textContent = localized?.cardTitle || project.cardTitle;
    const subtitle = document.createElement("p");
    subtitle.textContent = localized?.subtitle || project.subtitle;
    text.append(title, subtitle);
    link.append(text);
    box.append(link);
    card.append(box);
    projectList.append(card);
  });
};

const renderPanels = (project, localized) => {
  if (!project.panelPairs) {
    return;
  }

  const panels = document.createElement("section");
  panels.className = "paineis";
  panels.setAttribute(
    "aria-label",
    isPortuguese ? "Design de painéis interativos" : "Interactive panel designs",
  );

  project.panelPairs.forEach((pair) => {
    const panel = document.createElement("div");
    panel.className = "edit";
    panel.tabIndex = 0;

    const base = document.createElement("div");
    base.className = "base";
    const baseImage = document.createElement("img");
    baseImage.src = pair.base;
    baseImage.alt = isPortuguese
      ? `${localized?.panelAlt || pair.alt}, design base`
      : `${pair.alt} base design`;
    baseImage.loading = "lazy";
    baseImage.decoding = "async";
    base.append(baseImage);

    const overlay = document.createElement("div");
    overlay.className = "hover";
    const overlayImage = document.createElement("img");
    overlayImage.src = pair.overlay;
    overlayImage.alt = isPortuguese
      ? `${localized?.panelAlt || pair.alt}, design interativo`
      : `${pair.alt} interactive design`;
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
    message.textContent = isPortuguese
      ? "Projeto não encontrado. Volta à página de projetos."
      : "Project not found. Return to the projects page.";
    const link = document.createElement("a");
    link.href = isPortuguese ? "pt/" : "index.html";
    link.textContent = isPortuguese ? "Ver todos os projetos" : "View all projects";
    projectDetail.replaceChildren(message, link);
    return;
  }

  const localized = isPortuguese
    ? window.portfolioPortuguese?.[project.id]
    : undefined;
  const title = localized?.title || project.title;
  const subtitle = localized?.subtitle || project.subtitle;
  const descriptionText = localized?.description || project.description;
  const paragraphs = localized?.paragraphs || project.paragraphs;
  const baseUrl = "https://tomefs.github.io/trezedesigns/";
  const englishUrl = `${baseUrl}project.html?id=${encodeURIComponent(project.id)}`;
  const portugueseUrl = `${baseUrl}pt/project.html?id=${encodeURIComponent(project.id)}`;
  const canonicalUrl = isPortuguese ? portugueseUrl : englishUrl;

  document.title = `${title} | Tomé Simões`;
  document.documentElement.lang = isPortuguese ? "pt-PT" : "en";
  document.querySelector('meta[name="description"]').content = descriptionText;
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = descriptionText;
  document.querySelector('meta[property="og:image"]').content =
    new URL(project.cover, baseUrl).href;
  document.querySelector('meta[property="og:image:alt"]').content =
    localized?.coverAlt || project.coverAlt;

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
    inLanguage: isPortuguese ? "pt-PT" : "en",
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
  addAlternateLink("pt-PT", portugueseUrl);
  addAlternateLink("x-default", englishUrl);

  const languageSwitch = document.querySelector(".language-switch");
  if (languageSwitch) {
    languageSwitch.href = isPortuguese ? englishUrl : portugueseUrl;
  }

  const heading = document.createElement("h1");
  heading.textContent = title;
  const description = document.querySelector("[data-project-description]");
  description.append(heading);

  const subtitleElement = document.createElement("p");
  subtitleElement.className = "project-subtitle";
  subtitleElement.textContent = subtitle;
  description.append(subtitleElement);

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
      localized?.externalLink?.text || project.externalLink.text;
    appendix.append(link);
    description.append(appendix);
  }

  const media = document.querySelector("[data-project-media]");
  project.media.forEach((item) =>
    media.append(createMediaElement(item, localized?.mediaAlt)),
  );
  renderPanels(project, localized);
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
