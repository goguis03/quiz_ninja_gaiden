const quizData = [
    {
        question: "Qui est le personnage principal de Ninja Gaiden ?",
        image: "images/ninja.png",
        a: "Ryu Hayabusa",
        b: "Ken Masters",
        c: "Sub-Zero",
        d: "Scorpion",
        correct: "a",
        bg: "images/bg1.jpg"
    },
    {
        question: "Quelle est l'arme emblématique de Ryu ?",
        image: "",
        a: "Katana",
        b: "Shuriken",
        c: "Dragon Sword",
        d: "Kunai",
        correct: "c",
        bg: "images/bg2.jpg"
    }
];

const startBtn = document.getElementById('startBtn');
const signup = document.getElementById('signup');
const quizContainer = document.getElementById('quiz-container');
const quiz = document.getElementById('quiz');
const submitBtn = document.getElementById('submit');
const result = document.getElementById('result');
const quizImage = document.getElementById('quiz-image');
const timerEl = document.getElementById('timer');
const scoreboard = document.getElementById('scoreboard');
const scoresTable = document.getElementById('scoresTable');
const container = document.querySelector('.container');
const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');

let currentQuestion = 0;
let score = 0;
let interval;
let timer = 10;
let username = "";

startBtn.addEventListener('click', () => {
    username = document.getElementById('username').value.trim();
    if(username === "") { alert("Veuillez entrer un nom ou pseudo !"); return; }
    signup.style.display = 'none';
    quizContainer.style.display = 'block';
    loadQuestion();
});

function loadQuestion() {
    const currentQuiz = quizData[currentQuestion];
    document.body.style.backgroundImage = `url('${currentQuiz.bg}')`;
    container.classList.remove('fade-out');

    clearInterval(interval);
    timer = 10;
    timerEl.textContent = timer;
    interval = setInterval(() => { 
        timer--; 
        timerEl.textContent = timer; 
        if(timer <=0){ clearInterval(interval); nextQuestion(); } 
    }, 1000);

    quiz.innerHTML = `
        <div class="question">${currentQuiz.question}</div>
        <label class="answer"><input type="radio" name="answer" value="a"> ${currentQuiz.a}</label>
        <label class="answer"><input type="radio" name="answer" value="b"> ${currentQuiz.b}</label>
        <label class="answer"><input type="radio" name="answer" value="c"> ${currentQuiz.c}</label>
        <label class="answer"><input type="radio" name="answer" value="d"> ${currentQuiz.d}</label>
    `;
    if(currentQuiz.image){ quizImage.src=currentQuiz.image; quizImage.style.display='block'; } else { quizImage.style.display='none'; }

    document.querySelectorAll('.answer').forEach(a=>{
        a.addEventListener('click',()=>{ clickSound.play(); });
    });
}

function fadeOutTransition(nextFunc){
    container.classList.add('fade-out');
    setTimeout(()=>{ container.classList.remove('fade-out'); nextFunc(); },500);
}

function getSelected(){
    const answers = document.getElementsByName('answer');
    let selected = undefined;
    answers.forEach(answer => { if(answer.checked) selected=answer.value; });
    return selected;
}

function nextQuestion(){
    const answer = getSelected();
    if(answer === quizData[currentQuestion].correct) score++;
    currentQuestion++;
    if(currentQuestion < quizData.length) fadeOutTransition(loadQuestion);
    else fadeOutTransition(showResult);
}

function showResult(){
    quizContainer.style.display='none';
    quizImage.style.display='none';
    clearInterval(interval);
    result.style.display='block';
    result.innerHTML=`<h2>${username}, vous avez ${score}/${quizData.length} bonnes réponses !</h2>`;
    winSound.play();

    let scores=JSON.parse(localStorage.getItem("ninjaScores"))||[];
    scores.push({name:username, score:score, date:new Date().toLocaleString()});
    localStorage.setItem("ninjaScores",JSON.stringify(scores));
    displayScores();
    scoreboard.style.display='block';
}

submitBtn.addEventListener('click', ()=>{
    clearInterval(interval);
    nextQuestion();
});

function displayScores(){
    let scores=JSON.parse(localStorage.getItem("ninjaScores"))||[];
    scores.sort((a,b)=>b.score-a.score);
    scoresTable.innerHTML="";
    scores.forEach(s=>{ scoresTable.innerHTML+=`<tr><td>${s.name}</td><td>${s.score}</td><td>${s.date}</td></tr>`; });
}
