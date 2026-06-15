import { FaMapMarkerAlt } from "react-icons/fa";

export default function MapInfo() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary shrink-0">
        <FaMapMarkerAlt className="w-4 h-4" />
      </div>
      <div>
        <div className="font-semibold text-secondary text-sm">Head Office</div>
        <div className="text-gray-400 text-sm mt-0.5">
          Baku city, Nizami district, C. Mammadguluzade st. 123
        </div>
        <a
          href="https://www.google.com/maps/dir/?api=1&destination=40.4093,49.8671"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-2 hover:underline"
        >
          Get Directions
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
