"use strict";
//NativeScript modules
var applicationModule = require("application");
var _isInit = false;
var _AndroidApplication = applicationModule.android;
var _act;
var mCallbackManager;
var loginManager;
function init(loginBehavior) {
    try {
        //fb initialization
        com.facebook.FacebookSdk.sdkInitialize(_AndroidApplication.context.getApplicationContext());
    }
    catch (e) {
        console.log("nativescript-facebook-login: The plugin could not find the android library, try to clean the android platform");
    }
    mCallbackManager = com.facebook.CallbackManager.Factory.create();
    loginManager = com.facebook.login.LoginManager.getInstance();
    //This solve the case when user changes accounts error code 304
    loginManager.logOut();
    if (loginBehavior) {
        loginManager = loginManager.setLoginBehavior(loginBehavior);
    }
    if (mCallbackManager && loginManager) {
        _isInit = true;
        return true;
    }
    else {
        return false;
    }
}
exports.init = init;
function registerCallback(successCallback, cancelCallback, failCallback) {
    if (_isInit) {
        var act = _AndroidApplication.foregroundActivity || _AndroidApplication.startActivity;
        _act = act;
        loginManager.registerCallback(mCallbackManager, new com.facebook.FacebookCallback({
            onSuccess: function (result) {
                successCallback(result);
            },
            onCancel: function () {
                cancelCallback();
            },
            onError: function (e) {
                failCallback(e);
            }
        }));
        var previousResult = act.onActivityResult;
        //Overriding Activity onActivityResult method to send it to the callbackManager
        act.onActivityResult = function (requestCode, resultCode, data) {
            act.onActivityResult = previousResult;
            mCallbackManager.onActivityResult(requestCode, resultCode, data);
        };
    }
}
exports.registerCallback = registerCallback;
function logInWithPublishPermissions(permissions) {
    if (_isInit) {
        var javaPermissions = java.util.Arrays.asList(permissions);
        //Start the login process
        loginManager.logInWithPublishPermissions(_act, javaPermissions);
    }
}
exports.logInWithPublishPermissions = logInWithPublishPermissions;
function logInWithReadPermissions(permissions) {
    if (_isInit) {
        var javaPermissions = java.util.Arrays.asList(permissions);
        //Start the login process
        loginManager.logInWithReadPermissions(_act, javaPermissions);
    }
}
exports.logInWithReadPermissions = logInWithReadPermissions;
