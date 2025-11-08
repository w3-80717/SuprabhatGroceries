import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../../constants/themes';

const ContactScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Get In Touch</Text>
        <Text style={styles.subtitle}>
          We'd love to hear from you! Our team is ready to answer all your questions.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contact Information</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={24} color={COLORS.brandAccent} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Our Location</Text>
            <Text style={styles.infoValue}>Pune, Maharashtra, India</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL('mailto:suprabhat.fresh@example.com')}>
          <Ionicons name="mail-outline" size={24} color={COLORS.brandAccent} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Email Us</Text>
            <Text style={styles.infoValue}>suprabhat.fresh@example.com</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL('tel:+919876543210')}>
          <Ionicons name="call-outline" size={24} color={COLORS.brandAccent} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Call Us</Text>
            <Text style={styles.infoValue}>+91 98765 43210</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* A simple contact form UI without functionality for now */}
      <View style={styles.card}>
          <Text style={styles.cardTitle}>Send us a Message</Text>
          <TextInput style={styles.input} placeholder="Full Name" />
          <TextInput style={styles.input} placeholder="Email Address" keyboardType="email-address" />
          <TextInput style={[styles.input, {height: 100}]} placeholder="Your Message" multiline textAlignVertical="top" />
          <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Send Message</Text>
          </TouchableOpacity>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brandBeige,
  },
  header: {
    padding: SIZES.large,
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.brandGreen,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SIZES.base,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.large,
    marginHorizontal: SIZES.medium,
    marginBottom: SIZES.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: SIZES.medium,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  infoTextContainer: {
    marginLeft: SIZES.medium,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  infoValue: {
    color: COLORS.gray,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: SIZES.small,
    borderRadius: SIZES.base,
    marginBottom: SIZES.medium,
    fontSize: SIZES.medium,
  },
  button: {
    backgroundColor: COLORS.brandAccent,
    padding: SIZES.medium,
    borderRadius: SIZES.base,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: SIZES.medium,
  },
});

export default ContactScreen;