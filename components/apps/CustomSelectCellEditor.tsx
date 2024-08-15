import React, { useState, useEffect } from 'react';

const CustomSelectCellEditor = (props: any) => {
    const [selectedValue, setSelectedValue] = useState(props.value);

    useEffect(() => {
        setSelectedValue(props.value);
    }, [props.value]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(event.target.value);
    };

    const handleBlur = () => {
        props.stopEditing();
    };

    useEffect(() => {
        if (selectedValue !== props.value) {
            props.api.stopEditing();
        }
    }, [selectedValue]);

    return (
        <select
            value={selectedValue}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ width: '100%' }}
            autoFocus
        >
            <option value="">Select...</option>
            {props.options.map((option: any) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default CustomSelectCellEditor;
