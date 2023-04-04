import { createSlice } from '@reduxjs/toolkit'

// 工具类型
export const organSlice = createSlice({
  name: 'organ',
  initialState: {
    value: [
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false
    ]
  },
  reducers: {
    setTrue: (state, action) => {
      state.value[action.payload] = true
    },
    setFalse: (state, action) => {
      state.value[action.payload] = false
    }
  }
})

export const { setTrue, setFalse } = organSlice.actions

export default organSlice.reducer
