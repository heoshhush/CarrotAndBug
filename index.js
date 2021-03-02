// 복습포인트 1) 어이없게 html에서 defer를 안붙여주니까 변수 선언이 안되더라... 
// head에 script를 넣으면, 브라우저는 html 문서 읽다가 중지하고, javascript 읽어버리니까 const가 정의가 안됐던거임.
// 걍 script 만나자마자 멈춰버리네,, (defer는 자바 스크립트 다운 받아놓은뒤에, html다 읽히면 그때 바로 실행시킨다. async는 병렬)


// 복습포인트2) 나는 clearTimeout을 안하고 i에다가 조건을 줘서 타이머 정지 후 재작동시 정상 작동하도록 했음. 
// (Timeout을 그대로 두면 재작동시 멈춘 시간도 포함돼서 카운트가 되고, 그렇다고 clearTimeOut을하면, Timeout 기능 자체가 없어져버려서 카운트가 -까지 떨어짐.) 우짜노... 이게 맞나...


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


let timeInterval // 복습포인트3) 변수 이름을 let으로 먼저 선언해준다음에, 내용은 뒤에서 할당해준다면, 어떤 함수 안에서든 변수 이름을 활용할 수 있다는 장점이 있다(특히 함수 변수 이름을 요하는 함수의 경우에!)
let i = 0;
let time = false;
let resumeEvent = new Event('click')

const readyMessage = document.createElement('div');
const goMessage = document.createElement('div');

// 게임 준비
function gameReady(){

readyMessage.setAttribute('class','beforeMessage');
readyMessage.innerText = 'Ready...';
field.appendChild(readyMessage);
field.style.pointerEvents = 'none';
}

// 타이머 설정
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

// 타이머 count 방식
function currentTime(){
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
    // 복습포인트 4) 
    // timeInterval은 const가 아니라 let으로 선언한다! 1000ms 마다 값을 return하니까. 바뀔 수 있는 값이니까 제대로 담으려면 let으로 해야함.
    // timeOut = setTimeout(() => clearInterval(timeInterval),10001); // 10초뒤 정지라, 실행기능도 포함되어있구나! '10초 실행 뒤 정지시킬꺼임!'
    // setInterval이랑 setTimeout은 변수 선언만해줘도 작동시작함.

}


//------------ 랜덤 당근 & 벌레 생성 -----------//

// X 좌표 생성
function numXGen(){
    // field 사이즈는 1000px*300px

    
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
//  Carrt, Bug 생성 명령 실행
function createItems(){
    for(j = 0; j < 10; j ++){    
        carrotGen();
        bugGen();
}}

// -------------- 당근 & 벌레 잡기 -------------------- //
// 복습포인트7) eventListener는 앞에서 정했다가 뒤에서 정했다가 동일한 이벤트를 두고 여러군데에서 겹치게 정하면 안된다. 한군데에서 깔끔하게 정해야 작동한다.
field.addEventListener('click', (event) => {
    

    // 클릭한 당근 삭제
    const dataset = event.target.dataset
    if(dataset.id) {// 복습포인트 5)  ===이 아닌 ==를 쓰는 이유는, 0, ''등은 null과 비슷하게 궁극적으로 false가 될 수 있지만, type 자체를 따져보면(===), 각각은 다른 타입의 데이터다.
    bg__carrotPull.play()
    const toBeDelete = document.querySelector(`img[data-id="${dataset.id}"]`)
    toBeDelete.remove();
    countCarrot();

    } 
    
    // reset 상황2) Bug 클릭시 패배
    if(dataset.type === 'bugType'){

        bg__bugPull.play();
        playButton.dispatchEvent(resumeEvent); // 게임 시작! -> 벌레 잡거나 당근 다뽑음 -> 승리 혹은 패배 창 팝업! + timer 정지! -> 
        //이때, timer정지시 뜨는 팝업창 설치해놔서, 팝업창이 연달아 두개 뜬다는 문제점이있었는데, 정지시 팝업은 display none으로 개별 설정해줘서 해결!
        stopGame.classList.remove('visible');

        
        loseGame.classList.add('visible');
        container.classList.add('noClick'); // 복습포인트 8)나머지 클릭 못하게 할때에는, css에서 pointerEvents를 none하면 된다.
        loseGame.style.pointerEvents = 'auto';
        clearInterval(timeInterval);
  
        }
    // regame 버튼 클릭시 새로 게임 시작
    if(event.target.tagName ==='I'){ // dataset을 기준으로 조건 걸면 i의 dataset자체가 초기화되어서 안되는데, 그 이유는 혹시 hidden-aria떄문인가?
        console.log('나여깄다');
    bg__alert.play();
    stopGame.classList.remove('visible');
    loseGame.classList.remove('visible');
    winGame.classList.remove('visible');
    container.classList.remove('noClick');
    
;
    // 새로 게임 시작

    // 남은 당근 삭제
    const delCarrots = document.querySelectorAll('.carrot');
    delCarrots.forEach((carrot) => carrot.remove());

    // 남은 벌레 삭제
    const delBugs = document.querySelectorAll('.bug');
    delBugs.forEach((bug) => bug.remove());

    // 새로 게임 시작
    startGame();
    let resumeEvent = new Event('click')
    playButton.dispatchEvent(resumeEvent);
    timeLimit.innerText = '10';
    i = 0;


}});

// -------- 당근 숫자 scoring하기 및 승리요건 삽입하기 -------- 
function countCarrot(){
    const carrots = document.querySelectorAll('img.carrot');
    score.innerText = `${carrots.length}`
    console.log(carrots.length);
    if(carrots.length === 0){
        bg__gameWin.play();
        //reset 상황3) 당근 다뽑았을때
        const winGame = document.querySelector('.winGame');
        winGame.classList.add('visible');
        container.classList.add('noClick');
        winGame.style.pointerEvents = 'auto';
        clearInterval(timeInterval);

        playButton.dispatchEvent(resumeEvent);
        stopGame.classList.remove('visible');
    }
}


// ------------ 시간 다됐을때 실패시키기 ------------




function startGame(){
    gameReady();
    createItems(); // 복습포인트 6) i가 겹쳐서 카운트가 시작이 안됐었음. 큰 함수 아래에 묶어놓으면 서로 변수를 공유하는구나..
    countCarrot();
}
startGame();    

// 다잡았을떄, 즉 게임종료상황일때, 버튼을 돌려놔야함.
// 벌레 눌렀을때 정지버튼 -> 시작버튼으로 


// 추가할 것: 
// 1) 리겜했을때 10개 더 생성되는거 
// 2) 중지 했을때 뜰 화면
// 3) 시작버튼 눌러야 벌레 & 당근들 클릭할 수 있도록 

