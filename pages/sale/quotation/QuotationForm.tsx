import React, {useEffect, useState} from 'react';
import {Input} from "@/components/form/Input";
import {Dropdown} from "@/components/form/Dropdown";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import Button from "@/components/Button";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {getIcon} from "@/utils/helper";
import Textarea from "@/components/form/Textarea";
import {setAuthToken, setContentType} from "@/configs/api.config";
import Option from "@/components/form/Option";
import Alert from "@/components/Alert";

const QuotationForm = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);

    const [formData, setFormData] = useState<any>({})
    const [customerOptions, setCustomerOptions] = useState<any[]>([])
    const [contactPersonOptions, setContactPersonOptions] = useState<any[]>([])
    const [salesmanOptions, setSalesmanOptions] = useState<any[]>([])
    const [fillingOptions, setFillingOptions] = useState<any[]>([
        {label: 'Custom Quotation', value: 0},
    ])
    const [customerDetail, setCustomerDetail] = useState<any>({})
    const [contactPersonDetail, setContactPersonDetail] = useState<any>({})
    const [showCustomerDetail, setShowCustomerDetail] = useState(false)
    const [showContactPersonDetail, setShowContactPersonDetail] = useState(false)
    const [validations, setValidations] = useState<any>({})
    const [formError, setFormError] = useState<any>('')
    const handleChange = (name: string, value: any, required: boolean = false) => {
        if (required && value === '') {
            handleValidation(name, 'add')
            return;
        }

        if (name === 'delivery_due_in_days') {
            const date = new Date();
            date.setDate(date.getDate() + parseInt(value));
            setFormData((prev: any) => ({
                ...prev,
                delivery_due_in_days: value,
                delivery_due_date: date.toDateString()
            }));
            handleValidation(name, 'remove')
            return;
        }

        if (name === 'filling_id' || name === 'salesman_id' || name === 'contact_person_id' || name === 'customer_id') {
            if (required && (name === 'salesman_id' || name === 'contact_person_id' || name === 'customer_id') && value === 0) {
                handleValidation(name, 'add')
                return;
            } else {
                // Remove that key and value from validation object
                handleValidation(name, 'remove')
                if (value && typeof value !== 'undefined') {
                    setFormData({...formData, [name]: value.value})
                    if (name === 'customer_id') {
                        const customerOption = customerOptions.find((customer: any) => customer.value === value)
                        if (customerOption) {
                            setCustomerDetail(customerOption.customer)
                            setShowCustomerDetail(true)
                        }
                        setContactPersonOptions([])
                        setContactPersonDetail({})
                        setShowContactPersonDetail(false)
                        // dispatch() i will get customer contact persons
                    }

                    if (name === 'contact_person_id') {
                        const contactPersonOption = contactPersonOptions.find((contactPerson: any) => contactPerson.value === value)
                        if (contactPersonOption) {
                            setContactPersonDetail(contactPersonOption.contactPerson)
                            setShowContactPersonDetail(true)
                        }
                    }
                } else {
                    setFormData({...formData, [name]: ''})
                }
            }
            return;
        }
        handleValidation(name, 'remove')
        setFormData({...formData, [name]: value})
    }

    const handleValidation = (name: string, type:string) => {
        if (type==='remove') {
            if (validations[name]) {
                setValidations((prev: any) => {
                    delete prev[name]
                    return prev
                })
            }
        } else {
            setValidations({...validations, [name]: 'Required Field'})
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.currentTarget.querySelectorAll('input, select, textarea').forEach((field: any) => {
            if (field.required) {
                if ((!formData[field.name] || formData[field.name] === 0) && !validations[field.name] && field.value === '') {
                    setValidations({...validations, [field.name]: 'Required Field'})
                }
            }
        })
        if (Object.keys(validations).length > 0) {
            setFormError('Please fill all required fields')
            return;
        } else {
            setFormError('')
            console.log('Form Submitted', formData);
        }
    }

    useEffect(() => {
        setAuthToken(token)
        setContentType('application/json')
        // dispatch() i will get all customers
        // dispatch() i will get all salesmen
        // dispatch() i will get all pending fillings
    }, [])

    useEffect(() => {
        if (validations && Object.keys(validations).length > 0) {
            setFormError('Please fill all required fields')
        } else {
            setFormError('')
        }

        console.log('Validations', validations)
    }, [validations]);

    return (
        <form onSubmit={handleSubmit}>
            {validations && Object.keys(validations).length > 0 && (
                <Alert message={formError} setMessages={setFormError} alertType="error"/>
            )}
            {/* Quotation Form */}
            <div className="flex w-full flex-row items-start justify-between gap-3 mt-3">
                <div className="flex w-full flex-col items-start justify-start space-y-3">
                    <Dropdown
                        divClasses='w-full'
                        label='Quotation For'
                        name='filling_id'
                        options={fillingOptions}
                        value={formData.filling_id}
                        onChange={(e: any) => handleChange('filling_id', e, true)}
                        required={true}
                        errorMessage={validations.filling_id}
                    />

                    <Input
                        divClasses="w-full"
                        label="Quotation Code"
                        type="text"
                        name="quotation_code"
                        value={formData.quotation_code}
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Enter Quotation Code"
                        isMasked={false}
                        disabled={true}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <Input
                            divClasses='w-full'
                            label='Receipt Delivery Due Days'
                            type='number'
                            name='receipt_delivery_due_days'
                            value={formData.receipt_delivery_due_days?.toString()}
                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                            isMasked={false}
                            placeholder="Receipt Delivery Due Days"
                            required={true}
                            errorMessage={validations.receipt_delivery_due_days}
                        />

                        <Input
                            divClasses='w-full'
                            label='Delivery Due days'
                            type='number'
                            name='delivery_due_in_days'
                            value={formData.delivery_due_in_days}
                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                            isMasked={false}
                            placeholder="Receipt Delivery Days"
                            required={true}
                            errorMessage={validations.delivery_due_in_days}
                        />

                        <Input
                            divClasses='w-full'
                            label='Delivery Due Date'
                            type='text'
                            name='delivery_due_date'
                            value={formData.delivery_due_date}
                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                            isMasked={false}
                            placeholder="Receipt Delivery Due Date"
                            disabled={true}
                            required={true}
                            errorMessage={validations.delivery_due_date}
                        />

                        <Dropdown
                            divClasses='w-full'
                            label='Salesman'
                            name='salesman_id'
                            options={salesmanOptions}
                            value={formData.salesman_id}
                            onChange={(e: any) => handleChange('salesman_id', e && typeof e !== 'undefined' ? e.value : '', true)}
                            required={true}
                            errorMessage={validations.salesman_id}
                        />

                        <Option
                            divClasses='w-full'
                            label="Skip Delivery Note"
                            type="checkbox"
                            name='skip_delivery_note'
                            value={formData.skip_delivery_note}
                            onChange={(e: any) => handleChange(e.target.name, e.target.checked, e.target.required)}
                        />

                        <Option
                            divClasses='w-full'
                            label='Print As Performa Invoice'
                            type='checkbox'
                            name='print_as_performa'
                            value={formData.print_as_performa}
                            onChange={(e: any) => handleChange(e.target.name, e.target.checked, e.target.required)}
                        />
                    </div>

                </div>
                <div className="w-full border rounded p-5 hidden md:block">
                    <h5 className="text-lg font-semibold dark:text-white-light mb-3">Quotation Instructions</h5>
                    <ul className="list-decimal list-inside space-y-2">
                        <li>Quotation For: Select the type of Quotation you want to create.</li>
                        <li>Quotation Code: This will be auto generated.</li>
                        <li>Receipt Delivery Due Days: Enter the number of days for receipt delivery.</li>
                        <li>Delivery Due Days: Enter the number of days for delivery.</li>
                        <li>Delivery Due Date: This will be auto generated based on Delivery Due Days.</li>
                        <li>Salesman: Select the salesman for this quotation.</li>
                        <li>Skip Delivery Note: Check this if you want to skip delivery note.</li>
                        <li>Print As Performa Invoice: Check this if you want to print as performa invoice.</li>
                        <li>Sleect Formula and add production quantity to it in case of custom quotation</li>
                    </ul>
                </div>
            </div>
            <div className="border rounded p-5 w-full my-5">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <h3 className="text-lg font-semibold">Customer</h3>
                    <Button
                        type={ButtonType.link}
                        text={
                            <span className="flex items-center">
                                {getIcon(IconType.add)}
                                Create Customer
                            </span>
                        }
                        variant={ButtonVariant.primary}
                        link="/crm/customer/create"
                        size={ButtonSize.small}
                    />
                </div>
                <hr className="my-3"/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full my-5 ">
                    <div className="w-full space-y-3">
                        <Dropdown
                            divClasses='w-full'
                            label='Customer'
                            name='customer_id'
                            options={customerOptions}
                            value={formData.customer_id}
                            onChange={(e: any) => handleChange('customer_id', e && typeof e !== 'undefined' ? e.value : '', true)}
                        />

                        <div className="w-full" hidden={!showCustomerDetail}>
                            <h4 className="font-bold text-lg">Customer Details</h4>
                            <table>
                                <thead>
                                <tr>
                                    <th>Customer Code</th>
                                    <th>Customer Name</th>
                                    <th>Billed From</th>
                                    <th>Shift From</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{customerDetail.customer_code}</td>
                                    <td>{customerDetail.name}</td>
                                    <td>
                                        {customerDetail.addresses?.map((address: any, index: number) => {
                                            if (address.type === 'billing') {
                                                return address.address + ', ' + address.city?.name + ', ' + address.state?.name + ', ' + address.country?.name
                                            }
                                        })}
                                    </td>
                                    <td>
                                        {customerDetail.addresses?.map((address: any, index: number) => {
                                            if (address.type === 'shifting') {
                                                return address.address + ', ' + address.city?.name + ', ' + address.state?.name + ', ' + address.country?.name
                                            }
                                        })}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="w-full space-y-3">
                        <Dropdown
                            divClasses='w-full'
                            label='Contact Person'
                            name='contact_person_id'
                            options={contactPersonOptions}
                            value={formData.contact_person_id}
                            onChange={(e: any) => handleChange('contact_person_id', e && typeof e !== 'undefined' ? e.value : '', true)}
                        />

                        <div className="w-full" hidden={!showContactPersonDetail}>
                            <h4 className="font-bold text-lg">Contact Person Details</h4>
                            <table>
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{contactPersonDetail.name}</td>
                                    <td>{contactPersonDetail.phone}</td>
                                    <td>{contactPersonDetail.email}</td>
                                    <td>
                                        {contactPersonDetail.address + ', ' + contactPersonDetail.city?.name + ', ' + contactPersonDetail.state?.name + ', ' + contactPersonDetail.country?.name}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Textarea
                divClasses='w-full'
                label='Terms & Conditions'
                name='terms_conditions'
                value={formData.terms_conditions}
                onChange={(e) => handleChange('terms_conditions', e, false)}
                isReactQuill={true}
            />
            <div className="w-full flex justify-center items-center flex-col md:flex-row gap-3 mt-5">
                <Button
                    type={ButtonType.submit}
                    text="Submit"
                    variant={ButtonVariant.primary}
                    disabled={false}
                />
                <Button
                    type={ButtonType.button}
                    text="Clear"
                    variant={ButtonVariant.info}
                    disabled={false}
                    onClick={() => window?.location?.reload()}
                />
            </div>
        </form>
    );
};

export default QuotationForm;
