import React, { useEffect, useState } from 'react';
import PageWrapper from "@/components/PageWrapper";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { IRootState } from "@/store";
import { AnyAction } from "redux";
import GenericTable from "@/components/GenericTable";
import { generatePDF, getIcon, imagePath } from "@/utils/helper";
import { ButtonVariant, IconType } from "@/utils/enums";
import IconButton from "@/components/IconButton";
import Button from "@/components/Button";
import { setPageTitle } from "@/store/slices/themeConfigSlice";
import { storeUnits, getUnits, clearUnitState } from "@/store/slices/unitSlice";
import Image from "next/image";
import UnitFormModal from "@/components/modals/UnitFormModal";
import { setAuthToken, setContentType } from "@/configs/api.config";


const Unit = () => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const { token } = useSelector((state: IRootState) => state.user);
    const { units, loading, success, unit } = useSelector((state: IRootState) => state.unit);
    const [rowData, setRowData] = useState([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [detail, setDetail] = useState<any>({});

    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/main',
        },
        {
            title: 'Inventory Dashboard',
            href: '/inventory',
        },
        {
            title: 'Units',
            href: '#',
        },
    ];

    const handleSubmit = (formData: any) => {
        setAuthToken(token)
        setContentType('multipart/form-data')
        if (Object.keys(detail).length > 0) {
            dispatch(storeUnits({ data: formData, id: detail.id }))
        } else {
            dispatch(storeUnits(formData))
        }
    }

    const colName = ['id', 'name', 'short_name','description','is_active'];
    const header = ['Id',  'Name', 'Short Name','Description', 'Status'];

    useEffect(() => {
        setAuthToken(token)
        setContentType('application/json')
        dispatch(setPageTitle('Units'));
        dispatch(getUnits());
        dispatch(clearUnitState())
        setModalOpen(false)
    }, []);

    useEffect(() => {
        if (unit) {
            setRowData(unit);
        } else {
            setRowData([])
        }
    }, [unit]);

    useEffect(() => {
        if (success && unit) {
            dispatch(getUnits());
            setModalOpen(false);
        }
    }, [success, unit]);

    return (
        <PageWrapper
            embedLoader={false}
            loading={false}
            breadCrumbItems={breadCrumbItems}
        >
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">All Unit</h5>
                <Button
                    text={
                        <span className="flex items-center">
                            {getIcon(IconType.add)}
                            Add New
                        </span>
                    }
                    variant={ButtonVariant.primary}
                    onClick={() => {
                        setModalOpen(true)
                        setDetail({})
                    }}
                />
            </div>
            <GenericTable
                colName={colName}
                header={header}
                rowData={rowData}
                loading={loading}
                exportTitle={'unit' + Date.now()}
                showFooter={rowData.length > 0}
                columns={[
                   
                    {
                        accessor: 'name',
                        title: 'Title',
                        sortable: true,
                        footer: (
                            <div className='flex gap-2 justify-start items-center'>
                                <span>Unit:</span>
                                <span>{rowData.length}</span>
                            </div>
                        )
                    },
                    {
                        accessor: 'short_name.name',
                        title: 'Short name',
                        sortable: true
                    },
                    
                    {
                        accessor: 'description',
                        title: 'Description',
                        sortable: true
                    },
                    {
                        accessor: 'is_active',
                        title: 'Status',
                        render: (row: any) => (
                            <span className={`badge bg-${row.is_active ? 'success' : 'danger'}`}>
                                {row.is_active ? 'Active' : 'Inactive'}
                            </span>
                        ),
                        sortable: true,
                        footer: (
                            <div className="flex justify-start items-center gap-3">
                                <div className='flex gap-2 justify-start items-center'>
                                    <span>Active: </span>
                                    <span>{rowData.reduce((acc: any, item: any) => item.is_active ? acc + 1 : 0, 0)}</span>
                                </div>
                                <div className='flex gap-2 justify-start items-center'>
                                    <span>Not Active: </span>
                                    <span>{rowData.reduce((acc: any, item: any) => !item.is_active ? acc + 1 : 0, 0)}</span>
                                </div>
                            </div>
                        ),
                    },
                    {
                        accessor: 'actions',
                        title: 'Actions',
                        render: (row: any) => (
                            <div className="flex items-center gap-3">
                                <IconButton
                                    icon={IconType.edit}
                                    color={ButtonVariant.primary}
                                    tooltip='Edit'
                                    onClick={() => {
                                        setDetail(row);
                                        setModalOpen(true);
                                    }}
                                />
                            </div>
                        )
                    }
                ]}
            />
            <UnitFormModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                handleSubmit={(formData) => handleSubmit(formData)}
                modalFormData={detail}
            />
        </PageWrapper>
    );
};

export default Unit;
