function getProperty(src, propertyPath) {
    var result;
    var nextPropertyKey;
    var nextValue;

    if (Array.isArray(propertyPath) === false) {
        // property path is converted to array to extract next key and value
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

function mapProperty(src, key, options) {
    var result;

    // either get the value from specified key
    // or get the value belonging in the same key as the schema key
    var k = options.key || key;

    if (Array.isArray(k)) {
        // multiple keys selected

        var values = k.map(function (srcKey) {
            return getProperty(src, srcKey);
        });

        // handler is required to process multiple inputs
        if (!options.handler) {
            throw new Error('handler is required for multiple keys');
        }

        result = options.handler.apply(null, values);
    } else {
        result = getProperty(src, k);

        if (typeof result === 'undefined') {

            // throw error if nonexistant property is required
            if (options.required) {
                throw new Error('field ' + k + ' is required and missing');
            }

            // set default value if existing
            if (options.hasOwnProperty('default')) {
                result = options.default;
            }
        }

        // call handler function if existing
        if (options.hasOwnProperty('handler')) {
            result = options.handler(result);
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
