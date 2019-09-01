const expect = require('chai').expect;

const GeoLocationRanker = require('./mapSorting.js');

var roundRobinAddExpectedCountByKey = function(expectedCountByKey, counter) {
    let remainingCountByKey = Object.assign({}, expectedCountByKey);
    let hasMore = true;
    while(hasMore) {
        hasMore = false;
        Object.keys(remainingCountByKey).forEach(function(key) {
            let value = remainingCountByKey[key];
            if(value != 0) {
                counter.count(key);
                remainingCountByKey[key] = value - 1;
                hasMore = hasMore || value - 1 > 0;
            }
        });
    }
};

var getMapSize = function(mapToSize) {
    let count = 0;
    Object.keys(mapToSize).forEach(function(key) {
        count++;
    });
    return count;
};

/*
 * perform expects on size and compare expected counts and actual counts
 */
var compareExpectedCount = function(expectedCountByKey, counter) {
    expect(getMapSize(expectedCountByKey) == counter.size()).to.equal(true);
    Object.keys(expectedCountByKey).forEach(function(key) {
        expect(expectedCountByKey[key]).to.equal(counter.getCount(key));
    });
};

/*
 * Just need to compare if comparator is being properly adhered to
 */
var compareOrderedListToExpected = function(expectedValueByKey, orderedKeys, comparator) {
    expect(orderedKeys.length).to.equal(expectedValueByKey.size);
    for(let i = 1; i < orderedKeys.length; i++) {
        let keyOfPrevious = orderedKeys[i - 1];
        let key = orderedKeys[i];
        expect(
            comparator.compare(
                expectedValueByKey.get(keyOfPrevious),
                expectedValueByKey.get(key)
            ) > 0
        ).to.equal(false);
    }
};

describe('Test mapSorting module', function() {
    describe('Test UniqueItemCountRanker', function() {
        it('test size', function() {
            let expectedCountByKey = {
                "i1": 1,
                "i2": 1,
                "i3": 3,
                "i4": 1,
                "i5": 2
            };
            let counter = new GeoLocationRanker.UniqueItemCountRanker();
            roundRobinAddExpectedCountByKey(expectedCountByKey, counter);
            expect(counter.size()).to.equal(getMapSize(expectedCountByKey));
        });
        it('test overall tracking', function() {
            let expectedCountByKey = {
                "i1": 10,
                "i2": 3,
                "i3": 6,
                "i4": 1,
                "i5": 7
            };
            let counter = new GeoLocationRanker.UniqueItemCountRanker();
            roundRobinAddExpectedCountByKey(expectedCountByKey, counter);
            compareExpectedCount(expectedCountByKey, counter);
        });
    });

    describe('Test MapSorter', function() {
        it('test single item', function() {
            let testMap = new Map();
            testMap.set("i1", 10);
            let comparator = GeoLocationRanker.SortComparators.Descending;
            let orderedKeys = GeoLocationRanker.MapSorter.getSortedKeysFromMap(testMap, comparator);
            compareOrderedListToExpected(testMap, orderedKeys, comparator);
        });
        it('test already ordered list', function() {
            let testMap = new Map();
            testMap.set("i1", 7);
            testMap.set("i2", 5);
            testMap.set("i3", 4);
            testMap.set("i4", 2);
            let comparator = GeoLocationRanker.SortComparators.Descending;
            let orderedKeys = GeoLocationRanker.MapSorter.getSortedKeysFromMap(testMap, comparator);
            compareOrderedListToExpected(testMap, orderedKeys, comparator);
        });
        it('test opposite of desired order list', function() {
            let testMap = new Map();
            testMap.set("i1", 2);
            testMap.set("i2", 4);
            testMap.set("i3", 5);
            testMap.set("i4", 7);
            let comparator = GeoLocationRanker.SortComparators.Descending;
            let orderedKeys = GeoLocationRanker.MapSorter.getSortedKeysFromMap(testMap, comparator);
            compareOrderedListToExpected(testMap, orderedKeys, comparator);
        });
        it('test normal input', function() {
            let testMap = new Map();
            testMap.set("i1", 20);
            testMap.set("i2", 4);
            testMap.set("i3", 7);
            testMap.set("i4", 3);
            testMap.set("i5", 1);
            testMap.set("i6", 18);
            testMap.set("i7", 6);
            testMap.set("i8", 7);
            testMap.set("i9", 15);
            testMap.set("i10", 4);
            testMap.set("i11", 12);
            testMap.set("i12", 11);
            let comparator = GeoLocationRanker.SortComparators.Descending;
            let orderedKeys = GeoLocationRanker.MapSorter.getSortedKeysFromMap(testMap, comparator);
            compareOrderedListToExpected(testMap, orderedKeys, comparator);
        });
    });
});