import Link from 'next/link';
import { useEffect, useState } from 'react';
import CodeHighlight from '../../components/Highlight';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/slices/themeConfigSlice';

const Notification = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Notifications'));
    });
    const [codeArr, setCodeArr] = useState<string[]>([]);

    const toggleCode = (name: string) => {
        if (codeArr.includes(name)) {
            setCodeArr((value) => value.filter((d) => d !== name));
        } else {
            setCodeArr([...codeArr, name]);
        }
    };

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const MySwal = withReactContent(Swal);

    const showMessage = () => {
        MySwal.fire({
            title: 'Hello, world! This is a toast message.',
            toast: true,
            position: 'bottom-start',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
        });
    };

    const showMessage1 = () => {
        MySwal.fire({
            title: 'Example notification text.',
            toast: true,
            position: isRtl ? 'top-end' : 'top-start',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
        });
    };
    const showMessage2 = () => {
        MySwal.fire({
            title: 'Example notification text.',
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
        });
    };

    const showMessage3 = () => {
        MySwal.fire({
            title: 'Example notification text.',
            toast: true,
            position: isRtl ? 'top-start' : 'top-end',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
        });
    };

    const showMessage4 = () => {
        MySwal.fire({
            title: 'Example notification text.',
            toast: true,
            position: isRtl ? 'bottom-end' : 'bottom-start',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
        });
    };

    const showMessage5 = () => {
        MySwal.fire({
            title: 'Example notification text.',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
        });
    };

    const showMessage6 = () => {
        MySwal.fire({
            title: 'Example notification text.',
            toast: true,
            position: isRtl ? 'bottom-start' : 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
        });
    };

    const showMessage7 = () => {
        MySwal.fire({
            title: 'Example notification text.',
            toast: true,
            position: 'bottom-start',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: false,
        });
    };

    const showMessage8 = () => {
        MySwal.fire({
            title: 'Example notification text.',
            toast: true,
            position: 'bottom-start',
            showConfirmButton: false,
            timer: 5000,
            showCloseButton: true,
        });
    };

    const clickCallable = () => {
        Swal.fire({
            toast: true,
            position: 'bottom-start',
            text: 'Custom callback when action button is clicked.',
            showCloseButton: true,
            showConfirmButton: false,
        }).then((result) => {
            Swal.fire({
                toast: true,
                position: 'bottom-start',
                text: 'Thanks for clicking the Dismiss button!',
                showCloseButton: true,
                showConfirmButton: false,
            });
        });
    };

    const coloredToast = (color: any) => {
        const toast = Swal.mixin({
            toast: true,
            position: 'bottom-start',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
            customClass: {
                popup: `color-${color}`,
            },
        });
        toast.fire({
            title: 'Example notification text.',
        });
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
                    <span>Notifications</span>
                </li>
            </ul>
            <div className="space-y-8 pt-5">
                <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
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
                    <a href="https://www.npmjs.com/package/sweetalert2" target="_blank" className="block hover:underline" rel="noreferrer">
                        https://www.npmjs.com/package/sweetalert2
                    </a>
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* basic */}
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Basic</h5>
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
                            <div className="flex items-center justify-center">
                                <button type="button" className="btn btn-primary" onClick={showMessage}>
                                    Open Toast
                                </button>
                            </div>
                        </div>
                        {codeArr.includes('code1') && (
                            <CodeHighlight>
                                <pre className="language-typescript">
                                    {`import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const showMessage = () => {
    MySwal.fire({
        title: 'Hello, world! This is a toast message.',
        toast: true,
        position: 'bottom-start',
        showConfirmButton: false,
        timer: 3000,
        showCloseButton: true,
    });
};
<div className="mb-5">
    <div className="flex items-center justify-center">
        <button type="button" className="btn btn-primary" onClick={showMessage}>
            Open Toast
        </button>
    </div>
</div>`}
                                </pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/* Position */}
                    <div className="panel lg:row-span-2">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Position</h5>
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
                            <h6 className="mb-3 text-center text-base font-semibold dark:text-white-light">Top Position</h6>
                            <div className="mb-10 flex items-center justify-center gap-2">
                                <button type="button" className="btn btn-success" onClick={showMessage1}>
                                    Top Left
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={showMessage2}>
                                    Top Center
                                </button>
                                <button type="button" className="btn btn-info" onClick={showMessage3}>
                                    Top Right
                                </button>
                            </div>
                            <h6 className="mb-3 text-center text-base font-semibold dark:text-white-light">Bottom Position</h6>
                            <div className="flex items-center justify-center gap-2">
                                <button type="button" className="btn btn-dark" onClick={showMessage4}>
                                    Bottom Left
                                </button>
                                <button type="button" className="btn btn-primary" onClick={showMessage5}>
                                    Bottom Center
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={showMessage6}>
                                    Bottom Right
                                </button>
                            </div>
                        </div>
                        {codeArr.includes('code2') && (
                            <CodeHighlight>
                                <pre className="language-typescript">
                                    {`import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

    const showMessage1 = () => {
        MySwal.fire({
            title: 'Example notification text.',
            toast: true,
            position: isRtl ? 'top-end' : 'top-start',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
        });
    };
    const showMessage2 = () => {
        MySwal.fire({
            title: 'Example notification text.',
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
        });
    };

    const showMessage3 = () => {
        MySwal.fire({
            title: 'Example notification text.',
            toast: true,
            position: isRtl ? 'top-start' : 'top-end',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
        });
    };

    const showMessage4 = () => {
        MySwal.fire({
            title: 'Example notification text.',
            toast: true,
            position: isRtl ? 'bottom-end' : 'bottom-start',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
        });
    };

    const showMessage5 = () => {
        MySwal.fire({
            title: 'Example notification text.',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
        });
    };

    const showMessage6 = () => {
        MySwal.fire({
            title: 'Example notification text.',
            toast: true,
            position: isRtl ? 'bottom-start' : 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
        });
    };

<div className="mb-5">
    <h6 className="font-semibold text-base dark:text-white-light mb-3 text-center">Top Position</h6>
    <div className="flex items-center justify-center mb-10 gap-2">
        <button type="button" className="btn btn-success" onClick={showMessage1}>
            Top Left
        </button>
        <button type="button" className="btn btn-secondary" onClick={showMessage2}>
            Top Center
        </button>
        <button type="button" className="btn btn-info" onClick={showMessage3}>
            Top Right
        </button>
    </div>
    <h6 className="font-semibold text-base dark:text-white-light mb-3 text-center">Bottom Position</h6>
    <div className="flex items-center justify-center gap-2">
        <button type="button" className="btn btn-dark" onClick={showMessage4}>
            Bottom Left
        </button>
        <button type="button" className="btn btn-primary" onClick={showMessage5}>
            Bottom Center
        </button>
        <button type="button" className="btn btn-secondary" onClick={showMessage6}>
            Bottom Right
        </button>
    </div>
</div>`}
                                </pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/* No Action */}
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">No Action</h5>
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
                            <div className="flex items-center justify-center">
                                <button type="button" className="btn btn-success" onClick={showMessage7}>
                                    No Action
                                </button>
                            </div>
                        </div>
                        {codeArr.includes('code3') && (
                            <CodeHighlight>
                                <pre className="language-typescript">
                                    {`import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const showMessage7 = () => {
    MySwal.fire({
        title: 'Example notification text.',
        toast: true,
        position: 'bottom-start',
        showConfirmButton: false,
        timer: 3000,
        showCloseButton: false,
    });
};

<div className="mb-5">
    <div className="flex items-center justify-center">
        <button type="button" className="btn btn-success" onClick={showMessage7}>
            No Action
        </button>
    </div>
</div>`}
                                </pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/*  Click Callback */}
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Click Callback</h5>
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
                            <div className="flex items-center justify-center">
                                <button type="button" className="btn btn-info" onClick={clickCallable}>
                                    Click Callback
                                </button>
                            </div>
                        </div>
                        {codeArr.includes('code4') && (
                            <CodeHighlight>
                                <pre className="language-typescript">
                                    {`import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const clickCallable = () => {
    Swal.fire({
        toast: true,
        position: 'bottom-start',
        text: 'Custom callback when action button is clicked.',
        showCloseButton: true,
        showConfirmButton: false,
    }).then((result) => {
        Swal.fire({
            toast: true,
            position: 'bottom-start',
            text: 'Thanks for clicking the Dismiss button!',
            showCloseButton: true,
            showConfirmButton: false,
        });
    });
};

<div className="mb-5">
    <div className="flex items-center justify-center">
        <button type="button" className="btn btn-info" onClick={clickCallable}>
            Click Callback
        </button>
    </div>
</div>`}
                                </pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/* Duration */}
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Duration</h5>
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
                            <div className="flex items-center justify-center">
                                <button type="button" className="btn btn-dark" onClick={showMessage8}>
                                    Duration
                                </button>
                            </div>
                        </div>
                        {codeArr.includes('code5') && (
                            <CodeHighlight>
                                <pre className="language-typescript">
                                    {`import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const showMessage8 = () => {
    MySwal.fire({
        title: 'Example notification text.',
        toast: true,
        position: 'bottom-start',
        showConfirmButton: false,
        timer: 5000,
        showCloseButton: true,
    });
};

<div className="mb-5">
    <div className="flex items-center justify-center">
        <button type="button" className="btn btn-dark" onClick={showMessage8}>
            Duration
        </button>
    </div>
</div>`}
                                </pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/* Background Color */}
                    <div className="panel lg:col-span-2">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Background Color</h5>
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
                            <div className="colored-toast grid grid-cols-2 items-center justify-center gap-2 sm:flex sm:grid-cols-1">
                                <div>
                                    <button type="button" className="btn btn-primary" onClick={() => coloredToast('primary')}>
                                        Primary
                                    </button>
                                    <div id="primary-toast"></div>
                                </div>
                                <div>
                                    <button type="button" className="btn btn-secondary" onClick={() => coloredToast('secondary')}>
                                        Secondary
                                    </button>
                                    <div id="secondary-toast"></div>
                                </div>
                                <div>
                                    <button type="button" className="btn btn-success" onClick={() => coloredToast('success')}>
                                        Success
                                    </button>
                                    <div id="success-toast"></div>
                                </div>
                                <div>
                                    <button type="button" className="btn btn-danger" onClick={() => coloredToast('danger')}>
                                        Danger
                                    </button>
                                    <div id="danger-toast"></div>
                                </div>
                                <div>
                                    <button type="button" className="btn btn-warning" onClick={() => coloredToast('warning')}>
                                        Warning
                                    </button>
                                    <div id="warning-toast"></div>
                                </div>
                                <div>
                                    <button type="button" className="btn btn-info" onClick={() => coloredToast('info')}>
                                        Info
                                    </button>
                                    <div id="info-toast"></div>
                                </div>
                            </div>
                        </div>
                        {codeArr.includes('code6') && (
                            <CodeHighlight>
                                <pre className="language-typescript">
                                    {`import Swal from 'sweetalert2';

const coloredToast = (color: any) => {
    const toast = Swal.mixin({
        toast: true,
        position: 'bottom-start',
        showConfirmButton: false,
        timer: 3000,
        showCloseButton: true,
        customClass: {
            popup: \`color-\${color}\`,
        },
    });
    toast.fire({
        title: 'Example notification text.',
    });
};

<div className="mb-5">
    <div className="grid grid-cols-2 sm:grid-cols-1 sm:flex items-center justify-center gap-2 colored-toast">
        <div>
            <button type="button" className="btn btn-primary" onClick={() => coloredToast('primary')}>
                Primary
            </button>
            <div id="primary-toast"></div>
        </div>
        <div>
            <button type="button" className="btn btn-secondary" onClick={() => coloredToast('secondary')}>
                Secondary
            </button>
            <div id="secondary-toast"></div>
        </div>
        <div>
            <button type="button" className="btn btn-success" onClick={() => coloredToast('success')}>
                Success
            </button>
            <div id="success-toast"></div>
        </div>
        <div>
            <button type="button" className="btn btn-danger" onClick={() => coloredToast('danger')}>
                Danger
            </button>
            <div id="danger-toast"></div>
        </div>
        <div>
            <button type="button" className="btn btn-warning" onClick={() => coloredToast('warning')}>
                Warning
            </button>
            <div id="warning-toast"></div>
        </div>
        <div>
            <button type="button" className="btn btn-info" onClick={() => coloredToast('info')}>
                Info
            </button>
            <div id="info-toast"></div>
        </div>
    </div>
</div>`}
                                </pre>
                            </CodeHighlight>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;
