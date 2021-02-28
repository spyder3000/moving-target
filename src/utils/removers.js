const Misc = require('./misc'); 

const Removers = class { 
    constructor(blockSize) { 
        this.removedNums = [];          // cumulative array of all numbers that can no longer be selected
        this.removedSingles = [];       // list of single nums removed (e.g. guessed numbers by user removed)
        this.removedBlocks = [];        // blocks of 5 that are removed;  e.g. 1-200 represent the 200 blocks of 5 in 1000 num grid
        this.removedBlockNums = [];     // converted from removedBlocks to include the exact numbers
        this.displayArray = [];         // contains the text to display on webpage & a sort value
        this.blockSize = blockSize;     // total size of block to be removed
        console.log('populate Removers'); 
    } 
  
    removeSingle(num) {      
        if (this.removedNums.indexOf(num) < 0)  {
            this.removedNums.push(num); 
            this.removedSingles.push(num); 
            this.populateDisplayArray(); 
        }	
    }
    
    removeBlock(num, totNums, targetMoved) {
        // nextMod == 1 means that the target will be moving this turn, so we can remove the current block
        if (num && targetMoved) {
            console.log('CC - num found = ' + num + '; targetMoved = ' + targetMoved); 
            // Remove a block at the current location of size this.blockSize
            let blk = Math.floor((num - 1) / this.blockSize);    // e.g. 0 thru 199
            if (this.removedBlocks.indexOf(blk) < 0) {
                console.log('CC -- blk = ' + blk); 
                this.removedBlocks.push(blk);  
                for (let i = 1; i <= this.blockSize; i++) {
                    this.removedBlockNums.push((blk) * this.blockSize + i);  
                }
                console.log('CC -- blocks = ' + this.removedBlockNums.toString()); 
                this.modRemovedNumbers(blk); 
            }
        }
        // Target not moving OR we're just removing a random block 
        else {
            // Remove a Random block of size this.blockSize
            let x = false; 
            console.log('EE -- '); 
            while (!x) {
                let totBlocks = Math.floor(totNums / this.blockSize); 
                console.log('EE totBlocks = ' + totBlocks); 
                let blk = Misc.getRandomNum(0, totBlocks - 1); 
                console.log('EE misc num = ' + blk); 
                if (this.removedBlocks.indexOf(blk) < 0) {
                    this.removedBlocks.push(blk);  
                    for (let i = 1; i <=this.blockSize; i++) {
                        this.removedBlockNums.push((blk * this.blockSize) + i);  
                    }
                    x = true; 
                    this.modRemovedNumbers(blk);
                }
                console.log('EE -- blocks = ' + this.removedBlockNums.toString()); 
            }
        }
        this.populateDisplayArray(); 
        console.log('CCEE -- blocks = ' + this.displayArray.toString()); 
    }

    modRemovedNumbers(blk) {
        for (let i = 1; i <= this.blockSize; i++) {
            let num = (blk * this.blockSize) + i; 
            if (this.removedNums.indexOf(num) < 0)  {
                this.removedNums.push(num); 
            }
        }
        console.log('FFF = ' + this.removedNums); 
    }

    populateDisplayArray() {
        this.displayArray = []; 
        for (let i = 0; i < this.removedSingles.length; i++) {
            if (this.removedBlockNums.indexOf(this.removedSingles[i]) < 0) {
                let dat = { 
                    text: this.removedSingles[i].toString(), 
                    sortval: this.removedSingles[i] 
                }; 
                this.displayArray.push(dat); 
            }
        }
        for (let i = 0; i < this.removedBlocks.length; i++) { 
            let num1 = (this.blockSize * (this.removedBlocks[i]) + 1).toString(); 
            let num2 = (this.blockSize * (this.removedBlocks[i] + 1)).toString(); 
            let dat = { 
                text: num1 + '-' + num2, 
                sortval: (this.blockSize * this.removedBlocks[i]) + 3
            }
            this.displayArray.push(dat); 
        }
        this.displayArray.sort(compare); 
    }

    getDisplayArrayString() {
        let tmp = []; 
        for (let i = 0; i < this.displayArray.length; i++) {
            tmp.push(this.displayArray[i].text);
        }
        return tmp.toString(); 
    }
};  

function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const valA = a.sortval;
    const valB = b.sortval;
    
    let comparison = 0;
    if (valA > valB) {
        comparison = 1;
    } else if (valA < valB) {
        comparison = -1;
    }
    return comparison;
}

module.exports = Removers; 