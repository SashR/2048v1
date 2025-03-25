interface Scores {
    left: number, right: number, up: number, down:number
}

export class NextMove {
    move: Array<number|null>;
    score: number;
    constructor(move: Array<number|null>, score:number) {
        this.move = move;
        this.score = score;
    }
}

export const clearScores: Scores = {down:0, left:0, right:0, up:0}

export interface Data {
    left        : Array<number|null>,
    right       : Array<number|null>,
    up          : Array<number|null>,
    down        : Array<number|null>,
    curr        : Array<number|null>,
    prev        : Array<number|null>,
    score       : number,
    tempScores  : Scores,
    status      : 'lost'|'won'|'pending'
}

export enum Key {
    ArrowLeft='ArrowLeft', ArrowRight='ArrowRight', ArrowUp='ArrowUp', ArrowDown='ArrowDown',
}
