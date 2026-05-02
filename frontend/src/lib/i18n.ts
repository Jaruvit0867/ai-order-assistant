import type { Language } from "../types";

type TranslationKeys = {
  brand: string;
  askAi: string;
  close: string;
  send: string;
  typeQuestion: string;
  suggestedQuestions: string[];
  loading: string;
  errorGeneric: string;
  menu: string;
  searchPlaceholder: string;
  allDishes: string;
  signatureMenu: string;
  dailyFavorites: string;
  viewAll: string;
  baht: string;
  spiceLevel: string;
  vegetarian: string;
  vegan: string;
  allergens: string;
  contains: string;
  noMenuItems: string;
  languageName: string;
  aboutDish: string;
  customizeOrder: string;
  addToCart: string;
  add: string;
  quantity: string;
  addons: string;
  specialNote: string;
  subtotal: string;
  total: string;
  confirmOrder: string;
  placeOrder: string;
  cart: string;
  yourOrder: string;
  orderSummary: string;
  serviceFee: string;
  viewCart: string;
  emptyCart: string;
  itemAdded: string;
  orderSent: string;
  orderSuccess: string;
  backToMenu: string;
  orderNote: string;
  remove: string;
  free: string;
  items: string;
};

const TRANSLATIONS: Record<Language, TranslationKeys> = {
  th: {
    brand: "ร้านอาหารสตรีทฟู้ด",
    askAi: "ถาม AI",
    close: "ปิด",
    send: "ส่ง",
    typeQuestion: "พิมพ์คำถามเกี่ยวกับเมนูนี้...",
    suggestedQuestions: [
      "เผ็ดแค่ไหน?",
      "มีถั่วลิสงไหม?",
      "ส่วนผสมคืออะไร?",
      "ทานมังสวิรัติได้ไหม?",
    ],
    loading: "กำลังคิด...",
    errorGeneric: "เกิดข้อผิดพลาด กรุณาลองใหม่",
    menu: "เมนู",
    searchPlaceholder: "ค้นหาเมนูโปรด...",
    allDishes: "ทั้งหมด",
    signatureMenu: "เมนูแนะนำ",
    dailyFavorites: "รายการยอดนิยม",
    viewAll: "ดูทั้งหมด",
    baht: "บาท",
    spiceLevel: "ระดับความเผ็ด",
    vegetarian: "มังสวิรัติ",
    vegan: "วีแกน",
    allergens: "สารก่อภูมิแพ้",
    contains: "มี",
    noMenuItems: "ไม่พบเมนูในหมวดนี้",
    languageName: "ไทย",
    aboutDish: "เกี่ยวกับเมนูนี้",
    customizeOrder: "ปรับแต่งออเดอร์",
    addToCart: "เพิ่มลงตะกร้า",
    add: "เพิ่ม",
    quantity: "จำนวน",
    addons: "เพิ่มเติม",
    specialNote: "หมายเหตุ",
    subtotal: "รวม",
    total: "ยอดรวม",
    confirmOrder: "ยืนยันสั่งซื้อ",
    placeOrder: "สั่งซื้อ",
    cart: "ตะกร้า",
    yourOrder: "ออเดอร์ของคุณ",
    orderSummary: "สรุปออเดอร์",
    serviceFee: "ค่าบริการ",
    viewCart: "ดูตะกร้า",
    emptyCart: "ตะกร้าว่าง",
    itemAdded: "เพิ่มลงตะกร้าแล้ว",
    orderSent: "ส่งออเดอร์แล้ว",
    orderSuccess: "สั่งซื้อสำเร็จ!",
    backToMenu: "กลับเมนู",
    orderNote: "หมายเหตุถึงร้าน",
    remove: "ลบ",
    free: "ฟรี",
    items: "รายการ",
  },
  en: {
    brand: "Thai Street Food",
    askAi: "Ask AI",
    close: "Close",
    send: "Send",
    typeQuestion: "Ask about this dish...",
    suggestedQuestions: [
      "How spicy is it?",
      "Does it contain peanuts?",
      "What are the ingredients?",
      "Is it vegetarian?",
    ],
    loading: "Thinking...",
    errorGeneric: "Something went wrong. Please try again.",
    menu: "Menu",
    searchPlaceholder: "Search for your favorite dish...",
    allDishes: "All Dishes",
    signatureMenu: "Signature Menu",
    dailyFavorites: "Daily Favorites",
    viewAll: "View All",
    baht: "THB",
    spiceLevel: "Spice level",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    allergens: "Allergens",
    contains: "Contains",
    noMenuItems: "No items in this category",
    languageName: "English",
    aboutDish: "About this dish",
    customizeOrder: "Customize Your Order",
    addToCart: "Add to Basket",
    add: "Add",
    quantity: "Quantity",
    addons: "Add-ons",
    specialNote: "Special Note",
    subtotal: "Subtotal",
    total: "Total",
    confirmOrder: "Confirm Order",
    placeOrder: "Place Order",
    cart: "Basket",
    yourOrder: "Your Order",
    orderSummary: "Order Summary",
    serviceFee: "Service Fee",
    viewCart: "View Cart",
    emptyCart: "Your cart is empty",
    itemAdded: "Added to cart",
    orderSent: "Order sent!",
    orderSuccess: "Order placed successfully!",
    backToMenu: "Back to Menu",
    orderNote: "Note to restaurant",
    remove: "Remove",
    free: "Free",
    items: "items",
  },
  ja: {
    brand: "タイストリートフード",
    askAi: "AIに聞く",
    close: "閉じる",
    send: "送信",
    typeQuestion: "このメニューについて質問...",
    suggestedQuestions: [
      "辛さはどのくらい？",
      "ピーナッツは入ってますか？",
      "材料は何ですか？",
      "ベジタリアン向けですか？",
    ],
    loading: "考え中...",
    errorGeneric: "エラーが発生しました。もう一度お試しください。",
    menu: "メニュー",
    searchPlaceholder: "お気に入りの料理を検索...",
    allDishes: "すべて",
    signatureMenu: "おすすめメニュー",
    dailyFavorites: "人気メニュー",
    viewAll: "すべて見る",
    baht: "バーツ",
    spiceLevel: "辛さレベル",
    vegetarian: "ベジタリアン",
    vegan: "ヴィーガン",
    allergens: "アレルゲン",
    contains: "含む",
    noMenuItems: "このカテゴリーにアイテムがありません",
    languageName: "日本語",
    aboutDish: "このメニューについて",
    customizeOrder: "注文をカスタマイズ",
    addToCart: "カートに追加",
    add: "追加",
    quantity: "数量",
    addons: "トッピング",
    specialNote: "特記事項",
    subtotal: "小計",
    total: "合計",
    confirmOrder: "注文を確認",
    placeOrder: "注文する",
    cart: "カート",
    yourOrder: "ご注文",
    orderSummary: "注文概要",
    serviceFee: "サービス料",
    viewCart: "カートを見る",
    emptyCart: "カートは空です",
    itemAdded: "カートに追加しました",
    orderSent: "注文を送信しました",
    orderSuccess: "注文が完了しました！",
    backToMenu: "メニューに戻る",
    orderNote: "レストランへのメモ",
    remove: "削除",
    free: "無料",
    items: "品",
  },
  zh: {
    brand: "泰式街头美食",
    askAi: "问AI",
    close: "关闭",
    send: "发送",
    typeQuestion: "询问关于这道菜的问题...",
    suggestedQuestions: [
      "有多辣？",
      "含有花生吗？",
      "食材是什么？",
      "是素食吗？",
    ],
    loading: "思考中...",
    errorGeneric: "出错了，请重试。",
    menu: "菜单",
    searchPlaceholder: "搜索你喜欢的菜品...",
    allDishes: "全部菜品",
    signatureMenu: "招牌菜单",
    dailyFavorites: "每日精选",
    viewAll: "查看全部",
    baht: "泰铢",
    spiceLevel: "辣度",
    vegetarian: "素食",
    vegan: "纯素",
    allergens: "过敏原",
    contains: "含有",
    noMenuItems: "此分类没有菜品",
    languageName: "中文",
    aboutDish: "关于这道菜",
    customizeOrder: "自定义订单",
    addToCart: "加入购物车",
    add: "添加",
    quantity: "数量",
    addons: "加料",
    specialNote: "备注",
    subtotal: "小计",
    total: "总计",
    confirmOrder: "确认订单",
    placeOrder: "下单",
    cart: "购物车",
    yourOrder: "你的订单",
    orderSummary: "订单摘要",
    serviceFee: "服务费",
    viewCart: "查看购物车",
    emptyCart: "购物车是空的",
    itemAdded: "已加入购物车",
    orderSent: "订单已发送",
    orderSuccess: "下单成功！",
    backToMenu: "返回菜单",
    orderNote: "给餐厅的备注",
    remove: "删除",
    free: "免费",
    items: "件",
  },
};

const LANGUAGE_CODES: Record<string, Language> = {
  th: "th",
  en: "en",
  ja: "ja",
  jp: "ja",
  zh: "zh",
  "zh-cn": "zh",
  "zh-tw": "zh",
};

const STORAGE_KEY = "ai-street-food-language";

export function detectLanguage(): Language {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored in TRANSLATIONS) return stored as Language;

  const browserLang = navigator.language.toLowerCase().split("-")[0];
  return LANGUAGE_CODES[browserLang] ?? "en";
}

export function setLanguage(lang: Language): void {
  localStorage.setItem(STORAGE_KEY, lang);
}

export function t(lang: Language): TranslationKeys {
  return TRANSLATIONS[lang];
}

export function itemName(item: { name_th: string; name_en: string }): string {
  return item.name_th;
}

export function itemDescription(
  item: { description_th: string; description_en: string },
  lang: Language
): string {
  return lang === "th" ? item.description_th : item.description_en;
}

export function categoryName(
  cat: { name_th: string; name_en: string },
  lang: Language
): string {
  return lang === "th" ? cat.name_th : cat.name_en;
}

export const ALL_LANGUAGES: Language[] = ["th", "en", "ja", "zh"];
