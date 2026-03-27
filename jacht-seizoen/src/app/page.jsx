import Link from "next/link";
import ScreenMain from "./components/ScreenMain";
import { FaArrowLeft } from "react-icons/fa";


export default function Home() {
  return (
    <>
      <ScreenMain>
        <header className="w-full flex justify-center items-center h-1/5">
          <h1 className="text-5xl font-semibold text-white">Jacht Seizoen</h1>
        </header>
        <section className="flex flex-1 px-6 pt-4 flex-col justify-start gap-6">
          <Link href="./JoinScreen" className="w-full bg-black p-4 text-white text-3xl font-bold border-4 border-blue-500 rounded-md">Mee doen</Link>
          <Link href="./CreateRoom" className="w-full bg-black p-4 text-white text-3xl font-bold border-4 border-red-500 rounded-md">Kamer maken</Link>
          <Link href="./InfoScreen" className="w-full bg-black p-4 text-white text-3xl font-bold border-4 border-green-500 rounded-md">Over spel</Link>
          <Link href="./HunterScreen" className="w-full bg-black p-4 text-white text-3xl font-bold border-4 border-white rounded-md">Hunter scherm</Link>
          <Link href="./ResultScreen" className="w-full bg-black p-4 text-white text-3xl font-bold border-4 border-white rounded-md">Results scherm</Link>
          <Link href="./TargetScreen" className="w-full bg-black p-4 text-white text-3xl font-bold border-4 border-white rounded-md">Vluchter scherm</Link>
        </section>
      </ScreenMain>
    </>
  );
}