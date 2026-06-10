import React, {useMemo} from 'react';
import * as MdIcons from 'react-icons/md';
import * as HiIcons from "react-icons/hi2";
import * as FaIcons from "react-icons/fa6";
import * as IoIcons from "react-icons/io5";
import * as LuIcons from "react-icons/lu";
import * as BiIcons from "react-icons/bi";
import * as BsIcons from "react-icons/bs";
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import * as SiIcons from "react-icons/si";
import * as TbIcons from "react-icons/tb";
import * as FiIcons from "react-icons/fi";
import * as GiIcons from "react-icons/gi";
const iconLibraries: Record<string, any> = {
    Md: MdIcons,
    Hi: HiIcons,
    Fa: FaIcons,
    Io: IoIcons,
    Lu: LuIcons,
    Bi: BiIcons,
    Bs: BsIcons,
    Ai: AiIcons,
    Ri: RiIcons,
    Si: SiIcons,
    Tb: TbIcons,
    Fi: FiIcons,
    Gi: GiIcons
};

interface DynamicIconProps {
    iconName: string | null | undefined;
    className?: string;
    size?: number;
}


export const DynamicIcon = ({iconName, className, size}: DynamicIconProps) => {
    const IconComponent = useMemo(() => {
        if (!iconName) return null;
        let prefix = iconName.substring(0, 2);
        let library = iconLibraries[prefix];
        if (!library) {
            prefix = iconName.substring(0, 3);
            library = iconLibraries[prefix];
        }
        if (!library || !library[iconName]) return null;

        return library[iconName];
    }, [iconName]);
    if (!IconComponent) {
        return <MdIcons.MdOutlineQuestionMark className={className} size={size}/>;
    }

    return <IconComponent className={className} size={size}/>;
};