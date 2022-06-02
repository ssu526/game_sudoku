const gameboard = document.querySelector("#gameboard");
const errMessage = document.querySelector(".errorMessage");
const btn_erase = document.querySelector(".erase");
const btn_validate = document.querySelector(".validate");
const btn_restart = document.querySelector(".restart");

let game =[];
let selectedCell=[];
let randomQuestionIndex = Math.round(Math.random()*50);
let question = questions[randomQuestionIndex].split("").map(Number);


/************************************ DRAW GAMEBOARD ***************************************** */
function init(){
    for(let r=0;r<9;r++){
        game[r]=[];
        const newRow = document.createElement('div');
        newRow.classList.add("row");
    
        for(let c=0;c<9;c++){
            //init game matrix
            let i = 9 * r + c;
            game[r].push(question[i]);
    
            //init gameboard
            let hBorder = (c==2 || c==5) ? "hBorder":"";
            let vBorder = (r==2 || r==5) ? "vBorder":"";
            let value = question[i]===0 ? "":question[i];
            let fixedValue = question[i]===0 ? "":"fixed";
            let block = findBlock(r, c);

            newRow.innerHTML += `<div 
                                    data-row="${r}" 
                                    data-col="${c}"
                                    data-block="${block}" 
                                    class="cell c${r}${c} ${hBorder} ${vBorder} ${fixedValue}">${value}</div>`
        }
        gameboard.appendChild(newRow);
    }    
}

init();


/************************ GAMEBOARD & NUMBER BUTTON CLICK EVENT ****************************** */
document.addEventListener("click", (e)=>{
    let target = e.target;

    if(target.classList.contains("cell")){
        errMessage.innerHTML = "";
        hideCompleteMessage();

        if(selectedCell.length!=0) document.querySelector(`.c${selectedCell[0]}${selectedCell[1]}`).classList.remove("selected");

        let row = target.dataset.row;
        let col = target.dataset.col;

        if(target.classList.contains("fixed")){
            selectedCell=[];
        }else{
            selectedCell = [row, col];
            target.classList.add("selected");
            target.classList.remove("normalCell");
        }
    }

    if(target.classList.contains("numberButton")){
        if(selectedCell.length==0){
            errMessage.innerHTML = "Please select a cell.";
        }else{
            let row = selectedCell[0];
            let col = selectedCell[1];
            let value = target.dataset.value;

            document.querySelector(`.c${row}${col}`).innerHTML = value;
            game[row][col] = value;
        }
    }
})

// Highlight related cells when hover a cell
document.querySelectorAll(".cell").forEach(cell=>{
    cell.addEventListener("mousemove", (e)=>{
        let row = e.target.dataset.row;
        let col = e.target.dataset.col;
        let block = e.target.dataset.block;

        for(let r=0;r<9;r++){
            for(let c=0;c<9;c++){
                let element = document.querySelector(`.c${r}${c}`);
                if(r==row || c==col || element.dataset.block==block){
                    element.classList.add("hover");
                    element.classList.remove("normalCell");
                }else{
                    element.classList.remove("hover");
                    element.classList.add("normalCell");
                }
            }
        }
    })  
})

// Unhighlight all cells
gameboard.addEventListener('mouseleave', ()=>{
    for(let r=0;r<9;r++){
        for(let c=0;c<9;c++){
            let element = document.querySelector(`.c${r}${c}`);
            element.classList.remove("hover");
        }
    }
})

/***************************** MENU BUTTONS: ERASE, VALIDATE, RESTART ****************************** */
btn_erase.addEventListener('click', ()=>{
    hideCompleteMessage();
    if(selectedCell.length!=0){
        errMessage.innerHTML = "";

        let cell = document.querySelector(`.c${selectedCell[0]}${selectedCell[1]}`);

        if(!cell.classList.contains("fixed")){
            cell.innerHTML = "";
            game[selectedCell[0]][selectedCell[1]] = 0;
        }
    }else{
        errMessage.innerHTML = "Please select a cell.";
    }
})

btn_validate.addEventListener('click', ()=>{
    let invalid = validate();

    if(invalid==true){
        errMessage.innerHTML = "Invalid Sudoku board"
    }else{
        showCompleteMessage();
    }
})

btn_restart.addEventListener('click', ()=>{
    errMessage.innerHTML = ""
    gameboard.innerHTML="";
    hideCompleteMessage();
    init();
    selectedCell=[];
})


/************************************ HELPER FUNCTIONS ***************************************** */
function findBlock(r, c){
    // the three blocks in the first row
    if(r>=0 && r<=2 && c>=0 && c<=2) return 0;
    if(r>=0 && r<=2 && c>=3 && c<=5) return 1;
    if(r>=0 && r<=2 && c>=6 && c<=8) return 2;

    // the three blocks in the second row
    if(r>=3 && r<=5 && c>=0 && c<=2) return 3;
    if(r>=3 && r<=5 && c>=3 && c<=5) return 4;
    if(r>=3 && r<=5 && c>=6 && c<=8) return 5;


    // the three blocks in the third row
    if(r>=6 && r<=8 && c>=0 && c<=2) return 6;
    if(r>=6 && r<=8 && c>=3 && c<=5) return 7;
    if(r>=6 && r<=8 && c>=6 && c<=8) return 8;
}

function validate(){
    // Check rows
    game.forEach(row=>{
        let rowCopy = [...row];
        let invalid = checkEntries(rowCopy);
        if(invalid===true) return true;
    })

    // Check columns
    for(let c=0;c<9;c++){
        let column = [];
        for(let r=0;r<9;r++){
            column.push(game[r][c]);
        }

        let invalid = checkEntries(column);
        if(invalid===true){
            return true;
        }
    }


    // Check blocks
    let blocks = [...Array(9)].map(e=>Array(9).fill(0));

    for(let r=0;r<9;r++){
        for(let c=0;c<9;c++){
            let block = findBlock(r, c);
            blocks[block].push(game[r][c]);
        }
    }

    blocks.forEach(block=>{
        let invalid = checkEntries(block);
        if(invalid===true) return true;
    })
    
    return false;
}

function checkEntries(arr){
    arr.sort();
    for(let i=0;i<8;i++){
        if(arr[i+1]-arr[i]!=1) return true;
    }

    return false;
}

function showCompleteMessage(){
    document.querySelector(".completeMessage").classList.remove("hide");
}

function hideCompleteMessage(){
    document.querySelector(".completeMessage").classList.add("hide");
}

