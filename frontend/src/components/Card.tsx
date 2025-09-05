import React from 'react';

type CardProps = {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ title, subtitle, right, children, className }) => {
  return (
    <div className={`bg-white border rounded shadow-sm ${className ?? ''}`}>
      {(title || right) && (
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div>
            {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          {right}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Card;


