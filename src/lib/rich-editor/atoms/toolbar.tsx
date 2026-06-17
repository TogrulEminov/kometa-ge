// Tooltip ilə button wrapper
export default function ToolbarButton({
  children,
  onClick,
  isActive,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
  title: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative group">
      <button
        disabled={disabled}
        className={`
                    cursor-pointer w-8 h-8 flex items-center justify-center 
                    rounded-sm transition-all duration-300
                    ${
                      isActive
                        ? "bg-[#dcdcdc] text-black"
                        : "text-black/75 hover:bg-[#dcdcdc]"
                    }
                `}
        type="button"
        onClick={onClick}
      >
        {children}
      </button>

      {/* Tooltip - üstünə gələndə görsənəcək */}
      <span
        className="
                absolute -top-8 left-1/2 -translate-x-1/2
                bg-gray-800 text-white text-xs px-2 py-1 rounded
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                pointer-events-none
                whitespace-nowrap
                z-50
            "
      >
        {title}
      </span>
    </div>
  );
}
