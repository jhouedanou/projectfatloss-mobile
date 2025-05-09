import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { FirebaseContext } from '../services/FirebaseContext';
import theme from '../src/theme/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const { signup, error } = useContext(FirebaseContext);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/icon.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.appName}>Project Fat Loss</Text>
      </View>
      
      <Text style={styles.title}>Créer un compte</Text>
      
      <View style={styles.formContainer}>
        <TextInput
          style={[
            styles.input, 
            isFocused.email && styles.inputFocused
          ]}
          placeholder="Email"
          placeholderTextColor={theme.colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          onFocus={() => setIsFocused({ ...isFocused, email: true })}
          onBlur={() => setIsFocused({ ...isFocused, email: false })}
        />
        
        <TextInput
          style={[
            styles.input, 
            isFocused.password && styles.inputFocused
          ]}
          placeholder="Mot de passe"
          placeholderTextColor={theme.colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onFocus={() => setIsFocused({ ...isFocused, password: true })}
          onBlur={() => setIsFocused({ ...isFocused, password: false })}
        />
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <TouchableOpacity 
          style={styles.signupButton}
          onPress={() => signup(email, password, navigation)}
        >
          <Text style={styles.signupButtonText}>S'inscrire</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: theme.spacing.l,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    position: 'absolute',
    top: theme.spacing.l,
    left: theme.spacing.l,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: theme.spacing.m,
  },
  appName: {
    fontSize: theme.typography.fontSizes.large,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
  },
  title: { 
    fontSize: theme.typography.fontSizes.xxlarge, 
    marginBottom: theme.spacing.l, 
    textAlign: 'center',
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeights.bold,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: { 
    ...theme.inputs.default,
    marginBottom: theme.spacing.m,
    width: '100%',
  },
  inputFocused: {
    ...theme.inputs.focused,
  },
  error: { 
    color: theme.colors.error, 
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  signupButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    alignItems: 'center',
    marginBottom: theme.spacing.m,
    ...theme.shadows.medium,
  },
  signupButtonText: {
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeights.bold,
    fontSize: theme.typography.fontSizes.medium,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    alignItems: 'center',
  },
  loginButtonText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
    fontSize: theme.typography.fontSizes.medium,
  },
});
