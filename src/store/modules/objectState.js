import { createSlice } from '@reduxjs/toolkit'

// 模型参数设置
export const objectSlice = createSlice({
  name: 'object',
  initialState: {
    color: '#000000',
  },
  reducers: {
    setObjectColor: (state, action) => {
      state.color = action.payload
    },
  }
})

export const { setObjectColor } = objectSlice.actions

export default objectSlice.reducer
