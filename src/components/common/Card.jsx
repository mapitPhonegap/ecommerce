import React from "react";

export const Card = ({ children, className }) => {
  return (
    <div className={`bg-base-100 p-6 rounded-2xl shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className }) => {
  return <div className={`mt-4 space-y-3 ${className}`}>{children}</div>;
};