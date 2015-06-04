# O-Mapper
[![Build Status](https://travis-ci.org/opedromiranda/o-mapper.svg)](https://travis-ci.org/opedromiranda/o-mapper)


## What
Validation and convertion of given object to another.

Like this:
```json
{
    "firstName": "Toby",
    "lastName": "Flenderson",
    "birthYear": 1971
}
```
to this:
```json
{
    "full_name": "Toby Flenderson",
    "birth_year": 1971,
    "is_annoying": true
}
```


## How
```javascript
var omapper = require('o-mapper');
var schema = {
    full_name: {
        key: ['firstName', 'lastName'],
        handler: function(first, last) {
            return first + last;
        }
    },
    birth_year: {
        key: 'birthYear',
        required: true
    },
    is_annoying: {
        default: true
    }
};
var input = {
    firstName: "Toby",
    lastName: "Flenderson",
    birthYear: '1971'
};

var result = omapper(input, schema);
```

### Version
0.1

License
----

MIT
