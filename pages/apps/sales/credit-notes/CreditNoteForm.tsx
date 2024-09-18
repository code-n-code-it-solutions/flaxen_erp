import React, { Fragment, useEffect, useState } from 'react';
import { Input } from '@/components/form/Input';
import { useAppDispatch, useAppSelector } from '@/store';
import { generateCode } from '@/store/slices/utilSlice';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { Dropdown } from '@/components/form/Dropdown';
import Button from '@/components/Button';
import { ButtonSize, ButtonType, ButtonVariant } from '@/utils/enums';
import { capitalize } from 'lodash';
import {
    clearSaleInvoiceListState,
    clearSaleInvoiceState,
    getSaleInvoicesForCreditNoteByCustomer
} from '@/store/slices/saleInvoiceSlice';
import { calculateDateFromDays } from '@/utils/helper';
import { Tab } from '@headlessui/react';
import { clearEmployeeState, getEmployees } from '@/store/slices/employeeSlice';
import Modal from '@/components/Modal';
import { clearCustomerState, getCustomers } from '@/store/slices/customerSlice';
import { storeCreditNote } from '@/store/slices/creditNoteSlice';
import Textarea from '@/components/form/Textarea';

const CreditNoteForm = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);
    const { code } = useAppSelector((state) => state.util);
    const { loading } = useAppSelector((state) => state.creditNote);
    const { saleInvoices, loading: invoiceLoading } = useAppSelector((state) => state.saleInvoice);
    const { employees } = useAppSelector((state) => state.employee);
    const { customers } = useAppSelector((state) => state.customer);

    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [customerOptions, setCustomerOptions] = useState<any[]>([]);
    const [invoiceOptions, setInvoiceOptions] = useState<any[]>([]);
    const [returnByOptions, setReturnByOptions] = useState<any[]>([]);
    const [itemsForSelect, setItemsForSelect] = useState<any[]>([]);
    const [creditNoteItems, setCreditNoteItems] = useState<any[]>([]);
    const [totalAmountToReturn, setTotalAmountToReturn] = useState<number>(0);
    const [selectModalOpen, setSelectModalOpen] = useState<boolean>(false);

    const handleChange = (name: string, value: any, required: boolean) => {
        if (required && value === '') {
            setErrors({
                ...errors,
                [name]: 'This field is required'
            });
        } else {
            setErrors((err: any) => {
                delete err[name];
                return err;
            });
        }

        // if (name === 'customer_id' && value !== '') {
        //     dispatch(getSaleInvoicesForCreditNoteByCustomer(value));
        // }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token);
        let finalData = {
            ...formData,
            credit_note_items: creditNoteItems.map((item: any) => {
                return {
                    product_assembly_id: item.product_assembly_id,
                    filling_id: item.filling_id,
                    quotation_id: item.quotation_id,
                    delivery_note_id: item.delivery_note_id,
                    sale_invoice_id: item.sale_invoice_id,
                    raw_product_id: item.raw_product_id,
                    quantity: item.quantity,
                    returned_quantity: item.return_quantity,
                    batch_number: item.batch_number,
                    capacity: item.capacity,
                    retail_price: item.retail_price,
                    tax_category_id: item.tax_category_id,
                    tax_rate: item.tax_rate,
                    tax_amount: (item.return_quantity * item.retail_price * item.tax_rate) / 100,
                    discount_type: item.discount_type,
                    discount_amount_rate: item.discount_amount_rate,
                    total_cost: calculateTotal(item)
                };
            })
        };
        // console.log(finalData);
        dispatch(storeCreditNote(finalData));
    };

    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(generateCode('credit_note'));
        dispatch(clearCustomerState());
        dispatch(clearSaleInvoiceState());
        dispatch(clearEmployeeState());
        dispatch(clearSaleInvoiceListState());

        dispatch(getEmployees());
        dispatch(getCustomers());
        setFormData({
            credit_note_date: calculateDateFromDays(0)
        });
        setItemsForSelect([]);
        setCreditNoteItems([]);
    }, []);

    useEffect(() => {
        if (code) {
            setFormData({ ...formData, credit_note_code: code['credit_note'] });
        }
    }, [code]);

    useEffect(() => {
        if (employees) {
            setReturnByOptions(employees.map((employee: any) => ({
                label: employee.name + ' - ' + employee.employee?.employee_code,
                value: employee.id
            })));
        }
    }, [employees]);

    useEffect(() => {
        if (customers) {
            setCustomerOptions(customers.map((customer: any) => ({
                label: customer.name + ' (' + customer.customer_code + ')',
                value: customer.id,
                customer
            })));
        }
    }, [customers]);

    // useEffect(() => {
    //     if (saleInvoices) {
    //         setInvoiceOptions(saleInvoices.map((item: any) => ({
    //             value: item.id,
    //             label: item.sale_invoice_code,
    //             saleInvoice: item
    //         })));
    //     }
    // }, [saleInvoices]);

    useEffect(() => {
        if (creditNoteItems.length > 0) {
            recalculateReceivableAmount(creditNoteItems, parseFloat(formData.discount_amount || 0));
        }
    }, [creditNoteItems]);

    const recalculateReceivableAmount = (items: any[], discount: number) => {
        const totalCost = items.reduce((acc: number, item: any) => acc + parseFloat(item.total_cost), 0);
        setTotalAmountToReturn(totalCost - discount);
    };

    const handleAddItem = (item: any) => {
        setCreditNoteItems([...creditNoteItems, { ...item }]);
        setItemsForSelect(itemsForSelect.filter((selectItem: any) => selectItem.id !== item.id));
        // setSelectModalOpen(false);
    };

    const handleRemoveItem = (item: any) => {
        setItemsForSelect([...itemsForSelect, item]);
        setCreditNoteItems(creditNoteItems.filter((creditNoteItem: any) => creditNoteItem.id !== item.id));
    };

    const handleReturnQuantityChange = (itemId: any, value: number) => {
        setItemsForSelect(itemsForSelect.map((item: any) => {
            if (item.id === itemId) {
                return { ...item, return_quantity: value };
            }
            return item;
        }));
    };

    const calculateTotal = (item: any) => {
        const returnQuantity = parseFloat(item.return_quantity);
        const retailPrice = parseFloat(item.retail_price);
        const taxAmount = (returnQuantity * retailPrice * parseFloat(item.tax_rate)) / 100;
        const discountAmount = item.discount_type
            ? item.discount_type === 'percentage'
                ? (returnQuantity * retailPrice * parseFloat(item.discount_amount_rate)) / 100
                : parseFloat(item.discount_amount_rate)
            : 0;
        return returnQuantity * retailPrice + taxAmount - discountAmount;
    };

    useEffect(() => {
        if (formData.credit_note_for) {
            if (saleInvoices) {
                setInvoiceOptions(
                    saleInvoices
                        .filter((item: any) => item.invoice_for === formData.credit_note_for)
                        .map((item: any) => ({
                            value: item.id,
                            label: item.sale_invoice_code,
                            saleInvoice: item
                        }))
                );
            } else {
                setInvoiceOptions([]);
            }
        } else {
            setInvoiceOptions([]);
        }
    }, [formData.credit_note_for, saleInvoices]);

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <Input
                divClasses="w-full md:w-1/2"
                className="text-xl font-light py-3"
                label="Credit Note Code"
                type="text"
                name="credit_note_code"
                value={formData.credit_note_code}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                isMasked={false}
                disabled={true}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-3">
                <Dropdown
                    divClasses="w-full"
                    label="Credit Note For"
                    name="credit_note_for"
                    options={[
                        { label: 'Finish Goods', value: 1 },
                        { label: 'Raw Material', value: 2 }
                    ]}
                    value={formData.credit_note_for}
                    onChange={(e) => {
                        if (e && typeof e !== 'undefined') {
                            handleChange('credit_note_for', e.value, true);
                            // dispatch(clearSaleInvoiceListState());
                            // dispatch(getSaleInvoicesForCreditNoteByCustomer(e.value));
                        } else {
                            handleChange('credit_note_for', '', true);
                        }
                    }}
                />
                <Dropdown
                    divClasses="w-full"
                    label="Customer"
                    name="customer_id"
                    options={customerOptions}
                    value={formData.customer_id}
                    onChange={(e) => {
                        if (e && typeof e !== 'undefined') {
                            handleChange('customer_id', e.value, true);
                            dispatch(clearSaleInvoiceListState());
                            dispatch(getSaleInvoicesForCreditNoteByCustomer(e.value));
                        } else {
                            handleChange('customer_id', '', true);
                        }
                    }}
                />
                <div className="flex justify-between items-end gap-1">
                    <Dropdown
                        divClasses="w-full"
                        label="Invoices"
                        name="sale_invoice_ids"
                        options={invoiceOptions}
                        value={formData.sale_invoice_ids}
                        isLoading={invoiceLoading}
                        isDisabled={invoiceLoading}
                        onChange={(e) => {
                            if (e && e.length > 0 && typeof e !== 'undefined') {
                                handleChange('sale_invoice_ids', e.map((item: any) => item.value).join(','), true);
                                let itemList = e.map((invoice: any) => {
                                    return invoice.saleInvoice.delivery_note_sale_invoices.map((saleInvoice: any) => {
                                        return saleInvoice.delivery_note.delivery_note_items.map((item: any) => {
                                            return {
                                                ...item,
                                                sale_invoice_id: saleInvoice.sale_invoice_id,
                                                sale_invoice_code: invoice.label,
                                                return_quantity: 0
                                            };
                                        }).flat();
                                    }).flat();
                                }).flat();
                                setItemsForSelect(itemList);
                            } else {
                                handleChange('sale_invoice_ids', '', true);
                            }
                        }}
                        isMulti={true}
                    />
                    <Button
                        type={ButtonType.button}
                        text="Items"
                        variant={ButtonVariant.primary}
                        onClick={() => setSelectModalOpen(true)}
                    />
                </div>

                <Dropdown
                    divClasses="w-full"
                    label="Return By"
                    name="return_by_id"
                    options={returnByOptions}
                    value={formData.return_by_id}
                    onChange={(e) => {
                        if (e && typeof e !== 'undefined') {
                            handleChange('return_by_id', e.value, true);
                        } else {
                            handleChange('return_by_id', '', true);
                        }
                    }}
                />

                <Dropdown
                    divClasses="w-full"
                    label="Return Type"
                    name="return_type"
                    options={[
                        { label: 'Cash', value: 'cash' },
                        { label: 'Credit', value: 'credit' }
                    ]}
                    value={formData.return_type}
                    onChange={(e) => {
                        if (e && typeof e !== 'undefined') {
                            handleChange('return_type', e.value, true);
                        } else {
                            handleChange('return_type', '', true);
                        }
                    }}
                />

                <Input
                    divClasses="w-full"
                    label="Return Date"
                    type="date"
                    name="credit_note_date"
                    value={formData.credit_note_date}
                    onChange={(e) => handleChange('credit_note_date', e[0] ? e[0].toLocaleDateString() : '', true)}
                    placeholder="Enter Credit Note Date"
                    isMasked={false}
                />

                <Textarea
                    divClasses="w-full col-span-2"
                    label="Narration"
                    name="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value, true)}
                    isReactQuill={false}
                />
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
                </Tab.List>
                <Tab.Panels className="rounded-none">
                    <Tab.Panel>
                        <div className="table-responsive mt-3 active">
                            <table>
                                <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Filling</th>
                                    <th>Capacity</th>
                                    <th>Quantity</th>
                                    <th>Return Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Before Tax</th>
                                    <th>Tax</th>
                                    <th>Discount</th>
                                    <th className="text-center">Grand Total</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {creditNoteItems.length > 0 ? (
                                    creditNoteItems.map((item: any, index: number) => (
                                        <tr key={index}>
                                            <td>{item.product_assembly.formula_name}</td>
                                            <td>{item.product.title}</td>
                                            <td>{item.capacity}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.return_quantity}</td>
                                            <td>{item.retail_price}</td>
                                            <td>
                                                {(parseFloat(item.return_quantity) * parseFloat(item.retail_price)).toFixed(2)}
                                            </td>
                                            <td>
                                                {item.tax_category ? (
                                                    <div className="flex flex-col">
                                                        <span><strong>Tax: </strong>{item.tax_category.name} ({item.tax_rate}%)</span>
                                                        <span><strong>Amount: </strong>{((item.return_quantity * item.retail_price * item.tax_rate) / 100).toFixed(2)}
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
                                                {
                                                    calculateTotal(item).toFixed(2)
                                                }
                                            </td>
                                            <td className="text-center">
                                                <Button
                                                    type={ButtonType.button}
                                                    text="Remove"
                                                    variant={ButtonVariant.danger}
                                                    size={ButtonSize.small}
                                                    onClick={() => handleRemoveItem(item)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={11} className="text-center">No items found</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
            <div className="flex justify-center items-center mt-5">
                <Button
                    type={ButtonType.submit}
                    text={loading ? 'Loading...' : 'Save'}
                    disabled={loading}
                    variant={ButtonVariant.primary}
                />
            </div>

            <Modal
                title="Returning Items"
                show={selectModalOpen}
                setShow={setSelectModalOpen}
                size={'xl'}
            >
                <div className="table-responsive">
                    <table>
                        <thead>
                        <tr>
                            <th>Sale Invoice Code</th>
                            <th>Product</th>
                            <th>Filling Item</th>
                            <th>Quantity</th>
                            <th>Returned Quantity</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {itemsForSelect.length > 0
                            ? itemsForSelect.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td>{item.sale_invoice_code}</td>
                                    <td>{item.product_assembly.formula_name}</td>
                                    <td>{item.product.title}</td>
                                    <td>{item.remaining_quantity}</td>
                                    <td>
                                        <Input
                                            type="number"
                                            name="return_quantity"
                                            value={item.return_quantity}
                                            onChange={(e) => handleReturnQuantityChange(item.id, parseFloat(e.target.value))}
                                            max={item.remaining_quantity}
                                            isMasked={false}
                                        />
                                    </td>
                                    <td>
                                        <Button
                                            type={ButtonType.button}
                                            text="Add"
                                            variant={ButtonVariant.primary}
                                            size={ButtonSize.small}
                                            onClick={() => handleAddItem(item)}
                                        />
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="text-center">No invoice selected</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Modal>
        </form>
    );
};

export default CreditNoteForm;
