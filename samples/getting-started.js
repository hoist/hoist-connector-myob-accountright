/* Just copy and paste this snippet into your code */


/* either return a promise or call done, here we're returning a promise */
module.exports = function (event, done) {
  var MYOB = Hoist.connector("<key>");
  return MYOB.authorize("<bouncerToken>").then(function () {
    //only call this once per authorization/bucket
    return MYOB.setUsernameAndPassword('username', 'password');
  }).then(function () {
    return MYOB.get('/Contact')
      .then(function (ContactsResponse) {
        return Hoist.event.raise('CONTACTS:FOUND', {
          count: ContactsResponse.Items.length
        });
      });
  });
};
