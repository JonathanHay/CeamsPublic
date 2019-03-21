import { helper } from '@ember/component/helper';

export function formatDate(params/*, hash*/) {
  //params = 'test';
  console.log(params);
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
  let date = new Date(params[0]);
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var hour = date.getHours();
  var minutes = date.getMinutes();

  return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + hour + ':' + minutes;
}

export default helper(formatDate);
