import {createSlice} from '@reduxjs/toolkit';
import {ROWS, COLUMNS, DEFAULT_COLOR} from '../components/constants.jsx'
import produce from 'immer';

const gridSlice = createSlice({
    
    name: 'grid',
    initialState: 
    { 
        gridProps: Array.from(Array(ROWS), () => Array(COLUMNS).fill({isFilled: false, color: DEFAULT_COLOR })),
        rowsFilled: Array.from({ length: ROWS }, () => 0),
        colsFilled: Array.from({ length: COLUMNS }, () => 0),
        isRunning: false,
        speedFactor: 1
    },
    reducers: {

        handleGridChange(state, action) {

            return produce(state, draftState => {
                
                for(let i = 0; i < action.payload.length; i++){
                    const row = action.payload[i].position.row_pos;
                    const col = action.payload[i].position.col_pos
                    draftState.gridProps[row][col] = {
                        isFilled: state.gridProps[row][col].isFilled,
                        color: action.payload[i].color
                }}
            })

        },

        setFilled(state, action){

            return produce(state, draftState => {
                for(let i = 0; i < action.payload.length; i++){
                    draftState.gridProps[action.payload[i].row_pos][action.payload[i].col_pos].isFilled = true;// update the value of the element
                    draftState.rowsFilled[action.payload[i].row_pos]++;
                }
            })

        },

        clearRow(state, action) {
            if(action.payload >= 0 && action.payload < ROWS){
                return produce(state, draftState => {
                    for(let i = 0; i < COLUMNS; i++){
                        draftState.gridProps[action.payload][i] = {
                            color: DEFAULT_COLOR,
                            isFilled: false
                        }
                    }
                    draftState.rowsFilled[action.payload] = 0;
                })
            }
        },

        pullRows(state, action){
            return produce(state, draftState => {
                let currentRow = action.payload[action.payload.length - 1];
                for(let row = currentRow - 1; row >= 0; row--){
                    if(action.payload.filter((filledRow) => (filledRow === row)).length === 0){
                        for(let col = 0; col < COLUMNS; col++){
                            draftState.gridProps[currentRow][col] = state.gridProps[row][col];
                        }
                        draftState.rowsFilled[currentRow] = state.rowsFilled[row];
                        currentRow--;
                    }
                }
            })
        },

        startGrid(state, action) {
            return produce(state, draftState => {
                draftState.isRunning = true;
            })
        },

        stopGrid(state, action) {
            return produce(state, draftState => {
                draftState.isRunning = false;
            })
        },

        changeSpeed(state, action) {
            return produce(state, draftState => {
                draftState.speed = action.payload;
            })
        }
    }
})

export const gridActions = gridSlice.actions;

export default gridSlice;