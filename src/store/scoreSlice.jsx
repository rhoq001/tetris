import {createSlice} from '@reduxjs/toolkit';
import produce from 'immer';
import {DEFAULT_COLOR} from '../components/constants.jsx';
import allShapes from '../components/Shapes.json';

const ICON_ROW = 3;
const ICON_COL = 4;

const scoreSlice = createSlice({
    
    name: 'score',
    initialState: {
        nextIcon: Array.from(Array(ICON_ROW), () => Array(ICON_COL).fill({isFilled: false, color: DEFAULT_COLOR })),
        nextId: '',
        heldIcon: Array.from(Array(ICON_ROW), () => Array(ICON_COL).fill({isFilled: false, color: DEFAULT_COLOR })),
        heldId: '',
        totalScore: 0,
        currScore: 0,
        multiplier: 1
    },
    reducers: {

        addScore(state, action) {
            return produce(state, draftState => {
                draftState.totalScore += (state.multiplier*action.payload);
                draftState.currScore += (state.multiplier*action.payload);
            })
        },

        useScore(state, action) {
            return produce(state, draftState => {
                if(draftState.currScore - action.payload >= 0) {draftState.currScore -= action.payload;}
            })
        },

        setMultiplier(state, action) {
            return produce(state, draftState => {
                draftState.multiplier = action.payload;
            })
        },

        setNextIcon(state, action) {
            return produce(state, draftState => {
                const row_offset = 1;
                const col_offset = 1;
                const squares = allShapes.shapes.filter((shape) => (shape.id === action.payload.id))[0].squares;
                for(let i = 0; i < ICON_ROW; i++){
                    for(let j = 0; j < ICON_COL; j++){
                        if(squares.filter((square) => (square.row_pos + row_offset === i && square.col_pos + col_offset === j)).length > 0){
                            draftState.nextIcon[i][j].color = action.payload.color;
                        }
                        else {
                            draftState.nextIcon[i][j].color = DEFAULT_COLOR;
                        }
                    }
                }
                draftState.nextId = action.payload.id;
            })
        },

        setHeldIcon(state, action) {
            return produce(state, draftState => {
                const row_offset = 1;
                const col_offset = 1;
                const squares = allShapes.shapes.filter((shape) => (shape.id === action.payload.id))[0].squares;
                for(let i = 0; i < ICON_ROW; i++){
                    for(let j = 0; j < ICON_COL; j++){
                        if(squares.filter((square) => (square.row_pos + row_offset === i && square.col_pos + col_offset === j)).length > 0){
                            draftState.heldIcon[i][j].color = action.payload.color;
                        }
                        else {
                            draftState.heldIcon[i][j].color = DEFAULT_COLOR;
                        }
                    }
                }
                draftState.heldId = action.payload.id;
            })
        }
    }
})

export const scoreActions = scoreSlice.actions;

export default scoreSlice;