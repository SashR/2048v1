export class TileData {
    value: number;
    clicked: boolean;
    marked: boolean;
    constructor(value: number, clicked: boolean, marked: boolean) {
        [this.value, this.clicked, this.marked] = [value, clicked, marked];
    }
}

export interface Data {
    tiles: Array<TileData>,
    totalMines: number,
    unmarkedMines: number,
    status: 'won'|'pending'|'lost',
    mode: 'Easy'|'Medium'|'Hard'|'Extreme',
    totalTiles: number
}
