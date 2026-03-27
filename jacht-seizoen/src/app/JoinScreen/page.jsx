"use client";
import { useState, useEffect, useRef } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { signInAnonymously } from "firebase/auth";
import ScreenMain from "../components/ScreenMain";
import BackButton from "../components/BackButton";
import Link from "next/link";

const JoinScreen = () => {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [playerRole, setPlayerRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const linkRef = useRef(null);

  useEffect(() => {
    const initAuth = async () => {
      if (!auth.currentUser) {
        try {
          const cred = await signInAnonymously(auth);
          setUser(cred.user);
        } catch (err) {
          console.error("Anonymous sign-in failed:", err);
          setError("Kon gebruiker niet aanmelden.");
        }
      } else {
        setUser(auth.currentUser);
      }
    };
    initAuth();
  }, []);

  const isValid = playerName.trim() && roomCode.trim() && playerRole && user?.uid;

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError("");

    try {
      const code = roomCode.toUpperCase();
      const roomRef = doc(db, "rooms", code);
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        setError("Ongeldige kamer code.");
        setLoading(false);
        return;
      }

      const roomData = roomSnap.data() || {};
      const existingPlayers = roomData.players || [];

      const nameExists = existingPlayers.some(
        (p) => p.name.toLowerCase() === playerName.trim().toLowerCase()
      );
      if (nameExists) {
        setError("Deze naam is al in gebruik.");
        setLoading(false);
        return;
      }

      let roleToAssign;
      const hunterCount = existingPlayers.filter(p => p.role === "hunter").length;
      const maxHunters = roomData.maxHunters || 1;

      if (playerRole === "random") {
        roleToAssign = hunterCount >= maxHunters ? "target" : (Math.random() > 0.5 ? "hunter" : "target");
      } else {
        roleToAssign = playerRole;
      }

      if (roleToAssign === "hunter" && hunterCount >= maxHunters) {
        setError("Maximaal aantal jagers bereikt.");
        setLoading(false);
        return;
      }

      const newPlayer = {
        id: user.uid,
        name: playerName.trim(),
        role: roleToAssign,
        isHost: false,
        joinedAt: new Date(),
      };

      console.log("Adding player to room array:", newPlayer);

      await updateDoc(roomRef, {
        players: arrayUnion(newPlayer),
      });

      console.log("Player added successfully!");

      localStorage.setItem("currentRoomId", code);
      localStorage.setItem("currentPlayerName", playerName.trim());
      localStorage.setItem("currentPlayerId", user.uid);

      linkRef.current?.click();
    } catch (err) {
      console.error("Join room error:", err);
      setError("Er is iets misgegaan bij het joinen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenMain>
      <BackButton />
      <section className="w-full h-9/10 flex flex-col justify-center items-center gap-5 p-4">
        <header className="flex items-center justify-center w-full">
          <h1 className="text-4xl text-white font-bold">Doe mee!</h1>
        </header>

        <form
          onSubmit={handleJoinRoom}
          className="flex w-full gap-6 flex-col p-0"
        >
          <input
            type="text"
            placeholder="Kamer code..."
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="p-4 border-2 rounded-2xl border-zinc-700 text-2xl font-semibold bg-zinc-900 text-white placeholder-zinc-500 w-full focus:outline-none focus:ring-2 focus:ring-white transition"
          />

          <input
            type="text"
            placeholder="Jouw naam..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="p-4 border-2 rounded-2xl border-zinc-700 text-2xl font-semibold bg-zinc-900 text-white placeholder-zinc-500 w-full focus:outline-none focus:ring-2 focus:ring-white transition"
          />

          <div className="flex w-full justify-center gap-4">
            <button
              type="button"
              onClick={() => setPlayerRole("hunter")}
              className={`flex-1 p-4 border-2 rounded-2xl font-bold text-3xl ${
                playerRole === "hunter"
                  ? "border-red-500 text-white"
                  : "border-zinc-700 text-zinc-400"
              } bg-zinc-900`}
            >
              Jager
            </button>
            <button
              type="button"
              onClick={() => setPlayerRole("target")}
              className={`flex-1 p-4 border-2 rounded-2xl font-bold text-3xl ${
                playerRole === "target"
                  ? "border-blue-500 text-white"
                  : "border-zinc-700 text-zinc-400"
              } bg-zinc-900`}
            >
              Vluchter
            </button>
          </div>

          <button
            type="button"
            onClick={() => setPlayerRole("random")}
            className={`w-full p-4 border-2 rounded-2xl font-bold text-3xl ${
              playerRole === "random"
                ? "border-green-500 text-white"
                : "border-zinc-700 text-zinc-400"
            } bg-zinc-900`}
          >
            Random
          </button>

          {error && (
            <p className="text-red-400 text-center font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full mt-4 p-4 text-2xl font-bold rounded-2xl transition ${
              !isValid || loading
                ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                : "bg-white text-black hover:bg-zinc-200 active:scale-95"
            }`}
          >
            {loading ? "Bezig met joinen..." : "Mee doen!"}
          </button>

          <Link href="/WaitingRoom" ref={linkRef} className="hidden">
            Waiting Room
          </Link>
        </form>
      </section>
    </ScreenMain>
  );
};

export default JoinScreen;