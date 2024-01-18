/** 
 *  @example
 *  const testObject = {
 *      'snake_case': 1,
 *      'hello': 2,
 *      'camelCase': {
 *          'hi_world': 3,
 *          'this_is_test': [
 *              { 'nested': 4, 'g_idle': 5 },
 *              { 'nested': 6, 'g_idle': 7 }
 *          ]
 *      }
 *  };
 *  
 *  const camelCaseObject = convertSnakeToCamel(testObject);
 *  console.log(JSON.stringify(camelCaseObject, null, 4));
 */
const convertSnakeToCamel = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(convertSnakeToCamel);
    }

    return Object.keys(obj).reduce((acc, key) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        acc[camelKey] = convertSnakeToCamel(obj[key]);
        return acc;
    }, {});
}

module.exports = convertSnakeToCamel;