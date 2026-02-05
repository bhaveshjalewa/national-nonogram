const OFFICIAL_CODE =
"X9MPLQ7AZBYTRC5W8E2KJDH4UF6VGN1SOI3LXPQR8ZTWYUCABMN";

/* HARD GRID WITH LONG RUNS */
const solution = [
[0,0,1,1,1,1,1,1,1,1,0,0,1,1,0],
[1,1,1,1,1,0,0,1,1,1,1,1,0,1,0],
[1,1,1,1,1,1,1,1,0,1,1,1,1,0,0],
[0,1,1,1,1,1,1,0,0,1,1,1,1,1,0],
[1,1,1,1,0,0,1,1,1,1,0,1,1,1,1],
[1,1,1,0,0,1,1,1,1,1,1,0,0,1,1],
[0,0,1,1,1,1,1,1,1,0,1,1,1,0,0],
[1,1,1,1,1,1,0,0,1,1,1,1,1,1,0],
[1,1,1,1,1,0,0,1,1,1,1,1,1,0,0],
[0,1,1,1,1,1,1,1,0,0,1,1,1,1,1],
[1,1,1,1,0,1,1,1,1,1,0,0,1,1,1],
[1,1,1,0,0,1,1,1,1,1,1,0,0,1,1],
[0,1,1,1,1,1,1,1,1,0,1,1,1,0,0],
[1,1,1,1,1,0,0,1,1,1,1,1,0,0,0],
[0,1,1,1,1,1,1,1,0,0,1,1,1,1,0]
];

let player="";
let seconds=0;
let timer;
let attemptUsed=false;
let user=Array.from({length:15},()=>Array(15).fill(0));

/*************** CLUE GENERATION ***************/

function getClues(line){
  let clues=[],count=0;
  for(let v of line){
    if(v===1) count++;
    else{
      if(count>0) clues.push(count);
      count=0;
    }
  }
  if(count>0) clues.push(count);
  return clues.length?clues:[0];
}

/*************** START GAME ***************/

function startGame(){
  player=document.getElementById("playerName").value.trim();
  if(player===""){ alert("Enter name"); return; }

  document.getElementById("start").style.display="none";
  document.getElementById("game").style.display="block";

  timer=setInterval(()=>{
    seconds++;
    let m=Math.floor(seconds/60);
    let s=seconds%60;
    document.getElementById("timer").innerText=
    "Time: "+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
  },1000);

  drawBoard();
}

/*************** DRAW BOARD WITH CLUES ***************/

function drawBoard(){
  let board=document.getElementById("board");
  let table=document.createElement("table");

  // Top clue row
  let topRow=document.createElement("tr");
  topRow.appendChild(document.createElement("td"));

  for(let c=0;c<15;c++){
    let column=solution.map(r=>r[c]);
    let td=document.createElement("td");
    td.className="clue";
    td.innerHTML=getClues(column).join("<br>");
    topRow.appendChild(td);
  }
  table.appendChild(topRow);

  // Grid rows
  for(let r=0;r<15;r++){
    let row=document.createElement("tr");

    let clueCell=document.createElement("td");
    clueCell.className="clue";
    clueCell.innerText=getClues(solution[r]).join(" ");
    row.appendChild(clueCell);

    for(let c=0;c<15;c++){
      let cell=document.createElement("td");

      cell.addEventListener("click", ()=>{
        if(attemptUsed) return;

        if(cell.classList.contains("xmark")){
          cell.classList.remove("xmark");
          cell.innerText="";
        }

        cell.classList.toggle("black");
        user[r][c]=cell.classList.contains("black")?1:0;
      });

      cell.addEventListener("contextmenu", (e)=>{
        e.preventDefault();
        if(attemptUsed) return;

        if(cell.classList.contains("black")){
          cell.classList.remove("black");
          user[r][c]=0;
        }

        cell.classList.toggle("xmark");
        cell.innerText=cell.classList.contains("xmark")?"X":"";
      });

      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  board.appendChild(table);
}

/*************** SUBMIT ***************/

function submit(){
  if(attemptUsed){
    alert("Attempt already used");
    return;
  }

  for(let r=0;r<15;r++)
    for(let c=0;c<15;c++)
      if(user[r][c]!==solution[r][c]){
        alert("Incorrect solution");
        return;
      }

  clearInterval(timer);
  attemptUsed=true;

  saveScore();

  document.getElementById("code").innerText =
  "Submission Code: "+OFFICIAL_CODE;
}

/*************** LEADERBOARD ***************/

function saveScore(){
  let scores=JSON.parse(localStorage.getItem("nonogramScores"))||[];
  scores.push({name:player,time:seconds});
  scores.sort((a,b)=>a.time-b.time);
  localStorage.setItem("nonogramScores",JSON.stringify(scores));
  displayLeaderboard();
}

function displayLeaderboard(){
  let scores=JSON.parse(localStorage.getItem("nonogramScores"))||[];
  let board=document.getElementById("leaderboard");
  board.innerHTML="";
  scores.forEach((s,i)=>{
    board.innerHTML+=`<li>${i+1}. ${s.name} - ${s.time}s</li>`;
  });
}

displayLeaderboard();
