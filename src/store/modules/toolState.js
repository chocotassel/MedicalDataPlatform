import { createSlice } from '@reduxjs/toolkit'

// 工具类型
export const toolSlice = createSlice({
  name: 'tool',
  initialState: {
    type: 0,
    color: '#ff0000',
    size: 8,
    contrast: 'spring'
  },
  reducers: {
    setType: (state, action) => {
      state.type = action.payload
    },
    setColor: (state, action) => {
      state.color = action.payload
    },
    setSize: (state, action) => {
      state.size = action.payload
    },
    setContrast: (state, action) => {
      state.contrast = action.payload
    }
  }
})

export const { setType, setColor, setSize, setContrast } = toolSlice.actions

export default toolSlice.reducer
