import { createSlice } from '@reduxjs/toolkit'

// 缩放因子
export const scaleFactorSlice = createSlice({
  name: 'scaleFactor',
  initialState: 0.5,
  reducers: {
    setScaleFactor: (state, action) => {
      state = action.payload
    }
  }
})

export const { setScaleFactor } = scaleFactorSlice.actions

export default scaleFactorSlice.reducer
