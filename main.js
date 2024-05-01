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
let _turn;
let _state;

function getDiceValue() {
  return _diceValue;
}

function settingDiceValue(value) {
  _diceValue = value;
  setDiceValue(value);
}

function getTurn() {
  // console.log("getTurn", _turn);
  return _turn;
}

function settingTurn(value) {
  _turn = value;
  setTurn(value);
}

function getState() {
  console.log("getState", _state);
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

function LudolistenDiceClick() {
  listenDiceClick(this.onDiceClick.bind(this));
}

const changeCurrentPosition = (player, piece, newPosition) => {
  currentPositions[player][piece] = newPosition;
  setPiecePosition(player, piece, newPosition);
};

function checkForEligiblePieces() {
  const player = PLAYERS[getTurn()];
  const eligiblePieces = getEligiblePieces(player);
  if (eligiblePieces.length) {
    highlightPieces(player, eligiblePieces);
    disableDice();
    listenPieceClick(onPieceClick);
  } else {
    if (player == "P2") settingTurn(0);
    if (player == "P1") settingTurn(1);
  }
  enableDice();
}

function getEligiblePieces(player) {
  return [0, 1, 2, 3].filter((piece) => {
    const currentPosition = currentPositions[player][piece];

    if (currentPosition === HOME_POSITIONS[player]) {
      return false;
    }

    if (BASE_POSITIONS[player].includes(currentPosition) && _diceValue !== 6) {
      return false;
    }

    if (
      HOME_ENTRANCE[player].includes(currentPosition) &&
      _diceValue > HOME_POSITIONS[player] - currentPosition
    ) {
      return false;
    }

    return true;
  });
}

function onPieceClick(event) {
  let target = event.target;
  console.log(target);
  let player = target.getAttribute("player-id");
  let piece = target.getAttribute("piece");
  handlePieceClick(player, piece);
}

function handlePieceClick(player, piece) {
  let currentPosition = currentPositions[player][piece];

  if (BASE_POSITIONS[player].includes(currentPosition)) {
    setPiecePosition(player, piece, START_POSITIONS[player]);
    settingState(STATE.DICE_NOT_ROLLED);
    return;
  }
  unhighlightPieces();
  movePiece(player, piece, _diceValue);
}

function movePiece(player, piece, moveBy) {
  let intervalId = setInterval(() => {
    incrementPiecePosition(player, piece);
    moveBy--;

    if (moveBy === 0) {
      clearInterval(intervalId);
      if (hasPlayerWon(player)) {
        alert(`Player: ${player} has won!`);
        onResetClick();
      }
    }
  }, 200);
}

function incrementPiecePosition(player, piece){
  setPiecePosition(player, piece, getIncrementedPosition(player,piece));

  
}

function hasPlayerWon(){

  
}

function getIncrementedPosition(player, piece){
  let currentPosition = currentPositions[player][piece];

  if(currentPosition === TURNING_POINTS[player]) {
    return HOME_ENTRANCE[player][0]
  } else if(currentPosition === 51) {
    return 0;
  }
  return currentPosition+1;

}

function onDiceClick() {
  // console.log("dice clicked!", Math.random());
  settingDiceValue(1 + Math.floor(Math.random() * 6));
  settingState(STATE.DICE_ROLLED);

  checkForEligiblePieces();
}

function onResetClick() {
  changeCurrentPosition("P1", 0, 500);
  changeCurrentPosition("P1", 1, 501);
  changeCurrentPosition("P1", 2, 502);
  changeCurrentPosition("P1", 3, 503);

  changeCurrentPosition("P2", 0, 600);
  changeCurrentPosition("P2", 1, 601);
  changeCurrentPosition("P2", 2, 602);
  changeCurrentPosition("P2", 3, 603);

  settingState(STATE.DICE_NOT_ROLLED);
  settingTurn(0);
  enableDice();
  listenDiceClick(onDiceClick);
}

listenResetClick(onResetClick);
onResetClick();
