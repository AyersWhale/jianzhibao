'use strict';

import React, {
    Component,
} from 'react-native';
import moment from 'moment';

export default class CurrentDateTime {
    //获取当前日期时间，星期
    static getCurrentDateTime_qd(value) {
        //var nowTimes = moment().format('YYYY-MMM-DD-dddd, h:mm:ss a');
        var nowTime = moment().format('HH:mm:ss');
        var nowYYYY = moment().format('YYYY');
        var nowMM = moment().format('MMM');
        var nowDD = moment().format('DD');
        var nowdddd = moment().format('dddd');
        var nowa = moment().format('a');
        //Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday
        //Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec
        // if (nowa = 'am') { nowa = '上午' } else if (nowa = 'pm') { nowa = '下午' };
        if (nowdddd == 'Monday') { nowdddd = '星期一' } else if (nowdddd == 'Tuesday') { nowdddd = '星期二' } else if (nowdddd == 'Wednesday') { nowdddd = '星期三' } else if (nowdddd == 'Thursday') { nowdddd = '星期四' }
        else if (nowdddd == 'Friday') { nowdddd = '星期五' } else if (nowdddd == 'Saturday') { nowdddd = '星期六' } else if (nowdddd == 'Sunday') { nowdddd = '星期日' }
        if (nowMM == 'Jan') { nowMM = '01' } else if (nowMM == 'Feb') { nowMM = '02' } else if (nowMM == 'Mar') { nowMM = '03' } else if (nowMM == 'Apr') { nowMM = '04' }
        else if (nowMM == 'May') { nowMM = '05' } else if (nowMM == 'Jun') { nowMM = '06' } else if (nowMM == 'Jul') { nowMM = '07' } else if (nowMM == 'Aug') { nowMM = '08' }
        else if (nowMM == 'Sep') { nowMM = '09' } else if (nowMM == 'Oct') { nowMM = '10' } else if (nowMM == 'Nov') { nowMM = '11' } else if (nowMM == 'Dec') { nowMM = '12' }
        var now = nowYYYY + '-' + nowMM + '-' + nowDD + ' ' + nowTime;
        return now;
    }
    static getCurrentDateTime(value) {
        //var nowTimes = moment().format('YYYY-MMM-DD-dddd, h:mm:ss a');
        var nowTime = moment().format('HH:mm:ss');
        var nowYYYY = moment().format('YYYY');
        var nowMM = moment().format('MMM');
        var nowDD = moment().format('DD');
        var nowdddd = moment().format('dddd');
        var nowa = moment().format('a');
        //Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday
        //Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec
        // if (nowa = 'am') { nowa = '上午' } else if (nowa = 'pm') { nowa = '下午' };
        if (nowdddd == 'Monday') { nowdddd = '星期一' } else if (nowdddd == 'Tuesday') { nowdddd = '星期二' } else if (nowdddd == 'Wednesday') { nowdddd = '星期三' } else if (nowdddd == 'Thursday') { nowdddd = '星期四' }
        else if (nowdddd == 'Friday') { nowdddd = '星期五' } else if (nowdddd == 'Saturday') { nowdddd = '星期六' } else if (nowdddd == 'Sunday') { nowdddd = '星期日' }
        if (nowMM == 'Jan') { nowMM = '01' } else if (nowMM == 'Feb') { nowMM = '02' } else if (nowMM == 'Mar') { nowMM = '03' } else if (nowMM == 'Apr') { nowMM = '04' }
        else if (nowMM == 'May') { nowMM = '05' } else if (nowMM == 'Jun') { nowMM = '06' } else if (nowMM == 'Jul') { nowMM = '07' } else if (nowMM == 'Aug') { nowMM = '08' }
        else if (nowMM == 'Sep') { nowMM = '09' } else if (nowMM == 'Oct') { nowMM = '10' } else if (nowMM == 'Nov') { nowMM = '11' } else if (nowMM == 'Dec') { nowMM = '12' }
        var now = nowYYYY + '-' + nowMM + '-' + nowDD + '-' + nowdddd + '    ' + nowTime;
        return now;
    }
    static getCurrentDate(value) {
        //var nowTimes = moment().format('YYYY-MMM-DD-dddd, h:mm:ss a');
        var nowTime = moment().format('HH:mm:ss');
        var nowYYYY = moment().format('YYYY');
        var nowMM = moment().format('MMM');
        var nowDD = moment().format('DD');
        var nowdddd = moment().format('dddd');
        var nowa = moment().format('a');
        //Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday
        //Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec
        // if (nowa = 'am') { nowa = '上午' } else if (nowa = 'pm') { nowa = '下午' };
        if (nowdddd == 'Monday') { nowdddd = '星期一' } else if (nowdddd == 'Tuesday') { nowdddd = '星期二' } else if (nowdddd == 'Wednesday') { nowdddd = '星期三' } else if (nowdddd == 'Thursday') { nowdddd = '星期四' }
        else if (nowdddd == 'Friday') { nowdddd = '星期五' } else if (nowdddd == 'Saturday') { nowdddd = '星期六' } else if (nowdddd == 'Sunday') { nowdddd = '星期日' }
        if (nowMM == 'Jan') { nowMM = '01' } else if (nowMM == 'Feb') { nowMM = '02' } else if (nowMM == 'Mar') { nowMM = '03' } else if (nowMM == 'Apr') { nowMM = '04' }
        else if (nowMM == 'May') { nowMM = '05' } else if (nowMM == 'Jun') { nowMM = '06' } else if (nowMM == 'Jul') { nowMM = '07' } else if (nowMM == 'Aug') { nowMM = '08' }
        else if (nowMM == 'Sep') { nowMM = '09' } else if (nowMM == 'Oct') { nowMM = '10' } else if (nowMM == 'Nov') { nowMM = '11' } else if (nowMM == 'Dec') { nowMM = '12' }
        var now = nowYYYY + '-' + nowMM + '-' + nowDD + '-' + nowdddd;
        return now;
    }
    static getTimeHour(value) {
        var nowTime = moment().format('HH:mm');
        return nowTime;
    }
    static getTimeHourMM(value) {
        var nowTime = moment().format('HH:mm:ss');
        return nowTime;
    }
    static getDate(value) {
        var nowYYYY = moment().format('YYYY');
        var nowMM = moment().format('MMM');
        if (nowMM == 'Jan') { nowMM = '01' } else if (nowMM == 'Feb') { nowMM = '02' } else if (nowMM == 'Mar') { nowMM = '03' } else if (nowMM == 'Apr') { nowMM = '04' }
        else if (nowMM == 'May') { nowMM = '05' } else if (nowMM == 'Jun') { nowMM = '06' } else if (nowMM == 'Jul') { nowMM = '07' } else if (nowMM == 'Aug') { nowMM = '08' }
        else if (nowMM == 'Sep') { nowMM = '09' } else if (nowMM == 'Oct') { nowMM = '10' } else if (nowMM == 'Nov') { nowMM = '11' } else if (nowMM == 'Dec') { nowMM = '12' }
        var nowDD = moment().format('DD');
        var Date = nowYYYY + '-' + nowMM + '-' + nowDD;
        return Date;
    }
    static getDate_2(value) {
        var nowYYYY = moment().format('YYYY');
        var nowMM = moment().format('MMM');
        if (nowMM == 'Jan') { nowMM = '01' } else if (nowMM == 'Feb') { nowMM = '02' } else if (nowMM == 'Mar') { nowMM = '03' } else if (nowMM == 'Apr') { nowMM = '04' }
        else if (nowMM == 'May') { nowMM = '05' } else if (nowMM == 'Jun') { nowMM = '06' } else if (nowMM == 'Jul') { nowMM = '07' } else if (nowMM == 'Aug') { nowMM = '08' }
        else if (nowMM == 'Sep') { nowMM = '09' } else if (nowMM == 'Oct') { nowMM = '10' } else if (nowMM == 'Nov') { nowMM = '11' } else if (nowMM == 'Dec') { nowMM = '12' }
        var nowDD = moment().format('DD');
        var Date = nowYYYY + '/' + nowMM + '/' + nowDD;
        return Date;
    } static getWeek(value) {
        var nowdddd = moment().format('dddd');
        if (nowdddd == 'Monday') { nowdddd = '星期一' } else if (nowdddd == 'Tuesday') { nowdddd = '星期二' } else if (nowdddd == 'Wednesday') { nowdddd = '星期三' } else if (nowdddd == 'Thursday') { nowdddd = '星期四' }
        else if (nowdddd == 'Friday') { nowdddd = '星期五' } else if (nowdddd == 'Saturday') { nowdddd = '星期六' } else if (nowdddd == 'Sunday') { nowdddd = '星期日' }
        return nowdddd;
    }

}
