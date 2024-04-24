import React, {useEffect, useState} from 'react';
import {DataTable, DataTableSortStatus} from "mantine-datatable";
import sortBy from 'lodash/sortBy';
import {getIcon} from "@/utils/helper";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import Button from "@/components/Button";

interface NavigatorWithSaveBlob extends Navigator {
    msSaveBlob?: (blob: Blob, fileName: string) => boolean;
}

interface IGenericTableProps {
    rowData: any[];
    columns: any[];
    loading: boolean;
    exportTitle: string;
    showFooter?: boolean;
    isAdvanced?: boolean;
    rowStyle?: any;
}

const GenericTable = ({
                          columns,
                          rowData,
                          loading,
                          exportTitle,
                          showFooter = false,
                          isAdvanced = true,
                          rowStyle
                      }: IGenericTableProps) => {
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState<any>([]);
    const [recordsData, setRecordsData] = useState<any>([]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });

    useEffect(() => {
        setInitialRecords(sortBy(rowData, sortStatus.columnAccessor));
    }, [rowData]);

    useEffect(() => {
        setRecordsData(initialRecords)
    }, [initialRecords]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        const searchLower = search.toLowerCase();
        const searchableColumns = columns.filter((col) => col.searchable !== false).map((col) => col.accessor);

        setInitialRecords(rowData.filter((item) =>
            searchableColumns.some((col) => {
                const value = item[col];
                return value && value.toString().toLowerCase().includes(searchLower);
            })
        ));
    }, [search, rowData, columns]);

    useEffect(() => {
        const sortedData = sortBy(rowData, sortStatus.columnAccessor);
        const orderedData = sortStatus.direction === 'desc' ? sortedData.reverse() : sortedData;
        setInitialRecords(orderedData);
    }, [rowData, sortStatus.columnAccessor, sortStatus.direction]);

    const renderToString = (node: React.ReactNode): string => {
        if (typeof node === 'string') {
            return node;
        }
        if (React.isValidElement(node)) {
            return node.props.children;
        }
        return String(node);
    };

    const exportToCSV = () => {
        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const headers = columns.map((column) => column.title || column.accessor).filter(column => column !== 'Actions').join(columnDelimiter);
        const rows = rowData.map((row) => {
            return columns.map((column) => {
                if (column.title === 'Actions') {
                    return '';
                }
                const value = column.render ? renderToString(column.render(row)) : row[column.accessor];
                const formattedValue = ('' + value).replace(/(\r\n|\n|\r)/gm, "").replace(/,/g, '');
                return `"${formattedValue}"`;
            }).join(columnDelimiter);
        });
        const csvContent = [headers, ...rows].join(lineDelimiter);
        const filename = `${exportTitle.replace(/\s+/g, '_')}.csv`;
        const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
        const navigatorWithSaveBlob = navigator as NavigatorWithSaveBlob;
        if (navigatorWithSaveBlob.msSaveBlob) {
            navigatorWithSaveBlob.msSaveBlob(blob, filename);
        } else {
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    const printTable = () => {
        let printWindow = window.open('', '_blank');
        const headers = columns.map((column) => `<th>${column.title || column.accessor}</th>`).filter(column => column !== '<th>Actions</th>').join('');
        const rows = rowData.map((item) => {
            const rowCells = columns.map((column) => {
                if (column.title === 'Actions') {
                    return '';
                }
                const value = column.render ? renderToString(column.render(item)) : item[column.accessor];
                return `<td>${value}</td>`;
            }).join('');

            return `<tr>${rowCells}</tr>`;
        }).join('');

        const html = `
            <html lang="en">
            <head>
              <title>Print table</title>
              <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <table>
                <thead><tr>${headers}</tr></thead>
                <tbody>${rows}</tbody>
              </table>
              <script>
                window.onload = () => window.print();
              </script>
            </body>
            </html>
          `;

        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.focus();
        }
    };

    const exportTableAsTxt = () => {

        const lineDelimiter = '\n';
        const headers = columns.map((column) => column.title || column.accessor).filter(column => column !== 'Actions').join('\t');
        const rows = rowData.map((item) => {
            return columns.map((column) => {
                if (column.title === 'Actions') {
                    return '';
                }
                const value = column.render ? renderToString(column.render(item)) : item[column.accessor];
                // Ensure that we don't have any line breaks or additional tabs in the values
                return ('' + value).replace(/(\r\n|\n|\r)/gm, " ").replace(/\t/g, " ");
            }).join('\t');
        });
        const txtContent = [headers, ...rows].join(lineDelimiter);
        const filename = `${exportTitle.replace(/\s+/g, '_')}.txt`;
        const blob = new Blob([txtContent], {type: 'text/plain;charset=utf-8;'});
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = filename;
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const exportTableAsJSON = () => {
        const dataToExport = rowData.map((row) => {
            const rowObj: { [key: string]: any } = {};
            columns.forEach((column) => {
                if (column.title !== 'Actions') {
                    rowObj[column.accessor] = row[column.accessor];
                }
            });
            return rowObj;
        });
        const jsonString = JSON.stringify(dataToExport, null, 2);
        const filename = `${exportTitle.replace(/\s+/g, '_')}.json`;
        const blob = new Blob([jsonString], {type: 'application/json;charset=utf-8;'});
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = filename;
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const indexColumn = () => {
        const index = {
            accessor: 'id',
            title: '#',
            render: (row: any, index: number) => (
                <span>{index + 1}</span>
            ),
            sortable: true
        }
        return showFooter
            ? {...index, footer: 'Total'}
            : index
    }

    return (
        <>
            {isAdvanced && (
                <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div className="flex flex-wrap gap-1 items-center">
                        <Button
                            type={ButtonType.button}
                            text={
                                <span className="flex justify-center items-center gap-1">
                                    {getIcon(IconType.simpleFile)}
                                    CSV
                                </span>
                            }
                            variant={ButtonVariant.primary}
                            size={ButtonSize.small}
                            onClick={() => exportToCSV()}
                            tooltip="Export as CSV"
                        />

                        <Button
                            type={ButtonType.button}
                            text={
                                <span className="flex justify-center items-center gap-1">
                                    {getIcon(IconType.fileWithData)}
                                    TXT
                                </span>
                            }
                            variant={ButtonVariant.primary}
                            size={ButtonSize.small}
                            onClick={() => exportTableAsTxt()}
                            tooltip="Export as TXT"
                        />

                        <Button
                            type={ButtonType.button}
                            text={
                                <span className="flex justify-center items-center gap-1">
                                    {getIcon(IconType.fileWithCode)}
                                    JSON
                                </span>
                            }
                            variant={ButtonVariant.primary}
                            size={ButtonSize.small}
                            onClick={() => exportTableAsJSON()}
                            tooltip="Export as JSON"
                        />

                        <Button
                            type={ButtonType.button}
                            text={
                                <span className="flex justify-center items-center gap-1">
                                    {getIcon(IconType.print)}
                                    Print
                                </span>
                            }
                            variant={ButtonVariant.primary}
                            size={ButtonSize.small}
                            onClick={() => printTable()}
                            tooltip="Print table"
                        />
                    </div>

                    <input type="text" className="form-input w-auto" placeholder="Search..." value={search}
                           onChange={(e) => setSearch(e.target.value)}/>
                </div>
            )}
            <div className="datatables">
                <DataTable
                    highlightOnHover
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        indexColumn(),
                        ...columns
                    ]}
                    totalRecords={initialRecords.length}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={(p) => setPage(p)}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    minHeight={200}
                    paginationWithEdges={true}
                    loaderBackgroundBlur={6}
                    fetching={loading}
                    rowStyle={rowStyle}
                    paginationText={({
                                         from,
                                         to,
                                         totalRecords
                                     }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                />
            </div>
        </>
    )
}

export default GenericTable;
