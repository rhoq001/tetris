import {configureStore} from '@reduxjs/toolkit';
import gridSlice from './gridSlice'
import pieceSlice from './pieceSlice'
import scoreSlice from './scoreSlice'

const store = configureStore({
    reducer: {
        grid: gridSlice.reducer,
        piece: pieceSlice.reducer,
        score: scoreSlice.reducer
    }
})

export default store;