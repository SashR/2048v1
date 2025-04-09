import { TileData } from "./MinesweeperTypes";

export const bombCount = (v:number,i:number, tiles: Array<TileData>, total:number): number => {
    // At num counts to all of the locations without -1s (between 0 and 8)
    if(v == -1) return v;
    else {
        let temp = 0;
        const [topRow, bottomRow, leftCol, rightCol] = [i>=30, i<=total-1-30, i%30!=0, (i+1)%30!=0];
    if(topRow){                                                                                         // i < 30 => top row, so nothing is above it
            if(tiles[i-30].value == -1) temp += 1;
            if(leftCol && tiles[i-31].value == -1) temp += 1;
            if(rightCol && tiles[i-29].value == -1) temp += 1;
        }
        if(leftCol && tiles[i-1].value == -1) temp += 1;                                                // i/30==0 => first column, so nothing is to the left of it
        if(rightCol && tiles[i+1].value == -1) temp += 1;                                               // (i+1)%30==0 => last column, so nothing is to the right it
        if(bottomRow){                                                                                  // i>[total tiles]-1-30 => bottom row, so nothin is below it
            if(tiles[i+30].value == -1) temp += 1;
            if(leftCol && tiles[i+29].value == -1) temp += 1;
            if(rightCol && tiles[i+31].value == -1) temp += 1;
        }
        return temp;
    }
}


const genSurroundings = (pos:number, total:number): number[] => {
    let op = [];
    const [topRow, bottomRow, leftCol, rightCol] = [pos>=30, pos<=total-1-30, pos%30!=0, (pos+1)%30!=0];
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

export const cascadeClear = (pos:number[], tiles: TileData[],callback:(p:number)=>void, total:number):void => {
    let [toBeClicked, temp]:[number[], number[]] =[[], [...pos]];
    while(temp.length>0){
        let surroundings:number[] = [];
        // For each element in temp, generate surrounding values
        for(let v of temp) surroundings.push(...genSurroundings(v,total));
        // Filter out values that exist in toBeClicked and duplicates from surrounding values
        surroundings = new Array(...(new Set(surroundings))).filter(v => !toBeClicked.includes(v));
        // move original temp value to toBeClicked
        toBeClicked.push(...temp, ...surroundings.filter(v => tiles[v].value > 0));
        // loop through surrounding values, move non-zero ones to toBeClicked, move zero ones to temp
        temp = [...surroundings.filter(v => tiles[v].value == 0)];
    }
    toBeClicked.forEach(callback);
}

export const clickedCascadeClear = (pos:number, tiles: TileData[], click: (p:number)=>void, total:number) => {
    // On Click already clicked TILE => DONE EXTERNALLY
    const surroundings = genSurroundings(pos,total);
    // If Tile has the same number of marked TILES around it as its value (not more or less)
    if(surroundings.filter(v => tiles[v].marked).length === tiles[pos].value){
        // Then open up all non marked surrounding tiles.
        // IF A surrounding tile that is not marked is a bomb => You lose           => handled in click function
        surroundings.filter(v => !tiles[v].marked).forEach(click);
        // IF A surrounding tile that is not marked is empty i.e. has value of 0
        if(surroundings.filter(v => !tiles[v].marked).filter(v=>tiles[v].value===0).length > 0){
            // Then cascade
            cascadeClear(
                surroundings.filter(v => !tiles[v].marked).filter(v=>tiles[v].value===0),
                tiles , click, total
            );
        }
    }
}
