import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUserPlus, FaCalendarAlt, FaListAlt, FaTrophy } from 'react-icons/fa';
import { Card } from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import { getPlayers, getMatches, getMatchups } from '../../services/dataService';

const DashboardHeader = styled.div`
  margin-bottom: 1.5rem;
  
  h1 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-secondary);
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatsCard = styled(Card)`
  text-align: center;
  
  .icon {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-secondary);
  }
`;

const ActionCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: 1rem;
    flex: 1;
  }
  
  a {
    text-decoration: none;
  }
`;

const Section = styled.section`
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

export const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPlayers: 0,
    activeMatchups: 0,
    completedMatches: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if not admin
    if (currentUser && !currentUser.isAdmin) {
      navigate('/');
    }
    
    const fetchDashboardData = async () => {
      try {
        // Fetch players
        const players = await getPlayers();
        
        // Fetch matches
        const matches = await getMatches();
        const completedMatches = matches.filter(match => match.status === 'completed');
        
        // Fetch matchups
        const matchupsData = await getMatchups();
        const activeMatchups = matchupsData.matchups.filter(matchup => matchup.status === 'scheduled');
        
        // Set stats
        setStats({
          totalPlayers: players.length,
          activeMatchups: activeMatchups.length,
          completedMatches: completedMatches.length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [currentUser, navigate]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <DashboardHeader>
        <h1>Admin Dashboard</h1>
        <p>Manage your dart tournament</p>
      </DashboardHeader>
      
      <Section>
        <h2>Tournament Stats</h2>
        <DashboardGrid>
          <StatsCard>
            <div className="icon">
              <FaUserPlus />
            </div>
            <h3>{stats.totalPlayers}</h3>
            <p>Total Players</p>
          </StatsCard>
          
          <StatsCard>
            <div className="icon">
              <FaCalendarAlt />
            </div>
            <h3>{stats.activeMatchups}</h3>
            <p>Active Matchups</p>
          </StatsCard>
          
          <StatsCard>
            <div className="icon">
              <FaListAlt />
            </div>
            <h3>{stats.completedMatches}</h3>
            <p>Completed Matches</p>
          </StatsCard>
        </DashboardGrid>
      </Section>
      
      <Section>
        <h2>Quick Actions</h2>
        <DashboardGrid>
          <ActionCard>
            <h3>Manage Players</h3>
            <p>Add, edit, or remove players from the tournament.</p>
            <Link to="/admin/players">
              <button className="btn btn-primary w-100">Go to Player Management</button>
            </Link>
          </ActionCard>
          
          <ActionCard>
            <h3>Set Matchups</h3>
            <p>Create and manage weekly player matchups.</p>
            <Link to="/admin/matchups">
              <button className="btn btn-primary w-100">Go to Matchup Management</button>
            </Link>
          </ActionCard>
          
          <ActionCard>
            <h3>Leaderboard Rankings</h3>
            <p>Adjust player rankings and positions.</p>
            <Link to="/admin/rankings">
              <button className="btn btn-primary w-100">Go to Rankings</button>
            </Link>
          </ActionCard>
          
          <ActionCard>
            <h3>Match History</h3>
            <p>View and edit all match records.</p>
            <Link to="/admin/matches">
              <button className="btn btn-primary w-100">View All Matches</button>
            </Link>
          </ActionCard>
        </DashboardGrid>
      </Section>
    </div>
  );
};