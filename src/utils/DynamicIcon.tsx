"use client";

import { useMemo } from "react";
import { MdOutlineQuestionMark } from "react-icons/md";
import { resolveIconComponent } from "@/utils/iconRegistry";

interface DynamicIconProps {
  iconName: string | null | undefined;
  className?: string;
  size?: number;
}

export const DynamicIcon = ({
  iconName,
  className,
  size,
}: DynamicIconProps) => {
  const IconComponent = useMemo(
    () => resolveIconComponent(iconName),
    [iconName],
  );

  if (!IconComponent) {
    return (
      <MdOutlineQuestionMark className={className} size={size} aria-hidden />
    );
  }

  return <IconComponent className={className} size={size} aria-hidden />;
};
