"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// PADHerder HTTP Service
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var PADHerderService = (function () {
    function PADHerderService(http) {
        this.http = http;
        this.PADHerderTeamUrl = 'https://www.padherder.com/user-api/team/';
    }
    PADHerderService.prototype.getTeam = function (teamID) {
        console.log(this.teamUrl = this.PADHerderTeamUrl + teamID);
        return this.http
            .get(this.teamUrl)
            .map(function (response) { return response.json(); })
            .do(function (data) { return console.log(data); })
            .catch(this.handleError);
        ;
        // console.log(this.asdf);
        // return Observable.throw("this.PADHerderTeamUrl")
    };
    PADHerderService.prototype.extractData = function (res) {
        var body = res.json();
        return body.data || {};
    };
    PADHerderService.prototype.handleError = function (error) {
        console.error(error);
        var msg = "Error status code " + error.status + " at " + error.url;
        return Observable_1.Observable.throw(msg);
    };
    PADHerderService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], PADHerderService);
    return PADHerderService;
}());
exports.PADHerderService = PADHerderService;
//# sourceMappingURL=PADHerder.service.js.map