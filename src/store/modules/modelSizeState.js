import { createSlice } from '@reduxjs/toolkit'

// 当前位置
export const modelSizeSlice = createSlice({
  name: 'modelSize',
  initialState: {
    xSize: 1,
    ySize: 1,
    zSize: 1,
    rate: 1,
  },
  reducers: {
    setXSize: (state, action) => {
      state.xSize = action.payload
    },
    setYSize: (state, action) => {
      state.ySize = action.payload
    },
    setZSize: (state, action) => {
      state.zSize = action.payload
    },
    setRate: (state, action) => {
      state.rate = action.payload
    }
  }
})

export const { setXSize, setYSize, setZSize, setRate } = modelSizeSlice.actions

export default modelSizeSlice.reducer
