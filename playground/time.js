var moment = require('moment');




var date = moment();
date.add(1, 'year').subtract(100, 'years');
console.log(date.format('MMM Do YYYY'));

var newDate = moment();
console.log(date.format('h:mm a'));
