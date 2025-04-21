import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
    // suivre changement champs de mail et ausi champ mot de passe
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
    // faire fonction login
  const handleLogin = async () => {

    if (!email || !motDePasse) {
      Alert.alert('Champs vides', 'Veuillez remplir tous les champs');
      return false;
    }

    try {

      const res = await fetch(`http://192.168.1.199:3033/auth/connexion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mot_de_passe: motDePasse }),
      });

      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Erreur", "Identifiants incorrects.");
        return;
      }

      await AsyncStorage.setItem("id_utilisateur", data.id_utilisateur.toString());

      navigation.navigate("Reservations"); 

    } catch (err) {
      Alert.alert("Erreur", "Problème de connexion.");
    }
  };

  return (
    // view c comme <div> en html react normal
    <View style={styles.container}>
      <Text style={styles.title}>Connexion 🔐</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#bbb"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#bbb"
        secureTextEntry={true}
        value={motDePasse}
        onChangeText={setMotDePasse}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>SE CONNECTER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#222',
    borderRadius: 8,
    paddingHorizontal: 15,
    color: '#fff',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#ff4081',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
