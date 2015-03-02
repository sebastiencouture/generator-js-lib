(function universalModuleDefinition(root, factory) {
    "use strict";

    if(typeof exports === 'object' && typeof module === 'object') {
        // Node module exports
        module.exports = factory();
    }
    else if(typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    }
    else if(typeof exports === 'object') {
        // CommonJS style that does not support module.exports
        exports['<%= exportsName %>'] = factory();
    }
    else {
        // Global
        root['<%= exportsName %>'] = factory();
    }
}(this, function () {
    "use strict";

    return {};
}));