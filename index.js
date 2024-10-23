const containerGrid = document.querySelector(".grid-container");
let cardArray = [];
let firstSelection = null, secondSelection = null;
let isBoardLocked = false;

fetch("./data/cards.json")
    .then((response) => response.json())
    .then((cardData) => {
        cardArray = [...cardData, ...cardData];  // Duplicate the cards
        randomizeCards();                        // Shuffle them
        createCards();                           // Create the card elements
    });

// Function to shuffle the cards
function randomizeCards() {
    let currentIdx = cardArray.length,
        randomIdx,
        tempCard;
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
