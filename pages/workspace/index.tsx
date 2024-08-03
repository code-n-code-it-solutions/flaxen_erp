import React, { useEffect, useState } from 'react';
import { IRootState, useAppDispatch, useAppSelector } from '@/store';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import Link from 'next/link';
import Dropdown from '@/components/Dropdown';
import dynamic from 'next/dynamic';
import { Input } from '@/components/form/Input';
import Button from '@/components/Button';
import { ButtonType, ButtonVariant } from '@/utils/enums';
import { BiRefresh } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import WorkspaceLayout from '@/components/Layouts/WorkspaceLayout';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false
});

const Index = () => {
    const dispatch = useAppDispatch()
    const { permittedMenus } = useAppSelector((state) => state.menu);
    const [isMounted, setIsMounted] = useState(false);
    const [formData, setFormData] = useState<any>({});

    const isRtl = useAppSelector((state) => state.themeConfig.rtlClass) === 'rtl';
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme) === 'dark';

    const handleChange = (key: string, value: any) => {
        setFormData({
            [key]: value
        });
    };

    useEffect(() => {
        setIsMounted(true);
        dispatch(setPageTitle('Inventory Dashboard'));
    }, []);

    const salesByCategory: any = {
        series: [737, 270],
        options: {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif'
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff'
            },
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2
                },
                height: 50,
                offsetY: 20
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                }
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(function(a: any, b: any) {
                                        return a + b;
                                    }, 0);
                                }
                            }
                        }
                    }
                }
            },
            labels: ['Active Items', 'Not Active Items'],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15
                    }
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15
                    }
                }
            }
        }
    };

    //Revenue Chart
    const revenueChart: any = {
        series: [
            {
                name: 'Income',
                data: [16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000, 14000, 17000],
            },
            {
                name: 'Expenses',
                data: [16500, 17500, 16200, 17300, 16000, 19500, 16000, 17000, 16000, 19000, 18000, 19000],
            },
        ],
        options: {
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },

            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            colors: isDark ? ['#2196F3', '#E7515A'] : ['#1B55E2', '#E7515A'],
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: 6,
                        fillColor: '#1B55E2',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 1,
                        dataPointIndex: 5,
                        fillColor: '#E7515A',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                ],
            },
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis: {
                tickAmount: 7,
                labels: {
                    formatter: (value: number) => {
                        return value / 1000 + 'K';
                    },
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191E3A' : '#E0E6ED',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                yaxis: {
                    lines: {
                        show: true,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                x: {
                    show: false,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
        },
    };

    return (
        <div className="">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full mb-5">
                <h1 className="text-lg">Overall Dashboard</h1>
                <div className="flex flex-col md:flex-row gap-3">
                    <Input
                        divClasses="w-full flex items-center gap-3"
                        label="From"
                        labelClassName="m-0"
                        type="date"
                        name="from_date"
                        value={formData.from_date}
                        onChange={(e) => handleChange('from_date', e[0] ? e[0].toLocaleDateString() : '')}
                        placeholder="Enter From Date"
                        isMasked={false}
                    />
                    <Input
                        divClasses="w-full flex items-center gap-3"
                        labelClassName="m-0"
                        label="To"
                        type="date"
                        name="to_date"
                        value={formData.to_date}
                        onChange={(e) => handleChange('to_date', e[0] ? e[0].toLocaleDateString() : '')}
                        placeholder="Enter To Date"
                        isMasked={false}
                    />
                    <Button
                        type={ButtonType.button}
                        text={<BiRefresh size={18} />}
                        variant={ButtonVariant.primary}
                        onClick={() => console.log('refresh')}
                    />
                </div>
            </div>
            <div className="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2 xl:grid-cols-4">
                <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total Products</div>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={
                                    <svg className="h-5 w-5 opacity-70" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor"
                                                strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }
                            >
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <Link href="/apps/inventory/products">
                                            <button type="button">Product List</button>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/apps/reporting/stocks/raw-materials">
                                            <button type="button">Stock Report</button>
                                        </Link>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 170.46</div>
                        <div className="badge bg-white/30">+ 2.35%</div>
                    </div>
                </div>

                {/* Sessions */}
                <div className="panel bg-gradient-to-r from-violet-500 to-violet-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Finish Goods</div>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={
                                    <svg className="h-5 w-5 opacity-70" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor"
                                                strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }
                            >
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <Link href="/apps/inventory/finish-goods">
                                            <button type="button">Finish Good List</button>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/apps/reporting/stocks/finish-goods">
                                            <button type="button">Stock Report</button>
                                        </Link>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 74,137</div>
                        <div className="badge bg-white/30">- 2.35%</div>
                    </div>
                </div>

                {/*  Time On-Site */}
                <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Cost Value</div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> AED 38,085</div>
                        <div className="badge bg-white/30">+ 1.35%</div>
                    </div>
                </div>

                {/* Bounce Rate */}
                <div className="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total Purchases</div>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={
                                    <svg className="h-5 w-5 opacity-70" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor"
                                                strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }
                            >
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <Link href="/apps/inventory/products">
                                            <button type="button">Product List</button>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/apps/reporting/stocks/raw-materials">
                                            <button type="button">Stock Report</button>
                                        </Link>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 49.10%</div>
                        <div className="badge bg-white/30">- 0.35%</div>
                    </div>
                </div>

                <div className="panel bg-gradient-to-r from-indigo-500 to-indigo-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total Employees</div>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={
                                    <svg className="h-5 w-5 opacity-70" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor"
                                                strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }
                            >
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <Link href="/apps/employees/employee-list">
                                            <button type="button">Employee list</button>
                                        </Link>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 49.10%</div>
                        <div className="badge bg-white/30">- 0.35%</div>
                    </div>
                </div>

                <div className="panel bg-gradient-to-r from-orange-500 to-orange-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total Expenses</div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">AED 49.10</div>
                        <div className="badge bg-white/30">- 0.35%</div>
                    </div>
                </div>

                <div className="panel bg-gradient-to-r from-green-500 to-green-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total Sales</div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">AED 49.10</div>
                        <div className="badge bg-white/30">- 0.35%</div>
                    </div>
                </div>

                <div className="panel bg-gradient-to-r from-gray-500 to-gray-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total Earnings</div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">AED 49.10</div>
                        <div className="badge bg-white/30">- 0.35%</div>
                    </div>
                </div>
            </div>

            <div className="panel h-full w-full mb-6">
                <div className="mb-5 flex items-center justify-between dark:text-white-light">
                    <h5 className="text-lg font-semibold">Revenue</h5>
                </div>
                <p className="text-lg dark:text-white-light/90">
                    Total Profit <span className="ml-2 text-primary">AED 10,840</span>
                </p>
                <div className="relative">
                    <div className="rounded-lg bg-white dark:bg-black">
                        {isMounted ? (
                            <ReactApexChart
                                series={revenueChart.series}
                                options={revenueChart.options}
                                type="area"
                                height={325}
                                width={'100%'}
                            />
                        ) : (
                            <div
                                className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                <span
                                    className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-6">
                <div className="panel">
                    <div className="mb-5 text-lg font-bold">Recent Sales</div>
                    <div className="table-responsive">
                        <table>
                            <thead>
                            <tr>
                                <th className="ltr:rounded-l-md rtl:rounded-r-md">ID</th>
                                <th>DATE</th>
                                <th>Product</th>
                                <th>AMOUNT</th>
                                <th className="text-center ltr:rounded-r-md rtl:rounded-l-md">STATUS</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="font-semibold">#01</td>
                                <td className="whitespace-nowrap">Oct 08, 2024</td>
                                <td className="whitespace-nowrap">Texanol</td>
                                <td>AED 1,358.75</td>
                                <td className="text-center">
                                    <span
                                        className="badge rounded-full bg-success/20 text-success hover:top-0">Completed</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold">#02</td>
                                <td className="whitespace-nowrap">Dec 18, 2024</td>
                                <td className="whitespace-nowrap">Nitrosol</td>
                                <td>AED 1,042.82</td>
                                <td className="text-center">
                                    <span className="badge rounded-full bg-info/20 text-info hover:top-0">
                                        In Process
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold">#03</td>
                                <td className="whitespace-nowrap">Dec 25, 2021</td>
                                <td className="whitespace-nowrap">A40</td>
                                <td>AED 1,828.16</td>
                                <td className="text-center">
                                    <span
                                        className="badge rounded-full bg-danger/20 text-danger hover:top-0">In
                                        Process</span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/*  Recent Transactions  */}
                <div className="panel">
                    <div className="mb-5 text-lg font-bold">Recent Purchases</div>
                    <div className="table-responsive">
                        <table>
                            <thead>
                            <tr>
                                <th className="ltr:rounded-l-md rtl:rounded-r-md">ID</th>
                                <th>DATE</th>
                                <th>Product</th>
                                <th>AMOUNT</th>
                                <th className="text-center ltr:rounded-r-md rtl:rounded-l-md">STATUS</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="font-semibold">#01</td>
                                <td className="whitespace-nowrap">Oct 08, 2024</td>
                                <td className="whitespace-nowrap">Texanol</td>
                                <td>AED 1,358.75</td>
                                <td className="text-center">
                                    <span
                                        className="badge rounded-full bg-success/20 text-success hover:top-0">Completed</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold">#02</td>
                                <td className="whitespace-nowrap">Dec 18, 2024</td>
                                <td className="whitespace-nowrap">Nitrosol</td>
                                <td>AED 1,042.82</td>
                                <td className="text-center">
                                    <span className="badge rounded-full bg-info/20 text-info hover:top-0">
                                        In Process
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold">#03</td>
                                <td className="whitespace-nowrap">Dec 25, 2021</td>
                                <td className="whitespace-nowrap">A40</td>
                                <td>AED 1,828.16</td>
                                <td className="text-center">
                                    <span
                                        className="badge rounded-full bg-danger/20 text-danger hover:top-0">In
                                        Process</span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="panel w-full">
                <div className="mb-5 text-lg font-bold">Recent Transactions</div>
                <div className="table-responsive">
                    <table>
                        <thead>
                        <tr>
                            <th className="ltr:rounded-l-md rtl:rounded-r-md">ID</th>
                            <th>DATE</th>
                            <th>DOCUMENT #</th>
                            <th>NARRATION</th>
                            <th>SOURCE</th>
                            <th>TRANSACTION TYPE</th>
                            <th>AMOUNT</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="font-semibold">#01</td>
                            <td className="whitespace-nowrap">RM-C-001</td>
                            <td className="whitespace-nowrap">Texanol purchases</td>
                            <td className="whitespace-nowrap">Raw Material</td>
                            <td className="whitespace-nowrap">Debit</td>
                            <td>AED 1,358.75</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

Index.getLayout = (page: any) => <WorkspaceLayout>{page}</WorkspaceLayout>;
export default Index;
