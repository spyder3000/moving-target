class Misc {
    static  getRandomNum = (min, max) => {
        let diff = max - min + 1;  // e.g. 1000 - 1 + 1 will = 1000;  
        return Math.floor(Math.random() * diff) + min;  // e.g. 0-999 + 1 to give num from 1-1000 
    }

    static getBlurb(dat) {
        dat.blurb = dat.challenge + ' - target moves every ' + dat.minFreq;
        if (dat.maxFreq > dat.minFreq) dat.blurb += ' to ' + dat.maxFreq + ' turns'; 
        else dat.blurb += ' turn'; 
        dat.blurb += '; ' +dat.totMines + ' mines'; 
        if (dat.addMines == 1) dat.blurb += '; + added mines each turn'; 
        else if (dat.addMines == 3) dat.blurb += '; + added mines every 3 turns'; 

        dat.blurb2 = ''; 
        if (dat.hotColdOutage && dat.delayHotCold > 0) dat.blurb2 += '; Hot/Cold Outage AND Delay';  
        else if (dat.hotColdOutage) dat.blurb2 += '; Hot/Cold Outage';
        else if (dat.delayHotCold > 0) dat.blurb2 += '; Hot/Cold Delay';  
        
        if (dat.complexMoves) dat.blurb2 += '; Complex Moves';  

        if (dat.sizePuzzleMods > 0) dat.blurb2 += '; Puzzle size increase by ' + dat.sizePuzzleMods; 
        else if (dat.sizePuzzleMods < 0) dat.blurb2 += '; Puzzle size decrease by ' + Math.abs(dat.sizePuzzleMods); 
        if (dat.stopDupsMod == 1) dat.blurb2 += '; Remove guessed nums'; 
        else if (dat.stopDupsMod == 5) dat.blurb2 += '; Remove blocks of 5 nums'; 
        else if (dat.stopDupsMod == 10) dat.blurb2 += '; Remove blocks of 10 nums'; 
        dat.blurb2 = dat.blurb2.replace('; ', '');
    }    
}

module.exports = Misc; 

// const getRandomNum = (min, max) => {
//     let diff = max - min + 1;  // e.g. 1000 - 1 + 1 will = 1000;  
//     return Math.floor(Math.random() * diff) + min;  // e.g. 0-999 + 1 to give num from 1-1000 
// }

// module.exports = getRandomNum; 