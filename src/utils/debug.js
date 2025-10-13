import "dotenv/config";

const DEBUG = process.env.DEBUG == true;

export const error = (message) => {
  if (DEBUG)
    console.error(message);
}

export const info = (message) => {
  if (DEBUG)
    console.info(message);
}

export const log = (message) => {
  if (DEBUG)
    console.log(message);
}
