/// <reference path="jquery-1.8.3-vsdoc.js" />

$(function () {

    // App object
    var myApp = {

        // App properties
        familyDiscount: 0.05,
        annualDiscount: 0.05,
        tuitionRates: {
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
        },

        getRate: function (minutes) {
            var hours = minutes / 60;
            if (hours > 4) { hours = 4; } // [business logic] maximum tuition is for 4 hours/week, $182
            return myApp.tuitionRates[hours]; // lookup the tuitionRates property
        },

        //  Initialize method
        initApp: function () {
            $(".startOver").hide();
        }, // end initApp

        //  Start Over method
        startOver: function (e) {
            // loop through all students
            $('div[data-id^="s"]').each(function () {
                // remove everything from list
                $(this).find("li").remove();
                // reset student total minutes to 0
                $(this).attr("data-total", "0"); // reset to 0
                // populate totals on this student
                myPeople.populateStudent($(this));
            }); // end each student loop
        } // end startOver

    }; // end App object

    // Converter Methods
    appConvert = {
        fromMoney: function (money) {
            return parseFloat(money.replace(/[^0-9.-]+/g, ''));
        }, // end fromMoney method

        toMoney: function (number) {
            var negative = number < 0 ? "-" : "";
            var i = parseInt(number = Math.abs(+number || 0).toFixed(2), 10) + "";
            var j = (j = i.length) > 3 ? j % 3 : 0;
            return "$" + negative + (j ? i.substr(0, j) + "," : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + ",") + (2 ? "." + Math.abs(number - i).toFixed(2).slice(2) : "");
        }, // end toMoney method

        toEnglish: function (studentMinutes) {
            tempHours = Math.floor((studentMinutes / 60));
            tempMinutes = (studentMinutes % 60);
            if (tempHours == 0) {
                tempHours = "";
            } else if (tempHours == 1) {
                tempHours += " hour ";
            } else {
                tempHours += " hours ";
            }
            if (tempMinutes == 0) {
                tempMinutes = "";
            } else {
                tempMinutes += " minutes";
            }
            return (tempHours + tempMinutes);
        } // end toEnglish method
    }; // end appConvert object


    // People object
    var myPeople = {
        populateStudent: function (thisStudent) {
            //get this studennt's current minutes from it's data-total
            var studentMinutes = thisStudent.attr("data-total");

            // check for 0 minutes
            if (studentMinutes == 0) {
                // save the math - manual reset to 0
                thisStudent.find(".monthly,.semester,.annual").text("$0.00");
                thisStudent.find(".hours").text("0 hours");

                // set as inactive
                thisStudent.attr("data-active", "no");

            } else {
                var studentMonthly = parseInt(myApp.getRate(studentMinutes));
                var studentSemester = studentMonthly * 4.5;
                var studentAnnual = studentMonthly * 9;
                studentAnnual -= studentAnnual * myApp.annualDiscount;

                thisStudent.find(".hours").text(appConvert.toEnglish(studentMinutes));

                // convert to money and write
                thisStudent.find(".monthly").text(appConvert.toMoney(studentMonthly));
                thisStudent.find(".semester").text(appConvert.toMoney(studentSemester));
                thisStudent.find(".annual").text(appConvert.toMoney(studentAnnual));

                // set as active
                thisStudent.attr("data-active", "yes");
            } // end if
            myPeople.populateFamily();
        }, // end populateStudent function    
        populateFamily: function () {
            var family = $('div[data-id="family"]');
            var studentCount = $('div[data-active="yes"]').length;
            var familyMonthly = 0;
            var familySemester = 0;
            var familyAnnual = 0;

            // Loop thru students and sum their monthly amounts
            $('div[data-id^="s"]').each(function () {
                familyMonthly += appConvert.fromMoney($(this).find(".monthly").text());
            }); // end each

            // chk to see if it's 0
            if (familyMonthly == 0) {
                // hide startOver button
                $(".startOver").hide();
            } else {
                // adjust monthly for family discount if more than one student
                if (studentCount > 1) {
                    familyMonthly -= familyMonthly * myApp.familyDiscount;
                } // end if
                // workup Semester and Annual (with annual discount)
                familySemester = familyMonthly * 4.5;
                familyAnnual = familyMonthly * 9;
                familyAnnual -= familyAnnual * myApp.annualDiscount;
                // show startOver button
                $(".startOver").show();
            } // end if

            // format to Money and write to DOM
            family.find(".monthly").text(appConvert.toMoney(familyMonthly));
            family.find(".semester").text(appConvert.toMoney(familySemester));
            family.find(".annual").text(appConvert.toMoney(familyAnnual));
            // fix up the singular/plural of student count before writing
            if (studentCount == 1) {
                studentCount += " student";
            } else {
                studentCount += " students";
            }
            family.find(".studentCount").text(studentCount); // insert student count

        }, // end populateFamily
        addClass: function (e) {
            // retrieve data
            var thisStudent = $(e.target).parents('div[data-id]');          // find out which Student was clicked
            var studentMinutes = parseInt(thisStudent.attr("data-total"));  // find out this Student's current total minutes
            var thisMinutes = $(e.target).text().replace("+", "");          // find out how many minutes were clicked 

            // math on variables
            studentMinutes += parseInt(thisMinutes);    // add the button's minutes to the total minutes

            // update DOM
            thisStudent.attr("data-total", studentMinutes); // update this student's total
            thisStudent.find("ul").append("<li>" + thisMinutes + " minutes   <a class='removeItem' href='#'>x</a></li>"); // add a line
            myPeople.populateStudent(thisStudent);   // call function to populate this student's totals

        }, // end addClass method
        removeClass: function (e) {
            // Retrieve Data
            var thisStudent = $(e.target).parents('div[data-id]');  // find out which Student was clicked
            var studentMinutes = parseInt(thisStudent.attr("data-total"));  // find out this Student's current total minutes
            var thisMinutes = $(e.target).closest('li').text().replace(/[^0-9]+/g, ""); // find out which minutes are to be removed

            // Math on variables
            studentMinutes -= parseInt(thisMinutes); // subtract from student total

            // update DOM
            thisStudent.attr("data-total", studentMinutes); // update this student's total minutes
            $(e.target).closest('li').remove(); // remove the list item
            myPeople.populateStudent(thisStudent);   // call function to populate this student's totals
        } // end removeClass method
    }; // end People object

    // Event Handler -  calcButton
    $(".calcButton").click(function (e) {
        myPeople.addClass(e);
    }); // end calcButton click

    // Event Handler -  remove Item
    $("ul").on('click', '.removeItem', function (e) {
        myPeople.removeClass(e);
    }); // end removeItem click

    // Event Handler -  startOver
    $(".startOver").click(function (e) {
        myApp.startOver();
    }); // end startOver click

    myApp.initApp();

});   // end document ready