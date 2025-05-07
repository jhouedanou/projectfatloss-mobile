import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  getWeightHistory, 
  addWeightRecord, 
  deleteWeightRecord,
  getWeightStats
} from '../services/WeightStorage';

function WeightTracker() {
  const [weightRecords, setWeightRecords] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [stats, setStats] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Charger les données au démarrage
  useEffect(() => {
    loadWeightData();
  }, []);
  
  // Fonction pour charger les données de poids
  const loadWeightData = () => {
    const history = getWeightHistory();
    setWeightRecords(history);
    
    // Récupérer les statistiques
    const weightStats = getWeightStats();
    setStats(weightStats);
  };
  
  // Fonction pour ajouter un nouvel enregistrement
  const handleAddWeight = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const weightValue = parseFloat(newWeight.replace(',', '.'));
      
      if (isNaN(weightValue) || weightValue <= 0) {
        setError('Veuillez entrer un poids valide');
        return;
      }
      
      // Ajouter l'enregistrement
      addWeightRecord(weightValue, null, notes);
      
      // Recharger les données
      loadWeightData();
      
      // Réinitialiser le formulaire
      setNewWeight('');
      setNotes('');
      setSuccess('Poids enregistré avec succès !');
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'enregistrement du poids');
    }
  };
  
  // Fonction pour supprimer un enregistrement
  const handleDeleteRecord = (id) => {
    try {
      deleteWeightRecord(id);
      loadWeightData();
      setSuccess('Enregistrement supprimé avec succès !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erreur lors de la suppression de l\'enregistrement');
    }
  };
  
  // Préparer les données pour le graphique
  const chartData = weightRecords.map(record => ({
    date: format(new Date(record.date), 'dd/MM/yy'),
    poids: record.weight,
    // Ajouter un point pour chaque 10kg (pour référence)
    référence: record.weight > 10 ? Math.floor(record.weight / 10) * 10 : null
  }));
  
  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
  };
  
  return (
    <div className="weight-tracker">
      <h2>Suivi de Poids</h2>
      
      {/* Formulaire d'ajout de poids */}
      <div className="weight-form-container">
        <form onSubmit={handleAddWeight} className="weight-form">
          <div className="form-group">
            <label htmlFor="weight">Poids (kg):</label>
            <input
              type="number"
              id="weight"
              min="30"
              max="300"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              required
              placeholder="Ex: 75.5"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">Notes (optionnel):</label>
            <input
              type="text"
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Après cardio"
            />
          </div>
          
          <button type="submit" className="add-weight-btn">Ajouter</button>
        </form>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>
      
      {/* Statistiques de poids */}
      {stats.current && (
        <div className="weight-stats">
          <div className="stat-card current-weight">
            <div className="stat-title">Poids actuel</div>
            <div className="stat-value">{stats.current.weight} kg</div>
            <div className="stat-date">{formatDate(stats.current.date)}</div>
          </div>
          
          {stats.initial && stats.current.id !== stats.initial.id && (
            <div className={`stat-card weight-change ${stats.change <= 0 ? 'positive' : 'negative'}`}>
              <div className="stat-title">Évolution</div>
              <div className="stat-value">
                {stats.change > 0 ? '+' : ''}
                {stats.change.toFixed(1)} kg
              </div>
              <div className="stat-percentage">
                {stats.change > 0 ? '+' : ''}
                {stats.changePercentage.toFixed(1)}%
              </div>
            </div>
          )}
          
          <div className="stat-card min-max">
            <div className="min-weight">
              <span className="stat-label">Min:</span>
              <span className="stat-value">{stats.lowestRecord.weight} kg</span>
            </div>
            <div className="max-weight">
              <span className="stat-label">Max:</span>
              <span className="stat-value">{stats.highestRecord.weight} kg</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Graphique d'évolution */}
      {weightRecords.length > 0 ? (
        <div className="weight-chart">
          <h3>Évolution du poids</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="poids" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="référence" 
                stroke="#82ca9d" 
                strokeDasharray="5 5" 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="no-weight-data">
          <p>Aucun enregistrement de poids pour le moment.</p>
          <p>Utilisez le formulaire ci-dessus pour commencer à suivre votre poids.</p>
        </div>
      )}
      
      {/* Historique des enregistrements */}
      {weightRecords.length > 0 && (
        <div className="weight-history">
          <h3>Historique</h3>
          <div className="weight-records-list">
            {weightRecords.slice().reverse().map(record => (
              <div key={record.id} className="weight-record">
                <div className="record-date">{formatDate(record.date)}</div>
                <div className="record-weight">{record.weight} kg</div>
                {record.notes && <div className="record-notes">{record.notes}</div>}
                <button 
                  className="delete-record" 
                  onClick={() => handleDeleteRecord(record.id)}
                  aria-label="Supprimer"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeightTracker;
