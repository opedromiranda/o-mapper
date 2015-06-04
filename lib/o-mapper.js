
function mapProperty(src, key, settings) {
    var result;
    // if key is not set, search for same key of schema
    var k = settings.key || key;

    if (Array.isArray(k)) {
        // multiple keys selected

        var values = [];

        k.forEach(function (srcKey) {
            values.push(src[srcKey]);
        });

        // handler is required to process multiple inputs
        if (!settings.handler) {
            throw new Error('handler is required for multiple keys');
        }

        result = settings.handler.apply(null, values);
    } else {
        result = src[k];

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
