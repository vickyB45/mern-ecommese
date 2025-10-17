import localStorage from "redux-persist/es/storage";
import { combineReducers } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import { configureStore } from "@reduxjs/toolkit";
import persistStore from "redux-persist/es/persistStore";
import authReducer from "./reducer/authReducer";
import  cartReducer  from "./reducer/cartReducer";




const rootReducer = combineReducers({
    authStore: authReducer,
    cartStore: cartReducer
})

const persistConfig = {
    key: "root",
    storage: localStorage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        });
    },

})

export const persistor = persistStore(store)