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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeHealthCheckService = void 0;
const status_to_score_1 = require("./utils/status-to-score");
class CompositeHealthCheckService {
    constructor(checks) {
        this.checks = checks;
    }
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield Promise.all(this.checks.map(check => check.check()));
            const scoredResults = results.map(result => (Object.assign(Object.assign({}, result), { score: (0, status_to_score_1.statusToScore)(result.status) })));
            const totalScore = scoredResults.reduce((acc, result) => acc + result.score, 0);
            const averageScore = totalScore / scoredResults.length;
            const finalStatus = averageScore >= 0.75 ? 'healthy' : averageScore >= 0.5 ? 'degraded' : 'unhealthy';
            const allDetails = scoredResults.reduce((acc, result) => {
                if (result.details) {
                    acc.push(result.details);
                }
                return acc;
            }, []);
            return {
                status: finalStatus,
                score: averageScore,
                details: averageScore >= 0.75 ? 'All systems are operational' : averageScore >= 0.5 ? 'Some systems are degraded' : 'Some systems are down',
                checks: allDetails,
                lastChecked: new Date()
            };
        });
    }
}
exports.CompositeHealthCheckService = CompositeHealthCheckService;
