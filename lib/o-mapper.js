function getProperty(src, propertyPath) {
    var result;
    var nextPropertyKey;
    var nextValue;

    if (Array.isArray(propertyPath) === false) {
        // property path is in dot notation, must be converted to array
        propertyPath = propertyPath.split('.');
    }

    // get next property to be evaluated and remove it from path
    nextPropertyKey = propertyPath.shift();

    nextValue = src[nextPropertyKey];

    if (propertyPath.length > 0 && nextValue !== undefined) {
        // keep recursing until end of path is reached
        result = getProperty(nextValue, propertyPath);
    } else {
        // end of propertyPath or undefined value was reached, set result as value of property
        result = nextValue;
    }

    return result;
}

function mapProperty(src, key, settings) {
    var result;
    // if key is not set, search for same key of schema
    var k = settings.key || key;

    if (Array.isArray(k)) {
        // multiple keys selected

        var values = [];

        k.forEach(function (srcKey) {
            values.push(getProperty(src, srcKey));
        });

        // handler is required to process multiple inputs
        if (!settings.handler) {
            throw new Error('handler is required for multiple keys');
        }

        result = settings.handler.apply(null, values);
    } else {
        result = getProperty(src, k);

        if (!result) {

            // throw error if nonexistant property is required
            if (settings.required) {
                throw new Error('field ' + k + ' is required and missing');
            }

            // set default value if existing
            if (settings.hasOwnProperty('default')) {
                result = settings.default;
            }
        }

        // call hanlder function if existing
        if (settings.hasOwnProperty('handler')) {
            result = settings.handler(result);
        }
    }

    return result;
}

function omapper(src, schema) {
    var dest = {};
    Object.keys(schema).forEach(function (key) {
        dest[key] = mapProperty(src, key, schema[key]);
    });

    return dest;
}

module.exports = omapper;
