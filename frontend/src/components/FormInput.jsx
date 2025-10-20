import React from 'react';

const FormInput = ({ label, name, type = 'text', icon: Icon, error, value, onChange, isSubmitting, ...props }) => {
    const hasError = !!error;
    const inputClasses = `w-full p-3 pl-12 border-2 rounded-xl text-gray-800 transition duration-150 focus:ring-4 focus:ring-offset-1 focus:outline-none placeholder:text-gray-400 ${
        hasError 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-100' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
    } ${isSubmitting ? 'bg-gray-100' : 'bg-white'}`;
    const iconClasses = `absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
        hasError ? 'text-red-500' : 'text-gray-400'
    }`;

    return (
        <div className="space-y-1">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="relative">
                {Icon && <Icon className={iconClasses} aria-hidden="true" />}
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    disabled={isSubmitting}
                    className={inputClasses}
                    aria-invalid={hasError ? "true" : "false"}
                    aria-describedby={hasError ? `${name}-error` : undefined}
                    {...props}
                />
            </div>
            {hasError && (
                <p id={`${name}-error`} className="text-sm text-red-600 mt-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default FormInput;
