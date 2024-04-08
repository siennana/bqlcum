var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var leaderboardUrl = 'https://40ae5vnl08.execute-api.eu-central-1.amazonaws.com/default/dailydeductions';
/**
 * returns latest date which has passed 5pm EST
 */
var getLatestIssue = function () {
    var currentDate = new Date();
    currentDate.setMilliseconds(0);
    currentDate.setSeconds(0);
    currentDate.setMinutes(0);
    if (currentDate.getHours() < 18) {
        currentDate.setTime(currentDate.getTime() - (24 * 60 * 60 * 1000));
    }
    currentDate.setHours(17);
    return Math.floor(currentDate.getTime() / 1000);
};
var getUrlForIssue = function () {
    var issueDate = getLatestIssue();
    return "".concat(leaderboardUrl, "?issue=").concat(issueDate);
};
/**
 * fetches leaderboard data for a given issue
 */
function fetchLeaderboardData() {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    url = getUrlForIssue();
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.json()];
                case 2:
                    e_1 = _a.sent();
                    console.log("error fetching data");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
;
/*
 * gets formatted leaderboard data and adds to DOM
 */
function getLeaderboardData() {
    return __awaiter(this, void 0, void 0, function () {
        var rawData, sortedData, formattedData, dataElement;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchLeaderboardData()];
                case 1:
                    rawData = _a.sent();
                    sortedData = rawData.sort(function (a, b) {
                        return a.created_at - b.created_at;
                    });
                    formattedData = sortedData.map(function (resObj) {
                        return {
                            name: resObj['name'],
                            created_at: new Date(resObj['created_at'])
                        };
                    });
                    dataElement = document.getElementById('data');
                    if (dataElement) {
                        formattedData.forEach(function (obj) {
                            var s = "".concat(obj.name, " completed at ").concat(new Date(obj.created_at).toLocaleTimeString(), "\n");
                            var newHtml = "<div>".concat(s, "</div>");
                            dataElement.innerHTML += newHtml;
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
getLeaderboardData();
