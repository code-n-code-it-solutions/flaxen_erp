import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {clearVendorState, getRepresentatives, getVendors} from "@/store/slices/vendorSlice";
import {getCurrencies} from "@/store/slices/currencySlice";
import {getEmployees} from "@/store/slices/employeeSlice";
import {getTaxCategories} from "@/store/slices/taxCategorySlice";
import Button from "@/components/Button";
import {ButtonType, ButtonVariant, FORM_CODE_TYPE, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import {Dropdown} from "@/components/form/Dropdown";
import Textarea from "@/components/form/Textarea";
import {getCustomers} from "@/store/slices/customerSlice";
import {Input} from "@/components/form/Input";
import {capitalize} from "lodash";
import {setAuthToken} from "@/configs/api.config";
import RawProductItemListing from "@/components/listing/RawProductItemListing";
import {getAccountList} from "@/store/slices/accountSlice";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {storeExpense} from "@/store/slices/expenseSlice";

const ExpenseForm = () => {
    const dispatch = useAppDispatch();

    const {token} = useAppSelector(state => state.user);
    const {loading} = useAppSelector(state => state.expense);
    const {allVendors, representatives} = useAppSelector(state => state.vendor);
    const {customers} = useAppSelector(state => state.customer);
    const {employees} = useAppSelector(state => state.employee);
    const {currencies} = useAppSelector(state => state.currency);
    const {code} = useAppSelector(state => state.util);

    const [formData, setFormData] = useState<any>({})
    const [errors, setErrors] = useState<any>({})
    const [formError, setFormError] = useState<string>('')
    const [customerOptions, setCustomerOptions] = useState<any[]>([])
    const [contactPersonOptions, setContactPersonOptions] = useState<any[]>([])
    const [employeeOptions, setEmployeeOptions] = useState<any[]>([])
    const [currencyOptions, setCurrencyOptions] = useState<any[]>([])
    const [vendorOptions, setVendorOptions] = useState<any[]>([])
    const [vendorRepresentativeOptions, setVendorRepresentativeOptions] = useState<any[]>([])
    const [itemList, setItemList] = useState<any[]>([])
    const [paidToOptions, setPaidOptions] = useState<any[]>([
        {value: 'vendor', label: 'Vendor'},
        {value: 'employee', label: 'Employee'},
        {value: 'customer', label: 'Customer'},
        {value: 'salesman', label: 'Salesman'},
        {value: 'unknown', label: 'other'},
    ])

    const [paymentMethodOptions] = useState<any[]>([
        {label: 'Cash', value: 'cash'},
        {label: 'Bank', value: 'bank'},
        {label: 'Cheque', value: 'cheque'},
    ]);

    const handleSubmit = (e: any) => {
        e.preventDefault()
        let finalData = {
            ref_no: formData.ref_no,
            payment_method: formData.payment_method,
            paid_to: formData.paid_to,
            paid_to_id: formData.paid_to_id,
            currency_id: formData.currency_id,
            description: formData.description,
            items: itemList
        }
        dispatch(storeExpense(finalData))
        // console.log(finalData)
    }

    const handleChange = (name: any, value: any, required: boolean) => {
        switch (name) {
            case 'currency_id':
                if (value && typeof value !== 'undefined') {
                    setFormData((prev: any) => ({...prev, 'currency_id': value.value}))
                } else {
                    setFormData((prev: any) => ({...prev, 'currency_id': ''}))
                }
                break;
            case 'payment_method':
                if (value && typeof value !== 'undefined') {
                    setFormData((prev: any) => ({...prev, 'payment_method': value.value}))
                } else {
                    setFormData((prev: any) => ({...prev, 'payment_method': ''}))
                }
                break;
            case 'paid_to':
                if (value && typeof value !== 'undefined') {
                    setFormData((prev: any) => ({...prev, 'paid_to': value.value}))
                    if (value.value === 'other') {
                        setFormData((prev: any) => ({...prev, 'paid_to_id': ''}))
                        setFormData((prev: any) => ({...prev, 'paid_to_id': ''}))
                    }
                } else {
                    setFormData((prev: any) => ({...prev, 'paid_to': ''}))
                    setFormData((prev: any) => ({...prev, 'paid_to_id': ''}))
                }
                break;
            case 'vendor_id':
                if (value && typeof value !== 'undefined') {
                    setFormData((prev: any) => ({...prev, 'vendor_id': value.value}))
                    dispatch(getRepresentatives(value.value))
                } else {
                    setFormData((prev: any) => ({...prev, 'vendor_id': ''}))
                    setVendorRepresentativeOptions([])
                }
                break;
            case 'employee_id':
                if (value && typeof value !== 'undefined') {
                    setFormData((prev: any) => ({...prev, 'employee_id': value.value}))
                } else {
                    setFormData((prev: any) => ({...prev, 'employee_id': ''}))
                }
                break
            case 'paid_to_id':
                if (value && typeof value !== 'undefined') {
                    setFormData((prev: any) => ({...prev, 'paid_to_id': value.value}))
                } else {
                    setFormData((prev: any) => ({...prev, 'paid_to_id': ''}))
                }
                break
            case 'customer_id':
                if (value && typeof value !== 'undefined') {
                    setFormData((prev: any) => ({...prev, 'customer_id': value.value}))
                    const customerOption = customerOptions.find(customer => customer.value === value.value);
                    if (customerOption) {
                        setContactPersonOptions(customerOption.customer?.contact_persons.map((contactPerson: any) => ({
                            label: contactPerson.name,
                            value: contactPerson.id,
                            contactPerson
                        })));
                    }
                } else {
                    setFormData((prev: any) => ({...prev, 'customer_id': ''}))
                    setContactPersonOptions([])
                }
                break;
            default:
                setFormData((prev: any) => ({...prev, [name]: value}))
        }
    }

    useEffect(() => {
        setAuthToken(token)
        dispatch(clearVendorState())
        dispatch(getVendors())
        dispatch(getCurrencies())
        dispatch(getEmployees())
        dispatch(getTaxCategories());
        dispatch(getCustomers())
        dispatch(clearUtilState())
        dispatch(generateCode('general_payment_voucher'))
    }, []);


    useEffect(() => {
        if (allVendors) {
            setVendorOptions(allVendors.map((vendor: any) => ({
                value: vendor.id,
                label: vendor.name,
                vendor: vendor
            })))
        }
    }, [allVendors])

    useEffect(() => {
        if (representatives) {
            setVendorRepresentativeOptions(representatives.map((representative: any) => ({
                value: representative.id,
                label: representative.name,
                representative: representative
            })))
        }
    }, [representatives])

    useEffect(() => {
        if (currencies) {
            setCurrencyOptions(currencies.map((currency: any) => ({
                value: currency.id,
                label: currency.code,
                currency: currency
            })))
        }
    }, [currencies])

    useEffect(() => {
        if (employees) {
            setEmployeeOptions(employees.map((employee: any) => ({
                label: employee.name + '-' + employee.employee?.employee_code,
                value: employee.id
            })))
        }
    }, [employees]);

    useEffect(() => {
        if (customers) {
            setCustomerOptions(customers.map((customer: any) => ({
                label: customer.name + ' (' + customer.customer_code + ')',
                value: customer.id,
                customer
            })))
        }
    }, [customers]);

    useEffect(() => {
        if (code) {
            setFormData((prev: any) => ({...prev, 'expense_code': code[FORM_CODE_TYPE.EXPENSE]}))
        }
    }, [code])

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="flex flex-col md:flex-row justify-between items-center w-full gap-5 mb-5">
                <div className="flex flex-col space-y-3 justify-start items-start w-full">
                    <Input
                        divClasses="w-full"
                        label="Expense Code"
                        type="text"
                        name="expense_code"
                        value={formData.expense_code}
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Enter Expense Code"
                        isMasked={false}
                        disabled={true}
                    />

                    <Input
                        divClasses="w-full"
                        label="Reference Number"
                        type="text"
                        name="ref_no"
                        value={formData.ref_no}
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Reference Number"
                        isMasked={false}
                    />
                    <Dropdown
                        divClasses='w-full'
                        label='Paid To'
                        name='paid_to'
                        options={paidToOptions}
                        value={formData.paid_to}
                        onChange={(e: any) => handleChange('paid_to', e, true)}
                    />
                    <Dropdown
                        divClasses='w-full'
                        label='Currency'
                        name='currency_id'
                        options={currencyOptions}
                        value={formData.currency_id}
                        onChange={(e: any) => handleChange('currency_id', e, true)}
                        required={true}
                        errorMessage={errors.currency_id}
                    />
                    <Dropdown
                        divClasses="w-full"
                        label="Payment Method"
                        name="payment_method"
                        options={paymentMethodOptions}
                        value={formData.payment_method}
                        onChange={(e: any) => handleChange('payment_method', e, true)}
                        required={true}
                        errorMessage={errors.payment_method}
                    />
                    {(formData.paid_to === 'employee' || formData.paid_to === 'salesman') && (
                        <Dropdown
                            divClasses='w-full'
                            label={capitalize((formData.paid_to))}
                            name='paid_to_id'
                            options={employeeOptions}
                            value={formData.paid_to_id}
                            onChange={(e: any) => handleChange('paid_to_id', e, true)}
                            required={true}
                            errorMessage={errors.paid_to_id}
                        />
                    )}
                </div>
                <div className="w-full border rounded p-5 hidden md:block">
                    <h5 className="text-lg font-semibold dark:text-white-light mb-3">Expenses Instructions</h5>
                    <ul className="list-decimal list-inside space-y-2">
                        <li>Enter the Filling Code, Date, Time, and Shift</li>
                        <li>Select the Pending Production</li>
                        <li>Enter the Filling and Packing Material Detail</li>
                        <li>Double check production materials</li>
                        <li>Make sure to not leave any required field</li>
                        <li>Click on the Submit button</li>
                    </ul>
                </div>
            </div>
            {formData.paid_to === 'vendor' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <Dropdown
                        divClasses='w-full'
                        label='Vendor'
                        name='vendor_id'
                        options={vendorOptions}
                        value={formData.vendor_id}
                        onChange={(e: any) => handleChange('vendor_id', e, true)}
                        required={true}
                        errorMessage={errors.vendor_id}
                    />
                    <Dropdown
                        divClasses='w-full'
                        label='Vendor Representative'
                        name='paid_to_id'
                        options={vendorRepresentativeOptions}
                        value={formData.paid_to_id}
                        onChange={(e: any) => handleChange('paid_to_id', e, true)}
                        required={true}
                        errorMessage={errors.paid_to_id}
                    />
                </div>
            )}

            {formData.paid_to === 'customer' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <Dropdown
                        divClasses='w-full'
                        label='Customer'
                        name='customer_id'
                        options={customerOptions}
                        value={formData.customer_id}
                        onChange={(e: any) => handleChange('customer_id', e, true)}
                        required={true}
                        errorMessage={errors.customer_id}
                    />
                    <Dropdown
                        divClasses='w-full'
                        label='Contact Person'
                        name='paid_to_id'
                        options={contactPersonOptions}
                        value={formData.paid_to_id}
                        onChange={(e: any) => handleChange('paid_to_id', e, true)}
                        required={true}
                        errorMessage={errors.paid_to_id}
                    />
                </div>
            )}

            <Textarea
                divClasses='w-full'
                label='Terms & Conditions'
                name='description'
                value={formData.description}
                onChange={(e: any) => handleChange(e.target.name, e.target.value, e.target.required)}
                isReactQuill={false}
            />

            <div className="my-5">
                <RawProductItemListing
                    rawProducts={itemList}
                    setRawProducts={setItemList}
                    type={RAW_PRODUCT_LIST_TYPE.EXPENSE}
                />
            </div>

            <div className="w-full flex justify-center items-center flex-col md:flex-row gap-3">
                <Button
                    type={ButtonType.submit}
                    disabled={loading}
                    text={loading ? 'Loading...' : 'Save Expense'}
                    variant={ButtonVariant.primary}
                />
                <Button
                    type={ButtonType.button}
                    text="Clear"
                    variant={ButtonVariant.info}
                    onClick={() => window?.location?.reload()}
                />
            </div>
        </form>
    );
};

export default ExpenseForm;
