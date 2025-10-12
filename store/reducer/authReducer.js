import { createSlice } from "@reduxjs/toolkit";

const initialState={
    auth:null
}


export const authReducer = createSlice({
    name:"authStore",
    initialState,
    reducers:{
        login:(state,action)=>{
            state.auth = action.payload
        },
        logout:(state, action)=>{
            state.auth = null
        }
    }
})

export const {login, logout} = authReducer.actions
export default authReducer.reducer