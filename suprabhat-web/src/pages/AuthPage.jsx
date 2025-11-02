import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

// Zod validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login: loginToStore } = useAuthStore(); // Get the login action from the store

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  const { mutate: handleRegister, isLoading: isRegistering, error: registerError } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      loginToStore(data); // Save user and token to store
      navigate('/'); // Redirect to home on success
    },
  });

  const { mutate: handleLogin, isLoading: isLoggingIn, error: loginError } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      loginToStore(data);
      navigate('/');
    },
  });

  const onSubmit = (data) => {
    if (isLogin) {
      handleLogin(data);
    } else {
      handleRegister(data);
    }
  };

  const isLoading = isLoggingIn || isRegistering;
  const serverError = loginError || registerError;

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{fontSize:'20px', fontWeight:'bold'}}>{isLogin ? 'Login' : 'Create Account'}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!isLogin && (
          <div style={{ marginBottom: '1rem' }}>
            <label>Name</label>
            <input {...register('name')} style={{ width: '100%', padding: '8px' }} />
            {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
          </div>
        )}
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input {...register('email')} style={{ width: '100%', padding: '8px' }} />
          {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label>
          <input type="password" {...register('password')} style={{ width: '100%', padding: '8px' }} />
          {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
        </div>

        {serverError && <p style={{ color: 'red', marginBottom: '1rem' }}>{serverError.response?.data?.message || 'An error occurred'}</p>}
        
        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '10px', backgroundColor: '#2c5e1a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#2c5e1a', cursor: 'pointer', textDecoration: 'underline' }}>
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;