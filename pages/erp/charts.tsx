import { useEffect, useState } from 'react';
import Link from 'next/link';
import CodeHighlight from '../components/Highlight';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const Charts = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Charts'));
    });
    const [codeArr, setCodeArr] = useState<string[]>([]);

    const toggleCode = (name: string) => {
        if (codeArr.includes(name)) {
            setCodeArr((value) => value.filter((d) => d !== name));
        } else {
            setCodeArr([...codeArr, name]);
        }
    };

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme) === 'dark' ? true : false;
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    });

    // lineChartOptions
    const lineChart: any = {
        series: [
            {
                name: 'Sales',
                data: [45, 55, 75, 25, 45, 110],
            },
        ],
        options: {
            chart: {
                height: 300,
                type: 'line',
                toolbar: false,
            },
            colors: ['#4361EE'],
            tooltip: {
                marker: false,
                y: {
                    formatter(number: number) {
                        return '$' + number;
                    },
                },
            },
            stroke: {
                width: 2,
                curve: 'smooth',
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'],
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -20 : 0,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
        },
    };

    // areaChartOptions
    const areaChart: any = {
        series: [
            {
                name: 'Income',
                data: [16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000, 14000, 17000],
            },
        ],
        options: {
            chart: {
                type: 'area',
                height: 300,
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#805dca'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                curve: 'smooth',
            },
            xaxis: {
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -40 : 0,
                },
            },
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            legend: {
                horizontalAlign: 'left',
            },
            grid: {
                borderColor: isDark ? '#191E3A' : '#E0E6ED',
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light',
            },
        },
    };

    // columnChartOptions
    const columnChart: any = {
        series: [
            {
                name: 'Net Profit',
                data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
            },
            {
                name: 'Revenue',
                data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
            },
        ],
        options: {
            chart: {
                height: 300,
                type: 'bar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#805dca', '#e7515a'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light',
                y: {
                    formatter: function (val: any) {
                        return val;
                    },
                },
            },
        },
    };

    // simpleColumnStackedOptions
    const simpleColumnStacked: any = {
        series: [
            {
                name: 'PRODUCT A',
                data: [44, 55, 41, 67, 22, 43],
            },
            {
                name: 'PRODUCT B',
                data: [13, 23, 20, 8, 13, 27],
            },
        ],
        options: {
            chart: {
                height: 300,
                type: 'bar',
                stacked: true,
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#2196f3', '#3b3f5c'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 5,
                        },
                    },
                },
            ],
            plotOptions: {
                bar: {
                    horizontal: false,
                },
            },
            xaxis: {
                type: 'datetime',
                categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT', '01/05/2011 GMT', '01/06/2011 GMT'],
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -20 : 0,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            legend: {
                position: 'right',
                offsetY: 40,
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light',
            },
            fill: {
                opacity: 0.8,
            },
        },
    };

    // barChartOptions
    const barChart: any = {
        series: [
            {
                name: 'Sales',
                data: [44, 55, 41, 67, 22, 43, 21, 70],
            },
        ],
        options: {
            chart: {
                height: 300,
                type: 'bar',
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
                width: 1,
            },
            colors: ['#4361ee'],
            xaxis: {
                categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                opposite: isRtl ? true : false,
                reversed: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                },
            },
            fill: {
                opacity: 0.8,
            },
        },
    };

    // mixedChartOptions
    const mixedChart: any = {
        series: [
            {
                name: 'TEAM A',
                type: 'column',
                data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
            },
            {
                name: 'TEAM B',
                type: 'area',
                data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
            },
            {
                name: 'TEAM C',
                type: 'line',
                data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
            },
        ],
        options: {
            chart: {
                height: 300,
                // stacked: false,
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
            colors: ['#2196f3', '#00ab55', '#4361ee'],
            stroke: {
                width: [0, 2, 2],
                curve: 'smooth',
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                },
            },
            fill: {
                opacity: [1, 0.25, 1],
            },

            labels: ['01/01/2022', '02/01/2022', '03/01/2022', '04/01/2022', '05/01/2022', '06/01/2022', '07/01/2022', '08/01/2022', '09/01/2022', '10/01/2022', '11/01/2022'],
            markers: {
                size: 0,
            },
            xaxis: {
                type: 'datetime',
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                title: {
                    text: 'Points',
                },
                min: 0,
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            tooltip: {
                shared: true,
                intersect: false,
                theme: isDark ? 'dark' : 'light',
            },
            legend: {
                itemMargin: {
                    horizontal: 4,
                    vertical: 8,
                },
            },
        },
    };

    // radarChartOptions
    const radarChart: any = {
        series: [
            {
                name: 'Series 1',
                data: [80, 50, 30, 40, 100, 20],
            },
        ],
        options: {
            chart: {
                height: 300,
                type: 'radar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#4361ee'],
            xaxis: {
                categories: ['January', 'February', 'March', 'April', 'May', 'June'],
            },
            plotOptions: {
                radar: {
                    polygons: {
                        strokeColors: isDark ? '#191e3a' : '#e0e6ed',
                        connectorColors: isDark ? '#191e3a' : '#e0e6ed',
                    },
                },
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light',
            },
        },
    };

    // pieChartOptions
    const pieChart: any = {
        series: [44, 55, 13, 43, 22],
        options: {
            chart: {
                height: 300,
                type: 'pie',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
            colors: ['#4361ee', '#805dca', '#00ab55', '#e7515a', '#e2a03f'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                    },
                },
            ],
            stroke: {
                show: false,
            },
            legend: {
                position: 'bottom',
            },
        },
    };

    // donutChartOptions
    const donutChart: any = {
        series: [44, 55, 13],
        options: {
            chart: {
                height: 300,
                type: 'donut',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            stroke: {
                show: false,
            },
            labels: ['Team A', 'Team B', 'Team C'],
            colors: ['#4361ee', '#805dca', '#e2a03f'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                    },
                },
            ],
            legend: {
                position: 'bottom',
            },
        },
    };

    // polarAreaChartOptions
    const polarAreaChart: any = {
        series: [14, 23, 21, 17, 15, 10, 12, 17, 21],
        options: {
            chart: {
                height: 300,
                type: 'polarArea',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#4361ee', '#805dca', '#00ab55', '#e7515a', '#e2a03f', '#2196f3', '#3b3f5c'],
            stroke: {
                show: false,
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                    },
                },
            ],
            plotOptions: {
                polarArea: {
                    rings: {
                        strokeColor: isDark ? '#191e3a' : '#e0e6ed',
                    },
                    spokes: {
                        connectorColors: isDark ? '#191e3a' : '#e0e6ed',
                    },
                },
            },
            legend: {
                position: 'bottom',
            },
            fill: {
                opacity: 0.85,
            },
        },
    };

    // radialBarChartOptions
    const radialBarChart: any = {
        series: [44, 55, 41],
        options: {
            chart: {
                height: 300,
                type: 'radialBar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#4361ee', '#805dca', '#e2a03f'],
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            fontSize: '22px',
                        },
                        value: {
                            fontSize: '16px',
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            formatter: function (w: any) {
                                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                                return 249;
                            },
                        },
                    },
                },
            },
            labels: ['Apples', 'Oranges', 'Bananas'],
            fill: {
                opacity: 0.85,
            },
        },
    };

    // bubble chart data
    const generateData = (baseval: any, count: any, yrange: any) => {
        let i = 0;
        const series = [];
        while (i < count) {
            var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
            var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
            var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

            series.push([x, y, z]);
            baseval += 86400000;
            i++;
        }
        return series;
    };

    // bubbleChartOptions
    const bubbleChart: any = {
        series: [
            {
                name: 'Bubble1',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60,
                }),
            },
            {
                name: 'Bubble2',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60,
                }),
            },
        ],
        options: {
            chart: {
                height: 300,
                type: 'bubble',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#4361ee', '#00ab55'],
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                tickAmount: 12,
                type: 'category',
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                max: 70,
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light',
            },
            stroke: {
                colors: isDark ? ['#191e3a'] : ['#e0e6ed'],
            },
            fill: {
                opacity: 0.85,
            },
        },
    };

    return (
        <div>
            <ul className="mb-6 flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="#" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Charts</span>
                </li>
            </ul>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary lg:col-span-2">
                    <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M19.0001 9.7041V9C19.0001 5.13401 15.8661 2 12.0001 2C8.13407 2 5.00006 5.13401 5.00006 9V9.7041C5.00006 10.5491 4.74995 11.3752 4.28123 12.0783L3.13263 13.8012C2.08349 15.3749 2.88442 17.5139 4.70913 18.0116C9.48258 19.3134 14.5175 19.3134 19.291 18.0116C21.1157 17.5139 21.9166 15.3749 20.8675 13.8012L19.7189 12.0783C19.2502 11.3752 19.0001 10.5491 19.0001 9.7041Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path opacity="0.5" d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span className="ltr:mr-3 rtl:ml-3">Documentation: </span>
                    <a href="https://www.npmjs.com/package/react-apexcharts" target="_blank" className="block hover:underline" rel="noreferrer">
                        https://www.npmjs.com/package/react-apexcharts
                    </a>
                </div>

                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Simple Line</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code1')}>
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        {isMounted && <ReactApexChart series={lineChart.series} options={lineChart.options} className="rounded-lg bg-white dark:bg-black" type="line" height={300} width={'100%'} />}
                    </div>
                    {codeArr.includes('code1') && (
                        <CodeHighlight>
                            <pre className="language-typescript">
                                {`import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

{isMounted && <ReactApexChart series={lineChart.series} options={lineChart.options} className="rounded-lg bg-white dark:bg-black" type="line" height={300} width={'100%'} /> }

// lineChartOptions
const lineChart: any = {
    series: [
        {
            name: 'Sales',
            data: [45, 55, 75, 25, 45, 110],
        },
    ],
    options: {
        chart: {
            height: 300,
            type: 'line',
            toolbar: false,
        },
        colors: ['#4361EE'],
        tooltip: {
            marker: false,
            y: {
                formatter(number: number) {
                    return '$' + number;
                },
            },
        },
        stroke: {
            width: 2,
            curve: 'smooth',
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'],
            axisBorder: {
                color: isDark ? '#191e3a' : '#e0e6ed',
            },
        },
        yaxis: {
            opposite: isRtl ? true : false,
            labels: {
                offsetX: isRtl ? -20 : 0,
            },
        },
        grid: {
            borderColor: isDark ? '#191e3a' : '#e0e6ed',
        },
    },
};
`}
                            </pre>
                        </CodeHighlight>
                    )}
                </div>

                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white">Simple Area</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code2')}>
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        {isMounted && <ReactApexChart series={areaChart.series} options={areaChart.options} className="rounded-lg bg-white dark:bg-black" type="area" height={300} width={'100%'} />}
                    </div>
                    {codeArr.includes('code2') && (
                        <CodeHighlight>
                            <pre className="language-typescript">{`import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

{isMounted && <ReactApexChart series={areaChart.series} options={areaChart.options} className="rounded-lg bg-white dark:bg-black" type="area" height={300} width={'100%'} />}

// areaChartOptions
const areaChart: any = {
    series: [
        {
            name: 'Income',
            data: [16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000, 14000, 17000],
        },
    ],
    options: {
        chart: {
            type: 'area',
            height: 300,
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        colors: ['#805dca'],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 2,
            curve: 'smooth',
        },
        xaxis: {
            axisBorder: {
                color: isDark ? '#191e3a' : '#e0e6ed',
            },
        },
        yaxis: {
            opposite: isRtl ? true : false,
            labels: {
                offsetX: isRtl ? -40 : 0,
            },
        },
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        legend: {
            horizontalAlign: 'left',
        },
        grid: {
            borderColor: isDark ? '#191E3A' : '#E0E6ED',
        },
        tooltip: {
            theme: isDark ? 'dark' : 'light',
        },
    },
};`}</pre>
                        </CodeHighlight>
                    )}
                </div>

                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white">Simple Column</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code3')}>
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        {isMounted && <ReactApexChart series={columnChart.series} options={columnChart.options} className="rounded-lg bg-white dark:bg-black" type="bar" height={300} width={'100%'} />}
                    </div>
                    {codeArr.includes('code3') && (
                        <CodeHighlight>
                            <pre className="language-typescript">{`import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

{isMounted && <ReactApexChart series={columnChart.series} options={columnChart.options} className="rounded-lg bg-white dark:bg-black" type="bar" height={300} width={'100%'} />}

// columnChartOptions
const columnChart: any = {
    series: [
        {
            name: 'Net Profit',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        },
        {
            name: 'Revenue',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
        },
    ],
    options: {
        chart: {
            height: 300,
            type: 'bar',
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        colors: ['#805dca', '#e7515a'],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded',
            },
        },
        grid: {
            borderColor: isDark ? '#191e3a' : '#e0e6ed',
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            axisBorder: {
                color: isDark ? '#191e3a' : '#e0e6ed',
            },
        },
        yaxis: {
            opposite: isRtl ? true : false,
            labels: {
                offsetX: isRtl ? -10 : 0,
            },
        },
        tooltip: {
            theme: isDark ? 'dark' : 'light',
            y: {
                formatter: function (val: any) {
                    return val;
                },
            },
        },
    },
};`}</pre>
                        </CodeHighlight>
                    )}
                </div>

                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white">Simple Column Stacked</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code4')}>
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        {isMounted && (
                            <ReactApexChart
                                series={simpleColumnStacked.series}
                                options={simpleColumnStacked.options}
                                className="rounded-lg bg-white dark:bg-black"
                                type="bar"
                                height={300}
                                width={'100%'}
                            />
                        )}
                    </div>
                    {codeArr.includes('code4') && (
                        <CodeHighlight>
                            <pre className="language-typescript">{`import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

{isMounted && <ReactApexChart series={simpleColumnStacked.series} options={simpleColumnStacked.options} className="rounded-lg bg-white dark:bg-black" type="bar" height={300} width={'100%'} />}

// simpleColumnStackedOptions
const simpleColumnStacked: any = {
    series: [
        {
            name: 'PRODUCT A',
            data: [44, 55, 41, 67, 22, 43],
        },
        {
            name: 'PRODUCT B',
            data: [13, 23, 20, 8, 13, 27],
        },
    ],
    options: {
        chart: {
            height: 300,
            type: 'bar',
            stacked: true,
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        colors: ['#2196f3', '#3b3f5c'],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 5,
                    },
                },
            },
        ],
        plotOptions: {
            bar: {
                horizontal: false,
            },
        },
        xaxis: {
            type: 'datetime',
            categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT', '01/05/2011 GMT', '01/06/2011 GMT'],
            axisBorder: {
                color: isDark ? '#191e3a' : '#e0e6ed',
            },
        },
        yaxis: {
            opposite: isRtl ? true : false,
            labels: {
                offsetX: isRtl ? -20 : 0,
            },
        },
        grid: {
            borderColor: isDark ? '#191e3a' : '#e0e6ed',
        },
        legend: {
            position: 'right',
            offsetY: 40,
        },
        tooltip: {
            theme: isDark ? 'dark' : 'light',
        },
        fill: {
            opacity: 0.8,
        },
    },
};`}</pre>
                        </CodeHighlight>
                    )}
                </div>

                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white">Simple Bar</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code5')}>
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        {isMounted && <ReactApexChart series={barChart.series} options={barChart.options} className="rounded-lg bg-white dark:bg-black" type="bar" height={300} width={'100%'} />}
                    </div>
                    {codeArr.includes('code5') && (
                        <CodeHighlight>
                            <pre className="language-typescript">{`import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

{isMounted && <ReactApexChart series={barChart.series} options={barChart.options} className="rounded-lg bg-white dark:bg-black" type="bar" height={300} width={'100%'} />}

// barChartOptions
const barChart: any = {
    series: [
        {
            name: 'Sales',
            data: [44, 55, 41, 67, 22, 43, 21, 70],
        },
    ],
    options: {
        chart: {
            height: 300,
            type: 'bar',
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
            width: 1,
        },
        colors: ['#4361ee'],
        xaxis: {
            categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
            axisBorder: {
                color: isDark ? '#191e3a' : '#e0e6ed',
            },
        },
        yaxis: {
            opposite: isRtl ? true : false,
            reversed: isRtl ? true : false,
        },
        grid: {
            borderColor: isDark ? '#191e3a' : '#e0e6ed',
        },
        plotOptions: {
            bar: {
                horizontal: true,
            },
        },
        fill: {
            opacity: 0.8,
        },
    },
};`}</pre>
                        </CodeHighlight>
                    )}
                </div>

                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white">Mixed</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code6')}>
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        {isMounted && <ReactApexChart series={mixedChart.series} options={mixedChart.options} className="rounded-lg bg-white dark:bg-black" type="bar" height={300} width={'100%'} />}
                    </div>
                    {codeArr.includes('code6') && (
                        <CodeHighlight>
                            <pre className="language-typescript">{`import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

{isMounted && <ReactApexChart series={mixedChart.series} options={mixedChart.options} className="rounded-lg bg-white dark:bg-black" type="bar" height={300} width={'100%'} />}

// mixedChartOptions
const mixedChart: any = {
    series: [
        {
            name: 'TEAM A',
            type: 'column',
            data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
        },
        {
            name: 'TEAM B',
            type: 'area',
            data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
        },
        {
            name: 'TEAM C',
            type: 'line',
            data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
        },
    ],
    options: {
        chart: {
            height: 300,
            // stacked: false,
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
        colors: ['#2196f3', '#00ab55', '#4361ee'],
        stroke: {
            width: [0, 2, 2],
            curve: 'smooth',
        },
        plotOptions: {
            bar: {
                columnWidth: '50%',
            },
        },
        fill: {
            opacity: [1, 0.25, 1],
        },

        labels: ['01/01/2022', '02/01/2022', '03/01/2022', '04/01/2022', '05/01/2022', '06/01/2022', '07/01/2022', '08/01/2022', '09/01/2022', '10/01/2022', '11/01/2022'],
        markers: {
            size: 0,
        },
        xaxis: {
            type: 'datetime',
            axisBorder: {
                color: isDark ? '#191e3a' : '#e0e6ed',
            },
        },
        yaxis: {
            title: {
                text: 'Points',
            },
            min: 0,
            opposite: isRtl ? true : false,
            labels: {
                offsetX: isRtl ? -10 : 0,
            },
        },
        grid: {
            borderColor: isDark ? '#191e3a' : '#e0e6ed',
        },
        tooltip: {
            shared: true,
            intersect: false,
            theme: isDark ? 'dark' : 'light',
        },
        legend: {
            itemMargin: {
                horizontal: 4,
                vertical: 8,
            },
        },
    },
};`}</pre>
                        </CodeHighlight>
                    )}
                </div>

                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white">Basic Radar</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code7')}>
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        {isMounted && <ReactApexChart series={radarChart.series} options={radarChart.options} className="rounded-lg bg-white dark:bg-black" type="radar" height={300} width={'100%'} />}
                    </div>
                    {codeArr.includes('code7') && (
                        <CodeHighlight>
                            <pre className="language-typescript">{`import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

{isMounted && <ReactApexChart series={radarChart.series} options={radarChart.options} className="rounded-lg bg-white dark:bg-black" type="radar" height={300} width={'100%'} />}

// radarChartOptions
const radarChart: any = {
    series: [
        {
            name: 'Series 1',
            data: [80, 50, 30, 40, 100, 20],
        },
    ],
    options: {
        chart: {
            height: 300,
            type: 'radar',
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        colors: ['#4361ee'],
        xaxis: {
            categories: ['January', 'February', 'March', 'April', 'May', 'June'],
        },
        plotOptions: {
            radar: {
                polygons: {
                    strokeColors: isDark ? '#191e3a' : '#e0e6ed',
                    connectorColors: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
        },
        tooltip: {
            theme: isDark ? 'dark' : 'light',
        },
    },
};`}</pre>
                        </CodeHighlight>
                    )}
                </div>

                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white">Basic Pie</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code8')}>
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        {isMounted && <ReactApexChart series={pieChart.series} options={pieChart.options} className="rounded-lg bg-white dark:bg-black" type="pie" height={300} width={'100%'} />}
                    </div>
                    {codeArr.includes('code8') && (
                        <CodeHighlight>
                            <pre className="language-typescript">{`import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

{isMounted && <ReactApexChart series={pieChart.series} options={pieChart.options} className="rounded-lg bg-white dark:bg-black" type="pie" height={300} width={'100%'} />}

// pieChartOptions
const pieChart: any = {
    series: [44, 55, 13, 43, 22],
    options: {
        chart: {
            height: 300,
            type: 'pie',
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        colors: ['#4361ee', '#805dca', '#00ab55', '#e7515a', '#e2a03f'],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                },
            },
        ],
        stroke: {
            show: false,
        },
        legend: {
            position: 'bottom',
        },
    },
};`}</pre>
                        </CodeHighlight>
                    )}
                </div>

                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white">Basic Donut</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code9')}>
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        {isMounted && <ReactApexChart series={donutChart.series} options={donutChart.options} className="rounded-lg bg-white dark:bg-black" type="donut" height={300} width={'100%'} />}
                    </div>
                    {codeArr.includes('code9') && (
                        <CodeHighlight>
                            <pre className="language-typescript">{`import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

{isMounted && <ReactApexChart series={donutChart.series} options={donutChart.options} className="rounded-lg bg-white dark:bg-black" type="donut" height={300} width={'100%'} />}

// donutChartOptions
const donutChart: any = {
    series: [44, 55, 13],
    options: {
        chart: {
            height: 300,
            type: 'donut',
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        stroke: {
            show: false,
        },
        labels: ['Team A', 'Team B', 'Team C'],
        colors: ['#4361ee', '#805dca', '#e2a03f'],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                },
            },
        ],
        legend: {
            position: 'bottom',
        },
    },
};`}</pre>
                        </CodeHighlight>
                    )}
                </div>

                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white">Basic Polar Area</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code10')}>
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        {isMounted && (
                            <ReactApexChart
                                series={polarAreaChart.series}
                                options={polarAreaChart.options}
                                className="rounded-lg bg-white dark:bg-black"
                                type="polarArea"
                                height={300}
                                width={'100%'}
                            />
                        )}
                    </div>
                    {codeArr.includes('code10') && (
                        <CodeHighlight>
                            <pre className="language-typescript">{`import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

{isMounted && <ReactApexChart series={polarAreaChart.series} options={polarAreaChart.options} className="rounded-lg bg-white dark:bg-black" type="polarArea" height={300} width={'100%'} />}

// polarAreaChartOptions
const polarAreaChart: any = {
    series: [14, 23, 21, 17, 15, 10, 12, 17, 21],
    options: {
        chart: {
            height: 300,
            type: 'polarArea',
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        colors: ['#4361ee', '#805dca', '#00ab55', '#e7515a', '#e2a03f', '#2196f3', '#3b3f5c'],
        stroke: {
            show: false,
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                },
            },
        ],
        plotOptions: {
            polarArea: {
                rings: {
                    strokeColor: isDark ? '#191e3a' : '#e0e6ed',
                },
                spokes: {
                    connectorColors: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
        },
        legend: {
            position: 'bottom',
        },
        fill: {
            opacity: 0.85,
        },
    },
};`}</pre>
                        </CodeHighlight>
                    )}
                </div>

                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white">Radial Bar</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code11')}>
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        {isMounted && (
                            <ReactApexChart
                                series={radialBarChart.series}
                                options={radialBarChart.options}
                                className="rounded-lg bg-white dark:bg-black"
                                type="radialBar"
                                height={300}
                                width={'100%'}
                            />
                        )}
                    </div>
                    {codeArr.includes('code11') && (
                        <CodeHighlight>
                            <pre className="language-typescript">{`import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

{isMounted && <ReactApexChart series={radialBarChart.series} options={radialBarChart.options} className="rounded-lg bg-white dark:bg-black" type="radialBar" height={300} width={'100%'} />}

// radialBarChartOptions
const radialBarChart: any = {
    series: [44, 55, 41],
    options: {
        chart: {
            height: 300,
            type: 'radialBar',
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        colors: ['#4361ee', '#805dca', '#e2a03f'],
        grid: {
            borderColor: isDark ? '#191e3a' : '#e0e6ed',
        },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: {
                        fontSize: '22px',
                    },
                    value: {
                        fontSize: '16px',
                    },
                    total: {
                        show: true,
                        label: 'Total',
                        formatter: function (w: any) {
                            // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                            return 249;
                        },
                    },
                },
            },
        },
        labels: ['Apples', 'Oranges', 'Bananas'],
        fill: {
            opacity: 0.85,
        },
    },
};`}</pre>
                        </CodeHighlight>
                    )}
                </div>

                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white">Bubble Chart</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code12')}>
                            <span className="flex items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                    <path
                                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path
                                        d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        {isMounted && (
                            <ReactApexChart series={bubbleChart.series} options={bubbleChart.options} className="rounded-lg bg-white dark:bg-black" type="bubble" height={300} width={'100%'} />
                        )}
                    </div>
                    {codeArr.includes('code12') && (
                        <CodeHighlight>
                            <pre className="language-typescript">{`import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

{isMounted && <ReactApexChart series={bubbleChart.series} options={bubbleChart.options} className="rounded-lg bg-white dark:bg-black" type="bubble" height={300} width={'100%'} />}

// bubbleChartOptions
const bubbleChart: any = {
    series: [
        {
            name: 'Bubble1',
            data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                min: 10,
                max: 60,
            }),
        },
        {
            name: 'Bubble2',
            data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                min: 10,
                max: 60,
            }),
        },
    ],
    options: {
        chart: {
            height: 300,
            type: 'bubble',
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        colors: ['#4361ee', '#00ab55'],
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            tickAmount: 12,
            type: 'category',
            axisBorder: {
                color: isDark ? '#191e3a' : '#e0e6ed',
            },
        },
        yaxis: {
            max: 70,
            opposite: isRtl ? true : false,
            labels: {
                offsetX: isRtl ? -10 : 0,
            },
        },
        grid: {
            borderColor: isDark ? '#191e3a' : '#e0e6ed',
        },
        tooltip: {
            theme: isDark ? 'dark' : 'light',
        },
        stroke: {
            colors: isDark ? ['#191e3a'] : ['#e0e6ed'],
        },
        fill: {
            opacity: 0.85,
        },
    },
};`}</pre>
                        </CodeHighlight>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Charts;
