import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const StatusAlert = ({ status, message }) => {
    if (!status || !message) return null;

    let icon, bgColor, textColor, iconColor;

    if (status === 'success') {
        icon = CheckCircle;
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        iconColor = 'text-green-500';
    } else if (status === 'error') {
        icon = AlertTriangle;
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        iconColor = 'text-red-500';
    } else {
        return null;
    }
    
    const IconComponent = icon;

    return (
        <div className={`p-4 rounded-xl ${bgColor} flex items-start space-x-3 transition-all duration-300 ease-in-out border border-current ${textColor}`} role="alert">
            <IconComponent className={`h-6 w-6 flex-shrink-0 mt-0.5 ${iconColor}`} aria-hidden="true" />
            <div className="flex-1">
                <p className="text-sm font-medium">{status === 'success' ? 'Success!' : 'Error!'}</p>
                <p className="text-sm mt-0.5">{message}</p>
            </div>
        </div>
    );
};

export default StatusAlert;
