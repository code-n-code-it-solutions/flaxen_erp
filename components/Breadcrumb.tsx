import React from 'react';
import Link from "next/link";

interface BreadcrumbProps {
    items: any[];
}

const Breadcrumb = ({items}: BreadcrumbProps) => {
    return (
        <ul className="flex space-x-2 rtl:space-x-reverse">
            {items.map((item, index) => (
                <li key={index} className={index !== 0 ? "before:content-['/'] ltr:before:mr-2 rtl:before:ml-2" : ""}>
                    {item.href !== "#" ? (
                        <Link href={item.href} className="text-primary hover:underline">
                            {item.title}
                        </Link>
                    ) : (
                        <span>{item.title}</span>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default Breadcrumb;
