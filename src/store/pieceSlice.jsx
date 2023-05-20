import {createSlice} from '@reduxjs/toolkit';
import allShapes from '../components/Shapes.json';
import { START_POS_COL, START_POS_ROW } from '../components/constants';
import produce from 'immer';

const startPiece = allShapes.shapes[Math.floor(Math.random() * allShapes.shapes.length)];
const nextPiece = allShapes.shapes[Math.floor(Math.random() * allShapes.shapes.length)];

const pieceSlice = createSlice({
    
    name: 'piece',
    initialState: 
    { 
        pieceProps: startPiece,
        nextPieceProps: nextPiece,
        heldPieceProps: {id: null, color: null, rotatePivotIndex: null, squares: {row_pos: null, col_pos: null}}
    },
    reducers: {

        movePiece(state, action) {
            return produce(state, draftState => {
                draftState.pieceProps.squares = state.pieceProps.squares.map((square) => ({
                    row_pos: square.row_pos + action.payload.row_add,
                    col_pos: square.col_pos + action.payload.col_add}))
                }
            )
        },

        setPiecePos(state, action) {
            return produce(state, draftState => {
                for(let i = 0; i < state.pieceProps.squares.length; i++){
                    draftState.pieceProps.squares[i] = action.payload[i];
                }
            })
        },

        setHeldPiece(state, action) {
            return produce(state, draftState => {
                draftState.heldPieceProps = allShapes.shapes.filter((shape) => (shape.id === state.pieceProps.id))[0];
            })
        },

        startPiece(state, action) {
            return produce(state, draftState => {
                draftState.pieceProps = {
                    id: action.payload.id,
                    color: action.payload.color,
                    rotatePivotIndex: action.payload.rotatePivotIndex,
                    squares: action.payload.squares.map((square) => ({
                        row_pos: square.row_pos + START_POS_ROW,
                        col_pos: square.col_pos + START_POS_COL}))
                }
            })

        }

    }
})

export const pieceActions = pieceSlice.actions;

export default pieceSlice;