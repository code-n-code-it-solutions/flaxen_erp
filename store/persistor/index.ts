import {persistReducer} from "redux-persist";
import {blacklist, rootReducer, whitelist} from "@/store/reducers";
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
    whitelist,
    blacklist,
};


export default persistReducer(persistConfig, rootReducer);
