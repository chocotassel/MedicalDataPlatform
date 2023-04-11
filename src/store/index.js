import { configureStore } from '@reduxjs/toolkit'
import signState from './modules/signState'
import pointPosSlice from './modules/pointPosState'
import toolSlice from './modules/toolState'
import modelSizeSlice from './modules/modelSizeState'
import drawingSlice from './modules/drawingState'
import scaleFactorSlice from './modules/scaleFactorState'
import organState from './modules/organState'
import objectState from './modules/objectState'


export default configureStore({
  reducer: {
    sign: signState,
    pointPos: pointPosSlice,
    tool: toolSlice,
    modelSize: modelSizeSlice,
    drawing: drawingSlice,
    scaleFactor: scaleFactorSlice,
    organ: organState,
    object: objectState,
  }
})
