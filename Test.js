"use strict";
/**
 * @namespace Cart
 */
var server = require("server");
var collections = require("*/cartridge/scripts/util/collections");
var Transaction = require("dw/system/Transaction");

server.get("Order", function (req, res, next) {
    var reportingUrlsHelper = require("*/cartridge/scripts/reportingUrls");
    var OrderMgr = require("dw/order/OrderMgr");
    var OrderModel = require("*/cartridge/models/order");
    var Locale = require("dw/util/Locale");
    var Resource = require("dw/web/Resource");
    var order;
    order = OrderMgr.getOrder("00000104");
    var lastOrderID = Object.prototype.hasOwnProperty.call(
        req.session.raw.custom,
        "orderID"
    )
        ? req.session.raw.custom.orderID
        : null;
    if (lastOrderID === req.querystring.ID) {
        res.redirect(URLUtils.url("Home-Show"));
        return next();
    }
    var config = {
        numberOfLineItems: "*",
    };
    var currentLocale = Locale.getLocale(req.locale.id);
    var orderModel = new OrderModel(order, {
        config: config,
        countryCode: currentLocale.country,
        containerView: "order",
    });
    var passwordForm;
    var reportingURLs = reportingUrlsHelper.getOrderReportingURLs(order);
    if (!req.currentCustomer.profile) {
        passwordForm = server.forms.getForm("newPasswords");
        passwordForm.clear();
        res.render("checkout/confirmation/confirmation", {
            order: orderModel,
            returningCustomer: false,
            passwordForm: passwordForm,
            reportingURLs: reportingURLs,
            orderUUID: order.getUUID(),
        });
    } else {
        res.render("checkout/confirmation/confirmation", {
            order: orderModel,
            returningCustomer: true,
            reportingURLs: reportingURLs,
            orderUUID: order.getUUID(),
        });
    }
    req.session.raw.custom.orderID = req.querystring.ID; // eslint-disable-line no-param-reassign
    return next();
});
module.exports = server.exports();
