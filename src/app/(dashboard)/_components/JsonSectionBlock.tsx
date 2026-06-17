"use client";

import { useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

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

interface ExtraItemField {
  fieldKey: string;
  label: string;
  placeholder?: string;
  type?: "input" | "textarea" | "richEditor";
  icon?: React.ReactNode;
}

interface TypeConfig {
  showSectionDescription?: boolean;
  richSectionDescription?: boolean;
  showItemDescription?: boolean;
  richItemDescription?: boolean;
  showItems?: boolean;
  itemKeyOptions?: { value: string; label: string }[];
  extraItemFields?: ExtraItemField[];
}

interface JsonSectionBlockProps {
  fieldName: string;
  sectionIndex: number;
  onRemove: () => void;
  typeOptions?: { value: string; label: string }[];
  typeConfig?: Record<string, TypeConfig>;
  defaultConfig?: TypeConfig;
  limit?: number;
}

const DEFAULT_CONFIG: TypeConfig = {
  showSectionDescription: true,
  richSectionDescription: true,
  showItemDescription: true,
  richItemDescription: false,
  showItems: true,
  itemKeyOptions: [],
  extraItemFields: [],
};

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

export default function JsonSectionBlock({
  fieldName,
  sectionIndex,
  onRemove,
  typeOptions = [],
  typeConfig = {},
  defaultConfig,
  limit = 10,
}: JsonSectionBlockProps) {
  const { control } = useFormContext();
  const [isExpanded, setIsExpanded] = useState(true);

  const basePath = `${fieldName}.${sectionIndex}`;
  const itemsArray = useFieldArray({ control, name: `${basePath}.items` });
  const dataTitle = useWatch({ control, name: `${basePath}.title` });
  const dataType = useWatch({ control, name: `${basePath}.type` });

  const activeConfig: TypeConfig = {
    ...DEFAULT_CONFIG,
    ...(defaultConfig ?? {}),
    ...(dataType && typeConfig[dataType] ? typeConfig[dataType] : {}),
  };

  const {
    showSectionDescription,
    richSectionDescription,
    showItemDescription,
    richItemDescription,
    showItems,
    itemKeyOptions = [],
    extraItemFields = [],
  } = activeConfig;

  const buildEmptyItem = () => {
    const base: Record<string, string> = { itemTitle: "", itemDescription: "" };
    extraItemFields.forEach((f) => {
      base[f.fieldKey] = "";
    });
    return base;
  };

  return (
    <div className="rounded-2xl border border-blue-100 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 bg-linear-to-r from-blue-600 to-blue-500 border-b border-blue-700/20">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center size-8 rounded-lg bg-white/20 text-white text-sm font-bold border border-white/25">
            {sectionIndex + 1}
          </span>
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold text-white">
              {dataTitle || "Başlıqsız bölmə"}
            </span>
            {dataType && (
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold border border-white/25">
                {typeOptions.find((o) => o.value === dataType)?.label ??
                  dataType}
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

      {/* BODY */}
      {isExpanded && (
        <div className="p-5 space-y-5">
          {/* Title + Type */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            {typeOptions.length > 0 && (
              <div>
                <FieldLabel
                  icon={<BsLayers className="w-3.5 h-3.5" />}
                  label="Tip"
                />
                <FormSelect
                  fieldName={`${basePath}.type`}
                  options={typeOptions}
                />
              </div>
            )}
          </div>

          {/* Section Description */}
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

          {/* Items */}
          {showItems && (
            <div className="space-y-4">
              {/* items header bar */}
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

              {/* item list */}
              <div className="space-y-3">
                {itemsArray.fields.map((field, itemIndex) => (
                  <div
                    key={field.id}
                    className="group/item rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                  >
                    {/* item header */}
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

                    {/* item body */}
                    <div className="p-4 space-y-3">
                      {/* itemTitle — həmişə göstərilir */}
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

                      {/* itemDescription */}
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

                      {/* ── EXTRA FIELDS ── */}
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

                      {/* itemKey */}
                      {itemKeyOptions.length > 0 && (
                        <div>
                          <FieldLabel
                            icon={<BiKey className="w-3 h-3" />}
                            label="Açar"
                          />
                          <FormSelect
                            fieldName={`${basePath}.items.${itemIndex}.itemKey`}
                            options={itemKeyOptions}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* add item */}
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
