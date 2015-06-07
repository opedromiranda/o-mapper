# O-Mapper
[![Build Status](https://travis-ci.org/opedromiranda/o-mapper.svg)](https://travis-ci.org/opedromiranda/o-mapper)


## What
Validation and conversion of a given object to another.

Like this:
```json
{
    "first_name": "Toby",
    "last_name": "Flenderson",
    "birth_date": "1971-04-01",
    "job_name": "HR",
    "extra_data": {
        "orders": []
    }
}
```
to this:
```javascript
{
    "full_name": "Toby Flenderson",
    "job": "HR",
    "birth_date": new Date("1971-04-01"),
    "orders": []
}
```


## How
```javascript
var omapper = require('o-mapper');

var schema = { ... };
var input = { ... };

var result = omapper(input, schema);
```

## Schema
Schemas are objects that will dictate what the final object will contain and where to get the values from the source object.
Each key from the schema represents a key of the final object.

```javascript
var schema = {

    // key property specifies what key to look for in the source object
    job: {
        key: 'job_name'
    },

    // when multiple keys are selected, an handler is required to process the multiple values
    full_name: {
        key: ['fist_name', 'last_name']
        handler: function(first, last) {
            return first + ' ' + last;
        }
    },

    // handlers can also be used for single values
    // the key property can be omitted if it matches the final object
    // a property can be set as required
    birth_date: {
        handler: function (bd) {
            return new Date(bd);
        },
        required: true
    },

    // dot notation can also be used
    // default values can be set in case property doesn't exist
    orders: {
        key: 'data.orders',
        default: []
    }
}
```

License
----

MIT
