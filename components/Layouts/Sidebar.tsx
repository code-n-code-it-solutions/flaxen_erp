import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '@/store/slices/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState, useAppSelector } from '@/store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { setActiveMenu } from '@/store/slices/menuSlice';

const Sidebar = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const { activeModule } = useAppSelector((state) => state.menu);
    const { menus } = useAppSelector((state) => state.user);

    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [subCurrentMenu, setSubCurrentMenu] = useState<string>('');
    const [subSubCurrentMenu, setSubSubCurrentMenu] = useState<string>('');

    const handleToggleMenu = (menu: string) => {
        setCurrentMenu((prev) => (prev === menu ? '' : menu));
    };

    const handleToggleSubMenu = (menu: string) => {
        setSubCurrentMenu((prev) => (prev === menu ? '' : menu));
    };

    const handleToggleSubSubMenu = (menu: string) => {
        setSubSubCurrentMenu((prev) => (prev === menu ? '' : menu));
    };

    const setActiveRoute = () => {
        document.querySelectorAll('.sidebar ul a.active').forEach((element) => {
            element.classList.remove('active');
        });
        const activeLink = document.querySelector(`.sidebar ul a[href="${window.location.pathname}"]`);
        activeLink?.classList.add('active');
    };

    useEffect(() => {
        const initActiveMenu = document.querySelector(`.sidebar ul a[href="${window.location.pathname}"]`);
        if (initActiveMenu) {
            initActiveMenu.classList.add('active');
            const parentMenu = initActiveMenu.closest('ul.sub-menu');
            if (parentMenu) {
                const menuElement: any = parentMenu.closest('li.menu')?.querySelector('.nav-link');
                if (menuElement) {
                    setTimeout(() => {
                        menuElement.click();
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

    useEffect(() => {
        setActiveRoute();
    }, [activeModule]);

    useEffect(() => {
        setSubCurrentMenu('');
        setSubSubCurrentMenu('');
    }, []);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed top-0 bottom-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}>
                <div className="h-full bg-white dark:bg-black">
                    <div className="flex items-center justify-between px-4 py-3">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            <span
                                className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">
                                S-ERP
                            </span>
                        </Link>
                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg" className="m-auto h-5 w-5">
                                <path d="M13 19L7 12L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                      strokeLinejoin="round" />
                                <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor"
                                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                        <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
                            {menus?.map((plugin, pluginIndex) => (
                                plugin.menus?.length > 0 ? (
                                    <li className="menu nav-item" key={pluginIndex}>
                                        <button
                                            type="button"
                                            className={`nav-link group w-full ${currentMenu === plugin.id + '-' + plugin.plugin_name.toLowerCase() ? 'active' : ''}`}
                                            onClick={() => handleToggleMenu(plugin.id + '-' + plugin.plugin_name.toLowerCase())}
                                        >
                                            <div className="flex items-center">
                                                <div dangerouslySetInnerHTML={{ __html: plugin.icon }}></div>
                                                <span
                                                    className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t(plugin.plugin_name)}</span>
                                            </div>
                                            <div
                                                className={currentMenu === plugin.id + '-' + plugin.plugin_name.toLowerCase() ? 'rotate-90' : 'rtl:rotate-180'}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5"
                                                          strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </button>
                                        <AnimateHeight duration={300}
                                                       height={currentMenu === plugin.id + '-' + plugin.plugin_name.toLowerCase() ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                {plugin.menus.map((menu: any, index: number) => (
                                                    menu.children?.length > 0 ? (
                                                        <li className="menu nav-item" key={index}>
                                                            <button
                                                                type="button"
                                                                className={`w-full ${subCurrentMenu === menu.id + '-' + menu.translation_key ? 'open' : ''} hover:bg-gray-100 ltr:before:mr-2 rtl:before:ml-2 dark:text-[#888ea8] dark:hover:bg-gray-900`}
                                                                onClick={() => handleToggleSubMenu(menu.id + '-' + menu.translation_key)}
                                                            >
                                                                {t(menu.translation_key)}
                                                                <div
                                                                    className={subCurrentMenu === menu.id + '-' + menu.translation_key ? 'rotate-90' : 'rtl:rotate-180'}>
                                                                    <svg width="16" height="16" viewBox="0 0 24 24"
                                                                         fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M9 5L15 12L9 19" stroke="currentColor"
                                                                              strokeWidth="1.5" strokeLinecap="round"
                                                                              strokeLinejoin="round" />
                                                                    </svg>
                                                                </div>
                                                            </button>
                                                            <AnimateHeight duration={300}
                                                                           height={subCurrentMenu === menu.id + '-' + menu.translation_key ? 'auto' : 0}>
                                                                <ul className="sub-menu text-gray-500">
                                                                    {menu.children.map((subMenu: any, i: number) => (
                                                                        subMenu.children?.length > 0 ? (
                                                                            <li className="menu nav-item" key={i}>
                                                                                <button
                                                                                    type="button"
                                                                                    className={`w-full ${subSubCurrentMenu === subMenu.id + '-' + subMenu.translation_key ? 'open' : ''} hover:bg-gray-100 ltr:before:mr-2 rtl:before:ml-2 dark:text-[#888ea8] dark:hover:bg-gray-900`}
                                                                                    onClick={() => handleToggleSubSubMenu(subMenu.id + '-' + subMenu.translation_key)}
                                                                                >
                                                                                    {t(subMenu.translation_key)}
                                                                                    <div
                                                                                        className={subSubCurrentMenu === subMenu.id + '-' + subMenu.translation_key ? 'rotate-90' : 'rtl:rotate-180'}>
                                                                                        <svg width="16" height="16"
                                                                                             viewBox="0 0 24 24"
                                                                                             fill="none"
                                                                                             xmlns="http://www.w3.org/2000/svg">
                                                                                            <path d="M9 5L15 12L9 19"
                                                                                                  stroke="currentColor"
                                                                                                  strokeWidth="1.5"
                                                                                                  strokeLinecap="round"
                                                                                                  strokeLinejoin="round" />
                                                                                        </svg>
                                                                                    </div>
                                                                                </button>
                                                                                <AnimateHeight
                                                                                    duration={300}
                                                                                    height={subSubCurrentMenu === subMenu.id + '-' + subMenu.translation_key ? 'auto' : 0}
                                                                                >
                                                                                    <ul className="sub-menu text-gray-500">
                                                                                        {subMenu.children.map((subSubMenu: any, j: number) => (
                                                                                            <li key={j}>
                                                                                                <Link
                                                                                                    // onClick={() => dispatch(setActiveMenu(subSubMenu))}
                                                                                                    href={subSubMenu.rouxwte || ''}>
                                                                                                    {t(subSubMenu.translation_key)}
                                                                                                </Link>
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                </AnimateHeight>
                                                                            </li>
                                                                        ) : (
                                                                            <li key={i}>
                                                                                <Link href={subMenu.route || ''}
                                                                                      onClick={() => dispatch(setActiveMenu(subMenu))}>
                                                                                    {t(subMenu.translation_key)}
                                                                                </Link>
                                                                            </li>
                                                                        )
                                                                    ))}
                                                                </ul>
                                                            </AnimateHeight>
                                                        </li>
                                                    ) : (
                                                        <li key={index}>
                                                            <Link
                                                                // onClick={() => dispatch(setActiveMenu(menu))}
                                                                href={menu.route || ''}>{t(menu.translation_key)}</Link>
                                                        </li>
                                                    )
                                                ))}
                                            </ul>
                                        </AnimateHeight>
                                    </li>
                                ) : (
                                    <li className="nav-item" key={pluginIndex}>
                                        <Link href={plugin.route || ''} className="group">
                                            <div className="flex items-center">
                                                <div dangerouslySetInnerHTML={{ __html: plugin.icon }}></div>
                                                <span
                                                    className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t(plugin.translation_key)}</span>
                                            </div>
                                        </Link>
                                    </li>
                                )
                            ))}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
