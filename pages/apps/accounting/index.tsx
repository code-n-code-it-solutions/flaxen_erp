import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import { IRootState, useAppDispatch, useAppSelector } from '@/store';
import { Input } from '@/components/form/Input';
import Button from '@/components/Button';
import { ButtonType, ButtonVariant } from '@/utils/enums';
import { BiRefresh } from 'react-icons/bi';
import Dropdown from '@/components/Dropdown';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
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
        dispatch(setPageTitle('Finance'));
    }, []);

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
        // permittedMenus && permittedMenus.find((menu: any) => menu.name === 'Overview') ? (
        <div className="">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full mb-5">
                <h1 className="text-lg">Accounting Overview</h1>
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
            <div className="mb-6 grid grid-cols-2 gap-6 text-white sm:grid-cols-3 xl:grid-cols-4">
                <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Assets</div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 170.46</div>
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
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Liabilities</div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 74,137</div>
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
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Equity</div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 38,085</div>
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
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Operating Income</div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 49.10</div>
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
                <div className="panel bg-gradient-to-r from-sky-500 to-sky-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">CGS</div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 49.10</div>
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
                <div className="panel bg-gradient-to-r from-orange-500 to-orange-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Operating Exp</div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 49.10</div>
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
                <div className="panel bg-gradient-to-r from-violet-500 to-violet-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Non-Opt Income</div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 49.10</div>
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
                <div className="panel bg-gradient-to-r from-indigo-500 to-indigo-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Non-Opt Exp</div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 49.10</div>
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

            <div className="panel h-full w-full">
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

            {/*  Recent Transactions  */}
            <div className="panel mt-5">
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
        // ) : (
        //     <div>
        //         You are not permitted to access review page of this plugin.
        //     </div>
        // )
    );
};


Index.getLayout = (page: any) => {
    return <AppLayout>{page}</AppLayout>;
};
export default Index;
