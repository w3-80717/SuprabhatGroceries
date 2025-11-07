// src/pages/HomePage.jsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/products';
import { useCartStore } from '../store/cartStore';
import Feather from 'react-native-vector-icons/Feather';
import { styled } from 'nativewind';
import { CustomFooter } from '../components/HeaderFooterWrapper';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const HeroSection = () => {
  const navigation = useNavigation();
  return (
    <StyledView className="relative bg-brand-green overflow-hidden">
      <StyledView className="px-6 py-20 text-center">
        <StyledText className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white">
          Pure, Simple, Farm-Fresh.
        </StyledText>
        <StyledText className="mt-4 text-lg md:text-xl text-green-100 max-w-2xl mx-auto">
          Experience the true taste of nature with produce sourced from local farms and delivered with care.
        </StyledText>
        <StyledTouchableOpacity
          onPress={() => navigation.navigate('Products')}
          className="mt-10 inline-flex items-center gap-2 bg-brand-accent text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg"
        >
          <StyledText className="text-white font-bold text-lg mr-2">Explore Our Products</StyledText>
          <Feather name="chevron-right" size={20} color="white" />
        </StyledTouchableOpacity>
      </StyledView>
      {/* SVG Wave Divider is complex in RN. A simpler visual separator or image might be used. */}
    </StyledView>
  );
};

const FeaturedProducts = () => {
  const { addToCart } = useCartStore();
  const navigation = useNavigation();
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const featured = data?.results?.slice(0, 4) || [];

  return (
    <StyledView className="bg-brand-beige py-20">
      <StyledView className="px-6">
        <StyledView className="text-center mb-12">
          <StyledText className="text-4xl font-bold text-brand-green">Our Freshest Picks</StyledText>
          <StyledText className="text-lg text-gray-600 mt-2">Hand-selected for you, from our farm to your table.</StyledText>
        </StyledView>

        {isLoading ? (
          <StyledView className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2a623d" />
            <StyledText className="text-center mt-4">Loading...</StyledText>
          </StyledView>
        ) : (
          <StyledView className="flex flex-row flex-wrap justify-center gap-4">
            {featured.map(product => (
              <StyledView key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden w-44 md:w-56 lg:w-64 mb-4">
                <StyledView className="w-full h-40 bg-gray-200 relative flex items-center justify-center">
                  <StyledImage
                    source={product.images?.[0] ? { uri: product.images[0] } : require('../../assets/images/tomato.jpeg')}
                    className="object-cover w-full h-full"
                    resizeMode="cover"
                  />
                  <StyledView className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <StyledTouchableOpacity
                      onPress={() => addToCart(product)}
                      className="bg-brand-accent text-white font-bold py-2 px-6 rounded-full transform scale-90 group-hover:scale-100 transition-transform"
                    >
                      <StyledText className="text-white font-bold">Add to Cart</StyledText>
                    </StyledTouchableOpacity>
                  </StyledView>
                </StyledView>
                <StyledView className="p-5 text-center">
                  <StyledText className="text-xl font-semibold text-brand-text">{product.name}</StyledText>
                  <StyledText className="text-brand-green-light font-medium mt-1">₹{product.price} / {product.unit}</StyledText>
                </StyledView>
              </StyledView>
            ))}
          </StyledView>
        )}
        <StyledTouchableOpacity onPress={() => navigation.navigate('Products')} className="mt-10 mx-auto w-fit bg-brand-green text-white py-3 px-8 rounded-full text-lg">
          <StyledText className="text-white font-bold">View All Products</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
};

const Testimonials = () => (
  <StyledView className="bg-white py-20">
    <StyledView className="px-6">
      <StyledView className="text-center mb-12">
        <StyledText className="text-4xl font-bold text-brand-green">Loved by Our Community</StyledText>
        <StyledText className="text-lg text-gray-600 mt-2">Real stories from our happy customers.</StyledText>
      </StyledView>
      <StyledView className="flex flex-col md:flex-row gap-8 items-center">
        <StyledView className="bg-brand-beige p-8 rounded-xl shadow-sm text-center w-full md:w-1/3 mb-8 md:mb-0">
          <StyledImage source={{ uri: "https://i.pravatar.cc/100?u=a" }} className="w-20 h-20 rounded-full mx-auto -mt-16 border-4 border-white shadow-lg" />
          <StyledText className="text-brand-text italic mt-6">"The quality is just incredible. My salads have never tasted better! Truly a game-changer for my family's health."</StyledText>
          <StyledText className="mt-4 font-bold text-brand-green-light">- Anjali P.</StyledText>
        </StyledView>
        <StyledView className="bg-brand-beige p-8 rounded-xl shadow-sm text-center w-full md:w-1/3 mb-8 md:mb-0">
          <StyledImage source={{ uri: "https://i.pravatar.cc/100?u=b" }} className="w-20 h-20 rounded-full mx-auto -mt-16 border-4 border-white shadow-lg" />
          <StyledText className="text-brand-text italic mt-6">"Reliable, fresh, and always delivered with a smile. Suprabhat has become an essential part of my weekly routine."</StyledText>
          <StyledText className="mt-4 font-bold text-brand-green-light">- Rohan M.</StyledText>
        </StyledView>
        <StyledView className="bg-brand-beige p-8 rounded-xl shadow-sm text-center w-full md:w-1/3">
          <StyledImage source={{ uri: "https://i.pravatar.cc/100?u=c" }} className="w-20 h-20 rounded-full mx-auto -mt-16 border-4 border-white shadow-lg" />
          <StyledText className="text-brand-text italic mt-6">"Finally, a place that values quality over everything. You can feel the passion they have for providing the best produce."</StyledText>
          <StyledText className="mt-4 font-bold text-brand-green-light">- Priya K.</StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  </StyledView>
);

const HomePage = () => {
  return (
    <StyledScrollView className="flex-1 bg-brand-beige">
      <HeroSection />
      <FeaturedProducts />
      <Testimonials />
      <CustomFooter />
    </StyledScrollView>
  );
};

export default HomePage;