import axios from "axios";

const SPORTSDB_BASE = "https://www.thesportsdb.com/api/v1/json/123";

export const searchPlayer = async (name) => {
  const res = await axios.get(`${SPORTSDB_BASE}/searchplayers.php?p=${encodeURIComponent(name)}`);
  return res.data.player || [];
};

export const getPlayerById = async (id) => {
  const res = await axios.get(`${SPORTSDB_BASE}/lookupplayer.php?id=${id}`);
  return res.data.players ? res.data.players[0] : null;
};

export const searchTeam = async (name) => {
  const res = await axios.get(`${SPORTSDB_BASE}/searchteams.php?t=${encodeURIComponent(name)}`);
  return res.data.teams || [];
};

export const getPlayersByTeamId = async (teamId) => {
  const res = await axios.get(`${SPORTSDB_BASE}/lookup_all_players.php?id=${teamId}`);
  return res.data.player || [];
};
