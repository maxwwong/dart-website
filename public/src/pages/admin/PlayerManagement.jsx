import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaUserPlus, FaArrowLeft } from 'react-icons/fa';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Form, FormInput } from '../../components/common/FormComponents';
import { useAuth } from '../../hooks/useAuth';
import { getPlayers, savePlayer, deletePlayer } from '../../services/dataService';

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

const PlayerTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--divider);
  }
  
  th {
    font-weight: 500;
    color: var(--text-secondary);
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const ActionButtons = styled.div`
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

export const PlayerManagement = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    password: '',
    name: '',
    isAdmin: false,
    schoolEmail: '',
    personalEmail: '',
    phone: '',
    wins: 0,
    losses: 0,
    position: 0,
    previousPosition: 0
  });
  
  useEffect(() => {
    // Redirect if not admin
    if (currentUser && !currentUser.isAdmin) {
      navigate('/');
      return;
    }
    
    const fetchPlayers = async () => {
      try {
        const playersData = await getPlayers();
        // Sort by position
        const sortedPlayers = [...playersData].sort((a, b) => a.position - b.position);
        setPlayers(sortedPlayers);
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlayers();
  }, [currentUser, navigate]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value, 10) || 0
    }));
  };
  
  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      id: `user${Date.now()}`, // Generate a simple ID
      email: '',
      password: '',
      name: '',
      isAdmin: false,
      schoolEmail: '',
      personalEmail: '',
      phone: '',
      wins: 0,
      losses: 0,
      position: players.length + 1,
      previousPosition: players.length + 1
    });
    setShowModal(true);
  };
  
  const openEditModal = (player) => {
    setModalMode('edit');
    setCurrentPlayer(player);
    setFormData({
      ...player
    });
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setCurrentPlayer(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await savePlayer(formData);
      
      if (result.success) {
        // Refresh player list
        const updatedPlayers = await getPlayers();
        const sortedPlayers = [...updatedPlayers].sort((a, b) => a.position - b.position);
        setPlayers(sortedPlayers);
        closeModal();
      }
    } catch (error) {
      console.error('Error saving player:', error);
    }
  };
  
  const handleDelete = async (playerId) => {
    if (!window.confirm('Are you sure you want to delete this player?')) {
      return;
    }
    
    try {
      await deletePlayer(playerId);
      
      // Refresh player list
      const updatedPlayers = await getPlayers();
      const sortedPlayers = [...updatedPlayers].sort((a, b) => a.position - b.position);
      setPlayers(sortedPlayers);
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <PageHeader>
        <h1>Player Management</h1>
        <div>
          <BackButton 
            variant="outline" 
            onClick={() => navigate('/admin')}
          >
            <FaArrowLeft /> Back to Dashboard
          </BackButton>
        </div>
      </PageHeader>
      
      <Card>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <Button onClick={openAddModal}>
            <FaUserPlus style={{ marginRight: '0.5rem' }} /> Add New Player
          </Button>
        </div>
        
        <PlayerTable>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Email</th>
              <th>Record</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id}>
                <td>{player.position}</td>
                <td>{player.name}</td>
                <td>{player.email}</td>
                <td>{player.wins}-{player.losses}</td>
                <td>{player.isAdmin ? 'Yes' : 'No'}</td>
                <td>
                  <ActionButtons>
                    <ActionButton 
                      variant="outline"
                      onClick={() => openEditModal(player)}
                    >
                      <FaEdit />
                    </ActionButton>
                    <ActionButton 
                      variant="error"
                      onClick={() => handleDelete(player.id)}
                    >
                      <FaTrash />
                    </ActionButton>
                  </ActionButtons>
                </td>
              </tr>
            ))}
          </tbody>
        </PlayerTable>
      </Card>
      
      {/* Player Form Modal */}
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <h2>{modalMode === 'add' ? 'Add New Player' : 'Edit Player'}</h2>
              <Button 
                variant="outline" 
                onClick={closeModal}
              >
                &times;
              </Button>
            </ModalHeader>
            
            <Form onSubmit={handleSubmit}>
              <FormInput
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              
              <FormInput
                label="Email (Login)"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              
              <FormInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required={modalMode === 'add'}
                placeholder={modalMode === 'edit' ? 'Leave blank to keep current password' : ''}
              />
              
              <FormInput
                label="School Email"
                name="schoolEmail"
                type="email"
                value={formData.schoolEmail}
                onChange={handleChange}
              />
              
              <FormInput
                label="Personal Email"
                name="personalEmail"
                type="email"
                value={formData.personalEmail}
                onChange={handleChange}
              />
              
              <FormInput
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <FormInput
                  label="Wins"
                  name="wins"
                  type="number"
                  value={formData.wins}
                  onChange={handleNumberChange}
                  min="0"
                />
                
                <FormInput
                  label="Losses"
                  name="losses"
                  type="number"
                  value={formData.losses}
                  onChange={handleNumberChange}
                  min="0"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <FormInput
                  label="Position"
                  name="position"
                  type="number"
                  value={formData.position}
                  onChange={handleNumberChange}
                  min="1"
                />
                
                <FormInput
                  label="Previous Position"
                  name="previousPosition"
                  type="number"
                  value={formData.previousPosition}
                  onChange={handleNumberChange}
                  min="1"
                />
              </div>
              
              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    name="isAdmin"
                    checked={formData.isAdmin}
                    onChange={handleChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Admin User
                </label>
              </div>
              
              <ModalFooter>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {modalMode === 'add' ? 'Add Player' : 'Save Changes'}
                </Button>
              </ModalFooter>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};