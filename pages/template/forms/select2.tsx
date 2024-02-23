import Link from 'next/link';
import { useEffect, useState } from 'react';
import CodeHighlight from '@/components/Highlight';
import Select from 'react-select';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { useDispatch } from 'react-redux';

const Select2 = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Select2'));
    });
    const [codeArr, setCodeArr] = useState<string[]>([]);

    const toggleCode = (name: string) => {
        if (codeArr.includes(name)) {
            setCodeArr((value) => value.filter((d) => d !== name));
        } else {
            setCodeArr([...codeArr, name]);
        }
    };

    const options = [
        { value: 'orange', label: 'Orange' },
        { value: 'white', label: 'White' },
        { value: 'purple', label: 'Purple' },
    ];

    const options1 = [
        { value: 'group1', label: 'Group 1', isDisabled: 'option--is-disabled' },
        { value: 'orange', label: 'Orange' },
        { value: 'white', label: 'White' },
        { value: 'purple', label: 'Purple' },
        { value: 'group2', label: 'Group 2', isDisabled: 'option--is-disabled' },
        { value: 'yellow', label: 'Yellow' },
        { value: 'green', label: 'Green' },
        { value: 'red', label: 'Red' },
        { value: 'group3', label: 'Group 3', isDisabled: 'option--is-disabled' },
        { value: 'aqua', label: 'Aqua' },
        { value: 'black', label: 'Black' },
        { value: 'blue', label: 'Blue' },
    ];

    const options2 = [
        { value: 'orange', label: 'Orange' },
        { value: 'white', label: 'White', isDisabled: 'option--is-disabled' },
        { value: 'purple', label: 'Purple' },
    ];

    const options3 = [
        { value: 'orange', label: 'Orange' },
        { value: 'white', label: 'White' },
        { value: 'purple', label: 'Purple' },
    ];

    const options4 = [
        { value: 'orange', label: 'Orange' },
        { value: 'white', label: 'White' },
        { value: 'purple', label: 'Purple' },
    ];

    const options5 = [
        { value: 'orange', label: 'Orange' },
        { value: 'white', label: 'White' },
        { value: 'purple', label: 'Purple' },
    ];

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="#" className="text-primary hover:underline">
                        Forms
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Select2</span>
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
                    <a href="https://www.npmjs.com/package/react-select" target="_blank" className="block hover:underline" rel="noreferrer">
                        https://www.npmjs.com/package/react-select
                    </a>
                </div>
                <div className="custom-select grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* <!-- Basic --> */}
                    <div className="panel" id="basic">
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
                            <Select defaultValue={options[0]} options={options} isSearchable={false} />
                        </div>
                        {codeArr.includes('code1') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import Select from 'react-select';

const options = [
    { value: 'orange', label: 'Orange' },
    { value: 'white', label: 'White' },
    { value: 'purple', label: 'Purple' },
];

<Select defaultValue={options[0]} options={options} isSearchable={false} />`}</pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/*  Nested */}
                    <div className="panel" id="nested">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Nested</h5>
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
                            <Select defaultValue={options1[1]} options={options1} isSearchable={false} />
                        </div>
                        {codeArr.includes('code2') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import Select from 'react-select';

const options1 = [
    { value: 'group1', label: 'Group 1', isDisabled: 'option--is-disabled' },
    { value: 'orange', label: 'Orange' },
    { value: 'white', label: 'White' },
    { value: 'purple', label: 'Purple' },
    { value: 'group2', label: 'Group 2', isDisabled: 'option--is-disabled' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'green', label: 'Green' },
    { value: 'red', label: 'Red' },
    { value: 'group3', label: 'Group 3', isDisabled: 'option--is-disabled' },
    { value: 'aqua', label: 'Aqua' },
    { value: 'black', label: 'Black' },
    { value: 'blue', label: 'Blue' },
];

<Select defaultValue={options1[1]} options={options1} isSearchable={false}/>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/* Disabling options */}
                    <div className="panel" id="disabling_options">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Disabling options</h5>
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
                            <Select defaultValue={options2[0]} options={options2} isSearchable={false} />
                        </div>
                        {codeArr.includes('code3') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import Select from 'react-select';

const options2 = [
    { value: 'orange', label: 'Orange' },
    { value: 'white', label: 'White', isDisabled: 'option--is-disabled' },
    { value: 'purple', label: 'Purple' },
];

<Select defaultValue={options2[0]} options={options2} isSearchable={false}/>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/* Searchable */}
                    <div className="panel" id="tagging">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Searchable</h5>
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
                            <Select placeholder="Select an option" options={options4} />
                        </div>
                        {codeArr.includes('code5') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import Select from 'react-select';

const options3 = [
    { value: 'orange', label: 'Orange' },
    { value: 'white', label: 'White' },
    { value: 'purple', label: 'Purple' },
];

<Select placeholder="Select an option" options={options4} />`}</pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/*  Placeholder */}
                    <div className="panel" id="placeholder">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Placeholder</h5>
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
                            <Select placeholder="Choose..." options={options3} isSearchable={false} />
                        </div>
                        {codeArr.includes('code4') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import Select from 'react-select';

const options4 = [
    { value: 'orange', label: 'Orange' },
    { value: 'white', label: 'White' },
    { value: 'purple', label: 'Purple' },
];

<Select placeholder="Choose..." options={options3} isSearchable={false}/>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>

                    {/* Multiple */}
                    <div className="panel" id="limit_tagging">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Multiple select</h5>
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
                            <Select placeholder="Select an option" options={options5} isMulti isSearchable={false} />
                        </div>
                        {codeArr.includes('code6') && (
                            <CodeHighlight>
                                <pre className="language-typescript">{`import Select from 'react-select';

const options5 = [
    { value: 'orange', label: 'Orange' },
    { value: 'white', label: 'White' },
    { value: 'purple', label: 'Purple' },
];

<Select placeholder="Select an option" options={options5} isMulti isSearchable={false}/>`}</pre>
                            </CodeHighlight>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Select2;
