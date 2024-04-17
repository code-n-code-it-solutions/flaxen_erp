import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {setAuthToken, setContentType} from "@/configs/api.config";
import {getProductAssemblies} from "@/store/slices/productAssemblySlice";
import {clearProductionState, getProductionItems, pendingProductions} from "@/store/slices/productionSlice";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import Alert from "@/components/Alert";
import RawProductItemListing from "@/components/listing/RawProductItemListing";
import Button from "@/components/Button";
import PageWrapper from "@/components/PageWrapper";
import {getIcon} from "@/utils/helper";
import {Input} from "@/components/form/Input";
import {Dropdown} from "@/components/form/Dropdown";
import {clearFillingState, storeFilling} from "@/store/slices/fillingSlice";
import {getWorkingShifts} from "@/store/slices/workingShiftSlice";
import RawProductModal from "@/components/modals/RawProductModal";
import {getFillingProducts} from "@/store/slices/rawProductSlice";
import IconButton from "@/components/IconButton";
import {getUnits} from "@/store/slices/unitSlice";

interface IFormData {
    batch_number: string;
    no_of_quantity: number;
    product_assembly_id: number;
    production_items: any[];
}

const Create = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const {token} = useSelector((state: IRootState) => state.user);
    const {code} = useSelector((state: IRootState) => state.util);
    const {fillingProducts} = useSelector((state: IRootState) => state.rawProduct);
    const {allProductions, productionItems} = useSelector((state: IRootState) => state.production);
    const {filling, success, loading} = useSelector((state: IRootState) => state.filling);
    const {workingShifts} = useSelector((state: IRootState) => state.workingShift);
    const {units} = useSelector((state: IRootState) => state.unit);
    const [formData, setFormData] = useState<any>({})

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

    const breadCrumbItems = [
        {title: 'Home', href: '/main'},
        {title: 'Inventory Dashboard', href: '/inventory'},
        {title: 'All Fillings', href: '/inventory/fillings'},
        {title: 'Create New', href: '#'},
    ];

    const handleChange = (name: string, value: any) => {
        console.log(name, value)
        setFormData({...formData, [name]: value})
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
        dispatch(storeFilling(finalData));
    };

    const handleProductionChange = (e: any) => {
        // if (noOfQuantity > 0) {
        if (e && typeof e !== 'undefined') {
            setAuthToken(token);
            dispatch(clearProductionState());
            setFormData({...formData, production_id: e.value})
            dispatch(getProductionItems(e.value));
            setFillingRemaining(Number(e.production.no_of_quantity))
            setNoOfProductionQty(Number(e.production.no_of_quantity))
        } else {
            setFormData({...formData, production_id: 0})
            setRawProducts([]);
        }
    };

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Create Productions'));
        dispatch(getProductAssemblies());
        dispatch(clearUtilState());
        dispatch(generateCode(FORM_CODE_TYPE.FILLING));
        setRawProducts([])
        dispatch(getWorkingShifts());
        dispatch(pendingProductions());
        dispatch(getFillingProducts(['filling-material', 'packing-material']));
        setRawProducts([])
        setFillingMaterials([])
        dispatch(getUnits());
    }, []);

    useEffect(() => {
        if (filling && success) {
            dispatch(clearFillingState());
            router.push('/inventory/fillings');
        }
    }, [filling, success]);

    useEffect(() => {
        if (allProductions) {
            let options = allProductions.map((production: any) => {
                return {
                    value: production.id,
                    label: production.batch_number,
                    production: production
                };
            });
            setProductionOptions([{value: '', label: 'Select Production'}, ...options]);
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
        <PageWrapper
            breadCrumbItems={breadCrumbItems}
            embedLoader={true}
            loading={false}
        >
            <div className='mt-5'>
                {hasInsufficientQuantity() &&
                    <Alert
                        alertType="error"
                        message={messages}
                        setMessages={setMessages}
                    />}
            </div>
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">Enter Details of Fillings</h5>
                <Button
                    type={ButtonType.link}
                    text={
                        <span className="flex items-center">
                            {getIcon(IconType.back)}
                            Back
                        </span>
                    }
                    variant={ButtonVariant.primary}
                    link="/inventory/fillings"
                />
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="flex w-full flex-row items-start justify-between gap-3">
                    <div className="flex w-full flex-col items-start justify-start space-y-3">
                        <Input
                            divClasses="w-full"
                            label="Filling Code"
                            type="text"
                            name="filling_code"
                            value={formData.filling_code}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            placeholder="Enter Filling Code"
                            isMasked={false}
                            disabled={true}
                        />

                        <Input
                            divClasses="w-full"
                            label="Filling Date"
                            type="date"
                            name="filling_date"
                            value={formData.filling_date}
                            onChange={(e) => handleChange('filling_date', e[0].toLocaleDateString())}
                            placeholder="Enter Filling Date"
                            isMasked={false}
                        />

                        <Input
                            divClasses="w-full"
                            label="Filling Time"
                            type="time"
                            name="filling_time"
                            value={formData.filling_time}
                            onChange={(e) => handleChange('filling_time', e[0].toLocaleTimeString())}
                            placeholder="Enter Filling Time"
                            isMasked={false}
                        />

                        <Dropdown
                            divClasses="w-full"
                            label="Shift"
                            name="filling_shift_id"
                            options={fillingShiftOptions}
                            value={formData.filling_shift_id}
                            onChange={(e: any) => {
                                if (e && typeof e !== 'undefined') {
                                    setFormData({...formData, filling_shift_id: e.value})
                                } else {
                                    handleChange('filling_shift_id', 0)
                                }
                            }}
                        />

                        <Dropdown
                            divClasses="w-full"
                            label="Active Production"
                            name="production_id"
                            options={productionOptions}
                            value={formData.production_id}
                            onChange={(e: any) => handleProductionChange(e)}
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

                <div className="table-responsive">
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
                        text="Submit"
                        variant={ButtonVariant.primary}
                    />
                )}
            </form>
            <RawProductModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                handleSubmit={(data: any) => handleFillingMaterialSubmit(data)}
                detail={modalDetail}
                listFor={RAW_PRODUCT_LIST_TYPE.FILLING}
                fillingRemaining={Number(fillingRemaining)}
            />
        </PageWrapper>
    );
};

export default Create;
