import { Link, Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import NumberBlock from './../2048/NumberBlock';
import { useEffect, useState } from 'react';
import { Key, Data, clearScores } from '@/types/2048types';
import { generate, move, leftShift, downShift, rightShift, upShift } from '@/types/2048pureFunctions';
import axios from 'axios';


export default function Welcome({ auth }: PageProps) {
    const [count, setCount] = useState<number>(0);
    const [undoUsed, setUndoUsed] = useState<boolean>(false);
    const [undosAvailable, setUndoAvailable] = useState<number>(3);

    const [data, setData] = useState<Data>({
        left        : new Array(16).fill(null),
        down        : new Array(16).fill(null),
        right       : new Array(16).fill(null),
        up          : new Array(16).fill(null),
        curr        : new Array(16).fill(null),
        prev        : new Array(16).fill(null),
        score       : 0,
        tempScores  : clearScores,
        status      : 'pending'
    });

    const newGame = () => {
        setCount(0);
        setUndoUsed(false);
        setUndoAvailable(3);
        setData(data => {
            const temp = generate(new Array(16).fill(null));
            // const temp = generate([1024, 512, 512, ...new Array(13).fill(null)]);                // win test
            // const temp = generate([2,4,8,16,4,8,16,32,8,16,32,64,16,32,64,64]);                 // lost test
            return {
                ...data,
                score: 0,
                tempScores: clearScores,
                curr: temp,
                down: downShift(temp,addScoreDown),
                up: upShift(temp,addScoreUp),
                right: rightShift(temp,addScoreRight),
                left: leftShift(temp,addScoreLeft),
                status: 'pending'
            }
        })
    };
    const undo = () => {
        setData(data => {
            return {
                ...data,
                curr: data.prev,
                down: downShift(data.prev, addScoreDown),
                up: upShift(data.prev, addScoreUp),
                right: rightShift(data.prev,addScoreRight),
                left: leftShift(data.prev,addScoreLeft),
                status: 'pending'
            }
        })
        setUndoAvailable(undos => undos-1);
        setUndoUsed(true);
    };

    const addScoreLeft = (score:number) => setData(data => {return {...data, tempScores:{...data.tempScores, left: score}};});
    const addScoreRight = (score:number) => setData(data => {return {...data, tempScores:{...data.tempScores, right: score}};});
    const addScoreUp = (score:number) => setData(data => {return {...data, tempScores:{...data.tempScores, up: score}};});
    const addScoreDown = (score:number) => setData(data => {return {...data, tempScores:{...data.tempScores, down: score}};});

    useEffect(() => {
        newGame();
        // Add event listener for keydown event
        window.addEventListener('keydown', handleKeyDown);
        // Clean up event listener on component unmount
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(()=>{
        if(data.status=='won') storeData(count, data.score);
    },[data.status])

    const storeData = async (moves:number, score:number) => {
        try {
            const resp = await axios.post('/store-score', {
                score: score, moves: moves
            });
        } catch (e:any){}
    }

    const handleKeyDown = (event: KeyboardEvent):void => {
        if(Object.values(Key).includes(event.key as Key)) {
            setData(data => {
                if(data.status == 'won') return data;
                let mv = move(event.key as Key, data);
                let [temp, plusScore] = [mv.move, mv.score];
                const numset = (arr:Array<number|null>):string => arr.join(",");
                if(numset(temp) !== numset(data.curr)){
                    temp = generate(temp);
                    setCount(count => count+1);
                    setUndoUsed(false);
                }
                const [left,right,up,down] = [leftShift(temp,addScoreLeft), rightShift(temp,addScoreRight),upShift(temp,addScoreUp), downShift(temp,addScoreDown)];
                const lossCheck = (new Set([left,right,up,down,temp].map(numset))).size === 1;

                return {
                    ...data,
                    score: data.score + plusScore,
                    prev: data.curr, curr: temp, down: down, up: up, right: right, left: left,
                    status: temp.includes(2048) ? 'won' : lossCheck ? 'lost' : 'pending'
                }
            });
        }
    };


    return (
        <>
            <Head title="Welcome"/>
            <div className="relative flex flex-col sm:justify-start pt-10 items-center min-h-screen bg-dots-darker bg-center bg-slate-300 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">


                <div className='mb-10 flex w-80 justify-center text-3xl border-red-700 border-2 rounded-lg'>
                    <div className='w-1/2'>
                        <div className='font-semibold underline flex p-2 justify-center items-center text-red-800 border-red-700 border-r-2'>Score:</div>
                        <div className='font-bold w-full flex p-2 justify-center items-center bg-red-800 text-slate-300'> {data.score} </div>
                    </div>
                    <div className='w-1/2'>
                        <div className='font-semibold underline flex p-2 justify-center items-center bg-red-800 text-slate-300 border-red-700 border-r-2'>Moves:</div>
                        <div className='font-bold w-full flex p-2 justify-center items-center text-red-800'> {count} </div>
                    </div>
                </div>
                <div className="w-96 relative bg-slate-400 h-96 rounded-md flex justify-evenly items-center flex-wrap">
                {
                    data.curr.map((v,i) => <NumberBlock text={v} key={`${i}`}  />)
                }
                    {
                    (data.status == 'won' || data.status == 'lost')  &&
                    <div
                        className={'transition-all ease-in duration-1000 scale-105 absolute text-7xl italic font-bold w-full h-full flex justify-center items-center ' + (data.status=='won'?'text-green-500':'text-red-500')}
                        style={{backgroundColor:'rgba(0, 0, 0, 0.61)'}}
                    >
                        You {data.status}!
                    </div>
                    }
                </div>
                <div className='w-96 flex justify-evenly mt-8'>
                    <button onClick={newGame} className='bg-slate-200 text-xl py-2 px-4 rounded-lg w-36'> New game </button>
                    <button
                        onClick={undo} disabled={undoUsed || !undosAvailable || !count}
                        className='bg-slate-200 text-xl py-2 px-4 rounded-lg w-36 disabled:bg-slate-500'
                    >
                        Undo ({undosAvailable})
                    </button>
                </div>

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
