/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

/* 本地配置 */
var host = 'https://ss-merchant.gongsibao.com'
// var host = 'http://39.107.234.14:3702'
// var host = 'http://127.0.0.1:3702'
// var host = 'http://192.168.201.177:3702'

var config = {
  // 登录
  login: `${host}/web/uc/userCtl/login`,
  // 用户信息查询
  currentUser: `${host}/web/uc/userCtl/currentUser`,
  // 获取oss参数地址
  getOssConfig: `${host}/web/common/metaCtl/getOssConfig`,
  // 订单列表
  orderCtlPage: `${host}/web/saas/orderCtl/page`,
  // 订单详情
  platformInfo: `${host}/web/saas/orderCtl/info`,
  // 订单支付
  orderCtlOfflinePay: `${host}/web/saas/orderCtl/offlinePay`,
  // 支付验证
  checkPay: `${host}/web/saas/orderCtl/checkPay`,
  // 季度账期
  getReportDataQuarter: `${host}/web/tax/taxCtl/getReportDataQuarter`,
  // 月账期
  getReportData: `${host}/web/tax/taxCtl/getReportData`,
  // 根据用户id查询账簿
  getCustomerById: `${host}/web/tax/taxCtl/getCustomerById`,
  // 个体户列表
  businessmenPage: `${host}/web/saas/businessmenCtl/saasorderbusinessmenPage`,
  // 打款列表
  orderPage: `${host}/web/trade/tradeCtl/orderPage`,
  // 打款详情
  orderInfo: `${host}/web/trade/tradeCtl/orderInfo`,
  // 交易列表
  itemPage: `${host}/web/trade/tradeCtl/itemPage`,
  // 上传数据
  parseItems: `${host}/web/trade/tradeCtl/parseItems`,
  // 锁定批次
  lockOrder: `${host}/web/trade/tradeCtl/lockOrder`,
  // 申请付款
  offlinePay: `${host}/web/trade/tradeCtl/offlinePay`,
  // 发票列表
  invoicePage: `${host}/web/saas/invoiceCtl/invoicePage`,
  // 费用记录类型
  feeTypeDic: `${host}/web/saas/merchantCtl/feeTypeDic`,
  // 发票申请-交易信息列表
  platformPage: `${host}/web/saas/invoiceCtl/platformPage`,
  // 功能2
  invoiceCtlApply: `${host}/web/saas/invoiceCtl/apply`,
  // 发票申请-功能1-交易列表
  saasOrderPage: `${host}/web/saas/invoiceCtl/orderPage`,
  // 发票申请-功能1-确定个体户开票
  confirmInvoice: `${host}/web/saas/invoiceCtl/confirmInvoice`,
  // 发票抬头
  merchantCtlTitle: `${host}/web/saas/merchantCtl/title`,
  // 邮寄地址
  merchantCtlAddr: `${host}/web/saas/merchantCtl/addr`,
  // 邮寄地址编辑
  saveAddr: `${host}/web/saas/merchantCtl/saveAddr`,
  // 发票申请列表
  merchantinvoiceapplyPage: `${host}/web/saas/invoiceCtl/merchantinvoiceapplyPage`,
  // 发票详情
  invoiceOrder: `${host}/web/saas/invoiceCtl/invoiceOrder`,
  //批量打款 交易上传
  getFeeTypeWithCache: `${host}/web/saas/merchantCtl/getFeeTypeWithCache`,
  //支付信息
  delvierInfoes: `${host}/web/saas/merchantCtl/delvierInfo`,
  
  
  
}

module.exports = config
