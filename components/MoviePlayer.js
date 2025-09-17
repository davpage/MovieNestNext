import Link from 'next/link';
import {useState} from "react";

export default function MoviePlayer({ iframeSrc, movieTitle, downloadUrl,trailer, onIframeLoad }) {
    // console.log(iframeSrc)
    const [trail,setTrail]=useState(false)
    return (
        <div className="flex flex-col gap-2 max-[850px]:w-full">
            {iframeSrc && (
                <iframe
                    src={trail?trailer:iframeSrc}
                    allowFullScreen
                    onLoad={onIframeLoad}
                    className="w-full h-[70vh] max-[850px]:h-[200px] border-none"
                />
            )}
            <div className="w-full flex justify-between">
                <p className="text-lg sm:text-2xl text-white">{movieTitle}</p>
                <div className='flex gap-4'>
                    {trailer && <button
                        onClick={()=>setTrail(!trail)}
                        className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-950 cursor-pointer text-sm sm:text-base"
                    >
                        {trail?'Movie':'Trailer'}
                    </button>}
                    {downloadUrl && (
                        <Link
                            href={downloadUrl}
                            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-950 text-sm sm:text-base"
                        >
                            Download
                        </Link>
                    )}</div>
            </div>
        </div>
    );
}