/// <reference path="jquery-1.8.3-vsdoc.js" />
$(function () {
    "use strict";

    // Custom Converter Functions

    Number.prototype.fromMoney = function () {
        return parseFloat(this.replace(/[^0-9.-]+/g, ''));
    }; // end fromMoney method

    Number.prototype.toMoney = function () {
        return "$" + this.toFixed(2);
    }; // end toMoney method

    Number.prototype.toEnglish = function () {
        var tempHours = Math.floor((this / 60));
        var tempMinutes = (this % 60);
        if (tempHours === 0) {
            tempHours = "";
        } else if (tempHours === 1) {
            tempHours += " hour ";
        } else {
            tempHours += " hours ";
        }
        if (tempMinutes === 0) {
            tempMinutes = "";
        } else {
            tempMinutes += " minutes";
        }
        return (tempHours + tempMinutes);
    }; // end toEnglish method

    // App properties
    var familyDiscount = 0.05;
    var annualDiscount = 0.05;
    var tuitionRates = {
        0: 0,
        0.5: 44,
        0.75: 54,
        1: 62,
        1.25: 76,
        1.5: 90,
        1.75: 102,
        2: 115,
        2.25: 125,
        2.5: 135,
        2.75: 145,
        3: 155,
        3.25: 162,
        3.5: 169,
        3.75: 175,
        4: 182
    };

    var getRate = function (minutes) {
        var hours = minutes / 60;
        if (hours > 4) { hours = 4; } // [business logic] maximum tuition is for 4 hours/week
        return tuitionRates[hours]; // lookup the tuitionRates property
    };

    // Student Constructor
    function Student(label) {
        var me = this;
        me.studentLabel = label;
        me.danceClasses = ko.observableArray([]);

        me.addClass = function (minutes) {
            me.danceClasses.push(minutes);
        }; // end addClass

        me.removeClass = function (deleteMe) {
            me.danceClasses.splice(deleteMe, 1);
        }; // end removeClass

        me.totalMinutes = ko.computed(function () {
            // THIS is just to keep track of MINUTES
            var sum = 0;
            for (var i = 0, l = me.danceClasses().length; i < l; i++) {
                sum += parseInt(me.danceClasses()[i]);
            }
            return sum;
        }); // end totalMinutes property

        me.monthlyTuition = ko.computed(function () {
            var monthly = getRate(me.totalMinutes());
            return monthly;
        }); // end monthly tuition

        me.semesterTuition = ko.computed(function () {
            var semester = me.monthlyTuition() * 4.5;
            return semester;
        }); // end Semester tuition

        me.annualTuition = ko.computed(function () {
            var annual = me.monthlyTuition() * 9;
            annual -= annual * annualDiscount;
            return annual;
        }); // end Annual tuition
    }; // end Student constructor

    // myViewModel constructor
    function myViewModel() {
        var me = this;

        me.students = {
            s1: new Student("One"),
            s2: new Student("Two"),
            s3: new Student("Three"),
            s4: new Student("Four")
        };

        me.familyCount = ko.computed(function () {
            return 1;
        });

        me.familyMonthly = ko.computed(function () {
            // for loop of students 
            var monthlyTotal = 0;
            monthlyTotal = me.students.s1.monthlyTuition + me.students.s2.monthlyTuition + me.students.s3.monthlyTuition + me.students.s4.monthlyTuition;
            if (me.familyCount > 1) {
                monthlyTotal -= monthlyTotal * me.familyDiscount;
            }
            return monthlyTotal;
        });

        me.familySemester = ko.computed(function () {
            return me.familyMonthly * 4.5;
        });

        me.familyAnnual = ko.computed(function () {
            return (me.familyMonthly * 9) * me.annualDiscount;
        });

        //  Start Over method
        me.startOver = function () {
            // loop through all students
            alert("Hello startOver");
            // remove everything from list

            // reset student total minutes to 0

            // end each student loop
        }; // end startOver

    }; // end viewModel constructor

    ko.applyBindings(new myViewModel);

}); // end document ready