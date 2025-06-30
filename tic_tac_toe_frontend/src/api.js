//
// API service layer for frontend-backend integration
//
// Handles all REST calls to the FastAPI backend, managing
// Supabase user authentication and token/session handling.
// Use these methods in React components to interact with backend.
//

import { supabase } from "./supabaseClient";

// PUBLIC_INTERFACE
/**
 * Setup: Configure backend API root via .env or default
 * You may want to use a proxy in development for CORS if backend is on a different port.
 */
const API_ROOT =
  process.env.REACT_APP_BACKEND_API_URL || "http://localhost:8000"; // Update for prod deployment

// PUBLIC_INTERFACE
export async function getSessionToken() {
  /**
   * Returns: String | null (access token) for current user session.
   */
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session ? session.access_token : null;
}

/**
 * Helper to send authorized fetch to backend.
 */
async function fetchWithAuth(url, options = {}) {
  const token = await getSessionToken();
  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
}

// PUBLIC_INTERFACE
/**
 * Start a new Tic Tac Toe game.
 * @param {'ai'|'user'} opponent - "ai" or "user"
 * @returns {Promise<Object>} {game_id, ...}
 */
export async function startGame(opponent = "ai") {
  const res = await fetchWithAuth(`${API_ROOT}/game/start`, {
    method: "POST",
    body: JSON.stringify({ opponent }),
  });
  return res.json();
}

// PUBLIC_INTERFACE
/**
 * Make a move.
 * @param {string} gameId
 * @param {number} row
 * @param {number} col
 * @returns {Promise<Object>} - move result/status
 */
export async function makeMove(gameId, row, col) {
  const res = await fetchWithAuth(`${API_ROOT}/game/move`, {
    method: "POST",
    body: JSON.stringify({ game_id: gameId, row, col }),
  });
  return res.json();
}

// PUBLIC_INTERFACE
/**
 * Get game state/history by game_id.
 * @param {string} gameId
 * @returns {Promise<Object>} - Full game state and move history
 */
export async function getGame(gameId) {
  const res = await fetchWithAuth(`${API_ROOT}/game/${gameId}`, {
    method: "GET",
  });
  return res.json();
}

// PUBLIC_INTERFACE
/**
 * Get recent games for the user.
 * @returns {Promise<Object[]>}
 */
export async function getGameHistory() {
  const res = await fetchWithAuth(`${API_ROOT}/history`, {
    method: "GET",
  });
  return res.json();
}

// PUBLIC_INTERFACE
/**
 * Get leaderboard (top scoring users).
 * @returns {Promise<Object[]>}
 */
export async function getLeaderboard() {
  const res = await fetchWithAuth(`${API_ROOT}/leaderboard`, {
    method: "GET",
  });
  return res.json();
}

