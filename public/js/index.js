console.log('Index.js JavaScript file is loaded!'); 

const startGame = document.querySelector('#start'); 
const hotColdCheat = document.querySelector('input[name=hotColdCheat]');
const minefieldCheat = document.querySelector('input[name=minefieldCheat]'); 
const challenge = document.querySelector('#challenge'); 
const challenge_desc = document.querySelector('div.challenge_text_desc'); 

const customSections = document.querySelectorAll('span.custom'); 

customSections.forEach(function(item) {
   item.style.display = 'none';  
});

challenge.addEventListener('change', (e) => {
    console.log('challenge = ' + challenge.value); 
    if (challenge.value == "0") {
        customSections.forEach(function(item) {
            item.style.display = 'inline';  
            challenge_desc.style.display = 'none'; 
        });  
    } else {
        customSections.forEach(function(item) {
            item.style.display = 'none';  
            challenge_desc.style.display = 'block'; 
            challenge_desc.innerHTML = getHTML(challenge.value);  
        });          
    }
}); 

getHTML = (val) => {
    if (val == '1') return '<b>** Beginner Level challenge. **</b>  <br> No mines.  <br> Target Moves every 2 to 7 turns'; 
    if (val == '2') return '<b>** Easy Level challenge. **</b>  <br> 30 mines.  <br> Target Moves every 1 to 4 turns'; 
    if (val == '3') return '<b>** Easy Level challenge. **</b>  <br> 30 mines.  Added mines every 3 turns. <br> Target Moves every 2 to 5 turns'; 
    if (val == '4') return '<b>** Medium Level challenge. **</b>  <br> 60 mines.  <br> Target Moves every 1 to 3 turns'; 
    if (val == '5') return '<b>** Medium Level challenge. **</b>  <br> 30 mines.  Added mines every 3 turns <br> Hot/Cold Outage <br> Target Moves every 1 to 3 turns'; 
    if (val == '6') return '<b>** Difficult Level challenge. **</b>  <br> 30 mines.  Added mines every 3 turns. <br>  Complex Moves.  Hot/Cold Outage. <br> Target Moves every 1 to 2 turns'; 
    if (val == '7') return '<b>** Difficult Level challenge. **</b>  <br> 90 mines.  Hot/Cold Delayed 1 Turn <br> Complex moves <br>  Target Moves every 1 to 2 turns' ; 
    if (val == '8') return '<b>** Difficult Level challenge. **</b>  <br> 60 mines.  Added mines every 3 turns.  <br>  Complex Moves.  Hot/Cold Outage.  <br> Board expands by 100 every 4 moves <br> Target Moves every 1 to 4 turns'; 
    if (val == '9') return '<b>** Super Difficul Level challenge. **</b>  <br> 30 mines.  Added mines every 3 turns. <br>  Hot/Cold Delayed 3 Turns <br> Complex moves.  Hot/Cold Outage.  <br>  Target Moves every turn'; 
    if (val == '10') return '<b>** Super Difficul Level challenge. **</b>  <br> 120 mines.  Added mines every 3 turns. <br>  Hot/Cold Delayed 2 Turns <br> Complex moves.  Hot/Cold Outage. <br>  Board decreases by 50 every 4 moves. <br> Guessed numbers & blocks of 10 removed from grid<br> Target Moves every turn'; 
    else return 'to be determined'; 
}

startGame.addEventListener('click', (e) => {
//    e.preventDefault();         // e is for event;  preventDefault prevents the browser from automatically refreshing
    return; 
    let difficultyLevel = document.querySelector('input[name=diffLevel]:checked');
    let mineEl = document.querySelector('#mineNum'); 
    let mineNum = mineEl.options[mineEl.selectedIndex].value;  
    console.log('mineNum = ' + mineNum); 
    console.log(JSON.stringify(difficultyLevel.value)); 
    window.alert('click' + difficultyLevel.value + hotColdCheat.checked +minefieldCheat.checked); 
//    window.alert(minefieldCheatNum.value); 
//    console.log(minefieldCheatNum.options[minefieldCheatNum.selectedIndex].text); 
    window.location.href = "/begin?diff="+difficultyLevel.value+"&hotcold="+hotColdCheat.checked+"&mine="+minefieldCheat.checked+"&mineNum="+mineNum;
 //   $.get("/results2"); 
 /*   fetch('/help', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: {
                email: "John",
                password: "john@example.com"
            }
        })
    });*/

//    $.get("/results2"); 
//    $.get("/results?diff="+difficultyLevel.value+"&hotcold="+hotColdCheat.checked+"&mine="+minefieldCheat.checked); 
//    window.location.href = "/results?diff="+difficultyLevel.value+"&hotcold="+hotColdCheat.checked+"&mine="+minefieldCheat.checked;
})
