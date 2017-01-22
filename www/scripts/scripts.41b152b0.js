"use strict";function createCookie(a,b,c){var d="";if(c){var e=new Date;e.setTime(e.getTime()+24*c*60*60*1e3),d="; expires="+e.toUTCString()}document.cookie=a+"="+b+d+"; path=/"}function fetchData(){var a=angular.injector(["ng","ngStorage"]),b=a.get("$http"),c=a.get("$window"),d=a.get("$localStorage");return b.get("/api/app/com.swttt.homeydash/config.json").then(function(a){var b=a.data.result;b.httpconfig={headers:{Authorization:"Bearer "+a.data.result.bearertoken,"Content-Type":"application/json"}},b.forcepersist?localStorage.setItem("bearer_token",a.data.result.bearertoken):localStorage.setItem("bearer_token",null),"undefined"===b.general.idletime&&(console.log("no idletime found"),b.general.idletime=5),angular.module("homeydashV3App").constant("CONFIG",b),angular.module("homeydashV3App").run(["$rootScope","CONFIG",function(a,b){a.CONFIG=b}]),console.log(b)},function(a){401===a.status&&(c.location.href="/manager/users/?redirect_uri=%2Fapp%2Fcom.swttt.homeydash%2F"),403===a.status&&(delete d.httpHeaders,c.location.reload())})}function bootstrapApplication(){angular.element(document).ready(function(){angular.bootstrap(document,["homeydashV3App"])})}localStorage.getItem("bearer_token")&&createCookie("bearer_token",localStorage.getItem("bearer_token"),7),fetchData().then(bootstrapApplication),angular.module("homeydashV3App",["ngAnimate","ngResource","ngSanitize","ngMaterial","ui.router","ngScrollbars","ngStorage","ngIdle","ui.sortable","angularInlineEdit","mgo-angular-wizard","rt.debounce"]).config(["$mdThemingProvider","IdleProvider","KeepaliveProvider","CONFIG",function(a,b,c,d){d.general.idletime&&b.idle(d.general.idletime),b.timeout(!1),a.theme("default").primaryPalette("orange").accentPalette("orange")}]).run(["$rootScope","alldevices","CONFIG","socket","$sce","$mdDialog","Idle","wallpaper","$http",function(a,b,c,d,e,f,g,h,i){c.general.idletime&&g.watch(),h().then(function(b){a.wallpaper=b.data.result.properties.wallpaper}),i.get("setup.json").then(function(b){console.log(b.data),a.SETUP=b.data}),b().then(function(b){a.devicelist=b.data.result}).then(function(){angular.forEach(c.pages,function(b){angular.forEach(b.widgets,function(b){angular.forEach(b.capability,function(c){d.on(c,b.deviceid,function(d){console.log(d),a.devicelist[b.deviceid].state[c]=d,a.$apply()})})})})})}]).run(["$rootScope","$state","$localStorage",function(a,b,c){c.defaultPage||(c.defaultPage=!1),a.$on("$stateChangeStart",function(d,e,f){e.redirectTo&&(d.preventDefault(),b.go(e.redirectTo,f,{location:"replace"})),"main.page"===e.name&&(a.CONFIG.pages.filter(function(a){return a.pagename===f.pagename}).length||(d.preventDefault(),console.log("Page not found!"),b.go("main"))),"setup.pages.page"===e.name&&(a.CONFIG.pages.filter(function(a){return a.pagename===f.pagename}).length||(d.preventDefault(),console.log("Page not found!"),b.go("setup.pages"))),"setup.pages.removepage"===e.name&&(a.CONFIG.pages.filter(function(a){return a.pagename===f.pagename}).length||(d.preventDefault(),console.log("Page not found!"),b.go("setup.pages"))),"setup.pages.addwidget"===e.name&&(a.CONFIG.pages.filter(function(a){return a.pagename===f.pagename}).length||(d.preventDefault(),console.log("Page not found!"),b.go("setup.pages"))),"main"===e.name&&c.defaultPage&&a.CONFIG.pages.filter(function(a){return a.pagename===c.defaultPage}).length&&(d.preventDefault(),console.log("default page found"),b.go("main.page",{pagename:c.defaultPage},{location:"replace"})),"setup.pages.addwidgettype"===e.name&&(e.templateUrl="views/setup-addwidget-"+f.type.toLowerCase()+".html")})}]).config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/"),a.state("setup",{url:"/setup",templateUrl:"views/setup.html",redirectTo:"setup.general"}).state("setup.general",{url:"/general",templateUrl:"views/setup-general.html",data:{selectedTab:0}}).state("setup.pages",{url:"/pages",templateUrl:"views/setup-pages.html",data:{selectedTab:1}}).state("setup.pages.newpage",{url:"/new",templateUrl:"views/setup-newpage.html",data:{selectedTab:1}}).state("setup.pages.removepage",{url:"/:pagename/remove/",templateUrl:"views/setup-removepage.html",data:{selectedTab:1}}).state("setup.pages.page",{url:"/:pagename",templateUrl:"views/setup-widgetsview.html",data:{selectedTab:1}}).state("setup.pages.removewidget",{url:"/:pagename/remove-widget/:widgetid/:widgetname",templateUrl:"views/setup-removewidget.html",data:{selectedTab:1}}).state("setup.pages.addwidget",{url:"/:pagename/add-widget",templateUrl:"views/setup-addwidget.html",data:{selectedTab:1}}).state("setup.pages.addwidgettype",{url:"/:pagename/add-widget/:type",data:{selectedTab:1}}).state("setup.plugins",{url:"/plugins",templateUrl:"views/setup-plugins.html",data:{selectedTab:2}}).state("main",{url:"/",templateUrl:"views/main.html"}).state("main.page",{url:"page/:pagename",templateUrl:"views/device-page.html"})}]),angular.module("homeydashV3App").controller("MainCtrl",["$localStorage","$mdSidenav","Idle","$window","$scope","$stateParams","device","socket","alldevices","$rootScope","CONFIG","$sce","$mdToast","$mdDialog",function(a,b,c,d,e,f,g,h,i,j,k,l,m,n){e.params=f,localStorage.getItem("agreement")||n.show({templateUrl:"views/agreement.html",clickOutsideToClose:!1,fullscreen:!0,controller:"AgreementCtrl",hasBackdrop:!1,escapeToClose:!1}).then(function(){localStorage.setItem("agreement",!0)}),e.localStorage=a,e.hideOverlay=!1,e.$on("IdleStart",function(){e.hideOverlay=!0,e.$apply()}),e.$on("IdleEnd",function(){e.hideOverlay=!1,e.$apply()}),e.switchSidebar=function(){b("left").toggle()},e.getIdbyAtrr=function(a,b,c){for(var d=0;d<a.length;d++)if(a[d].hasOwnProperty(b)&&a[d][b]===c)return d;return-1},0===Object.keys(j.CONFIG.pages).length?e.noPages=!0:e.noPages=!1;var o=d.innerHeight-110;$(window).resize(function(){o=d.innerHeight-110,e.$apply(function(){e.config={autoHideScrollbar:!1,theme:"minimal-dark",advanced:{updateOnContentResize:!0},setHeight:o,scrollInertia:0}})}),e.config={autoHideScrollbar:!1,theme:"minimal-dark",advanced:{updateOnContentResize:!0},setHeight:o,scrollInertia:0},j.$on("$stateChangeStart",function(){i().then(function(a){j.devicelist=a.data.result,console.log("Updated devicelist!")})})}]),angular.module("homeydashV3App").controller("SetupCtrl",["WizardHandler","$scope","$rootScope","$mdDialog","$mdToast","savesettings","$localStorage","$state","$element",function(a,b,c,d,e,f,g,h,i){localStorage.getItem("agreement")||d.show({templateUrl:"views/agreement.html",parent:angular.element(document.body),clickOutsideToClose:!1,fullscreen:!0,escapeToClose:!1}).then(function(){localStorage.setItem("agreement",!0)}),b.agree=function(){d.hide()},b.storage=g,b.newWidget={},b.isEmpty=function(a,b){return a.hasOwnProperty(b)?!0:void 0},b.filterDevices=function(a,b){var c={};return angular.forEach(a,function(a,d){a.capabilities.hasOwnProperty(b)&&(c[d]=a)}),c},console.log(),b.removeWidget=function(a){console.log(a),c.CONFIG.pages[b.getIdbyAtrr(c.CONFIG.pages,"pagename",a.pagename)].widgets.splice(a.widgetid,1),f.save(c.CONFIG).then(function(a){h.go("setup.pages.page",{pagename:h.params.pagename},{reload:!0,inherit:!1,notify:!0})},function(a){e.show(e.simple().textContent("ERROR: "+a).position("top right"))})},b.saveWidget=function(a){c.CONFIG.pages[a].widgets.push({name:b.newWidget.device.name,widgettype:b.newWidget.capability.capability,capability:Object.keys(c.devicelist[b.newWidget.device.id].capabilities),deviceid:b.newWidget.device.id,"class":b.newWidget.capability["class"]}),f.save(c.CONFIG).then(function(){h.go("setup.pages.page",{pagename:h.params.pagename},{reload:!0,inherit:!1,notify:!0}),console.log("New settings saved!")})},b.getIdbyAtrr=function(a,b,c){for(var d=0;d<a.length;d++)if(a[d].hasOwnProperty(b)&&a[d][b]===c)return d;return-1},b.$on("$stateChangeSuccess",function(a,c){b.currentTab=c.data.selectedTab}),b.savePage=function(a){c.CONFIG.pages.push({pagename:a,widgets:[]}),f.save(c.CONFIG).then(function(a){h.go("setup.pages")},function(a){e.show(e.simple().textContent("ERROR: "+a).position("top right"))})},b.saveSettings=function(){f.save(c.CONFIG),console.log("New settings saved!")},b.savePagename=function(a,b){c.CONFIG.pages[a].pagename=b,f.save(c.CONFIG).then(function(){h.go("setup.pages.page",{pagename:b},{reload:!0,inherit:!1,notify:!0}),console.log("New settings saved!")})},b.deletePage=function(a){c.CONFIG.pages.splice(a,1),h.go("setup.pages"),f.save(c.CONFIG).then(function(a){},function(a){e.show(e.simple().textContent("ERROR: "+a).position("top right"))})},b.sortableOptionsPages={handle:".orderPages",update:function(a,b){f.save(c.CONFIG)},axis:"y"},b.sortableOptionsWidgets={update:function(a,b){f.save(c.CONFIG)}},b.addwidget=function(a){d.show({templateUrl:"views/dialogaddwidget.html",controller:"DialogaddwidgetCtrl",autoWrap:!1,clickOutsideToClose:!0,escapeToClose:!1,locals:{pageid:a}})},b.deleteWidget=function(a,b,c,e){console.log(a,b,c,e),d.show({templateUrl:"views/dialogremovewidget.html",controller:"DialogremovewidgetCtrl",autoWrap:!1,clickOutsideToClose:!0,locals:{pageid:e,pagename:a,widgetname:b,widgetid:c}})}}]),angular.module("homeydashV3App").factory("alldevices",["CONFIG","$http",function(a,b){var c={};return c=function(){return b.get("/api/manager/devices/device/")}}]),angular.module("homeydashV3App").factory("device",["CONFIG","$http",function(a,b){var c={};return c.onoff=function(a,c){return b.put("/api/manager/devices/device/"+a+"/state",{onoff:c})},c.dim=function(a,c){return b.put("/api/manager/devices/device/"+a+"/state",{dim:c})},c}]),angular.module("homeydashV3App").factory("socket",["CONFIG",function(a){return{on:function(a,b,c){var d=io.connect("/realtime/device/"+b+"/",{transports:["websocket","polling"]});d.on(a,c)}}}]),angular.module("homeydashV3App").factory("savesettings",["CONFIG","$http",function(a,b){var c={};return c.save=function(a){return b.post("/api/app/com.swttt.homeydash/savesettings",a)},c}]),angular.module("homeydashV3App").controller("DialogremovewidgetCtrl",["$scope","$rootScope","$mdToast","$mdDialog","savesettings","widgetname","pagename","widgetid","pageid",function(a,b,c,d,e,f,g,h,i){a.widgetname=f,a.pagename=g,a.widgetid=h,a.pageid=i,a.removeWidgetDialog=function(){b.CONFIG.pages[i].widgets.splice(h,1),e.save(b.CONFIG).then(function(a){c.show(c.simple().textContent("Widget removed!").position("top right"))},function(a){c.show(c.simple().textContent("ERROR: "+a).position("top right"))}),d.hide()},a.closeWidgetDialog=function(){d.cancel()}}]),angular.module("homeydashV3App").controller("DialogaddwidgetCtrl",["$scope","$rootScope","$mdToast","$mdDialog","savesettings","pageid",function(a,b,c,d,e,f){a.devicelist=b.devicelist,a.saveNewwidgetDialog=function(a,g,h,i){console.log(a,g,h,f),b.CONFIG.pages[f].widgets.push({name:a,widgettype:h,capability:Object.keys(b.devicelist[g].capabilities),deviceid:g}),console.log(b.CONFIG.pages[f]),e.save(b.CONFIG).then(function(a){},function(a){c.show(c.simple().textContent("ERROR: "+a).position("top right"))}),d.hide()},a.closeNewwidgetDialog=function(){d.cancel()}}]),angular.module("homeydashV3App").factory("wallpaper",["CONFIG","$http",function(a,b){var c={};return c=function(){return b.get("/api/manager/users/user/me")}}]),angular.module("homeydashV3App").controller("DevicesCtrl",["$scope","$rootScope","$mdToast","device","alldevices","debounce",function(a,b,c,d,e,f){a.onoff=function(a,e){e?d.onoff(a,!1).then(function(a){},function(d){d&&(c.show(c.simple().textContent("ERROR: "+d.statusText).position("top right").hideDelay(3e3)),b.devicelist[a].state.onoff=!0)}):d.onoff(a,!0).then(function(a){},function(d){d&&(c.show(c.simple().textContent("ERROR: "+d.statusText).position("top right").hideDelay(3e3)),b.devicelist[a].state.onoff=!1)})},a.dim=f(250,function(a,f){d.dim(a,f).then(function(a){},function(a){a&&(c.show(c.simple().textContent("ERROR: "+a.statusText).position("top right").hideDelay(3e3)),e().then(function(a){b.devicelist=a.data.result,console.log("Updated devicelist!")}))})})}]),angular.module("homeydashV3App").controller("AgreementCtrl",["$scope","$mdDialog",function(a,b){a.agree=function(){b.hide()}}]),angular.module("homeydashV3App").run(["$templateCache",function(a){a.put("views/agreement.html",'<md-dialog> <md-toolbar> <div class="md-toolbar-tools"> <h2 style="font-weight:300;text-transform:uppercase">Agreement</h2> <span flex></span> </div> </md-toolbar> <md-dialog-content style="padding:15px"> <h3 style="font-weight:bold;text-transform:uppercase"> Please read before you continue </h3> <p> For HomeyDash to function properly, it uses the cookie Athom creates on login. Within this cookie is your <b>bearer token</b> stored. This token is used to control your devices, but has the ability to do more then just controlling. (for example adding, removing or changing devices/settings etc.). The chances are small (and i mean really small) but it could happen that some error in the code might remove a device or change something unwanted and without prompting you. Thats why i ask you to agree with the following terms before you can use the dashboard: <ul> <li> I understand the power of the bearer token </li> <li> I agree that HomeyDash uses my bearer token to control my devices </li> <li> I agree that i use this on my own risk </li> <li> I agree that i cannot blame Athom or the creator for any errors and unwanted changes to my devices caused by HomeyDash </li> </ul> </p> <div style="width:100%;text-align:center"> <md-button class="md-primary md-raised" ng-click="agree()"> I Agree </md-button> </div> </md-dialog-content> </md-dialog>'),a.put("views/device-page.html",'<div layout-padding flex="100" flex-xs="100" flex-xs="100" style="position:relative"> <md-icon ng-if="!localStorage.sidebarLocked" ng-click="switchSidebar()" class="menu-handle">menu</md-icon> <h2 style="margin-left:15px;display:inline;color:white;text-transform:uppercase;font-weight:300">{{params.pagename}}</h2> <md-icon ng-if="!CONFIG.general.hideicon" ng-click="null" style="color:white;position:absolute;top:0px;right:10px;cursor:pointer" ui-sref="setup">settings</md-icon> <md-icon onclick="location.reload()" style="color:white;position:absolute;top:0px;right:75px;cursor:pointer">replay</md-icon> </div> <widget ng-repeat="widget in CONFIG.pages[getIdbyAtrr(CONFIG.pages, \'pagename\', params.pagename)].widgets" ng-include src="\'views/\' + widget.widgettype + \'.html\'" ng-controller="DevicesCtrl" widget="widget.widgettype" flex="25" flex-sm="50" flex-xs="100"> </widget>'),a.put("views/dialogremovewidget.html",'<md-dialog aria-label="Remove page"> <md-dialog-content class="md-dialog-content" aria-label="Remove page"> <h2 class="md-title">Remove widget from page</h2> <p>You are about to remove the widget <b>{{widgetname}}</b>. <br>Are you sure?</p> </md-dialog-content> <md-dialog-actions> <md-button ng-click="closeWidgetDialog()" class="md-warn"> No </md-button> <md-button ng-click="removeWidgetDialog(pagename,widgetname,idx)" class="md-primary"> Yes </md-button> </md-dialog-actions> </md-dialog>'),a.put("views/dim.html",'<md-card> <md-card-content layout="row" layout-wrap style="padding:0;margin:0"> <md-list flex="100" style="padding:0;margin:0"> <md-list-item class="md-2-line" style="padding:0;margin:0"> <img ng-click="onoff(widget.deviceid, devicelist[widget.deviceid].state.onoff)" ng-if="devicelist[widget.deviceid].state.onoff" ng-src="images/icons/{{widget.class}}_on.png" class="md-avatar" alt="icon"> <img ng-click="onoff(widget.deviceid, devicelist[widget.deviceid].state.onoff)" ng-if="!devicelist[widget.deviceid].state.onoff" ng-src="images/icons/{{widget.class}}_off.png" class="md-avatar" alt="icon"> <div class="md-list-item-text" layout="column" style="margin-botton:0px"> <h3>{{devicelist[widget.deviceid].name}}</h3> <h4 ng-if="!CONFIG.general.hidezonename">{{devicelist[widget.deviceid].zone.name}}</h4> </div> </md-list-item> </md-list> <div flex="100" layout-align="center start" style="min-height:48px;height:48px;max-height:48px;margin:0px 20px 0px 20px"> <md-slider style="margin:0 auto" ng-change="dim(widget.deviceid, devicelist[widget.deviceid].state.dim);" ng-model="devicelist[widget.deviceid].state.dim" flex min="0" step="0.01" max="1" aria-label="dim"> </md-slider> </div> </md-card-content> </md-card>'),a.put("views/hdlight.html",'<md-card> <md-card-content layout="row" layout-wrap style="padding:0;margin:0"> <md-list flex="100" style="padding:0;margin:0"> <md-list-item class="md-2-line" style="padding:0;margin:0"> <img ng-if="data.cb1 == true || data.slider > 0" ng-src="../images/icons/light_on.png" class="md-avatar" alt="icon"> <img ng-if="data.cb1 == false || data.slider == 0" ng-src="../images/icons/light_off.png" class="md-avatar" alt="icon"> <div class="md-list-item-text" layout="column" style="margin-botton:0px"> <h3>Staande lamp</h3> <h4>Woonkamer</h4> </div> </md-list-item> </md-list> <div flex="100" layout-align="center start" style="min-height:48px;height:48px;max-height:48px;margin:0px 20px 0px 20px"> <md-switch ng-show="type == \'switch\'" style="max-width:80px;margin:0 auto" ng-model="data.cb1" aria-label="Switch 1"> <span ng-if="data.cb1">On</span> <span ng-if="!data.cb1">Off</span> </md-switch> <md-slider ng-show="type == \'slider\'" style="margin:0 auto" ng-model="data.slider" flex min="0" max="100" aria-label="dim"> </md-slider> </div> </md-card-content> </md-card>'),a.put("views/main.html",'<div ng-if="hideOverlay" class="idleoverlay"> </div> <md-sidenav class="md-sidenav-left" md-component-id="left" md-is-locked-open="localStorage.sidebarLocked" md-whiteframe="4"> <center><img src="images/logo.png" style="padding:5px"></center> <md-list id="sidebar" flex ng-scrollbars ng-scrollbars-config="config"> <md-list-item class="md-1-line" ng-repeat="page in CONFIG.pages" ng-click="switchSidebar()" ui-sref="main.page({pagename: \'{{page.pagename}}\'})"> <div class="md-list-item-text" layout="column" md-scroll-y> {{page.pagename}} </div> <md-divider ng-if="!$last"></md-divider> </md-list-item> </md-list> </md-sidenav> <md-content flex layout="row" layout-padding layout-wrap layout-align="start start" md-scroll-y style="background-color:rgba(255, 255, 255, 0);padding-top:15px" ui-view> <div layout-padding flex="100" flex-xs="100" flex-xs="100" style="position:relative"> <md-icon ng-if="!localStorage.sidebarLocked" ng-click="switchSidebar()" class="menu-handle">menu</md-icon> <h2 ng-if="!noPages" style="color:white;text-transform:uppercase;font-weight:300"><md-icon style="color:white">keyboard_arrow_left</md-icon> Open a page in the sidebar on the left </h2> <h2 ng-if="noPages" style="color:white;text-transform:uppercase;font-weight:300">No pages found!</h2> <p ng-if="noPages" style="color:white"> Press the <md-icon style="color:white">settings</md-icon> on the top right to go to the setup.</p> <md-icon ng-if="!CONFIG.general.hideicon" ng-click="null" style="color:white;position:absolute;top:0px;right:10px;cursor:pointer" ui-sref="setup">settings</md-icon> <md-icon onclick="location.reload()" style="color:white;position:absolute;top:0px;right:75px;cursor:pointer">replay</md-icon> </div> </md-content>'),a.put("views/measure_temperature.html",'<md-card> <md-card-content layout="row" layout-wrap style="padding:0;margin:0"> <md-list flex="100" style="padding:0;margin:0"> <md-list-item class="md-2-line" style="padding:0;margin:0"> <img ng-src="images/icons/temperature.png" class="md-avatar" alt="icon"> <div class="md-list-item-text" layout="column" style="margin-botton:0px"> <h3>{{devicelist[widget.deviceid].name}}</h3> <h4 ng-if="!CONFIG.general.hidezonename">{{devicelist[widget.deviceid].zone.name}}</h4> </div> </md-list-item> </md-list> <div flex="100" layout-align="center start" style="min-height:48px;height:48px;max-height:48px;margin:0px 20px 0px 20px"> <h3 style="font-weight:200;margin:0 auto;text-align:center">{{devicelist[widget.deviceid].state.measure_temperature}} °C</h3> </div> </md-card-content> </md-card>'),a.put("views/onoff.html",'<md-card> <md-card-content layout="row" layout-wrap style="padding:0;margin:0"> <md-list flex="100" style="padding:0;margin:0"> <md-list-item class="md-2-line" style="padding:0;margin:0"> <img ng-click="onoff(widget.deviceid, devicelist[widget.deviceid].state.onoff)" ng-if="devicelist[widget.deviceid].state.onoff" ng-src="images/icons/{{widget.class}}_on.png" class="md-avatar" alt="icon"> <img ng-click="onoff(widget.deviceid, devicelist[widget.deviceid].state.onoff)" ng-if="!devicelist[widget.deviceid].state.onoff" ng-src="images/icons/{{widget.class}}_off.png" class="md-avatar" alt="icon"> <div class="md-list-item-text" layout="column" style="margin-botton:0px"> <h3>{{devicelist[widget.deviceid].name}}</h3> <h4 ng-if="!CONFIG.general.hidezonename">{{devicelist[widget.deviceid].zone.name}}</h4> </div> </md-list-item> </md-list> <div flex="100" layout-align="center start" style="min-height:48px;height:48px;max-height:48px;margin:0px 20px 0px 20px"> <md-switch ng-click="onoff(widget.deviceid, devicelist[widget.deviceid].state.onoff)" style="max-width:80px;margin:0 auto" ng-model="devicelist[widget.deviceid].state.onoff" aria-label="Switch 1"> <span ng-if="devicelist[widget.deviceid].state.onoff">On</span> <span ng-if="!devicelist[widget.deviceid].state.onoff">Off</span> </md-switch> <div style="width:100%;text-align:right;font-size:10px" ng-if="devicelist[widget.deviceid].state.meter_power && !localStorage.hidekwh">{{devicelist[widget.deviceid].state.meter_power}} kwh</div> </div> </md-card-content> </md-card>'),a.put("views/setup-addwidget-device.html",'<div flex="100"> <center> <h2 style="font-weight:300;text-transform:uppercase">Add widget to {{params.pagename}}</h2></center> <wizard on-finish="saveWidget(getIdbyAtrr(CONFIG.pages, \'pagename\', params.pagename))" hide-indicators="true"> <wz-step style="text-align:center" wz-title="Step 1"> <h3 style="font-weight:300;text-transform:uppercase">Select a capability</h3> <md-input-container> <md-select ng-model="newWidget.capability" placeholder="Select a capability"> <md-option ng-value="capability" ng-repeat="capability in SETUP.capabilities">{{ capability.description }}</md-option> </md-select> </md-input-container><br> <md-button class="md-raised md-primary" ng-click="newWidget.capability = null;" ui-sref="setup.pages.addwidget({\n          pagename: params.pagename\n        })"> Back </md-button> <md-button class="md-raised md-warn" ng-click="newWidget = null;" ui-sref="setup.pages.page({\n          pagename: params.pagename\n        })"> Cancel </md-button> <md-button ng-disabled="!newWidget.capability" class="md-raised md-primary" wz-next> Next </md-button> </wz-step> <wz-step style="text-align:center" wz-title="Step 2"> <h3 style="font-weight:300;text-transform:uppercase">Select a device</h3> <md-radio-group style="width:100%" ng-model="newWidget.device"> <md-radio-button style="width:50%;float:left;text-align:left" ng-if="device.capabilities[newWidget.capability.capability]" ng-repeat="device in devicelist" ng-value="device" aria-label="{{ device.name }}"> {{ device.name }} <small style="color:grey">{{ device.zone.name }}</small> </md-radio-button> </md-radio-group> <br> <div style="width:100%;text-align:center"> <md-button class="md-raised md-primary" ng-click="newWidget.device = null;" wz-previous> Back </md-button> <md-button class="md-raised md-warn" ng-click="newWidget = null;" ui-sref="setup.pages.page({\n        pagename: params.pagename\n      })"> Cancel </md-button> <md-button ng-disabled="!newWidget.device" class="md-raised md-primary" wz-next> Next </md-button> </div> </wz-step> <wz-step style="text-align:center" wz-title="Summary"> <h3 style="font-weight:300;text-transform:uppercase">Summary</h3> <div style="width:50%;margin:0 auto;text-align:left;background-color:rgb(250,250,250);padding:10px;margin-bottom:15px" md-whiteframe="3"> <span> <h4 style="font-weight:300;text-transform:uppercase"> {{params.type}} </h4> <b>Device name: </b>{{newWidget.device.name}} <br> <b>Zone name: </b>{{newWidget.device.zone.name}}<br> <b>Capability: </b>{{newWidget.capability.description}} </span> <br><br> </div> <md-button class="md-raised md-primary" wz-previous> Back </md-button> <md-button class="md-raised md-warn" ng-click="newWidget = null;" ui-sref="setup.pages.page({\n        pagename: params.pagename\n      })"> Cancel </md-button> <md-button class="md-raised md-primary" wz-finish> Save </md-button> </wz-step> </wizard>  </div>'),a.put("views/setup-addwidget.html",'<div flex="100"> <center> <h2 style="font-weight:300;text-transform:uppercase">Add widget to {{params.pagename}}</h2></center> <div style="text-align:center"> <h3 style="font-weight:300;text-transform:uppercase">Select a widget type</h3> <md-grid-list flex="100" md-cols="4" md-gutter="0em" md-row-height="150px"> <md-grid-tile style="text-align:left" ng-repeat="type in SETUP.widgettypes" md-colspan="1" md-rowspan="1"> <md-card style="width:100%;height:100%;cursor:pointer" class="widgetselect" ui-sref="setup.pages.addwidgettype({\n            pagename: params.pagename,\n            type: type.type\n          })"> <md-card-content style=""> <h3 style="font-weight:300;text-transform:uppercase;margin-top:0;padding-top:0">{{type.type}}</h3> <p style="font-size:0.75em">{{type.description}}</p> </md-card-content> </md-card> </md-grid-tile> </md-grid-list> <br> <md-button class="md-raised md-warn" ui-sref="setup.pages.page({\n        pagename: params.pagename\n      })"> Cancel </md-button> </div>  </div>'),a.put("views/setup-general.html",'<md-list style="width:100%"> <md-subheader class="md-no-sticky" style="background-color:white">General</md-subheader> <md-list-item> <p>Set a default page</p> <md-select class="md-secondary" ng-model="storage.defaultPage"> <md-option ng-value="false"><em>None</em></md-option> <md-option ng-repeat="page in CONFIG.pages" ng-value="page.pagename"> {{page.pagename}} </md-option> </md-select> </md-list-item> <md-list-item> <p>Set dashboard screen dimming time <small><b>(requires page refresh)</b></small></p> <md-select class="md-secondary" ng-change="saveSettings()" ng-model="CONFIG.general.idletime"> <md-option ng-value="0">Disable</md-option> <md-option ng-repeat="value in SETUP.dimmingvalues" ng-value="value"> {{value}} sec </md-option> </md-select> </md-list-item> <md-subheader class="md-no-sticky" style="background-color:white">Look and feel</md-subheader> <md-list-item> <p>Hide the setup icon on your dashboard</p> <md-checkbox ng-change="saveSettings()" class="md-secondary" ng-model="CONFIG.general.hideicon"></md-checkbox> </md-list-item> <md-list-item> <p>Hide zone name on widget cards</p> <md-checkbox ng-change="saveSettings()" class="md-secondary" ng-model="CONFIG.general.hidezonename"></md-checkbox> </md-list-item> <md-list-item> <p>Lock the sidebar to allways open (this would disable open and close)</p> <md-checkbox ng-change="saveSettings()" class="md-secondary" ng-model="storage.sidebarLocked"></md-checkbox> </md-list-item> <md-list-item> <p>Hide kwh on capable widget cards</p> <md-checkbox ng-change="saveSettings()" class="md-secondary" ng-model="storage.hidekwh"></md-checkbox> </md-list-item> </md-list>'),a.put("views/setup-newpage.html",'<div flex="100"> <center> <h2 style="font-weight:300;text-transform:uppercase">Add new page</h2></center> <md-content aria-label="Add new page" style="background-color:white"> <center> <md-input-container md-no-float style="width:50%"> <input ng-model="newpagename" type="text" placeholder="Give your new page a name..."> </md-input-container> </center> </md-content> <center> <md-actions style=""> <md-button ui-sref="setup.pages" class="md-warn md-raised"> Cancel </md-button> <md-button ng-click="savePage(newpagename)" class="md-primary md-raised"> Save </md-button> </md-actions> </center> </div>'),a.put("views/setup-pages.html",'<div flex="30" style="padding-top:10px"> <md-list-item> <md-button style="width:100%" class="md-raised" ui-sref="setup.pages.newpage">add new page</md-button> </md-list-item> <md-list class="md-dense" ui-sortable="sortableOptionsPages" ng-model="CONFIG.pages"> <md-list-item ng-repeat="page in CONFIG.pages" ui-sref-active="active" style="margin-left:7px;margin-right:7px" class="md-2-line" ui-sref="setup.pages.page({pagename: \'{{page.pagename}}\'})"> <div class="md-list-item-text"> <h3>{{page.pagename}}</h3> <p>{{page.widgets.length || \'0\'}} widgets</p> </div> <div style="cursor:move;z-index:2" class="md-secondary orderPages"> <md-icon>reorder</md-icon> </div> <md-divider ng-if="!$last"></md-divider> </md-list-item> </md-list> </div> <div flex="70" style="margin-top:5px;position:relative" layout="row" layout-wrap ui-view> <h3 style="font-weight:300;width:100%;text-align:center">Select a page on the left to add widgets to. <br>Then click the plus icon in the right top corner to add a widget.</h3> </div>'),a.put("views/setup-plugins.html","<p>This is the setup-plugins view.</p>"),a.put("views/setup-removepage.html",'<div flex="100"> <center> <h2 style="font-weight:300;text-transform:uppercase;color:red">Remove {{params.pagename}}</h2></center> <md-content aria-label="Add new page" style="background-color:white"> <center> <p>You are about to delete <b>{{params.pagename}}</b>. <br>Are you sure? </p> </center> </md-content> <center> <md-actions style=""> <md-button ui-sref="setup.pages.page({pagename: \'{{params.pagename}}\'})" class="md-raised"> No </md-button> <md-button ng-click="deletePage(getIdbyAtrr(CONFIG.pages, \'pagename\', params.pagename))" class="md-warn md-raised"> Yes </md-button> </md-actions> </center> </div>'),a.put("views/setup-removewidget.html",'<div flex="100"> <center> <h2 style="font-weight:300;text-transform:uppercase;color:red">Remove {{params.widgetname}} from {{params.pagename}}</h2></center> <md-content aria-label="Add new page" style="background-color:white"> <center> <p>You are about to delete <b>{{params.widgetname}}</b> from <b>{{params.pagename}}</b>. <br>Are you sure? </p> </center> </md-content> <center> <md-actions style=""> <md-button ui-sref="setup.pages.page({pagename: \'{{params.pagename}}\'})" class="md-raised"> No </md-button> <md-button ng-click="removeWidget(params)" class="md-warn md-raised"> Yes </md-button> </md-actions> </center> </div>'),a.put("views/setup-widgetsview.html",'<!-- <md-button class="md-fab" style="position:absolute;top:-20px;right:0;" aria-label="Add" ng-click="addwidget(getIdbyAtrr(CONFIG.pages, \'pagename\', params.pagename))">\n  <md-icon>add</md-icon>\n</md-button> --><!-- <div flex="100">\n  <h3 style="width:100%;text-align:center;padding-left:10px;padding-top:0px;margin-top:8px;padding-bottom:5px;margin-bottom:0;font-weight:300;text-transform:uppercase;">{{params.pagename}}</h3>\n</div> --> <md-toolbar style="color:black;margin-bottom:0;margin-top:0;background-color:white"> <div class="md-toolbar-tools"> <h2 style="font-weight:300;text-transform:uppercase"> <span inline-edit-callback="savePagename(getIdbyAtrr(CONFIG.pages, \'pagename\', params.pagename), newValue)" style="font-weight:300;text-transform:uppercase" inline-edit-btn-save=" <small style=\'color:rgb(255,152,0);\'>save</small>" inline-edit-btn-edit=" <span style=\'margin-left:20px;color:rgb(255,152,0);\'>edit</span>" inline-edit="CONFIG.pages[getIdbyAtrr(CONFIG.pages, \'pagename\', params.pagename)].pagename">{{params.pagename}} </span> </h2> <span flex></span> <md-button ui-sref="setup.pages.removepage({pagename: \'{{params.pagename}}\'})" class="md-button md-warn md-raised" aria-label="Delete"> Delete this page </md-button> </div> </md-toolbar> <list flex="100" layout="row" layout-wrap layout-align="start start" ui-sortable="sortableOptionsWidgets" ng-model="CONFIG.pages[getIdbyAtrr(CONFIG.pages, \'pagename\', params.pagename)].widgets"> <div style="padding:10px" ng-repeat="widget in CONFIG.pages[getIdbyAtrr(CONFIG.pages, \'pagename\', params.pagename)].widgets" flex="25"> <div style="cursor:move;background-color:rgb(250,250,250);padding:5px;font-weight:200;color:white" class="md-whiteframe-3dp"> <p style="color:black;font-weight:300;text-transform:uppercase;font-size:0.75em">{{devicelist[widget.deviceid].name}} <br> <span style="color:grey">{{devicelist[widget.deviceid].zone.name}}</span></p> <p style="color:black"> <small> {{widget.widgettype}} {{widget.class}} </small> </p> <div style="text-align:right;margin-top:-25px"> <md-button ui-sref="setup.pages.removewidget({pageid: \'{{getIdbyAtrr(CONFIG.pages, \'pagename\', params.pagename)}}\', pagename: \'{{params.pagename}}\', widgetname: \'{{devicelist[widget.deviceid].name}}\', widgetid: \'{{$index}}\'})" class="md-warn md-fab md-mini"> <md-icon>delete</md-icon> </md-button> </div> </div> </div> <div style="padding:10px" flex="25"> <md-button style="width:100%;padding:0;margin:0;height:145px;padding-top:20%;color:rgb(255,152,0)" class="" ui-sref="setup.pages.addwidget({pagename: \'{{params.pagename}}\'})"> <md-icon style="height:60px;width:60px;font-size:60px;color:rgb(255,152,0)">add</md-icon><br>add new widget</md-button> </div> </list>'),
a.put("views/setup.html",'<div style="width:100%;height:100%" layout="row" layout-wrap layout-align="center center" ng-controller="SetupCtrl"> <md-card flex="90" style="height:90%"> <md-tabs md-stretch-tabs="always" style="background-color:rgba(82, 82, 82, 0.1)" md-selected="currentTab"> <md-tab ui-sref="setup.general" label="General"></md-tab> <md-tab ui-sref="setup.pages" label="Pages"></md-tab> <md-tab ui-sref="setup.plugins" label="Plugins"></md-tab> </md-tabs> <md-card-content md-scroll-y style="overflow:auto" ui-view layout="row" layout-wrap layout-align="start start"> </md-card-content> <md-card-footer style="text-align:right"> <md-button ui-sref="main">Back to the dashboard</md-button> </md-card-footer> </md-card> </div>'),a.put("views/tokenerror.html",'<md-dialog aria-label="Token error"> <md-dialog-content class="md-dialog-content" aria-label="Token error"> <h2 class="md-title">Error</h2> <p>It looks like you forgot to enter your bearer token in the settings or entered a wrong token.</p> </md-dialog-content> <md-dialog-actions> <md-button ng-href="/manager/settings/#homey:app:com.swttt.homeydash" class="md-primary"> Go to settings </md-button> </md-dialog-actions> </md-dialog>')}]);