modules.exports = function () {
    global.defineCachedGetter = function (proto, propertyName, fn) {
        Object.defineProperty(proto, propertyName, {
            get: function () {
                if (this === proto || this == undefined) {
                    return;
                }

                let result = fn.call(this, this);

                Object.defineProperty(this, propertyName, {
                    value: result,
                    configurable: true,
                    enumerable: false
                });

                return result;
            },
            configurable: true,
            enumerable: false
        });
    };

    global.defineGetter = function (proto, propertyName, fn) {
        Object.defineProperty(proto, propertyName, {
            get: fn,
            configurable: true,
            enumerable: false
        });
    };

    global.calculateBodyCost = function (body) {
        return _.sum(_.map(function (part) { return BODYPART_COST[part]; }, body));
    };
};
