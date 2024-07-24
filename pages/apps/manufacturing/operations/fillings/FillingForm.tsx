import React, { Fragment, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import {
    clearFillingState,
    getLatestFillingCalculation,
    storeFilling,
    updateFilling
} from '@/store/slices/fillingSlice';
import {
    clearProductionState,
    getProductionItems,
    getProductions,
    pendingProductions
} from '@/store/slices/productionSlice';
import { getProductAssemblies } from '@/store/slices/productAssemblySlice';
import { clearLatestRecord, clearUtilState, generateCode, getLatestRecord } from '@/store/slices/utilSlice';
import { ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType, RAW_PRODUCT_LIST_TYPE } from '@/utils/enums';
import { getWorkingShifts } from '@/store/slices/workingShiftSlice';
import { getFillingProducts } from '@/store/slices/rawProductSlice';
import { getUnits } from '@/store/slices/unitSlice';
import Button from '@/components/Button';
import { Input } from '@/components/form/Input';
import { Dropdown } from '@/components/form/Dropdown';
import IconButton from '@/components/IconButton';
import RawProductModal from '@/components/modals/RawProductModal';
import Option from '@/components/form/Option';
import useTransformToSelectOptions from '@/hooks/useTransformToSelectOptions';
import { Tab } from '@headlessui/react';
import dynamic from 'next/dynamic';
import { getAccountsTypes } from '@/store/slices/accountSlice';
import Swal from 'sweetalert2';

const TreeSelect = dynamic(() => import('antd/es/tree-select'), { ssr: false });

interface IFormProps {
    id?: any;
}

const FillingForm = ({ id }: IFormProps) => {
    const dispatch = useAppDispatch();
    const accountOptions = useTransformToSelectOptions(useAppSelector(state => state.account).accountTypes);
    const { token } = useAppSelector(state => state.user);
    const { code, latestRecord } = useAppSelector(state => state.util);
    const { allProductAssemblies } = useAppSelector(state => state.productAssembly);
    const { fillingProducts } = useAppSelector(state => state.rawProduct);
    const { allProductions, productionItems } = useAppSelector(state => state.production);
    const { fillingDetail, loading, lastFillingCalculations } = useAppSelector(state => state.filling);
    const { workingShifts } = useAppSelector(state => state.workingShift);
    const { units } = useAppSelector(state => state.unit);

    const [formData, setFormData] = useState<any>({});
    const [validationMessages, setValidationMessages] = useState<any>({});
    const [rawProducts, setRawProducts] = useState<any[]>([]);
    const [productAssemblyOptions, setProductAssemblyOptions] = useState<any>([]);
    const [productionOptions, setProductionOptions] = useState<any>([]);
    const [fillingShiftOptions, setFillingShiftOptions] = useState<any>([]);
    const [messages, setMessages] = useState('Production can\'t be proceeding. Please purchase the In-stock quantities.');
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalDetail, setModalDetail] = useState<any>({});
    const [fillingMaterialOptions, setFillingMaterialOptions] = useState<any[]>([]);
    const [unitOptions, setUnitOptions] = useState<any[]>([]);
    const [fillingMaterials, setFillingMaterials] = useState<any[]>([]);
    const [fillingRemaining, setFillingRemaining] = useState<number>(0);
    const [noOfProductionQty, setNoOfProductionQty] = useState<number>(0);
    const [fillingCalculation, setFillingCalculation] = useState<any[]>([]);
    const [batchCalculations, setBatchCalculations] = useState<any[]>([]);

    const handleChange = (name: string, value: any, required: boolean) => {
        if (required && value === '') {
            setValidationMessages({ ...validationMessages, [name]: 'This field is required.' });
        } else {
            setValidationMessages((prev: any) => {
                delete prev[name];
                return prev;
            });
        }
        switch (name) {
            case 'filling_shift_id':
                if (value && typeof value !== 'undefined') {
                    setFormData({ ...formData, filling_shift_id: value.value });
                } else {
                    setFormData({ ...formData, filling_shift_id: '' });
                }
                break;
            case 'product_assembly_id':
                if (value && typeof value !== 'undefined') {
                    dispatch(pendingProductions(value.value));
                    setFormData({ ...formData, product_assembly_id: value.value });
                } else {
                    setFormData({ ...formData, product_assembly_id: '' });
                }
                break;
            case 'production_ids':
                if (value && typeof value !== 'undefined' && value.length > 0) {
                    setBatchCalculations(value.map((item: any) => {
                        return {
                            production_id: item.value,
                            batch_number: item.production.batch_number,
                            quantity: item.production.production_quantity_details[0].remaining_quantity,
                            used: 0,
                            remaining: item.production.production_quantity_details[0].remaining_quantity,
                            created_at: item.production.created_at
                        };
                    }));

                    setAuthToken(token);
                    dispatch(clearProductionState());
                    dispatch(getProductionItems(value.map((item: any) => item.value)));
                    const totalQuantity = value.reduce((acc: number, item: any) => acc + item.production.production_quantity_details[0].remaining_quantity, 0);
                    setFillingRemaining(totalQuantity);
                    setNoOfProductionQty(totalQuantity);
                    setFormData({
                        ...formData,
                        production_ids: value.map((item: any) => item.value).join(',')
                    });
                } else {
                    setFormData({ ...formData, [name]: '' });
                    setRawProducts([]);
                    setFillingMaterials([]);
                    setBatchCalculations([]);
                }
                break;
            case 'usage_order':
                setFormData({ ...formData, usage_order: value });
                break;
            default:
                setFormData({ ...formData, [name]: value });
                break;
        }
    };

    const hasInsufficientQuantity = () => {
        return rawProducts.some((row) => row.available_quantity < row.required_quantity);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const finalData:any = {
            ...formData,
            filling_items: rawProducts.map((item) => {
                return {
                    ...item,
                    product_assembly_id: formData.product_assembly_id
                };
            }),
            wastage_no_of_quantity: fillingRemaining,
            filling_calculation: fillingMaterials.map((item) => {
                const retailPrice = fillingCalculation.find((row) => row.raw_product_id === item.raw_product_id)?.retail_price || 0;
                delete item.latest_capacity;
                delete item.latest_retail_price;
                return {
                    ...item,
                    retail_price: retailPrice,
                    product_assembly_id: formData.product_assembly_id
                };
            }),
            batch_calculations: batchCalculations
        };
        setAuthToken(token);
        setContentType('application/json');
        dispatch(clearFillingState());
        if(!finalData.stock_account_id || !finalData.wastage_account_id) {
            Swal.fire('Error', 'Please select accounting for stock and wastage', 'error')
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Retail Price Confirmation',
                text: 'Did you confirm the retail price?',
                showCancelButton: true,
                confirmButtonText: 'Yes I did',
                padding: '2em',
                customClass: {
                    popup: 'sweet-alerts'
                }
            }).then((result: any) => {
                if (result.value) {
                    if (id) {
                        dispatch(updateFilling({ id, finalData: finalData }));
                    } else {
                        dispatch(storeFilling(finalData));
                    }
                }
            });

        }

    };

    useEffect(() => {
        setAuthToken(token);
        dispatch(getProductAssemblies());
        dispatch(clearUtilState());
        if (!id) {
            dispatch(generateCode(FORM_CODE_TYPE.FILLING));
        }
        dispatch(getWorkingShifts());
        dispatch(getFillingProducts(['filling-material', 'packing-material']));
        dispatch(getUnits());

        setRawProducts([]);
        setFillingMaterials([]);

        dispatch(getAccountsTypes({}));
        dispatch(clearLatestRecord())
    }, []);

    useEffect(() => {
        if (allProductions) {
            setProductionOptions(allProductions.map((production: any) => (
                {
                    value: production.id,
                    label: production.batch_number + ' (' + (production.production_quantity_details?.length > 0 ? production.production_quantity_details[0].remaining_quantity : 0) + ' KG)',
                    production: production
                }
            )));
        }
    }, [allProductions]);

    useEffect(() => {
        if (allProductAssemblies) {
            setProductAssemblyOptions(allProductAssemblies.map((assembly: any) => (
                {
                    value: assembly.id,
                    label: assembly.formula_name + ' (' + assembly.color_code.name + ')'
                }
            )));
        }
    }, [allProductAssemblies]);

    useEffect(() => {
        if (units) {
            setUnitOptions([{ value: '', label: 'Select Unit' }, ...units]);
        }
    }, [units]);

    useEffect(() => {
        if (fillingProducts) {
            let options = fillingProducts.map((product: any) => {
                return {
                    value: product.id,
                    label: product.title + ' (' + product.item_code + ')',
                    product
                };
            });
            setFillingMaterialOptions([{ value: '', label: 'Select Material' }, ...options]);
        }
    }, [fillingProducts]);

    useEffect(() => {
        if (workingShifts) {
            let options = workingShifts.map((shift: any) => {
                return {
                    value: shift.id,
                    label: shift.name + ' (' + shift.start_time + ' - ' + shift.end_time + ')'
                };
            });
            setFillingShiftOptions([{ value: '', label: 'Select Shift' }, ...options]);
        }
    }, [workingShifts]);

    useEffect(() => {
        if (productionItems) {
            let rawProducts = productionItems.map((item: any) => {
                return {
                    production_id: item.production.id,
                    batch_number: item.production.batch_number,
                    raw_product_id: item.raw_product_id,
                    description: item.description,
                    unit_id: item.unit_id,
                    unit_price: parseFloat(item.unit_cost),  // Price per kg
                    quantity: parseFloat(item.quantity),
                    available_quantity: parseFloat(item.available_quantity),
                    required_quantity: item.required_quantity,
                    sub_total: (parseFloat(item.unit_cost) * parseFloat(item.quantity) * noOfProductionQty) / parseFloat(item.quantity)
                };
            });
            setRawProducts(rawProducts);
        }
    }, [productionItems]);

    useEffect(() => {
        if (code) {
            setFormData({ ...formData, filling_code: code[FORM_CODE_TYPE.FILLING], usage_order: 'last-in-first-out' });
        }
    }, [code]);

    const handleFillingMaterialSubmit = (data: any) => {
        setFillingMaterials((prev) => {
            const existingRow = prev.find(row => row.raw_product_id === data.raw_product_id);
            if (existingRow) {
                return prev.map(row => row.raw_product_id === data.raw_product_id ? data : row);
            } else {
                setFillingRemaining(fillingRemaining - data.filling_quantity);
                return [...prev, data];
            }
        });
        setModalOpen(false);
    };

    const handleChangeRetailPrice = (productId: number, value: any) => {
        setFillingCalculation((prev) => {
            if (!Array.isArray(prev)) {
                prev = [];
            }

            const index = prev.findIndex(row => row.raw_product_id === productId);
            const updatedArray = [...prev];

            if (index !== -1) {
                updatedArray[index] = { ...updatedArray[index], retail_price: parseFloat(value) };
            } else {
                updatedArray.push({ raw_product_id: productId, retail_price: parseFloat(value) });
            }

            return updatedArray;
        });
    };

    const calculateBatchUsage = () => {
        let totalUsed = fillingMaterials.reduce((acc, item) => acc + item.filling_quantity, 0);

        let updatedBatches = batchCalculations.map(batch => ({ ...batch, used: 0, remaining: batch.quantity }));

        if (formData.usage_order === 'first-in-first-out') {
            for (let i = 0; i < updatedBatches.length && totalUsed > 0; i++) {
                if (totalUsed >= updatedBatches[i].quantity) {
                    updatedBatches[i].used = updatedBatches[i].quantity;
                    updatedBatches[i].remaining = 0;
                    totalUsed -= updatedBatches[i].quantity;
                } else {
                    updatedBatches[i].used = totalUsed;
                    updatedBatches[i].remaining = updatedBatches[i].quantity - totalUsed;
                    totalUsed = 0;
                }
            }
        } else {
            for (let i = updatedBatches.length - 1; i >= 0 && totalUsed > 0; i--) {
                if (totalUsed >= updatedBatches[i].quantity) {
                    updatedBatches[i].used = updatedBatches[i].quantity;
                    updatedBatches[i].remaining = 0;
                    totalUsed -= updatedBatches[i].quantity;
                } else {
                    updatedBatches[i].used = totalUsed;
                    updatedBatches[i].remaining = updatedBatches[i].quantity - totalUsed;
                    totalUsed = 0;
                }
            }
        }

        setBatchCalculations(updatedBatches);
    };

    useEffect(() => {
        calculateBatchUsage();
    }, [fillingMaterials, formData.usage_order]);

    useEffect(() => {
        if (latestRecord) {
            setFormData((prevFormData: any) => ({
                ...prevFormData,
                stock_account_id: latestRecord.stock_account_id,
                vat_receivable_id: latestRecord.vat_receivable_id,
                account_payable_id: latestRecord.account_payable_id,
                vat_payable_id: latestRecord.vat_payable_id
            }));
        }
    }, [latestRecord]);

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex w-full flex-row items-start justify-between gap-3">
                <div className="flex w-full flex-col items-start justify-start space-y-3">
                    <Input
                        divClasses="w-full"
                        label="Filling Code"
                        type="text"
                        name="filling_code"
                        value={formData.filling_code}
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Enter Filling Code"
                        isMasked={false}
                        disabled={true}
                    />

                    <div className="w-full flex flex-col md:flex-row gap-3">
                        <Input
                            divClasses="w-full"
                            label="Filling Date"
                            type="date"
                            name="filling_date"
                            value={formData.filling_date}
                            onChange={(e) => handleChange('filling_date', e[0].toLocaleDateString(), true)}
                            placeholder="Enter Filling Date"
                            isMasked={false}
                            required={true}
                            errorMessage={validationMessages.filling_date}
                        />

                        <Input
                            divClasses="w-full"
                            label="Filling Time"
                            type="time"
                            name="filling_time"
                            value={formData.filling_time}
                            onChange={(e) => handleChange('filling_time', e[0].toLocaleTimeString(), true)}
                            placeholder="Enter Filling Time"
                            isMasked={false}
                            required={true}
                            errorMessage={validationMessages.filling_time}
                        />
                    </div>

                    <Dropdown
                        divClasses="w-full"
                        label="Shift"
                        name="filling_shift_id"
                        options={fillingShiftOptions}
                        value={formData.filling_shift_id}
                        onChange={(e) => handleChange('filling_shift_id', e, true)}
                        required={true}
                        errorMessage={validationMessages.filling_shift_id}
                    />

                    <Dropdown
                        divClasses="w-full"
                        label="Product Assembly"
                        name="product_assembly_id"
                        options={productAssemblyOptions}
                        value={formData.product_assembly_id}
                        onChange={(e: any) => handleChange('product_assembly_id', e, true)}
                        required={true}
                        errorMessage={validationMessages.product_assembly_id}
                    />

                    <Dropdown
                        divClasses="w-full"
                        label="Active Production"
                        name="production_ids"
                        options={productionOptions}
                        value={formData.production_ids}
                        onChange={(e: any) => handleChange('production_ids', e, true)}
                        required={true}
                        errorMessage={validationMessages.production_ids}
                        isMulti={true}
                    />

                    {fillingRemaining > 0 && (
                        <Option
                            divClasses="w-full"
                            label="Consider The remaining as wastage"
                            type="checkbox"
                            name="has_wastage"
                            value={formData.has_wastage}
                            defaultChecked={formData.has_wastage === 1}
                            onChange={(e: any) => handleChange('has_wastage', e.target.checked ? 1 : 0, false)}
                        />
                    )}

                </div>
                <div className="w-full border rounded p-5 hidden md:block">
                    <div className="table-responsive">
                        <h5 className="text-lg font-semibold dark:text-white-light w-full">Batch Calculation</h5>
                        <div>
                            <label>Usage Order</label>
                            <div className="flex gap-5">
                                <Option
                                    label="First In First Out"
                                    type="radio"
                                    name="usage_order"
                                    value={formData.usage_order}
                                    defaultChecked={formData.usage_order === 'first-in-first-out'}
                                    onChange={(e) => handleChange('usage_order', e.target.checked ? 'first-in-first-out' : 'last-in-first-out', false)}
                                />
                                <Option
                                    label="Last In First Out"
                                    type="radio"
                                    name="usage_order"
                                    value={formData.usage_order}
                                    defaultChecked={formData.usage_order === 'last-in-first-out'}
                                    onChange={(e) => handleChange('usage_order', e.target.checked ? 'last-in-first-out' : 'first-in-first-out', false)}
                                />
                            </div>
                        </div>
                        <table>
                            <thead>
                            <tr>
                                <th>Batch</th>
                                <th>Quantity</th>
                                <th>Used</th>
                                <th>Remaining</th>
                                <th>Created At</th>
                            </tr>
                            </thead>
                            <tbody>
                            {batchCalculations.length > 0
                                ? (
                                    batchCalculations.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.batch_number}</td>
                                            <td>{row.quantity}</td>
                                            <td>{row.used}</td>
                                            <td>{row.remaining}</td>
                                            <td>{new Date(row.created_at).toLocaleDateString() + ' ' + new Date(row.created_at).toLocaleTimeString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center">No batch selected</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-5">
                        <div className="table-responsive">
                            <h5 className="text-lg font-semibold dark:text-white-light mb-3">Final Calculation</h5>
                            <table>
                                <thead>
                                <tr>
                                    <th>Filling</th>
                                    <th>No of Fillings</th>
                                    <th>Per Filling Cost</th>
                                    <th>Total Cost</th>
                                </tr>
                                </thead>
                                <tbody>
                                {fillingMaterials.length > 0
                                    ? (fillingMaterials.map((row, index) => {
                                            const totalMaterialCost = rawProducts.reduce((acc, item) => acc + item.sub_total, 0);
                                            const perFillingCost = (totalMaterialCost / noOfProductionQty * row.capacity) + row.unit_price;
                                            const totalFillingCost = perFillingCost * row.required_quantity;
                                            return (
                                                <tr key={index}>
                                                    <td>{fillingMaterialOptions.find((item) => item.value === row.raw_product_id)?.label}</td>
                                                    <td>{row.filling_quantity + '(Kg) / ' + row.required_quantity}</td>
                                                    <td>{perFillingCost.toFixed(2)}</td>
                                                    <td>{totalFillingCost.toFixed(2)}</td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center">No data found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-5">
                        {fillingMaterials.length > 0
                            ? fillingMaterials.map((row, index) => {
                                const label = fillingMaterialOptions.find((item) => item.value === row.raw_product_id)?.label || 'Unknown Material';
                                const defaultValue = row?.latest_retail_price || 0;
                                const currentValue = fillingCalculation.find((item) => item.raw_product_id === row.raw_product_id)?.retail_price || defaultValue;
                                return (
                                    <Input
                                        key={index}
                                        divClasses="w-full mb-3"
                                        label={'Retail Price of ' + label}
                                        type="number"
                                        name="retail_price"
                                        value={currentValue}
                                        onChange={(e) => handleChangeRetailPrice(row.raw_product_id, e.target.value || 0)}
                                        isMasked={false}
                                        required={true}
                                    />
                                );
                            })
                            : (
                                <div>
                                    <h5 className="text-lg font-semibold dark:text-white-light">
                                        Retail Prices
                                    </h5>
                                    <p className="text-sm dark:text-white-light">No filling added</p>
                                </div>
                            )
                        }
                    </div>
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
                    {!id && (
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
                    )}
                </Tab.List>
                <Tab.Panels className="panel rounded-none">
                    <Tab.Panel>
                        <div className="active">
                            <div className="flex justify-between items-center gap-3 mb-3">
                                <h5 className="text-lg font-semibold dark:text-white-light">
                                    Filling - ({noOfProductionQty} KG)
                                </h5>
                                {fillingRemaining > 0 && (
                                    <Button
                                        type={ButtonType.button}
                                        text="Add New Item"
                                        variant={ButtonVariant.primary}
                                        size={ButtonSize.small}
                                        onClick={() => {
                                            setModalOpen(true);
                                            setModalDetail({});
                                        }}
                                    />
                                )}

                            </div>
                            <div className="table-responsive">
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
                                    {fillingMaterials.length > 0
                                        ? (
                                            fillingMaterials.map((row, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        {fillingMaterialOptions.find((item) => item.value === row.raw_product_id)?.label}
                                                    </td>
                                                    <td>
                                                        {unitOptions.find((item: any) => item.value === row.unit_id)?.label}
                                                    </td>
                                                    <td>{row.unit_price}</td>
                                                    <td>{row.quantity}</td>
                                                    <td>{row.capacity}</td>
                                                    <td>{row.filling_quantity}</td>
                                                    <td>{row.required_quantity}</td>
                                                    <td>{row.required_quantity * row.unit_price}</td>
                                                    <td>
                                                        <div className="flex gap-1">
                                                            <IconButton
                                                                icon={IconType.edit}
                                                                color={ButtonVariant.primary}
                                                                tooltip="Edit"
                                                                onClick={() => {
                                                                    setModalOpen(true);
                                                                    setModalDetail(row);
                                                                    setFillingRemaining(fillingRemaining + row.filling_quantity);
                                                                }}
                                                            />
                                                            <IconButton
                                                                icon={IconType.delete}
                                                                color={ButtonVariant.danger}
                                                                tooltip="Delete"
                                                                onClick={() => {
                                                                    setFillingMaterials(fillingMaterials.filter((item) => item.raw_product_id !== row.raw_product_id));
                                                                    if (index === 0) {
                                                                        setFillingRemaining(noOfProductionQty);
                                                                    } else {
                                                                        setFillingRemaining(fillingRemaining + row.filling_quantity);
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
                                                <td colSpan={9} className="text-center">No data found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                    {fillingMaterials.length > 0 && (
                                        <tfoot>
                                        <tr>
                                            <td colSpan={2} className="text-center">Total</td>
                                            <td>{fillingMaterials.reduce((acc, item) => acc + item.unit_price, 0)}</td>
                                            <td>{fillingMaterials.reduce((acc, item) => acc + item.quantity, 0)}</td>
                                            <td>{fillingMaterials.reduce((acc, item) => acc + item.capacity, 0)}</td>
                                            <td>{fillingMaterials.reduce((acc, item) => acc + item.filling_quantity, 0)}</td>
                                            <td>{fillingMaterials.reduce((acc, item) => acc + item.required_quantity, 0)}</td>
                                            <td>{fillingMaterials.reduce((acc, item) => acc + item.required_quantity * item.unit_price, 0)}</td>
                                            <td></td>
                                        </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>

                            <RawProductModal
                                modalOpen={modalOpen}
                                setModalOpen={setModalOpen}
                                handleSubmit={(data: any) => handleFillingMaterialSubmit(data)}
                                detail={modalDetail}
                                listFor={RAW_PRODUCT_LIST_TYPE.FILLING}
                                fillingRemaining={Number(fillingRemaining)}
                            />
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
                                defaultChecked={formData.use_previous_accounting}
                                onChange={(e) => {
                                    setFormData((prevFormData: any) => ({
                                        ...prevFormData,
                                        use_previous_accounting: e.target.checked ? 1 : 0
                                    }));
                                    dispatch(clearLatestRecord());
                                    if (e.target.checked) {
                                        dispatch(getLatestRecord('filling'));
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
                                            <label>Stock Accounting</label>
                                            <TreeSelect
                                                showSearch
                                                style={{ width: '100%' }}
                                                value={latestRecord ? latestRecord.stock_account?.code : formData.stock_account_id}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="Please select stock account"
                                                allowClear
                                                treeDefaultExpandAll
                                                onChange={(e) => handleChange('stock_account_id', e, true)}
                                                treeData={accountOptions}
                                                // onPopupScroll={onPopupScroll}
                                                treeNodeFilterProp="title"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-5 border-b">Wastage</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label>Wastage Accounting</label>
                                            <TreeSelect
                                                showSearch
                                                style={{ width: '100%' }}
                                                value={latestRecord ? latestRecord.wastage_account_id?.code : formData.wastage_account_id}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="Please select wastage account"
                                                allowClear
                                                treeDefaultExpandAll
                                                onChange={(e) => handleChange('wastage_account_id', e, true)}
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
            {!hasInsufficientQuantity() && (
                <Button
                    classes="!mt-6"
                    type={ButtonType.submit}
                    text={loading ? 'loading...' : id ? 'Update Filling' : 'Create Filling'}
                    variant={ButtonVariant.primary}
                />
            )}
        </form>
    );
};

export default FillingForm;
