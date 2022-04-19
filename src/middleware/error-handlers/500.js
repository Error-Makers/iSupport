'use strict';

module.exports = (error, req, res, next) => {
  res.send(`error 500 ${error}`);
};
