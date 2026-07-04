"use client";

import { useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

import FormInput from "@/globalElement/form/FormInput";
import FormTextarea from "@/globalElement/form/FormTextarea";
import FormRichEditor from "@/globalElement/form/FormRichEditor";

import {
  BiAlignLeft,
  BiBox,
  BiChevronDown,
  BiChevronUp,
  BiHash,
  BiPlus,
} from "react-icons/bi";
import {
  BsGripVertical,
  BsLayers,
  BsTrash2,
  BsType,
  BsTypeBold,
} from "react-icons/bs";
import { cn } from "@/utils/cn";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ExtraItemField {
  fieldKey: string;
  label: string;
  placeholder?: string;
  type?: "input" | "textarea" | "richEditor";
  icon?: React.ReactNode;
}

interface TypeConfig {
  /** Təsvir göstərilsinmi? Default: true */
  showDescription?: boolean;
  /** Rich editor istifadə edilsinmi? Default: false */
  richDescription?: boolean;
  /** Item siyahısı göstərilsinmi? Default: false */
  showItems?: boolean;
  /** Item-ə əlavə sahələr */
  extraItemFields?: ExtraItemField[];
  /** Item sayı limiti. Default: 10 */
  itemLimit?: number;
}

interface JsonSectionListProps {
  /** useFieldArray-ın bağlandığı form sahəsi (məs. "sections") */
  fieldName: string;
  /** Boş section əlavə edərkən istifadə olunan default dəyərlər */
  defaultValues?: Record<string, unknown>;
  /** Hər blokun göstərmə konfiqurasiyası */
  defaultConfig?: TypeConfig;
  /** Section limiti. Default: 20 */
  sectionLimit?: number;
  /** "Bölmə əlavə et" düyməsinin labeli */
  addLabel?: string;
}

const BASE_CONFIG: Required<TypeConfig> = {
  showDescription: true,
  richDescription: false,
  showItems: false,
  extraItemFields: [],
  itemLimit: 10,
};

// ─── FieldLabel helper ───────────────────────────────────────────────────────

function FieldLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-1">
      <span className="text-blue-400 flex items-center">{icon}</span>
      <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

// ─── JsonSingleBlock (sortable) ──────────────────────────────────────────────

interface JsonSingleBlockProps {
  id: string;
  fieldName: string;
  sectionIndex: number;
  onRemove: () => void;
  defaultConfig?: TypeConfig;
}

function JsonSingleBlock({
  id,
  fieldName,
  sectionIndex,
  onRemove,
  defaultConfig,
}: JsonSingleBlockProps) {
  const { control } = useFormContext();
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const dndStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 50 : undefined,
    position: isDragging ? ("relative" as const) : undefined,
  };

  const basePath = `${fieldName}.${sectionIndex}`;
  const itemsArray = useFieldArray({ control, name: `${basePath}.items` });
  const dataTitle = useWatch({ control, name: `${basePath}.title` });

  const activeConfig: Required<TypeConfig> = {
    ...BASE_CONFIG,
    ...(defaultConfig ?? {}),
  };

  const {
    showDescription,
    richDescription,
    showItems,
    extraItemFields,
    itemLimit,
  } = activeConfig;

  const buildEmptyItem = () => {
    const base: Record<string, string> = { itemTitle: "" };
    extraItemFields.forEach((f) => {
      base[f.fieldKey] = "";
    });
    return base;
  };

  return (
    <div
      ref={setNodeRef}
      style={dndStyle}
      className={cn(
        "rounded-2xl border border-blue-100 bg-white overflow-hidden shadow-sm transition-all duration-300",
        isDragging
          ? "shadow-2xl border-blue-300 ring-2 ring-blue-200"
          : "hover:shadow-md hover:border-blue-200",
      )}
    >
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-500 border-b border-blue-700/20">
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="size-8 flex items-center justify-center rounded-lg bg-white/15 border border-white/25 text-white hover:bg-white/25 transition-all cursor-grab active:cursor-grabbing touch-none"
            tabIndex={-1}
            aria-label="Sürükle"
          >
            <BsGripVertical className="w-4 h-4" />
          </button>

          <span className="flex items-center justify-center size-8 rounded-lg bg-white/20 text-white text-sm font-bold border border-white/25">
            {sectionIndex + 1}
          </span>

          <span className="text-sm font-semibold text-white">
            {dataTitle || "Başlıqsız bölmə"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            className="size-8 flex items-center justify-center rounded-lg bg-white/15 border border-white/25 text-white hover:bg-white/25 transition-all cursor-pointer active:scale-95"
          >
            {isExpanded ? (
              <BiChevronUp className="w-4 h-4" />
            ) : (
              <BiChevronDown className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="size-8 flex items-center justify-center rounded-lg bg-red-500/20 border border-red-300/30 text-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all cursor-pointer active:scale-95"
          >
            <BsTrash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      {isExpanded && (
        <div className="p-5 space-y-5">
          {/* Başlıq */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <FieldLabel
                icon={<BsTypeBold className="w-3.5 h-3.5" />}
                label="Başlıq"
              />
              <FormInput
                placeholder="Bölmə başlığını daxil edin"
                fieldName={`${basePath}.title`}
              />
            </div>
          </div>

          {/* ── Təsvir ── */}
          {showDescription && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 space-y-2">
              <FieldLabel
                icon={<BiAlignLeft className="w-3.5 h-3.5" />}
                label="Təsvir"
              />
              {richDescription ? (
                <FormRichEditor fieldName={`${basePath}.description`} />
              ) : (
                <FormTextarea fieldName={`${basePath}.description`} />
              )}
            </div>
          )}

          {/* ── Items ── */}
          {showItems && (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-center size-7 rounded-lg bg-blue-600">
                  <BiBox className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Elementlər
                </span>
                <span className="ml-auto flex items-center justify-center size-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                  {itemsArray.fields.length}
                </span>
              </div>

              <div className="space-y-3">
                {itemsArray.fields.map((field, itemIndex) => (
                  <div
                    key={field.id}
                    className="group/item rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center size-6 rounded-md bg-slate-200">
                          <BiHash className="w-3 h-3 text-slate-500" />
                        </div>
                        <span className="text-sm font-medium text-slate-600">
                          Element {itemIndex + 1}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => itemsArray.remove(itemIndex)}
                        className="size-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover/item:opacity-100 cursor-pointer"
                      >
                        <BsTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <FieldLabel
                          icon={<BsType className="w-3 h-3" />}
                          label="Başlıq"
                        />
                        <FormInput
                          placeholder="Element başlığı"
                          fieldName={`${basePath}.items.${itemIndex}.itemTitle`}
                        />
                      </div>

                      {extraItemFields.map((extraField) => (
                        <div key={extraField.fieldKey}>
                          <FieldLabel
                            icon={
                              extraField.icon ?? <BsType className="w-3 h-3" />
                            }
                            label={extraField.label}
                          />
                          {extraField.type === "richEditor" ? (
                            <FormRichEditor
                              fieldName={`${basePath}.items.${itemIndex}.${extraField.fieldKey}`}
                            />
                          ) : extraField.type === "textarea" ? (
                            <FormTextarea
                              placeholder={extraField.placeholder ?? ""}
                              fieldName={`${basePath}.items.${itemIndex}.${extraField.fieldKey}`}
                            />
                          ) : (
                            <FormInput
                              placeholder={extraField.placeholder ?? ""}
                              fieldName={`${basePath}.items.${itemIndex}.${extraField.fieldKey}`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {itemsArray.fields.length < itemLimit && (
                <button
                  type="button"
                  onClick={() => itemsArray.append(buildEmptyItem())}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-blue-200 text-blue-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 text-sm font-semibold cursor-pointer group/add"
                >
                  <div className="flex items-center justify-center size-6 rounded-md bg-blue-100 group-hover/add:bg-blue-600 transition-colors duration-200">
                    <BiPlus className="w-3.5 h-3.5 text-blue-500 group-hover/add:text-white transition-colors duration-200" />
                  </div>
                  Element əlavə et
                </button>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all text-sm font-semibold cursor-pointer active:scale-95"
            >
              <BsTrash2 className="w-3.5 h-3.5" />
              Bölməni sil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── JsonSectionList (main export) ──────────────────────────────────────────

export default function JsonSectionList({
  fieldName,
  defaultValues,
  defaultConfig,
  sectionLimit = 20,
  addLabel = "Add section",
}: JsonSectionListProps) {
  const { control } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: fieldName,
  });

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) move(oldIndex, newIndex);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  const buildEmpty = (): Record<string, unknown> => ({
    title: "",
    description: "",
    items: [],
    ...(defaultValues ?? {}),
  });

  const activeIndex = activeId
    ? fields.findIndex((f) => f.id === activeId)
    : -1;

  return (
    <div className="space-y-4">
      {/* Başlıq barı */}
      {fields.length > 0 && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-center size-7 rounded-lg bg-blue-600">
            <BsLayers className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-700">Sections</span>
          <span className="ml-auto flex items-center justify-center size-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
            {fields.length}
          </span>
        </div>
      )}

      {/* DnD kontekst */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {fields.map((field, index) => (
              <JsonSingleBlock
                key={field.id}
                id={field.id}
                fieldName={fieldName}
                sectionIndex={index}
                onRemove={() => remove(index)}
                defaultConfig={defaultConfig}
              />
            ))}
          </div>
        </SortableContext>

        {/* Ghost overlay */}
        <DragOverlay>
          {activeId && activeIndex !== -1 ? (
            <div className="rounded-2xl border-2 border-blue-400 bg-white shadow-2xl opacity-95 ring-4 ring-blue-100">
              <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-t-2xl">
                <span className="flex items-center justify-center size-8 rounded-lg bg-white/20 text-white text-sm font-bold border border-white/25">
                  {activeIndex + 1}
                </span>
                <span className="text-sm font-semibold text-white opacity-80">
                  Sürüklənir...
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Boş hal */}
      {fields.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-12 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-center size-12 rounded-2xl bg-blue-50 border border-blue-100">
            <BsLayers className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-500">
              Hələ bölmə yoxdur
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Aşağıdakı düyməyə basaraq başlayın
            </p>
          </div>
        </div>
      )}

      {/* Əlavə et */}
      {fields.length < sectionLimit && (
        <button
          type="button"
          onClick={() => append(buildEmpty())}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-blue-200 text-blue-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 text-sm font-semibold cursor-pointer group/add"
        >
          <div className="flex items-center justify-center size-6 rounded-md bg-blue-100 group-hover/add:bg-blue-600 transition-colors duration-200">
            <BiPlus className="w-3.5 h-3.5 text-blue-500 group-hover/add:text-white transition-colors duration-200" />
          </div>
          {addLabel}
        </button>
      )}
    </div>
  );
}

// ─── Usage example ───────────────────────────────────────────────────────────
//
// <JsonSectionList
//   fieldName="sections"
//   defaultConfig={{
//     showDescription: true,
//     richDescription: true,
//     showItems: true,
//     itemLimit: 6,
//     extraItemFields: [
//       {
//         fieldKey: "itemValue",
//         label: "Dəyər",
//         placeholder: "məs. 500+",
//         type: "input",
//       },
//     ],
//   }}
//   addLabel="Bölmə əlavə et"
//   sectionLimit={10}
// />
