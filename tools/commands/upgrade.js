var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var file = require("../lib/FileUtil");
var service = require("../service/index");
var Project = require("../parser/EgretProject");
var path = require("path");
var UpgradeCommand = (function () {
    function UpgradeCommand() {
    }
    UpgradeCommand.prototype.execute = function () {
        this.run();
        return DontExitCode;
    };
    UpgradeCommand.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var version, modify, upgradeConfigArr, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        version = Project.utils.getVersion();
                        if (!version) {
                            version = "1.0.0";
                        }
                        modify = require("./upgrade/ModifyProperties");
                        upgradeConfigArr = [
                            { "v": "4.0.1", command: Upgrade_4_0_1 }
                        ];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, series(upgrade, upgradeConfigArr.concat())];
                    case 2:
                        _a.sent();
                        modify.save(upgradeConfigArr.pop().v);
                        globals.log(1702);
                        return [4 /*yield*/, service.shutdown(Project.utils.getProjectRoot())];
                    case 3:
                        _a.sent();
                        globals.exit(0);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.log("升级中断，错误信息如下");
                        console.log(e_1);
                        globals.exit(1705);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return UpgradeCommand;
}());
var series = function (cb, arr) {
    var parallel = 1;
    // allow default parallel count of 1 if array
    // passed as second param (this a good idea?)
    if (Array.isArray(parallel)) {
        arr = parallel;
        parallel = 1;
    }
    var results = [];
    var promises = [];
    for (var i = 0; i < parallel; i++)
        promises.push(Promise.resolve());
    arr.forEach(function (item, ix) {
        var position = ix % parallel;
        var promise = promises[position];
        promises[position] = promise.then(function () {
            return Promise.resolve(cb(item, ix, results))
                .then(function (res) { return results.push(res); });
        });
    });
    return Promise.all(promises)
        .then(function () { return results; });
};
function upgrade(info) {
    var version = Project.utils.getVersion();
    var v = info.v;
    var command;
    if (info.command) {
        command = new info.command();
    }
    var result = globals.compressVersion(version, v);
    if (result < 0) {
        globals.log(1704, v);
        if (!command) {
            return Promise.resolve(0);
        }
        else {
            var commandPromise = command.execute();
            if (typeof commandPromise == 'number') {
                console.error('internal error !!!');
            }
            else {
                return commandPromise;
            }
        }
    }
    else {
        return Promise.resolve(0);
    }
}
var Upgrade_4_0_1 = (function () {
    function Upgrade_4_0_1() {
    }
    Upgrade_4_0_1.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tsconfigPath, tsconfigContent, tsconfig;
            return __generator(this, function (_a) {
                tsconfigPath = Project.utils.getFilePath('tsconfig.json');
                tsconfigContent = file.read(tsconfigPath);
                tsconfig = JSON.parse(tsconfigContent);
                tsconfig.compilerOptions.lib = [
                    "es5", "dom", "es2015.promise"
                ];
                tsconfigContent = JSON.stringify(tsconfig, null, "\t");
                file.save(tsconfigPath, tsconfigContent);
                file.copy(path.join(egret.root, 'tools/templates/empty/polyfill'), Project.utils.getFilePath('polyfill'));
                return [2 /*return*/, 0];
            });
        });
    };
    return Upgrade_4_0_1;
}());
module.exports = UpgradeCommand;
