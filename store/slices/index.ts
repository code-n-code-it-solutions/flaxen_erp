import {userSliceConfig} from "@/store/slices/userSlice";
import {unitSliceConfig} from "@/store/slices/unitSlice";
import {rawProductSliceConfig} from "@/store/slices/rawProductSlice";
import {categorySliceConfig} from "@/store/slices/categorySlice";
import {productAssemblySliceConfig} from "@/store/slices/productAssemblySlice";
import {productionSliceConfig} from "@/store/slices/productionSlice";
import {colorCodeSliceConfig} from "@/store/slices/colorCodeSlice";
import {locationSliceConfig} from "@/store/slices/locationSlice";
import {vendorTypeSliceConfig} from "@/store/slices/vendorTypeSlice";
import {vendorSliceConfig} from "@/store/slices/vendorSlice";
import {bankSliceConfig} from "@/store/slices/bankSlice";
import {currencySliceConfig} from "@/store/slices/currencySlice";
import {designationSliceConfig} from "@/store/slices/designationSlice";
import {departmentSliceConfig} from "@/store/slices/departmentSlice";
import {employeeSliceConfig} from "@/store/slices/employeeSlice";
import {purchaseRequisitionSliceConfig} from "@/store/slices/purchaseRequisitionSlice";
import {vehicleSliceConfig} from "@/store/slices/vehicleSlice";
import {localPurchaseOrderSliceConfig} from "@/store/slices/localPurchaseOrderSlice";
import {taxCategorySliceConfig} from "@/store/slices/taxCategorySlice";
import {goodReceiveNoteSliceConfig} from "@/store/slices/goodReceiveNoteSlice";
import {vendorBillSliceConfig} from "@/store/slices/vendorBillSlice";
import {utilSliceConfig} from "@/store/slices/utilSlice";
import {menuSliceConfig} from "@/store/slices/menuSlice";
import {permissionSliceConfig} from "@/store/slices/permissionSlice";
import {assetSliceConfig} from "@/store/slices/assetSlice";
import {serviceSliceConfig} from "@/store/slices/serviceSlice";
import {fillingSliceConfig} from "@/store/slices/fillingSlice";
import {workingShiftSliceConfig} from "@/store/slices/workingShiftSlice";
import {quotationSliceConfig} from "@/store/slices/quotationSlice";
import {reportSliceConfig} from "@/store/slices/reportSlice";
import {themeConfigSliceConfig} from "@/store/slices/themeConfigSlice";
import {customerSliceConfig} from "@/store/slices/customerSlice";
import {accountSliceConfig} from "@/store/slices/accountSlice";
import {transactionSliceConfig} from "@/store/slices/transactionSlice";
import {expenseSliceConfig} from "@/store/slices/expenseSlice";
import {deliveryNoteSliceConfig} from "@/store/slices/deliveryNoteSlice";
import {saleInvoiceSliceConfig} from "@/store/slices/saleInvoiceSlice";
import {companySliceConfig} from "@/store/slices/companySlice";
import { pluginSliceConfig } from '@/store/slices/pluginSlice';
import { customerPaymentSliceConfig } from '@/store/slices/customerPayment';
import { paymentMethodSliceConfig } from '@/store/slices/paymentMethodSlice';
import { vendorPaymentSliceConfig } from '@/store/slices/vendorPayments';
import { bankAccountSliceConfig } from '@/store/slices/bankAccountSlice';
import { loginActivitySliceConfig } from '@/store/slices/loginActivitySlice';
import { settingSliceConfig } from '@/store/slices/settingSlice';
import { userLoginRuleSliceConfig } from '@/store/slices/userLoginRuleSlice';
import { rawProductCategorySliceConfig } from '@/store/slices/rawProductCategorySlice';


export const slices = {
    user: userSliceConfig,
    unit: unitSliceConfig,
    rawProduct: rawProductSliceConfig,
    productCategory: categorySliceConfig,
    productAssembly: productAssemblySliceConfig,
    production: productionSliceConfig,
    colorCode: colorCodeSliceConfig,
    location: locationSliceConfig,
    vendorType: vendorTypeSliceConfig,
    vendor: vendorSliceConfig,
    bank: bankSliceConfig,
    currency: currencySliceConfig,
    designation: designationSliceConfig,
    department: departmentSliceConfig,
    employee: employeeSliceConfig,
    purchaseRequisition: purchaseRequisitionSliceConfig,
    vehicle: vehicleSliceConfig,
    localPurchaseOrder: localPurchaseOrderSliceConfig,
    taxCategory: taxCategorySliceConfig,
    goodReceiveNote: goodReceiveNoteSliceConfig,
    vendorBill: vendorBillSliceConfig,
    util: utilSliceConfig,
    menu: menuSliceConfig,
    permission: permissionSliceConfig,
    asset: assetSliceConfig,
    service: serviceSliceConfig,
    filling: fillingSliceConfig,
    workingShift: workingShiftSliceConfig,
    quotation: quotationSliceConfig,
    report: reportSliceConfig,
    themeConfig: themeConfigSliceConfig,
    customer: customerSliceConfig,
    account: accountSliceConfig,
    transaction: transactionSliceConfig,
    expense: expenseSliceConfig,
    deliveryNote: deliveryNoteSliceConfig,
    saleInvoice: saleInvoiceSliceConfig,
    company: companySliceConfig,
    plugin: pluginSliceConfig,
    customerPayment: customerPaymentSliceConfig,
    paymentMethod: paymentMethodSliceConfig,
    vendorPayment: vendorPaymentSliceConfig,
    bankAccount: bankAccountSliceConfig,
    loginActivity: loginActivitySliceConfig,
    setting: settingSliceConfig,
    userRuleLogin: userLoginRuleSliceConfig,
    rawProductCategory: rawProductCategorySliceConfig,
}


export const reducers = {
    user: userSliceConfig.reducer,
    unit: unitSliceConfig.reducer,
    rawProduct: rawProductSliceConfig.reducer,
    productCategory: categorySliceConfig.reducer,
    productAssembly: productAssemblySliceConfig.reducer,
    production: productionSliceConfig.reducer,
    colorCode: colorCodeSliceConfig.reducer,
    location: locationSliceConfig.reducer,
    vendorType: vendorTypeSliceConfig.reducer,
    vendor: vendorSliceConfig.reducer,
    bank: bankSliceConfig.reducer,
    currency: currencySliceConfig.reducer,
    designation: designationSliceConfig.reducer,
    department: departmentSliceConfig.reducer,
    employee: employeeSliceConfig.reducer,
    purchaseRequisition: purchaseRequisitionSliceConfig.reducer,
    vehicle: vehicleSliceConfig.reducer,
    localPurchaseOrder: localPurchaseOrderSliceConfig.reducer,
    taxCategory: taxCategorySliceConfig.reducer,
    goodReceiveNote: goodReceiveNoteSliceConfig.reducer,
    vendorBill: vendorBillSliceConfig.reducer,
    util: utilSliceConfig.reducer,
    menu: menuSliceConfig.reducer,
    permission: permissionSliceConfig.reducer,
    asset: assetSliceConfig.reducer,
    service: serviceSliceConfig.reducer,
    filling: fillingSliceConfig.reducer,
    workingShift: workingShiftSliceConfig.reducer,
    quotation: quotationSliceConfig.reducer,
    report: reportSliceConfig.reducer,
    themeConfig: themeConfigSliceConfig.reducer,
    customer: customerSliceConfig.reducer,
    account: accountSliceConfig.reducer,
    transaction: transactionSliceConfig.reducer,
    expense: expenseSliceConfig.reducer,
    deliveryNote: deliveryNoteSliceConfig.reducer,
    saleInvoice: saleInvoiceSliceConfig.reducer,
    company: companySliceConfig.reducer,
    plugin: pluginSliceConfig.reducer,
    customerPayment: customerPaymentSliceConfig.reducer,
    paymentMethod: paymentMethodSliceConfig.reducer,
    vendorPayment: vendorPaymentSliceConfig.reducer,
    bankAccount: bankAccountSliceConfig.reducer,
    loginActivity: loginActivitySliceConfig.reducer,
    setting: settingSliceConfig.reducer,
    userRuleLogin: userLoginRuleSliceConfig.reducer,
    rawProductCategory: rawProductCategorySliceConfig.reducer,
}
