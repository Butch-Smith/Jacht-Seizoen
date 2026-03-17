import Link from "next/link";
import ScreenMain from "../components/ScreenMain";
const InfoScreen = () => {
    return (
        <>
            <ScreenMain>
                <header className="w-full p-4">
                    <Link href="/" className="w-screen text-3xl font-bold text-white">Terug</Link>
                </header>
                <section className="w-full p-4 flex flex-1 flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <h2 className="font-semibold text-3xl text-white">Algemene info</h2>
                        <p className="text-white text-xl">De jagers winnen als alle vluchters gevonden zijn, en de vluchters winnen als de tijd over is.</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="font-semibold text-3xl text-white">Voor <span className="text-red-500">jagers</span></h2>
                        <p className="text-white text-xl">Jouw taak als jager is om de vluchtende spelers te achtervolgen en te vermoorden (hun code krijgen en invoeren)</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="font-semibold text-3xl text-white">Voor <span className="text-blue-500">vluchters</span></h2>
                        <p className="text-white text-xl">Jouw taak als vluchter is om weg te rennen en je te verstoppen van de jagers. Alle vluchters hebben een voorsprong om weg te rennen.</p>
                    </div>
                </section>
            </ScreenMain>
        </>
    );
}

export default InfoScreen;