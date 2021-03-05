const Misc = require('./misc'); 

const Guess = class { 
    constructor(guessValue, gameDat /*, turnNumber, guessValue, targetValue, hotColdCheat*/) { 
        this.turnNumber = gameDat.turnNumber; 
        this.guessValue = guessValue; 
        this.targetValue = gameDat.targetValue; 
        this.nextTargetValue = gameDat.nextTargetValue; 
        this.hotColdCheat = gameDat.hotColdCheat; 
        this.hotColdOutage = gameDat.hotColdOutage; 
        this.complexMoves = gameDat.complexMoves; 
        this.delayHotCold = gameDat.delayHotCold; 
        this.sizePuzzleMods = gameDat.sizePuzzleMods; 
        this.showHotCold = (this.delayHotCold <= 0) ? true : false; 

        this.minesArray = gameDat.minesArray; 
        this.totNumbers = gameDat.totNumbers;
        this.firstNumber = gameDat.firstNumber; 
        this.maxFreq = gameDat.maxFreq; 
        this.minFreq = gameDat.minFreq; 
        this.removers = gameDat.removers;  
//        this.gameDat = gameDat; 

        this.result = '';         // result of guess (too high, too low, match)
        this.resultClass = '';    // class of result (used for formatting $result value)
        this.moveInfo = '';       // indicates by how much the target has moved;
        this.targetMoved = false;       // indicates if the target moved as part of this turn;
        this.nextMod = gameDat.nextMod;         // indicates how many turns before the target moves again
        this.hotColdLvl = '';     // Text indicating level for Hot/Cold 
        this.hotColdClass = '';   // class of hot/cold used for display
        this.explode = false; 

        this.compareNumber(); 
        this.checkMove(); 
        console.log('AAA = ' + this.minesArray.length); 
        if (this.minesArray && this.minesArray.length > 0) {
            this.explode = this.checkMines(); 
        }
    } 
  
    compareNumber() {      
		if (this.guessValue > this.targetValue) {	
			this.result = 'too high';  
			this.resultClass = 'high'; }
		else if (this.guessValue < this.targetValue) {
			this.result = 'too low';  
			this.resultClass = 'low'; }
		else  {
			this.result = 'match!!!';  
			this.resultClass = 'match';  }

		if (this.hotColdCheat)  {
            console.log(`hotColdOutage = ${this.hotColdOutage}`); 
            if (this.hotColdOutage) {
                console.log(`Test1`); 
                if (Misc.getRandomNum(1, 100) <= 20) {
                    console.log(`Test2`); 
                    this.hotColdLvl = '???';  
                    this.hotColdClass = 'gray1';  
                    return; 
                }  
            }
			var diff = Math.abs(this.guessValue - this.targetValue);  
			if (diff <= 10)  {
				this.hotColdLvl = 'very hot';  
				this.hotColdClass = 'red1';  }
			else if (diff <= 20) {
				this.hotColdLvl = 'hot';  
				this.hotColdClass = 'red2';  }		
			else if (diff <= 50) {
				this.hotColdLvl = 'warm';  
				this.hotColdClass = 'red3';  }	
			else if (diff <= 100) {
				this.hotColdLvl = 'neutral';  
				this.hotColdClass = 'gray1';  }	
			else if (diff <= 200) {
				this.hotColdLvl = 'cold';  
				this.hotColdClass = 'blue2';  }	
			else  {
				this.hotColdLvl = 'ice cold';  
				this.hotColdClass = 'blue1';  }				
		}	
	}	

    // checks if guess = any of the mines in array
    checkMines()  {
        return (this.minesArray.indexOf(this.guessValue) >= 0) ? true : false;   
    }	

    randTargetValue(currVal, secondVal) {
        var tmpVal = currVal; 
        if (!secondVal) secondVal = -1;   // used for when we have 2 moves of target in 1 turn
        // Next Value must be different from Current Value and cannot be a value with a Mine OR a removed number
        console.log('WW removers = ' + this.removers.removedNums); 
		while (tmpVal == currVal || tmpVal == secondVal || this.minesArray.indexOf(tmpVal) >= 0
                || this.removers.removedNums.indexOf(tmpVal) >= 0) {
            tmpVal = Misc.getRandomNum(this.firstNumber, this.totNumbers);  
            console.log('W2 tmpVal = ' + tmpVal + '; fnd = ' + this.removers.removedNums.indexOf(tmpVal)); 
        }		
        console.log('W3 ' + tmpVal); 
        return tmpVal; 
	}
    
    // should return a random number between the Min Freq and Max Freq inclusive 
    calculateNextMod() { 
        console.log(`calculateNextMod - ${this.maxFreq} - ${this.minFreq}`); 
        return Misc.getRandomNum(this.minFreq, this.maxFreq);  //Math.floor(Math.random() * (this.maxFreq - this.minFreq + 1)) + this.minFreq;
    } 

    decrementNextMod() { 
        this.nextMod--;
    } 

    //-------------------------------------------------------------------------------------	
    //  checks the NextMod counter to determine if it's time for the target value to move;
    //     if so a new target value is found & a new counter for the next move is found
    //-------------------------------------------------------------------------------------
	checkMove(nextMod, totalNumbers, minFreq, maxFreq)  {
		if (this.nextMod == 1)  {
            this.targetMoved = true;       // indicates the target moved this turn;
            let complexType = ''; 
            if (this.complexMoves) {
                console.log('complex moves'); 
                let x = Misc.getRandomNum(1, 100);  // Math.floor(Math.random() * 100) + 1; 
                if (x <= 20) complexType = 'twoMoves'; 
                else if (x <= 40) complexType = 'eitherOr'; 
            }

            // Logic to Handle Two Moves OR Either/or Move, OR just regular move 
            var oldValue = this.targetValue; 
            if (complexType == 'twoMoves') {
                let move1 = this.randTargetValue(oldValue);
                this.nextTargetValue = this.randTargetValue(oldValue, move1); 
                this.moveInfo = 'target moved by ' + Math.abs(oldValue - move1) + ', then by ' 
                                    + Math.abs(this.nextTargetValue - move1);
            }  else {
                this.nextTargetValue = this.randTargetValue(oldValue); 
                if (complexType == 'eitherOr') {
                    let realDist = Math.abs(oldValue - this.nextTargetValue); 
                    let alternateDist = this.getAlternate(realDist); 
                    if (alternateDist < realDist) {
                        this.moveInfo = 'target moved by ' + alternateDist  + ' OR ' + realDist;  
                    } else {
                        this.moveInfo = 'target moved by ' + realDist  + ' OR ' + alternateDist; 
                    }
                }
                else {
                    this.moveInfo = 'target moved by ' + Math.abs(oldValue - this.nextTargetValue);   
                }

            }
			this.nextMod = this.calculateNextMod(); 
        }
        else  {
            this.targetMoved = false;
            this.nextMod--;
        } 
    }

    // logic to add/subtract either 100 or 200 to the real distance of move
    getAlternate(val) {  // val is total distance moved
        let rnd = Misc.getRandomNum(1, 2); 
        let coinFlip = Misc.getRandomNum(0, 1); 

        if (val < 100) return val + (100 * rnd);  
        if (val < 200 && coinFlip == 0) return val - 100; 
        if (val < 200) return val + (100 * rnd);  
        if (this.totNumbers - val < 200 && coinFlip == 0) return val + 100;   
        if (this.totNumbers - val < 200) return val + (100 * rnd); 
        if (coinFlip == 0) return val - (100 * rnd); 
        return val + (100 * rnd); 
    }	
};  

module.exports = Guess; 