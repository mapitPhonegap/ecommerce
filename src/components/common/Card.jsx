import React from "react";

const Card = ({ children, className }) => {
  return (
    <div className={`bg-base-100 p-6 rounded-2xl shadow-lg ${className}`}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className }) => {
  return <div className={`mt-4 space-y-3 ${className}`}>{children}</div>;
};

export { Card, CardContent };