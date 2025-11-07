// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { loginUser, registerUser } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

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
  const navigation = useNavigation();
  const { login: loginToStore } = useAuthStore();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    mode: 'onBlur',
  });

  React.useEffect(() => {
    reset();
  }, [isLogin, reset]);

  const { mutate: handleRegister, isLoading: isRegistering, error: registerError } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      loginToStore(data);
      Alert.alert('Success', 'Account created and logged in!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'AppStack', screen: 'Home' }],
      });
    },
    onError: (error) => {
      Alert.alert('Registration Error', error.response?.data?.message || 'Failed to register. Please try again.');
    },
  });

  const { mutate: handleLogin, isLoading: isLoggingIn, error: loginError } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      loginToStore(data);
      Alert.alert('Success', 'Logged in successfully!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'AppStack', screen: 'Home' }],
      });
    },
    onError: (error) => {
      Alert.alert('Login Error', error.response?.data?.message || 'Failed to login. Please check your credentials.');
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

  const inputStyle = "w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-base focus:border-brand-green";
  const errorTextStyle = "text-red-500 text-sm mt-1";
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <StyledScrollView contentContainerClassName="flex-grow justify-center items-center py-8 px-6 bg-brand-beige">
      <StyledView className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <StyledText className="text-2xl font-bold text-center text-gray-800 mb-6">{isLogin ? 'Login' : 'Create Account'}</StyledText>
        <StyledView className="space-y-4">
          {!isLogin && (
            <StyledView>
              <StyledText className={labelStyle}>Name</StyledText>
              <StyledTextInput
                {...register('name')}
                placeholder="Your Name"
                className={inputStyle}
              />
              {errors.name && <StyledText className={errorTextStyle}>{errors.name.message}</StyledText>}
            </StyledView>
          )}
          <StyledView>
            <StyledText className={labelStyle}>Email</StyledText>
            <StyledTextInput
              {...register('email')}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              className={inputStyle}
            />
            {errors.email && <StyledText className={errorTextStyle}>{errors.email.message}</StyledText>}
          </StyledView>
          <StyledView>
            <StyledText className={labelStyle}>Password</StyledText>
            <StyledTextInput
              {...register('password')}
              placeholder="********"
              secureTextEntry
              className={inputStyle}
            />
            {errors.password && <StyledText className={errorTextStyle}>{errors.password.message}</StyledText>}
          </StyledView>

          {serverError && (
            <StyledText className="text-red-500 text-sm text-center mt-2">
              {serverError.response?.data?.message || 'An unexpected error occurred.'}
            </StyledText>
          )}

          <StyledTouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="w-full bg-brand-green py-3 rounded-lg flex items-center justify-center mt-6 disabled:bg-gray-400"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <StyledText className="text-white font-bold text-lg">{isLogin ? 'Login' : 'Register'}</StyledText>
            )}
          </StyledTouchableOpacity>
        </StyledView>

        <StyledText className="mt-6 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <StyledTouchableOpacity onPress={() => setIsLogin(!isLogin)} className="ml-1">
            <StyledText className="text-brand-green font-bold underline">{isLogin ? 'Register' : 'Login'}</StyledText>
          </StyledTouchableOpacity>
        </StyledText>
      </StyledView>
    </StyledScrollView>
  );
};

export default AuthPage;