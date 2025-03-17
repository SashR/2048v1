import { Link, Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import NumberBlock from './../2048/NumberBlock';
import { useEffect, useState } from 'react';

export default function Welcome({ auth, laravelVersion, phpVersion }: PageProps<{ laravelVersion: string, phpVersion: string }>) {
    const [rows, setRows] = useState([
        null, null, null, 2,
        null, 8 ,null, 4,
        512, null, 16, null,
        64, 8, 4, 2
    ]);

    const leftShift = (rows:Array<number|null>):Array<number|null> => {
        const op = [];
        for(let i=0; i<15; i+=4){
            const temp = rows.slice(i, i+4).filter(v=>v);
            op.push(...temp, ...(new Array(4-temp.length).fill(null)));
        }
        return op;
    }

    const rightShift = (rows:Array<number|null>):Array<number|null> => {
        const op = [];
        for(let i=0; i<15; i+=4){
            const temp = rows.slice(i, i+4).filter(v=>v);
            op.push(...(new Array(4-temp.length).fill(null)),...temp);
        }
        return op;
    }

    const upShift = (arr: Array<number|null>): Array<number|null> => {
        const op = (new Array(15)).fill(null);
        for(let i=0; i<4; i++){
            const temp = ([arr[i], arr[i+4], arr[i+8], arr[i+12]]).filter(v=>v);
            [op[i], op[i+4], op[i+8], op[i+12]] = [...temp, ...(new Array(4-temp.length).fill(null))];
        }
        return op;
    }

    const downShift = (arr: Array<number|null>): Array<number|null> => {
        const op = (new Array(15)).fill(null);
        for(let i=0; i<4; i++){
            const temp = ([arr[i], arr[i+4], arr[i+8], arr[i+12]]).filter(v=>v);
            [op[i], op[i+4], op[i+8], op[i+12]] = [...(new Array(4-temp.length).fill(null)), ...temp];
        }
        return op;
    }

    useEffect(() => {
        // Add event listener for keydown event
        window.addEventListener('keydown', handleKeyDown);

        // Clean up event listener on component unmount
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, []);

    useEffect(()=>{
        console.log("Changed: ", rows);
    }, rows);

    const handleKeyDown = (event: KeyboardEvent):void => {
        switch(event.key){
            case 'ArrowLeft': setRows(rows => leftShift(rows)); break;
            case 'ArrowRight': setRows(rows => rightShift(rows)); break;
            case 'ArrowUp': setRows(rows => upShift(rows)); break;
            case 'ArrowDown': setRows(rows => downShift(rows)); break;
        }
    };


    return (
        <>
            <Head title="Welcome"/>
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
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

                <div className="w-96 bg-slate-400 h-96 rounded-md flex justify-evenly items-center flex-wrap">
                {
                    rows.map((v,i) => <NumberBlock text={v} key={`${i}`}  />)
                }
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
