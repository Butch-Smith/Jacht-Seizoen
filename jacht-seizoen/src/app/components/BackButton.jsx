import Link from "next/link";
import { FaArrowLeft, FaRunning } from "react-icons/fa";

const BackButton = () => {
    return (
        <nav className="w-full h-1/10 flex justify-between items-center p-4">
            <Link href="/" className=" text-3xl font-bold text-white"><FaArrowLeft /></Link>
            <div className="flex mx-auto items-center gap-2">
                <h2 className="text-white text-3xl font-semibold">Jacht Seizoen</h2>
                <FaRunning className="text-4xl text-white" />
            </div>
            
        </nav>
    );
}

export default BackButton;