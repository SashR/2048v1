import { Bomb } from "./Bomb";
import { TileData } from "@/types/MinesweeperTypes";

interface Props {
    tile: TileData,
    position: number,
    onClick: (pos:number)=>void,
    onRightClick: (pos:number)=>void
}

export function Tile({tile, onClick, position, onRightClick}: Props){

    return (
        <>
            <div
                className="border-2 relative border-slate-300 bg-slate-500 flex justify-center items-center"
                style={{width: '30px', height:'30px', padding:'1px'}}
                onClick={()=>onClick(position)} onContextMenu={(e)=>{e.preventDefault(); onRightClick(position);}}
            >
                {
                    tile.value==0 ? ''
                    : tile.value === -1 ? <Bomb />
                    : tile.value
                }
                { !tile.clicked && <div className="bg-slate-600 border-2 z-10 opacity-55 border-slate-300 absolute" style={{width: '30px', height:'30px', padding:'1px'}}> </div>}
                { tile.marked && <div className="bg-red-600 border-2 z-10 opacity-55 border-red-300 absolute" style={{width: '30px', height:'30px', padding:'1px'}}> </div>}
            </div>
        </>
    );
}
