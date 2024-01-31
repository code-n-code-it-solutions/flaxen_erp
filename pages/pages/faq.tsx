import Link from 'next/link';
import { useState, useEffect } from 'react';
import AnimateHeight from 'react-animate-height';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/slices/themeConfigSlice';

const Faq = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('FAQ'));
    });
    const [active, setActive] = useState<Number>();
    const togglePara = (value: Number) => {
        setActive((oldValue) => {
            return oldValue === value ? 0 : value;
        });
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="#" className="text-primary hover:underline">
                        Users
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>FAQ</span>
                </li>
            </ul>
            <div className="pt-5">
                <h2 className="text-center text-xl font-bold md:text-3xl">
                    Frequently Asked <span className="text-primary">Questions</span>
                </h2>
                <div className="mt-5 space-y-5">
                    <div className="rounded-md border border-[#ebedf2] bg-white dark:border-[#191e3a] dark:bg-black ">
                        <div className={`flex cursor-pointer rounded-t-md p-5  font-semibold ${active === 1 ? 'bg-primary/20 text-primary' : ''}`} onClick={() => togglePara(1)}>
                            <span className="text-primary">Getting started</span>
                            <div className="flex  ltr:ml-auto rtl:mr-auto">
                                <svg className={`h-5 w-5 ${active === 1 ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <AnimateHeight duration={300} height={active === 1 ? 'auto' : 0}>
                            <div className="p-5 font-semibold text-white-dark">
                                <p>
                                    {`Anim pariatur cliche reprehenderit, enim eiusmod high life
                  accusamus terry richardson ad squid. 3 wolf moon officia aute,
                  non cupidatat skateboard dolor brunch. Food truck quinoa
                  nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt
                  aliqua put a bird on it squid single-origin coffee nulla
                  assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft
                  beer labore wes anderson cred nesciunt sapiente ea proident.
                  Ad vegan excepteur butcher vice lomo. Leggings occaecat craft
                  beer farm-to-table, raw denim aesthetic synth nesciunt you
                  probably haven't heard of them accusamus labore sustainable
                  VHS.`}
                                </p>
                            </div>
                        </AnimateHeight>
                    </div>

                    <div className="rounded-md border border-[#ebedf2] bg-white dark:border-[#191e3a] dark:bg-black">
                        <div className={`flex cursor-pointer rounded-t-md p-5  font-semibold ${active === 2 ? 'bg-primary/20 text-primary' : ''}`} onClick={() => togglePara(2)}>
                            <span className="text-primary">How can I unzip product files</span>
                            <div className="flex  ltr:ml-auto rtl:mr-auto">
                                <svg className={`h-5 w-5 ${active === 2 ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <AnimateHeight duration={300} height={active === 2 ? 'auto' : 0}>
                            <div className="p-5 font-semibold text-white-dark">
                                <p>
                                    {`Anim pariatur cliche reprehenderit, enim eiusmod high life
                  accusamus terry richardson ad squid. 3 wolf moon officia aute,
                  non cupidatat skateboard dolor brunch. Food truck quinoa
                  nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt
                  aliqua put a bird on it squid single-origin coffee nulla
                  assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft
                  beer labore wes anderson cred nesciunt sapiente ea proident.
                  Ad vegan excepteur butcher vice lomo. Leggings occaecat craft
                  beer farm-to-table, raw denim aesthetic synth nesciunt you
                  probably haven't heard of them accusamus labore sustainable
                  VHS.`}
                                </p>
                            </div>
                        </AnimateHeight>
                    </div>

                    <div className="rounded-md border border-[#ebedf2] bg-white dark:border-[#191e3a] dark:bg-black">
                        <div className={`flex cursor-pointer rounded-t-md p-5  font-semibold ${active === 3 ? 'bg-primary/20 text-primary' : ''}`} onClick={() => togglePara(3)}>
                            <span className="text-primary">Sidebar not rendering CSS</span>
                            <div className="flex  ltr:ml-auto rtl:mr-auto">
                                <svg className={`h-5 w-5 ${active === 3 ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <AnimateHeight duration={300} height={active === 3 ? 'auto' : 0}>
                            <div className="p-5 font-semibold text-white-dark">
                                <p>
                                    {`Anim pariatur cliche reprehenderit, enim eiusmod high life
                  accusamus terry richardson ad squid. 3 wolf moon officia aute,
                  non cupidatat skateboard dolor brunch. Food truck quinoa
                  nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt
                  aliqua put a bird on it squid single-origin coffee nulla
                  assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft
                  beer labore wes anderson cred nesciunt sapiente ea proident.
                  Ad vegan excepteur butcher vice lomo. Leggings occaecat craft
                  beer farm-to-table, raw denim aesthetic synth nesciunt you
                  probably haven't heard of them accusamus labore sustainable
                  VHS.`}
                                </p>
                            </div>
                        </AnimateHeight>
                    </div>

                    <div className="rounded-md border border-[#ebedf2] bg-white dark:border-[#191e3a] dark:bg-black">
                        <div className={`flex cursor-pointer rounded-t-md p-5  font-semibold ${active === 4 ? 'bg-primary/20 text-primary' : ''}`} onClick={() => togglePara(4)}>
                            <span className="text-primary">Production Level Built</span>
                            <div className="flex  ltr:ml-auto rtl:mr-auto">
                                <svg className={`h-5 w-5 ${active === 4 ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <AnimateHeight duration={300} height={active === 4 ? 'auto' : 0}>
                            <div className="p-5 font-semibold text-white-dark">
                                <p>
                                    {`Anim pariatur cliche reprehenderit, enim eiusmod high life
                  accusamus terry richardson ad squid. 3 wolf moon officia aute,
                  non cupidatat skateboard dolor brunch. Food truck quinoa
                  nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt
                  aliqua put a bird on it squid single-origin coffee nulla
                  assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft
                  beer labore wes anderson cred nesciunt sapiente ea proident.
                  Ad vegan excepteur butcher vice lomo. Leggings occaecat craft
                  beer farm-to-table, raw denim aesthetic synth nesciunt you
                  probably haven't heard of them accusamus labore sustainable
                  VHS.`}
                                </p>
                            </div>
                        </AnimateHeight>
                    </div>

                    <div className="rounded-md border border-[#ebedf2] bg-white dark:border-[#191e3a] dark:bg-black">
                        <div className={`flex cursor-pointer rounded-t-md p-5  font-semibold ${active === 5 ? 'bg-primary/20 text-primary' : ''}`} onClick={() => togglePara(5)}>
                            <span className="text-primary">Compilation Issue</span>
                            <div className="flex  ltr:ml-auto rtl:mr-auto">
                                <svg className={`h-5 w-5 ${active === 5 ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <AnimateHeight duration={300} height={active === 5 ? 'auto' : 0}>
                            <div className="p-5 font-semibold text-white-dark">
                                <p>
                                    {`Anim pariatur cliche reprehenderit, enim eiusmod high life
                  accusamus terry richardson ad squid. 3 wolf moon officia aute,
                  non cupidatat skateboard dolor brunch. Food truck quinoa
                  nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt
                  aliqua put a bird on it squid single-origin coffee nulla
                  assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft
                  beer labore wes anderson cred nesciunt sapiente ea proident.
                  Ad vegan excepteur butcher vice lomo. Leggings occaecat craft
                  beer farm-to-table, raw denim aesthetic synth nesciunt you
                  probably haven't heard of them accusamus labore sustainable
                  VHS.`}
                                </p>
                            </div>
                        </AnimateHeight>
                    </div>

                    <div className="rounded-md border border-[#ebedf2] bg-white dark:border-[#191e3a] dark:bg-black">
                        <div className={`flex cursor-pointer rounded-t-md p-5  font-semibold ${active === 6 ? 'bg-primary/20 text-primary' : ''}`} onClick={() => togglePara(6)}>
                            <span className="text-primary">Getting started with starter kits</span>
                            <div className="flex  ltr:ml-auto rtl:mr-auto">
                                <svg className={`h-5 w-5 ${active === 6 ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <AnimateHeight duration={300} height={active === 6 ? 'auto' : 0}>
                            <div className="p-5 font-semibold text-white-dark">
                                <p>
                                    {`Anim pariatur cliche reprehenderit, enim eiusmod high life
                  accusamus terry richardson ad squid. 3 wolf moon officia aute,
                  non cupidatat skateboard dolor brunch. Food truck quinoa
                  nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt
                  aliqua put a bird on it squid single-origin coffee nulla
                  assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft
                  beer labore wes anderson cred nesciunt sapiente ea proident.
                  Ad vegan excepteur butcher vice lomo. Leggings occaecat craft
                  beer farm-to-table, raw denim aesthetic synth nesciunt you
                  probably haven't heard of them accusamus labore sustainable
                  VHS.`}
                                </p>
                            </div>
                        </AnimateHeight>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Faq;
