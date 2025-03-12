"use client"
import {useState} from "react";

export default function Home() {
    const [add, setAdd] = useState(false)
    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            Բարև աշխարհ
            {add && <div>Դուք Միացաք աշխարհին</div>}
            <button className='p-4 bg-blue-500 hover:bg-blue-700 cursor-pointer' onClick={() => setAdd(!add)}>{!add ? "Միանալ Աշխարհին": "Անջատվել աշխարհից"}</button>
        </div>
    );
}
