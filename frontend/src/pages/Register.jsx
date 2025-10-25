import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import StatusAlert from '../components/StatusAlert';
import { API_BASE_URL } from '../config/apiConfig';
import { useNavigate, Link } from 'react-router-dom';

// --- VALIDATION HELPERS ---

// Matches the Mongoose regex for password complexity: 
// min 8, at least one number, one upper, one lower
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// Basic email regex
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

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
  const navigate = useNavigate();

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

    if (!form.name.trim()) {
      newErrors.name = 'Full name is required.';
      isValid = false;
    }

    if (!form.email.trim() || !EMAIL_REGEX.test(form.email)) {
      newErrors.email = 'A valid email address is required.';
      isValid = false;
    }

    if (!form.password || form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
      isValid = false;
    } else if (!PASSWORD_REGEX.test(form.password)) {
      newErrors.password = 'Password must include uppercase, lowercase, and a number.';
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
      setStatusMessage('Please correct the errors in the form.');
      return;
    }

    setIsSubmitting(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        const data = await response.json();

        if (response.ok) {
            setStatus('success');
            setStatusMessage(data.message || 'Registration successful!');
            setForm({ name: '', email: '', password: '' }); // Clear form on success
            setTimeout(() => { navigate('/login'); }, 1000); 
        } else {
            // Handle server-side validation/duplicate errors
            setStatus('error');
            setStatusMessage(data.message || 'Registration failed due to a server error.');
        }

    } catch (error) {
        console.error('Registration failed:', error);
        setStatus('error');
        setStatusMessage('Network error. Could not connect to the server.');
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- UI RENDER ---

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">
          Join Booktopia
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Create your account to discover great books.
        </p>

        <StatusAlert status={status} message={statusMessage} />
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <FormInput 
              label="Full Name" 
              name="name" 
              type="text" 
              icon={User} 
              error={errors.name}
              value={form.name}
              onChange={handleChange}
              isSubmitting={isSubmitting}
              placeholder="e.g., Jane Doe"
            />

            <FormInput 
              label="Email Address" 
              name="email" 
              type="email" 
              icon={Mail} 
              error={errors.email}
              value={form.email}
              onChange={handleChange}
              isSubmitting={isSubmitting}
              placeholder="you@example.com"
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
              placeholder="Minimum 8 characters"
            />

            <div className="pt-2">
                <Button 
                    type='submit' 
                    disabled={isSubmitting} 
                    color='green' 
                    size ='lg' 
                    className='w-full' 
                >
                    {isSubmitting ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ) : null}
                    {isSubmitting ? 'Registering...' : 'Create Account'}
                </Button>
            </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold leading-6 text-blue-600 hover:text-blue-500 ml-1">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

