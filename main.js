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
} from "./constants";


//ANCHOR - this part of the  code is coming from  interface.js file
 import{
  listenDiceClick,
  listenResetClick,
  listenPieceClick,
  setPiecePosition,
  setTurn,
  enableDice,
  disableDice,
  highlightPieces,
  unhighlightPieces,
  setDiceValue
 } from "./interface"

 
let currentPositions = {
  P1: [],
  P2: []
}

let _diceValue;
let _turn;
let  _state;


function getDiceValue(){
  return _diceValue;
}


