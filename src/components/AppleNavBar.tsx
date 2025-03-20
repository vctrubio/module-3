import React, { useState } from "react";

interface NavIcon {
    color: string;
    action: () => void;
    message: string;
}

export function AppleNavBar({ icons }: { icons: NavIcon[] }) {
    const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

    const handleIconClick = (action: () => void) => {
        action();
    };

    return (
        <div className='flex justify-start gap-1 items-center relative'>
            {icons.map((icon, index) => (
                <div
                    key={index}
                    className="w-4 h-4 rounded-full cursor-pointer hover:opacity-75 relative"
                    style={{ backgroundColor: icon.color }}
                    onClick={() => handleIconClick(icon.action)}
                    onMouseEnter={() => setActiveTooltip(index)}
                    onMouseLeave={() => setActiveTooltip(null)}
                >
                    {activeTooltip === index && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
                            {icon.message}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}