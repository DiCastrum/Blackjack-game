//Variables
const PLAYER = {'score': 0, 'hand': [], 'points': '#player-score'};
const DEALER = {'score': 0, 'hand': [], 'points': '#dealer-score'};
const SUITS = ['♠', '♥','♣','♦'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let deck = [];
const dealerhand = $("#dealer-hand");
const playerhand = $('#player-hand');
const cardMap = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [11, 1]};
let isStand = false;
let turnOver = true;


//Creating constructor class for cards
class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }

    color() {
        return this.suit === '♠'|| this.suit === '♣' ? 'black':'red';
    }


    getHTML() {
        const element = $('<div>');
        element.html(this.suit);
        element.addClass(`card  ${this.color()}`);
        element.attr('data-value', `${this.value} ${this.suit}` );
        return element;
    }
};

//Create a deck, deck is array with 52 card objects
function createDeck (suit, value) {
    for (let suitcount = 0; suitcount < suit.length; suitcount++) {
        for (let valuecount = 0; valuecount < value.length; valuecount++) {
            deck.push(new Card(suit[suitcount], value[valuecount]));
        }
    }
}

//shuffle the deck function
function shuffle(deck) {
    let numberCards = deck.length;
    for (let i = 0; i < numberCards; i++) {
        let tempCard = deck[i];
        let random = Math.floor(Math.random() * numberCards);
        deck[i] = deck[random];
        deck[random] = tempCard;
    }

}

//hit function for HIT button
function hit () {
    if (isStand === false) {
        drawCard(playerhand, PLAYER);
        updateScore(PLAYER);  
    }
}


//drawn card function when HIT is click
function drawCard(element, player) {
    if (player.score < 21) {
    let card = deck.pop();  
    element.append(card.getHTML());
    aces (card, player);
    score(player);
    updateScore(player);
    
    }
    
}

//New game funnction for NEW GAME button
function newgame() {
    if(turnOver === true) {
        clean();
        turnOver = false;
        startGame();
    }
}

//function for stacrt de game draw 2 cards to the player, 1 for the dealer and a flip card
async function startGame () {
    createDeck(SUITS, VALUES);
    shuffle(deck);
    drawCard(playerhand, PLAYER);
    await sleep(500);
    drawCard(playerhand, PLAYER);
    await sleep(500);
    dealerhand.append(flip());
    await sleep(500);
    drawCard(dealerhand, DEALER);      
}


//function for give a flipped card to dealer on the beggining of the game
function flip() {         
    return $('<img src="backcard2.png" class="card" id="backcard"/>');
}

//function to clean previous game before start new
function clean () {
    isStand = false;
    PLAYER.hand = [];
    DEALER.hand = [];
    PLAYER.score = 0;
    DEALER.score = 0;  
    $(`${DEALER.points}`).text('0');
    $(`${DEALER.points}`).css("color", "white");
    $(`${PLAYER.points}`).text('0');
    $(`${PLAYER.points}`).css("color", "white");
    $('#blackjack').text('Blackjack');
    $('#blackjack').css("color", "black");  
   
    let images = $('.card');
    images.remove();
}

//append aces to the end of the array and other to the beggining
function aces (card, player) {
    if (card.value === 'A') {
        player.hand.push(card);
    }
    else {
        player.hand.unshift(card);
    }

}

//function calculating the score
//Previous Ace was being count as 1, because if (sum += 11 > 21)  was a '=' wrongly typed.
function score (player) {
    let sum = 0;  
    for (i=0; i < player.hand.length; i++) {
        
        if (player.hand[i].value === 'A') {
            if (sum + 11 > 21) {
                sum += 1;                
            }
            else  {
                sum += 11;                
            }            
        }
        else {
            sum += cardMap[player.hand[i].value];            
        }       
    }
    player.score = sum;
}

//function to update the score on DOM
function updateScore(player) {
    if (player === PLAYER) {
        if (player.score > 21) {
            $(`${player.points}`).text('BUST!!');
            $(`${player.points}`).css("color", "red");
            $('#blackjack').text('YOU LOSE!!!');
            $('#blackjack').css("color", "red");
            turnOver = true;
        }
        else {
        $(player.points).html(player.score);
        }
    }
    else {
        $(player.points).html(player.score);
    }
       
}

//function to find the final result
function findWinner() {
    if (DEALER.score > 21) {        
        $(`${DEALER.points}`).text('BUST!!');
        $(`${DEALER.points}`).css("color", "red");
        $('#blackjack').text('YOU WIN!!!');
        $('#blackjack').css("color", "blue");
    }
    else if (DEALER.score > PLAYER.score) {
        $('#blackjack').text('YOU LOSE!!!');
        $('#blackjack').css("color", "red");
    }
    else if (DEALER.score < PLAYER.score) {
        $('#blackjack').text('YOU WIN!!!');
        $('#blackjack').css("color", "blue");
    }
    else {
        $('#blackjack').text('IT IS A DRAW!');
    }
    turnOver = true;

}

//function to time the draw from dealer
function sleep(ms) {
    return new Promise (resolve => setTimeout(resolve, ms));
}

//dealer bot function
async function stand () {
isStand = true;
$('#backcard').remove();
while (DEALER.score < PLAYER.score && DEALER.score < 21) { 
    drawCard(dealerhand, DEALER);
    await sleep(500);
    
}
findWinner();
}


//Lisseners
//document.querySelector('#hit').addEventListener('click', hit);
$('#hit').on('click', hit);
$('#newgame').on('click', newgame);
$('#stand').on('click', stand);





   