import React, { useEffect, useRef, useState } from 'react';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { IRootState, useAppDispatch, useAppSelector } from '@/store';
import {
    clearPurchaseRequisitionState,
    storePurchaseRequest,
    updatePurchaseRequisition
} from '@/store/slices/purchaseRequisitionSlice';
import { clearUtilState, generateCode } from '@/store/slices/utilSlice';
import { ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType, RAW_PRODUCT_LIST_TYPE } from '@/utils/enums';
import 'flatpickr/dist/flatpickr.css';
import { Dropdown } from '@/components/form/Dropdown';
import { Input } from '@/components/form/Input';
import Button from '@/components/Button';
import Swal from 'sweetalert2';
import IconButton from '@/components/IconButton';
import AgGridComponent from '@/components/apps/AgGridComponent';
import { AgGridReact } from 'ag-grid-react';
import { getIcon } from '@/utils/helper';
import { useSelector } from 'react-redux';
import { getAssets } from '@/store/slices/assetSlice';

interface IFormData {
    pr_title: string;
    pr_code: string;
    description: string;
    user_id: number;
    type: string,
    department_id: number | null;
    designation_id: number | null;
    requisition_date: string;
    items: any[];
}

interface IFormProps {
    id?: any;
}

const PurchaseRequestForm = ({ id }: IFormProps) => {
    const dispatch = useAppDispatch();
    const gridRef = useRef<AgGridReact<any>>(null);
    const { token, user } = useAppSelector(state => state.user);
    const { allRawProducts } = useAppSelector(state => state.rawProduct);
    const { purchaseRequestDetail, loading } = useAppSelector(state => state.purchaseRequisition);
    const { code } = useAppSelector(state => state.util);
    const { assets } = useSelector((state: IRootState) => state.asset);

    const [colDefs, setColDefs] = useState<any[]>([]);
    const [requestItems, setRequestItems] = useState<any[]>([]);
    // const [serviceItems, setServiceItems] = useState<IServiceItems[]>([]);
    const [errorMessages, setErrorMessages] = useState<any>({});
    const [formError, setFormError] = useState<string>('');
    const [isFormValid, setIsFormValid] = useState<boolean>(false);

    const [formData, setFormData] = useState<IFormData>({
        pr_title: '',
        pr_code: '',
        description: '',
        user_id: 0,
        type: '',
        department_id: 0,
        designation_id: 0,
        requisition_date: '',
        items: []
    });

    const [requisitionTypeOptions, setRequisitionTypeOptions] = useState<any[]>([
        { value: '', label: 'Select Type' },
        { value: 'Material', label: 'Material' },
        { value: 'Service', label: 'Service' }
    ]);

    const handleRemoveRow = (row: any) => {
        setRequestItems(requestItems.filter((item) => item.id !== row.id && item.raw_product_id === row.raw_product_id));
    };

    useEffect(() => {
        setRequestItems([]);
        let columnDefinitions: any[] = [];
        if (formData.type === 'Material') {
            columnDefinitions = [
                {
                    headerName: 'Product',
                    field: 'raw_product_id',
                    editable: (params: any) => !params.node.rowPinned, // Disable editing in pinned row
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: {
                        values: allRawProducts ? allRawProducts.map((option: any) => option.id) : []
                    },
                    valueFormatter: (params: any) => {
                        if (params.node?.rowPinned) return 'Total';  // No formatting for pinned row, just return 'Total'
                        const selectedOption = allRawProducts?.find((option: any) => option.id === params.value);
                        return selectedOption ? selectedOption.title : '';
                    },
                    cellRenderer: (params: any) => {
                        if (params.node?.rowPinned) return 'Total';  // Show 'Total' for pinned row
                        const selectedOption = allRawProducts?.find((option: any) => option.id === params.value);
                        return selectedOption ? selectedOption.title : '';
                        // let exist = requestItems.find((item: any) => item.raw_product_id === params.value);
                        // if(exist) {
                        //     Swal.fire('Error', 'This product is already added', 'error');
                        // } else {
                        //
                        // }
                    },
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Description',
                    field: 'description',
                    editable: (params: any) => !params.node.rowPinned, // Disable editing in pinned row
                    cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Qty',
                    field: 'quantity',
                    editable: (params: any) => !params.node.rowPinned, // Disable editing in pinned row
                    cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                }
            ];
        } else if (formData.type === 'Service') {
            columnDefinitions = [
                {
                    headerName: 'Asset',
                    field: 'asset_id',
                    editable: (params: any) => !params.node.rowPinned, // Disable editing in pinned row
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: {
                        values: assets ? assets.map((option: any) => option.id) : []
                    },
                    valueFormatter: (params: any) => {
                        if (params.node?.rowPinned) return 'Total';  // No formatting for pinned row, just return 'Total'
                        const selectedOption = assets?.find((option: any) => option.id === params.value);
                        return selectedOption ? selectedOption.name : '';
                    },
                    cellRenderer: (params: any) => {
                        if (params.node?.rowPinned) return 'Total';  // Show 'Total' for pinned row
                        const selectedOption = assets?.find((option: any) => option.id === params.value);
                        return selectedOption ? selectedOption.name : '';
                        // let exist = requestItems.find((item: any) => item.raw_product_id === params.value);
                        // if(exist) {
                        //     Swal.fire('Error', 'This product is already added', 'error');
                        // } else {
                        //
                        // }
                    },
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Service',
                    field: 'service_name',
                    editable: (params: any) => !params.node.rowPinned, // Disable editing in pinned row
                    cellRenderer: (params: any) => params.node?.rowPinned ? '' : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Description',
                    field: 'description',
                    editable: (params: any) => !params.node.rowPinned, // Disable editing in pinned row
                    cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                }
            ];
        }
        setColDefs([
            ...columnDefinitions,
            {
                headerName: '',
                field: 'remove',
                cellRenderer: (params: any) => (
                    !params.node?.rowPinned &&
                    <IconButton
                        color={ButtonVariant.danger}
                        icon={IconType.delete}
                        onClick={() => handleRemoveRow(params.data)}
                    />
                ),
                // minWidth: 50,
                // maxWidth: 50,
                editable: false,
                filter: false,
                floatingFilter: false,
                sortable: false
            }
        ]);
    }, [formData.type]);

    const handleChange = (name: string, value: any, required: boolean) => {

        if (required) {
            if (!value) {
                setErrorMessages((prev: any) => ({ ...prev, [name]: 'This field is required' }));
            } else {
                setErrorMessages((prev: any) => {
                    delete prev[name];
                    return prev;
                });
            }
        }

        switch (name) {
            case 'type':
                if (value && typeof value !== 'undefined') {
                    setFormData(prev => ({
                        ...prev,
                        type: value.value
                    }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        type: ''
                    }));
                }
                break;
            case 'status':
                if (value && typeof value !== 'undefined') {
                    setFormData(prev => ({
                        ...prev,
                        status: value.value
                    }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        status: ''
                    }));
                }
                break;
            default:
                setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
                break;
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token);
        dispatch(generateCode(FORM_CODE_TYPE.PURCHASE_REQUISITION));
        let finalData = {
            ...formData,
            user_id: user.id,
            pr_code: formData.pr_code, // Assuming pr_code is a string
            department_id: user.employee?.department_id,
            designation_id: user.employee?.designation_id,
            items: requestItems
        };
        if (id) {
            dispatch(updatePurchaseRequisition({ id, purchaseRequestData: finalData }));
        } else {
            if (requestItems.length > 0) {
                dispatch(storePurchaseRequest(finalData));
            } else {
                Swal.fire('Error', 'Please select at least one product', 'error');
            }
        }
    };

    useEffect(() => {
        dispatch(clearPurchaseRequisitionState());
        setAuthToken(token);
        setContentType('application/json');
        dispatch(clearUtilState());
        dispatch(getAssets());

        if (id) {
            // dispatch(editPurchaseRequisition(id))
        } else {
            dispatch(generateCode(FORM_CODE_TYPE.PURCHASE_REQUISITION));
        }
    }, []);

    useEffect(() => {
        if (code) {
            setFormData(prev => ({
                ...prev,
                pr_code: code[FORM_CODE_TYPE.PURCHASE_REQUISITION]
            }));
        }
    }, [code]);

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex justify-between items-start gap-5">
                <div className="flex justify-start flex-col items-start space-y-3 w-full">
                    <Input
                        divClasses="w-full"
                        label="Purchase Request Name (Optional)"
                        type="text"
                        name="pr_title"
                        placeholder="Enter Purchase Request Name"
                        value={formData.pr_title}
                        onChange={(e: any) => handleChange(e.target.name, e.target.value, e.target.required)}
                        isMasked={false}
                        styles={{ height: 45 }}
                        required={true}
                        errorMessage={errorMessages.pr_title}
                    />
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3 w-full">
                        <Dropdown
                            divClasses="w-full"
                            label="Requistion Type"
                            name="type"
                            options={requisitionTypeOptions}
                            value={formData.type}
                            onChange={(e: any) => handleChange('type', e, true)}
                            required={true}
                            errorMessage={errorMessages.type}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3 w-full">
                        <Input
                            divClasses="w-full"
                            label="Purchase Request Code"
                            type="text"
                            name="pr_code"
                            placeholder="Enter Purchase Request Code"
                            value={formData.pr_code}
                            onChange={(e: any) => handleChange(e.target.name, e.target.value, e.target.required)}
                            disabled={true}
                            isMasked={false}
                        />

                        <Input
                            divClasses="w-full"
                            label="Requisition Date"
                            type="date"
                            name="requisition_date"
                            placeholder="Select Date"
                            value={formData.requisition_date}
                            onChange={(e: any) => handleChange('requisition_date', e[0].toLocaleDateString(), true)}
                            isMasked={false}
                            required={true}
                            errorMessage={errorMessages.requisition_date}
                        />
                    </div>

                </div>
                <div className="w-full p-5 border rounded hidden md:block">
                    <h1 className="font-bold text-lg mb-3">Instructions</h1>
                    <ul className="list-inside list-decimal space-y-2">
                        <li>Choose the type of requisition you want to create</li>
                        <li>Fill in the required fields</li>
                        <li>Click on the Add Item button to add items to the requisition</li>
                        <li>Click on the Save Purchase Request button to save the requisition</li>
                    </ul>
                </div>
            </div>

            <div className="mt-5 table-responsive">
                <div
                    className="flex mb-3 justify-start items-start md:justify-between md:items-center gap-3 flex-col md:flex-row">
                    <div>
                        <h3 className="text-lg font-semibold">Quotation Items</h3>
                        <span className="mt-1 text-info text-sm italic">Double click cell to enter data</span>
                    </div>

                    {formData.type && (
                        <Button
                            type={ButtonType.button}
                            text={
                                <span className="flex items-center">
                                    {getIcon(IconType.add)}
                                    Add
                                </span>
                            }
                            variant={ButtonVariant.primary}
                            onClick={() => {
                                setRequestItems((prev: any) => {
                                    return [...prev, {
                                        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
                                        name: '',
                                        raw_product_id: 0,
                                        description: '',
                                        quantity: 0
                                    }];
                                });
                            }}
                            size={ButtonSize.small}
                        />
                    )}
                </div>
                <AgGridComponent
                    gridRef={gridRef}
                    data={requestItems}
                    colDefs={colDefs}
                    pagination={false}
                    // pinnedBottomRowData={pinnedBottomRowData}
                    height={400}
                />

            </div>

            <div className="w-full">
                <Button
                    type={ButtonType.submit}
                    text={loading ? 'Loading...' : id ? 'Update Purchase Request' : 'Save Purchase Request'}
                    variant={ButtonVariant.primary}
                    disabled={loading}
                />
            </div>
        </form>
    );
};

export default PurchaseRequestForm;
