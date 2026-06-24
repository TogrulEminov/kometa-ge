import { useToggleState, useToggleStore } from "@/hooks/useToggleStore";
import React, {type JSX, useRef, useEffect} from "react";

interface Props {
    children: React.ReactNode;
    element: JSX.Element;
    stateKey: string;
    className?: string;
}

export default function ButtonsDropdown({children, element, stateKey, className}: Props) {
    const {toggle} = useToggleStore()
    const isOpen = useToggleState(stateKey); // Zustand-dan həm state-i, həm toggle-ı alırıq
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                toggle(stateKey)
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, stateKey, toggle]);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            {React.cloneElement(element, {
                onClick: () => toggle(stateKey),
                className: `${element.props.className} ${isOpen ? 'bg-[#dcdcdc]' : ''}`
            })}

            {isOpen && (
                <div
                    className={`absolute  left-0 mt-2 z-50 min-w-10   py-2 rounded-md shadow-lg border border-gray-100 bg-white ${className}`}
                >
                    <div className="flex flex-col gap-1">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}