import { availableIcons, renderSocialIcon } from "@/utils/renderSocialIcon";
import React from "react";

export default function SocialBox() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100">
      <div className="text-sm text-gray-400 font-medium mb-4">
        Follow us on social media
      </div>
      <div className="flex gap-3">
        {availableIcons.map((social, i) => (
          <a
            key={i}
            href={social.value}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex-1 h-12 bg-gray-50 hover:bg-primary rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
          >
            {renderSocialIcon({
              iconName: social.value,
            })}
          </a>
        ))}
      </div>
    </div>
  );
}
