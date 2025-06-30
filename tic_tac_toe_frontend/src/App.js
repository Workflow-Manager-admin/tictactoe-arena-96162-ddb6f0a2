import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import { supabase } from "./supabaseClient";
import { getLeaderboard } from "./api";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");

  // Sync Supabase session user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Effect: load leaderboard
  useEffect(() => {
    if (user) {
      loadLeaderboard();
    } else {
      setLeaderboard([]);
    }
    // eslint-disable-next-line
  }, [user]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // PUBLIC_INTERFACE
  const handleAuthInput = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  // PUBLIC_INTERFACE
  const doSignIn = async () => {
    setAuthError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: authForm.email,
      password: authForm.password,
    });
    setLoading(false);
    if (error) setAuthError(error.message);
  };

  // PUBLIC_INTERFACE
  const doSignUp = async () => {
    setAuthError("");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: authForm.email,
      password: authForm.password,
    });
    setLoading(false);
    if (error) setAuthError(error.message);
  };

  // PUBLIC_INTERFACE
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // PUBLIC_INTERFACE
  async function loadLeaderboard() {
    setLoading(true);
    try {
      const board = await getLeaderboard();
      setLeaderboard(Array.isArray(board) ? board : []);
    } catch {
      setLeaderboard([]);
    }
    setLoading(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <img src={logo} className="App-logo" alt="logo" />
        <h1 style={{ marginTop: 0 }}>Tic Tac Toe Arena</h1>
        {user ? (
          <>
            <p>
              Welcome, <strong>{user.email}</strong>
            </p>
            <button className="theme-toggle" onClick={signOut}>
              Logout
            </button>
            <section style={{ marginTop: 30 }}>
              <h2>Leaderboard</h2>
              {loading ? (
                <p>Loading...</p>
              ) : leaderboard.length > 0 ? (
                <table style={{ borderCollapse: "collapse", margin: "auto" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: 4, borderBottom: "1px solid var(--border-color)" }}>Rank</th>
                      <th style={{ padding: 4, borderBottom: "1px solid var(--border-color)" }}>User</th>
                      <th style={{ padding: 4, borderBottom: "1px solid var(--border-color)" }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, idx) => (
                      <tr key={entry.user_id || idx}>
                        <td style={{ padding: 4 }}>{idx + 1}</td>
                        <td style={{ padding: 4 }}>
                          {entry.email || entry.username || entry.user_id || "?"}
                        </td>
                        <td style={{ padding: 4 }}>{entry.score ?? "?"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No leaderboard data.</p>
              )}
            </section>
          </>
        ) : (
          <div
            style={{
              background: "var(--bg-secondary)",
              padding: 30,
              borderRadius: 16,
              minWidth: 320,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}
          >
            <h2>{authMode === "signin" ? "Sign In" : "Sign Up"}</h2>
            <input
              style={{
                margin: 4,
                padding: 8,
                borderRadius: 6,
                border: "1px solid var(--border-color)",
                width: "90%",
              }}
              type="email"
              name="email"
              placeholder="Email"
              value={authForm.email}
              onChange={handleAuthInput}
              disabled={loading}
            />
            <br />
            <input
              style={{
                margin: 4,
                padding: 8,
                borderRadius: 6,
                border: "1px solid var(--border-color)",
                width: "90%",
              }}
              type="password"
              name="password"
              placeholder="Password"
              value={authForm.password}
              onChange={handleAuthInput}
              disabled={loading}
            />
            <br />
            {authError && (
              <div style={{ color: "red", margin: "4px 0" }}>{authError}</div>
            )}
            <button
              className="theme-toggle"
              onClick={authMode === "signin" ? doSignIn : doSignUp}
              disabled={loading}
              style={{ marginTop: 10, marginRight: 6 }}
            >
              {authMode === "signin" ? "Sign In" : "Sign Up"}
            </button>
            <button
              style={{
                background: "none",
                border: "none",
                color: "var(--text-secondary)",
                textDecoration: "underline",
                cursor: "pointer",
                fontSize: 14,
                margin: 0,
                padding: 0,
              }}
              disabled={loading}
              onClick={() =>
                setAuthMode((m) => (m === "signin" ? "signup" : "signin"))
              }
            >
              {authMode === "signin"
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </button>
          </div>
        )}
        <p style={{ marginTop: 40, color: "var(--text-secondary)", fontSize: 16 }}>
          Modern minimalistic UI – edit <code>src/App.js</code> to expand game!
        </p>
      </header>
    </div>
  );
}

export default App;
