// src/pages/ContactPage.jsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { styled } from 'nativewind';
import { CustomFooter } from '../components/HeaderFooterWrapper';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const ContactPage = () => {
  const handleSendMessage = () => {
    Alert.alert("Message Sent", "Your message has been sent successfully!");
  };

  return (
    <StyledScrollView className="flex-1 bg-brand-beige">
      <StyledView className="px-6 py-12">
        <StyledView className="text-center">
          <StyledText className="text-4xl font-bold text-brand-green">Get In Touch</StyledText>
          <StyledText className="text-lg text-gray-600 mt-2">
            We'd love to hear from you! Whether you have a question about our products, our service, or anything else, our team is ready to answer all your questions.
          </StyledText>
        </StyledView>

        <StyledView className="mt-12 flex flex-col md:flex-row gap-12 items-start">
          {/* Contact Info Section */}
          <StyledView className="bg-white p-8 rounded-lg shadow-md space-y-6 flex-1">
            <StyledText className="text-2xl font-semibold text-brand-text">Contact Information</StyledText>
            <StyledView className="flex-row items-start space-x-4">
              <Feather name="map-pin" size={24} color="#ff8c42" className="mt-1" />
              <StyledView>
                <StyledText className="font-bold">Our Location</StyledText>
                <StyledText className="text-gray-600">Pune, Maharashtra, India</StyledText>
              </StyledView>
            </StyledView>
            <StyledView className="flex-row items-start space-x-4">
              <Feather name="mail" size={24} color="#ff8c42" className="mt-1" />
              <StyledView>
                <StyledText className="font-bold">Email Us</StyledText>
                <StyledText className="text-gray-600">suprabhat.fresh@example.com</StyledText>
              </StyledView>
            </StyledView>
            <StyledView className="flex-row items-start space-x-4">
              <Feather name="phone" size={24} color="#ff8c42" className="mt-1" />
              <StyledView>
                <StyledText className="font-bold">Call Us</StyledText>
                <StyledText className="text-gray-600">+91 98765 43210</StyledText>
              </StyledView>
            </StyledView>
          </StyledView>

          {/* Contact Form Section */}
          <StyledView className="bg-white p-8 rounded-lg shadow-md flex-1">
            <StyledText className="text-2xl font-semibold text-brand-text mb-6">Send us a Message</StyledText>
            <StyledView className="space-y-4">
              <StyledView>
                <StyledText className="block text-sm font-medium text-gray-700 mb-1">Full Name</StyledText>
                <StyledTextInput className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </StyledView>
              <StyledView>
                <StyledText className="block text-sm font-medium text-gray-700 mb-1">Email Address</StyledText>
                <StyledTextInput keyboardType="email-address" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </StyledView>
              <StyledView>
                <StyledText className="block text-sm font-medium text-gray-700 mb-1">Message</StyledText>
                <StyledTextInput multiline numberOfLines={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"></StyledTextInput>
              </StyledView>
              <StyledTouchableOpacity
                onPress={handleSendMessage}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <StyledText className="text-white font-medium">Send Message</StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledView>
      <CustomFooter />
    </StyledScrollView>
  );
};

export default ContactPage;