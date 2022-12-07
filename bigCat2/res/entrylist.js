import projectCfg from '../config/project.json';
export const allList = [{
    key: 'shenqingdan',
    icon: 'icon-chuchashenqingdan',
    text: '申请单据',
    category: '单据类型',
    favorite: true,
    formKey: 'MM_PurchaseOrderQuery',
    oid: '-1',
    color: '#BBDEFB'
}, 
{
    key: 'shenqingdan',
    icon: 'icon-chuchashenqingdan',
    text: '申请单据',
    category: '单据类型',
    favorite: true,
    formKey: 'MM_PurchaseOrderQuery',
    oid: '-1',
    color: '#BBDEFB'
},{
    key: 'jiekuandan',
    icon: 'icon-jiekuandan',
    text: '扫码查询',
    category: '单据类型',
    formKey:"SMCX",
    favorite: true,
    color: '#90CAF9'
}, {
    key: 'baoxiaodan',
    icon: 'icon-wodebaoxiaodan',
    text: '报销丹丹',
    category: '单据类型',
    formKey: 'FSSC_HospitalityReimbursementView',
    oid: "-1",
    favorite: true,
    color: '#63B5F6'
}, {
    key: 'zhangben',
    icon: 'icon-myaccount',
    text: '账本算算',
    category: '记录消费',
    formKey: 'FSSC_BooksQuery',
    oid: "-1",
    favorite: true,
    color: '#42A5F5'
}, {
    key: 'fapiao',
    icon: 'icon-fapiao',
    text: '发票啦啦',
    category: '记录消费',
    formKey: 'FSSC_InvoiceEntry',
    oid: "-1",
    modal: true,
    favorite: true,
    color: '#2196F3'
}, {
    key: 'baobiao',
    icon: 'icon-baobiao',
    text: '报表加加',
    category: '其他',
    favorite: false,
    color: '#1E88E5'
}, {
    key: 'shanglv',
    icon: 'icon-ly',
    text: '同程哈哈',
    category: '其他',
    type: 'thirdpart',
    service: 'CityTourPhoneLoginService',
    favorite: true,
    color: '#1976D2'
}, ];

export function saveSelectedList(list) {
    localStorage.setItem(storageKey, JSON.stringify(list));
}

const storageKey = `${projectCfg.sessionKey}_selectedList`;
const tmp = localStorage.getItem(storageKey);

export let selectedList  =  [
    {
        key: 'purreceipt',
        icon: 'icon-purreceipt',
        text: '采购收货',
        category: '单据类型',
        favorite: true,
        formKey: 'MM_GoodsReceipt',
        oid: '-1',
        color: '#008DF5',
        status: "new"
    },
    {
        key: 'saleshipments',
        icon: 'icon-saleshipments',
        text: '销售发货',
        category: '单据类型',
        favorite: true,
        formKey: 'SD_CreateOutboundDelivery',
        oid: '-1',
        color: '#008DF5',
        status:"new"
    },
    {
        key: 'receipt',
        icon: 'icon-receipt',
        text: '其它收货',
        category: '单据类型',
        favorite: true,
        formKey: 'MM_CreateDocument',
        oid: '-1',
        color: '#008DF5',
        status:"new"
    },
    {
        key: 'shipments',
        icon: 'icon-shipments',
        text: '其它发货',
        category: '单据类型',
        formKey:"MM_CreateDocument1",
        favorite: true,
        oid:'-1',
        color: '#008DF5',
        status:"new"
    },
    {
        key: 'sales',
        icon: 'icon-sales',
        text: '销售订单',
        category: '单据类型',
        favorite: true,
        formKey: 'SD_CreateSalesOrder',
        oid: '-1',
        color: '#008DF5',
        status:"new"
    },
    {
        key: 'salesinquiries',
        icon: 'icon-salesinquiries',
        text: '销售订单查询',
        category: '单据类型',
        favorite: true,
        formKey: 'SD_SaleOrderQuery',
        oid: '-1',
        color: '#008DF5'
    },
    {
        key: 'history',
        icon: 'icon-history',
        text: '历史查询',
        category: '单据类型',
        favorite: true,
        formKey: 'MM_MateralStockDetail_Rpt',
        oid: '-1',
        color: '#008DF5'
    },
    {
        key: 'inventory',
        icon: 'icon-inventory',
        text: '库存查询',
        category: '单据类型',
        favorite: true,
        formKey: 'Cond_MM_MaterialBalanceQuery',
        oid: '-1',
        color: '#008DF5'
    },
    {
        key: 'material',
        icon: 'icon-material',
        text: '物料凭证查询',
        category: '单据类型',
        favorite: true,
        formKey: 'MM_MaterialDocumentQuery_Rpt',
        oid: '-1',
        color: '#008DF5'
    }
];

if(tmp) {
    selectedList = JSON.parse(tmp);
}
