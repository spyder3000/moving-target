const Guess = require('./guess'); 
const Removers = require('./removers');
const Misc = require('./misc'); 

const Game = class { 
  constructor(dat) { 
    // Basic game setup 
    this.turnNumber = 1; 
    this.guessValue = 0; 
    this.totNumbers = (dat.totNumbers) ? dat.totNumbers : 1000; 
    this.firstNumber = 1; 
    this.maxGuesses = 40; 
    this.gameArray = []; 

    // Movement indicators
    this.nextMod = -1; 
    this.targetMoved = false; 

    // Cheats
    this.diffLevelCheat = dat.diffLevelCheat; 
    this.hotColdCheat = dat.hotcoldCheat;
    this.hotColdOutage = dat.hotColdOutageCheat; 
    this.complexMoves = dat.complexMovesCheat; 
    this.delayHotCold = (dat.delayHotColdCheat) ? dat.delayHotColdCheat : 0; 

    // Mines
    this.mine = (dat.totMinesCheat <= 0) ? false : true; 
    this.totMines = (dat.totMinesCheat) ? dat.totMinesCheat : 0; 
    this.addMines = dat.addMinesCheat; 
    this.minesArray = []; 

    // End of Game indicators
    this.finished = false; 
    this.success = false; 
    this.failure = false; 

    // data to keep track of puzzle increasing or decreasing in size;  
    this.sizePuzzleMods = (dat.sizePuzzleModsCheat) ? dat.sizePuzzleModsCheat : 0; 
    this.turnsSinceMod = 0;  

    // data for removing Selectable numbers from grid 
    this.stopDupsMod = (dat.stopDupsModCheat) ? dat.stopDupsModCheat : 0; 
    this.removeInd = (this.stopDupsMod > 0) ? true : false; 
    this.removedNumsText = ''; 
    this.removers = new Removers(this.stopDupsMod); 
    // console.log('GGG ' + this.stopDupsMod); 

    // initializes key values 
    if (this.mine) this.populateMines(); 
    this.populateMoveFrequency(); 
    this.targetValue = this.randTargetValue();        // get initial target values AFTER placing mines
    this.nextTargetValue = this.targetValue;  
    this.calculateNextMod();                          // populates this.nextMod
  } 
  
    populateMines() {
        while (this.minesArray.length < this.totMines) {
            let temp = Math.floor(Math.random() * this.totNumbers) + 1; 
//            console.log('temp = ' + temp); 
            if (this.minesArray.indexOf(temp) < 0) this.minesArray.push(temp); 
        }	
        // console.log('asdf = ' + typeof(this.minesArray[0]));
        this.minesArray.sort(function(a,b) {return a - b}); 
        // console.log('ABAB = ' + this.minesArray); 
    }

    addNewMines(cnt, min, max) {
        console.log('ADD New Mines'); 
        let minVal = (min) ? min : this.firstNumber; 
        let maxVal = (max) ? max : this.totNumbers; 
        let j = 0;   let tmpArray = []; 
        while (j < cnt) {
            let temp = Misc.getRandomNum(minVal, maxVal)  //Math.floor(Math.random() * this.totNumbers) + 1; 
            // exclude existing mine #s, the current guess, and any value < the current firstNumber 
            if (this.minesArray.indexOf(temp) < 0 && temp != this.guessValue /*&& temp >= this.firstNumber*/) {
                this.minesArray.push(temp); 
                j++; 
                tmpArray.push(temp); 
            }
        }	
        console.log('NEW mines = ' + tmpArray.toString());
        this.minesArray.sort(function(a,b) {return a - b}); 
        this.totMines += cnt; 
    }

    addMinesToBlock(increase) {
        // gets estimated value of how many mines per 100 squares of existing puzzle
        console.log('a = ' + this.minesArray.length + '; b = ' + this.totNumbers + '; c = ' + this.firstNumber); 
        let x = Math.floor((this.minesArray.length / (this.totNumbers - increase - this.firstNumber + 1)) * 100); 
        console.log ('x = ' + x); 
        let minVal = this.totNumbers - increase + 1;   // min value of range to add mines for
        this.addNewMines(x,minVal, this.totNumbers); 
    }

    randTargetValue(currVal) {
        var tmpVal = currVal; 
        while (tmpVal == currVal || this.minesArray.indexOf(tmpVal) >= 0) {
            tmpVal = Math.floor(Math.random() * this.totNumbers) + 1;  
        }		
        return tmpVal; 
    }

    populateMoveFrequency() {
		if (this.diffLevelCheat == 1) {
            this.minFreq = 3;  this.maxFreq = 10; }
        else if (this.diffLevelCheat == 2) {
            this.minFreq = 2;  this.maxFreq = 7; }    
        else if (this.diffLevelCheat == 3) {
            this.minFreq = 2;  this.maxFreq = 5; } 
        else if (this.diffLevelCheat == 4) {
            this.minFreq = 1;  this.maxFreq = 4; } 
        else if (this.diffLevelCheat == 5) {
            this.minFreq = 1;  this.maxFreq = 3; } 
        else if (this.diffLevelCheat == 6) {
            this.minFreq = 1;  this.maxFreq = 2; } 
        else if (this.diffLevelCheat == 7) {
            this.minFreq = 1;  this.maxFreq = 1; } 
        else {
            this.minFreq = 3;  this.maxFreq = 10; }  
    }
    
    // should return a random number between the Min Freq and Max Freq inclusive 
    calculateNextMod() { 
        this.nextMod = Math.floor(Math.random() * (this.maxFreq - this.minFreq + 1)) + this.minFreq;
    } 

    decrementNextMod() { 
        this.nextMod--;
    } 

    processGuess(userGuess) {
        this.guessValue = parseInt(userGuess); 
        console.log('Game processGuess -- nextMod BEFORE = ' + this.nextMod); 
        var tmpGuess = new Guess(this.guessValue, this);
        this.modGameData(tmpGuess); 
        console.log('Game processGuess -- nextMod AFTER = ' + this.nextMod + '; currTarg = ' + this.targetValue 
            + '; nextTarg = ' + this.nextTargetValue); 
/*        console.log(`A1 = ${this.finished}`); 
        console.log(`A2 = ${this.addMines}`); 
        console.log(`A3 = ${this.turnNumber}`); */
        // console.log(`A4 = ${this.sizePuzzleMods}`);
        // console.log(`A5 = ${this.stopDupsMod}`);
        if (!this.finished && this.addMines && this.turnNumber % 3 == 0 && this.turnNumber > 0 ) {
            this.addNewMines(10); 
        }
        if (!this.finished && this.stopDupsMod > 0) {
            if (this.stopDupsMod == 1) {
                this.removers.removeSingle(userGuess); 
                // console.log(this.removers.removedNums); 
                // console.log(this.removers.displayArray);
            } else if (this.stopDupsMod > 1) {
//                this.removers.removeSingle(userGuess); 
                this.removers.removeBlock(userGuess, this.totNumbers, this.targetMoved); 
                console.log('remove Block -- ' + this.removers.removedNums);                
            }
            this.removedNumsText = this.removers.getDisplayArrayString(); 
        }

        if (!this.finished && this.sizePuzzleMods != 0) {
            this.turnsSinceMod++; 
            if (this.turnsSinceMod > 3) {
                if (this.sizePuzzleMods < 0) this.decreasePuzzleSize();
                else this.increasePuzzleSize(); 
                this.turnsSinceMod = 0; 
            } 
        }

        // modifies previous Hot/Cold values to show data (once the delay has passed)
        this.gameArray.push(tmpGuess);
        if (this.delayHotCold == 1 && this.turnNumber > 1) this.modShowHotCold(1); 
        if (this.delayHotCold == 2 && this.turnNumber > 2) this.modShowHotCold(2); 
        if (this.delayHotCold == 3 && this.turnNumber > 3) this.modShowHotCold(3); 
        // shows all hidden Hot/Cold values now that game is over
        if (this.finished) {
            this.modShowHotCold(0); 
            if (this.turnNumber > 1 && this.delayHotCold >= 2) this.modShowHotCold(1);
            if (this.turnNumber > 2 && this.delayHotCold >= 3) this.modShowHotCold(2);
        }
        this.turnNumber++; 
    }

    decreasePuzzleSize() {
        let decrement = Math.abs(this.sizePuzzleMods); 
        // if current guess is in the last block (the one to potentially be removed), remove first block instead
        if (this.guessValue > (this.totNumbers - decrement )) {
            console.log('increase minimum number');
            this.firstNumber += decrement; 
        }   
        // if current guess is in the first block (the one to potentially be removed), remove last block instead
        else if (this.guessValue < (this.firstNumber + decrement)) {
            this.totNumbers -= decrement; 
        } 
        // randomly determine which block to remove;  
        else {
            if (Misc.getRandomNum(0, 1) == 0) this.totNumbers -= decrement; 
            else this.firstNumber += decrement;
        } 
    }

    increasePuzzleSize() {
        let increment = Math.abs(this.sizePuzzleMods); 
        this.totNumbers += increment; 
        console.log('add mines to increment' + increment + ' to block ending with ' + this.totNumbers); 
        this.addMinesToBlock(increment);  
    }

    modShowHotCold(cnt) {
        this.gameArray[this.gameArray.length - cnt - 1].showHotCold = true; 
    }

    modGameData(tmpGuess) {
        this.nextMod = tmpGuess.nextMod; 
        this.targetMoved = tmpGuess.targetMoved; 
        this.targetValue = tmpGuess.nextTargetValue; 
        this.nextTargetValue = tmpGuess.nextTargetValue;   
        this.explode = tmpGuess.explode;    
        	
        if (tmpGuess.result == 'match!!!')  {
            this.finished = true;   
            this.success = true;  
            tmpGuess.moveDirection = null;  
            tmpGuess.moveInfo = null;   
            tmpGuess.hotColdLvl = "WIN"; 
            tmpGuess.hotColdClass = "end2"; 
        }
        else if (tmpGuess.turnNumber >= this.maxGuesses) {
            this.finished = true; 
            this.failure = true; 
            tmpGuess.hotColdLvl = "Loss"; 
            tmpGuess.hotColdClass = "end1"; 
    	}
            
        else if (tmpGuess.explode)  {
            this.finished = true; 
            this.failure = true; 
            tmpGuess.hotColdLvl = "Loss"; 
            tmpGuess.hotColdClass = "end1"; 	
        }    
    }

}; 

module.exports = Game; 