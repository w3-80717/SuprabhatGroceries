// src/pages/AboutPage.jsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { CustomFooter } from '../components/HeaderFooterWrapper';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

const AboutPage = () => {
  return (
    <StyledScrollView className="flex-1 bg-brand-beige">
      <StyledView className="px-6 py-8">
        <StyledText className="text-3xl font-bold text-gray-800 mb-6">About Suprabhat</StyledText>
        <StyledView className="bg-white p-8 rounded-lg shadow-sm space-y-4 text-gray-700">
          <StyledText>
            Welcome to Suprabhat Fruit and Vegetable Shop! We are a hyper-local, community-focused shop dedicated to bringing you the freshest produce available.
          </StyledText>
          <StyledText>
            Our mission is to replace impersonal, large-scale grocery shopping with a personalized service that you can trust. We believe in quality over quantity, and our curated selection reflects that. Many of our items are sourced directly from local farms, and we often feature "picked today" specials to guarantee absolute freshness.
          </StyledText>
          <StyledText className="text-xl font-semibold pt-4">Our Promise</StyledText>
          <StyledView className="ml-4 space-y-2"> {/* Simulating list-disc */}
            <StyledText>• <StyledText className="font-bold">Freshness Guarantee:</StyledText> We stand by the quality of our produce.</StyledText>
            <StyledText>• <StyledText className="font-bold">Curated Quality:</StyledText> Every item is hand-selected by our team.</StyledText>
            <StyledText>• <StyledText className="font-bold">Personalized Service:</StyledText> We're your friendly neighborhood shop, now online!</StyledText>
          </StyledView>
        </StyledView>
      </StyledView>
      <CustomFooter />
    </StyledScrollView>
  );
};

export default AboutPage;