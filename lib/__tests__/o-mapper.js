var chai = require('chai');
var expect = chai.expect;

var omapper = require('../o-mapper.js');

describe('o-mapper', function () {

    it('should map simple properties', function () {
        var schema = {
            prop1: {
                key: 'property1'
            },
            prop2: {
                key: 'property2'
            },
            prop3: {
                key: 'property3'
            }
        };

        var input = {
            property1: 'how',
            property2: 'you',
            property3: 'doin'
        };

        var expectedResult = {
            prop1: 'how',
            prop2: 'you',
            prop3: 'doin'
        };

        var result = omapper(input, schema);

        expect(result).to.deep.equal(expectedResult);
    });

    it('should set default values if value doesn\'t exist in source object', function () {
        var schema = {
            prop1: {
                key: 'property1'
            },
            prop2: {
                key: 'property2'
            },
            prop3: {
                key: 'property3',
                default: 'doin'
            }
        };

        var input = {
            property1: 'how',
            property2: 'you'
        };

        var expectedResult = {
            prop1: 'how',
            prop2: 'you',
            prop3: 'doin'
        };

        var result = omapper(input, schema);

        expect(result).to.deep.equal(expectedResult);
    });

    it('should set undefined if value doesn\'t exist in source object', function () {
        var schema = {
            prop1: {
                key: 'property1'
            },
            prop2: {
                key: 'property2'
            },
            prop3: {
                key: 'property3'
            }
        };

        var input = {
            property1: 'how',
            property2: 'you'
        };

        var expectedResult = {
            prop1: 'how',
            prop2: 'you',
            prop3: undefined
        };

        var result = omapper(input, schema);

        expect(result).to.deep.equal(expectedResult);
    });

    it('should throw an error if required value doesn\'t exist', function () {
        var schema = {
            prop1: {
                key: 'property1'
            },
            prop2: {
                key: 'property2'
            },
            prop3: {
                key: 'property3',
                required: true
            }
        };

        var input = {
            property1: 'how',
            property2: 'you'
        };

        expect(function () {
            omapper(input, schema);
        }).to.throw('field property3 is required and missing');
    });

    it('should not throw an error if required value exists but is falsy', function() {
        var schema = {
            prop1: {
                key: 'property1'
            },
            prop2: {
                key: 'property2'
            },
            prop3: {
                key: 'property3',
                required: true
            },
            prop4: {
                key: 'property4',
                required: true
            },
            prop5: {
                key: 'property5',
                required: true
            }
        };

        var input = {
            property1: 'how',
            property2: 'you',
            property3: false,
            property4: 0,
            property5: ''
        };

        var expectedResult = {
            prop1: 'how',
            prop2: 'you',
            prop3: false,
            prop4: 0,
            prop5: ''
        };

        var result = omapper(input, schema);

        expect(result).to.deep.equal(expectedResult);
    });

    it('should call handler function for single input key', function () {
        var schema = {
            prop1: {
                key: 'property1',
                handler: function (value) {
                    return value + ', and you can\'t teach that';
                }
            }
        };
        var input = {
            property1: '6ft tall'
        };
        var expectedResult = {
            prop1: '6ft tall, and you can\'t teach that'
        };
        var result = omapper(input, schema);

        expect(result).to.deep.equal(expectedResult);
    });

    it('should call handler for multiple input keys', function () {
        var schema = {
            prop1: {
                key: ['property1', 'property2', 'property3', 'property4', 'property5'],
                handler: function (p1, p2, p3, p4, p5) {
                    return p1 + p2 + p3 + p4 + p5;
                }
            }
        };
        var input = {
            property1: 'S',
            property2: 'A',
            property3: 'W',
            property4: 'F',
            property5: 'T'
        };
        var expectedResult = {
            prop1: 'SAWFT'
        };
        var result = omapper(input, schema);

        expect(result).to.deep.equal(expectedResult);
    });

    it('should throw an error if a handler isn\'t set for multiple input keys', function () {
        var schema = {
            prop1: {
                key: ['property1', 'property2', 'property3', 'property4', 'property5']
            }
        };
        var input = {
            property1: 'S',
            property2: 'A',
            property3: 'W',
            property4: 'F',
            property5: 'T'
        };

        expect(function () {
            omapper(input, schema);
        }).to.throw('handler is required for multiple keys');
    });

    it('should use same key name as schema if not specified', function () {
        var schema = {
            property1: {},
            property2: {},
            property3: {}
        };

        var input = {
            property1: 'how',
            property2: 'you',
            property3: 'doin'
        };

        var expectedResult = {
            property1: 'how',
            property2: 'you',
            property3: 'doin'
        };

        var result = omapper(input, schema);

        expect(result).to.deep.equal(expectedResult);
    });

    it('should get a deeper value specified by dot notation', function () {
        var schema = {
            prop1: {
                key: 's.a.w.f.t',
                required: true
            }
        };
        var input = {
            s: {
                a: {
                    w: {
                        f: {
                            t: 'SAWFT'
                        }
                    }
                }
            }
        };
        var expectedResult = {
            prop1: 'SAWFT'
        };

        var result = omapper(input, schema);

        expect(result).to.deep.equal(expectedResult);
    });

    it('should get multiple deeper values specified by dot notation and call handler', function () {
        var schema = {
            prop1: {
                key: ['ba.da.boom', 'ba.da.bing'],
                handler: function (badaboom, badabing) {
                    return badaboom + ' ' + badabing;
                }
            }
        };
        var input = {
            ba: {
                da: {
                    boom: 'badaboom',
                    bing: 'badabing'
                }
            }
        };
        var expectedResult = {
            prop1: 'badaboom badabing'
        };

        var result = omapper(input, schema);

        expect(result).to.deep.equal(expectedResult);
    });

    it('should throw an error if a required deep value is missing', function () {
        var schema = {
            prop1: {
                key: 's.a.w.f.t',
                required: true
            }
        };
        var input = {
            s: {
                a: {}
            }
        };

        expect(function () {
            omapper(input, schema);
        }).to.throw('field s.a.w.f.t is required and missing');
    });
});
