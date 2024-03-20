"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_provider_bundle_1 = require("@flashbots/ethers-provider-bundle");
var process_1 = require("process");
var dotenv = require("dotenv");
dotenv.config();
var ethers = require("ethers");
var utils = new ethers.utils;
var Wallet = new ethers.Wallet;
var FLASHBOTS_URL = "https://relay.flashbots.net";
var TOKEN_ADDRESS = "0x4cb9a7ae498cedcbb5eae9f25736ae7d428c9d66";
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var provider, authSigner, flashbotsProvider, sponsor, victim, abi, iface;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (process.env.SPONSOR_KEY === undefined ||
                    process.env.VICTIM_KEY === undefined) {
                    console.error("Please set both SPONSOR_KEY and VICTIM_KEY env");
                    (0, process_1.exit)(1);
                }
                provider = new ethers.providers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");
                authSigner = Wallet.createRandom();
                return [4 /*yield*/, ethers_provider_bundle_1.FlashbotsBundleProvider.create(provider, authSigner, FLASHBOTS_URL)];
            case 1:
                flashbotsProvider = _a.sent();
                sponsor = new Wallet(process.env.SPONSOR_KEY).connect(provider);
                victim = new Wallet(process.env.VICTIM_KEY).connect(provider);
                abi = ["function transfer(address, uint256) external"];
                iface = new utils.Interface(abi);
                provider.on("block", function (blockNumber) { return __awaiter(void 0, void 0, void 0, function () {
                    var targetBlockNumber, resp, resolution;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log(blockNumber);
                                targetBlockNumber = blockNumber + 1;
                                return [4 /*yield*/, flashbotsProvider.sendBundle([
                                        {
                                            signer: sponsor,
                                            transaction: {
                                                chainId: 5,
                                                type: 2,
                                                to: victim.address,
                                                value: utils.parseEther("0.00001"),
                                                maxFeePerGas: utils.parseUnits("3", "gwei"),
                                                maxPriorityFeePerGas: utils.parseUnits("2", "gwei")
                                            },
                                        },
                                        {
                                            signer: victim,
                                            transaction: {
                                                chainId: 5,
                                                type: 2,
                                                to: TOKEN_ADDRESS,
                                                gasLimit: "50000",
                                                data: iface.encoderFunctionData("cancelRedemption", [
                                                    utils.parseUnits("121", "esXAI"),
                                                ]),
                                                maxFeePerGas: utils.parseUnits("3", "gwei"),
                                                maxPriorityFeePerGas: utils.parseUnits("2", "gwei"),
                                            },
                                        },
                                    ], targetBlockNumber)];
                            case 1:
                                resp = _a.sent();
                                if ("error" in resp) {
                                    console.log(resp.error.message);
                                    return [2 /*return*/];
                                }
                                return [4 /*yield*/, resp.wait()];
                            case 2:
                                resolution = _a.sent();
                                if (resolution === ethers_provider_bundle_1.FlashbotsBundleResolution.BundleIncluded) {
                                    console.log("Congrats, included in ".concat(targetBlockNumber));
                                    (0, process_1.exit)(0);
                                }
                                else if (resolution === ethers_provider_bundle_1.FlashbotsBundleResolution.BlockPassedWithoutInclusion) {
                                    console.log("Not included in ".concat(targetBlockNumber));
                                }
                                else if (resolution === ethers_provider_bundle_1.FlashbotsBundleResolution.AccountNonceTooHigh) {
                                    console.log("Nonce too high, bailing");
                                    (0, process_1.exit)(1);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); };
main();
