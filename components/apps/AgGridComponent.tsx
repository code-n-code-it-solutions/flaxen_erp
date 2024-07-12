import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { useAppSelector } from '@/store';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { FiltersToolPanelModule } from '@ag-grid-enterprise/filter-tool-panel';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { MasterDetailModule } from "@ag-grid-enterprise/master-detail";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    ColumnsToolPanelModule,
    FiltersToolPanelModule,
    MenuModule,
    SetFilterModule,
    MasterDetailModule,
    RangeSelectionModule,
    RowGroupingModule
]);

interface IProps {
    data: any;
    colDefs: any[];
    onRowDoubleClicked?: (params: any) => void;
    onRowClicked?: (params: any) => void;
    pagination?: boolean;
    paginationPageSize?: number;
    paginationPageSizeSelector?: number[];
    rowMultiSelectWithClick?: boolean;
    rowSelection?: any;
    onSelectionChangedRows?: (rows: any) => void;
    detailCellRendererParams?: any;
    autoGroupColumnDef?: any;
    onFirstDataRendered?: (params: any) => void;
    gridRef?: any;
    grandTotalRow?: any;
    pinnedBottomRowData?: any;
}

const AgGridComponent = ({
                             data,
                             colDefs,
                             onRowDoubleClicked,
                             onRowClicked,
                             pagination = true,
                             paginationPageSize = 10,
                             paginationPageSizeSelector = [10, 20, 50, 100],
                             rowMultiSelectWithClick = false,
                             rowSelection,
                             onSelectionChangedRows,
                             detailCellRendererParams,
                             autoGroupColumnDef,
                             onFirstDataRendered,
                             gridRef,
                             grandTotalRow,
                             pinnedBottomRowData
                         }: IProps) => {

    const themeConfig = useAppSelector((state) => state.themeConfig);
    const [rowData, setRowData] = useState([]);
    const gridStyle = useMemo(() => ({ height: 600, width: '100%' }), []);
    const defaultColDef = useMemo<any>(() => {
        return {
            initialWidth: 100,
            suppressSizeToFit: false,
            flex: 1,
            resizable: false,
            filter: true,
            suppressMovable: true,
            domLayout: 'autoHeight',
            floatingFilter: true
        };
    }, []);

    const gridOptions = {
        // other grid options
        sideBar: {
            toolPanels: [
                {
                    id: 'filters',
                    labelDefault: 'Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    toolPanel: 'agFiltersToolPanel'
                }
                // other tool panels
            ],
            defaultToolPanel: 'filters'
        }
    };

    const onGridReady = useCallback((params: any) => {
        const filtersToolPanel = params.api.getToolPanelInstance('filters');
        params.api.sizeColumnsToFit();
        if (filtersToolPanel) {
            filtersToolPanel.expandFilters();
        } else {
            console.error('Filters tool panel instance is not available');
        }
        if (data) {
            setRowData(data);
        }
    }, [data]);

    const onSelectionChanged = useCallback(() => {
        const selectedRows = gridRef.current!.api.getSelectedRows();
        onSelectionChangedRows && onSelectionChangedRows(selectedRows);
    }, []);

    useEffect(() => {
        if (data) {
            setRowData(data);
        }
    }, [data]);

    return (
        <div
            style={gridStyle}
            className={
                themeConfig.isDarkMode ? 'ag-theme-quartz-dark table-responsive' : 'ag-theme-quartz table-responsive'
            }
        >
            <AgGridReact
                ref={gridRef}
                suppressRowClickSelection={true}
                gridOptions={gridOptions}
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                suppressServerSideFullWidthLoadingRow={false}
                // suppressRowClickSelection
                cacheBlockSize={5}
                maxBlocksInCache={0}
                rowBuffer={0}
                maxConcurrentDatasourceRequests={1}
                blockLoadDebounceMillis={200}
                onRowDoubleClicked={onRowDoubleClicked}
                onRowClicked={onRowClicked}
                pagination={pagination}
                paginationPageSize={paginationPageSize}
                paginationPageSizeSelector={paginationPageSizeSelector}
                rowMultiSelectWithClick={rowMultiSelectWithClick}
                rowSelection={rowSelection}
                onSelectionChanged={onSelectionChanged}
                detailCellRendererParams={detailCellRendererParams}
                autoGroupColumnDef={autoGroupColumnDef}
                onFirstDataRendered={onFirstDataRendered}
                sideBar={'filters'}
                grandTotalRow={grandTotalRow}
                pinnedBottomRowData={pinnedBottomRowData}
            />
        </div>
    );
};

export default AgGridComponent;
