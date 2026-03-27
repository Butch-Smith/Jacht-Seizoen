    "use client";
    import { useState, useEffect, useRef } from "react";
    import Link from "next/link";
    import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
    import { auth, db } from "../../lib/firebase";
    import { signInAnonymously } from "firebase/auth";
    import ScreenMain from "../components/ScreenMain";
    import BackButton from "../components/BackButton";

    const CreateRoom = () => {
    const [hostName, setHostName] = useState("");
    const [roomName, setRoomName] = useState("");
    const [seekTime, setSeekTime] = useState(60);
    const [hideTime, setHideTime] = useState(10);

    const [maxHunters, setMaxHunters] = useState("");
    const [maxPlayers, setMaxPlayers] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const linkRef = useRef(null);

    useEffect(() => {
        if (!auth.currentUser) {
        signInAnonymously(auth).catch((err) => console.error(err));
        }
    }, []);

    const generateRoomCode = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        let chars = [];
        for (let i = 0; i < 2; i++) chars.push(letters[Math.floor(Math.random() * letters.length)]);
        for (let i = 0; i < 2; i++) chars.push(numbers[Math.floor(Math.random() * numbers.length)]);
        const allChars = letters + numbers;
        for (let i = 0; i < 2; i++) chars.push(allChars[Math.floor(Math.random() * allChars.length)]);
        for (let i = chars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [chars[i], chars[j]] = [chars[j], chars[i]];
        }
        return chars.join("");
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        if (loading) return;

        if (!roomName.trim()) {
        setError("Voer een kamer naam in.");
        return;
        }
        if (!hostName.trim()) {
        setError("Voer jouw naam in.");
        return;
        }
        if (seekTime < 1 || seekTime > 240 || hideTime < 1 || hideTime > 240) {
        setError("Tijden moeten tussen 1 en 240 seconden liggen.");
        return;
        }

        if (maxHunters && maxPlayers && Number(maxHunters) > Number(maxPlayers)) {
        setError("Aantal jagers kan niet groter zijn dan totaal aantal spelers.");
        return;
        }

        setLoading(true);
        setError("");

        try {
        const user = auth.currentUser;
        let code = generateRoomCode();

        let exists = true;
        while (exists) {
            const docRef = doc(db, "rooms", code);
            const snapshot = await getDoc(docRef);
            if (!snapshot.exists()) {
            exists = false;
            } else {
            code = generateRoomCode();
            }
        }

        const docRef = doc(db, "rooms", code);
        await setDoc(docRef, {
            name: roomName,
            hostName,
            hostId: user?.uid || "unknown",
            code,
            seekTime,
            hideTime,

            maxHunters: maxHunters ? Number(maxHunters) : null,
            maxPlayers: maxPlayers ? Number(maxPlayers) : null,

            createdAt: serverTimestamp(),
            players: [
            {
                id: user?.uid || "unknown",
                name: hostName,
                role: "hunter",
                isHost: true,
            },
            ],
            status: "waiting",
        });

        localStorage.setItem("currentRoomId", code);
        localStorage.setItem("currentPlayerName", hostName);
        localStorage.setItem("currentPlayerId", user?.uid || "unknown");

        linkRef.current?.click();
        } catch (err) {
        console.error(err);
        setError("Er ging iets mis bij het maken van de kamer.");
        } finally {
        setLoading(false);
        }
    };

    const isValid =
        roomName.trim() && hostName.trim() && seekTime >= 1 && hideTime >= 1;

    return (
        <ScreenMain>
        <div className="relative z-10">
            <BackButton />
            <header className="w-full flex justify-center items-start mb-6">
            <h1 className="text-white text-4xl font-bold tracking-wide">
                Maak een kamer
            </h1>
            </header>

            <form
            onSubmit={handleCreateRoom}
            className="flex w-full gap-6 flex-col p-5 pt-0"
            >
            <input
                className="p-4 border-2 rounded-2xl border-zinc-700 text-2xl font-semibold bg-zinc-900 text-white placeholder-zinc-500 w-full focus:outline-none focus:ring-2 focus:ring-white transition"
                type="text"
                placeholder="Kamer naam..."
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
            />

            <input
                className="p-4 border-2 rounded-2xl border-zinc-700 text-2xl font-semibold bg-zinc-900 text-white placeholder-zinc-500 w-full focus:outline-none focus:ring-2 focus:ring-white transition"
                type="text"
                placeholder="Jouw naam..."
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
            />

            <div className="flex flex-col gap-4 bg-zinc-800 p-3 rounded-3xl border border-zinc-700 shadow-lg">
                <h2 className="text-white text-2xl font-semibold">Tijden</h2>

                <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-700">
                <h3 className="text-xl text-white font-medium">Zoek tijd</h3>
                <input
                    className="text-white w-20 text-xl bg-transparent border-b border-zinc-600 text-center focus:outline-none"
                    type="number"
                    min={1}
                    max={240}
                    value={seekTime}
                    onChange={(e) => setSeekTime(Number(e.target.value))}
                />
                </div>

                <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-700">
                <h3 className="text-xl text-white font-medium">Verstop tijd</h3>
                <input
                    className="text-white w-20 text-xl bg-transparent border-b border-zinc-600 text-center focus:outline-none"
                    type="number"
                    min={1}
                    max={240}
                    value={hideTime}
                    onChange={(e) => setHideTime(Number(e.target.value))}
                />
                </div>
            </div>

            <div className="flex flex-col gap-4 bg-zinc-800 p-3 rounded-3xl border border-zinc-700 shadow-lg">
                <h2 className="text-white text-2xl font-semibold">Spelers</h2>

                <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-700">
                <h3 className="text-xl text-white font-medium">Max jagers</h3>
                <input
                    className="text-white w-20 text-xl bg-transparent border-b border-zinc-600 text-center focus:outline-none"
                    type="number"
                    min={1}
                    placeholder="-"
                    value={maxHunters}
                    onChange={(e) => setMaxHunters(e.target.value)}
                />
                </div>

                <div className="flex items-center justify-between bg-zinc-900 p-3 rounded-2xl border border-zinc-700">
                <h3 className="text-xl text-white font-medium">Max spelers</h3>
                <input
                    className="text-white w-20 text-xl bg-transparent border-b border-zinc-600 text-center focus:outline-none"
                    type="number"
                    min={1}
                    placeholder="-"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(e.target.value)}
                />
                </div>
            </div>

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
                {loading ? "Bezig met maken..." : "Maak kamer"}
            </button>

            <Link href="/WaitingRoom" ref={linkRef} className="hidden">
                Waiting Room
            </Link>
            </form>
        </div>
        </ScreenMain>
    );
    };

    export default CreateRoom;