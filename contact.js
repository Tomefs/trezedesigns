document.documentElement.classList.add("js");

const contactDialog = document.querySelector("#contact-dialog");
const contactTrigger = document.querySelector(".contact-trigger");
const contactCloseButton = document.querySelector(".contact-dialog__close");
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const siteNavigation = document.querySelector("#site-navigation");

if (
  mobileMenuToggle instanceof HTMLButtonElement &&
  siteNavigation instanceof HTMLElement
) {
  const navBar = mobileMenuToggle.closest(".navBar");
  const isPortuguese = document.documentElement.lang === "pt-PT";

  const closeMenu = () => {
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    mobileMenuToggle.setAttribute(
      "aria-label",
      isPortuguese ? "Abrir menu" : "Open menu",
    );
    navBar?.classList.remove("menu-open");
  };

  mobileMenuToggle.addEventListener("click", () => {
    const isExpanded =
      mobileMenuToggle.getAttribute("aria-expanded") === "true";
    mobileMenuToggle.setAttribute("aria-expanded", String(!isExpanded));
    mobileMenuToggle.setAttribute(
      "aria-label",
      isPortuguese
        ? isExpanded
          ? "Abrir menu"
          : "Fechar menu"
        : isExpanded
          ? "Open menu"
          : "Close menu",
    );
    navBar?.classList.toggle("menu-open", !isExpanded);
  });

  siteNavigation.addEventListener("click", (event) => {
    if (
      event.target instanceof Element &&
      event.target.closest("a, .contact-trigger")
    ) {
      closeMenu();
    }
  });

  contactTrigger?.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      mobileMenuToggle.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      mobileMenuToggle.focus();
    }
  });

  window.matchMedia("(min-width: 801px)").addEventListener("change", (event) => {
    if (event.matches) {
      closeMenu();
    }
  });
}

if (contactDialog instanceof HTMLDialogElement && contactTrigger && contactCloseButton) {
  contactTrigger.addEventListener("click", () => {
    contactDialog.showModal();
  });

  contactCloseButton.addEventListener("click", () => {
    contactDialog.close();
  });

  contactDialog.addEventListener("click", (event) => {
    if (event.target === contactDialog) {
      contactDialog.close();
    }
  });
}
