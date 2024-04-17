import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState} from "@/store";
import {AnyAction} from "redux";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {setAuthToken, setContentType} from "@/configs/api.config";
import {clearProductAssemblyState, getAssemblyItems, getProductAssemblies} from "@/store/slices/productAssemblySlice";
import {clearProductionState, editProduction, updateProduction} from "@/store/slices/productionSlice";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType, RAW_PRODUCT_LIST_TYPE} from "@/utils/enums";
import Alert from "@/components/Alert";
import RawProductItemListing from "@/components/listing/RawProductItemListing";
import Button from "@/components/Button";
import PageWrapper from "@/components/PageWrapper";
import {getIcon} from "@/utils/helper";
import {Input} from "@/components/form/Input";
import {Dropdown} from "@/components/form/Dropdown";

interface IFormData {
    batch_number: string;
    no_of_quantity: number;
    product_assembly_id: number;
    production_items: any[];
}

const Edit = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const router = useRouter();
    const {token} = useSelector((state: IRootState) => state.user);
    const {code} = useSelector((state: IRootState) => state.util);
    const {allProductAssemblies, assemblyItems} = useSelector((state: IRootState) => state.productAssembly);
    const {production, success, productionDetail} = useSelector((state: IRootState) => state.production);

    const [batchNumber, setBatchNumber] = useState('');
    const [noOfQuantity, setNoOfQuantity] = useState<any>(0);
    const [productAssemblyId, setProductAssemblyId] = useState('');
    const [rawProducts, setRawProducts] = useState<any[]>([]);
    const [productAssemblyOptions, setProductAssemblyOptions] = useState<any>([]);
    const [messages, setMessages] = useState("Production can't be proceeding. Please purchase the In-stock quantities.");

    const breadCrumbItems = [
        {title: 'Home', href: '/main'},
        {title: 'Inventory Dashboard', href: '/erp/inventory'},
        {title: 'All Productions', href: '/erp/inventory/productions'},
        {title: 'Update', href: '#'},
    ];

    const hasInsufficientQuantity = () => {
        return rawProducts.some((row) => row.availableQuantity < row.requiredQuantity);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData: IFormData = {
            batch_number: batchNumber,
            no_of_quantity: noOfQuantity,
            product_assembly_id: parseInt(productAssemblyId),
            production_items: rawProducts,
        };
        setAuthToken(token);
        setContentType('application/json');
        dispatch(clearProductAssemblyState());
        dispatch(updateProduction({id: router.query.id, productionData: formData}));
    };

    const handleFormulaChange = (e: any) => {
        if (noOfQuantity > 0) {
            if (e && typeof e !== 'undefined') {
                setProductAssemblyId(e ? e.value : '');
                setAuthToken(token);
                dispatch(clearProductAssemblyState());
                dispatch(getAssemblyItems(e.value));
            } else {
                setProductAssemblyId('');
                setRawProducts([]);
            }
        } else {
            alert('No of Quantity is required');
        }

        if (hasInsufficientQuantity()) {
            setMessages("Production can't be proceeding. Please purchase the In-stock quantities.");
        }
    };

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Edit Productions'));
        dispatch(getProductAssemblies());
        dispatch(clearUtilState());
        dispatch(generateCode(FORM_CODE_TYPE.PRODUCTION));
        setRawProducts([])
        const {id} = router.query;
        if (typeof id === 'string' && id) {
            dispatch(editProduction(parseInt(id)))
        }
    }, [router.query]);

    useEffect(() => {
        if (productionDetail) {

            setBatchNumber(productionDetail.batch_number);
            setNoOfQuantity(productionDetail.no_of_quantity);
            setProductAssemblyId(productionDetail.product_assembly_id);

            setRawProducts(prevState => (
                productionDetail.production_items.map((item: any) => (
                    {
                        raw_product_id: item.raw_product_id,
                        description: item.description,
                        unit_id: item.unit_id,
                        unit_price: parseFloat(item.unit_cost),
                        quantity: parseFloat(item.quantity),
                        available_quantity: parseFloat(item.available_quantity),
                        required_quantity: item.quantity * productionDetail.no_of_quantity,
                        sub_total: item.product.opening_stock_unit_balance * item.quantity * productionDetail.no_of_quantity,
                    }
                ))
            ))
        }
    }, [productionDetail]);

    useEffect(() => {
        if (production && success) {
            dispatch(clearProductionState());
            router.push('/erp/inventory/productions');
        }
    }, [production, success]);

    useEffect(() => {
        if (noOfQuantity > 0) {
            let updatedRawProducts = rawProducts.map((row) => {
                return {
                    ...row,
                    required_quantity: row.quantity * noOfQuantity,
                    sub_total: row.available_quantity * row.quantity * noOfQuantity,
                };
            });
            setRawProducts(updatedRawProducts);
        }
    }, [noOfQuantity]);

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
        if (assemblyItems) {
            let rawProducts = assemblyItems.map((item: any) => {
                return {
                    raw_product_id: item.raw_product_id,
                    description: item.description,
                    unit_id: item.unit_id,
                    unit_price: parseFloat(item.cost),
                    quantity: parseFloat(item.quantity),
                    available_quantity: parseFloat(item.available_stock),
                    required_quantity: item.quantity * noOfQuantity,
                    sub_total: item.product.opening_stock_unit_balance * item.quantity * noOfQuantity,
                };
            });
            setRawProducts(rawProducts);
        }
    }, [assemblyItems]);

    useEffect(() => {
        if (code) {
            setBatchNumber(code[FORM_CODE_TYPE.PRODUCTION]);
        }
    }, [code]);

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
                <h5 className="text-lg font-semibold dark:text-white-light">Update Details of Productions</h5>
                <Button
                    type={ButtonType.link}
                    text={
                        <span className="flex items-center">
                            {getIcon(IconType.back)}
                            Back
                        </span>
                    }
                    variant={ButtonVariant.primary}
                    link="/erp/inventory/productions"
                    size={ButtonSize.small}
                />
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="flex w-full flex-row items-start justify-between gap-3">
                    <div className="flex w-full flex-col items-start justify-start space-y-3">
                        <Input
                            divClasses="w-full"
                            label="Batch Number"
                            type="text"
                            name="batch_number"
                            value={batchNumber}
                            onChange={(e) => setBatchNumber(e.target.value)}
                            placeholder="Enter Batch Number"
                            isMasked={false}
                            disabled={true}
                        />

                        <Input
                            divClasses="w-full"
                            label="No of Quantity (KG)"
                            type="number"
                            name="no_of_quantity"
                            value={noOfQuantity}
                            onChange={(e) => setNoOfQuantity(parseInt(e.target.value) || 0)}
                            placeholder="Enter No of Quantity"
                            isMasked={false}
                        />

                        <Dropdown
                            divClasses="w-full"
                            label="Formula"
                            name="product_assembly_id"
                            options={productAssemblyOptions}
                            value={productAssemblyId}
                            onChange={(e: any) => handleFormulaChange(e)}
                        />

                    </div>
                    <div className="w-full border rounded p-5 hidden md:block">
                        <h5 className="text-lg font-semibold dark:text-white-light mb-3">Production Instructions</h5>
                        <ul className="list-decimal list-inside space-y-1">
                            <li>Make sure production have batch number</li>
                            <li>Choose a formula to produce</li>
                            <li>Enter the number off quantity to produce</li>
                            <li>Check the available quantities of raw products</li>
                            <li>Make sure the available quantities are enough to proceed</li>
                            <li>Make sure required fields are filled</li>
                            <li>Click on the submit button to proceed</li>
                        </ul>
                    </div>
                </div>

                <RawProductItemListing
                    rawProducts={rawProducts}
                    setRawProducts={setRawProducts}
                    type={RAW_PRODUCT_LIST_TYPE.PRODUCTION}
                />


                {!hasInsufficientQuantity() && (
                    <Button
                        classes="!mt-6"
                        type={ButtonType.submit}
                        text="Update"
                        variant={ButtonVariant.primary}
                    />
                )}
            </form>
        </PageWrapper>
    );
};

export default Edit;
