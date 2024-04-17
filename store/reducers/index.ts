import {combineReducers} from '@reduxjs/toolkit';
import {reducers, slices} from '@/store/slices';

const rootReducer = combineReducers(reducers);

const whitelist = Object.entries(slices)
    .filter(([key, value]) => value.persist)
    .map(([key]) => key);

const blacklist = Object.entries(slices)
    .filter(([key, value]) => !value.persist)
    .map(([key]) => key);

export {rootReducer, whitelist, blacklist};
