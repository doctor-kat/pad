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
var core_1 = require('@angular/core');
var PADHerder_service_1 = require('./PADHerder.service');
var AppComponent = (function () {
    // asdf = {};
    function AppComponent(PADHerderService) {
        this.PADHerderService = PADHerderService;
        this.title = 'PADHerder App';
        this.teamID = '200357';
        this.PADHerder_Team = {};
        this.team = {};
    }
    AppComponent.prototype.getTeam = function (teamID) {
        var _this = this;
        this.PADHerderService.getTeam(teamID)
            .subscribe(function (response) {
            for (var _i = 0, _a = ["name", "leader", "sub1", "sub2", "sub3", "sub4", "friend_leader"]; _i < _a.length; _i++) {
                var p = _a[_i];
                _this.team[p] = response[p];
            }
        }, function (error) { console.log("Error happened: " + error); }, function () {
            console.log("Subscribed to /team/[id].");
            for (var _i = 0, _a = ["leader", "sub1", "sub2", "sub3", "sub4"]; _i < _a.length; _i++) {
                var p = _a[_i];
                _this.getSubs(_this.team[p], p);
            }
        });
    };
    AppComponent.prototype.getSubs = function (team, p) {
        var _this = this;
        this.PADHerderService.getSubs(team, p)
            .subscribe(function (response) {
            console.log(_this.team[p] = response.monster);
        }, function (error) { console.log("Error happened: " + error); }, function () { console.log("Subscribed to /monster/[id]."); });
    };
    AppComponent.prototype.ngOnInit = function () { this.getTeam(this.teamID); };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-app',
            // viewProviders: [HTTP_PROVIDERS],
            templateUrl: './PADHerder.component.html',
            providers: [PADHerder_service_1.PADHerderService]
        }), 
        __metadata('design:paramtypes', [PADHerder_service_1.PADHerderService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map