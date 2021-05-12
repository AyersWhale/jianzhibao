'use strict';

import React, {
    Component,
} from 'react-native';


export default class TimeChange {
    //时间戳转换时间
    static timeChange(value) {
        var d = new Date(value * 1);    //根据时间戳生成的时间对象
        //只显示日期

        var date = (d.getFullYear()) + "-" +
            (d.getMonth() + 1) + "-" +
            (d.getDate()) + " " +
            (d.getHours()) + ":" +
            (d.getMinutes());
        return date;
        //显示日期带时间
        // var date = (d.getFullYear()) + "-" +
        //     (d.getMonth() + 1) + "-" +
        //     (d.getDate()) + " " +
        //     (d.getHours()) + ":" +
        //     (d.getMinutes()) + ":" +
        //     (d.getSeconds());
        // return date;
    }
    static timeChangeDate(value) {//只返回日期2020/5/25
        var d = new Date(value * 1);    //根据时间戳生成的时间对象
        //只显示日期

        var date = (d.getFullYear()) + "-" +
            (d.getMonth() + 1) + "-" +
            (d.getDate());
        return date;

    }
    //时间戳转换年月
    static timeYMChange(value) {
        var d = new Date(value * 1);    //根据时间戳生成的时间对象
        var date = (d.getFullYear()) + "-" +
            (d.getMonth() + 1) + "-" +
            (d.getDate());
        return date;
    }

    // 将指定日期转换为时间戳。
    static toTimeStamp(time) {
        var t = time;  // 月、日、时、分、秒如果不满两位数可不带0.
        var T = new Date(t);  // 将指定日期转换为标准日期格式。Fri Dec 08 2017 20:05:30 GMT+0800 (中国标准时间)
        return T.getTime()  // 将转换后的标准日期转换为时间戳。

    }

    //判断未满 num岁（eg：未满16岁）
    static checkAge(checkdate, num) {
        let checkDate = new Date(checkdate)
        let nowDate = new Date()
        let nowyear = nowDate.getFullYear()
        let checkyear = checkDate.getFullYear()
        let nowmouth = nowDate.getMonth()
        let checkmouth = checkDate.getMonth()
        let nowdate1 = nowDate.getDate()
        let checkdate1 = checkDate.getDate()
        if (nowyear - checkyear < num) {
            return false
        } else if (nowyear - checkyear == num) {
            if (nowmouth - checkmouth < 0) {
                return false
            } else if (nowmouth - checkmouth == 0) {
                if (nowdate1 - checkdate1 < 0) {
                    return false
                } else {
                    return true
                }
            }
        } else {
            return true
        }
    }
}
