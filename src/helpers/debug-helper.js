
const DEBUG = process.env.DEBUG;

export const error = (message) => {
    console.error(message);
}

export const info = (message) => {
    console.info(message);
}

export const log = (message) => {
    if (DEBUG)
        console.log(message);
}