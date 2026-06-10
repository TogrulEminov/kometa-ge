import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaTelegram, FaWhatsapp, FaTiktok } from 'react-icons/fa';

interface Props {
    iconName: string;
    className?: string;
    fill?: string;
    width?: number;
    height?: number;
}

const Icons = {
    Facebook: FaFacebook,
    Instagram: FaInstagram,
    Twitter: FaTwitter,
    Linkedin: FaLinkedin,
    Youtube: FaYoutube,
    Telegram: FaTelegram,
    Whatsapp: FaWhatsapp,
    Tiktok: FaTiktok,
};

export const renderSocialIcon = ({
    iconName,
    fill = "currentColor",
    className,
    width,
    height,
}: Props) => {
    const IconComponent = Icons[iconName as keyof typeof Icons];

    if (!IconComponent) {
        return null;
    }

    return <IconComponent className={className} color={fill} size={width ?? height ?? 24} />;
};

export const availableIcons = [
    { value: "Facebook", label: "Facebook" },
    { value: "Instagram", label: "Instagram" },
    { value: "Twitter", label: "Twitter" },
    { value: "Linkedin", label: "Linkedin" },
    { value: "Youtube", label: "Youtube" },
    { value: "Telegram", label: "Telegram" },
    { value: "Whatsapp", label: "Whatsapp" },
    { value: "Tiktok", label: "Tiktok" },
];
