import Link from 'next/link';
import { useState, useEffect } from 'react';
import { setPageTitle } from '../../store/slices/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import BlankLayout from '@/components/Layouts/BlankLayout';

const ComingSoon = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Coming Soon'));
    });

    const [demo1, setDemo1] = useState<any>({
        days: null,
        hours: null,
        minutes: null,
        seconds: null,
    });
    const [timer1, setTimer1] = useState<any>(null);

    const setTimerDemo1 = () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
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
            }, 1000)
        );
    };

    useEffect(() => {
        setTimerDemo1();
        return () => {
            clearInterval(timer1);
        };
    }, []);

    const router = useRouter();

    const submitForm = (e: any) => {
        e.preventDefault();
        router.push('/');
    };

    return (
        <div>
            <div className="flex min-h-screen items-center justify-center dark:bg-dark-dark-light">
                <div className="h-full w-full lg:w-1/2">
                    <div className="mx-auto max-w-[480px] p-5 md:p-10">
                        <h4 className="mb-2 text-2xl font-bold text-primary md:text-4xl">Coming Soon</h4>
                        <p className="mb-10 text-base font-bold text-white-dark">We will be here in a shortwhile.....</p>
                        <div className="mb-10 flex space-x-4 text-center font-semibold text-white rtl:space-x-reverse md:mb-20">
                            <div className="flex h-[95px] w-[95px] flex-col items-center justify-center rounded-md bg-primary">
                                <h1>{demo1.days}</h1>

                                <span>Days</span>
                            </div>
                            <div className="flex h-[95px] w-[95px] flex-col items-center justify-center rounded-md bg-primary">
                                <h1>{demo1.hours}</h1>

                                <span>Hours</span>
                            </div>
                            <div className="flex h-[95px] w-[95px] flex-col items-center justify-center rounded-md bg-primary">
                                <h1>{demo1.minutes}</h1>

                                <span>Mins</span>
                            </div>
                            <div className="flex h-[95px] w-[95px] flex-col items-center justify-center rounded-md bg-primary">
                                <h1>{demo1.seconds}</h1>

                                <span>Secs</span>
                            </div>
                        </div>
                        <h3 className="mb-10 text-center text-xl font-bold">Subscribe to get notified!</h3>
                        <form className="mb-5" onSubmit={submitForm}>
                            <div className="relative mx-auto max-w-[580px]">
                                <span className="absolute top-3 text-primary ltr:left-2 rtl:right-2">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                        <path
                                            d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 12.7215 17.8726 13.4133 17.6392 14.054C17.5551 14.285 17.4075 14.4861 17.2268 14.6527L17.1463 14.727C16.591 15.2392 15.7573 15.3049 15.1288 14.8858C14.6735 14.5823 14.4 14.0713 14.4 13.5241V12M14.4 12C14.4 13.3255 13.3255 14.4 12 14.4C10.6745 14.4 9.6 13.3255 9.6 12C9.6 10.6745 10.6745 9.6 12 9.6C13.3255 9.6 14.4 10.6745 14.4 12Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            opacity="0.5"
                                            d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                    </svg>
                                </span>
                                <input type="email" placeholder="Email" className="form-input py-3 ltr:pl-9 ltr:pr-[100px] rtl:pr-9 rtl:pl-[100px]" />
                                <button type="submit" className="btn btn-primary absolute top-0 rounded-bl-3xl py-2.5 ltr:right-0 rtl:left-0">
                                    Subscribe
                                </button>
                            </div>
                        </form>
                        <ul className="mx-auto mb-10 flex justify-center text-primary">
                            <li className="flex border-[#ddd] ltr:mr-2 ltr:border-r-2 ltr:pr-2 rtl:ml-2 rtl:border-l-2 rtl:pl-2 dark:border-dark">
                                <button type="button">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24px"
                                        height="24px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-5 w-5"
                                    >
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                        <rect x="2" y="9" width="4" height="12"></rect>
                                        <circle cx="4" cy="4" r="2"></circle>
                                    </svg>
                                </button>
                            </li>
                            <li className="flex border-[#ddd] ltr:mr-2 ltr:border-r-2 ltr:pr-2 rtl:ml-2 rtl:border-l-2 rtl:pl-2 dark:border-dark">
                                <button type="button">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24px"
                                        height="24px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-5 w-5"
                                    >
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                    </svg>
                                </button>
                            </li>
                            <li className="flex border-[#ddd] ltr:mr-2 ltr:border-r-2 ltr:pr-2 rtl:ml-2 rtl:border-l-2 rtl:pl-2 dark:border-dark">
                                <button type="button">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24px"
                                        height="24px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-5 w-5"
                                    >
                                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                    </svg>
                                </button>
                            </li>
                            <li className="flex">
                                <button type="button">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24px"
                                        height="24px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-5 w-5"
                                    >
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                    </svg>
                                </button>
                            </li>
                        </ul>
                        <p className="text-center">
                            © 2022.
                            <Link href="/" className="router-link-active mx-1 text-primary">
                                VRISTO
                            </Link>
                            All Rights Reserved.
                        </p>
                    </div>
                </div>
                <div className="hidden min-h-screen w-1/2 items-center justify-center bg-[#060818] p-4 lg:flex">
                    <img src="/assets/images/coming-soon.svg" alt="coming_soon" className="mx-auto lg:max-w-[370px] xl:max-w-[500px]" />
                </div>
            </div>
        </div>
    );
};
ComingSoon.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};

export default ComingSoon;
