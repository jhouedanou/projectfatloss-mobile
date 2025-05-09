import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ExerciseVideoModalProps {
  isVisible: boolean;
  videoId: string;
  exerciseName: string;
  onClose: () => void;
}

const ExerciseVideoModal = ({ isVisible, videoId, exerciseName, onClose }: ExerciseVideoModalProps) => {
  const [loading, setLoading] = useState(true);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>{exerciseName}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.videoContainer}>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Chargement de la vidéo...</Text>
              </View>
            )}
            
            <WebView
              source={{ uri: `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1` }}
              style={styles.webview}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              allowsFullscreenVideo={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');
const videoWidth = width * 0.9;
const videoHeight = videoWidth * 0.6; // 16:9 ratio

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: videoWidth,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: 8,
  },
  closeButton: {
    padding: 4,
  },
  videoContainer: {
    height: videoHeight,
    backgroundColor: '#000',
    position: 'relative',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 1,
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
  },
  webview: {
    flex: 1,
  },
});

export default ExerciseVideoModal;
