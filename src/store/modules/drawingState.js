import { createSlice } from '@reduxjs/toolkit'

// 是否正在绘画
export const drawingSlice = createSlice({
  name: 'drawing',
  initialState: false,
  reducers: {
    setDrawing: (state, action) => {
      state = action.payload
    },
  }
})

export const { setDrawing } = drawingSlice.actions

export default drawingSlice.reducer