/* Collection of classes used for counting occurrences of keys and sorting maps */

// Helper function to avoid having to check this everywhere
var getFromMapIfExists = function(mapToGetFrom, key) {
    if(mapToGetFrom.has(key)) { return mapToGetFrom.get(key); }
    else { return null; }
};

/**
* Handles tracking count of occurrences of a value, and can return
* keys ordered by an optional comparator.
*/
var UniqueItemCountRanker = function() {
    var countByKey = new Map();

    var getCount = function(key) {
      let count = getFromMapIfExists(countByKey, key);
      if(!count) { return 0; }
      else { return count; }
    };
    var size = function() { return countByKey.size; }
    return {
        size: size,
        getCount: getCount,
        count: function(key) {
            var count = getCount(key) + 1;
            countByKey.set(key, count);
            return count;
        },
        getKeysOrderedByCount: function(count, comparator) {
            let sortedKeys = MapSorter.getSortedKeysFromMap(countByKey, comparator);
            if(count < 1 || count >= size) {
                return sortedKeys;
            } else {
                return sortedKeys.slice(0, count);
            }
        }
    };
};

class SortComparator {
    constructor() {
        if(!this.compare) {
            throw new Error("Must implement compare(value1, value2) method");
        }
    }
}

class AscendingSortComparator extends SortComparator {

    compare(value1, value2) {
        if(value1 < value2) { return -1; }
        else if(value1 > value2) { return 1; }
        else { return 0; }
   }
}

class DescendingSortComparator extends SortComparator {
    compare(value1, value2) {
        if(value1 > value2) { return -1; }
        else if(value1 < value2) { return 1; }
        else { return 0; }
    }
}

/**
 * Sorting comparators can provide more complex object comparing ones
 * for now just Ascending and Descending. Provides compare method that will
 * compare two values and provide negative for v1 < v2, positive for v1 > v2,
 * or 0 for equality. This equates to: negative v1 should be before v2,
 * positive v1 should be after v2, or equality.
 */
var SortComparators = (function() {
    return {
         Ascending: new AscendingSortComparator(),
         Descending: new DescendingSortComparator()
    };
})();

/**
 * Takes a Map object to sort and an optional comparator(defaults to Ascending), then
 * returns an ordered list of keys from the map based off using the comparator to compare
 * values.
 */
var MapSorter = (function() { // provides a sorted list of keys from
    // Performs binary search to find insertion index
    var binarySearchInsertionIndex = function(valueMap, orderedKeys, value, comparator) {
        if(orderedKeys.length == 0) { return 0; }

        if(!comparator) { comparator = SortComparators.Ascending; }
        let highIndex = orderedKeys.length - 1;
        let lowIndex = 0;
        let stepCount = 0;
        while(highIndex >= lowIndex) {
            let index = lowIndex + Math.floor((highIndex - lowIndex)/2);
            let orderedItemValue = getFromMapIfExists(valueMap, orderedKeys[index]);
            let comparison = comparator.compare(value, orderedItemValue);
            if(comparison > 0) {
                lowIndex = index + 1;
            } else if(comparison < 0) {
                highIndex = index - 1;
            } else {
                return index;
            }
        }
        return lowIndex;
    };

    // for debugging purposes
    var printList = function(mapToSort, keys) {
        if(!keys || 0 == keys.length) {
            console.log("EMPTY []");
            return;
        }

        let output = "[";
        for(let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if(0 != i) { output += ", "; }
            output += key + "(" + mapToSort.get(key) + ")";
        }
        output += "]";
        console.log(output);
    };

    return {
        // takes mapToSort and optional comparator(defaults to Ascending), returns ordered list of keys
        getSortedKeysFromMap: function(mapToSort, comparator) {
            let orderedKeys = [];
            for(const [key, value] of mapToSort.entries()) {
                let value = mapToSort.get(key)
                let insertionIndex = binarySearchInsertionIndex(
                    mapToSort,
                    orderedKeys,
                    value,
                    comparator
                );
                orderedKeys.splice(
                    insertionIndex,
                    0,
                    key
                );
            }
            return orderedKeys;
        }
    };
})();

module.exports = {
    MapSorter: MapSorter,
    SortComparators: SortComparators,
    UniqueItemCountRanker: UniqueItemCountRanker
};