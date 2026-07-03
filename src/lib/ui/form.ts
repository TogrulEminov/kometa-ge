import { cn } from "@/utils/cn";

export const uiFormColors = {
  modalBg: "#141824",
  elevated: "#1a2030",
  text: "#f1f5f9",
  muted: "#94a3b8",
  border: "rgba(255, 255, 255, 0.1)",
} as const;

export const uiFormLabelClassName =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]";

export const uiHeroFormLabelClassName =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-white/80";

export const uiInputClassName = cn(
  "w-full !bg-[#1a2030] !text-[#f1f5f9] !text-sm",
  "!h-12 !rounded-xl !border !border-white/10 !shadow-none",
  "!px-4 !py-3 placeholder:!text-[#94a3b8]",
  "hover:!border-white/20 focus:!border-primary/50",
);

export const uiTextareaClassName = cn(
  "w-full !bg-[#1a2030] !text-[#f1f5f9] !text-sm",
  "!rounded-xl !border !border-white/10 !shadow-none",
  "!px-4 !py-3 placeholder:!text-[#94a3b8] resize-none",
  "hover:!border-white/20 focus:!border-primary/50",
);

export const uiSelectClassNames = {
  root: cn("ui-select-field w-full min-h-12"),
};

export const uiSelectStyles = {
  root: {
    backgroundColor: uiFormColors.elevated,
    color: uiFormColors.text,
    borderColor: uiFormColors.border,
    borderRadius: 12,
    minHeight: 48,
  },
};

export const uiInputStyles = {
  root: {
    backgroundColor: uiFormColors.elevated,
    borderColor: uiFormColors.border,
    borderRadius: 12,
    color: uiFormColors.text,
  },
  input: {
    backgroundColor: uiFormColors.elevated,
    color: uiFormColors.text,
  },
};

export const uiTextareaStyles = {
  textarea: {
    backgroundColor: uiFormColors.elevated,
    color: uiFormColors.text,
  },
};

/** @deprecated Use uiSelectClassNames + uiSelectStyles (Ant Design v6) */
export const uiSelectClassName = uiSelectClassNames.root;

export const uiSelectPopupClassName = "ui-select-dropdown";

export const uiBorderlessSelectClassNames = {
  root: "ui-borderless-select w-full min-h-12",
};

export const uiBorderlessSelectStyles = {
  root: {
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255, 255, 255, 0.45)",
    borderRadius: 0,
    color: "#f1f5f9",
    boxShadow: "none",
    minHeight: 48,
  },
  placeholder: {
    color: "rgba(255, 255, 255, 0.5)",
  },
};

export const uiModalClassName = cn(
  "[&_.ant-modal-container]:!bg-[#141824]",
  "[&_.ant-modal-container]:!border [&_.ant-modal-container]:!border-white/10",
  "[&_.ant-modal-container]:!shadow-[0_24px_80px_rgba(0,0,0,0.45)]",
  "[&_.ant-modal-container]:!rounded-2xl",
  "[&_.ant-modal-header]:!bg-transparent [&_.ant-modal-header]:!border-b-0",
  "[&_.ant-modal-body]:!bg-transparent [&_.ant-modal-body]:!p-0",
  "[&_.ant-modal-close]:!text-[#94a3b8] [&_.ant-modal-close:hover]:!text-[#f1f5f9]",
);

export const uiModalClassNames = {
  container: cn(
    "!bg-[#141824] !border !border-white/10 !rounded-2xl",
    "!shadow-[0_24px_80px_rgba(0,0,0,0.45)]",
  ),
  body: "!p-6 !bg-[#141824]",
  close: "!text-[#94a3b8] hover:!text-[#f1f5f9]",
};

export const uiModalStyles = {
  container: {
    backgroundColor: "#141824",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16,
    boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
  },
  body: {
    padding: 24,
    backgroundColor: "#141824",
    color: "#f1f5f9",
  },
};

export const uiSubmitButtonClassName = cn(
  "!h-12 !font-bold !uppercase !tracking-wider !rounded-xl",
  "!bg-primary hover:!bg-primary/90 !border-none !shadow-none",
);
