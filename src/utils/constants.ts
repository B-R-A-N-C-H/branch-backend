/**
 * This requires passwords to be at least 8 characters long with
 * at least 1 lowercase character, 1 uppercase character and one number.
 */
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,1024}$/;