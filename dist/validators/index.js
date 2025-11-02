"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./category.validators"), exports);
__exportStar(require("./client.validators"), exports);
__exportStar(require("./depot.validators"), exports);
__exportStar(require("./rol.validators"), exports);
__exportStar(require("./movement.validators"), exports);
__exportStar(require("./product.validators"), exports);
__exportStar(require("./provider.validators"), exports);
__exportStar(require("./purchase.validators"), exports);
__exportStar(require("./purchase-general-item.validators"), exports);
__exportStar(require("./purchase-lot-item.validators"), exports);
__exportStar(require("./type-payment.validators"), exports);
__exportStar(require("./sale.validators"), exports);
__exportStar(require("./sale-detail.validators"), exports);
__exportStar(require("./stock-general.validators"), exports);
__exportStar(require("./stock-lot.validators"), exports);
__exportStar(require("./user.validators"), exports);
