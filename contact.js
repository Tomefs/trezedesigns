document.documentElement.classList.add("js");

const contactDialog = document.querySelector("#contact-dialog");
const contactTriggers = document.querySelectorAll(".contact-trigger");
const contactCloseButton = document.querySelector(".contact-dialog__close");
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const siteNavigation = document.querySelector("#site-navigation");
const navBar = document.querySelector("header .navBar");

if (navBar instanceof HTMLElement) {
  const updateScrolledState = () => {
    navBar.classList.toggle("scrolled", window.scrollY > 0);
  };

  updateScrolledState();
  window.addEventListener("scroll", updateScrolledState, { passive: true });
}

if (
  mobileMenuToggle instanceof HTMLButtonElement &&
  siteNavigation instanceof HTMLElement
) {
  const navBar = mobileMenuToggle.closest(".navBar");

  const closeMenu = () => {
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    mobileMenuToggle.setAttribute("aria-label", "Open menu");
    navBar?.classList.remove("menu-open");
  };

  mobileMenuToggle.addEventListener("click", () => {
    const isExpanded =
      mobileMenuToggle.getAttribute("aria-expanded") === "true";
    mobileMenuToggle.setAttribute("aria-expanded", String(!isExpanded));
    mobileMenuToggle.setAttribute(
      "aria-label",
      isExpanded ? "Open menu" : "Close menu",
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

if (contactDialog instanceof HTMLDialogElement && contactCloseButton) {
  contactTriggers.forEach((contactTrigger) => {
    contactTrigger.addEventListener("click", () => {
      contactDialog.showModal();
    });

    contactTrigger.addEventListener("click", () => {
      if (mobileMenuToggle?.getAttribute("aria-expanded") === "true") {
        mobileMenuToggle.click();
      }
    });
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
