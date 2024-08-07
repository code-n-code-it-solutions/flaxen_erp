import React, { Fragment, useEffect, useState } from 'react';
import { Input } from '@/components/form/Input';
import { useAppDispatch, useAppSelector } from '@/store';
import { generateCode } from '@/store/slices/utilSlice';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { Dropdown } from '@/components/form/Dropdown';
import { pendingDeliveryNotes } from '@/store/slices/deliveryNoteSlice';
import Button from '@/components/Button';
import { ButtonSize, ButtonType, ButtonVariant } from '@/utils/enums';
import { capitalize } from 'lodash';
import { getSaleInvoicesByCustomer, storeSaleInvoice } from '@/store/slices/saleInvoiceSlice';
import { calculateDateFromDays } from '@/utils/helper';
import { Tab } from '@headlessui/react';
import { getAccountsTypes } from '@/store/slices/accountSlice';
import { getEmployees } from '@/store/slices/employeeSlice';
import Modal from '@/components/Modal';

const DebitNoteForm = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);
    const { code } = useAppSelector((state) => state.util);
    const { saleInvoices } = useAppSelector((state) => state.saleInvoice);
    const { employees } = useAppSelector((state) => state.employee);

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

        if (name === 'customer_id' && value !== '') {
            dispatch(getSaleInvoicesByCustomer(value));
        }

        if (name === 'sale_invoice_ids') {

        }
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token);
        dispatch(storeSaleInvoice(formData));
    };

    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(generateCode('credit_note'));
        dispatch(getEmployees());
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
        if (saleInvoices) {
            setInvoiceOptions(saleInvoices.map((item: any) => ({
                value: item.id,
                label: item.sale_invoice_code,
                saleInvoice: item
            })));
        }
    }, [saleInvoices]);

    useEffect(() => {
        if (creditNoteItems.length > 0) {
            recalculateReceivableAmount(creditNoteItems, parseFloat(formData.discount_amount || 0));
        }
    }, [creditNoteItems]);

    const recalculateReceivableAmount = (items: any[], discount: number) => {
        const totalCost = items.reduce((acc: number, item: any) => acc + parseFloat(item.total_cost), 0);
        setTotalAmountToReturn(totalCost - discount);
    };

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="w-full flex flex-col gap-3">
                    <h4 className="text-xl font-semibold text-gray-600 py-3">Credit Note Details</h4>
                    <Dropdown
                        divClasses="w-full"
                        label="Customer"
                        name="customer_id"
                        options={customerOptions}
                        value={formData.customer_id}
                        onChange={(e) => {
                            if (e && typeof e !== 'undefined') {
                                handleChange('customer_id', e.value, true);
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
                            onChange={(e) => {
                                if (e && e.length > 0 && typeof e !== 'undefined') {
                                    handleChange('sale_invoice_ids', e.map((item: any) => item.value).join(','), true);
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
                </div>
                <div className="w-full flex flex-col gap-3">
                    <h4 className="text-xl font-semibold text-gray-600 py-3">Credit Note Params</h4>
                    <Dropdown
                        divClasses="w-full"
                        label="Return Type"
                        name="return_type"
                        options={[
                            { value: 'credit', label: 'Credit Invoice' },
                            { value: 'cash', label: 'Cash Invoice' }
                        ]}
                        value={formData.invoice_type}
                        onChange={(e) => handleChange('return_type', e.value, true)}
                    />

                    {formData.return_type === 'credit' ? (
                        <div className="flex flex-col gap-3 justify-start items-start">
                            <span><strong>Payment Terms (Days):</strong> {formData.payment_terms}</span>
                            <span><strong>Due Date:</strong> {formData.due_date}</span>
                        </div>
                    ) : formData.return_type === 'cash' ? (
                        <div className="flex flex-col gap-3 justify-start items-start">
                            <Input
                                divClasses="w-full"
                                label="Returning Amount"
                                type="number"
                                name="returning_amount"
                                value={formData.returning_amount}
                                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                                isMasked={false}
                                required={true}
                            />
                        </div>
                    ) : <></>}
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
                                {/*<tfoot>*/}
                                {/*<tr>*/}
                                {/*    <td colSpan={8} className="text-center font-bold">Total</td>*/}
                                {/*    <td className="text-center font-bold">{creditNoteItems.reduce((acc, item) => acc + item.total_cost, 0).toFixed(2)}</td>*/}
                                {/*</tr>*/}
                                {/*</tfoot>*/}
                            </table>
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
                                <></>
                            ))
                            : (
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

export default DebitNoteForm;
