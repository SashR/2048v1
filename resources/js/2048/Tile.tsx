import { Bomb } from "./Bomb";

interface Props {
    value: number|null,
    clicked: boolean,
    position: number,
    onClick: (pos:number)=>void
}

export function Tile({value, clicked, onClick, position}: Props){


    return (
        <>
            <div
                className="border-2 relative border-slate-300 bg-slate-500 flex justify-center items-center"
                style={{width: '30px', height:'30px', padding:'1px'}}
                onClick={()=>onClick(position)}
            >
                {
                    value==0 ? ''
                    : value==-1 ? <Bomb />
                    : value
                }
                {!clicked && <div className="bg-slate-600 border-2 opacity-55 border-slate-300 absolute" style={{width: '30px', height:'30px', padding:'1px'}}> </div>}
            </div>
        </>
    );
}
