import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../../constants/themes';

const AboutScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>About Suprabhat</Text>
      <View style={styles.card}>
        <Text style={styles.paragraph}>
          Welcome to Suprabhat Fruit and Vegetable Shop! We are a hyper-local, community-focused shop dedicated to bringing you the freshest produce available.
        </Text>
        <Text style={styles.paragraph}>
          Our mission is to replace impersonal, large-scale grocery shopping with a personalized service that you can trust. We believe in quality over quantity, and our curated selection reflects that. Many of our items are sourced directly from local farms, and we often feature "picked today" specials to guarantee absolute freshness.
        </Text>
        <Text style={styles.subtitle}>Our Promise</Text>
        <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listItemText}>
                <Text style={styles.bold}>Freshness Guarantee:</Text> We stand by the quality of our produce.
            </Text>
        </View>
        <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listItemText}>
                 <Text style={styles.bold}>Curated Quality:</Text> Every item is hand-selected by our team.
            </Text>
        </View>
        <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listItemText}>
                 <Text style={styles.bold}>Personalized Service:</Text> We're your friendly neighborhood shop, now online!
            </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brandBeige,
    padding: SIZES.medium,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.brandText,
    marginBottom: SIZES.medium,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  paragraph: {
    fontSize: SIZES.medium,
    lineHeight: SIZES.xl,
    color: COLORS.brandText,
    marginBottom: SIZES.medium,
  },
  subtitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginTop: SIZES.small,
    marginBottom: SIZES.small,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.small,
  },
  bullet: {
    fontSize: SIZES.medium,
    marginRight: SIZES.small,
    lineHeight: SIZES.xl,
  },
  listItemText: {
    flex: 1,
    fontSize: SIZES.medium,
    lineHeight: SIZES.xl,
  },
  bold: {
    fontWeight: 'bold',
  }
});

export default AboutScreen;