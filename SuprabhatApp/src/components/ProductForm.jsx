// src/components/ProductForm.jsx
import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { styled } from 'nativewind';
import { Picker } from '@react-native-picker/picker';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const productSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  description: z.string().min(10, 'Description is required'),
  price: z.coerce.number().positive('Price must be a positive number'),
  stock: z.coerce.number().int().nonnegative('Stock must be a non-negative integer'),
  category: z.string().min(3, 'Category is required'),
  unit: z.enum(['kg', 'piece', 'bunch', 'dozen']),
});

const ProductForm = ({ product, onSubmit, isLoading, onCancel }) => {
  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: product || { unit: 'kg', name: '', description: '', price: 0, stock: 0, category: '' },
  });

  useEffect(() => {
    reset(product || { unit: 'kg', name: '', description: '', price: 0, stock: 0, category: '' });
  }, [product, reset]);

  return (
    <StyledScrollView contentContainerClassName="flex-grow">
      <StyledView className="space-y-4">
        <StyledView className="flex flex-col md:flex-row gap-4">
          <StyledView className="flex-1">
            <StyledText className="block text-sm font-medium text-gray-700 mb-1">Product Name</StyledText>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledTextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2"
                />
              )}
            />
            {errors.name && <StyledText className="text-red-500 text-sm mt-1">{errors.name.message}</StyledText>}
          </StyledView>
          <StyledView className="flex-1">
            <StyledText className="block text-sm font-medium text-gray-700 mb-1">Category</StyledText>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledTextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2"
                />
              )}
            />
            {errors.category && <StyledText className="text-red-500 text-sm mt-1">{errors.category.message}</StyledText>}
          </StyledView>
        </StyledView>
        <StyledView>
          <StyledText className="block text-sm font-medium text-gray-700 mb-1">Description</StyledText>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <StyledTextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2"
              />
            )}
          />
          {errors.description && <StyledText className="text-red-500 text-sm mt-1">{errors.description.message}</StyledText>}
        </StyledView>
        <StyledView className="flex flex-col md:flex-row gap-4">
          <StyledView className="flex-1">
            <StyledText className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</StyledText>
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledTextInput
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)} // Ensure number conversion
                  value={String(value)}
                  keyboardType="numeric"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2"
                />
              )}
            />
            {errors.price && <StyledText className="text-red-500 text-sm mt-1">{errors.price.message}</StyledText>}
          </StyledView>
          <StyledView className="flex-1">
            <StyledText className="block text-sm font-medium text-gray-700 mb-1">Stock</StyledText>
            <Controller
              control={control}
              name="stock"
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledTextInput
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(parseInt(text) || 0)} // Ensure integer conversion
                  value={String(value)}
                  keyboardType="numeric"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2"
                />
              )}
            />
            {errors.stock && <StyledText className="text-red-500 text-sm mt-1">{errors.stock.message}</StyledText>}
          </StyledView>
          <StyledView className="flex-1">
            <StyledText className="block text-sm font-medium text-gray-700 mb-1">Unit</StyledText>
            <StyledView className="mt-1 block w-full border-gray-300 rounded-md shadow-sm overflow-hidden">
              <Controller
                control={control}
                name="unit"
                render={({ field: { onChange, value } }) => (
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={{ height: 40, width: '100%' }}
                  >
                    <Picker.Item label="kg" value="kg" />
                    <Picker.Item label="piece" value="piece" />
                    <Picker.Item label="bunch" value="bunch" />
                    <Picker.Item label="dozen" value="dozen" />
                  </Picker>
                )}
              />
            </StyledView>
          </StyledView>
        </StyledView>
        <StyledView className="pt-4 flex-row justify-end gap-3">
          <StyledTouchableOpacity onPress={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
            <StyledText className="text-gray-800 font-bold">Cancel</StyledText>
          </StyledTouchableOpacity>
          <StyledTouchableOpacity onPress={handleSubmit(onSubmit)} disabled={isLoading} className="bg-brand-green text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-green-light disabled:opacity-50">
            {isLoading ? <ActivityIndicator color="white" /> : <StyledText className="text-white font-bold">Save Product</StyledText>}
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
    </StyledScrollView>
  );
};
export default ProductForm;