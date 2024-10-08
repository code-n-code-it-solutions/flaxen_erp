import React, { Fragment, useEffect, useState } from 'react';
import { Input } from '@/components/form/Input';
import { useAppDispatch, useAppSelector } from '@/store';
import { clearLatestRecord, generateCode, getLatestRecord } from '@/store/slices/utilSlice';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { Dropdown } from '@/components/form/Dropdown';
import Button from '@/components/Button';
import { ButtonType, ButtonVariant } from '@/utils/enums';
import { capitalize } from 'lodash';
import { getPendingGRNs } from '@/store/slices/goodReceiveNoteSlice';
import { getVendors } from '@/store/slices/vendorSlice';
import { storeVendorBill } from '@/store/slices/vendorBillSlice';
import { calculateDateFromDays } from '@/utils/helper';
import { Tab } from '@headlessui/react';
import { getAccountsTypes } from '@/store/slices/accountSlice';

const BillForm = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.user);
    const { code, latestRecord } = useAppSelector((state) => state.util);
    const { allGRNs } = useAppSelector((state) => state.goodReceiveNote);
    const { allVendors } = useAppSelector((state) => state.vendor);

    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [goodReceiveNoteOptions, setGoodReceiveNoteOptions] = useState<any[]>([]);
    const [vendorOptions, setVendorOptions] = useState<any[]>([]);
    const [vendor, setVendor] = useState<any>({});
    const [goodReceiveNoteItems, setGoodReceiveNoteItems] = useState<any[]>([]);

    const handleChange = (name: string, value: any, required: boolean) => {
        if (required) {
            if (value === '') {
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
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token);
        dispatch(storeVendorBill(formData));
    };

    const calculateTotal = (unitPrice: number, receivedQuantity: number, discountType: string | null, discountRate: number, taxRate: number) => {
        // Step 1: Calculate the initial total before discount
        let totalBeforeDiscount = unitPrice * receivedQuantity;

        // Step 2: Apply discount
        let discountAmount = 0;
        if (discountType === 'percentage') {
            discountAmount = (totalBeforeDiscount * discountRate) / 100;
        } else if (discountType === 'fixed') {
            discountAmount = discountRate;
        }

        const totalAfterDiscount = totalBeforeDiscount - discountAmount;

        // Step 3: Apply tax
        const taxAmount = (totalAfterDiscount * taxRate) / 100;
        const grandTotal = totalAfterDiscount + taxAmount;

        return {
            totalBeforeDiscount: totalBeforeDiscount.toFixed(2),
            discountAmount: discountAmount.toFixed(2),
            taxAmount: taxAmount.toFixed(2),
            grandTotal: grandTotal.toFixed(2)
        };
    };


    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(generateCode('vendor_bill'));
        dispatch(getVendors());
        setGoodReceiveNoteItems([]);
        setFormData({});
        setVendor({});
        dispatch(getAccountsTypes({}));
    }, []);

    useEffect(() => {
        if (code) {
            setFormData({
                ...formData,
                bill_number: code['vendor_bill']
            });
        }
    }, [code]);

    useEffect(() => {
        if (allGRNs) {
            setGoodReceiveNoteOptions(allGRNs.map((item: any) => ({
                value: item.id,
                label: item.grn_number,
                grn: item
            })));
        }
    }, [allGRNs]);

    useEffect(() => {
        if (allVendors) {
            setVendorOptions(allVendors.map((item: any) => ({
                value: item.id,
                label: item.name,
                vendor: item
            })));
        }
    }, [allVendors]);

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <Input
                divClasses="w-full md:w-1/2"
                className="text-xl font-light py-3"
                label="Bill Number"
                type="text"
                name="bill_number"
                value={formData.bill_number}
                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                isMasked={false}
                disabled={true}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="w-full flex flex-col gap-3">
                    <h4 className="text-xl font-semibold text-gray-600 py-3">Bill Details</h4>
                    <Dropdown
                        divClasses="w-full"
                        label="Vendor"
                        name="vendor_id"
                        options={vendorOptions}
                        value={formData.vendor_id}
                        onChange={(e) => {
                            if (e && typeof e !== 'undefined') {
                                dispatch(getPendingGRNs(e.value));
                                setVendor(e.vendor);
                                setFormData({
                                    ...formData,
                                    vendor_id: e.value
                                });
                            } else {
                                setFormData({
                                    ...formData,
                                    vendor_id: ''
                                });
                                setVendor({});
                            }
                        }}
                    />
                    <Dropdown
                        divClasses="w-full"
                        label="Good Receive Notes"
                        name="good_receive_note_ids"
                        options={goodReceiveNoteOptions}
                        value={formData.good_receive_note_ids}
                        onChange={(e) => {
                            if (e && typeof e !== 'undefined' && e.length > 0) {
                                setFormData({
                                    ...formData,
                                    good_receive_note_ids: e.map((item: any) => item.value).join(',')
                                });
                                setGoodReceiveNoteItems(e.map((item: any) => item.grn.raw_products).flat());
                            } else {
                                setFormData({
                                    ...formData,
                                    good_receive_note_ids: ''
                                });
                                setGoodReceiveNoteItems([]);
                            }
                        }}
                        isMulti={true}
                    />
                    {Object.keys(vendor).length > 0 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <span className="font-semibold text-gray-600">Vendor Name: </span>
                                <span>{vendor.name}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <span className="font-semibold text-gray-600">Email: </span>
                                <span>{vendor.email}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <span className="font-semibold text-gray-600">Phone: </span>
                                <span>{vendor.phone}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <span className="font-semibold text-gray-600">Address: </span>
                                <span>
                                    {vendor.address}, {vendor.city?.name}, {vendor.state?.name}, {vendor.country?.name}, {vendor.postal_code}
                                </span>
                            </div>
                        </>
                    )}
                </div>
                <div className="w-full flex flex-col gap-3">
                    <h4 className="text-xl font-semibold text-gray-600 py-3">Bill Params</h4>
                    <Dropdown
                        divClasses="w-full"
                        label="Bill Type"
                        name="bill_type"
                        options={[
                            { value: 'credit', label: 'Credit Bill' },
                            { value: 'cash', label: 'Cash Bill' }

                        ]}
                        value={formData.bill_type}
                        onChange={(e) => {
                            if (e && typeof e !== 'undefined') {
                                setFormData({
                                    ...formData,
                                    bill_type: e.value
                                });
                            } else {
                                setFormData({
                                    ...formData,
                                    bill_type: ''
                                });
                            }
                        }}
                    />
                    <Input
                        divClasses="w-full"
                        label="Bill Date"
                        type="date"
                        name="bill_date"
                        value={formData.bill_date}
                        onChange={(e) => handleChange('bill_date', e[0] ? e[0].toLocaleDateString() : '', true)}
                        placeholder="Enter Bill Date"
                        isMasked={false}
                    />
                    <Input
                        divClasses="w-full"
                        label="Bill Reference (optional)"
                        type="text"
                        name="bill_reference"
                        value={formData.bill_reference}
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Enter Bill Reference"
                        isMasked={false}
                    />
                    {formData.bill_type === 'credit' && (
                        <div className="flex flex-col gap-3 justify-start items-start">
                            <div>
                                <span className="font-bold">Payment Terms (Days):</span>
                                {vendor?.due_in_days}
                            </div>
                            <div>
                                <span className="font-bold">Due Date:</span>
                                <>{calculateDateFromDays(vendor?.due_in_days, formData.bill_date)}</>
                            </div>
                        </div>
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
                </Tab.List>
                <Tab.Panels className="panel rounded-none">
                    <Tab.Panel>
                        <div className="active">
                            <div className="table-responsive mt-3">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>GRN</th>
                                        <th>Product</th>
                                        <th className="text-center">Quantity</th>
                                        <th className="text-center">Unit Price</th>
                                        <th className="text-center">Before Tax</th>
                                        <th>Tax</th>
                                        <th>Discount</th>
                                        <th className="text-center">Grand Total</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {goodReceiveNoteItems.length > 0
                                        ? goodReceiveNoteItems.map((item: any, index: number) => {
                                            const {
                                                totalBeforeDiscount,
                                                discountAmount,
                                                taxAmount,
                                                grandTotal
                                            } = calculateTotal(
                                                item.unit_price,
                                                item.received_quantity,
                                                item.discount_type,
                                                item.discount_amount_rate,
                                                item.tax_rate
                                            );

                                            return (
                                                <tr key={index}>
                                                    <td>{allGRNs?.find((grn: any) => grn.id === item.good_receive_note_id)?.grn_number}</td>
                                                    <td>{item.raw_product?.item_code}</td>
                                                    <td className="text-center">{item.received_quantity}</td>
                                                    <td className="text-center">{item.unit_price}</td>
                                                    <td className="text-center">{totalBeforeDiscount}</td>
                                                    <td>
                                                        {item.tax_category ? (
                                                            <div className="flex flex-col">
                                                                <span>
                                                                    <strong>Tax: </strong>{item.tax_category.name} ({item.tax_rate}%)
                                                                </span>
                                                                <span>
                                                                    <strong>Amount: </strong>{taxAmount}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span>N/A</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {item.discount_type ? (
                                                            <div className="flex flex-col">
                                                                <span>
                                                                    <strong>Type: </strong>{capitalize(item.discount_type)}
                                                                </span>
                                                                <span>
                                                                    <strong>Rate: </strong>{discountAmount}{item.discount_type === 'percentage' ? '%' : ''}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span>N/A</span>
                                                        )}
                                                    </td>
                                                    <td className="text-center">{grandTotal}</td>
                                                </tr>
                                            );
                                        })
                                        : (
                                            <tr>
                                                <td colSpan={8} className="text-center">No items found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                    <tfoot>
                                    <tr>
                                        <td colSpan={4} className="text-center font-bold">Total</td>
                                        <td className="text-center font-bold">
                                            {goodReceiveNoteItems.reduce((acc, item) => {
                                                const { totalBeforeDiscount } = calculateTotal(
                                                    item.unit_price,
                                                    item.received_quantity,
                                                    item.discount_type,
                                                    item.discount_amount_rate,
                                                    item.tax_rate
                                                );
                                                return acc + parseFloat(totalBeforeDiscount);
                                            }, 0).toFixed(2)}
                                        </td>
                                        <td colSpan={2}></td>
                                        <td className="text-center font-bold">
                                            {goodReceiveNoteItems.reduce((acc, item) => {
                                                const { grandTotal } = calculateTotal(
                                                    item.unit_price,
                                                    item.received_quantity,
                                                    item.discount_type,
                                                    item.discount_amount_rate,
                                                    item.tax_rate
                                                );
                                                return acc + parseFloat(grandTotal);
                                            }, 0).toFixed(2)}
                                        </td>
                                    </tr>
                                    </tfoot>
                                </table>
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

export default BillForm;
