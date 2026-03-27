import { useState } from "react";

const TargetDisplay = ({ playerName, playerCode }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [enteredCode, setEnteredCode] = useState("")
    const [isActive, setIsActive] = useState(true)

    const handleInnerClick = (e) => {
        e.stopPropagation()
    }

    const handleEnteredCode = (e) => {
        setEnteredCode(e.target.value)
    }

    const handleCommit = () => {
        if (!enteredCode) {
            console.log("please enter a code for the love of god")
            return
        }

        if (enteredCode !== playerCode) {
            console.log("wrong!!")
        }

        if (enteredCode == playerCode) {
            console.log("good job!!")
        }
    }

    return (
        <>
            <div onClick={() => setModalOpen(!modalOpen)} className="w-full p-4 bg-black border-4 border-white rounded-lg">
                <h2 className="text-white text-3xl font-semibold">{playerName}</h2>
            </div>
            {
                modalOpen &&
                <div onClick={() => setModalOpen(!modalOpen)} className="w-screen h-screen top-0 left-0 absolute bg-black/80 flex justify-center p-4 items-center">
                    <div onClick={handleInnerClick} className="w-full bg-zinc-900 p-4 border-4 border-red-500 rounded-lg flex flex-col gap-4  items-center z-50">
                        <h2 className="text-white font-semibold text-3xl">{playerName} gevonden?</h2>
                        <input onChange={handleEnteredCode} className="p-4 border-4 rounded-lg border-zinc-600 text-2xl font-bold bg-black text-white placeholder-zinc-600 w-full" type="text" placeholder="Code hier..." />
                        <button onClick={handleCommit} className="w-full text-2xl p-4 bg-black border-4 rounded-lg border-red-600 text-white font-bold text-center">Schakel uit!</button>
                    </div>
                </div>
            }
        </>
    );
}

export default TargetDisplay;