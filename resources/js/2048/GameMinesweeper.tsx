import { Mine } from "./Mine";

export default function GameMinesweeper () {


    return (
        <>
            <div
                className="relative bg-slate-400 rounded-md flex justify-evenly items-center flex-wrap"
                style={{width: '750px', height:'375px'}}
            >
                {
                new Array(450).fill(1).map((_,i)=>
                    <Mine key={i+1} value={1} />
                )}
            </div>
        </>
    );
}
