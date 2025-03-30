import { Bomb } from "./Bomb";

interface Props {
    value: number|null
}

export function Tile({value}: Props){


    return (
        <>
            <div className="border-2 border-slate-100 flex justify-center items-center" style={{width: '25px', height:'25px', padding:'1px'}}>
                {
                    value==0 ? ''
                    : value==-1 ? <Bomb />
                    : value
                }
            </div>
        </>
    );
}
