/* ================= CONFIG ================= */

const SIZE = 18;
let timer = 0;
let interval;
let locked = false;
let runs = [];

/* ================= LAYOUT ================= */
/* 
B = Black
C = Clue
W = White
*/

const layout = [

["B","B","C","C","B","C","C","B","C","C","B","C","C","B","C","C","B","B"],
["B","C","W","W","C","W","W","C","W","W","C","W","W","C","W","W","C","B"],
["C","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","C"],
["C","W","W","C","W","W","C","W","W","C","W","W","C","W","W","C","W","C"],

["B","C","W","W","W","W","W","W","W","W","W","W","W","W","W","W","C","B"],
["C","W","W","W","W","C","W","W","W","W","C","W","W","W","W","W","W","C"],
["C","W","W","C","W","W","W","C","W","W","W","C","W","W","W","C","W","C"],

["B","C","W","W","W","W","W","W","W","W","W","W","W","W","W","W","C","B"],
["C","W","W","W","C","W","W","C","W","W","C","W","W","C","W","W","W","C"],
["C","W","W","C","W","W","C","W","W","C","W","W","C","W","W","C","W","C"],

["B","C","W","W","W","W","W","W","W","W","W","W","W","W","W","W","C","B"],
["C","W","W","W","W","C","W","W","W","W","C","W","W","W","W","W","W","C"],
["C","W","W","C","W","W","W","C","W","W","W","C","W","W","W","C","W","C"],

["B","C","W","W","W","W","W","W","W","W","W","W","W","W","W","W","C","B"],
["C","W","W","W","C","W","W","C","W","W","C","W","W","C","W","W","W","C"],
["C","W","W","C","W","W","C","W","W","C","W","W","C","W","W","C","W","C"],

["B","C","W","W","W","W","W","W","W","W","W","W","W","W","W","W","C","B"],
["B","B","C","C","B","C","C","B","C","C","B","C","C","B","C","C","B","B"]

];

/* ================= FIXED SOLUTION ================= */
/* This solution matches clue values below */

const solution = [

[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,3,8,0,4,9,0,5,7,0,6,8,0,7,2,0,0],
[0,4,7,9,5,6,8,3,2,1,4,9,3,6,8,5,7,0],
[0,5,6,0,7,8,0,9,4,0,3,7,0,8,6,0,4,0],

[0,0,9,4,8,7,3,6,5,2,1,4,7,3,9,8,0,0],
[0,7,8,5,6,0,4,9,3,8,0,5,2,7,4,6,1,0],
[0,6,5,0,9,4,2,0,7,6,8,0,1,5,3,0,9,0],

[0,0,4,3,7,2,8,1,6,9,5,8,4,7,2,3,0,0],
[0,8,2,6,0,9,5,0,4,3,0,6,7,0,1,8,5,0],
[0,9,1,0,8,7,0,6,5,0,2,4,0,9,3,0,6,0],

[0,0,5,7,3,6,8,4,2,9,1,7,5,8,6,2,0,0],
[0,4,9,8,7,0,6,2,1,5,0,3,8,4,7,9,2,0],
[0,7,6,0,5,9,4,0,3,8,2,0,6,1,4,0,8,0],

[0,0,8,2,6,7,3,9,4,1,5,8,2,7,3,6,0,0],
[0,5,3,9,0,8,6,0,7,4,0,2,9,0,8,7,1,0],
[0,6,4,0,9,5,0,3,2,0,7,1,0,6,5,0,4,0],

[0,0,7,6,8,4,9,5,3,2,6,4,7,9,1,8,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

];

/* ================= BUILD ================= */

function buildBoard(){

  const container = document.getElementById("kakuroBoard");
  container.innerHTML="";
  const table=document.createElement("table");

  for(let r=0;r<SIZE;r++){
    const tr=document.createElement("tr");

    for(let c=0;c<SIZE;c++){
      const td=document.createElement("td");

      if(layout[r][c]==="W"){
        td.className="white";
        const input=document.createElement("input");
        input.maxLength=1;
        input.addEventListener("input",function(){
          this.value=this.value.replace(/[^1-9]/g,"");
        });
        td.appendChild(input);
      }
      else if(layout[r][c]==="C"){
        td.className="clue";
        td.innerHTML='<span class="right"></span><span class="down"></span>';
      }
      else{
        td.className="black";
      }

      tr.appendChild(td);
    }

    table.appendChild(tr);
  }

  container.appendChild(table);
}

/* ================= CLUE GENERATION ================= */

function generateClues(){

  const table=document.querySelector("#kakuroBoard table");

  for(let r=0;r<SIZE;r++){
    for(let c=0;c<SIZE;c++){

      if(layout[r][c]==="C"){

        // RIGHT
        if(c+1<SIZE && layout[r][c+1]==="W"){
          let sum=0;
          let cc=c+1;
          while(cc<SIZE && layout[r][cc]==="W"){
            sum+=solution[r][cc];
            cc++;
          }
          table.rows[r].cells[c]
            .querySelector(".right").innerText=sum;
        }

        // DOWN
        if(r+1<SIZE && layout[r+1][c]==="W"){
          let sum=0;
          let rr=r+1;
          while(rr<SIZE && layout[rr][c]==="W"){
            sum+=solution[rr][c];
            rr++;
          }
          table.rows[r].cells[c]
            .querySelector(".down").innerText=sum;
        }

      }

    }
  }
}
