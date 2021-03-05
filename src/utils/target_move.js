const Misc = require('./misc'); 

class TargetMove { 
     //-------------------------------------------------------------------------------------	
    //  checks the NextMod counter to determine if it's time for the target value to move;
    //     if so a new target value is found & a new counter for the next move is found
    //-------------------------------------------------------------------------------------
    static  checkMove = (dat) => {
        console.log('J0 -- checkMove ' + dat.nextMod)
        dat.moveInfo = ''; 
		if (dat.nextMod == 1)  {
            dat.targetMoved = true;       // indicates the target moved this turn;
            let complexType = ''; 
            if (dat.complexMoves) {
                console.log('complex moves'); 
                let x = Misc.getRandomNum(1, 100);  // Math.floor(Math.random() * 100) + 1; 
                if (x <= 20) complexType = 'twoMoves'; 
                else if (x <= 40) complexType = 'eitherOr'; 
            }

            // Logic to Handle Two Moves OR Either/or Move, OR just regular move 
            var oldValue = dat.targetValue; 
            console.log('J0 -- complexType ' + complexType)
            if (complexType == 'twoMoves') {
                let move1 = this.randTargetValue(dat, oldValue);
                dat.nextTargetValue = this.randTargetValue(dat, oldValue, move1); 
                dat.moveInfo = 'target moved by ' + Math.abs(oldValue - move1) + ', then by ' 
                                    + Math.abs(dat.nextTargetValue - move1);
                console.log('J0-01 -- dat = ' + dat.nextTargetValue + '; ' + dat.moveInfo); 
            }  else {
                dat.nextTargetValue = this.randTargetValue(dat, oldValue); 
                if (complexType == 'eitherOr') {
                    let realDist = Math.abs(oldValue - dat.nextTargetValue); 
                    let alternateDist = this.getAlternate(realDist, dat.totNumbers); 
                    if (alternateDist < realDist) {
                        dat.moveInfo = 'target moved by ' + alternateDist  + ' OR ' + realDist;  
                    } else {
                        dat.moveInfo = 'target moved by ' + realDist  + ' OR ' + alternateDist; 
                    }
                    console.log('J0-02 -- dat = ' + dat.nextTargetValue + '; ' + dat.moveInfo); 
                }
                else {
                    dat.moveInfo = 'target moved by ' + Math.abs(oldValue - dat.nextTargetValue);   
                    console.log('J0-03 -- dat = ' + dat.nextTargetValue + '; ' + dat.moveInfo); 
                }
            }
			dat.nextMod = this.calculateNextMod(dat.minFreq, dat.maxFreq); 
            dat.targetValue = dat.nextTargetValue; 
            console.log('J01 -- dat.nextMod = ' + dat.nextMod); 
        }
        else  {
            console.log('J0-02??'); 
            dat.targetMoved = false;
            dat.nextMod--; 
        } 
    }

    // logic to add/subtract either 100 or 200 to the real distance of move (e.g. an Alternate Distance)
    static  getAlternate = (val, highestVal) => {  // val is total distance moved;  highestVal = biggest allowed guess
        let rnd = Misc.getRandomNum(1, 2); 
        let coinFlip = Misc.getRandomNum(0, 1); 

        if (val < 100) return val + (100 * rnd);  
        if (val < 200 && coinFlip == 0) return val - 100; 
        if (val < 200) return val + (100 * rnd);  
        if (highestVal - val < 200 && coinFlip == 0) return val + 100;   
        if (highestVal - val < 200) return val + (100 * rnd); 
        if (coinFlip == 0) return val - (100 * rnd); 
        return val + (100 * rnd); 
    }	

    // get Random Target value in the current Range that is not curr #, mine #, or removed #
    static randTargetValue = (dat, currVal, secondVal) => {
        var tmpVal = currVal; 
        if (!secondVal) secondVal = -1;   // used for when we have 2 moves of target in 1 turn
        // Next Value must be different from Current Value and cannot be a value with a Mine OR a removed number
        console.log('WW removers = ' + dat.removers.removedNums); 
		while (tmpVal == currVal || tmpVal == secondVal || dat.mines.minesArray.indexOf(tmpVal) >= 0
                || dat.removers.removedNums.indexOf(tmpVal) >= 0) {
            tmpVal = Misc.getRandomNum(dat.firstNumber, dat.totNumbers);  
            console.log('W2 tmpVal = ' + tmpVal + '; fnd = ' + dat.removers.removedNums.indexOf(tmpVal)); 
        }		
        console.log('W3 ' + tmpVal); 
        return tmpVal; 
	}

    // should return a random number between the Min Freq and Max Freq inclusive 
    static calculateNextMod = (minFreq, maxFreq) => { 
        console.log(`calculateNextMod - ${maxFreq} - ${minFreq}`); 
        return Misc.getRandomNum(minFreq, maxFreq);  //Math.floor(Math.random() * (this.maxFreq - this.minFreq + 1)) + this.minFreq;
    } 

    static decrementNextMod = () => { 
        this.nextMod--;
    }     
}

module.exports = TargetMove; 