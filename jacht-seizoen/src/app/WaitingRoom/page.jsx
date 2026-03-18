"use client";
import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import ScreenMain from "../components/ScreenMain";
import BackButton from "../components/BackButton";
import { FaCrown } from "react-icons/fa";

const WaitingRoom = () => {
  const [room, setRoom] = useState(null);
  const [hunters, setHunters] = useState([]);
  const [targets, setTargets] = useState([]);
  const [loadingStart, setLoadingStart] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  const roomId = typeof window !== "undefined" ? localStorage.getItem("currentRoomId") : null;
  const currentUserId = auth.currentUser?.uid;
  const isHost = room && room.hostId === currentUserId;
  const canStartGame = hunters.length >= 1 && targets.length >= 1;

  useEffect(() => {
    if (!roomId) return;
    const roomRef = doc(db, "rooms", roomId);
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setRoom(data);

        const playerList = data.players || [];
        setHunters(playerList.filter((p) => p.role === "hunter"));
        setTargets(playerList.filter((p) => p.role === "target"));

        const player = playerList.find((p) => p.id === currentUserId);
        setCurrentPlayer(player || null);
      } else {
        localStorage.removeItem("currentRoomId");
        localStorage.removeItem("currentPlayerName");
        localStorage.removeItem("currentPlayerId");
        window.location.href = "/";
      }
    });
    return () => unsubscribe();
  }, [roomId, currentUserId]);

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

  const handleLeaveRoom = async () => {
    if (!currentUserId) {
      localStorage.removeItem("currentRoomId");
      localStorage.removeItem("currentPlayerName");
      localStorage.removeItem("currentPlayerId");
      window.location.href = "/";
      return;
    }

    if (!room) {
      localStorage.removeItem("currentRoomId");
      localStorage.removeItem("currentPlayerName");
      localStorage.removeItem("currentPlayerId");
      window.location.href = "/";
      return;
    }

    const roomRef = doc(db, "rooms", roomId);
    const updatedPlayers = room.players.filter(p => p.id !== currentUserId);

    try {
      if (isHost || updatedPlayers.length === 0) {
        await deleteDoc(roomRef);
      } else {
        await updateDoc(roomRef, { players: updatedPlayers });
      }
    } finally {
      localStorage.removeItem("currentRoomId");
      localStorage.removeItem("currentPlayerName");
      localStorage.removeItem("currentPlayerId");
      window.location.href = "/";
    }
  };

  if (!room) {
    return (
      <ScreenMain>
        <BackButton onClick={() => setShowLeaveModal(true)} />
        <h2 className="text-white text-2xl text-center mt-20">
          Room not found or loading...
        </h2>
      </ScreenMain>
    );
  }

  return (
    <div className="relative min-h-screen bg-black bg-no-repeat bg-cover bg-fixed">
      <ScreenMain>
        <BackButton onClick={() => setShowLeaveModal(true)} />

        <header className="w-full flex flex-col items-center mb-2 gap-2">
          <p className="text-white text-3xl tracking-wide">{room.name}</p>
          <h1 className="text-white text-6xl font-extrabold tracking-wide mt-2">{room.code}</h1>
          <p className="text-white text-lg text-center tracking-wide">
            Deel deze code om spelers uit te nodigen!
          </p>
        </header>

        {currentPlayer && (
          <p className="text-white text-center mb-4">
            You are logged in as: <span className="font-bold">{currentPlayer.name}</span>
          </p>
        )}

        <div className="flex flex-col gap-6 p-5 overflow-y-auto max-h-[70vh]">
          <div>
            <h2 className="text-red-500 text-2xl font-semibold mb-2">Hunters ({hunters.length})</h2>
            <ul className="flex flex-col gap-3">
              {hunters.map((player, index) => (
                <li
                  key={player.id || index}
                  className="p-4 bg-zinc-900 rounded-2xl shadow-lg flex justify-between items-center ring-2 ring-red-500"
                >
                  <span className="text-white text-xl font-medium">{player.name}</span>
                  {player.isHost && <FaCrown className="text-yellow-400 ml-2 text-3xl" title="Host" />}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-blue-500 text-2xl font-semibold mb-2">Targets ({targets.length})</h2>
            <ul className="flex flex-col gap-3">
              {targets.map((player, index) => (
                <li
                  key={player.id || index}
                  className="p-4 bg-zinc-900 rounded-2xl shadow-lg flex justify-between items-center ring-2 ring-blue-500"
                >
                  <span className="text-white font-medium">{player.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {isHost && (
          <div className="fixed bottom-0 left-0 w-full p-5 flex flex-col gap-2">
            {!canStartGame && <p className="text-red-400 text-center">Need at least 1 hunter and 1 target to start</p>}
            <button
              onClick={handleStartGame}
              disabled={!canStartGame || loadingStart}
              className={`w-full p-4 text-2xl font-bold rounded-2xl transition ${
                !canStartGame || loadingStart
                  ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white active:scale-95"
              }`}
            >
              {loadingStart ? "Starting game..." : "Start Game"}
            </button>
          </div>
        )}

        {showLeaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-zinc-900 p-6 rounded-3xl max-w-sm w-full text-center border border-zinc-700">
              <h2 className="text-white text-2xl font-bold mb-4">Weet je zeker dat je wilt vertrekken?</h2>
              <p className="text-zinc-400 mb-6">
                {isHost
                  ? "Je bent de host. Als je vertrekt, wordt de kamer gesloten en worden alle spelers verwijderd."
                  : "Als je vertrekt, wordt je uit de kamer verwijderd."}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowLeaveModal(false)}
                  className="bg-zinc-700 text-white px-6 py-3 rounded-2xl hover:bg-zinc-600"
                >
                  Annuleer
                </button>
                <button
                  onClick={() => {
                    setShowLeaveModal(false);
                    handleLeaveRoom();
                  }}
                  className="bg-red-500 text-white px-6 py-3 rounded-2xl hover:bg-red-600"
                >
                  Verlaat
                </button>
              </div>
            </div>
          </div>
        )}
      </ScreenMain>
    </div>
  );
};

export default WaitingRoom;