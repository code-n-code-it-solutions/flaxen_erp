import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
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

    return (
        <div className="">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full mb-5">
                <h1 className="text-lg">Inventory Overview</h1>
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
                    <div className="mt-5 flex items-center font-semibold">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                             className="ltr:mr-2 rtl:ml-2">
                            <path
                                opacity="0.5"
                                d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path
                                d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                                stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        From Last Month
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
                    <div className="mt-5 flex items-center font-semibold">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                             className="ltr:mr-2 rtl:ml-2">
                            <path
                                opacity="0.5"
                                d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path
                                d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                                stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        From Last Month
                    </div>
                </div>

                {/*  Time On-Site */}
                <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Cost Value</div>
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
                                        <button type="button">Accounting</button>
                                    </li>
                                    <li>
                                        <button type="button">General Journal</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> AED 38,085</div>
                        <div className="badge bg-white/30">+ 1.35%</div>
                    </div>
                    <div className="mt-5 flex items-center font-semibold">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                             className="ltr:mr-2 rtl:ml-2">
                            <path
                                opacity="0.5"
                                d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path
                                d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                                stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        From Last Month
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
                    <div className="mt-5 flex items-center font-semibold">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                             className="ltr:mr-2 rtl:ml-2">
                            <path
                                opacity="0.5"
                                d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path
                                d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                                stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        From Last Month
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="grid gap-6 xl:grid-flow-row">
                    {/*  Previous Statement  */}
                    <div className="panel overflow-hidden">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-lg font-bold">Product Details</div>
                                <div className="text-success"> Overall All</div>
                            </div>
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
                                    <ul>
                                        <li>
                                            <Link href="/apps/reporting/stocks/raw-materials">
                                                <button type="button">Stock Report</button>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/apps/purchase/grn">
                                                <button type="button">Good Receive Notes</button>
                                            </Link>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div>
                            <div className="rounded-lg bg-white dark:bg-black">
                                {isMounted ? (
                                    <ReactApexChart
                                        series={salesByCategory.series}
                                        options={salesByCategory.options}
                                        type="donut"
                                        height={350}
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
                        <div className="relative mt-10">
                            <div className="absolute -bottom-12 h-24 w-24 ltr:-right-12 rtl:-left-12">
                                <svg className="h-full w-full text-success opacity-20" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="1.5" />
                                    <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="1.5"
                                          strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                                <div>
                                    <div className="text-primary">All Items</div>
                                    <div className="mt-2 text-2xl font-semibold">50,000.00</div>
                                </div>
                                <div>
                                    <div className="text-primary">Low Stock Items</div>
                                    <div className="mt-2 text-2xl font-semibold">15,000.00</div>
                                </div>
                                <div>
                                    <div className="text-primary">No Vendor Bill Items</div>
                                    <div className="mt-2 text-2xl font-semibold">2,500.00</div>
                                </div>
                            </div>
                        </div>
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
        </div>
    );
};

// Index.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default Index;
