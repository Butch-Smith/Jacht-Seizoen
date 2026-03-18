"use client"
import { useState } from "react";
import BackButton from "../components/BackButton";
import ScreenMain from "../components/ScreenMain";
import Link from "next/link";

const JoinScreen = () => {
    const [playerRole, setPlayerRole] = useState("")
    return (
        <ScreenMain>
            <BackButton />
            <section className="w-full h-9/10">
                <section className="p-4 h-full flex items-center flex-col gap-5">
                    <header className="flex items-start font-bold justify-center w-full">
                        <h1 className="text-4xl text-white">Doe mee!!</h1>
                    </header>
                    <input className="p-4 border-4 rounded-lg border-zinc-600 text-2xl active:border-white font-bold bg-black text-white placeholder-zinc-600 w-full" type="text" placeholder="Kamer code..." />
                    <input className="p-4 border-4 rounded-lg border-zinc-600 text-2xl font-bold bg-black text-white placeholder-zinc-600 w-full" type="text" placeholder="Jou naam..." />
                    <div className="flex w-full justify-center gap-4">
                        <button onClick={() => setPlayerRole("hunter")} className="flex border-4 border-red-500 rounded-lg bg-black text-white font-bold text-3xl flex-1 p-4 justify-center">Jager</button>
                        <button onClick={() => setPlayerRole("target")} className="flex border-4 border-blue-500 rounded-lg bg-black text-white font-bold text-3xl flex-1 p-4 justify-center">Vluchter</button>
                    </div>
                    <Link style={{borderColor: playerRole == "hunter" && "#ef4444" || playerRole == "target" && "#3b82f6"}} className="w-full p-4 mt-auto bg-black text-center rounded-lg border-4 text-3xl font-bold text-white" href="/">Mee doen!!</Link>
                </section>
            </section>
        </ScreenMain>
    );
}

export default JoinScreen;