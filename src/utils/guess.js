const Misc = require('./misc'); 

const Guess = class { 
    constructor(guessValue, gameDat /*, turnNumber, guessValue, targetValue, hotColdCheat*/) { 
        this.turnNumber = gameDat.turnNumber; 
        this.guessValue = guessValue; 
        this.targetValue = gameDat.targetValue; 
//d        this.nextTargetValue = gameDat.nextTargetValue; 
        this.hotColdCheat = gameDat.hotColdCheat; 
        this.hotColdOutage = gameDat.hotColdOutage; 
 //d       this.complexMoves = gameDat.complexMoves; 
//d        this.delayHotCold = gameDat.delayHotCold; 
//d        this.sizePuzzleMods = gameDat.sizePuzzleMods; 
        this.showHotCold = (gameDat.delayHotCold <= 0) ? true : false; 

        this.minesArray = gameDat.minesArray; 
//d        this.totNumbers = gameDat.totNumbers;
//d        this.firstNumber = gameDat.firstNumber; 
//d        this.maxFreq = gameDat.maxFreq; 
//d        this.minFreq = gameDat.minFreq; 
//d        this.removers = gameDat.removers;  

        this.result = '';         // result of guess (too high, too low, match)
        this.resultClass = '';    // class of result (used for formatting $result value)
        this.moveInfo = '';       // indicates by how much the target has moved;
        this.targetMoved = false;       // indicates if the target moved as part of this turn;
        this.nextMod = gameDat.nextMod;         // indicates how many turns before the target moves again
        this.hotColdLvl = '';     // Text indicating level for Hot/Cold 
        this.hotColdClass = '';   // class of hot/cold used for display
        this.explode = false; 

        this.compareNumber(); 

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
}
module.exports = Guess; 