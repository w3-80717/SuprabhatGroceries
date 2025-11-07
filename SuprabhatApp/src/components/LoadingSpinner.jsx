// src/components/LoadingSpinner.jsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);

const LoadingSpinner = () => (
  <StyledView className="flex-1 justify-center items-center p-10 bg-brand-beige">
    <ActivityIndicator size="large" color="#2a623d" />
  </StyledView>
);

export default LoadingSpinner;