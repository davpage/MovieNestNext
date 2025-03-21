import {configureStore} from "@reduxjs/toolkit";
import productsReducer from "@/redux/slices/productsSlice";

const store = configureStore({

    reducer: {
     productsReducer
    }
})
export default store