import { createSlice } from '@reduxjs/toolkit'

// 登录状态共享
export const coordSlice = createSlice({
  name: 'coordinates',
  initialState: {
    x: 1,
    y: 1,
    z: 1
  },
  reducers: {
    setX: (state, action) => {
      state.x = action.payload
    },
    setY: (state, action) => {
      state.y = action.payload
    },
    setZ: (state, action) => {
      state.z = action.payload
    }
  }
})

// 为每个 case reducer 函数生成 Action creators
export const { setX, setY, setZ } = coordSlice.actions

export default coordSlice.reducer
