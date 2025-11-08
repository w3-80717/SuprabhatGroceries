import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Picker } from '@react-native-picker/picker';
import { COLORS, SIZES } from '../../constants/themes';

const productSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  description: z.string().min(10, 'Description is required'),
  price: z.coerce.number().positive('Price must be a positive number'),
  stock: z.coerce.number().int().nonnegative('Stock must be non-negative'),
  category: z.string().min(3, 'Category is required'),
  unit: z.enum(['kg', 'piece', 'bunch', 'dozen']),
});

const ProductForm = ({ product, onSubmit, onCancel, isLoading }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      unit: 'kg',
    },
  });

  return (
    <ScrollView>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Text style={styles.label}>Product Name</Text>
            <TextInput style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} />
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
          </>
        )}
      />
      
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Text style={styles.label}>Description</Text>
            <TextInput style={[styles.input, { height: 80 }]} multiline onBlur={onBlur} onChangeText={onChange} value={value} />
            {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}
          </>
        )}
      />

      <View style={styles.row}>
          <View style={styles.column}>
            <Controller
                control={control}
                name="price"
                render={({ field: { onChange, onBlur, value } }) => (
                <>
                    <Text style={styles.label}>Price (₹)</Text>
                    <TextInput style={styles.input} keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={String(value)} />
                    {errors.price && <Text style={styles.errorText}>{errors.price.message}</Text>}
                </>
                )}
            />
          </View>
          <View style={styles.column}>
            <Controller
                control={control}
                name="stock"
                render={({ field: { onChange, onBlur, value } }) => (
                <>
                    <Text style={styles.label}>Stock</Text>
                    <TextInput style={styles.input} keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={String(value)} />
                    {errors.stock && <Text style={styles.errorText}>{errors.stock.message}</Text>}
                </>
                )}
            />
          </View>
      </View>
      
      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Text style={styles.label}>Category</Text>
            <TextInput style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} />
            {errors.category && <Text style={styles.errorText}>{errors.category.message}</Text>}
          </>
        )}
      />
      
      <Controller
        control={control}
        name="unit"
        render={({ field: { onChange, value } }) => (
            <>
                <Text style={styles.label}>Unit</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={value} onValueChange={onChange}>
                        <Picker.Item label="Kilogram (kg)" value="kg" />
                        <Picker.Item label="Piece" value="piece" />
                        <Picker.Item label="Bunch" value="bunch" />
                        <Picker.Item label="Dozen" value="dozen" />
                    </Picker>
                </View>
            </>
        )}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.disabledButton]} 
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>{isLoading ? 'Saving...' : 'Save Product'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  label: { fontWeight: '600', marginBottom: SIZES.base / 2, color: COLORS.brandText },
  input: { borderWidth: 1, borderColor: '#ccc', padding: SIZES.small, borderRadius: SIZES.base, marginBottom: SIZES.base, fontSize: SIZES.medium, textAlignVertical: 'top' },
  errorText: { color: 'red', marginBottom: SIZES.small },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { width: '48%' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: SIZES.base, marginBottom: SIZES.medium },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: SIZES.large },
  cancelButton: { padding: SIZES.medium, marginRight: SIZES.small },
  saveButton: { backgroundColor: COLORS.brandGreen, padding: SIZES.medium, borderRadius: SIZES.base },
  disabledButton: { backgroundColor: COLORS.gray },
  saveButtonText: { color: COLORS.white, fontWeight: 'bold' },
});

export default ProductForm;