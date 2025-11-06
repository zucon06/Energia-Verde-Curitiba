
import React from 'react';

// FIX: Extend CardProps with HTMLDivElement attributes to allow passing props like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', ...rest }, ref) => {
    return (
      <div ref={ref} className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg ${className}`} {...rest}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
