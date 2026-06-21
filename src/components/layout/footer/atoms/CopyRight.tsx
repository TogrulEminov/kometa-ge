export default function CopyRight() {
  const currentYear = new Date().getFullYear();

  return (
    <p className="text-white/40 text-sm font-medium">
      © {currentYear} Kometa GE. Copyright all reserved
    </p>
  );
}
