let s1 = $('#spot-1');
let s2 = $('#spot-2');
let s3 = $('#spot-3');
let s4 = $('#spot-4');
let s5 = $('#spot-5');
let s6 = $('#spot-6');
let s7 = $('#spot-7');
let s8 = $('#spot-8');
let s9 = $('#spot-9');
let reset = $('#reset')
let refresh = $('.refresh')

let clickable = true //added so I can set to false when the game is over to prevent othe squares from being selected

//used to change turns
let xturn = true;
let oturn = false;
let win = 0; //used to check for winner


//used to keep track of which player has chosen which option
let xkeeper = []
let okeeper = []
let options = [1, 2, 3, 4, 5, 6, 7, 8, 9]

//used to splice from selection from options array to player score to prevent from choosing same box twice
function splicer(check) {
    options.splice(options.indexOf(check), 1)
}

let winners = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]] //all the possible winning combinations

//made as a function to reset everything and remove all added classesthat was used for the design
function newGame() {
    clickable = true;
    win = null
    refresh.addClass('hover-style');
    refresh.removeClass('highlight')
    refresh.removeClass('cus-x')
    refresh.removeClass('cus-o')
    refresh.empty();
    xkeeper = [];
    okeeper = [];
    options = [1, 2, 3, 4, 5, 6, 7, 8, 9 ];
    xturn = true;
    oturn = false;
    $('.screen').html('X Goes First'); 
    win = 0;
}


class Checker {
    //cycles through everytime a square is clicked ir computer chooses a random option i insert the number on the grid chosen and also the variable for the corrisponding number 
    turn(spot, varSpot) {
        if (options.includes(spot) && clickable === true){ //is here to make sure if the option is still available in the array and clickable is turned off when round is over or computer is choosing an option
            if (xturn === true) { //is used to check whos turn it is
                varSpot.append('<p>X</p>').addClass('cus-x') //adds the X symbol and class to stylize
                xkeeper.push(spot) //pushes the number chosen into the corrispoding array to track 
                splicer(spot) //uses the splicer function to remover the chosen number from the options array
                varSpot.removeClass('hover-style') //removes the the hover class to better stylize the page when choosing
                score.winCheck(xkeeper, $('#x-score')) //runs the function in the Score class to check if anyone has won
                if (win === 'x') { //the if else statment is used to check if the win vairable has changed to indicate a win
                    $('.screen').html('X WINS!');
                } else if (options.length === 0) { //used indicate a tie if the win variable still has not changed since no more options left
                    $('.screen').html('TIE!')
                } else {
                    $('.screen').html('O-turn'); //defaults to change text on screen to say whos turn it is
                }
                xturn = false //changes the the turns
                oturn = true
                if (document.getElementById('1p').checked) { //is here to check if the player one option is selected if it is it will start the function for my computer to choose a random option 
                    cpu.select()
                }
            } 
            else { //same code as above but used for the O's
                varSpot.append('<p>O</p>').addClass('cus-o');
                okeeper.push(spot);
                splicer(spot);
                varSpot.removeClass('hover-style');
                score.winCheck(okeeper, $('#o-score'));
                if (win === 'o') {
                    $('.screen').html('O WINS!');
                } else {
                     $('.screen').html('X-turn');
                }
                xturn = true;
                oturn = false;
            }
        }   else {
            return // used to not do anything if the first if statment fails to prevent same aquare to be chosen twice 
        }
    }
}
//score tarckers
let xScore = 0;
let oScore = 0;

class Score {
    //function that checks if the corrisponding array has a match with any of the of the winners array
    winCheck(keep, spot) {
        let highlighter // used to hold the value of winning numbers so it can be stylized 
        for (let i = 0; i < winners.length; i++) //loops through every winners arr option to check if the players arrays match any
        if (winners[i].every(x => keep.includes(x))) { //if there is a match this will grab the i varaible to know which matched and loop through the matching numbers to add the highlight class to stylize the page
            for (let x = 0; x < 3; x++) { 
                highlighter = eval('s' + winners[i][x]);//is used to get the winning number and and format it into a one of the spot variables the highlighter variable can equal to it
                highlighter.addClass('highlight');
                
            }
            if (xturn === true) { //checks to see the curent turn so the win function can be changed to update the message ont he webpage
                win = 'x'
            } else if (oturn === true) {
                win = 'o'
            }
            $('.refresh').removeClass('hover-style'); //removes all hover-style class from all the options to sylize the win screen
            clickable = false;//turns off the clickable option to fix bug
            if (xturn) { //adds to the player score and updays the score display
                xScore += 1
                spot.html(xScore)
            } else if (oturn) {
                oScore += 1
                spot.html(oScore)
            }
        } 
    }
}

class Cpu {
    select() { 
        let r
        if (options.length === 0 || win != 0) { //used just in case there are no more options to prevent bug
            return
        }
        clickable = false; //turns off clickable to prvent bug that allowed you to click another option while computer chooses their option
        r = options[Math.floor(Math.random() * options.length)]// chooses a random value from within the options array and assignes it to variable 
        setTimeout(() => {
            clickable = true; //turns clickable backn on before it sends the result from the random generator into the checker class to go through computers turn
            start.turn(r, eval('s' + r));
        }, 1000) //on timer to make it feel better when playing
        
        
    }
}

let start = new Checker
let score = new Score
let cpu = new Cpu

//all the clickable event options 
s1.click(() => start.turn(1, s1))
s2.click(() => start.turn(2, s2))
s3.click(() => start.turn(3, s3))
s4.click(() => start.turn(4, s4))
s5.click(() => start.turn(5, s5))
s6.click(() => start.turn(6, s6))
s7.click(() => start.turn(7, s7))
s8.click(() => start.turn(8, s8))
s9.click(() => start.turn(9, s9))
reset.click(() => newGame()) //new game button
//1 and 2 player options will also reset the score variable and change scores on screen back to zero
$('#1p').click(() => {
    newGame()
    $('#x-score').html('0')
    $('#o-score').html('0')
    xScore = 0
    oScore = 0
})

$('#2p').click(() => {
    newGame()
    $('#x-score').html('0')
    $('#o-score').html('0')
    xScore = 0
    oScore = 0
})
