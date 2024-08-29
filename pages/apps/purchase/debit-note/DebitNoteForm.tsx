import React, { Fragment, useEffect, useState } from 'react';
import { Input } from '@/components/form/Input';
import { useAppDispatch, useAppSelector } from '@/store';
import { generateCode } from '@/store/slices/utilSlice';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { Dropdown } from '@/components/form/Dropdown';
import Button from '@/components/Button';
import { ButtonSize, ButtonType, ButtonVariant } from '@/utils/enums';
import { capitalize } from 'lodash';
import { calculateDateFromDays } from '@/utils/helper';
import { Tab } from '@headlessui/react';
import { clearEmployeeState, getEmployees } from '@/store/slices/employeeSlice';
import Modal from '@/components/Modal';
import { storeDebitNote } from '@/store/slices/debitNoteSlice';
import Textarea from '@/components/form/Textarea';
import {
    clearVendorBillListState,
    clearVendorBillState,
    getVendorBillsForDebitNoteByVendor
} from '@/store/slices/vendorBillSlice';
import { clearVendorState, getVendors } from '@/store/slices/vendorSlice';
import Swal from 'sweetalert2';

const DebitNoteForm = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);
    const { code } = useAppSelector((state) => state.util);
    const { vendorBills, loading } = useAppSelector((state) => state.vendorBill);
    const { employees } = useAppSelector((state) => state.employee);
    const { allVendors } = useAppSelector((state) => state.vendor);

    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [vendorOptions, setVendorOptions] = useState<any[]>([]);
    const [billOptions, setBillOptions] = useState<any[]>([]);
    const [returnByOptions, setReturnByOptions] = useState<any[]>([]);
    const [itemsForSelect, setItemsForSelect] = useState<any[]>([]);
    const [debitNoteItems, setDebitNoteItems] = useState<any[]>([]);
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

        if (name === 'vendor_id' && value !== '') {
            dispatch(getVendorBillsForDebitNoteByVendor(value));
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token);
        let finalData = {
            ...formData,
            debit_note_items: debitNoteItems.map((item: any) => {
                return {
                    purchase_requisition_id: item.purchase_requisition_id,
                    local_purchase_order_id: item.local_purchase_order_id,
                    good_receive_note_id: item.good_receive_note_id,
                    vendor_bill_id: item.vendor_bill_id,
                    raw_product_id: item.raw_product_id,
                    unit_id: item.unit_id,
                    quantity: item.quantity,
                    returned_quantity: item.return_quantity,
                    unit_price: item.unit_price,
                    tax_category_id: item.tax_category_id,
                    tax_rate: item.tax_rate,
                    tax_amount: (item.return_quantity * item.unit_price * item.tax_rate) / 100,
                    discount_type: item.discount_type,
                    discount_amount_rate: item.discount_amount_rate,
                    total_cost: calculateTotal(item)
                };
            })
        };
        console.log(finalData);
        // dispatch(storeDebitNote(finalData));
    };

    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(generateCode('debit_note'));
        dispatch(clearVendorState());
        dispatch(clearVendorBillState());
        dispatch(clearVendorBillListState());
        dispatch(clearEmployeeState());

        dispatch(getEmployees());
        dispatch(getVendors());
        setFormData({
            debit_note_date: calculateDateFromDays(0)
        });
        setItemsForSelect([]);
        setDebitNoteItems([]);
    }, []);

    useEffect(() => {
        if (code) {
            setFormData({ ...formData, debit_note_code: code['debit_note'] });
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
        if (allVendors) {
            setVendorOptions(allVendors.map((vendor: any) => ({
                label: vendor.name + ' (' + vendor.vendor_number + ')',
                value: vendor.id,
                vendor
            })));
        }
    }, [allVendors]);

    useEffect(() => {
        if (vendorBills) {
            setBillOptions(vendorBills.map((item: any) => ({
                value: item.id,
                label: item.bill_number,
                vendorBill: item
            })));
        }
    }, [vendorBills]);

    useEffect(() => {
        if (debitNoteItems.length > 0) {
            recalculateReceivableAmount(debitNoteItems, parseFloat(formData.discount_amount || 0));
        }
    }, [debitNoteItems]);

    const recalculateReceivableAmount = (items: any[], discount: number) => {
        const totalCost = items.reduce((acc: number, item: any) => acc + parseFloat(item.total_cost), 0);
        setTotalAmountToReturn(totalCost - discount);
    };

    const handleAddItem = (item: any) => {
        setDebitNoteItems([...debitNoteItems, { ...item }]);
        setItemsForSelect(itemsForSelect.filter((selectItem: any) => selectItem.id !== item.id));
        // setSelectModalOpen(false);
    };

    const handleRemoveItem = (item: any) => {
        setItemsForSelect([...itemsForSelect, item]);
        setDebitNoteItems(debitNoteItems.filter((debitNoteItem: any) => debitNoteItem.id !== item.id));
    };

    const handleReturnQuantityChange = (itemId: any, value: number) => {
        const selectedItem = itemsForSelect.find((item: any) => item.id === itemId);

        if (selectedItem && value > selectedItem.quantity) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Quantity',
                text: 'Returned quantity cannot be more than the available quantity!',
                confirmButtonText: 'Okay'
            });

            // Set the return quantity to 0 or reset it to the previous valid value
            setItemsForSelect(itemsForSelect.map((item: any) => {
                if (item.id === itemId) {
                    return { ...item, return_quantity: 0 };
                }
                return item;
            }));
        } else {
            setItemsForSelect(itemsForSelect.map((item: any) => {
                if (item.id === itemId) {
                    return { ...item, return_quantity: value };
                }
                return item;
            }));
        }
    };

    const calculateTotal = (item: any) => {
        const returnQuantity = parseFloat(item.return_quantity);
        const retailPrice = parseFloat(item.unit_price);
        const taxAmount = (returnQuantity * retailPrice * parseFloat(item.tax_rate)) / 100;
        const discountAmount = item.discount_type
            ? item.discount_type === 'percentage'
                ? (returnQuantity * retailPrice * parseFloat(item.discount_amount_rate)) / 100
                : parseFloat(item.discount_amount_rate)
            : 0;
        return returnQuantity * retailPrice + taxAmount - discountAmount;
    };

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <Input
                divClasses="w-full md:w-1/2"
                className="text-xl font-light py-3"
                label="Debit Note Code"
                type="text"
                name="debit_note_code"
                value={formData.debit_note_code}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                isMasked={false}
                disabled={true}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-3">
                <Dropdown
                    divClasses="w-full"
                    label="Vendor"
                    name="vendor_id"
                    options={vendorOptions}
                    value={formData.vendor_id}
                    onChange={(e) => {
                        if (e && typeof e !== 'undefined') {
                            handleChange('vendor_id', e.value, true);
                            // dispatch(getVendorBillsForDebitNoteByVendor(e.value));
                        } else {
                            handleChange('vendor_id', '', true);
                        }
                    }}
                />

                <div className="flex justify-between items-end gap-1">
                    <Dropdown
                        divClasses="w-full"
                        label="Vendor Bill"
                        name="vendor_bill_ids"
                        options={billOptions}
                        value={formData.vendor_bill_ids}
                        onChange={(e) => {
                            if (e && e.length > 0 && typeof e !== 'undefined') {
                                handleChange('vendor_bill_ids', e.map((item: any) => item.value).join(','), true);
                                setItemsForSelect(e.map((item: any) => item.vendorBill.items).flat());
                            } else {
                                handleChange('vendor_bill_ids', '', true);
                                setItemsForSelect([]);
                            }
                        }}
                        isDisabled={loading}
                        isLoading={loading}
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
                        { label: 'Debit', value: 'debit' }
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
                    name="debit_note_date"
                    value={formData.debit_note_date}
                    onChange={(e) => handleChange('debit_note_date', e[0] ? e[0].toLocaleDateString() : '', true)}
                    placeholder="Enter Debit Note Date"
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
                                    <th>Vendor Bill</th>
                                    <th>Product</th>
                                    <th>Unit</th>
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
                                {debitNoteItems.length > 0 ? (
                                    debitNoteItems.map((item: any, index: number) => {
                                        const vendorBill = billOptions.find((bill: any) => bill.value === item.vendor_bill_id);
                                        return (
                                            <tr key={index}>
                                                <td>{vendorBill.vendorBill?.bill_number}</td>
                                                <td>{item.raw_product.title}</td>
                                                <td>{item.unit?.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.return_quantity}</td>
                                                <td>{item.unit_price}</td>
                                                <td>
                                                    {(parseFloat(item.return_quantity) * parseFloat(item.unit_price)).toFixed(2)}
                                                </td>
                                                <td>
                                                    {item.tax_category ? (
                                                        <div className="flex flex-col">
                                                            <span><strong>Tax: </strong>{item.tax_category.name} ({item.tax_rate}%)</span>
                                                            <span><strong>Amount: </strong>{((item.return_quantity * item.unit_price * item.tax_rate) / 100).toFixed(2)}
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
                                        );
                                    })
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
                            <th>Vendor Bill</th>
                            <th>Product</th>
                            <th>Unit</th>
                            <th>Quantity</th>
                            <th>Returned Quantity</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {itemsForSelect.length > 0
                            ? itemsForSelect.map((item: any, index: number) => {
                                const vendorBill = billOptions.find((bill: any) => bill.value === item.vendor_bill_id);
                                return (
                                    <tr key={index}>
                                        <td>{vendorBill?.vendorBill?.bill_number}</td>
                                        <td>{item.raw_product?.title}</td>
                                        <td>{item.unit?.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>
                                            <Input
                                                type="number"
                                                name="return_quantity"
                                                value={item.return_quantity}
                                                onChange={(e) => handleReturnQuantityChange(item.id, parseFloat(e.target.value))}
                                                max={item.quantity}
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
                                );
                            }) : (
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
