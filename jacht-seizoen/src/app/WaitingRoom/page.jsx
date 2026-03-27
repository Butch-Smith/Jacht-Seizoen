"use client";
import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import ScreenMain from "../components/ScreenMain";
import { FaCrown, FaUser, FaArrowLeft, FaRunning } from "react-icons/fa";

const WaitingRoom = () => {
  const [room, setRoom] = useState(null);
  const [loadingStart, setLoadingStart] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [assignHost, setAssignHost] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  const roomId =
    typeof window !== "undefined" ? localStorage.getItem("currentRoomId") : null;
  const currentUserId =
    typeof window !== "undefined"
      ? localStorage.getItem("currentPlayerId")
      : auth.currentUser?.uid;

  useEffect(() => {
    if (!roomId || !currentUserId) return;

    const roomRef = doc(db, "rooms", roomId);
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (!snapshot.exists()) {
        localStorage.clear();
        window.location.href = "/";
        return;
      }

      const roomData = snapshot.data();
      setRoom(roomData);

      const me = roomData.players?.find((p) => p.id === currentUserId) || null;
      setCurrentPlayer(me);
    });

    return () => unsubscribe();
  }, [roomId, currentUserId]);

  if (!room) return null;

  const isHost = currentPlayer?.isHost;
  const hunters = room.players?.filter((p) => p.role === "hunter") || [];
  const targets = room.players?.filter((p) => p.role === "target") || [];
  const canStartGame = hunters.length >= 1 && targets.length >= 1;

  const maxHunters = room.maxHunters;
  const maxPlayers = room.maxPlayers;

  const handleStartGame = async () => {
    if (!roomId || !canStartGame) return;

    setLoadingStart(true);
    try {
      const roomRef = doc(db, "rooms", roomId);
      await updateDoc(roomRef, { status: "started", startedAt: new Date() });
    } finally {
      setLoadingStart(false);
    }
  };

  const handleLeaveRoom = async (selectedHostId = null) => {
    if (!roomId || !currentPlayer) return;

    const roomRef = doc(db, "rooms", roomId);

    try {
      if (isHost && room.players.length === 1) {
        await deleteDoc(roomRef);
        localStorage.clear();
        window.location.href = "/";
        return;
      }

      if (isHost && room.players.length > 1 && !selectedHostId) {
        setAssignHost(true);
        setShowLeaveModal(true);
        return;
      }

      let updatedPlayers = room.players.map((p) =>
        selectedHostId ? { ...p, isHost: p.id === selectedHostId } : p
      );

      updatedPlayers = updatedPlayers.filter((p) => p.id !== currentPlayer.id);

      await updateDoc(roomRef, { players: updatedPlayers });

      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      console.error("Error leaving room:", err);
    } finally {
      setShowLeaveModal(false);
      setAssignHost(false);
    }
  };

  const renderPlayer = (player, color) => {
    const isYou = player.id === currentUserId;
    return (
      <li
        key={player.id}
        className={`p-4 bg-zinc-900 rounded-2xl shadow-lg flex justify-between items-center ring-2 ${
          color === "red" ? "ring-red-500" : "ring-blue-500"
        } ${isYou ? "bg-zinc-800 border border-white" : ""}`}
      >
        <span className="text-white text-xl font-medium flex items-center gap-2">
          {player.name}
          {isYou && <FaUser className="text-green-400" />}
        </span>
        <div className="flex items-center gap-2">
          {player.isHost && <FaCrown className="text-yellow-400 text-2xl" />}
        </div>
      </li>
    );
  };

  return (
    <div className="relative min-h-screen bg-black">
      <ScreenMain>
        <nav className="w-full h-1/10 flex justify-between items-center p-4">
          <button
            onClick={() => {
              setAssignHost(isHost && room.players.length > 1);
              setShowLeaveModal(true);
            }}
            className="text-3xl font-bold text-white"
          >
            <FaArrowLeft />
          </button>
          <div className="flex mx-auto items-center gap-2">
            <h2 className="text-white text-3xl font-semibold">Jacht Seizoen</h2>
            <FaRunning className="text-4xl text-white" />
          </div>
        </nav>

        <header className="w-full flex flex-col items-center mb-2 gap-2">
          <p className="text-white text-3xl">{room.name}</p>
          <h1 className="text-white text-6xl font-extrabold mt-2">{room.code}</h1>
        </header>

        {currentPlayer && (
          <p className="text-white text-center mb-4">
            You are: <span className="font-bold">{currentPlayer.name}</span>
          </p>
        )}

        <div className="text-center text-white mb-4 space-y-1">
          <p>Totale speeltijd: {room.seekTime} min</p>
          <p>Verstop tijd: {room.hideTime} min</p>
          {maxPlayers && <p>Totaal spelers: {maxPlayers}</p>}
          {maxHunters && <p>Jager slots: {hunters.length} / {maxHunters}</p>}
        </div>

        <div className="flex flex-col gap-6 p-5 overflow-y-auto max-h-[50vh]">
          <div>
            <h2 className="text-red-500 text-2xl mb-2">Hunters ({hunters.length})</h2>
            <ul className="flex flex-col gap-3">{hunters.map((p) => renderPlayer(p, "red"))}</ul>
          </div>
          <div>
            <h2 className="text-blue-500 text-2xl mb-2">Targets ({targets.length})</h2>
            <ul className="flex flex-col gap-3">{targets.map((p) => renderPlayer(p, "blue"))}</ul>
          </div>
        </div>

        {isHost && (
          <div className="fixed bottom-0 left-0 w-full p-5">
            <button
              onClick={handleStartGame}
              disabled={!canStartGame || loadingStart}
              className={`w-full p-4 text-2xl font-bold rounded-2xl transition ${
                !canStartGame || loadingStart
                  ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {loadingStart ? "Bezig met starten..." : "Start Game"}
            </button>
          </div>
        )}

        {showLeaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="bg-zinc-800 p-8 rounded-3xl shadow-lg text-center w-11/12 max-w-md">
              {!assignHost ? (
                <>
                  <h2 className="text-white text-2xl mb-4 font-bold">
                    Weet je zeker dat je wilt verlaten?
                  </h2>
                  <div className="flex gap-4 justify-center mt-4">
                    <button
                      onClick={() => setShowLeaveModal(false)}
                      className="bg-zinc-700 px-6 py-3 rounded-2xl hover:bg-zinc-600 text-white transition"
                    >
                      Annuleer
                    </button>
                    <button
                      onClick={() => handleLeaveRoom()}
                      className="bg-red-500 px-6 py-3 rounded-2xl hover:bg-red-600 text-white transition"
                    >
                      Verlaat
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-white text-2xl mb-4 font-bold">
                    Je bent de host, kies een nieuwe host:
                  </h2>
                  <div className="flex flex-col gap-3 mt-2">
                    {room.players
                      .filter((p) => p.id !== currentUserId)
                      .map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleLeaveRoom(p.id)}
                          className="bg-zinc-600 px-6 py-3 rounded-2xl text-white hover:bg-zinc-700 transition"
                        >
                          {p.name}
                        </button>
                      ))}
                    <button
                      onClick={() => setShowLeaveModal(false)}
                      className="bg-zinc-900 px-6 py-3 rounded-2xl text-white hover:bg-zinc-800 mt-2 transition border-3 border-red-900"
                    >
                      Terug
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </ScreenMain>
    </div>
  );
};

export default WaitingRoom;