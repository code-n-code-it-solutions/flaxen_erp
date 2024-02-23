import Link from 'next/link';
import { useEffect, useState } from 'react';
import CodeHighlight from '@/components/Highlight';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Swal from 'sweetalert2';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useDispatch } from 'react-redux';

const Clipboard = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Clipboard'));
    });
    const [codeArr, setCodeArr] = useState<string[]>([]);

    const toggleCode = (name: string) => {
        if (codeArr.includes(name)) {
            setCodeArr((value) => value.filter((d) => d !== name));
        } else {
            setCodeArr([...codeArr, name]);
        }
    };

    const [message1, setMessage1] = useState<any>('http://www.admin-dashboard.com');
    const [message2, setMessage2] = useState<any>('Lorem ipsum dolor sit amet, consectetur adipiscing elit...');
    const message3 = '22991';
    const message4 = 'http://www.admin-dashboard.com/code';

    const showMessage = (message: String = '') => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
        });
        toast.fire({
            icon: 'success',
            title: message || 'Copied successfully.',
            padding: '10px 20px',
        });
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="#" className="text-primary hover:underline">
                        Forms
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Clipboard</span>
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
                    <a href="https://www.npmjs.com/package/react-copy-to-clipboard" target="_blank" className="block hover:underline" rel="noreferrer">
                        https://www.npmjs.com/package/react-copy-to-clipboard
                    </a>
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Copy from input */}
                    <div className="panel" id="copy_from_input">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Copy from input</h5>
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
                            <div className="rounded bg-[#f1f2f3] p-5 dark:bg-[#060818]">
                                <form>
                                    <input type="text" value={message1} className="form-input" onChange={(e) => setMessage1(e.target.value)} />
                                    <div className="mt-5 space-y-2 rtl:space-x-reverse sm:flex sm:space-y-0 sm:space-x-2">
                                        <CopyToClipboard
                                            text={message1}
                                            onCopy={(text, result) => {
                                                if (result) {
                                                    showMessage();
                                                }
                                            }}
                                        >
                                            <button type="button" className="btn btn-primary">
                                                <svg className="ltr:mr-2 rtl:ml-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <path
                                                        opacity="0.5"
                                                        d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                                Copy from Input
                                            </button>
                                        </CopyToClipboard>
                                        <CopyToClipboard
                                            text={message1}
                                            onCopy={(text, result) => {
                                                if (result) {
                                                    showMessage('Cut successfully.');
                                                }
                                            }}
                                        >
                                            <button type="button" className="btn btn-dark" value={message1} onClick={() => setMessage1('')}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                                    <path
                                                        d="M15.2869 3.15178L14.3601 4.07866L5.83882 12.5999L5.83881 12.5999C5.26166 13.1771 4.97308 13.4656 4.7249 13.7838C4.43213 14.1592 4.18114 14.5653 3.97634 14.995C3.80273 15.3593 3.67368 15.7465 3.41556 16.5208L2.32181 19.8021L2.05445 20.6042C1.92743 20.9852 2.0266 21.4053 2.31063 21.6894C2.59466 21.9734 3.01478 22.0726 3.39584 21.9456L4.19792 21.6782L7.47918 20.5844L7.47919 20.5844C8.25353 20.3263 8.6407 20.1973 9.00498 20.0237C9.43469 19.8189 9.84082 19.5679 10.2162 19.2751C10.5344 19.0269 10.8229 18.7383 11.4001 18.1612L11.4001 18.1612L19.9213 9.63993L20.8482 8.71306C22.3839 7.17735 22.3839 4.68748 20.8482 3.15178C19.3125 1.61607 16.8226 1.61607 15.2869 3.15178Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <path
                                                        opacity="0.5"
                                                        d="M14.36 4.07812C14.36 4.07812 14.4759 6.04774 16.2138 7.78564C17.9517 9.52354 19.9213 9.6394 19.9213 9.6394M4.19789 21.6777L2.32178 19.8015"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                                Cut from Input
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {codeArr.includes('code1') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
const [message1, setMessage1] = useState<any>('http://www.admin-dashboard.com');

<form>
    <input type="text" value={message1} className="form-input" onChange={(e) => setMessage1(e.target.value)} />
    <div className="sm:flex space-y-2 sm:space-y-0 sm:space-x-2 rtl:space-x-reverse mt-5">
        <CopyToClipboard
            text={message1}
            onCopy={(text, result) => {
                if (result) {
                    showMessage();
                }
            }}
        >
            <button type="button" className="btn btn-primary">
                <svg>...</svg>
                Copy from Input
            </button>
        </CopyToClipboard>
        <CopyToClipboard
            text={message1}
            onCopy={(text, result) => {
                if (result) {
                    showMessage('Cut successfully.');
                }
            }}
        >
            <button type="button" className="btn btn-dark" value={message1} onClick={() => setMessage1('')}>
                <svg>...</svg>
                Cut from Input
            </button>
        </CopyToClipboard>
    </div>
</form>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/* Copy form Textarea */}
                    <div className="panel" id="copy_from_textarea">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Copy form Textarea</h5>
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
                            <div className="rounded bg-[#f1f2f3] p-5 dark:bg-[#060818]">
                                <form>
                                    <textarea rows={3} wrap="soft" className="form-textarea" value={message2} id="message2" onChange={(e) => setMessage2(e.target.value)}></textarea>
                                    <div className="mt-5 space-y-2 rtl:space-x-reverse sm:flex sm:space-y-0 sm:space-x-2">
                                        <CopyToClipboard
                                            text={message2}
                                            onCopy={(text, result) => {
                                                if (result) {
                                                    showMessage();
                                                }
                                            }}
                                        >
                                            <button type="button" className="btn btn-primary" data-clipboard-target="#message2">
                                                <svg className="ltr:mr-2 rtl:ml-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <path
                                                        opacity="0.5"
                                                        d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                                Copy from Input
                                            </button>
                                        </CopyToClipboard>
                                        <CopyToClipboard
                                            text={message2}
                                            onCopy={(text, result) => {
                                                if (result) {
                                                    showMessage('Cut successfully.');
                                                }
                                            }}
                                        >
                                            <button type="button" className="btn btn-dark " onClick={() => setMessage2('')}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                                    <path
                                                        d="M15.2869 3.15178L14.3601 4.07866L5.83882 12.5999L5.83881 12.5999C5.26166 13.1771 4.97308 13.4656 4.7249 13.7838C4.43213 14.1592 4.18114 14.5653 3.97634 14.995C3.80273 15.3593 3.67368 15.7465 3.41556 16.5208L2.32181 19.8021L2.05445 20.6042C1.92743 20.9852 2.0266 21.4053 2.31063 21.6894C2.59466 21.9734 3.01478 22.0726 3.39584 21.9456L4.19792 21.6782L7.47918 20.5844L7.47919 20.5844C8.25353 20.3263 8.6407 20.1973 9.00498 20.0237C9.43469 19.8189 9.84082 19.5679 10.2162 19.2751C10.5344 19.0269 10.8229 18.7383 11.4001 18.1612L11.4001 18.1612L19.9213 9.63993L20.8482 8.71306C22.3839 7.17735 22.3839 4.68748 20.8482 3.15178C19.3125 1.61607 16.8226 1.61607 15.2869 3.15178Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <path
                                                        opacity="0.5"
                                                        d="M14.36 4.07812C14.36 4.07812 14.4759 6.04774 16.2138 7.78564C17.9517 9.52354 19.9213 9.6394 19.9213 9.6394M4.19789 21.6777L2.32178 19.8015"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                                Cut from Input
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {codeArr.includes('code2') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
const [message2, setMessage2] = useState<any>('Lorem ipsum dolor sit amet, consectetur adipiscing elit...');

<form>
    <textarea rows={3} wrap="soft" className="form-textarea" value={message2} id="message2" onChange={(e) => setMessage2(e.target.value)}></textarea>
    <div className="sm:flex space-y-2 sm:space-y-0 sm:space-x-2 rtl:space-x-reverse mt-5">
        <CopyToClipboard
            text={message2}
            onCopy={(text, result) => {
                if (result) {
                    showMessage();
                }
            }}
        >
            <button type="button" className="btn btn-primary" data-clipboard-target="#message2">
                <svg>...</svg>
                Copy from Input
            </button>
        </CopyToClipboard>
        <CopyToClipboard
            text={message2}
            onCopy={(text, result) => {
                if (result) {
                    showMessage('Cut successfully.');
                }
            }}
        >
            <button type="button" className="btn btn-dark " onClick={() => setMessage2('')}>
                <svg>...</svg>
                Cut from Input
            </button>
        </CopyToClipboard>
    </div>
</form>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/* <!-- Copy Text from Paragraph --> */}
                    <div className="panel" id="copy_from_paragraph">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Copy Text from Paragraph</h5>
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
                            <div className="rounded bg-[#f1f2f3] p-5 dark:bg-[#060818]">
                                <form>
                                    <p className="mb-3 font-semibold">
                                        Here is your OTP
                                        <span className="text-2xl" id="copyOTP" defaultValue={message3}>
                                            22991
                                        </span>
                                        .
                                    </p>
                                    <p className="font-semibold">Please do not share it to anyone</p>
                                    <div className="mt-5 space-y-2 rtl:space-x-reverse sm:flex sm:space-y-0 sm:space-x-2">
                                        <CopyToClipboard
                                            text={message3}
                                            onCopy={(text, result) => {
                                                if (result) {
                                                    showMessage();
                                                }
                                            }}
                                        >
                                            <button type="button" className="btn btn-primary" data-clipboard-target="#copyOTP">
                                                <svg className="ltr:mr-2 rtl:ml-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <path
                                                        opacity="0.5"
                                                        d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                                Copy from Paragraph
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {codeArr.includes('code3') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
const message3 = '22991';

<form>
    <p className="mb-3 font-semibold">
        Here is your OTP
        <span className="text-2xl" id="copyOTP" defaultValue={message3}>
            22991
        </span>
        .
    </p>
    <p className="font-semibold">Please do not share it to anyone</p>
    <div className="sm:flex space-y-2 sm:space-y-0 sm:space-x-2 rtl:space-x-reverse mt-5">
        <CopyToClipboard
            text={message3}
            onCopy={(text, result) => {
                if (result) {
                    showMessage();
                }
            }}
        >
            <button type="button" className="btn btn-primary" data-clipboard-target="#copyOTP">
                <svg>...</svg>
                Copy from Paragraph
            </button>
        </CopyToClipboard>
    </div>
</form>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/* Advanced */}
                    <div className="panel" id="advanced">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Copy Hidden Text (Advanced)</h5>
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
                            <div className="rounded bg-[#f1f2f3] p-5 dark:bg-[#060818]">
                                <form>
                                    <p className="mb-3 font-semibold">
                                        <span> {'Link -> '} </span>
                                        <span id="copyLink"> http://www.admin-dashboard.com/code</span>
                                    </p>
                                    <span className="absolute opacity-0" id="copyHiddenCode">
                                        2291
                                    </span>
                                    <div className="mt-5 space-y-2 rtl:space-x-reverse sm:flex sm:space-y-0 sm:space-x-2">
                                        <CopyToClipboard
                                            text={message4}
                                            onCopy={(text, result) => {
                                                if (result) {
                                                    showMessage();
                                                }
                                            }}
                                        >
                                            <button type="button" className="btn btn-primary">
                                                <svg className="ltr:mr-2 rtl:ml-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <path
                                                        opacity="0.5"
                                                        d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                                Copy Link
                                            </button>
                                        </CopyToClipboard>
                                        <CopyToClipboard
                                            text={'2291'}
                                            onCopy={(text, result) => {
                                                if (result) {
                                                    showMessage();
                                                }
                                            }}
                                        >
                                            <button type="button" className="btn btn-dark ">
                                                <svg className="ltr:mr-2 rtl:ml-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <path
                                                        opacity="0.5"
                                                        d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                                Copy Hidden Code
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {codeArr.includes('code4') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
const message4 = 'http://www.admin-dashboard.com/code';

<form>
    <p className="mb-3 font-semibold">
        <span> {'Link -> '} </span>
        <span id="copyLink"> http://www.admin-dashboard.com/code</span>
    </p>
    <span className="absolute opacity-0" id="copyHiddenCode">
        2291
    </span>
    <div className="sm:flex space-y-2 sm:space-y-0 sm:space-x-2 rtl:space-x-reverse mt-5">
        <CopyToClipboard
            text={message4}
            onCopy={(text, result) => {
                if (result) {
                    showMessage();
                }
            }}
        >
            <button type="button" className="btn btn-primary">
                <svg>...</svg>
                Copy Link
            </button>
        </CopyToClipboard>
        <CopyToClipboard
            text={'2291'}
            onCopy={(text, result) => {
                if (result) {
                    showMessage();
                }
            }}
        >
            <button type="button" className="btn btn-dark ">
                <svg>...</svg>
                Copy Hidden Code
            </button>
        </CopyToClipboard>
    </div>
</form>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Clipboard;
