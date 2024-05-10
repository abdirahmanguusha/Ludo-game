//ANCHOR - this part of the  code is coming from  constants.js file

import {
  BASE_POSITIONS,
  HOME_ENTRANCE,
  HOME_POSITIONS,
  PLAYERS,
  SAFE_POSITIONS,
  START_POSITIONS,
  STATE,
  TURNING_POINTS,
} from "./constants.js";

//ANCHOR - this part of these  functions are coming from  interface.js file
import {
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
} from "./interface.js";

let currentPositions = {
  P1: [],
  P2: [],
};

let _diceValue;
function getDiceValue() {
  return _diceValue;
}
function settingDiceValue(value) {
  _diceValue = value;
  setDiceValue(value);
}

let _turn;
function getTurn() {
  return _turn;
}
function settingTurn(value) {
  _turn = value;
  setTurn(value);
}

let _state;
function getState() {
  return _state;
}
function settingState(value) {
  _state = value;
  if (value === STATE.DICE_NOT_ROLLED) {
    enableDice();
    unhighlightPieces();
  } else {
    disableDice();
  }
}
function constructor() {
  listeningDiceClick();
  listeningResetClick();
  listeningPieceClick();
  resetGame();
}
function listeningDiceClick() {
  listenDiceClick(onDiceClick.bind(this));
}
function onDiceClick() {
  settingDiceValue(1 + Math.floor(Math.random() * 6));
  settingState(STATE.DICE_ROLLED);

  checkForEligiblePieces();
}

function checkForEligiblePieces() {
  const player = PLAYERS[getTurn()];
  const eligiblePieces = getEligiblePieces(player);
  if (eligiblePieces.length) {
    highlightPieces(player, eligiblePieces);
  } else {
    incrementTurn();
  }
}

function incrementTurn() {
  settingTurn(_turn === 0 ? 1 : 0);
  settingState(STATE.DICE_NOT_ROLLED);
}

function getEligiblePieces(player) {
  return [0, 1, 2, 3].filter((piece) => {
    const currentPosition = currentPositions[player][piece];

    if (currentPosition === HOME_POSITIONS[player]) {
      return false;
    }

    if (
      BASE_POSITIONS[player].includes(currentPosition) &&
      getDiceValue() !== 6
    ) {
      return false;
    }

    if (
      HOME_ENTRANCE[player].includes(currentPosition) &&
      getDiceValue() > HOME_POSITIONS[player] - currentPosition
    ) {
      return false;
    }

    return true;
  });
}

function listeningResetClick() {
  listenResetClick(resetGame);
}

function resetGame() {
  currentPositions = structuredClone(BASE_POSITIONS);

  PLAYERS.forEach((player) => {
    [0, 1, 2, 3].forEach((piece) => {
      settingPiecePosition(player, piece, currentPositions[player][piece]);
    });
  });

  settingTurn(0);
  settingState(STATE.DICE_NOT_ROLLED);
}

function listeningPieceClick() {
  listenPieceClick(onPieceClick);
}

function onPieceClick(event) {
  let target = event.target;

  if (
    !target.classList.contains("player-piece") ||
    !target.classList.contains("highlight")
  ) {
    return;
  }

  let player = target.getAttribute("player-id");
  let piece = target.getAttribute("piece");
  handlePieceClick(player, piece);
}

function handlePieceClick(player, piece) {
  let currentPosition = currentPositions[player][piece];

  if (BASE_POSITIONS[player].includes(currentPosition)) {
    settingPiecePosition(player, piece, START_POSITIONS[player]);
    settingState(STATE.DICE_NOT_ROLLED);
    return;
  }

  unhighlightPieces();
  movePiece(player, piece, getDiceValue());
}

function settingPiecePosition(player, piece, newPosition) {
  currentPositions[player][piece] = newPosition;
  setPiecePosition(player, piece, newPosition);
}

function movePiece(player, piece, moveBy) {
  let intervalId = setInterval(() => {
    incrementPiecePosition(player, piece);
    moveBy--;

    if (moveBy === 0) {
      clearInterval(intervalId);
      if (hasPlayerWon(player)) {
        alert(`Player: ${player} has won!`);
        resetGame();
        return;
      }

      let isKill = checkForKill(player, piece);

      if (isKill || getDiceValue() === 6) {
        settingState(STATE.DICE_NOT_ROLLED);
        return;
      }

      incrementTurn();
    }
  }, 200);
}

function checkForKill(player, piece) {
  let currentPosition = currentPositions[player][piece];
  let opponent = player === "P1" ? "P2" : "P1";

  let kill = false;

  [0, 1, 2, 3].forEach((piece) => {
    let opponentPosition = currentPositions[opponent][piece];

    if (
      currentPosition === opponentPosition &&
      !SAFE_POSITIONS.includes(currentPosition)
    ) {
      settingPiecePosition(opponent, piece, BASE_POSITIONS[opponent][piece]);
      kill = true;
    }
  });

  return kill;
}

function hasPlayerWon(player) {
  return [0, 1, 2, 3].every(
    (piece) => currentPositions[player][piece] === HOME_POSITIONS[player]
  );
}

function incrementPiecePosition(player, piece) {
  settingPiecePosition(player, piece, getIncrementedPosition(player, piece));
}

function getIncrementedPosition(player, piece) {
  let currentPosition = currentPositions[player][piece];

  if (currentPosition === TURNING_POINTS[player]) {
    return HOME_ENTRANCE[player][0];
  } else if (currentPosition === 51) {
    return 0;
  }
  return currentPosition + 1;
}

constructor();
