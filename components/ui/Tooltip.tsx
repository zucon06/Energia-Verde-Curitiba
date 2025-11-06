import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactElement;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, className }) => {
  return (
    <div className={`relative flex items-center group ${className}`}>
      {children}
      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2.5 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded-md shadow-lg 
                   opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
        role="tooltip"
      >
        {text}
        {/* Triangle / Arrow */}
        <div 
            className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0
                       border-x-4 border-x-transparent
                       border-t-4 border-t-gray-900 dark:border-t-gray-700"
        ></div>
      </div>
    </div>
  );
};

export default Tooltip;
