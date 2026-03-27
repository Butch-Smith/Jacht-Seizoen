"use client"
import { useEffect, useState } from "react";
import ScreenMain from "../components/ScreenMain";
import Link from "next/link";

const ResultScreen = () => {
    const [winningTeam, setWinningTeam] = useState("jagers")

    const players = [
        {
            id: 1,
            name: "kiwi",
            code: "12345",
            time: "11.11"
        },
        {
            id: 2,
            name: "kiwi",
            code: "12345",
        },
        {
            id: 3,
            name: "kiwi",
            code: "12345",
            time: "11.11"
        },
        {
            id: 4,
            name: "kiwi",
            code: "12345",
            time: "11.11"
        }
    ]

    useEffect(() => {
        for (let player of players) {
            if (!player.time) {
                setWinningTeam("vluchters")
                console.log(player.id)
            }
        }
    }, [])



    return (
        <ScreenMain>
            <section className="w-full flex flex-col justify-between h-full p-4">
                <h1 className="text-white w-full text-5xl text-center mt-6 font-bold">De {winningTeam} winnen!!</h1>
                <div style={{ borderColor: winningTeam == "jagers" ? "red" : "blue" }} className="flex max-h-100 overflow-y-scroll mb-20 flex-col rounded-xl w-full gap-3 p-4 border-4 bg-zinc-900">
                    {
                        players.map((player) => (
                            <div className="text-2xl text-semibold flex justify-between text-white" key={player.id}>
                                <h3>{player.name}</h3>
                                <h3 className="">{player.time ? player.time : "Ontsnapt!!"}</h3>
                            </div>
                        ))
                    }
                </div>
                <Link href="/" className="w-full bg-black p-4 text-white text-3xl font-bold border-4 text-center border-white rounded-md">Terug naar home</Link>
            </section>
        </ScreenMain>
    );
}

export default ResultScreen;