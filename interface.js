import { COORDINATES_MAP, PLAYERS, STEP_LENGTH } from "./constants.js";

const diceButtonElement = document.querySelector("#dice-btn");
const playerPiecesElements = {
  P1: document.querySelectorAll('[player-id="P1"].player-piece'),
  P2: document.querySelectorAll('[player-id="P2"].player-piece'),
};
const resetBtn = document.getElementById("reset-btn");

const listenDiceClick = (callback) => {
  diceButtonElement.addEventListener("click", callback);
};

const listenResetClick = (callback) => {
  resetBtn.addEventListener("click", callback);
};

const setPiecePosition = (player, piece, newPosition) => {
  if (!playerPiecesElements[player] || !playerPiecesElements[player][piece]) {
    console.error(
      `Player element of given player: ${player} and piece: ${piece} not found`
    );
    return;
  }

  const [x, y] = COORDINATES_MAP[newPosition];

  const pieceElement = playerPiecesElements[player][piece];
  pieceElement.style.top = y * STEP_LENGTH + "%";
  pieceElement.style.left = x * STEP_LENGTH + "%";
};

const setTurn = (index) => {
  if (index < 0 || index >= PLAYERS.length) {
    console.error("index out of bound!");
    return;
  }
  const player = PLAYERS[index];
  document.querySelector(".active-player span").innerText = player;
  const activePlayerBase = document.querySelector(".player-base.highlight");
  if (activePlayerBase) {
    activePlayerBase.classList.remove("highlight");
  }
  document
    .querySelector(`[player-id="${player}"].player-base`)
    .classList.add("highlight");
};

const enableDice = () => {
  diceButtonElement.removeAttribute("disabled");
};

const disableDice = () => {
  diceButtonElement.setAttribute("disabled", "");
};

const unhighlightPieces = () => {
  document.querySelectorAll(".player-piece.highlight").forEach((ele) => {
    ele.classList.remove("highlight");
  });
};
const highlightPieces = (player, eligiblePieces) => {
  eligiblePieces.forEach((piece) => {
    document
      .querySelector(`.player-piece[player-id="${player}"][piece="${piece}"]`)
      .classList.add("highlight");
  });
};

const setDiceValue = (value) => {
  document.querySelector(".dice-value").innerText = value;
};

function listenPieceClick(callback) {
  document.querySelector(".player-pieces").addEventListener("click", callback);
}

export {
  listenDiceClick,
  listenResetClick,
  listenPieceClick,
  setPiecePosition,
  setTurn,
  enableDice,
  disableDice,
  highlightPieces,
  unhighlightPieces,
  setDiceValue,
};
