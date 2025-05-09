import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Import des composants nécessaires (à implémenter plus tard)
// import { LineChart } from "react-native-chart-kit";

// Exemple de données pour les statistiques
const mockWorkoutHistory = [
  { date: "2025-05-05", calories: 280, title: "Jour 1 - Haut du corps" },
  { date: "2025-05-03", calories: 320, title: "Jour 2 - Bas du corps" },
  { date: "2025-05-01", calories: 350, title: "Jour 3 - Full Body" },
  { date: "2025-04-29", calories: 280, title: "Jour 1 - Haut du corps" },
];

const mockWeightData = [
  { date: "2025-05-08", weight: 78.5 },
  { date: "2025-05-01", weight: 79.2 },
  { date: "2025-04-24", weight: 80.1 },
  { date: "2025-04-17", weight: 81.3 },
];

export default function StatsScreen() {
  const [activeTab, setActiveTab] = useState("workouts"); // "workouts" ou "weight"

  const getTotalCalories = () => {
    return mockWorkoutHistory.reduce((total, workout) => total + workout.calories, 0);
  };

  const getWeightLoss = () => {
    if (mockWeightData.length >= 2) {
      return mockWeightData[0].weight - mockWeightData[mockWeightData.length - 1].weight;
    }
    return 0;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Statistiques</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "workouts" && styles.activeTab]}
          onPress={() => setActiveTab("workouts")}
        >
          <Text style={[styles.tabText, activeTab === "workouts" && styles.activeTabText]}>
            Entraînements
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "weight" && styles.activeTab]}
          onPress={() => setActiveTab("weight")}
        >
          <Text style={[styles.tabText, activeTab === "weight" && styles.activeTabText]}>
            Poids
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === "workouts" ? (
          <>
            <View style={styles.statsOverview}>
              <View style={styles.statCard}>
                <MaterialCommunityIcons name="fire" size={28} color="#f97316" />
                <Text style={styles.statValue}>{getTotalCalories()}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
              <View style={styles.statCard}>
                <MaterialCommunityIcons name="calendar-check" size={28} color="#3b82f6" />
                <Text style={styles.statValue}>{mockWorkoutHistory.length}</Text>
                <Text style={styles.statLabel}>Séances</Text>
              </View>
              <View style={styles.statCard}>
                <MaterialCommunityIcons name="dumbbell" size={28} color="#10b981" />
                <Text style={styles.statValue}>320kg</Text>
                <Text style={styles.statLabel}>Soulevé</Text>
              </View>
            </View>

            <View style={styles.chartSection}>
              <Text style={styles.sectionTitle}>Évolution des calories</Text>
              <View style={styles.chartPlaceholder}>
                <Text>Graphique des calories brûlées</Text>
                <Text>(À implémenter avec react-native-chart-kit)</Text>
              </View>
            </View>

            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>Historique récent</Text>
              {mockWorkoutHistory.map((workout, index) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyItemContent}>
                    <Text style={styles.historyItemTitle}>{workout.title}</Text>
                    <Text style={styles.historyItemDate}>
                      {new Date(workout.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.historyItemStats}>
                    <Text style={styles.historyItemCalories}>{workout.calories} cal</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={styles.statsOverview}>
              <View style={[styles.statCard, styles.weightStatCard]}>
                <MaterialCommunityIcons name="scale" size={28} color="#3b82f6" />
                <Text style={styles.statValue}>
                  {mockWeightData.length > 0 ? mockWeightData[0].weight : "--"} kg
                </Text>
                <Text style={styles.statLabel}>Poids actuel</Text>
              </View>
              <View style={[styles.statCard, styles.weightStatCard]}>
                <MaterialCommunityIcons
                  name="trending-down"
                  size={28}
                  color={getWeightLoss() > 0 ? "#10b981" : "#6b7280"}
                />
                <Text
                  style={[
                    styles.statValue,
                    { color: getWeightLoss() > 0 ? "#10b981" : "#6b7280" },
                  ]}
                >
                  {getWeightLoss().toFixed(1)} kg
                </Text>
                <Text style={styles.statLabel}>Perte</Text>
              </View>
            </View>

            <View style={styles.chartSection}>
              <Text style={styles.sectionTitle}>Évolution du poids</Text>
              <View style={styles.chartPlaceholder}>
                <Text>Graphique de l'évolution du poids</Text>
                <Text>(À implémenter avec react-native-chart-kit)</Text>
              </View>
            </View>

            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>Historique des pesées</Text>
              {mockWeightData.map((entry, index) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyItemContent}>
                    <Text style={styles.historyItemTitle}>{entry.weight} kg</Text>
                    <Text style={styles.historyItemDate}>
                      {new Date(entry.date).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.addButton}>
              <MaterialCommunityIcons name="plus" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Ajouter une pesée</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
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
  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6b7280",
  },
  activeTabText: {
    color: "#3b82f6",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsOverview: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  weightStatCard: {
    flex: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  chartSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  historySection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  historyItemContent: {
    flex: 1,
  },
  historyItemTitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  historyItemDate: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  historyItemStats: {
    alignItems: "flex-end",
  },
  historyItemCalories: {
    fontSize: 15,
    fontWeight: "500",
    color: "#f97316",
  },
  addButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
