import PerfectScrollbar from 'react-perfect-scrollbar';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import Link from 'next/link';
import {toggleSidebar} from '@/store/slices/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import {IRootState, useAppSelector} from '@/store';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';

const Sidebar = () => {
    const router = useRouter();
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const {permittedMenus, moduleMenus, activeModule} = useAppSelector((state) => state.menu);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window?.location?.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [router.pathname]);

    const setActiveRoute = () => {
        let allLinks = document.querySelectorAll('.sidebar ul a.active');
        for (let i = 0; i < allLinks.length; i++) {
            const element = allLinks[i];
            element?.classList.remove('active');
        }

        const selector = document.querySelector('.sidebar ul a[href="' + window?.location?.pathname + '"]');

        selector?.classList.add('active');
    };

    useEffect(() => {
        setActiveRoute()
    }, [activeModule]);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed top-0 bottom-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="h-full bg-white dark:bg-black">
                    <div className="flex items-center justify-between px-4 py-3">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            {/*<img className="ml-[5px] w-8 flex-none" src="/assets/images/logo.svg" alt="logo" />*/}
                            <span
                                className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">FLAXEN
                                PAINTS</span>
                        </Link>

                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg" className="m-auto h-5 w-5">
                                <path d="M13 19L7 12L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                                <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor"
                                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                        <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
                            {moduleMenus?.map((menu: any, moduleIndex: number) => (
                                menu.children?.length > 0
                                    ? <li className="menu nav-item" key={moduleIndex}>
                                        <button type="button"
                                                className={`${currentMenu === menu.translation_key ? 'active' : ''} nav-link group w-full`}
                                                onClick={() => toggleMenu(menu.translation_key)}>
                                            <div className="flex items-center">
                                                <div dangerouslySetInnerHTML={{__html: menu.icon}}></div>
                                                <span
                                                    className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t(menu.translation_key)}</span>
                                            </div>

                                            <div
                                                className={currentMenu === menu.translation_key ? 'rotate-90' : 'rtl:rotate-180'}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5"
                                                          strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        </button>

                                        <AnimateHeight
                                            duration={300}
                                            height={currentMenu === menu.translation_key ? 'auto' : 0}
                                        >
                                            <ul className="sub-menu text-gray-500">
                                                {menu.children?.map((menu: any, menuIndex: number) => (
                                                    menu.children?.length > 0
                                                        ? <></>
                                                        : <li key={menuIndex}>
                                                            <Link href={menu.route}>{t(menu.translation_key)}</Link>
                                                        </li>
                                                ))}
                                            </ul>
                                        </AnimateHeight>
                                    </li>
                                    : <li className="nav-item" key={moduleIndex}>
                                        <Link href={menu.route} className="group">
                                            <div className="flex items-center">
                                                <div dangerouslySetInnerHTML={{__html: menu.icon}}></div>
                                                <span
                                                    className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t(menu.translation_key)}</span>
                                            </div>
                                        </Link>
                                    </li>
                            ))}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
