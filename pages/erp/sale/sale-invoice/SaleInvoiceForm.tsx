import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState, useAppDispatch, useAppSelector} from "@/store";
import {AnyAction} from "redux";
import {setAuthToken, setContentType} from "@/configs/api.config";
import Alert from "@/components/Alert";
import {Dropdown} from "@/components/form/Dropdown";
import {Input} from "@/components/form/Input";
import Option from "@/components/form/Option";
import Button from "@/components/Button";
import {ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType} from "@/utils/enums";
import {getIcon} from "@/utils/helper";
import Textarea from "@/components/form/Textarea";
import {generateCode} from "@/store/slices/utilSlice";
import {pendingQuotations} from "@/store/slices/quotationSlice";
import {pendingDeliveryNotes} from "@/store/slices/deliveryNoteSlice";
import {capitalize} from "lodash";

const DeliveryNoteForm = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector((state) => state.user);
    const {code} = useAppSelector((state) => state.util);
    const {deliveryNotes} = useAppSelector(state => state.deliveryNote)

    const [formData, setFormData] = useState<any>({})
    const [validations, setValidations] = useState<any>({})
    const [formError, setFormError] = useState<string>('')
    const [deliveryNoteOptions, setDeliveryNoteOptions] = useState<any[]>([])
    const [selectedDeliveryNote, setSelectedDeliveryNote] = useState<any>({})

    const handleChange = (name: string, value: any, required: boolean) => {
        switch (name) {
            case 'delivery_note_id':
                if (value && typeof value !== 'undefined') {
                    setSelectedDeliveryNote(value.data)
                    setFormData({...formData, delivery_note_id: value.value})
                    handleValidation('delivery_note_id', 'remove')
                } else {
                    setFormData({...formData, delivery_note_id: ''})
                    handleValidation('delivery_note_id', 'add')
                }
                break;
            default:
                setFormData({...formData, [name]: value})
                handleValidation(name, 'remove')
                break;
        }
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
            // console.log('Form Submitted', formData);
        }
    }

    const calculateTotal = (item: any) => {
        let totalCost = parseFloat(item.retail_price) * parseFloat(item.quantity);
        let taxAmount = (totalCost * parseFloat(item.tax_rate)) / 100;
        let discountAmount = item.discount_type === 'percentage' ? (totalCost * parseFloat(item.discount_amount_rate)) / 100 : parseFloat(item.discount_amount_rate);
        return totalCost + taxAmount - discountAmount;
    }

    useEffect(() => {
        setAuthToken(token)
        setContentType('application/json')
        dispatch(generateCode(FORM_CODE_TYPE.SALE_INVOICE))
        dispatch(pendingDeliveryNotes())
    }, [])

    useEffect(() => {
        if (validations && Object.keys(validations).length > 0) {
            setFormError('Please fill all required fields')
        } else {
            setFormError('')
        }
    }, [validations]);

    useEffect(() => {
        if (deliveryNotes) {
            setDeliveryNoteOptions(deliveryNotes.map((item: any) => ({
                label: item.delivery_note_code,
                value: item.id,
                data: item
            })))
        }
    }, [deliveryNotes])

    useEffect(() => {
        if (code) {
            setFormData({...formData, sale_invoice_code: code[FORM_CODE_TYPE.SALE_INVOICE]})
        }
    }, [code]);

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
                        label='Delivery Notes'
                        name='delivery_note_id'
                        options={deliveryNoteOptions}
                        value={formData.delivery_note_id}
                        onChange={(e: any) => handleChange('delivery_note_id', e, true)}
                        required={true}
                        errorMessage={validations.delivery_note_id}
                    />

                    <Input
                        divClasses="w-full"
                        label="Sale Invoice Code"
                        type="text"
                        name="sale_invoice_code"
                        value={formData.sale_invoice_code}
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Enter Delivery Note Code"
                        isMasked={false}
                        disabled={true}
                    />

                </div>
                <div className="w-full border rounded p-5 hidden md:block">
                    <h5 className="text-lg font-semibold dark:text-white-light mb-3">Sale Invoice Instructions</h5>
                    <ul className="list-decimal list-inside space-y-2">
                        <li>Fill all required fields</li>
                        <li>Click on submit button to save the record</li>
                        <li>Click on clear button to reset the form</li>
                    </ul>
                </div>
            </div>

            {Object.keys(selectedDeliveryNote).length > 0 && (
                <div className="border rounded p-5 w-full my-5" hidden={Object.keys(selectedDeliveryNote).length === 0}>
                    <div className="my-3 grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        <span>
                            <strong>Quotation For: </strong>
                            {selectedDeliveryNote.delivery_note_for === 1 ? 'Finished Goods' : 'Raw Material'}
                        </span>
                        <span>
                            <strong>Quotation Code: </strong>
                            {selectedDeliveryNote.quotation.quotation_code}
                        </span>
                        <span>
                            <strong>Delivery Note Code: </strong>
                            {selectedDeliveryNote.delivery_note_code}
                        </span>
                        <span>
                            <strong>Receipt Delivery In Days: </strong>
                            {selectedDeliveryNote.receipt_delivery_due_days}
                        </span>
                        <span>
                            <strong>Delivery Due In Days: </strong>
                            {selectedDeliveryNote.delivery_due_in_days + " (" + selectedDeliveryNote.delivery_due_date + ")"}
                        </span>
                        <span>
                            <strong>Salesman: </strong>
                            {selectedDeliveryNote.salesman.name + " (" + selectedDeliveryNote.salesman.employee.employee_code + ")"}
                        </span>
                        <span>
                            <strong>Customer: </strong>
                            {selectedDeliveryNote.customer.name + " (" + selectedDeliveryNote.customer.customer_code + ")"}
                        </span>
                        <span>
                            <strong>Contact Person: </strong>
                            {selectedDeliveryNote.contact_person?.name}
                        </span>
                    </div>

                    <table>
                        <thead>
                        <tr>
                            <th>Sr.No</th>
                            <th>Product</th>
                            <th>Batch #</th>
                            <th>Filling</th>
                            <th>Available</th>
                            <th>Retail Price</th>
                            <th>Qty</th>
                            <th>Tax</th>
                            <th>Discount</th>
                            <th>Total Cost</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedDeliveryNote.delivery_note_items.map((item: any, index: number) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.product_assembly.formula_name}</td>
                                <td>{item.batch_number}</td>
                                <td>{item.product.title + " - " + item.product.item_code}</td>
                                <td>{item.available_quantity}</td>
                                <td>{item.retail_price.toFixed(2)}</td>
                                <td>{item.quantity.toFixed(2)}</td>
                                <td>
                                    <div className="flex flex-col">
                                        <span><strong>Tax: </strong>{item.tax_category.name} ({item.tax_rate}%)</span>
                                        <span><strong>Amount: </strong>{item.tax_amount.toFixed(2)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex flex-col">
                                        <span><strong>Type: </strong>{capitalize(item.discount_type)}</span>
                                        <span><strong>Rate: </strong>
                                            {item.discount_amount_rate.toFixed(2)}{item.discount_type === 'percentage' ? '%' : ''}
                                        </span>
                                    </div>
                                </td>
                                <td>{calculateTotal(item).toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

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
