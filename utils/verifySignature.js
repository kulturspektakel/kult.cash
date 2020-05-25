const {createHash} = require('crypto');

module.exports = (
  balance,
  tokens,
  id,
  signature,
) => createHash('sha1').update(`${balance}${tokens}${id}${process.env.SALT}`).digest('hex').substr(0, 10) === signature
