"use client";
import Link from "next/link";
import { LuPencil } from "react-icons/lu";

interface Props {
  link?: string;
}

const UptadeButton = ({ link }: Props) => {
  if (!link) return null;
  return (
    <Link
      href={link}
      className="flex items-center gap-2 px-4 py-2 bg-blue-300 text-blue-600 rounded-lg text-sm font-medium  transition-colors cursor-pointer"
    >
      <LuPencil className="w-4 h-4" />
      Edit
    </Link>
  );
};

export default UptadeButton;
