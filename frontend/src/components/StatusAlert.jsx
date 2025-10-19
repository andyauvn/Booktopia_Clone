import { CheckCircle, AlertTriangle } from 'lucide-react';


const StatusAlert = ({ status, message }) => {
    if (!status) return null;

    const isSuccess = status === 'success';
    const bgColor = isSuccess ? 'bg-green-100' : 'bg-red-100';
    const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
    const Icon = isSuccess ? CheckCircle : AlertTriangle;

    return (
        <div className={`p-4 rounded-xl ${bgColor} mb-6 border ${isSuccess ? 'border-green-300' : 'border-red-300'}`} role="alert">
        <div className="flex items-start">
            <Icon className={`h-6 w-6 flex-shrink-0 ${textColor} mt-0.5`} />
            <div className="ml-3">
            <p className={`text-sm font-semibold ${textColor}`}>{isSuccess ? 'Success' : 'Error'}</p>
            <p className={`text-sm ${textColor} mt-1`}>{message}</p>
            </div>
        </div>
        </div>
    );
}
export default StatusAlert