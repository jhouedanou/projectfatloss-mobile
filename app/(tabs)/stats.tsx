import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { getWorkoutHistory, getWorkoutStats } from "../../services/storage";
import { addWeightRecord, getWeightHistory } from "../../services/WeightStorage";

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
  const [loading, setLoading] = useState(true);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [weightHistory, setWeightHistory] = useState([]);
  const [workoutStats, setWorkoutStats] = useState({
    totalSessions: 0,
    totalCalories: 0,
    totalDuration: 0,
    totalWeightLifted: 0
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [refreshKey, setRefreshKey] = useState(0); // Pour forcer le rafraîchissement des données
  
  const screenWidth = Dimensions.get("window").width - 32; // Ajuster la largeur pour les marges

  // Charger les données au démarrage et lorsque refreshKey change
  useEffect(() => {
    loadData();
  }, [refreshKey]);

  // Fonction pour charger toutes les données
  const loadData = async () => {
    setLoading(true);
    try {
      // Charger l'historique des séances
      const workouts = await getWorkoutHistory();
      setWorkoutHistory(workouts);

      // Charger les statistiques d'entraînement
      const stats = await getWorkoutStats();
      setWorkoutStats(stats);

      // Charger l'historique des poids
      const weights = await getWeightHistory();
      setWeightHistory(weights);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      Alert.alert("Erreur", "Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ajouter un nouvel enregistrement de poids
  const handleAddWeight = async () => {
    if (!newWeight || isNaN(parseFloat(newWeight)) || parseFloat(newWeight) <= 0) {
      Alert.alert("Erreur", "Veuillez entrer un poids valide");
      return;
    }

    try {
      await addWeightRecord(parseFloat(newWeight));
      setNewWeight("");
      setModalVisible(false);
      // Rafraîchir les données
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Erreur lors de l'ajout du poids:", error);
      Alert.alert("Erreur", "Impossible d'ajouter l'enregistrement de poids");
    }
  };

  // Préparer les données pour le graphique des calories
  const getCaloriesChartData = () => {
    if (workoutHistory.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [0], color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, strokeWidth: 2 }],
        legend: ["Calories brûlées"]
      };
    }

    const recentWorkouts = workoutHistory.slice(0, 5);
    
    return {
      labels: recentWorkouts.map(workout => {
        const date = new Date(workout.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }),
      datasets: [
        {
          data: recentWorkouts.map(workout => workout.calories || 0),
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // bleu
          strokeWidth: 2
        }
      ],
      legend: ["Calories brûlées"]
    };
  };

  // Préparer les données pour le graphique de poids
  const getWeightChartData = () => {
    if (weightHistory.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [0], color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, strokeWidth: 2 }],
        legend: ["Poids (kg)"]
      };
    }

    return {
      labels: weightHistory.map(item => {
        const date = new Date(item.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }),
      datasets: [
        {
          data: weightHistory.map(item => item.weight),
          color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // rouge
          strokeWidth: 2
        }
      ],
      legend: ["Poids (kg)"]
    };
  };

  // Calculer le changement de poids
  const getWeightChange = () => {
    if (weightHistory.length >= 2) {
      const latest = weightHistory[weightHistory.length - 1].weight;
      const earliest = weightHistory[0].weight;
      return (latest - earliest).toFixed(1);
    }
    return "0.0";
  };

  // Calculer l'IMC (en utilisant une taille fixe de 1.75m pour l'exemple)
  const getBMI = () => {
    if (weightHistory.length === 0) return "0.0";
    const latestWeight = weightHistory[weightHistory.length - 1].weight;
    return (latestWeight / Math.pow(1.75, 2)).toFixed(1);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Chargement des données...</Text>
      </View>
    );
  }

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
                <Text style={styles.statValue}>{workoutStats.totalSessions}</Text>
                <Text style={styles.statLabel}>Séances</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{workoutStats.totalCalories}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{Math.round(workoutStats.totalWeightLifted)} kg</Text>
                <Text style={styles.statLabel}>Soulevé</Text>
              </View>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Calories brûlées</Text>
              {workoutHistory.length > 0 ? (
                <LineChart
                  data={getCaloriesChartData()}
                  width={screenWidth}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>Aucune donnée disponible</Text>
                </View>
              )}
            </View>

            <View style={styles.historyCard}>
              <Text style={styles.historyTitle}>Historique des entraînements</Text>
              {workoutHistory.length > 0 ? (
                workoutHistory.map((workout, index) => (
                  <View key={index} style={styles.historyItem}>
                    <View style={styles.historyLeft}>
                      <Text style={styles.historyDate}>
                        {new Date(workout.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short"
                        })}
                      </Text>
                      <Text style={styles.historyName}>{workout.title}</Text>
                      {workout.exercises?.map((exercise, idx) => (
                        <View key={idx} style={styles.exerciseItem}>
                          <Text style={styles.exercisePause}>
                            {exercise.restAfter ? `Pause: ${exercise.restAfter}s` : ''}
                          </Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.historyRight}>
                      <MaterialCommunityIcons name="fire" size={16} color="#f97316" />
                      <Text style={styles.historyCalories}>{workout.calories}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>Aucun entraînement enregistré</Text>
              )}
            </View>
          </>
        ) : (
          <>
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {weightHistory.length > 0 ? `${weightHistory[weightHistory.length - 1].weight} kg` : "-- kg"}
                </Text>
                <Text style={styles.statLabel}>Poids actuel</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[
                  styles.statValue, 
                  parseFloat(getWeightChange()) > 0 ? styles.negativeChange : styles.positiveChange
                ]}>
                  {getWeightChange() > 0 ? `+${getWeightChange()}` : getWeightChange()} kg
                </Text>
                <Text style={styles.statLabel}>Changement</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{getBMI()}</Text>
                <Text style={styles.statLabel}>IMC</Text>
              </View>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Évolution du poids</Text>
              {weightHistory.length > 0 ? (
                <LineChart
                  data={getWeightChartData()}
                  width={screenWidth}
                  height={220}
                  chartConfig={weightChartConfig}
                  bezier
                  style={styles.chart}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>Aucune donnée disponible</Text>
                </View>
              )}
            </View>

            <View style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>Suivi du poids</Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => setModalVisible(true)}
                >
                  <MaterialCommunityIcons name="plus" size={24} color="#3b82f6" />
                </TouchableOpacity>
              </View>
              
              {weightHistory.length > 0 ? (
                weightHistory.map((data, index) => (
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
                ))
              ) : (
                <Text style={styles.noDataText}>Aucun poids enregistré</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Modal pour ajouter un nouveau poids */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un nouveau poids</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Poids en kg (ex: 75.5)"
              keyboardType="numeric"
              value={newWeight}
              onChangeText={setNewWeight}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddWeight}
              >
                <Text style={[styles.modalButtonText, styles.saveButtonText]}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
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
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    padding: 4,
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
  noDataContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginVertical: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
  },
  saveButton: {
    backgroundColor: "#3b82f6",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
  },
  saveButtonText: {
    color: "#fff",
  },
  exerciseItem: {
    marginLeft: 8,
    marginTop: 4,
  },
  exercisePause: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});
