/*
 * Helper function
 * return boolean
 */
function isset(variable) {
    return typeof variable !== 'undefined';
}

/*
 * Helper function
 * return boolean
 */
function is_empty(variable) {
    return variable === '';
}

/*
 * Helper function
 * return boolean
 */
function is_null(variable) {
    return variable === null;
}

/*
 * Helper function
 * return boolean
 */
function is_num(variable) {
    return typeof variable === 'number';
}

/*
 * Helper function
 * return boolean
 */
function is_string(variable) {
    return typeof variable === 'string';
}

/*
 * Helper function
 * return boolean
 */
function is_bool(variable) {
    return typeof variable === 'boolean';
}

/*
 * Helper function
 * return boolean
 */
function is_arr(variable) {
    return Array.isArray(variable);
}

/*
 * Helper function
 * return boolean
 */
function is_obj(variable) {
    if( Array.isArray(variable) === true || variable === null ) {
      return false;
    }
    else {
      return typeof variable === 'object';
    }
}

/*
 * Helper function
 * return boolean
 */
function is_func(variable) {
    return typeof variable === 'function';
}
