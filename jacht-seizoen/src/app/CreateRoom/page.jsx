"use client"
import Link from "next/link";
import ScreenMain from "../components/ScreenMain";
import BackButton from "../components/BackButton";



const CreateRoom = () => {
    return (
        <ScreenMain>
            <BackButton></BackButton>
            <header className="w-full h-1/10 flex justify-center items-start">
                <h1 className="text-white text-4xl">Maak een kamer</h1>
            </header>
            <section className="flex w-full gap-5 flex-col p-5 pt-0 h-8/10">
                <input className="p-4 border-4 rounded-lg border-zinc-600 text-2xl font-bold bg-black text-white placeholder-zinc-600 w-full" type="text" placeholder="Kamer naam..." />
                <section className="w-full flex flex-1 flex-col gap-5">
                    <div className="flex w-fit gap-2 justify-start ">
                        <h2 className="text-3xl text-white">Zoek tijd:</h2>
                        <input className="text-white w-13 text-3xl" type="number" min={1} max={240} defaultValue={60} name="" id="" />
                    </div>
                    <div className="flex w-fit gap-2 justify-start ">
                        <h2 className="text-3xl text-white">Verstop tijd:</h2>
                        <input className="text-white w-13 text-3xl" type="number" min={1} max={240} defaultValue={10} name="" id="" />
                    </div>
                    <Link href="/" className="w-full mt-auto p-4 border-4 text-white text-3xl font-bold border-white rounded-lg bg-black text-center">Maak kamer!!</Link>
                </section>
            </section>
        </ScreenMain>
    );
}

export default CreateRoom;