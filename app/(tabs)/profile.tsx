import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [fatBurnerMode, setFatBurnerMode] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [user, setUser] = useState(null); // null = non connecté

  // Action pour se connecter/déconnecter
  const handleAuthAction = () => {
    if (user) {
      // Si l'utilisateur est connecté, demander confirmation pour se déconnecter
      Alert.alert(
        "Déconnexion",
        "Êtes-vous sûr de vouloir vous déconnecter ?",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Déconnexion",
            style: "destructive",
            onPress: () => {
              setUser(null);
              setSyncEnabled(false);
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      // Si l'utilisateur n'est pas connecté, afficher une simulation de connexion
      // Dans une vraie app, cela ouvrirait un écran de connexion/inscription
      Alert.alert(
        "Connexion",
        "Cette fonctionnalité sera intégrée ultérieurement. Pour le moment, nous simulons une connexion.",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Simuler connexion",
            onPress: () => {
              setUser({
                name: "Utilisateur Test",
                email: "test@example.com",
              });
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil et paramètres</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compte</Text>
        <View style={styles.userSection}>
          <MaterialCommunityIcons name="account-circle" size={64} color="#3b82f6" />
          <View style={styles.userInfo}>
            {user ? (
              <>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </>
            ) : (
              <Text style={styles.loginPrompt}>Non connecté</Text>
            )}
            <TouchableOpacity style={styles.authButton} onPress={handleAuthAction}>
              <Text style={styles.authButtonText}>
                {user ? "Se déconnecter" : "Se connecter"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Préférences</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>Mode sombre</Text>
            <Text style={styles.settingDescription}>Utiliser le thème sombre</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={(value) => setDarkMode(value)}
            trackColor={{ false: "#e5e7eb", true: "#93c5fd" }}
            thumbColor={darkMode ? "#3b82f6" : "#f4f3f4"}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>Mode Fat Burner</Text>
            <Text style={styles.settingDescription}>
              Réduire les temps de pause pour maximiser la perte de graisses
            </Text>
          </View>
          <Switch
            value={fatBurnerMode}
            onValueChange={(value) => setFatBurnerMode(value)}
            trackColor={{ false: "#e5e7eb", true: "#fdba74" }}
            thumbColor={fatBurnerMode ? "#f97316" : "#f4f3f4"}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>Synchronisation</Text>
            <Text style={styles.settingDescription}>
              Sauvegarder vos données dans le cloud (nécessite un compte)
            </Text>
          </View>
          <Switch
            value={syncEnabled}
            disabled={!user}
            onValueChange={(value) => {
              if (user) {
                setSyncEnabled(value);
              } else {
                Alert.alert("Connexion requise", "Vous devez vous connecter pour activer la synchronisation.");
              }
            }}
            trackColor={{ false: "#e5e7eb", true: "#86efac" }}
            thumbColor={syncEnabled ? "#10b981" : "#f4f3f4"}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Langue</Text>
        <TouchableOpacity style={styles.languageOption}>
          <View style={styles.languageInfo}>
            <Text style={styles.languageName}>Français</Text>
            <Text style={styles.languageDescription}>Langue actuelle</Text>
          </View>
          <MaterialCommunityIcons name="check" size={24} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.languageOption}>
          <View style={styles.languageInfo}>
            <Text style={styles.languageName}>English</Text>
            <Text style={styles.languageDescription}>Change to English</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>À propos</Text>
        <TouchableOpacity style={styles.aboutOption}>
          <Text style={styles.aboutOptionText}>Project Fat Loss - Mobile</Text>
          <Text style={styles.versionText}>v1.0.0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.aboutOption}>
          <Text style={styles.aboutOptionText}>Conditions d'utilisation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.aboutOption}>
          <Text style={styles.aboutOptionText}>Politique de confidentialité</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  loginPrompt: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 12,
  },
  authButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  authButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingName: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "500",
  },
  languageDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  aboutOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  aboutOptionText: {
    fontSize: 16,
    color: "#4b5563",
  },
  versionText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
});
