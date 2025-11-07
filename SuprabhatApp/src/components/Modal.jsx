// src/components/Modal.jsx
import React from 'react';
import { Modal as RNModal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <RNModal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <StyledView className="flex-1 justify-center items-center bg-black bg-opacity-60 px-4">
        <StyledView className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <StyledView className="p-4 border-b border-gray-200 flex-row justify-between items-center">
            <StyledText className="text-xl font-semibold text-brand-text">{title}</StyledText>
            <StyledTouchableOpacity onPress={onClose} className="p-2">
              <Feather name="x" size={24} color="#6b7280" />
            </StyledTouchableOpacity>
          </StyledView>
          <StyledView className="p-6">
            {children}
          </StyledView>
        </StyledView>
      </StyledView>
    </RNModal>
  );
};
export default Modal;