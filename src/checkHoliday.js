#!/usr/bin/env node

const Holidays = require('date-holidays')
const country = 'CA';
const hd = new Holidays(country);
const path = require("path");
const fs = require("fs");
const holidayDatesPath = path.join(__dirname, '../config-files/holidays.txt');
const nationalHolidays = hd.getHolidays(2019);

var employeeHolidays = [];

//console.log(nationalHolidays);

nthWeekdayOfMonth = (weekday, n, date) => {
    var count = 0,
        idate = new Date(date.getFullYear(), date.getMonth(), 1);
    while (true) {
      if (idate.getDay() === weekday) {
        if (++count == n) {
          break;
        }
      }
      idate.setDate(idate.getDate() + 1);
    }
    return idate;
}

writeHolidays = () => {
    nationalHolidays.forEach(holiday => {
        const holidayMonth = new Date(holiday.date).getMonth();
        if (holiday.type === 'public' && holidayMonth !== 0 && holidayMonth !== 11 && holiday.name != 'Remembrance Day' && holiday.name != 'Easter Sunday') {
            //console.log(holiday);
            employeeHolidays.push(holiday.date.slice(0,10));
        }
    });

    // Add family day to the list of holidays
    const familyDayDate = nthWeekdayOfMonth(1, 3, new Date(new Date().getFullYear(), 1)).toISOString().slice(0,10);
    employeeHolidays.push(familyDayDate);
    
    const currentYear = new Date(new Date().getFullYear());
    const firstWinterHolidayDate = nthWeekdayOfMonth(1, 4, currentYear, 11);
    const lastWinterHolidayDateThisYear = nthWeekdayOfMonth(5, 1, currentYear, 0);
    const lastWinterHolidayDateNextYear = nthWeekdayOfMonth(5, 1, currentYear + 1, 0);
    
    // Add the winter holidays to list of holidays: 4th Monday of December to 1st Friday of January
    for (let i = 0; i <= 4; i ++){
        employeeHolidays.push((new Date (new Date(firstWinterHolidayDate).getTime() + i * (24 * 60 * 60 * 1000))).toISOString().slice(0,10));
        employeeHolidays.push((new Date (new Date(lastWinterHolidayDateThisYear).getTime() + (i-4) * (24 * 60 * 60 * 1000))).toISOString().slice(0,10));
        employeeHolidays.push((new Date (new Date(lastWinterHolidayDateNextYear).getTime() + (i-4) * (24 * 60 * 60 * 1000))).toISOString().slice(0,10));
    }
    
    fs.writeFileSync(holidayDatesPath, employeeHolidays.join('\n') + "\n", 'utf8');
}

exports.writeHolidays = writeHolidays;
