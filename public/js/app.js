console.log('Client side JavaScript file is loaded!'); 

//const totMines = document.querySelector('span.tot_mines_num').innerHTML; 
const guessButton = document.querySelector('#guess'); 
const guessBox = document.querySelector('#userGuess'); 
const endGame = document.querySelector('span.endgame_ind'); 
const winScreen = document.querySelector('#imgwin'); 
const loseScreen = document.querySelector('#imglose'); 

if (guessBox) guessBox.focus(); 

if (endGame.innerText.trim() == '') console.log('one'); 
else console.log('two = ' + endGame.innerText.trim()); 

if (endGame.innerText.trim() == 'success') {
   $("#imgwin").show();
//   setTimeout(function() { $("#imgwin").hide(); }, 5000);

   // window.alert('trigger success screen')
   // if (winScreen.classList.contains("hideme")) {
   //    winScreen.classList.remove("hideme");
   // }
} else if (endGame.innerText.trim() == 'failure') {
   $("#imglose").show();
//   setTimeout(function() { $("#imglose").hide(); }, 5000);
   // window.alert('trigger failure screen')
   // if (loseScreen.classList.contains("hideme")) {
   //    loseScreen.classList.remove("hideme");
   // }
}

// totMines.addEventListener('change', (e) => {
//     window.alert('change'); 
// }); 

// guessButton.addEventListener('click', (e) => {
// //   e.preventDefault();  
//    window.alert('click Guess'); 
//    console.log('endgame = ' + endGame.innerText.trim()); 
// }); 