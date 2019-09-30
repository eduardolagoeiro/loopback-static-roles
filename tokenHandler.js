'use strict';
const jwt = require('jsonwebtoken');

module.exports = (token, resolve, reject, role,
  JWT_PRIVATE_KEY, roleAttName) => {
  if (token) {
    if (token.includes('bearer')) {
      const split = token.split(' ');

      if (split.length === 2) {
        token = split[1];
      }
    }
    if (token) {
      jwt.verify(token, JWT_PRIVATE_KEY, (err, payload)=>{
        if (err) {
          // decode error, wrong private key
          console.log('error', err);
          return reject();
        }
        const customRole = payload.params[roleAttName];
        if (customRole == role || role === "$everyone") {
          resolve(null, true);
        } else {
          // not authorized
          reject();
        }
      });
    } else {
      // invalid header
      reject();
    }
  } else {
    // invalid token
    reject();
  }
};
