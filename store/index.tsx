import {combineReducers, configureStore} from '@reduxjs/toolkit';
import themeConfigSlice from './slices/themeConfigSlice';
import storage from 'redux-persist/lib/storage';
import {persistReducer, persistStore} from 'redux-persist';
import userReducer from './slices/userSlice';
import unitReducer from './slices/unitSlice';
import rawProductReducer from './slices/rawProductSlice';
import productCategoryReducer from './slices/categorySlice';
import productAssemblyReducer from './slices/productAssemblySlice';
import productionReducer from './slices/productionSlice';
import colorCodeReducer from './slices/colorCodeSlice';
import locationReducer from './slices/locationSlice';
import vendorTypeReducer from './slices/vendorTypeSlice';
import vendorReducer from './slices/vendorSlice';
import bankReducer from './slices/bankSlice';
import currencyReducer from './slices/currencySlice';
import designationReducer from './slices/designationSlice';
import departmentReducer from './slices/departmentSlice';
import employeeReducer from './slices/employeeSlice';
import purchaseRequisitionReducer from './slices/purchaseRequisitionSlice';
import vehicleReducer from './slices/vehicleSlice';
import localPurchaseOrderReducer from './slices/localPurchaseOrderSlice';
import taxCategoryReducer from './slices/taxCategorySlice';
import goodReceiveNoteReducer from './slices/goodReceiveNoteSlice';
import vendorBillReducer from './slices/vendorBillSlice';
import reportReducer from './slices/reportSlice';
import utilReducer from './slices/utilSlice';
import menuReducer from './slices/menuSlice';
import permissionReducer from './slices/permissionSlice';
import assetReducer from './slices/assetSlice';
import serviceReducer from './slices/serviceSlice';

const persistConfig = {
    key: 'root',
    storage,
    blacklist: [
        'unit',
        'rawProduct',
        'productCategory',
        'productAssembly',
        'production',
        'colorCode',
        'location',
        'vendorType',
        'vendor',
        'bank',
        'currency',
        'designation',
        'department',
        'employee',
        'purchaseRequisition',
        'vehicle',
        'localPurchaseOrder',
        'taxCategory',
        'goodReceiveNote',
        'vendorBill',
        'report',
        'util',
        'permission',
        'asset',
        'service'
    ]
};

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    user: userReducer,
    unit: unitReducer,
    rawProduct: rawProductReducer,
    productCategory: productCategoryReducer,
    productAssembly: productAssemblyReducer,
    production: productionReducer,
    colorCode: colorCodeReducer,
    location: locationReducer,
    vendorType: vendorTypeReducer,
    vendor: vendorReducer,
    bank: bankReducer,
    currency: currencyReducer,
    designation: designationReducer,
    department: departmentReducer,
    employee: employeeReducer,
    purchaseRequisition: purchaseRequisitionReducer,
    vehicle: vehicleReducer,
    localPurchaseOrder: localPurchaseOrderReducer,
    taxCategory: taxCategoryReducer,
    goodReceiveNote: goodReceiveNoteReducer,
    vendorBill: vendorBillReducer,
    report: reportReducer,
    util: utilReducer,
    menu: menuReducer,
    permission: permissionReducer,
    asset: assetReducer,
    service: serviceReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
            },
        }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
// export default configureStore({
//     reducer: rootReducer,
// });

export type IRootState = ReturnType<typeof rootReducer>;
