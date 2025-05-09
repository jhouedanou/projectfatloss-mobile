import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";

// Exemple de données pour les statistiques
const mockWorkoutHistory = [
  { date: "2025-05-07", calories: 310, title: "Jour 5 - Pull (Variation)" },
  { date: "2025-05-05", calories: 280, title: "Jour 1 - Push (Pectoraux, Épaules, Triceps)" },
  { date: "2025-05-03", calories: 320, title: "Jour 2 - Pull (Dos, Biceps)" },
  { date: "2025-05-01", calories: 350, title: "Jour 3 - Legs (Jambes, Fessiers)" },
  { date: "2025-04-29", calories: 300, title: "Jour 4 - Push (Variation)" },
  { date: "2025-04-27", calories: 330, title: "Jour 6 - Legs (Variation)" },
];

const mockWeightData = [
  { date: "2025-05-08", weight: 78.5 },
  { date: "2025-05-01", weight: 79.2 },
  { date: "2025-04-24", weight: 80.1 },
  { date: "2025-04-17", weight: 81.3 },
];

// Préparer les données pour le graphique des calories
const caloriesChartData = {
  labels: mockWorkoutHistory.slice(0, 5).map(workout => {
    const date = new Date(workout.date);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  }).reverse(),
  datasets: [
    {
      data: mockWorkoutHistory.slice(0, 5).map(workout => workout.calories).reverse(),
      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // bleu
      strokeWidth: 2
    }
  ],
  legend: ["Calories brûlées"]
};

// Préparer les données pour le graphique de poids
const weightChartData = {
  labels: mockWeightData.map(item => {
    const date = new Date(item.date);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  }),
  datasets: [
    {
      data: mockWeightData.map(item => item.weight),
      color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // rouge
      strokeWidth: 2
    }
  ],
  legend: ["Poids (kg)"]
};

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
  style: {
    borderRadius: 16
  },
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#3b82f6"
  }
};

const weightChartConfig = {
  ...chartConfig,
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#ef4444"
  }
};

export default function StatsScreen() {
  const [activeTab, setActiveTab] = useState("workouts"); // "workouts" ou "weight"
  const screenWidth = Dimensions.get("window").width - 32; // Ajuster la largeur pour les marges

  const getTotalCalories = () => {
    return mockWorkoutHistory.reduce((total, workout) => total + workout.calories, 0);
  };

  const getWeightLoss = () => {
    if (mockWeightData.length >= 2) {
      return (mockWeightData[mockWeightData.length - 1].weight - mockWeightData[0].weight).toFixed(1);
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
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{mockWorkoutHistory.length}</Text>
                <Text style={styles.statLabel}>Séances</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{getTotalCalories()}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>16h</Text>
                <Text style={styles.statLabel}>Temps total</Text>
              </View>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Calories brûlées</Text>
              <LineChart
                data={caloriesChartData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>

            <View style={styles.historyCard}>
              <Text style={styles.historyTitle}>Historique des entraînements</Text>
              {mockWorkoutHistory.map((workout, index) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyLeft}>
                    <Text style={styles.historyDate}>
                      {new Date(workout.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short"
                      })}
                    </Text>
                    <Text style={styles.historyName}>{workout.title}</Text>
                  </View>
                  <View style={styles.historyRight}>
                    <MaterialCommunityIcons name="fire" size={16} color="#f97316" />
                    <Text style={styles.historyCalories}>{workout.calories}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {mockWeightData[0].weight} kg
                </Text>
                <Text style={styles.statLabel}>Poids actuel</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, parseFloat(getWeightLoss()) > 0 ? styles.negativeChange : styles.positiveChange]}>
                  {getWeightLoss() > 0 ? `+${getWeightLoss()}` : getWeightLoss()} kg
                </Text>
                <Text style={styles.statLabel}>Changement</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {(mockWeightData[0].weight / Math.pow(1.75, 2)).toFixed(1)}
                </Text>
                <Text style={styles.statLabel}>IMC</Text>
              </View>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Évolution du poids</Text>
              <LineChart
                data={weightChartData}
                width={screenWidth}
                height={220}
                chartConfig={weightChartConfig}
                bezier
                style={styles.chart}
              />
            </View>

            <View style={styles.historyCard}>
              <Text style={styles.historyTitle}>Suivi du poids</Text>
              {mockWeightData.map((data, index) => (
                <View key={index} style={styles.historyItem}>
                  <Text style={styles.historyDate}>
                    {new Date(data.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </Text>
                  <Text style={styles.weightValue}>{data.weight} kg</Text>
                </View>
              ))}
            </View>
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
    fontSize: 16,
    color: "#6b7280",
  },
  activeTabText: {
    color: "#3b82f6",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  historyLeft: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    color: "#6b7280",
  },
  historyName: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
  },
  historyRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyCalories: {
    fontSize: 16,
    fontWeight: "500",
    color: "#f97316",
    marginLeft: 4,
  },
  weightValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  positiveChange: {
    color: "#10b981", // vert
  },
  negativeChange: {
    color: "#ef4444", // rouge
  },
});
