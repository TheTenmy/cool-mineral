// Переключение языка.
//
// Русский текст написан прямо в HTML. Переводы лежат в assets/js/lang/<код>.js,
// а элементы, которые нужно переводить, помечены атрибутами:
//   data-i18n="ключ"        — содержимое элемента
//   data-i18n-alt="ключ"    — alt у картинки
//   data-i18n-label="ключ"  — aria-label
//   data-i18n-content="ключ" — content у <meta>
//
// Язык хранится в адресе (?lang=en) и дублируется в localStorage. Параметр
// добавляется ко всем внутренним ссылкам, поэтому выбранный язык сохраняется
// при переходе между страницами, даже если сайт открыт просто как файл.

(function () {
  const defaultLang = "ru";
  const translations = window.translations || {};
  const supported = [defaultLang, ...Object.keys(translations)];

  function getSaved() {
    try {
      return localStorage.getItem("lang");
    } catch (e) {
      return null;
    }
  }

  function save(value) {
    try {
      localStorage.setItem("lang", value);
    } catch (e) {
      // localStorage недоступен (приватный режим) — язык всё равно передаётся в ссылках
    }
  }

  const fromUrl = new URLSearchParams(location.search).get("lang");
  let lang = supported.includes(fromUrl) ? fromUrl : getSaved();
  if (!supported.includes(lang)) lang = defaultLang;
  save(lang);

  const dictionary = translations[lang] || {};

  function t(key) {
    return dictionary[key];
  }

  // Добавляет ?lang= к ссылкам на страницы сайта внутри root.
  function localizeLinks(root) {
    root.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (!/^[\w-]+\.html/.test(href)) return;
      link.setAttribute("href", withLang(href, lang));
    });
  }

  function withLang(href, value) {
    const [path, hash] = href.split("#");
    const [file, query] = path.split("?");
    const params = new URLSearchParams(query);
    params.set("lang", value);
    return file + "?" + params + (hash ? "#" + hash : "");
  }

  function translate(root) {
    if (lang === defaultLang) return;
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      const text = t(el.dataset.i18n);
      if (text !== undefined) el.innerHTML = text;
    });
    root.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const text = t(el.dataset.i18nAlt);
      if (text !== undefined) el.alt = text;
    });
    root.querySelectorAll("[data-i18n-label]").forEach((el) => {
      const text = t(el.dataset.i18nLabel);
      if (text !== undefined) el.setAttribute("aria-label", text);
    });
    root.querySelectorAll("[data-i18n-content]").forEach((el) => {
      const text = t(el.dataset.i18nContent);
      if (text !== undefined) el.setAttribute("content", text);
    });
  }

  // Ссылки RU / EN ведут на эту же страницу, сохраняя остальные параметры (например, id товара).
  // Если скрипт меняет адрес (фильтр каталога), после этого нужно вызвать i18n.setUpSwitch() ещё раз.
  function setUpSwitch() {
    const current = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".lang-switch a").forEach((link) => {
      link.setAttribute("href", withLang(current + location.search, link.dataset.lang));
      link.setAttribute("aria-current", link.dataset.lang === lang ? "true" : "false");
    });
  }

  // ---- Место на странице при смене языка ----
  // Смена языка перезагружает страницу. Перед уходом запоминаем, какой элемент был
  // вверху экрана, а после загрузки возвращаемся к нему. Пиксели не годятся: тексты
  // на двух языках разной длины. Разметка же одинаковая, поэтому элемент ищем по номеру.

  const scrollKey = "lang-switch-scroll";

  // липкая боковая колонка всегда вверху экрана, поэтому ориентиром быть не может
  function getAnchors() {
    return [...document.querySelectorAll("main h1, main h2, main h3, main p, main li, main figure, main .boxed")]
      .filter((el) => !el.closest("aside"));
  }

  function rememberScroll() {
    const topbar = document.querySelector(".topbar");
    const visibleFrom = topbar ? topbar.getBoundingClientRect().bottom : 0;
    const anchors = getAnchors();
    const index = anchors.findIndex((el) => el.getBoundingClientRect().bottom > visibleFrom);
    const state = {
      page: location.pathname,
      y: window.scrollY,
      index,
      offset: index >= 0 ? anchors[index].getBoundingClientRect().top : 0
    };
    try {
      sessionStorage.setItem(scrollKey, JSON.stringify(state));
    } catch (e) {
      // без sessionStorage страница просто откроется сверху
    }
  }

  function readScroll() {
    try {
      const state = JSON.parse(sessionStorage.getItem(scrollKey));
      return state && state.page === location.pathname ? state : null;
    } catch (e) {
      return null;
    }
  }

  // Вызывается из site.js, когда весь динамический контент уже на странице.
  function restoreScroll() {
    const state = readScroll();
    if (!state) return;

    const apply = () => {
      const anchor = getAnchors()[state.index];
      const top = anchor
        ? window.scrollY + anchor.getBoundingClientRect().top - state.offset
        : state.y;
      window.scrollTo({ top, behavior: "instant" });
    };

    apply();
    // шрифты и картинки могут чуть сдвинуть вёрстку — поправляем после полной загрузки
    window.addEventListener("load", () => {
      apply();
      try {
        sessionStorage.removeItem(scrollKey);
      } catch (e) {
        // ничего страшного
      }
    }, { once: true });
  }

  document.querySelectorAll(".lang-switch a").forEach((link) => {
    link.addEventListener("click", rememberScroll);
  });

  document.documentElement.lang = lang;
  translate(document);
  localizeLinks(document);
  setUpSwitch();

  window.i18n = { lang, t, translate, localizeLinks, setUpSwitch, restoreScroll };
})();
