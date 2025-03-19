import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrophy, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { 
  getPlayers, 
  getPlayerMatchup, 
  getPlayerById,
  confirmMatchResult
} from '../services/dataService';

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 0;
  }
`;

const MatchupCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MatchupHeader = styled.div`
  text-align: center;
  
  h3 {
    font-size: 1.25rem;
    color: var(--text-primary);
  }
  
  p {
    color: var(--text-secondary);
  }
`;

const MatchupPlayers = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const PlayerBox = styled.div`
  flex: 1;
  text-align: center;
  padding: 1rem;
  
  h4 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin-bottom: 0.25rem;
    color: var(--text-secondary);
  }
`;

const VS = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-secondary);
  margin: 0 1.5rem;
  
  @media (max-width: 768px) {
    margin: 0;
  }
`;

const MatchupActions = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const NoMatchup = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const LeaderboardTable = styled.table`
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

const RankCell = styled.td`
  font-weight: 500;
`;

const PositionChange = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 0.5rem;
  color: ${props => 
    props.change > 0 
      ? 'var(--success)' 
      : props.change < 0 
        ? 'var(--error)' 
        : 'var(--text-disabled)'
  };
`;

const ResultMessage = styled.div`
  text-align: center;
  padding: 1rem;
  margin-top: 1rem;
  background-color: ${props => 
    props.type === 'success' 
      ? 'rgba(56, 142, 60, 0.1)' 
      : 'rgba(211, 47, 47, 0.1)'
  };
  color: ${props => 
    props.type === 'success' 
      ? 'var(--success)' 
      : 'var(--error)'
  };
  border-radius: 4px;
`;

export const Home = () => {
  const { currentUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentMatchup, setCurrentMatchup] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resultMessage, setResultMessage] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch leaderboard data
        const players = await getPlayers();
        const sortedPlayers = [...players].sort((a, b) => a.position - b.position);
        setLeaderboard(sortedPlayers);
        
        // Fetch current matchup
        if (currentUser) {
          const matchup = await getPlayerMatchup(currentUser.id);
          setCurrentMatchup(matchup);
          
          // If matchup exists, get opponent info
          if (matchup) {
            const opponentId = matchup.player1Id === currentUser.id
              ? matchup.player2Id
              : matchup.player1Id;
            
            const opponentData = await getPlayerById(opponentId);
            setOpponent(opponentData);
          }
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser]);
  
  const handleResult = async (isWinner) => {
    if (!currentMatchup) return;
    
    try {
      const result = await confirmMatchResult(
        currentMatchup.id,
        currentUser.id,
        isWinner
      );
      
      if (result.success) {
        // Check if both players have confirmed
        if (currentMatchup.player1Id === currentUser.id) {
          setCurrentMatchup({
            ...currentMatchup,
            player1Confirmed: true
          });
        } else {
          setCurrentMatchup({
            ...currentMatchup,
            player2Confirmed: true
          });
        }
        
        // Show success message
        setResultMessage({
          type: 'success',
          text: isWinner 
            ? 'You have reported a win! Waiting for opponent to confirm.'
            : 'You have reported a loss! Waiting for opponent to confirm.'
        });
      } else {
        setResultMessage({
          type: 'error',
          text: result.message || 'Failed to report match result.'
        });
      }
    } catch (error) {
      console.error('Error reporting result:', error);
      setResultMessage({
        type: 'error',
        text: 'An error occurred. Please try again.'
      });
    }
  };
  
  const isResultSubmitted = () => {
    if (!currentMatchup) return false;
    
    return currentMatchup.player1Id === currentUser.id
      ? currentMatchup.player1Confirmed
      : currentMatchup.player2Confirmed;
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <Section>
        <SectionHeader>
          <h2>Weekly Matchup</h2>
        </SectionHeader>
        
        {currentMatchup && opponent ? (
          <MatchupCard>
            <MatchupHeader>
              <h3>Scheduled Match</h3>
              <p>Week of {new Date(currentMatchup.dateScheduled).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </MatchupHeader>
            
            <MatchupPlayers>
              <PlayerBox>
                <h4>{currentUser.name}</h4>
                <p>Record: {currentUser.wins}-{currentUser.losses}</p>
                <p>Rank: #{leaderboard.findIndex(p => p.id === currentUser.id) + 1}</p>
              </PlayerBox>
              
              <VS>VS</VS>
              
              <PlayerBox>
                <h4>{opponent.name}</h4>
                <p>Record: {opponent.wins}-{opponent.losses}</p>
                <p>Rank: #{leaderboard.findIndex(p => p.id === opponent.id) + 1}</p>
                <p>School Email: {opponent.schoolEmail}</p>
                {opponent.personalEmail && (
                  <p>Personal Email: {opponent.personalEmail}</p>
                )}
                {opponent.phone && (
                  <p>Phone: {opponent.phone}</p>
                )}
              </PlayerBox>
            </MatchupPlayers>
            
            {!isResultSubmitted() ? (
              <MatchupActions>
                <Button 
                  variant="success" 
                  fullWidth
                  onClick={() => handleResult(true)}
                >
                  Report Win
                </Button>
                <Button 
                  variant="secondary" 
                  fullWidth
                  onClick={() => handleResult(false)}
                >
                  Report Loss
                </Button>
              </MatchupActions>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                You have already submitted your result. Waiting for confirmation.
              </div>
            )}
            
            {resultMessage && (
              <ResultMessage type={resultMessage.type}>
                {resultMessage.text}
              </ResultMessage>
            )}
          </MatchupCard>
        ) : (
          <NoMatchup>
            <p>No upcoming match scheduled at this time.</p>
          </NoMatchup>
        )}
      </Section>
      
      <Section>
        <SectionHeader>
          <h2>Leaderboard</h2>
        </SectionHeader>
        
        <Card padding="0">
          <LeaderboardTable>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Record</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, index) => {
                const positionChange = player.previousPosition - player.position;
                
                return (
                  <tr key={player.id} style={{
                    fontWeight: player.id === currentUser.id ? 'bold' : 'normal',
                    backgroundColor: player.id === currentUser.id ? 'rgba(33, 150, 243, 0.05)' : 'inherit'
                  }}>
                    <RankCell>
                      {index === 0 ? (
                        <FaTrophy style={{ color: '#FFD700', marginRight: '0.5rem' }} />
                      ) : null}
                      {player.position}
                    </RankCell>
                    <td>{player.name}</td>
                    <td>{player.wins}-{player.losses}</td>
                    <td>
                      <PositionChange change={positionChange}>
                        {positionChange > 0 ? (
                          <>
                            <FaArrowUp style={{ marginRight: '0.25rem' }} />
                            {positionChange}
                          </>
                        ) : positionChange < 0 ? (
                          <>
                            <FaArrowDown style={{ marginRight: '0.25rem' }} />
                            {Math.abs(positionChange)}
                          </>
                        ) : (
                          <>
                            <FaMinus style={{ marginRight: '0.25rem' }} />
                            0
                          </>
                        )}
                      </PositionChange>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </LeaderboardTable>
        </Card>
      </Section>
    </div>
  );
};