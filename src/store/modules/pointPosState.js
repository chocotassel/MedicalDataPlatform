import { createSlice } from '@reduxjs/toolkit'

// 当前位置
export const pointPosSlice = createSlice({
  name: 'pointPos',
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

export const { setX, setY, setZ } = pointPosSlice.actions

export default pointPosSlice.reducer
