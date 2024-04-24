import React, {useEffect, useState} from 'react';
import {Input} from "@/components/form/Input";
import {Dropdown} from "@/components/form/Dropdown";
import {IRootState, useAppDispatch, useAppSelector} from "@/store";
import Button from "@/components/Button";
import {ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import {formatData, formatTime, getIcon} from "@/utils/helper";
import Textarea from "@/components/form/Textarea";
import {setAuthToken, setContentType} from "@/configs/api.config";
import Option from "@/components/form/Option";
import Alert from "@/components/Alert";
import {val} from "dom7";
import IconButton from "@/components/IconButton";
import RawProductItemListing from "@/components/listing/RawProductItemListing";
import RawProductModal from "@/components/modals/RawProductModal";
import {clearProductAssemblyState, getAssemblyItems, getProductAssemblies} from "@/store/slices/productAssemblySlice";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {getWorkingShifts} from "@/store/slices/workingShiftSlice";
import {pendingProductions} from "@/store/slices/productionSlice";
import {getFillingProducts} from "@/store/slices/rawProductSlice";
import {getUnits} from "@/store/slices/unitSlice";
import {useSelector} from "react-redux";
import {pendingFillings} from "@/store/slices/fillingSlice";

const QuotationForm = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector((state) => state.user);
    const {code} = useSelector((state: IRootState) => state.util);
    const {fillingProducts} = useSelector((state: IRootState) => state.rawProduct);
    const {units} = useSelector((state: IRootState) => state.unit);
    const {fillings} = useSelector((state: IRootState) => state.filling);
    const {allProductAssemblies, assemblyItems} = useSelector((state: IRootState) => state.productAssembly);

    const [formData, setFormData] = useState<any>({})

    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [modalDetail, setModalDetail] = useState<any>({})

    const [fillingMaterials, setFillingMaterials] = useState<any>({})
    const [fillingRemaining, setFillingRemaining] = useState<number>(0)
    const [rawProducts, setRawProducts] = useState<any[]>([])
    const [fillingCalculations, setFillingCalculations] = useState<any[]>([])

    const [customerOptions, setCustomerOptions] = useState<any[]>([])
    const [contactPersonOptions, setContactPersonOptions] = useState<any[]>([])
    const [salesmanOptions, setSalesmanOptions] = useState<any[]>([])
    const [fillingMaterialOptions, setFillingMaterialOptions] = useState<any[]>([])
    const [productAssemblyOptions, setProductAssemblyOptions] = useState<any>([]);
    const [unitOptions, setUnitOptions] = useState<any[]>([])
    const [fillingOptions, setFillingOptions] = useState<any[]>([
        {label: 'Custom Quotation', value: 0},
    ])
    const [customerDetail, setCustomerDetail] = useState<any>({})
    const [contactPersonDetail, setContactPersonDetail] = useState<any>({})
    const [showCustomerDetail, setShowCustomerDetail] = useState(false)
    const [showContactPersonDetail, setShowContactPersonDetail] = useState(false)

    const [validations, setValidations] = useState<any>({})
    const [formError, setFormError] = useState<any>('')
    const [selectedFilling, setSelectedFilling] = useState<any>({})

    const handleChange = (name: string, value: any, required = false) => {
        // Directly handle validation for required fields and specific conditions
        if (required && (value === '' || (['salesman_id', 'contact_person_id', 'customer_id'].includes(name) && value === 0))) {
            handleValidation(name, 'add');
            return;
        }

        handleValidation(name, 'remove');

        // Handling specific field logic
        switch (name) {
            case 'delivery_due_in_days':
                // Adjust date based on input value
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + parseInt(value));
                setFormData((prev: any) => ({
                    ...prev,
                    delivery_due_in_days: value,
                    delivery_due_date: dueDate.toDateString()
                }));
                break;
            case 'filling_id':
                setFormData((prev: any) => ({...prev, [name]: value}));
                handleFillingChange(value);
                break;
            case 'contact_person_id':
            case 'customer_id':
                if (value && typeof value !== 'undefined') {
                    setFormData((prev: any) => ({...prev, [name]: value.value}));
                    if (name === 'customer_id') {
                        // Handle customer-specific logic
                        const customerOption = customerOptions.find(customer => customer.value === value);
                        if (customerOption) {
                            setCustomerDetail(customerOption.customer);
                            setShowCustomerDetail(true);
                        }
                        setContactPersonOptions([]);
                        setContactPersonDetail({});
                        setShowContactPersonDetail(false);
                        // Assuming a dispatch function might be called here for fetching customer contact persons
                    } else if (name === 'contact_person_id') {
                        // Handle contact person-specific logic
                        const contactPersonOption = contactPersonOptions.find(contactPerson => contactPerson.value === value);
                        if (contactPersonOption) {
                            setContactPersonDetail(contactPersonOption.contactPerson);
                            setShowContactPersonDetail(true);
                        }
                    }
                } else {
                    setFormData((prev: any) => ({...prev, [name]: ''}));
                }
                break;
            case 'product_assembly_id':
                if (value && typeof value !=='undefined') {
                    setFormData((prev: any) => ({...prev, [name]: value.value}));
                } else {
                    setFormData((prev: any) => ({...prev, [name]: ''}));
                }
                handleFormulaChange(value);
                break;
            case 'no_of_quantity':
                setFormData((prev: any) => ({...prev, [name]: value}));
                setFillingRemaining(value);
                break;
            default:
                // For all other fields, simply update the formData
                setFormData((prev: any) => ({...prev, [name]: value}));
                break;
        }
    };

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

    const handleFormulaChange = (e: any) => {
        if (formData.no_of_quantity > 0) {
            if (e && typeof e !== 'undefined') {
                setAuthToken(token);
                dispatch(clearProductAssemblyState());
                dispatch(getAssemblyItems(e.value));
            } else {
                setRawProducts([]);
            }
        } else {
            alert('No of Quantity is required');
        }

        if (hasInsufficientQuantity()) {
            setFormError("Production can't be proceeding. Please purchase the In-stock quantities.");
        }
    };

    const hasInsufficientQuantity = () => {
        return rawProducts.some((row) => row.available_quantity < row.required_quantity);
    };

    useEffect(() => {
        console.log(formData)
    }, [formData]);

    const handleFillingChange = (value: any) => {

        if (value === 0) {
            setRawProducts([])
            setFillingCalculations([])
        } else {
            if (value && typeof value !== 'undefined') {
                setSelectedFilling(value)
                if (value.items && value.items.length > 0) {
                    let rawProducts = value.items.map((item: any) => {
                        return {
                            raw_product_id: item.raw_product_id,
                            description: item.description,
                            unit_id: item.unit_id,
                            unit_price: parseFloat(item.unit_cost),
                            quantity: parseFloat(item.quantity),
                            available_quantity: parseFloat(item.available_quantity),
                            required_quantity: item.required_quantity,
                            sub_total: item.total_cost,
                        };
                    });
                    setRawProducts(rawProducts);

                    if (value.calculations && value.calculations.length > 0) {
                        let calculation = value.calculations.map((calc: any) => {
                            return {
                                raw_product_id: calc.raw_product_id,
                                unit_id: calc.unit_id,
                                unit_price: calc.unit_price,
                                quantity: calc.quantity,
                                capacity: calc.capacity,
                                filling_quantity: calc.filling_quantity,
                                required_quantity: calc.required_quantity,
                                total_cost: calc.total_cost
                            }
                        })
                        setFillingCalculations(calculation)
                    }
                }
                setFormData({
                    ...formData,
                    filling_id: value.value,
                    no_of_quantity: value.no_of_quantity
                })
            } else {
                setSelectedFilling({})
                setRawProducts([])
                setFillingCalculations([])
                setFormData({
                    ...formData,
                    filling_id: '',
                    no_of_quantity: 0
                })
            }
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
            let quotationData:any = {
                receipt_delivery_due_days: formData.receipt_delivery_due_days,
                delivery_due_in_days: formData.delivery_due_in_days,
                delivery_due_date: formData.delivery_due_date,
                salesman_id: formData.salesman_id,
                skip_delivery_note: formData.skip_delivery_note,
                print_as_performa: formData.print_as_performa,
                customer_id: formData.customer_id,
                contact_person_id: formData.contact_person_id,
                quotation_items: rawProducts,
                filling_calculations: fillingCalculations,
                terms_conditions: formData.terms_conditions
            }
            if (formData.skip_delivery_note) {
                quotationData.delivery_note = {
                    delivery_due_in_days: formData.delivery_due_in_days,
                    delivery_due_date: formData.delivery_due_date,
                    customer_id: formData.customer_id,
                    contact_person_id: formData.contact_person_id,
                    salesman_id: formData.salesman_id,
                    terms_conditions: formData.terms_conditions,
                    items: rawProducts,
                    filling_calculations: fillingCalculations
                }
            }

            if(formData.filling_id===0) {
                quotationData.production = {
                    no_of_quantity: formData.no_of_quantity,
                    product_assembly_id: formData.product_assembly_id,
                    items: rawProducts
                }
                quotationData.fillings = {
                    filling_date: formatData(new Date()),
                    filling_time: formatTime(new Date()),
                    filling_shift_id: 1,
                    items: rawProducts,
                    calculations: fillingCalculations
                }
            }
            console.log(quotationData)
        }
    }

    const handleFillingMaterialSubmit = (data: any) => {
        // console.log(data)
        setFillingMaterials((prev: any) => {
            let maxId = 0;
            prev.forEach((item: any) => {
                if (item.id > maxId) {
                    maxId = item.id;
                }
            });
            const existingRow = prev.find((row: any) => row.raw_product_id === data.raw_product_id);
            if (existingRow) {
                return prev.map((row: any) => row.raw_product_id === data.raw_product_id ? data : row);
            } else {
                setFillingRemaining(fillingRemaining - data.filling_quantity);
                return [...prev, {...data, id: maxId + 1}];
            }
        });
        setModalOpen(false)
    }

    // useEffect(() => {
    //     console.log(formData)
    // }, [formData]);

    useEffect(() => {
        setAuthToken(token)
        setContentType('application/json')
        dispatch(getProductAssemblies());
        dispatch(clearUtilState());
        dispatch(generateCode(FORM_CODE_TYPE.QUOTATION));
        dispatch(getFillingProducts(['filling-material', 'packing-material']));
        setRawProducts([])
        setFillingCalculations([])
        dispatch(getUnits());
        dispatch(pendingFillings())
    }, [])

    useEffect(() => {
        if (assemblyItems) {
            let rawProducts = assemblyItems.map((item: any) => {
                return {
                    raw_product_id: item.raw_product_id,
                    description: item.description,
                    unit_id: item.unit_id,
                    unit_price: parseFloat(item.cost),
                    quantity: parseFloat(item.quantity),
                    available_quantity: parseFloat(item.available_stock),
                    required_quantity: item.quantity * formData.no_of_quantity,
                    sub_total: item.product.opening_stock_unit_balance * item.quantity * formData.no_of_quantity,
                };
            });
            setRawProducts(rawProducts);
        }
    }, [assemblyItems]);

    useEffect(() => {
        if (allProductAssemblies) {
            let formulaOptions = allProductAssemblies.map((assembly: any) => {
                return {
                    value: assembly.id,
                    label: assembly.formula_name + ' (' + assembly.formula_code + ')',
                };
            });
            setProductAssemblyOptions([{value: '', label: 'Select Formula'}, ...formulaOptions]);
        }
    }, [allProductAssemblies]);

    useEffect(() => {
        if (formData.no_of_quantity > 0) {
            let updatedRawProducts = rawProducts.map((row) => {
                return {
                    ...row,
                    required_quantity: row.quantity * formData.no_of_quantity,
                    sub_total: row.available_quantity * row.quantity * formData.no_of_quantity,
                };
            });
            setRawProducts(updatedRawProducts);
        }
    }, [formData.no_of_quantity]);

    useEffect(() => {
        if (fillings) {
            let options = fillings.map((filling: any) => (
                {
                    label: filling.production.batch_number + ' - ' + filling.filling_code,
                    value: filling.id,
                    items: filling.filling_items,
                    calculations: filling.filling_calculations,
                    no_of_quantity: filling.production.no_of_quantity
                }
            ))
            setFillingOptions([{label: 'Custom Quotation', value: 0}, ...options])
        }
    }, [fillings]);

    useEffect(() => {
        if (validations && Object.keys(validations).length > 0) {
            setFormError('Please fill all required fields')
        } else {
            setFormError('')
        }

        // console.log('Validations', validations)
    }, [validations]);

    useEffect(() => {
        if (units) {
            setUnitOptions([{value: '', label: 'Select Unit'}, ...units]);
        }
    }, [units]);

    useEffect(() => {
        if (code) {
            setFormData({...formData, quotation_code: code[FORM_CODE_TYPE.QUOTATION]})
        }
    }, [code]);

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
                            onChange={(e: any) => handleChange('salesman_id', e, true)}
                            required={true}
                            errorMessage={validations.salesman_id}
                        />

                        {formData.filling_id === 0 && (
                            <>
                                <Input
                                    divClasses='w-full'
                                    label='Production Quantity (KG)'
                                    type='number'
                                    name='no_of_quantity'
                                    value={formData.no_of_quantity}
                                    onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                                    isMasked={false}
                                    placeholder="Production Quantity (KG)"
                                    required={true}
                                    errorMessage={validations.no_of_quantity}
                                />
                                <Dropdown
                                    divClasses='w-full'
                                    label='Formula'
                                    name='product_assembly_id'
                                    options={productAssemblyOptions}
                                    value={formData.product_assembly_id}
                                    onChange={(e: any) => handleChange('product_assembly_id', e, true)}
                                    required={false}
                                    errorMessage={validations.product_assembly_id}
                                />
                            </>
                        )}


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

            <div className="mt-5">
                <div className="table-responsive">
                    <div className="flex justify-between items-center gap-3 mb-3">
                        <h5 className="text-lg font-semibold dark:text-white-light">
                            Filling - ({formData.no_of_quantity} KG)
                        </h5>
                        {fillingRemaining > 0 && (
                            <Button
                                type={ButtonType.button}
                                text="Add New Item"
                                variant={ButtonVariant.primary}
                                size={ButtonSize.small}
                                onClick={() => {
                                    setModalOpen(true)
                                    setModalDetail({})
                                }}
                            />
                        )}

                    </div>
                    <table>
                        <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Unit</th>
                            <th>Unit Cost</th>
                            <th>Qty</th>
                            <th>Capacity</th>
                            <th>Filling (KG)</th>
                            <th>Required</th>
                            <th>Total Cost</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fillingCalculations.length > 0
                            ? (
                                fillingCalculations.map((row: any, index: number) => (
                                    <tr key={index}>
                                        <td>
                                            {selectedFilling.calculations.find((item: any) => item.raw_product_id === row.raw_product_id)?.product.title + ' - ' + selectedFilling.calculations.find((item: any) => item.raw_product_id === row.raw_product_id)?.product.item_code}
                                        </td>
                                        <td>
                                            {unitOptions.find((item: any) => item.value === row.unit_id)?.label}
                                        </td>
                                        <td>{row.unit_price}</td>
                                        <td>{row.quantity}</td>
                                        <td>{row.capacity}</td>
                                        <td>{row.filling_quantity}</td>
                                        <td>{row.required_quantity}</td>
                                        <td>{row.total_cost}</td>
                                        <td>
                                            <div className="flex gap-1">
                                                <IconButton
                                                    icon={IconType.edit}
                                                    color={ButtonVariant.primary}
                                                    tooltip='Edit'
                                                    onClick={() => {
                                                        setModalOpen(true)
                                                        setModalDetail(row)
                                                        setFillingRemaining(fillingRemaining + row.filling_quantity)
                                                    }}
                                                />
                                                <IconButton
                                                    icon={IconType.delete}
                                                    color={ButtonVariant.danger}
                                                    tooltip='Delete'
                                                    onClick={() => {
                                                        setFillingMaterials(fillingCalculations.filter((item) => item.raw_product_id !== row.raw_product_id))
                                                        if (index === 0) {
                                                            setFillingRemaining(formData.no_of_quantity)
                                                        } else {
                                                            setFillingRemaining(fillingRemaining + row.filling_quantity)
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )
                            : (
                                <tr>
                                    <td colSpan={9} className='text-center'>No data found</td>
                                </tr>
                            )}
                        </tbody>
                        {fillingCalculations.length > 0 && (
                            <tfoot>
                            <tr>
                                <td colSpan={2} className="text-center">Total</td>
                                <td>{fillingCalculations.reduce((acc, item) => acc + item.unit_price, 0)}</td>
                                <td>{fillingCalculations.reduce((acc, item) => acc + item.quantity, 0)}</td>
                                <td>{fillingCalculations.reduce((acc, item) => acc + item.capacity, 0)}</td>
                                <td>{fillingCalculations.reduce((acc, item) => acc + item.filling_quantity, 0)}</td>
                                <td>{fillingCalculations.reduce((acc, item) => acc + item.required_quantity, 0)}</td>
                                <td>{fillingCalculations.reduce((acc, item) => acc + item.total_cost, 0)}</td>
                                <td></td>
                            </tr>
                            </tfoot>
                        )}
                    </table>
                </div>

                <RawProductItemListing
                    rawProducts={rawProducts}
                    setRawProducts={setRawProducts}
                    type={RAW_PRODUCT_LIST_TYPE.FILLING}
                />
            </div>

            <RawProductModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                handleSubmit={(data: any) => handleFillingMaterialSubmit(data)}
                detail={modalDetail}
                listFor={RAW_PRODUCT_LIST_TYPE.FILLING}
                fillingRemaining={Number(fillingRemaining)}
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
