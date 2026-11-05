import type { Lang } from "@/shared/i18n/config";
import type { Messages } from "@/shared/i18n/messages/types";
import { translateIn, type Vars } from "@/shared/i18n/translate";

/**
 * Public site copy. Key = Uzbek (Latin) text, `uz-Cyrl` is transliterated (`cy` overrides).
 * Kept out of the dashboard dictionary: pages translate on the server and client sections get
 * only the current language through `SiteCopyProvider`.
 */
export const SITE = {
  // metadata
  "TradeFlow — savdo, ombor va yetkazib berishni boshqarish tizimi": {
    ru: "TradeFlow — система управления продажами, складом и доставкой",
    en: "TradeFlow — sales, warehouse and delivery management system",
    ky: "TradeFlow — соода, кампа жана жеткирүүнү башкаруу системасы",
  },
  "TradeFlow — distribyutorlar uchun CRM: buyurtmalar, omborlar, audit, yetkazib berish, debitorlik va aqlli agentlar bitta platformada.": {
    ru: "TradeFlow — CRM для дистрибьюторов: заказы, склады, аудит, доставка, дебиторка и умные агенты на одной платформе.",
    en: "TradeFlow is a CRM for distributors: orders, warehouses, audits, delivery, receivables and smart agents on one platform.",
    ky: "TradeFlow — дистрибьюторлор үчүн CRM: буйрутмалар, кампалар, аудит, жеткирүү, дебитордук карыз жана акылдуу агенттер бир платформада.",
  },
  "TradeFlow — ombordan savdo nuqtasigacha to'liq nazorat": {
    ru: "TradeFlow — полный контроль от склада до торговой точки",
    en: "TradeFlow — full control from warehouse to store shelf",
    ky: "TradeFlow — кампадан соода түйүнүнө чейин толук көзөмөл",
  },
  "Buyurtmalar, ombor, audit, logistika va moliya — bitta tizimda.": {
    ru: "Заказы, склад, аудит, логистика и финансы — в одной системе.",
    en: "Orders, warehouse, audits, logistics and finance — in one system.",
    ky: "Буйрутмалар, кампа, аудит, логистика жана финансы — бир системада.",
  },

  // header, shared
  "TradeFlow bosh sahifa": { ru: "Главная страница TradeFlow", en: "TradeFlow home page", ky: "TradeFlow башкы бети" },
  Imkoniyatlar: { ru: "Возможности", en: "Features", ky: "Мүмкүнчүлүктөр" },
  "Aqlli agentlar": { ru: "Умные агенты", en: "Smart agents", ky: "Акылдуу агенттер" },
  "Qanday ishlaymiz": { ru: "Как мы работаем", en: "How we work", ky: "Кантип иштейбиз" },
  "Telegram bot": { ru: "Telegram-бот", en: "Telegram bot", ky: "Telegram-бот" },
  "Bog'lanish": { ru: "Контакты", en: "Contact", ky: "Байланыш" },
  "Demo so'rash": { ru: "Запросить демо", en: "Request a demo", ky: "Демо суроо" },
  Kirish: { ru: "Войти", en: "Sign in", ky: "Кирүү" },
  Menyu: { ru: "Меню", en: "Menu", ky: "Меню" },
  Asosiy: { ru: "Основное", en: "Main", ky: "Негизги" },
  "Mobil menyu": { ru: "Мобильное меню", en: "Mobile menu", ky: "Мобилдик меню" },
  Til: { ru: "Язык", en: "Language", ky: "Тил" },

  // hero
  "ombor xarajatlari": { ru: "складских расходов", en: "warehouse costs", ky: "кампа чыгымдары" },
  "tezroq yetkazish": { ru: "быстрее доставка", en: "faster delivery", ky: "тезирээк жеткирүү" },
  ta: { ru: "", en: "", ky: "" },
  "aqlli agent 24/7": { ru: "умных агентов 24/7", en: "smart agents 24/7", ky: "акылдуу агент 24/7" },
  "audit shaffofligi": { ru: "прозрачность аудита", en: "audit transparency", ky: "аудиттин ачыктыгы" },
  YANGI: { ru: "НОВОЕ", en: "NEW", ky: "ЖАҢЫ", cy: "ЯНГИ" },
  "5 ta aqlli agent ishga tushdi": { ru: "Запущены 5 умных агентов", en: "5 smart agents are live", ky: "5 акылдуу агент иштей баштады" },
  "Yirik savdo va omborxona tizimlarini": {
    ru: "Управляйте крупной торговлей и складами",
    en: "Run large-scale trade and warehouse operations",
    ky: "Ири соода жана кампа системаларын",
  },
  "samarali boshqaring": { ru: "эффективно", en: "efficiently", ky: "натыйжалуу башкарыңыз" },
  "Buyurtma, ombor, audit, yetkazib berish va debitorlik — bitta platformada. Aqlli agentlar zaxira tugashini, qarz oshishini va kamomadlarni sizdan oldin sezadi.": {
    ru: "Заказы, склад, аудит, доставка и дебиторка — на одной платформе. Умные агенты замечают нехватку запасов, рост долгов и недостачи раньше вас.",
    en: "Orders, warehouse, audits, delivery and receivables — on one platform. Smart agents spot running-out stock, growing debt and shortages before you do.",
    ky: "Буйрутма, кампа, аудит, жеткирүү жана дебитордук карыз — бир платформада. Акылдуу агенттер запастын түгөнүшүн, карыздын өсүшүн жана жетишпестиктерди сизден мурун байкайт.",
  },
  "Tizimni sinab ko'rish": { ru: "Попробовать систему", en: "Try the system", ky: "Системаны сынап көрүү" },
  "Demoni ko'rish": { ru: "Смотреть демо", en: "Watch the demo", ky: "Демону көрүү" },
  "Imkoniyatlarga o'tish": { ru: "Перейти к возможностям", en: "Go to features", ky: "Мүмкүнчүлүктөргө өтүү" },

  // hero scene and product preview
  "Jonli dashboard": { ru: "Живой дашборд", en: "Live dashboard", ky: "Жандуу дашборд", cy: "Жонли дашборд" },
  "Oylik tushum": { ru: "Выручка за месяц", en: "Monthly revenue", ky: "Айлык киреше" },
  "361 mln": { ru: "361 млн", en: "361M", ky: "361 млн", cy: "361 млн" },
  "Faol buyurtmalar": { ru: "Активные заказы", en: "Active orders", ky: "Активдүү буйрутмалар" },
  "Buyurtmalar oqimi": { ru: "Поток заказов", en: "Order flow", ky: "Буйрутмалар агымы" },
  bugun: { ru: "сегодня", en: "today", ky: "бүгүн" },
  Yangi: { ru: "Новый", en: "New", ky: "Жаңы" },
  "Yo'lda": { ru: "В пути", en: "On route", ky: "Жолдо" },
  Yetkazildi: { ru: "Доставлен", en: "Delivered", ky: "Жеткирилди" },
  "Audit {n}": { ru: "Аудит {n}", en: "Audit {n}", ky: "Аудит {n}" },
  Tasdiqlandi: { ru: "Подтверждён", en: "Approved", ky: "Тастыкталды" },
  "Ombor agenti": { ru: "Складской агент", en: "Warehouse agent", ky: "Кампа агенти" },
  "Coca-Cola 1.5L — 3 kunlik zaxira qoldi": { ru: "Coca-Cola 1.5L — запаса на 3 дня", en: "Coca-Cola 1.5L — 3 days of stock left", ky: "Coca-Cola 1.5L — 3 күндүк запас калды" },
  "O'z vaqtida yetkazish": { ru: "Доставка вовремя", en: "On-time delivery", ky: "Өз убагында жеткирүү" },
  "Ma'lumotlar shifrlangan": { ru: "Данные зашифрованы", en: "Data is encrypted", ky: "Маалыматтар шифрленген" },
  "Ichkaridan ko'rinishi": { ru: "Взгляд изнутри", en: "A look inside", ky: "Ичинен көрүнүшү" },
  "Murakkab ma'lumot — sodda va tushunarli ekran": {
    ru: "Сложные данные — простой и понятный экран",
    en: "Complex data — a simple, clear screen",
    ky: "Татаал маалымат — жөнөкөй жана түшүнүктүү экран",
  },
  "Ko'zni charchatmaydigan ranglar, aniq raqamlar va bir qarashda tushuniladigan grafiklar.": {
    ru: "Спокойные цвета, точные цифры и графики, понятные с первого взгляда.",
    en: "Easy-on-the-eye colours, exact numbers and charts you read at a glance.",
    ky: "Көздү чарчатпаган түстөр, так сандар жана бир караганда түшүнүктүү графиктер.",
  },
  Dashboard: { ru: "Дашборд", en: "Dashboard", ky: "Дашборд", cy: "Дашборд" },
  Omborlar: { ru: "Склады", en: "Warehouses", ky: "Кампалар" },
  Buyurtmalar: { ru: "Заказы", en: "Orders", ky: "Буйрутмалар" },
  Yetkazish: { ru: "Доставка", en: "Delivery", ky: "Жеткирүү" },
  Audit: { ru: "Аудит", en: "Audit", ky: "Аудит" },
  Moliya: { ru: "Финансы", en: "Finance", ky: "Финансы" },
  "Faol omborlar": { ru: "Активные склады", en: "Active warehouses", ky: "Активдүү кампалар" },
  Yuklangan: { ru: "Отгружено", en: "Shipped", ky: "Жүктөлгөн" },
  "12.8 t": { ru: "12,8 т", en: "12.8 t", ky: "12,8 т", cy: "12,8 т" },
  "Faol auditlar": { ru: "Активные аудиты", en: "Active audits", ky: "Активдүү аудиттер" },
  "Kam qoldiq": { ru: "Мало остатка", en: "Low stock", ky: "Калдык аз" },
  "12 ta tovar 3 kunda tugaydi": { ru: "12 товаров закончатся за 3 дня", en: "12 products run out in 3 days", ky: "12 товар 3 күндө түгөнөт" },
  "Yangi buyurtma": { ru: "Новый заказ", en: "New order", ky: "Жаңы буйрутма" },
  "TF-001248 band qilindi": { ru: "TF-001248 зарезервирован", en: "TF-001248 reserved", ky: "TF-001248 брондолду" },
  "Tovar oqimi": { ru: "Товарный поток", en: "Product flow", ky: "Товар агымы" },
  "Sotuv hajmi": { ru: "Объём продаж", en: "Sales volume", ky: "Сатуу көлөмү" },

  // problems
  "O'sishga to'sqinlik qiluvchi muammolar": { ru: "Проблемы, которые мешают росту", en: "Problems that hold growth back", ky: "Өсүүгө тоскоол болгон көйгөйлөр" },
  "Biznesingiz shu muammolarga duch kelyaptimi?": {
    ru: "Ваш бизнес сталкивается с этими проблемами?",
    en: "Is your business facing these problems?",
    ky: "Бизнесиңиз ушул көйгөйлөргө туш болуп жатабы?",
  },
  "Bu muammolar nafaqat vaqt va pulni oladi, balki biznesingiz o'sishini sekinlashtiradi.": {
    ru: "Эти проблемы отнимают не только время и деньги, но и замедляют рост вашего бизнеса.",
    en: "These problems cost more than time and money — they slow your business down.",
    ky: "Бул көйгөйлөр убакыт менен акчаны гана эмес, бизнесиңиздин өсүшүн да жайлатат.",
  },
  "Qog'ozbozlik va chalkash hisobotlar": { ru: "Бумажная волокита и запутанные отчёты", en: "Paperwork and messy reports", ky: "Кагазбастылык жана чаташкан отчеттор" },
  "Excel jadvallar, qo'lda yozilgan nakladnoylar va har kuni bir xil hisobotni qayta yig'ish.": {
    ru: "Таблицы Excel, рукописные накладные и один и тот же отчёт, собранный заново каждый день.",
    en: "Excel sheets, handwritten waybills and rebuilding the same report every day.",
    ky: "Excel таблицалары, кол менен жазылган накладнойлор жана күн сайын ошол эле отчетту кайра чогултуу.",
  },
  "Debitorlik qarzi o'sib bormoqda": { ru: "Дебиторская задолженность растёт", en: "Receivables keep growing", ky: "Дебитордук карыз өсүүдө" },
  "Qaysi savdo nuqtasi qancha qarz ekanini va qachon to'lashini hech kim aniq bilmaydi.": {
    ru: "Никто точно не знает, какая торговая точка сколько должна и когда заплатит.",
    en: "Nobody knows exactly which store owes how much and when it will pay.",
    ky: "Кайсы соода түйүнү канча карыз экенин жана качан төлөй турганын эч ким так билбейт.",
  },
  "Logistika xarajatlari yuqori": { ru: "Высокие логистические расходы", en: "High logistics costs", ky: "Логистикалык чыгымдар жогору" },
  "Bo'sh qatnovlar, kechikkan yetkazishlar va kuryerlar ustidan nazorat yo'qligi.": {
    ru: "Пустые рейсы, опоздавшие доставки и отсутствие контроля над курьерами.",
    en: "Empty runs, late deliveries and no control over couriers.",
    ky: "Бош каттамдар, кечиккен жеткирүүлөр жана курьерлерди көзөмөлдөөнүн жоктугу.",
  },
  "Qoldiq va muddati o'tayotgan tovarlar": { ru: "Остатки и товары с истекающим сроком", en: "Stock and expiring products", ky: "Калдыктар жана мөөнөтү өтүп жаткан товарлар" },
  "Bir omborda ortiqcha, boshqasida tanqis. Muddati o'tgan tovar zarari keyin bilinadi.": {
    ru: "На одном складе излишки, на другом дефицит. Убытки от просрочки становятся видны слишком поздно.",
    en: "Surplus in one warehouse, shortage in another. Losses from expired goods show up too late.",
    ky: "Бир кампада ашыкча, башкасында жетишсиз. Мөөнөтү өткөн товардын зыяны кийин билинет.",
  },
  "Savdo agentlarini kuzatish qiyin": { ru: "Сложно контролировать торговых агентов", en: "Sales reps are hard to track", ky: "Соода агенттерин көзөмөлдөө кыйын" },
  "Kim qayerga borgan, reja qanchaga bajarilgan — faqat oy oxirida ma'lum bo'ladi.": {
    ru: "Кто куда ездил и на сколько выполнен план — становится известно только в конце месяца.",
    en: "Who went where and how much of the plan is done — you only find out at month end.",
    ky: "Ким кайда барганы, план канчага аткарылганы — айдын аягында гана белгилүү болот.",
  },
  "Bir nechta tizim, yagona manzara yo'q": { ru: "Несколько систем, нет единой картины", en: "Many systems, no single picture", ky: "Бир нече система, бирдиктүү көрүнүш жок" },
  "Ombor, buxgalteriya va savdo alohida dasturlarda — ma'lumotlar bir-biriga mos kelmaydi.": {
    ru: "Склад, бухгалтерия и продажи в разных программах — данные не сходятся.",
    en: "Warehouse, accounting and sales live in separate apps — the numbers never match.",
    ky: "Кампа, бухгалтерия жана соода өзүнчө программаларда — маалыматтар бири-бирине дал келбейт.",
  },

  // solutions
  "Avtomatlashtiring. Nazorat qiling. Rivojlaning.": { ru: "Автоматизируйте. Контролируйте. Развивайтесь.", en: "Automate. Control. Grow.", ky: "Автоматташтырыңыз. Көзөмөлдөңүз. Өнүгүңүз." },
  "TradeFlow: biznesingiz uchun kompleks yechim": {
    ru: "TradeFlow: комплексное решение для вашего бизнеса",
    en: "TradeFlow: a complete solution for your business",
    ky: "TradeFlow: бизнесиңиз үчүн комплекстүү чечим",
  },
  "Ombordan savdo nuqtasigacha bo'lgan butun distribyutsiya zanjiri bitta oynada.": {
    ru: "Вся цепочка дистрибуции от склада до торговой точки — в одном окне.",
    en: "The whole distribution chain from warehouse to store shelf in one window.",
    ky: "Кампадан соода түйүнүнө чейинки бүт дистрибуция чынжыры бир терезеде.",
  },
  "Buyurtma va ombor": { ru: "Заказы и склад", en: "Orders and warehouse", ky: "Буйрутма жана кампа" },
  Operatsiyalar: { ru: "Операции", en: "Operations", ky: "Операциялар" },
  "Moliya va to'lovlar": { ru: "Финансы и платежи", en: "Finance and payments", ky: "Финансы жана төлөмдөр" },
  "Pul oqimi": { ru: "Денежный поток", en: "Cash flow", ky: "Акча агымы" },
  "Avtomatlashtirish va tahlil": { ru: "Автоматизация и аналитика", en: "Automation and analytics", ky: "Автоматташтыруу жана талдоо" },
  Aql: { ru: "Интеллект", en: "Intelligence", ky: "Акыл" },
  "{n}-yo'nalish, {m} ta modul": { ru: "Направление {n}, модулей: {m}", en: "Area {n}, {m} modules", ky: "{n}-багыт, {m} модуль" },
  "Agent buyurtma kiritadi — tizim qoldiqni avtomatik band qiladi. Yetkazish 25% gacha tezlashadi.": {
    ru: "Агент вводит заказ — система автоматически резервирует остаток. Доставка ускоряется до 25%.",
    en: "A rep enters the order — the system reserves stock automatically. Delivery gets up to 25% faster.",
    ky: "Агент буйрутма киргизет — система калдыкты автоматтык түрдө брондойт. Жеткирүү 25%га чейин тездейт.",
  },
  "Ko'p omborli nazorat": { ru: "Контроль нескольких складов", en: "Multi-warehouse control", ky: "Көп кампалуу көзөмөл" },
  "Har bir ombor bo'yicha qoldiq, rezerv, kirim-chiqim va ko'chirishlar real vaqtda.": {
    ru: "Остатки, резервы, приход-расход и перемещения по каждому складу в реальном времени.",
    en: "Stock, reserves, receipts, issues and transfers for every warehouse in real time.",
    ky: "Ар бир кампа боюнча калдык, резерв, кирим-чыгым жана которуулар реалдуу убакытта.",
  },
  "Ombor auditi": { ru: "Аудит склада", en: "Warehouse audit", ky: "Кампа аудити" },
  "Inventarizatsiya: kutilgan va sanalgan miqdor, kamomad summasi, tasdiqlash bilan qoldiqqa yozish.": {
    ru: "Инвентаризация: ожидаемое и фактическое количество, сумма недостачи, запись в остатки после утверждения.",
    en: "Stocktaking: expected vs counted quantity, shortage value, posted to stock on approval.",
    ky: "Инвентаризация: күтүлгөн жана саналган сан, жетишпестиктин суммасы, тастыктоо менен калдыкка жазуу.",
  },
  "Yetkazib berish": { ru: "Доставка", en: "Delivery", ky: "Жеткирип берүү" },
  "Kuryer biriktirish, marshrut holati, o'z vaqtida yetkazish foizi va og'irlik bo'yicha yuk hisobi.": {
    ru: "Назначение курьера, статус маршрута, доля доставок вовремя и учёт груза по весу.",
    en: "Courier assignment, route status, on-time delivery rate and load tracking by weight.",
    ky: "Курьер дайындоо, маршрут абалы, өз убагында жеткирүү пайызы жана салмак боюнча жүк эсеби.",
    cy: "Курьер бириктириш, маршрут ҳолати, ўз вақтида етказиш фоизи ва оғирлик бўйича юк ҳисоби.",
  },
  "Debitorlik nazorati": { ru: "Контроль дебиторки", en: "Receivables control", ky: "Дебитордук карызды көзөмөлдөө" },
  "Har bir mijoz uchun kredit limiti. Limitdan oshsa — tizim yangi yuklashga ruxsat bermaydi.": {
    ru: "Кредитный лимит для каждого клиента. При превышении система не даёт новую отгрузку.",
    en: "A credit limit for every client. Over the limit — the system blocks new shipments.",
    ky: "Ар бир кардар үчүн кредиттик лимит. Лимиттен ашса — система жаңы жүктөөгө уруксат бербейт.",
  },
  "Akt sverka": { ru: "Акт сверки", en: "Reconciliation statement", ky: "Салыштыруу акты" },
  "Mijoz bilan o'zaro hisob-kitob: yuklangan buyurtmalar va to'lovlar bir sahifada.": {
    ru: "Взаиморасчёты с клиентом: отгруженные заказы и платежи на одной странице.",
    en: "Mutual settlements with the client: shipped orders and payments on one page.",
    ky: "Кардар менен өз ара эсептешүү: жүктөлгөн буйрутмалар жана төлөмдөр бир бетте.",
  },
  "Chegirma va bonuslar": { ru: "Скидки и бонусы", en: "Discounts and bonuses", ky: "Арзандатуулар жана бонустар" },
  "Buyurtmadagi chegirmalar avtomatik hisoblanadi, hisobotda shaffof ko'rinadi.": {
    ru: "Скидки в заказе считаются автоматически и прозрачно видны в отчётах.",
    en: "Order discounts are calculated automatically and shown transparently in reports.",
    ky: "Буйрутмадагы арзандатуулар автоматтык эсептелет жана отчетто ачык көрүнөт.",
  },
  "Onlayn to'lov havolalari": { ru: "Ссылки на онлайн-оплату", en: "Online payment links", ky: "Онлайн төлөм шилтемелери" },
  "Mijoz qarzi uchun Payme yoki Click havolasini bir bosishda yuboring — to'lov tez va qog'ozsiz.": {
    ru: "Отправьте клиенту ссылку Payme или Click на оплату долга в один клик — быстро и без бумаг.",
    en: "Send a Payme or Click link for a client's debt in one click — fast and paperless.",
    ky: "Кардардын карызы үчүн Payme же Click шилтемесин бир басуу менен жөнөтүңүз — төлөм тез жана кагазсыз.",
  },
  "Talab prognozi": { ru: "Прогноз спроса", en: "Demand forecast", ky: "Суроо-талап болжолу" },
  "Sotuv trendi asosida keyingi oy tushumi va har bir tovarning tugash sanasi.": {
    ru: "Выручка следующего месяца и дата окончания каждого товара на основе тренда продаж.",
    en: "Next month's revenue and each product's run-out date, based on the sales trend.",
    ky: "Сатуу тренди негизинде кийинки айдын кирешеси жана ар бир товардын түгөнүү күнү.",
  },
  "Tovar oqimi, sotuv hajmi, hududlar, top tovarlar va agentlar reytingi.": {
    ru: "Товарный поток, объём продаж, регионы, топ товаров и рейтинг агентов.",
    en: "Product flow, sales volume, regions, top products and a rep leaderboard.",
    ky: "Товар агымы, сатуу көлөмү, аймактар, топ товарлар жана агенттердин рейтинги.",
  },
  "Avtomatik ogohlantirishlar": { ru: "Автоматические оповещения", en: "Automatic alerts", ky: "Автоматтык эскертүүлөр" },
  "Kam qoldiq, muddati o'tayotgan tovar, faol bo'lmagan mijoz — darhol xabar.": {
    ru: "Мало остатка, истекает срок товара, клиент перестал заказывать — сразу уведомление.",
    en: "Low stock, expiring products, inactive clients — you hear about it at once.",
    ky: "Калдык аз, мөөнөтү өтүп жаткан товар, активдүү эмес кардар — дароо билдирүү.",
  },
  Hisobotlar: { ru: "Отчёты", en: "Reports", ky: "Отчеттор" },
  "Kerakli ko'rsatkichlarni birlashtiring va Excel'ga yuklab oling.": {
    ru: "Объединяйте нужные показатели и выгружайте в Excel.",
    en: "Combine the metrics you need and export them to Excel.",
    ky: "Керектүү көрсөткүчтөрдү бириктириңиз жана Excel'ге жүктөп алыңыз.",
  },
  Integratsiyalar: { ru: "Интеграции", en: "Integrations", ky: "Интеграциялар" },
  "1C, Didox, Payme, Click va Telegram bilan ulanish uchun ochiq API.": {
    ru: "Открытый API для связи с 1С, Didox, Payme, Click и Telegram.",
    en: "An open API to connect 1C, Didox, Payme, Click and Telegram.",
    ky: "1С, Didox, Payme, Click жана Telegram менен байланышуу үчүн ачык API.",
  },
  "Idempotent operatsiyalar": { ru: "Идемпотентные операции", en: "Idempotent operations", ky: "Идемпотенттүү операциялар" },
  "Bir xil kirim ikki marta yozilmaydi — tarmoq uzilsa ham qoldiq to'g'ri qoladi.": {
    ru: "Один приход не запишется дважды — остатки верны даже при обрыве связи.",
    en: "The same receipt is never posted twice — stock stays right even if the network drops.",
    ky: "Бир эле кирим эки жолу жазылбайт — тармак үзүлсө да калдык туура калат.",
  },

  // smart agents
  "SalesDoctor'dan bir qadam oldinda": { ru: "На шаг впереди SalesDoctor", en: "One step ahead of SalesDoctor", ky: "SalesDoctor'дон бир кадам алдыда" },
  "5 ta aqlli agent biznesingizni {accent}": { ru: "5 умных агентов {accent}", en: "5 smart agents {accent}", ky: "5 акылдуу агент бизнесиңизди {accent}" },
  "24/7 kuzatadi": { ru: "следят за бизнесом 24/7", en: "watch your business 24/7", ky: "24/7 көзөмөлдөйт" },
  "Hisobot kutish shart emas. Agentlar har safar ma'lumotlarni tahlil qilib, aniq harakatni taklif qiladi.": {
    ru: "Не нужно ждать отчёта. Агенты каждый раз анализируют данные и предлагают конкретное действие.",
    en: "No more waiting for reports. Agents analyse the data every time and suggest a concrete action.",
    ky: "Отчет күтүүнүн кереги жок. Агенттер ар дайым маалыматтарды талдап, так аракетти сунушташат.",
  },
  "Har bir tovarning kunlik sotuvini hisoblab, necha kunda tugashini aytadi va qancha buyurtma berishni tavsiya qiladi.": {
    ru: "Считает дневные продажи каждого товара, говорит, через сколько дней он закончится, и советует, сколько заказать.",
    en: "Calculates each product's daily sales, tells you when it runs out and how much to reorder.",
    ky: "Ар бир товардын күнүмдүк сатуусун эсептеп, канча күндө түгөнөрүн айтат жана канча буйрутма берүүнү сунуштайт.",
  },
  "Coca-Cola 1.5L — 3 kunlik zaxira. 101 dona buyurtma bering.": {
    ru: "Coca-Cola 1.5L — запаса на 3 дня. Закажите 101 шт.",
    en: "Coca-Cola 1.5L — 3 days of stock. Order 101 units.",
    ky: "Coca-Cola 1.5L — 3 күндүк запас. 101 даана буйрутма бериңиз.",
  },
  "Moliya agenti": { ru: "Финансовый агент", en: "Finance agent", ky: "Финансы агенти" },
  "Kredit limitidan oshgan mijozlarni topadi, undirish darajasini kuzatadi.": {
    ru: "Находит клиентов сверх кредитного лимита и следит за уровнем взыскания.",
    en: "Finds clients over their credit limit and tracks the collection rate.",
    ky: "Кредиттик лимиттен ашкан кардарларды табат, өндүрүү деңгээлин көзөмөлдөйт.",
  },
  "Baraka Market limitdan 13.9 mln so'mga oshdi.": {
    ru: "Baraka Market превысил лимит на 13,9 млн сум.",
    en: "Baraka Market is 13.9M UZS over its limit.",
    ky: "Baraka Market лимиттен 13,9 млн сумга ашты.",
  },
  "Audit agenti": { ru: "Агент аудита", en: "Audit agent", ky: "Аудит агенти" },
  "Uzoq vaqt tekshirilmagan omborlarni va katta kamomadli auditlarni ko'rsatadi.": {
    ru: "Показывает склады, которые давно не проверяли, и аудиты с крупной недостачей.",
    en: "Flags warehouses not checked for a long time and audits with large shortages.",
    ky: "Көптөн бери текшерилбеген кампаларды жана чоң жетишпестиги бар аудиттерди көрсөтөт.",
  },
  "Buxoro Ombori: hali audit o'tkazilmagan.": { ru: "Бухарский склад: аудит ещё не проводился.", en: "Bukhara warehouse: never audited yet.", ky: "Бухара кампасы: аудит али өткөрүлө элек." },
  "Sotuv agenti": { ru: "Агент продаж", en: "Sales agent", ky: "Сатуу агенти" },
  "Rejadan ortda qolgan agentlar va buyurtma bermay qo'ygan mijozlarni aniqlaydi, prognoz beradi.": {
    ru: "Выявляет агентов, отстающих от плана, и клиентов, переставших заказывать, и даёт прогноз.",
    en: "Spots reps behind plan and clients who stopped ordering, and gives a forecast.",
    ky: "Пландан артта калган агенттерди жана буйрутма бербей калган кардарларды аныктайт, болжол берет.",
  },
  "Keyingi oy prognozi: 458 mln so'm.": { ru: "Прогноз на следующий месяц: 458 млн сум.", en: "Next month forecast: 458M UZS.", ky: "Кийинки айдын болжолу: 458 млн сум." },
  "Logistika agenti": { ru: "Агент логистики", en: "Logistics agent", ky: "Логистика агенти" },
  "Kechikayotgan va muvaffaqiyatsiz yetkazishlarni darhol ko'rsatadi.": {
    ru: "Сразу показывает опаздывающие и неудачные доставки.",
    en: "Shows late and failed deliveries right away.",
    ky: "Кечигип жаткан жана ийгиликсиз жеткирүүлөрдү дароо көрсөтөт.",
  },
  "3 ta yetkazish rejadan kechikmoqda.": { ru: "3 доставки отстают от графика.", en: "3 deliveries are behind schedule.", ky: "3 жеткирүү пландан кечигүүдө." },
  faol: { ru: "активен", en: "active", ky: "активдүү" },
  "barchasi faol": { ru: "все активны", en: "all active", ky: "баары активдүү" },
  "Agentlar tayyor. Navbat sizning ma'lumotlaringizda.": {
    ru: "Агенты готовы. Дело за вашими данными.",
    en: "The agents are ready. Your data is next.",
    ky: "Агенттер даяр. Кезек сиздин маалыматтарыңызда.",
  },

  // steps
  "Biz bilan ishlash bosqichlari": { ru: "Этапы работы с нами", en: "How we work together", ky: "Биз менен иштөө баскычтары" },
  "Hamkorlik qanday o'tadi?": { ru: "Как проходит сотрудничество?", en: "What does working with us look like?", ky: "Кызматташтык кантип өтөт?" },
  "Mahsulot, biznes va distribyutsiya tuzilmasini o'rganamiz, yaxshilash bo'yicha tavsiyalar beramiz va tizimni sozlaymiz.": {
    ru: "Изучаем продукт, бизнес и структуру дистрибуции, даём рекомендации по улучшению и настраиваем систему.",
    en: "We study your product, business and distribution structure, recommend improvements and set up the system.",
    ky: "Продукцияны, бизнести жана дистрибуция түзүмүн изилдейбиз, жакшыртуу боюнча сунуштарды беребиз жана системаны жөндөйбүз.",
  },
  "Ishga tushirish": { ru: "Запуск", en: "Launch", ky: "Ишке киргизүү" },
  "Ishonchli serverda joylashtiramiz — ma'lumotlaringiz xavfsiz va doimo uzluksiz ishlaydi.": {
    ru: "Размещаем на надёжном сервере — ваши данные в безопасности, а система работает без перебоев.",
    en: "We deploy on a reliable server — your data stays safe and the system runs without interruption.",
    ky: "Ишенимдүү серверге жайгаштырабыз — маалыматтарыңыз коопсуз жана система үзгүлтүксүз иштейт.",
  },
  "O'qitish": { ru: "Обучение", en: "Training", ky: "Окутуу" },
  "Operator, agent, kuryer va auditorlar uchun rolga mos qisqa o'quv dasturi.": {
    ru: "Короткая программа обучения под роль для операторов, агентов, курьеров и аудиторов.",
    en: "A short role-based training course for operators, reps, couriers and auditors.",
    ky: "Оператор, агент, курьер жана аудиторлор үчүн ролго ылайык кыска окуу программасы.",
    cy: "Оператор, агент, курьер ва аудиторлар учун ролга мос қисқа ўқув дастури.",
  },
  "Qo'llab-quvvatlash": { ru: "Поддержка", en: "Support", ky: "Колдоо" },
  "Har kuni call-markaz va Telegram orqali barcha savollaringizga javob beramiz.": {
    ru: "Каждый день отвечаем на все ваши вопросы через колл-центр и Telegram.",
    en: "Every day we answer all your questions through our call centre and Telegram.",
    ky: "Күн сайын колл-борбор жана Telegram аркылуу бардык суроолоруңузга жооп беребиз.",
  },

  // telegram
  "Tizimlaringiz bilan oson integratsiya": { ru: "Простая интеграция с вашими системами", en: "Easy integration with your systems", ky: "Системаларыңыз менен оңой интеграция" },
  "1C: Buxgalteriya": { ru: "1С: Бухгалтерия", en: "1C: Accounting", ky: "1С: Бухгалтерия" },
  "Distribyutor va savdo nuqtasi o'rtasidagi moliyaviy hisobot": {
    ru: "Финансовая сверка между дистрибьютором и торговой точкой",
    en: "Financial statement between the distributor and the store",
    ky: "Дистрибьютор менен соода түйүнүнүн ортосундагы финансылык отчет",
  },
  "Buyurtma berish": { ru: "Оформление заказа", en: "Ordering", ky: "Буйрутма берүү" },
  "Savdo nuqtasi to'g'ridan-to'g'ri bot orqali buyurtma beradi": {
    ru: "Торговая точка заказывает напрямую через бота",
    en: "Stores order straight through the bot",
    ky: "Соода түйүнү түздөн-түз бот аркылуу буйрутма берет",
  },
  Bonuslar: { ru: "Бонусы", en: "Bonuses", ky: "Бонустар" },
  "To'plangan bonuslar va aksiyalar haqida ma'lumot": {
    ru: "Информация о накопленных бонусах и акциях",
    en: "Earned bonuses and current promotions",
    ky: "Топтолгон бонустар жана акциялар тууралуу маалымат",
  },
  "Rejali hisobot": { ru: "Плановый отчёт", en: "Scheduled report", ky: "Пландуу отчет" },
  "Har kuni ertalab rahbarga savdo yakunlari": {
    ru: "Каждое утро — итоги продаж руководителю",
    en: "Sales results to the manager every morning",
    ky: "Күн сайын эртең менен жетекчиге соода жыйынтыктары",
  },
  "Buyurtma va hisobotlarni to'g'ridan-to'g'ri Telegramda boshqaring": {
    ru: "Управляйте заказами и отчётами прямо в Telegram",
    en: "Manage orders and reports right inside Telegram",
    ky: "Буйрутмаларды жана отчетторду түздөн-түз Telegram'да башкарыңыз",
  },
  "Savdo nuqtalari bilan aloqa, push-bildirishnomalar va real vaqt nazorati.": {
    ru: "Связь с торговыми точками, push-уведомления и контроль в реальном времени.",
    en: "Store communication, push notifications and real-time control.",
    ky: "Соода түйүндөрү менен байланыш, push-билдирүүлөр жана реалдуу убакыттагы көзөмөл.",
  },
  "Botni sinab ko'rish": { ru: "Попробовать бота", en: "Try the bot", ky: "Ботту сынап көрүү" },
  online: { ru: "в сети", en: "online", ky: "онлайн", cy: "онлайн" },
  "📄 Baraka Market — Oktabr": { ru: "📄 Baraka Market — Октябрь", en: "📄 Baraka Market — October", ky: "📄 Baraka Market — Октябрь" },
  "Yuklandi: 48 250 000 so'm": { ru: "Отгружено: 48 250 000 сум", en: "Shipped: 48,250,000 UZS", ky: "Жүктөлдү: 48 250 000 сум" },
  "To'landi: 36 000 000 so'm": { ru: "Оплачено: 36 000 000 сум", en: "Paid: 36,000,000 UZS", ky: "Төлөндү: 36 000 000 сум" },
  "Qoldiq: 12 250 000 so'm": { ru: "Остаток: 12 250 000 сум", en: "Balance: 12,250,000 UZS", ky: "Калдык: 12 250 000 сум" },
  "Yangi buyurtma 🛒": { ru: "Новый заказ 🛒", en: "New order 🛒", ky: "Жаңы буйрутма 🛒" },
  "TF-001248 qabul qilindi": { ru: "TF-001248 принят", en: "TF-001248 accepted", ky: "TF-001248 кабыл алынды" },
  "Yetkazish: ertaga 10:00–14:00": { ru: "Доставка: завтра 10:00–14:00", en: "Delivery: tomorrow 10:00–14:00", ky: "Жеткирүү: эртең 10:00–14:00" },

  // advantages
  Afzalliklar: { ru: "Преимущества", en: "Advantages", ky: "Артыкчылыктар" },
  "Nega mijozlar TradeFlow'ni tanlaydi": { ru: "Почему клиенты выбирают TradeFlow", en: "Why clients choose TradeFlow", ky: "Эмне үчүн кардарлар TradeFlow'ду тандашат" },
  "Qulay interfeys": { ru: "Удобный интерфейс", en: "Friendly interface", ky: "Ыңгайлуу интерфейс" },
  "Oddiy, o'rganish va ishlatish oson. Yangi xodim bir kunda o'zlashtiradi.": {
    ru: "Простой, легко освоить и использовать. Новый сотрудник разберётся за один день.",
    en: "Simple to learn and use. A new hire gets up to speed in a day.",
    ky: "Жөнөкөй, үйрөнүү жана колдонуу оңой. Жаңы кызматкер бир күндө өздөштүрөт.",
  },
  "Tajribaga asoslangan": { ru: "Основано на опыте", en: "Built on experience", ky: "Тажрыйбага негизделген" },
  "Turli hajmdagi distribyutorlarning real jarayonlari asosida qurilgan.": {
    ru: "Построено на реальных процессах дистрибьюторов разного масштаба.",
    en: "Built on the real processes of distributors of every size.",
    ky: "Ар кандай көлөмдөгү дистрибьюторлордун реалдуу процесстеринин негизинде курулган.",
  },
  "Aniq hisobot": { ru: "Точная отчётность", en: "Accurate reporting", ky: "Так отчет" },
  "Kerakli ma'lumot bitta hisobotda. Asosiy ko'rsatkichlarni solishtirish uchun tayyor shablonlar.": {
    ru: "Нужные данные в одном отчёте. Готовые шаблоны для сравнения ключевых показателей.",
    en: "Everything you need in one report. Ready templates to compare key metrics.",
    ky: "Керектүү маалымат бир отчетто. Негизги көрсөткүчтөрдү салыштыруу үчүн даяр үлгүлөр.",
  },
  "Eng yaxshi amaliyotlar": { ru: "Лучшие практики", en: "Best practices", ky: "Мыкты тажрыйбалар" },
  "Yirik kompaniyalar tajribasi va real biznes vazifalaridan olingan tizimli yechimlar.": {
    ru: "Системные решения на основе опыта крупных компаний и реальных бизнес-задач.",
    en: "Proven solutions drawn from large companies and real business tasks.",
    ky: "Ири компаниялардын тажрыйбасынан жана реалдуу бизнес милдеттеринен алынган системалуу чечимдер.",
  },
  "Mijozga raqamli yaqinlik": { ru: "Цифровая близость к клиенту", en: "Digital closeness to clients", ky: "Кардарга санариптик жакындык" },
  "Telegram-bot, mobil ilova va SMS — mijozlaringiz bilan doimiy aloqa.": {
    ru: "Telegram-бот, мобильное приложение и SMS — постоянная связь с вашими клиентами.",
    en: "Telegram bot, mobile app and SMS — always in touch with your clients.",
    ky: "Telegram-бот, мобилдик тиркеме жана SMS — кардарларыңыз менен туруктуу байланыш.",
  },
  "iOS va Android uchun mobil ilova": { ru: "Мобильное приложение для iOS и Android", en: "Mobile app for iOS and Android", ky: "iOS жана Android үчүн мобилдик тиркеме", cy: "iOS ва Android учун мобил илова" },
  "Agentlar uchun oflayn buyurtma, marshrut va foto-hisobot.": {
    ru: "Офлайн-заказы, маршруты и фотоотчёты для агентов.",
    en: "Offline orders, routes and photo reports for reps.",
    ky: "Агенттер үчүн офлайн буйрутма, маршрут жана фото-отчет.",
  },

  // faq
  "Savol-javob": { ru: "Вопросы и ответы", en: "FAQ", ky: "Суроо-жооп" },
  "Ko'p beriladigan savollar": { ru: "Частые вопросы", en: "Frequently asked questions", ky: "Көп берилүүчү суроолор" },
  "TradeFlow kimlar uchun?": { ru: "Для кого TradeFlow?", en: "Who is TradeFlow for?", ky: "TradeFlow кимдер үчүн?" },
  "Distribyutorlar, ulgurji savdo kompaniyalari, ishlab chiqaruvchilar va bir nechta omborga ega savdo tarmoqlari uchun.": {
    ru: "Для дистрибьюторов, оптовых компаний, производителей и торговых сетей с несколькими складами.",
    en: "Distributors, wholesalers, manufacturers and retail chains with several warehouses.",
    ky: "Дистрибьюторлор, дүң соода компаниялары, өндүрүүчүлөр жана бир нече кампасы бар соода тармактары үчүн.",
  },
  "Ma'lumotlarimiz qayerda saqlanadi?": { ru: "Где хранятся наши данные?", en: "Where is our data stored?", ky: "Маалыматтарыбыз кайда сакталат?" },
  "O'zingiz tanlagan serverda (O'zbekiston yoki Yevropa). Ma'lumotlar shifrlangan kanal orqali uzatiladi va har kuni zaxiralanadi.": {
    ru: "На выбранном вами сервере (Узбекистан или Европа). Данные передаются по зашифрованному каналу и ежедневно резервируются.",
    en: "On a server you choose (Uzbekistan or Europe). Data travels over an encrypted channel and is backed up daily.",
    ky: "Өзүңүз тандаган серверде (Өзбекстан же Европа). Маалыматтар шифрленген канал аркылуу берилет жана күн сайын камдык көчүрмөсү алынат.",
  },
  "Ishga tushirish qancha vaqt oladi?": { ru: "Сколько занимает запуск?", en: "How long does the launch take?", ky: "Ишке киргизүү канча убакыт алат?" },
  "Odatda 1–2 hafta: audit, sozlash, ma'lumotlarni ko'chirish va xodimlarni o'qitish.": {
    ru: "Обычно 1–2 недели: аудит, настройка, перенос данных и обучение сотрудников.",
    en: "Usually 1–2 weeks: audit, setup, data migration and staff training.",
    ky: "Адатта 1–2 жума: аудит, жөндөө, маалыматтарды көчүрүү жана кызматкерлерди окутуу.",
  },
  "1C yoki boshqa dastur bilan ulanadimi?": { ru: "Подключается ли к 1С или другим программам?", en: "Does it connect to 1C or other software?", ky: "1С же башка программа менен туташабы?" },
  "Ha. TradeFlow ochiq REST API'ga ega — 1C, Didox, to'lov tizimlari va boshqa ERP'lar bilan integratsiya qilinadi.": {
    ru: "Да. У TradeFlow открытый REST API — интеграция с 1С, Didox, платёжными системами и другими ERP.",
    en: "Yes. TradeFlow has an open REST API — it integrates with 1C, Didox, payment systems and other ERPs.",
    ky: "Ооба. TradeFlow ачык REST API'га ээ — 1С, Didox, төлөм системалары жана башка ERP'лер менен интеграцияланат.",
  },
  "Aqlli agentlar qanday ishlaydi?": { ru: "Как работают умные агенты?", en: "How do the smart agents work?", ky: "Акылдуу агенттер кантип иштейт?" },
  "Ular sotuv, qoldiq, to'lov va audit ma'lumotlarini doimiy tahlil qiladi va aniq tavsiyalar beradi: nima buyurtma qilish, kimdan qarz undirish, qaysi omborni tekshirish.": {
    ru: "Они постоянно анализируют продажи, остатки, платежи и аудиты и дают конкретные советы: что заказать, с кого взыскать долг, какой склад проверить.",
    en: "They keep analysing sales, stock, payments and audits and give concrete advice: what to reorder, whom to collect from, which warehouse to check.",
    ky: "Алар сатуу, калдык, төлөм жана аудит маалыматтарын тынымсыз талдап, так сунуштарды беришет: эмнени буйрутма кылуу, кимден карыз өндүрүү, кайсы кампаны текшерүү.",
  },

  // contact and form
  "Bepul demo": { ru: "Бесплатное демо", en: "Free demo", ky: "Акысыз демо" },
  "Onlayn namoyishga {accent}": { ru: "{accent} на онлайн-демонстрацию", en: "{accent} for an online demo", ky: "Онлайн көрсөтүүгө {accent}" },
  yoziling: { ru: "Запишитесь", en: "Sign up", ky: "жазылыңыз" },
  "30 daqiqalik bepul namoyishda tizim imkoniyatlarini ko'rsatamiz va biznesingizga mos yechimni taklif qilamiz.": {
    ru: "За 30 минут бесплатной демонстрации покажем возможности системы и предложим решение под ваш бизнес.",
    en: "In a free 30-minute demo we show what the system can do and propose a solution for your business.",
    ky: "30 мүнөттүк акысыз көрсөтүүдө системанын мүмкүнчүлүктөрүн көрсөтүп, бизнесиңизге ылайык чечим сунуштайбыз.",
  },
  "Toshkent sh., Yunusobod tumani": { ru: "г. Ташкент, Юнусабадский район", en: "Yunusabad district, Tashkent", ky: "Ташкент ш., Юнусабад району" },
  "Du–Sha, 09:00–19:00": { ru: "Пн–Сб, 09:00–19:00", en: "Mon–Sat, 09:00–19:00", ky: "Дш–Иш, 09:00–19:00" },
  "Formani to'ldiring": { ru: "Заполните форму", en: "Fill in the form", ky: "Форманы толтуруңуз" },
  "Rahmat! So'rovingiz qabul qilindi.": { ru: "Спасибо! Ваша заявка принята.", en: "Thank you! Your request has been received.", ky: "Рахмат! Суроо-талабыңыз кабыл алынды." },
  "Mutaxassisimiz 1 ish soati ichida siz bilan bog'lanadi.": {
    ru: "Наш специалист свяжется с вами в течение 1 рабочего часа.",
    en: "Our specialist will contact you within 1 business hour.",
    ky: "Адисибиз 1 жумуш сааттын ичинде сиз менен байланышат.",
  },
  Ismingiz: { ru: "Ваше имя", en: "Your name", ky: "Атыңыз" },
  "Ism Familiya": { ru: "Имя Фамилия", en: "First Last", ky: "Аты Фамилиясы" },
  Telefon: { ru: "Телефон", en: "Phone", ky: "Телефон" },
  Kompaniya: { ru: "Компания", en: "Company", ky: "Компания" },
  "Kompaniya nomi": { ru: "Название компании", en: "Company name", ky: "Компаниянын аталышы" },
  Izoh: { ru: "Комментарий", en: "Comment", ky: "Комментарий" },
  "Agentlar soni, omborlar soni, qiziqtirgan modullar…": {
    ru: "Количество агентов, складов, интересующие модули…",
    en: "Number of reps, number of warehouses, modules you need…",
    ky: "Агенттердин саны, кампалардын саны, кызыктырган модулдар…",
  },
  "Yuborilmoqda…": { ru: "Отправка…", en: "Sending…", ky: "Жөнөтүлүүдө…" },
  "Demoga yozilish": { ru: "Записаться на демо", en: "Book a demo", ky: "Демого жазылуу" },
  "Formani to'ldirib, shaxsiy ma'lumotlarni qayta ishlashga rozilik bildirasiz.": {
    ru: "Заполняя форму, вы соглашаетесь на обработку персональных данных.",
    en: "By submitting the form you agree to the processing of your personal data.",
    ky: "Форманы толтуруу менен жеке маалыматтарды иштетүүгө макулдук бересиз.",
  },

  // footer
  "Ombordan savdo nuqtasigacha — {accent} bugundan.": {
    ru: "От склада до торговой точки — {accent} уже сегодня.",
    en: "From warehouse to store shelf — {accent} starting today.",
    ky: "Кампадан соода түйүнүнө чейин — {accent} бүгүндөн баштап.",
  },
  "to'liq nazorat": { ru: "полный контроль", en: "full control", ky: "толук көзөмөл" },
  Boshlash: { ru: "Начать", en: "Get started", ky: "Баштоо" },
  "Distribyutsiya, ombor, audit va yetkazib berish uchun yagona boshqaruv platformasi.": {
    ru: "Единая платформа управления дистрибуцией, складом, аудитом и доставкой.",
    en: "One management platform for distribution, warehouse, audits and delivery.",
    ky: "Дистрибуция, кампа, аудит жана жеткирүү үчүн бирдиктүү башкаруу платформасы.",
  },
  Mahsulot: { ru: "Продукт", en: "Product", ky: "Продукт" },
  Resurslar: { ru: "Ресурсы", en: "Resources", ky: "Ресурстар" },
  "Tizimga kirish": { ru: "Вход в систему", en: "Sign in", ky: "Системага кирүү" },
  "Texnik yordam": { ru: "Техподдержка", en: "Support", ky: "Техникалык жардам" },
  "Video darslar": { ru: "Видеоуроки", en: "Video lessons", ky: "Видео сабактар" },
  Hujjatlar: { ru: "Документация", en: "Documentation", ky: "Документтер" },
  "Biz haqimizda": { ru: "О нас", en: "About us", ky: "Биз жөнүндө" },
  Rekvizitlar: { ru: "Реквизиты", en: "Company details", ky: "Реквизиттер" },
  Karyera: { ru: "Карьера", en: "Careers", ky: "Карьера", cy: "Карьера" },
  Kontaktlar: { ru: "Контакты", en: "Contacts", ky: "Байланыштар" },
  "Barcha huquqlar himoyalangan.": { ru: "Все права защищены.", en: "All rights reserved.", ky: "Бардык укуктар корголгон." },
} satisfies Messages;

export type SiteKey = keyof typeof SITE;
export type SiteT = (key: SiteKey, vars?: Vars) => string;

export const siteT =
  (lang: Lang): SiteT =>
  (key, vars) =>
    translateIn(SITE, lang, key, vars);

/** Every site string in one language: what client sections receive (templates keep their `{slots}`). */
export function siteCopy(lang: Lang): Record<SiteKey, string> {
  const t = siteT(lang);
  return Object.fromEntries((Object.keys(SITE) as SiteKey[]).map((k) => [k, t(k)])) as Record<SiteKey, string>;
}
