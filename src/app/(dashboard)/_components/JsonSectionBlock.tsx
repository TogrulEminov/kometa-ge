"use client";

import React, { useMemo, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import FormInput from "@/globalElement/form/FormInput";
import FormSelect from "@/globalElement/form/FormSelect";
import FormTextarea from "@/globalElement/form/FormTextarea";
import FormRichEditor from "@/globalElement/form/FormRichEditor";
import {
  BiAlignLeft,
  BiBox,
  BiChevronDown,
  BiChevronUp,
  BiHash,
  BiKey,
  BiPlus,
} from "react-icons/bi";
import { BsLayers, BsTrash2, BsType, BsTypeBold } from "react-icons/bs";
import { LuGripVertical } from "react-icons/lu";
import { cn } from "@/utils/cn";

export interface ExtraField {
  fieldKey: string;
  label: string;
  placeholder?: string;
  type?: "input" | "textarea" | "richEditor";
  icon?: React.ReactNode;
}

export type ExtraItemField = ExtraField;

export interface TypeConfig {
  showSectionTitle?: boolean;
  showSectionDescription?: boolean;
  richSectionDescription?: boolean;
  showItemDescription?: boolean;
  richItemDescription?: boolean;
  showItems?: boolean;
  itemKeyOptions?: { value: string; label: string }[];
  extraMainFields?: ExtraField[];
  extraItemFields?: ExtraField[];
}

interface JsonSectionBlockProps {
  fieldName: string;
  sectionIndex: number;
  onRemove: () => void;
  typeOptions?: { value: string; label: string }[];
  typeConfig?: Record<string, TypeConfig>;
  defaultConfig?: TypeConfig;
  limit?: number;
  sectionSortId?: string;
  sortableItems?: boolean;
}

export interface JsonSectionListProps {
  fieldName: string;
  typeOptions?: { value: string; label: string }[];
  typeConfig?: Record<string, TypeConfig>;
  defaultConfig?: TypeConfig;
  limit?: number;
  maxSections?: number;
  sortableSections?: boolean;
  sortableItems?: boolean;
  addButtonLabel?: string;
}

const DEFAULT_CONFIG: TypeConfig = {
  showSectionTitle: true,
  showSectionDescription: true,
  richSectionDescription: true,
  showItemDescription: true,
  richItemDescription: false,
  showItems: true,
  itemKeyOptions: [],
  extraMainFields: [],
  extraItemFields: [],
};

interface SortHandleContextValue {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: ReturnType<typeof useSortable>["listeners"];
  attributes?: ReturnType<typeof useSortable>["attributes"];
}

const SortHandleContext = React.createContext<SortHandleContextValue>({});

function useSortSensors() {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    }),
  );
}

function DragHandle({
  className,
  label = "Sürüşdür",
}: {
  className?: string;
  label?: string;
}) {
  const { listeners, attributes, setActivatorNodeRef } =
    React.useContext(SortHandleContext);

  return (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...listeners}
      {...attributes}
      aria-label={label}
      className={cn(
        "inline-flex size-8 cursor-grab items-center justify-center rounded-lg border transition-all active:cursor-grabbing",
        className,
      )}
    >
      <LuGripVertical className="h-4 w-4" />
    </button>
  );
}

function SortableShell({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    // ✅ translate3d — GPU-da işləyir, scale yoxdur
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: isDragging ? "none" : transition, // ✅ drag zamanı transition-u sıfırla
    willChange: "transform", // ✅ GPU layer hint
    ...(isDragging ? { position: "relative", zIndex: 10 } : {}),
  };

  return (
    <SortHandleContext.Provider
      value={{ setActivatorNodeRef, listeners, attributes }}
    >
      <div
        ref={setNodeRef}
        style={style}
        className={cn(className, isDragging && "opacity-95 shadow-lg")}
      >
        {children}
      </div>
    </SortHandleContext.Provider>
  );
}

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

function renderExtraField(extraField: ExtraField, fieldPath: string) {
  return (
    <div key={extraField.fieldKey}>
      <FieldLabel
        icon={extraField.icon ?? <BsType className="w-3 h-3" />}
        label={extraField.label}
      />
      {extraField.type === "richEditor" ? (
        <FormRichEditor fieldName={fieldPath} />
      ) : extraField.type === "textarea" ? (
        <FormTextarea
          placeholder={extraField.placeholder ?? ""}
          fieldName={fieldPath}
        />
      ) : (
        <FormInput
          placeholder={extraField.placeholder ?? ""}
          fieldName={fieldPath}
        />
      )}
    </div>
  );
}

interface SortableItemCardProps {
  sortId: string;
  itemIndex: number;
  basePath: string;
  onRemove: () => void;
  showItemDescription: boolean;
  richItemDescription: boolean;
  extraItemFields: ExtraField[];
  itemKeyOptions: { value: string; label: string }[];
  sortable: boolean;
}

function SortableItemCard({
  sortId,
  itemIndex,
  basePath,
  onRemove,
  showItemDescription,
  richItemDescription,
  extraItemFields,
  itemKeyOptions,
  sortable,
}: SortableItemCardProps) {
  const content = (
    <>
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          {sortable && (
            <DragHandle
              label="Elementi sürüşdür"
              className="border-slate-200 bg-white text-slate-400 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            />
          )}
          <div className="flex items-center justify-center size-6 rounded-md bg-slate-200">
            <BiHash className="w-3 h-3 text-slate-500" />
          </div>
          <span className="text-sm font-medium text-slate-600">
            Element {itemIndex + 1}
          </span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="size-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover/item:opacity-100 cursor-pointer"
        >
          <BsTrash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <FieldLabel icon={<BsType className="w-3 h-3" />} label="Başlıq" />
          <FormInput
            placeholder="Element başlığı"
            fieldName={`${basePath}.items.${itemIndex}.itemTitle`}
          />
        </div>

        {showItemDescription && (
          <div>
            <FieldLabel
              icon={<BiAlignLeft className="w-3 h-3" />}
              label="Təsvir"
            />
            {richItemDescription ? (
              <FormRichEditor
                fieldName={`${basePath}.items.${itemIndex}.itemDescription`}
              />
            ) : (
              <FormTextarea
                fieldName={`${basePath}.items.${itemIndex}.itemDescription`}
              />
            )}
          </div>
        )}

        {extraItemFields.map((extraField) =>
          renderExtraField(
            extraField,
            `${basePath}.items.${itemIndex}.${extraField.fieldKey}`,
          ),
        )}

        {itemKeyOptions.length > 0 && (
          <div>
            <FieldLabel icon={<BiKey className="w-3 h-3" />} label="Açar" />
            <FormSelect
              fieldName={`${basePath}.items.${itemIndex}.itemKey`}
              options={itemKeyOptions}
            />
          </div>
        )}
      </div>
    </>
  );

  if (!sortable) {
    return (
      <div className="group/item rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-blue-200 hover:shadow-sm transition-all duration-200">
        {content}
      </div>
    );
  }

  return (
    <SortableShell
      id={sortId}
      className="group/item rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-blue-200 hover:shadow-sm transition-all duration-200"
    >
      {content}
    </SortableShell>
  );
}

export default function JsonSectionBlock({
  fieldName,
  sectionIndex,
  onRemove,
  typeOptions = [],
  typeConfig = {},
  defaultConfig,
  limit = 10,
  sectionSortId,
  sortableItems = true,
}: JsonSectionBlockProps) {
  const { control } = useFormContext();
  const [isExpanded, setIsExpanded] = useState(true);
  const itemSensors = useSortSensors();

  const basePath = `${fieldName}.${sectionIndex}`;
  const itemsArray = useFieldArray({ control, name: `${basePath}.items` });
  const dataTitle = useWatch({ control, name: `${basePath}.title` });
  const dataType = useWatch({ control, name: `${basePath}.type` });
  const allSections = useWatch({ control, name: fieldName }) as
    | Array<{ type?: string }>
    | undefined;

  const usedTypesByOthers = (allSections ?? [])
    .filter((_, index) => index !== sectionIndex)
    .map((section) => section?.type)
    .filter(Boolean);

  const availableTypeOptions = typeOptions.filter(
    (option) =>
      option.value === dataType || !usedTypesByOthers.includes(option.value),
  );

  const activeConfig: TypeConfig = {
    ...DEFAULT_CONFIG,
    ...(defaultConfig ?? {}),
    ...(dataType && typeConfig[dataType] ? typeConfig[dataType] : {}),
  };

  const {
    showSectionTitle,
    showSectionDescription,
    richSectionDescription,
    showItemDescription,
    richItemDescription,
    showItems,
    itemKeyOptions = [],
    extraMainFields = [],
    extraItemFields = [],
  } = activeConfig;

  const buildEmptyItem = () => {
    const base: Record<string, string> = {
      itemTitle: "",
      itemDescription: "",
    };
    extraItemFields.forEach((f) => {
      base[f.fieldKey] = "";
    });
    return base;
  };

  const typeLabel = typeOptions.find((o) => o.value === dataType)?.label;
  const showTitleCol = showSectionTitle !== false;
  const showTypeCol = typeOptions.length > 0;
  const gridCols =
    showTitleCol && showTypeCol ? "lg:grid-cols-2" : "grid-cols-1";
  const canSortItems = Boolean(
    sortableItems && showItems !== false && itemsArray.fields.length > 1,
  );

  const onItemDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = itemsArray.fields.findIndex(
      (field) => field.id === active.id,
    );
    const newIndex = itemsArray.fields.findIndex(
      (field) => field.id === over.id,
    );

    if (oldIndex < 0 || newIndex < 0) return;
    itemsArray.move(oldIndex, newIndex);
  };

  const renderItemsList = () => {
    const itemCards = itemsArray.fields.map((field, itemIndex) => (
      <SortableItemCard
        key={field.id}
        sortId={field.id}
        itemIndex={itemIndex}
        basePath={basePath}
        onRemove={() => itemsArray.remove(itemIndex)}
        showItemDescription={showItemDescription !== false}
        richItemDescription={richItemDescription === true}
        extraItemFields={extraItemFields}
        itemKeyOptions={itemKeyOptions}
        sortable={canSortItems}
      />
    ));

    if (!canSortItems) {
      return <div className="space-y-3">{itemCards}</div>;
    }

    return (
      <DndContext
        sensors={itemSensors}
        collisionDetection={closestCenter}
        onDragEnd={onItemDragEnd}
      >
        <SortableContext
          items={itemsArray.fields.map((field) => field.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">{itemCards}</div>
        </SortableContext>
      </DndContext>
    );
  };

  const blockContent = (
    <div className="rounded-2xl border border-blue-100 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
      <div className="flex items-center justify-between px-5 py-4 bg-linear-to-r from-blue-600 to-blue-500 border-b border-blue-700/20">
        <div className="flex items-center gap-3">
          {sectionSortId && (
            <DragHandle
              label="Bölməni sürüşdür"
              className="border-white/25 bg-white/15 text-white hover:border-white/40 hover:bg-white/25"
            />
          )}
          <span className="flex items-center justify-center size-8 rounded-lg bg-white/20 text-white text-sm font-bold border border-white/25">
            {sectionIndex + 1}
          </span>
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold text-white">
              {dataTitle || "Başlıqsız bölmə"}
            </span>
            {typeLabel && (
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold border border-white/25">
                {typeLabel}
              </span>
            )}
          </div>
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

      {isExpanded && (
        <div className="p-5 space-y-5">
          {(showTitleCol || showTypeCol) && (
            <div className={cn("grid grid-cols-1 gap-4", gridCols)}>
              {showTitleCol && (
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
              )}
              {showTypeCol && (
                <div>
                  <FieldLabel
                    icon={<BsLayers className="w-3.5 h-3.5" />}
                    label="Tip"
                  />
                  <FormSelect
                    fieldName={`${basePath}.type`}
                    options={availableTypeOptions}
                  />
                </div>
              )}
            </div>
          )}

          {showSectionDescription && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 space-y-2">
              <FieldLabel
                icon={<BiAlignLeft className="w-3.5 h-3.5" />}
                label="Bölmə təsviri"
              />
              {richSectionDescription ? (
                <FormRichEditor fieldName={`${basePath}.description`} />
              ) : (
                <FormTextarea fieldName={`${basePath}.description`} />
              )}
            </div>
          )}

          {extraMainFields.length > 0 && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 space-y-3">
              {extraMainFields.map((extraField) =>
                renderExtraField(
                  extraField,
                  `${basePath}.${extraField.fieldKey}`,
                ),
              )}
            </div>
          )}

          {showItems && (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-center size-7 rounded-lg bg-blue-600">
                  <BiBox className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Elementlər
                </span>
                {canSortItems && (
                  <span className="text-xs text-slate-400">
                    Sürüşdürərək sırala
                  </span>
                )}
                <span className="ml-auto flex items-center justify-center size-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                  {itemsArray.fields.length}
                </span>
              </div>

              {renderItemsList()}

              {itemsArray.fields.length < limit && (
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

  if (!sectionSortId) {
    return blockContent;
  }

  return <SortableShell id={sectionSortId}>{blockContent}</SortableShell>;
}

export function JsonSectionList({
  fieldName,
  typeOptions,
  typeConfig,
  defaultConfig,
  limit,
  maxSections,
  sortableSections = true,
  sortableItems = true,
  addButtonLabel = "Add New Section",
}: JsonSectionListProps) {
  const { control } = useFormContext();
  const sectionSensors = useSortSensors();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: fieldName,
  });

  const watchedSections = useWatch({ control, name: fieldName }) as
    | Array<{ type?: string }>
    | undefined;

  const usedTypes = useMemo(
    () =>
      watchedSections?.map((section) => section?.type).filter(Boolean) ?? [],
    [watchedSections],
  );

  const availableTypes = useMemo(
    () =>
      typeOptions?.filter((option) => !usedTypes.includes(option.value)) ?? [],
    [typeOptions, usedTypes],
  );

  const canAddSection = useMemo(() => {
    if (maxSections && fields.length >= maxSections) return false;
    if (typeOptions?.length) return availableTypes.length > 0;
    return true;
  }, [availableTypes.length, fields.length, maxSections, typeOptions?.length]);

  const onSectionDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((field) => field.id === active.id);
    const newIndex = fields.findIndex((field) => field.id === over.id);

    if (oldIndex < 0 || newIndex < 0) return;
    move(oldIndex, newIndex);
  };

  const sectionBlocks = fields.map((field, index) => (
    <JsonSectionBlock
      key={field.id}
      fieldName={fieldName}
      sectionIndex={index}
      sectionSortId={
        sortableSections && fields.length > 1 ? field.id : undefined
      }
      onRemove={() => remove(index)}
      typeOptions={typeOptions}
      typeConfig={typeConfig}
      defaultConfig={defaultConfig}
      limit={limit}
      sortableItems={sortableItems}
    />
  ));

  const addButton = canAddSection ? (
    <button
      type="button"
      onClick={() =>
        append({
          title: "",
          description: "",
          items: [],
          type: availableTypes[0]?.value ?? "",
        })
      }
      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500 text-white cursor-pointer hover:bg-blue-600 transition-all text-sm font-semibold"
    >
      <BiPlus className="w-4 h-4" />
      {addButtonLabel}
    </button>
  ) : null;

  if (!sortableSections || fields.length < 2) {
    return (
      <div className="space-y-4">
        {sectionBlocks}
        {addButton}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sectionSensors}
        collisionDetection={closestCenter}
        onDragEnd={onSectionDragEnd}
      >
        <SortableContext
          items={fields.map((field) => field.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">{sectionBlocks}</div>
        </SortableContext>
      </DndContext>
      {addButton}
    </div>
  );
}

/*
 * ─── JsonSectionBlock / JsonSectionList istifadə ───────────────────────────
 *
 * Tövsiyə olunan (section + item sort avtomatik):
 *
 * <JsonSectionList
 *   fieldName="description"
 *   typeOptions={[...SECTION_TYPE_OPTIONS]}
 *   typeConfig={SECTION_TYPE_CONFIG}
 *   maxSections={6}                 // optional
 *   sortableSections={true}         // default: true — bölmələri sürüşdür
 *   sortableItems={true}            // default: true — item-ləri sürüşdür
 * />
 *
 * Manual istifadə (yalnız item sort):
 *
 * {fields.map((field, index) => (
 *   <JsonSectionBlock
 *     key={field.id}
 *     fieldName="description"
 *     sectionIndex={index}
 *     sectionSortId={field.id}       // section sort üçün SortableContext lazımdır
 *     onRemove={() => remove(index)}
 *     sortableItems={true}
 *   />
 * ))}
 *
 * Sıralama react-hook-form move() ilə index-ə görə yenilənir.
 */
