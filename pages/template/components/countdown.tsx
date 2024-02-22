import Link from 'next/link';
import { useState, useEffect } from 'react';
import CodeHighlight from '../../components/Highlight';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/slices/themeConfigSlice';

const Countdown = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Countdown'));
    });

    const [codeArr, setCodeArr] = useState<string[]>([]);
    const toggleCode = (name: string) => {
        if (codeArr.includes(name)) {
            setCodeArr((value) => value.filter((d) => d !== name));
        } else {
            setCodeArr([...codeArr, name]);
        }
    };

    const [demo1, setDemo1] = useState<any>({ days: null, hours: null, minutes: null, seconds: null });
    const [timer1, setTimer1] = useState<any>(null);

    const setTimerDemo1 = () => {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        const countDownDate = date.getTime();

        let updatedValue: any = {};
        setTimer1(
            setInterval(() => {
                const now = new Date().getTime();

                const distance = countDownDate - now;

                updatedValue.days = Math.floor(distance / (1000 * 60 * 60 * 24));
                updatedValue.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                updatedValue.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                updatedValue.seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setDemo1((demo1: any) => ({
                    ...demo1,
                    ...updatedValue,
                }));

                if (distance < 0) {
                    clearInterval(timer1);
                }
            })
        );
    };

    useEffect(() => {
        setTimerDemo1();
        setTimerDemo2();
    }, []);

    const [demo2, setDemo2] = useState<any>({ days: null, hours: null, minutes: null, seconds: null });
    const [timer2, setTimer2] = useState<any>(null);

    const setTimerDemo2 = () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        const countDownDate = date.getTime();

        let updatedValue: any = {};

        setTimer2(
            setInterval(() => {
                const now = new Date().getTime();
                const distance = countDownDate - now;
                updatedValue.days = Math.floor(distance / (1000 * 60 * 60 * 24));
                updatedValue.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                updatedValue.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                updatedValue.seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setDemo2((demo2: any) => ({
                    ...demo2,
                    ...updatedValue,
                }));

                if (distance < 0) {
                    clearInterval(timer2);
                }
            })
        );
    };
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="#" className="text-primary hover:underline">
                        Components
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Countdown</span>
                </li>
            </ul>
            <div className="grid grid-cols-1 gap-6 pt-5 xl:grid-cols-2">
                {/* Simple Countdown */}
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Simple Countdown</h5>
                        <button onClick={() => toggleCode('code1')} className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600">
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
                    <div className="mb-5 grid grid-cols-4 justify-items-center gap-3">
                        <div>
                            <div className="flex h-16 w-16 flex-col justify-center rounded border border-white-light shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] dark:border-[#1b2e4b] sm:h-[100px] sm:w-[100px]">
                                <h1 className="text-center text-xl text-primary sm:text-3xl">{demo1.days}</h1>
                            </div>
                            <h4 className="mt-4 text-center text-[15px] font-semibold text-[#3b3f5c] dark:text-white-dark">Days</h4>
                        </div>
                        <div>
                            <div className="flex h-16 w-16 flex-col justify-center rounded border border-white-light shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] dark:border-[#1b2e4b] sm:h-[100px] sm:w-[100px]">
                                <h1 className="text-center text-xl text-primary sm:text-3xl">{demo1.hours}</h1>
                            </div>
                            <h4 className="mt-4 text-center text-[15px] font-semibold text-[#3b3f5c] dark:text-white-dark">Hours</h4>
                        </div>
                        <div>
                            <div className="flex h-16 w-16 flex-col justify-center rounded border border-white-light shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] dark:border-[#1b2e4b] sm:h-[100px] sm:w-[100px]">
                                <h1 className="text-center text-xl text-primary sm:text-3xl">{demo1.minutes}</h1>
                            </div>
                            <h4 className="mt-4 text-center text-[15px] font-semibold text-[#3b3f5c] dark:text-white-dark">Mins</h4>
                        </div>
                        <div>
                            <div className="flex h-16 w-16 flex-col justify-center rounded border border-white-light shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] dark:border-[#1b2e4b] sm:h-[100px] sm:w-[100px]">
                                <h1 className="text-center text-xl text-primary sm:text-3xl">{demo1.seconds}</h1>
                            </div>
                            <h4 className="mt-4 text-center text-[15px] font-semibold text-[#3b3f5c] dark:text-white-dark">Sec</h4>
                        </div>
                    </div>
                    {codeArr.includes('code1') && (
                        <div className="mt-5 w-full">
                            <CodeHighlight>
                                <pre className="language-typescript">
                                    {`import { useState, useEffect } from 'react';

    const [demo1, setDemo1] = useState<any>({ days: null, hours: null, minutes: null, seconds: null });
    const [timer1, setTimer1] = useState<any>(null);

    const setTimerDemo1 = () => {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        const countDownDate = date.getTime();

        let updatedValue: any = {};
        setTimer1(
            setInterval(() => {
                const now = new Date().getTime();

                const distance = countDownDate - now;

                updatedValue.days = Math.floor(distance / (1000 * 60 * 60 * 24));
                updatedValue.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                updatedValue.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                updatedValue.seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setDemo1((demo1: any) => ({
                    ...demo1,
                    ...updatedValue,
                }));

                if (distance < 0) {
                    clearInterval(timer1);
                }
            })
        );
    };

    useEffect(() => {
        setTimerDemo1();
    }, []);

<div className="mb-5 grid grid-cols-4 justify-items-center gap-3">
    <div>
        <div className="w-16 h-16 sm:w-[100px] sm:h-[100px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex justify-center flex-col">
            <h1 className="text-primary sm:text-3xl text-xl text-center">{demo1.days}</h1>
        </div>
        <h4 className="text-[#3b3f5c] text-[15px] mt-4 text-center dark:text-white-dark font-semibold">Days</h4>
    </div>
    <div>
        <div className="w-16 h-16 sm:w-[100px] sm:h-[100px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex justify-center flex-col">
            <h1 className="text-primary sm:text-3xl text-xl text-center">{demo1.hours}</h1>
        </div>
        <h4 className="text-[#3b3f5c] text-[15px] mt-4 text-center dark:text-white-dark font-semibold">Hours</h4>
    </div>
    <div>
        <div className="w-16 h-16 sm:w-[100px] sm:h-[100px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex justify-center flex-col">
            <h1 className="text-primary sm:text-3xl text-xl text-center">{demo1.minutes}</h1>
        </div>
        <h4 className="text-[#3b3f5c] text-[15px] mt-4 text-center dark:text-white-dark font-semibold">Mins</h4>
    </div>
    <div>
        <div className="w-16 h-16 sm:w-[100px] sm:h-[100px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded border border-white-light dark:border-[#1b2e4b] flex justify-center flex-col">
            <h1 className="text-primary sm:text-3xl text-xl text-center">{demo1.seconds}</h1>
        </div>
        <h4 className="text-[#3b3f5c] text-[15px] mt-4 text-center dark:text-white-dark font-semibold">Sec</h4>
    </div>
</div>
`}
                                </pre>
                            </CodeHighlight>
                        </div>
                    )}
                </div>
                {/* Circle Countdown */}
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Circle Countdown</h5>
                        <button onClick={() => toggleCode('code2')} className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600">
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
                    <div className="mb-5 grid grid-cols-4 justify-items-center gap-3">
                        <div>
                            <div className="flex h-16 w-16 flex-col justify-center rounded-full border border-white-light shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] dark:border-[#1b2e4b] sm:h-[100px] sm:w-[100px]">
                                <h1 className="text-center text-xl text-primary sm:text-3xl">{demo2.days}</h1>
                            </div>
                            <h4 className="mt-4 text-center text-[15px] font-semibold text-[#3b3f5c] dark:text-white-dark">Days</h4>
                        </div>
                        <div>
                            <div className="flex h-16 w-16 flex-col justify-center rounded-full border border-white-light shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] dark:border-[#1b2e4b] sm:h-[100px] sm:w-[100px]">
                                <h1 className="text-center text-xl text-primary sm:text-3xl">{demo2.hours}</h1>
                            </div>
                            <h4 className="mt-4 text-center text-[15px] font-semibold text-[#3b3f5c] dark:text-white-dark">Hours</h4>
                        </div>
                        <div>
                            <div className="flex h-16 w-16 flex-col justify-center rounded-full border border-white-light shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] dark:border-[#1b2e4b] sm:h-[100px] sm:w-[100px]">
                                <h1 className="text-center text-xl text-primary sm:text-3xl">{demo2.minutes}</h1>
                            </div>
                            <h4 className="mt-4 text-center text-[15px] font-semibold text-[#3b3f5c] dark:text-white-dark">Mins</h4>
                        </div>
                        <div>
                            <div className="flex h-16 w-16 flex-col justify-center rounded-full border border-white-light shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] dark:border-[#1b2e4b] sm:h-[100px] sm:w-[100px]">
                                <h1 className="text-center text-xl text-primary sm:text-3xl">{demo2.seconds}</h1>
                            </div>
                            <h4 className="mt-4 text-center text-[15px] font-semibold text-[#3b3f5c] dark:text-white-dark">Sec</h4>
                        </div>
                    </div>
                    {codeArr.includes('code2') && (
                        <div className="mt-5 w-full">
                            <CodeHighlight>
                                <pre className="language-typescript">
                                    {`import { useState, useEffect } from 'react';

    const [demo2, setDemo2] = useState<any>({ days: null, hours: null, minutes: null, seconds: null });
    const [timer2, setTimer2] = useState<any>(null);

    const setTimerDemo2 = () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        const countDownDate = date.getTime();

        let updatedValue: any = {};

        setTimer2(
            setInterval(() => {
                const now = new Date().getTime();
                const distance = countDownDate - now;
                updatedValue.days = Math.floor(distance / (1000 * 60 * 60 * 24));
                updatedValue.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                updatedValue.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                updatedValue.seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setDemo2((demo2: any) => ({
                    ...demo2,
                    ...updatedValue,
                }));

                if (distance < 0) {
                    clearInterval(timer2);
                }
            })
        );
    };

    useEffect(() => {
        setTimerDemo2();
    }, []);

<div className="mb-5 grid grid-cols-4 justify-items-center gap-3">
    <div>
        <div className="w-16 h-16 sm:w-[100px] sm:h-[100px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded-full border border-white-light dark:border-[#1b2e4b] flex justify-center flex-col">
            <h1 className="text-primary sm:text-3xl text-xl text-center">{demo2.days}</h1>
        </div>
        <h4 className="text-[#3b3f5c] text-[15px] mt-4 text-center dark:text-white-dark font-semibold">Days</h4>
    </div>
    <div>
        <div className="w-16 h-16 sm:w-[100px] sm:h-[100px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded-full border border-white-light dark:border-[#1b2e4b] flex justify-center flex-col">
            <h1 className="text-primary sm:text-3xl text-xl text-center">{demo2.hours}</h1>
        </div>
        <h4 className="text-[#3b3f5c] text-[15px] mt-4 text-center dark:text-white-dark font-semibold">Hours</h4>
    </div>
    <div>
        <div className="w-16 h-16 sm:w-[100px] sm:h-[100px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded-full border border-white-light dark:border-[#1b2e4b] flex justify-center flex-col">
            <h1 className="text-primary sm:text-3xl text-xl text-center">{demo2.minutes}</h1>
        </div>
        <h4 className="text-[#3b3f5c] text-[15px] mt-4 text-center dark:text-white-dark font-semibold">Mins</h4>
    </div>
    <div>
        <div className="w-16 h-16 sm:w-[100px] sm:h-[100px] shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] rounded-full border border-white-light dark:border-[#1b2e4b] flex justify-center flex-col">
            <h1 className="text-primary sm:text-3xl text-xl text-center">{demo2.seconds}</h1>
        </div>
        <h4 className="text-[#3b3f5c] text-[15px] mt-4 text-center dark:text-white-dark font-semibold">Sec</h4>
    </div>
</div>

`}
                                </pre>
                            </CodeHighlight>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Countdown;
