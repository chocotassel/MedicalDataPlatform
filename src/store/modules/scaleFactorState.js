import { createSlice } from '@reduxjs/toolkit'

// 缩放因子
export const scaleFactorSlice = createSlice({
  name: 'scaleFactor',
  initialState: { value: 0.5 },
  reducers: {
    setScaleFactor: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setScaleFactor } = scaleFactorSlice.actions

export default scaleFactorSlice.reducer
