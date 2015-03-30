/* Just copy and paste this snippet into your code */
var Promise = require('bluebird');
module.exports = function (req, res, done) {

  var MYOB = Hoist.connector("<key>");
  return Hoist.bucket.set('user').
  then(function () {
    //get all company files
    return MYOB.get('/')
      .then(function (companyFiles) {
        //loop through each company file and raise an event
        return Promise.all(
          companyFiles.map(function (companyfile) {
            return Hoist.event.raise('COMPANYFILE:FOUND', companyfile);
          }));
      }).then(function () {
        done();
      });
  });


};
