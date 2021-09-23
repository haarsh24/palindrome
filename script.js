function reverseString(str) {
    var listOfChars = str.split('');
    var listOFReverseChar = listOfChars.reverse();
    var reversedString = listOFReverseChar.join('');
    return reversedString;
}

function isPalindrome(str) {
    var reversedString = reverseString(str);
    return str === reversedString;
}


function getDateAsString(date) {

    var dateStr = {
        day: '',
        month: '',
        year: ''
    };

    if (date.day < 10) {
        dateStr.day = '0' + date.day;
    } else {
        dateStr.day = date.day.toString()
    }
    if (date.month < 10) {
        dateStr.month = '0' + date.month;
    } else {
        dateStr.month = date.month.toString()
    }

    dateStr.year = date.year.toString();

    return dateStr
}

function getDateInAllFormats(date) {

    var ddmmyyyy = date.day + date.month + date.year;
    var mmddyyyy = date.month + date.day + date.year;
    var yyyymmdd = date.year + date.month + date.day;
    var ddmmyy = date.day + date.month + date.year.slice(-2);
    var mmddyy = date.month + date.day + date.year.slice(-2);
    var yymmdd = date.year.slice(-2) + date.month + date.day;

    return [ddmmyyyy, mmddyyyy, yyyymmdd, ddmmyy, mmddyy, yymmdd]
}

function checkPalindromeForAllFormats(date) {
    var listOfDateFormat = getDateInAllFormats(date);
    var palindromeList = [];
    for (var i = 0; i < listOfDateFormat.length; i++) {
        var result = isPalindrome(listOfDateFormat[i])
        palindromeList.push(result);
    }
    return palindromeList;
}

function leapYear(year) {
    if (year % 400 === 0)
        return true;

    if (year % 100 === 0)
        return false;

    if (year % 4 === 0)
        return true;

    return false;
}

function getNextDate(date) {
    var day = date.day + 1;
    var month = date.month;
    var year = date.year;

    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]


    if (month === 2) {
        if (leapYear(year)) {
            if (day > 29) {
                day = 1;
                month++
            }
        } else {
            if (day > 28) {
                day = 1;
                month++;
            }
        }
    } else {
        if (day > daysInMonth[month - 1]) {
            day = 1;
            month++;
        }
    }

    if (month > 12) {
        month = 1;
        year++;
    }
    return {
        day: day,
        month: month,
        year: year,
    };
}

function checkNextPalindromeDate(date) {

    var nextDate = getNextDate(date);
    var nextDateCtr = 0;

    while (1) {
        nextDateCtr++;
        var nextDateStr = getDateAsString(nextDate);
        var nextPalindrome = checkPalindromeForAllFormats(nextDateStr);

        for (let i = 0; i < nextPalindrome.length; i++) {
            if (nextPalindrome[i]) {
                return [nextDateCtr, nextDate]
            }
        }
        nextDate = getNextDate(nextDate);
    }

}

function getPreviousDate(date) {
    var day = date.day - 1;
    var month = date.month;
    var year = date.year;

    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    if (day === 0) {
        month--; // getting previous month for all conditions
        if (month === 0) { // condition for previous year
            day = 31;
            month = 12;
            year--;
        } else if (month === 2) { //condition for leap year
            if (leapYear(year)) {
                day = 29;
            } else {
                day = 28;
            }
        } else {
            day = daysInMonth[month - 1]; //condition for all previous month
        }
    }
    return {
        day: day,
        month: month,
        year: year
    };
}

function checkPreviousPalindromeDate(date) {

    var previousDate = getPreviousDate(date);
    var previousDateCtr = 0;

    while (1) {
        previousDateCtr++;
        var previousDateStr = getDateAsString(previousDate)
        var previousPalindrome = checkPalindromeForAllFormats(previousDateStr);

        for (let i = 0; i < previousPalindrome.length; i++) {
            if (previousPalindrome[i]) {
                return [previousDateCtr, previousDate]
            }
        }
        previousDate = getPreviousDate(previousDate);
    }

}

var inputDate = document.querySelector('#input-date');
var checkBtn = document.querySelector('#check-btn');
var outputBox = document.querySelector('#output-box');
var loadingBox = document.querySelector(".loading");


function finalResult(e) {
    var bdayString = inputDate.value


    var date = bdayString.split("-")

    var yyyy = date[0];
    var mm = date[1];
    var dd = date[2]

    var date = {
        day: Number(dd),
        month: Number(mm),
        year: Number(yyyy)
    }

    var dateStr = getDateAsString(date);
    var listDate = checkPalindromeForAllFormats(dateStr)
    var isPalindrome = false;

    for (let i = 0; i < listDate.length; i++) {
        if (listDate[i]) {
            isPalindrome = true;
            break;
        }
    }

    if (!isPalindrome) {
        const [ctr1, nextDate] = checkNextPalindromeDate(date);
        const [ctr2, prevDate] = checkPreviousPalindromeDate(date);
        loadingBox.classList.add("hidden");
        if (ctr1 > ctr2) {
            outputBox.innerText = `The nearest palindrome date is ${prevDate.day}-${prevDate.month}-${prevDate.year}, you missed by ${ctr2} days.`;
        } else {
            outputBox.innerText = `The nearest palindrome date is ${nextDate.day}-${nextDate.month}-${nextDate.year}, you missed by ${ctr1} days.`;
        }

    } else {
        loadingBox.classList.add("hidden");
        outputBox.innerText = 'Yay! Your birthday is palindrome!';
    }

}


function checkHandler() {
    if (inputDate.value) {
        outputBox.innerText = "";
        loadingBox.classList.remove("hidden");
        window.setTimeout(finalResult, 3000);
    } else {
        outputBox.innerText = "Please enter date to show results.";
    }
}




checkBtn.addEventListener('click', checkHandler)