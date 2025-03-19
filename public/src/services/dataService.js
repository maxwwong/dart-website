import axios from 'axios';

// Helper function to get data from JSON files
const getData = async (file) => {
  try {
    const response = await axios.get(`/data/${file}.json`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${file} data:`, error);
    throw error;
  }
};

// In a real app, you would use a server endpoint to save data
// This is a simulated "save" that would normally be handled by a backend
// For the purpose of this demo, we'll just log the data that would be saved
const saveData = (file, data) => {
  console.log(`Saving to ${file}.json:`, data);
  // In a real application with a proper backend:
  // return axios.post(`/api/${file}`, data);
  
  // For demo purposes, we'll simulate successful saving:
  return Promise.resolve({ success: true, data });
};

// Player services
export const getPlayers = async () => {
  const data = await getData('players');
  return data.players;
};

export const savePlayer = async (player) => {
  const players = await getPlayers();
  const existingPlayerIndex = players.findIndex(p => p.id === player.id);
  
  if (existingPlayerIndex !== -1) {
    // Update existing player
    players[existingPlayerIndex] = player;
  } else {
    // Add new player
    players.push(player);
  }
  
  return saveData('players', { players });
};

export const deletePlayer = async (playerId) => {
  const players = await getPlayers();
  const filteredPlayers = players.filter(p => p.id !== playerId);
  return saveData('players', { players: filteredPlayers });
};

// Match services
export const getMatches = async () => {
  const data = await getData('matches');
  return data.matches;
};

export const saveMatch = async (match) => {
  const matches = await getMatches();
  const existingMatchIndex = matches.findIndex(m => m.id === match.id);
  
  if (existingMatchIndex !== -1) {
    // Update existing match
    matches[existingMatchIndex] = match;
  } else {
    // Add new match
    matches.push(match);
  }
  
  return saveData('matches', { matches });
};

// Matchup services
export const getMatchups = async () => {
  const data = await getData('matchups');
  return data;
};

export const saveMatchups = async (matchupsData) => {
  return saveData('matchups', matchupsData);
};

// Authentication service
export const authenticateUser = async (email, password) => {
  try {
    const players = await getPlayers();
    const user = players.find(
      player => player.email === email && player.password === password
    );
    
    if (user) {
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    } else {
      return { success: false, message: "Invalid email or password" };
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return { success: false, message: "Authentication failed" };
  }
};

// Get player details by ID
export const getPlayerById = async (playerId) => {
  const players = await getPlayers();
  const player = players.find(p => p.id === playerId);
  
  if (player) {
    const { password, ...playerWithoutPassword } = player;
    return playerWithoutPassword;
  }
  
  return null;
};

// Get current week's matchup for player
export const getPlayerMatchup = async (playerId) => {
  const matchupsData = await getMatchups();
  const currentMatchup = matchupsData.matchups.find(
    matchup => matchup.player1Id === playerId || matchup.player2Id === playerId
  );
  
  return currentMatchup;
};

// Get player's match history
export const getPlayerMatches = async (playerId) => {
  const matches = await getMatches();
  return matches.filter(
    match => match.player1Id === playerId || match.player2Id === playerId
  );
};

// Confirm match result
export const confirmMatchResult = async (matchId, playerId, isWinner) => {
  const matches = await getMatches();
  const match = matches.find(m => m.id === matchId);
  
  if (!match) {
    return { success: false, message: "Match not found" };
  }
  
  if (match.player1Id === playerId) {
    match.player1Confirmed = true;
    if (isWinner) {
      match.winnerId = playerId;
      match.loserId = match.player2Id;
    } else {
      match.winnerId = match.player2Id;
      match.loserId = playerId;
    }
  } else if (match.player2Id === playerId) {
    match.player2Confirmed = true;
    if (isWinner) {
      match.winnerId = playerId;
      match.loserId = match.player1Id;
    } else {
      match.winnerId = match.player1Id;
      match.loserId = playerId;
    }
  } else {
    return { success: false, message: "Player not in this match" };
  }
  
  // If both players have confirmed, update match status
  if (match.player1Confirmed && match.player2Confirmed) {
    match.status = "completed";
    
    // Update player win/loss records
    const players = await getPlayers();
    const winner = players.find(p => p.id === match.winnerId);
    const loser = players.find(p => p.id === match.loserId);
    
    if (winner && loser) {
      winner.wins += 1;
      loser.losses += 1;
      
      await savePlayer(winner);
      await savePlayer(loser);
    }
  }
  
  await saveMatch(match);
  return { success: true, match };
};