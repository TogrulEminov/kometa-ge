import IMask from "imask";

export interface PhoneMaskItem {
  mask: string;
  regex: string;
}

export const PHONE_MASKS: PhoneMaskItem[] = [
  { mask: "+994 (00) 000-00-00", regex: "994" },
  { mask: "+90 (000) 000-00-00", regex: "90" },
  { mask: "+1 (000) 000-0000", regex: "1" },
  { mask: "+44 00 0000 0000", regex: "44" },
  { mask: "+49 000 00000000", regex: "49" },
  { mask: "+33 0 00 00 00 00", regex: "33" },
  { mask: "+7 (000) 000-00-00", regex: "7" },
  { mask: "+380 (00) 000-00-00", regex: "380" },
  { mask: "+995 (000) 00-00-00", regex: "995" },
  { mask: "+998 (00) 000-00-00", regex: "998" },
  { mask: "+86 000 0000 0000", regex: "86" },
  { mask: "+81 00-0000-0000", regex: "81" },
  { mask: "+91 00000-00000", regex: "91" },
  { mask: "+55 (00) 00000-0000", regex: "55" },
  { mask: "+39 000 000 0000", regex: "39" },
  { mask: "+34 000 00 00 00", regex: "34" },
  { mask: "+61 0 0000 0000", regex: "61" },
  { mask: "+966 0 000 0000", regex: "966" },
  { mask: "+971 00 000 0000", regex: "971" },
];

/**
 * Verilmiş nömrəyə uyğun mask tapır.
 * Tapılmasa default olaraq ilk mask (994) qaytarılır.
 */
export function resolvePhoneMask(value: string): PhoneMaskItem {
  const digits = value.replace(/\D/g, "");
  return PHONE_MASKS.find((m) => digits.startsWith(m.regex)) ?? PHONE_MASKS[0];
}

/**
 * IMask üçün dispatch funksiyası — daxil edilən rəqəmlərə görə
 * uyğun mask seçir.
 */
export function phoneDispatch(appended: string, dynamicMasked: any) {
  const current = (dynamicMasked.value + appended).replace(/\D/g, "");

  const sorted = PHONE_MASKS.map((m, i) => ({ ...m, i })).sort(
    (a, b) => b.regex.length - a.regex.length,
  );

  const found = sorted.find((m) => current.startsWith(m.regex));
  return dynamicMasked.compiledMasks[found ? found.i : 0];
}

/**
 * IMask instance yaradır — istənilən HTMLInputElement üçün işlənə bilər.
 */
export function createPhoneMask(el: HTMLInputElement) {
  return IMask(el, {
    mask: PHONE_MASKS,
    dispatch: phoneDispatch,
  });
}
