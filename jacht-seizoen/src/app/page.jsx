import Link from "next/link";
import ScreenMain from "./components/ScreenMain";

export default function Home() {
  return (
    <>
      <ScreenMain>
        <header className="w-full flex justify-center items-center h-1/5">
          <h1 className="text-5xl text-white">Jacht Seizoen</h1>
        </header>
        <section className="flex flex-1 px-6 pt-4 flex-col justify-start gap-6">
          <Link href="./InfoScreen" className="w-full bg-black p-4 text-white text-3xl font-bold border-4 border-white rounded-md">Mee doen</Link>
          <Link href="./InfoScreen" className="w-full bg-black p-4 text-white text-3xl font-bold border-4 border-white rounded-md">Kamer maken</Link>
          <Link href="./InfoScreen" className="w-full bg-black p-4 text-white text-3xl font-bold border-4 border-white rounded-md">Over spel</Link>
        </section>
      </ScreenMain>
    </>
  );
}
