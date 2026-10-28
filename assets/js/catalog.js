// Каталог товаров. Чтобы добавить товар, скопируйте любой объект,
// поменяйте id (он же имя картинки в assets/img/products/) и тексты.
// price — в долларах США; category — один из ключей window.categories.

window.categories = {
  all: { ru: "Все", en: "All" },
  tops: { ru: "Верх", en: "Tops" },
  dresses: { ru: "Платья", en: "Dresses" },
  bottoms: { ru: "Низ", en: "Bottoms" },
  knit: { ru: "Трикотаж", en: "Knitwear" }
};

window.catalog = [
  {
    id: "white-blouse",
    category: "tops",
    price: 14.99,
    sizes: "XS–XL",
    isNew: true,
    name: { ru: "Белая блуза", en: "White Blouse" },
    short: { ru: "Дышащий хлопок, свободный крой", en: "Breathable cotton, relaxed fit" },
    description: {
      ru: "Лёгкая хлопковая блуза с аккуратным воротником — не сковывает движений в течение дня. Удобно носить навыпуск с брюками или заправлять в юбку.",
      en: "A light cotton blouse with a neat collar that lets you move freely all day. Works worn loose over trousers or tucked into a midi skirt."
    },
    material: { ru: "100% хлопок", en: "100% cotton" },
    colors: { ru: "белый, молочный", en: "white, milk" },
    care: { ru: "стирка при 30 °C", en: "wash at 30 °C" }
  },
  {
    id: "linen-dress",
    category: "dresses",
    price: 24.99,
    sizes: "XS–XL",
    isNew: true,
    name: { ru: "Льняное платье", en: "Linen Dress" },
    short: { ru: "Не мнётся, длина миди", en: "Crease-resistant, midi length" },
    description: {
      ru: "Свободное платье миди с глубокими карманами для телефона и ключей. За счёт вискозы в составе ткань почти не мнётся в дороге и легко гладится.",
      en: "A relaxed midi dress with deep pockets for your phone and keys. The viscose blend resists heavy creasing on your commute and irons fast."
    },
    material: { ru: "55% лён, 45% вискоза", en: "55% linen, 45% viscose" },
    colors: { ru: "песочный, белый", en: "sand, white" },
    care: { ru: "стирка при 30 °C, бережный отжим", en: "wash at 30 °C, gentle spin" }
  },
  {
    id: "basic-tee",
    category: "tops",
    price: 7.99,
    sizes: "XS–XXL",
    isNew: false,
    name: { ru: "Базовая футболка", en: "Basic Tee" },
    short: { ru: "Держит форму после стирки", en: "Holds shape after washing" },
    description: {
      ru: "Прямая футболка из мягкого хлопка с добавлением эластана, благодаря которому ворот не растягивается. Универсальная база под кардиган или жилет.",
      en: "A straight-cut tee in soft cotton with 5% elastane so the neckline won't stretch out. The everyday base layer under any cardigan or vest."
    },
    material: { ru: "95% хлопок, 5% эластан", en: "95% cotton, 5% elastane" },
    colors: { ru: "белый, серый меланж, графит", en: "white, heather grey, graphite" },
    care: { ru: "стирка при 30 °C", en: "wash at 30 °C" }
  },
  {
    id: "grey-cardigan",
    category: "knit",
    price: 29.99,
    sizes: "S–XL",
    isNew: true,
    name: { ru: "Серый кардиган", en: "Grey Cardigan" },
    short: { ru: "Тонкая вязка с шерстью", en: "Fine knit with 30% wool" },
    description: {
      ru: "Мягкий кардиган на пуговицах с третью шерсти в составе. Согревает в прохладном офисе, но остаётся тонким и легко помещается под пальто.",
      en: "A soft button-front cardigan blended with 30% wool. Keeps you warm in a chilly office while staying thin enough to layer comfortably under a coat."
    },
    material: { ru: "70% акрил, 30% шерсть", en: "70% acrylic, 30% wool" },
    colors: { ru: "серый, молочный", en: "grey, milk" },
    care: { ru: "ручная стирка", en: "hand wash" }
  },
  {
    id: "wide-trousers",
    category: "bottoms",
    price: 19.99,
    sizes: "XS–XL",
    isNew: false,
    name: { ru: "Широкие брюки", en: "Wide Trousers" },
    short: { ru: "Высокая посадка, мягкий пояс", en: "High waist, elastic back band" },
    description: {
      ru: "Брюки свободного кроя со скрытой резинкой сзади на поясе — аккуратно смотрятся спереди и не давят в талии за рабочим столом.",
      en: "Relaxed-fit trousers with a hidden elastic band at the back — looks tailored in front and never digs into your waist while sitting at a desk."
    },
    material: { ru: "65% полиэстер, 35% вискоза", en: "65% polyester, 35% viscose" },
    colors: { ru: "графит, светло-серый", en: "graphite, light grey" },
    care: { ru: "стирка при 30 °C", en: "wash at 30 °C" }
  },
  {
    id: "white-skirt",
    category: "bottoms",
    price: 17.99,
    sizes: "XS–L",
    isNew: false,
    name: { ru: "Белая юбка", en: "White Skirt" },
    short: { ru: "Длина миди, мягкий пояс", en: "Midi length, soft waistband" },
    description: {
      ru: "Лёгкая юбка миди, которая не мнётся при ходьбе и быстро сохнет после стирки. Сочетается и с базовой футболкой за 7,99 $, и с рабочей блузой.",
      en: "A light midi skirt that resists wrinkling while walking and dries quickly after washing. Pairs easily with our $7.99 tee or white work blouse."
    },
    material: { ru: "100% полиэстер", en: "100% polyester" },
    colors: { ru: "белый, серый", en: "white, grey" },
    care: { ru: "деликатная стирка", en: "delicate wash" }
  },
  {
    id: "knit-vest",
    category: "knit",
    price: 14.99,
    sizes: "XS–L",
    isNew: false,
    name: { ru: "Вязаный жилет", en: "Knit Vest" },
    short: { ru: "Для многослойных образов", en: "Made for easy layering" },
    description: {
      ru: "Короткий жилет с V-образным вырезом. Наденьте его поверх белой блузы или футболки, чтобы утеплиться и собрать аккуратный образ за минуту.",
      en: "A cropped V-neck vest. Slip it over a white blouse or basic tee to add warmth and put together a neat, vintage-inspired outfit in one minute."
    },
    material: { ru: "100% акрил", en: "100% acrylic" },
    colors: { ru: "молочный, серый", en: "milk, grey" },
    care: { ru: "ручная стирка", en: "hand wash" }
  },
  {
    id: "summer-dress",
    category: "dresses",
    price: 22.99,
    sizes: "XS–L",
    isNew: false,
    name: { ru: "Летнее платье", en: "Summer Dress" },
    short: { ru: "На два сезона, без рукавов", en: "Two-season wear, sleeveless" },
    description: {
      ru: "Свободное платье из дышащей вискозы. Летом носите отдельно, а осенью надевайте поверх базовой футболки или в паре с серым кардиганом.",
      en: "A loose dress in breathable viscose. Wear it solo on hot days, or layer it over a basic tee and under a grey cardigan in autumn."
    },
    material: { ru: "100% вискоза", en: "100% viscose" },
    colors: { ru: "белый", en: "white" },
    care: { ru: "деликатная стирка", en: "delicate wash" }
  }
];
