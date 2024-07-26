import React, { Fragment, useEffect, useState } from 'react';
import { Input } from '@/components/form/Input';
import { useAppDispatch, useAppSelector } from '@/store';
import { clearLatestRecord, generateCode, getLatestRecord } from '@/store/slices/utilSlice';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { Dropdown } from '@/components/form/Dropdown';
import { pendingDeliveryNotes } from '@/store/slices/deliveryNoteSlice';
import Button from '@/components/Button';
import { ButtonType, ButtonVariant } from '@/utils/enums';
import { capitalize } from 'lodash';
import { storeSaleInvoice } from '@/store/slices/saleInvoiceSlice';
import { calculateDateFromDays } from '@/utils/helper';
import { Tab } from '@headlessui/react';
import Option from '@/components/form/Option';
import dynamic from 'next/dynamic';
import { getAccountsTypes } from '@/store/slices/accountSlice';
import useTransformToSelectOptions from '@/hooks/useTransformToSelectOptions';

const TreeSelect = dynamic(() => import('antd/es/tree-select'), { ssr: false });

const InvoiceForm = () => {
    const dispatch = useAppDispatch();
    const accountOptions = useTransformToSelectOptions(useAppSelector(state => state.account).accountTypes);
    const { token } = useAppSelector((state) => state.user);
    const { code, latestRecord } = useAppSelector((state) => state.util);
    const { deliveryNotes } = useAppSelector((state) => state.deliveryNote);

    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [deliveryNoteOptions, setDeliveryNoteOptions] = useState<any[]>([]);
    const [customer, setCustomer] = useState<any>({});
    const [contactPerson, setContactPerson] = useState<any>({});
    const [salesman, setSalesman] = useState<any>({});
    const [deliveryNoteItems, setDeliveryNoteItems] = useState<any[]>([]);
    const [receivableAmount, setReceivableAmount] = useState<number>(0);

    const handleChange = (name: string, value: string, required: boolean) => {
        if (required && value === '') {
            setErrors({
                ...errors,
                [name]: 'This field is required'
            });
            return;
        } else {
            setErrors((err: any) => {
                delete err[name];
                return err;
            });
        }

        if (name === 'payment_terms') {
            setFormData({ ...formData, due_date: calculateDateFromDays(parseInt(value)) });
            return;
        }

        if (name === 'discount_amount') {
            setFormData({ ...formData, [name]: parseFloat(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        if (name === 'invoice_type' || name === 'discount_amount') {
            recalculateReceivableAmount(deliveryNoteItems, parseFloat(formData.discount_amount || 0));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token);
        dispatch(storeSaleInvoice(formData));
    };

    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(generateCode('sale_invoice'));
        dispatch(pendingDeliveryNotes());
        setFormData({ ...formData, discount_amount: 0 });
        dispatch(getAccountsTypes({ ids: 1 }));
    }, []);

    useEffect(() => {
        if (code) {
            setFormData({ ...formData, sale_invoice_code: code['sale_invoice'] });
        }
    }, [code]);

    useEffect(() => {
        if (deliveryNotes) {
            setDeliveryNoteOptions(deliveryNotes.map((item: any) => ({
                value: item.id,
                label: item.delivery_note_code,
                delivery_note: item
            })));
        }
    }, [deliveryNotes]);

    useEffect(() => {
        if (deliveryNoteItems.length > 0) {
            recalculateReceivableAmount(deliveryNoteItems, parseFloat(formData.discount_amount || 0));
        }
    }, [deliveryNoteItems, formData.discount_amount]);

    const recalculateReceivableAmount = (items: any[], discount: number) => {
        const totalCost = items.reduce((acc: number, item: any) => acc + parseFloat(item.total_cost), 0);
        setReceivableAmount(totalCost - discount);
    };

    useEffect(() => {
        if (latestRecord) {
            setFormData((prevFormData: any) => ({
                ...prevFormData,
                account_receivable_id: latestRecord.account_receivable?.code,
                vat_payable_id: latestRecord.vat_payable?.code,
                sale_income_account_id: latestRecord.sale_income_account?.code
            }));
        }
    }, [latestRecord]);

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <Input
                divClasses="w-full md:w-1/2"
                className="text-xl font-light py-3"
                label="Invoice Number"
                type="text"
                name="sale_invoice_code"
                value={formData.sale_invoice_code}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                isMasked={false}
                disabled={true}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="w-full flex flex-col gap-3">
                    <h4 className="text-xl font-semibold text-gray-600 py-3">Invoice Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <span className="font-semibold text-gray-600">Customer Code: </span>
                        <span>{customer.customer_code}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <span className="font-semibold text-gray-600">Customer Name: </span>
                        <span>{customer.name}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <span className="font-semibold text-gray-600">Salesman Name: </span>
                        <span>{salesman.name}</span>
                    </div>
                    <Dropdown
                        divClasses="w-full"
                        label="Delivery Note"
                        name="delivery_note_ids"
                        options={deliveryNoteOptions}
                        value={formData.delivery_note_ids}
                        onChange={(e) => {
                            if (e && typeof e !== 'undefined' && e.length > 0) {
                                setFormData({
                                    ...formData,
                                    delivery_note_ids: e.map((item: any) => item.value).join(','),
                                    customer_id: e[0].delivery_note.customer_id,
                                    contact_person_id: e[0].delivery_note.contact_person_id,
                                    salesman_id: e[0].delivery_note.salesman_id,
                                    due_date: calculateDateFromDays(e[0].delivery_note.customer.due_in_days),
                                    payment_terms: e[0].delivery_note.customer.due_in_days
                                });
                                setCustomer(e[0].delivery_note.customer);
                                setContactPerson(e[0].delivery_note.contact_person);
                                setSalesman(e[0].delivery_note.salesman);
                                setDeliveryNoteItems(e.map((item: any) => item.delivery_note.delivery_note_items).flat());
                            } else {
                                setFormData({
                                    ...formData,
                                    delivery_note_ids: '',
                                    customer_id: '',
                                    contact_person_id: '',
                                    salesman_id: '',
                                    payment_terms: '',
                                    due_date: ''
                                });
                                setCustomer({});
                                setContactPerson({});
                                setSalesman({});
                                setDeliveryNoteItems([]);
                                setReceivableAmount(0);
                            }
                        }}
                        isMulti={true}
                    />
                    <div className="flex gap-3  items-center">
                        <h3 className="text-md">Receivable Amount: </h3>
                        <h3 className="text-lg font-bold">{receivableAmount.toFixed(2)}</h3>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-3">
                    <h4 className="text-xl font-semibold text-gray-600 py-3">Invoice Params</h4>
                    <Dropdown
                        divClasses="w-full"
                        label="Invoice Type"
                        name="invoice_type"
                        options={[
                            { value: 'credit', label: 'Credit Invoice' },
                            { value: 'cash', label: 'Cash Invoice' }
                        ]}
                        value={formData.invoice_type}
                        onChange={(e) => handleChange('invoice_type', e.value, true)}
                    />
                    <Input
                        divClasses="w-full"
                        label="PO # (optional)"
                        type="text"
                        name="po_number"
                        value={formData.payment_refernce}
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Enter Purchase Order number"
                        isMasked={false}
                    />

                    {formData.invoice_type === 'cash' && (
                        <Input
                            divClasses="w-full"
                            label="Discount"
                            type="number"
                            step="any"
                            name="discount_amount"
                            value={formData.discount_amount}
                            onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                            placeholder="Enter Discount Amount"
                            isMasked={false}
                        />
                    )}

                    {formData.invoice_type === 'credit' && (
                        <>
                            <Input
                                divClasses="w-full"
                                label="Internal Document # (optional)"
                                type="text"
                                name="internal_document_no"
                                value={formData.internal_document_no}
                                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                                placeholder="Enter Internal Document"
                                isMasked={false}
                            />
                            <div className="flex flex-col gap-3 justify-start items-start">
                                <span><strong>Payment Terms (Days):</strong> {formData.payment_terms}</span>
                                <span><strong>Due Date:</strong> {formData.due_date}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Tab.Group>
                <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                            >
                                Details
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                            >
                                Accounting
                            </button>
                        )}
                    </Tab>
                </Tab.List>
                <Tab.Panels className="panel rounded-none">
                    <Tab.Panel>
                        <div className="table-responsive mt-3 active">
                            <table>
                                <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Filling</th>
                                    <th>Capacity</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Before Tax</th>
                                    <th>Tax</th>
                                    <th>Discount</th>
                                    <th className="text-center">Grand Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {deliveryNoteItems.length > 0 ? (
                                    deliveryNoteItems.map((item: any, index: number) => (
                                        <tr key={index}>
                                            <td>{item.product_assembly.formula_name}</td>
                                            <td>{item.product.title}</td>
                                            <td>{item.capacity}</td>
                                            <td>{item.delivered_quantity}</td>
                                            <td>{item.retail_price}</td>
                                            <td>
                                                {(parseFloat(item.delivered_quantity) * parseFloat(item.retail_price)).toFixed(2)}
                                            </td>
                                            <td>
                                                {item.tax_category ? (
                                                    <div className="flex flex-col">
                                                        <span><strong>Tax: </strong>{item.tax_category.name} ({item.tax_rate}%)</span>
                                                        <span><strong>Amount: </strong>{item.tax_amount.toFixed(2)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span>N/A</span>
                                                )}
                                            </td>
                                            <td>
                                                {item.discount_type ? (
                                                    <div className="flex flex-col">
                                                        <span><strong>Type: </strong>{capitalize(item.discount_type)}
                                                        </span>
                                                        <span><strong>Rate: </strong>
                                                            {item.discount_amount_rate.toFixed(2)}{item.discount_type === 'percentage' ? '%' : ''}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span>N/A</span>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                {item.total_cost.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="text-center">No items found</td>
                                    </tr>
                                )}
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td colSpan={8} className="text-center font-bold">Total</td>
                                    <td className="text-center font-bold">{deliveryNoteItems.reduce((acc, item) => acc + item.total_cost, 0).toFixed(2)}</td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div>
                            <Option
                                divClasses="mb-5"
                                label="Use Previous Item Accounting"
                                type="checkbox"
                                name="use_previous_accounting"
                                value="1"
                                defaultChecked={formData.use_previous_accounting === 1}
                                onChange={(e) => {
                                    setFormData((prevFormData: any) => ({
                                        ...prevFormData,
                                        use_previous_accounting: e.target.checked ? 1 : 0
                                    }));
                                    dispatch(clearLatestRecord());
                                    if (e.target.checked) {
                                        dispatch(getLatestRecord('sale-invoice'));
                                    } else {
                                        dispatch(clearLatestRecord());
                                    }
                                }}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <h3 className="font-bold text-lg mb-5 border-b">Accounts</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label>Account Receivable</label>
                                            <TreeSelect
                                                showSearch
                                                style={{ width: '100%' }}
                                                value={latestRecord ? latestRecord.account_receivable?.code : formData.account_receivable_id}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="Please select Receivable Account"
                                                allowClear
                                                treeDefaultExpandAll
                                                onChange={(e) => {
                                                    setFormData((prevFormData: any) => ({
                                                        ...prevFormData,
                                                        account_receivable_id: e
                                                    }));
                                                }}
                                                treeData={accountOptions}
                                                // onPopupScroll={onPopupScroll}
                                                treeNodeFilterProp="title"
                                            />
                                        </div>

                                        <div>
                                            <label>Sale Income Account</label>
                                            <TreeSelect
                                                showSearch
                                                style={{ width: '100%' }}
                                                value={latestRecord ? latestRecord.sale_income_account?.code : formData.sale_income_account_id}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="Please select Sale Income Account"
                                                allowClear
                                                treeDefaultExpandAll
                                                onChange={(e) => {
                                                    setFormData((prevFormData: any) => ({
                                                        ...prevFormData,
                                                        sale_income_account_id: e
                                                    }));
                                                }}
                                                treeData={accountOptions}
                                                // onPopupScroll={onPopupScroll}
                                                treeNodeFilterProp="title"
                                            />
                                        </div>

                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-5 border-b">Tax Accounts</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label>VAT Output</label>
                                            <TreeSelect
                                                showSearch
                                                style={{ width: '100%' }}
                                                value={latestRecord ? latestRecord.vat_payable?.code : formData.vat_payable_id}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="Please select Output Account for VAT"
                                                allowClear
                                                treeDefaultExpandAll
                                                onChange={(e) => {
                                                    setFormData((prevFormData: any) => ({
                                                        ...prevFormData,
                                                        vat_payable_id: e
                                                    }));
                                                }}
                                                treeData={accountOptions}
                                                // onPopupScroll={onPopupScroll}
                                                treeNodeFilterProp="title"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
            <div className="flex justify-center items-center mt-5">
                <Button
                    type={ButtonType.submit}
                    text="Save"
                    variant={ButtonVariant.primary}
                />
            </div>
        </form>
    );
};

export default InvoiceForm;
