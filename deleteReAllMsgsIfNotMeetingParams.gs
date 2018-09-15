var myEmail = "bradshaw.andre@gmail.com";
var yourName = "andre|andré";

function emailBodyWorthLookingAt(str) {
  //accounds for some group calls-to-action or general pleading, and your name
  var regX = new RegExp("\\ball,|guys,|gals,|everyone,|everyone will need to|everyone.{1,12}respond|everyone can|everyone would|everyone get|everyone take|everyone receive|everyone could|anyone have|anyone need|please take|please respond|please go\\b|please register|please read\\b|@(" + yourName + ")|\\b(" + yourName + "):|\\b(" + yourName + ")\s{0,2}-|\\b(" + yourName + ").{0,1},", "i");
  var chop = /^.{1,100}/.exec(str.toString().replace(/\n|\r/g, '  '))[0];
  return regX.test(chop);
}

function sentToMe(obj) {
  var regx = new RegExp(myEmail, 'i');
  return regx.test(obj.getTo());
}

function receivers(obj) { //checks if there is more than 1 or 0 recipients. this can be adjusted
  if (obj != null) {
    if (obj.length == 1) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function gmailmsgs() {
  var timestamp = new Date();
  var message = GmailApp.getInboxThreads(0, 100); //get the first 100 threads of your inbox
  for (m = 0; m < message.length; m++) {
    var msgThread = message[m].getMessages();
    for (t = 0; t < msgThread.length; t++) {
      var msg = msgThread[t];
      if (msg.isUnread() === true) {
        var msgBody = msg.getPlainBody();
        var subject = msg.getSubject();
        var allReceivers = msg.getTo();
        var isToMe = sentToMe(msg);
        var isReply = /re:/gi.test(subject.toString());
        var receivers_not1 = receivers(allReceivers.match(/@/g));
        var checkBody4relevance = emailBodyWorthLookingAt(msgBody);
        var cc = msg.getCc();
        if ((receivers_not1 === false || isToMe === false)) { // 
          if (isReply === true && checkBody4relevance === false) {
            Logger.log(receivers_not1 + ' ' + isToMe + ' ' + isReply + ' ' + checkBody4relevance + ' ' + subject + '\n\n' + /^.{1,100}/.exec(msgBody.toString().replace(/\n|\r/g, '  ')))
            msg.markRead(); //
            msg.moveToTrash(); //
          }//if
        }//if
      } //if msg is unread
    } //for t in thread
  } //for m in message
} //end of function

