import React, {useEffect, useRef} from "react";
import { Button } from "react-bootstrap";

import Grid from "./components/Grid/Grid";
import Controller from "./components/Controller/Controller.jsx";
import Icon from "./components/Icon/Icon"

import { useSelector, useDispatch } from "react-redux";
import {gridActions} from './store/gridSlice'
import {pieceActions} from './store/pieceSlice'
import {scoreActions} from './store/scoreSlice'

import store from './store/index'

import {ROWS, COLUMNS, DEFAULT_COLOR, START_POS_COL, START_POS_ROW} from './components/constants.jsx'
import allShapes from './components/Shapes.json';

const App = () => {

  const buttonRef = useRef(null);

  const grid = useSelector((state) => state.grid.gridProps);
  const nextIcon = useSelector((state) => state.score.nextIcon);
  const nextId = useSelector((state) => state.score.nextId);
  const heldIcon = useSelector((state) => state.score.heldIcon);
  const piece = useSelector((state) => state.piece.pieceProps);
  const heldPiece = useSelector((state) => state.piece.heldPieceProps);
  const rowsFilled = useSelector((state) => state.grid.rowsFilled);
  const totalScore = useSelector((state) => state.score.totalScore);
  const currScore = useSelector((state) => state.score.currScore);

  const dispatch = useDispatch();

  const initialize = () => {
    handleNewPiece(piece);
    const nextPiece = genNewPiece();
    dispatch(scoreActions.setNextIcon({id: nextPiece.id, color: nextPiece.color}));
    dispatch(gridActions.startGrid());
  }

  const validateRotation = (beforeChangeBoxes) => {
    let isValidated = false;
    
    isValidated = validateSquares(beforeChangeBoxes);
    if(!isValidated){
      let maxSteps = {maxRow: 0, minRow: 0, maxCol: 0, minCol: 0}
      for(let i = 0; i < beforeChangeBoxes.length; i++){
      
        if(!validateSquares([beforeChangeBoxes[i]])){ //add out of bounds
          const temp = getVectorToOrigin(piece.squares[i], beforeChangeBoxes[i], piece.squares[piece.rotatePivotIndex]);
          
          if(temp.row_pos < maxSteps.minRow) {
            maxSteps.minRow = temp.row_pos;
          } else if(temp.row_pos > maxSteps.maxRow) {
            maxSteps.maxRow = temp.row_pos;
          } else if(temp.col_pos > maxSteps.maxCol) {
            maxSteps.maxCol = temp.col_pos;
          } else if(temp.col_pos < maxSteps.minCol) {
            maxSteps.minCol = temp.col_pos;
          } 
        }
      }

      

      if(maxSteps.minRow === 0){
        maxSteps.row = maxSteps.maxRow;
        
      } else if(maxSteps.maxRow === 0) {
        maxSteps.row = maxSteps.minRow;
        
      } else {
        return [];
      }

      if(maxSteps.minCol === 0){
        maxSteps.col = maxSteps.maxCol;
        
      } else if(maxSteps.maxCol === 0) {
        maxSteps.col = maxSteps.minCol;
        
      } else {
        return [];
      }

      if(!isValidated){
        const counter = abs(maxSteps.row)
        for(let i = 0; i < counter; i++){
          beforeChangeBoxes = beforeChangeBoxes.map((square) => ({
            row_pos: square.row_pos + maxSteps.row,
            col_pos: square.col_pos
          }))
          if(validateSquares(beforeChangeBoxes)){
            isValidated = true;
            break;
          }
        }
      }

      if(!isValidated){
        const counter = abs(maxSteps.col)
        for(let i = 0; i < counter; i++){
          beforeChangeBoxes = beforeChangeBoxes.map((square) => ({
            row_pos: square.row_pos,
            col_pos: square.col_pos + maxSteps.col
          }))
          if(validateSquares(beforeChangeBoxes)){
            isValidated = true;
            break;
          }
        }
      }
    }
    if(isValidated) {
      return beforeChangeBoxes;
    }
    return [];
  }

  const rotate = (rotateDirection) => {

    if(piece.rotatePivotIndex < 0){
      return;
    }
    const changeBoxes = [];
    const overlappedBox = [];
    let beforeChangeBoxes = piece.squares.map((square) => ({row_pos: square.row_pos, col_pos: square.col_pos})).map((square) => ({
      row_pos: piece.squares[piece.rotatePivotIndex].row_pos + (rotateDirection)*(square.col_pos - piece.squares[piece.rotatePivotIndex].col_pos),
      col_pos: piece.squares[piece.rotatePivotIndex].col_pos + (-1*rotateDirection)*(square.row_pos - piece.squares[piece.rotatePivotIndex].row_pos)
    }));

    beforeChangeBoxes = validateRotation(beforeChangeBoxes);
    if(beforeChangeBoxes.length === 0) {
      return;
    }

    for(let i = 0; i < piece.squares.length; i++){
      const row = piece.squares[i].row_pos;
      const col = piece.squares[i].col_pos;
      changeBoxes.push({position: beforeChangeBoxes[i], color: piece.color});
      if(!(grid[beforeChangeBoxes[i].row_pos][beforeChangeBoxes[i].col_pos].color === DEFAULT_COLOR)){
        overlappedBox.push({row: beforeChangeBoxes[i].row_pos, col: beforeChangeBoxes[i].col_pos});
      }
      if(overlappedBox.filter((box) => (box.row === row && box.col === col)).length === 0){
        changeBoxes.push({position: {row_pos: row, col_pos: col}, color: DEFAULT_COLOR});
      }
    }
    dispatch(gridActions.handleGridChange(changeBoxes)); 
    dispatch(pieceActions.setPiecePos(beforeChangeBoxes));
  }

  const abs = (num) => {
    if(num < 0) {
      return -1*num;
    }
    return num;
  }

  //helper function for rotation
  const getVectorToOrigin = (originalPos, newPos, origin) => {
    if((newPos.row_pos > origin.row_pos && originalPos.row_pos <= origin.row_pos) || (newPos.row_pos < origin.row_pos && originalPos.row_pos >= origin.row_pos)) { // offset is negative row direction
      return {row_pos: origin.row_pos - newPos.row_pos, col_pos: 0};
    } else if((newPos.col_pos > origin.col_pos && originalPos.col_pos <= origin.col_pos) || (newPos.col_pos < origin.col_pos && originalPos.col_pos >= origin.col_pos)) {
      return {row_pos: 0, col_pos: origin.col_pos - newPos.col_pos};
    }
  }

  const validateSquares = (squares) => {
    for(let i = 0; i < squares.length; i++){
      if(squares[i].row_pos >= ROWS || squares[i].row_pos < 0 || squares[i].col_pos >= COLUMNS || squares[i].col_pos < 0 || grid[squares[i].row_pos][squares[i].col_pos].isFilled){
        return false;
      }
    }
    return true;
  }

  const move = (move_add) => {
    
    const beforeChangeBoxes = piece.squares.map((square) => ({
      row_pos: square.row_pos + move_add.row_add,
      col_pos: square.col_pos + move_add.col_add
    }));
    const changeBoxes = [];
    const overlappedBox = [];
    for(let i = 0; i < piece.squares.length; i++){
      const row = beforeChangeBoxes[i].row_pos;
      const col = beforeChangeBoxes[i].col_pos;
      const isBounded = (row < 0 || row >= ROWS || col < 0 || col >= COLUMNS || grid[row][col].isFilled);
      if(isBounded){
        if(move_add.row_add > 0) {
          nextPiece();
        }
        return;
      }
      changeBoxes.push({position: {row_pos: row, col_pos: col}, color: piece.color});
      if(!(grid[row][col].color === DEFAULT_COLOR)){
        overlappedBox.push({row: row, col: col});
      }
      if(overlappedBox.filter((box) => (box.row === piece.squares[i].row_pos && box.col === piece.squares[i].col_pos)).length === 0){
        changeBoxes.push({position: {row_pos: piece.squares[i].row_pos, col_pos: piece.squares[i].col_pos}, color: DEFAULT_COLOR});
      }
    }
    dispatch(gridActions.handleGridChange(changeBoxes)); 
    dispatch(pieceActions.movePiece({row_add: move_add.row_add, col_add: move_add.col_add}));
  }

  const getFullRows = () => {
    let arr = []
    for(let i = 0; i < rowsFilled.length; i++){
      if(store.getState().grid.rowsFilled[i] >= COLUMNS) {
        arr.push(i)
      }
    }
    return arr;
  }

  const clearFullRows = () => {
    let filledRows = getFullRows();
    for(let i = 0; i < filledRows.length; i++) {
      dispatch(gridActions.clearRow(filledRows[i]));
      dispatch(scoreActions.addScore(10));
    }
    if(!(filledRows.length === 0)) { console.log(`rows ${filledRows}`); dispatch(gridActions.pullRows(filledRows)) }
  }

  const nextPiece = () => {
    dispatch(gridActions.setFilled(piece.squares));
    clearFullRows();
    handleNewPiece(allShapes.shapes.filter((shape) => (shape.id === nextId))[0]);

    const nextPiece = genNewPiece();
    dispatch(scoreActions.setNextIcon({id: nextPiece.id, color: nextPiece.color}));
  }

  const handleNewPiece = (newPiece) => {
    dispatch(gridActions.handleGridChange(newPiece.squares.map((square) => ({position: {row_pos: square.row_pos + START_POS_ROW, col_pos: square.col_pos + START_POS_COL}, color: newPiece.color}))));
    dispatch(pieceActions.startPiece(newPiece));
  }

  const switchPiece = () => {
    const tempPiece = heldPiece;
    dispatch(gridActions.handleGridChange(piece.squares.map((square) => ({position: {row_pos: square.row_pos, col_pos: square.col_pos}, color: DEFAULT_COLOR}))));
    dispatch(scoreActions.setHeldIcon({id: piece.id, color: piece.color}));
    dispatch(pieceActions.setHeldPiece());
    if(tempPiece.id === null){
      handleNewPiece(genNewPiece());
    }
    else {
      handleNewPiece(tempPiece)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      move({row_add: 0, col_add: -1}); // handle left arrow key press
    } else if (event.key === 'ArrowRight') {
      move({row_add: 0, col_add: 1}); // handle right arrow key press
    } else if (event.key === 'ArrowDown') {
      move({row_add: 1, col_add: 0}); // handle down arrow key press
    } else if (event.key === 'r') {
      rotate(1);
    } else if (event.key === 'e'){
      rotate(-1);
    } else if (event.key === 's'){
      switchPiece();
    }
  }

  const genNewPiece = () => {
    return allShapes.shapes[Math.floor(Math.random() * allShapes.shapes.length)];
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Trigger button click
      if(buttonRef && store.getState().grid.isRunning) {buttonRef.current.click();}
    }, 1000);

    return () => {
      // Clear the interval when the component unmounts
      clearInterval(intervalId);
    };
  }, []);
  
  return (
    <div onKeyDown={handleKeyDown} className="container border-5 rounded border border-success">
      <div className="main row">
        <div className="col-md-3 col-sm-12">
          <div className="container border border-success bg-light mt-5 d-flex justify-content-end">
            Total Score: {totalScore}
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="container mt-md-5 mt-sm-2 d-flex justify-content-center">
            <Grid grid={grid} size='md'/>
          </div>
        </div>
        <div className="mt-md-5 col-md-3 col-sm-1">
          <div className="container">
            <div className="row border-3 border-success border rounded bg-dark">
              <div className="mt-md-2 offset-md-3 col-auto col-md-6"><Icon title='Next' initialGrid={nextIcon}/></div>
              <div className="mt-md-5 rounded offset-md-3 col-auto col-md-6"><Icon title='Held' initialGrid={heldIcon}/></div>
              <div className="mt-md-5 offset-md-3 col-auto col-md-6">
                <div className="mt-3 bg-gray border border-info rounded">{currScore}P</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <Controller forwardedRef={buttonRef} swapPiece={switchPiece} moveControl={move} rotateControl={rotate}/>
      </div>
      <div className="row">
        <div className="col-6 border-4 border"><Button onClick={() => initialize()} className="container rounded-pill">Start</Button></div>
        <div className="col-6 border-4 border"><Button className="container rounded-pill">How to Play</Button></div>
      </div>
    </div>
  );
}

export default App;
