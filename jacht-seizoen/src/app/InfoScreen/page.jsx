import Link from "next/link";
import ScreenMain from "../components/ScreenMain";

const InfoScreen = () => {
  return (
    <ScreenMain>
      <nav className="w-full flex items-center h-1/10 p-4">
        <Link href="/" className="w-screen text-3xl font-bold text-white">
          Terug
        </Link>
      </nav>

      <section className="w-full overflow-y-scroll p-4 flex h-9/10 flex-col gap-5">
        <div className="bg-black/60 rounded-md flex flex-col gap-2 p-2">
          <h2 className="font-semibold text-3xl text-green-500">Algemene info</h2>
          <p className="text-white text-xl">
            Spelers zijn jagers of vluchters. Jagers moeten vluchters vinden, vluchters proberen te ontsnappen. 
            Snelheid, strategie en teamwork bepalen wie wint.
          </p>
        </div>
                

            <div className="bg-black/60 rounded-md flex flex-col gap-2 p-2">
        <h2 className="font-semibold text-3xl text-green-500">Hoe het spel verloopt</h2>
        <p className="text-white text-xl">
            Het spel begint met een voorsprong voor de vluchters; de eigenaar van het spel kan bepalen hoe lang deze voorsprong duurt. 
            Zodra de wegrennende fase voorbij is, mogen de jagers achter de vluchters aan. Elke 5 minuten ontvangen de jagers de locatie van de vluchters.
        </p>
        </div>

        <div className="bg-black/60 rounded-md flex flex-col gap-2 p-2">
        <h2 className="font-semibold text-3xl text-green-500">Veiligheid</h2>
        <p className="text-white text-xl">
            Veiligheid is enorm belangrijk. Zorg ervoor dat iedereen altijd bereikbaar is en dat niemand te ver gaat. 
            Spreek van tevoren regels af over het speelveld en ga nooit mee met een onbekende.
        </p>
        </div>

        <div className="bg-black/60 rounded-md flex flex-col gap-2 p-2">
        <h2 className="font-semibold text-3xl text-red-500">Voor jagers</h2>
        <p className="text-white text-xl">
            Vind de vluchters en verkrijg hun code. Let goed op hun bewegingen, werk samen met andere jagers, en gebruik strategie om ze te vangen.
        </p>
        </div>

        <div className="bg-black/60 rounded-md flex flex-col gap-2 p-2">
        <h2 className="font-semibold text-3xl text-blue-500">Voor vluchters</h2>
        <p className="text-white text-xl">
            Ren, verstop je en gebruik je voorsprong. Blijf alert en plan meerdere ontsnappingsroutes. Samenwerken met andere vluchters vergroot je overlevingskans.
        </p>
        </div>
      </section>
    </ScreenMain>
  );
};

export default InfoScreen;