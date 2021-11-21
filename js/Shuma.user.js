// ==UserScript==
// @name           【数码小站】数码小站超级工具箱-百度网盘直链解析【复活版】 ——持续更新
// @namespace      https://wiki.shuma.ink
// @description    一个好用的网上冲浪多功能工具箱，一个插件满足所有；插件主要功能有：[1]自动匹配页面内百度网盘分享的访问地址及密钥并保存至本地[2]免SVIP直链解析[3]优惠券查询[4]Vip视频解析
// @license        MIT
// @version        1.3.3
// @author         shuma
// @source         https://wiki.shuma.ink
// @include        *://*
// @require        https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @require        https://cdn.jsdelivr.net/npm/echarts@5.1.2/dist/echarts.min.js
// @supportURL     https://wiki.shuma.ink
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @grant          GM_openInTab
// @grant          GM_info
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_getResourceText
// @grant          GM_addStyle
// @grant          window.onurlchange
// @connect        shuma.ink
// @connect        gwdang.com
// @connect        baidu.com
// @connect        localhost
// @run-at         document-end
// @antifeature    membership
// @antifeature    referral-link
// ==/UserScript==

!function webpackUniversalModuleDefinition(root, factory) {
    if ("object" == typeof exports && "object" == typeof module) module.exports = factory(); else if ("function" == typeof define && define.amd) define([], factory); else {
        var a = factory();
        for (var i in a) ("object" == typeof exports ? exports : root)[i] = a[i];
    }
}(window, (function() {
    return function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: !1,
                exports: {}
            };
            return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
            module.l = !0, module.exports;
        }
        return __webpack_require__.m = modules, __webpack_require__.c = installedModules, 
        __webpack_require__.d = function(exports, name, getter) {
            __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
                enumerable: !0,
                get: getter
            });
        }, __webpack_require__.r = function(exports) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(exports, "__esModule", {
                value: !0
            });
        }, __webpack_require__.t = function(value, mode) {
            if (1 & mode && (value = __webpack_require__(value)), 8 & mode) return value;
            if (4 & mode && "object" == typeof value && value && value.__esModule) return value;
            var ns = Object.create(null);
            if (__webpack_require__.r(ns), Object.defineProperty(ns, "default", {
                enumerable: !0,
                value: value
            }), 2 & mode && "string" != typeof value) for (var key in value) __webpack_require__.d(ns, key, function(key) {
                return value[key];
            }.bind(null, key));
            return ns;
        }, __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function getDefault() {
                return module.default;
            } : function getModuleExports() {
                return module;
            };
            return __webpack_require__.d(getter, "a", getter), getter;
        }, __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 28);
    }([ function(module, exports, __webpack_require__) {
        "use strict";
        var isOldIE = function isOldIE() {
            var memo;
            return function memorize() {
                return void 0 === memo && (memo = Boolean(window && document && document.all && !window.atob)), 
                memo;
            };
        }(), getTarget = function getTarget() {
            var memo = {};
            return function memorize(target) {
                if (void 0 === memo[target]) {
                    var styleTarget = document.querySelector(target);
                    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) try {
                        styleTarget = styleTarget.contentDocument.head;
                    } catch (e) {
                        styleTarget = null;
                    }
                    memo[target] = styleTarget;
                }
                return memo[target];
            };
        }(), stylesInDom = [];
        function getIndexByIdentifier(identifier) {
            for (var result = -1, i = 0; i < stylesInDom.length; i++) if (stylesInDom[i].identifier === identifier) {
                result = i;
                break;
            }
            return result;
        }
        function modulesToDom(list, options) {
            for (var idCountMap = {}, identifiers = [], i = 0; i < list.length; i++) {
                var item = list[i], id = options.base ? item[0] + options.base : item[0], count = idCountMap[id] || 0, identifier = "".concat(id, " ").concat(count);
                idCountMap[id] = count + 1;
                var index = getIndexByIdentifier(identifier), obj = {
                    css: item[1],
                    media: item[2],
                    sourceMap: item[3]
                };
                -1 !== index ? (stylesInDom[index].references++, stylesInDom[index].updater(obj)) : stylesInDom.push({
                    identifier: identifier,
                    updater: addStyle(obj, options),
                    references: 1
                }), identifiers.push(identifier);
            }
            return identifiers;
        }
        function insertStyleElement(options) {
            var style = document.createElement("style"), attributes = options.attributes || {};
            if (void 0 === attributes.nonce) {
                var nonce = __webpack_require__.nc;
                nonce && (attributes.nonce = nonce);
            }
            if (Object.keys(attributes).forEach((function(key) {
                style.setAttribute(key, attributes[key]);
            })), "function" == typeof options.insert) options.insert(style); else {
                var target = getTarget(options.insert || "head");
                if (!target) throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
                target.appendChild(style);
            }
            return style;
        }
        var replaceText = function replaceText() {
            var textStore = [];
            return function replace(index, replacement) {
                return textStore[index] = replacement, textStore.filter(Boolean).join("\n");
            };
        }();
        function applyToSingletonTag(style, index, remove, obj) {
            var css = remove ? "" : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css;
            if (style.styleSheet) style.styleSheet.cssText = replaceText(index, css); else {
                var cssNode = document.createTextNode(css), childNodes = style.childNodes;
                childNodes[index] && style.removeChild(childNodes[index]), childNodes.length ? style.insertBefore(cssNode, childNodes[index]) : style.appendChild(cssNode);
            }
        }
        function applyToTag(style, options, obj) {
            var css = obj.css, media = obj.media, sourceMap = obj.sourceMap;
            if (media ? style.setAttribute("media", media) : style.removeAttribute("media"), 
            sourceMap && "undefined" != typeof btoa && (css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */")), 
            style.styleSheet) style.styleSheet.cssText = css; else {
                for (;style.firstChild; ) style.removeChild(style.firstChild);
                style.appendChild(document.createTextNode(css));
            }
        }
        var singleton = null, singletonCounter = 0;
        function addStyle(obj, options) {
            var style, update, remove;
            if (options.singleton) {
                var styleIndex = singletonCounter++;
                style = singleton || (singleton = insertStyleElement(options)), update = applyToSingletonTag.bind(null, style, styleIndex, !1), 
                remove = applyToSingletonTag.bind(null, style, styleIndex, !0);
            } else style = insertStyleElement(options), update = applyToTag.bind(null, style, options), 
            remove = function remove() {
                !function removeStyleElement(style) {
                    if (null === style.parentNode) return !1;
                    style.parentNode.removeChild(style);
                }(style);
            };
            return update(obj), function updateStyle(newObj) {
                if (newObj) {
                    if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) return;
                    update(obj = newObj);
                } else remove();
            };
        }
        module.exports = function(list, options) {
            (options = options || {}).singleton || "boolean" == typeof options.singleton || (options.singleton = isOldIE());
            var lastIdentifiers = modulesToDom(list = list || [], options);
            return function update(newList) {
                if (newList = newList || [], "[object Array]" === Object.prototype.toString.call(newList)) {
                    for (var i = 0; i < lastIdentifiers.length; i++) {
                        var index = getIndexByIdentifier(lastIdentifiers[i]);
                        stylesInDom[index].references--;
                    }
                    for (var newLastIdentifiers = modulesToDom(newList, options), _i = 0; _i < lastIdentifiers.length; _i++) {
                        var _index = getIndexByIdentifier(lastIdentifiers[_i]);
                        0 === stylesInDom[_index].references && (stylesInDom[_index].updater(), stylesInDom.splice(_index, 1));
                    }
                    lastIdentifiers = newLastIdentifiers;
                }
            };
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.SiteEnum = void 0, function(SiteEnum) {
            SiteEnum.All = "All", SiteEnum.HuaJun = "HuaJun", SiteEnum.TaiPingYang = "TaiPingYang", 
            SiteEnum.XiXiSoft = "XiXiSoft", SiteEnum.DongPo = "DongPo", SiteEnum.DangXia = "DangXia", 
            SiteEnum.DuoTe = "DuoTe", SiteEnum.Pc6 = "Pc6", SiteEnum.TaoBao = "TaoBao", SiteEnum.TMall = "TMall", 
            SiteEnum.JingDong = "JingDong", SiteEnum.Shuma = "Shuma", SiteEnum.IQiYi = "IQiYi", 
            SiteEnum.YouKu = "YouKu", SiteEnum.LeShi = "LeShi", SiteEnum.TuDou = "TuDou", SiteEnum.Tencent_V = "Tencent_V", 
            SiteEnum.MangGuo = "MangGuo", SiteEnum.SoHu = "SoHu", SiteEnum.Acfun = "Acfun", 
            SiteEnum.BiliBili = "BiliBili", SiteEnum.M1905 = "M1905", SiteEnum.PPTV = "PPTV", 
            SiteEnum.YinYueTai = "YinYueTai", SiteEnum.WangYi = "WangYi", SiteEnum.Tencent_M = "Tencent_M", 
            SiteEnum.KuGou = "KuGou", SiteEnum.KuWo = "KuWo", SiteEnum.XiaMi = "XiaMi", SiteEnum.TaiHe = "TaiHe", 
            SiteEnum.QingTing = "QingTing", SiteEnum.LiZhi = "LiZhi", SiteEnum.MiGu = "MiGu", 
            SiteEnum.XiMaLaYa = "XiMaLaYa", SiteEnum.SXB = "SXB", SiteEnum.BDY = "BDY", SiteEnum.BDY1 = "BDY1", 
            SiteEnum.BD_DETAIL_OLD = "BD_DETAIL_OLD", SiteEnum.BD_DETAIL_NEW = "BD_DETAIL_NEW", 
            SiteEnum.BD_DETAIL_Share = "BD_DETAIL_Share", SiteEnum.LZY = "LZY", SiteEnum.SuNing = "SuNing", 
            SiteEnum.Vp = "Vp", SiteEnum.Gwd = "Gwd";
        }(exports.SiteEnum || (exports.SiteEnum = {}));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.Core = void 0;
        var BrowerType_1 = __webpack_require__(20), Core = function() {
            function Core() {}
            return Core.currentUrl = function() {
                return window.location.href;
            }, Object.defineProperty(Core, "url", {
                get: function() {
                    return window.location.href;
                },
                enumerable: !1,
                configurable: !0
            }), Object.defineProperty(Core, "clearUrl", {
                get: function() {
                    return this.url.replace(window.location.hash, "");
                },
                enumerable: !1,
                configurable: !0
            }), Object.defineProperty(Core, "hash", {
                get: function() {
                    return window.location.hash.slice(1);
                },
                enumerable: !1,
                configurable: !0
            }), Core.open = function(url, front) {
                void 0 === front && (front = !1), GM_openInTab(url, {
                    active: !front
                });
            }, Core.autoLazyload = function(isOk, callback, time) {
                void 0 === time && (time = 5), isOk() ? callback() : setTimeout((function() {
                    Core.autoLazyload(isOk, callback, time);
                }), 1e3 * time);
            }, Core.background = function(callback, time) {
                void 0 === time && (time = 5), setInterval((function() {
                    callback();
                }), 1e3 * time);
            }, Core.lazyload = function(callback, time) {
                void 0 === time && (time = 5), setTimeout((function() {
                    callback();
                }), 1e3 * time);
            }, Core.addStyle = function(content) {
                if (GM_addStyle) GM_addStyle(content); else {
                    var style = unsafeWindow.window.document.createElement("style");
                    style.innerHTML = content, unsafeWindow.window.document.head.append(style);
                }
            }, Core.addStyleUrl = function(url) {
                var style = unsafeWindow.window.document.createElement("link");
                style.href = url, style.rel = "stylesheet", unsafeWindow.window.document.head.append(style);
            }, Core.addScriptUrl = function(url) {
                var script = unsafeWindow.window.document.createElement("script");
                script.type = "text/javascript", script.src = url, unsafeWindow.window.document.head.append(script);
            }, Core.Click = function(selector, handle) {
                $(selector).on("click", handle);
            }, Core.inIframe = function() {
                return !(!self.frameElement || "IFRAME" != self.frameElement.tagName) || (window.frames.length != parent.frames.length || self != top);
            }, Core.getBrowser = function() {
                var browser = !1, userAgent = window.navigator.userAgent.toLowerCase();
                return null != userAgent.match(/firefox/) ? browser = BrowerType_1.BrowerType.Firefox : null != userAgent.match(/edge/) ? browser = BrowerType_1.BrowerType.Edge : null != userAgent.match(/edg/) ? browser = BrowerType_1.BrowerType.Edg : null != userAgent.match(/bidubrowser/) ? browser = BrowerType_1.BrowerType.Baidu : null != userAgent.match(/lbbrowser/) ? browser = BrowerType_1.BrowerType.Liebao : null != userAgent.match(/ubrowser/) ? browser = BrowerType_1.BrowerType.UC : null != userAgent.match(/qqbrowse/) ? browser = BrowerType_1.BrowerType.QQ : null != userAgent.match(/metasr/) ? browser = BrowerType_1.BrowerType.Sogou : null != userAgent.match(/opr/) ? browser = BrowerType_1.BrowerType.Opera : null != userAgent.match(/maxthon/) ? browser = BrowerType_1.BrowerType.Maxthon : null != userAgent.match(/2345explorer/) ? browser = BrowerType_1.BrowerType.Ie2345 : null != userAgent.match(/chrome/) ? browser = navigator.mimeTypes.length > 10 ? BrowerType_1.BrowerType.Se360 : BrowerType_1.BrowerType.Chrome : null != userAgent.match(/safari/) && (browser = BrowerType_1.BrowerType.Safiri), 
                browser;
            }, Core.humanSize = function(source) {
                if (null == source || 0 == source) return "0 Bytes";
                "string" == typeof source && (source = parseFloat(source));
                var index;
                return index = Math.floor(Math.log(source) / Math.log(1024)), (source / Math.pow(1024, index)).toFixed(2) + " " + [ "Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" ][index];
            }, Core;
        }();
        exports.Core = Core;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.AppBase = void 0;
        var Logger_1 = __webpack_require__(4), SiteEnum_1 = __webpack_require__(1), Core_1 = __webpack_require__(2), AppBase = function() {
            function AppBase() {
                var _this = this;
                this._unique = !0, this.Process = function() {
                    _this.loader(), _this.run();
                };
            }
            return AppBase.prototype.unique = function() {
                return this._unique;
            }, AppBase.prototype.linkTest = function(url) {
                var _this = this;
                url || (url = Core_1.Core.currentUrl());
                var flag = !1;
                return this.rules.forEach((function(v, k) {
                    return v.test(url) ? (Logger_1.Logger.debug("app:" + _this.appName + "_" + SiteEnum_1.SiteEnum[k] + " test pass"), 
                    flag = !0, _this.site = k, !1) : (Logger_1.Logger.warn("app:" + _this.appName + " test fail"), 
                    !0);
                })), flag;
            }, AppBase;
        }();
        exports.AppBase = AppBase;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.Logger = void 0;
        __webpack_require__(36);
        var LogLevel_1 = __webpack_require__(37), Logger = function() {
            function Logger() {}
            return Logger.log = function(msg, level) {}, Logger.debug = function(msg) {
                this.log(msg, LogLevel_1.LogLevel.debug);
            }, Logger.info = function(msg) {
                this.log(msg, LogLevel_1.LogLevel.info);
            }, Logger.warn = function(msg) {
                this.log(msg, LogLevel_1.LogLevel.warn);
            }, Logger.error = function(msg) {
                this.log(msg, LogLevel_1.LogLevel.error);
            }, Logger;
        }();
        exports.Logger = Logger;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.Config = void 0;
        var Logger_1 = __webpack_require__(4), Config = function() {
            function Config() {}
            return Object.defineProperty(Config, "env", {
                get: function() {
                    return GM_info;
                },
                enumerable: !1,
                configurable: !0
            }), Config.set = function(key, v, exp) {
                void 0 === exp && (exp = -1);
                var obj = {
                    key: key,
                    value: v,
                    exp: -1 == exp ? exp : (new Date).getTime() + 1e3 * exp
                };
                GM_setValue("pantools_" + this.encode(key), JSON.stringify(obj));
            }, Config.get = function(key, defaultValue) {
                void 0 === defaultValue && (defaultValue = !1);
                var objStr = GM_getValue("pantools_" + this.encode(key));
                if (objStr) {
                    var obj = JSON.parse(objStr);
                    if (-1 == obj.exp || obj.exp > (new Date).getTime()) return Logger_1.Logger.info(key + " cache true"), 
                    obj.value;
                }
                return Logger_1.Logger.info(key + " cache false"), defaultValue;
            }, Config.getLocalStorage = function(key, defaultValue) {
                void 0 === defaultValue && (defaultValue = !1);
                var objStr = localStorage.getItem("" + this.encode(key));
                if (objStr) {
                    var obj = JSON.parse(objStr);
                    if (-1 == obj.exp || obj.exp > (new Date).getTime()) return Logger_1.Logger.info(key + " storage cache true"), 
                    obj.value;
                }
                return Logger_1.Logger.info(key + " storage cache false"), defaultValue;
            }, Config.setLocalStorage = function(key, v, exp) {
                void 0 === exp && (exp = -1);
                var obj = {
                    key: key,
                    value: v,
                    exp: -1 == exp ? exp : (new Date).getTime() + 1e3 * exp
                };
                localStorage.setItem("" + this.encode(key), JSON.stringify(obj));
            }, Config.decode = function(str) {
                return atob(str);
            }, Config.encode = function(str) {
                return btoa(str);
            }, Config;
        }();
        exports.Config = Config;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        module.exports = function(useSourceMap) {
            var list = [];
            return list.toString = function toString() {
                return this.map((function(item) {
                    var content = function cssWithMappingToString(item, useSourceMap) {
                        var content = item[1] || "", cssMapping = item[3];
                        if (!cssMapping) return content;
                        if (useSourceMap && "function" == typeof btoa) {
                            var sourceMapping = function toComment(sourceMap) {
                                var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
                                return "/*# ".concat(data, " */");
                            }(cssMapping), sourceURLs = cssMapping.sources.map((function(source) {
                                return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
                            }));
                            return [ content ].concat(sourceURLs).concat([ sourceMapping ]).join("\n");
                        }
                        return [ content ].join("\n");
                    }(item, useSourceMap);
                    return item[2] ? "@media ".concat(item[2], " {").concat(content, "}") : content;
                })).join("");
            }, list.i = function(modules, mediaQuery, dedupe) {
                "string" == typeof modules && (modules = [ [ null, modules, "" ] ]);
                var alreadyImportedModules = {};
                if (dedupe) for (var i = 0; i < this.length; i++) {
                    var id = this[i][0];
                    null != id && (alreadyImportedModules[id] = !0);
                }
                for (var _i = 0; _i < modules.length; _i++) {
                    var item = [].concat(modules[_i]);
                    dedupe && alreadyImportedModules[item[0]] || (mediaQuery && (item[2] ? item[2] = "".concat(mediaQuery, " and ").concat(item[2]) : item[2] = mediaQuery), 
                    list.push(item));
                }
            }, list;
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var __importDefault = this && this.__importDefault || function(mod) {
            return mod && mod.__esModule ? mod : {
                default: mod
            };
        };
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.Alert = void 0;
        var sweetalert2_1 = __importDefault(__webpack_require__(19));
        __webpack_require__(34), __webpack_require__(35);
        var Alert = function() {
            function Alert() {}
            return Alert.confirm = function(msg, confirmTxt, cancelTxt) {
                return void 0 === confirmTxt && (confirmTxt = "\u786e\u5b9a"), void 0 === cancelTxt && (cancelTxt = "\u53d6\u6d88"), 
                sweetalert2_1.default.fire({
                    html: msg,
                    confirmButtonText: confirmTxt,
                    showConfirmButton: !0,
                    showCancelButton: !0,
                    cancelButtonText: cancelTxt,
                    icon: "question",
                    allowOutsideClick: !1,
                    customClass: this.customeCss
                });
            }, Alert.info = function(msg, time, icon) {
                var _this = this;
                void 0 === time && (time = 2), void 0 === icon && (icon = "success"), null != this.tipContainer && sweetalert2_1.default.close(this.tipContainer), 
                sweetalert2_1.default.fire({
                    toast: !0,
                    position: "top",
                    showCancelButton: !1,
                    showConfirmButton: !1,
                    timerProgressBar: !0,
                    title: msg,
                    icon: icon,
                    timer: 1e3 * time,
                    customClass: this.customeCss
                }).then((function(a) {
                    _this.tipContainer = a;
                }));
            }, Alert.input = function(msg, defValue, validator) {
                return void 0 === defValue && (defValue = ""), void 0 === validator && (validator = function(res) {
                    return "" == res || null == res ? msg : null;
                }), sweetalert2_1.default.fire({
                    input: "text",
                    inputLabel: msg,
                    inputValue: defValue,
                    showCancelButton: !0,
                    cancelButtonText: "\u7b97\u4e86",
                    confirmButtonText: "\u6dfb\u52a0",
                    inputValidator: function(r) {
                        return validator(r);
                    },
                    customClass: this.customeCss
                });
            }, Alert.html = function(title, html, width, time) {
                return void 0 === width && (width = void 0), void 0 === time && (time = void 0), 
                sweetalert2_1.default.fire({
                    toast: !1,
                    allowOutsideClick: !1,
                    confirmButtonText: "\u5173\u95ed",
                    width: width,
                    title: title,
                    html: html,
                    timer: null == time ? time : 1e3 * time,
                    customClass: this.customeCss
                });
            }, Alert.toast = function(title, html, cancel, cancelTxt, confirm, confirmTxt) {
                return void 0 === cancel && (cancel = !1), void 0 === cancelTxt && (cancelTxt = ""), 
                void 0 === confirm && (confirm = !1), void 0 === confirmTxt && (confirmTxt = ""), 
                sweetalert2_1.default.fire({
                    toast: !0,
                    position: "top",
                    html: html,
                    showCancelButton: cancel,
                    showConfirmButton: confirm,
                    title: title,
                    cancelButtonText: cancelTxt,
                    confirmButtonText: confirmTxt,
                    customClass: this.customeCss
                });
            }, Alert.loading = function(msg, time) {
                return void 0 === msg && (msg = ""), void 0 === time && (time = void 0), sweetalert2_1.default.fire({
                    title: msg,
                    timer: null == time ? time : 1e3 * time,
                    timerProgressBar: !0,
                    allowOutsideClick: !1,
                    didOpen: function() {
                        sweetalert2_1.default.showLoading();
                    },
                    customClass: this.customeCss
                });
            }, Alert.close = function(swal) {
                sweetalert2_1.default.close(swal);
            }, Alert.customeCss = {
                container: "pantools-container",
                popup: "pantools-popup",
                title: "pantools-title",
                closeButton: "pantools-close",
                icon: "pantools-icon",
                image: "pantools-image",
                htmlContainer: "pantools-html",
                input: "pantools-input",
                validationMessage: "pantools-validation",
                actions: "pantools-actions",
                confirmButton: "pantools-confirm",
                denyButton: "pantools-deny",
                cancelButton: "pantools-cancel",
                loader: "pantools-loader",
                footer: "pantools-footer"
            }, Alert;
        }();
        exports.Alert = Alert;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.Constant = void 0;
        var Constant = function() {
            function Constant() {}
            return Constant.AriaConfig = "AriaConfig_Cache", Constant.CouponJump = "Coupon_Jump", 
            Constant.CouponJumpFlag = "Coupon_Jump_Flag", Constant.PanJump = "Pan_Jump", Constant;
        }();
        exports.Constant = Constant;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.Url = void 0;
        var Url = function() {
            function Url() {}
            return Url.get = function(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"), r = location.search.substr(1).match(reg);
                return null != r && r[2];
            }, Url;
        }();
        exports.Url = Url;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.HttpHeaders = exports.Http = void 0;
        var Logger_1 = __webpack_require__(4), Common_1 = __webpack_require__(26), Config_1 = __webpack_require__(5), Http = function() {
            function Http() {}
            return Http.ajax = function(option) {
                var _a, _b, head = new HttpHeaders;
                head["User-Agent"] = null !== (_a = unsafeWindow.window.navigator.userAgent) && void 0 !== _a ? _a : "Mozilla/4.0 (compatible) Greasemonkey", 
                head.Accept = "application/atom+xml,application/xml,text/xml", option.url.indexOf("shuma") > -1 && (head.Author = null !== (_b = Config_1.Config.env.script.author) && void 0 !== _b ? _b : "shuma", 
                head.Version = Config_1.Config.env.script.version), option.headers || (option.headers = head);
                try {
                    GM_xmlhttpRequest(option);
                } catch (e) {
                    Logger_1.Logger.error(e);
                }
            }, Http.getFormData = function(data) {
                if (data instanceof Map) {
                    var fd_1 = new FormData;
                    data.forEach((function(v, k) {
                        var _v;
                        _v = "string" == typeof v ? v.toString() : JSON.stringify(v), fd_1.append(k, _v);
                    })), data = fd_1;
                }
                return data;
            }, Http._getData = function(data, contentType) {
                if (void 0 === contentType && (contentType = "json"), data instanceof Map) {
                    var fd_2 = new FormData;
                    data.forEach((function(v, k) {
                        fd_2.append(k, v);
                    })), data = fd_2;
                }
                var res = "";
                if ("json" == contentType) {
                    var obj_1 = Object.create(null);
                    data.forEach((function(k, v) {
                        obj_1[v] = k;
                    })), res = JSON.stringify(obj_1);
                } else data.forEach((function(k, v) {
                    res += v + "=" + encodeURIComponent(k.toString()) + "&";
                })), res = Common_1.Common.trim(res, "&");
                return res;
            }, Http.getData = function(url) {
                return new Promise((function(resolve) {
                    $.getJSON(url, (function(d) {
                        resolve(d);
                    }));
                }));
            }, Http.post = function(url, data, contentType, timeOut) {
                void 0 === contentType && (contentType = "json"), void 0 === timeOut && (timeOut = 120);
                var _data = "";
                return _data = "json" == contentType ? JSON.stringify(data) : Http.getFormData(data), 
                new Promise((function(resolve, reject) {
                    Http.ajax({
                        url: url,
                        method: "POST",
                        data: _data,
                        timeout: 1e3 * timeOut,
                        onload: function(response) {
                            var _a;
                            try {
                                var res = null !== (_a = JSON.parse(response.responseText)) && void 0 !== _a ? _a : response.responseText;
                                resolve(res);
                            } catch (error) {
                                Logger_1.Logger.debug(error), reject();
                            }
                        },
                        onerror: function(response) {
                            reject(response);
                        },
                        ontimeout: function() {
                            reject("\u8bf7\u6c42\u8d85\u65f6");
                        }
                    });
                }));
            }, Http.get = function(url, data, time_out) {
                return void 0 === data && (data = new Map), void 0 === time_out && (time_out = 120), 
                new Promise((function(resolve, reject) {
                    Http.ajax({
                        url: url,
                        method: "GET",
                        timeout: 1e3 * time_out,
                        onload: function(response) {
                            var _a;
                            try {
                                var res = null !== (_a = JSON.parse(response.responseText)) && void 0 !== _a ? _a : response.responseText;
                                resolve(res);
                            } catch (error) {
                                Logger_1.Logger.debug(error), reject();
                            }
                        },
                        onerror: function(response) {
                            reject(response);
                        },
                        ontimeout: function() {
                            reject("\u8bf7\u6c42\u8d85\u65f6");
                        }
                    });
                }));
            }, Http;
        }();
        exports.Http = Http;
        var HttpHeaders = function HttpHeaders() {};
        exports.HttpHeaders = HttpHeaders;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.CouponRoutes = void 0;
        var Http_1 = __webpack_require__(10), CouponRoutes = function() {
            function CouponRoutes() {}
            return CouponRoutes.couponQuery = function(id, type) {
                var data = new Map;
                return data.set("id", id), data.set("type", type), Http_1.Http.post("https://api.shuma.ink/quan/info", data, "formdata");
            }, CouponRoutes.historyQuery = function(url) {
                return Http_1.Http.get("https://browser.gwdang.com/extension/price_towards?url=" + encodeURIComponent(url) + "&ver=1&union=union_gwdang&version=" + (new Date).getTime() + "&format=json&from_device=chrome", new Map);
            }, CouponRoutes;
        }();
        exports.CouponRoutes = CouponRoutes;
    }, function(module, exports, __webpack_require__) {
        (exports = __webpack_require__(6)(!1)).push([ module.i, ".pantools-container { z-index: 99999!important }\n.pantools-popup { font-size: 14px !important }\n.pantools-setting-label { display: flex;align-items: center;justify-content: space-between;padding-top: 20px; }\n.pantools-setting-checkbox { width: 16px;height: 16px; }", "" ]), 
        module.exports = exports;
    }, function(module, exports, __webpack_require__) {
        (exports = __webpack_require__(6)(!1)).push([ module.i, ".pantools-popup {\n    padding: 1.25em 0 0 0;\n}\n", "" ]), 
        module.exports = exports;
    }, function(module, exports, __webpack_require__) {
        (exports = __webpack_require__(6)(!1)).push([ module.i, "#pantools-top-outside {\n    display: flex;\n}\n\n#pantools-top-left-fileinfo {\n    width: 55%;\n    min-width: 480px;\n    border: #b8daff;\n    background-color: #b8daff;\n    border-radius: 5px;\n    padding-bottom: 10px;\n}\n\n#pantools-top-right-qrcode {\n    margin-left: auto;\n    flex: auto;\n}\n\n#pantools-top-right-qrcode img {\n    width: 90%;\n}\n\n#pantools-top-left-fileinfo p {\n    text-align: left;\n    margin: 10px 0 0 10px;\n}\n\n#pantools-top-left-fileinfo input {\n    box-sizing: border-box;\n    width: 90%;\n    transition: border-color .3s, box-shadow .3s;\n    border: 1px solid #d9d9d9;\n    border-radius: .1875em;\n    /*background: inherit;*/\n    box-shadow: inset 0 1px 1px; /*rgb(0 0 0/6%);*/\n    color: inherit;\n    font-size: 1.125em;\n}\n\n#pantools-top-left-fileinfo button {\n    font-size: 1em;\n}\n\n#pantools-bottom-outside div {\n    display: flex;\n    padding-top: 5px;\n}\n\n#pantools-bottom-outside button {\n    margin-left: 5px;\n    font-size: 1em;\n}\n", "" ]), 
        module.exports = exports;
    }, function(module, exports, __webpack_require__) {
        (exports = __webpack_require__(6)(!1)).push([ module.i, "@charset \"utf-8\";\n/* CSS Document */\n/*@font-face { font-family: \"iconfont\"; src: url('ico/iconfont.eot?t=1505195647785'); src: url('ico/iconfont.eot?t=1505195647785#iefix') format('embedded-opentype'), url('ico/iconfont.woff?t=1505195647785') format('woff'), url('ico/iconfont.ttf?t=1505195647785') format('truetype'), url('ico/iconfont.svg?t=1505195647785#iconfont') format('svg'); }*/\n.iconfont { font-family: \"iconfont\" !important; font-size: 16px; font-style: normal; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n.parts-floating { position: fixed; z-index: 999; }\n.parts-floating[data-position] { margin: 30px; }\n.parts-floating[data-movestate='false'] { display: none; }\n@media (min-width:768px) {\n    .parts-floating[data-state='true'] { display: block; }\n    .parts-floating[data-state='false'] { display: none; }\n}\n.parts-floating[data-position*='left'] { left: 0; }\n.parts-floating[data-position*='right'] { right: 0; }\n.parts-floating[data-position*='bottom'] { bottom: 0; }\n.parts-floating[data-position*='top'] { top: 0; }\n.parts-floating[data-position*='center'] { top: 50%; transform: translateY(-50%); -ms-transform: translateY(-50%); -moz-transform: translateY(-50%); -webkit-transform: translateY(-50%); -o-transform: translateY(-50%); }\n.parts-floating ul { margin: 0; padding: 0; list-style: none; }\n.parts-floating li { position: relative; margin: 3px 0; width: 42px;height: 0; padding-bottom: 100%; background-color: #000; color: #fff; text-align: center; cursor: pointer; font-size: 20px; }\n.parts-floating li .parts-li-tip { position: absolute; z-index: 10; font-size: 12px; font-style: normal; font-weight: 400; line-height: 1.42857143; text-shadow: none; text-transform: none; letter-spacing: normal; word-break: normal; word-spacing: normal; word-wrap: normal; white-space: normal; bottom: 50%; padding: 0 10px; margin-bottom: -16.5px; display: none; opacity: 1; min-width: 216px; text-align: right; }\n.parts-floating li .parts-li-tip .tooltip-inner { text-align: center; background-color: #000; color: #fff; -moz-border-radius: 4px; -webkit-border-radius: 4px; border-radius: 4px; display: inline-block; text-align: left; max-width: 216px; padding: 8px; word-wrap: break-word; word-break: normal; }\n.parts-floating li .parts-li-tip img { max-width: 200px; max-height: 100%; height: auto; width: auto; }\n.parts-floating li:hover .parts-li-tip { display: block; }\n.parts-floating li:hover .parts-li-tip:before { content: \" \"; }\n.parts-floating[data-position*='left'] .parts-li-tip { left: 100%; text-align: left; }\n.parts-floating[data-position*='right'] .parts-li-tip { right: 100%; text-align: right; }\n.parts-floating[data-size='lg'] li { width: 50px; font-size: 22px; }\n.parts-floating[data-size='sm'] li { width: 35px; font-size: 18px; }\n.parts-floating li a { color: inherit; position: relative;top: 8px}\n.parts-floating li span { color: inherit; position: relative;top: 7px}\n.parts-floating li .iconfont { position: absolute; top: 50%; left: 0; right: 0; transform: translateY(-50%); -ms-transform: translateY(-50%); -moz-transform: translateY(-50%); -webkit-transform: translateY(-50%); -o-transform: translateY(-50%); font-size: inherit; color: inherit; }\n.parts-floating li[data-type='Href'] { background-color: red; border-color: #5c6ac4; color: #5c6ac4; }\n.parts-floating li[data-type='Href'] .iconfont:before { content: \"\\e678\"; }\n.parts-floating li[data-type='Func'] { background-color: red; border-color: #5c6ac4; color: #5c6ac4; }\n.parts-floating li[data-type='Func'] .iconfont:before { content: \"\\e678\"; }\n.parts-floating[data-theme*='solid'] li { color: #fff !important; }\n.parts-floating[data-theme*='round'] li { -moz-border-radius: 50%; -webkit-border-radius: 50%; border-radius: 50%; }\n.parts-floating[data-theme*='fillet'] li { -moz-border-radius: 5px; -webkit-border-radius: 5px; border-radius: 5px; }\n.parts-floating[data-theme*='hollow'] li { border-style: solid; border-width: 2px; background-color: #fff !important; padding-bottom: calc(100% - 4px); }\n.parts-floating[data-theme*='Blacktheme'] li { background-color: #000 !important; color: #fff !important; }\n.parts-floating li[data-type='Email']:hover { background-color: rgba(238, 97, 0, 0.6); border-color: rgba(238, 97, 0, 0.6); color: rgba(238, 97, 0, 0.6); }\n.parts-floating li[data-type='Phone']:hover { background-color: rgba(237, 99, 71, 0.6); border-color: rgba(237, 99, 71, 0.6); color: rgba(237, 99, 71, 0.6); }\n.parts-floating li[data-type='Skype']:hover { background-color: rgba(0, 122, 206, 0.6); border-color: rgba(0, 122, 206, 0.6); color: rgba(0, 122, 206, 0.6); }\n.parts-floating li[data-type='WhatsApp']:hover { background-color: rgba(80, 184, 60, 0.6); border-color: rgba(80, 184, 60, 0.6); color: rgba(80, 184, 60, 0.6); }\n.parts-floating li[data-type='Viber']:hover { background-color: rgba(156, 106, 222, 0.6); border-color: rgba(156, 106, 222, 0.6); color: rgba(156, 106, 222, 0.6); }\n.parts-floating li[data-type='Message']:hover { background-color: rgba(94, 142, 62, 0.6); border-color: rgba(94, 142, 62, 0.6); color: rgba(94, 142, 62, 0.6); }\n.parts-floating li[data-type='QRcode']:hover { background-color: rgba(183, 98, 255, 0.6); border-color: rgba(183, 98, 255, 0.6); color: rgba(183, 98, 255, 0.6); }\n.parts-floating li[data-type='Address']:hover { background-color: rgba(195, 85, 85, 0.6); border-color: rgba(195, 85, 85, 0.6); color: rgba(195, 85, 85, 0.6); }\n.parts-floating li[data-type='QQ']:hover { background-color: rgba(1, 136, 251, 0.6); border-color: rgba(1, 136, 251, 0.6); color: rgba(1, 136, 251, 0.6); }\n.parts-floating li[data-type='Top']:hover { background-color: rgba(92, 106, 196, 0.6); border-color: rgba(92, 106, 196, 0.6); color: rgba(92, 106, 196, 0.6); }\n.parts-floating li[data-type='Href']:hover { background-color: rgba(92, 106, 196, 0.6); border-color: rgba(92, 106, 196, 0.6); color: rgba(92, 106, 196, 0.6); }\n.parts-floating[data-theme*='Blacktheme'] li:hover { background-color: rgba(0, 0, 0, 0.6) !important; }\n", "" ]), 
        module.exports = exports;
    }, function(module, exports, __webpack_require__) {
        (exports = __webpack_require__(6)(!1)).push([ module.i, '.PanTools-Coupon-Wrap {\n    margin: 10px 0;\n    overflow: hidden;\n    color: #fff;\n}\n\n.PanTools-Coupon-Wrap .coupon {\n    background-image: linear-gradient(150deg, rgb(255, 153, 0), rgb(255, 102, 153));\n    display: inline-flex;\n    color: white;\n    position: relative;\n    padding-left: 0.5rem;\n    padding-right: 0.5rem;\n    border-top-right-radius: 0.3rem;\n    border-bottom-right-radius: 0.3rem;\n    overflow: hidden;\n}\n\n.PanTools-Coupon-Wrap .coupon::before {\n    left: -7px;\n    content: "";\n    position: absolute;\n    top: 0px;\n    height: 100%;\n    width: 14px;\n    background-image: radial-gradient(white 0px, white 4px, transparent 4px);\n    background-size: 14px 14px;\n    z-index: 1;\n    background-position: 0px 2px;\n    background-repeat: repeat-y;\n}\n\n.PanTools-Coupon-Wrap .coupon .coupon-info {\n    border-right: 2px dashed white;\n    padding-left: 20px;\n    padding-top: 20px;\n    padding-bottom: 20px;\n    position: relative;\n    min-width: 200px;\n    font-size: 14px;\n}\n\n.PanTools-Coupon-Wrap .coupon .coupon-info::before, .PanTools-Coupon-Wrap .coupon .coupon-info::after {\n    content: "";\n    width: 20px;\n    height: 20px;\n    background-color: white;\n    position: absolute;\n    right: -11px;\n    border-radius: 50%;\n}\n\n.PanTools-Coupon-Wrap .coupon .coupon-info::before {\n    top: -10px;\n}\n\n.PanTools-Coupon-Wrap .coupon .coupon-info::after {\n    bottom: -10px;\n}\n\n.PanTools-Coupon-Wrap .coupon .coupon-info .coupon-desc {\n    font-size: 18px;\n    font-weight: bold;\n}\n\n.PanTools-Coupon-Wrap .coupon .coupon-get {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    flex-direction: column;\n    min-width: 100px;\n    position: relative;\n    font-size: 20px;\n    color: rgb(255, 255, 255);\n    padding: 20px;\n}\n\n.coupon-time {\n    color: #ff8440;\n    margin-top: 5px;\n}\n', "" ]), 
        module.exports = exports;
    }, function(module, exports, __webpack_require__) {
        (exports = __webpack_require__(6)(!1)).push([ module.i, "#PanTools-outside {\n    border: 1px solid #eee;\n    margin: 0 auto;\n    position: relative;\n    clear: both;\n    display: none\n}\n\n#PanTools-outside .PanTools-outside-coupons {\n    width: 240px;\n    float: left\n}\n\n#PanTools-outside .PanTools-outside-coupons .PanTools-outside-coupons-qrcode {\n    text-align: center;\n    min-height: 150px;\n    margin-top: 30px\n}\n\n#PanTools-outside .PanTools-outside-coupons .PanTools-outside-coupons-qrcode canvas,\n#PanTools-outside .PanTools-outside-coupons .PanTools-outside-coupons-qrcode img {\n    margin: 0 auto\n}\n\n#PanTools-outside .PanTools-outside-coupons .PanTools-outside-coupons-title {\n    margin-top: 20px;\n    color: #000;\n    font-size: 14px;\n    font-weight: 700;\n    text-align: center\n}\n\n#PanTools-outside .PanTools-outside-coupons .PanTools-outside-coupons-title span {\n    color: #ff0036;\n    font-weight: 700\n}\n\n#PanTools-outside .PanTools-outside-coupons .PanTools-outside-coupons-action {\n    margin-top: 10px;\n    text-align: center\n}\n\n#PanTools-outside .PanTools-outside-coupons .PanTools-outside-coupons-action a {\n    text-decoration: none\n}\n\n#PanTools-outside .PanTools-outside-coupons .PanTools-outside-coupons-action .PanTools-outside-coupons-button {\n    min-width: 135px;\n    padding: 0 8px;\n    line-height: 35px;\n    color: #fff;\n    background: #ff0036;\n    font-size: 13px;\n    font-weight: 700;\n    letter-spacing: 1.5px;\n    margin: 0 auto;\n    text-align: center;\n    border-radius: 15px;\n    display: inline-block;\n    cursor: pointer\n}\n\n#PanTools-outside .PanTools-outside-coupons .PanTools-outside-coupons-action .PanTools-outside-coupons-button.quan-none {\n    color: #000;\n    background: #bec5c5\n}\n\n.PanTools-outside-coupons-date {\n    color: #233b3d;\n    font-weight: normal;\n    font-size: 12px;\n}\n\n#PanTools-outside .PanTools-outside-history .PanTools-outside-history-tip {\n    position: absolute;\n    margin: 0;\n    top: 50%;\n    left: 50%;\n    letter-spacing: 1px;\n    font-size: 15px;\n    transform: translateX(-50%) translateY(-50%)\n}\n\n#PanTools-outside .PanTools-outside-history, #PanTools-outside-chart-body {\n    height: 300px;\n    overflow: hidden;\n    position: relative\n}\n\n#PanTools-outside .PanTools-outside-history .PanTools-outside-chart-container,\n#PanTools-outside-chart-container-line {\n    width: 100%;\n    height: 100%\n}\n", "" ]), 
        module.exports = exports;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.IocAuto = exports.Container = void 0, __webpack_require__(29);
        var container = new Map, Container = function() {
            function Container() {}
            return Container.Registe = function(type, args) {
                var className = this.processName(type.name);
                return container.set(className, window.Reflect.construct(type, this.buildParams(args))), 
                container.get(className);
            }, Container.buildParams = function(args) {
                var para = [];
                return null == args || args.map((function(item) {
                    para.push(item);
                })), para;
            }, Container.processName = function(name) {
                return name.toLowerCase();
            }, Container.Require = function(type) {
                var _this = this;
                if (null == type) return null;
                var name = this.processName(type.name);
                if (container.has(name)) return container.get(name);
                var args, classParams = Reflect.getMetadata(METADATA_PARAMS, type);
                return (null == classParams ? void 0 : classParams.length) && (args = classParams.map((function(item) {
                    return _this.Require(item);
                }))), this.Registe(type, args);
            }, Container.define = function(target, key) {
                var _a, classType = Reflect.getMetadata(METADATA_TYPE, target, key), desc = null !== (_a = Object.getOwnPropertyDescriptor(target, key)) && void 0 !== _a ? _a : {
                    writable: !0,
                    configurable: !0
                };
                desc.value = this.Require(classType), Object.defineProperty(target, key, desc);
            }, Container;
        }();
        exports.Container = Container;
        var METADATA_TYPE = "design:type", METADATA_PARAMS = "design:paramtypes";
        exports.IocAuto = function IocAuto(target, key) {
            Container.define(target, key);
        };
    }, function(module, exports, __webpack_require__) {
        module.exports = function() {
            "use strict";
            function _typeof(obj) {
                return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                    return typeof obj;
                } : function(obj) {
                    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                }, _typeof(obj);
            }
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
            }
            function _defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
                    "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            function _createClass(Constructor, protoProps, staticProps) {
                return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), 
                Constructor;
            }
            function _extends() {
                return _extends = Object.assign || function(target) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = arguments[i];
                        for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
                    }
                    return target;
                }, _extends.apply(this, arguments);
            }
            function _inherits(subClass, superClass) {
                if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        writable: !0,
                        configurable: !0
                    }
                }), superClass && _setPrototypeOf(subClass, superClass);
            }
            function _getPrototypeOf(o) {
                return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
                    return o.__proto__ || Object.getPrototypeOf(o);
                }, _getPrototypeOf(o);
            }
            function _setPrototypeOf(o, p) {
                return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                    return o.__proto__ = p, o;
                }, _setPrototypeOf(o, p);
            }
            function _isNativeReflectConstruct() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), 
                    !0;
                } catch (e) {
                    return !1;
                }
            }
            function _construct(Parent, args, Class) {
                return _construct = _isNativeReflectConstruct() ? Reflect.construct : function _construct(Parent, args, Class) {
                    var a = [ null ];
                    a.push.apply(a, args);
                    var instance = new (Function.bind.apply(Parent, a));
                    return Class && _setPrototypeOf(instance, Class.prototype), instance;
                }, _construct.apply(null, arguments);
            }
            function _assertThisInitialized(self) {
                if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return self;
            }
            function _possibleConstructorReturn(self, call) {
                return !call || "object" != typeof call && "function" != typeof call ? _assertThisInitialized(self) : call;
            }
            function _createSuper(Derived) {
                var hasNativeReflectConstruct = _isNativeReflectConstruct();
                return function _createSuperInternal() {
                    var result, Super = _getPrototypeOf(Derived);
                    if (hasNativeReflectConstruct) {
                        var NewTarget = _getPrototypeOf(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else result = Super.apply(this, arguments);
                    return _possibleConstructorReturn(this, result);
                };
            }
            function _superPropBase(object, property) {
                for (;!Object.prototype.hasOwnProperty.call(object, property) && null !== (object = _getPrototypeOf(object)); ) ;
                return object;
            }
            function _get(target, property, receiver) {
                return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function _get(target, property, receiver) {
                    var base = _superPropBase(target, property);
                    if (base) {
                        var desc = Object.getOwnPropertyDescriptor(base, property);
                        return desc.get ? desc.get.call(receiver) : desc.value;
                    }
                }, _get(target, property, receiver || target);
            }
            var uniqueArray = function uniqueArray(arr) {
                for (var result = [], i = 0; i < arr.length; i++) -1 === result.indexOf(arr[i]) && result.push(arr[i]);
                return result;
            }, capitalizeFirstLetter = function capitalizeFirstLetter(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }, objectValues = function objectValues(obj) {
                return Object.keys(obj).map((function(key) {
                    return obj[key];
                }));
            }, toArray = function toArray(nodeList) {
                return Array.prototype.slice.call(nodeList);
            }, warn = function warn(message) {}, error = function error(message) {}, previousWarnOnceMessages = [], warnOnce = function warnOnce(message) {
                -1 === previousWarnOnceMessages.indexOf(message) && (previousWarnOnceMessages.push(message), 
                warn(message));
            }, warnAboutDeprecation = function warnAboutDeprecation(deprecatedParam, useInstead) {
                warnOnce('"'.concat(deprecatedParam, '" is deprecated and will be removed in the next major release. Please use "').concat(useInstead, '" instead.'));
            }, callIfFunction = function callIfFunction(arg) {
                return "function" == typeof arg ? arg() : arg;
            }, hasToPromiseFn = function hasToPromiseFn(arg) {
                return arg && "function" == typeof arg.toPromise;
            }, asPromise = function asPromise(arg) {
                return hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);
            }, isPromise = function isPromise(arg) {
                return arg && Promise.resolve(arg) === arg;
            }, DismissReason = Object.freeze({
                cancel: "cancel",
                backdrop: "backdrop",
                close: "close",
                esc: "esc",
                timer: "timer"
            }), isJqueryElement = function isJqueryElement(elem) {
                return "object" === _typeof(elem) && elem.jquery;
            }, isElement = function isElement(elem) {
                return elem instanceof Element || isJqueryElement(elem);
            }, argsToParams = function argsToParams(args) {
                var params = {};
                return "object" !== _typeof(args[0]) || isElement(args[0]) ? [ "title", "html", "icon" ].forEach((function(name, index) {
                    var arg = args[index];
                    "string" == typeof arg || isElement(arg) ? params[name] = arg : void 0 !== arg && error("Unexpected type of ".concat(name, '! Expected "string" or "Element", got ').concat(_typeof(arg)));
                })) : _extends(params, args[0]), params;
            }, swalPrefix = "swal2-", prefix = function prefix(items) {
                var result = {};
                for (var i in items) result[items[i]] = swalPrefix + items[i];
                return result;
            }, swalClasses = prefix([ "container", "shown", "height-auto", "iosfix", "popup", "modal", "no-backdrop", "no-transition", "toast", "toast-shown", "show", "hide", "close", "title", "header", "content", "html-container", "actions", "confirm", "deny", "cancel", "footer", "icon", "icon-content", "image", "input", "file", "range", "select", "radio", "checkbox", "label", "textarea", "inputerror", "input-label", "validation-message", "progress-steps", "active-progress-step", "progress-step", "progress-step-line", "loader", "loading", "styled", "top", "top-start", "top-end", "top-left", "top-right", "center", "center-start", "center-end", "center-left", "center-right", "bottom", "bottom-start", "bottom-end", "bottom-left", "bottom-right", "grow-row", "grow-column", "grow-fullscreen", "rtl", "timer-progress-bar", "timer-progress-bar-container", "scrollbar-measure", "icon-success", "icon-warning", "icon-info", "icon-question", "icon-error" ]), iconTypes = prefix([ "success", "warning", "info", "question", "error" ]), getContainer = function getContainer() {
                return document.body.querySelector(".".concat(swalClasses.container));
            }, elementBySelector = function elementBySelector(selectorString) {
                var container = getContainer();
                return container ? container.querySelector(selectorString) : null;
            }, elementByClass = function elementByClass(className) {
                return elementBySelector(".".concat(className));
            }, getPopup = function getPopup() {
                return elementByClass(swalClasses.popup);
            }, getIcon = function getIcon() {
                return elementByClass(swalClasses.icon);
            }, getTitle = function getTitle() {
                return elementByClass(swalClasses.title);
            }, getContent = function getContent() {
                return elementByClass(swalClasses.content);
            }, getHtmlContainer = function getHtmlContainer() {
                return elementByClass(swalClasses["html-container"]);
            }, getImage = function getImage() {
                return elementByClass(swalClasses.image);
            }, getProgressSteps = function getProgressSteps() {
                return elementByClass(swalClasses["progress-steps"]);
            }, getValidationMessage = function getValidationMessage() {
                return elementByClass(swalClasses["validation-message"]);
            }, getConfirmButton = function getConfirmButton() {
                return elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.confirm));
            }, getDenyButton = function getDenyButton() {
                return elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.deny));
            }, getInputLabel = function getInputLabel() {
                return elementByClass(swalClasses["input-label"]);
            }, getLoader = function getLoader() {
                return elementBySelector(".".concat(swalClasses.loader));
            }, getCancelButton = function getCancelButton() {
                return elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.cancel));
            }, getActions = function getActions() {
                return elementByClass(swalClasses.actions);
            }, getHeader = function getHeader() {
                return elementByClass(swalClasses.header);
            }, getFooter = function getFooter() {
                return elementByClass(swalClasses.footer);
            }, getTimerProgressBar = function getTimerProgressBar() {
                return elementByClass(swalClasses["timer-progress-bar"]);
            }, getCloseButton = function getCloseButton() {
                return elementByClass(swalClasses.close);
            }, focusable = '\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex="0"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n', getFocusableElements = function getFocusableElements() {
                var focusableElementsWithTabindex = toArray(getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')).sort((function(a, b) {
                    return (a = parseInt(a.getAttribute("tabindex"))) > (b = parseInt(b.getAttribute("tabindex"))) ? 1 : a < b ? -1 : 0;
                })), otherFocusableElements = toArray(getPopup().querySelectorAll(focusable)).filter((function(el) {
                    return "-1" !== el.getAttribute("tabindex");
                }));
                return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements)).filter((function(el) {
                    return isVisible(el);
                }));
            }, isModal = function isModal() {
                return !isToast() && !document.body.classList.contains(swalClasses["no-backdrop"]);
            }, isToast = function isToast() {
                return document.body.classList.contains(swalClasses["toast-shown"]);
            }, isLoading = function isLoading() {
                return getPopup().hasAttribute("data-loading");
            }, states = {
                previousBodyPadding: null
            }, setInnerHtml = function setInnerHtml(elem, html) {
                if (elem.textContent = "", html) {
                    var parsed = (new DOMParser).parseFromString(html, "text/html");
                    toArray(parsed.querySelector("head").childNodes).forEach((function(child) {
                        elem.appendChild(child);
                    })), toArray(parsed.querySelector("body").childNodes).forEach((function(child) {
                        elem.appendChild(child);
                    }));
                }
            }, hasClass = function hasClass(elem, className) {
                if (!className) return !1;
                for (var classList = className.split(/\s+/), i = 0; i < classList.length; i++) if (!elem.classList.contains(classList[i])) return !1;
                return !0;
            }, removeCustomClasses = function removeCustomClasses(elem, params) {
                toArray(elem.classList).forEach((function(className) {
                    -1 === objectValues(swalClasses).indexOf(className) && -1 === objectValues(iconTypes).indexOf(className) && -1 === objectValues(params.showClass).indexOf(className) && elem.classList.remove(className);
                }));
            }, applyCustomClass = function applyCustomClass(elem, params, className) {
                if (removeCustomClasses(elem, params), params.customClass && params.customClass[className]) {
                    if ("string" != typeof params.customClass[className] && !params.customClass[className].forEach) return warn("Invalid type of customClass.".concat(className, '! Expected string or iterable object, got "').concat(_typeof(params.customClass[className]), '"'));
                    addClass(elem, params.customClass[className]);
                }
            };
            function getInput(content, inputType) {
                if (!inputType) return null;
                switch (inputType) {
                  case "select":
                  case "textarea":
                  case "file":
                    return getChildByClass(content, swalClasses[inputType]);

                  case "checkbox":
                    return content.querySelector(".".concat(swalClasses.checkbox, " input"));

                  case "radio":
                    return content.querySelector(".".concat(swalClasses.radio, " input:checked")) || content.querySelector(".".concat(swalClasses.radio, " input:first-child"));

                  case "range":
                    return content.querySelector(".".concat(swalClasses.range, " input"));

                  default:
                    return getChildByClass(content, swalClasses.input);
                }
            }
            var oldInputVal, focusInput = function focusInput(input) {
                if (input.focus(), "file" !== input.type) {
                    var val = input.value;
                    input.value = "", input.value = val;
                }
            }, toggleClass = function toggleClass(target, classList, condition) {
                target && classList && ("string" == typeof classList && (classList = classList.split(/\s+/).filter(Boolean)), 
                classList.forEach((function(className) {
                    target.forEach ? target.forEach((function(elem) {
                        condition ? elem.classList.add(className) : elem.classList.remove(className);
                    })) : condition ? target.classList.add(className) : target.classList.remove(className);
                })));
            }, addClass = function addClass(target, classList) {
                toggleClass(target, classList, !0);
            }, removeClass = function removeClass(target, classList) {
                toggleClass(target, classList, !1);
            }, getChildByClass = function getChildByClass(elem, className) {
                for (var i = 0; i < elem.childNodes.length; i++) if (hasClass(elem.childNodes[i], className)) return elem.childNodes[i];
            }, applyNumericalStyle = function applyNumericalStyle(elem, property, value) {
                value === "".concat(parseInt(value)) && (value = parseInt(value)), value || 0 === parseInt(value) ? elem.style[property] = "number" == typeof value ? "".concat(value, "px") : value : elem.style.removeProperty(property);
            }, show = function show(elem) {
                var display = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "flex";
                elem.style.display = display;
            }, hide = function hide(elem) {
                elem.style.display = "none";
            }, setStyle = function setStyle(parent, selector, property, value) {
                var el = parent.querySelector(selector);
                el && (el.style[property] = value);
            }, toggle = function toggle(elem, condition, display) {
                condition ? show(elem, display) : hide(elem);
            }, isVisible = function isVisible(elem) {
                return !(!elem || !(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
            }, allButtonsAreHidden = function allButtonsAreHidden() {
                return !isVisible(getConfirmButton()) && !isVisible(getDenyButton()) && !isVisible(getCancelButton());
            }, isScrollable = function isScrollable(elem) {
                return !!(elem.scrollHeight > elem.clientHeight);
            }, hasCssAnimation = function hasCssAnimation(elem) {
                var style = window.getComputedStyle(elem), animDuration = parseFloat(style.getPropertyValue("animation-duration") || "0"), transDuration = parseFloat(style.getPropertyValue("transition-duration") || "0");
                return animDuration > 0 || transDuration > 0;
            }, contains = function contains(haystack, needle) {
                if ("function" == typeof haystack.contains) return haystack.contains(needle);
            }, animateTimerProgressBar = function animateTimerProgressBar(timer) {
                var reset = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], timerProgressBar = getTimerProgressBar();
                isVisible(timerProgressBar) && (reset && (timerProgressBar.style.transition = "none", 
                timerProgressBar.style.width = "100%"), setTimeout((function() {
                    timerProgressBar.style.transition = "width ".concat(timer / 1e3, "s linear"), timerProgressBar.style.width = "0%";
                }), 10));
            }, stopTimerProgressBar = function stopTimerProgressBar() {
                var timerProgressBar = getTimerProgressBar(), timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
                timerProgressBar.style.removeProperty("transition"), timerProgressBar.style.width = "100%";
                var timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width), timerProgressBarPercent = parseInt(timerProgressBarWidth / timerProgressBarFullWidth * 100);
                timerProgressBar.style.removeProperty("transition"), timerProgressBar.style.width = "".concat(timerProgressBarPercent, "%");
            }, isNodeEnv = function isNodeEnv() {
                return "undefined" == typeof window || "undefined" == typeof document;
            }, sweetHTML = '\n <div aria-labelledby="'.concat(swalClasses.title, '" aria-describedby="').concat(swalClasses.content, '" class="').concat(swalClasses.popup, '" tabindex="-1">\n   <div class="').concat(swalClasses.header, '">\n     <ul class="').concat(swalClasses["progress-steps"], '"></ul>\n     <div class="').concat(swalClasses.icon, '"></div>\n     <img class="').concat(swalClasses.image, '" />\n     <h2 class="').concat(swalClasses.title, '" id="').concat(swalClasses.title, '"></h2>\n     <button type="button" class="').concat(swalClasses.close, '"></button>\n   </div>\n   <div class="').concat(swalClasses.content, '">\n     <div id="').concat(swalClasses.content, '" class="').concat(swalClasses["html-container"], '"></div>\n     <input class="').concat(swalClasses.input, '" />\n     <input type="file" class="').concat(swalClasses.file, '" />\n     <div class="').concat(swalClasses.range, '">\n       <input type="range" />\n       <output></output>\n     </div>\n     <select class="').concat(swalClasses.select, '"></select>\n     <div class="').concat(swalClasses.radio, '"></div>\n     <label for="').concat(swalClasses.checkbox, '" class="').concat(swalClasses.checkbox, '">\n       <input type="checkbox" />\n       <span class="').concat(swalClasses.label, '"></span>\n     </label>\n     <textarea class="').concat(swalClasses.textarea, '"></textarea>\n     <div class="').concat(swalClasses["validation-message"], '" id="').concat(swalClasses["validation-message"], '"></div>\n   </div>\n   <div class="').concat(swalClasses.actions, '">\n     <div class="').concat(swalClasses.loader, '"></div>\n     <button type="button" class="').concat(swalClasses.confirm, '"></button>\n     <button type="button" class="').concat(swalClasses.deny, '"></button>\n     <button type="button" class="').concat(swalClasses.cancel, '"></button>\n   </div>\n   <div class="').concat(swalClasses.footer, '"></div>\n   <div class="').concat(swalClasses["timer-progress-bar-container"], '">\n     <div class="').concat(swalClasses["timer-progress-bar"], '"></div>\n   </div>\n </div>\n').replace(/(^|\n)\s*/g, ""), resetOldContainer = function resetOldContainer() {
                var oldContainer = getContainer();
                return !!oldContainer && (oldContainer.parentNode.removeChild(oldContainer), removeClass([ document.documentElement, document.body ], [ swalClasses["no-backdrop"], swalClasses["toast-shown"], swalClasses["has-column"] ]), 
                !0);
            }, resetValidationMessage = function resetValidationMessage(e) {
                Swal.isVisible() && oldInputVal !== e.target.value && Swal.resetValidationMessage(), 
                oldInputVal = e.target.value;
            }, addInputChangeListeners = function addInputChangeListeners() {
                var content = getContent(), input = getChildByClass(content, swalClasses.input), file = getChildByClass(content, swalClasses.file), range = content.querySelector(".".concat(swalClasses.range, " input")), rangeOutput = content.querySelector(".".concat(swalClasses.range, " output")), select = getChildByClass(content, swalClasses.select), checkbox = content.querySelector(".".concat(swalClasses.checkbox, " input")), textarea = getChildByClass(content, swalClasses.textarea);
                input.oninput = resetValidationMessage, file.onchange = resetValidationMessage, 
                select.onchange = resetValidationMessage, checkbox.onchange = resetValidationMessage, 
                textarea.oninput = resetValidationMessage, range.oninput = function(e) {
                    resetValidationMessage(e), rangeOutput.value = range.value;
                }, range.onchange = function(e) {
                    resetValidationMessage(e), range.nextSibling.value = range.value;
                };
            }, getTarget = function getTarget(target) {
                return "string" == typeof target ? document.querySelector(target) : target;
            }, setupAccessibility = function setupAccessibility(params) {
                var popup = getPopup();
                popup.setAttribute("role", params.toast ? "alert" : "dialog"), popup.setAttribute("aria-live", params.toast ? "polite" : "assertive"), 
                params.toast || popup.setAttribute("aria-modal", "true");
            }, setupRTL = function setupRTL(targetElement) {
                "rtl" === window.getComputedStyle(targetElement).direction && addClass(getContainer(), swalClasses.rtl);
            }, init = function init(params) {
                var oldContainerExisted = resetOldContainer();
                if (isNodeEnv()) error("SweetAlert2 requires document to initialize"); else {
                    var container = document.createElement("div");
                    container.className = swalClasses.container, oldContainerExisted && addClass(container, swalClasses["no-transition"]), 
                    setInnerHtml(container, sweetHTML);
                    var targetElement = getTarget(params.target);
                    targetElement.appendChild(container), setupAccessibility(params), setupRTL(targetElement), 
                    addInputChangeListeners();
                }
            }, parseHtmlToContainer = function parseHtmlToContainer(param, target) {
                param instanceof HTMLElement ? target.appendChild(param) : "object" === _typeof(param) ? handleObject(param, target) : param && setInnerHtml(target, param);
            }, handleObject = function handleObject(param, target) {
                param.jquery ? handleJqueryElem(target, param) : setInnerHtml(target, param.toString());
            }, handleJqueryElem = function handleJqueryElem(target, elem) {
                if (target.textContent = "", 0 in elem) for (var i = 0; i in elem; i++) target.appendChild(elem[i].cloneNode(!0)); else target.appendChild(elem.cloneNode(!0));
            }, animationEndEvent = function() {
                if (isNodeEnv()) return !1;
                var testEl = document.createElement("div"), transEndEventNames = {
                    WebkitAnimation: "webkitAnimationEnd",
                    OAnimation: "oAnimationEnd oanimationend",
                    animation: "animationend"
                };
                for (var i in transEndEventNames) if (Object.prototype.hasOwnProperty.call(transEndEventNames, i) && void 0 !== testEl.style[i]) return transEndEventNames[i];
                return !1;
            }(), measureScrollbar = function measureScrollbar() {
                var scrollDiv = document.createElement("div");
                scrollDiv.className = swalClasses["scrollbar-measure"], document.body.appendChild(scrollDiv);
                var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
                return document.body.removeChild(scrollDiv), scrollbarWidth;
            }, renderActions = function renderActions(instance, params) {
                var actions = getActions(), loader = getLoader(), confirmButton = getConfirmButton(), denyButton = getDenyButton(), cancelButton = getCancelButton();
                params.showConfirmButton || params.showDenyButton || params.showCancelButton || hide(actions), 
                applyCustomClass(actions, params, "actions"), renderButton(confirmButton, "confirm", params), 
                renderButton(denyButton, "deny", params), renderButton(cancelButton, "cancel", params), 
                handleButtonsStyling(confirmButton, denyButton, cancelButton, params), params.reverseButtons && (actions.insertBefore(cancelButton, loader), 
                actions.insertBefore(denyButton, loader), actions.insertBefore(confirmButton, loader)), 
                setInnerHtml(loader, params.loaderHtml), applyCustomClass(loader, params, "loader");
            };
            function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
                if (!params.buttonsStyling) return removeClass([ confirmButton, denyButton, cancelButton ], swalClasses.styled);
                addClass([ confirmButton, denyButton, cancelButton ], swalClasses.styled), params.confirmButtonColor && (confirmButton.style.backgroundColor = params.confirmButtonColor), 
                params.denyButtonColor && (denyButton.style.backgroundColor = params.denyButtonColor), 
                params.cancelButtonColor && (cancelButton.style.backgroundColor = params.cancelButtonColor);
            }
            function renderButton(button, buttonType, params) {
                toggle(button, params["show".concat(capitalizeFirstLetter(buttonType), "Button")], "inline-block"), 
                setInnerHtml(button, params["".concat(buttonType, "ButtonText")]), button.setAttribute("aria-label", params["".concat(buttonType, "ButtonAriaLabel")]), 
                button.className = swalClasses[buttonType], applyCustomClass(button, params, "".concat(buttonType, "Button")), 
                addClass(button, params["".concat(buttonType, "ButtonClass")]);
            }
            function handleBackdropParam(container, backdrop) {
                "string" == typeof backdrop ? container.style.background = backdrop : backdrop || addClass([ document.documentElement, document.body ], swalClasses["no-backdrop"]);
            }
            function handlePositionParam(container, position) {
                position in swalClasses ? addClass(container, swalClasses[position]) : (warn('The "position" parameter is not valid, defaulting to "center"'), 
                addClass(container, swalClasses.center));
            }
            function handleGrowParam(container, grow) {
                if (grow && "string" == typeof grow) {
                    var growClass = "grow-".concat(grow);
                    growClass in swalClasses && addClass(container, swalClasses[growClass]);
                }
            }
            var renderContainer = function renderContainer(instance, params) {
                var container = getContainer();
                if (container) {
                    handleBackdropParam(container, params.backdrop), !params.backdrop && params.allowOutsideClick && warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`'), 
                    handlePositionParam(container, params.position), handleGrowParam(container, params.grow), 
                    applyCustomClass(container, params, "container");
                    var queueStep = document.body.getAttribute("data-swal2-queue-step");
                    queueStep && (container.setAttribute("data-queue-step", queueStep), document.body.removeAttribute("data-swal2-queue-step"));
                }
            }, privateProps = {
                promise: new WeakMap,
                innerParams: new WeakMap,
                domCache: new WeakMap
            }, inputTypes = [ "input", "file", "range", "select", "radio", "checkbox", "textarea" ], renderInput = function renderInput(instance, params) {
                var content = getContent(), innerParams = privateProps.innerParams.get(instance), rerender = !innerParams || params.input !== innerParams.input;
                inputTypes.forEach((function(inputType) {
                    var inputClass = swalClasses[inputType], inputContainer = getChildByClass(content, inputClass);
                    setAttributes(inputType, params.inputAttributes), inputContainer.className = inputClass, 
                    rerender && hide(inputContainer);
                })), params.input && (rerender && showInput(params), setCustomClass(params));
            }, showInput = function showInput(params) {
                if (!renderInputType[params.input]) return error('Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "'.concat(params.input, '"'));
                var inputContainer = getInputContainer(params.input), input = renderInputType[params.input](inputContainer, params);
                show(input), setTimeout((function() {
                    focusInput(input);
                }));
            }, removeAttributes = function removeAttributes(input) {
                for (var i = 0; i < input.attributes.length; i++) {
                    var attrName = input.attributes[i].name;
                    -1 === [ "type", "value", "style" ].indexOf(attrName) && input.removeAttribute(attrName);
                }
            }, setAttributes = function setAttributes(inputType, inputAttributes) {
                var input = getInput(getContent(), inputType);
                if (input) for (var attr in removeAttributes(input), inputAttributes) "range" === inputType && "placeholder" === attr || input.setAttribute(attr, inputAttributes[attr]);
            }, setCustomClass = function setCustomClass(params) {
                var inputContainer = getInputContainer(params.input);
                params.customClass && addClass(inputContainer, params.customClass.input);
            }, setInputPlaceholder = function setInputPlaceholder(input, params) {
                input.placeholder && !params.inputPlaceholder || (input.placeholder = params.inputPlaceholder);
            }, setInputLabel = function setInputLabel(input, prependTo, params) {
                if (params.inputLabel) {
                    input.id = swalClasses.input;
                    var label = document.createElement("label"), labelClass = swalClasses["input-label"];
                    label.setAttribute("for", input.id), label.className = labelClass, addClass(label, params.customClass.inputLabel), 
                    label.innerText = params.inputLabel, prependTo.insertAdjacentElement("beforebegin", label);
                }
            }, getInputContainer = function getInputContainer(inputType) {
                var inputClass = swalClasses[inputType] ? swalClasses[inputType] : swalClasses.input;
                return getChildByClass(getContent(), inputClass);
            }, renderInputType = {};
            renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = function(input, params) {
                return "string" == typeof params.inputValue || "number" == typeof params.inputValue ? input.value = params.inputValue : isPromise(params.inputValue) || warn('Unexpected type of inputValue! Expected "string", "number" or "Promise", got "'.concat(_typeof(params.inputValue), '"')), 
                setInputLabel(input, input, params), setInputPlaceholder(input, params), input.type = params.input, 
                input;
            }, renderInputType.file = function(input, params) {
                return setInputLabel(input, input, params), setInputPlaceholder(input, params), 
                input;
            }, renderInputType.range = function(range, params) {
                var rangeInput = range.querySelector("input"), rangeOutput = range.querySelector("output");
                return rangeInput.value = params.inputValue, rangeInput.type = params.input, rangeOutput.value = params.inputValue, 
                setInputLabel(rangeInput, range, params), range;
            }, renderInputType.select = function(select, params) {
                if (select.textContent = "", params.inputPlaceholder) {
                    var placeholder = document.createElement("option");
                    setInnerHtml(placeholder, params.inputPlaceholder), placeholder.value = "", placeholder.disabled = !0, 
                    placeholder.selected = !0, select.appendChild(placeholder);
                }
                return setInputLabel(select, select, params), select;
            }, renderInputType.radio = function(radio) {
                return radio.textContent = "", radio;
            }, renderInputType.checkbox = function(checkboxContainer, params) {
                var checkbox = getInput(getContent(), "checkbox");
                checkbox.value = 1, checkbox.id = swalClasses.checkbox, checkbox.checked = Boolean(params.inputValue);
                var label = checkboxContainer.querySelector("span");
                return setInnerHtml(label, params.inputPlaceholder), checkboxContainer;
            }, renderInputType.textarea = function(textarea, params) {
                textarea.value = params.inputValue, setInputPlaceholder(textarea, params), setInputLabel(textarea, textarea, params);
                var getPadding = function getPadding(el) {
                    return parseInt(window.getComputedStyle(el).paddingLeft) + parseInt(window.getComputedStyle(el).paddingRight);
                };
                if ("MutationObserver" in window) {
                    var initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);
                    new MutationObserver((function outputsize() {
                        var contentWidth = textarea.offsetWidth + getPadding(getPopup()) + getPadding(getContent());
                        getPopup().style.width = contentWidth > initialPopupWidth ? "".concat(contentWidth, "px") : null;
                    })).observe(textarea, {
                        attributes: !0,
                        attributeFilter: [ "style" ]
                    });
                }
                return textarea;
            };
            var renderContent = function renderContent(instance, params) {
                var htmlContainer = getHtmlContainer();
                applyCustomClass(htmlContainer, params, "htmlContainer"), params.html ? (parseHtmlToContainer(params.html, htmlContainer), 
                show(htmlContainer, "block")) : params.text ? (htmlContainer.textContent = params.text, 
                show(htmlContainer, "block")) : hide(htmlContainer), renderInput(instance, params), 
                applyCustomClass(getContent(), params, "content");
            }, renderFooter = function renderFooter(instance, params) {
                var footer = getFooter();
                toggle(footer, params.footer), params.footer && parseHtmlToContainer(params.footer, footer), 
                applyCustomClass(footer, params, "footer");
            }, renderCloseButton = function renderCloseButton(instance, params) {
                var closeButton = getCloseButton();
                setInnerHtml(closeButton, params.closeButtonHtml), applyCustomClass(closeButton, params, "closeButton"), 
                toggle(closeButton, params.showCloseButton), closeButton.setAttribute("aria-label", params.closeButtonAriaLabel);
            }, renderIcon = function renderIcon(instance, params) {
                var innerParams = privateProps.innerParams.get(instance), icon = getIcon();
                return innerParams && params.icon === innerParams.icon ? (setContent(icon, params), 
                void applyStyles(icon, params)) : params.icon || params.iconHtml ? params.icon && -1 === Object.keys(iconTypes).indexOf(params.icon) ? (error('Unknown icon! Expected "success", "error", "warning", "info" or "question", got "'.concat(params.icon, '"')), 
                hide(icon)) : (show(icon), setContent(icon, params), applyStyles(icon, params), 
                void addClass(icon, params.showClass.icon)) : hide(icon);
            }, applyStyles = function applyStyles(icon, params) {
                for (var iconType in iconTypes) params.icon !== iconType && removeClass(icon, iconTypes[iconType]);
                addClass(icon, iconTypes[params.icon]), setColor(icon, params), adjustSuccessIconBackgoundColor(), 
                applyCustomClass(icon, params, "icon");
            }, adjustSuccessIconBackgoundColor = function adjustSuccessIconBackgoundColor() {
                for (var popup = getPopup(), popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue("background-color"), successIconParts = popup.querySelectorAll("[class^=swal2-success-circular-line], .swal2-success-fix"), i = 0; i < successIconParts.length; i++) successIconParts[i].style.backgroundColor = popupBackgroundColor;
            }, setContent = function setContent(icon, params) {
                icon.textContent = "", params.iconHtml ? setInnerHtml(icon, iconContent(params.iconHtml)) : "success" === params.icon ? setInnerHtml(icon, '\n      <div class="swal2-success-circular-line-left"></div>\n      <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>\n      <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>\n      <div class="swal2-success-circular-line-right"></div>\n    ') : "error" === params.icon ? setInnerHtml(icon, '\n      <span class="swal2-x-mark">\n        <span class="swal2-x-mark-line-left"></span>\n        <span class="swal2-x-mark-line-right"></span>\n      </span>\n    ') : setInnerHtml(icon, iconContent({
                    question: "?",
                    warning: "!",
                    info: "i"
                }[params.icon]));
            }, setColor = function setColor(icon, params) {
                if (params.iconColor) {
                    icon.style.color = params.iconColor, icon.style.borderColor = params.iconColor;
                    for (var _i = 0, _arr = [ ".swal2-success-line-tip", ".swal2-success-line-long", ".swal2-x-mark-line-left", ".swal2-x-mark-line-right" ]; _i < _arr.length; _i++) {
                        var sel = _arr[_i];
                        setStyle(icon, sel, "backgroundColor", params.iconColor);
                    }
                    setStyle(icon, ".swal2-success-ring", "borderColor", params.iconColor);
                }
            }, iconContent = function iconContent(content) {
                return '<div class="'.concat(swalClasses["icon-content"], '">').concat(content, "</div>");
            }, renderImage = function renderImage(instance, params) {
                var image = getImage();
                if (!params.imageUrl) return hide(image);
                show(image, ""), image.setAttribute("src", params.imageUrl), image.setAttribute("alt", params.imageAlt), 
                applyNumericalStyle(image, "width", params.imageWidth), applyNumericalStyle(image, "height", params.imageHeight), 
                image.className = swalClasses.image, applyCustomClass(image, params, "image");
            }, currentSteps = [], queue = function queue(steps) {
                warnAboutDeprecation("Swal.queue()", "async/await");
                var Swal = this;
                currentSteps = steps;
                var resetAndResolve = function resetAndResolve(resolve, value) {
                    currentSteps = [], resolve(value);
                }, queueResult = [];
                return new Promise((function(resolve) {
                    !function step(i, callback) {
                        i < currentSteps.length ? (document.body.setAttribute("data-swal2-queue-step", i), 
                        Swal.fire(currentSteps[i]).then((function(result) {
                            void 0 !== result.value ? (queueResult.push(result.value), step(i + 1, callback)) : resetAndResolve(resolve, {
                                dismiss: result.dismiss
                            });
                        }))) : resetAndResolve(resolve, {
                            value: queueResult
                        });
                    }(0);
                }));
            }, getQueueStep = function getQueueStep() {
                return getContainer() && getContainer().getAttribute("data-queue-step");
            }, insertQueueStep = function insertQueueStep(step, index) {
                return index && index < currentSteps.length ? currentSteps.splice(index, 0, step) : currentSteps.push(step);
            }, deleteQueueStep = function deleteQueueStep(index) {
                void 0 !== currentSteps[index] && currentSteps.splice(index, 1);
            }, createStepElement = function createStepElement(step) {
                var stepEl = document.createElement("li");
                return addClass(stepEl, swalClasses["progress-step"]), setInnerHtml(stepEl, step), 
                stepEl;
            }, createLineElement = function createLineElement(params) {
                var lineEl = document.createElement("li");
                return addClass(lineEl, swalClasses["progress-step-line"]), params.progressStepsDistance && (lineEl.style.width = params.progressStepsDistance), 
                lineEl;
            }, renderProgressSteps = function renderProgressSteps(instance, params) {
                var progressStepsContainer = getProgressSteps();
                if (!params.progressSteps || 0 === params.progressSteps.length) return hide(progressStepsContainer);
                show(progressStepsContainer), progressStepsContainer.textContent = "";
                var currentProgressStep = parseInt(void 0 === params.currentProgressStep ? getQueueStep() : params.currentProgressStep);
                currentProgressStep >= params.progressSteps.length && warn("Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)"), 
                params.progressSteps.forEach((function(step, index) {
                    var stepEl = createStepElement(step);
                    if (progressStepsContainer.appendChild(stepEl), index === currentProgressStep && addClass(stepEl, swalClasses["active-progress-step"]), 
                    index !== params.progressSteps.length - 1) {
                        var lineEl = createLineElement(params);
                        progressStepsContainer.appendChild(lineEl);
                    }
                }));
            }, renderTitle = function renderTitle(instance, params) {
                var title = getTitle();
                toggle(title, params.title || params.titleText, "block"), params.title && parseHtmlToContainer(params.title, title), 
                params.titleText && (title.innerText = params.titleText), applyCustomClass(title, params, "title");
            }, renderHeader = function renderHeader(instance, params) {
                var header = getHeader();
                applyCustomClass(header, params, "header"), renderProgressSteps(instance, params), 
                renderIcon(instance, params), renderImage(instance, params), renderTitle(instance, params), 
                renderCloseButton(instance, params);
            }, renderPopup = function renderPopup(instance, params) {
                var container = getContainer(), popup = getPopup();
                params.toast ? (applyNumericalStyle(container, "width", params.width), popup.style.width = "100%") : applyNumericalStyle(popup, "width", params.width), 
                applyNumericalStyle(popup, "padding", params.padding), params.background && (popup.style.background = params.background), 
                hide(getValidationMessage()), addClasses(popup, params);
            }, addClasses = function addClasses(popup, params) {
                popup.className = "".concat(swalClasses.popup, " ").concat(isVisible(popup) ? params.showClass.popup : ""), 
                params.toast ? (addClass([ document.documentElement, document.body ], swalClasses["toast-shown"]), 
                addClass(popup, swalClasses.toast)) : addClass(popup, swalClasses.modal), applyCustomClass(popup, params, "popup"), 
                "string" == typeof params.customClass && addClass(popup, params.customClass), params.icon && addClass(popup, swalClasses["icon-".concat(params.icon)]);
            }, render = function render(instance, params) {
                renderPopup(instance, params), renderContainer(instance, params), renderHeader(instance, params), 
                renderContent(instance, params), renderActions(instance, params), renderFooter(instance, params), 
                "function" == typeof params.didRender ? params.didRender(getPopup()) : "function" == typeof params.onRender && params.onRender(getPopup());
            }, isVisible$1 = function isVisible$$1() {
                return isVisible(getPopup());
            }, clickConfirm = function clickConfirm() {
                return getConfirmButton() && getConfirmButton().click();
            }, clickDeny = function clickDeny() {
                return getDenyButton() && getDenyButton().click();
            }, clickCancel = function clickCancel() {
                return getCancelButton() && getCancelButton().click();
            };
            function fire() {
                for (var Swal = this, _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                return _construct(Swal, args);
            }
            function mixin(mixinParams) {
                var MixinSwal = function(_this) {
                    _inherits(MixinSwal, _this);
                    var _super = _createSuper(MixinSwal);
                    function MixinSwal() {
                        return _classCallCheck(this, MixinSwal), _super.apply(this, arguments);
                    }
                    return _createClass(MixinSwal, [ {
                        key: "_main",
                        value: function _main(params, priorityMixinParams) {
                            return _get(_getPrototypeOf(MixinSwal.prototype), "_main", this).call(this, params, _extends({}, mixinParams, priorityMixinParams));
                        }
                    } ]), MixinSwal;
                }(this);
                return MixinSwal;
            }
            var showLoading = function showLoading(buttonToReplace) {
                var popup = getPopup();
                popup || Swal.fire(), popup = getPopup();
                var actions = getActions(), loader = getLoader();
                !buttonToReplace && isVisible(getConfirmButton()) && (buttonToReplace = getConfirmButton()), 
                show(actions), buttonToReplace && (hide(buttonToReplace), loader.setAttribute("data-button-to-replace", buttonToReplace.className)), 
                loader.parentNode.insertBefore(loader, buttonToReplace), addClass([ popup, actions ], swalClasses.loading), 
                show(loader), popup.setAttribute("data-loading", !0), popup.setAttribute("aria-busy", !0), 
                popup.focus();
            }, RESTORE_FOCUS_TIMEOUT = 100, globalState = {}, focusPreviousActiveElement = function focusPreviousActiveElement() {
                globalState.previousActiveElement && globalState.previousActiveElement.focus ? (globalState.previousActiveElement.focus(), 
                globalState.previousActiveElement = null) : document.body && document.body.focus();
            }, restoreActiveElement = function restoreActiveElement(returnFocus) {
                return new Promise((function(resolve) {
                    if (!returnFocus) return resolve();
                    var x = window.scrollX, y = window.scrollY;
                    globalState.restoreFocusTimeout = setTimeout((function() {
                        focusPreviousActiveElement(), resolve();
                    }), RESTORE_FOCUS_TIMEOUT), void 0 !== x && void 0 !== y && window.scrollTo(x, y);
                }));
            }, getTimerLeft = function getTimerLeft() {
                return globalState.timeout && globalState.timeout.getTimerLeft();
            }, stopTimer = function stopTimer() {
                if (globalState.timeout) return stopTimerProgressBar(), globalState.timeout.stop();
            }, resumeTimer = function resumeTimer() {
                if (globalState.timeout) {
                    var remaining = globalState.timeout.start();
                    return animateTimerProgressBar(remaining), remaining;
                }
            }, toggleTimer = function toggleTimer() {
                var timer = globalState.timeout;
                return timer && (timer.running ? stopTimer() : resumeTimer());
            }, increaseTimer = function increaseTimer(n) {
                if (globalState.timeout) {
                    var remaining = globalState.timeout.increase(n);
                    return animateTimerProgressBar(remaining, !0), remaining;
                }
            }, isTimerRunning = function isTimerRunning() {
                return globalState.timeout && globalState.timeout.isRunning();
            }, bodyClickListenerAdded = !1, clickHandlers = {};
            function bindClickHandler() {
                clickHandlers[arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "data-swal-template"] = this, 
                bodyClickListenerAdded || (document.body.addEventListener("click", bodyClickListener), 
                bodyClickListenerAdded = !0);
            }
            var bodyClickListener = function bodyClickListener(event) {
                for (var el = event.target; el && el !== document; el = el.parentNode) for (var attr in clickHandlers) {
                    var template = el.getAttribute(attr);
                    if (template) return void clickHandlers[attr].fire({
                        template: template
                    });
                }
            }, defaultParams = {
                title: "",
                titleText: "",
                text: "",
                html: "",
                footer: "",
                icon: void 0,
                iconColor: void 0,
                iconHtml: void 0,
                template: void 0,
                toast: !1,
                animation: !0,
                showClass: {
                    popup: "swal2-show",
                    backdrop: "swal2-backdrop-show",
                    icon: "swal2-icon-show"
                },
                hideClass: {
                    popup: "swal2-hide",
                    backdrop: "swal2-backdrop-hide",
                    icon: "swal2-icon-hide"
                },
                customClass: {},
                target: "body",
                backdrop: !0,
                heightAuto: !0,
                allowOutsideClick: !0,
                allowEscapeKey: !0,
                allowEnterKey: !0,
                stopKeydownPropagation: !0,
                keydownListenerCapture: !1,
                showConfirmButton: !0,
                showDenyButton: !1,
                showCancelButton: !1,
                preConfirm: void 0,
                preDeny: void 0,
                confirmButtonText: "OK",
                confirmButtonAriaLabel: "",
                confirmButtonColor: void 0,
                denyButtonText: "No",
                denyButtonAriaLabel: "",
                denyButtonColor: void 0,
                cancelButtonText: "Cancel",
                cancelButtonAriaLabel: "",
                cancelButtonColor: void 0,
                buttonsStyling: !0,
                reverseButtons: !1,
                focusConfirm: !0,
                focusDeny: !1,
                focusCancel: !1,
                returnFocus: !0,
                showCloseButton: !1,
                closeButtonHtml: "&times;",
                closeButtonAriaLabel: "Close this dialog",
                loaderHtml: "",
                showLoaderOnConfirm: !1,
                showLoaderOnDeny: !1,
                imageUrl: void 0,
                imageWidth: void 0,
                imageHeight: void 0,
                imageAlt: "",
                timer: void 0,
                timerProgressBar: !1,
                width: void 0,
                padding: void 0,
                background: void 0,
                input: void 0,
                inputPlaceholder: "",
                inputLabel: "",
                inputValue: "",
                inputOptions: {},
                inputAutoTrim: !0,
                inputAttributes: {},
                inputValidator: void 0,
                returnInputValueOnDeny: !1,
                validationMessage: void 0,
                grow: !1,
                position: "center",
                progressSteps: [],
                currentProgressStep: void 0,
                progressStepsDistance: void 0,
                onBeforeOpen: void 0,
                onOpen: void 0,
                willOpen: void 0,
                didOpen: void 0,
                onRender: void 0,
                didRender: void 0,
                onClose: void 0,
                onAfterClose: void 0,
                willClose: void 0,
                didClose: void 0,
                onDestroy: void 0,
                didDestroy: void 0,
                scrollbarPadding: !0
            }, updatableParams = [ "allowEscapeKey", "allowOutsideClick", "background", "buttonsStyling", "cancelButtonAriaLabel", "cancelButtonColor", "cancelButtonText", "closeButtonAriaLabel", "closeButtonHtml", "confirmButtonAriaLabel", "confirmButtonColor", "confirmButtonText", "currentProgressStep", "customClass", "denyButtonAriaLabel", "denyButtonColor", "denyButtonText", "didClose", "didDestroy", "footer", "hideClass", "html", "icon", "iconColor", "iconHtml", "imageAlt", "imageHeight", "imageUrl", "imageWidth", "onAfterClose", "onClose", "onDestroy", "progressSteps", "returnFocus", "reverseButtons", "showCancelButton", "showCloseButton", "showConfirmButton", "showDenyButton", "text", "title", "titleText", "willClose" ], deprecatedParams = {
                animation: 'showClass" and "hideClass',
                onBeforeOpen: "willOpen",
                onOpen: "didOpen",
                onRender: "didRender",
                onClose: "willClose",
                onAfterClose: "didClose",
                onDestroy: "didDestroy"
            }, toastIncompatibleParams = [ "allowOutsideClick", "allowEnterKey", "backdrop", "focusConfirm", "focusDeny", "focusCancel", "returnFocus", "heightAuto", "keydownListenerCapture" ], isValidParameter = function isValidParameter(paramName) {
                return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
            }, isUpdatableParameter = function isUpdatableParameter(paramName) {
                return -1 !== updatableParams.indexOf(paramName);
            }, isDeprecatedParameter = function isDeprecatedParameter(paramName) {
                return deprecatedParams[paramName];
            }, checkIfParamIsValid = function checkIfParamIsValid(param) {
                isValidParameter(param) || warn('Unknown parameter "'.concat(param, '"'));
            }, checkIfToastParamIsValid = function checkIfToastParamIsValid(param) {
                -1 !== toastIncompatibleParams.indexOf(param) && warn('The parameter "'.concat(param, '" is incompatible with toasts'));
            }, checkIfParamIsDeprecated = function checkIfParamIsDeprecated(param) {
                isDeprecatedParameter(param) && warnAboutDeprecation(param, isDeprecatedParameter(param));
            }, showWarningsForParams = function showWarningsForParams(params) {
                for (var param in params) checkIfParamIsValid(param), params.toast && checkIfToastParamIsValid(param), 
                checkIfParamIsDeprecated(param);
            }, staticMethods = Object.freeze({
                isValidParameter: isValidParameter,
                isUpdatableParameter: isUpdatableParameter,
                isDeprecatedParameter: isDeprecatedParameter,
                argsToParams: argsToParams,
                isVisible: isVisible$1,
                clickConfirm: clickConfirm,
                clickDeny: clickDeny,
                clickCancel: clickCancel,
                getContainer: getContainer,
                getPopup: getPopup,
                getTitle: getTitle,
                getContent: getContent,
                getHtmlContainer: getHtmlContainer,
                getImage: getImage,
                getIcon: getIcon,
                getInputLabel: getInputLabel,
                getCloseButton: getCloseButton,
                getActions: getActions,
                getConfirmButton: getConfirmButton,
                getDenyButton: getDenyButton,
                getCancelButton: getCancelButton,
                getLoader: getLoader,
                getHeader: getHeader,
                getFooter: getFooter,
                getTimerProgressBar: getTimerProgressBar,
                getFocusableElements: getFocusableElements,
                getValidationMessage: getValidationMessage,
                isLoading: isLoading,
                fire: fire,
                mixin: mixin,
                queue: queue,
                getQueueStep: getQueueStep,
                insertQueueStep: insertQueueStep,
                deleteQueueStep: deleteQueueStep,
                showLoading: showLoading,
                enableLoading: showLoading,
                getTimerLeft: getTimerLeft,
                stopTimer: stopTimer,
                resumeTimer: resumeTimer,
                toggleTimer: toggleTimer,
                increaseTimer: increaseTimer,
                isTimerRunning: isTimerRunning,
                bindClickHandler: bindClickHandler
            });
            function hideLoading() {
                if (privateProps.innerParams.get(this)) {
                    var domCache = privateProps.domCache.get(this);
                    hide(domCache.loader);
                    var buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute("data-button-to-replace"));
                    buttonToReplace.length ? show(buttonToReplace[0], "inline-block") : allButtonsAreHidden() && hide(domCache.actions), 
                    removeClass([ domCache.popup, domCache.actions ], swalClasses.loading), domCache.popup.removeAttribute("aria-busy"), 
                    domCache.popup.removeAttribute("data-loading"), domCache.confirmButton.disabled = !1, 
                    domCache.denyButton.disabled = !1, domCache.cancelButton.disabled = !1;
                }
            }
            function getInput$1(instance) {
                var innerParams = privateProps.innerParams.get(instance || this), domCache = privateProps.domCache.get(instance || this);
                return domCache ? getInput(domCache.content, innerParams.input) : null;
            }
            var fixScrollbar = function fixScrollbar() {
                null === states.previousBodyPadding && document.body.scrollHeight > window.innerHeight && (states.previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right")), 
                document.body.style.paddingRight = "".concat(states.previousBodyPadding + measureScrollbar(), "px"));
            }, undoScrollbar = function undoScrollbar() {
                null !== states.previousBodyPadding && (document.body.style.paddingRight = "".concat(states.previousBodyPadding, "px"), 
                states.previousBodyPadding = null);
            }, iOSfix = function iOSfix() {
                if ((/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || "MacIntel" === navigator.platform && navigator.maxTouchPoints > 1) && !hasClass(document.body, swalClasses.iosfix)) {
                    var offset = document.body.scrollTop;
                    document.body.style.top = "".concat(-1 * offset, "px"), addClass(document.body, swalClasses.iosfix), 
                    lockBodyScroll(), addBottomPaddingForTallPopups();
                }
            }, addBottomPaddingForTallPopups = function addBottomPaddingForTallPopups() {
                if (!navigator.userAgent.match(/(CriOS|FxiOS|EdgiOS|YaBrowser|UCBrowser)/i)) {
                    var bottomPanelHeight = 44;
                    getPopup().scrollHeight > window.innerHeight - bottomPanelHeight && (getContainer().style.paddingBottom = "".concat(bottomPanelHeight, "px"));
                }
            }, lockBodyScroll = function lockBodyScroll() {
                var preventTouchMove, container = getContainer();
                container.ontouchstart = function(e) {
                    preventTouchMove = shouldPreventTouchMove(e);
                }, container.ontouchmove = function(e) {
                    preventTouchMove && (e.preventDefault(), e.stopPropagation());
                };
            }, shouldPreventTouchMove = function shouldPreventTouchMove(event) {
                var target = event.target, container = getContainer();
                return !(isStylys(event) || isZoom(event) || target !== container && (isScrollable(container) || "INPUT" === target.tagName || isScrollable(getContent()) && getContent().contains(target)));
            }, isStylys = function isStylys(event) {
                return event.touches && event.touches.length && "stylus" === event.touches[0].touchType;
            }, isZoom = function isZoom(event) {
                return event.touches && event.touches.length > 1;
            }, undoIOSfix = function undoIOSfix() {
                if (hasClass(document.body, swalClasses.iosfix)) {
                    var offset = parseInt(document.body.style.top, 10);
                    removeClass(document.body, swalClasses.iosfix), document.body.style.top = "", document.body.scrollTop = -1 * offset;
                }
            }, isIE11 = function isIE11() {
                return !!window.MSInputMethodContext && !!document.documentMode;
            }, fixVerticalPositionIE = function fixVerticalPositionIE() {
                var container = getContainer(), popup = getPopup();
                container.style.removeProperty("align-items"), popup.offsetTop < 0 && (container.style.alignItems = "flex-start");
            }, IEfix = function IEfix() {
                "undefined" != typeof window && isIE11() && (fixVerticalPositionIE(), window.addEventListener("resize", fixVerticalPositionIE));
            }, undoIEfix = function undoIEfix() {
                "undefined" != typeof window && isIE11() && window.removeEventListener("resize", fixVerticalPositionIE);
            }, setAriaHidden = function setAriaHidden() {
                toArray(document.body.children).forEach((function(el) {
                    el === getContainer() || contains(el, getContainer()) || (el.hasAttribute("aria-hidden") && el.setAttribute("data-previous-aria-hidden", el.getAttribute("aria-hidden")), 
                    el.setAttribute("aria-hidden", "true"));
                }));
            }, unsetAriaHidden = function unsetAriaHidden() {
                toArray(document.body.children).forEach((function(el) {
                    el.hasAttribute("data-previous-aria-hidden") ? (el.setAttribute("aria-hidden", el.getAttribute("data-previous-aria-hidden")), 
                    el.removeAttribute("data-previous-aria-hidden")) : el.removeAttribute("aria-hidden");
                }));
            }, privateMethods = {
                swalPromiseResolve: new WeakMap
            };
            function removePopupAndResetState(instance, container, returnFocus, didClose) {
                isToast() ? triggerDidCloseAndDispose(instance, didClose) : (restoreActiveElement(returnFocus).then((function() {
                    return triggerDidCloseAndDispose(instance, didClose);
                })), globalState.keydownTarget.removeEventListener("keydown", globalState.keydownHandler, {
                    capture: globalState.keydownListenerCapture
                }), globalState.keydownHandlerAdded = !1), container.parentNode && !document.body.getAttribute("data-swal2-queue-step") && container.parentNode.removeChild(container), 
                isModal() && (undoScrollbar(), undoIOSfix(), undoIEfix(), unsetAriaHidden()), removeBodyClasses();
            }
            function removeBodyClasses() {
                removeClass([ document.documentElement, document.body ], [ swalClasses.shown, swalClasses["height-auto"], swalClasses["no-backdrop"], swalClasses["toast-shown"] ]);
            }
            function close(resolveValue) {
                var popup = getPopup();
                if (popup) {
                    resolveValue = prepareResolveValue(resolveValue);
                    var innerParams = privateProps.innerParams.get(this);
                    if (innerParams && !hasClass(popup, innerParams.hideClass.popup)) {
                        var swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
                        removeClass(popup, innerParams.showClass.popup), addClass(popup, innerParams.hideClass.popup);
                        var backdrop = getContainer();
                        removeClass(backdrop, innerParams.showClass.backdrop), addClass(backdrop, innerParams.hideClass.backdrop), 
                        handlePopupAnimation(this, popup, innerParams), swalPromiseResolve(resolveValue);
                    }
                }
            }
            var prepareResolveValue = function prepareResolveValue(resolveValue) {
                return void 0 === resolveValue ? {
                    isConfirmed: !1,
                    isDenied: !1,
                    isDismissed: !0
                } : _extends({
                    isConfirmed: !1,
                    isDenied: !1,
                    isDismissed: !1
                }, resolveValue);
            }, handlePopupAnimation = function handlePopupAnimation(instance, popup, innerParams) {
                var container = getContainer(), animationIsSupported = animationEndEvent && hasCssAnimation(popup), onClose = innerParams.onClose, onAfterClose = innerParams.onAfterClose, willClose = innerParams.willClose, didClose = innerParams.didClose;
                runDidClose(popup, willClose, onClose), animationIsSupported ? animatePopup(instance, popup, container, innerParams.returnFocus, didClose || onAfterClose) : removePopupAndResetState(instance, container, innerParams.returnFocus, didClose || onAfterClose);
            }, runDidClose = function runDidClose(popup, willClose, onClose) {
                null !== willClose && "function" == typeof willClose ? willClose(popup) : null !== onClose && "function" == typeof onClose && onClose(popup);
            }, animatePopup = function animatePopup(instance, popup, container, returnFocus, didClose) {
                globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose), 
                popup.addEventListener(animationEndEvent, (function(e) {
                    e.target === popup && (globalState.swalCloseEventFinishedCallback(), delete globalState.swalCloseEventFinishedCallback);
                }));
            }, triggerDidCloseAndDispose = function triggerDidCloseAndDispose(instance, didClose) {
                setTimeout((function() {
                    "function" == typeof didClose && didClose(), instance._destroy();
                }));
            };
            function setButtonsDisabled(instance, buttons, disabled) {
                var domCache = privateProps.domCache.get(instance);
                buttons.forEach((function(button) {
                    domCache[button].disabled = disabled;
                }));
            }
            function setInputDisabled(input, disabled) {
                if (!input) return !1;
                if ("radio" === input.type) for (var radios = input.parentNode.parentNode.querySelectorAll("input"), i = 0; i < radios.length; i++) radios[i].disabled = disabled; else input.disabled = disabled;
            }
            function enableButtons() {
                setButtonsDisabled(this, [ "confirmButton", "denyButton", "cancelButton" ], !1);
            }
            function disableButtons() {
                setButtonsDisabled(this, [ "confirmButton", "denyButton", "cancelButton" ], !0);
            }
            function enableInput() {
                return setInputDisabled(this.getInput(), !1);
            }
            function disableInput() {
                return setInputDisabled(this.getInput(), !0);
            }
            function showValidationMessage(error) {
                var domCache = privateProps.domCache.get(this), params = privateProps.innerParams.get(this);
                setInnerHtml(domCache.validationMessage, error), domCache.validationMessage.className = swalClasses["validation-message"], 
                params.customClass && params.customClass.validationMessage && addClass(domCache.validationMessage, params.customClass.validationMessage), 
                show(domCache.validationMessage);
                var input = this.getInput();
                input && (input.setAttribute("aria-invalid", !0), input.setAttribute("aria-describedBy", swalClasses["validation-message"]), 
                focusInput(input), addClass(input, swalClasses.inputerror));
            }
            function resetValidationMessage$1() {
                var domCache = privateProps.domCache.get(this);
                domCache.validationMessage && hide(domCache.validationMessage);
                var input = this.getInput();
                input && (input.removeAttribute("aria-invalid"), input.removeAttribute("aria-describedBy"), 
                removeClass(input, swalClasses.inputerror));
            }
            function getProgressSteps$1() {
                return privateProps.domCache.get(this).progressSteps;
            }
            var Timer = function() {
                function Timer(callback, delay) {
                    _classCallCheck(this, Timer), this.callback = callback, this.remaining = delay, 
                    this.running = !1, this.start();
                }
                return _createClass(Timer, [ {
                    key: "start",
                    value: function start() {
                        return this.running || (this.running = !0, this.started = new Date, this.id = setTimeout(this.callback, this.remaining)), 
                        this.remaining;
                    }
                }, {
                    key: "stop",
                    value: function stop() {
                        return this.running && (this.running = !1, clearTimeout(this.id), this.remaining -= new Date - this.started), 
                        this.remaining;
                    }
                }, {
                    key: "increase",
                    value: function increase(n) {
                        var running = this.running;
                        return running && this.stop(), this.remaining += n, running && this.start(), this.remaining;
                    }
                }, {
                    key: "getTimerLeft",
                    value: function getTimerLeft() {
                        return this.running && (this.stop(), this.start()), this.remaining;
                    }
                }, {
                    key: "isRunning",
                    value: function isRunning() {
                        return this.running;
                    }
                } ]), Timer;
            }(), defaultInputValidators = {
                email: function email(string, validationMessage) {
                    return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid email address");
                },
                url: function url(string, validationMessage) {
                    return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid URL");
                }
            };
            function setDefaultInputValidators(params) {
                params.inputValidator || Object.keys(defaultInputValidators).forEach((function(key) {
                    params.input === key && (params.inputValidator = defaultInputValidators[key]);
                }));
            }
            function validateCustomTargetElement(params) {
                (!params.target || "string" == typeof params.target && !document.querySelector(params.target) || "string" != typeof params.target && !params.target.appendChild) && (warn('Target parameter is not valid, defaulting to "body"'), 
                params.target = "body");
            }
            function setParameters(params) {
                setDefaultInputValidators(params), params.showLoaderOnConfirm && !params.preConfirm && warn("showLoaderOnConfirm is set to true, but preConfirm is not defined.\nshowLoaderOnConfirm should be used together with preConfirm, see usage example:\nhttps://sweetalert2.github.io/#ajax-request"), 
                params.animation = callIfFunction(params.animation), validateCustomTargetElement(params), 
                "string" == typeof params.title && (params.title = params.title.split("\n").join("<br />")), 
                init(params);
            }
            var swalStringParams = [ "swal-title", "swal-html", "swal-footer" ], getTemplateParams = function getTemplateParams(params) {
                var template = "string" == typeof params.template ? document.querySelector(params.template) : params.template;
                if (!template) return {};
                var templateContent = template.content || template;
                return showWarningsForElements(templateContent), _extends(getSwalParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
            }, getSwalParams = function getSwalParams(templateContent) {
                var result = {};
                return toArray(templateContent.querySelectorAll("swal-param")).forEach((function(param) {
                    showWarningsForAttributes(param, [ "name", "value" ]);
                    var paramName = param.getAttribute("name"), value = param.getAttribute("value");
                    "boolean" == typeof defaultParams[paramName] && "false" === value && (value = !1), 
                    "object" === _typeof(defaultParams[paramName]) && (value = JSON.parse(value)), result[paramName] = value;
                })), result;
            }, getSwalButtons = function getSwalButtons(templateContent) {
                var result = {};
                return toArray(templateContent.querySelectorAll("swal-button")).forEach((function(button) {
                    showWarningsForAttributes(button, [ "type", "color", "aria-label" ]);
                    var type = button.getAttribute("type");
                    result["".concat(type, "ButtonText")] = button.innerHTML, result["show".concat(capitalizeFirstLetter(type), "Button")] = !0, 
                    button.hasAttribute("color") && (result["".concat(type, "ButtonColor")] = button.getAttribute("color")), 
                    button.hasAttribute("aria-label") && (result["".concat(type, "ButtonAriaLabel")] = button.getAttribute("aria-label"));
                })), result;
            }, getSwalImage = function getSwalImage(templateContent) {
                var result = {}, image = templateContent.querySelector("swal-image");
                return image && (showWarningsForAttributes(image, [ "src", "width", "height", "alt" ]), 
                image.hasAttribute("src") && (result.imageUrl = image.getAttribute("src")), image.hasAttribute("width") && (result.imageWidth = image.getAttribute("width")), 
                image.hasAttribute("height") && (result.imageHeight = image.getAttribute("height")), 
                image.hasAttribute("alt") && (result.imageAlt = image.getAttribute("alt"))), result;
            }, getSwalIcon = function getSwalIcon(templateContent) {
                var result = {}, icon = templateContent.querySelector("swal-icon");
                return icon && (showWarningsForAttributes(icon, [ "type", "color" ]), icon.hasAttribute("type") && (result.icon = icon.getAttribute("type")), 
                icon.hasAttribute("color") && (result.iconColor = icon.getAttribute("color")), result.iconHtml = icon.innerHTML), 
                result;
            }, getSwalInput = function getSwalInput(templateContent) {
                var result = {}, input = templateContent.querySelector("swal-input");
                input && (showWarningsForAttributes(input, [ "type", "label", "placeholder", "value" ]), 
                result.input = input.getAttribute("type") || "text", input.hasAttribute("label") && (result.inputLabel = input.getAttribute("label")), 
                input.hasAttribute("placeholder") && (result.inputPlaceholder = input.getAttribute("placeholder")), 
                input.hasAttribute("value") && (result.inputValue = input.getAttribute("value")));
                var inputOptions = templateContent.querySelectorAll("swal-input-option");
                return inputOptions.length && (result.inputOptions = {}, toArray(inputOptions).forEach((function(option) {
                    showWarningsForAttributes(option, [ "value" ]);
                    var optionValue = option.getAttribute("value"), optionName = option.innerHTML;
                    result.inputOptions[optionValue] = optionName;
                }))), result;
            }, getSwalStringParams = function getSwalStringParams(templateContent, paramNames) {
                var result = {};
                for (var i in paramNames) {
                    var paramName = paramNames[i], tag = templateContent.querySelector(paramName);
                    tag && (showWarningsForAttributes(tag, []), result[paramName.replace(/^swal-/, "")] = tag.innerHTML.trim());
                }
                return result;
            }, showWarningsForElements = function showWarningsForElements(template) {
                var allowedElements = swalStringParams.concat([ "swal-param", "swal-button", "swal-image", "swal-icon", "swal-input", "swal-input-option" ]);
                toArray(template.querySelectorAll("*")).forEach((function(el) {
                    if (el.parentNode === template) {
                        var tagName = el.tagName.toLowerCase();
                        -1 === allowedElements.indexOf(tagName) && warn("Unrecognized element <".concat(tagName, ">"));
                    }
                }));
            }, showWarningsForAttributes = function showWarningsForAttributes(el, allowedAttributes) {
                toArray(el.attributes).forEach((function(attribute) {
                    -1 === allowedAttributes.indexOf(attribute.name) && warn([ 'Unrecognized attribute "'.concat(attribute.name, '" on <').concat(el.tagName.toLowerCase(), ">."), "".concat(allowedAttributes.length ? "Allowed attributes are: ".concat(allowedAttributes.join(", ")) : "To set the value, use HTML within the element.") ]);
                }));
            }, SHOW_CLASS_TIMEOUT = 10, openPopup = function openPopup(params) {
                var container = getContainer(), popup = getPopup();
                "function" == typeof params.willOpen ? params.willOpen(popup) : "function" == typeof params.onBeforeOpen && params.onBeforeOpen(popup);
                var initialBodyOverflow = window.getComputedStyle(document.body).overflowY;
                addClasses$1(container, popup, params), setTimeout((function() {
                    setScrollingVisibility(container, popup);
                }), SHOW_CLASS_TIMEOUT), isModal() && (fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow), 
                setAriaHidden()), isToast() || globalState.previousActiveElement || (globalState.previousActiveElement = document.activeElement), 
                runDidOpen(popup, params), removeClass(container, swalClasses["no-transition"]);
            }, runDidOpen = function runDidOpen(popup, params) {
                "function" == typeof params.didOpen ? setTimeout((function() {
                    return params.didOpen(popup);
                })) : "function" == typeof params.onOpen && setTimeout((function() {
                    return params.onOpen(popup);
                }));
            }, swalOpenAnimationFinished = function swalOpenAnimationFinished(event) {
                var popup = getPopup();
                if (event.target === popup) {
                    var container = getContainer();
                    popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished), container.style.overflowY = "auto";
                }
            }, setScrollingVisibility = function setScrollingVisibility(container, popup) {
                animationEndEvent && hasCssAnimation(popup) ? (container.style.overflowY = "hidden", 
                popup.addEventListener(animationEndEvent, swalOpenAnimationFinished)) : container.style.overflowY = "auto";
            }, fixScrollContainer = function fixScrollContainer(container, scrollbarPadding, initialBodyOverflow) {
                iOSfix(), IEfix(), scrollbarPadding && "hidden" !== initialBodyOverflow && fixScrollbar(), 
                setTimeout((function() {
                    container.scrollTop = 0;
                }));
            }, addClasses$1 = function addClasses(container, popup, params) {
                addClass(container, params.showClass.backdrop), popup.style.setProperty("opacity", "0", "important"), 
                show(popup), setTimeout((function() {
                    addClass(popup, params.showClass.popup), popup.style.removeProperty("opacity");
                }), SHOW_CLASS_TIMEOUT), addClass([ document.documentElement, document.body ], swalClasses.shown), 
                params.heightAuto && params.backdrop && !params.toast && addClass([ document.documentElement, document.body ], swalClasses["height-auto"]);
            }, handleInputOptionsAndValue = function handleInputOptionsAndValue(instance, params) {
                "select" === params.input || "radio" === params.input ? handleInputOptions(instance, params) : -1 !== [ "text", "email", "number", "tel", "textarea" ].indexOf(params.input) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue)) && handleInputValue(instance, params);
            }, getInputValue = function getInputValue(instance, innerParams) {
                var input = instance.getInput();
                if (!input) return null;
                switch (innerParams.input) {
                  case "checkbox":
                    return getCheckboxValue(input);

                  case "radio":
                    return getRadioValue(input);

                  case "file":
                    return getFileValue(input);

                  default:
                    return innerParams.inputAutoTrim ? input.value.trim() : input.value;
                }
            }, getCheckboxValue = function getCheckboxValue(input) {
                return input.checked ? 1 : 0;
            }, getRadioValue = function getRadioValue(input) {
                return input.checked ? input.value : null;
            }, getFileValue = function getFileValue(input) {
                return input.files.length ? null !== input.getAttribute("multiple") ? input.files : input.files[0] : null;
            }, handleInputOptions = function handleInputOptions(instance, params) {
                var content = getContent(), processInputOptions = function processInputOptions(inputOptions) {
                    return populateInputOptions[params.input](content, formatInputOptions(inputOptions), params);
                };
                hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions) ? (showLoading(getConfirmButton()), 
                asPromise(params.inputOptions).then((function(inputOptions) {
                    instance.hideLoading(), processInputOptions(inputOptions);
                }))) : "object" === _typeof(params.inputOptions) ? processInputOptions(params.inputOptions) : error("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(_typeof(params.inputOptions)));
            }, handleInputValue = function handleInputValue(instance, params) {
                var input = instance.getInput();
                hide(input), asPromise(params.inputValue).then((function(inputValue) {
                    input.value = "number" === params.input ? parseFloat(inputValue) || 0 : "".concat(inputValue), 
                    show(input), input.focus(), instance.hideLoading();
                })).catch((function(err) {
                    error("Error in inputValue promise: ".concat(err)), input.value = "", show(input), 
                    input.focus(), instance.hideLoading();
                }));
            }, populateInputOptions = {
                select: function select(content, inputOptions, params) {
                    var select = getChildByClass(content, swalClasses.select), renderOption = function renderOption(parent, optionLabel, optionValue) {
                        var option = document.createElement("option");
                        option.value = optionValue, setInnerHtml(option, optionLabel), option.selected = isSelected(optionValue, params.inputValue), 
                        parent.appendChild(option);
                    };
                    inputOptions.forEach((function(inputOption) {
                        var optionValue = inputOption[0], optionLabel = inputOption[1];
                        if (Array.isArray(optionLabel)) {
                            var optgroup = document.createElement("optgroup");
                            optgroup.label = optionValue, optgroup.disabled = !1, select.appendChild(optgroup), 
                            optionLabel.forEach((function(o) {
                                return renderOption(optgroup, o[1], o[0]);
                            }));
                        } else renderOption(select, optionLabel, optionValue);
                    })), select.focus();
                },
                radio: function radio(content, inputOptions, params) {
                    var radio = getChildByClass(content, swalClasses.radio);
                    inputOptions.forEach((function(inputOption) {
                        var radioValue = inputOption[0], radioLabel = inputOption[1], radioInput = document.createElement("input"), radioLabelElement = document.createElement("label");
                        radioInput.type = "radio", radioInput.name = swalClasses.radio, radioInput.value = radioValue, 
                        isSelected(radioValue, params.inputValue) && (radioInput.checked = !0);
                        var label = document.createElement("span");
                        setInnerHtml(label, radioLabel), label.className = swalClasses.label, radioLabelElement.appendChild(radioInput), 
                        radioLabelElement.appendChild(label), radio.appendChild(radioLabelElement);
                    }));
                    var radios = radio.querySelectorAll("input");
                    radios.length && radios[0].focus();
                }
            }, formatInputOptions = function formatInputOptions(inputOptions) {
                var result = [];
                return "undefined" != typeof Map && inputOptions instanceof Map ? inputOptions.forEach((function(value, key) {
                    var valueFormatted = value;
                    "object" === _typeof(valueFormatted) && (valueFormatted = formatInputOptions(valueFormatted)), 
                    result.push([ key, valueFormatted ]);
                })) : Object.keys(inputOptions).forEach((function(key) {
                    var valueFormatted = inputOptions[key];
                    "object" === _typeof(valueFormatted) && (valueFormatted = formatInputOptions(valueFormatted)), 
                    result.push([ key, valueFormatted ]);
                })), result;
            }, isSelected = function isSelected(optionValue, inputValue) {
                return inputValue && inputValue.toString() === optionValue.toString();
            }, handleConfirmButtonClick = function handleConfirmButtonClick(instance, innerParams) {
                instance.disableButtons(), innerParams.input ? handleConfirmOrDenyWithInput(instance, innerParams, "confirm") : confirm(instance, innerParams, !0);
            }, handleDenyButtonClick = function handleDenyButtonClick(instance, innerParams) {
                instance.disableButtons(), innerParams.returnInputValueOnDeny ? handleConfirmOrDenyWithInput(instance, innerParams, "deny") : deny(instance, innerParams, !1);
            }, handleCancelButtonClick = function handleCancelButtonClick(instance, dismissWith) {
                instance.disableButtons(), dismissWith(DismissReason.cancel);
            }, handleConfirmOrDenyWithInput = function handleConfirmOrDenyWithInput(instance, innerParams, type) {
                var inputValue = getInputValue(instance, innerParams);
                innerParams.inputValidator ? handleInputValidator(instance, innerParams, inputValue) : instance.getInput().checkValidity() ? "deny" === type ? deny(instance, innerParams, inputValue) : confirm(instance, innerParams, inputValue) : (instance.enableButtons(), 
                instance.showValidationMessage(innerParams.validationMessage));
            }, handleInputValidator = function handleInputValidator(instance, innerParams, inputValue) {
                instance.disableInput(), Promise.resolve().then((function() {
                    return asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage));
                })).then((function(validationMessage) {
                    instance.enableButtons(), instance.enableInput(), validationMessage ? instance.showValidationMessage(validationMessage) : confirm(instance, innerParams, inputValue);
                }));
            }, deny = function deny(instance, innerParams, value) {
                innerParams.showLoaderOnDeny && showLoading(getDenyButton()), innerParams.preDeny ? Promise.resolve().then((function() {
                    return asPromise(innerParams.preDeny(value, innerParams.validationMessage));
                })).then((function(preDenyValue) {
                    !1 === preDenyValue ? instance.hideLoading() : instance.closePopup({
                        isDenied: !0,
                        value: void 0 === preDenyValue ? value : preDenyValue
                    });
                })) : instance.closePopup({
                    isDenied: !0,
                    value: value
                });
            }, succeedWith = function succeedWith(instance, value) {
                instance.closePopup({
                    isConfirmed: !0,
                    value: value
                });
            }, confirm = function confirm(instance, innerParams, value) {
                innerParams.showLoaderOnConfirm && showLoading(), innerParams.preConfirm ? (instance.resetValidationMessage(), 
                Promise.resolve().then((function() {
                    return asPromise(innerParams.preConfirm(value, innerParams.validationMessage));
                })).then((function(preConfirmValue) {
                    isVisible(getValidationMessage()) || !1 === preConfirmValue ? instance.hideLoading() : succeedWith(instance, void 0 === preConfirmValue ? value : preConfirmValue);
                }))) : succeedWith(instance, value);
            }, addKeydownHandler = function addKeydownHandler(instance, globalState, innerParams, dismissWith) {
                globalState.keydownTarget && globalState.keydownHandlerAdded && (globalState.keydownTarget.removeEventListener("keydown", globalState.keydownHandler, {
                    capture: globalState.keydownListenerCapture
                }), globalState.keydownHandlerAdded = !1), innerParams.toast || (globalState.keydownHandler = function(e) {
                    return keydownHandler(instance, e, dismissWith);
                }, globalState.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup(), 
                globalState.keydownListenerCapture = innerParams.keydownListenerCapture, globalState.keydownTarget.addEventListener("keydown", globalState.keydownHandler, {
                    capture: globalState.keydownListenerCapture
                }), globalState.keydownHandlerAdded = !0);
            }, setFocus = function setFocus(innerParams, index, increment) {
                var focusableElements = getFocusableElements();
                if (focusableElements.length) return (index += increment) === focusableElements.length ? index = 0 : -1 === index && (index = focusableElements.length - 1), 
                focusableElements[index].focus();
                getPopup().focus();
            }, arrowKeysNextButton = [ "ArrowRight", "ArrowDown", "Right", "Down" ], arrowKeysPreviousButton = [ "ArrowLeft", "ArrowUp", "Left", "Up" ], escKeys = [ "Escape", "Esc" ], keydownHandler = function keydownHandler(instance, e, dismissWith) {
                var innerParams = privateProps.innerParams.get(instance);
                innerParams && (innerParams.stopKeydownPropagation && e.stopPropagation(), "Enter" === e.key ? handleEnter(instance, e, innerParams) : "Tab" === e.key ? handleTab(e, innerParams) : -1 !== [].concat(arrowKeysNextButton, arrowKeysPreviousButton).indexOf(e.key) ? handleArrows(e.key) : -1 !== escKeys.indexOf(e.key) && handleEsc(e, innerParams, dismissWith));
            }, handleEnter = function handleEnter(instance, e, innerParams) {
                if (!e.isComposing && e.target && instance.getInput() && e.target.outerHTML === instance.getInput().outerHTML) {
                    if (-1 !== [ "textarea", "file" ].indexOf(innerParams.input)) return;
                    clickConfirm(), e.preventDefault();
                }
            }, handleTab = function handleTab(e, innerParams) {
                for (var targetElement = e.target, focusableElements = getFocusableElements(), btnIndex = -1, i = 0; i < focusableElements.length; i++) if (targetElement === focusableElements[i]) {
                    btnIndex = i;
                    break;
                }
                e.shiftKey ? setFocus(innerParams, btnIndex, -1) : setFocus(innerParams, btnIndex, 1), 
                e.stopPropagation(), e.preventDefault();
            }, handleArrows = function handleArrows(key) {
                if (-1 !== [ getConfirmButton(), getDenyButton(), getCancelButton() ].indexOf(document.activeElement)) {
                    var sibling = -1 !== arrowKeysNextButton.indexOf(key) ? "nextElementSibling" : "previousElementSibling", buttonToFocus = document.activeElement[sibling];
                    buttonToFocus && buttonToFocus.focus();
                }
            }, handleEsc = function handleEsc(e, innerParams, dismissWith) {
                callIfFunction(innerParams.allowEscapeKey) && (e.preventDefault(), dismissWith(DismissReason.esc));
            }, handlePopupClick = function handlePopupClick(instance, domCache, dismissWith) {
                privateProps.innerParams.get(instance).toast ? handleToastClick(instance, domCache, dismissWith) : (handleModalMousedown(domCache), 
                handleContainerMousedown(domCache), handleModalClick(instance, domCache, dismissWith));
            }, handleToastClick = function handleToastClick(instance, domCache, dismissWith) {
                domCache.popup.onclick = function() {
                    var innerParams = privateProps.innerParams.get(instance);
                    innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton || innerParams.timer || innerParams.input || dismissWith(DismissReason.close);
                };
            }, ignoreOutsideClick = !1, handleModalMousedown = function handleModalMousedown(domCache) {
                domCache.popup.onmousedown = function() {
                    domCache.container.onmouseup = function(e) {
                        domCache.container.onmouseup = void 0, e.target === domCache.container && (ignoreOutsideClick = !0);
                    };
                };
            }, handleContainerMousedown = function handleContainerMousedown(domCache) {
                domCache.container.onmousedown = function() {
                    domCache.popup.onmouseup = function(e) {
                        domCache.popup.onmouseup = void 0, (e.target === domCache.popup || domCache.popup.contains(e.target)) && (ignoreOutsideClick = !0);
                    };
                };
            }, handleModalClick = function handleModalClick(instance, domCache, dismissWith) {
                domCache.container.onclick = function(e) {
                    var innerParams = privateProps.innerParams.get(instance);
                    ignoreOutsideClick ? ignoreOutsideClick = !1 : e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick) && dismissWith(DismissReason.backdrop);
                };
            };
            function _main(userParams) {
                var mixinParams = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                showWarningsForParams(_extends({}, mixinParams, userParams)), globalState.currentInstance && globalState.currentInstance._destroy(), 
                globalState.currentInstance = this;
                var innerParams = prepareParams(userParams, mixinParams);
                setParameters(innerParams), Object.freeze(innerParams), globalState.timeout && (globalState.timeout.stop(), 
                delete globalState.timeout), clearTimeout(globalState.restoreFocusTimeout);
                var domCache = populateDomCache(this);
                return render(this, innerParams), privateProps.innerParams.set(this, innerParams), 
                swalPromise(this, domCache, innerParams);
            }
            var prepareParams = function prepareParams(userParams, mixinParams) {
                var templateParams = getTemplateParams(userParams), params = _extends({}, defaultParams, mixinParams, templateParams, userParams);
                return params.showClass = _extends({}, defaultParams.showClass, params.showClass), 
                params.hideClass = _extends({}, defaultParams.hideClass, params.hideClass), !1 === userParams.animation && (params.showClass = {
                    popup: "swal2-noanimation",
                    backdrop: "swal2-noanimation"
                }, params.hideClass = {}), params;
            }, swalPromise = function swalPromise(instance, domCache, innerParams) {
                return new Promise((function(resolve) {
                    var dismissWith = function dismissWith(dismiss) {
                        instance.closePopup({
                            isDismissed: !0,
                            dismiss: dismiss
                        });
                    };
                    privateMethods.swalPromiseResolve.set(instance, resolve), domCache.confirmButton.onclick = function() {
                        return handleConfirmButtonClick(instance, innerParams);
                    }, domCache.denyButton.onclick = function() {
                        return handleDenyButtonClick(instance, innerParams);
                    }, domCache.cancelButton.onclick = function() {
                        return handleCancelButtonClick(instance, dismissWith);
                    }, domCache.closeButton.onclick = function() {
                        return dismissWith(DismissReason.close);
                    }, handlePopupClick(instance, domCache, dismissWith), addKeydownHandler(instance, globalState, innerParams, dismissWith), 
                    handleInputOptionsAndValue(instance, innerParams), openPopup(innerParams), setupTimer(globalState, innerParams, dismissWith), 
                    initFocus(domCache, innerParams), setTimeout((function() {
                        domCache.container.scrollTop = 0;
                    }));
                }));
            }, populateDomCache = function populateDomCache(instance) {
                var domCache = {
                    popup: getPopup(),
                    container: getContainer(),
                    content: getContent(),
                    actions: getActions(),
                    confirmButton: getConfirmButton(),
                    denyButton: getDenyButton(),
                    cancelButton: getCancelButton(),
                    loader: getLoader(),
                    closeButton: getCloseButton(),
                    validationMessage: getValidationMessage(),
                    progressSteps: getProgressSteps()
                };
                return privateProps.domCache.set(instance, domCache), domCache;
            }, setupTimer = function setupTimer(globalState$$1, innerParams, dismissWith) {
                var timerProgressBar = getTimerProgressBar();
                hide(timerProgressBar), innerParams.timer && (globalState$$1.timeout = new Timer((function() {
                    dismissWith("timer"), delete globalState$$1.timeout;
                }), innerParams.timer), innerParams.timerProgressBar && (show(timerProgressBar), 
                setTimeout((function() {
                    globalState$$1.timeout && globalState$$1.timeout.running && animateTimerProgressBar(innerParams.timer);
                }))));
            }, initFocus = function initFocus(domCache, innerParams) {
                if (!innerParams.toast) return callIfFunction(innerParams.allowEnterKey) ? void (focusButton(domCache, innerParams) || setFocus(innerParams, -1, 1)) : blurActiveElement();
            }, focusButton = function focusButton(domCache, innerParams) {
                return innerParams.focusDeny && isVisible(domCache.denyButton) ? (domCache.denyButton.focus(), 
                !0) : innerParams.focusCancel && isVisible(domCache.cancelButton) ? (domCache.cancelButton.focus(), 
                !0) : !(!innerParams.focusConfirm || !isVisible(domCache.confirmButton) || (domCache.confirmButton.focus(), 
                0));
            }, blurActiveElement = function blurActiveElement() {
                document.activeElement && "function" == typeof document.activeElement.blur && document.activeElement.blur();
            };
            function update(params) {
                var popup = getPopup(), innerParams = privateProps.innerParams.get(this);
                if (!popup || hasClass(popup, innerParams.hideClass.popup)) return warn("You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.");
                var validUpdatableParams = {};
                Object.keys(params).forEach((function(param) {
                    Swal.isUpdatableParameter(param) ? validUpdatableParams[param] = params[param] : warn('Invalid parameter to update: "'.concat(param, '". Updatable params are listed here: https://github.com/sweetalert2/sweetalert2/blob/master/src/utils/params.js\n\nIf you think this parameter should be updatable, request it here: https://github.com/sweetalert2/sweetalert2/issues/new?template=02_feature_request.md'));
                }));
                var updatedParams = _extends({}, innerParams, validUpdatableParams);
                render(this, updatedParams), privateProps.innerParams.set(this, updatedParams), 
                Object.defineProperties(this, {
                    params: {
                        value: _extends({}, this.params, params),
                        writable: !1,
                        enumerable: !0
                    }
                });
            }
            function _destroy() {
                var domCache = privateProps.domCache.get(this), innerParams = privateProps.innerParams.get(this);
                innerParams && (domCache.popup && globalState.swalCloseEventFinishedCallback && (globalState.swalCloseEventFinishedCallback(), 
                delete globalState.swalCloseEventFinishedCallback), globalState.deferDisposalTimer && (clearTimeout(globalState.deferDisposalTimer), 
                delete globalState.deferDisposalTimer), runDidDestroy(innerParams), disposeSwal(this));
            }
            var currentInstance, runDidDestroy = function runDidDestroy(innerParams) {
                "function" == typeof innerParams.didDestroy ? innerParams.didDestroy() : "function" == typeof innerParams.onDestroy && innerParams.onDestroy();
            }, disposeSwal = function disposeSwal(instance) {
                delete instance.params, delete globalState.keydownHandler, delete globalState.keydownTarget, 
                unsetWeakMaps(privateProps), unsetWeakMaps(privateMethods);
            }, unsetWeakMaps = function unsetWeakMaps(obj) {
                for (var i in obj) obj[i] = new WeakMap;
            }, instanceMethods = Object.freeze({
                hideLoading: hideLoading,
                disableLoading: hideLoading,
                getInput: getInput$1,
                close: close,
                closePopup: close,
                closeModal: close,
                closeToast: close,
                enableButtons: enableButtons,
                disableButtons: disableButtons,
                enableInput: enableInput,
                disableInput: disableInput,
                showValidationMessage: showValidationMessage,
                resetValidationMessage: resetValidationMessage$1,
                getProgressSteps: getProgressSteps$1,
                _main: _main,
                update: update,
                _destroy: _destroy
            }), SweetAlert = function() {
                function SweetAlert() {
                    if (_classCallCheck(this, SweetAlert), "undefined" != typeof window) {
                        "undefined" == typeof Promise && error("This package requires a Promise library, please include a shim to enable it in this browser (See: https://github.com/sweetalert2/sweetalert2/wiki/Migration-from-SweetAlert-to-SweetAlert2#1-ie-support)"), 
                        currentInstance = this;
                        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                        var outerParams = Object.freeze(this.constructor.argsToParams(args));
                        Object.defineProperties(this, {
                            params: {
                                value: outerParams,
                                writable: !1,
                                enumerable: !0,
                                configurable: !0
                            }
                        });
                        var promise = this._main(this.params);
                        privateProps.promise.set(this, promise);
                    }
                }
                return _createClass(SweetAlert, [ {
                    key: "then",
                    value: function then(onFulfilled) {
                        return privateProps.promise.get(this).then(onFulfilled);
                    }
                }, {
                    key: "finally",
                    value: function _finally(onFinally) {
                        return privateProps.promise.get(this).finally(onFinally);
                    }
                } ]), SweetAlert;
            }();
            _extends(SweetAlert.prototype, instanceMethods), _extends(SweetAlert, staticMethods), 
            Object.keys(instanceMethods).forEach((function(key) {
                SweetAlert[key] = function() {
                    var _currentInstance;
                    if (currentInstance) return (_currentInstance = currentInstance)[key].apply(_currentInstance, arguments);
                };
            })), SweetAlert.DismissReason = DismissReason, SweetAlert.version = "10.16.9";
            var Swal = SweetAlert;
            return Swal.default = Swal, Swal;
        }(), void 0 !== this && this.Sweetalert2 && (this.swal = this.sweetAlert = this.Swal = this.SweetAlert = this.Sweetalert2), 
        "undefined" != typeof document && function(e, t) {
            var n = e.createElement("style");
            if (e.getElementsByTagName("head")[0].appendChild(n), n.styleSheet) n.styleSheet.disabled || (n.styleSheet.cssText = t); else try {
                n.innerHTML = t;
            } catch (e) {
                n.innerText = t;
            }
        }(document, '.swal2-popup.swal2-toast{flex-direction:column;align-items:stretch;width:auto;padding:1.25em;overflow-y:hidden;background:#fff;box-shadow:0 0 .625em #d9d9d9}.swal2-popup.swal2-toast .swal2-header{flex-direction:row;padding:0}.swal2-popup.swal2-toast .swal2-title{flex-grow:1;justify-content:flex-start;margin:0 .625em;font-size:1em}.swal2-popup.swal2-toast .swal2-loading{justify-content:center}.swal2-popup.swal2-toast .swal2-input{height:2em;margin:.3125em auto;font-size:1em}.swal2-popup.swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{position:static;width:.8em;height:.8em;line-height:.8}.swal2-popup.swal2-toast .swal2-content{justify-content:flex-start;margin:0 .625em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-html-container{padding:.625em 0 0}.swal2-popup.swal2-toast .swal2-html-container:empty{padding:0}.swal2-popup.swal2-toast .swal2-icon{width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:700}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{font-size:.25em}}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{flex:1;flex-basis:auto!important;align-self:stretch;width:auto;height:2.2em;height:auto;margin:0 .3125em;margin-top:.3125em;padding:0}.swal2-popup.swal2-toast .swal2-styled{margin:.125em .3125em;padding:.3125em .625em;font-size:1em}.swal2-popup.swal2-toast .swal2-styled:focus{box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(100,150,200,.5)}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.8em;left:-.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-toast-animate-success-line-tip .75s;animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-toast-animate-success-line-long .75s;animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{-webkit-animation:swal2-toast-show .5s;animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{-webkit-animation:swal2-toast-hide .1s forwards;animation:swal2-toast-hide .1s forwards}.swal2-container{display:flex;position:fixed;z-index:1060;top:0;right:0;bottom:0;left:0;flex-direction:row;align-items:center;justify-content:center;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}.swal2-container.swal2-backdrop-show,.swal2-container.swal2-noanimation{background:rgba(0,0,0,.4)}.swal2-container.swal2-backdrop-hide{background:0 0!important}.swal2-container.swal2-top{align-items:flex-start}.swal2-container.swal2-top-left,.swal2-container.swal2-top-start{align-items:flex-start;justify-content:flex-start}.swal2-container.swal2-top-end,.swal2-container.swal2-top-right{align-items:flex-start;justify-content:flex-end}.swal2-container.swal2-center{align-items:center}.swal2-container.swal2-center-left,.swal2-container.swal2-center-start{align-items:center;justify-content:flex-start}.swal2-container.swal2-center-end,.swal2-container.swal2-center-right{align-items:center;justify-content:flex-end}.swal2-container.swal2-bottom{align-items:flex-end}.swal2-container.swal2-bottom-left,.swal2-container.swal2-bottom-start{align-items:flex-end;justify-content:flex-start}.swal2-container.swal2-bottom-end,.swal2-container.swal2-bottom-right{align-items:flex-end;justify-content:flex-end}.swal2-container.swal2-bottom-end>:first-child,.swal2-container.swal2-bottom-left>:first-child,.swal2-container.swal2-bottom-right>:first-child,.swal2-container.swal2-bottom-start>:first-child,.swal2-container.swal2-bottom>:first-child{margin-top:auto}.swal2-container.swal2-grow-fullscreen>.swal2-modal{display:flex!important;flex:1;align-self:stretch;justify-content:center}.swal2-container.swal2-grow-row>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container.swal2-grow-column{flex:1;flex-direction:column}.swal2-container.swal2-grow-column.swal2-bottom,.swal2-container.swal2-grow-column.swal2-center,.swal2-container.swal2-grow-column.swal2-top{align-items:center}.swal2-container.swal2-grow-column.swal2-bottom-left,.swal2-container.swal2-grow-column.swal2-bottom-start,.swal2-container.swal2-grow-column.swal2-center-left,.swal2-container.swal2-grow-column.swal2-center-start,.swal2-container.swal2-grow-column.swal2-top-left,.swal2-container.swal2-grow-column.swal2-top-start{align-items:flex-start}.swal2-container.swal2-grow-column.swal2-bottom-end,.swal2-container.swal2-grow-column.swal2-bottom-right,.swal2-container.swal2-grow-column.swal2-center-end,.swal2-container.swal2-grow-column.swal2-center-right,.swal2-container.swal2-grow-column.swal2-top-end,.swal2-container.swal2-grow-column.swal2-top-right{align-items:flex-end}.swal2-container.swal2-grow-column>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container.swal2-no-transition{transition:none!important}.swal2-container:not(.swal2-top):not(.swal2-top-start):not(.swal2-top-end):not(.swal2-top-left):not(.swal2-top-right):not(.swal2-center-start):not(.swal2-center-end):not(.swal2-center-left):not(.swal2-center-right):not(.swal2-bottom):not(.swal2-bottom-start):not(.swal2-bottom-end):not(.swal2-bottom-left):not(.swal2-bottom-right):not(.swal2-grow-fullscreen)>.swal2-modal{margin:auto}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-container .swal2-modal{margin:0!important}}.swal2-popup{display:none;position:relative;box-sizing:border-box;flex-direction:column;justify-content:center;width:32em;max-width:100%;padding:1.25em;border:none;border-radius:5px;background:#fff;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:0}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-header{display:flex;flex-direction:column;align-items:center;padding:0 1.8em}.swal2-title{position:relative;max-width:100%;margin:0 0 .4em;padding:0;color:#595959;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:100%;margin:1.25em auto 0;padding:0}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 transparent #2778c4 transparent}.swal2-styled{margin:.3125em;padding:.625em 1.1em;box-shadow:none;font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#2778c4;color:#fff;font-size:1em}.swal2-styled.swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#d14529;color:#fff;font-size:1em}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#757575;color:#fff;font-size:1em}.swal2-styled:focus{outline:0;box-shadow:0 0 0 3px rgba(100,150,200,.5)}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1.25em 0 0;padding:1em 0 0;border-top:1px solid #eee;color:#545454;font-size:1em}.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;height:.25em;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}.swal2-timer-progress-bar{width:100%;height:.25em;background:rgba(0,0,0,.2)}.swal2-image{max-width:100%;margin:1.25em auto}.swal2-close{position:absolute;z-index:2;top:0;right:0;align-items:center;justify-content:center;width:1.2em;height:1.2em;padding:0;overflow:hidden;transition:color .1s ease-out;border:none;border-radius:5px;background:0 0;color:#ccc;font-family:serif;font-size:2.5em;line-height:1.2;cursor:pointer}.swal2-close:hover{transform:none;background:0 0;color:#f27474}.swal2-close:focus{outline:0;box-shadow:inset 0 0 0 3px rgba(100,150,200,.5)}.swal2-close::-moz-focus-inner{border:0}.swal2-content{z-index:1;justify-content:center;margin:0;padding:0 1.6em;color:#545454;font-size:1.125em;font-weight:400;line-height:normal;text-align:center;word-wrap:break-word}.swal2-checkbox,.swal2-file,.swal2-input,.swal2-radio,.swal2-select,.swal2-textarea{margin:1em auto}.swal2-file,.swal2-input,.swal2-textarea{box-sizing:border-box;width:100%;transition:border-color .3s,box-shadow .3s;border:1px solid #d9d9d9;border-radius:.1875em;background:inherit;box-shadow:inset 0 1px 1px rgba(0,0,0,.06);color:inherit;font-size:1.125em}.swal2-file.swal2-inputerror,.swal2-input.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-file:focus,.swal2-input:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:0;box-shadow:0 0 0 3px rgba(100,150,200,.5)}.swal2-file::-moz-placeholder,.swal2-input::-moz-placeholder,.swal2-textarea::-moz-placeholder{color:#ccc}.swal2-file:-ms-input-placeholder,.swal2-input:-ms-input-placeholder,.swal2-textarea:-ms-input-placeholder{color:#ccc}.swal2-file::placeholder,.swal2-input::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em auto;background:#fff}.swal2-range input{width:80%}.swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-input[type=number]{max-width:10em}.swal2-file{background:inherit;font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:inherit;color:inherit;font-size:1.125em}.swal2-checkbox,.swal2-radio{align-items:center;justify-content:center;background:#fff;color:inherit}.swal2-checkbox label,.swal2-radio label{margin:0 .6em;font-size:1.125em}.swal2-checkbox input,.swal2-radio input{flex-shrink:0;margin:0 .4em}.swal2-input-label{display:flex;justify-content:center;margin:1em auto}.swal2-validation-message{align-items:center;justify-content:center;margin:0 -2.7em;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}.swal2-validation-message::before{content:"!";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:1.25em auto 1.875em;border:.25em solid transparent;border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474;color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}.swal2-icon.swal2-error.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-error.swal2-icon-show .swal2-x-mark{-webkit-animation:swal2-animate-error-x-mark .5s;animation:swal2-animate-error-x-mark .5s}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-success{border-color:#a5dc86;color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-.25em;left:-.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-animate-success-line-tip .75s;animation:swal2-animate-success-line-tip .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-animate-success-line-long .75s;animation:swal2-animate-success-line-long .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-circular-line-right{-webkit-animation:swal2-rotate-success-circular-line 4.25s ease-in;animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:0 0 1.25em;padding:0;background:inherit;font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}[class^=swal2]{-webkit-tap-highlight-color:transparent}.swal2-show{-webkit-animation:swal2-show .3s;animation:swal2-show .3s}.swal2-hide{-webkit-animation:swal2-hide .15s forwards;animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{right:auto;left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}@supports (-ms-accelerator:true){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@-webkit-keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@-webkit-keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@-webkit-keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@-webkit-keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@-webkit-keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@-webkit-keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@-webkit-keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@-webkit-keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@-webkit-keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@-webkit-keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@-webkit-keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@-webkit-keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-container{top:auto;right:auto;bottom:auto;left:auto;max-width:calc(100% - .625em * 2);background-color:transparent!important}body.swal2-no-backdrop .swal2-container>.swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}body.swal2-no-backdrop .swal2-container.swal2-top{top:0;left:50%;transform:translateX(-50%)}body.swal2-no-backdrop .swal2-container.swal2-top-left,body.swal2-no-backdrop .swal2-container.swal2-top-start{top:0;left:0}body.swal2-no-backdrop .swal2-container.swal2-top-end,body.swal2-no-backdrop .swal2-container.swal2-top-right{top:0;right:0}body.swal2-no-backdrop .swal2-container.swal2-center{top:50%;left:50%;transform:translate(-50%,-50%)}body.swal2-no-backdrop .swal2-container.swal2-center-left,body.swal2-no-backdrop .swal2-container.swal2-center-start{top:50%;left:0;transform:translateY(-50%)}body.swal2-no-backdrop .swal2-container.swal2-center-end,body.swal2-no-backdrop .swal2-container.swal2-center-right{top:50%;right:0;transform:translateY(-50%)}body.swal2-no-backdrop .swal2-container.swal2-bottom{bottom:0;left:50%;transform:translateX(-50%)}body.swal2-no-backdrop .swal2-container.swal2-bottom-left,body.swal2-no-backdrop .swal2-container.swal2-bottom-start{bottom:0;left:0}body.swal2-no-backdrop .swal2-container.swal2-bottom-end,body.swal2-no-backdrop .swal2-container.swal2-bottom-right{right:0;bottom:0}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static!important}}body.swal2-toast-shown .swal2-container{background-color:transparent}body.swal2-toast-shown .swal2-container.swal2-top{top:0;right:auto;bottom:auto;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{top:0;right:0;bottom:auto;left:auto}body.swal2-toast-shown .swal2-container.swal2-top-left,body.swal2-toast-shown .swal2-container.swal2-top-start{top:0;right:auto;bottom:auto;left:0}body.swal2-toast-shown .swal2-container.swal2-center-left,body.swal2-toast-shown .swal2-container.swal2-center-start{top:50%;right:auto;bottom:auto;left:0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{top:50%;right:auto;bottom:auto;left:50%;transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{top:50%;right:0;bottom:auto;left:auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-left,body.swal2-toast-shown .swal2-container.swal2-bottom-start{top:auto;right:auto;bottom:0;left:0}body.swal2-toast-shown .swal2-container.swal2-bottom{top:auto;right:auto;bottom:0;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{top:auto;right:0;bottom:0;left:auto}');
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.BrowerType = void 0, function(BrowerType) {
            BrowerType[BrowerType.Edge = 0] = "Edge", BrowerType[BrowerType.Edg = 1] = "Edg", 
            BrowerType[BrowerType.Chrome = 2] = "Chrome", BrowerType[BrowerType.Firefox = 3] = "Firefox", 
            BrowerType[BrowerType.Safiri = 4] = "Safiri", BrowerType[BrowerType.Se360 = 5] = "Se360", 
            BrowerType[BrowerType.Ie2345 = 6] = "Ie2345", BrowerType[BrowerType.Baidu = 7] = "Baidu", 
            BrowerType[BrowerType.Liebao = 8] = "Liebao", BrowerType[BrowerType.UC = 9] = "UC", 
            BrowerType[BrowerType.QQ = 10] = "QQ", BrowerType[BrowerType.Sogou = 11] = "Sogou", 
            BrowerType[BrowerType.Opera = 12] = "Opera", BrowerType[BrowerType.Maxthon = 13] = "Maxthon";
        }(exports.BrowerType || (exports.BrowerType = {}));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.PanRoutes = void 0;
        var SiteEnum_1 = __webpack_require__(1), PanType_1 = __webpack_require__(22);
        exports.PanRoutes = [ {
            type: PanType_1.PanTypeEnum.\u767e\u5ea6\u4e91\u76d8,
            SiteEnum: SiteEnum_1.SiteEnum.BDY,
            contextRule: /((?:https?:\/\/)?(?:yun|pan).baidu.com\/(?:s\/(\w|-)*|share\/\S*\d)(#\w{4})?)(.{10})/g,
            idRule: /\/s\/[0-9](([0-9A-Za-z-]*))/i,
            linkRule: /((?:https?:\/\/)?(?:yun|pan).baidu.com\/(?:s\/(\w|-)*|share\/\S*\d)(#\w{4})?)/i,
            pwdRule: /(?<=\s*(\u5bc6|\u63d0\u53d6|\u8bbf\u95ee|\u5bc6|\u63d0\u53d6|\u8a2a\u554f|key|password|pwd)[\u7801\u78bc]?[\uff1a:]?\s*)[A-Za-z0-9]{3,8}/i,
            urlRule: /(?:https?:\/\/)?(?:yun|pan).baidu.com\/share\/init\?surl=([a-zA-Z0-9-]*)/i,
            inputSelector: "#accessCode",
            buttonSelecto: "#submitBtn",
            urlId: "surl"
        } ];
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.PanTypeEnum = void 0, function(PanTypeEnum) {
            PanTypeEnum[PanTypeEnum["\u767e\u5ea6\u4e91\u76d8"] = 0] = "\u767e\u5ea6\u4e91\u76d8", 
            PanTypeEnum[PanTypeEnum.LanZou = 1] = "LanZou";
        }(exports.PanTypeEnum || (exports.PanTypeEnum = {}));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.FlowInfo = exports.ParseFile = exports.ParseFileInfo = exports.CodeInfo = exports.PanShare = exports.PanRule = exports.PanInfo = void 0;
        var PanInfo = function PanInfo() {};
        exports.PanInfo = PanInfo;
        var PanRule = function PanRule() {};
        exports.PanRule = PanRule;
        var PanShare = function PanShare() {};
        exports.PanShare = PanShare;
        var CodeInfo = function CodeInfo() {
            this.available = !0;
        };
        exports.CodeInfo = CodeInfo;
        var ParseFileInfo = function ParseFileInfo() {};
        exports.ParseFileInfo = ParseFileInfo;
        var ParseFile = function ParseFile() {};
        exports.ParseFile = ParseFile;
        var FlowInfo = function FlowInfo() {};
        exports.FlowInfo = FlowInfo;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var __extends = this && this.__extends || (extendStatics = function(d, b) {
            return extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            }, extendStatics(d, b);
        }, function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __);
        }), extendStatics, __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
            return new (P || (P = Promise))((function(resolve, reject) {
                function fulfilled(value) {
                    try {
                        step(generator.next(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function rejected(value) {
                    try {
                        step(generator.throw(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function step(result) {
                    result.done ? resolve(result.value) : function adopt(value) {
                        return value instanceof P ? value : new P((function(resolve) {
                            resolve(value);
                        }));
                    }(result.value).then(fulfilled, rejected);
                }
                step((generator = generator.apply(thisArg, _arguments || [])).next());
            }));
        }, __generator = this && this.__generator || function(thisArg, body) {
            var f, y, t, g, _ = {
                label: 0,
                sent: function() {
                    if (1 & t[0]) throw t[1];
                    return t[1];
                },
                trys: [],
                ops: []
            };
            return g = {
                next: verb(0),
                throw: verb(1),
                return: verb(2)
            }, "function" == typeof Symbol && (g[Symbol.iterator] = function() {
                return this;
            }), g;
            function verb(n) {
                return function(v) {
                    return function step(op) {
                        if (f) throw new TypeError("Generator is already executing.");
                        for (;_; ) try {
                            if (f = 1, y && (t = 2 & op[0] ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 
                            0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                            switch (y = 0, t && (op = [ 2 & op[0], t.value ]), op[0]) {
                              case 0:
                              case 1:
                                t = op;
                                break;

                              case 4:
                                return _.label++, {
                                    value: op[1],
                                    done: !1
                                };

                              case 5:
                                _.label++, y = op[1], op = [ 0 ];
                                continue;

                              case 7:
                                op = _.ops.pop(), _.trys.pop();
                                continue;

                              default:
                                if (!(t = _.trys, (t = t.length > 0 && t[t.length - 1]) || 6 !== op[0] && 2 !== op[0])) {
                                    _ = 0;
                                    continue;
                                }
                                if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
                                    _.label = op[1];
                                    break;
                                }
                                if (6 === op[0] && _.label < t[1]) {
                                    _.label = t[1], t = op;
                                    break;
                                }
                                if (t && _.label < t[2]) {
                                    _.label = t[2], _.ops.push(op);
                                    break;
                                }
                                t[2] && _.ops.pop(), _.trys.pop();
                                continue;
                            }
                            op = body.call(thisArg, _);
                        } catch (e) {
                            op = [ 6, e ], y = 0;
                        } finally {
                            f = t = 0;
                        }
                        if (5 & op[0]) throw op[1];
                        return {
                            value: op[0] ? op[1] : void 0,
                            done: !0
                        };
                    }([ n, v ]);
                };
            }
        }, __importDefault = this && this.__importDefault || function(mod) {
            return mod && mod.__esModule ? mod : {
                default: mod
            };
        };
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.PanParse = void 0;
        var AppBase_1 = __webpack_require__(3), SiteEnum_1 = __webpack_require__(1), Ele_1 = __webpack_require__(39), EventEnum_1 = __webpack_require__(25), Alert_1 = __webpack_require__(7), Logger_1 = __webpack_require__(4), PanInfo_1 = __webpack_require__(23), BaiduRoutes_1 = __webpack_require__(40), Common_1 = __webpack_require__(26), Config_1 = __webpack_require__(5), clipboard_1 = __importDefault(__webpack_require__(41)), Core_1 = __webpack_require__(2), Http_1 = __webpack_require__(10), Constant_1 = __webpack_require__(8);
        __webpack_require__(42);
        var PanParse = function(_super) {
            function PanParse() {
                var _this = null !== _super && _super.apply(this, arguments) || this;
                return _this.appName = "\u7f51\u76d8\u89e3\u6790", _this.rules = new Map([ [ SiteEnum_1.SiteEnum.BD_DETAIL_OLD, /[pan|yun].baidu.com\/disk\/home/i ], [ SiteEnum_1.SiteEnum.BD_DETAIL_Share, /[pan|yun].baidu.com\/s\//i ], [ SiteEnum_1.SiteEnum.BD_DETAIL_NEW, /[pan|yun].baidu.com\/disk\/main/i ] ]), 
                _this.homeProcess = {
                    selector: ".tcuLAu",
                    btnGenerate: PanParse.getHomeBtn,
                    handleEvent: PanParse.initDownFile
                }, _this.mainProcess = {
                    selector: ".nd-file-list-toolbar__group",
                    btnGenerate: PanParse.getMainBtn,
                    handleEvent: PanParse.initDownFileNew
                }, _this.shareProcess = {
                    selector: ".x-button-box",
                    btnGenerate: PanParse.getHomeBtn,
                    handleEvent: PanParse.initDownFile
                }, _this;
            }
            return __extends(PanParse, _super), PanParse.prototype.loader = function() {
                Core_1.Core.addStyleUrl("//cdn.jsdelivr.net/npm/mdui@1.0.1/dist/css/mdui.min.css"), 
                Core_1.Core.addScriptUrl("//cdn.jsdelivr.net/npm/mdui@1.0.1/dist/js/mdui.min.js");
            }, PanParse.prototype.run = function() {
                switch (PanParse._site = this.site, this.site) {
                  case SiteEnum_1.SiteEnum.BD_DETAIL_OLD:
                    this.handle = this.homeProcess;
                    break;

                  case SiteEnum_1.SiteEnum.BD_DETAIL_NEW:
                    this.handle = this.mainProcess;
                    break;

                  case SiteEnum_1.SiteEnum.BD_DETAIL_Share:
                    this.handle = this.shareProcess;
                }
                var that = this;
                Core_1.Core.autoLazyload((function() {
                    return $(that.handle.selector).length > 0;
                }), (function() {
                    that.detailRender();
                }), .5);
            }, PanParse.prototype.detailRender = function() {
                var _this = this, btnUpload = $(this.handle.selector);
                if (btnUpload) {
                    var e = this.handle.btnGenerate();
                    btnUpload[0].prepend(e), Ele_1.Ele.bindEvent(e, EventEnum_1.EventEnum.click, (function() {
                        _this.handle.handleEvent();
                    }));
                }
            }, PanParse.getHomeBtn = function() {
                var btn = {
                    id: "btnPanToolsDown",
                    text: "\u7f51\u76d8\u5de5\u5177\u7bb1",
                    title: "\u7f51\u76d8\u5de5\u5177\u7bb1-\u76f4\u94fe",
                    html: function() {
                        return '<span class="g-button-right">             \n<em class="icon icon-download" style="color:#ffffff" title="' + btn.title + '"></em>     \n<span class="text" style="width: auto;">' + btn.title + "</span></span>";
                    }
                };
                return Ele_1.Ele.Span([ Ele_1.Ele.A(btn.id, btn.title, btn.html(), "margin: 0px;", "g-button g-button-red-large") ], "g-dropdown-button");
            }, PanParse.getMainBtn = function() {
                var btn = {
                    id: "btnPanToolsDown",
                    text: "\u7f51\u76d8\u5de5\u5177\u7bb1",
                    title: "\u7f51\u76d8\u5de5\u5177\u7bb1-\u76f4\u94fe",
                    html: function() {
                        return '<span><i class="iconfont inline-block-v-middle nd-file-list-toolbar__action-item-icon icon-download"></i><span class="inline-block-v-middle nd-file-list-toolbar-action-item-text">' + btn.title + "</span></span>";
                    }
                };
                return Ele_1.Ele.Button("PanToolsDown", "u-btn nd-common-btn nd-file-list-toolbar-action-item is-need-left-sep u-btn--normal u-btn--medium u-btn--default is-has-icon", [ btn.html() ]);
            }, PanParse.initDownFileNew = function() {
                Alert_1.Alert.info("\u6682\u4e0d\u652f\u6301\u65b0\u7248\u9875\u9762,\u8bf7\u8fd4\u56de\u65e7\u7248\u5217\u8868\u4f7f\u7528\u89e3\u6790");
            }, PanParse.initDownFile = function() {
                var fileList = PanParse.getSelectedFileListHome();
                if (Logger_1.Logger.debug(fileList), null != fileList && 0 != (null == fileList ? void 0 : fileList.length)) if (PanParse.isMultipleFile(fileList)) Alert_1.Alert.info("\u6682\u4e0d\u652f\u6301\u591a\u6587\u4ef6\u6216\u6587\u4ef6\u5939\u89e3\u6790!", 3, "error"); else {
                    var file = fileList[0], currentCode = Config_1.Config.get(PanParse.panCode, ""), currentKey = Config_1.Config.get(PanParse.panKey, ""), flowInfo = Config_1.Config.get(PanParse.flowInfoKey), box = '\n<div id="pantools-top-outside">\n    <div id="pantools-top-left-fileinfo">\n        <p>\u6587\u4ef6\u540d:<b>' + file.server_filename + "</b></p>\n        <p>md5:<b>" + file.md5 + "</b></p>\n        <p>\u6587\u4ef6\u5927\u5c0f:<b>" + Common_1.Common.humanSize(file.size) + "</b></p>\n        <p>\u4e0a\u4f20\u65f6\u95f4:<b>" + new Date(1e3 * file.server_ctime).toLocaleString() + "</b></p>        \n        <p>\u5361\u5bc6:<b>" + (null != currentKey ? currentKey : "\u5173\u6ce8\u53f3\u4fa7\u516c\u4f17\u53f7\u56de\u590d\u3010777\u3011\u83b7\u53d6\u5361\u5bc6") + '</b><button id="pantools-key-setting" class="mdui-btn mdui-color-indigo-700 mdui-ripple" style="float: right;margin-right: 10px">\u914d\u7f6e\u5361\u5bc6</button></p>\n        <p>\u6d41\u91cf:<b id="pantools-flow-left">' + (flowInfo ? "\u603b\u8ba1:" + Core_1.Core.humanSize(flowInfo.TSize) + ",\u5df2\u7528:" + Core_1.Core.humanSize(flowInfo.USize) + ",\u5269\u4f59:" + Core_1.Core.humanSize(flowInfo.LSize) : "\u7a7a") + '</b></p>\n        <p>\n            <button id="pantools-parser" class="mdui-btn mdui-color-indigo-700 mdui-ripple">\u89e3\u6790\u83b7\u53d6\u76f4\u94fe</button>\n            <a href="javascript:;" id="pantools-parser-url" style="display: none" class="mdui-btn mdui-color-indigo-700 mdui-ripple">\u70b9\u51fb\u590d\u5236\u76f4\u94fe</a>\n            <button id="pantools-ua-copy" data-clipboard-text="\u8bf7\u5148\u89e3\u6790\u6587\u4ef6\u5728\u590d\u5236UA" class="mdui-btn mdui-color-indigo-700 mdui-ripple">\u590d\u5236UA</button>\n            <button id="pantools-btn-setting" class="mdui-btn mdui-color-indigo-700 mdui-ripple">\u811a\u672c\u914d\u7f6e</button>\n            <button id="pantools-btn-aria" style="display: none" class="mdui-btn mdui-color-indigo-700 mdui-ripple">\u53d1\u9001\u5230Aria</button>\n        </p>\n        <p><b style="color: red">\u89e3\u6790\u540e\u4f7f\u7528IDM\u6216\u5176\u4ed6\u4e0b\u8f7d\u5668\u65f6,\u8bf7\u4f7f\u7528\u4e0a\u65b9\u6309\u94ae\u624b\u52a8\u590d\u5236UA\u4fe1\u606f</b></p>\n    </div>\n    <div id="pantools-top-right-qrcode">\n        <div>  \n            <img src="' + PanParse.qrcode + '" alt="\u7f51\u76d8\u5de5\u5177\u7bb1">\n        </div>\n        <span>\u5173\u6ce8\u516c\u4f17\u53f7\u56de\u590d\u3010777\u3011\u83b7\u5f97\u6d41\u91cf\u5361\u5bc6</span>\n    </div>\n</div>\n<div id="pantools-bottom-outside">\n<div>\n    <button id="pantools-btn-help" class="mdui-btn mdui-color-indigo-700 mdui-ripple">\u4f7f\u7528\u5e2e\u52a9</button>\n    <button id="pantools-btn-install" class="mdui-btn mdui-color-indigo-700 mdui-ripple">\u811a\u672c\u5b89\u88c5</button>\n    <button id="pantools-btn-joinus" class="mdui-btn mdui-color-indigo-700 mdui-ripple">\u5efa\u8bae\u53cd\u9988</button>\n</div>\n<div>\n    <span>\u72b6\u6001:</span>\n    <span id="pantools-status">\u51c6\u5907\u5b8c\u6210</span>\n</div>\n</div>\n        ';
                    Alert_1.Alert.html("", box, "auto"), $("#pantools-btn-setting").on("click", (function() {
                        Core_1.Core.open("http://settings.shuma.ink");
                    })), $("#pantools-key-setting").on("click", (function() {
                        PanParse.setKey(currentKey);
                    })), $("#pantools-code-setting").on("click", (function() {
                        PanParse.setCode(currentCode);
                    })), $("#pantools-parser").on("click", (function() {
                        PanParse.parser(file);
                    })), new clipboard_1.default("#pantools-parser-url").on("success", (function(e) {
                        PanParse.log("\u76f4\u94fe\u4e0b\u8f7d\u5730\u5740\u590d\u5236\u6210\u529f\uff01");
                    })), new clipboard_1.default("#pantools-ua-copy").on("success", (function() {
                        PanParse.log("UA\u4fe1\u606f\u590d\u5236\u6210\u529f!");
                    })), $("#pantools-btn-help").on("click", (function() {
                        Core_1.Core.open("https://wiki.shuma.ink/zh-cn/faq.html");
                    })), $("#pantools-btn-install").on("click", (function() {
                        Core_1.Core.open("https://wiki.shuma.ink/zh-cn/tools.html");
                    })), $("#pantools-btn-joinus").on("click", (function() {
                        Core_1.Core.open("http://settings.shuma.ink/jump.html");
                    }));
                } else Alert_1.Alert.info("\u8fd8\u6ca1\u9009\u6587\u4ef6\u54e6~", 3, "warning");
            }, PanParse.log = function(msg) {
                $("#pantools-status").text(msg);
            }, PanParse.parser = function(file) {
                var _this = this;
                Config_1.Config.get(PanParse.panKey, "");
                PanParse.log("\u51c6\u5907\u89e3\u6790\u94fe\u63a5"), this.shareFile(file).then((function(pan) {
                    return __awaiter(_this, void 0, void 0, (function() {
                        return __generator(this, (function(_a) {
                            return pan ? (void 0, (PanParse._site == SiteEnum_1.SiteEnum.BD_DETAIL_Share ? new Promise((function(resolve, reject) {
                                BaiduRoutes_1.BaiduRoutes.getSign(PanParse.getSurl()).then((function(e) {
                                    if (0 != e.errno) return Alert_1.Alert.html("\u89e3\u6790\u5931\u8d25", '\u63d0\u793a\uff1a\u8bf7\u5c06\u6587\u4ef6<span class="tag-danger">[\u4fdd\u5b58\u5230\u7f51\u76d8]</span>\ud83d\udc49\u5728<span class="tag-danger">[\u6211\u7684\u7f51\u76d8]</span>\u4e2d\u4e0b\u8f7d\uff01'), 
                                    void reject();
                                    resolve(BaiduRoutes_1.BaiduRoutes.pcsQueryV2(e.data.sign, e.data.timestamp, [ file.fs_id ]));
                                }));
                            })) : BaiduRoutes_1.BaiduRoutes.pcsQuery([ file.fs_id ])).then((function(res) {
                                if (res) {
                                    var paninfo = res.list[0];
                                    PanParse.getParseUrl(null == paninfo ? void 0 : paninfo.dlink, pan).then((function(panFile) {
                                        0 == panFile.error ? (PanParse.log("\u89e3\u6790\u5b8c\u6210"), PanParse.setUrl(panFile.dlink), 
                                        PanParse.setUserAgent(panFile.ua), PanParse.setAria2(panFile.dlink, file.server_filename, panFile.ua)) : Alert_1.Alert.html("\u89e3\u6790\u5931\u8d25", panFile.msg).then((function() {
                                            PanParse.initDownFile();
                                        })), PanParse._codeQuery();
                                    })).catch((function(res) {
                                        Logger_1.Logger.debug(res), res ? PanParse.log("\u89e3\u6790\u5931\u8d25,\u8bf7\u91cd\u8bd5") : PanParse.log("\u8bf7\u6c42\u8d85\u65f6,\u8bf7\u91cd\u8bd5");
                                    }));
                                } else Logger_1.Logger.debug(res), PanParse.log("\u89e3\u6790\u5931\u8d25,\u8bf7\u91cd\u8bd5");
                            }))) : PanParse.log("\u672a\u77e5\u9519\u8bef"), [ 2 ];
                        }));
                    }));
                })).catch((function(res) {
                    res ? PanParse.log("\u89e3\u6790\u5931\u8d25,\u8bf7\u91cd\u8bd5") : PanParse.log("\u8bf7\u6c42\u8d85\u65f6,\u8bf7\u91cd\u8bd5");
                }));
            }, PanParse.setUrl = function(url) {
                $("#pantools-parser").hide(), $("#pantools-parser-url").attr("data-clipboard-text", url).show();
            }, PanParse.setAria2 = function(fileUrl, fileName, userAgent) {
                $("#pantools-btn-aria").show(), $("#pantools-btn-aria").click((function() {
                    PanParse.sentToAria(fileUrl, fileName, userAgent);
                }));
            }, PanParse.setUserAgent = function(userAgent) {
                "netdisk;shuma" !== userAgent && ($("#uainfo").attr("data-clipboard-text", userAgent), 
                $("#pantools-ua-copy").attr("data-clipboard-text", userAgent));
            }, PanParse.getParseUrl = function(dLink, panInfo) {
                return __awaiter(this, void 0, void 0, (function() {
                    var key, cacheKey, panParseInfo, panRes;
                    return __generator(this, (function(_a) {
                        switch (_a.label) {
                          case 0:
                            return key = Config_1.Config.get(PanParse.panKey, ""), cacheKey = panInfo.id + "-PanParse-Cache", 
                            (panParseInfo = Config_1.Config.get(cacheKey, !1)) ? [ 3, 2 ] : [ 4, BaiduRoutes_1.BaiduRoutes.parserPcsUrl(dLink, key, panInfo) ];

                          case 1:
                            panRes = _a.sent(), panParseInfo = panRes, 0 == panRes.error && Config_1.Config.set(cacheKey, panRes, 3600), 
                            _a.label = 2;

                          case 2:
                            return [ 2, panParseInfo ];
                        }
                    }));
                }));
            }, PanParse._codeQuery = function() {
                return __awaiter(this, void 0, void 0, (function() {
                    var currentKey, flowInfo, leftDom;
                    return __generator(this, (function(_a) {
                        switch (_a.label) {
                          case 0:
                            return (currentKey = Config_1.Config.get(PanParse.panKey, "")) ? [ 4, BaiduRoutes_1.BaiduRoutes.codeQuery(currentKey) ] : [ 3, 2 ];

                          case 1:
                            0 == (flowInfo = _a.sent()).error && (Config_1.Config.set(PanParse.flowInfoKey, flowInfo), 
                            (leftDom = $("#pantools-flow-left")).length && leftDom.text("\u6d41\u91cf\u603b\u8ba1:" + Core_1.Core.humanSize(flowInfo.TSize) + ",\u5df2\u7528\u6d41\u91cf:" + Core_1.Core.humanSize(flowInfo.USize) + ",\u5269\u4f59\u6d41\u91cf:" + Core_1.Core.humanSize(flowInfo.LSize))), 
                            _a.label = 2;

                          case 2:
                            return [ 2 ];
                        }
                    }));
                }));
            }, PanParse.setKey = function(code) {
                Alert_1.Alert.input("\u8bf7\u8f93\u5165\u5361\u5bc6", code ? String(code) : "").then((function(res) {
                    if (res.isConfirmed && res.value) {
                        Logger_1.Logger.info("\u5f97\u5230\u5361\u5bc6:" + res.value), Config_1.Config.set(PanParse.panKey, res.value);
                        Alert_1.Alert.loading("\u5361\u5bc6\u67e5\u8be2\u4e2d");
                        BaiduRoutes_1.BaiduRoutes.codeQuery(res.value).then((function(res) {
                            0 == res.error ? res.LSize < 1 ? Alert_1.Alert.confirm("\u5f53\u524d\u5361\u5bc6\u4f59\u91cf\u4e0d\u8db3,\u662f\u5426\u786e\u5b9a\u4f7f\u7528\uff1f", "\u5c31\u7528\u8fd9\u4e2a", "\u8fd8\u662f\u7b97\u4e86").then((function(result) {
                                result.isConfirmed ? (Config_1.Config.set(PanParse.flowInfoKey, res), PanParse.initDownFile()) : PanParse.setKey(code);
                            })) : (Config_1.Config.set(PanParse.flowInfoKey, res), PanParse.initDownFile()) : Alert_1.Alert.html("\u67e5\u8be2\u5931\u8d25", res.msg).then((function() {
                                PanParse.setKey(code);
                            }));
                        }));
                    } else PanParse.initDownFile();
                }));
            }, PanParse.setCode = function(code) {
                Alert_1.Alert.input("\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801", code ? String(code) : "").then((function(res) {
                    res.isConfirmed && res.value && (Logger_1.Logger.info("\u5f97\u5230\u9a8c\u8bc1\u7801:" + res.value), 
                    Config_1.Config.set(PanParse.panCode, res.value)), PanParse.initDownFile();
                }));
            }, PanParse.sentToAria = function(fileUrl, fileName, userAgent) {
                return __awaiter(this, void 0, void 0, (function() {
                    var ariaConfig, _ariaConfig, ariaData;
                    return __generator(this, (function(_a) {
                        return ariaConfig = Config_1.Config.get(Constant_1.Constant.AriaConfig, {
                            rpcUrl: "",
                            rpcToken: "",
                            rpcDic: ""
                        }), "" != (_ariaConfig = ariaConfig).rpcDic && "" != _ariaConfig.rpcUrl || PanParse.log("Aria2\u4e0b\u8f7d\u5668\u914d\u7f6e\u5c1a\u672a\u5b8c\u6210,\u8bf7\u5148\u914d\u7f6eAria2\u4e0b\u8f7d\u5668\u4fe1\u606f"), 
                        ariaData = {
                            jsonrpc: "2.0",
                            id: "1629360475902",
                            method: "aria2.addUri",
                            params: [ "token:" + ariaConfig.rpcToken, [ "" + fileUrl ], {
                                dir: "" + ariaConfig.rpcDic,
                                out: "" + fileName,
                                "user-agent": "" + userAgent,
                                "max-connection-per-server": "4",
                                split: "4",
                                "piece-length": "1M"
                            } ]
                        }, Http_1.Http.post(_ariaConfig.rpcUrl, ariaData, "json").then((function(res) {
                            Logger_1.Logger.debug(res), PanParse.log("\u53d1\u9001\u6210\u529f\uff01");
                        })).catch((function() {
                            PanParse.log("\u53d1\u9001\u81f3Aria2\u65f6\u53d1\u751f\u672a\u77e5\u9519\u8bef\uff0c\u8bf7\u91cd\u8bd5\uff01");
                        })), [ 2 ];
                    }));
                }));
            }, PanParse.shareFile = function(file) {
                var _a;
                return __awaiter(this, void 0, void 0, (function() {
                    var storeKey, panInfo, bdstoken, share, e_1, msg;
                    return __generator(this, (function(_b) {
                        switch (_b.label) {
                          case 0:
                            if (storeKey = "pan_share_" + file.fs_id, PanParse.log("\u67e5\u8be2\u672c\u5730\u7f13\u5b58\u6570\u636e"), 
                            panInfo = Config_1.Config.get(storeKey, void 0)) return PanParse.log("\u67e5\u8be2\u5230\u7f13\u5b58\u6570\u636e,\u5f00\u59cb\u89e3\u6790\u94fe\u63a5"), 
                            null === (_a = panInfo) || void 0 === _a || (_a.id = file.fs_id.toString()), [ 2, panInfo ];
                            if (PanParse.log("\u672a\u67e5\u8be2\u5230\u7f13\u5b58\u6570\u636e,\u5f00\u59cb\u91cd\u65b0\u751f\u6210\u5206\u4eab\u6570\u636e"), 
                            PanParse.lock) return [ 2 ];
                            PanParse.lock = !0, bdstoken = unsafeWindow.locals.get("bdstoken"), (panInfo = new PanInfo_1.PanInfo).pwd = Common_1.Common.randStr(), 
                            panInfo.id = file.fs_id.toString(), _b.label = 1;

                          case 1:
                            return _b.trys.push([ 1, 3, 4, 5 ]), [ 4, BaiduRoutes_1.BaiduRoutes.shareFile(file.fs_id, bdstoken, panInfo.pwd) ];

                          case 2:
                            return share = _b.sent(), [ 3, 5 ];

                          case 3:
                            return e_1 = _b.sent(), Logger_1.Logger.error(e_1), [ 3, 5 ];

                          case 4:
                            return Logger_1.Logger.debug(share), PanParse.lock = !1, [ 7 ];

                          case 5:
                            if (0 == share.errno) return PanParse.log("\u521b\u5efa\u4e34\u65f6\u5206\u4eab\u94fe\u63a5\u6210\u529f,\u51c6\u5907\u5199\u5165\u672c\u5730\u7f13\u5b58"), 
                            panInfo.link = share.link, Config_1.Config.set(storeKey, panInfo, 64800), PanParse.log("\u672c\u5730\u7f13\u5b58\u5199\u5165\u5b8c\u6210,\u5f00\u59cb\u8fdb\u884c\u89e3\u6790"), 
                            [ 2, panInfo ];
                            switch (msg = "", share.errno) {
                              case 110:
                                msg = "\u60a8\u4eca\u5929\u5206\u4eab\u592a\u591a\u4e86\uff0c24\u5c0f\u65f6\u540e\u518d\u8bd5\u5427\uff01";
                                break;

                              case 115:
                                msg = "\u767e\u5ea6\u8bf4\uff1a\u8be5\u6587\u4ef6\u7981\u6b62\u5206\u4eab\uff01\uff1a";
                                break;

                              case -6:
                                msg = "\u8bf7\u91cd\u65b0\u767b\u5f55\uff01\uff1a";
                                break;

                              default:
                                return msg = "\u5206\u4eab\u6587\u4ef6\u5931\u8d25\uff0c\u5bfc\u81f4\u65e0\u6cd5\u83b7\u53d6\u76f4\u94fe\u4e0b\u8f7d\u5730\u5740\uff0c\u8bf7\u91cd\u8bd5\uff01", 
                                [ 2, panInfo ];
                            }
                            return msg += "[" + share.errno + "]", Alert_1.Alert.html("\u53d1\u751f\u9519\u8bef!", msg), 
                            [ 2, !1 ];
                        }
                    }));
                }));
            }, PanParse.isMultipleFile = function(files) {
                return (null == files ? void 0 : files.length) > 1 || !files.every((function(item) {
                    return 1 != item.isdir;
                }));
            }, PanParse.getSelectedFileListHome = function() {
                return eval("require('system-core:context/context.js').instanceForSystem.list.getSelected();");
            }, PanParse.getPcs = function() {
                return __awaiter(this, void 0, void 0, (function() {
                    return __generator(this, (function(_a) {
                        return {
                            shareType: "secret",
                            sign: PanParse._getLocals("sign"),
                            timestamp: PanParse._getLocals("timestamp"),
                            bdstoken: PanParse._getLocals("bdstoken"),
                            channel: "chunlei",
                            clienttype: 0,
                            web: 1,
                            app_id: 250528,
                            encrypt: 0,
                            product: "share",
                            logid: PanParse.getLogid(),
                            primaryid: PanParse._getLocals("shareid"),
                            uk: PanParse._getLocals("share_uk"),
                            extra: PanParse._getExtra(),
                            surl: PanParse._getSurl()
                        }, [ 2 ];
                    }));
                }));
            }, PanParse.getLogid = function() {
                return window.btoa(Common_1.Common.getCookie("BAIDUID"));
            }, PanParse._getLocals = function(key) {
                var _a;
                return null !== (_a = unsafeWindow.locals.get(key)) && void 0 !== _a ? _a : "";
            }, PanParse._getExtra = function() {
                return '{"sekey":"' + decodeURIComponent(Common_1.Common.getCookie("BDCLND")) + '"}';
            }, PanParse._getSurl = function() {
                var reg = /(?<=s\/|surl=)([a-zA-Z0-9_-]+)/g;
                return reg.test(location.href) ? location.href.match(reg)[0] : "";
            }, PanParse.getSurl = function() {
                var reg = /(?<=s\/|surl=)([a-zA-Z0-9_-]+)/g;
                return reg.test(location.href) ? Core_1.Core.currentUrl().match(reg)[0] : "";
            }, PanParse.panKey = "PanTools_Key", PanParse.panCode = "PanTools_Code", PanParse.flowInfoKey = "PanTools_Flow_New", 
            PanParse.lock = !1, PanParse.qrcode = "https://wiki.shuma.ink/qrcode.jpg", PanParse;
        }(AppBase_1.AppBase);
        exports.PanParse = PanParse;
        var PanHandler = function PanHandler() {};
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.EventEnum = void 0, function(EventEnum) {
            EventEnum.click = "click";
        }(exports.EventEnum || (exports.EventEnum = {}));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.Common = void 0;
        var Common = function() {
            function Common() {}
            return Common.randStr = function(len) {
                void 0 === len && (len = 4);
                for (var $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", maxPos = $chars.length, pwd = "", i = 0; i < len; i++) pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
                return pwd;
            }, Common.humanSize = function(fileSize) {
                return fileSize < 1024 ? fileSize + "B" : fileSize < 1048576 ? (fileSize / 1024).toFixed(2) + "KB" : fileSize < 1073741824 ? (fileSize / 1048576).toFixed(2) + "MB" : (fileSize / 1073741824).toFixed(2) + "GB";
            }, Common.trim = function(source, char) {
                return source.replace(new RegExp("^\\" + char + "+|\\" + char + "+$", "g"), "");
            }, Common.getCookie = function(key) {
                for (var arr = document.cookie.replace(/\s/g, "").split(";"), i = 0, l = arr.length; i < l; i++) {
                    var tempArr = arr[i].split("=");
                    if (tempArr[0] == key) return decodeURIComponent(tempArr[1]);
                }
                return "";
            }, Common;
        }();
        exports.Common = Common;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.ItemType = void 0, function(ItemType) {
            ItemType.TaoBao = "tb", ItemType.TMall = "tm", ItemType.JingDong = "jd", ItemType.JingDongChaoshi = "jdcs";
        }(exports.ItemType || (exports.ItemType = {}));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var Container_1 = __webpack_require__(18), home_1 = __webpack_require__(32);
        Container_1.Container.Require(home_1.PanTools).Init();
    }, function(module, exports, __webpack_require__) {
        (function(process, global) {
            var Reflect;
            !function(Reflect) {
                !function(factory) {
                    var root = "object" == typeof global ? global : "object" == typeof self ? self : "object" == typeof this ? this : Function("return this;")(), exporter = makeExporter(Reflect);
                    function makeExporter(target, previous) {
                        return function(key, value) {
                            "function" != typeof target[key] && Object.defineProperty(target, key, {
                                configurable: !0,
                                writable: !0,
                                value: value
                            }), previous && previous(key, value);
                        };
                    }
                    void 0 === root.Reflect ? root.Reflect = Reflect : exporter = makeExporter(root.Reflect, exporter), 
                    function(exporter) {
                        var hasOwn = Object.prototype.hasOwnProperty, supportsSymbol = "function" == typeof Symbol, toPrimitiveSymbol = supportsSymbol && void 0 !== Symbol.toPrimitive ? Symbol.toPrimitive : "@@toPrimitive", iteratorSymbol = supportsSymbol && void 0 !== Symbol.iterator ? Symbol.iterator : "@@iterator", supportsCreate = "function" == typeof Object.create, supportsProto = {
                            __proto__: []
                        } instanceof Array, downLevel = !supportsCreate && !supportsProto, HashMap = {
                            create: supportsCreate ? function() {
                                return MakeDictionary(Object.create(null));
                            } : supportsProto ? function() {
                                return MakeDictionary({
                                    __proto__: null
                                });
                            } : function() {
                                return MakeDictionary({});
                            },
                            has: downLevel ? function(map, key) {
                                return hasOwn.call(map, key);
                            } : function(map, key) {
                                return key in map;
                            },
                            get: downLevel ? function(map, key) {
                                return hasOwn.call(map, key) ? map[key] : void 0;
                            } : function(map, key) {
                                return map[key];
                            }
                        }, functionPrototype = Object.getPrototypeOf(Function), usePolyfill = "object" == typeof process && process.env && "true" === process.env.REFLECT_METADATA_USE_MAP_POLYFILL, _Map = usePolyfill || "function" != typeof Map || "function" != typeof Map.prototype.entries ? CreateMapPolyfill() : Map, _Set = usePolyfill || "function" != typeof Set || "function" != typeof Set.prototype.entries ? CreateSetPolyfill() : Set, Metadata = new (usePolyfill || "function" != typeof WeakMap ? CreateWeakMapPolyfill() : WeakMap);
                        function decorate(decorators, target, propertyKey, attributes) {
                            if (IsUndefined(propertyKey)) {
                                if (!IsArray(decorators)) throw new TypeError;
                                if (!IsConstructor(target)) throw new TypeError;
                                return DecorateConstructor(decorators, target);
                            }
                            if (!IsArray(decorators)) throw new TypeError;
                            if (!IsObject(target)) throw new TypeError;
                            if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes)) throw new TypeError;
                            return IsNull(attributes) && (attributes = void 0), DecorateProperty(decorators, target, propertyKey = ToPropertyKey(propertyKey), attributes);
                        }
                        function metadata(metadataKey, metadataValue) {
                            function decorator(target, propertyKey) {
                                if (!IsObject(target)) throw new TypeError;
                                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey)) throw new TypeError;
                                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
                            }
                            return decorator;
                        }
                        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
                            if (!IsObject(target)) throw new TypeError;
                            return IsUndefined(propertyKey) || (propertyKey = ToPropertyKey(propertyKey)), OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
                        }
                        function hasMetadata(metadataKey, target, propertyKey) {
                            if (!IsObject(target)) throw new TypeError;
                            return IsUndefined(propertyKey) || (propertyKey = ToPropertyKey(propertyKey)), OrdinaryHasMetadata(metadataKey, target, propertyKey);
                        }
                        function hasOwnMetadata(metadataKey, target, propertyKey) {
                            if (!IsObject(target)) throw new TypeError;
                            return IsUndefined(propertyKey) || (propertyKey = ToPropertyKey(propertyKey)), OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
                        }
                        function getMetadata(metadataKey, target, propertyKey) {
                            if (!IsObject(target)) throw new TypeError;
                            return IsUndefined(propertyKey) || (propertyKey = ToPropertyKey(propertyKey)), OrdinaryGetMetadata(metadataKey, target, propertyKey);
                        }
                        function getOwnMetadata(metadataKey, target, propertyKey) {
                            if (!IsObject(target)) throw new TypeError;
                            return IsUndefined(propertyKey) || (propertyKey = ToPropertyKey(propertyKey)), OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
                        }
                        function getMetadataKeys(target, propertyKey) {
                            if (!IsObject(target)) throw new TypeError;
                            return IsUndefined(propertyKey) || (propertyKey = ToPropertyKey(propertyKey)), OrdinaryMetadataKeys(target, propertyKey);
                        }
                        function getOwnMetadataKeys(target, propertyKey) {
                            if (!IsObject(target)) throw new TypeError;
                            return IsUndefined(propertyKey) || (propertyKey = ToPropertyKey(propertyKey)), OrdinaryOwnMetadataKeys(target, propertyKey);
                        }
                        function deleteMetadata(metadataKey, target, propertyKey) {
                            if (!IsObject(target)) throw new TypeError;
                            IsUndefined(propertyKey) || (propertyKey = ToPropertyKey(propertyKey));
                            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, !1);
                            if (IsUndefined(metadataMap)) return !1;
                            if (!metadataMap.delete(metadataKey)) return !1;
                            if (metadataMap.size > 0) return !0;
                            var targetMetadata = Metadata.get(target);
                            return targetMetadata.delete(propertyKey), targetMetadata.size > 0 || Metadata.delete(target), 
                            !0;
                        }
                        function DecorateConstructor(decorators, target) {
                            for (var i = decorators.length - 1; i >= 0; --i) {
                                var decorated = (0, decorators[i])(target);
                                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                                    if (!IsConstructor(decorated)) throw new TypeError;
                                    target = decorated;
                                }
                            }
                            return target;
                        }
                        function DecorateProperty(decorators, target, propertyKey, descriptor) {
                            for (var i = decorators.length - 1; i >= 0; --i) {
                                var decorated = (0, decorators[i])(target, propertyKey, descriptor);
                                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                                    if (!IsObject(decorated)) throw new TypeError;
                                    descriptor = decorated;
                                }
                            }
                            return descriptor;
                        }
                        function GetOrCreateMetadataMap(O, P, Create) {
                            var targetMetadata = Metadata.get(O);
                            if (IsUndefined(targetMetadata)) {
                                if (!Create) return;
                                targetMetadata = new _Map, Metadata.set(O, targetMetadata);
                            }
                            var metadataMap = targetMetadata.get(P);
                            if (IsUndefined(metadataMap)) {
                                if (!Create) return;
                                metadataMap = new _Map, targetMetadata.set(P, metadataMap);
                            }
                            return metadataMap;
                        }
                        function OrdinaryHasMetadata(MetadataKey, O, P) {
                            if (OrdinaryHasOwnMetadata(MetadataKey, O, P)) return !0;
                            var parent = OrdinaryGetPrototypeOf(O);
                            return !IsNull(parent) && OrdinaryHasMetadata(MetadataKey, parent, P);
                        }
                        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
                            var metadataMap = GetOrCreateMetadataMap(O, P, !1);
                            return !IsUndefined(metadataMap) && ToBoolean(metadataMap.has(MetadataKey));
                        }
                        function OrdinaryGetMetadata(MetadataKey, O, P) {
                            if (OrdinaryHasOwnMetadata(MetadataKey, O, P)) return OrdinaryGetOwnMetadata(MetadataKey, O, P);
                            var parent = OrdinaryGetPrototypeOf(O);
                            return IsNull(parent) ? void 0 : OrdinaryGetMetadata(MetadataKey, parent, P);
                        }
                        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
                            var metadataMap = GetOrCreateMetadataMap(O, P, !1);
                            if (!IsUndefined(metadataMap)) return metadataMap.get(MetadataKey);
                        }
                        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
                            GetOrCreateMetadataMap(O, P, !0).set(MetadataKey, MetadataValue);
                        }
                        function OrdinaryMetadataKeys(O, P) {
                            var ownKeys = OrdinaryOwnMetadataKeys(O, P), parent = OrdinaryGetPrototypeOf(O);
                            if (null === parent) return ownKeys;
                            var parentKeys = OrdinaryMetadataKeys(parent, P);
                            if (parentKeys.length <= 0) return ownKeys;
                            if (ownKeys.length <= 0) return parentKeys;
                            for (var set = new _Set, keys = [], _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                                var key = ownKeys_1[_i];
                                set.has(key) || (set.add(key), keys.push(key));
                            }
                            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                                key = parentKeys_1[_a];
                                set.has(key) || (set.add(key), keys.push(key));
                            }
                            return keys;
                        }
                        function OrdinaryOwnMetadataKeys(O, P) {
                            var keys = [], metadataMap = GetOrCreateMetadataMap(O, P, !1);
                            if (IsUndefined(metadataMap)) return keys;
                            for (var iterator = GetIterator(metadataMap.keys()), k = 0; ;) {
                                var next = IteratorStep(iterator);
                                if (!next) return keys.length = k, keys;
                                var nextValue = IteratorValue(next);
                                try {
                                    keys[k] = nextValue;
                                } catch (e) {
                                    try {
                                        IteratorClose(iterator);
                                    } finally {
                                        throw e;
                                    }
                                }
                                k++;
                            }
                        }
                        function Type(x) {
                            if (null === x) return 1;
                            switch (typeof x) {
                              case "undefined":
                                return 0;

                              case "boolean":
                                return 2;

                              case "string":
                                return 3;

                              case "symbol":
                                return 4;

                              case "number":
                                return 5;

                              case "object":
                                return null === x ? 1 : 6;

                              default:
                                return 6;
                            }
                        }
                        function IsUndefined(x) {
                            return void 0 === x;
                        }
                        function IsNull(x) {
                            return null === x;
                        }
                        function IsSymbol(x) {
                            return "symbol" == typeof x;
                        }
                        function IsObject(x) {
                            return "object" == typeof x ? null !== x : "function" == typeof x;
                        }
                        function ToPrimitive(input, PreferredType) {
                            switch (Type(input)) {
                              case 0:
                              case 1:
                              case 2:
                              case 3:
                              case 4:
                              case 5:
                                return input;
                            }
                            var hint = 3 === PreferredType ? "string" : 5 === PreferredType ? "number" : "default", exoticToPrim = GetMethod(input, toPrimitiveSymbol);
                            if (void 0 !== exoticToPrim) {
                                var result = exoticToPrim.call(input, hint);
                                if (IsObject(result)) throw new TypeError;
                                return result;
                            }
                            return OrdinaryToPrimitive(input, "default" === hint ? "number" : hint);
                        }
                        function OrdinaryToPrimitive(O, hint) {
                            if ("string" === hint) {
                                var toString_1 = O.toString;
                                if (IsCallable(toString_1)) if (!IsObject(result = toString_1.call(O))) return result;
                                if (IsCallable(valueOf = O.valueOf)) if (!IsObject(result = valueOf.call(O))) return result;
                            } else {
                                var valueOf;
                                if (IsCallable(valueOf = O.valueOf)) if (!IsObject(result = valueOf.call(O))) return result;
                                var result, toString_2 = O.toString;
                                if (IsCallable(toString_2)) if (!IsObject(result = toString_2.call(O))) return result;
                            }
                            throw new TypeError;
                        }
                        function ToBoolean(argument) {
                            return !!argument;
                        }
                        function ToString(argument) {
                            return "" + argument;
                        }
                        function ToPropertyKey(argument) {
                            var key = ToPrimitive(argument, 3);
                            return IsSymbol(key) ? key : ToString(key);
                        }
                        function IsArray(argument) {
                            return Array.isArray ? Array.isArray(argument) : argument instanceof Object ? argument instanceof Array : "[object Array]" === Object.prototype.toString.call(argument);
                        }
                        function IsCallable(argument) {
                            return "function" == typeof argument;
                        }
                        function IsConstructor(argument) {
                            return "function" == typeof argument;
                        }
                        function IsPropertyKey(argument) {
                            switch (Type(argument)) {
                              case 3:
                              case 4:
                                return !0;

                              default:
                                return !1;
                            }
                        }
                        function GetMethod(V, P) {
                            var func = V[P];
                            if (null != func) {
                                if (!IsCallable(func)) throw new TypeError;
                                return func;
                            }
                        }
                        function GetIterator(obj) {
                            var method = GetMethod(obj, iteratorSymbol);
                            if (!IsCallable(method)) throw new TypeError;
                            var iterator = method.call(obj);
                            if (!IsObject(iterator)) throw new TypeError;
                            return iterator;
                        }
                        function IteratorValue(iterResult) {
                            return iterResult.value;
                        }
                        function IteratorStep(iterator) {
                            var result = iterator.next();
                            return !result.done && result;
                        }
                        function IteratorClose(iterator) {
                            var f = iterator.return;
                            f && f.call(iterator);
                        }
                        function OrdinaryGetPrototypeOf(O) {
                            var proto = Object.getPrototypeOf(O);
                            if ("function" != typeof O || O === functionPrototype) return proto;
                            if (proto !== functionPrototype) return proto;
                            var prototype = O.prototype, prototypeProto = prototype && Object.getPrototypeOf(prototype);
                            if (null == prototypeProto || prototypeProto === Object.prototype) return proto;
                            var constructor = prototypeProto.constructor;
                            return "function" != typeof constructor || constructor === O ? proto : constructor;
                        }
                        function CreateMapPolyfill() {
                            var cacheSentinel = {}, arraySentinel = [], MapIterator = function() {
                                function MapIterator(keys, values, selector) {
                                    this._index = 0, this._keys = keys, this._values = values, this._selector = selector;
                                }
                                return MapIterator.prototype["@@iterator"] = function() {
                                    return this;
                                }, MapIterator.prototype[iteratorSymbol] = function() {
                                    return this;
                                }, MapIterator.prototype.next = function() {
                                    var index = this._index;
                                    if (index >= 0 && index < this._keys.length) {
                                        var result = this._selector(this._keys[index], this._values[index]);
                                        return index + 1 >= this._keys.length ? (this._index = -1, this._keys = arraySentinel, 
                                        this._values = arraySentinel) : this._index++, {
                                            value: result,
                                            done: !1
                                        };
                                    }
                                    return {
                                        value: void 0,
                                        done: !0
                                    };
                                }, MapIterator.prototype.throw = function(error) {
                                    throw this._index >= 0 && (this._index = -1, this._keys = arraySentinel, this._values = arraySentinel), 
                                    error;
                                }, MapIterator.prototype.return = function(value) {
                                    return this._index >= 0 && (this._index = -1, this._keys = arraySentinel, this._values = arraySentinel), 
                                    {
                                        value: value,
                                        done: !0
                                    };
                                }, MapIterator;
                            }();
                            return function() {
                                function Map() {
                                    this._keys = [], this._values = [], this._cacheKey = cacheSentinel, this._cacheIndex = -2;
                                }
                                return Object.defineProperty(Map.prototype, "size", {
                                    get: function() {
                                        return this._keys.length;
                                    },
                                    enumerable: !0,
                                    configurable: !0
                                }), Map.prototype.has = function(key) {
                                    return this._find(key, !1) >= 0;
                                }, Map.prototype.get = function(key) {
                                    var index = this._find(key, !1);
                                    return index >= 0 ? this._values[index] : void 0;
                                }, Map.prototype.set = function(key, value) {
                                    var index = this._find(key, !0);
                                    return this._values[index] = value, this;
                                }, Map.prototype.delete = function(key) {
                                    var index = this._find(key, !1);
                                    if (index >= 0) {
                                        for (var size = this._keys.length, i = index + 1; i < size; i++) this._keys[i - 1] = this._keys[i], 
                                        this._values[i - 1] = this._values[i];
                                        return this._keys.length--, this._values.length--, key === this._cacheKey && (this._cacheKey = cacheSentinel, 
                                        this._cacheIndex = -2), !0;
                                    }
                                    return !1;
                                }, Map.prototype.clear = function() {
                                    this._keys.length = 0, this._values.length = 0, this._cacheKey = cacheSentinel, 
                                    this._cacheIndex = -2;
                                }, Map.prototype.keys = function() {
                                    return new MapIterator(this._keys, this._values, getKey);
                                }, Map.prototype.values = function() {
                                    return new MapIterator(this._keys, this._values, getValue);
                                }, Map.prototype.entries = function() {
                                    return new MapIterator(this._keys, this._values, getEntry);
                                }, Map.prototype["@@iterator"] = function() {
                                    return this.entries();
                                }, Map.prototype[iteratorSymbol] = function() {
                                    return this.entries();
                                }, Map.prototype._find = function(key, insert) {
                                    return this._cacheKey !== key && (this._cacheIndex = this._keys.indexOf(this._cacheKey = key)), 
                                    this._cacheIndex < 0 && insert && (this._cacheIndex = this._keys.length, this._keys.push(key), 
                                    this._values.push(void 0)), this._cacheIndex;
                                }, Map;
                            }();
                            function getKey(key, _) {
                                return key;
                            }
                            function getValue(_, value) {
                                return value;
                            }
                            function getEntry(key, value) {
                                return [ key, value ];
                            }
                        }
                        function CreateSetPolyfill() {
                            return function() {
                                function Set() {
                                    this._map = new _Map;
                                }
                                return Object.defineProperty(Set.prototype, "size", {
                                    get: function() {
                                        return this._map.size;
                                    },
                                    enumerable: !0,
                                    configurable: !0
                                }), Set.prototype.has = function(value) {
                                    return this._map.has(value);
                                }, Set.prototype.add = function(value) {
                                    return this._map.set(value, value), this;
                                }, Set.prototype.delete = function(value) {
                                    return this._map.delete(value);
                                }, Set.prototype.clear = function() {
                                    this._map.clear();
                                }, Set.prototype.keys = function() {
                                    return this._map.keys();
                                }, Set.prototype.values = function() {
                                    return this._map.values();
                                }, Set.prototype.entries = function() {
                                    return this._map.entries();
                                }, Set.prototype["@@iterator"] = function() {
                                    return this.keys();
                                }, Set.prototype[iteratorSymbol] = function() {
                                    return this.keys();
                                }, Set;
                            }();
                        }
                        function CreateWeakMapPolyfill() {
                            var UUID_SIZE = 16, keys = HashMap.create(), rootKey = CreateUniqueKey();
                            return function() {
                                function WeakMap() {
                                    this._key = CreateUniqueKey();
                                }
                                return WeakMap.prototype.has = function(target) {
                                    var table = GetOrCreateWeakMapTable(target, !1);
                                    return void 0 !== table && HashMap.has(table, this._key);
                                }, WeakMap.prototype.get = function(target) {
                                    var table = GetOrCreateWeakMapTable(target, !1);
                                    return void 0 !== table ? HashMap.get(table, this._key) : void 0;
                                }, WeakMap.prototype.set = function(target, value) {
                                    return GetOrCreateWeakMapTable(target, !0)[this._key] = value, this;
                                }, WeakMap.prototype.delete = function(target) {
                                    var table = GetOrCreateWeakMapTable(target, !1);
                                    return void 0 !== table && delete table[this._key];
                                }, WeakMap.prototype.clear = function() {
                                    this._key = CreateUniqueKey();
                                }, WeakMap;
                            }();
                            function CreateUniqueKey() {
                                var key;
                                do {
                                    key = "@@WeakMap@@" + CreateUUID();
                                } while (HashMap.has(keys, key));
                                return keys[key] = !0, key;
                            }
                            function GetOrCreateWeakMapTable(target, create) {
                                if (!hasOwn.call(target, rootKey)) {
                                    if (!create) return;
                                    Object.defineProperty(target, rootKey, {
                                        value: HashMap.create()
                                    });
                                }
                                return target[rootKey];
                            }
                            function FillRandomBytes(buffer, size) {
                                for (var i = 0; i < size; ++i) buffer[i] = 255 * Math.random() | 0;
                                return buffer;
                            }
                            function GenRandomBytes(size) {
                                return "function" == typeof Uint8Array ? "undefined" != typeof crypto ? crypto.getRandomValues(new Uint8Array(size)) : "undefined" != typeof msCrypto ? msCrypto.getRandomValues(new Uint8Array(size)) : FillRandomBytes(new Uint8Array(size), size) : FillRandomBytes(new Array(size), size);
                            }
                            function CreateUUID() {
                                var data = GenRandomBytes(UUID_SIZE);
                                data[6] = 79 & data[6] | 64, data[8] = 191 & data[8] | 128;
                                for (var result = "", offset = 0; offset < UUID_SIZE; ++offset) {
                                    var byte = data[offset];
                                    4 !== offset && 6 !== offset && 8 !== offset || (result += "-"), byte < 16 && (result += "0"), 
                                    result += byte.toString(16).toLowerCase();
                                }
                                return result;
                            }
                        }
                        function MakeDictionary(obj) {
                            return obj.__ = void 0, delete obj.__, obj;
                        }
                        exporter("decorate", decorate), exporter("metadata", metadata), exporter("defineMetadata", defineMetadata), 
                        exporter("hasMetadata", hasMetadata), exporter("hasOwnMetadata", hasOwnMetadata), 
                        exporter("getMetadata", getMetadata), exporter("getOwnMetadata", getOwnMetadata), 
                        exporter("getMetadataKeys", getMetadataKeys), exporter("getOwnMetadataKeys", getOwnMetadataKeys), 
                        exporter("deleteMetadata", deleteMetadata);
                    }(exporter);
                }();
            }(Reflect || (Reflect = {}));
        }).call(this, __webpack_require__(30), __webpack_require__(31));
    }, function(module, exports) {
        var cachedSetTimeout, cachedClearTimeout, process = module.exports = {};
        function defaultSetTimout() {
            throw new Error("setTimeout has not been defined");
        }
        function defaultClearTimeout() {
            throw new Error("clearTimeout has not been defined");
        }
        function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) return setTimeout(fun, 0);
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) return cachedSetTimeout = setTimeout, 
            setTimeout(fun, 0);
            try {
                return cachedSetTimeout(fun, 0);
            } catch (e) {
                try {
                    return cachedSetTimeout.call(null, fun, 0);
                } catch (e) {
                    return cachedSetTimeout.call(this, fun, 0);
                }
            }
        }
        !function() {
            try {
                cachedSetTimeout = "function" == typeof setTimeout ? setTimeout : defaultSetTimout;
            } catch (e) {
                cachedSetTimeout = defaultSetTimout;
            }
            try {
                cachedClearTimeout = "function" == typeof clearTimeout ? clearTimeout : defaultClearTimeout;
            } catch (e) {
                cachedClearTimeout = defaultClearTimeout;
            }
        }();
        var currentQueue, queue = [], draining = !1, queueIndex = -1;
        function cleanUpNextTick() {
            draining && currentQueue && (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, 
            queue.length && drainQueue());
        }
        function drainQueue() {
            if (!draining) {
                var timeout = runTimeout(cleanUpNextTick);
                draining = !0;
                for (var len = queue.length; len; ) {
                    for (currentQueue = queue, queue = []; ++queueIndex < len; ) currentQueue && currentQueue[queueIndex].run();
                    queueIndex = -1, len = queue.length;
                }
                currentQueue = null, draining = !1, function runClearTimeout(marker) {
                    if (cachedClearTimeout === clearTimeout) return clearTimeout(marker);
                    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) return cachedClearTimeout = clearTimeout, 
                    clearTimeout(marker);
                    try {
                        return cachedClearTimeout(marker);
                    } catch (e) {
                        try {
                            return cachedClearTimeout.call(null, marker);
                        } catch (e) {
                            return cachedClearTimeout.call(this, marker);
                        }
                    }
                }(timeout);
            }
        }
        function Item(fun, array) {
            this.fun = fun, this.array = array;
        }
        function noop() {}
        process.nextTick = function(fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
            queue.push(new Item(fun, args)), 1 !== queue.length || draining || runTimeout(drainQueue);
        }, Item.prototype.run = function() {
            this.fun.apply(null, this.array);
        }, process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], 
        process.version = "", process.versions = {}, process.on = noop, process.addListener = noop, 
        process.once = noop, process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, 
        process.emit = noop, process.prependListener = noop, process.prependOnceListener = noop, 
        process.listeners = function(name) {
            return [];
        }, process.binding = function(name) {
            throw new Error("process.binding is not supported");
        }, process.cwd = function() {
            return "/";
        }, process.chdir = function(dir) {
            throw new Error("process.chdir is not supported");
        }, process.umask = function() {
            return 0;
        };
    }, function(module, exports) {
        var g;
        g = function() {
            return this;
        }();
        try {
            g = g || new Function("return this")();
        } catch (e) {
            "object" == typeof window && (g = window);
        }
        module.exports = g;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.PanTools = void 0;
        var PanFill_1 = __webpack_require__(33), PanCode_1 = __webpack_require__(38), Container_1 = __webpack_require__(18), Logger_1 = __webpack_require__(4), PanParse_1 = __webpack_require__(24), ListCoupon_1 = __webpack_require__(43), MovieParse_1 = __webpack_require__(45), DetailCoupon_1 = __webpack_require__(48), Gwd_1 = __webpack_require__(50), GwdClean_1 = __webpack_require__(53), DownCleaner_1 = __webpack_require__(54), Options_1 = __webpack_require__(55), PanTools = function() {
            function PanTools() {
                this.plugins = new Array, this.plugins = [ Container_1.Container.Require(DetailCoupon_1.DetailCoupon), Container_1.Container.Require(ListCoupon_1.ListCoupon), Container_1.Container.Require(Gwd_1.Gwd), Container_1.Container.Require(MovieParse_1.MovieParse), Container_1.Container.Require(Options_1.Options), Container_1.Container.Require(PanFill_1.PanFill), Container_1.Container.Require(DownCleaner_1.DownCleaner), Container_1.Container.Require(PanParse_1.PanParse), Container_1.Container.Require(GwdClean_1.GwdClean), Container_1.Container.Require(PanCode_1.PanCode) ], 
                Logger_1.Logger.info("container loaded");
            }
            return PanTools.prototype.Init = function() {
                this.plugins.every((function(element) {
                    return !element.linkTest() || (new Promise((function(resolve) {
                        resolve(1);
                    })).then(element.Process), Logger_1.Logger.debug("element unique:" + element.unique()), 
                    !element.unique());
                }));
            }, PanTools;
        }();
        exports.PanTools = PanTools;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var extendStatics, __extends = this && this.__extends || (extendStatics = function(d, b) {
            return extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            }, extendStatics(d, b);
        }, function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __);
        });
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.PanFill = void 0;
        var Url_1 = __webpack_require__(9), Alert_1 = __webpack_require__(7), Core_1 = __webpack_require__(2), PanRoutes_1 = __webpack_require__(21), AppBase_1 = __webpack_require__(3), Config_1 = __webpack_require__(5), Constant_1 = __webpack_require__(8), PanFill = function(_super) {
            function PanFill() {
                var _this = null !== _super && _super.apply(this, arguments) || this;
                return _this.appName = "PanFill", _this.rules = _this.getRules(), _this;
            }
            return __extends(PanFill, _super), PanFill.prototype.getRules = function() {
                var _rules = new Map;
                return PanRoutes_1.PanRoutes.forEach((function(item) {
                    _rules.set(item.SiteEnum, item.urlRule);
                })), _rules;
            }, PanFill.prototype.loader = function() {}, PanFill.prototype.run = function() {
                PanRoutes_1.PanRoutes.forEach((function(item) {
                    if (item.urlRule.test(Core_1.Core.url)) {
                        var id = !1;
                        if (item.urlId && (id = Url_1.Url.get(item.urlId)), !id) {
                            var _id = Core_1.Core.url.match(item.idRule);
                            _id && (id = _id[1]);
                        }
                        if (id) {
                            var k = item.type.toString() + "_" + id, pan = Config_1.Config.get(k, !1);
                            if (pan) {
                                var input = document.querySelector(item.inputSelector);
                                input && (input.value = pan.pwd, input.dispatchEvent(new Event("input")), Alert_1.Alert.info("\u8bc6\u522b\u5230\u5bc6\u7801\uff01\u5df2\u81ea\u52a8\u5e2e\u60a8\u586b\u5199"), 
                                1 == Config_1.Config.get(Constant_1.Constant.PanJump, 1) && $(".g-button-right").click());
                            } else 1 == Config_1.Config.get(Constant_1.Constant.PanJump, 1) && $(item.inputSelector).bind("input propertychange", (function(f) {
                                var _a, _b;
                                (null === (_b = null === (_a = $(item.inputSelector)) || void 0 === _a ? void 0 : _a.val()) || void 0 === _b ? void 0 : _b.length) >= 4 && $(".g-button-right").click();
                            }));
                        }
                    }
                }));
            }, PanFill;
        }(AppBase_1.AppBase);
        exports.PanFill = PanFill;
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0), _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_cjs_js_Swal_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12), _node_modules_css_loader_dist_cjs_js_Swal_css__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(_node_modules_css_loader_dist_cjs_js_Swal_css__WEBPACK_IMPORTED_MODULE_1__), options = {
            insert: "head",
            singleton: !1
        };
        _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_Swal_css__WEBPACK_IMPORTED_MODULE_1___default.a, options);
        __webpack_exports__.default = _node_modules_css_loader_dist_cjs_js_Swal_css__WEBPACK_IMPORTED_MODULE_1___default.a.locals || {};
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0), _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_cjs_js_Alert_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(13), _node_modules_css_loader_dist_cjs_js_Alert_css__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(_node_modules_css_loader_dist_cjs_js_Alert_css__WEBPACK_IMPORTED_MODULE_1__), options = {
            insert: "head",
            singleton: !1
        };
        _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_Alert_css__WEBPACK_IMPORTED_MODULE_1___default.a, options);
        __webpack_exports__.default = _node_modules_css_loader_dist_cjs_js_Alert_css__WEBPACK_IMPORTED_MODULE_1___default.a.locals || {};
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.ScriptOption = exports.ScriptInfo = exports.Env = void 0;
        var Env = function() {
            function Env() {}
            return Env.Sign = "PanTools", Env;
        }();
        exports.Env = Env;
        var ScriptInfo = function ScriptInfo() {};
        exports.ScriptInfo = ScriptInfo;
        var ScriptOption = function ScriptOption() {};
        exports.ScriptOption = ScriptOption;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.LogLevel = void 0, function(LogLevel) {
            LogLevel[LogLevel.debug = 0] = "debug", LogLevel[LogLevel.info = 1] = "info", LogLevel[LogLevel.warn = 2] = "warn", 
            LogLevel[LogLevel.error = 3] = "error";
        }(exports.LogLevel || (exports.LogLevel = {}));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var extendStatics, __extends = this && this.__extends || (extendStatics = function(d, b) {
            return extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            }, extendStatics(d, b);
        }, function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __);
        }), __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
            return new (P || (P = Promise))((function(resolve, reject) {
                function fulfilled(value) {
                    try {
                        step(generator.next(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function rejected(value) {
                    try {
                        step(generator.throw(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function step(result) {
                    result.done ? resolve(result.value) : function adopt(value) {
                        return value instanceof P ? value : new P((function(resolve) {
                            resolve(value);
                        }));
                    }(result.value).then(fulfilled, rejected);
                }
                step((generator = generator.apply(thisArg, _arguments || [])).next());
            }));
        }, __generator = this && this.__generator || function(thisArg, body) {
            var f, y, t, g, _ = {
                label: 0,
                sent: function() {
                    if (1 & t[0]) throw t[1];
                    return t[1];
                },
                trys: [],
                ops: []
            };
            return g = {
                next: verb(0),
                throw: verb(1),
                return: verb(2)
            }, "function" == typeof Symbol && (g[Symbol.iterator] = function() {
                return this;
            }), g;
            function verb(n) {
                return function(v) {
                    return function step(op) {
                        if (f) throw new TypeError("Generator is already executing.");
                        for (;_; ) try {
                            if (f = 1, y && (t = 2 & op[0] ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 
                            0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                            switch (y = 0, t && (op = [ 2 & op[0], t.value ]), op[0]) {
                              case 0:
                              case 1:
                                t = op;
                                break;

                              case 4:
                                return _.label++, {
                                    value: op[1],
                                    done: !1
                                };

                              case 5:
                                _.label++, y = op[1], op = [ 0 ];
                                continue;

                              case 7:
                                op = _.ops.pop(), _.trys.pop();
                                continue;

                              default:
                                if (!(t = _.trys, (t = t.length > 0 && t[t.length - 1]) || 6 !== op[0] && 2 !== op[0])) {
                                    _ = 0;
                                    continue;
                                }
                                if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
                                    _.label = op[1];
                                    break;
                                }
                                if (6 === op[0] && _.label < t[1]) {
                                    _.label = t[1], t = op;
                                    break;
                                }
                                if (t && _.label < t[2]) {
                                    _.label = t[2], _.ops.push(op);
                                    break;
                                }
                                t[2] && _.ops.pop(), _.trys.pop();
                                continue;
                            }
                            op = body.call(thisArg, _);
                        } catch (e) {
                            op = [ 6, e ], y = 0;
                        } finally {
                            f = t = 0;
                        }
                        if (5 & op[0]) throw op[1];
                        return {
                            value: op[0] ? op[1] : void 0,
                            done: !0
                        };
                    }([ n, v ]);
                };
            }
        };
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.PanCode = void 0;
        var PanType_1 = __webpack_require__(22), Core_1 = __webpack_require__(2), Alert_1 = __webpack_require__(7), PanInfo_1 = __webpack_require__(23), Logger_1 = __webpack_require__(4), SiteEnum_1 = __webpack_require__(1), AppBase_1 = __webpack_require__(3), Config_1 = __webpack_require__(5), PanRoutes_1 = __webpack_require__(21), PanCode = function(_super) {
            function PanCode() {
                var _this = null !== _super && _super.apply(this, arguments) || this;
                return _this._unique = !1, _this.appName = "PanCode", _this.rules = new Map([ [ SiteEnum_1.SiteEnum.All, /(.*)/i ] ]), 
                _this;
            }
            return __extends(PanCode, _super), PanCode.prototype.loader = function() {}, PanCode.prototype.run = function() {
                $("body").text();
                document.addEventListener("mouseup", this.pageListener.bind(this), !0);
            }, PanCode.prototype.render = function(txt) {
                return __awaiter(this, void 0, void 0, (function() {
                    return __generator(this, (function(_a) {
                        return PanRoutes_1.PanRoutes.forEach((function(v) {
                            var links = txt.match(v.contextRule);
                            null == links || links.forEach((function(item) {
                                var link = item.match(v.linkRule);
                                if (Logger_1.Logger.debug(link), link) {
                                    var pwd = item.match(v.pwdRule), id = item.match(v.idRule), pan = new PanInfo_1.PanInfo;
                                    if (pan.type = v.type, null == id) return;
                                    pan.id = id[1], pan.pwd = null == pwd ? "" : pwd[0];
                                    var newDom = $("body").html();
                                    if (newDom = newDom.replace(new RegExp(link[0] + "(?=[^#])", "gm"), "<a target='_blank' class='btn btn-url' style='color:#d00' href=\"" + link[0] + '">' + link[0] + "</a>"), 
                                    $("body").html(newDom), "" != pan.pwd && null != pan.pwd) {
                                        var k = v.type.toString() + "_" + pan.id;
                                        if (Logger_1.Logger.debug(pan), Config_1.Config.get(k, !1)) return;
                                        Config_1.Config.set(k, pan);
                                    }
                                }
                            }));
                        })), [ 2 ];
                    }));
                }));
            }, PanCode.prototype.pageListener = function() {
                var selector = unsafeWindow.getSelection(), txt = null == selector ? void 0 : selector.toString();
                if (txt && txt != PanCode.lastText) {
                    PanCode.lastText = txt;
                    var pan_1 = this.parseLink(txt);
                    if (null != pan_1 && "" != pan_1.link) {
                        if ("" != pan_1.pwd && null != pan_1.pwd) {
                            var k = pan_1.type.toString() + "_" + pan_1.id;
                            Config_1.Config.get(k, !1) || Config_1.Config.set(k, pan_1);
                        }
                        Alert_1.Alert.toast("\u53d1\u73b0\u94fe\u63a5\uff1a" + PanType_1.PanTypeEnum[pan_1.type], '<span style="font-size:0.8em;">' + (pan_1.pwd ? "\u5bc6\u7801\uff1a" + pan_1.pwd : "\u662f\u5426\u6253\u5f00\u8be5\u94fe\u63a5\uff1f"), !0, "\u53d6\u6d88", !0, "\u6253\u5f00").then((function(res) {
                            res.isConfirmed && null != pan_1 && Core_1.Core.open(pan_1.link);
                        }));
                    }
                }
            }, PanCode.prototype.parseLink = function(txt) {
                var pan = null;
                return PanRoutes_1.PanRoutes.every((function(item) {
                    var link = txt.match(item.linkRule), pwd = txt.match(item.pwdRule), id = txt.match(item.idRule);
                    if (null == id) return !0;
                    (pan = new PanInfo_1.PanInfo).type = item.type, pan.id = id[1], pan.pwd = null == pwd ? "" : pwd[0], 
                    pan.link = null == link ? "" : link[0], pan.type = item.type;
                })), pan;
            }, PanCode.lastText = "", PanCode;
        }(AppBase_1.AppBase);
        exports.PanCode = PanCode;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.Ele = void 0;
        var EventEnum_1 = __webpack_require__(25), Ele = function() {
            function Ele() {}
            return Ele.A = function(id, title, html, css, classStr) {
                var a = document.createElement("a");
                return a.id = id, a.title = title, a.innerHTML = html, a.style.cssText = css, a.className = classStr, 
                a;
            }, Ele.Span = function(childs, classStr) {
                void 0 === classStr && (classStr = "");
                var span = document.createElement("span");
                return childs.forEach((function(child) {
                    child instanceof HTMLElement ? span.appendChild(child) : span.innerHTML = child;
                })), classStr && (span.className = classStr), span;
            }, Ele.Button = function(id, className, childs) {
                var btn = document.createElement("button");
                return id && (btn.id = id), className && (btn.className = className), childs.forEach((function(child) {
                    child instanceof HTMLElement ? btn.appendChild(child) : btn.innerHTML = child;
                })), btn;
            }, Ele.bindEvent = function(ele, event, callback) {
                ele.addEventListener(EventEnum_1.EventEnum[event], callback);
            }, Ele;
        }();
        exports.Ele = Ele;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.BaiduRoutes = void 0;
        var Http_1 = __webpack_require__(10), PanParse_1 = __webpack_require__(24), BaiduRoutes = function() {
            function BaiduRoutes() {}
            return BaiduRoutes.shareFile = function(fsId, bdstoken, pwd) {
                void 0 === pwd && (pwd = "");
                var url = "https://pan.baidu.com/share/set?channel=chunlei&clienttype=0&app_id=250528&bdstoken=" + bdstoken + "&web=1", data = new Map;
                return data.set("fid_list", [ fsId ]), data.set("schannel", 4), data.set("channel_list", []), 
                data.set("period", 1), pwd.length > 0 && data.set("pwd", pwd), Http_1.Http.post(url, data, "formdata");
            }, BaiduRoutes.parserUrl = function(link, pwd, code, key) {
                void 0 === code && (code = ""), void 0 === key && (key = "");
                var data = new Map;
                return data.set("type", "parseUrl"), data.set("url", link), data.set("pwd", pwd), 
                data.set("code", code), data.set("key", key), Http_1.Http.post(BaiduRoutes.root, data, "formdata");
            }, BaiduRoutes.codeQuery = function(key) {
                return Http_1.Http.get(BaiduRoutes.root + "?Key=" + key + "&Code=Inquire", new Map, 60);
            }, BaiduRoutes.parserPcsUrl = function(url, key, pan) {
                var _a;
                return void 0 === key && (key = ""), url = url.replace("https://d.pcs.baidu.com/file/", "").replace("?fid=", "&fid="), 
                url = window.btoa(url), Http_1.Http.get(BaiduRoutes.root + "?Key=" + key + "&Code=Parsing&PCSPath=" + url + "&ShareUrl=" + (null === (_a = null == pan ? void 0 : pan.link) || void 0 === _a ? void 0 : _a.replace("https://pan.baidu.com/s/", "")) + "&SharePwd=" + (null == pan ? void 0 : pan.pwd));
            }, BaiduRoutes.pcsQuery = function(fsids) {
                var url = "https://pan.baidu.com/rest/2.0/xpan/multimedia?method=filemetas&dlink=1&fsids=[" + fsids.join(",") + "]";
                return Http_1.Http.get(url, new Map, 60);
            }, BaiduRoutes.getSign = function(surl) {
                var url = "https://pan.baidu.com/share/tplconfig?fields=sign,timestamp&channel=chunlei&web=1&app_id=250528&clienttype=0&surl=" + surl;
                return Http_1.Http.get(url);
            }, BaiduRoutes.pcsQueryV2 = function(sign, timestamp, fsids) {
                var url = "https://pan.baidu.com/api/sharedownload?channel=chunlei&clienttype=12&web=1&app_id=250528&sign=" + sign + "&timestamp=" + timestamp, data = new Map([ [ "fid_list", "[" + fsids.join(",") + "]" ] ]);
                return data.set("primaryid", unsafeWindow.window.locals.get("shareid")), data.set("uk", unsafeWindow.window.locals.get("share_uk")), 
                data.set("product", "share"), data.set("extra", PanParse_1.PanParse._getExtra()), 
                Http_1.Http.post(url, data, "formdata");
            }, BaiduRoutes.root = "https://pan.shuma.ink/KinhScript.php", BaiduRoutes;
        }();
        exports.BaiduRoutes = BaiduRoutes;
    }, function(module, exports, __webpack_require__) {
        !function webpackUniversalModuleDefinition(root, factory) {
            module.exports = factory();
        }(0, (function() {
            return function() {
                var __webpack_modules__ = {
                    134: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                        "use strict";
                        __webpack_require__.d(__webpack_exports__, {
                            default: function() {
                                return clipboard;
                            }
                        });
                        var tiny_emitter = __webpack_require__(279), tiny_emitter_default = __webpack_require__.n(tiny_emitter), listen = __webpack_require__(370), listen_default = __webpack_require__.n(listen), src_select = __webpack_require__(817), select_default = __webpack_require__.n(src_select);
                        function _typeof(obj) {
                            return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function _typeof(obj) {
                                return typeof obj;
                            } : function _typeof(obj) {
                                return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                            }, _typeof(obj);
                        }
                        function _defineProperties(target, props) {
                            for (var i = 0; i < props.length; i++) {
                                var descriptor = props[i];
                                descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
                                "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
                            }
                        }
                        var ClipboardAction = function() {
                            function ClipboardAction(options) {
                                !function _classCallCheck(instance, Constructor) {
                                    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
                                }(this, ClipboardAction), this.resolveOptions(options), this.initSelection();
                            }
                            return function _createClass(Constructor, protoProps, staticProps) {
                                return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), 
                                Constructor;
                            }(ClipboardAction, [ {
                                key: "resolveOptions",
                                value: function resolveOptions() {
                                    var options = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                                    this.action = options.action, this.container = options.container, this.emitter = options.emitter, 
                                    this.target = options.target, this.text = options.text, this.trigger = options.trigger, 
                                    this.selectedText = "";
                                }
                            }, {
                                key: "initSelection",
                                value: function initSelection() {
                                    this.text ? this.selectFake() : this.target && this.selectTarget();
                                }
                            }, {
                                key: "createFakeElement",
                                value: function createFakeElement() {
                                    var isRTL = "rtl" === document.documentElement.getAttribute("dir");
                                    this.fakeElem = document.createElement("textarea"), this.fakeElem.style.fontSize = "12pt", 
                                    this.fakeElem.style.border = "0", this.fakeElem.style.padding = "0", this.fakeElem.style.margin = "0", 
                                    this.fakeElem.style.position = "absolute", this.fakeElem.style[isRTL ? "right" : "left"] = "-9999px";
                                    var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                                    return this.fakeElem.style.top = "".concat(yPosition, "px"), this.fakeElem.setAttribute("readonly", ""), 
                                    this.fakeElem.value = this.text, this.fakeElem;
                                }
                            }, {
                                key: "selectFake",
                                value: function selectFake() {
                                    var _this = this, fakeElem = this.createFakeElement();
                                    this.fakeHandlerCallback = function() {
                                        return _this.removeFake();
                                    }, this.fakeHandler = this.container.addEventListener("click", this.fakeHandlerCallback) || !0, 
                                    this.container.appendChild(fakeElem), this.selectedText = select_default()(fakeElem), 
                                    this.copyText(), this.removeFake();
                                }
                            }, {
                                key: "removeFake",
                                value: function removeFake() {
                                    this.fakeHandler && (this.container.removeEventListener("click", this.fakeHandlerCallback), 
                                    this.fakeHandler = null, this.fakeHandlerCallback = null), this.fakeElem && (this.container.removeChild(this.fakeElem), 
                                    this.fakeElem = null);
                                }
                            }, {
                                key: "selectTarget",
                                value: function selectTarget() {
                                    this.selectedText = select_default()(this.target), this.copyText();
                                }
                            }, {
                                key: "copyText",
                                value: function copyText() {
                                    var succeeded;
                                    try {
                                        succeeded = document.execCommand(this.action);
                                    } catch (err) {
                                        succeeded = !1;
                                    }
                                    this.handleResult(succeeded);
                                }
                            }, {
                                key: "handleResult",
                                value: function handleResult(succeeded) {
                                    this.emitter.emit(succeeded ? "success" : "error", {
                                        action: this.action,
                                        text: this.selectedText,
                                        trigger: this.trigger,
                                        clearSelection: this.clearSelection.bind(this)
                                    });
                                }
                            }, {
                                key: "clearSelection",
                                value: function clearSelection() {
                                    this.trigger && this.trigger.focus(), document.activeElement.blur(), window.getSelection().removeAllRanges();
                                }
                            }, {
                                key: "destroy",
                                value: function destroy() {
                                    this.removeFake();
                                }
                            }, {
                                key: "action",
                                set: function set() {
                                    var action = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "copy";
                                    if (this._action = action, "copy" !== this._action && "cut" !== this._action) throw new Error('Invalid "action" value, use either "copy" or "cut"');
                                },
                                get: function get() {
                                    return this._action;
                                }
                            }, {
                                key: "target",
                                set: function set(target) {
                                    if (void 0 !== target) {
                                        if (!target || "object" !== _typeof(target) || 1 !== target.nodeType) throw new Error('Invalid "target" value, use a valid Element');
                                        if ("copy" === this.action && target.hasAttribute("disabled")) throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                                        if ("cut" === this.action && (target.hasAttribute("readonly") || target.hasAttribute("disabled"))) throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                                        this._target = target;
                                    }
                                },
                                get: function get() {
                                    return this._target;
                                }
                            } ]), ClipboardAction;
                        }(), clipboard_action = ClipboardAction;
                        function clipboard_typeof(obj) {
                            return clipboard_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function _typeof(obj) {
                                return typeof obj;
                            } : function _typeof(obj) {
                                return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                            }, clipboard_typeof(obj);
                        }
                        function clipboard_defineProperties(target, props) {
                            for (var i = 0; i < props.length; i++) {
                                var descriptor = props[i];
                                descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
                                "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
                            }
                        }
                        function _setPrototypeOf(o, p) {
                            return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                                return o.__proto__ = p, o;
                            }, _setPrototypeOf(o, p);
                        }
                        function _createSuper(Derived) {
                            var hasNativeReflectConstruct = function _isNativeReflectConstruct() {
                                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                                if (Reflect.construct.sham) return !1;
                                if ("function" == typeof Proxy) return !0;
                                try {
                                    return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}))), 
                                    !0;
                                } catch (e) {
                                    return !1;
                                }
                            }();
                            return function _createSuperInternal() {
                                var result, Super = _getPrototypeOf(Derived);
                                if (hasNativeReflectConstruct) {
                                    var NewTarget = _getPrototypeOf(this).constructor;
                                    result = Reflect.construct(Super, arguments, NewTarget);
                                } else result = Super.apply(this, arguments);
                                return _possibleConstructorReturn(this, result);
                            };
                        }
                        function _possibleConstructorReturn(self, call) {
                            return !call || "object" !== clipboard_typeof(call) && "function" != typeof call ? function _assertThisInitialized(self) {
                                if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                                return self;
                            }(self) : call;
                        }
                        function _getPrototypeOf(o) {
                            return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
                                return o.__proto__ || Object.getPrototypeOf(o);
                            }, _getPrototypeOf(o);
                        }
                        function getAttributeValue(suffix, element) {
                            var attribute = "data-clipboard-".concat(suffix);
                            if (element.hasAttribute(attribute)) return element.getAttribute(attribute);
                        }
                        var Clipboard = function(_Emitter) {
                            !function _inherits(subClass, superClass) {
                                if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
                                subClass.prototype = Object.create(superClass && superClass.prototype, {
                                    constructor: {
                                        value: subClass,
                                        writable: !0,
                                        configurable: !0
                                    }
                                }), superClass && _setPrototypeOf(subClass, superClass);
                            }(Clipboard, _Emitter);
                            var _super = _createSuper(Clipboard);
                            function Clipboard(trigger, options) {
                                var _this;
                                return function clipboard_classCallCheck(instance, Constructor) {
                                    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
                                }(this, Clipboard), (_this = _super.call(this)).resolveOptions(options), _this.listenClick(trigger), 
                                _this;
                            }
                            return function clipboard_createClass(Constructor, protoProps, staticProps) {
                                return protoProps && clipboard_defineProperties(Constructor.prototype, protoProps), 
                                staticProps && clipboard_defineProperties(Constructor, staticProps), Constructor;
                            }(Clipboard, [ {
                                key: "resolveOptions",
                                value: function resolveOptions() {
                                    var options = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                                    this.action = "function" == typeof options.action ? options.action : this.defaultAction, 
                                    this.target = "function" == typeof options.target ? options.target : this.defaultTarget, 
                                    this.text = "function" == typeof options.text ? options.text : this.defaultText, 
                                    this.container = "object" === clipboard_typeof(options.container) ? options.container : document.body;
                                }
                            }, {
                                key: "listenClick",
                                value: function listenClick(trigger) {
                                    var _this2 = this;
                                    this.listener = listen_default()(trigger, "click", (function(e) {
                                        return _this2.onClick(e);
                                    }));
                                }
                            }, {
                                key: "onClick",
                                value: function onClick(e) {
                                    var trigger = e.delegateTarget || e.currentTarget;
                                    this.clipboardAction && (this.clipboardAction = null), this.clipboardAction = new clipboard_action({
                                        action: this.action(trigger),
                                        target: this.target(trigger),
                                        text: this.text(trigger),
                                        container: this.container,
                                        trigger: trigger,
                                        emitter: this
                                    });
                                }
                            }, {
                                key: "defaultAction",
                                value: function defaultAction(trigger) {
                                    return getAttributeValue("action", trigger);
                                }
                            }, {
                                key: "defaultTarget",
                                value: function defaultTarget(trigger) {
                                    var selector = getAttributeValue("target", trigger);
                                    if (selector) return document.querySelector(selector);
                                }
                            }, {
                                key: "defaultText",
                                value: function defaultText(trigger) {
                                    return getAttributeValue("text", trigger);
                                }
                            }, {
                                key: "destroy",
                                value: function destroy() {
                                    this.listener.destroy(), this.clipboardAction && (this.clipboardAction.destroy(), 
                                    this.clipboardAction = null);
                                }
                            } ], [ {
                                key: "isSupported",
                                value: function isSupported() {
                                    var action = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [ "copy", "cut" ], actions = "string" == typeof action ? [ action ] : action, support = !!document.queryCommandSupported;
                                    return actions.forEach((function(action) {
                                        support = support && !!document.queryCommandSupported(action);
                                    })), support;
                                }
                            } ]), Clipboard;
                        }(tiny_emitter_default()), clipboard = Clipboard;
                    },
                    828: function(module) {
                        if ("undefined" != typeof Element && !Element.prototype.matches) {
                            var proto = Element.prototype;
                            proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
                        }
                        module.exports = function closest(element, selector) {
                            for (;element && 9 !== element.nodeType; ) {
                                if ("function" == typeof element.matches && element.matches(selector)) return element;
                                element = element.parentNode;
                            }
                        };
                    },
                    438: function(module, __unused_webpack_exports, __webpack_require__) {
                        var closest = __webpack_require__(828);
                        function _delegate(element, selector, type, callback, useCapture) {
                            var listenerFn = listener.apply(this, arguments);
                            return element.addEventListener(type, listenerFn, useCapture), {
                                destroy: function() {
                                    element.removeEventListener(type, listenerFn, useCapture);
                                }
                            };
                        }
                        function listener(element, selector, type, callback) {
                            return function(e) {
                                e.delegateTarget = closest(e.target, selector), e.delegateTarget && callback.call(element, e);
                            };
                        }
                        module.exports = function delegate(elements, selector, type, callback, useCapture) {
                            return "function" == typeof elements.addEventListener ? _delegate.apply(null, arguments) : "function" == typeof type ? _delegate.bind(null, document).apply(null, arguments) : ("string" == typeof elements && (elements = document.querySelectorAll(elements)), 
                            Array.prototype.map.call(elements, (function(element) {
                                return _delegate(element, selector, type, callback, useCapture);
                            })));
                        };
                    },
                    879: function(__unused_webpack_module, exports) {
                        exports.node = function(value) {
                            return void 0 !== value && value instanceof HTMLElement && 1 === value.nodeType;
                        }, exports.nodeList = function(value) {
                            var type = Object.prototype.toString.call(value);
                            return void 0 !== value && ("[object NodeList]" === type || "[object HTMLCollection]" === type) && "length" in value && (0 === value.length || exports.node(value[0]));
                        }, exports.string = function(value) {
                            return "string" == typeof value || value instanceof String;
                        }, exports.fn = function(value) {
                            return "[object Function]" === Object.prototype.toString.call(value);
                        };
                    },
                    370: function(module, __unused_webpack_exports, __webpack_require__) {
                        var is = __webpack_require__(879), delegate = __webpack_require__(438);
                        module.exports = function listen(target, type, callback) {
                            if (!target && !type && !callback) throw new Error("Missing required arguments");
                            if (!is.string(type)) throw new TypeError("Second argument must be a String");
                            if (!is.fn(callback)) throw new TypeError("Third argument must be a Function");
                            if (is.node(target)) return function listenNode(node, type, callback) {
                                return node.addEventListener(type, callback), {
                                    destroy: function() {
                                        node.removeEventListener(type, callback);
                                    }
                                };
                            }(target, type, callback);
                            if (is.nodeList(target)) return function listenNodeList(nodeList, type, callback) {
                                return Array.prototype.forEach.call(nodeList, (function(node) {
                                    node.addEventListener(type, callback);
                                })), {
                                    destroy: function() {
                                        Array.prototype.forEach.call(nodeList, (function(node) {
                                            node.removeEventListener(type, callback);
                                        }));
                                    }
                                };
                            }(target, type, callback);
                            if (is.string(target)) return function listenSelector(selector, type, callback) {
                                return delegate(document.body, selector, type, callback);
                            }(target, type, callback);
                            throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList");
                        };
                    },
                    817: function(module) {
                        module.exports = function select(element) {
                            var selectedText;
                            if ("SELECT" === element.nodeName) element.focus(), selectedText = element.value; else if ("INPUT" === element.nodeName || "TEXTAREA" === element.nodeName) {
                                var isReadOnly = element.hasAttribute("readonly");
                                isReadOnly || element.setAttribute("readonly", ""), element.select(), element.setSelectionRange(0, element.value.length), 
                                isReadOnly || element.removeAttribute("readonly"), selectedText = element.value;
                            } else {
                                element.hasAttribute("contenteditable") && element.focus();
                                var selection = window.getSelection(), range = document.createRange();
                                range.selectNodeContents(element), selection.removeAllRanges(), selection.addRange(range), 
                                selectedText = selection.toString();
                            }
                            return selectedText;
                        };
                    },
                    279: function(module) {
                        function E() {}
                        E.prototype = {
                            on: function(name, callback, ctx) {
                                var e = this.e || (this.e = {});
                                return (e[name] || (e[name] = [])).push({
                                    fn: callback,
                                    ctx: ctx
                                }), this;
                            },
                            once: function(name, callback, ctx) {
                                var self = this;
                                function listener() {
                                    self.off(name, listener), callback.apply(ctx, arguments);
                                }
                                return listener._ = callback, this.on(name, listener, ctx);
                            },
                            emit: function(name) {
                                for (var data = [].slice.call(arguments, 1), evtArr = ((this.e || (this.e = {}))[name] || []).slice(), i = 0, len = evtArr.length; i < len; i++) evtArr[i].fn.apply(evtArr[i].ctx, data);
                                return this;
                            },
                            off: function(name, callback) {
                                var e = this.e || (this.e = {}), evts = e[name], liveEvents = [];
                                if (evts && callback) for (var i = 0, len = evts.length; i < len; i++) evts[i].fn !== callback && evts[i].fn._ !== callback && liveEvents.push(evts[i]);
                                return liveEvents.length ? e[name] = liveEvents : delete e[name], this;
                            }
                        }, module.exports = E, module.exports.TinyEmitter = E;
                    }
                }, __webpack_module_cache__ = {};
                function __webpack_require__(moduleId) {
                    if (__webpack_module_cache__[moduleId]) return __webpack_module_cache__[moduleId].exports;
                    var module = __webpack_module_cache__[moduleId] = {
                        exports: {}
                    };
                    return __webpack_modules__[moduleId](module, module.exports, __webpack_require__), 
                    module.exports;
                }
                return __webpack_require__.n = function(module) {
                    var getter = module && module.__esModule ? function() {
                        return module.default;
                    } : function() {
                        return module;
                    };
                    return __webpack_require__.d(getter, {
                        a: getter
                    }), getter;
                }, __webpack_require__.d = function(exports, definition) {
                    for (var key in definition) __webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key) && Object.defineProperty(exports, key, {
                        enumerable: !0,
                        get: definition[key]
                    });
                }, __webpack_require__.o = function(obj, prop) {
                    return Object.prototype.hasOwnProperty.call(obj, prop);
                }, __webpack_require__(134);
            }().default;
        }));
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0), _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_cjs_js_PanDialog_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14), _node_modules_css_loader_dist_cjs_js_PanDialog_css__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(_node_modules_css_loader_dist_cjs_js_PanDialog_css__WEBPACK_IMPORTED_MODULE_1__), options = {
            insert: "head",
            singleton: !1
        };
        _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_PanDialog_css__WEBPACK_IMPORTED_MODULE_1___default.a, options);
        __webpack_exports__.default = _node_modules_css_loader_dist_cjs_js_PanDialog_css__WEBPACK_IMPORTED_MODULE_1___default.a.locals || {};
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var extendStatics, __extends = this && this.__extends || (extendStatics = function(d, b) {
            return extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            }, extendStatics(d, b);
        }, function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __);
        }), __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
            return new (P || (P = Promise))((function(resolve, reject) {
                function fulfilled(value) {
                    try {
                        step(generator.next(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function rejected(value) {
                    try {
                        step(generator.throw(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function step(result) {
                    result.done ? resolve(result.value) : function adopt(value) {
                        return value instanceof P ? value : new P((function(resolve) {
                            resolve(value);
                        }));
                    }(result.value).then(fulfilled, rejected);
                }
                step((generator = generator.apply(thisArg, _arguments || [])).next());
            }));
        }, __generator = this && this.__generator || function(thisArg, body) {
            var f, y, t, g, _ = {
                label: 0,
                sent: function() {
                    if (1 & t[0]) throw t[1];
                    return t[1];
                },
                trys: [],
                ops: []
            };
            return g = {
                next: verb(0),
                throw: verb(1),
                return: verb(2)
            }, "function" == typeof Symbol && (g[Symbol.iterator] = function() {
                return this;
            }), g;
            function verb(n) {
                return function(v) {
                    return function step(op) {
                        if (f) throw new TypeError("Generator is already executing.");
                        for (;_; ) try {
                            if (f = 1, y && (t = 2 & op[0] ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 
                            0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                            switch (y = 0, t && (op = [ 2 & op[0], t.value ]), op[0]) {
                              case 0:
                              case 1:
                                t = op;
                                break;

                              case 4:
                                return _.label++, {
                                    value: op[1],
                                    done: !1
                                };

                              case 5:
                                _.label++, y = op[1], op = [ 0 ];
                                continue;

                              case 7:
                                op = _.ops.pop(), _.trys.pop();
                                continue;

                              default:
                                if (!(t = _.trys, (t = t.length > 0 && t[t.length - 1]) || 6 !== op[0] && 2 !== op[0])) {
                                    _ = 0;
                                    continue;
                                }
                                if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
                                    _.label = op[1];
                                    break;
                                }
                                if (6 === op[0] && _.label < t[1]) {
                                    _.label = t[1], t = op;
                                    break;
                                }
                                if (t && _.label < t[2]) {
                                    _.label = t[2], _.ops.push(op);
                                    break;
                                }
                                t[2] && _.ops.pop(), _.trys.pop();
                                continue;
                            }
                            op = body.call(thisArg, _);
                        } catch (e) {
                            op = [ 6, e ], y = 0;
                        } finally {
                            f = t = 0;
                        }
                        if (5 & op[0]) throw op[1];
                        return {
                            value: op[0] ? op[1] : void 0,
                            done: !0
                        };
                    }([ n, v ]);
                };
            }
        };
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.ListCoupon = void 0;
        var AppBase_1 = __webpack_require__(3), SiteEnum_1 = __webpack_require__(1), ItemType_1 = __webpack_require__(27), Core_1 = __webpack_require__(2), Config_1 = __webpack_require__(5), CouponRoutes_1 = __webpack_require__(11), Tao_1 = __webpack_require__(44), ListCoupon = function(_super) {
            function ListCoupon() {
                var _this = null !== _super && _super.apply(this, arguments) || this;
                return _this.appName = "ListCoupon", _this.rules = new Map([ [ SiteEnum_1.SiteEnum.TaoBao, /s.taobao.com\/search/i ], [ SiteEnum_1.SiteEnum.TMall, /list.tmall.com\/search_product.htm/i ] ]), 
                _this.selectorList = [], _this.atrack = [], _this.key = "list_coupon_info_", _this;
            }
            return __extends(ListCoupon, _super), ListCoupon.prototype.loader = function() {}, 
            Object.defineProperty(ListCoupon, "style", {
                get: function() {
                    return "    \n    .PanTools-tb-box-area {position: absolute;top: 10px;right: 5px;z-index: 9999;}\n    .PanTools-jd-box-area {position: absolute;top: 235px;left: 10px;z-index: 9999;}  \n    .PanTools-jdcs-box-area {position: absolute;top: 5px;right: 0px;z-index: 9999;}\n    .PanTools-box-info-translucent{opacity: .33;}\n    .PanTools-box-info, .PanTools-box-info:hover, .PanTools-box-info:visited {text-decoration: none!important;}\n    .PanTools-box-wait{cursor:pointer}\n    .PanTools-box-info {width: auto!important;height: auto!important;padding: 6px 8px!important;font-size: 12px;color: #fff!important;border-radius: 15px;cursor: pointer;}\n    .PanTools-jd-box-info-default, .PanTools-tb-box-info-default, .PanTools-jdcs-box-info-default{background: #3186fd!important;}\n    .PanTools-box-info-empty {color: #000!important;background: #ccc!important;}\n    .PanTools-box-info-find {background: #ff0036!important;}\n    .PanTools-box-done{position:relative}\n    ";
                },
                enumerable: !1,
                configurable: !0
            }), ListCoupon.prototype.run = function() {
                switch (this.site) {
                  case SiteEnum_1.SiteEnum.TaoBao:
                    this.selectorList.push(".items .item"), this.atrack.push(".pic a", ".title a"), 
                    this.itemType = ItemType_1.ItemType.TaoBao;
                    break;

                  case SiteEnum_1.SiteEnum.TMall:
                    this.selectorList.push(".product"), this.atrack.push(".productImg-wrap a", ".productTitle a"), 
                    this.itemType = ItemType_1.ItemType.TaoBao;
                }
                var that = this;
                this.initStyle(), Core_1.Core.autoLazyload((function() {
                    try {
                        return null != $ && null != jQuery;
                    } catch (e) {
                        return !1;
                    }
                }), (function() {
                    return that.initSearchEvent();
                }), 3), Core_1.Core.background((function() {
                    return that.initSearch(that);
                }), 3), Core_1.Core.background((function() {
                    return that.initQuery();
                }), 4);
            }, ListCoupon.prototype.initStyle = function() {
                Core_1.Core.addStyle(ListCoupon.style);
            }, ListCoupon.prototype.initSearchEvent = function() {
                var that = this;
                try {
                    $(document).on("click", ".PanTools-" + that.itemType + "-box-area", (function() {
                        var $this = $(this);
                        $this.hasClass("PanTools-box-wait") ? that.queryInfo(this) : $this.hasClass("PanTools-box-info-translucent") ? $this.removeClass("PanTools-box-info-translucent") : $this.addClass("PanTools-box-info-translucent");
                    }));
                } catch (e) {
                    Core_1.Core.background((function() {
                        $(".PanTools-" + that.itemType + "-box-area").click((function() {
                            var $this = $(this);
                            $this.hasClass("PanTools-box-wait") ? that.queryInfo(this) : $this.hasClass("PanTools-box-info-translucent") ? $this.removeClass("PanTools-box-info-translucent") : $this.addClass("PanTools-box-info-translucent");
                        }));
                    }));
                }
            }, ListCoupon.prototype.initSearch = function(that) {
                that.selectorList.forEach((function(e, i) {
                    $(e).each((function(index, ele) {
                        that.initSearchItem(ele);
                    }));
                }));
            }, ListCoupon.prototype.initSearchItem = function(selector) {
                var _a, _b, _c, _d, _e, _f, $dom = $(selector);
                if (!$dom.hasClass("PanTools-box-done")) {
                    $dom.addClass("PanTools-box-done");
                    var itemId = null !== (_b = null !== (_a = $dom.attr("data-id")) && void 0 !== _a ? _a : $dom.data("sku")) && void 0 !== _b ? _b : "";
                    if (Tao_1.Tao.isVailidItemId(itemId) || (itemId = null !== (_d = null !== (_c = $dom.attr("data-itemid")) && void 0 !== _c ? _c : $dom.data("spu")) && void 0 !== _d ? _d : ""), 
                    !Tao_1.Tao.isVailidItemId(itemId)) if ($dom.attr("href")) itemId = location.protocol + $dom.attr("href"); else {
                        var $a = $dom.find("a");
                        if (!$a.length) return;
                        itemId = null !== (_e = $a.attr("data-nid")) && void 0 !== _e ? _e : "", Tao_1.Tao.isVailidItemId(itemId) || (itemId = $a.hasClass("j_ReceiveCoupon") && $a.length > 1 ? location.protocol + $($a[1]).attr("href") : location.protocol + $a.attr("href"));
                    }
                    if (!Tao_1.Tao.isVailidItemId(itemId) && itemId.indexOf("http") > -1) {
                        var res = null !== (_f = /item.jd.com\/(.*?).html/i.exec(itemId)) && void 0 !== _f ? _f : [];
                        itemId = res.length > 0 ? res[1] : "";
                    }
                    Tao_1.Tao.isValidTaoId(itemId) && (this.initBoxHtml($dom, itemId), this.initTagClass($dom, itemId));
                }
            }, ListCoupon.prototype.initTagClass = function(target, itemId) {
                this.atrack.forEach((function(e) {
                    target.find(e).hasClass("PanTools-item-" + itemId) || target.find(e).addClass("PanTools-item-" + itemId);
                }));
            }, ListCoupon.prototype.initBoxHtml = function(target, itemId) {
                target.append('<div class="PanTools-' + this.itemType + '-box-area PanTools-box-wait" data-itemid="' + itemId + '"><a class="PanTools-box-info PanTools-' + this.itemType + '-box-info-default" title="\u70b9\u51fb\u67e5\u8be2">\u5f85\u67e5\u8be2</a></div>');
            }, ListCoupon.prototype.initQuery = function() {
                var _this = this;
                $(".PanTools-box-wait").each((function(index, ele) {
                    _this.queryInfo(ele);
                }));
            }, ListCoupon.prototype.queryInfo = function(target) {
                return __awaiter(this, void 0, void 0, (function() {
                    var that, $this, itemId, couponInfo;
                    return __generator(this, (function(_a) {
                        switch (_a.label) {
                          case 0:
                            return that = this, ($this = $(target)).removeClass("PanTools-box-wait"), itemId = $this.data("itemid"), 
                            (couponInfo = Config_1.Config.get("" + that.key + itemId)) ? (that.initCouponInfo(itemId, couponInfo, target), 
                            [ 3, 3 ]) : [ 3, 1 ];

                          case 1:
                            return [ 4, CouponRoutes_1.CouponRoutes.couponQuery(itemId, that.itemType).then((function(couponInfoResult) {
                                if (0 != couponInfoResult.code) {
                                    var couponInfo_1 = couponInfoResult.data;
                                    Config_1.Config.set("" + that.key + itemId, couponInfo_1, 14400), that.initCouponInfo(itemId, couponInfo_1, target);
                                } else that.showQueryEmpty($this);
                            })) ];

                          case 2:
                            _a.sent(), _a.label = 3;

                          case 3:
                            return [ 2 ];
                        }
                    }));
                }));
            }, ListCoupon.prototype.initCouponInfo = function(itemId, couponInfo, target) {
                var _a, $this = $(target);
                if ((null === (_a = null == couponInfo ? void 0 : couponInfo.coupons) || void 0 === _a ? void 0 : _a.length) > 0) {
                    var coupon = couponInfo.coupons[0];
                    this.showQueryFind($this, coupon.coupon_price);
                } else this.showQueryEmpty($this);
                this.showItemUrl(itemId, null == couponInfo ? void 0 : couponInfo.item_url);
            }, ListCoupon.prototype.showItemUrl = function(itemId, itemUrl) {
                void 0 !== itemUrl && "" !== itemUrl && Core_1.Core.Click(".PanTools-item-" + itemId, (function() {
                    return Core_1.Core.open(itemUrl), !1;
                }));
            }, ListCoupon.prototype.showQueryFind = function(selector, couponMoney) {
                selector.html('<a target="_blank" class="PanTools-box-info PanTools-box-info-find" title="\u5207\u6362\u900f\u660e\u5ea6">' + couponMoney + "\u5143\u5238</a>");
            }, ListCoupon.prototype.showQueryEmpty = function(selector) {
                selector.addClass("PanTools-box-info-translucent"), selector.html('<a href="javascript:void(0);" class="PanTools-box-info PanTools-box-info-empty" title="\u5207\u6362\u900f\u660e\u5ea6">\u6682\u65e0\u4f18\u60e0</a>');
            }, ListCoupon;
        }(AppBase_1.AppBase);
        exports.ListCoupon = ListCoupon;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.Tao = void 0;
        var Tao = function() {
            function Tao() {}
            return Tao.isVailidItemId = function(itemId) {
                if (!itemId) return !1;
                var itemIdInt = parseInt(itemId);
                return itemIdInt.toString() == itemId && itemIdInt > 1e4;
            }, Tao.isValidTaoId = function(itemId) {
                return !!itemId && (!!Tao.isNumber(itemId) || (!(itemId.indexOf("http") >= 0) || !(!this.isTaoBaoDetailPage(itemId) && !itemId.includes("//detail.ju.taobao.com/home.htm"))));
            }, Tao.isTaoBaoDetailPage = function(url) {
                return url.includes("//item.taobao.com/item.htm") || url.includes("//detail.tmall.com/item.htm") || url.includes("//chaoshi.detail.tmall.com/item.htm") || url.includes("//detail.tmall.hk/hk/item.htm");
            }, Tao.isNumber = function(a) {
                return !Array.isArray(a) && a - parseFloat(a) >= 0;
            }, Tao;
        }();
        exports.Tao = Tao;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var extendStatics, __extends = this && this.__extends || (extendStatics = function(d, b) {
            return extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            }, extendStatics(d, b);
        }, function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __);
        });
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.MovieParse = void 0;
        var AppBase_1 = __webpack_require__(3), SiteEnum_1 = __webpack_require__(1), Core_1 = __webpack_require__(2), Url_1 = __webpack_require__(9), Menu_1 = __webpack_require__(46), MovieParse = function(_super) {
            function MovieParse() {
                var _this = _super.call(this) || this;
                return _this.appName = "Movie", _this.rules = new Map([ [ SiteEnum_1.SiteEnum.IQiYi, /iqiyi|iq\.com/i ], [ SiteEnum_1.SiteEnum.YouKu, /youku\.com/i ], [ SiteEnum_1.SiteEnum.LeShi, /\.le\.com/i ], [ SiteEnum_1.SiteEnum.Tencent_V, /v\.qq/i ], [ SiteEnum_1.SiteEnum.TuDou, /tudou\.com/i ], [ SiteEnum_1.SiteEnum.MangGuo, /mgtv\.com/i ], [ SiteEnum_1.SiteEnum.SoHu, /sohu\.com/i ], [ SiteEnum_1.SiteEnum.PPTV, /pptv\.com/i ], [ SiteEnum_1.SiteEnum.BiliBili, /bilibili\.com\/bangumi/i ], [ SiteEnum_1.SiteEnum.Shuma, /tv\.shuma\.ink/i ] ]), 
                _this._unique = !1, _this;
            }
            return __extends(MovieParse, _super), MovieParse.prototype.loader = function() {}, 
            MovieParse.prototype.run = function() {
                if (this.site === SiteEnum_1.SiteEnum.Shuma) this.InitPlayer(); else Core_1.Core.inIframe() || Menu_1.Menu.Init([ {
                    itemType: Menu_1.MenuItemType.Func,
                    title: "Vip",
                    tip: "Vip\u89c6\u9891\u89e3\u6790",
                    callback: function() {
                        Core_1.Core.open("http://tv.shuma.ink?url=" + encodeURIComponent(Core_1.Core.currentUrl()).replace("iq.com", "iqiyi.com"));
                    }
                } ]);
            }, MovieParse.prototype.InitPlayer = function() {
                var url = Url_1.Url.get("url");
                url && (url = decodeURIComponent(url), $("#url").val(url), /bilibili\.com\/bangumi/i.test(url) && $($("#jk").find("option")[4]).attr("selected", !0)), 
                unsafeWindow.window.play && url && unsafeWindow.window.play();
            }, MovieParse;
        }(AppBase_1.AppBase);
        exports.MovieParse = MovieParse;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.MenuItemType = exports.MenuPosition = exports.MenuItem = exports.Menu = void 0, 
        __webpack_require__(47);
        var Core_1 = __webpack_require__(2), Menu = function() {
            function Menu() {}
            return Menu.Init = function(items, position) {
                void 0 === position && (position = MenuPosition.LeftCenter);
                var $html = $("<div/>"), $ul = $("<ul/>");
                $html.addClass("parts-floating"), $html.attr("data-position", position.toString()), 
                $html.attr("data-theme", "panel_theme_round_solid"), $html.attr("data-size", "auto"), 
                $html.attr("data-state", "true"), $html.attr("data-moveState", "true"), items.forEach((function(item) {
                    var _a, _b, $li_html = $("<li/>");
                    if (item.itemType == MenuItemType.Href || item.itemType == MenuItemType.Func) {
                        var aTag = "\u55b5";
                        item.title && (aTag = item.title), $li_html.append("<span>" + aTag + "</span>"), 
                        item.itemType == MenuItemType.Func ? $li_html.click((function() {
                            item.callback && item.callback();
                        })) : $li_html.click((function() {
                            Core_1.Core.open(item.url);
                        }));
                    }
                    if (item.title && $li_html.attr("title", null !== (_a = item.tip) && void 0 !== _a ? _a : item.title), 
                    item.itemType == MenuItemType.ToolTip) {
                        var content = null !== (_b = item.tip) && void 0 !== _b ? _b : "";
                        new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/).test(content) && (content = '<img src="' + item.tip + '">'), 
                        $li_html.append('<div class="tooltip parts-li-tip" style="background-color: #000;color: #fff"><div class="tooltip-inner">' + content + "</div></div>");
                    }
                    $li_html.attr("data-type", MenuItemType[item.itemType]), item.itemType == MenuItemType.Top && $li_html.click((function() {
                        $("body,html,nav.top_nav ~ .section").animate({
                            scrollTop: 0
                        }, 500);
                    })), $li_html.appendTo($ul);
                })), $ul.appendTo($html), $("body").append($html);
            }, Menu;
        }();
        exports.Menu = Menu;
        var MenuPosition, MenuItemType, MenuItem = function MenuItem() {};
        exports.MenuItem = MenuItem, function(MenuPosition) {
            MenuPosition.LeftCenter = "left-center";
        }(MenuPosition = exports.MenuPosition || (exports.MenuPosition = {})), function(MenuItemType) {
            MenuItemType[MenuItemType.ToolTip = 0] = "ToolTip", MenuItemType[MenuItemType.Href = 1] = "Href", 
            MenuItemType[MenuItemType.Func = 2] = "Func", MenuItemType[MenuItemType.Top = 3] = "Top";
        }(MenuItemType = exports.MenuItemType || (exports.MenuItemType = {}));
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0), _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_cjs_js_Menu_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15), _node_modules_css_loader_dist_cjs_js_Menu_css__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(_node_modules_css_loader_dist_cjs_js_Menu_css__WEBPACK_IMPORTED_MODULE_1__), options = {
            insert: "head",
            singleton: !1
        };
        _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_Menu_css__WEBPACK_IMPORTED_MODULE_1___default.a, options);
        __webpack_exports__.default = _node_modules_css_loader_dist_cjs_js_Menu_css__WEBPACK_IMPORTED_MODULE_1___default.a.locals || {};
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var extendStatics, __extends = this && this.__extends || (extendStatics = function(d, b) {
            return extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            }, extendStatics(d, b);
        }, function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __);
        }), __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
            return new (P || (P = Promise))((function(resolve, reject) {
                function fulfilled(value) {
                    try {
                        step(generator.next(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function rejected(value) {
                    try {
                        step(generator.throw(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function step(result) {
                    result.done ? resolve(result.value) : function adopt(value) {
                        return value instanceof P ? value : new P((function(resolve) {
                            resolve(value);
                        }));
                    }(result.value).then(fulfilled, rejected);
                }
                step((generator = generator.apply(thisArg, _arguments || [])).next());
            }));
        }, __generator = this && this.__generator || function(thisArg, body) {
            var f, y, t, g, _ = {
                label: 0,
                sent: function() {
                    if (1 & t[0]) throw t[1];
                    return t[1];
                },
                trys: [],
                ops: []
            };
            return g = {
                next: verb(0),
                throw: verb(1),
                return: verb(2)
            }, "function" == typeof Symbol && (g[Symbol.iterator] = function() {
                return this;
            }), g;
            function verb(n) {
                return function(v) {
                    return function step(op) {
                        if (f) throw new TypeError("Generator is already executing.");
                        for (;_; ) try {
                            if (f = 1, y && (t = 2 & op[0] ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 
                            0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                            switch (y = 0, t && (op = [ 2 & op[0], t.value ]), op[0]) {
                              case 0:
                              case 1:
                                t = op;
                                break;

                              case 4:
                                return _.label++, {
                                    value: op[1],
                                    done: !1
                                };

                              case 5:
                                _.label++, y = op[1], op = [ 0 ];
                                continue;

                              case 7:
                                op = _.ops.pop(), _.trys.pop();
                                continue;

                              default:
                                if (!(t = _.trys, (t = t.length > 0 && t[t.length - 1]) || 6 !== op[0] && 2 !== op[0])) {
                                    _ = 0;
                                    continue;
                                }
                                if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
                                    _.label = op[1];
                                    break;
                                }
                                if (6 === op[0] && _.label < t[1]) {
                                    _.label = t[1], t = op;
                                    break;
                                }
                                if (t && _.label < t[2]) {
                                    _.label = t[2], _.ops.push(op);
                                    break;
                                }
                                t[2] && _.ops.pop(), _.trys.pop();
                                continue;
                            }
                            op = body.call(thisArg, _);
                        } catch (e) {
                            op = [ 6, e ], y = 0;
                        } finally {
                            f = t = 0;
                        }
                        if (5 & op[0]) throw op[1];
                        return {
                            value: op[0] ? op[1] : void 0,
                            done: !0
                        };
                    }([ n, v ]);
                };
            }
        };
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.DetailCoupon = void 0;
        var AppBase_1 = __webpack_require__(3), SiteEnum_1 = __webpack_require__(1), CouponRoutes_1 = __webpack_require__(11), Url_1 = __webpack_require__(9), ItemType_1 = __webpack_require__(27), Config_1 = __webpack_require__(5);
        __webpack_require__(49);
        var Core_1 = __webpack_require__(2), Constant_1 = __webpack_require__(8), DetailCoupon = function(_super) {
            function DetailCoupon() {
                var _this = _super.call(this) || this;
                return _this.appName = "DetailCoupon", _this.rules = new Map([ [ SiteEnum_1.SiteEnum.TaoBao, /taobao\.com/i ], [ SiteEnum_1.SiteEnum.TMall, /detail\.tmall\.com|hk\/item.htm/i ], [ SiteEnum_1.SiteEnum.JingDong, /(item|npcitem|pcitem|pro|pro\.m|story\.m|prodev\.m|prodev)\.(jd|yiyaojd)\.(com|hk)\/.*\.htm/i ] ]), 
                _this.key = "list_coupon", _this._unique = !1, _this;
            }
            return __extends(DetailCoupon, _super), DetailCoupon.prototype.loader = function() {}, 
            DetailCoupon.prototype.run = function() {
                var _a, _b;
                switch (this.site) {
                  case SiteEnum_1.SiteEnum.TaoBao:
                    this.selector = "ul.tb-meta", this.id = Url_1.Url.get("id"), this.type = ItemType_1.ItemType.TaoBao;
                    break;

                  case SiteEnum_1.SiteEnum.TMall:
                    this.selector = ".tm-fcs-panel", this.id = Url_1.Url.get("id"), this.type = ItemType_1.ItemType.TaoBao;
                    break;

                  case SiteEnum_1.SiteEnum.JingDong:
                    this.selector = ".summary-top", this.id = null === (_b = null === (_a = unsafeWindow.window.pageConfig) || void 0 === _a ? void 0 : _a.product) || void 0 === _b ? void 0 : _b.skuid, 
                    this.type = ItemType_1.ItemType.JingDong;
                }
                this.Init();
            }, DetailCoupon.prototype.Init = function() {
                return __awaiter(this, void 0, void 0, (function() {
                    var that, couponInfo, _this = this;
                    return __generator(this, (function(_a) {
                        switch (_a.label) {
                          case 0:
                            return that = this, this.id ? (couponInfo = Config_1.Config.get("" + this.key + this.id)) ? (this.initConpon(couponInfo), 
                            [ 3, 3 ]) : [ 3, 1 ] : [ 3, 4 ];

                          case 1:
                            return [ 4, CouponRoutes_1.CouponRoutes.couponQuery(this.id, this.type).then((function(couponInfoResult) {
                                if (0 != couponInfoResult.code) {
                                    var couponInfo_1 = couponInfoResult.data;
                                    Config_1.Config.set("" + that.key + that.id, couponInfo_1, 14400);
                                }
                                _this.initConpon(couponInfoResult.data);
                            })) ];

                          case 2:
                            _a.sent(), _a.label = 3;

                          case 3:
                            return [ 3, 5 ];

                          case 4:
                            this.initConpon(!1), _a.label = 5;

                          case 5:
                            return [ 2 ];
                        }
                    }));
                }));
            }, DetailCoupon.prototype.initConpon = function(coupons) {
                var _a, _b, coupon = !1;
                if ((null === (_b = null === (_a = coupons) || void 0 === _a ? void 0 : _a.coupons) || void 0 === _b ? void 0 : _b.length) > 0 && (coupon = coupons.coupons[0]), 
                coupons.union_url && Config_1.Config.getLocalStorage(Constant_1.Constant.CouponJumpFlag, !0)) {
                    var k = Constant_1.Constant.CouponJump + "_" + this.id;
                    0 == Config_1.Config.get(k, 0) && (Config_1.Config.set(k, 1, 300), unsafeWindow.window.location.href = coupons.union_url);
                }
                $(this.selector).after($(DetailCoupon.couponBody(coupon))), coupon && $("#coupon-link").click((function() {
                    Core_1.Core.open(coupon.coupon_link);
                }));
            }, DetailCoupon.couponBody = function(data) {
                return data ? '<div class="PanTools-Coupon-Wrap"><div class="coupon"><div class="coupon-info"><div class="coupon-desc">\u4f18\u60e0\u5238 ' + data.coupon_price + '\u5143</div><div class="coupon-info2">' + data.coupon_info + '</div></div><a class="coupon-get" id="coupon-link" href="javascript:void">\u7acb\u5373\u9886\u53d6</a></div><div class="coupon-time">\u4f18\u60e0\u5238\u6709\u6548\u671f\uff1a' + data.coupon_end_time + "</div>" : '<div class="PanTools-Coupon-Wrap"><div class="coupon"><div class="coupon-info"><div class="coupon-desc">\u672a\u67e5\u8be2\u5230\u4f18\u60e0\u5238</div><div class="coupon-info2">';
            }, DetailCoupon;
        }(AppBase_1.AppBase);
        exports.DetailCoupon = DetailCoupon;
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0), _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_cjs_js_Detail_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(16), _node_modules_css_loader_dist_cjs_js_Detail_css__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(_node_modules_css_loader_dist_cjs_js_Detail_css__WEBPACK_IMPORTED_MODULE_1__), options = {
            insert: "head",
            singleton: !1
        };
        _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_Detail_css__WEBPACK_IMPORTED_MODULE_1___default.a, options);
        __webpack_exports__.default = _node_modules_css_loader_dist_cjs_js_Detail_css__WEBPACK_IMPORTED_MODULE_1___default.a.locals || {};
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var extendStatics, __extends = this && this.__extends || (extendStatics = function(d, b) {
            return extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            }, extendStatics(d, b);
        }, function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __);
        }), __importDefault = this && this.__importDefault || function(mod) {
            return mod && mod.__esModule ? mod : {
                default: mod
            };
        };
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.Gwd = void 0;
        var AppBase_1 = __webpack_require__(3), SiteEnum_1 = __webpack_require__(1);
        __webpack_require__(51);
        var CouponRoutes_1 = __webpack_require__(11), Core_1 = __webpack_require__(2), sweetalert2_1 = __importDefault(__webpack_require__(19)), Logger_1 = __webpack_require__(4), Gwd_1 = __webpack_require__(52), BrowerType_1 = __webpack_require__(20), Gwd = function(_super) {
            function Gwd() {
                var _this = null !== _super && _super.apply(this, arguments) || this;
                return _this.appName = "GWD", _this.rules = new Map([ [ SiteEnum_1.SiteEnum.TMall, /detail.tmall.com\/item.htm/i ], [ SiteEnum_1.SiteEnum.TaoBao, /item.taobao.com/i ], [ SiteEnum_1.SiteEnum.JingDong, /item.jd.(com|hk)\/[0-9]*.html/i ], [ SiteEnum_1.SiteEnum.SuNing, /product.suning.com/i ], [ SiteEnum_1.SiteEnum.Vp, /detail.vip.com/i ] ]), 
                _this;
            }
            return __extends(Gwd, _super), Gwd.prototype.loader = function() {}, Gwd.prototype.run = function() {
                var _a, _this = this;
                switch (this.site) {
                  case SiteEnum_1.SiteEnum.TaoBao:
                  case SiteEnum_1.SiteEnum.TMall:
                    this.selector = [ "#J_DetailMeta", "#detail" ];
                    break;

                  case SiteEnum_1.SiteEnum.JingDong:
                    this.selector = [ ".product-intro" ];
                    break;

                  case SiteEnum_1.SiteEnum.SuNing:
                    this.selector = [ ".proinfo-container" ];
                    break;

                  case SiteEnum_1.SiteEnum.Vp:
                    this.selector = [ ".FW-product.clearfix" ];
                    break;

                  default:
                    this.selector = [];
                }
                (null === (_a = this.selector) || void 0 === _a ? void 0 : _a.length) > 0 && this.initHtml().then((function(res) {
                    res && ($("#PanTools-outside").show(), _this.initHistoryData());
                }));
            }, Gwd.prototype.initHtml = function() {
                var that = this;
                return new Promise((function(resolve) {
                    var res = !1, selector = "";
                    that.selector.forEach((function(item) {
                        $(item).length && (res = !0, selector = item);
                    })), res ? ($(selector).append(that.getHistoryHtml()), resolve(!0)) : setTimeout(that.initHtml, 2e3);
                }));
            }, Gwd.prototype.getHistoryHtml = function() {
                return '<div id="PanTools-outside">\n                    <div class="PanTools-outside-coupons">\n                        <div class="PanTools-outside-coupons-qrcode"><img id="PanTools-outside-coupons-qrcode-img" width="200px" alt="\u626b\u7801\u5165\u7fa4\u4eab\u53d7\u66f4\u591a\u798f\u5229" src="https://pan.shuma.ink/img/code333.png"/></div>\n                        <div class="PanTools-outside-coupons-title">                            \n                            <a class="vip-plugin-outside-coupons-button quan-none" style="display: none" href="javascript:void(0)">\u626b\u7801\u5165\u7fa4\u4eab\u53d7\u66f4\u591a\u798f\u5229</a>\n                        </div>\n                        <div class="PanTools-outside-coupons-action"></div>\n                    </div>\n                    <div id="PanTools-outside-history" class="PanTools-outside-history">\n                        <div class="PanTools-outside-chart-container"></div>\n                        <p class="PanTools-outside-history-tip"></p>\n                    </div>    \n                </div>';
            }, Gwd.prototype.initHistoryData = function() {
                var _this = this;
                $(".PanTools-outside-history-tip").html("\u5386\u53f2\u4ef7\u683c\u67e5\u8be2\u4e2d"), 
                CouponRoutes_1.CouponRoutes.historyQuery(Core_1.Core.url).then((function(data) {
                    if (Logger_1.Logger.debug(data), "price_status" in data) $(".PanTools-outside-chart-container").html('<div id="PanTools-outside-chart-container-line"></div>'), 
                    echarts.init(document.getElementById("PanTools-outside-chart-container-line")).setOption(_this.getChartOption(data)), 
                    $(".PanTools-outside-history-tip").html(""); else if ("is_ban" in data && 1 == data.is_ban) {
                        sweetalert2_1.default.fire({
                            icon: "info",
                            html: "\u5386\u53f2\u4ef7\u683c\u67e5\u8be2\u5f02\u5e38,\u662f\u5426\u6253\u5f00\u9a8c\u8bc1\u9875\u9762\u8fdb\u884c\u9a8c\u8bc1?",
                            showCloseButton: !0,
                            showCancelButton: !0,
                            focusConfirm: !1,
                            confirmButtonText: "\u597d\u7684",
                            cancelButtonText: "\u6682\u65f6\u5148\u4e0d\u9a8c\u8bc1"
                        }).then((function(res) {
                            res.isConfirmed && Core_1.Core.open("https://browser.gwdang.com/slider/verify.html?fromUrl=" + encodeURIComponent(Core_1.Core.url)), 
                            sweetalert2_1.default.close(res);
                        }));
                        var browser = Core_1.Core.getBrowser();
                        if (Logger_1.Logger.debug(browser), browser == BrowerType_1.BrowerType.Edge || browser == BrowerType_1.BrowerType.Edg) {
                            "99999999999" != $(".swal2-container").css("z-index") && $(".swal2-container").css("z-index", "99999999999");
                        }
                    }
                }));
            }, Gwd.prototype.getChartOption = function(data) {
                var _a, _b, chartOption, analysisTxt = data.analysis.tip, min = data.analysis.promo_days[data.analysis.promo_days.length - 1], text = analysisTxt + "\uff1a{red|\uffe5" + min.price + "} ( {red|" + min.date + "} )", maxData = new Gwd_1.PromoInfo, minData = new Gwd_1.PromoInfo;
                minData.price = Number.MAX_SAFE_INTEGER, minData.humanPrice = Number.MAX_SAFE_INTEGER, 
                maxData.humanPrice = Number.MIN_SAFE_INTEGER;
                chartOption = {
                    title: {
                        left: "center",
                        subtext: text,
                        subtextStyle: {
                            color: "#000",
                            rich: {
                                red: {
                                    color: "red"
                                }
                            }
                        }
                    },
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            type: "cross"
                        },
                        formatter: function(params) {
                            params = params[0];
                            var date = new Date(parseInt(params.name)), year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate(), monthStr = month.toString(), dayStr = day.toString();
                            return month < 10 && (monthStr = "0" + month), day < 10 && (dayStr = "0" + day), 
                            "\u65e5\u671f\uff1a" + year + "-" + monthStr + "-" + dayStr + "<br/>\u4ef7\u683c\uff1a\uffe5" + params.value[1].toFixed(2) + ("" == params.value[2] ? "" : "<br/>" + params.value[2]);
                        }
                    },
                    grid: {
                        left: 0,
                        right: 20,
                        top: 50,
                        bottom: 10,
                        containLabel: !0
                    },
                    xAxis: {
                        type: "time"
                    },
                    yAxis: {
                        type: "value"
                    },
                    series: [ {
                        type: "line",
                        step: "end",
                        data: function(data) {
                            var _a, l = [];
                            if (data.store.length > 0) {
                                var storeData = data.store[0];
                                data.store.length > 1 && (storeData = data.store[1]);
                                var couponsMap_1 = {};
                                (null === (_a = data.promo) || void 0 === _a ? void 0 : _a.length) > 0 && data.promo.forEach((function(v) {
                                    couponsMap_1.hasOwnProperty(1e3 * v.time) || (couponsMap_1[1e3 * v.time] = v);
                                }));
                                var now_1 = storeData.all_line_begin_time;
                                storeData.all_line.forEach((function(v) {
                                    v > maxData.humanPrice && (maxData.humanPrice = v, maxData.time = now_1 / 1e3), 
                                    v < minData.humanPrice && (minData.humanPrice = v, minData.time = now_1 / 1e3);
                                    var promo = new Gwd_1.PromoInfo;
                                    promo.msg = new Gwd_1.MsgInfo, couponsMap_1.hasOwnProperty(now_1) && (Logger_1.Logger.debug("yes"), 
                                    promo = couponsMap_1[now_1]);
                                    var p = {
                                        name: now_1,
                                        value: [ now_1, v, couponsMap_1.hasOwnProperty(now_1) ? promo.msg.coupon ? promo.msg.promotion : promo.msg.coupon : "" ]
                                    };
                                    l.push(p), now_1 += 864e5;
                                })), Logger_1.Logger.debug(couponsMap_1);
                            }
                            return Logger_1.Logger.debug(maxData), Logger_1.Logger.debug(minData), l;
                        }(data),
                        showSymbol: !1,
                        symbolSize: 3,
                        lineStyle: {
                            width: 1.5,
                            color: "#ff0036"
                        }
                    } ]
                };
                chartOption.yAxis = {
                    min: 10 * Math.floor(.9 * minData.humanPrice / 10),
                    max: 10 * Math.ceil(1.1 * maxData.humanPrice / 10)
                };
                var line = null === (_a = chartOption.series) || void 0 === _a ? void 0 : _a.pop();
                return line.markPoint = {
                    data: [ {
                        value: minData.humanPrice,
                        coord: [ 1e3 * minData.time, minData.humanPrice ],
                        name: "\u6700\u5c0f\u503c",
                        itemStyle: {
                            color: "green"
                        }
                    }, {
                        value: maxData.humanPrice,
                        coord: [ 1e3 * maxData.time, maxData.humanPrice ],
                        name: "\u6700\u5927\u503c",
                        itemStyle: {
                            color: "red"
                        }
                    } ]
                }, null === (_b = chartOption.series) || void 0 === _b || _b.push(line), chartOption.dataZoom = [ {
                    type: "inside",
                    start: 0,
                    end: 100
                } ], chartOption;
            }, Gwd;
        }(AppBase_1.AppBase);
        exports.Gwd = Gwd;
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0), _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_cjs_js_GWD_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(17), _node_modules_css_loader_dist_cjs_js_GWD_css__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(_node_modules_css_loader_dist_cjs_js_GWD_css__WEBPACK_IMPORTED_MODULE_1__), options = {
            insert: "head",
            singleton: !1
        };
        _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_GWD_css__WEBPACK_IMPORTED_MODULE_1___default.a, options);
        __webpack_exports__.default = _node_modules_css_loader_dist_cjs_js_GWD_css__WEBPACK_IMPORTED_MODULE_1___default.a.locals || {};
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.StoreInfo = exports.AnalysisInfo = exports.PromoDaysInfo = exports.PromoInfo = exports.MsgInfo = exports.GwdAction = exports.GwdModel = void 0;
        var GwdModel = function GwdModel() {};
        exports.GwdModel = GwdModel;
        var GwdAction = function GwdAction() {};
        exports.GwdAction = GwdAction;
        var MsgInfo = function MsgInfo() {};
        exports.MsgInfo = MsgInfo;
        var PromoInfo = function PromoInfo() {
            this.price = 0, this.time = 0;
        };
        exports.PromoInfo = PromoInfo;
        var PromoDaysInfo = function PromoDaysInfo() {};
        exports.PromoDaysInfo = PromoDaysInfo;
        var AnalysisInfo = function AnalysisInfo() {};
        exports.AnalysisInfo = AnalysisInfo;
        var StoreInfo = function StoreInfo() {};
        exports.StoreInfo = StoreInfo;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var extendStatics, __extends = this && this.__extends || (extendStatics = function(d, b) {
            return extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            }, extendStatics(d, b);
        }, function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __);
        });
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.GwdClean = void 0;
        var AppBase_1 = __webpack_require__(3), SiteEnum_1 = __webpack_require__(1), Core_1 = __webpack_require__(2), GwdClean = function(_super) {
            function GwdClean() {
                var _this = null !== _super && _super.apply(this, arguments) || this;
                return _this.appName = "Gwd_Clean", _this.rules = new Map([ [ SiteEnum_1.SiteEnum.Gwd, /browser\.gwdang\.com\/slider\/verify/i ] ]), 
                _this;
            }
            return __extends(GwdClean, _super), GwdClean.prototype.loader = function() {}, GwdClean.prototype.run = function() {
                $("title").text("\u7f51\u76d8\u5de5\u5177\u7bb1-\u5386\u53f2\u4ef7\u683c\u63a5\u53e3\u9a8c\u8bc1"), 
                $(".texts").remove(), $(".header_new1").remove(), Core_1.Core.autoLazyload((function() {
                    return $(".slider_tips").length > 0;
                }), (function() {
                    $(".slider_tips").text("PanTools");
                }), .5);
            }, GwdClean.prototype.getNav = function() {
                return '\n<ul class="zoom login_box fr ml-30">\n    <li><a href="/app/extension?from=verify" target="_blank">\u4e0b\u8f7d\u6bd4\u4ef7\u5de5\u5177</a></li>\n</ul>\n<ul class="nav_new zoom fr">    \n    <li><a href="/promotion/zhi" target="_blank">\u503c\u5f97\u4e70</a></li> \n    <li><a href="/crc64/promotion/price" target="_blank">\u5386\u53f2\u6700\u4f4e\u4ef7</a></li>\n    <li><a href="/promotion/coupon" target="_blank">\u8585\u7f8a\u6bdb</a></li>\n</ul>      \n        ';
            }, GwdClean;
        }(AppBase_1.AppBase);
        exports.GwdClean = GwdClean;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var extendStatics, __extends = this && this.__extends || (extendStatics = function(d, b) {
            return extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            }, extendStatics(d, b);
        }, function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __);
        });
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.DownCleaner = void 0;
        var AppBase_1 = __webpack_require__(3), SiteEnum_1 = __webpack_require__(1), DownCleaner = function(_super) {
            function DownCleaner() {
                var _this = null !== _super && _super.apply(this, arguments) || this;
                return _this.appName = "DownCleaner", _this.rules = new Map([ [ SiteEnum_1.SiteEnum.Pc6, /www\.pc6\.com\/.*\/.*\.html/i ], [ SiteEnum_1.SiteEnum.DuoTe, /www\.duote\.com\/.*\/.*\.html/i ], [ SiteEnum_1.SiteEnum.DangXia, /www\.downxia\.com\/.*\/.*\.html/i ], [ SiteEnum_1.SiteEnum.DongPo, /www.uzzf.com\/.*\/.*\.html/i ], [ SiteEnum_1.SiteEnum.HuaJun, /www\.onlinedown\.net\/soft\/.*\.htm/i ], [ SiteEnum_1.SiteEnum.TaiPingYang, /dl|www\.pconline\.com\.cn\/download\/.*\.html/i ], [ SiteEnum_1.SiteEnum.XiXiSoft, /.cr173\.com\/soft|game|xixi|android|mac|qudong|aztv\/.*\.html/i ] ]), 
                _this.selectorRules = new Map([ [ SiteEnum_1.SiteEnum.Pc6, [ ".downnow", "#gaosuxiazai", ".ul_Address h3:first" ] ], [ SiteEnum_1.SiteEnum.DuoTe, [ "#highDown", ".downFastListBox" ] ], [ SiteEnum_1.SiteEnum.DangXia, [ ".gaosu_down_div", ".bendown", "h3:contains(\u9ad8\u901f\u4e0b\u8f7d)" ] ], [ SiteEnum_1.SiteEnum.DongPo, [ ".f-uzzf-down", ".topdown" ] ], [ SiteEnum_1.SiteEnum.XiXiSoft, [ ".downnowgaosu", "[data=viewAds]", "[data=viewAds1]" ] ], [ SiteEnum_1.SiteEnum.HuaJun, [ ".gaosu", ".spdown-btn a", "h4:contains(\u9ad8\u901f\u4e0b\u8f7d)" ] ], [ SiteEnum_1.SiteEnum.TaiPingYang, [ "#JhsBtn", ".bzxz2", ".bzxz", ".bzDowm1", "#ad790413" ] ] ]), 
                _this;
            }
            return __extends(DownCleaner, _super), DownCleaner.prototype.loader = function() {}, 
            DownCleaner.prototype.run = function() {
                var rules = this.selectorRules.get(this.site);
                rules && rules.forEach((function(e) {
                    $(e).remove();
                }));
            }, DownCleaner;
        }(AppBase_1.AppBase);
        exports.DownCleaner = DownCleaner;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var extendStatics, __extends = this && this.__extends || (extendStatics = function(d, b) {
            return extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            }, extendStatics(d, b);
        }, function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __);
        });
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.Options = void 0;
        var AppBase_1 = __webpack_require__(3), SiteEnum_1 = __webpack_require__(1), Config_1 = __webpack_require__(5), AriaConfig_1 = __webpack_require__(56), Constant_1 = __webpack_require__(8), Alert_1 = __webpack_require__(7), Options = function(_super) {
            function Options() {
                var _this = null !== _super && _super.apply(this, arguments) || this;
                return _this.appName = "Options", _this.rules = new Map([ [ SiteEnum_1.SiteEnum.Shuma, /settings\.shuma\.ink/i ] ]), 
                _this;
            }
            return __extends(Options, _super), Options.prototype.loader = function() {}, Options.prototype.run = function() {
                Options.systemInit(), Options.ariaInit();
            }, Options.systemInit = function() {
                $("#panparse-warning").hide(), $("#panparse-version").text(Config_1.Config.env.script.version), 
                $("#panparse-title").text("[\u6570\u7801\u5c0f\u7ad9]\u8d85\u7ea7SVIP\u591a\u529f\u80fd\u5de5\u5177\u7bb1");
            }, Options.ariaInit = function() {
                Options.ariaShow(), $("#ariaSetting").submit((function(e) {
                    e.preventDefault(), Options.ariaSave();
                })), $("#ariaReset").click((function() {
                    $("#rpcUrl").val(""), $("#rpcToken").val(""), $("#rpcDir").val(""), Alert_1.Alert.info("\u91cd\u7f6e\u6210\u529f");
                }));
            }, Options.ariaShow = function() {
                var _ariaSetting = Config_1.Config.get(Constant_1.Constant.AriaConfig, {
                    rpcUrl: "http://localhost:6800/jsonrpc",
                    rpcDic: "D:\\Aria",
                    rpcToken: ""
                });
                $("#rpcUrl").val(null == _ariaSetting ? void 0 : _ariaSetting.rpcUrl), $("#rpcToken").val(null == _ariaSetting ? void 0 : _ariaSetting.rpcToken), 
                $("#rpcDir").val(null == _ariaSetting ? void 0 : _ariaSetting.rpcDic);
            }, Options.ariaSave = function() {
                var ariaSetting = new AriaConfig_1.AriaConfig;
                ariaSetting.rpcUrl = $("#rpcUrl").val(), ariaSetting.rpcToken = $("#rpcToken").val(), 
                ariaSetting.rpcDic = $("#rpcDir").val(), Config_1.Config.set(Constant_1.Constant.AriaConfig, ariaSetting), 
                Alert_1.Alert.info("\u4fdd\u5b58\u6210\u529f");
            }, Options;
        }(AppBase_1.AppBase);
        exports.Options = Options;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.AriaConfig = void 0;
        var AriaConfig = function AriaConfig() {};
        exports.AriaConfig = AriaConfig;
    } ]);
}));
