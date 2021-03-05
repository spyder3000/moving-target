const Misc = require('./misc'); 

const Mines = class { 
    constructor(dat) { 
        this.mine = (dat.totMinesCheat <= 0) ? false : true; 
        this.totMines = (dat.totMinesCheat) ? dat.totMinesCheat : 0; 
        this.addMines = dat.addMinesCheat; 
        this.minesArray = []; 
        this.dat = dat; 
        console.log('populate Mines - ' + this.totMines); 
        this.populateMines(); 
    } 
  
    // initial population of the Mines array;  
    populateMines() {
        while (this.minesArray.length < this.totMines) {
            let temp = Misc.getRandomNum(1, this.dat.totNumbers);  // Math.floor(Math.random() * this.totNumbers) + 1; 
            if (this.minesArray.indexOf(temp) < 0) this.minesArray.push(temp); 
        }	
        this.sortMines(); 
    }
    
    sortMines() {
        this.minesArray.sort(function(a,b) {return a - b}); 
    }

    // adds number of mines = cnt;  min & max are optional to add mines to targeted range
    addNewMines(cnt, min, max) {
        console.log('ADD New Mines'); 
        let minVal = (min) ? min : this.dat.firstNumber; 
        let maxVal = (max) ? max : this.dat.totNumbers; 
        let j = 0;   let tmpArray = []; 
        while (j < cnt) {
            let temp = Misc.getRandomNum(minVal, maxVal);   
            // exclude existing mine #s & the current guess  
            if (this.minesArray.indexOf(temp) < 0 && temp != this.dat.guessValue) {
                this.minesArray.push(temp); 
                j++; 
                tmpArray.push(temp); 
            }
        }	
        console.log('NEW mines = ' + tmpArray.toString());
        this.sortMines();  
        this.totMines += cnt; 
    }

    // used when we increase the size of the grid (e.g. by 100);  this adds mines to the new section proportional to other sections
    addMinesToBlock(increase) {
        // gets estimated value of how many mines per 100 squares of existing puzzle
        console.log('a = ' + this.minesArray.length + '; b = ' + this.dat.totNumbers + '; c = ' + this.dat.firstNumber); 
        let x = Math.floor((this.minesArray.length / (this.dat.totNumbers - increase - this.dat.firstNumber + 1)) * 100); 
        console.log ('x = ' + x); 
        let minVal = this.dat.totNumbers - increase + 1;   // min value of range to add mines for
        this.addNewMines(x, minVal, this.dat.totNumbers); 
    }

    countActiveMines() {
        // console.log('K = ' + this.firstNumber + '; ' + this.totNumbers + '; ' + this.minesArray.length); 
        const reducer = (accumulator, currentValue) => {
        //    console.log('K2 = ' + accumulator + '; ' + currentValue); 
           if (currentValue >= this.dat.firstNumber && currentValue <= this.dat.totNumbers
                && this.dat.removers.removedNums.indexOf(currentValue) < 0) {
                    accumulator += 1;
            } 
            return accumulator; 
       }
       return this.minesArray.reduce(reducer, 0);   // 0 is initial value
    }
};  

module.exports = Mines; 