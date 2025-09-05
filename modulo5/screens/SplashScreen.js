import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const SplashScreen = () => {
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    // Animación de fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}></Text>
        </View>
        
        <Text style={styles.title}>Mi Aplicación</Text>
        <Text style={styles.subtitle}>Instituto Técnico Ricaldone</Text>
        
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 50,
    textAlign: 'center',
  },
  loadingContainer: {
    marginTop: 20,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default SplashScreen;