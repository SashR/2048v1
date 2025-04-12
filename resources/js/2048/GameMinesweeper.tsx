import { ChangeEvent, useEffect, useState } from "react";
import { Tile } from "./Tile";
import { Bomb } from "./Bomb";
import { TileData, Data } from "@/types/MinesweeperTypes";
import { bombCount, cascadeClear, clickedCascadeClear } from "@/types/MinesweeperFunctions";


export default function GameMinesweeper () {
    const [data, setData] = useState<Data>({
        tiles: new Array(450).fill(new TileData(2,true,false)),
        totalMines: 99,
        unmarkedMines: 99,
        status: 'pending',
        mode: 'Hard',
        totalTiles: 450
    });
    const modes: Array<'Easy'|'Medium'|'Hard'|'Extreme'> = ['Easy','Medium','Hard','Extreme'];
    const [clickMode, setClickMode] = useState<boolean>(false);
    const handleClickModeChange = (ev: ChangeEvent) => setClickMode(cm => !cm);

    const loseEffects = () => {
        setData(data => {
            let temp = [...data.tiles];
            for(let tl of temp) {
                if(tl.value == -1) tl.clicked = true;
            }
            return {...data, tiles:temp, status: 'lost'}
        });
    }

    const handleLeftClick = (pos: number) => {
        if(data.tiles[pos].clicked) clickedCascadeClear(pos, data.tiles, clickTile, data.totalTiles);
        else if(clickMode) handleRightClick(pos);
        else {
            if(data.tiles[pos].value === 0) cascadeClear([pos], data.tiles, clickTile, data.totalTiles);
            else clickTile(pos);
        }
    }

    const clickTile = (pos: number) => {
        const tile = data.tiles[pos];
        if(!tile.marked){
            if(tile.value == -1) loseEffects();
            else {
                setData((data)=>{
                    const temp = [...data.tiles];
                    temp[pos] = {...temp[pos], clicked: true}
                    return { ...data, tiles: temp};
                });
            }
        }
    }

    const newGame = () => {
        setData((data)=>{
            // Generate 99 random numbers between 0 and 449
            const bombs: Array<number> = [];
            do {
                const num = Math.floor(Math.random() * data.totalTiles);
                if(!bombs.includes(num)) bombs.push(num);
            } while (bombs.length <data.totalMines);
            // Create array with -1s at the location of the random numbers
            const temp = new Array(data.totalTiles).fill(new TileData(0,false,false)).map((_,i)=>new TileData(bombs.includes(i) ? -1 : 0,false,false));

            return {
                ...data,
                unmarkedMines: data.totalMines,
                status: 'pending',
                tiles: temp.map((t,i) => new TileData(bombCount(t.value, i, temp,data.totalTiles), false,false))
            }
        });
    }

    const changeMode = (mode: 'Easy'|'Medium'|'Hard'|'Extreme') => {
        setData(data => {
            const newMines = {'Easy':49, 'Medium':79, 'Hard':99, 'Extreme':139};
            return { ...data, mode: mode, totalMines: newMines[mode]}
        });
        newGame();
    }

    const handleRightClick = (pos:number) => {
        if(!data.tiles[pos].clicked && data.unmarkedMines>0){
            setData((data)=>{
                const temp = [...data.tiles];
                temp[pos] = {...temp[pos], marked: !temp[pos].marked};
                return {...data, tiles: temp, unmarkedMines: data.unmarkedMines + (temp[pos].marked ? -1 : 1)};
            });
        }
    }

    useEffect(() => newGame(), []);

    useEffect(()=> {
        const winCheck = data.tiles.filter(t => t.clicked).length + data.totalMines == data.tiles.length;
        if(winCheck) setData(data => {return {...data, status: 'won'}});
    }, [data.tiles])

    // STILL TO BE IMPLEMENTED
    // Game mostly works but has some bugs and styling issues
    // Bomb sounds need to be added
    // Cascade when clicking on an already clicked tile works, but there are bugs
        // If a tile getting opened is empty, it cascades. This is correct
        // But it needs to also cascade if a tile is surround by enough marked tiles

    // Bug on normal cascade. Cascade opens up marked tiles.

    return (
        <>
            <div
                className="relative bg-slate-400 rounded-md flex justify-evenly items-center flex-wrap cursor-pointer"
                style={{width: `${30*data.totalTiles/15}px`, height:`${15*data.totalTiles/15}px`}}
            >
                { data.tiles.map((t,i)=>
                    <Tile tile={new TileData(t.value, t.clicked,t.marked)} key={i+1} position={i} onClick={handleLeftClick} onRightClick={handleRightClick}  />
                ) }
                {
                (data.status == 'won' || data.status == 'lost')  &&
                <div
                    className={'transition-all ease-in z-40 duration-1000 scale-105 absolute text-7xl italic font-bold w-full h-full flex justify-center items-center ' + (data.status=='won'?'text-green-500':'text-red-500')}
                    style={{backgroundColor: data.status=='won' ? 'rgba(0, 0, 0, 0.61)' : 'transparent'}}
                >
                    You {data.status}!
                </div>
                }
            </div>

            <div className='w-1/2 flex justify-evenly mt-8'>
                <div className="border border-white w-24 round-md text-slate-200 flex justify-evenly items-center">
                    <label htmlFor="clickMode"> Marking </label>
                    <input type="checkbox" id="clickMode" checked={clickMode} onChange={handleClickModeChange} />
                </div>

                <div className="flex justify-evenly text-xl items-center border border-white rounded-md w-36 text-slate-200">
                    {data.unmarkedMines}
                    <Bomb downscale />
                </div>
                <button onClick={newGame} className='bg-slate-200 text-xl py-2 px-4 rounded-lg w-36'> New game </button>
                <div className="text-slate-200 border border-slate-100 flex w-1/3 justify-between">
                    {
                        modes.map((m) => (
                            <button key={m} onClick={()=>changeMode(m)} className={`p-1 ${data.mode == m && 'bg-slate-200 text-slate-900 '}`}> {m} </button>
                        ))
                    }
                </div>
            </div>
        </>
    );
}
