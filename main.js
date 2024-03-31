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


function settingDiceValue(value){
  _diceValue = value;
  setDiceValue(value);
}

function getTurn(){
  console.log("getTurn", _turn)
  return _turn;
}

function settingTurn(value){
  _turn = value;
  setTurn(value);

}

function getState(){
  console.log("getState", _state)
  return  _state;
}

function settingState(value){
  _state = value;
  if(value === STATE.DICE_NOT_ROLLED){
      enableDice();
      unhighlightPieces();
  }else{
      disableDice()
  }
}

function LudolistenDiceClick() {
  listenDiceClick(this.onDiceClick.bind(this))
}

function getEligiblePieces(player) {
  return [0, 1, 2, 3].filter(piece => {
      const currentPosition = currentPositions[player][piece];

      if(currentPosition === HOME_POSITIONS[player]) {
          return false;
      }

      if(
          BASE_POSITIONS[player].includes(currentPosition)
          && this.diceValue !== 6
      ){
          return false;
      }

      if(
          HOME_ENTRANCE[player].includes(currentPosition)
          && this.diceValue > HOME_POSITIONS[player] - currentPosition
          ) {
          return false;
      }

      return true;
  });
}



function checkForEligiblePieces() {
  const player = PLAYERS[getTurn()];
  const eligiblePieces = getEligiblePieces(player);
  if(eligiblePieces.length) {
      highlightPieces(player, eligiblePieces);
  } else {
  }
}


function onDiceClick() {
  console.log('dice clicked!', Math.random());
  settingDiceValue(1 + Math.floor(Math.random() * 6));
  settingState(STATE.DICE_ROLLED);
  
  checkForEligiblePieces();
}

settingDiceValue(6);

settingTurn(0);
getTurn()

settingState("DICE_NOT_ROLLED")
onDiceClick()
getDiceValue();


