import { JsonItem, NewInfoJson } from "@/app/(dashboard)/_type/global.type";
import { parseJSON } from "@/utils/parseJson";

/*
 * ─── findJsonSection istifadə bələdçisi ────────────────────────────────────
 *
 * JSON strukturu (admin paneldən yığılan data):
 *
 * [
 *   {
 *     type: "main",
 *     title: "Giriş",
 *     description: "<p>...</p>",
 *     subTitle: "01 / Giriş",           // extraMainFields (passthrough)
 *     items: [],
 *   },
 *   {
 *     type: "faq",
 *     title: "FAQ",
 *     description: "...",
 *     items: [
 *       { itemTitle: "Sual?", itemDescription: "Cavab" },
 *     ],
 *   },
 *   {
 *     type: "statistics",
 *     title: "",
 *     items: [
 *       { itemTitle: "Müştəri", itemValue: "500", itemSuffix: "+" },
 *     ],
 *   },
 * ]
 *
 * ─── Input formatları ────────────────────────────────────────────────────────
 * findJsonSection eyni inputları parseJSON kimi qəbul edir:
 *   - NewInfoJson[]           → birbaşa array
 *   - string (JSON)           → DB-dən gələn serialized data
 *   - null / undefined        → undefined qaytarır
 *
 * ─── 1. Bütün bölməni tap ────────────────────────────────────────────────────
 *
 * const faq = findJsonSection(description, "faq");
 * // → { type: "faq", title: "...", description: "...", items: [...] }
 *
 * faq?.title
 * faq?.description
 * faq?.items
 *
 * ─── 2. Bölmədən konkret sahə (extraMainFields) ─────────────────────────────
 *
 * const subTitle = findJsonSection(description, "main", { field: "subTitle" });
 * // → "01 / Giriş"
 *
 * const items = findJsonSection<JsonItem[]>(description, "faq", { field: "items" });
 * // → [{ itemTitle: "...", itemDescription: "..." }]
 *
 * ─── 3. Item-i itemKey ilə tap ───────────────────────────────────────────────
 *
 * const mission = findJsonSection(description, "strategicGoals", {
 *   itemKey: "mission",
 * });
 * // → { itemKey: "mission", itemTitle: "...", itemDescription: "..." }
 *
 * mission?.itemTitle
 * mission?.itemDescription
 *
 * ─── 4. Item-i index ilə tap ─────────────────────────────────────────────────
 *
 * const firstStat = findJsonSection(description, "statistics", { itemIndex: 0 });
 * // → { itemTitle: "Müştəri", itemValue: "500", itemSuffix: "+" }
 *
 * ─── 5. Item-dən konkret sahə (extraItemFields) ─────────────────────────────
 *
 * const value = findJsonSection<string>(description, "statistics", {
 *   itemIndex: 0,
 *   itemField: "itemValue",
 * });
 * // → "500"
 *
 * const suffix = findJsonSection<string>(description, "statistics", {
 *   itemIndex: 0,
 *   itemField: "itemSuffix",
 * });
 * // → "+"
 *
 * const badge = findJsonSection<string>(description, "activity", {
 *   itemIndex: 0,
 *   itemField: "badge",
 * });
 *
 * ─── 6. DB/API-dən gələn data ilə ───────────────────────────────────────────
 *
 * const translation = aboutData?.translations?.[0];
 * const main = findJsonSection(translation?.description, "main");
 * const benefits = findJsonSection(translation?.description, "benefits");
 * const services = findJsonSection(translation?.description, "services");
 *
 * ─── 7. findJsonSections — eyni tipdən bir neçə (nadir) ─────────────────────
 *
 * const allFaq = findJsonSections(description, "faq");
 * // → NewInfoJson[]
 *
 * ─── Generic tip ─────────────────────────────────────────────────────────────
 * Default: NewInfoJson
 * field / itemField qaytaran hallarda generic ver:
 *   findJsonSection<string>(..., { field: "subTitle" })
 *   findJsonSection<JsonItem[]>(..., { field: "items" })
 *
 * ─── parseJSON ilə birlikdə ──────────────────────────────────────────────────
 * findJsonSection daxildə parseJSON istifadə edir, ayrıca parse etməyə ehtiyac yoxdur:
 *
 * // Lazım deyil:
 * parseJSON(description).data.find((s) => s.type === "faq")
 *
 * // Kifayətdir:
 * findJsonSection(description, "faq")
 */

export type FindJsonSectionOptions = {
  /** Bölmə səviyyəsində sahə (extraMainFields, subTitle və s.) */
  field?: string;
  /** items içində itemKey ilə axtarış */
  itemKey?: string;
  /** items içində index ilə axtarış */
  itemIndex?: number;
  /** item səviyyəsində sahə (extraItemFields, itemValue və s.) */
  itemField?: string;
};

export function findJsonSection<T = NewInfoJson>(
  input: unknown,
  type: string,
  options?: FindJsonSectionOptions,
): T | undefined {
  const sections = parseJSON<NewInfoJson>(input).data;
  const section = sections.find((entry) => entry.type === type);

  if (!section) return undefined;

  if (!options) {
    return section as T;
  }

  if (options.field) {
    return (section as Record<string, unknown>)[options.field] as T | undefined;
  }

  const item = getJsonItem(section, options);

  if (!item) return undefined;

  if (options.itemField) {
    return (item as Record<string, unknown>)[options.itemField] as T | undefined;
  }

  return item as T;
}

export function findJsonSections(
  input: unknown,
  type: string,
): NewInfoJson[] {
  return parseJSON<NewInfoJson>(input).data.filter(
    (entry) => entry.type === type,
  );
}

function getJsonItem(
  section: NewInfoJson,
  options: FindJsonSectionOptions,
): JsonItem | undefined {
  if (options.itemKey !== undefined) {
    return section.items?.find(
      (entry) =>
        (entry as Record<string, unknown>).itemKey === options.itemKey,
    );
  }

  if (options.itemIndex !== undefined) {
    return section.items?.[options.itemIndex];
  }

  return undefined;
}
