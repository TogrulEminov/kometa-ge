import { useCallback, useEffect, useRef } from "react";
import IMask, { type InputMask } from "imask";

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

/** Default: Gürcüstan (+995) */
export const DEFAULT_PHONE_MASK: PhoneMaskItem = {
  mask: "+995 (000) 00-00-00",
  regex: "995",
};

export const DEFAULT_PHONE_PLACEHOLDER = DEFAULT_PHONE_MASK.mask;

const DEFAULT_PHONE_MASK_INDEX = PHONE_MASKS.findIndex(
  (m) => m.regex === DEFAULT_PHONE_MASK.regex,
);

const IMASK_PHONE_MASKS = PHONE_MASKS.map(({ mask }) => ({ mask }));

/**
 * Verilmiş nömrəyə uyğun mask tapır.
 * Tapılmasa default olaraq Gürcüstan maskası (995) qaytarılır.
 */
export function resolvePhoneMask(value: string): PhoneMaskItem {
  const digits = value.replace(/\D/g, "");
  return (
    PHONE_MASKS.find((m) => digits.startsWith(m.regex)) ?? DEFAULT_PHONE_MASK
  );
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
  return dynamicMasked.compiledMasks[
    found ? found.i : DEFAULT_PHONE_MASK_INDEX
  ];
}

export const phoneMaskOptions = {
  mask: IMASK_PHONE_MASKS,
  dispatch: phoneDispatch,
} as const;

/**
 * IMask instance yaradır — native HTMLInputElement üçün.
 */
export function createPhoneMask(el: HTMLInputElement) {
  return IMask(el, phoneMaskOptions);
}

/**
 * Ant Design InputRef-dən native input elementi çıxarır.
 */
export function getAntdNativeInput(
  instance: { input: HTMLInputElement | null; nativeElement?: Element | null } | null,
): HTMLInputElement | null {
  if (!instance) return null;
  if (instance.input) return instance.input;

  const { nativeElement } = instance;
  return nativeElement instanceof HTMLInputElement ? nativeElement : null;
}

/**
 * Native <input> + IMask inteqrasiyası.
 * Callback ref qaytarır.
 */
export function usePhoneMask(
  value: string | undefined,
  onAccept: (maskedValue: string) => void,
) {
  const maskRef = useRef<InputMask | null>(null);
  const elementRef = useRef<HTMLInputElement | null>(null);
  const onAcceptRef = useRef(onAccept);
  const valueRef = useRef(value);

  useEffect(() => {
    onAcceptRef.current = onAccept;
  }, [onAccept]);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    const mask = maskRef.current;
    if (!mask || value === undefined) return;
    if (mask.value !== value) {
      mask.value = value;
    }
  }, [value]);

  const setRef = useCallback((el: HTMLInputElement | null) => {
    if (!el) {
      maskRef.current?.destroy();
      maskRef.current = null;
      elementRef.current = null;
      return;
    }

    if (elementRef.current === el && maskRef.current) return;

    maskRef.current?.destroy();

    const mask = createPhoneMask(el);
    maskRef.current = mask;
    elementRef.current = el;

    mask.on("accept", () => {
      onAcceptRef.current(mask.value);
    });

    const initial = valueRef.current;
    if (initial !== undefined && mask.value !== initial) {
      mask.value = initial;
    }
  }, []);

  return setRef;
}
