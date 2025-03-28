import { Key, Data, NextMove } from "./2048types";

const combine = (arr: number[], fwd:boolean = true, callback=(incr:number)=>{}) => {
    const op: number[] = [];
    if(fwd){
        for(let i=0; i<arr.length; i++){
            if(i<arr.length-1 && arr[i]==arr[i+1]){
                callback(arr[i]*2);
                op.push(arr[i]*2);
                i++;
            } else op.push(arr[i]);
        }
    } else {
        for(let i=arr.length-1; i>=0; i--){
            if(i>0 && arr[i]==arr[i-1]){
                callback(arr[i]*2);
                op.unshift(arr[i]*2);
                i--;
            } else op.unshift(arr[i]);
        }
    }
    return op;
}

export const generate = (arr: Array<number|null>) => {
    const emptyIds = arr.map((v,i) => v==null ? i : null).filter(v => typeof v=='number');
    const id = emptyIds[Math.floor(Math.random() * emptyIds.length)];
    const numGen :number = Math.floor(Math.random() * 10) < 7 ? 2 : 4;
    return arr.map((v,i) => i===id ? numGen : v);
}

export const move = (key: Key, data: Data):NextMove => {
    if (key == Key.ArrowLeft) return new NextMove(data.left, data.tempScores.left);
    else if (key == Key.ArrowRight) return new NextMove(data.right, data.tempScores.right);
    else if (key == Key.ArrowUp) return new NextMove(data.up, data.tempScores.up);
    else return new NextMove(data.down, data.tempScores.down);
}


export const leftShift = (rows:Array<number|null>, callback=(score:number)=>{}):Array<number|null> => {
    const op = [];
    let score = 0;
    for(let i=0; i<15; i+=4){
        const temp: number[] = combine(rows.slice(i, i+4).filter(v=>typeof v=='number'), true, (incr)=>{score = score+incr;});
        op.push(...temp, ...(new Array(4-temp.length).fill(null)));
    }
    callback(score);
    return op;
}

export const rightShift = (rows:Array<number|null>, callback=(score:number)=>{}):Array<number|null> => {
    const op = [];
    let score = 0;
    for(let i=0; i<15; i+=4){
        const temp: number[] = combine(rows.slice(i, i+4).filter(v=>typeof v=='number'), false, (incr)=>{score = score+incr;});
        op.push(...(new Array(4-temp.length).fill(null)),...temp);
    }
    callback(score);
    return op;
}

export const upShift = (arr: Array<number|null>, callback=(score:number)=>{}): Array<number|null> => {
    const op = (new Array(15)).fill(null);
    let score = 0;
    for(let i=0; i<4; i++){
        const temp: number[] = combine([arr[i], arr[i+4], arr[i+8], arr[i+12]].filter(v=>typeof v=='number'), true, (incr)=>{score = score+incr;});
        [op[i], op[i+4], op[i+8], op[i+12]] = [...temp, ...(new Array(4-temp.length).fill(null))];
    }
    callback(score);
    return op;
}

export const downShift = (arr: Array<number|null>, callback=(score:number)=>{}): Array<number|null> => {
    const op = (new Array(15)).fill(null);
    let score = 0;
    for(let i=0; i<4; i++){
        const temp: number[] = combine([arr[i], arr[i+4], arr[i+8], arr[i+12]].filter(v=>typeof v=='number'), false, (incr)=>{score = score+incr});
        [op[i], op[i+4], op[i+8], op[i+12]] = [...(new Array(4-temp.length).fill(null)), ...temp];
    }
    callback(score);
    return op;
}
