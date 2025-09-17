'use client';

import { useEffect, useState } from 'react';
import usePwaPrompt from './usePwaPrompt';
import {MdDownload} from "react-icons/md";

export default function PwaInstallModal() {
    const [showModal, setShowModal] = useState(false);
    const { isReady, promptInstall } = usePwaPrompt();

    useEffect(() => {
        const shouldShow = localStorage.getItem('showPwaPrompt');
        if (isReady && shouldShow === 'true') {
            setTimeout(() => setShowModal(true), 800);
        }
    }, [isReady]);

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-zinc-900 rounded-2xl p-6 shadow-2xl w-[90%] max-w-sm animate-slide-up border border-zinc-700">
                <div className="flex flex-col items-center text-center space-y-4 text-white">
                    <div className="bg-red-900/20 p-4 rounded-full border border-red-700">
                        <MdDownload className="text-red-500 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white">Տեղադրիր MovieNest-ը</h2>
                    <p className="text-zinc-400">
                        Ավելի արագ մուտք՝ Հավելվածից հարմարավետ օգտվելու համար 📱
                    </p>
                    <div className="flex flex-col gap-2 w-full pt-2">
                        <button
                            onClick={() => {
                                promptInstall();
                                setShowModal(false);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-xl transition"
                        >
                            Տեղադրել հիմա
                        </button>
                        <button
                            onClick={() => {
                                localStorage.setItem('showPwaPrompt', 'false');
                                setShowModal(false);
                            }}
                            className="text-sm text-zinc-500 hover:underline"
                        >
                            Հետո հիշեցնել
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
