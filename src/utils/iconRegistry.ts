import type { IconType } from "react-icons";
import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";
import * as BsIcons from "react-icons/bs";
import * as CgIcons from "react-icons/cg";
import * as CiIcons from "react-icons/ci";
import * as DiIcons from "react-icons/di";
import * as FaIcons from "react-icons/fa";
import * as Fa6Icons from "react-icons/fa6";
import * as FcIcons from "react-icons/fc";
import * as FiIcons from "react-icons/fi";
import * as GiIcons from "react-icons/gi";
import * as GoIcons from "react-icons/go";
import * as GrIcons from "react-icons/gr";
import * as HiIcons from "react-icons/hi";
import * as Hi2Icons from "react-icons/hi2";
import * as ImIcons from "react-icons/im";
import * as IoIcons from "react-icons/io";
import * as Io5Icons from "react-icons/io5";
import * as LiaIcons from "react-icons/lia";
import * as LuIcons from "react-icons/lu";
import * as MdIcons from "react-icons/md";
import * as PiIcons from "react-icons/pi";
import * as RiIcons from "react-icons/ri";
import * as RxIcons from "react-icons/rx";
import * as SiIcons from "react-icons/si";
import * as SlIcons from "react-icons/sl";
import * as TbIcons from "react-icons/tb";
import * as TfiIcons from "react-icons/tfi";
import * as TiIcons from "react-icons/ti";
import * as VscIcons from "react-icons/vsc";
import * as WiIcons from "react-icons/wi";

type IconLibrary = Record<string, IconType>;

/**
 * Icon prefix → kitabxana(lar).
 * Eyni prefix bir neçə paketdə ola bilər (Hi, Fa, Io) — sıra vacibdir.
 */
const PREFIX_LIBRARIES: Record<string, IconLibrary[]> = {
  Ai: [AiIcons as IconLibrary],
  Bi: [BiIcons as IconLibrary],
  Bs: [BsIcons as IconLibrary],
  Cg: [CgIcons as IconLibrary],
  Ci: [CiIcons as IconLibrary],
  Di: [DiIcons as IconLibrary],
  Fa: [Fa6Icons as IconLibrary, FaIcons as IconLibrary],
  Fc: [FcIcons as IconLibrary],
  Fi: [FiIcons as IconLibrary],
  Gi: [GiIcons as IconLibrary],
  Go: [GoIcons as IconLibrary],
  Gr: [GrIcons as IconLibrary],
  Hi: [Hi2Icons as IconLibrary, HiIcons as IconLibrary],
  Im: [ImIcons as IconLibrary],
  Io: [Io5Icons as IconLibrary, IoIcons as IconLibrary],
  Lia: [LiaIcons as IconLibrary],
  Lu: [LuIcons as IconLibrary],
  Md: [MdIcons as IconLibrary],
  Pi: [PiIcons as IconLibrary],
  Ri: [RiIcons as IconLibrary],
  Rx: [RxIcons as IconLibrary],
  Si: [SiIcons as IconLibrary],
  Sl: [SlIcons as IconLibrary],
  Tb: [TbIcons as IconLibrary],
  Tfi: [TfiIcons as IconLibrary],
  Ti: [TiIcons as IconLibrary],
  Vsc: [VscIcons as IconLibrary],
  Wi: [WiIcons as IconLibrary],
};

export function resolveIconComponent(
  iconName: string | null | undefined,
): IconType | null {
  if (!iconName?.trim()) return null;

  const normalizedName = iconName.trim();

  for (const length of [3, 2] as const) {
    const prefix = normalizedName.slice(0, length);
    const libraries = PREFIX_LIBRARIES[prefix];
    if (!libraries) continue;

    for (const library of libraries) {
      const icon = library[normalizedName];
      if (icon) return icon;
    }
  }

  return null;
}

export const SUPPORTED_ICON_PREFIXES = Object.keys(PREFIX_LIBRARIES).sort();
