import { configureStore } from '@reduxjs/toolkit'
import signState from '../store/signState'
import coordSlice from '../store/coordinates'
import mouseState from '../store/mouseState'

export default configureStore({
  reducer: {
    sign: signState,
    coord: coordSlice,
    mouse: mouseState
  }
})
