import { createSlice } from '@reduxjs/toolkit'

// 工具类型
export const toolSlice = createSlice({
  name: 'tool',
  initialState:{
    type: 0,
    color: 'red',
    size: 8,
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
  }
})

export const { setType, setColor, setSize } = toolSlice.actions

export default toolSlice.reducer