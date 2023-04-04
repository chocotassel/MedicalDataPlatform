import { createSlice } from '@reduxjs/toolkit'

// 登录状态共享
export const signSlice = createSlice({
  name: 'sign',
  initialState: {
    value: false,
    user: 'asaf'
  },
  reducers: {
    signIn: state => {
      state.value = true
    },
    signOut: state => {
      state.value = false
    },
    setUser: (state, action) => {
      state.user = action.payload
    }
  }
})

export const { signIn, signOut, setUser } = signSlice.actions

export default signSlice.reducer