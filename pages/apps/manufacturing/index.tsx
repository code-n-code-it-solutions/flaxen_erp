import React, { Fragment, useEffect, useState } from 'react';
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
import { Tab } from '@headlessui/react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false
});

const Index = () => {
        const dispatch = useAppDispatch();
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
            dispatch(setPageTitle('Manufacturing Dashboard'));
        }, []);

        // columnChartOptions
        const columnChart: any = {
            series: [
                // {
                //     name: 'Net Profit',
                //     data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
                // },
                {
                    name: '# Purchases',
                    data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
                }
            ],
            options: {
                chart: {
                    height: 300,
                    type: 'bar',
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false
                    }
                },
                colors: ['#805dca', '#e7515a'],
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded'
                    }
                },
                grid: {
                    borderColor: isDark ? '#191e3a' : '#e0e6ed'
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                    axisBorder: {
                        color: isDark ? '#191e3a' : '#e0e6ed'
                    }
                },
                yaxis: {
                    opposite: isRtl ? true : false,
                    labels: {
                        offsetX: isRtl ? -10 : 0
                    }
                },
                tooltip: {
                    theme: isDark ? 'dark' : 'light',
                    y: {
                        formatter: function(val: any) {
                            return val;
                        }
                    }
                }
            }
        };

        const vendorChart: any = {
            series: [{
                data: [1380, 1200, 1100, 690, 580, 540, 470, 448, 430, 400]
            }],
            options: {
                chart: {
                    type: 'bar',
                    height: 380
                },
                plotOptions: {
                    bar: {
                        barHeight: '100%',
                        distributed: true,
                        horizontal: true,
                        dataLabels: {
                            position: 'bottom'
                        }
                    }
                },
                colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e',
                    '#f48024', '#69d2e7'
                ],
                dataLabels: {
                    enabled: true,
                    textAnchor: 'start',
                    style: {
                        colors: ['#fff']
                    },
                    formatter: function(val: number, opt: any) {
                        return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val;
                    },
                    offsetX: 0,
                    dropShadow: {
                        enabled: true
                    }
                },
                stroke: {
                    width: 1,
                    colors: ['#fff']
                },
                xaxis: {
                    categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
                        'United States', 'China', 'India'
                    ],
                    labels: {
                        show: false
                    }
                },
                yaxis: {
                    labels: {
                        show: false
                    }
                },
                title: {
                    text: 'Top 10 Vendors',
                    align: 'center',
                    floating: true
                },
                tooltip: {
                    theme: 'dark',
                    x: {
                        show: false
                    },
                    y: {
                        title: {
                            formatter: function() {
                                return '';
                            }
                        }
                    }
                }
            }
        };

        return (
            <div className="">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full mb-5">
                    <h1 className="text-lg">Manufacturing Overview</h1>
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
                            <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total Formulas</div>
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
                                            <Link href="/apps/manufacturing/formula">
                                                <button type="button">Formula List</button>
                                            </Link>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="mt-5 flex items-center">
                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 170.46</div>
                        </div>
                    </div>

                    {/* Sessions */}
                    <div className="panel bg-gradient-to-r from-violet-500 to-violet-400">
                        <div className="flex justify-between">
                            <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total Produced Qty</div>
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
                                            <Link href="/apps/manufacturing/operations/production">
                                                <button type="button">Production</button>
                                            </Link>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="mt-5 flex items-center">
                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">74,137 KG</div>
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
                            <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total Filling Qty</div>
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
                                            <Link href="/apps/manufacturing/operations/fillings">
                                                <button type="button">Fillings</button>
                                            </Link>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="mt-5 flex items-center">
                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">38,085 KG</div>
                        </div>
                        <div className="mt-5 flex items-center font-semibold">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg"
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
                            <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Wastage</div>
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
                                            <Link href="/apps/manufacturing/operations/wastage">
                                                <button type="button">Wastage</button>
                                            </Link>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="mt-5 flex items-center">
                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 49.10 KG</div>
                        </div>
                        <div className="mt-5 flex items-center font-semibold">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg"
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
                    <div className="panel mt-5">
                        <div className="mb-5 text-lg font-bold">Recent Fillings</div>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                <tr>
                                    <th className="ltr:rounded-l-md rtl:rounded-r-md">ID</th>
                                    <th>DATE</th>
                                    <th>Customer</th>
                                    <th>ITEM CODE</th>
                                    <th>CAPACITY</th>
                                    <th>QUANTITY</th>
                                    <th>AMOUNT</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="font-semibold">#01</td>
                                    <td className="whitespace-nowrap">RM-C-001</td>
                                    <td className="whitespace-nowrap">Texanol purchases</td>
                                    <td className="whitespace-nowrap">Raw Material</td>
                                    <td className="whitespace-nowrap">Raw Material</td>
                                    <td className="whitespace-nowrap">Debit</td>
                                    <td>AED 1,358.75</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="panel mt-5">
                        <div className="mb-5 text-lg font-bold">Recent Wastage</div>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                <tr>
                                    <th className="ltr:rounded-l-md rtl:rounded-r-md">ID</th>
                                    <th>DATE</th>
                                    <th>Customer</th>
                                    <th>ITEM CODE</th>
                                    <th>CAPACITY</th>
                                    <th>QUANTITY</th>
                                    <th>AMOUNT</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="font-semibold">#01</td>
                                    <td className="whitespace-nowrap">RM-C-001</td>
                                    <td className="whitespace-nowrap">Texanol purchases</td>
                                    <td className="whitespace-nowrap">Raw Material</td>
                                    <td className="whitespace-nowrap">Raw Material</td>
                                    <td className="whitespace-nowrap">Debit</td>
                                    <td>AED 1,358.75</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
;

Index.getLayout = (page: any) => {
    return <AppLayout>{page}</AppLayout>;
};
export default Index;
