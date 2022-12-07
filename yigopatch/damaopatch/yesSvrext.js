import jstz from 'jstz';
import { DummyDocument as document, lodash as $ } from 'yes-common';
import { YIUI } from 'yes-core/dist/YIUI-base';
import Encrypt from 'yes-core/dist/utils/encrypt';
import Base64 from 'base-64';
import { logined, logouted } from 'yes-core/dist/actions';
import qs from 'qs';
import objecthash from 'object-hash';
import getDispatcher from 'yes-core/dist/dispatchers';
import { getSession, setSession, setUserInfo, setServerDate, setParas } from "yes-core/dist/session";
import { YESException } from 'yes-core/dist/exceptions';
import pako from 'pako';
import newFetch from 'yes-core/dist/fetch';


import {Svr, View } from 'yes-core';

Svr.Request = (function () {
    var transData = function (data) {
        if (data == null) {
            return data;
        }

        var json = $.toJSON(data);
        return data;

        // 传送数据 长度 大于 20000 开启压缩   20000长度的数据传输在30K 左右
        if (json.length < 20000) {
            return data;
        }
        var postData = {};
        postData.yigoData = YIUI.Base64.encode64(pako.gzip(json));
        return postData;
    };
    var d_msg = {
        count: 0,
        time: 0,
        size: 0,
    };
    var getMSG = function (time, size) {
        var svr_msg = Svr.MSG = Svr.MSG || d_msg;
        svr_msg.count++;
        svr_msg.time += time;
        svr_msg.size += size;
        console.log(svr_msg);
    };
    var convertResult = function (msg) {
        var ret = msg.data;
        if (msg.type === YIUI.JavaDataType.STR_USER_DATATABLE) {
            ret = YIUI.DataUtil.fromJSONDataTable(ret);
        } else if (msg.type === YIUI.JavaDataType.STR_USER_DOCUMENT) {
            ret = YIUI.DataUtil.fromJSONDoc(ret);
        }
        return ret;
    };
    const requestPromises = {

    };
    var Return = {
        upload: async function (file, options = {}, fileName) {
            const url = Svr.SvrMgr.AttachURL;
            let data = new FormData();
            data.append('file', file, fileName || file.name);
            for (let key in options) {
                data.append(key, options[key]);
            }
            const request = {
                method: 'post',
                credentials: 'include',
                body: data,
            }
            const response = await fetch(url, request);
            let result = await response.json();
            if (result.success == null || result.success) {
                result = convertResult(result);
            } else {
                if (data.error.error_code === -2146828281) {//超时
                    getDispatcher().dispatch(logouted());
                }
                throw new YESException(data.error.error_code, '', data.error.error_info);
            }
            return result;
        },
        getData: async function (params, url, convert = true) {
            return await Return.getAsyncData(url || Svr.SvrMgr.ServletURL, params, convert);
        },
        getSyncData: async function (url, params, convert = true, useCache = true) {
            const requestKey = objecthash(params);
            let requestPromise = null;
            let requestOwner = true;
            if (requestPromises[requestKey]) {
                console.log('Request Cache hit!');
                requestPromise = requestPromises[requestKey];
                requestOwner = false;
            } else {
                params.mode = params.mode || 2;
                var returnObj = null;
                var locale = window.navigator.language || window.navigator.browserLanguage;
                var tz = jstz.determine();
                var timezone = tz.name();
                // var timezone='Indian/Maldives';
                params.locale = locale;
                params.timezone = timezone;
                const clientID = getSession();
                if (clientID) {
                    params.clientID = clientID;
                }
                // try {
                var request = {
                    method: 'post',
                    credentials: 'include',
                    body: qs.stringify(transData(params)),
                    headers: {
                        'Content-type': "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                };
                // var response = await fetch(url, request);
                let qq = async () => {
                    var response = await newFetch(fetch(url, request), 20000);
                    return await response.json();
                }
                requestPromise = qq();
                requestPromises[requestKey] = requestPromise;
            }
            try {
                var data = await requestPromise;
            } finally {
                if (requestOwner) {
                    if (useCache) {
                        setTimeout(() => {
                            delete requestPromises[requestKey];
                        }, 2000);
                    } else {
                        delete requestPromises[requestKey];
                    }
                }
            }
            // params.mode = 1;
            // var returnObj = null;
            // var locale = window.navigator.language || window.navigator.browserLanguage;
            // var tz = jstz.determine();
            // var timezone = tz.name();
            // params.locale = locale;
            // params.timezone = timezone;
            // params.clientID = getSession();
            // // try {
            // var request = {
            //     method: 'post',
            //     body: qs.stringify(transData(params)),
            //     headers: {
            //         'Content-type': "application/x-www-form-urlencoded; charset=UTF-8",
            //     },
            // };
            // var response = await fetch(url, request);
            // var data = await response.json();
            // getData(request, data);
            if (data.success == null || data.success) {
                data = convert ? convertResult(data) : data.data;
            } else {
                if (data.error.error_code === -2146828286 || data.error.error_code === -2146828281) {//超时
                    getDispatcher().dispatch(logouted());
                }
                throw new YESException(data.error.error_code, '', data.error.error_info);
            }
            return data;
        },

        getAsyncData: async function (url, params, sucCallback, errorCallback) {
            const result = await Return.getSyncData(url, params, sucCallback, errorCallback);
            // console.log(result);
            return result;
            //             params.mode = 1;
            //             var returnObj = null;
            //             var locale = window.navigator.language || window.navigator.browserLanguage;
            //             var tz = jstz.determine();
            //             var timezone = tz.name();
            //             params.locale = locale;
            //             params.timezone = timezone;

            //             var old_t = new Date().getTime();

            //             $.ajax({
            //                 contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            //                 type: "post",
            //                 url: url,
            //                 data: transData(params),
            //                 async: true,
            //                 dataType: 'json',
            //                 beforeSend: function () {
            //                     $(".loading").show();
            //                     $(".image").css({
            //                         top: $(window).height() / 2,
            //                         left: $(window).width() / 2
            //                     });
            //                 },
            //                 success: function (msg) {
            //                     if ($.isFunction(sucCallback)) {
            //                         returnObj = sucCallback(msg.data);
            //                     } else {
            //                         returnObj = msg.data;
            //                     }

            //                     var cur_t = new Date().getTime();
            //                     var t = cur_t - old_t;
            //                     getMSG(t, 0);
            //                 },
            //                 complete: function (xhr) {
            //                     xhr = null;
            //                     $(".loading").hide();
            //                 },
            //                 error: function (xhr, textStatus, exception) {
            //                     $(".loading").hide();
            //                 	if(xhr.readyState == 0) {
            //                 		$.error("请求状态未初始化，检查服务器连接！");
            //                 		return;
            //                 	}
            //                     if ($.isFunction(errorCallback)) {
            //                         //重载错误提示方法
            //                     } else {
            //                         var error = xhr.responseJSON.error;
            //                         var jsonObj = xhr.responseJSON.data;
            //                         if (jsonObj) {
            //                             for (var i = 0; i < jsonObj.length; i++) {
            //                                 var changedObj = jsonObj[i];
            //                                 var dealCmd = changedObj["cmd"];
            //                                 var pFormID = changedObj["pFormID"];
            //                                 var resultObj = changedObj["value"];
            //                                 if (dealCmd == "diff") {
            //                                     YIUI.UIUtil.diffForm(pFormID, resultObj);
            //                                 }
            //                             }
            //                         }

            // //                        var showMessage = 'Error occured: error_code=' + error.error_code + ', error_info=' + error.error_info;
            //                         var showMessage = error.error_info;
            //                         $.error(showMessage);

            // //		                var dialog = $("<div></div>").attr("id", "error_dialog");
            // //		                var showMessage = 'Error occured: error_code=' + error.error_code + ', error_info=' + error.error_info;
            // //		                dialog.modalDialog(showMessage, {title: "错误", showClose: true, type: "error", height: 200, width: 400});
            //                         return;
            //                     }
            //                 }
            //             });
            //             return returnObj;
        },
    };
    return Return;
})();