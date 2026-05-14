import React from 'react';

const Textarea = ({ label, error, rows = 4, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={`w-full border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Textarea;