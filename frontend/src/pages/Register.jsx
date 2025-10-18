import React, { useState } from 'react';
import { Mail, Lock, User, CheckCircle, AlertTriangle } from 'lucide-react';
import Button from '../components/Button';

// --- VALIDATION HELPERS ---

// Matches the Mongoose regex for password complexity: 
// min 6, max 32, at least one number, one special char, one upper, one lower
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,32}$/;

// Basic email regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', or null
  const [statusMessage, setStatusMessage] = useState('');

  // --- FORM HANDLING ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Name Validation
    if (!form.name.trim()) {
      newErrors.name = 'Name is required.';
      isValid = false;
    }

    // Email Validation
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!EMAIL_REGEX.test(form.email)) {
      newErrors.email = 'Invalid email format.';
      isValid = false;
    }

    // Password Validation (Matching Mongoose Schema)
    if (!form.password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else if (!PASSWORD_REGEX.test(form.password)) {
      newErrors.password = 'Password must be 6-32 chars, include numbers, special chars, and mixed case.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setStatusMessage('');

    if (!validateForm()) {
      setStatus('error');
      setStatusMessage('Please fix the validation errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    // --- REAL API CALL TO NODE BACKEND ---
    const API_ENDPOINT = '/api/users/register'; 

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      
      if (response.ok) {
        // HTTP 201 - Success
        setStatus('success');
        setStatusMessage('Registration successful! Welcome to Booktopia.');
        setForm({ name: '', email: '', password: '' }); // Clear form
        setErrors({}); // Clear all errors
      } else {
        // HTTP 400 or other error status
        // Extract the error message from the backend response
        const errorMessage = data.message || 'An unknown registration error occurred.';
        setStatus('error');
        setStatusMessage(`Registration failed: ${errorMessage}`);
        
        // Optionally set a specific error on the email field if it's a duplicate error
        if (errorMessage.includes('email')) {
            setErrors({ email: errorMessage });
        }
      }
    } catch (error) {
      // Network errors (server down, CORS issues, etc.)
      setStatus('error');
      setStatusMessage(`Network Error: Cannot reach the registration server.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- UI COMPONENTS ---
  
  const InputField = ({ label, name, type = 'text', icon: Icon, error }) => (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id={name}
          name={name}
          type={type}
          value={form[name]}
          onChange={handleChange}
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
        <p className="mt-1 flex items-center text-sm text-red-600">
          <AlertTriangle className="mr-1 h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );

  const StatusAlert = ({ status, message }) => {
    if (!status) return null;

    const isSuccess = status === 'success';
    const bgColor = isSuccess ? 'bg-green-100' : 'bg-red-100';
    const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
    const Icon = isSuccess ? CheckCircle : AlertTriangle;

    return (
      <div className={`p-4 rounded-lg ${bgColor} mb-6`} role="alert">
        <div className="flex items-start">
          <Icon className={`h-6 w-6 flex-shrink-0 ${textColor} mt-0.5`} />
          <div className="ml-3">
            <p className={`text-sm font-medium ${textColor}`}>{message}</p>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Register for Booktopia
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Start your journey with us today!
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10">
          
          <StatusAlert status={status} message={statusMessage} />

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <InputField 
              label="Full Name" 
              name="name" 
              icon={User} 
              error={errors.name}
            />

            <InputField 
              label="Email Address" 
              name="email" 
              type="email" 
              icon={Mail} 
              error={errors.email}
            />

            <InputField 
              label="Password" 
              name="password" 
              type="password" 
              icon={Lock} 
              error={errors.password}
            />

            <div>
                <Button type='submit' disabled={isSubmitting} color='green' size ='lg' >
                    {isSubmitting ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ) : 'Register'}
                </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
