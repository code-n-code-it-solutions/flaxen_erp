export enum FORM_CODE_TYPE {
    VENDOR = 'vendor',
    PURCHASE_REQUISITION = 'purchase_requisition',
    LOCAL_PURCHASE_ORDER = 'local_purchase_order',
    GOOD_RECEIVE_NOTE = 'good_receive_note',
    VENDOR_BILL = 'vendor_bill',
    PRODUCTION = 'production',
    PRODUCT_ASSEMBLY = 'product_assembly',
    EMPLOYEE = 'employee',
    CUSTOMER = 'customer',
    RAW_MATERIAL = 'raw_material',
    ASSET = 'asset',
    SERVICE = 'service',
    FILLING = 'filling',
    QUOTATION = 'quotation',
    EXPENSE = 'general_payment_voucher',
    DELIVERY_NOTE = 'delivery_note',
    SALE_INVOICE = 'sale_invoice',
    CLIENT = 'client',
    PROJECT = 'project',
    CONSULTANT = 'consultant',
}

export enum RAW_PRODUCT_LIST_TYPE {
    PRODUCT_ASSEMBLY = 'product_assembly',
    PRODUCTION = 'production',
    FILLING = 'filling',
    PURCHASE_REQUISITION = 'purchase_requisition',
    LOCAL_PURCHASE_ORDER = 'local_purchase_order',
    GOOD_RECEIVE_NOTE = 'good_receive_note',
    VENDOR_BILL = 'vendor_bill',
    QUOTATION = 'quotation',
    EXPENSE = 'expense',
}

export enum ButtonType {
    button = 'button',
    submit = 'submit',
    reset = 'reset',
    link = 'link',
    icon = 'icon'
}

export enum ButtonVariant {
    primary = 'primary',
    secondary = 'secondary',
    success = 'success',
    danger = 'danger',
    warning = 'warning',
    info = 'info',
    light = 'light',
    dark = 'dark',
    link = 'link'
}

export enum ButtonSize {
    small = 'sm',
    medium = 'md',
    large = 'lg'
}

export enum IconType {
    print = 'print',
    view = 'view',
    edit = 'edit',
    delete = 'delete',
    add = 'add',
    download = 'download',
    upload = 'upload',
    cancel = 'cancel',
    sum = 'sum',
    back = 'back',
    simpleFile = 'simpleFile',
    fileWithData = 'fileWithData',
    fileWithCode = 'fileWithCode',
}

export enum ListingType {

}


export enum ActionList {
    CREATE = 'create',
    VIEW_DETAIL = 'view-detail',
    UPDATE = 'update',
    DELETE = 'delete',
    VIEW_ALL = 'view-all',
    PRINT = 'print-all',
    EXPORT = 'export',
    EMAIL = 'email',
    PRINT_DETAIL = 'print-detail',
    ARCHIVE = 'archive',
    UNARCHIVE = 'unarchive',
    DUPLICATE = 'duplicate',
    PRINT_LABEL = 'print-label',
    COPY = 'copy',
}


export enum AppBasePath {
    Raw_Product = '/apps/inventory/raw-product',
    Product_Assembly = '/apps/manufacturing/formula',
    Production = '/apps/manufacturing/production',
    Filling = '/apps/manufacturing/fillings',
    Purchase_Requisition = '/apps/purchase/purchase-requisition',
    Local_Purchase_Order = '/apps/purchase/lpo',
    Good_Receive_Note = '/apps/purchase/grn',
    Vendor = '/apps/purchase/configuration/vendor',
    Quotation = '/apps/sales/quotations',
    Delivery_Note = '/apps/sales/delivery-notes',
    Customer = '/apps/sales/configuration/customers',
    Invoice = '/apps/sales/invoices',
    Invoice_Payment = '/apps/sales/payments',
    Vendor_Bill = '/apps/purchase/bills',
    Vendor_Payment = '/apps/purchase/payments',
    Raw_Material_Stock = '/apps/reporting/stocks/raw-materials',
    Finish_Good_Stock = '/apps/reporting/stocks/finish-goods',
    Stock_Ageing_Report = '/apps/reporting/stocks/stock-ageing',
    Sales_Reporting = '/apps/reporting/sales',
    Purchases_Reporting = '/apps/reporting/purchases',
    Invoicing_Reporting = '/apps/reporting/invoicing',
    Report_Accounts = '/apps/accounting/accounts',
    General_Journal = '/apps/accounting/general-journal',
    Vendor_Report_Account = '/apps/reporting/purchases/vendors/account',
    Vendor_Report_Statement = '/apps/reporting/purchases/vendors/statement',
    Customer_Report_Account = '/apps/reporting/sales/customers/account',
    Customer_Report_Statement = '/apps/reporting/sales/customers/statement',
    Employee_Permission = '/apps/employees/configuration/permissions',
    Super_Admin_Permission = '/apps/super-admin/permissions',
    Employee = '/apps/employees/employees-list',
    Credit_Notes = '/apps/sales/credit-notes',
    Debit_Notes = '/apps/purchase/debit-notes',
    General_Payment_Voucher = '/apps/accounting/general-voucher/payment-voucher',
    General_Receipt_Voucher = '/apps/accounting/general-voucher/receipt-voucher',
    Template = '/hrm/configuration/template',
    Client = '/apps/project/configuration/clients',
    boq = '/apps/project/boq',
    Project = '/apps/project/project-list',
    Consultant = '/apps/project/configuration/consultant',
    Bank_Accounts = '/apps/accounting/configuration/bank-accounts',
}
