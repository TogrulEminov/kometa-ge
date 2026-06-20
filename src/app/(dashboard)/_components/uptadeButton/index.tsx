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
      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-100"
    >
      <LuPencil className="h-4 w-4" />
      Edit
    </Link>
  );
};

export default UptadeButton;
