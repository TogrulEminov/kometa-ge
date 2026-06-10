import React from "react";
import imageColor from "@public/assets/logo-colorfull.svg";
import imageLogo from "@public/assets/logo-white.svg";
import imageRedLogo from "@public/assets/logo-red-white.svg";
import { Link } from "@/i18n/navigation";
import CustomImage from "@/globalElement/CustomImage";
interface Props {
  className?: string;
  isWhite?: boolean;
  isRedWhite?: boolean;
}
export default function Logo({
  className,
  isWhite = true,
  isRedWhite = false,
}: Props) {
  let logoImage = "";

  if (isRedWhite) {
    logoImage = imageRedLogo;
  } else if (isWhite) {
    logoImage = imageLogo;
  } else {
    logoImage = imageColor;
  }
  return (
    <Link href={"/"} className={`${className} w-fit`}>
      <CustomImage
        width={150}
        height={60}
        key={"logo"}
        src={logoImage}
        title={"Logo"}
        className={"object-contain  w-50 h-full"}
      />
    </Link>
  );
}
