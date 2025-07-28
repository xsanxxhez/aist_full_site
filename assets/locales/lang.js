document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("aist_lang") || "be";
  document.documentElement.lang = lang;

  fetch(`assets/locales/${lang}.json`)
    .then(res => res.json())
    .then(data => {
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (data[key]) el.innerHTML = data[key];
      });
      document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (data[key]) el.setAttribute("placeholder", data[key]);
      });
    });

  const selector = document.querySelector(".language-selector");
  if (selector) {
    selector.value = lang;
    selector.addEventListener("change", e => {
      localStorage.setItem("aist_lang", e.target.value);
      location.reload();
    });
  }
});