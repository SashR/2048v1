import { Link, Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import NumberBlock from './../2048/NumberBlock';
import { useEffect, useState } from 'react';

interface Moveset {
    left: Array<number|null>,
    right: Array<number|null>,
    up: Array<number|null>,
    down: Array<number|null>
}

enum Key {
    ArrowLeft='ArrowLeft', ArrowRight='ArrowRight', ArrowUp='ArrowUp', ArrowDown='ArrowDown',
}

export default function Welcome({ auth, laravelVersion, phpVersion }: PageProps<{ laravelVersion: string, phpVersion: string }>) {
    const [rows, setRows] = useState<Array<number|null>>(new Array(16).fill(null));
    const [prev, setPrev] = useState<Array<number|null>>(new Array(16).fill(null));
    const [score, setScore] = useState<number>(0);
    const [count, setCount] = useState<number>(0);
    const [undoUsed, setUndoUsed] = useState<boolean>(false);

    const [nextMoves, setNextMoves] = useState<Moveset>({left:[], down:[], right: [], up: []});

    const newGame = () => setRows(rows => generate(new Array(16).fill(null)));
    const undo = () => {
        setRows(prev);
        setUndoUsed(true);
    };

    const combine = (arr: number[], fwd:boolean = true) => {
        const op: number[] = [];
        if(fwd){
            for(let i=0; i<arr.length; i++){
                if(i<arr.length-1 && arr[i]==arr[i+1]){
                    setScore(score=> score+arr[i]*2);
                    op.push(arr[i]*2);
                    i++;
                } else op.push(arr[i]);
            }
        } else {
            for(let i=arr.length-1; i>=0; i--){
                if(i>0 && arr[i]==arr[i-1]){
                    setScore(score=> score+arr[i]*2);
                    op.unshift(arr[i]*2);
                    i--;
                } else op.unshift(arr[i]);
            }
        }
        return op;
    }

    const generate = (arr: Array<number|null>) => {
        const emptyIds = arr.map((v,i) => v==null ? i : null).filter(v => typeof v=='number');
        const id = emptyIds[Math.floor(Math.random() * emptyIds.length)];
        const numGen :number = Math.floor(Math.random() * 10) < 7 ? 2 : 4;
        return arr.map((v,i) => i===id ? numGen : v);
    }

    const leftShift = (rows:Array<number|null>):Array<number|null> => {
        const op = [];
        for(let i=0; i<15; i+=4){
            const temp: number[] = combine(rows.slice(i, i+4).filter(v=>typeof v=='number'));
            op.push(...temp, ...(new Array(4-temp.length).fill(null)));
        }
        return op;
    }

    const rightShift = (rows:Array<number|null>):Array<number|null> => {
        const op = [];
        for(let i=0; i<15; i+=4){
            const temp: number[] = combine(rows.slice(i, i+4).filter(v=>typeof v=='number'), false);
            op.push(...(new Array(4-temp.length).fill(null)),...temp);
        }
        return op;
    }

    const upShift = (arr: Array<number|null>): Array<number|null> => {
        const op = (new Array(15)).fill(null);
        for(let i=0; i<4; i++){
            const temp: number[] = combine([arr[i], arr[i+4], arr[i+8], arr[i+12]].filter(v=>typeof v=='number'));
            [op[i], op[i+4], op[i+8], op[i+12]] = [...temp, ...(new Array(4-temp.length).fill(null))];
        }
        return op;
    }

    const downShift = (arr: Array<number|null>): Array<number|null> => {
        const op = (new Array(15)).fill(null);
        for(let i=0; i<4; i++){
            const temp: number[] = combine([arr[i], arr[i+4], arr[i+8], arr[i+12]].filter(v=>typeof v=='number'), false);
            [op[i], op[i+4], op[i+8], op[i+12]] = [...(new Array(4-temp.length).fill(null)), ...temp];
        }
        return op;
    }

    useEffect(() => {
        setRows(rows => generate(rows));
        // Add event listener for keydown event
        window.addEventListener('keydown', handleKeyDown);
        // Clean up event listener on component unmount
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, []);

    useEffect(()=>{
        setNextMoves({ down: downShift(rows), left: leftShift(rows), right: rightShift(rows), up: upShift(rows) });
    }, rows);

    const move = (key: Key, arr: Array<number|null>) => {
        setPrev(arr);
        let temp = [...arr];
        if (key == Key.ArrowLeft) temp = leftShift(temp);
        else if (key == Key.ArrowRight) temp = rightShift(temp);
        else if (key == Key.ArrowUp) temp = upShift(temp);
        else if (key == Key.ArrowDown) temp = downShift(temp);

        return generate(temp);
    }

    const handleKeyDown = (event: KeyboardEvent):void => {
        setCount(count => count+1);
        setUndoUsed(false);
        setPrev(rows);
        if(Object.values(Key).includes(event.key as Key)) setRows(rows => move(event.key as Key, rows));
    };


    return (
        <>
            <Head title="Welcome"/>
            <div className="relative sm:flex flex-col sm:justify-start pt-10 sm:items-center min-h-screen bg-dots-darker bg-center bg-slate-300 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-end">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Log in
                            </Link>

                            <Link
                                href={route('register')}
                                className="ms-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>


                <div className='mb-10 flex w-80 justify-center text-3xl border-red-700 border-2 rounded-lg'>
                    <div className='w-1/2'>
                        <div className='font-semibold underline flex p-2 justify-center items-center text-red-800 border-red-700 border-r-2'>Score:</div>
                        <div className='font-bold w-full flex p-2 justify-center items-center bg-red-800 text-slate-300'> {score} </div>
                    </div>
                    <div className='w-1/2'>
                        <div className='font-semibold underline flex p-2 justify-center items-center bg-red-800 text-slate-300 border-red-700 border-r-2'>Moves:</div>
                        <div className='font-bold w-full flex p-2 justify-center items-center text-red-800'> {count} </div>
                    </div>
                </div>
                <div className="w-96 bg-slate-400 h-96 rounded-md flex justify-evenly items-center flex-wrap">
                {
                    rows.map((v,i) => <NumberBlock text={v} key={`${i}`}  />)
                }
                </div>
                <div className='w-96 flex justify-evenly mt-8'>
                    <button onClick={newGame} className='bg-slate-200 text-xl py-2 px-4 rounded-lg w-36'> New game </button>
                    <button onClick={undo} disabled={undoUsed} className='bg-slate-200 text-xl py-2 px-4 rounded-lg w-36'> Undo </button>
                </div>

                <div className='hidden bg-red-50 text-slate-200'></div>
                <div className='hidden bg-red-100 text-slate-700'></div>
                <div className='hidden bg-red-200'></div>
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
