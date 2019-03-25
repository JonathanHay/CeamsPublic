import { helper } from '@ember/component/helper';

export function formatDate(params/*, hash*/) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
  let date = new Date(params[0]);
  // date.setHours(date.getHours()+2);
  // date.setMonth(date.getMonth());
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var hour = date.getHours();
  var minutes = date.getMinutes().toString();
  if(minutes.length==1){
    minutes = "0"+minutes;
  }

  return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + hour + ':' + minutes;
}

export default helper(formatDate);
