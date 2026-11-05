/**
 * API messages. Key = the Uzbek (Latin) text the code throws; `{name}` slots match the filled-in values.
 * `cy` overrides the automatic Uzbek Cyrillic transliteration.
 */
export interface Entry {
  ru: string;
  en: string;
  ky: string;
  cy?: string;
}

export const MESSAGES: Record<string, Entry> = {
  // core
  Topilmadi: { ru: "Не найдено", en: "Not found", ky: "Табылган жок" },
  "Ma'lumotlar noto'g'ri": { ru: "Неверные данные", en: "Invalid data", ky: "Маалыматтар туура эмес" },
  "Bunday yozuv allaqachon mavjud": { ru: "Такая запись уже существует", en: "This record already exists", ky: "Мындай жазуу мурунтан эле бар" },
  "Bog'langan yozuv topilmadi": { ru: "Связанная запись не найдена", en: "Linked record not found", ky: "Байланышкан жазуу табылган жок" },
  "Server xatosi": { ru: "Ошибка сервера", en: "Server error", ky: "Сервер катасы" },
  "Avtorizatsiya talab qilinadi": { ru: "Требуется авторизация", en: "Authorization required", ky: "Авторизация талап кылынат" },
  "Sessiya muddati tugagan": { ru: "Срок сессии истёк", en: "Session expired", ky: "Сессиянын мөөнөтү бүттү" },
  "Sessiya bekor qilingan — qaytadan kiring": { ru: "Сессия отозвана — войдите снова", en: "Session revoked — sign in again", ky: "Сессия жокко чыгарылды — кайра кириңиз" },
  "Ruxsat yo'q": { ru: "Нет доступа", en: "Access denied", ky: "Уруксат жок" },

  // auth
  "Ko'p noto'g'ri urinish. {n} daqiqadan keyin qayta urinib ko'ring": {
    ru: "Слишком много неверных попыток. Повторите через {n} мин.",
    en: "Too many failed attempts. Try again in {n} min.",
    ky: "Өтө көп туура эмес аракет. {n} мүнөттөн кийин кайра аракет кылыңыз",
  },
  "Login yoki parol noto'g'ri": { ru: "Неверный логин или пароль", en: "Wrong username or password", ky: "Логин же сырсөз туура эмес" },
  "Hisobingiz bloklangan — administratorga murojaat qiling": { ru: "Ваш аккаунт заблокирован — обратитесь к администратору", en: "Your account is blocked — contact the administrator", ky: "Аккаунтуңуз бөгөттөлгөн — администраторго кайрылыңыз" },
  "Foydalanuvchi topilmadi": { ru: "Пользователь не найден", en: "User not found", ky: "Колдонуучу табылган жок" },
  "Joriy parol noto'g'ri": { ru: "Текущий пароль неверен", en: "Current password is wrong", ky: "Учурдагы сырсөз туура эмес" },
  "Yangi parol joriy paroldan farq qilishi kerak": { ru: "Новый пароль должен отличаться от текущего", en: "The new password must differ from the current one", ky: "Жаңы сырсөз учурдагыдан айырмаланышы керек" },

  // users
  "Kamida bitta faol administrator qolishi kerak": { ru: "Должен остаться хотя бы один активный администратор", en: "At least one active administrator must remain", ky: "Жок дегенде бир активдүү администратор калышы керек" },
  "Xodim topilmadi": { ru: "Сотрудник не найден", en: "Staff member not found", ky: "Кызматкер табылган жок" },
  "Xodim topilmadi yoki bu vazifaga mos emas": { ru: "Сотрудник не найден или не подходит для этой задачи", en: "Staff member not found or not eligible for this assignment", ky: "Кызматкер табылган жок же бул тапшырмага ылайык эмес" },
  "O'z rolingizni o'zgartira olmaysiz": { ru: "Нельзя изменить собственную роль", en: "You cannot change your own role", ky: "Өз ролуңузду өзгөртө албайсыз" },
  "O'zingizni bloklay olmaysiz": { ru: "Нельзя заблокировать самого себя", en: "You cannot block yourself", ky: "Өзүңүздү бөгөттөй албайсыз" },

  // orders, stock, clients, payments
  "Mijoz topilmadi": { ru: "Клиент не найден", en: "Client not found", ky: "Кардар табылган жок" },
  "Tovar #{id} topilmadi yoki faol emas": { ru: "Товар #{id} не найден или неактивен", en: "Product #{id} not found or inactive", ky: "Товар #{id} табылган жок же активдүү эмес" },
  "Mijozning kredit limiti oshib ketadi. Avval qarzni undiring.": { ru: "Будет превышен кредитный лимит клиента. Сначала взыщите долг.", en: "The client's credit limit would be exceeded. Collect the debt first.", ky: "Кардардын кредиттик лимити ашып кетет. Адегенде карызды өндүрүңүз." },
  "Buyurtma topilmadi": { ru: "Заказ не найден", en: "Order not found", ky: "Буйрутма табылган жок" },
  "\"{from}\" holatidan \"{to}\" holatiga o'tib bo'lmaydi": { ru: "Нельзя перейти из статуса «{from}» в «{to}»", en: "Cannot move from \"{from}\" to \"{to}\"", ky: "\"{from}\" абалынан \"{to}\" абалына өтүүгө болбойт" },
  "Ko'chirish uchun boshqa omborni tanlang": { ru: "Для перемещения выберите другой склад", en: "Pick a different warehouse for the transfer", ky: "Которуу үчүн башка кампаны тандаңыз" },
  "Omborda yetarli bo'sh qoldiq yo'q": { ru: "На складе недостаточно свободного остатка", en: "Not enough free stock in the warehouse", ky: "Кампада бош калдык жетишсиз" },
  "Buyurtma uchun qoldiq yetarli emas": { ru: "Недостаточно остатка для заказа", en: "Not enough stock for the order", ky: "Буйрутма үчүн калдык жетишсиз" },
  "Yetkazish topilmadi": { ru: "Доставка не найдена", en: "Delivery not found", ky: "Жеткирүү табылган жок" },
  "INN 9 yoki 14 ta raqam": { ru: "ИНН — 9 или 14 цифр", en: "TIN must be 9 or 14 digits", ky: "ИНН — 9 же 14 сан" },
  "Didox integratsiyasi ulanmagan": { ru: "Интеграция Didox не подключена", en: "Didox integration is not connected", ky: "Didox интеграциясы туташтырылган эмес" },
  "Soliq bazasidan olinmadi: {reason}": { ru: "Не удалось получить из налоговой базы: {reason}", en: "Could not fetch from the tax registry: {reason}", ky: "Салык базасынан алынган жок: {reason}" },

  // warehouses, products, audits, leads
  "Ombor topilmadi": { ru: "Склад не найден", en: "Warehouse not found", ky: "Кампа табылган жок" },
  "Ombor topilmadi yoki faol emas": { ru: "Склад не найден или неактивен", en: "Warehouse not found or inactive", ky: "Кампа табылган жок же активдүү эмес" },
  "Tovar topilmadi": { ru: "Товар не найден", en: "Product not found", ky: "Товар табылган жок" },
  "Audit topilmadi": { ru: "Аудит не найден", en: "Audit not found", ky: "Аудит табылган жок" },
  "Yakunlangan auditni o'zgartirib bo'lmaydi": { ru: "Завершённый аудит нельзя изменить", en: "A completed audit cannot be changed", ky: "Аяктаган аудитти өзгөртүүгө болбойт" },
  "Audit allaqachon yakunlangan": { ru: "Аудит уже завершён", en: "The audit is already completed", ky: "Аудит мурунтан эле аяктаган" },
  "{n} ta pozitsiya hali sanalmagan": { ru: "Не пересчитано позиций: {n}", en: "{n} items are not counted yet", ky: "{n} позиция али эсептеле элек" },
  "Faqat yakunlangan audit tasdiqlanadi": { ru: "Утвердить можно только завершённый аудит", en: "Only a completed audit can be approved", ky: "Аяктаган аудит гана ырасталат" },
  "Lid topilmadi": { ru: "Лид не найден", en: "Lead not found", ky: "Лид табылган жок" },

  // integrations
  "Integratsiya topilmadi yoki o'chirilgan": { ru: "Интеграция не найдена или отключена", en: "Integration not found or disabled", ky: "Интеграция табылган жок же өчүрүлгөн" },
  "Bunday ma'lumotlar to'plami yo'q": { ru: "Такого набора данных нет", en: "No such dataset", ky: "Мындай маалымат топтому жок" },
  "Bunday fayl yo'q": { ru: "Такого файла нет", en: "No such file", ky: "Мындай файл жок" },
  "Noma'lum integratsiya turi: {key}": { ru: "Неизвестный тип интеграции: {key}", en: "Unknown integration type: {key}", ky: "Белгисиз интеграция түрү: {key}" },
  "“{field}” majburiy": { ru: "«{field}» — обязательное поле", en: "“{field}” is required", ky: "“{field}” милдеттүү" },
  "“{field}” https:// bilan boshlanishi kerak": { ru: "«{field}» должно начинаться с https://", en: "“{field}” must start with https://", ky: "“{field}” https:// менен башталышы керек" },
  "{name} bu hodisalarni qabul qilmaydi: {list}": { ru: "{name} не принимает эти события: {list}", en: "{name} does not accept these events: {list}", ky: "{name} бул окуяларды кабыл албайт: {list}" },
  "Integratsiya topilmadi": { ru: "Интеграция не найдена", en: "Integration not found", ky: "Интеграция табылган жок" },
  "{name} uchun qo'lda sinxronlash yo'q": { ru: "Для {name} нет ручной синхронизации", en: "{name} has no manual sync", ky: "{name} үчүн кол менен шайкештирүү жок" },
  "Integratsiya o'chirilgan": { ru: "Интеграция отключена", en: "Integration is disabled", ky: "Интеграция өчүрүлгөн" },
  "Faqat muvaffaqiyatsiz vazifani qayta yuborish mumkin": { ru: "Повторно отправить можно только неудачную задачу", en: "Only a failed job can be resent", ky: "Ийгиликсиз тапшырманы гана кайра жөнөтүүгө болот" },
  "Ombor kodi topilmadi: {code}": { ru: "Код склада не найден: {code}", en: "Warehouse code not found: {code}", ky: "Кампанын коду табылган жок: {code}" },
};
