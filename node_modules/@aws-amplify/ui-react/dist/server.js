'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ThemeStyle = require('./ThemeStyle-DA2-Clfz.js');
var React = require('react');
var ui = require('@aws-amplify/ui');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);

const ComponentStyle = ({ theme, componentThemes = [], ...rest }) => {
    if (!theme || !componentThemes.length) {
        return null;
    }
    const cssText = ui.createComponentCSS({
        theme,
        components: componentThemes,
    });
    return React__namespace.createElement(ThemeStyle.Style, { ...rest, cssText: cssText });
};
ComponentStyle.displayName = 'ComponentStyle';

const GlobalStyle = ({ styles, ...rest }) => {
    if (!styles) {
        return null;
    }
    const cssText = ui.createGlobalCSS(styles);
    return React__namespace.createElement(ThemeStyle.Style, { ...rest, cssText: cssText });
};
GlobalStyle.displayName = 'GlobalStyle';

exports.ThemeStyle = ThemeStyle.ThemeStyle;
Object.defineProperty(exports, "createComponentClasses", {
    enumerable: true,
    get: function () { return ui.createComponentClasses; }
});
Object.defineProperty(exports, "createTheme", {
    enumerable: true,
    get: function () { return ui.createTheme; }
});
Object.defineProperty(exports, "defaultDarkModeOverride", {
    enumerable: true,
    get: function () { return ui.defaultDarkModeOverride; }
});
Object.defineProperty(exports, "defaultTheme", {
    enumerable: true,
    get: function () { return ui.defaultTheme; }
});
Object.defineProperty(exports, "defineComponentTheme", {
    enumerable: true,
    get: function () { return ui.defineComponentTheme; }
});
exports.ComponentStyle = ComponentStyle;
exports.GlobalStyle = GlobalStyle;
