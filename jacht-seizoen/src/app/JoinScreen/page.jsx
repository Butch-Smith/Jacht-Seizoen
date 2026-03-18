"use client";
import { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { signInAnonymously } from "firebase/auth";
import ScreenMain from "../components/ScreenMain";
import BackButton from "../components/BackButton";

const JoinScreen = () => {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [playerRole, setPlayerRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!auth.currentUser) {
    signInAnonymously(auth).catch(() => {});
  }

  const isFormValid =
    playerName.trim() && roomCode.trim() && playerRole;

  const getRoleColor = () => {
    if (playerRole === "hunter") return "bg-red-500 hover:bg-red-600";
    if (playerRole === "target") return "bg-blue-500 hover:bg-blue-600";
    if (playerRole === "random") return "bg-green-500 hover:bg-green-600";
    return "bg-zinc-700";
  };

  const handleJoinRoom = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setError("");

    try {
      const roomRef = doc(db, "rooms", roomCode.toUpperCase());
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        setError("Ongeldige kamer code.");
        setLoading(false);
        return;
      }

      const roomData = roomSnap.data();
      let roleToAssign = playerRole;

      if (playerRole === "random") {
        roleToAssign = Math.random() > 0.5 ? "hunter" : "target";
      }

      const userId = auth.currentUser.uid;

      const newPlayer = {
        id: userId,
        name: playerName,
        role: roleToAssign,
        isHost: false,
      };

      const updatedPlayers = [...(roomData.players || []), newPlayer];
      await updateDoc(roomRef, { players: updatedPlayers });

      localStorage.setItem("currentRoomId", roomCode.toUpperCase());
      localStorage.setItem("currentPlayerName", playerName);
      localStorage.setItem("currentPlayerId", userId);

      window.location.href = "/WaitingRoom";
    } catch {
      setError("Er is iets misgegaan bij het joinen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenMain>
      <BackButton />
      <section className="w-full h-9/10">
        <section className="p-4 h-full flex items-center flex-col gap-5">
          <header className="flex items-center justify-center h-1/6">
            <h1 className="text-4xl text-white font-bold">Doe mee!!</h1>
          </header>

          <input
            type="text"
            placeholder="Kamer code..."
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="p-4 border-4 rounded-lg border-zinc-600 text-2xl font-bold bg-black text-white placeholder-zinc-600 w-full"
          />

          <input
            type="text"
            placeholder="Jouw naam..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="p-4 border-4 rounded-lg border-zinc-600 text-2xl font-bold bg-black text-white placeholder-zinc-600 w-full"
          />

          <div className="flex w-full justify-center gap-4">
            <button
              onClick={() => setPlayerRole("hunter")}
              className={`flex-1 p-4 border-4 rounded-lg font-bold text-3xl ${
                playerRole === "hunter"
                  ? "border-red-500 text-white"
                  : "border-zinc-600 text-zinc-500"
              } bg-black`}
            >
              Jager
            </button>

            <button
              onClick={() => setPlayerRole("target")}
              className={`flex-1 p-4 border-4 rounded-lg font-bold text-3xl ${
                playerRole === "target"
                  ? "border-blue-500 text-white"
                  : "border-zinc-600 text-zinc-500"
              } bg-black`}
            >
              Vluchter
            </button>
          </div>

          <button
            onClick={() => setPlayerRole("random")}
            className={`w-full p-4 border-4 rounded-lg font-bold text-3xl ${
              playerRole === "random"
                ? "border-green-500 text-white"
                : "border-zinc-600 text-zinc-500"
            } bg-black`}
          >
            Random
          </button>

          {error && (
            <p className="text-red-400 text-center text-xl">{error}</p>
          )}

          <button
            onClick={handleJoinRoom}
            disabled={!isFormValid || loading}
            className={`w-full p-4 mt-auto text-3xl font-bold rounded-lg border-4 transition ${
                !isFormValid || loading
                ? "bg-zinc-700 border-zinc-700 text-zinc-400 cursor-not-allowed"
                : playerRole === "hunter"
                ? "bg-black border-red-500 text-white hover:bg-zinc-900"
                : playerRole === "target"
                ? "bg-black border-blue-500 text-white hover:bg-zinc-900"
                : "bg-black border-green-500 text-white hover:bg-zinc-900"
            }`}
            >
            {loading ? "Bezig met joinen..." : "Mee doen!!"}
        </button>
        </section>
      </section>
    </ScreenMain>
  );
};

export default JoinScreen;