import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {setAuthToken, setContentType} from "@/configs/api.config";
import {clearFillingState, storeFilling, updateFilling} from "@/store/slices/fillingSlice";
import {clearProductionState, getProductionItems, pendingProductions} from "@/store/slices/productionSlice";
import {getProductAssemblies} from "@/store/slices/productAssemblySlice";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import {getWorkingShifts} from "@/store/slices/workingShiftSlice";
import {getFillingProducts} from "@/store/slices/rawProductSlice";
import {getUnits} from "@/store/slices/unitSlice";
import Button from "@/components/Button";
import {Input} from "@/components/form/Input";
import {Dropdown} from "@/components/form/Dropdown";
import IconButton from "@/components/IconButton";
import RawProductItemListing from "@/components/listing/RawProductItemListing";
import RawProductModal from "@/components/modals/RawProductModal";

interface IFormProps {
    id?: any;
}

const FillingForm = ({id}: IFormProps) => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector(state => state.user);
    const {code} = useAppSelector(state => state.util);
    const {fillingProducts} = useAppSelector(state => state.rawProduct);
    const {allProductions, productionItems} = useAppSelector(state => state.production);
    const {fillingDetail, loading} = useAppSelector(state => state.filling);
    const {workingShifts} = useAppSelector(state => state.workingShift);
    const {units} = useAppSelector(state => state.unit);
    const [formData, setFormData] = useState<any>({})
    const [validationMessages, setValidationMessages] = useState<any>({})
    const [rawProducts, setRawProducts] = useState<any[]>([]);
    const [productionOptions, setProductionOptions] = useState<any>([]);
    const [fillingShiftOptions, setFillingShiftOptions] = useState<any>([]);
    const [messages, setMessages] = useState("Production can't be proceeding. Please purchase the In-stock quantities.");
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalDetail, setModalDetail] = useState<any>({});
    const [fillingMaterialOptions, setFillingMaterialOptions] = useState<any[]>([]);
    const [unitOptions, setUnitOptions] = useState<any[]>([]);
    const [fillingMaterials, setFillingMaterials] = useState<any[]>([]);
    const [fillingRemaining, setFillingRemaining] = useState<number>(0);
    const [noOfProductionQty, setNoOfProductionQty] = useState<number>(0);


    const handleChange = (name: string, value: any, required: boolean) => {
        if (required && value === '') {
            setValidationMessages({...validationMessages, [name]: 'This field is required.'})
            return;
        } else {
            setValidationMessages((prev: any) => {
                delete prev[name];
                return prev;
            })
        }
        switch (name) {
            case 'filling_shift_id':
            case 'production_id':
                if (value && typeof value !== 'undefined') {
                    if (name === 'production_id') {
                        if (value.value !== '') {
                            setAuthToken(token);
                            dispatch(clearProductionState());
                            dispatch(getProductionItems(value.value));
                            setFillingRemaining(Number(value.production.no_of_quantity))
                            setNoOfProductionQty(Number(value.production.no_of_quantity))
                        }
                    }
                    setFormData({...formData, [name]: value.value})
                } else {
                    if (name === 'production_id') {
                        setFormData({...formData, production_id: 0})
                        setRawProducts([]);
                    }
                    setFormData({...formData, [name]: ''})
                }
                break
            default:
                setFormData({...formData, [name]: value})
                break
        }
    }

    const hasInsufficientQuantity = () => {
        return rawProducts.some((row) => row.available_quantity < row.required_quantity);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const finalData = {
            ...formData,
            filling_items: rawProducts,
            filling_calculation: fillingMaterials
        }
        setAuthToken(token);
        setContentType('application/json');
        dispatch(clearFillingState());
        if (id) {
            dispatch(updateFilling({id, finalData: finalData}))
        } else {
            dispatch(storeFilling(finalData));
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
        dispatch(pendingProductions());
        dispatch(getFillingProducts(['filling-material', 'packing-material']));
        dispatch(getUnits());

        setRawProducts([])
        setFillingMaterials([])
    }, []);

    useEffect(() => {
        if (allProductions) {
            setProductionOptions(allProductions.map((production: any) => (
                {
                    value: production.id,
                    label: production.batch_number,
                    production: production
                }
            )));
        }
    }, [allProductions]);

    useEffect(() => {
        if (units) {
            setUnitOptions([{value: '', label: 'Select Unit'}, ...units]);
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
            setFillingMaterialOptions([{value: '', label: 'Select Material'}, ...options]);
        }
    }, [fillingProducts]);

    useEffect(() => {
        if (workingShifts) {
            let options = workingShifts.map((shift: any) => {
                return {
                    value: shift.id,
                    label: shift.name + ' (' + shift.start_time + ' - ' + shift.end_time + ')',
                };
            });
            setFillingShiftOptions([{value: '', label: 'Select Shift'}, ...options]);
        }
    }, [workingShifts]);

    useEffect(() => {
        if (productionItems) {
            let rawProducts = productionItems.map((item: any) => {
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
        }
    }, [productionItems]);

    useEffect(() => {
        if (code) {
            setFormData({...formData, filling_code: code[FORM_CODE_TYPE.FILLING]})
        }
    }, [code]);

    const handleFillingMaterialSubmit = (data: any) => {
        setFillingMaterials((prev) => {
            let maxId = 0;
            prev.forEach(item => {
                if (item.id > maxId) {
                    maxId = item.id;
                }
            });
            const existingRow = prev.find(row => row.raw_product_id === data.raw_product_id);
            if (existingRow) {
                return prev.map(row => row.raw_product_id === data.raw_product_id ? data : row);
            } else {
                setFillingRemaining(fillingRemaining - data.filling_quantity);
                return [...prev, {...data, id: maxId + 1}];
            }
        });
        setModalOpen(false)
    }

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
                        label="Active Production"
                        name="production_id"
                        options={productionOptions}
                        value={formData.production_id}
                        onChange={(e: any) => handleChange('production_id', e, true)}
                        required={true}
                        errorMessage={validationMessages.filling_shift_id}
                    />

                </div>
                <div className="w-full border rounded p-5 hidden md:block">
                    <h5 className="text-lg font-semibold dark:text-white-light mb-3">Filling Instructions</h5>
                    <ul className="list-decimal list-inside space-y-2">
                        <li>Enter the Filling Code, Date, Time, and Shift</li>
                        <li>Select the Pending Production</li>
                        <li>Enter the Filling and Packing Material Detail</li>
                        <li>Double check production materials</li>
                        <li>Make sure to not leave any required field</li>
                        <li>Click on the Submit button</li>
                    </ul>
                </div>
            </div>

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
                            setModalOpen(true)
                            setModalDetail({})
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
                                                    setFillingMaterials(fillingMaterials.filter((item) => item.raw_product_id !== row.raw_product_id))
                                                    if (index === 0) {
                                                        setFillingRemaining(noOfProductionQty)
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
                    {fillingMaterials.length > 0 && (
                        <tfoot>
                        <tr>
                            <td colSpan={2} className="text-center">Total</td>
                            <td>{fillingMaterials.reduce((acc, item) => acc + item.unit_price, 0)}</td>
                            <td>{fillingMaterials.reduce((acc, item) => acc + item.quantity, 0)}</td>
                            <td>{fillingMaterials.reduce((acc, item) => acc + item.capacity, 0)}</td>
                            <td>{fillingMaterials.reduce((acc, item) => acc + item.filling_quantity, 0)}</td>
                            <td>{fillingMaterials.reduce((acc, item) => acc + item.required_quantity, 0)}</td>
                            <td>{fillingMaterials.reduce((acc, item) => acc + item.total_cost, 0)}</td>
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


            {!hasInsufficientQuantity() && (
                <Button
                    classes="!mt-6"
                    type={ButtonType.submit}
                    text={loading ? 'loading...' : id ? 'Update Filling' : 'Create Filling'}
                    variant={ButtonVariant.primary}
                />
            )}

            <RawProductModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                handleSubmit={(data: any) => handleFillingMaterialSubmit(data)}
                detail={modalDetail}
                listFor={RAW_PRODUCT_LIST_TYPE.FILLING}
                fillingRemaining={Number(fillingRemaining)}
            />
        </form>
    );
};

export default FillingForm;
