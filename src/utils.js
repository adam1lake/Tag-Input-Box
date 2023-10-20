export const isEmailValid = input => /^[^@]+@[^@]+\.[^@]+$/.test(input);
export const regexEsc = str => str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");