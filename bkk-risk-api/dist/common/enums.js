"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportSource = exports.CongestionLevel = exports.RemediationStatus = exports.RiskLevel = void 0;
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "LOW";
    RiskLevel["MEDIUM"] = "MEDIUM";
    RiskLevel["HIGH"] = "HIGH";
    RiskLevel["CRITICAL"] = "CRITICAL";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
var RemediationStatus;
(function (RemediationStatus) {
    RemediationStatus["PENDING"] = "PENDING";
    RemediationStatus["IN_PROGRESS"] = "IN_PROGRESS";
    RemediationStatus["COMPLETED"] = "COMPLETED";
    RemediationStatus["CANCELLED"] = "CANCELLED";
})(RemediationStatus || (exports.RemediationStatus = RemediationStatus = {}));
var CongestionLevel;
(function (CongestionLevel) {
    CongestionLevel["NORMAL"] = "NORMAL";
    CongestionLevel["CONGESTED"] = "CONGESTED";
    CongestionLevel["BLOCKED"] = "BLOCKED";
})(CongestionLevel || (exports.CongestionLevel = CongestionLevel = {}));
var ImportSource;
(function (ImportSource) {
    ImportSource["THAIRSC"] = "THAIRSC";
    ImportSource["ITIC"] = "ITIC";
    ImportSource["BMA_OPEN_DATA"] = "BMA_OPEN_DATA";
})(ImportSource || (exports.ImportSource = ImportSource = {}));
//# sourceMappingURL=enums.js.map