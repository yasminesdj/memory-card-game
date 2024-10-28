const containerGrid = document.querySelector(".grid-container");
let firstSelection = null, secondSelection = null;
let isBoardLocked = false;

// Define card data directly
let cardArray = [
    { image: "./assets/agc.png", name: "agc" },
    { image: "./assets/micro-hack.png", name: "micro-hack" },
    { image: "./assets/micro-jam.png", name: "micro-jam" },
    { image: "./assets/msrc.png", name: "msrc" },
    { image: "./assets/micro-hack2.png", name: "micro-hack2" },
    { image: "./assets/agc2.png", name: "agc2" },
    { image: "./assets/msrc2.png", name: "msrc2" },
    { image: "./assets/MGV.png", name: "MGV" },
    { image: "./assets/ioc2.png", name: "ioc2" }
];

// Duplicate and shuffle cards
cardArray = [...cardArray, ...cardArray];
randomizeCards();
createCards();

// Function to shuffle the cards
function randomizeCards() {
    let currentIdx = cardArray.length, randomIdx, tempCard;
    while (currentIdx !== 0) {
        randomIdx = Math.floor(Math.random() * currentIdx);
        currentIdx -= 1;
        tempCard = cardArray[currentIdx];
        cardArray[currentIdx] = cardArray[randomIdx];
        cardArray[randomIdx] = tempCard;
    }
}

// Function to create the card elements and add them to the grid
function createCards() {
    containerGrid.innerHTML = "";  // Clear the grid first
    for (let card of cardArray) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-title", card.name);
        cardElement.innerHTML = `
            <div class="front">
                <img class="front-image" src="${card.image}" />
            </div>
            <div class="back"></div>
        `;
        containerGrid.appendChild(cardElement);
        cardElement.addEventListener("click", flipSelectedCard);
    }
}

// Function to handle card flip
function flipSelectedCard() {
    if (isBoardLocked) return;
    if (this === firstSelection) return;
    this.classList.add("flipped");
    if (!firstSelection) {
        firstSelection = this;
        return;
    }
    secondSelection = this;
    isBoardLocked = true;
    checkForMatch();
}

// Check if two flipped cards are a match
function checkForMatch() {
    let matched = firstSelection.dataset.title === secondSelection.dataset.title;
    matched ? disableMatchedCards() : resetFlippedCards();
}

// Disable matched cards
function disableMatchedCards() {
    firstSelection.removeEventListener("click", flipSelectedCard);
    secondSelection.removeEventListener("click", flipSelectedCard);
    resetSelections();
}

// Flip cards back if they don't match
function resetFlippedCards() {
    setTimeout(() => {
        firstSelection.classList.remove("flipped");
        secondSelection.classList.remove("flipped");
        resetSelections();
    }, 1000);
}

// Reset the selections
function resetSelections() {
    firstSelection = null;
    secondSelection = null;
    isBoardLocked = false;
}

// Restart the game
function restartGame() {
    resetSelections();
    randomizeCards();
    createCards();  // Regenerate cards
}
