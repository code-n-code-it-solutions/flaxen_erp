import React, { useEffect, useState } from 'react';
import PageWrapper from "@/components/PageWrapper";
import {useAppDispatch, useAppSelector} from "@/store";
import GenericTable from "@/components/GenericTable";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import IconButton from "@/components/IconButton";
import { setPageTitle } from "@/store/slices/themeConfigSlice";
import { storeUnits, getUnits, clearUnitState } from "@/store/slices/unitSlice";
import UnitFormModal from "@/components/modals/UnitFormModal";
import { setAuthToken, setContentType } from "@/configs/api.config";


const Unit = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector(state => state.user);
    const { units, loading, success, unit } = useAppSelector(state => state.unit);
    const [rowData, setRowData] = useState([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [detail, setDetail] = useState<any>({});

    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/erp/main',
        },
        {
            title: 'Inventory Dashboard',
            href: '/erp/inventory',
        },
        {
            title: 'Units',
            href: '#',
        },
    ];

    const handleSubmit = (formData: any) => {
        setAuthToken(token)
        if (Object.keys(detail).length > 0) {
            dispatch(storeUnits({ data: formData, id: detail.id }))
        } else {
            dispatch(storeUnits(formData))
        }
    }

    useEffect(() => {
        setAuthToken(token)
        setContentType('application/json')
        dispatch(setPageTitle('Units'));
        dispatch(getUnits());
        dispatch(clearUnitState())
        setModalOpen(false)
    }, []);

    useEffect(() => {
        console.log(units);

        if (units) {
            setRowData(units);
        } else {
            setRowData([])
        }
    }, [units]);

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
            title="All Units"
            buttons={[
                {
                    text: 'Add New',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    onClick: () => {
                        setModalOpen(false)
                        setDetail({})
                    }
                }
            ]}
        >
            <GenericTable
                rowData={rowData}
                loading={loading}
                exportTitle={'unit' + Date.now()}
                showFooter={rowData.length > 0}
                columns={[

                    {
                        accessor: 'label',
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
                        accessor: 'actions',
                        title: 'Actions',
                        render: (row: any) => (
                            <div className="flex items-center gap-3">
                                <IconButton
                                    icon={IconType.edit}
                                    color={ButtonVariant.primary}
                                    tooltip='Edit'
                                    onClick={() => {
                                        setModalOpen(true)
                                        // setDetail({})
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
