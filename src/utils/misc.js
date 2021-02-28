class Misc {
    static  getRandomNum = (min, max) => {
        let diff = max - min + 1;  // e.g. 1000 - 1 + 1 will = 1000;  
        return Math.floor(Math.random() * diff) + min;  // e.g. 0-999 + 1 to give num from 1-1000 
    }
}

module.exports = Misc; 

// const getRandomNum = (min, max) => {
//     let diff = max - min + 1;  // e.g. 1000 - 1 + 1 will = 1000;  
//     return Math.floor(Math.random() * diff) + min;  // e.g. 0-999 + 1 to give num from 1-1000 
// }

// module.exports = getRandomNum; 