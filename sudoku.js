var numselector=null;
var tileselector=null;

var errors=0;

// easy level
// var board=[
//     "4-2---38-",
//     "1-96-74--",
//     "--83--1-6",
//     "-9--3---4",
//     "-2396471-",
//     "8---1--6-",
//     "9-7--65--",
//     "--58-96-2",
//     "-46---8-9"
// ]
// var solution=[
//     "462591387",
//     "139687425",
//     "758342196",
//     "691738254",
//     "523964718",
//     "874215963",
//     "987426531",
//     "315879642",
//     "246153879"
// ]

var board=[
    "-----2---",
    "1-34----5",
    "2---5-4-1",
    "34---5-9-",
    "8-7---3-4",
    "-9-3---17",
    "6-5-3---9",
    "4----87-2",
    "---1-----"
]


var solution=[
    "954712683",
    "173486925",
    "268953471",
    "341875296",
    "827691354",
    "596324817",
    "685237149",
    "419568732",
    "732149568"
]



let startTime = null; // Variable to store the start time
let numselected=null;
let points = 4000;


window.onbeforeunload = function () {
    // Using SweetAlert2 for a more attractive confirmation
    return "Are you sure you want to leave? Your progress may be lost.";
};


function leavePage() {
    // Using SweetAlert2 for a more attractive confirmation
    Swal.fire({
        title: 'Confirmation',
        text: 'click any button to avoid loss of progress after refresh',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.value) {
            // Implement logic to handle leaving the page
            // For example, redirect to another page or close the window
        }
    });
}



function updateTime() {
    if (startTime) {
        let currentTime = new Date();
        let elapsedTime = currentTime - startTime;
        let seconds = Math.floor(elapsedTime / 1000);
        let minutes = Math.floor(seconds / 60);

        seconds %= 60;
        minutes %= 60;

        // Deduct 0.1 point for each second elapsed
        points -= 0.1;

        // Display the formatted time and integer part of points
        let formattedTime = padNumber(minutes) + ":" + padNumber(seconds);
        document.getElementById("time-clock").innerText = formattedTime;
        document.getElementById("points").innerText = Math.floor(points); // Display only the integer part of points
    }
}




function padNumber(number) {
    return number < 10 ? "0" + number : number;
}

// ... your existing code ...

window.onload=function(){
    setgame();

 }

function setgame(){
    for(let i=1; i<=9; i++){
        let number=document.createElement("div");
        number.id=i
        number.addEventListener("click",selectnumber);
        number.innerText=i;
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
        startTime = new Date();

    // Update the time every second
    setInterval(updateTime, 1000);

    }
        // board 9x9
        for(let r = 0; r < 9;r++){
            for(let c=0; c<9; c++){
                let tile=document.createElement("div");
                tile.id = r.toString() + "-" + c.toString();
               if(board[r][c] !="-"){
                tile.innerText = board[r][c];
                tile.classList.add("tile-star");
               }
               if(r==2 || r==5){
                tile.classList.add("horizontal-line");
               }
               if(c==2 || c==5){
                tile.classList.add("vertical-line");
               }
                tile.addEventListener("click",selecttile);
                tile.classList.add("tile");
                document.getElementById("board").append(tile);
            }
        }
    }
    // let numselected=null;
    function selectnumber(){
        if(numselected !== null) {
            numselected.classList.remove("number-selected");
        }
        numselected = this;
        numselected.classList.add("number-selected");
    }
    
    let timerInterval;

    function selecttile() {
        if (numselected) {
            let coords = this.id.split("-");
            let r = parseInt(coords[0]);
            let c = parseInt(coords[1]);
    
            let currentValue = this.innerText;
    
            // Check if the tile has the default value provided by the creator
            if (currentValue !== board[r][c]) {
                // Always clear existing content before overwriting
                this.innerText = numselected.id;
    
                // Check if the overwritten value was the correct answer
                if (currentValue !== numselected.id) {
                    if (solution[r][c] == numselected.id) {
                        // Do not reset error count for correct overwrite
                        this.style.color = "green"; // Set color to green for correct input
                    } else {
                        errors += 1; // Increase error count if a different value was overwritten
                        this.style.color = "red"; // Set color to red for incorrect input
    
                        // Deduct points for errors
                        points -= 100;
                        document.getElementById("points").innerText = Math.floor(points);
                        document.getElementById("errors").innerText = errors;
                    }
                }
            } else {
                // Change background color of default values to a different color
                this.style.backgroundColor = "lightgrey";
            }
        }
    
        // Call checkCompletion function after each tile selection
        checkCompletion();
    }

    
    function checkCompletion() {
        let gameCompleted = true;
    
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                let currentValue = tile.innerText;
    
                if (currentValue !== solution[r][c]) {
                    gameCompleted = false;
                    break;
                }
            }
            if (!gameCompleted) {
                break;
            }
        }
    
        if (gameCompleted && errors <= 5) {
            let endTime = new Date();
            let elapsedTime = endTime - startTime;
    
            points -= Math.floor(elapsedTime / 1000);
    
            stopTimer();
            showWinningPopup(formatElapsedTime(elapsedTime), Math.floor(points));
        } else {
            if (errors > 5) {
                // Display a game over message on the screen
                showGameOverPopup();
            } else {
                console.log("Game not completed or has too many errors");
                // Additional code here if needed
            }
        }
    }
    
    function showGameOverPopup() {
        let overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "9999";
    
        let popup = document.createElement("div");
        popup.style.backgroundColor = "#fff";
        popup.style.padding = "20px";
        popup.style.borderRadius = "10px";
        popup.innerHTML = "<p>Game Over! Too many errors.</p>";
    
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    }
    

    function stopTimer() {
        clearInterval(timerInterval);
    }
    
    function formatElapsedTime(elapsedTime) {
        let seconds = Math.floor(elapsedTime / 1000);
        let minutes = Math.floor(seconds / 60);
    
        seconds %= 60;
        minutes %= 60;
    
        return padNumber(minutes) + ":" + padNumber(seconds);
    }
    
    
    function showWinningPopup(completionTime, points) {
        let overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "9999";
    
        let popup = document.createElement("div");
        popup.style.backgroundColor = "#fff";
        popup.style.padding = "20px";
        popup.style.borderRadius = "10px";
        popup.innerHTML = "<p>Congratulations!<br>You completed the game in " + completionTime + "! Your points: " + points + "</p>";
    
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    }
    document.getElementById("submit-button").addEventListener("click", checkCompletion);
    
    window.onload = function () {
        setgame();
    }
 

   



 

    
    
    
    
    

   
    
