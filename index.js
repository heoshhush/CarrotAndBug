
const container = document.querySelector('.container')
const playButton = document.querySelector('.playButton');
const timeLimit = document.querySelector('.timeLimit');
const field = document.querySelector('.field');
const score = document.querySelector('.score');

const winRestart = document.querySelector('.winRestart')
const loseRestart = document.querySelector('.loseRestart')
const stopRestart = document.querySelector('.stopRestart')

const winGame = document.querySelector('.winGame');
const loseGame = document.querySelector('.loseGame');
const stopGame = document.querySelector('.stopGame');


const bg__Audio = new Audio();
bg__Audio.src = 'sound/bg.mp3'
bg__Audio.play();
const bg__bugPull = new Audio();
bg__bugPull.src = 'sound/bug_pull.mp3';
const bg__carrotPull = new Audio();
bg__carrotPull.src = 'sound/carrot_pull.mp3';
const bg__gameWin = new Audio();
bg__gameWin.src = 'sound/game_win.mp3';
const bg__alert = new Audio();
bg__alert.src = 'sound/alert.wav'


let timeInterval
let i = 0;
let time = false;
let resumeEvent = new Event('click')

const readyMessage = document.createElement('div');
const goMessage = document.createElement('div');

// ----------게임 준비 ------------//
function gameReady(){

readyMessage.setAttribute('class','beforeMessage');
readyMessage.innerText = 'Ready...';
field.appendChild(readyMessage);
field.style.pointerEvents = 'none';
}

// ------------타이머 설정---------//
playButton.addEventListener('click',() => {

    // 타이머 시작
    if(time === false){
    readyMessage.remove();
    field.style.pointerEvents = 'auto';
    playButton.innerHTML = `<i class="fas fa-stop"></i>`;

    goMessage.setAttribute('class','beforeMessage');
    goMessage.innerText = 'GO!';
    field.appendChild(goMessage);
    setTimeout(() => goMessage.remove(), 1000)

    startTimer();
    time = true;
    } else {
    // 타이머 중지
    playButton.innerHTML = `<i class="fas fa-play"></i>`;
    clearInterval(timeInterval);
    time = false;
    stopGame.classList.add('visible');
    container.classList.add('noClick');
    stopGame.style.pointerEvents = 'auto';
    }
    })
;

// 타이머 count
function currentTime(){
    // 시간 초과하여 실패 상황 //
    if(i >= 9){
        playButton.dispatchEvent(resumeEvent);
                stopGame.classList.remove('visible');
                loseGame.classList.add('visible');
                container.classList.add('noClick');
                loseGame.style.pointerEvents = 'auto';
                timeLimit.innerText = '00';
    } else {
    timeLimit.innerText = `0${9 - i}`;
    i++;
    }

}

function startTimer(){
    timeInterval = setInterval(() => currentTime(), 1000); 
}


//------------ 랜덤 당근 & 벌레 생성 -----------//

    // X 좌표 생성
function numXGen(){


    const numX = Math.floor(Math.random()*920);
    return numX;
}
    // Y 좌표 생성
function numYGen(){
    const numY = Math.floor(Math.random()*200);
    return numY;
}

    // Carrot 생성 및 translate으로 랜덤 위치 지정
let carrotId = 0;
function carrotGen(){
    const carrot = document.createElement('img');
    carrot.setAttribute('class', 'carrot');
    carrot.setAttribute('data-id', carrotId)
    carrot.src = "img/carrot.png"
    field.appendChild(carrot);
    const x = numXGen();
    const y = numYGen();
    carrot.style.transform = `translate(${x}px, ${y}px)`;
    carrotId++
}
    // Bug 생성 및 translate으로 랜덤 위치 지정
function bugGen(){
    const bug = document.createElement('img');
    bug.setAttribute('class', 'bug');
    bug.setAttribute('data-type', 'bugType')
    bug.src = "img/bug.png"
    field.appendChild(bug);
    const x = numXGen();
    const y = numYGen();
    bug.style.transform = `translate(${x}px, ${y}px)`;
}
//  Carrot, Bug 생성
function createItems(){
    for(j = 0; j < 10; j ++){    
        carrotGen();
        bugGen();
}}

// -------------- 당근 & 벌레 잡기 -------------------- //


field.addEventListener('click', (event) => {
    
    // 클릭한 당근 삭제
    const dataset = event.target.dataset
    if(dataset.id){
    bg__carrotPull.play()
    const toBeDelete = document.querySelector(`img[data-id="${dataset.id}"]`)
    toBeDelete.remove();
    countCarrot();
    } 
    
    // Bug 클릭시 패배
    if(dataset.type === 'bugType'){

        bg__bugPull.play();
        playButton.dispatchEvent(resumeEvent); 
        stopGame.classList.remove('visible');

        
        loseGame.classList.add('visible');
        container.classList.add('noClick'); 
        loseGame.style.pointerEvents = 'auto';
        clearInterval(timeInterval);
  
        }

    // redo 버튼 클릭시 새로운 게임 시작
    if(event.target.tagName ==='I'){ 
    bg__alert.play();
    stopGame.classList.remove('visible');
    loseGame.classList.remove('visible');
    winGame.classList.remove('visible');
    container.classList.remove('noClick');
    
;
 

        // 남은 당근 삭제
        const delCarrots = document.querySelectorAll('.carrot');
        delCarrots.forEach((carrot) => carrot.remove());

        // 남은 벌레 삭제
        const delBugs = document.querySelectorAll('.bug');
        delBugs.forEach((bug) => bug.remove());

        // 게임 시작
        startGame();
        let resumeEvent = new Event('click')
        playButton.dispatchEvent(resumeEvent);
        timeLimit.innerText = '10';
        i = 0;


}});

// -------- 당근 숫자 scoring하기 및 승리요건 삽입하기 --------//
function countCarrot(){
    const carrots = document.querySelectorAll('img.carrot');
    score.innerText = `${carrots.length}`
    console.log(carrots.length);
    if(carrots.length === 0){
        bg__gameWin.play();
        
        //------ 당근 다뽑았을때 ------//
        const winGame = document.querySelector('.winGame');
        winGame.classList.add('visible');
        container.classList.add('noClick');
        winGame.style.pointerEvents = 'auto';
        clearInterval(timeInterval);

        playButton.dispatchEvent(resumeEvent);
        stopGame.classList.remove('visible');
    }
}



function startGame(){
    gameReady();
    createItems(); 
    countCarrot();
}
startGame();    

