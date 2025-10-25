import React, { useState } from 'react';
import { Mail, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
// Corrected import paths assuming components are one level up in the 'components' directory
import Button from '../components/Button.jsx';
import FormInput from '../components/FormInput.jsx';
import StatusAlert from '../components/StatusAlert.jsx';

// Basic email regex (matches the one often used in frontend validation)
const EMAIL_REGEX = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

const Login = ({ onLoginSuccess }) => {
  const [form, setForm] = useState({
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

    if (!form.email) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!EMAIL_REGEX.test(form.email)) {
      newErrors.email = 'Please enter a valid email format.';
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    }
    // NOTE: We don't check for password complexity on login, only on registration.

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setStatusMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful Login
        setStatus('success');
        // In a real application, you would handle the JWT token received here.
        setStatusMessage(`Welcome back, ${data.name}! You are now logged in.`);
        
        // Use a slight delay before calling onLoginSuccess to show the alert message
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(data);
          }
        }, 1500);

      } else {
        // Error response from server
        setStatus('error');
        // Fallback message if the server doesn't provide a specific error message
        const message = data.message || 'Login failed. Please check your credentials.';
        setStatusMessage(message);
      }
    } catch (error) {
      // Network or unexpected error
      console.error('Login request error:', error);
      setStatus('error');
      setStatusMessage('A network error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50 p-4'>
      <div className='w-full max-w-md bg-white p-8 sm:p-10 shadow-xl rounded-2xl'>
        <h1 className='text-3xl font-extrabold text-gray-900 text-center mb-2'>
          Sign In
        </h1>
        <p className='text-center text-gray-500 mb-8'>
          Access your Booktopia account.
        </p>

        <StatusAlert 
          status={status}
          message={statusMessage}
          Icon={status === 'success' ? CheckCircle : AlertTriangle}
        />

        <form onSubmit={handleSubmit} className='space-y-6'>

          <FormInput 
            label="Email Address" 
            name="email" 
            type="email" 
            icon={Mail} 
            error={errors.email}
            value={form.email}
            onChange={handleChange}
            isSubmitting={isSubmitting}
          />

          <FormInput 
            label="Password" 
            name="password" 
            type="password" 
            icon={Lock} 
            error={errors.password}
            value={form.password}
            onChange={handleChange}
            isSubmitting={isSubmitting}
          />

          <div>
            <Button 
              type='submit' 
              disabled={isSubmitting} 
              color='blue' 
              size='lg' 
              className='w-full' 
            >
              {isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Log In'}
            </Button>
          </div>
        </form>

        <p className='mt-6 text-center text-sm text-gray-500'>
          Don't have an account? <a href="/register" className='font-medium text-blue-600 hover:text-blue-500 transition duration-150'>Register Here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
