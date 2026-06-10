import { sanitizeHtml } from "@/lib/domburify";
import { cn } from "@/utils/cn";
import { highlightActiveWord } from "@/utils/highlight";
import { JSX } from "react";
type HeadingTag = "strong" | "h2" | "h3" | "h4" | "h5" | "h6";

interface Props {
  title: string;
  description?: string | null | undefined;
  type: "vertical" | "horizontal";
  subTitle?: string | null | undefined;
  highlightWord?: string | null | undefined;
  className?: string;
  rootClass?: string;
  heading?: HeadingTag;
  headingId?: string;
}

export default function SectionContentComponent({
  subTitle,
  title,
  className,
  description,
  type,
  rootClass,
  highlightWord,
  heading = "strong",
  headingId,
}: Props) {
  const Tag = heading as keyof JSX.IntrinsicElements;

  const headingClass = cn(
    "font-bold text-secondary block leading-tight",
    heading === "strong" && "block",
    "text-2xl xl:text-4xl",
  );
  const content = highlightWord
    ? highlightActiveWord({
        activeWordClassName: `text-primary ${className ?? ""}`,
        activeWord: highlightWord,
        text: title,
      })
    : title;

  const isHeading = heading !== "strong";
  return (
    <div
      className={cn(
        type === "vertical"
          ? "flex-col"
          : "flex-col lg:flex-row lg:items-end lg:justify-between",
        rootClass,
        "flex   space-y-2 mb-6 xl:mb-10",
      )}
    >
      <div className="flex flex-col space-y-2">
        {subTitle && (
          <div className={"flex items-center w-fit  px-5 py-2 rounded-full bg-primary gap-2"}>
            <span className="text-white font-semibold text-sm tracking-wide">
              {subTitle}
            </span>
          </div>
        )}
        <Tag
          id={headingId}
          className={headingClass}
          {...(isHeading ? { title } : {})}
        >
          {content}
        </Tag>
      </div>
      {description && (
        <article
          className="text-gray-500 max-w-2xl text-base xl:text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
        />
      )}
    </div>
  );
}
