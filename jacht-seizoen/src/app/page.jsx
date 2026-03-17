import Link from "next/link";

export default function Home() {
  return (
    <>
    <main className="w-screen h-screen flex items-center px-6 py-10 flex-col">
      <h1 className="text-4xl">hey whats up guys</h1>
      <section className="flex w-full justify-center flex-col gap-4">
        <Link href="./CreateRoomScreen">higufkfygui</Link>

        <button className="w-full p-4 bg-gray-700 text-white text-center text-2xl font-bold">Maak kamer</button>
      </section>
    </main>
    </>
  );
}
