const contactDialog = document.querySelector("#contact-dialog");
const contactTrigger = document.querySelector(".contact-trigger");
const contactCloseButton = document.querySelector(".contact-dialog__close");

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
