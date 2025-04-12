import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';

import Game2048 from '../2048/Game2048';
import GameMinesweeper from '@/2048/GameMinesweeper';

export default function Welcome({ auth }: PageProps) {
    const [game, setGame] = useState<'2048'|'minesweeper'>('minesweeper');


    return (
        <>
            <Head title="Welcome"/>
            <div className="relative box-border flex flex-col sm:justify-start pt-10 items-center min-h-screen bg-center bg-dots-lighter bg-gray-900 selection:bg-red-500 selection:text-white">

                <div className='mb-6 flex w-1/2 justify-center text-3xl border-2 border-gray-800 rounded-lg'>
                    <button disabled={game=='2048'} onClick={()=>setGame('2048')} className='disabled:bg-green-400 disabled:underline disabled:font-extrabold disabled:w-2/3 w-1/3 flex p-2 justify-center items-center text-slate-800 bg-slate-100 border-slate-700'>2048</button>
                    <button disabled={game=='minesweeper'} onClick={()=>setGame('minesweeper')} className='disabled:bg-green-400 disabled:underline disabled:font-extrabold disabled:w-2/3 w-1/3 flex p-2 justify-center items-center text-slate-800 bg-slate-100 border-slate-700'> Minesweeper </button>
                </div>

                {
                    game == '2048'
                    ? <Game2048 />
                    : <GameMinesweeper />
                }

                <div className='hidden bg-red-50 text-slate-200'></div>
                <div className='hidden bg-red-100 text-slate-700'></div>
                <div className='hidden bg-red-200 text-green-500'></div>
                <div className='hidden bg-red-300'></div>
                <div className='hidden bg-red-400'></div>
                <div className='hidden bg-red-500'></div>
                <div className='hidden bg-red-600'></div>
                <div className='hidden bg-red-700'></div>
                <div className='hidden bg-red-800'></div>
                <div className='hidden bg-red-900'></div>
            </div>

            <style>{`
                .bg-dots-darker {
                    background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(0,0,0,0.07)'/%3E%3C/svg%3E");
                }
                @media (prefers-color-scheme: dark) {
                    .dark\\:bg-dots-lighter {
                        background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E");
                    }
                }
            `}</style>
        </>
    );
}
