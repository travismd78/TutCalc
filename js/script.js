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
        if (this === 0) { return "0 hours" };
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
    }; // end tuitionRates

    var getRate = function (minutes) {
        var hours = minutes / 60;
        if (hours > 4) { hours = 4; } // [business logic] maximum tuition is for 4 hours/week
        return tuitionRates[hours]; // lookup the tuitionRates property
    }; // end getRate

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

        me.studentCount = ko.observable();

        me.students = ko.observableArray([
            new Student("Student One"),
            new Student("Student Two"),
            new Student("Student Three"),
            new Student("Student Four")
        ]);

        me.familyMonthly = ko.computed(function () {
            // used to get Tuition AND Student Count
            var monthly = 0;
            var active = 0;
            // loop students
            for (var i = 0, l = me.students().length; i < l; i++) {
                var thisAmount = me.students()[i].monthlyTuition();
                if (thisAmount > 0) {
                    monthly += thisAmount;
                    active++;
                } // end if
            }; // end for each student
            // apply discount
            if (active > 1) { monthly -= monthly * familyDiscount; };
            // set active student count
            me.studentCount(active);
            // finish
            return monthly;
        });

        me.familySemester = ko.computed(function () {
            return me.familyMonthly() * 4.5;
        });

        me.familyAnnual = ko.computed(function () {
            var annual = me.familyMonthly() * 9;
            annual -= annual * annualDiscount;
            return annual;
        });

        me.startOver = function () {
            for (var i = 0, l = me.students().length; i < l; i++) { 
                me.students()[i].danceClasses.removeAll();
            }
        }; // end startOver

    }; // end viewModel constructor

    ko.applyBindings(new myViewModel);

});   // end document ready