
const suits = ['紅心', '方塊', '梅花', '黑桃'];  
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];  
const values = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': 11};


const rankToChinese = {
    '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '10': '10',
    'J': 'J', 'Q': 'Q', 'K': 'K', 'A': 'A'
};


const redSuits = ['紅心', '方塊'];

function shuffleDeck() {
    const deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({suit: suit, rank: rank, value: values[rank]});
        }
    }
    return deck.sort(() => Math.random() - 0.5);  
}

function calculateHandValue(hand) {
    let value = hand.reduce((acc, card) => acc + card.value, 0);
    let aces = hand.filter(card => card.rank === 'A').length;

    
    while (value > 21 && aces) {
        value -= 10;
        aces--;
    }
    return value;
}


let deck;
let player1Hand, player2Hand;
let player1Points = 0, player2Points = 0;
let currentPlayer = 1;
let player1Standing = false, player2Standing = false;
let gameOver = false;


function initGame() {
    deck = shuffleDeck();
    player1Hand = [deck.pop(), deck.pop()];
    player2Hand = [deck.pop(), deck.pop()];
    player1Points = calculateHandValue(player1Hand);
    player2Points = calculateHandValue(player2Hand);
    currentPlayer = 1;
    player1Standing = false;
    player2Standing = false;
    gameOver = false;
    
  
    document.querySelectorAll('.hit-button, .stand-button').forEach(button => {
        button.replaceWith(button.cloneNode(true));
    });
    
    
    initEventListeners();
    updateUI();
}


function updateUI() {

    const player1CardsDiv = document.getElementById('player1-cards');
    player1CardsDiv.innerHTML = player1Hand.map(card => {
        const colorClass = redSuits.includes(card.suit) ? 'red' : 'black';
        return `<div class="card ${colorClass}">${card.suit}${rankToChinese[card.rank]}</div>`;
    }).join('');
    document.getElementById('player1-points').textContent = player1Points;


    const player2CardsDiv = document.getElementById('player2-cards');
    player2CardsDiv.innerHTML = player2Hand.map(card => {
        const colorClass = redSuits.includes(card.suit) ? 'red' : 'black';
        return `<div class="card ${colorClass}">${card.suit}${rankToChinese[card.rank]}</div>`;
    }).join('');
    document.getElementById('player2-points').textContent = player2Points;


    document.getElementById('current-player').textContent = `當前回合：玩家${currentPlayer}`;


    document.getElementById('player1-hand').classList.toggle('active', currentPlayer === 1);
    document.getElementById('player2-hand').classList.toggle('active', currentPlayer === 2);


    updateButtonStates();
    checkGameEnd();
}

function updateButtonStates() {

    const p1Buttons = document.querySelectorAll('[data-player="1"]');
    p1Buttons.forEach(button => {
        button.disabled = currentPlayer !== 1 || player1Standing || gameOver;
    });


    const p2Buttons = document.querySelectorAll('[data-player="2"]');
    p2Buttons.forEach(button => {
        button.disabled = currentPlayer !== 2 || player2Standing || gameOver;
    });
}

function hit(playerNum) {
    if (playerNum !== currentPlayer || gameOver) return;
    
    const card = deck.pop();
    if (playerNum === 1) {
        player1Hand.push(card);
        player1Points = calculateHandValue(player1Hand);
        if (player1Points > 21) {
            player1Standing = true;
            switchPlayer();
        }
    } else {
        player2Hand.push(card);
        player2Points = calculateHandValue(player2Hand);
        if (player2Points > 21) {
            player2Standing = true;
            switchPlayer();
        }
    }
    updateUI();
}

function stand(playerNum) {
    if (playerNum !== currentPlayer || gameOver) return;
    
    if (playerNum === 1) {
        player1Standing = true;
    } else {
        player2Standing = true;
    }
    switchPlayer();
    updateUI();
}

function switchPlayer() {
    if (player1Standing && player2Standing) {
        endGame();
        return;
    }
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    if ((currentPlayer === 1 && player1Standing) || 
        (currentPlayer === 2 && player2Standing)) {
        switchPlayer();
    }
}

function checkGameEnd() {
    if (!player1Standing && !player2Standing) return;
    
    if (player1Standing && player2Standing) {
        endGame();
    } else if (player1Points > 21 && player2Points > 21) {
        document.getElementById('message').textContent = '雙方都爆牌，平局！';
        endGame();
    } else if (player1Points > 21) {
        document.getElementById('message').textContent = '玩家一爆牌，玩家二獲勝！';
        endGame();
    } else if (player2Points > 21) {
        document.getElementById('message').textContent = '玩家二爆牌，玩家一獲勝！';
        endGame();
    }
}

function endGame() {
    gameOver = true;
    if (!document.getElementById('message').textContent) {
        if (player1Points > 21 && player2Points > 21) {
            document.getElementById('message').textContent = '雙方都爆牌，平局！';
        } else if (player1Points > 21) {
            document.getElementById('message').textContent = '玩家一爆牌，玩家二獲勝！';
        } else if (player2Points > 21) {
            document.getElementById('message').textContent = '玩家二爆牌，玩家一獲勝！';
        } else if (player1Points === player2Points) {
            document.getElementById('message').textContent = '平局！';
        } else {
            const winner = player1Points > player2Points ? '一' : '二';
            document.getElementById('message').textContent = `玩家${winner}獲勝！`;
        }
    }
    document.getElementById('restart-button').style.display = 'block';
}


function initEventListeners() {

    document.querySelectorAll('.hit-button').forEach(button => {
        button.addEventListener('click', () => {
            const playerNum = parseInt(button.dataset.player);
            hit(playerNum);
        });
    });


    document.querySelectorAll('.stand-button').forEach(button => {
        button.addEventListener('click', () => {
            const playerNum = parseInt(button.dataset.player);
            stand(playerNum);
        });
    });

    document.getElementById('restart-button').addEventListener('click', () => {
        document.getElementById('message').textContent = '';
        document.getElementById('restart-button').style.display = 'none';
        initGame();
    });
}

initGame();
