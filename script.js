const size = 15;
let timer = 0;
let interval;
let playerName = "";   // added

const solution = [
[1,1,1,1,1,0,0,1,1,1,0,0,1,1,1],
[1,0,0,0,1,0,1,1,1,0,1,0,1,0,1],
[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
[1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
[1,0,0,0,1,0,1,0,1,0,1,0,0,0,1],
[1,1,1,1,1,0,1,0,1,0,1,1,1,1,1],
[0,0,0,0,0,0,1,0,1,0,0,0,0,0,0],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[0,0,0,0,0,0,1,0,1,0,0,0,0,0,0],
[1,1,1,1,1,0,1,0,1,0,1,1,1,1,1],
[1,0,0,0,1,0,1,0,1,0,1,0,0,0,1],
[1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
[1,0,0,0,1,0,1,1,1,0,1,0,0,0,1],
[1,1,1,1,1,0,0,1,1,1,0,0,1,1,1],
];

/* ================= START GAME (ADDED) ================= */

function startGame() {

  const nameInput = document.getElementById("playerName").value.trim();

  if(nameInput === ""){
    alert("Please enter your name");
    return;
  }

  playerName = nameInput;

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameArea").style.display = "block";

  buildGame();   // your original function
}

/* ================= TIMER ================= */

function startTimer() {
interval = setInterval(() => {
timer++;
let m = Math.floor(timer/60).toString().padStart(2,'0');
let s = (timer%60).toString().padStart(2,'0');
document.getElementById("timer").innerText = `Time: ${m}:${s}`;
},1000);
}

/* ================= CLUE LOGIC (UNCHANGED) ================= */

function generateClues(line) {
let clues = [];
let count = 0;
for (let i=0;i<line.length;i++) {
if(line[i]===1) count++;
else {
if(count>0) clues.push(count);
count=0;
}
}
if(count>0) clues.push(count);
if(clues.length===0) clues=[0];
return clues;
}

/* ================= BUILD GAME (UNCHANGED) ================= */

function buildGame() {
const container = document.getElementById("game");
container.innerHTML = "";  // small safety clear
const table = document.createElement("table");

let colClues = [];
for(let c=0;c<size;c++){
let col = solution.map(row => row[c]);
colClues.push(generateClues(col));
}

let rowClues = solution.map(row => generateClues(row));

let maxCol = Math.max(...colClues.map(c=>c.length));
let maxRow = Math.max(...rowClues.map(r=>r.length));

for(let r=0;r<maxCol+size;r++){
let tr = document.createElement("tr");

for(let c=0;c<maxRow+size;c++){

let td = document.createElement("td");

if(r<maxCol && c<maxRow){
td.className="blank";
}
else if(r<maxCol){
let clue = colClues[c-maxRow];
let val = clue[clue.length-(maxCol-r)] || "";
td.className="clue";
td.innerText=val;
}
else if(c<maxRow){
let clue = rowClues[r-maxCol];
let val = clue[clue.length-(maxRow-c)] || "";
td.className="clue";
td.innerText=val;
}
else{
td.className="cell";
td.dataset.row=r-maxCol;
td.dataset.col=c-maxRow;

td.onclick = function(){

    // If X exists, remove it
    if(this.classList.contains("xmark")){
        this.classList.remove("xmark");
    }

    this.classList.toggle("fill");
};

td.oncontextmenu = function(e){
    e.preventDefault();

    // If black exists, remove it
    if(this.classList.contains("fill")){
        this.classList.remove("fill");
    }

    this.classList.toggle("xmark");
};

}

tr.appendChild(td);
}

table.appendChild(tr);
}

container.appendChild(table);
startTimer();   // original behavior kept
}

/* ================= SUBMIT (UNCHANGED) ================= */

function submitPuzzle(){
clearInterval(interval);

let correct=true;

document.querySelectorAll(".cell").forEach(cell=>{
let r = cell.dataset.row;
let c = cell.dataset.col;
let filled = cell.classList.contains("fill") ? 1:0;
if(filled != solution[r][c]) correct=false;
});

if(correct){
let code = generateCode();
saveLeaderboard(playerName, timer, code);  // uses stored name
alert("Correct! Your code:\n"+code);
}
else{
alert("Incorrect Solution");
}
}

/* ================= CODE GENERATION (UNCHANGED) ================= */

function generateCode(){
const chars="!Q7z@X3$Lm^2&Va9#Kp*U5d%Rg8?Tb1+Yn0CfWs4Jh
";
let code="";
for(let i=0;i<52;i++){
code+=chars[Math.floor(Math.random()*chars.length)];
}
return code;
}

/* ================= LEADERBOARD (UNCHANGED) ================= */

function saveLeaderboard(name,time,code){
let lb = JSON.parse(localStorage.getItem("lb"))||[];
lb.push({name,time,code});
lb.sort((a,b)=>a.time-b.time);
localStorage.setItem("lb",JSON.stringify(lb));
displayLeaderboard();
}

function displayLeaderboard(){
let lb = JSON.parse(localStorage.getItem("lb"))||[];
let div=document.getElementById("leaderboard");
div.innerHTML="";
lb.forEach((p,i)=>{
div.innerHTML+=`${i+1}. ${p.name} - ${p.time}s<br>`;
});
}

/* ================= REMOVE AUTO START ================= */

/* DO NOT auto call buildGame() anymore */
displayLeaderboard();
