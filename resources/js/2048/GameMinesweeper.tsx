import { useEffect, useState } from "react";
import { Tile } from "./Tile";


class TileData {
    value: number;
    clicked: boolean;
    constructor(value: number, clicked: boolean) {
        [this.value, this.clicked] = [value, clicked];
    }
}

interface Data {
    tiles: Array<TileData>,
    totalMines: number
}

export default function GameMinesweeper () {
    const [data, setData] = useState<Data>({
        tiles: new Array(450).fill(new TileData(2,true)),
        totalMines: 79
    });
    // const [totalMines, setTotalMines]

    const bombCount = (v:number,i:number, tiles: Array<TileData>) => {
        if(v == -1) return v;
        else {
            let temp = 0;
            const [topRow, bottomRow, leftCol, rightCol] = [i>=30, i<=450-1-30, i%30!=0, (i+1)%30!=0];
            if(topRow){
                if(tiles[i-30].value == -1) temp += 1;
                if(leftCol && tiles[i-31].value == -1) temp += 1;
                if(rightCol && tiles[i-29].value == -1) temp += 1;
            }
            if(leftCol && tiles[i-1].value == -1) temp += 1;
            if(rightCol && tiles[i+1].value == -1) temp += 1;
            if(bottomRow){
                if(tiles[i+30].value == -1) temp += 1;
                if(leftCol && tiles[i+29].value == -1) temp += 1;
                if(rightCol && tiles[i+31].value == -1) temp += 1;
            }
            return temp;
        }
    }

    const tileClick = (pos: number) => {
        console.log(pos);
        setData((data)=>{
            const temp = [...data.tiles];
            temp[pos] = {...temp[pos], clicked: true}
            return {
                ...data,
                tiles: temp
            }
        });
    }

    const cascadeClear = (pos:number) => {
        const temp: TileData[] = data.tiles;
                // If click on an empty tile, clear on tiles that connected to it, check image for reference
        let [empty, vertical, toReview]: [number[],boolean, number[]] = [[],false, [pos]];
        // Clicked on tile 15, it is empty
        while(toReview.length > 0){
            for(let v of toReview){
                const a:number[] = [];
                if(vertical){
                    const colStart: number = v%30;
                    // Traverse to the top
                    for(let i=v-30; i>=colStart;i-=30){
                        if(temp[i].value == 0 && ![...toReview,...a,...empty].includes(i)) a.push(i);   // Empty value check => Add to toReview
                        else break;                                                                     // Stop if hitting a non-zero number
                    }
                    // Traverse to the bottom
                    for(let i=v+30; i<=420+colStart;i+=30){
                        if(temp[i].value == 0 && ![...toReview,...a,...empty].includes(i)) a.push(i);   // Empty value check => Add to toReview
                        else break;                                                                     // Stop if hitting a non-zero number
                    }
                } else {
                    const rowStart: number = Math.floor(v/30)*30;
                    // Traverse to the left
                    for(let i=v-1; i>=rowStart;i--){
                        if(temp[i].value == 0 && ![...toReview,...a,...empty].includes(i)) a.push(i);   // Empty value check => Add to toReview
                        else break;                                                                     // Stop if hitting a non-zero number
                    }
                    // Traverse to the right
                    for(let i=v+1; i<rowStart+30;i++){
                        if(temp[i].value == 0 && ![...toReview,...a,...empty].includes(i)) a.push(i);   // Empty value check => Add to toReview
                        else break;                                                                     // Stop if hitting a non-zero number
                    }
                }
                toReview = [...toReview.filter(v1=>v1!=v), ...a];                       // Removes v from toReview
                empty.push(v);                                                          // Pushes v to empty
                vertical = !vertical;                                                   // Switches movement
            }
        }
        // Find first non-zero pos to the left and right, generate array
        // => empty = [], vertical=true; toReview = [14, 15, 16, 17]           ; if the last move is vertical, set vertical to true, else set vertical to false
        // Loop through this array, going top and down getting empty position, as doing so set clicked property on these positions
        // => empty = [14, 15, 16, 17]; vertical=false; toReview = [44,74,104,134,164,45,65,46,76,47,77]
        // Loop through this array, going left and right getting empty position (if it not in empty or toReview), as doing so set clicked property on these positions
        // => empty = [14, 15, 16, 17, 44,74,104,134,164,45,65,46,76,47,77]; vertical=true; toReview = [78,79,80]
        // Loop through this array, going up and down getting empty position (if it not in empty or toReview), as doing so set clicked property on these positions
        // => empty = [14, 15, 16, 17, 44,74,104,134,164,45,65,46,76,47,77,78,79,80]; vertical=false; toReview = [108,138,168,109,139]
        // Loop through this array, going left and right getting empty position (if it not in empty or toReview), as doing so set clicked property on these positions
        // => empty = [14, 15, 16, 17, 44,74,104,134,164,45,65,46,76,47,77,78,79,80,108,138,168,109,139]; vertical=true; toReview = []
        // Since toReview is empty, exit function
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
            const temp = new Array(450).fill(new TileData(0,false)).map((_,i)=>new TileData(bombs.includes(i) ? -1 : 0,false));

            // At num counts to all of the locations without -1s (between 0 and 8)
            // Rules
                // i < 30 => top row, so nothing is above it
                // (i+1)%30==0 => last column, so nothing is to the right it
                // i/30==0 => first column, so nothing is to the left of it
                // i>450-1-30 => bottom row, so nothin is below it
            return {
                ...data,
                tiles: temp.map((t,i) => new TileData(bombCount(t.value, i, temp), true))
            }
        });

    }

    useEffect(() => {
        newGame();
        // Add event listener for keydown event
        // window.addEventListener('keydown', handleKeyDown);
        // Clean up event listener on component unmount
        // return () => {
        //   window.removeEventListener('keydown', handleKeyDown);
        // };
    }, []);

    return (
        <>
            <div
                className="relative bg-slate-400 rounded-md flex justify-evenly items-center flex-wrap"
                style={{width: '900px', height:'450px'}}
            >
                { data.tiles.map((t,i)=> <Tile key={i+1} value={t.value} clicked={t.clicked} position={i} onClick={tileClick} />) }
            </div>

            <div className='w-96 flex justify-evenly mt-8'>
                <button onClick={newGame} className='bg-slate-200 text-xl py-2 px-4 rounded-lg w-36'> New game </button>
                {/* <button
                    onClick={undo} disabled={undoUsed || !undosAvailable || !count}
                    className='bg-slate-200 text-xl py-2 px-4 rounded-lg w-36 disabled:bg-slate-500'
                >
                    Undo ({undosAvailable})
                </button> */}
            </div>
        </>
    );
}
