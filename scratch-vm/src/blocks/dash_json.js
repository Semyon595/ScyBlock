const Cast = require('../util/cast');

class DashJSONBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    getPrimitives () {
        return {
            json_array_empty: this.arrayEmpty,
            json_array_item_of: this.arrayItemOf,
            json_array_item_no_of: this.arrayItemNoOf,
            json_contains: this.contains,
            json_length: this.length,
            json_array_in_front_of: this.arrayAddFront,
            json_array_behind: this.arrayAddBack,
            json_array_at: this.arrayInsertAt,
            json_array_split: this.arraySplit,
            json_array_delete: this.arrayDelete,
            json_array_replace: this.arrayReplace,
            json_object_empty: this.objectEmpty,
            json_object_split: this.objectSplit,
            json_object_item_of: this.objectItemOf,
            json_object_contains_key: this.objectContainsKey,
            json_object_set: this.objectSet,
            json_object_delete: this.objectDelete,
            json_object_entries: this.objectEntries
        };
    }

    arrayEmpty () {
        return [];
    }

    arrayItemOf (args) {
        const array = Cast.toList(args.VALUE);
        const index = Cast.toListIndex(args.INDEX, array.length, false);
        if (index === Cast.LIST_INVALID) {
            return '';
        }
        return array[index - 1];
    }

    arrayItemNoOf (args) {
        const array = Cast.toList(args.ARRAY);
        const item = args.VALUE;
        return array.indexOf(item) + 1;
    }

    contains (args) {
        const json = Cast.toJSON(args.JSON, true);
        const item = args.VALUE;
        return Array.isArray(json) ? json.includes(item) : Object.values(json).includes(item);
    }

    length (args) {
        const json = Cast.toJSON(args.VALUE, true);
        return Array.isArray(json) ? json.length : Object.keys(json).length;
    }

    arrayAddFront (args) {
        const array = Cast.toList(args.ARRAY);
        const item = args.ITEM;
        return [...array, item];
    }

    arrayAddBack (args) {
        const array = Cast.toList(args.ARRAY);
        const item = args.ITEM;
        return [item, ...array];
    }

    arrayInsertAt (args) {
        const array = Cast.toList(args.ARRAY);
        const index = Cast.toListIndex(args.INDEX, array.length, false);
        const item = args.ITEM;
        if (index === Cast.LIST_INVALID) {
            return array;
        }
        return array.toSpliced(index - 1, 0, item);
    }

    arraySplit (args) {
        const text = Cast.toString(args.TEXT);
        const delimiter = Cast.toString(args.DELIM);
        return text.split(delimiter);
    }

    arrayDelete (args) {
        const array = Cast.toList(args.ARRAY);
        const index = Cast.toListIndex(args.INDEX, array.length, true);
        const item = args.ITEM;
        if (index === Cast.LIST_ALL) {
            return [];
        } else if (index === Cast.LIST_INVALID) {
            return array;
        }
        return array.toSpliced(index - 1, 1);
    }

    arrayReplace (args) {
        const array = Cast.toList(args.ARRAY);
        const index = Cast.toListIndex(args.INDEX, array.length, false);
        const item = args.ITEM;
        if (index === Cast.LIST_INVALID) {
            return array;
        }
        array[index] = item;
        return array;
    }

    objectEmpty () {
        return {};
    }

    objectSplit (args) {
        const text = Cast.toString(args.TEXT);
        const keyDelimiter = Cast.toString(args.KEYDELIM);
        const pairDelimiter = Cast.toString(args.PAIRDELIM);
        let error = false;
        const result = text.split(pairDelimiter).reduce((acc, pair) => {
            if (!error) {
                const splitted = pair.split(keyDelimiter);
                if (splitted.length === 2) {
                    acc[splitted[0]] = splitted[1];
                    return acc;
                }
                error = true;
            }
        }, {});
        return error ? {} : result;
    }

    objectItemOf (args) {
        const object = Cast.toObject(args.VALUE);
        const key = Cast.toString(args.KEY);
        if (!Object.keys(object).includes(key)) {
            return '';
        }
        return object[key];
    }

    objectContainsKey (args) {
        const object = Cast.toObject(args.OBJECT);
        const key = Cast.toString(args.KEY);
        return Object.keys(object).includes(key);
    }

    objectSet (args) {
        const object = Cast.toObject(args.OBJECT);
        const key = Cast.toString(args.KEY);
        const item = args.ITEM;
        object[key] = item;
        return object;
    }

    objectDelete (args) {
        const object = Cast.toObject(args.OBJECT);
        const key = Cast.toString(args.KEY);
        delete object[key];
        return object;
    }

    objectEntries (args) {
        const object = Cast.toObject(args.OBJECT);
        switch (args.PROPERTY) {
            case 'entries':
                return Object.entries(object);
            case 'keys':
                return Object.keys(object);
            case 'values':
                return Object.values(object);
            default:
                return [];
        }
    }
}

module.exports = DashJSONBlocks;
