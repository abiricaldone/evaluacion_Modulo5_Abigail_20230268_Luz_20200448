import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const EditProfileScreen = ({ route, navigation }) => {
  const { userData } = route.params;
  const [formData, setFormData] = useState({
    nombre: userData?.nombre || '',
    tituloUniversitario: userData?.tituloUniversitario || '',
    anoGraduacion: userData?.anoGraduacion?.toString() || '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { nombre, tituloUniversitario, anoGraduacion } = formData;
    
    if (!nombre || !tituloUniversitario || !anoGraduacion) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return false;
    }

    const currentYear = new Date().getFullYear();
    if (anoGraduacion < 1950 || anoGraduacion > currentYear) {
      Alert.alert('Error', 'Año de graduación inválido');
      return false;
    }
    
    return true;
  };

  const handleUpdateProfile = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'usuarios', user.uid), {
          nombre: formData.nombre,
          tituloUniversitario: formData.tituloUniversitario,
          anoGraduacion: parseInt(formData.anoGraduacion),
          fechaActualizacion: new Date().toISOString(),
        });
        
        Alert.alert('Éxito', 'Información actualizada correctamente', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      Alert.alert('Error', 'No se pudo actualizar la información');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Editar Perfil</Text>
          <Text style={styles.subtitle}>Actualiza tu información</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={formData.nombre}
            onChangeText={(text) => handleInputChange('nombre', text)}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            placeholder="Correo electrónico"
            value={userData?.email || auth.currentUser?.email}
            editable={false}
          />
          <Text style={styles.helperText}>
            * El correo electrónico no se puede modificar
          </Text>

          <Text style={styles.label}>Título universitario</Text>
          <TextInput
            style={styles.input}
            placeholder="Título universitario"
            value={formData.tituloUniversitario}
            onChangeText={(text) => handleInputChange('tituloUniversitario', text)}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Año de graduación</Text>
          <TextInput
            style={styles.input}
            placeholder="Año de graduación"
            value={formData.anoGraduacion}
            onChangeText={(text) => handleInputChange('anoGraduacion', text)}
            keyboardType="numeric"
            maxLength={4}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleUpdateProfile}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Actualizando...' : 'Actualizar Información'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputDisabled: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
  },
  helperText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: -12,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#1e3a8a',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  cancelButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;