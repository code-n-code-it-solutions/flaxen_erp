import React, { Fragment, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import Alert from '@/components/Alert';
import { Dropdown } from '@/components/form/Dropdown';
import { Input } from '@/components/form/Input';
import Button from '@/components/Button';
import { ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType } from '@/utils/enums';
import Textarea from '@/components/form/Textarea';
import { getCustomers } from '@/store/slices/customerSlice';
import { pendingQuotations } from '@/store/slices/quotationSlice';
import { clearLatestRecord, generateCode, getLatestRecord } from '@/store/slices/utilSlice';
import { clearFillingState, getFinishedGoodStock } from '@/store/slices/fillingSlice';
import { getIcon } from '@/utils/helper';
import IconButton from '@/components/IconButton';
import FinishedGoodModal from '@/components/modals/FinishedGoodModal';
import { getProductAssemblies } from '@/store/slices/productAssemblySlice';
import { storeDeliveryNote } from '@/store/slices/deliveryNoteSlice';
import { getEmployees } from '@/store/slices/employeeSlice';
import Option from '@/components/form/Option';
import Modal from '@/components/Modal';
import { Tab } from '@headlessui/react';
import dynamic from 'next/dynamic';
import useTransformToSelectOptions from '@/hooks/useTransformToSelectOptions';
import { getAccountsTypes } from '@/store/slices/accountSlice';
import Swal from 'sweetalert2';
const TreeSelect = dynamic(() => import('antd/es/tree-select'), { ssr: false });

const DeliveryNoteForm = () => {
    const dispatch = useAppDispatch();
    const accountOptions = useTransformToSelectOptions(useAppSelector(state => state.account).accountTypes);
    const { token } = useAppSelector((state) => state.user);
    const { quotations } = useAppSelector((state) => state.quotation);
    const { customers } = useAppSelector((state) => state.customer);
    const { code, latestRecord } = useAppSelector((state) => state.util);
    const { fillingProducts } = useAppSelector((state) => state.rawProduct);
    const { allProductAssemblies } = useAppSelector((state) => state.productAssembly);
    const { employees } = useAppSelector((state) => state.employee);

    const [formData, setFormData] = useState<any>({});

    const [itemModalOpen, setItemModalOpen] = useState<boolean>(false);
    const [quotationStock, setQuotationStock] = useState<any[]>([]);
    const [itemsForSelect, setItemsForSelect] = useState<any[]>([]);
    const [originalItemsState, setOriginalItemsState] = useState<any[]>([]);

    const [fillingMaterials, setFillingMaterials] = useState<any[]>([]);
    const [customerOptions, setCustomerOptions] = useState<any[]>([]);
    const [contactPersonOptions, setContactPersonOptions] = useState<any[]>([]);
    const [salesmanOptions, setSalesmanOptions] = useState<any[]>([]);
    const [quotationItems, setQuotationItems] = useState<any[]>([]);
    const [quotationOptions, setQuotationOptions] = useState<any[]>([]);
    const [productAssemblyOptions, setProductAssemblyOptions] = useState<any[]>([]);
    const [quotationForOptions] = useState<any[]>([
        { label: 'Finished Goods', value: 1 },
        { label: 'Materials', value: 2 }
    ]);
    const [customerDetail, setCustomerDetail] = useState<any>({});
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [validations, setValidations] = useState<any>({});
    const [formError, setFormError] = useState<any>('');

    const handleChange = (name: string, value: any, required: boolean = false) => {
        if (required && value === '') {
            handleValidation(name, 'add');
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
            handleValidation(name, 'remove');
            return;
        }

        if (name === 'quotation_ids' || name === 'salesman_id' || name === 'contact_person_id' || name === 'customer_id' || name === 'delivery_note_for' || name === 'product_assembly_id') {
            if (required && (name === 'salesman_id' || name === 'contact_person_id' || name === 'customer_id' || name === 'delivery_note_for' || name === 'product_assembly_id') && value === 0) {
                handleValidation(name, 'add');
                return;
            } else {
                // Remove that key and value from validation object
                handleValidation(name, 'remove');
                if (value && typeof value !== 'undefined') {
                    setFormData({ ...formData, [name]: value.value });
                    if (name === 'customer_id') {
                        const customerOption = customerOptions.find((customer: any) => customer.value === value.value);
                        setCustomerDetail(customerOption.customer);
                        // console.log(customerOption);
                        setContactPersonOptions(customerOption.customer?.contact_persons.map((contactPerson: any) => ({
                            label: contactPerson.name,
                            value: contactPerson.id,
                            contactPerson
                        })));
                    }

                    if (name === 'quotation_ids') {
                        // console.log(value);
                        let selectedQuotations = value.map((quotation: any) => quotation?.quotation);
                        let ids = value.map((quotation: any) => quotation.value);
                        let idsString = '';
                        let skip_quotation = false;
                        // console.log(value);
                        if (ids.some((id: any) => id === 0)) {
                            idsString = '0';
                            skip_quotation = true;
                            setItemsForSelect([]);
                            setOriginalItemsState([]);
                            setQuotationItems([]);
                        } else {
                            idsString = ids.join(',');
                            if (selectedQuotations) {
                                let quotationItemList = selectedQuotations.flatMap((quotation: any) => quotation.quotation_items);
                                let customerIds = value.filter((item: any) => item.value !== 0).map((item: any) => item.quotation.customer_id);
                                let customerIdsSet = new Set(customerIds);
                                if (customerIdsSet.size > 1) {
                                    alert('You cannot select multiple customer');
                                    return;
                                }
                                // console.log(quotationItemList);
                                setItemsForSelect(quotationItemList?.map((item: any) => {
                                    console.log("item", item);
                                    return {
                                        ...item,
                                        delivered_quantity: item.quantity
                                    }
                                }));
                            }
                        }
                        setFormData((prev: any) => ({
                            ...prev,
                            quotation_ids: idsString,
                            skip_quotation
                        }));
                    }

                    if (name === 'delivery_note_for') {
                        if (value.value === 1) {
                            dispatch(pendingQuotations());
                        }
                    }

                    if (name === 'product_assembly_id') {
                        setFormData((prev: any) => ({ ...prev, product_assembly_id: value.value }));
                        dispatch(clearFillingState());
                        dispatch(getFinishedGoodStock(value.value));
                    }
                } else {
                    setFormData({ ...formData, [name]: '' });

                    if (name === 'quotation_ids') {
                        setFormData((prev: any) => ({
                            ...prev,
                            quotation_ids: '',
                            skip_quotation: false
                        }));
                        setItemsForSelect([]);
                        setOriginalItemsState([]);
                        setContactPersonOptions([]);
                        setQuotationItems([]);
                    }

                    if (name === 'customer_id') {
                        setContactPersonOptions([]);
                    }

                    if (name === 'product_assembly_id') {
                        dispatch(clearFillingState());
                    }
                }
            }
            return;
        }
        handleValidation(name, 'remove');
        setFormData({ ...formData, [name]: value });
    };

    const handleValidation = (name: string, type: string) => {
        if (type === 'remove') {
            if (validations[name]) {
                setValidations((prev: any) => {
                    delete prev[name];
                    return prev;
                });
            }
        } else {
            setValidations({ ...validations, [name]: 'Required Field' });
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.currentTarget.querySelectorAll('input, select, textarea').forEach((field: any) => {
            if (field.required) {
                if ((!formData[field.name] || formData[field.name] === 0) && !validations[field.name] && field.value === '') {
                    setValidations({ ...validations, [field.name]: 'Required Field' });
                }
            }
        });
        if (Object.keys(validations).length > 0) {
            setFormError('Please fill all required fields');
            return;
        } else {
            let deliveryNoteData: any = {
                un_billed_receivable_account_id: formData.un_billed_receivable_account_id,
                skip_quotation: formData.skip_quotation,
                delivery_note_for: formData.delivery_note_for,
                receipt_delivery_due_days: formData.receipt_delivery_due_days,
                delivery_due_in_days: formData.delivery_due_in_days,
                delivery_due_date: formData.delivery_due_date,
                salesman_id: formData.salesman_id,
                customer_id: formData.customer_id,
                contact_person_id: formData.contact_person_id,
                delivery_note_items: quotationItems.map((item: any) => ({
                    quotation_id: item.quotation_id,
                    product_assembly_id: item.product_assembly_id,
                    filling_id: item.filling_id,
                    production_id: item.production_id,
                    batch_number: item.batch_number,
                    raw_product_id: item.raw_product_id,
                    available_quantity: item.available_quantity,
                    quantity: item.quantity,
                    delivered_quantity: item.delivered_quantity,
                    capacity: item.capacity,
                    retail_price: item.retail_price,
                    tax_category_id: item.tax_category_id,
                    tax_rate: item.tax_rate,
                    tax_amount: item.tax_amount,
                    discount_type: item.discount_type,
                    discount_amount_rate: item.discount_amount_rate,
                    total_cost: item.total_cost
                })),
                terms_conditions: formData.terms_conditions
            };
            if(!deliveryNoteData.un_billed_receivable_account_id) {
                Swal.fire('Error', 'Please select accounting for un billed receivable', 'error')
            } else {
                dispatch(storeDeliveryNote(deliveryNoteData));
            }
        }
    };

    const deliverByOptions = (contactPersons: any) => {
        setContactPersonOptions(contactPersons.map((contactPerson: any) => ({
            value: contactPerson.id,
            label: contactPerson.name,
            contactPerson
        })));
    };

    const handleQuotationItemSubmit = (item: any) => {
        setQuotationItems((prev) => {
            const existingRow = prev.find(row => row.raw_product_id === item.raw_product_id && row.batch_number === item.batch_number);
            if (existingRow) {
                return prev.map(row => row.raw_product_id === item.raw_product_id && row.batch_number === item.batch_number ? item : row);
            } else {
                return [...prev, item];
            }
        });
        setModalOpen(false);
    };

    useEffect(() => {
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getCustomers());
        dispatch(getEmployees());
        dispatch(generateCode(FORM_CODE_TYPE.DELIVERY_NOTE));
        dispatch(getProductAssemblies());
        // dispatch(getFillingProducts(['filling-material', 'packing-material']));
        setModalOpen(false);
        // setItemModalOpen(false);
        // dispatch(clearFillingState())
        dispatch(getAccountsTypes({ids: 1}));
    }, []);

    useEffect(() => {
        if (validations && Object.keys(validations).length > 0) {
            setFormError('Please fill all required fields');
        } else {
            setFormError('');
        }
    }, [validations]);

    useEffect(() => {
        if (customers) {
            const customerOptions = customers.map((customer: any) => ({
                value: customer.id,
                label: customer.name,
                customer
            }));
            setCustomerOptions(customerOptions);
        }
    }, [customers]);

    useEffect(() => {
        if (Object.keys(customerDetail).length > 0) {
            deliverByOptions(customerDetail.contact_persons);
        }
    }, [customerDetail]);

    useEffect(() => {
        if (employees) {
            setSalesmanOptions(employees.map((employee: any) => ({
                label: employee.name + ' - ' + employee.employee?.employee_code,
                value: employee.id
            })));
        }
    }, [employees]);

    useEffect(() => {
        if (quotations) {
            const quotationOptions = quotations.map((quotation: any) => ({
                value: quotation.id,
                label: quotation.quotation_code,
                quotation
            }));
            setQuotationOptions([{ label: 'Skip Quotation', value: 0 }, ...quotationOptions]);
        }
    }, [quotations]);

    useEffect(() => {
        if (code) {
            setFormData((prev: any) => ({
                ...prev,
                deliver_note_code: code[FORM_CODE_TYPE.DELIVERY_NOTE]
            }));
        }
    }, [code]);

    useEffect(() => {
        if (allProductAssemblies) {
            setProductAssemblyOptions(allProductAssemblies.map((productAssembly: any) => (
                {
                    label: productAssembly.formula_name,
                    value: productAssembly.id
                }
            )));
        }
    }, [allProductAssemblies]);

    useEffect(() => {
        if (fillingProducts) {
            setFillingMaterials(fillingProducts);
        }
    }, [fillingProducts]);

    useEffect(() => {
        const newItemsForSelect = originalItemsState.filter(op =>
            !quotationStock.some(rp => rp.raw_product_id === op.raw_product_id && rp.purchase_requisition_id === op.purchase_requisition_id)
        );

        if (newItemsForSelect.length > 0) {
            setItemsForSelect((prev: any) => [...prev, ...newItemsForSelect]);
        }
    }, [quotationStock, originalItemsState]);

    useEffect(() => {
        if (latestRecord) {
            setFormData((prevFormData: any) => ({
                ...prevFormData,
                un_billed_receivable_account_id: latestRecord.un_billed_receivable_account?.code,
                un_earned_income_account_id: latestRecord.un_earned_income_account?.code,
                cost_of_goods_sold_account_id: latestRecord.cost_of_goods_sold_account?.code,
            }));
        }
    }, [latestRecord]);

    useEffect(() => {
        console.log(itemsForSelect);
    }, [itemsForSelect]);

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            {validations && Object.keys(validations).length > 0 && (
                <Alert message={formError} setMessages={setFormError} alertType="error" />
            )}
            {/* Delivery Note Form */}
            <div className="flex w-full flex-row items-start justify-between gap-3 mt-3">
                <div className="flex w-full flex-col items-start justify-start space-y-3">
                    <Input
                        divClasses="w-full"
                        label="Delivery Note Code"
                        type="text"
                        name="deliver_note_code"
                        value={formData.deliver_note_code}
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Enter Delivery Note Code"
                        isMasked={false}
                        disabled={true}
                    />

                    <Dropdown
                        divClasses="w-full"
                        label="Deliver Note For"
                        name="delivery_note_for"
                        options={quotationForOptions}
                        value={formData.delivery_note_for}
                        onChange={(e: any) => handleChange('delivery_note_for', e, true)}
                        required={true}
                        errorMessage={validations.delivery_note_for}
                    />

                    {formData.delivery_note_for === 1 && (
                        <div className="w-full flex flex-col md:flex-row gap-1 items-end">
                            <Dropdown
                                divClasses="w-full"
                                label="Quotation"
                                name="quotation_ids"
                                options={quotationOptions}
                                value={formData.quotation_ids}
                                onChange={(e: any) => handleChange('quotation_ids', e, true)}
                                isMulti={true}
                                required={true}
                                errorMessage={validations.quotation_id}
                            />
                            <Button
                                type={ButtonType.button}
                                text="Select"
                                variant={ButtonVariant.primary}
                                disabled={itemsForSelect.length === 0}
                                onClick={() => {
                                    setItemModalOpen(true);
                                }}
                            />
                        </div>
                    )}
                    {formData.quotation_ids === '0' && (
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 col-span-2">
                            <Dropdown
                                divClasses="w-full"
                                label="Customer"
                                name="customer_id"
                                options={customerOptions}
                                value={formData.customer_id}
                                onChange={(e: any) => handleChange('customer_id', e, true)}
                            />
                            <Dropdown
                                divClasses="w-full"
                                label="Contact Person"
                                name="contact_person_id"
                                options={contactPersonOptions}
                                value={formData.contact_person_id}
                                onChange={(e: any) => handleChange('contact_person_id', e, true)}
                            />
                            <Input
                                divClasses="w-full"
                                label="Receipt Delivery Due Days"
                                type="number"
                                name="receipt_delivery_due_days"
                                value={formData.receipt_delivery_due_days?.toString()}
                                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                                isMasked={false}
                                placeholder="Receipt Delivery Due Days"
                                required={true}
                                errorMessage={validations.receipt_delivery_due_days}
                            />

                            <Input
                                divClasses="w-full"
                                label="Delivery Due days"
                                type="number"
                                name="delivery_due_in_days"
                                value={formData.delivery_due_in_days}
                                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                                isMasked={false}
                                placeholder="Receipt Delivery Days"
                                required={true}
                                errorMessage={validations.delivery_due_in_days}
                            />

                            <Input
                                divClasses="w-full"
                                label="Delivery Due Date"
                                type="text"
                                name="delivery_due_date"
                                value={formData.delivery_due_date}
                                onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                                isMasked={false}
                                placeholder="Receipt Delivery Due Date"
                                disabled={true}
                                required={true}
                                errorMessage={validations.delivery_due_date}
                            />

                            <Dropdown
                                divClasses="w-full"
                                label="Salesman"
                                name="salesman_id"
                                options={salesmanOptions}
                                value={formData.salesman_id}
                                onChange={(e: any) => handleChange('salesman_id', e, true)}
                                required={true}
                                errorMessage={validations.salesman_id}
                            />

                            {/*<Option*/}
                            {/*    divClasses="w-full"*/}
                            {/*    label="Consider Out of Stock as Well"*/}
                            {/*    type="checkbox"*/}
                            {/*    name="unprepared_stock"*/}
                            {/*    value={formData.unprepared_stock}*/}
                            {/*    defaultChecked={formData.unprepared_stock === 1}*/}
                            {/*    onChange={(e: any) => handleChange(e.target.name, e.target.checked ? 1 : 0, e.target.required)}*/}
                            {/*/>*/}
                        </div>
                    )}


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
                        <div className="my-5 active table-responsive">
                            <div
                                className="flex mb-3 justify-start items-start md:justify-between md:items-center gap-3 flex-col md:flex-row">
                                <h3 className="text-lg font-semibold">Quotation Items</h3>
                                {formData.quotation_ids === '0' && (
                                    <Button
                                        type={ButtonType.button}
                                        text={
                                            <span className="flex items-center">
                                                {getIcon(IconType.add)}
                                                Add Finish Good
                                            </span>
                                        }
                                        variant={ButtonVariant.primary}
                                        onClick={() => setModalOpen(true)}
                                        size={ButtonSize.small}
                                    />
                                )}
                            </div>
                            <table>
                                <thead>
                                <tr>
                                    {!formData.skip_quotation && <th>Quotation</th>}
                                    <th>Product</th>
                                    <th>Batch #</th>
                                    <th>Capacity</th>
                                    <th>Delivered Quantity</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {quotationItems.length > 0
                                    ? quotationItems.map((item: any, index: number) => {
                                        // let product = fillingMaterials.find((material: any) => material.id === item.raw_product_id);
                                        let quotation = quotations.find((quotation: any) => quotation.id === item.quotation_id);
                                        return (
                                            <tr key={index}>
                                                {!formData.skip_quotation && (
                                                    <td>
                                                        {quotation.quotation_code}
                                                    </td>
                                                )}
                                                <td>
                                                    {formData.quotation_ids === '0'
                                                        ? productAssemblyOptions.find((assembly: any) => assembly.value === item.product_assembly_id)?.label
                                                        : item.product.item_code}
                                                </td>
                                                <td>
                                                    {item.batch_number} <br />
                                                    {item.filling?.filling_code}
                                                </td>
                                                <td>{item.capacity}</td>
                                                <td>{item.delivered_quantity}</td>
                                                <td>
                                                    <IconButton
                                                        icon={IconType.delete}
                                                        color={ButtonVariant.danger}
                                                        onClick={() => {
                                                            let updatedItems = quotationItems.filter((qItem: any) => qItem.raw_product_id !== item.raw_product_id);
                                                            setQuotationItems(updatedItems);
                                                            setItemsForSelect((prev) => {
                                                                return [...prev, item];
                                                            });
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan={formData.skip_quotation ? 8 : 9} className="text-center">
                                                No Delivery Note Items Added
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
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
                                        dispatch(getLatestRecord('delivery-note'));
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
                                            <label>Un-Billed Account Receivable</label>
                                            <TreeSelect
                                                showSearch
                                                style={{ width: '100%' }}
                                                value={latestRecord ? latestRecord.un_billed_receivable_account?.code : formData.un_billed_receivable_account_id}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="Please select Un Billed Account"
                                                allowClear
                                                treeDefaultExpandAll
                                                onChange={(e) => {
                                                    setFormData((prevFormData: any) => ({
                                                        ...prevFormData,
                                                        un_billed_receivable_account_id: e
                                                    }));
                                                }}
                                                treeData={accountOptions}
                                                treeNodeFilterProp="title"
                                                // onPopupScroll={onPopupScroll}
                                            />
                                        </div>
                                        <div>
                                            <label>Cost of Good Sold</label>
                                            <TreeSelect
                                                showSearch
                                                style={{ width: '100%' }}
                                                value={latestRecord ? latestRecord.cost_of_goods_sold_account?.code : formData.cost_of_goods_sold_account_id}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="Please select Cost of Good Sold Account"
                                                allowClear
                                                treeDefaultExpandAll
                                                onChange={(e) => {
                                                    setFormData((prevFormData: any) => ({
                                                        ...prevFormData,
                                                        cost_of_goods_sold_account_id: e
                                                    }));
                                                }}
                                                treeData={accountOptions}
                                                treeNodeFilterProp="title"
                                                // onPopupScroll={onPopupScroll}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-5 border-b">Un Earned Accounting</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label>Un-Earned Income Account</label>
                                            <TreeSelect
                                                showSearch
                                                style={{ width: '100%' }}
                                                value={latestRecord ? latestRecord.un_earned_income_account?.code : formData.un_earned_income_account_id}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="Please select Un Earned Income Account"
                                                allowClear
                                                treeDefaultExpandAll
                                                onChange={(e) => {
                                                    setFormData((prevFormData: any) => ({
                                                        ...prevFormData,
                                                        un_earned_income_account_id: e
                                                    }));
                                                }}
                                                treeData={accountOptions}
                                                treeNodeFilterProp="title"
                                                // onPopupScroll={onPopupScroll}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
            <Textarea
                divClasses="w-full mt-5"
                label="Terms & Conditions"
                name="terms_conditions"
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
            <FinishedGoodModal
                considerOutOfStock={false}
                modalFor="delivery_note"
                skip={formData.skip_quotation}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                handleSubmit={(item) => handleQuotationItemSubmit(item)}
            />

            <Modal
                show={itemModalOpen}
                setShow={setItemModalOpen}
                title="Select Items"
                size={'5xl'}
            >
                <table>
                    <thead>
                    <tr>
                        <th>Batch</th>
                        <th>Product</th>
                        <th>Capacity</th>
                        <th>Quantity</th>
                        <th>Delivered Quantity</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {itemsForSelect?.map((item: any, index: number) => (
                        <tr key={index}>
                            <td>
                                {item.batch_number} <br />
                                {item.filling?.filling_code}
                            </td>
                            <td>{item.product?.item_code}</td>
                            <td>{item.capacity}</td>
                            <td>{item.quantity}</td>
                            <td>
                                <Input
                                    type="number"
                                    name="delivered_quantity"
                                    value={item.delivered_quantity || ''}
                                    onChange={(e) => {
                                        const newDeliveredQuantity = Math.min(parseInt(e.target.value), item.quantity);
                                        setItemsForSelect(prevItems =>
                                            prevItems.map((qItem, idx) =>
                                                idx === index
                                                    ? {
                                                        ...qItem,
                                                        delivered_quantity: isNaN(newDeliveredQuantity) ? '' : newDeliveredQuantity
                                                    }
                                                    : qItem
                                            )
                                        );
                                    }}
                                    isMasked={false}
                                />
                            </td>
                            <td>
                                <Button
                                    type={ButtonType.button}
                                    text="Add"
                                    variant={ButtonVariant.primary}
                                    onClick={() => {
                                        setQuotationItems((prev) => {
                                            const existingRow = prev.find(row => row.raw_product_id === item.raw_product_id && row.batch_number === item.batch_number);
                                            if (existingRow) {
                                                return prev.map(row => row.raw_product_id === item.raw_product_id && row.batch_number === item.batch_number ? item : row);
                                            } else {
                                                return [...prev, item];
                                            }
                                        });
                                        setItemsForSelect((prev) => prev.filter((qItem, idx) => idx !== index));
                                        setItemModalOpen(false);
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Modal>


        </form>
    );
};

export default DeliveryNoteForm;
