import { useEffect, useState } from "react";
import { Tile } from "./Tile";
import { Bomb } from "./Bomb";


class TileData {
    value: number;
    clicked: boolean;
    marked: boolean;
    constructor(value: number, clicked: boolean, marked: boolean) {
        [this.value, this.clicked, this.marked] = [value, clicked, marked];
    }
}

interface Data {
    tiles: Array<TileData>,
    totalMines: number,
    unmarkedMines: number,
    status: 'won'|'pending'|'lost'
}

export default function GameMinesweeper () {
    const [data, setData] = useState<Data>({
        tiles: new Array(450).fill(new TileData(2,true,false)),
        totalMines: 99,
        unmarkedMines: 99,
        status: 'pending'
    });

    const bombCount = (v:number,i:number, tiles: Array<TileData>) => {
        // At num counts to all of the locations without -1s (between 0 and 8)
        if(v == -1) return v;
        else {
            let temp = 0;
            const [topRow, bottomRow, leftCol, rightCol] = [i>=30, i<=450-1-30, i%30!=0, (i+1)%30!=0];
        if(topRow){                                                                                         // i < 30 => top row, so nothing is above it
                if(tiles[i-30].value == -1) temp += 1;
                if(leftCol && tiles[i-31].value == -1) temp += 1;
                if(rightCol && tiles[i-29].value == -1) temp += 1;
            }
            if(leftCol && tiles[i-1].value == -1) temp += 1;                                                // i/30==0 => first column, so nothing is to the left of it
            if(rightCol && tiles[i+1].value == -1) temp += 1;                                               // (i+1)%30==0 => last column, so nothing is to the right it
            if(bottomRow){                                                                                  // i>450-1-30 => bottom row, so nothin is below it
                if(tiles[i+30].value == -1) temp += 1;
                if(leftCol && tiles[i+29].value == -1) temp += 1;
                if(rightCol && tiles[i+31].value == -1) temp += 1;
            }
            return temp;
        }
    }

    const loseEffects = () => {
        setData(data => {
            let temp = [...data.tiles];
            for(let tl of temp) {
                if(tl.value == -1) tl.clicked = true;
            }
            return {...data, tiles:temp, status: 'lost'}
        });
    }

    const tileClick = (pos: number) => {
        if(data.tiles[pos].value === 0) cascadeClear([pos], clickTile);
        else clickTile(pos);
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

    const cascadeClear = (pos:number[],callback:(p:number)=>void) => {
        let [toBeClicked, temp]:[number[], number[]] =[[], [...pos]];
        while(temp.length>0){
            let surroundings:number[] = [];
            // For each element in temp, generate surrounding values
            for(let v of temp) surroundings.push(...genSurroundings(v));
            // Filter out values that exist in toBeClicked and duplicates from surrounding values
            surroundings = new Array(...(new Set(surroundings))).filter(v => !toBeClicked.includes(v));
            // move original temp value to toBeClicked
            toBeClicked.push(...temp, ...surroundings.filter(v => data.tiles[v].value > 0));
            // loop through surrounding values, move non-zero ones to toBeClicked, move zero ones to temp
            temp = [...surroundings.filter(v => data.tiles[v].value == 0)];
        }
        toBeClicked.forEach(callback);
    }

    const clickedCascadeClear = (pos:number, tiles: TileData[], click: (p:number)=>void) => {
        // On Click already clicked TILE => DONE EXTERNALLY
        const surroundings = genSurroundings(pos);
        // If Tile has the same number of marked TILES around it as its value (not more or less)
        if(surroundings.filter(v => tiles[v].marked).length === tiles[pos].value){
            // Then open up all non marked surrounding tiles.
            // IF A surrounding tile that is not marked is a bomb => You lose           => handled in click function
            surroundings.filter(v => !tiles[v].marked).forEach(click);
            // IF A surrounding tile that is not marked is empty i.e. has value of 0
            if(surroundings.filter(v => !tiles[v].marked).filter(v=>tiles[v].value===0).length > 0){
                // Then cascade
                cascadeClear(surroundings.filter(v => !tiles[v].marked).filter(v=>tiles[v].value===0), click);
            }

        }
    }

    const genSurroundings = (pos:number) => {
        let op = [];
        const [topRow, bottomRow, leftCol, rightCol] = [pos>=30, pos<=450-1-30, pos%30!=0, (pos+1)%30!=0];
        if(topRow){
            op.push(pos-30);
            if(leftCol) op.push(pos-31);
            if(rightCol) op.push(pos-29);
        }
        if(leftCol) op.push(pos-1);
        if(rightCol) op.push(pos+1);
        if(bottomRow){
            op.push(pos+30);
            if(leftCol) op.push(pos+29);
            if(rightCol) op.push(pos+31);
        }
        return op;
    }

    const newGame = () => {
        setData((data)=>{
            // Generate 99 random numbers between 0 and 449
            const bombs: Array<number> = [];
            do {
                const num = Math.floor(Math.random() * 450);
                if(!bombs.includes(num)) bombs.push(num);
            } while (bombs.length <data.totalMines);
            // Create array with -1s at the location of the random numbers
            const temp = new Array(450).fill(new TileData(0,false,false)).map((_,i)=>new TileData(bombs.includes(i) ? -1 : 0,false,false));

            return {
                ...data,
                status: 'pending',
                tiles: temp.map((t,i) => new TileData(bombCount(t.value, i, temp), false,false))
            }
        });

    }

    const handleRightClick = (pos:number) => {
        setData((data)=>{
            const temp = [...data.tiles];
            temp[pos] = {...temp[pos], marked: !temp[pos].marked};
            return {...data, tiles: temp, unmarkedMines: data.unmarkedMines + (temp[pos].marked ? -1 : 1)};
        });
    }

    useEffect(() => {
        newGame();
        // Add event listener for keydown event
        // window.addEventListener('contextmenu', handleRightClick);
        // window.addEventListener('keydown', handleKeyDown);
        // Clean up event listener on component unmount
        // return () => {
        //   window.removeEventListener('keydown', handleKeyDown);
        // };
    }, []);

    // STILL TO BE IMPLEMENTED
    // SINGLE CLICK ON ALREADY CLICKED TILE TO OPEN ALL NON MARKED SURROUNDING VALUES (CASCADE LIKE FUNCTION) (IF MINE INCORRECTLY MARKED, IT EXPLODES AND YOU LOSE)

    return (
        <>
            <div
                className="relative bg-slate-400 rounded-md flex justify-evenly items-center flex-wrap cursor-pointer"
                style={{width: '900px', height:'450px'}}
            >
                { data.tiles.map((t,i)=>
                    <Tile key={i+1} value={t.value} clicked={t.clicked} position={i} marked={t.marked} onClick={tileClick} onRightClick={handleRightClick}  />
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

            <div className='w-96 flex justify-evenly mt-8'>
                <div className="flex justify-evenly text-xl items-center border border-white rounded-md w-36 text-slate-200">
                    {data.unmarkedMines}
                    <Bomb downscale />
                </div>
                <button onClick={newGame} className='bg-slate-200 text-xl py-2 px-4 rounded-lg w-36'> New game </button>
            </div>
        </>
    );
}
