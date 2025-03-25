import { Key, Data, NextMove } from "./2048types";

export const combine = (arr: number[], fwd:boolean = true, callback=(incr:number)=>{}) => {
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
