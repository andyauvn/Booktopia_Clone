const FormInput = ({ label, name, type = 'text', icon: Icon, error, value, onChange, isSubmitting }) => {
  return (
    <div className="space-y-1">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="relative rounded-lg shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            required
            className={`
            block w-full rounded-lg border-2 py-3 pl-10 pr-4 
            transition duration-150 ease-in-out focus:ring-4
            ${error 
                ? 'border-red-500 text-red-900 focus:border-red-500 focus:ring-red-100' 
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-100'
            }
            `}
            placeholder={label}
            disabled={isSubmitting}
        />
        </div>
        {error && (
        <p className="mt-1 flex items-center text-sm font-medium text-red-600">
            <AlertTriangle className="mr-1 h-4 w-4" />
            {error}
        </p>
        )}
  </div>
  )
}
export default FormInput;