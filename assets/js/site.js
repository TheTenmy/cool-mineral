// Меню на телефоне, вывод каталога и страницы товара, мелкая интерактивность.

const lang = window.i18n.lang;

function text(field) {
  return field[lang] || field.ru;
}

const priceFormat = new Intl.NumberFormat(lang === "ru" ? "ru-RU" : "en-US", {
  style: "currency",
  currency: "USD"
});

function formatPrice(value) {
  return priceFormat.format(value);
}

function findProduct(id) {
  return window.catalog.find((product) => product.id === id);
}

// ---- Меню ----

const menuButton = document.querySelector(".menu-button");
const mainNav = document.getElementById("main-nav");

if (menuButton && mainNav) {
  const setMenu = (open) => {
    mainNav.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  };

  menuButton.addEventListener("click", () => setMenu(!mainNav.classList.contains("is-open")));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mainNav.classList.contains("is-open")) {
      setMenu(false);
      menuButton.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".masthead")) setMenu(false);
  });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- Карточки товаров ----
// Разметка карточки лежит в <template id="product-card"> на странице.

function renderProducts(container, products) {
  const template = document.getElementById("product-card");
  container.replaceChildren();

  products.forEach((product) => {
    const card = template.content.cloneNode(true);
    const link = card.querySelector("a");
    const image = card.querySelector("img");

    link.href = "product.html?id=" + product.id;
    image.src = "assets/img/products/" + product.id + ".jpg";
    card.querySelector(".price-tag").textContent = formatPrice(product.price);
    card.querySelector("h3").textContent = text(product.name);
    card.querySelector("p").textContent = text(product.short);

    container.append(card);
  });

  window.i18n.localizeLinks(container);
}

// Блок «Новинки» на главной
const newProducts = document.querySelector('[data-product-list="new"]');
if (newProducts) {
  renderProducts(newProducts, window.catalog.filter((product) => product.isNew).slice(0, 3));
}

// ---- Каталог с фильтром ----

const catalogList = document.querySelector('[data-product-list="all"]');
if (catalogList) {
  const filters = document.querySelector(".filters");
  Object.entries(window.categories).forEach(([key, name]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.category = key;
    button.textContent = text(name);
    filters.append(button);
  });

  const buttons = filters.querySelectorAll("button");
  let initial = new URLSearchParams(location.search).get("category");
  if (!window.categories[initial]) initial = "all";

  function showCategory(category) {
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.category === category));
    });
    const products = category === "all"
      ? window.catalog
      : window.catalog.filter((product) => product.category === category);
    renderProducts(catalogList, products);

    // текст очищаем и ставим заново, чтобы скринридер озвучил его, даже если число не изменилось
    const status = document.querySelector("[data-catalog-status]");
    status.dataset.template ??= status.textContent;
    status.textContent = "";
    setTimeout(() => {
      status.textContent = status.dataset.template.replace("{n}", products.length);
    }, 100);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      showCategory(button.dataset.category);
      const url = new URL(location.href);
      url.searchParams.set("category", button.dataset.category);
      history.replaceState(null, "", url);
      window.i18n.setUpSwitch();
    });
  });

  showCategory(initial);
}

// ---- Страница товара ----

const productPage = document.querySelector("[data-product-page]");
if (productPage) {
  const product = findProduct(new URLSearchParams(location.search).get("id"));

  if (!product) {
    const missing = document.querySelector("[data-product-missing]");
    productPage.hidden = true;
    missing.hidden = false;
    document.title = missing.querySelector("h1").textContent + " — Cool Mineral";
  } else {
    const fill = (name, value) => {
      productPage.querySelectorAll(`[data-field="${name}"]`).forEach((el) => {
        el.textContent = value;
      });
    };

    fill("name", text(product.name));
    fill("price", formatPrice(product.price));
    fill("description", text(product.description));
    fill("material", text(product.material));
    fill("sizes", product.sizes);
    fill("colors", text(product.colors));
    fill("care", text(product.care));

    fill("category", text(window.categories[product.category]));

    const image = productPage.querySelector("[data-field-image]");
    image.src = "assets/img/products/" + product.id + ".jpg";
    image.alt = text(product.name);

    document.title = text(product.name) + " — Cool Mineral";

    // Сначала товары той же категории, потом остальные
    const related = window.catalog
      .filter((item) => item.id !== product.id)
      .sort((a, b) => (b.category === product.category) - (a.category === product.category))
      .slice(0, 3);
    renderProducts(document.querySelector('[data-product-list="related"]'), related);
  }
}

// ---- Команда: карточки переворачиваются ----

// Сам переворот сделан на CSS (чекбокс + label), здесь только удобства:
// клик по любому месту карточки и скрытие невидимой стороны от фокуса.
document.querySelectorAll(".team-card").forEach((card) => {
  const toggle = card.querySelector(".team-card__toggle");
  const front = card.querySelector(".team-card__front");
  const back = card.querySelector(".team-card__back");

  function syncSides() {
    front.inert = toggle.checked;
    back.inert = !toggle.checked;
  }

  toggle.addEventListener("change", syncSides);
  syncSides();

  // у чекбокса по умолчанию работает только пробел
  toggle.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    toggle.click();
  });

  card.addEventListener("click", (event) => {
    if (event.target.closest("label, input")) return;
    toggle.checked = !toggle.checked;
    syncSides();
  });
});

// ---- Плавное раскрытие ответов в «Частых вопросах» ----
// Анимируется высота <details>. Web Animations API считает время в миллисекундах,
// поэтому раскрытие длится одинаково при любом fps. Без скриптов <details> просто открывается.

document.querySelectorAll(".faq details").forEach((details) => {
  const summary = details.querySelector("summary");
  const answer = summary.nextElementSibling;
  let animation = null;
  let closing = false;

  summary.addEventListener("click", (event) => {
    if (prefersReducedMotion) return;
    event.preventDefault();

    const opening = !details.open || closing;
    const startHeight = details.offsetHeight;
    if (animation) animation.cancel();

    // открываем, чтобы измерить полную высоту; при закрытии скроем в конце анимации
    details.open = true;
    const borders = details.offsetHeight - details.clientHeight;
    const endHeight = opening ? details.offsetHeight : summary.offsetHeight + borders;
    closing = !opening;

    details.style.overflow = "hidden";
    animation = details.animate(
      { height: [`${startHeight}px`, `${endHeight}px`] },
      { duration: 350, easing: "cubic-bezier(.45, 0, .55, 1)" }
    );
    if (opening && answer) {
      answer.animate({ opacity: [0, 1], transform: ["translateY(-6px)", "none"] }, { duration: 350, easing: "ease-out" });
    }

    animation.onfinish = () => {
      if (closing) details.open = false;
      details.style.overflow = "";
      animation = null;
      closing = false;
    };
  });
});

// ---- Копирование номера телефона ----

function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(value).catch(() => copyWithSelection(value));
  }
  return copyWithSelection(value);
}

// Запасной способ: выделить текст во временном поле. Фокус потом возвращаем на место.
function copyWithSelection(value) {
  const previousFocus = document.activeElement;
  const field = document.createElement("textarea");
  field.value = value;
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);
  field.select();
  const copied = document.execCommand("copy");
  field.remove();
  if (previousFocus) previousFocus.focus();
  return copied ? Promise.resolve() : Promise.reject(new Error("copy failed"));
}

document.querySelectorAll(".copy-button").forEach((button) => {
  const idle = button.querySelector(".copy-button__idle");
  const done = button.querySelector(".copy-button__done");

  button.addEventListener("click", () => {
    copyText(button.dataset.copy)
      .then(() => {
        idle.hidden = true;
        done.hidden = false;
        setTimeout(() => {
          idle.hidden = false;
          done.hidden = true;
        }, 2000);
      })
      .catch(() => {
        // скопировать не вышло — номер и так виден рядом, сообщение об успехе не показываем
      });
  });
});

// ---- Увеличение фото товара (только с мышью) ----

const productPhoto = document.querySelector(".product .photo");
if (productPhoto && window.matchMedia("(hover: hover)").matches) {
  const image = productPhoto.querySelector("img");

  productPhoto.addEventListener("click", () => {
    productPhoto.classList.toggle("is-zoomed");
  });

  productPhoto.addEventListener("mousemove", (event) => {
    const box = productPhoto.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 100;
    const y = ((event.clientY - box.top) / box.height) * 100;
    image.style.transformOrigin = `${x}% ${y}%`;
  });

  productPhoto.addEventListener("mouseleave", () => {
    productPhoto.classList.remove("is-zoomed");
  });
}

// ---- Стрелка «наверх» ----

const toTop = document.querySelector(".to-top");
if (toTop) {
  const update = () => toTop.classList.toggle("is-hidden", window.scrollY < 600);
  update();
  window.addEventListener("scroll", update, { passive: true });

  toTop.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    document.querySelector(".logo").focus({ preventScroll: true });
  });
}

// ---- После смены языка возвращаемся на то же место страницы ----

window.i18n.restoreScroll();
