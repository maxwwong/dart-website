import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrophy, FaRegSadTear } from 'react-icons/fa';
import { Card } from '../components/common/Card';
import { useAuth } from '../hooks/useAuth';
import { getPlayerMatches, getPlayerById } from '../services/dataService';

const PageHeader = styled.div`
  margin-bottom: 1.5rem;
  
  h1 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-secondary);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
  
  p {
    margin-top: 1rem;
  }
`;

const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MatchCard = styled(Card)`
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const MatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  span {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
`;

const MatchResult = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  font-weight: 500;
  font-size: 0.875rem;
  background-color: ${props => 
    props.isWin ? 'rgba(56, 142, 60, 0.1)' : 'rgba(211, 47, 47, 0.1)'
  };
  color: ${props => 
    props.isWin ? 'var(--success)' : 'var(--error)'
  };
  
  svg {
    margin-right: 0.5rem;
  }
`;

const MatchContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const PlayerInfo = styled.div`
  h3 {
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
`;

const VS = styled.div`
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-secondary);
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }
`;

const Record = styled.p`
  color: var(--text-primary);
  font-weight: 500;
  margin-top: 1rem;
  text-align: center;
`;

export const MatchHistory = () => {
  const { currentUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentRecord, setCurrentRecord] = useState({ wins: 0, losses: 0 });
  
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        if (currentUser) {
          // Get matches for current user
          const userMatches = await getPlayerMatches(currentUser.id);
          
          // Sort by date (latest first)
          const sortedMatches = [...userMatches].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
          );
          
          setMatches(sortedMatches);
          
          // Gather all player IDs from matches
          const playerIds = new Set();
          sortedMatches.forEach(match => {
            playerIds.add(match.player1Id);
            playerIds.add(match.player2Id);
          });
          
          // Fetch player details for all players in matches
          const playerDetails = {};
          await Promise.all([...playerIds].map(async (playerId) => {
            const player = await getPlayerById(playerId);
            if (player) {
              playerDetails[playerId] = player;
            }
          }));
          
          setPlayers(playerDetails);
          
          // Calculate running record
          let wins = 0;
          let losses = 0;
          
          // Count backwards from oldest to newest
          [...sortedMatches].reverse().forEach(match => {
            if (match.winnerId === currentUser.id) {
              wins++;
            } else if (match.loserId === currentUser.id) {
              losses++;
            }
          });
          
          setCurrentRecord({ wins, losses });
        }
      } catch (error) {
        console.error('Error fetching match history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatches();
  }, [currentUser]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <PageHeader>
        <h1>Match History</h1>
        <p>View your past matches and results</p>
      </PageHeader>
      
      {matches.length > 0 ? (
        <>
          <Record>Overall Record: {currentRecord.wins}-{currentRecord.losses}</Record>
          
          <MatchList>
            {matches.map((match, index) => {
              const isWinner = match.winnerId === currentUser.id;
              const opponent = isWinner ? players[match.loserId] : players[match.winnerId];
              
              // Calculate running record up to this match
              let runningWins = 0;
              let runningLosses = 0;
              
              for (let i = matches.length - 1; i >= index; i--) {
                if (matches[i].winnerId === currentUser.id) {
                  runningWins++;
                } else if (matches[i].loserId === currentUser.id) {
                  runningLosses++;
                }
              }
              
              return (
                <MatchCard key={match.id}>
                  <MatchHeader>
                    <span>{new Date(match.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    })}</span>
                    
                    <MatchResult isWin={isWinner}>
                      {isWinner ? (
                        <>
                          <FaTrophy /> Win
                        </>
                      ) : (
                        <>
                          <FaRegSadTear /> Loss
                        </>
                      )}
                    </MatchResult>
                  </MatchHeader>
                  
                  <MatchContent>
                    <PlayerInfo>
                      <h3>{currentUser.name}</h3>
                      <p>Record at time: {runningWins}-{runningLosses}</p>
                    </PlayerInfo>
                    
                    <VS>vs</VS>
                    
                    <PlayerInfo>
                      <h3>{opponent?.name || 'Unknown Player'}</h3>
                      {/* We don't show opponent's record as it would require additional calculation */}
                    </PlayerInfo>
                  </MatchContent>
                </MatchCard>
              );
            })}
          </MatchList>
        </>
      ) : (
        <EmptyState>
          <h3>No Match History</h3>
          <p>You haven't played any matches yet.</p>
        </EmptyState>
      )}
    </div>
  );
};