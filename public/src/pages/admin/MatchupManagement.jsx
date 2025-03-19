import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Form, FormInput, FormSelect } from '../../components/common/FormComponents';
import { useAuth } from '../../hooks/useAuth';
import { getPlayers, getMatchups, saveMatchups } from '../../services/dataService';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h1 {
    font-size: 1.75rem;
    margin-bottom: 0;
  }
`;

const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const WeekHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    margin-bottom: 0;
  }
`;

const MatchupList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MatchupItem = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlayerNames = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  
  span {
    margin: 0 1rem;
    color: var(--text-secondary);
  }
`;

const MatchupDate = styled.div`
  margin-right: 1rem;
  color: var(--text-secondary);
`;

const MatchupActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(Button)`
  padding: 0.5rem;
  min-width: auto;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(Card)`
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    margin-bottom: 0;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

export const MatchupManagement = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [matchupsData, setMatchupsData] = useState({ week: '', matchups: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', or 'week'
  const [currentMatchup, setCurrentMatchup] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    player1Id: '',
    player2Id: '',
    dateScheduled: '',
    status: 'scheduled',
    player1Confirmed: false,
    player2Confirmed: false
  });
  const [weekForm, setWeekForm] = useState({
    week: ''
  });
  
  useEffect(() => {
    // Redirect if not admin
    if (currentUser && !currentUser.isAdmin) {
      navigate('/');
      return;
    }
    
    const fetchData = async () => {
      try {
        // Fetch players
        const playersData = await getPlayers();
        setPlayers(playersData);
        
        // Fetch matchups
        const matchups = await getMatchups();
        setMatchupsData(matchups);
      } catch (error) {
        console.error('Error fetching matchup data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleWeekChange = (e) => {
    const { name, value } = e.target;
    setWeekForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      id: `matchup${Date.now()}`,
      player1Id: '',
      player2Id: '',
      dateScheduled: new Date().toISOString().split('T')[0],
      status: 'scheduled',
      player1Confirmed: false,
      player2Confirmed: false
    });
    setShowModal(true);
  };
  
  const openEditModal = (matchup) => {
    setModalMode('edit');
    setCurrentMatchup(matchup);
    setFormData({
      ...matchup,
      dateScheduled: new Date(matchup.dateScheduled).toISOString().split('T')[0]
    });
    setShowModal(true);
  };
  
  const openWeekModal = () => {
    setModalMode('week');
    setWeekForm({
      week: matchupsData.week || `Week of ${new Date().toLocaleDateString()}`
    });
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setCurrentMatchup(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create a copy of the current matchups
      const updatedMatchups = { ...matchupsData };
      
      if (modalMode === 'add') {
        // Add new matchup
        updatedMatchups.matchups.push(formData);
      } else if (modalMode === 'edit') {
        // Update existing matchup
        const index = updatedMatchups.matchups.findIndex(m => m.id === formData.id);
        if (index !== -1) {
          updatedMatchups.matchups[index] = formData;
        }
      } else if (modalMode === 'week') {
        // Update week
        updatedMatchups.week = weekForm.week;
      }
      
      // Save to server
      const result = await saveMatchups(updatedMatchups);
      
      if (result.success) {
        setMatchupsData(updatedMatchups);
        closeModal();
      }
    } catch (error) {
      console.error('Error saving matchup:', error);
    }
  };
  
  const handleDelete = async (matchupId) => {
    if (!window.confirm('Are you sure you want to delete this matchup?')) {
      return;
    }
    
    try {
      // Create a copy of the current matchups
      const updatedMatchups = { ...matchupsData };
      
      // Remove the matchup
      updatedMatchups.matchups = updatedMatchups.matchups.filter(m => m.id !== matchupId);
      
      // Save to server
      const result = await saveMatchups(updatedMatchups);
      
      if (result.success) {
        setMatchupsData(updatedMatchups);
      }
    } catch (error) {
      console.error('Error deleting matchup:', error);
    }
  };
  
  const getPlayerName = (playerId) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown Player';
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <PageHeader>
        <h1>Matchup Management</h1>
        <BackButton 
          variant="outline" 
          onClick={() => navigate('/admin')}
        >
          <FaArrowLeft /> Back to Dashboard
        </BackButton>
      </PageHeader>
      
      <Card>
        <WeekHeader>
          <h2>{matchupsData.week || 'Current Week'}</h2>
          <Button variant="outline" onClick={openWeekModal}>
            Edit Week
          </Button>
        </WeekHeader>
        
        {matchupsData.matchups.length > 0 ? (
          <MatchupList>
            {matchupsData.matchups.map((matchup) => (
              <MatchupItem key={matchup.id}>
                <PlayerNames>
                  <strong>{getPlayerName(matchup.player1Id)}</strong>
                  <span>vs</span>
                  <strong>{getPlayerName(matchup.player2Id)}</strong>
                </PlayerNames>
                
                <MatchupDate>
                  {new Date(matchup.dateScheduled).toLocaleDateString()}
                </MatchupDate>
                
                <MatchupActions>
                  <ActionButton 
                    variant="outline"
                    onClick={() => openEditModal(matchup)}
                  >
                    <FaEdit />
                  </ActionButton>
                  <ActionButton 
                    variant="error"
                    onClick={() => handleDelete(matchup.id)}
                  >
                    <FaTrash />
                  </ActionButton>
                </MatchupActions>
              </MatchupItem>
            ))}
          </MatchupList>
        ) : (
          <EmptyState>
            <p>No matchups scheduled for this week.</p>
          </EmptyState>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <Button onClick={openAddModal}>
            <FaPlus style={{ marginRight: '0.5rem' }} /> Add New Matchup
          </Button>
        </div>
      </Card>
      
      {/* Matchup Form Modal */}
      {showModal && modalMode !== 'week' && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <h2>{modalMode === 'add' ? 'Add New Matchup' : 'Edit Matchup'}</h2>
              <Button 
                variant="outline" 
                onClick={closeModal}
              >
                &times;
              </Button>
            </ModalHeader>
            
            <Form onSubmit={handleSubmit}>
              <FormSelect
                label="Player 1"
                name="player1Id"
                value={formData.player1Id}
                onChange={handleChange}
                required
                options={players.map(player => ({
                  value: player.id,
                  label: player.name
                }))}
              />
              
              <FormSelect
                label="Player 2"
                name="player2Id"
                value={formData.player2Id}
                onChange={handleChange}
                required
                options={players
                  .filter(player => player.id !== formData.player1Id)
                  .map(player => ({
                    value: player.id,
                    label: player.name
                  }))
                }
              />
              
              <FormInput
                label="Scheduled Date"
                name="dateScheduled"
                type="date"
                value={formData.dateScheduled}
                onChange={handleChange}
                required
              />
              
              <FormSelect
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                options={[
                  { value: 'scheduled', label: 'Scheduled' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' }
                ]}
              />
              
              <ModalFooter>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {modalMode === 'add' ? 'Add Matchup' : 'Save Changes'}
                </Button>
              </ModalFooter>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {/* Week Form Modal */}
      {showModal && modalMode === 'week' && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <h2>Edit Week</h2>
              <Button 
                variant="outline" 
                onClick={closeModal}
              >
                &times;
              </Button>
            </ModalHeader>
            
            <Form onSubmit={handleSubmit}>
              <FormInput
                label="Week Name"
                name="week"
                value={weekForm.week}
                onChange={handleWeekChange}
                required
                placeholder="e.g., Week of March 20, 2025"
              />
              
              <ModalFooter>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </ModalFooter>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};