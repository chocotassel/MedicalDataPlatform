import { createSlice } from '@reduxjs/toolkit'

// 登录状态共享
export const mouseSlice = createSlice({
  name: 'coordinates',
  initialState: {
    type: '拖动', //'eraser' '拖动'
    color: 'red',
    size: 8
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
    }
  }
})

// 为每个 case reducer 函数生成 Action creators
export const { setType, setColor, setSize } = mouseSlice.actions

export default mouseSlice.reducer
