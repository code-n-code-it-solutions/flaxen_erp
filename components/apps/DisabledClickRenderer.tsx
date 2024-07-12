import React from 'react';

const DisabledClickRenderer = (props:any) => {
    return (
        <div
            style={{ pointerEvents: 'none' }}
        >
            {props.value}
        </div>
    );
};

export default DisabledClickRenderer;
