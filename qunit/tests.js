$(function () {

    // getRate
    test("getRate", function () {
        strictEqual(myApp.getRate("60"),"62", "one hour");
    });


    // initApp - hard

    // startOver DOM testing

    // populateFamily DOM

    // populateTotals DOM

    // addClass DOM

    // removeClass DOM

    test("Converter - fromMoney", function () {
        notEqual(appConvert.fromMoney("$9.99"), "$9.99", "dollar sign removed");
        strictEqual(appConvert.fromMoney("$9.99"), 9.99, "returns number not string");
        strictEqual(appConvert.fromMoney("9.99"), 9.99, "start without dollar sign");
        strictEqual(appConvert.fromMoney("watermellon"), 0, "start with word");
        strictEqual(appConvert.fromMoney("9.999999"), 9.99, "start with extra decimal places");
    });

    // test("Converter - toMoney", function () {
    test("Converter - toMoney", function () {
        strictEqual(appConvert.toMoney(9.99), "$9.99", "basic test");
    });

    // test Converter - toEnglish
    test("Converter - toEnglish", function () {
        strictEqual(appConvert.toEnglish(60), "1 hour ", "one hour");
    });

});      // end document ready