import { configureStore } from '@reduxjs/toolkit'
import signState from './modules/signState'
import pointPosSlice from './modules/pointPosState'
import toolSlice from './modules/toolState'
import modelSizeSlice from './modules/modelSizeState'

export default configureStore({
  reducer: {
    sign: signState,
    pointPos: pointPosSlice,
    tool: toolSlice,
    modelSize: modelSizeSlice
  }
})
