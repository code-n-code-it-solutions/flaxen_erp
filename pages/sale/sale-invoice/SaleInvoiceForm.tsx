import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {setAuthToken, setContentType} from "@/configs/api.config";
import Alert from "@/components/Alert";
import {Dropdown} from "@/components/form/Dropdown";
import {Input} from "@/components/form/Input";
import Option from "@/components/form/Option";
import Button from "@/components/Button";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {getIcon} from "@/utils/helper";
import Textarea from "@/components/form/Textarea";

const DeliveryNoteForm = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const {token} = useSelector((state: IRootState) => state.user);

    const [formData, setFormData] = useState<any>({})
    const [customerOptions, setCustomerOptions] = useState<any[]>([])
    const [contactPersonOptions, setContactPersonOptions] = useState<any[]>([])
    const [quotationOptions, QuotationOptions] = useState<any[]>([])
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

        if (name === 'quotation_id' || name === 'salesman_id' || name === 'deliver_by_id' || name === 'customer_id') {
            if (required && (name === 'salesman_id' || name === 'deliver_by_id' || name === 'customer_id') && value === 0) {
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

                    if (name === 'deliver_by_id') {
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

    const handleValidation = (name: string, type: string) => {
        if (type === 'remove') {
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
        // dispatch() i will get all pending quotations
    }, [])

    useEffect(() => {
        if (validations && Object.keys(validations).length > 0) {
            setFormError('Please fill all required fields')
        } else {
            setFormError('')
        }
    }, [validations]);

    return (
        <form onSubmit={handleSubmit}>
            {validations && Object.keys(validations).length > 0 && (
                <Alert message={formError} setMessages={setFormError} alertType="error"/>
            )}
            {/* Delivery Note Form */}
            <div className="flex w-full flex-row items-start justify-between gap-3 mt-3">
                <div className="flex w-full flex-col items-start justify-start space-y-3">
                    <Dropdown
                        divClasses='w-full'
                        label='Quotation'
                        name='quotation_id'
                        options={quotationOptions}
                        value={formData.quotation_id}
                        onChange={(e: any) => handleChange('quotation_id', e, true)}
                        required={true}
                        errorMessage={validations.quotation_id}
                    />

                    <Input
                        divClasses="w-full"
                        label="Delivery Note Code"
                        type="text"
                        name="deliver_note_code"
                        value={formData.quotation_code}
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Enter Delivery Note Code"
                        isMasked={false}
                        disabled={true}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
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
                    </div>

                </div>
                <div className="w-full border rounded p-5 hidden md:block">
                    <h5 className="text-lg font-semibold dark:text-white-light mb-3">Delivery Note Instructions</h5>
                    <ul className="list-decimal list-inside space-y-2">
                        <li>Delivery Note Code will be auto generated</li>
                        <li>Delivery Due Date will be auto calculated based on Delivery Due Days</li>
                        <li>Delivery Due Days is required field</li>
                        <li>Select contact person from customer as delivery by</li>
                        <li>Terms & Conditions are optional</li>
                        <li>Double check the item details</li>
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
                            label='Delivery By'
                            name='deliver_by_id'
                            options={contactPersonOptions}
                            value={formData.deliver_by_id}
                            onChange={(e: any) => handleChange('deliver_by_id', e && typeof e !== 'undefined' ? e.value : '', true)}
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

export default DeliveryNoteForm;
