const Guess = require('./guess'); 
const Removers = require('./removers');
const Mines = require('./mines');
const Misc = require('./misc'); 
const TargetMove = require('./target_move'); 

const Game = class { 
    constructor(dat) { 
        // Basic game setup 
        this.turnNumber = 1; 
        this.guessValue = 0; 
        this.totNumbers = (dat.totNumbers) ? dat.totNumbers : 1000; 
        this.totValids = this.totNumbers; 
        this.firstNumber = 1; 
        this.maxGuesses = 40; 
        this.gameArray = []; 
        this.challenge = dat.challenge; 

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
        this.totMinesCheat = (dat.totMinesCheat) ? dat.totMinesCheat : 0; 
        this.addMinesCheat = dat.addMinesCheat; 
        if (this.addMinesCheat || this.totMinesCheat > 0) this.hasMines = true; 
        else this.hasMines = false; 

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
        this.mines = new Mines(this); 
        Misc.populateMoveFrequency(this); 
        this.targetValue = this.randTargetValue();        // get initial target values AFTER placing mines
        this.nextTargetValue = this.targetValue;  
        this.nextMod = TargetMove.calculateNextMod(this.minFreq, this.maxFreq);   // init the nextMod value (# moves before target changes)
        Misc.getBlurb(this); 
    } 

    randTargetValue(currVal) {
        var tmpVal = currVal; 
        while (tmpVal == currVal || this.mines.minesArray.indexOf(tmpVal) >= 0) {
            tmpVal = Misc.getRandomNum(this.firstNumber, this.totNumbers);  // Math.floor(Math.random() * this.totNumbers) + 1;  
        }		
        return tmpVal; 
    }

    processGuess(userGuess) {
        this.infoArray = []; 
        this.guessValue = parseInt(userGuess); 
        console.log('Game processGuess -- nextMod BEFORE = ' + this.nextMod + '; currTarg = ' + this.targetValue); 
        var tmpGuess = new Guess(this.guessValue, this);
        this.gameEndCheck(tmpGuess); 
        console.log('Game processGuess -- nextMod AFTER = ' + this.nextMod + '; currTarg = ' + this.targetValue 
            + '; nextTarg = ' + this.nextTargetValue); 

        if (this.nextMod == 1) this.targetMoved = true;   // set this value early so it can be used prior to TargetMove logic

        if (!this.finished && this.mines.addMines > 0  && this.turnNumber > 0 ) {
            if ((this.mines.addMines == 3 && this.turnNumber % 3 == 0) || this.mines.addMines == 1)  {
                this.mines.addNewMines(10); 
                this.infoArray.push('10 Mines added'); 
            }
        }
        if (!this.finished && this.stopDupsMod > 0) {
            if (this.stopDupsMod == 1) {
                this.removers.removeSingle(userGuess); 
                this.infoArray.push('Value ' + userGuess + ' removed from grid'); 
                // console.log(this.removers.removedNums); 
                // console.log(this.removers.displayArray);
            } else if (this.stopDupsMod > 1) {
//                this.removers.removeSingle(userGuess); 
                let blkText = this.removers.removeBlock(userGuess, this.totNumbers, this.targetMoved, this.targetValue, this.countActiveNums()); 
                if (blkText) {
                    this.infoArray.push(blkText + ' removed from grid'); 
                    console.log('remove Block -- ' + this.removers.removedNums);    
                }            
            }
            this.removedNumsText = this.removers.getDisplayArrayString(); 
        }

        if (!this.finished && this.sizePuzzleMods != 0) {
            this.turnsSinceMod++; 
            if (this.turnsSinceMod > 3) {
                if (this.sizePuzzleMods < 0) {
                    this.decreasePuzzleSize();
                    this.infoArray.push('Puzzle Size decreased by ' + Math.abs(this.sizePuzzleMods)); 
                    this.infoArray.push('Valid number range is now ' + this.firstNumber + ' thru ' + this.totNumbers); 
                }
                else {
                    this.increasePuzzleSize(); 
                    this.infoArray.push('Puzzle Size increased by ' + Math.abs(this.sizePuzzleMods)); 
                    this.infoArray.push('Valid number range is now ' + this.firstNumber + ' thru ' + this.totNumbers); 
                }
                this.turnsSinceMod = 0; 
            } 
        }

        // Move the Target to a new location 
        TargetMove.checkMove(this); 
        console.log('J5-01 -- dat = ' + this.nextTargetValue + '; ' + this.moveInfo); 
        tmpGuess.nextMod = this.nextMod;  // = tmpGuess.nextMod; 
        tmpGuess.targetMoved = this.targetMoved;  //  = tmpGuess.targetMoved; 
        tmpGuess.moveInfo = this.moveInfo;  // = tmpGuess.nextTargetValue; 
        tmpGuess.nextTargetValue = this.nextTargetValue;  // = tmpGuess.nextTargetValue;   
        this.gameArray.push(tmpGuess);

        // modifies previous Hot/Cold values to show data (once the delay has passed)
        if (this.delayHotCold == 1 && this.turnNumber > 1) this.modShowHotCold(1); 
        if (this.delayHotCold == 2 && this.turnNumber > 2) this.modShowHotCold(2); 
        if (this.delayHotCold == 3 && this.turnNumber > 3) this.modShowHotCold(3); 
        // shows all hidden Hot/Cold values now that game is over
        if (this.finished) {
            this.modShowHotCold(0); 
            if (this.turnNumber > 1 && this.delayHotCold >= 2) this.modShowHotCold(1);
            if (this.turnNumber > 2 && this.delayHotCold >= 3) this.modShowHotCold(2);
        }
        console.log('J1 ' + this.totValids); 
        this.totMinesActive = this.mines.countActiveMines();  
        this.totValids = this.countActiveNums(); 
        console.log('J2 ' + this.totValids); 
        this.turnNumber++; 
    }


    countActiveNums() {
        let num = 0; 
        console.log('W = ' + this.firstNumber + '; ' + this.totNumbers + '; ' + this.removers.removedNums.length); 
        for (let i = this.firstNumber; i <= this.totNumbers; i ++) {
            if (this.removers.removedNums.indexOf(i) < 0)  num++; 
        }
        return num; 
    }

    decreasePuzzleSize() {
        let decrement = Math.abs(this.sizePuzzleMods); 
        // do not decrease to the point that no numbers are selectable;  
        if (this.totNumbers - this.firstNumber <= 200 && decrement >= 100 && this.countActiveNums <= 120) return; 
        // If target Moved, make sure we don't eliminate blocks that would include the new number 
        if (this.targetMoved && this.targetValue > (this.totNumbers - decrement )) {
            console.log('increase minimum number');
            this.firstNumber += decrement;         
        }
        else if (this.targetMoved && this.targetValue < (this.firstNumber + decrement)) {
            this.totNumbers -= decrement; 
        }
        // if current guess is in the last block (the one to potentially be removed), remove first block instead
        else if (this.guessValue > (this.totNumbers - decrement )) {
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
        this.mines.addMinesToBlock(increment);  
    }

    modShowHotCold(cnt) {
        this.gameArray[this.gameArray.length - cnt - 1].showHotCold = true; 
    }

    gameEndCheck(tmpGuess) {
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