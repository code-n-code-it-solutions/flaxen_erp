import React from 'react';

const CompanyForm = () => {


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('submitted')
    }
    return (
        <form onSubmit={(e)=>handleSubmit(e)}>

        </form>
    );
};

export default CompanyForm;
