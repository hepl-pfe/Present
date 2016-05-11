//! moment.js
//! version : 2.9.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
(function (undefined) {
    /************************************
     Constants
     ************************************/

    var moment,
        VERSION = '2.9.0',
        // the global-scope this is NOT the global object in Node.js
        globalScope = (typeof global !== 'undefined' && (typeof window === 'undefined' || window === global.window)) ? global : this,
        oldGlobalMoment,
        round = Math.round,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for locale config files
        locales = {},

        // extra moment internal properties (plugins register props here)
        momentProperties = [],

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module && module.exports),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,

        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenOffsetMs = /[\+\-]?\d+/, // 1234567890123
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123

        //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],
            ['YYYY-DDD', /\d{4}-\d{3}/]
        ],

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker '+10:00' > ['10', '00'] or '-1530' > ['-', '15', '30']
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        },

        unitAliases = {
            ms : 'millisecond',
            s : 'second',
            m : 'minute',
            h : 'hour',
            d : 'day',
            D : 'date',
            w : 'week',
            W : 'isoWeek',
            M : 'month',
            Q : 'quarter',
            y : 'year',
            DDD : 'dayOfYear',
            e : 'weekday',
            E : 'isoWeekday',
            gg: 'weekYear',
            GG: 'isoWeekYear'
        },

        camelFunctions = {
            dayofyear : 'dayOfYear',
            isoweekday : 'isoWeekday',
            isoweek : 'isoWeek',
            weekyear : 'weekYear',
            isoweekyear : 'isoWeekYear'
        },

        // format function strings
        formatFunctions = {},

        // default relative time thresholds
        relativeTimeThresholds = {
            s: 45,  // seconds to minute
            m: 45,  // minutes to hour
            h: 22,  // hours to day
            d: 26,  // days to month
            M: 11   // months to year
        },

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.localeData().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.localeData().months(this, format);
            },
            D    : function () {
                return this.date();
            },
            DDD  : function () {
                return this.dayOfYear();
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return this.localeData().weekdaysMin(this, format);
            },
            ddd  : function (format) {
                return this.localeData().weekdaysShort(this, format);
            },
            dddd : function (format) {
                return this.localeData().weekdays(this, format);
            },
            w    : function () {
                return this.week();
            },
            W    : function () {
                return this.isoWeek();
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY : function () {
                return leftZeroFill(this.year(), 5);
            },
            YYYYYY : function () {
                var y = this.year(), sign = y >= 0 ? '+' : '-';
                return sign + leftZeroFill(Math.abs(y), 6);
            },
            gg   : function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg : function () {
                return leftZeroFill(this.weekYear(), 4);
            },
            ggggg : function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG   : function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 4);
            },
            GGGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e : function () {
                return this.weekday();
            },
            E : function () {
                return this.isoWeekday();
            },
            a    : function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return toInt(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS  : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z    : function () {
                var a = this.utcOffset(),
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ':' + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ   : function () {
                var a = this.utcOffset(),
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z : function () {
                return this.zoneAbbr();
            },
            zz : function () {
                return this.zoneName();
            },
            x    : function () {
                return this.valueOf();
            },
            X    : function () {
                return this.unix();
            },
            Q : function () {
                return this.quarter();
            }
        },

        deprecations = {},

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'],

        updateInProgress = false;

    // Pick the first defined of two or three arguments. dfl comes from
    // default.
    function dfl(a, b, c) {
        switch (arguments.length) {
            case 2: return a != null ? a : b;
            case 3: return a != null ? a : b != null ? b : c;
            default: throw new Error('Implement me');
        }
    }

    function hasOwnProp(a, b) {
        return hasOwnProperty.call(a, b);
    }

    function defaultParsingFlags() {
        // We need to deep clone this object, and es5 standard is not very
        // helpful.
        return {
            empty : false,
            unusedTokens : [],
            unusedInput : [],
            overflow : -2,
            charsLeftOver : 0,
            nullInput : false,
            invalidMonth : null,
            invalidFormat : false,
            userInvalidated : false,
            iso: false
        };
    }

    function printMsg(msg) {
        if (moment.suppressDeprecationWarnings === false &&
            typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;
        return extend(function () {
            if (firstTime) {
                printMsg(msg);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            printMsg(msg);
            deprecations[name] = true;
        }
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.localeData().ordinal(func.call(this, a), period);
        };
    }

    function monthDiff(a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // thie is not supposed to happen
            return hour;
        }
    }

    /************************************
     Constructors
     ************************************/

    function Locale() {
    }

    // Moment prototype object
    function Moment(config, skipOverflow) {
        if (skipOverflow !== false) {
            checkOverflow(config);
        }
        copyConfig(this, config);
        this._d = new Date(+config._d);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            moment.updateOffset(this);
            updateInProgress = false;
        }
    }

    // Duration Constructor
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = moment.localeData();

        this._bubble();
    }

    /************************************
     Helpers
     ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = from._pf;
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = makeAs(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = moment.duration(val, period);
            addOrSubtractDurationFromMoment(this, dur, direction);
            return this;
        };
    }

    function addOrSubtractDurationFromMoment(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            rawSetter(mom, 'Date', rawGetter(mom, 'Date') + days * isAdding);
        }
        if (months) {
            rawMonthSetter(mom, rawGetter(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            moment.updateOffset(mom, days || months);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return Object.prototype.toString.call(input) === '[object Date]' ||
            input instanceof Date;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment._locale[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment._locale, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function weeksInYear(year, dow, doy) {
        return weekOfYear(moment([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                    m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                        m._a[HOUR] < 0 || m._a[HOUR] > 24 ||
                        (m._a[HOUR] === 24 && (m._a[MINUTE] !== 0 ||
                        m._a[SECOND] !== 0 ||
                        m._a[MILLISECOND] !== 0)) ? HOUR :
                            m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                                    m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                                        -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0 &&
                    m._pf.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        if (!locales[name] && hasModule) {
            try {
                oldLocale = moment.locale();
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we want to undo that for lazy loaded locales
                moment.locale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // Return a moment from input, that is local/utc/utcOffset equivalent to
    // model.
    function makeAs(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (moment.isMoment(input) || isDate(input) ?
                    +input : +moment(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            moment.updateOffset(res, false);
            return res;
        } else {
            return moment(input).local();
        }
    }

    /************************************
     Locale
     ************************************/


    extend(Locale.prototype, {

        set : function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
            // Lenient ordinal parsing accepts just a number in addition to
            // number + (possibly) stuff coming from _ordinalParseLenient.
            this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + /\d{1,2}/.source);
        },

        _months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        monthsShort : function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse : function (monthName, format, strict) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
                this._longMonthsParse = [];
                this._shortMonthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                mom = moment.utc([2000, i]);
                if (strict && !this._longMonthsParse[i]) {
                    this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                    this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
                }
                if (!strict && !this._monthsParse[i]) {
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                    return i;
                } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                    return i;
                } else if (!strict && this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        weekdaysMin : function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse : function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat : {
            LTS : 'h:mm:ss A',
            LT : 'h:mm A',
            L : 'MM/DD/YYYY',
            LL : 'MMMM D, YYYY',
            LLL : 'MMMM D, YYYY LT',
            LLLL : 'dddd, MMMM D, YYYY LT'
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM : function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse : /[ap]\.?m?\.?/i,
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },


        _calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        calendar : function (key, mom, now) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom, [now]) : output;
        },

        _relativeTime : {
            future : 'in %s',
            past : '%s ago',
            s : 'a few seconds',
            m : 'a minute',
            mm : '%d minutes',
            h : 'an hour',
            hh : '%d hours',
            d : 'a day',
            dd : '%d days',
            M : 'a month',
            MM : '%d months',
            y : 'a year',
            yy : '%d years'
        },

        relativeTime : function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },

        pastFuture : function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal : function (number) {
            return this._ordinal.replace('%d', number);
        },
        _ordinal : '%d',
        _ordinalParse : /\d{1,2}/,

        preparse : function (string) {
            return string;
        },

        postformat : function (string) {
            return string;
        },

        week : function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 1st is the first week of the year.
        },

        firstDayOfWeek : function () {
            return this._week.dow;
        },

        firstDayOfYear : function () {
            return this._week.doy;
        },

        _invalidDate: 'Invalid date',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    /************************************
     Formatting
     ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
     Parsing
     ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
            case 'Q':
                return parseTokenOneDigit;
            case 'DDDD':
                return parseTokenThreeDigits;
            case 'YYYY':
            case 'GGGG':
            case 'gggg':
                return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
            case 'Y':
            case 'G':
            case 'g':
                return parseTokenSignedNumber;
            case 'YYYYYY':
            case 'YYYYY':
            case 'GGGGG':
            case 'ggggg':
                return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
            case 'S':
                if (strict) {
                    return parseTokenOneDigit;
                }
            /* falls through */
            case 'SS':
                if (strict) {
                    return parseTokenTwoDigits;
                }
            /* falls through */
            case 'SSS':
                if (strict) {
                    return parseTokenThreeDigits;
                }
            /* falls through */
            case 'DDD':
                return parseTokenOneToThreeDigits;
            case 'MMM':
            case 'MMMM':
            case 'dd':
            case 'ddd':
            case 'dddd':
                return parseTokenWord;
            case 'a':
            case 'A':
                return config._locale._meridiemParse;
            case 'x':
                return parseTokenOffsetMs;
            case 'X':
                return parseTokenTimestampMs;
            case 'Z':
            case 'ZZ':
                return parseTokenTimezone;
            case 'T':
                return parseTokenT;
            case 'SSSS':
                return parseTokenDigits;
            case 'MM':
            case 'DD':
            case 'YY':
            case 'GG':
            case 'gg':
            case 'HH':
            case 'hh':
            case 'mm':
            case 'ss':
            case 'ww':
            case 'WW':
                return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
            case 'M':
            case 'D':
            case 'd':
            case 'H':
            case 'h':
            case 'm':
            case 's':
            case 'w':
            case 'W':
            case 'e':
            case 'E':
                return parseTokenOneOrTwoDigits;
            case 'Do':
                return strict ? config._locale._ordinalParse : config._locale._ordinalParseLenient;
            default :
                a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), 'i'));
                return a;
        }
    }

    function utcOffsetFromString(string) {
        string = string || '';
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
            // QUARTER
            case 'Q':
                if (input != null) {
                    datePartArray[MONTH] = (toInt(input) - 1) * 3;
                }
                break;
            // MONTH
            case 'M' : // fall through to MM
            case 'MM' :
                if (input != null) {
                    datePartArray[MONTH] = toInt(input) - 1;
                }
                break;
            case 'MMM' : // fall through to MMMM
            case 'MMMM' :
                a = config._locale.monthsParse(input, token, config._strict);
                // if we didn't find a month name, mark the date as invalid.
                if (a != null) {
                    datePartArray[MONTH] = a;
                } else {
                    config._pf.invalidMonth = input;
                }
                break;
            // DAY OF MONTH
            case 'D' : // fall through to DD
            case 'DD' :
                if (input != null) {
                    datePartArray[DATE] = toInt(input);
                }
                break;
            case 'Do' :
                if (input != null) {
                    datePartArray[DATE] = toInt(parseInt(
                        input.match(/\d{1,2}/)[0], 10));
                }
                break;
            // DAY OF YEAR
            case 'DDD' : // fall through to DDDD
            case 'DDDD' :
                if (input != null) {
                    config._dayOfYear = toInt(input);
                }

                break;
            // YEAR
            case 'YY' :
                datePartArray[YEAR] = moment.parseTwoDigitYear(input);
                break;
            case 'YYYY' :
            case 'YYYYY' :
            case 'YYYYYY' :
                datePartArray[YEAR] = toInt(input);
                break;
            // AM / PM
            case 'a' : // fall through to A
            case 'A' :
                config._meridiem = input;
                // config._isPm = config._locale.isPM(input);
                break;
            // HOUR
            case 'h' : // fall through to hh
            case 'hh' :
                config._pf.bigHour = true;
            /* falls through */
            case 'H' : // fall through to HH
            case 'HH' :
                datePartArray[HOUR] = toInt(input);
                break;
            // MINUTE
            case 'm' : // fall through to mm
            case 'mm' :
                datePartArray[MINUTE] = toInt(input);
                break;
            // SECOND
            case 's' : // fall through to ss
            case 'ss' :
                datePartArray[SECOND] = toInt(input);
                break;
            // MILLISECOND
            case 'S' :
            case 'SS' :
            case 'SSS' :
            case 'SSSS' :
                datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
                break;
            // UNIX OFFSET (MILLISECONDS)
            case 'x':
                config._d = new Date(toInt(input));
                break;
            // UNIX TIMESTAMP WITH MS
            case 'X':
                config._d = new Date(parseFloat(input) * 1000);
                break;
            // TIMEZONE
            case 'Z' : // fall through to ZZ
            case 'ZZ' :
                config._useUTC = true;
                config._tzm = utcOffsetFromString(input);
                break;
            // WEEKDAY - human
            case 'dd':
            case 'ddd':
            case 'dddd':
                a = config._locale.weekdaysParse(input);
                // if we didn't get a weekday name, mark the date as invalid
                if (a != null) {
                    config._w = config._w || {};
                    config._w['d'] = a;
                } else {
                    config._pf.invalidWeekday = input;
                }
                break;
            // WEEK, WEEK DAY - numeric
            case 'w':
            case 'ww':
            case 'W':
            case 'WW':
            case 'd':
            case 'e':
            case 'E':
                token = token.substr(0, 1);
            /* falls through */
            case 'gggg':
            case 'GGGG':
            case 'GGGGG':
                token = token.substr(0, 2);
                if (input) {
                    config._w = config._w || {};
                    config._w[token] = toInt(input);
                }
                break;
            case 'gg':
            case 'GG':
                config._w = config._w || {};
                config._w[token] = moment.parseTwoDigitYear(input);
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = dfl(w.GG, config._a[YEAR], weekOfYear(moment(), 1, 4).year);
            week = dfl(w.W, 1);
            weekday = dfl(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = dfl(w.gg, config._a[YEAR], weekOfYear(moment(), dow, doy).year);
            week = dfl(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = dfl(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dateFromObject(config) {
        var normalizedInput;

        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day || normalizedInput.date,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];

        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {
        if (config._f === moment.ISO_8601) {
            parseISO(config);
            return;
        }

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._pf.bigHour === true && config._a[HOUR] <= 12) {
            config._pf.bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR],
            config._meridiem);
        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function parseISO(config) {
        var i, l,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be 'T' or undefined
                    config._f = isoDates[i][0] + (match[6] || ' ');
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(parseTokenTimezone)) {
                config._f += 'Z';
            }
            makeDateFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function makeDateFromString(config) {
        parseISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            moment.createFromInputFallback(config);
        }
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function makeDateFromInput(config) {
        var input = config._i, matched;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if ((matched = aspNetJsonRegex.exec(input)) !== null) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            dateFromConfig(config);
        } else if (typeof(input) === 'object') {
            dateFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            moment.createFromInputFallback(config);
        }
    }

    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, locale) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = locale.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
     Relative Time
     ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(posNegDuration, withoutSuffix, locale) {
        var duration = moment.duration(posNegDuration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('M')),
            years = round(duration.as('y')),

            args = seconds < relativeTimeThresholds.s && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < relativeTimeThresholds.m && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < relativeTimeThresholds.h && ['hh', hours] ||
                days === 1 && ['d'] ||
                days < relativeTimeThresholds.d && ['dd', days] ||
                months === 1 && ['M'] ||
                months < relativeTimeThresholds.M && ['MM', months] ||
                years === 1 && ['y'] || ['yy', years];

        args[2] = withoutSuffix;
        args[3] = +posNegDuration > 0;
        args[4] = locale;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
     Week of Year
     ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;

        d = d === 0 ? 7 : d;
        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    /************************************
     Top Level Functions
     ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f,
            res;

        config._locale = config._locale || moment.localeData(config._l);

        if (input === null || (format === undefined && input === '')) {
            return moment.invalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (moment.isMoment(input)) {
            return new Moment(input, true);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        res = new Moment(config);
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    moment = function (input, format, locale, strict) {
        var c;

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = locale;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();

        return makeMoment(c);
    };

    moment.suppressDeprecationWarnings = false;

    moment.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return moment();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    moment.min = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    };

    moment.max = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    };

    // creating with utc
    moment.utc = function (input, format, locale, strict) {
        var c;

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return makeMoment(c).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            parseIso,
            diffRes;

        if (moment.isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            parseIso = function (inp) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            };
            duration = {
                y: parseIso(match[2]),
                M: parseIso(match[3]),
                d: parseIso(match[4]),
                h: parseIso(match[5]),
                m: parseIso(match[6]),
                s: parseIso(match[7]),
                w: parseIso(match[8])
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' &&
            ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(moment(duration.from), moment(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (moment.isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // constant that refers to the ISO standard
    moment.ISO_8601 = function () {};

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    moment.momentProperties = momentProperties;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () {};

    // This function allows you to set a threshold for relative time strings
    moment.relativeTimeThreshold = function (threshold, limit) {
        if (relativeTimeThresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return relativeTimeThresholds[threshold];
        }
        relativeTimeThresholds[threshold] = limit;
        return true;
    };

    moment.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        function (key, value) {
            return moment.locale(key, value);
        }
    );

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    moment.locale = function (key, values) {
        var data;
        if (key) {
            if (typeof(values) !== 'undefined') {
                data = moment.defineLocale(key, values);
            }
            else {
                data = moment.localeData(key);
            }

            if (data) {
                moment.duration._locale = moment._locale = data;
            }
        }

        return moment._locale._abbr;
    };

    moment.defineLocale = function (name, values) {
        if (values !== null) {
            values.abbr = name;
            if (!locales[name]) {
                locales[name] = new Locale();
            }
            locales[name].set(values);

            // backwards compat for now: also set the locale
            moment.locale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    };

    moment.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        function (key) {
            return moment.localeData(key);
        }
    );

    // returns locale data
    moment.localeData = function (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return moment._locale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null && hasOwnProp(obj, '_isAMomentObject'));
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function () {
        return moment.apply(null, arguments).parseZone();
    };

    moment.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    moment.isDate = isDate;

    /************************************
     Moment Prototype
     ************************************/


    extend(moment.fn = Moment.prototype, {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d - ((this._offset || 0) * 60000);
        },

        unix : function () {
            return Math.floor(+this / 1000);
        },

        toString : function () {
            return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
        },

        toDate : function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString : function () {
            var m = moment(this).utc();
            if (0 < m.year() && m.year() <= 9999) {
                if ('function' === typeof Date.prototype.toISOString) {
                    // native implementation is ~50x faster, use it when we can
                    return this.toDate().toISOString();
                } else {
                    return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
                }
            } else {
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid : function () {
            return isValid(this);
        },

        isDSTShifted : function () {
            if (this._a) {
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }

            return false;
        },

        parsingFlags : function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc : function (keepLocalTime) {
            return this.utcOffset(0, keepLocalTime);
        },

        local : function (keepLocalTime) {
            if (this._isUTC) {
                this.utcOffset(0, keepLocalTime);
                this._isUTC = false;

                if (keepLocalTime) {
                    this.subtract(this._dateUtcOffset(), 'm');
                }
            }
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.localeData().postformat(output);
        },

        add : createAdder(1, 'add'),

        subtract : createAdder(-1, 'subtract'),

        diff : function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (that.utcOffset() - this.utcOffset()) * 6e4,
                anchor, diff, output, daysAdjust;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month' || units === 'quarter') {
                output = monthDiff(this, that);
                if (units === 'quarter') {
                    output = output / 3;
                } else if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = this - that;
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                        units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                            units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                                units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function (time) {
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're locat/utc/offset
            // or not.
            var now = time || moment(),
                sod = makeAs(now, this).startOf('day'),
                diff = this.diff(sod, 'days', true),
                format = diff < -6 ? 'sameElse' :
                    diff < -1 ? 'lastWeek' :
                        diff < 0 ? 'lastDay' :
                            diff < 1 ? 'sameDay' :
                                diff < 2 ? 'nextDay' :
                                    diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.localeData().calendar(format, this, moment(now)));
        },

        isLeapYear : function () {
            return isLeapYear(this.year());
        },

        isDST : function () {
            return (this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.localeData());
                return this.add(input - day, 'd');
            } else {
                return day;
            }
        },

        month : makeAccessor('Month', true),

        startOf : function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
                case 'year':
                    this.month(0);
                /* falls through */
                case 'quarter':
                case 'month':
                    this.date(1);
                /* falls through */
                case 'week':
                case 'isoWeek':
                case 'day':
                    this.hours(0);
                /* falls through */
                case 'hour':
                    this.minutes(0);
                /* falls through */
                case 'minute':
                    this.seconds(0);
                /* falls through */
                case 'second':
                    this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            } else if (units === 'isoWeek') {
                this.isoWeekday(1);
            }

            // quarters are also special
            if (units === 'quarter') {
                this.month(Math.floor(this.month() / 3) * 3);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            if (units === undefined || units === 'millisecond') {
                return this;
            }
            return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
        },

        isAfter: function (input, units) {
            var inputMs;
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this > +input;
            } else {
                inputMs = moment.isMoment(input) ? +input : +moment(input);
                return inputMs < +this.clone().startOf(units);
            }
        },

        isBefore: function (input, units) {
            var inputMs;
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this < +input;
            } else {
                inputMs = moment.isMoment(input) ? +input : +moment(input);
                return +this.clone().endOf(units) < inputMs;
            }
        },

        isBetween: function (from, to, units) {
            return this.isAfter(from, units) && this.isBefore(to, units);
        },

        isSame: function (input, units) {
            var inputMs;
            units = normalizeUnits(units || 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this === +input;
            } else {
                inputMs = +moment(input);
                return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
            }
        },

        min: deprecate(
            'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
            function (other) {
                other = moment.apply(null, arguments);
                return other < this ? this : other;
            }
        ),

        max: deprecate(
            'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
            function (other) {
                other = moment.apply(null, arguments);
                return other > this ? this : other;
            }
        ),

        zone : deprecate(
            'moment().zone is deprecated, use moment().utcOffset instead. ' +
            'https://github.com/moment/moment/issues/1779',
            function (input, keepLocalTime) {
                if (input != null) {
                    if (typeof input !== 'string') {
                        input = -input;
                    }

                    this.utcOffset(input, keepLocalTime);

                    return this;
                } else {
                    return -this.utcOffset();
                }
            }
        ),

        // keepLocalTime = true means only change the timezone, without
        // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
        // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
        // +0200, so we adjust the time as needed, to be valid.
        //
        // Keeping the time actually adds/subtracts (one hour)
        // from the actual represented time. That is why we call updateOffset
        // a second time. In case it wants us to change the offset again
        // _changeInProgress == true case, then we have to adjust, because
        // there is no such time in the given timezone.
        utcOffset : function (input, keepLocalTime) {
            var offset = this._offset || 0,
                localAdjust;
            if (input != null) {
                if (typeof input === 'string') {
                    input = utcOffsetFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                if (!this._isUTC && keepLocalTime) {
                    localAdjust = this._dateUtcOffset();
                }
                this._offset = input;
                this._isUTC = true;
                if (localAdjust != null) {
                    this.add(localAdjust, 'm');
                }
                if (offset !== input) {
                    if (!keepLocalTime || this._changeInProgress) {
                        addOrSubtractDurationFromMoment(this,
                            moment.duration(input - offset, 'm'), 1, false);
                    } else if (!this._changeInProgress) {
                        this._changeInProgress = true;
                        moment.updateOffset(this, true);
                        this._changeInProgress = null;
                    }
                }

                return this;
            } else {
                return this._isUTC ? offset : this._dateUtcOffset();
            }
        },

        isLocal : function () {
            return !this._isUTC;
        },

        isUtcOffset : function () {
            return this._isUTC;
        },

        isUtc : function () {
            return this._isUTC && this._offset === 0;
        },

        zoneAbbr : function () {
            return this._isUTC ? 'UTC' : '';
        },

        zoneName : function () {
            return this._isUTC ? 'Coordinated Universal Time' : '';
        },

        parseZone : function () {
            if (this._tzm) {
                this.utcOffset(this._tzm);
            } else if (typeof this._i === 'string') {
                this.utcOffset(utcOffsetFromString(this._i));
            }
            return this;
        },

        hasAlignedHourOffset : function (input) {
            if (!input) {
                input = 0;
            }
            else {
                input = moment(input).utcOffset();
            }

            return (this.utcOffset() - input) % 60 === 0;
        },

        daysInMonth : function () {
            return daysInMonth(this.year(), this.month());
        },

        dayOfYear : function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
        },

        quarter : function (input) {
            return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
        },

        weekYear : function (input) {
            var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
            return input == null ? year : this.add((input - year), 'y');
        },

        isoWeekYear : function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add((input - year), 'y');
        },

        week : function (input) {
            var week = this.localeData().week(this);
            return input == null ? week : this.add((input - week) * 7, 'd');
        },

        isoWeek : function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add((input - week) * 7, 'd');
        },

        weekday : function (input) {
            var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
            return input == null ? weekday : this.add(input - weekday, 'd');
        },

        isoWeekday : function (input) {
            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },

        isoWeeksInYear : function () {
            return weeksInYear(this.year(), 1, 4);
        },

        weeksInYear : function () {
            var weekInfo = this.localeData()._week;
            return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set : function (units, value) {
            var unit;
            if (typeof units === 'object') {
                for (unit in units) {
                    this.set(unit, units[unit]);
                }
            }
            else {
                units = normalizeUnits(units);
                if (typeof this[units] === 'function') {
                    this[units](value);
                }
            }
            return this;
        },

        // If passed a locale key, it will set the locale for this
        // instance.  Otherwise, it will return the locale configuration
        // variables for this instance.
        locale : function (key) {
            var newLocaleData;

            if (key === undefined) {
                return this._locale._abbr;
            } else {
                newLocaleData = moment.localeData(key);
                if (newLocaleData != null) {
                    this._locale = newLocaleData;
                }
                return this;
            }
        },

        lang : deprecate(
            'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
            function (key) {
                if (key === undefined) {
                    return this.localeData();
                } else {
                    return this.locale(key);
                }
            }
        ),

        localeData : function () {
            return this._locale;
        },

        _dateUtcOffset : function () {
            // On Firefox.24 Date#getTimezoneOffset returns a floating point.
            // https://github.com/moment/moment/pull/1871
            return -Math.round(this._d.getTimezoneOffset() / 15) * 15;
        }

    });

    function rawMonthSetter(mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(),
            daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function rawGetter(mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function rawSetter(mom, unit, value) {
        if (unit === 'Month') {
            return rawMonthSetter(mom, value);
        } else {
            return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    function makeAccessor(unit, keepTime) {
        return function (value) {
            if (value != null) {
                rawSetter(this, unit, value);
                moment.updateOffset(this, keepTime);
                return this;
            } else {
                return rawGetter(this, unit);
            }
        };
    }

    moment.fn.millisecond = moment.fn.milliseconds = makeAccessor('Milliseconds', false);
    moment.fn.second = moment.fn.seconds = makeAccessor('Seconds', false);
    moment.fn.minute = moment.fn.minutes = makeAccessor('Minutes', false);
    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    moment.fn.hour = moment.fn.hours = makeAccessor('Hours', true);
    // moment.fn.month is defined separately
    moment.fn.date = makeAccessor('Date', true);
    moment.fn.dates = deprecate('dates accessor is deprecated. Use date instead.', makeAccessor('Date', true));
    moment.fn.year = makeAccessor('FullYear', true);
    moment.fn.years = deprecate('years accessor is deprecated. Use year instead.', makeAccessor('FullYear', true));

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;
    moment.fn.quarters = moment.fn.quarter;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    // alias isUtc for dev-friendliness
    moment.fn.isUTC = moment.fn.isUtc;

    /************************************
     Duration Prototype
     ************************************/


    function daysToYears (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        return days * 400 / 146097;
    }

    function yearsToDays (years) {
        // years * 365 + absRound(years / 4) -
        //     absRound(years / 100) + absRound(years / 400);
        return years * 146097 / 400;
    }

    extend(moment.duration.fn = Duration.prototype, {

        _bubble : function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years = 0;

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absRound(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;

            hours = absRound(minutes / 60);
            data.hours = hours % 24;

            days += absRound(hours / 24);

            // Accurately convert days to years, assume start from year 0.
            years = absRound(daysToYears(days));
            days -= absRound(yearsToDays(years));

            // 30 days to a month
            // TODO (iskren): Use anchor date (like 1st Jan) to compute this.
            months += absRound(days / 30);
            days %= 30;

            // 12 months -> 1 year
            years += absRound(months / 12);
            months %= 12;

            data.days = days;
            data.months = months;
            data.years = years;
        },

        abs : function () {
            this._milliseconds = Math.abs(this._milliseconds);
            this._days = Math.abs(this._days);
            this._months = Math.abs(this._months);

            this._data.milliseconds = Math.abs(this._data.milliseconds);
            this._data.seconds = Math.abs(this._data.seconds);
            this._data.minutes = Math.abs(this._data.minutes);
            this._data.hours = Math.abs(this._data.hours);
            this._data.months = Math.abs(this._data.months);
            this._data.years = Math.abs(this._data.years);

            return this;
        },

        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
                this._days * 864e5 +
                (this._months % 12) * 2592e6 +
                toInt(this._months / 12) * 31536e6;
        },

        humanize : function (withSuffix) {
            var output = relativeTime(this, !withSuffix, this.localeData());

            if (withSuffix) {
                output = this.localeData().pastFuture(+this, output);
            }

            return this.localeData().postformat(output);
        },

        add : function (input, val) {
            // supports only 2.0-style add(1, 's') or add(moment)
            var dur = moment.duration(input, val);

            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;

            this._bubble();

            return this;
        },

        subtract : function (input, val) {
            var dur = moment.duration(input, val);

            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;

            this._bubble();

            return this;
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as : function (units) {
            var days, months;
            units = normalizeUnits(units);

            if (units === 'month' || units === 'year') {
                days = this._days + this._milliseconds / 864e5;
                months = this._months + daysToYears(days) * 12;
                return units === 'month' ? months : months / 12;
            } else {
                // handle milliseconds separately because of floating point math errors (issue #1867)
                days = this._days + Math.round(yearsToDays(this._months / 12));
                switch (units) {
                    case 'week': return days / 7 + this._milliseconds / 6048e5;
                    case 'day': return days + this._milliseconds / 864e5;
                    case 'hour': return days * 24 + this._milliseconds / 36e5;
                    case 'minute': return days * 24 * 60 + this._milliseconds / 6e4;
                    case 'second': return days * 24 * 60 * 60 + this._milliseconds / 1000;
                    // Math.floor prevents floating point math errors here
                    case 'millisecond': return Math.floor(days * 24 * 60 * 60 * 1000) + this._milliseconds;
                    default: throw new Error('Unknown unit ' + units);
                }
            }
        },

        lang : moment.fn.lang,
        locale : moment.fn.locale,

        toIsoString : deprecate(
            'toIsoString() is deprecated. Please use toISOString() instead ' +
            '(notice the capitals)',
            function () {
                return this.toISOString();
            }
        ),

        toISOString : function () {
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            var years = Math.abs(this.years()),
                months = Math.abs(this.months()),
                days = Math.abs(this.days()),
                hours = Math.abs(this.hours()),
                minutes = Math.abs(this.minutes()),
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);

            if (!this.asSeconds()) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            return (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (years ? years + 'Y' : '') +
                (months ? months + 'M' : '') +
                (days ? days + 'D' : '') +
                ((hours || minutes || seconds) ? 'T' : '') +
                (hours ? hours + 'H' : '') +
                (minutes ? minutes + 'M' : '') +
                (seconds ? seconds + 'S' : '');
        },

        localeData : function () {
            return this._locale;
        },

        toJSON : function () {
            return this.toISOString();
        }
    });

    moment.duration.fn.toString = moment.duration.fn.toISOString;

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    for (i in unitMillisecondFactors) {
        if (hasOwnProp(unitMillisecondFactors, i)) {
            makeDurationGetter(i.toLowerCase());
        }
    }

    moment.duration.fn.asMilliseconds = function () {
        return this.as('ms');
    };
    moment.duration.fn.asSeconds = function () {
        return this.as('s');
    };
    moment.duration.fn.asMinutes = function () {
        return this.as('m');
    };
    moment.duration.fn.asHours = function () {
        return this.as('h');
    };
    moment.duration.fn.asDays = function () {
        return this.as('d');
    };
    moment.duration.fn.asWeeks = function () {
        return this.as('weeks');
    };
    moment.duration.fn.asMonths = function () {
        return this.as('M');
    };
    moment.duration.fn.asYears = function () {
        return this.as('y');
    };

    /************************************
     Default Locale
     ************************************/


    // Set default locale, other locale will inherit from English.
    moment.locale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                    (b === 1) ? 'st' :
                        (b === 2) ? 'nd' :
                            (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // moment.js locale configuration
// locale : afrikaans (af)
// author : Werner Mollentze : https://github.com/wernerm

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('af', {
            months : 'Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember'.split('_'),
            monthsShort : 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des'.split('_'),
            weekdays : 'Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag'.split('_'),
            weekdaysShort : 'Son_Maa_Din_Woe_Don_Vry_Sat'.split('_'),
            weekdaysMin : 'So_Ma_Di_Wo_Do_Vr_Sa'.split('_'),
            meridiemParse: /vm|nm/i,
            isPM : function (input) {
                return /^nm$/i.test(input);
            },
            meridiem : function (hours, minutes, isLower) {
                if (hours < 12) {
                    return isLower ? 'vm' : 'VM';
                } else {
                    return isLower ? 'nm' : 'NM';
                }
            },
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd, D MMMM YYYY LT'
            },
            calendar : {
                sameDay : '[Vandag om] LT',
                nextDay : '[Môre om] LT',
                nextWeek : 'dddd [om] LT',
                lastDay : '[Gister om] LT',
                lastWeek : '[Laas] dddd [om] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'oor %s',
                past : '%s gelede',
                s : '\'n paar sekondes',
                m : '\'n minuut',
                mm : '%d minute',
                h : '\'n uur',
                hh : '%d ure',
                d : '\'n dag',
                dd : '%d dae',
                M : '\'n maand',
                MM : '%d maande',
                y : '\'n jaar',
                yy : '%d jaar'
            },
            ordinalParse: /\d{1,2}(ste|de)/,
            ordinal : function (number) {
                return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de'); // Thanks to Joris Röling : https://github.com/jjupiter
            },
            week : {
                dow : 1, // Maandag is die eerste dag van die week.
                doy : 4  // Die week wat die 4de Januarie bevat is die eerste week van die jaar.
            }
        });
    }));
// moment.js locale configuration
// locale : Moroccan Arabic (ar-ma)
// author : ElFadili Yassine : https://github.com/ElFadiliY
// author : Abdel Said : https://github.com/abdelsaid

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('ar-ma', {
            months : 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
            monthsShort : 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
            weekdays : 'الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
            weekdaysShort : 'احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
            weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd D MMMM YYYY LT'
            },
            calendar : {
                sameDay: '[اليوم على الساعة] LT',
                nextDay: '[غدا على الساعة] LT',
                nextWeek: 'dddd [على الساعة] LT',
                lastDay: '[أمس على الساعة] LT',
                lastWeek: 'dddd [على الساعة] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : 'في %s',
                past : 'منذ %s',
                s : 'ثوان',
                m : 'دقيقة',
                mm : '%d دقائق',
                h : 'ساعة',
                hh : '%d ساعات',
                d : 'يوم',
                dd : '%d أيام',
                M : 'شهر',
                MM : '%d أشهر',
                y : 'سنة',
                yy : '%d سنوات'
            },
            week : {
                dow : 6, // Saturday is the first day of the week.
                doy : 12  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : Arabic Saudi Arabia (ar-sa)
// author : Suhail Alkowaileet : https://github.com/xsoh

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var symbolMap = {
            '1': '١',
            '2': '٢',
            '3': '٣',
            '4': '٤',
            '5': '٥',
            '6': '٦',
            '7': '٧',
            '8': '٨',
            '9': '٩',
            '0': '٠'
        }, numberMap = {
            '١': '1',
            '٢': '2',
            '٣': '3',
            '٤': '4',
            '٥': '5',
            '٦': '6',
            '٧': '7',
            '٨': '8',
            '٩': '9',
            '٠': '0'
        };

        return moment.defineLocale('ar-sa', {
            months : 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
            monthsShort : 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
            weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
            weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
            weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'HH:mm:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd D MMMM YYYY LT'
            },
            meridiemParse: /ص|م/,
            isPM : function (input) {
                return 'م' === input;
            },
            meridiem : function (hour, minute, isLower) {
                if (hour < 12) {
                    return 'ص';
                } else {
                    return 'م';
                }
            },
            calendar : {
                sameDay: '[اليوم على الساعة] LT',
                nextDay: '[غدا على الساعة] LT',
                nextWeek: 'dddd [على الساعة] LT',
                lastDay: '[أمس على الساعة] LT',
                lastWeek: 'dddd [على الساعة] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : 'في %s',
                past : 'منذ %s',
                s : 'ثوان',
                m : 'دقيقة',
                mm : '%d دقائق',
                h : 'ساعة',
                hh : '%d ساعات',
                d : 'يوم',
                dd : '%d أيام',
                M : 'شهر',
                MM : '%d أشهر',
                y : 'سنة',
                yy : '%d سنوات'
            },
            preparse: function (string) {
                return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
                    return numberMap[match];
                }).replace(/،/g, ',');
            },
            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                }).replace(/,/g, '،');
            },
            week : {
                dow : 6, // Saturday is the first day of the week.
                doy : 12  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale  : Tunisian Arabic (ar-tn)

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('ar-tn', {
            months: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
            monthsShort: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
            weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
            weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
            weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[اليوم على الساعة] LT',
                nextDay: '[غدا على الساعة] LT',
                nextWeek: 'dddd [على الساعة] LT',
                lastDay: '[أمس على الساعة] LT',
                lastWeek: 'dddd [على الساعة] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'في %s',
                past: 'منذ %s',
                s: 'ثوان',
                m: 'دقيقة',
                mm: '%d دقائق',
                h: 'ساعة',
                hh: '%d ساعات',
                d: 'يوم',
                dd: '%d أيام',
                M: 'شهر',
                MM: '%d أشهر',
                y: 'سنة',
                yy: '%d سنوات'
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4 // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// Locale: Arabic (ar)
// Author: Abdel Said: https://github.com/abdelsaid
// Changes in months, weekdays: Ahmed Elkhatib
// Native plural forms: forabi https://github.com/forabi

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var symbolMap = {
            '1': '١',
            '2': '٢',
            '3': '٣',
            '4': '٤',
            '5': '٥',
            '6': '٦',
            '7': '٧',
            '8': '٨',
            '9': '٩',
            '0': '٠'
        }, numberMap = {
            '١': '1',
            '٢': '2',
            '٣': '3',
            '٤': '4',
            '٥': '5',
            '٦': '6',
            '٧': '7',
            '٨': '8',
            '٩': '9',
            '٠': '0'
        }, pluralForm = function (n) {
            return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
        }, plurals = {
            s : ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
            m : ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
            h : ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
            d : ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
            M : ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
            y : ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام']
        }, pluralize = function (u) {
            return function (number, withoutSuffix, string, isFuture) {
                var f = pluralForm(number),
                    str = plurals[u][pluralForm(number)];
                if (f === 2) {
                    str = str[withoutSuffix ? 0 : 1];
                }
                return str.replace(/%d/i, number);
            };
        }, months = [
            'كانون الثاني يناير',
            'شباط فبراير',
            'آذار مارس',
            'نيسان أبريل',
            'أيار مايو',
            'حزيران يونيو',
            'تموز يوليو',
            'آب أغسطس',
            'أيلول سبتمبر',
            'تشرين الأول أكتوبر',
            'تشرين الثاني نوفمبر',
            'كانون الأول ديسمبر'
        ];

        return moment.defineLocale('ar', {
            months : months,
            monthsShort : months,
            weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
            weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
            weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'HH:mm:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd D MMMM YYYY LT'
            },
            meridiemParse: /ص|م/,
            isPM : function (input) {
                return 'م' === input;
            },
            meridiem : function (hour, minute, isLower) {
                if (hour < 12) {
                    return 'ص';
                } else {
                    return 'م';
                }
            },
            calendar : {
                sameDay: '[اليوم عند الساعة] LT',
                nextDay: '[غدًا عند الساعة] LT',
                nextWeek: 'dddd [عند الساعة] LT',
                lastDay: '[أمس عند الساعة] LT',
                lastWeek: 'dddd [عند الساعة] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : 'بعد %s',
                past : 'منذ %s',
                s : pluralize('s'),
                m : pluralize('m'),
                mm : pluralize('m'),
                h : pluralize('h'),
                hh : pluralize('h'),
                d : pluralize('d'),
                dd : pluralize('d'),
                M : pluralize('M'),
                MM : pluralize('M'),
                y : pluralize('y'),
                yy : pluralize('y')
            },
            preparse: function (string) {
                return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
                    return numberMap[match];
                }).replace(/،/g, ',');
            },
            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                }).replace(/,/g, '،');
            },
            week : {
                dow : 6, // Saturday is the first day of the week.
                doy : 12  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : azerbaijani (az)
// author : topchiyev : https://github.com/topchiyev

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var suffixes = {
            1: '-inci',
            5: '-inci',
            8: '-inci',
            70: '-inci',
            80: '-inci',

            2: '-nci',
            7: '-nci',
            20: '-nci',
            50: '-nci',

            3: '-üncü',
            4: '-üncü',
            100: '-üncü',

            6: '-ncı',

            9: '-uncu',
            10: '-uncu',
            30: '-uncu',

            60: '-ıncı',
            90: '-ıncı'
        };
        return moment.defineLocale('az', {
            months : 'yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr'.split('_'),
            monthsShort : 'yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek'.split('_'),
            weekdays : 'Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə'.split('_'),
            weekdaysShort : 'Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən'.split('_'),
            weekdaysMin : 'Bz_BE_ÇA_Çə_CA_Cü_Şə'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD.MM.YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd, D MMMM YYYY LT'
            },
            calendar : {
                sameDay : '[bugün saat] LT',
                nextDay : '[sabah saat] LT',
                nextWeek : '[gələn həftə] dddd [saat] LT',
                lastDay : '[dünən] LT',
                lastWeek : '[keçən həftə] dddd [saat] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : '%s sonra',
                past : '%s əvvəl',
                s : 'birneçə saniyyə',
                m : 'bir dəqiqə',
                mm : '%d dəqiqə',
                h : 'bir saat',
                hh : '%d saat',
                d : 'bir gün',
                dd : '%d gün',
                M : 'bir ay',
                MM : '%d ay',
                y : 'bir il',
                yy : '%d il'
            },
            meridiemParse: /gecə|səhər|gündüz|axşam/,
            isPM : function (input) {
                return /^(gündüz|axşam)$/.test(input);
            },
            meridiem : function (hour, minute, isLower) {
                if (hour < 4) {
                    return 'gecə';
                } else if (hour < 12) {
                    return 'səhər';
                } else if (hour < 17) {
                    return 'gündüz';
                } else {
                    return 'axşam';
                }
            },
            ordinalParse: /\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,
            ordinal : function (number) {
                if (number === 0) {  // special case for zero
                    return number + '-ıncı';
                }
                var a = number % 10,
                    b = number % 100 - a,
                    c = number >= 100 ? 100 : null;

                return number + (suffixes[a] || suffixes[b] || suffixes[c]);
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : belarusian (be)
// author : Dmitry Demidov : https://github.com/demidov91
// author: Praleska: http://praleska.pro/
// Author : Menelion Elensúle : https://github.com/Oire

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function plural(word, num) {
            var forms = word.split('_');
            return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
        }

        function relativeTimeWithPlural(number, withoutSuffix, key) {
            var format = {
                'mm': withoutSuffix ? 'хвіліна_хвіліны_хвілін' : 'хвіліну_хвіліны_хвілін',
                'hh': withoutSuffix ? 'гадзіна_гадзіны_гадзін' : 'гадзіну_гадзіны_гадзін',
                'dd': 'дзень_дні_дзён',
                'MM': 'месяц_месяцы_месяцаў',
                'yy': 'год_гады_гадоў'
            };
            if (key === 'm') {
                return withoutSuffix ? 'хвіліна' : 'хвіліну';
            }
            else if (key === 'h') {
                return withoutSuffix ? 'гадзіна' : 'гадзіну';
            }
            else {
                return number + ' ' + plural(format[key], +number);
            }
        }

        function monthsCaseReplace(m, format) {
            var months = {
                    'nominative': 'студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань'.split('_'),
                    'accusative': 'студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня'.split('_')
                },

                nounCase = (/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/).test(format) ?
                    'accusative' :
                    'nominative';

            return months[nounCase][m.month()];
        }

        function weekdaysCaseReplace(m, format) {
            var weekdays = {
                    'nominative': 'нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота'.split('_'),
                    'accusative': 'нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу'.split('_')
                },

                nounCase = (/\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/).test(format) ?
                    'accusative' :
                    'nominative';

            return weekdays[nounCase][m.day()];
        }

        return moment.defineLocale('be', {
            months : monthsCaseReplace,
            monthsShort : 'студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж'.split('_'),
            weekdays : weekdaysCaseReplace,
            weekdaysShort : 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
            weekdaysMin : 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD.MM.YYYY',
                LL : 'D MMMM YYYY г.',
                LLL : 'D MMMM YYYY г., LT',
                LLLL : 'dddd, D MMMM YYYY г., LT'
            },
            calendar : {
                sameDay: '[Сёння ў] LT',
                nextDay: '[Заўтра ў] LT',
                lastDay: '[Учора ў] LT',
                nextWeek: function () {
                    return '[У] dddd [ў] LT';
                },
                lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 5:
                        case 6:
                            return '[У мінулую] dddd [ў] LT';
                        case 1:
                        case 2:
                        case 4:
                            return '[У мінулы] dddd [ў] LT';
                    }
                },
                sameElse: 'L'
            },
            relativeTime : {
                future : 'праз %s',
                past : '%s таму',
                s : 'некалькі секунд',
                m : relativeTimeWithPlural,
                mm : relativeTimeWithPlural,
                h : relativeTimeWithPlural,
                hh : relativeTimeWithPlural,
                d : 'дзень',
                dd : relativeTimeWithPlural,
                M : 'месяц',
                MM : relativeTimeWithPlural,
                y : 'год',
                yy : relativeTimeWithPlural
            },
            meridiemParse: /ночы|раніцы|дня|вечара/,
            isPM : function (input) {
                return /^(дня|вечара)$/.test(input);
            },
            meridiem : function (hour, minute, isLower) {
                if (hour < 4) {
                    return 'ночы';
                } else if (hour < 12) {
                    return 'раніцы';
                } else if (hour < 17) {
                    return 'дня';
                } else {
                    return 'вечара';
                }
            },

            ordinalParse: /\d{1,2}-(і|ы|га)/,
            ordinal: function (number, period) {
                switch (period) {
                    case 'M':
                    case 'd':
                    case 'DDD':
                    case 'w':
                    case 'W':
                        return (number % 10 === 2 || number % 10 === 3) && (number % 100 !== 12 && number % 100 !== 13) ? number + '-і' : number + '-ы';
                    case 'D':
                        return number + '-га';
                    default:
                        return number;
                }
            },

            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : bulgarian (bg)
// author : Krasen Borisov : https://github.com/kraz

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('bg', {
            months : 'януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември'.split('_'),
            monthsShort : 'янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек'.split('_'),
            weekdays : 'неделя_понеделник_вторник_сряда_четвъртък_петък_събота'.split('_'),
            weekdaysShort : 'нед_пон_вто_сря_чет_пет_съб'.split('_'),
            weekdaysMin : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
            longDateFormat : {
                LT : 'H:mm',
                LTS : 'LT:ss',
                L : 'D.MM.YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd, D MMMM YYYY LT'
            },
            calendar : {
                sameDay : '[Днес в] LT',
                nextDay : '[Утре в] LT',
                nextWeek : 'dddd [в] LT',
                lastDay : '[Вчера в] LT',
                lastWeek : function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 6:
                            return '[В изминалата] dddd [в] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[В изминалия] dddd [в] LT';
                    }
                },
                sameElse : 'L'
            },
            relativeTime : {
                future : 'след %s',
                past : 'преди %s',
                s : 'няколко секунди',
                m : 'минута',
                mm : '%d минути',
                h : 'час',
                hh : '%d часа',
                d : 'ден',
                dd : '%d дни',
                M : 'месец',
                MM : '%d месеца',
                y : 'година',
                yy : '%d години'
            },
            ordinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
            ordinal : function (number) {
                var lastDigit = number % 10,
                    last2Digits = number % 100;
                if (number === 0) {
                    return number + '-ев';
                } else if (last2Digits === 0) {
                    return number + '-ен';
                } else if (last2Digits > 10 && last2Digits < 20) {
                    return number + '-ти';
                } else if (lastDigit === 1) {
                    return number + '-ви';
                } else if (lastDigit === 2) {
                    return number + '-ри';
                } else if (lastDigit === 7 || lastDigit === 8) {
                    return number + '-ми';
                } else {
                    return number + '-ти';
                }
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : Bengali (bn)
// author : Kaushik Gandhi : https://github.com/kaushikgandhi

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var symbolMap = {
                '1': '১',
                '2': '২',
                '3': '৩',
                '4': '৪',
                '5': '৫',
                '6': '৬',
                '7': '৭',
                '8': '৮',
                '9': '৯',
                '0': '০'
            },
            numberMap = {
                '১': '1',
                '২': '2',
                '৩': '3',
                '৪': '4',
                '৫': '5',
                '৬': '6',
                '৭': '7',
                '৮': '8',
                '৯': '9',
                '০': '0'
            };

        return moment.defineLocale('bn', {
            months : 'জানুয়ারী_ফেবুয়ারী_মার্চ_এপ্রিল_মে_জুন_জুলাই_অগাস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর'.split('_'),
            monthsShort : 'জানু_ফেব_মার্চ_এপর_মে_জুন_জুল_অগ_সেপ্ট_অক্টো_নভ_ডিসেম্'.split('_'),
            weekdays : 'রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পত্তিবার_শুক্রুবার_শনিবার'.split('_'),
            weekdaysShort : 'রবি_সোম_মঙ্গল_বুধ_বৃহস্পত্তি_শুক্রু_শনি'.split('_'),
            weekdaysMin : 'রব_সম_মঙ্গ_বু_ব্রিহ_শু_শনি'.split('_'),
            longDateFormat : {
                LT : 'A h:mm সময়',
                LTS : 'A h:mm:ss সময়',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY, LT',
                LLLL : 'dddd, D MMMM YYYY, LT'
            },
            calendar : {
                sameDay : '[আজ] LT',
                nextDay : '[আগামীকাল] LT',
                nextWeek : 'dddd, LT',
                lastDay : '[গতকাল] LT',
                lastWeek : '[গত] dddd, LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : '%s পরে',
                past : '%s আগে',
                s : 'কএক সেকেন্ড',
                m : 'এক মিনিট',
                mm : '%d মিনিট',
                h : 'এক ঘন্টা',
                hh : '%d ঘন্টা',
                d : 'এক দিন',
                dd : '%d দিন',
                M : 'এক মাস',
                MM : '%d মাস',
                y : 'এক বছর',
                yy : '%d বছর'
            },
            preparse: function (string) {
                return string.replace(/[১২৩৪৫৬৭৮৯০]/g, function (match) {
                    return numberMap[match];
                });
            },
            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                });
            },
            meridiemParse: /রাত|শকাল|দুপুর|বিকেল|রাত/,
            isPM: function (input) {
                return /^(দুপুর|বিকেল|রাত)$/.test(input);
            },
            //Bengali is a vast language its spoken
            //in different forms in various parts of the world.
            //I have just generalized with most common one used
            meridiem : function (hour, minute, isLower) {
                if (hour < 4) {
                    return 'রাত';
                } else if (hour < 10) {
                    return 'শকাল';
                } else if (hour < 17) {
                    return 'দুপুর';
                } else if (hour < 20) {
                    return 'বিকেল';
                } else {
                    return 'রাত';
                }
            },
            week : {
                dow : 0, // Sunday is the first day of the week.
                doy : 6  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : tibetan (bo)
// author : Thupten N. Chakrishar : https://github.com/vajradog

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var symbolMap = {
                '1': '༡',
                '2': '༢',
                '3': '༣',
                '4': '༤',
                '5': '༥',
                '6': '༦',
                '7': '༧',
                '8': '༨',
                '9': '༩',
                '0': '༠'
            },
            numberMap = {
                '༡': '1',
                '༢': '2',
                '༣': '3',
                '༤': '4',
                '༥': '5',
                '༦': '6',
                '༧': '7',
                '༨': '8',
                '༩': '9',
                '༠': '0'
            };

        return moment.defineLocale('bo', {
            months : 'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split('_'),
            monthsShort : 'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split('_'),
            weekdays : 'གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་'.split('_'),
            weekdaysShort : 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split('_'),
            weekdaysMin : 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split('_'),
            longDateFormat : {
                LT : 'A h:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY, LT',
                LLLL : 'dddd, D MMMM YYYY, LT'
            },
            calendar : {
                sameDay : '[དི་རིང] LT',
                nextDay : '[སང་ཉིན] LT',
                nextWeek : '[བདུན་ཕྲག་རྗེས་མ], LT',
                lastDay : '[ཁ་སང] LT',
                lastWeek : '[བདུན་ཕྲག་མཐའ་མ] dddd, LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : '%s ལ་',
                past : '%s སྔན་ལ',
                s : 'ལམ་སང',
                m : 'སྐར་མ་གཅིག',
                mm : '%d སྐར་མ',
                h : 'ཆུ་ཚོད་གཅིག',
                hh : '%d ཆུ་ཚོད',
                d : 'ཉིན་གཅིག',
                dd : '%d ཉིན་',
                M : 'ཟླ་བ་གཅིག',
                MM : '%d ཟླ་བ',
                y : 'ལོ་གཅིག',
                yy : '%d ལོ'
            },
            preparse: function (string) {
                return string.replace(/[༡༢༣༤༥༦༧༨༩༠]/g, function (match) {
                    return numberMap[match];
                });
            },
            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                });
            },
            meridiemParse: /མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,
            isPM: function (input) {
                return /^(ཉིན་གུང|དགོང་དག|མཚན་མོ)$/.test(input);
            },
            meridiem : function (hour, minute, isLower) {
                if (hour < 4) {
                    return 'མཚན་མོ';
                } else if (hour < 10) {
                    return 'ཞོགས་ཀས';
                } else if (hour < 17) {
                    return 'ཉིན་གུང';
                } else if (hour < 20) {
                    return 'དགོང་དག';
                } else {
                    return 'མཚན་མོ';
                }
            },
            week : {
                dow : 0, // Sunday is the first day of the week.
                doy : 6  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : breton (br)
// author : Jean-Baptiste Le Duigou : https://github.com/jbleduigou

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function relativeTimeWithMutation(number, withoutSuffix, key) {
            var format = {
                'mm': 'munutenn',
                'MM': 'miz',
                'dd': 'devezh'
            };
            return number + ' ' + mutation(format[key], number);
        }

        function specialMutationForYears(number) {
            switch (lastNumber(number)) {
                case 1:
                case 3:
                case 4:
                case 5:
                case 9:
                    return number + ' bloaz';
                default:
                    return number + ' vloaz';
            }
        }

        function lastNumber(number) {
            if (number > 9) {
                return lastNumber(number % 10);
            }
            return number;
        }

        function mutation(text, number) {
            if (number === 2) {
                return softMutation(text);
            }
            return text;
        }

        function softMutation(text) {
            var mutationTable = {
                'm': 'v',
                'b': 'v',
                'd': 'z'
            };
            if (mutationTable[text.charAt(0)] === undefined) {
                return text;
            }
            return mutationTable[text.charAt(0)] + text.substring(1);
        }

        return moment.defineLocale('br', {
            months : 'Genver_C\'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu'.split('_'),
            monthsShort : 'Gen_C\'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker'.split('_'),
            weekdays : 'Sul_Lun_Meurzh_Merc\'her_Yaou_Gwener_Sadorn'.split('_'),
            weekdaysShort : 'Sul_Lun_Meu_Mer_Yao_Gwe_Sad'.split('_'),
            weekdaysMin : 'Su_Lu_Me_Mer_Ya_Gw_Sa'.split('_'),
            longDateFormat : {
                LT : 'h[e]mm A',
                LTS : 'h[e]mm:ss A',
                L : 'DD/MM/YYYY',
                LL : 'D [a viz] MMMM YYYY',
                LLL : 'D [a viz] MMMM YYYY LT',
                LLLL : 'dddd, D [a viz] MMMM YYYY LT'
            },
            calendar : {
                sameDay : '[Hiziv da] LT',
                nextDay : '[Warc\'hoazh da] LT',
                nextWeek : 'dddd [da] LT',
                lastDay : '[Dec\'h da] LT',
                lastWeek : 'dddd [paset da] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'a-benn %s',
                past : '%s \'zo',
                s : 'un nebeud segondennoù',
                m : 'ur vunutenn',
                mm : relativeTimeWithMutation,
                h : 'un eur',
                hh : '%d eur',
                d : 'un devezh',
                dd : relativeTimeWithMutation,
                M : 'ur miz',
                MM : relativeTimeWithMutation,
                y : 'ur bloaz',
                yy : specialMutationForYears
            },
            ordinalParse: /\d{1,2}(añ|vet)/,
            ordinal : function (number) {
                var output = (number === 1) ? 'añ' : 'vet';
                return number + output;
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : bosnian (bs)
// author : Nedim Cholich : https://github.com/frontyard
// based on (hr) translation by Bojan Marković

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function translate(number, withoutSuffix, key) {
            var result = number + ' ';
            switch (key) {
                case 'm':
                    return withoutSuffix ? 'jedna minuta' : 'jedne minute';
                case 'mm':
                    if (number === 1) {
                        result += 'minuta';
                    } else if (number === 2 || number === 3 || number === 4) {
                        result += 'minute';
                    } else {
                        result += 'minuta';
                    }
                    return result;
                case 'h':
                    return withoutSuffix ? 'jedan sat' : 'jednog sata';
                case 'hh':
                    if (number === 1) {
                        result += 'sat';
                    } else if (number === 2 || number === 3 || number === 4) {
                        result += 'sata';
                    } else {
                        result += 'sati';
                    }
                    return result;
                case 'dd':
                    if (number === 1) {
                        result += 'dan';
                    } else {
                        result += 'dana';
                    }
                    return result;
                case 'MM':
                    if (number === 1) {
                        result += 'mjesec';
                    } else if (number === 2 || number === 3 || number === 4) {
                        result += 'mjeseca';
                    } else {
                        result += 'mjeseci';
                    }
                    return result;
                case 'yy':
                    if (number === 1) {
                        result += 'godina';
                    } else if (number === 2 || number === 3 || number === 4) {
                        result += 'godine';
                    } else {
                        result += 'godina';
                    }
                    return result;
            }
        }

        return moment.defineLocale('bs', {
            months : 'januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar'.split('_'),
            monthsShort : 'jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.'.split('_'),
            weekdays : 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
            weekdaysShort : 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
            weekdaysMin : 'ne_po_ut_sr_če_pe_su'.split('_'),
            longDateFormat : {
                LT : 'H:mm',
                LTS : 'LT:ss',
                L : 'DD. MM. YYYY',
                LL : 'D. MMMM YYYY',
                LLL : 'D. MMMM YYYY LT',
                LLLL : 'dddd, D. MMMM YYYY LT'
            },
            calendar : {
                sameDay  : '[danas u] LT',
                nextDay  : '[sutra u] LT',

                nextWeek : function () {
                    switch (this.day()) {
                        case 0:
                            return '[u] [nedjelju] [u] LT';
                        case 3:
                            return '[u] [srijedu] [u] LT';
                        case 6:
                            return '[u] [subotu] [u] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[u] dddd [u] LT';
                    }
                },
                lastDay  : '[jučer u] LT',
                lastWeek : function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                            return '[prošlu] dddd [u] LT';
                        case 6:
                            return '[prošle] [subote] [u] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[prošli] dddd [u] LT';
                    }
                },
                sameElse : 'L'
            },
            relativeTime : {
                future : 'za %s',
                past   : 'prije %s',
                s      : 'par sekundi',
                m      : translate,
                mm     : translate,
                h      : translate,
                hh     : translate,
                d      : 'dan',
                dd     : translate,
                M      : 'mjesec',
                MM     : translate,
                y      : 'godinu',
                yy     : translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : catalan (ca)
// author : Juan G. Hurtado : https://github.com/juanghurtado

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('ca', {
            months : 'gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre'.split('_'),
            monthsShort : 'gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.'.split('_'),
            weekdays : 'diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte'.split('_'),
            weekdaysShort : 'dg._dl._dt._dc._dj._dv._ds.'.split('_'),
            weekdaysMin : 'Dg_Dl_Dt_Dc_Dj_Dv_Ds'.split('_'),
            longDateFormat : {
                LT : 'H:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd D MMMM YYYY LT'
            },
            calendar : {
                sameDay : function () {
                    return '[avui a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
                },
                nextDay : function () {
                    return '[demà a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
                },
                nextWeek : function () {
                    return 'dddd [a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
                },
                lastDay : function () {
                    return '[ahir a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
                },
                lastWeek : function () {
                    return '[el] dddd [passat a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
                },
                sameElse : 'L'
            },
            relativeTime : {
                future : 'en %s',
                past : 'fa %s',
                s : 'uns segons',
                m : 'un minut',
                mm : '%d minuts',
                h : 'una hora',
                hh : '%d hores',
                d : 'un dia',
                dd : '%d dies',
                M : 'un mes',
                MM : '%d mesos',
                y : 'un any',
                yy : '%d anys'
            },
            ordinalParse: /\d{1,2}(r|n|t|è|a)/,
            ordinal : function (number, period) {
                var output = (number === 1) ? 'r' :
                    (number === 2) ? 'n' :
                        (number === 3) ? 'r' :
                            (number === 4) ? 't' : 'è';
                if (period === 'w' || period === 'W') {
                    output = 'a';
                }
                return number + output;
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : czech (cs)
// author : petrbela : https://github.com/petrbela

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var months = 'leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec'.split('_'),
            monthsShort = 'led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro'.split('_');

        function plural(n) {
            return (n > 1) && (n < 5) && (~~(n / 10) !== 1);
        }

        function translate(number, withoutSuffix, key, isFuture) {
            var result = number + ' ';
            switch (key) {
                case 's':  // a few seconds / in a few seconds / a few seconds ago
                    return (withoutSuffix || isFuture) ? 'pár sekund' : 'pár sekundami';
                case 'm':  // a minute / in a minute / a minute ago
                    return withoutSuffix ? 'minuta' : (isFuture ? 'minutu' : 'minutou');
                case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'minuty' : 'minut');
                    } else {
                        return result + 'minutami';
                    }
                    break;
                case 'h':  // an hour / in an hour / an hour ago
                    return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
                case 'hh': // 9 hours / in 9 hours / 9 hours ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'hodiny' : 'hodin');
                    } else {
                        return result + 'hodinami';
                    }
                    break;
                case 'd':  // a day / in a day / a day ago
                    return (withoutSuffix || isFuture) ? 'den' : 'dnem';
                case 'dd': // 9 days / in 9 days / 9 days ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'dny' : 'dní');
                    } else {
                        return result + 'dny';
                    }
                    break;
                case 'M':  // a month / in a month / a month ago
                    return (withoutSuffix || isFuture) ? 'měsíc' : 'měsícem';
                case 'MM': // 9 months / in 9 months / 9 months ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'měsíce' : 'měsíců');
                    } else {
                        return result + 'měsíci';
                    }
                    break;
                case 'y':  // a year / in a year / a year ago
                    return (withoutSuffix || isFuture) ? 'rok' : 'rokem';
                case 'yy': // 9 years / in 9 years / 9 years ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'roky' : 'let');
                    } else {
                        return result + 'lety';
                    }
                    break;
            }
        }

        return moment.defineLocale('cs', {
            months : months,
            monthsShort : monthsShort,
            monthsParse : (function (months, monthsShort) {
                var i, _monthsParse = [];
                for (i = 0; i < 12; i++) {
                    // use custom parser to solve problem with July (červenec)
                    _monthsParse[i] = new RegExp('^' + months[i] + '$|^' + monthsShort[i] + '$', 'i');
                }
                return _monthsParse;
            }(months, monthsShort)),
            weekdays : 'neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota'.split('_'),
            weekdaysShort : 'ne_po_út_st_čt_pá_so'.split('_'),
            weekdaysMin : 'ne_po_út_st_čt_pá_so'.split('_'),
            longDateFormat : {
                LT: 'H:mm',
                LTS : 'LT:ss',
                L : 'DD.MM.YYYY',
                LL : 'D. MMMM YYYY',
                LLL : 'D. MMMM YYYY LT',
                LLLL : 'dddd D. MMMM YYYY LT'
            },
            calendar : {
                sameDay: '[dnes v] LT',
                nextDay: '[zítra v] LT',
                nextWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return '[v neděli v] LT';
                        case 1:
                        case 2:
                            return '[v] dddd [v] LT';
                        case 3:
                            return '[ve středu v] LT';
                        case 4:
                            return '[ve čtvrtek v] LT';
                        case 5:
                            return '[v pátek v] LT';
                        case 6:
                            return '[v sobotu v] LT';
                    }
                },
                lastDay: '[včera v] LT',
                lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return '[minulou neděli v] LT';
                        case 1:
                        case 2:
                            return '[minulé] dddd [v] LT';
                        case 3:
                            return '[minulou středu v] LT';
                        case 4:
                        case 5:
                            return '[minulý] dddd [v] LT';
                        case 6:
                            return '[minulou sobotu v] LT';
                    }
                },
                sameElse: 'L'
            },
            relativeTime : {
                future : 'za %s',
                past : 'před %s',
                s : translate,
                m : translate,
                mm : translate,
                h : translate,
                hh : translate,
                d : translate,
                dd : translate,
                M : translate,
                MM : translate,
                y : translate,
                yy : translate
            },
            ordinalParse : /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : chuvash (cv)
// author : Anatoly Mironov : https://github.com/mirontoli

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('cv', {
            months : 'кăрлач_нарăс_пуш_ака_май_çĕртме_утă_çурла_авăн_юпа_чӳк_раштав'.split('_'),
            monthsShort : 'кăр_нар_пуш_ака_май_çĕр_утă_çур_ав_юпа_чӳк_раш'.split('_'),
            weekdays : 'вырсарникун_тунтикун_ытларикун_юнкун_кĕçнерникун_эрнекун_шăматкун'.split('_'),
            weekdaysShort : 'выр_тун_ытл_юн_кĕç_эрн_шăм'.split('_'),
            weekdaysMin : 'вр_тн_ыт_юн_кç_эр_шм'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD-MM-YYYY',
                LL : 'YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ]',
                LLL : 'YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT',
                LLLL : 'dddd, YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT'
            },
            calendar : {
                sameDay: '[Паян] LT [сехетре]',
                nextDay: '[Ыран] LT [сехетре]',
                lastDay: '[Ĕнер] LT [сехетре]',
                nextWeek: '[Çитес] dddd LT [сехетре]',
                lastWeek: '[Иртнĕ] dddd LT [сехетре]',
                sameElse: 'L'
            },
            relativeTime : {
                future : function (output) {
                    var affix = /сехет$/i.exec(output) ? 'рен' : /çул$/i.exec(output) ? 'тан' : 'ран';
                    return output + affix;
                },
                past : '%s каялла',
                s : 'пĕр-ик çеккунт',
                m : 'пĕр минут',
                mm : '%d минут',
                h : 'пĕр сехет',
                hh : '%d сехет',
                d : 'пĕр кун',
                dd : '%d кун',
                M : 'пĕр уйăх',
                MM : '%d уйăх',
                y : 'пĕр çул',
                yy : '%d çул'
            },
            ordinalParse: /\d{1,2}-мĕш/,
            ordinal : '%d-мĕш',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : Welsh (cy)
// author : Robert Allen

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('cy', {
            months: 'Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr'.split('_'),
            monthsShort: 'Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag'.split('_'),
            weekdays: 'Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn'.split('_'),
            weekdaysShort: 'Sul_Llun_Maw_Mer_Iau_Gwe_Sad'.split('_'),
            weekdaysMin: 'Su_Ll_Ma_Me_Ia_Gw_Sa'.split('_'),
            // time formats are the same as en-gb
            longDateFormat: {
                LT: 'HH:mm',
                LTS : 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd, D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Heddiw am] LT',
                nextDay: '[Yfory am] LT',
                nextWeek: 'dddd [am] LT',
                lastDay: '[Ddoe am] LT',
                lastWeek: 'dddd [diwethaf am] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'mewn %s',
                past: '%s yn ôl',
                s: 'ychydig eiliadau',
                m: 'munud',
                mm: '%d munud',
                h: 'awr',
                hh: '%d awr',
                d: 'diwrnod',
                dd: '%d diwrnod',
                M: 'mis',
                MM: '%d mis',
                y: 'blwyddyn',
                yy: '%d flynedd'
            },
            ordinalParse: /\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,
            // traditional ordinal numbers above 31 are not commonly used in colloquial Welsh
            ordinal: function (number) {
                var b = number,
                    output = '',
                    lookup = [
                        '', 'af', 'il', 'ydd', 'ydd', 'ed', 'ed', 'ed', 'fed', 'fed', 'fed', // 1af to 10fed
                        'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'fed' // 11eg to 20fed
                    ];

                if (b > 20) {
                    if (b === 40 || b === 50 || b === 60 || b === 80 || b === 100) {
                        output = 'fed'; // not 30ain, 70ain or 90ain
                    } else {
                        output = 'ain';
                    }
                } else if (b > 0) {
                    output = lookup[b];
                }

                return number + output;
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : danish (da)
// author : Ulrik Nielsen : https://github.com/mrbase

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('da', {
            months : 'januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december'.split('_'),
            monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
            weekdays : 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
            weekdaysShort : 'søn_man_tir_ons_tor_fre_lør'.split('_'),
            weekdaysMin : 'sø_ma_ti_on_to_fr_lø'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D. MMMM YYYY',
                LLL : 'D. MMMM YYYY LT',
                LLLL : 'dddd [d.] D. MMMM YYYY LT'
            },
            calendar : {
                sameDay : '[I dag kl.] LT',
                nextDay : '[I morgen kl.] LT',
                nextWeek : 'dddd [kl.] LT',
                lastDay : '[I går kl.] LT',
                lastWeek : '[sidste] dddd [kl] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'om %s',
                past : '%s siden',
                s : 'få sekunder',
                m : 'et minut',
                mm : '%d minutter',
                h : 'en time',
                hh : '%d timer',
                d : 'en dag',
                dd : '%d dage',
                M : 'en måned',
                MM : '%d måneder',
                y : 'et år',
                yy : '%d år'
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : austrian german (de-at)
// author : lluchs : https://github.com/lluchs
// author: Menelion Elensúle: https://github.com/Oire
// author : Martin Groller : https://github.com/MadMG

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function processRelativeTime(number, withoutSuffix, key, isFuture) {
            var format = {
                'm': ['eine Minute', 'einer Minute'],
                'h': ['eine Stunde', 'einer Stunde'],
                'd': ['ein Tag', 'einem Tag'],
                'dd': [number + ' Tage', number + ' Tagen'],
                'M': ['ein Monat', 'einem Monat'],
                'MM': [number + ' Monate', number + ' Monaten'],
                'y': ['ein Jahr', 'einem Jahr'],
                'yy': [number + ' Jahre', number + ' Jahren']
            };
            return withoutSuffix ? format[key][0] : format[key][1];
        }

        return moment.defineLocale('de-at', {
            months : 'Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
            monthsShort : 'Jän._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
            weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
            weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
            weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
            longDateFormat : {
                LT: 'HH:mm',
                LTS: 'HH:mm:ss',
                L : 'DD.MM.YYYY',
                LL : 'D. MMMM YYYY',
                LLL : 'D. MMMM YYYY LT',
                LLLL : 'dddd, D. MMMM YYYY LT'
            },
            calendar : {
                sameDay: '[Heute um] LT [Uhr]',
                sameElse: 'L',
                nextDay: '[Morgen um] LT [Uhr]',
                nextWeek: 'dddd [um] LT [Uhr]',
                lastDay: '[Gestern um] LT [Uhr]',
                lastWeek: '[letzten] dddd [um] LT [Uhr]'
            },
            relativeTime : {
                future : 'in %s',
                past : 'vor %s',
                s : 'ein paar Sekunden',
                m : processRelativeTime,
                mm : '%d Minuten',
                h : processRelativeTime,
                hh : '%d Stunden',
                d : processRelativeTime,
                dd : processRelativeTime,
                M : processRelativeTime,
                MM : processRelativeTime,
                y : processRelativeTime,
                yy : processRelativeTime
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : german (de)
// author : lluchs : https://github.com/lluchs
// author: Menelion Elensúle: https://github.com/Oire

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function processRelativeTime(number, withoutSuffix, key, isFuture) {
            var format = {
                'm': ['eine Minute', 'einer Minute'],
                'h': ['eine Stunde', 'einer Stunde'],
                'd': ['ein Tag', 'einem Tag'],
                'dd': [number + ' Tage', number + ' Tagen'],
                'M': ['ein Monat', 'einem Monat'],
                'MM': [number + ' Monate', number + ' Monaten'],
                'y': ['ein Jahr', 'einem Jahr'],
                'yy': [number + ' Jahre', number + ' Jahren']
            };
            return withoutSuffix ? format[key][0] : format[key][1];
        }

        return moment.defineLocale('de', {
            months : 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
            monthsShort : 'Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
            weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
            weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
            weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
            longDateFormat : {
                LT: 'HH:mm',
                LTS: 'HH:mm:ss',
                L : 'DD.MM.YYYY',
                LL : 'D. MMMM YYYY',
                LLL : 'D. MMMM YYYY LT',
                LLLL : 'dddd, D. MMMM YYYY LT'
            },
            calendar : {
                sameDay: '[Heute um] LT [Uhr]',
                sameElse: 'L',
                nextDay: '[Morgen um] LT [Uhr]',
                nextWeek: 'dddd [um] LT [Uhr]',
                lastDay: '[Gestern um] LT [Uhr]',
                lastWeek: '[letzten] dddd [um] LT [Uhr]'
            },
            relativeTime : {
                future : 'in %s',
                past : 'vor %s',
                s : 'ein paar Sekunden',
                m : processRelativeTime,
                mm : '%d Minuten',
                h : processRelativeTime,
                hh : '%d Stunden',
                d : processRelativeTime,
                dd : processRelativeTime,
                M : processRelativeTime,
                MM : processRelativeTime,
                y : processRelativeTime,
                yy : processRelativeTime
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : modern greek (el)
// author : Aggelos Karalias : https://github.com/mehiel

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('el', {
            monthsNominativeEl : 'Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος'.split('_'),
            monthsGenitiveEl : 'Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου'.split('_'),
            months : function (momentToFormat, format) {
                if (/D/.test(format.substring(0, format.indexOf('MMMM')))) { // if there is a day number before 'MMMM'
                    return this._monthsGenitiveEl[momentToFormat.month()];
                } else {
                    return this._monthsNominativeEl[momentToFormat.month()];
                }
            },
            monthsShort : 'Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ'.split('_'),
            weekdays : 'Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο'.split('_'),
            weekdaysShort : 'Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ'.split('_'),
            weekdaysMin : 'Κυ_Δε_Τρ_Τε_Πε_Πα_Σα'.split('_'),
            meridiem : function (hours, minutes, isLower) {
                if (hours > 11) {
                    return isLower ? 'μμ' : 'ΜΜ';
                } else {
                    return isLower ? 'πμ' : 'ΠΜ';
                }
            },
            isPM : function (input) {
                return ((input + '').toLowerCase()[0] === 'μ');
            },
            meridiemParse : /[ΠΜ]\.?Μ?\.?/i,
            longDateFormat : {
                LT : 'h:mm A',
                LTS : 'h:mm:ss A',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd, D MMMM YYYY LT'
            },
            calendarEl : {
                sameDay : '[Σήμερα {}] LT',
                nextDay : '[Αύριο {}] LT',
                nextWeek : 'dddd [{}] LT',
                lastDay : '[Χθες {}] LT',
                lastWeek : function () {
                    switch (this.day()) {
                        case 6:
                            return '[το προηγούμενο] dddd [{}] LT';
                        default:
                            return '[την προηγούμενη] dddd [{}] LT';
                    }
                },
                sameElse : 'L'
            },
            calendar : function (key, mom) {
                var output = this._calendarEl[key],
                    hours = mom && mom.hours();

                if (typeof output === 'function') {
                    output = output.apply(mom);
                }

                return output.replace('{}', (hours % 12 === 1 ? 'στη' : 'στις'));
            },
            relativeTime : {
                future : 'σε %s',
                past : '%s πριν',
                s : 'λίγα δευτερόλεπτα',
                m : 'ένα λεπτό',
                mm : '%d λεπτά',
                h : 'μία ώρα',
                hh : '%d ώρες',
                d : 'μία μέρα',
                dd : '%d μέρες',
                M : 'ένας μήνας',
                MM : '%d μήνες',
                y : 'ένας χρόνος',
                yy : '%d χρόνια'
            },
            ordinalParse: /\d{1,2}η/,
            ordinal: '%dη',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : australian english (en-au)

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('en-au', {
            months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
            monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
            weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
            weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
            weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
            longDateFormat : {
                LT : 'h:mm A',
                LTS : 'h:mm:ss A',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd, D MMMM YYYY LT'
            },
            calendar : {
                sameDay : '[Today at] LT',
                nextDay : '[Tomorrow at] LT',
                nextWeek : 'dddd [at] LT',
                lastDay : '[Yesterday at] LT',
                lastWeek : '[Last] dddd [at] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'in %s',
                past : '%s ago',
                s : 'a few seconds',
                m : 'a minute',
                mm : '%d minutes',
                h : 'an hour',
                hh : '%d hours',
                d : 'a day',
                dd : '%d days',
                M : 'a month',
                MM : '%d months',
                y : 'a year',
                yy : '%d years'
            },
            ordinalParse: /\d{1,2}(st|nd|rd|th)/,
            ordinal : function (number) {
                var b = number % 10,
                    output = (~~(number % 100 / 10) === 1) ? 'th' :
                        (b === 1) ? 'st' :
                            (b === 2) ? 'nd' :
                                (b === 3) ? 'rd' : 'th';
                return number + output;
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : canadian english (en-ca)
// author : Jonathan Abourbih : https://github.com/jonbca

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('en-ca', {
            months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
            monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
            weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
            weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
            weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
            longDateFormat : {
                LT : 'h:mm A',
                LTS : 'h:mm:ss A',
                L : 'YYYY-MM-DD',
                LL : 'D MMMM, YYYY',
                LLL : 'D MMMM, YYYY LT',
                LLLL : 'dddd, D MMMM, YYYY LT'
            },
            calendar : {
                sameDay : '[Today at] LT',
                nextDay : '[Tomorrow at] LT',
                nextWeek : 'dddd [at] LT',
                lastDay : '[Yesterday at] LT',
                lastWeek : '[Last] dddd [at] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'in %s',
                past : '%s ago',
                s : 'a few seconds',
                m : 'a minute',
                mm : '%d minutes',
                h : 'an hour',
                hh : '%d hours',
                d : 'a day',
                dd : '%d days',
                M : 'a month',
                MM : '%d months',
                y : 'a year',
                yy : '%d years'
            },
            ordinalParse: /\d{1,2}(st|nd|rd|th)/,
            ordinal : function (number) {
                var b = number % 10,
                    output = (~~(number % 100 / 10) === 1) ? 'th' :
                        (b === 1) ? 'st' :
                            (b === 2) ? 'nd' :
                                (b === 3) ? 'rd' : 'th';
                return number + output;
            }
        });
    }));
// moment.js locale configuration
// locale : great britain english (en-gb)
// author : Chris Gedrim : https://github.com/chrisgedrim

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('en-gb', {
            months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
            monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
            weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
            weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
            weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'HH:mm:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd, D MMMM YYYY LT'
            },
            calendar : {
                sameDay : '[Today at] LT',
                nextDay : '[Tomorrow at] LT',
                nextWeek : 'dddd [at] LT',
                lastDay : '[Yesterday at] LT',
                lastWeek : '[Last] dddd [at] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'in %s',
                past : '%s ago',
                s : 'a few seconds',
                m : 'a minute',
                mm : '%d minutes',
                h : 'an hour',
                hh : '%d hours',
                d : 'a day',
                dd : '%d days',
                M : 'a month',
                MM : '%d months',
                y : 'a year',
                yy : '%d years'
            },
            ordinalParse: /\d{1,2}(st|nd|rd|th)/,
            ordinal : function (number) {
                var b = number % 10,
                    output = (~~(number % 100 / 10) === 1) ? 'th' :
                        (b === 1) ? 'st' :
                            (b === 2) ? 'nd' :
                                (b === 3) ? 'rd' : 'th';
                return number + output;
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : esperanto (eo)
// author : Colin Dean : https://github.com/colindean
// komento: Mi estas malcerta se mi korekte traktis akuzativojn en tiu traduko.
//          Se ne, bonvolu korekti kaj avizi min por ke mi povas lerni!

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('eo', {
            months : 'januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro'.split('_'),
            monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec'.split('_'),
            weekdays : 'Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato'.split('_'),
            weekdaysShort : 'Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab'.split('_'),
            weekdaysMin : 'Di_Lu_Ma_Me_Ĵa_Ve_Sa'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'YYYY-MM-DD',
                LL : 'D[-an de] MMMM, YYYY',
                LLL : 'D[-an de] MMMM, YYYY LT',
                LLLL : 'dddd, [la] D[-an de] MMMM, YYYY LT'
            },
            meridiemParse: /[ap]\.t\.m/i,
            isPM: function (input) {
                return input.charAt(0).toLowerCase() === 'p';
            },
            meridiem : function (hours, minutes, isLower) {
                if (hours > 11) {
                    return isLower ? 'p.t.m.' : 'P.T.M.';
                } else {
                    return isLower ? 'a.t.m.' : 'A.T.M.';
                }
            },
            calendar : {
                sameDay : '[Hodiaŭ je] LT',
                nextDay : '[Morgaŭ je] LT',
                nextWeek : 'dddd [je] LT',
                lastDay : '[Hieraŭ je] LT',
                lastWeek : '[pasinta] dddd [je] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'je %s',
                past : 'antaŭ %s',
                s : 'sekundoj',
                m : 'minuto',
                mm : '%d minutoj',
                h : 'horo',
                hh : '%d horoj',
                d : 'tago',//ne 'diurno', ĉar estas uzita por proksimumo
                dd : '%d tagoj',
                M : 'monato',
                MM : '%d monatoj',
                y : 'jaro',
                yy : '%d jaroj'
            },
            ordinalParse: /\d{1,2}a/,
            ordinal : '%da',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : spanish (es)
// author : Julio Napurí : https://github.com/julionc

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_'),
            monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

        return moment.defineLocale('es', {
            months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
            monthsShort : function (m, format) {
                if (/-MMM-/.test(format)) {
                    return monthsShort[m.month()];
                } else {
                    return monthsShortDot[m.month()];
                }
            },
            weekdays : 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
            weekdaysShort : 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
            weekdaysMin : 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_'),
            longDateFormat : {
                LT : 'H:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D [de] MMMM [de] YYYY',
                LLL : 'D [de] MMMM [de] YYYY LT',
                LLLL : 'dddd, D [de] MMMM [de] YYYY LT'
            },
            calendar : {
                sameDay : function () {
                    return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
                },
                nextDay : function () {
                    return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
                },
                nextWeek : function () {
                    return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
                },
                lastDay : function () {
                    return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
                },
                lastWeek : function () {
                    return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
                },
                sameElse : 'L'
            },
            relativeTime : {
                future : 'en %s',
                past : 'hace %s',
                s : 'unos segundos',
                m : 'un minuto',
                mm : '%d minutos',
                h : 'una hora',
                hh : '%d horas',
                d : 'un día',
                dd : '%d días',
                M : 'un mes',
                MM : '%d meses',
                y : 'un año',
                yy : '%d años'
            },
            ordinalParse : /\d{1,2}º/,
            ordinal : '%dº',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : estonian (et)
// author : Henry Kehlmann : https://github.com/madhenry
// improvements : Illimar Tambek : https://github.com/ragulka

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function processRelativeTime(number, withoutSuffix, key, isFuture) {
            var format = {
                's' : ['mõne sekundi', 'mõni sekund', 'paar sekundit'],
                'm' : ['ühe minuti', 'üks minut'],
                'mm': [number + ' minuti', number + ' minutit'],
                'h' : ['ühe tunni', 'tund aega', 'üks tund'],
                'hh': [number + ' tunni', number + ' tundi'],
                'd' : ['ühe päeva', 'üks päev'],
                'M' : ['kuu aja', 'kuu aega', 'üks kuu'],
                'MM': [number + ' kuu', number + ' kuud'],
                'y' : ['ühe aasta', 'aasta', 'üks aasta'],
                'yy': [number + ' aasta', number + ' aastat']
            };
            if (withoutSuffix) {
                return format[key][2] ? format[key][2] : format[key][1];
            }
            return isFuture ? format[key][0] : format[key][1];
        }

        return moment.defineLocale('et', {
            months        : 'jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember'.split('_'),
            monthsShort   : 'jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets'.split('_'),
            weekdays      : 'pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev'.split('_'),
            weekdaysShort : 'P_E_T_K_N_R_L'.split('_'),
            weekdaysMin   : 'P_E_T_K_N_R_L'.split('_'),
            longDateFormat : {
                LT   : 'H:mm',
                LTS : 'LT:ss',
                L    : 'DD.MM.YYYY',
                LL   : 'D. MMMM YYYY',
                LLL  : 'D. MMMM YYYY LT',
                LLLL : 'dddd, D. MMMM YYYY LT'
            },
            calendar : {
                sameDay  : '[Täna,] LT',
                nextDay  : '[Homme,] LT',
                nextWeek : '[Järgmine] dddd LT',
                lastDay  : '[Eile,] LT',
                lastWeek : '[Eelmine] dddd LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : '%s pärast',
                past   : '%s tagasi',
                s      : processRelativeTime,
                m      : processRelativeTime,
                mm     : processRelativeTime,
                h      : processRelativeTime,
                hh     : processRelativeTime,
                d      : processRelativeTime,
                dd     : '%d päeva',
                M      : processRelativeTime,
                MM     : processRelativeTime,
                y      : processRelativeTime,
                yy     : processRelativeTime
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : euskara (eu)
// author : Eneko Illarramendi : https://github.com/eillarra

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('eu', {
            months : 'urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua'.split('_'),
            monthsShort : 'urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.'.split('_'),
            weekdays : 'igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata'.split('_'),
            weekdaysShort : 'ig._al._ar._az._og._ol._lr.'.split('_'),
            weekdaysMin : 'ig_al_ar_az_og_ol_lr'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'YYYY-MM-DD',
                LL : 'YYYY[ko] MMMM[ren] D[a]',
                LLL : 'YYYY[ko] MMMM[ren] D[a] LT',
                LLLL : 'dddd, YYYY[ko] MMMM[ren] D[a] LT',
                l : 'YYYY-M-D',
                ll : 'YYYY[ko] MMM D[a]',
                lll : 'YYYY[ko] MMM D[a] LT',
                llll : 'ddd, YYYY[ko] MMM D[a] LT'
            },
            calendar : {
                sameDay : '[gaur] LT[etan]',
                nextDay : '[bihar] LT[etan]',
                nextWeek : 'dddd LT[etan]',
                lastDay : '[atzo] LT[etan]',
                lastWeek : '[aurreko] dddd LT[etan]',
                sameElse : 'L'
            },
            relativeTime : {
                future : '%s barru',
                past : 'duela %s',
                s : 'segundo batzuk',
                m : 'minutu bat',
                mm : '%d minutu',
                h : 'ordu bat',
                hh : '%d ordu',
                d : 'egun bat',
                dd : '%d egun',
                M : 'hilabete bat',
                MM : '%d hilabete',
                y : 'urte bat',
                yy : '%d urte'
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : Persian (fa)
// author : Ebrahim Byagowi : https://github.com/ebraminio

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var symbolMap = {
            '1': '۱',
            '2': '۲',
            '3': '۳',
            '4': '۴',
            '5': '۵',
            '6': '۶',
            '7': '۷',
            '8': '۸',
            '9': '۹',
            '0': '۰'
        }, numberMap = {
            '۱': '1',
            '۲': '2',
            '۳': '3',
            '۴': '4',
            '۵': '5',
            '۶': '6',
            '۷': '7',
            '۸': '8',
            '۹': '9',
            '۰': '0'
        };

        return moment.defineLocale('fa', {
            months : 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
            monthsShort : 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
            weekdays : 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
            weekdaysShort : 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
            weekdaysMin : 'ی_د_س_چ_پ_ج_ش'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd, D MMMM YYYY LT'
            },
            meridiemParse: /قبل از ظهر|بعد از ظهر/,
            isPM: function (input) {
                return /بعد از ظهر/.test(input);
            },
            meridiem : function (hour, minute, isLower) {
                if (hour < 12) {
                    return 'قبل از ظهر';
                } else {
                    return 'بعد از ظهر';
                }
            },
            calendar : {
                sameDay : '[امروز ساعت] LT',
                nextDay : '[فردا ساعت] LT',
                nextWeek : 'dddd [ساعت] LT',
                lastDay : '[دیروز ساعت] LT',
                lastWeek : 'dddd [پیش] [ساعت] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'در %s',
                past : '%s پیش',
                s : 'چندین ثانیه',
                m : 'یک دقیقه',
                mm : '%d دقیقه',
                h : 'یک ساعت',
                hh : '%d ساعت',
                d : 'یک روز',
                dd : '%d روز',
                M : 'یک ماه',
                MM : '%d ماه',
                y : 'یک سال',
                yy : '%d سال'
            },
            preparse: function (string) {
                return string.replace(/[۰-۹]/g, function (match) {
                    return numberMap[match];
                }).replace(/،/g, ',');
            },
            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                }).replace(/,/g, '،');
            },
            ordinalParse: /\d{1,2}م/,
            ordinal : '%dم',
            week : {
                dow : 6, // Saturday is the first day of the week.
                doy : 12 // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : finnish (fi)
// author : Tarmo Aidantausta : https://github.com/bleadof

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var numbersPast = 'nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän'.split(' '),
            numbersFuture = [
                'nolla', 'yhden', 'kahden', 'kolmen', 'neljän', 'viiden', 'kuuden',
                numbersPast[7], numbersPast[8], numbersPast[9]
            ];

        function translate(number, withoutSuffix, key, isFuture) {
            var result = '';
            switch (key) {
                case 's':
                    return isFuture ? 'muutaman sekunnin' : 'muutama sekunti';
                case 'm':
                    return isFuture ? 'minuutin' : 'minuutti';
                case 'mm':
                    result = isFuture ? 'minuutin' : 'minuuttia';
                    break;
                case 'h':
                    return isFuture ? 'tunnin' : 'tunti';
                case 'hh':
                    result = isFuture ? 'tunnin' : 'tuntia';
                    break;
                case 'd':
                    return isFuture ? 'päivän' : 'päivä';
                case 'dd':
                    result = isFuture ? 'päivän' : 'päivää';
                    break;
                case 'M':
                    return isFuture ? 'kuukauden' : 'kuukausi';
                case 'MM':
                    result = isFuture ? 'kuukauden' : 'kuukautta';
                    break;
                case 'y':
                    return isFuture ? 'vuoden' : 'vuosi';
                case 'yy':
                    result = isFuture ? 'vuoden' : 'vuotta';
                    break;
            }
            result = verbalNumber(number, isFuture) + ' ' + result;
            return result;
        }

        function verbalNumber(number, isFuture) {
            return number < 10 ? (isFuture ? numbersFuture[number] : numbersPast[number]) : number;
        }

        return moment.defineLocale('fi', {
            months : 'tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu'.split('_'),
            monthsShort : 'tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu'.split('_'),
            weekdays : 'sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai'.split('_'),
            weekdaysShort : 'su_ma_ti_ke_to_pe_la'.split('_'),
            weekdaysMin : 'su_ma_ti_ke_to_pe_la'.split('_'),
            longDateFormat : {
                LT : 'HH.mm',
                LTS : 'HH.mm.ss',
                L : 'DD.MM.YYYY',
                LL : 'Do MMMM[ta] YYYY',
                LLL : 'Do MMMM[ta] YYYY, [klo] LT',
                LLLL : 'dddd, Do MMMM[ta] YYYY, [klo] LT',
                l : 'D.M.YYYY',
                ll : 'Do MMM YYYY',
                lll : 'Do MMM YYYY, [klo] LT',
                llll : 'ddd, Do MMM YYYY, [klo] LT'
            },
            calendar : {
                sameDay : '[tänään] [klo] LT',
                nextDay : '[huomenna] [klo] LT',
                nextWeek : 'dddd [klo] LT',
                lastDay : '[eilen] [klo] LT',
                lastWeek : '[viime] dddd[na] [klo] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : '%s päästä',
                past : '%s sitten',
                s : translate,
                m : translate,
                mm : translate,
                h : translate,
                hh : translate,
                d : translate,
                dd : translate,
                M : translate,
                MM : translate,
                y : translate,
                yy : translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : faroese (fo)
// author : Ragnar Johannesen : https://github.com/ragnar123

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('fo', {
            months : 'januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
            monthsShort : 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
            weekdays : 'sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur'.split('_'),
            weekdaysShort : 'sun_mán_týs_mik_hós_frí_ley'.split('_'),
            weekdaysMin : 'su_má_tý_mi_hó_fr_le'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd D. MMMM, YYYY LT'
            },
            calendar : {
                sameDay : '[Í dag kl.] LT',
                nextDay : '[Í morgin kl.] LT',
                nextWeek : 'dddd [kl.] LT',
                lastDay : '[Í gjár kl.] LT',
                lastWeek : '[síðstu] dddd [kl] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'um %s',
                past : '%s síðani',
                s : 'fá sekund',
                m : 'ein minutt',
                mm : '%d minuttir',
                h : 'ein tími',
                hh : '%d tímar',
                d : 'ein dagur',
                dd : '%d dagar',
                M : 'ein mánaði',
                MM : '%d mánaðir',
                y : 'eitt ár',
                yy : '%d ár'
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : canadian french (fr-ca)
// author : Jonathan Abourbih : https://github.com/jonbca

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('fr-ca', {
            months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
            monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
            weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
            weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
            weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'YYYY-MM-DD',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd D MMMM YYYY LT'
            },
            calendar : {
                sameDay: '[Aujourd\'hui à] LT',
                nextDay: '[Demain à] LT',
                nextWeek: 'dddd [à] LT',
                lastDay: '[Hier à] LT',
                lastWeek: 'dddd [dernier à] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : 'dans %s',
                past : 'il y a %s',
                s : 'quelques secondes',
                m : 'une minute',
                mm : '%d minutes',
                h : 'une heure',
                hh : '%d heures',
                d : 'un jour',
                dd : '%d jours',
                M : 'un mois',
                MM : '%d mois',
                y : 'un an',
                yy : '%d ans'
            },
            ordinalParse: /\d{1,2}(er|)/,
            ordinal : function (number) {
                return number + (number === 1 ? 'er' : '');
            }
        });
    }));
// moment.js locale configuration
// locale : french (fr)
// author : John Fischer : https://github.com/jfroffice

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('fr', {
            months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
            monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
            weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
            weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
            weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd D MMMM YYYY LT'
            },
            calendar : {
                sameDay: '[Aujourd\'hui à] LT',
                nextDay: '[Demain à] LT',
                nextWeek: 'dddd [à] LT',
                lastDay: '[Hier à] LT',
                lastWeek: 'dddd [dernier à] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : 'dans %s',
                past : 'il y a %s',
                s : 'quelques secondes',
                m : 'une minute',
                mm : '%d minutes',
                h : 'une heure',
                hh : '%d heures',
                d : 'un jour',
                dd : '%d jours',
                M : 'un mois',
                MM : '%d mois',
                y : 'un an',
                yy : '%d ans'
            },
            ordinalParse: /\d{1,2}(er|)/,
            ordinal : function (number) {
                return number + (number === 1 ? 'er' : '');
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : frisian (fy)
// author : Robin van der Vliet : https://github.com/robin0van0der0v

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var monthsShortWithDots = 'jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.'.split('_'),
            monthsShortWithoutDots = 'jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_');

        return moment.defineLocale('fy', {
            months : 'jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber'.split('_'),
            monthsShort : function (m, format) {
                if (/-MMM-/.test(format)) {
                    return monthsShortWithoutDots[m.month()];
                } else {
                    return monthsShortWithDots[m.month()];
                }
            },
            weekdays : 'snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon'.split('_'),
            weekdaysShort : 'si._mo._ti._wo._to._fr._so.'.split('_'),
            weekdaysMin : 'Si_Mo_Ti_Wo_To_Fr_So'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD-MM-YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd D MMMM YYYY LT'
            },
            calendar : {
                sameDay: '[hjoed om] LT',
                nextDay: '[moarn om] LT',
                nextWeek: 'dddd [om] LT',
                lastDay: '[juster om] LT',
                lastWeek: '[ôfrûne] dddd [om] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : 'oer %s',
                past : '%s lyn',
                s : 'in pear sekonden',
                m : 'ien minút',
                mm : '%d minuten',
                h : 'ien oere',
                hh : '%d oeren',
                d : 'ien dei',
                dd : '%d dagen',
                M : 'ien moanne',
                MM : '%d moannen',
                y : 'ien jier',
                yy : '%d jierren'
            },
            ordinalParse: /\d{1,2}(ste|de)/,
            ordinal : function (number) {
                return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : galician (gl)
// author : Juan G. Hurtado : https://github.com/juanghurtado

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('gl', {
            months : 'Xaneiro_Febreiro_Marzo_Abril_Maio_Xuño_Xullo_Agosto_Setembro_Outubro_Novembro_Decembro'.split('_'),
            monthsShort : 'Xan._Feb._Mar._Abr._Mai._Xuñ._Xul._Ago._Set._Out._Nov._Dec.'.split('_'),
            weekdays : 'Domingo_Luns_Martes_Mércores_Xoves_Venres_Sábado'.split('_'),
            weekdaysShort : 'Dom._Lun._Mar._Mér._Xov._Ven._Sáb.'.split('_'),
            weekdaysMin : 'Do_Lu_Ma_Mé_Xo_Ve_Sá'.split('_'),
            longDateFormat : {
                LT : 'H:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd D MMMM YYYY LT'
            },
            calendar : {
                sameDay : function () {
                    return '[hoxe ' + ((this.hours() !== 1) ? 'ás' : 'á') + '] LT';
                },
                nextDay : function () {
                    return '[mañá ' + ((this.hours() !== 1) ? 'ás' : 'á') + '] LT';
                },
                nextWeek : function () {
                    return 'dddd [' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
                },
                lastDay : function () {
                    return '[onte ' + ((this.hours() !== 1) ? 'á' : 'a') + '] LT';
                },
                lastWeek : function () {
                    return '[o] dddd [pasado ' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
                },
                sameElse : 'L'
            },
            relativeTime : {
                future : function (str) {
                    if (str === 'uns segundos') {
                        return 'nuns segundos';
                    }
                    return 'en ' + str;
                },
                past : 'hai %s',
                s : 'uns segundos',
                m : 'un minuto',
                mm : '%d minutos',
                h : 'unha hora',
                hh : '%d horas',
                d : 'un día',
                dd : '%d días',
                M : 'un mes',
                MM : '%d meses',
                y : 'un ano',
                yy : '%d anos'
            },
            ordinalParse : /\d{1,2}º/,
            ordinal : '%dº',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : Hebrew (he)
// author : Tomer Cohen : https://github.com/tomer
// author : Moshe Simantov : https://github.com/DevelopmentIL
// author : Tal Ater : https://github.com/TalAter

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('he', {
            months : 'ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר'.split('_'),
            monthsShort : 'ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳'.split('_'),
            weekdays : 'ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת'.split('_'),
            weekdaysShort : 'א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳'.split('_'),
            weekdaysMin : 'א_ב_ג_ד_ה_ו_ש'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D [ב]MMMM YYYY',
                LLL : 'D [ב]MMMM YYYY LT',
                LLLL : 'dddd, D [ב]MMMM YYYY LT',
                l : 'D/M/YYYY',
                ll : 'D MMM YYYY',
                lll : 'D MMM YYYY LT',
                llll : 'ddd, D MMM YYYY LT'
            },
            calendar : {
                sameDay : '[היום ב־]LT',
                nextDay : '[מחר ב־]LT',
                nextWeek : 'dddd [בשעה] LT',
                lastDay : '[אתמול ב־]LT',
                lastWeek : '[ביום] dddd [האחרון בשעה] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'בעוד %s',
                past : 'לפני %s',
                s : 'מספר שניות',
                m : 'דקה',
                mm : '%d דקות',
                h : 'שעה',
                hh : function (number) {
                    if (number === 2) {
                        return 'שעתיים';
                    }
                    return number + ' שעות';
                },
                d : 'יום',
                dd : function (number) {
                    if (number === 2) {
                        return 'יומיים';
                    }
                    return number + ' ימים';
                },
                M : 'חודש',
                MM : function (number) {
                    if (number === 2) {
                        return 'חודשיים';
                    }
                    return number + ' חודשים';
                },
                y : 'שנה',
                yy : function (number) {
                    if (number === 2) {
                        return 'שנתיים';
                    } else if (number % 10 === 0 && number !== 10) {
                        return number + ' שנה';
                    }
                    return number + ' שנים';
                }
            }
        });
    }));
// moment.js locale configuration
// locale : hindi (hi)
// author : Mayank Singhal : https://github.com/mayanksinghal

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var symbolMap = {
                '1': '१',
                '2': '२',
                '3': '३',
                '4': '४',
                '5': '५',
                '6': '६',
                '7': '७',
                '8': '८',
                '9': '९',
                '0': '०'
            },
            numberMap = {
                '१': '1',
                '२': '2',
                '३': '3',
                '४': '4',
                '५': '5',
                '६': '6',
                '७': '7',
                '८': '8',
                '९': '9',
                '०': '0'
            };

        return moment.defineLocale('hi', {
            months : 'जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर'.split('_'),
            monthsShort : 'जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.'.split('_'),
            weekdays : 'रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
            weekdaysShort : 'रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि'.split('_'),
            weekdaysMin : 'र_सो_मं_बु_गु_शु_श'.split('_'),
            longDateFormat : {
                LT : 'A h:mm बजे',
                LTS : 'A h:mm:ss बजे',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY, LT',
                LLLL : 'dddd, D MMMM YYYY, LT'
            },
            calendar : {
                sameDay : '[आज] LT',
                nextDay : '[कल] LT',
                nextWeek : 'dddd, LT',
                lastDay : '[कल] LT',
                lastWeek : '[पिछले] dddd, LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : '%s में',
                past : '%s पहले',
                s : 'कुछ ही क्षण',
                m : 'एक मिनट',
                mm : '%d मिनट',
                h : 'एक घंटा',
                hh : '%d घंटे',
                d : 'एक दिन',
                dd : '%d दिन',
                M : 'एक महीने',
                MM : '%d महीने',
                y : 'एक वर्ष',
                yy : '%d वर्ष'
            },
            preparse: function (string) {
                return string.replace(/[१२३४५६७८९०]/g, function (match) {
                    return numberMap[match];
                });
            },
            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                });
            },
            // Hindi notation for meridiems are quite fuzzy in practice. While there exists
            // a rigid notion of a 'Pahar' it is not used as rigidly in modern Hindi.
            meridiemParse: /रात|सुबह|दोपहर|शाम/,
            meridiemHour : function (hour, meridiem) {
                if (hour === 12) {
                    hour = 0;
                }
                if (meridiem === 'रात') {
                    return hour < 4 ? hour : hour + 12;
                } else if (meridiem === 'सुबह') {
                    return hour;
                } else if (meridiem === 'दोपहर') {
                    return hour >= 10 ? hour : hour + 12;
                } else if (meridiem === 'शाम') {
                    return hour + 12;
                }
            },
            meridiem : function (hour, minute, isLower) {
                if (hour < 4) {
                    return 'रात';
                } else if (hour < 10) {
                    return 'सुबह';
                } else if (hour < 17) {
                    return 'दोपहर';
                } else if (hour < 20) {
                    return 'शाम';
                } else {
                    return 'रात';
                }
            },
            week : {
                dow : 0, // Sunday is the first day of the week.
                doy : 6  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : hrvatski (hr)
// author : Bojan Marković : https://github.com/bmarkovic

// based on (sl) translation by Robert Sedovšek

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function translate(number, withoutSuffix, key) {
            var result = number + ' ';
            switch (key) {
                case 'm':
                    return withoutSuffix ? 'jedna minuta' : 'jedne minute';
                case 'mm':
                    if (number === 1) {
                        result += 'minuta';
                    } else if (number === 2 || number === 3 || number === 4) {
                        result += 'minute';
                    } else {
                        result += 'minuta';
                    }
                    return result;
                case 'h':
                    return withoutSuffix ? 'jedan sat' : 'jednog sata';
                case 'hh':
                    if (number === 1) {
                        result += 'sat';
                    } else if (number === 2 || number === 3 || number === 4) {
                        result += 'sata';
                    } else {
                        result += 'sati';
                    }
                    return result;
                case 'dd':
                    if (number === 1) {
                        result += 'dan';
                    } else {
                        result += 'dana';
                    }
                    return result;
                case 'MM':
                    if (number === 1) {
                        result += 'mjesec';
                    } else if (number === 2 || number === 3 || number === 4) {
                        result += 'mjeseca';
                    } else {
                        result += 'mjeseci';
                    }
                    return result;
                case 'yy':
                    if (number === 1) {
                        result += 'godina';
                    } else if (number === 2 || number === 3 || number === 4) {
                        result += 'godine';
                    } else {
                        result += 'godina';
                    }
                    return result;
            }
        }

        return moment.defineLocale('hr', {
            months : 'sječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac'.split('_'),
            monthsShort : 'sje._vel._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.'.split('_'),
            weekdays : 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
            weekdaysShort : 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
            weekdaysMin : 'ne_po_ut_sr_če_pe_su'.split('_'),
            longDateFormat : {
                LT : 'H:mm',
                LTS : 'LT:ss',
                L : 'DD. MM. YYYY',
                LL : 'D. MMMM YYYY',
                LLL : 'D. MMMM YYYY LT',
                LLLL : 'dddd, D. MMMM YYYY LT'
            },
            calendar : {
                sameDay  : '[danas u] LT',
                nextDay  : '[sutra u] LT',

                nextWeek : function () {
                    switch (this.day()) {
                        case 0:
                            return '[u] [nedjelju] [u] LT';
                        case 3:
                            return '[u] [srijedu] [u] LT';
                        case 6:
                            return '[u] [subotu] [u] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[u] dddd [u] LT';
                    }
                },
                lastDay  : '[jučer u] LT',
                lastWeek : function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                            return '[prošlu] dddd [u] LT';
                        case 6:
                            return '[prošle] [subote] [u] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[prošli] dddd [u] LT';
                    }
                },
                sameElse : 'L'
            },
            relativeTime : {
                future : 'za %s',
                past   : 'prije %s',
                s      : 'par sekundi',
                m      : translate,
                mm     : translate,
                h      : translate,
                hh     : translate,
                d      : 'dan',
                dd     : translate,
                M      : 'mjesec',
                MM     : translate,
                y      : 'godinu',
                yy     : translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : hungarian (hu)
// author : Adam Brunner : https://github.com/adambrunner

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var weekEndings = 'vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton'.split(' ');

        function translate(number, withoutSuffix, key, isFuture) {
            var num = number,
                suffix;

            switch (key) {
                case 's':
                    return (isFuture || withoutSuffix) ? 'néhány másodperc' : 'néhány másodperce';
                case 'm':
                    return 'egy' + (isFuture || withoutSuffix ? ' perc' : ' perce');
                case 'mm':
                    return num + (isFuture || withoutSuffix ? ' perc' : ' perce');
                case 'h':
                    return 'egy' + (isFuture || withoutSuffix ? ' óra' : ' órája');
                case 'hh':
                    return num + (isFuture || withoutSuffix ? ' óra' : ' órája');
                case 'd':
                    return 'egy' + (isFuture || withoutSuffix ? ' nap' : ' napja');
                case 'dd':
                    return num + (isFuture || withoutSuffix ? ' nap' : ' napja');
                case 'M':
                    return 'egy' + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
                case 'MM':
                    return num + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
                case 'y':
                    return 'egy' + (isFuture || withoutSuffix ? ' év' : ' éve');
                case 'yy':
                    return num + (isFuture || withoutSuffix ? ' év' : ' éve');
            }

            return '';
        }

        function week(isFuture) {
            return (isFuture ? '' : '[múlt] ') + '[' + weekEndings[this.day()] + '] LT[-kor]';
        }

        return moment.defineLocale('hu', {
            months : 'január_február_március_április_május_június_július_augusztus_szeptember_október_november_december'.split('_'),
            monthsShort : 'jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec'.split('_'),
            weekdays : 'vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat'.split('_'),
            weekdaysShort : 'vas_hét_kedd_sze_csüt_pén_szo'.split('_'),
            weekdaysMin : 'v_h_k_sze_cs_p_szo'.split('_'),
            longDateFormat : {
                LT : 'H:mm',
                LTS : 'LT:ss',
                L : 'YYYY.MM.DD.',
                LL : 'YYYY. MMMM D.',
                LLL : 'YYYY. MMMM D., LT',
                LLLL : 'YYYY. MMMM D., dddd LT'
            },
            meridiemParse: /de|du/i,
            isPM: function (input) {
                return input.charAt(1).toLowerCase() === 'u';
            },
            meridiem : function (hours, minutes, isLower) {
                if (hours < 12) {
                    return isLower === true ? 'de' : 'DE';
                } else {
                    return isLower === true ? 'du' : 'DU';
                }
            },
            calendar : {
                sameDay : '[ma] LT[-kor]',
                nextDay : '[holnap] LT[-kor]',
                nextWeek : function () {
                    return week.call(this, true);
                },
                lastDay : '[tegnap] LT[-kor]',
                lastWeek : function () {
                    return week.call(this, false);
                },
                sameElse : 'L'
            },
            relativeTime : {
                future : '%s múlva',
                past : '%s',
                s : translate,
                m : translate,
                mm : translate,
                h : translate,
                hh : translate,
                d : translate,
                dd : translate,
                M : translate,
                MM : translate,
                y : translate,
                yy : translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : Armenian (hy-am)
// author : Armendarabyan : https://github.com/armendarabyan

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function monthsCaseReplace(m, format) {
            var months = {
                    'nominative': 'հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր'.split('_'),
                    'accusative': 'հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի'.split('_')
                },

                nounCase = (/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/).test(format) ?
                    'accusative' :
                    'nominative';

            return months[nounCase][m.month()];
        }

        function monthsShortCaseReplace(m, format) {
            var monthsShort = 'հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ'.split('_');

            return monthsShort[m.month()];
        }

        function weekdaysCaseReplace(m, format) {
            var weekdays = 'կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ'.split('_');

            return weekdays[m.day()];
        }

        return moment.defineLocale('hy-am', {
            months : monthsCaseReplace,
            monthsShort : monthsShortCaseReplace,
            weekdays : weekdaysCaseReplace,
            weekdaysShort : 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
            weekdaysMin : 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD.MM.YYYY',
                LL : 'D MMMM YYYY թ.',
                LLL : 'D MMMM YYYY թ., LT',
                LLLL : 'dddd, D MMMM YYYY թ., LT'
            },
            calendar : {
                sameDay: '[այսօր] LT',
                nextDay: '[վաղը] LT',
                lastDay: '[երեկ] LT',
                nextWeek: function () {
                    return 'dddd [օրը ժամը] LT';
                },
                lastWeek: function () {
                    return '[անցած] dddd [օրը ժամը] LT';
                },
                sameElse: 'L'
            },
            relativeTime : {
                future : '%s հետո',
                past : '%s առաջ',
                s : 'մի քանի վայրկյան',
                m : 'րոպե',
                mm : '%d րոպե',
                h : 'ժամ',
                hh : '%d ժամ',
                d : 'օր',
                dd : '%d օր',
                M : 'ամիս',
                MM : '%d ամիս',
                y : 'տարի',
                yy : '%d տարի'
            },

            meridiemParse: /գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,
            isPM: function (input) {
                return /^(ցերեկվա|երեկոյան)$/.test(input);
            },
            meridiem : function (hour) {
                if (hour < 4) {
                    return 'գիշերվա';
                } else if (hour < 12) {
                    return 'առավոտվա';
                } else if (hour < 17) {
                    return 'ցերեկվա';
                } else {
                    return 'երեկոյան';
                }
            },

            ordinalParse: /\d{1,2}|\d{1,2}-(ին|րդ)/,
            ordinal: function (number, period) {
                switch (period) {
                    case 'DDD':
                    case 'w':
                    case 'W':
                    case 'DDDo':
                        if (number === 1) {
                            return number + '-ին';
                        }
                        return number + '-րդ';
                    default:
                        return number;
                }
            },

            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : Bahasa Indonesia (id)
// author : Mohammad Satrio Utomo : https://github.com/tyok
// reference: http://id.wikisource.org/wiki/Pedoman_Umum_Ejaan_Bahasa_Indonesia_yang_Disempurnakan

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('id', {
            months : 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember'.split('_'),
            monthsShort : 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des'.split('_'),
            weekdays : 'Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu'.split('_'),
            weekdaysShort : 'Min_Sen_Sel_Rab_Kam_Jum_Sab'.split('_'),
            weekdaysMin : 'Mg_Sn_Sl_Rb_Km_Jm_Sb'.split('_'),
            longDateFormat : {
                LT : 'HH.mm',
                LTS : 'LT.ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY [pukul] LT',
                LLLL : 'dddd, D MMMM YYYY [pukul] LT'
            },
            meridiemParse: /pagi|siang|sore|malam/,
            meridiemHour : function (hour, meridiem) {
                if (hour === 12) {
                    hour = 0;
                }
                if (meridiem === 'pagi') {
                    return hour;
                } else if (meridiem === 'siang') {
                    return hour >= 11 ? hour : hour + 12;
                } else if (meridiem === 'sore' || meridiem === 'malam') {
                    return hour + 12;
                }
            },
            meridiem : function (hours, minutes, isLower) {
                if (hours < 11) {
                    return 'pagi';
                } else if (hours < 15) {
                    return 'siang';
                } else if (hours < 19) {
                    return 'sore';
                } else {
                    return 'malam';
                }
            },
            calendar : {
                sameDay : '[Hari ini pukul] LT',
                nextDay : '[Besok pukul] LT',
                nextWeek : 'dddd [pukul] LT',
                lastDay : '[Kemarin pukul] LT',
                lastWeek : 'dddd [lalu pukul] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'dalam %s',
                past : '%s yang lalu',
                s : 'beberapa detik',
                m : 'semenit',
                mm : '%d menit',
                h : 'sejam',
                hh : '%d jam',
                d : 'sehari',
                dd : '%d hari',
                M : 'sebulan',
                MM : '%d bulan',
                y : 'setahun',
                yy : '%d tahun'
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : icelandic (is)
// author : Hinrik Örn Sigurðsson : https://github.com/hinrik

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function plural(n) {
            if (n % 100 === 11) {
                return true;
            } else if (n % 10 === 1) {
                return false;
            }
            return true;
        }

        function translate(number, withoutSuffix, key, isFuture) {
            var result = number + ' ';
            switch (key) {
                case 's':
                    return withoutSuffix || isFuture ? 'nokkrar sekúndur' : 'nokkrum sekúndum';
                case 'm':
                    return withoutSuffix ? 'mínúta' : 'mínútu';
                case 'mm':
                    if (plural(number)) {
                        return result + (withoutSuffix || isFuture ? 'mínútur' : 'mínútum');
                    } else if (withoutSuffix) {
                        return result + 'mínúta';
                    }
                    return result + 'mínútu';
                case 'hh':
                    if (plural(number)) {
                        return result + (withoutSuffix || isFuture ? 'klukkustundir' : 'klukkustundum');
                    }
                    return result + 'klukkustund';
                case 'd':
                    if (withoutSuffix) {
                        return 'dagur';
                    }
                    return isFuture ? 'dag' : 'degi';
                case 'dd':
                    if (plural(number)) {
                        if (withoutSuffix) {
                            return result + 'dagar';
                        }
                        return result + (isFuture ? 'daga' : 'dögum');
                    } else if (withoutSuffix) {
                        return result + 'dagur';
                    }
                    return result + (isFuture ? 'dag' : 'degi');
                case 'M':
                    if (withoutSuffix) {
                        return 'mánuður';
                    }
                    return isFuture ? 'mánuð' : 'mánuði';
                case 'MM':
                    if (plural(number)) {
                        if (withoutSuffix) {
                            return result + 'mánuðir';
                        }
                        return result + (isFuture ? 'mánuði' : 'mánuðum');
                    } else if (withoutSuffix) {
                        return result + 'mánuður';
                    }
                    return result + (isFuture ? 'mánuð' : 'mánuði');
                case 'y':
                    return withoutSuffix || isFuture ? 'ár' : 'ári';
                case 'yy':
                    if (plural(number)) {
                        return result + (withoutSuffix || isFuture ? 'ár' : 'árum');
                    }
                    return result + (withoutSuffix || isFuture ? 'ár' : 'ári');
            }
        }

        return moment.defineLocale('is', {
            months : 'janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember'.split('_'),
            monthsShort : 'jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des'.split('_'),
            weekdays : 'sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur'.split('_'),
            weekdaysShort : 'sun_mán_þri_mið_fim_fös_lau'.split('_'),
            weekdaysMin : 'Su_Má_Þr_Mi_Fi_Fö_La'.split('_'),
            longDateFormat : {
                LT : 'H:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D. MMMM YYYY',
                LLL : 'D. MMMM YYYY [kl.] LT',
                LLLL : 'dddd, D. MMMM YYYY [kl.] LT'
            },
            calendar : {
                sameDay : '[í dag kl.] LT',
                nextDay : '[á morgun kl.] LT',
                nextWeek : 'dddd [kl.] LT',
                lastDay : '[í gær kl.] LT',
                lastWeek : '[síðasta] dddd [kl.] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'eftir %s',
                past : 'fyrir %s síðan',
                s : translate,
                m : translate,
                mm : translate,
                h : 'klukkustund',
                hh : translate,
                d : translate,
                dd : translate,
                M : translate,
                MM : translate,
                y : translate,
                yy : translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : italian (it)
// author : Lorenzo : https://github.com/aliem
// author: Mattia Larentis: https://github.com/nostalgiaz

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('it', {
            months : 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split('_'),
            monthsShort : 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
            weekdays : 'Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato'.split('_'),
            weekdaysShort : 'Dom_Lun_Mar_Mer_Gio_Ven_Sab'.split('_'),
            weekdaysMin : 'D_L_Ma_Me_G_V_S'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd, D MMMM YYYY LT'
            },
            calendar : {
                sameDay: '[Oggi alle] LT',
                nextDay: '[Domani alle] LT',
                nextWeek: 'dddd [alle] LT',
                lastDay: '[Ieri alle] LT',
                lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return '[la scorsa] dddd [alle] LT';
                        default:
                            return '[lo scorso] dddd [alle] LT';
                    }
                },
                sameElse: 'L'
            },
            relativeTime : {
                future : function (s) {
                    return ((/^[0-9].+$/).test(s) ? 'tra' : 'in') + ' ' + s;
                },
                past : '%s fa',
                s : 'alcuni secondi',
                m : 'un minuto',
                mm : '%d minuti',
                h : 'un\'ora',
                hh : '%d ore',
                d : 'un giorno',
                dd : '%d giorni',
                M : 'un mese',
                MM : '%d mesi',
                y : 'un anno',
                yy : '%d anni'
            },
            ordinalParse : /\d{1,2}º/,
            ordinal: '%dº',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : japanese (ja)
// author : LI Long : https://github.com/baryon

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('ja', {
            months : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
            monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
            weekdays : '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),
            weekdaysShort : '日_月_火_水_木_金_土'.split('_'),
            weekdaysMin : '日_月_火_水_木_金_土'.split('_'),
            longDateFormat : {
                LT : 'Ah時m分',
                LTS : 'LTs秒',
                L : 'YYYY/MM/DD',
                LL : 'YYYY年M月D日',
                LLL : 'YYYY年M月D日LT',
                LLLL : 'YYYY年M月D日LT dddd'
            },
            meridiemParse: /午前|午後/i,
            isPM : function (input) {
                return input === '午後';
            },
            meridiem : function (hour, minute, isLower) {
                if (hour < 12) {
                    return '午前';
                } else {
                    return '午後';
                }
            },
            calendar : {
                sameDay : '[今日] LT',
                nextDay : '[明日] LT',
                nextWeek : '[来週]dddd LT',
                lastDay : '[昨日] LT',
                lastWeek : '[前週]dddd LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : '%s後',
                past : '%s前',
                s : '数秒',
                m : '1分',
                mm : '%d分',
                h : '1時間',
                hh : '%d時間',
                d : '1日',
                dd : '%d日',
                M : '1ヶ月',
                MM : '%dヶ月',
                y : '1年',
                yy : '%d年'
            }
        });
    }));
// moment.js locale configuration
// locale : Georgian (ka)
// author : Irakli Janiashvili : https://github.com/irakli-janiashvili

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function monthsCaseReplace(m, format) {
            var months = {
                    'nominative': 'იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი'.split('_'),
                    'accusative': 'იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს'.split('_')
                },

                nounCase = (/D[oD] *MMMM?/).test(format) ?
                    'accusative' :
                    'nominative';

            return months[nounCase][m.month()];
        }

        function weekdaysCaseReplace(m, format) {
            var weekdays = {
                    'nominative': 'კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი'.split('_'),
                    'accusative': 'კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს'.split('_')
                },

                nounCase = (/(წინა|შემდეგ)/).test(format) ?
                    'accusative' :
                    'nominative';

            return weekdays[nounCase][m.day()];
        }

        return moment.defineLocale('ka', {
            months : monthsCaseReplace,
            monthsShort : 'იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ'.split('_'),
            weekdays : weekdaysCaseReplace,
            weekdaysShort : 'კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ'.split('_'),
            weekdaysMin : 'კვ_ორ_სა_ოთ_ხუ_პა_შა'.split('_'),
            longDateFormat : {
                LT : 'h:mm A',
                LTS : 'h:mm:ss A',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd, D MMMM YYYY LT'
            },
            calendar : {
                sameDay : '[დღეს] LT[-ზე]',
                nextDay : '[ხვალ] LT[-ზე]',
                lastDay : '[გუშინ] LT[-ზე]',
                nextWeek : '[შემდეგ] dddd LT[-ზე]',
                lastWeek : '[წინა] dddd LT-ზე',
                sameElse : 'L'
            },
            relativeTime : {
                future : function (s) {
                    return (/(წამი|წუთი|საათი|წელი)/).test(s) ?
                        s.replace(/ი$/, 'ში') :
                    s + 'ში';
                },
                past : function (s) {
                    if ((/(წამი|წუთი|საათი|დღე|თვე)/).test(s)) {
                        return s.replace(/(ი|ე)$/, 'ის წინ');
                    }
                    if ((/წელი/).test(s)) {
                        return s.replace(/წელი$/, 'წლის წინ');
                    }
                },
                s : 'რამდენიმე წამი',
                m : 'წუთი',
                mm : '%d წუთი',
                h : 'საათი',
                hh : '%d საათი',
                d : 'დღე',
                dd : '%d დღე',
                M : 'თვე',
                MM : '%d თვე',
                y : 'წელი',
                yy : '%d წელი'
            },
            ordinalParse: /0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,
            ordinal : function (number) {
                if (number === 0) {
                    return number;
                }

                if (number === 1) {
                    return number + '-ლი';
                }

                if ((number < 20) || (number <= 100 && (number % 20 === 0)) || (number % 100 === 0)) {
                    return 'მე-' + number;
                }

                return number + '-ე';
            },
            week : {
                dow : 1,
                doy : 7
            }
        });
    }));
// moment.js locale configuration
// locale : khmer (km)
// author : Kruy Vanna : https://github.com/kruyvanna

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('km', {
            months: 'មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
            monthsShort: 'មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
            weekdays: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
            weekdaysShort: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
            weekdaysMin: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS : 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd, D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[ថ្ងៃនៈ ម៉ោង] LT',
                nextDay: '[ស្អែក ម៉ោង] LT',
                nextWeek: 'dddd [ម៉ោង] LT',
                lastDay: '[ម្សិលមិញ ម៉ោង] LT',
                lastWeek: 'dddd [សប្តាហ៍មុន] [ម៉ោង] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: '%sទៀត',
                past: '%sមុន',
                s: 'ប៉ុន្មានវិនាទី',
                m: 'មួយនាទី',
                mm: '%d នាទី',
                h: 'មួយម៉ោង',
                hh: '%d ម៉ោង',
                d: 'មួយថ្ងៃ',
                dd: '%d ថ្ងៃ',
                M: 'មួយខែ',
                MM: '%d ខែ',
                y: 'មួយឆ្នាំ',
                yy: '%d ឆ្នាំ'
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4 // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : korean (ko)
//
// authors
//
// - Kyungwook, Park : https://github.com/kyungw00k
// - Jeeeyul Lee <jeeeyul@gmail.com>
    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('ko', {
            months : '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
            monthsShort : '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
            weekdays : '일요일_월요일_화요일_수요일_목요일_금요일_토요일'.split('_'),
            weekdaysShort : '일_월_화_수_목_금_토'.split('_'),
            weekdaysMin : '일_월_화_수_목_금_토'.split('_'),
            longDateFormat : {
                LT : 'A h시 m분',
                LTS : 'A h시 m분 s초',
                L : 'YYYY.MM.DD',
                LL : 'YYYY년 MMMM D일',
                LLL : 'YYYY년 MMMM D일 LT',
                LLLL : 'YYYY년 MMMM D일 dddd LT'
            },
            calendar : {
                sameDay : '오늘 LT',
                nextDay : '내일 LT',
                nextWeek : 'dddd LT',
                lastDay : '어제 LT',
                lastWeek : '지난주 dddd LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : '%s 후',
                past : '%s 전',
                s : '몇초',
                ss : '%d초',
                m : '일분',
                mm : '%d분',
                h : '한시간',
                hh : '%d시간',
                d : '하루',
                dd : '%d일',
                M : '한달',
                MM : '%d달',
                y : '일년',
                yy : '%d년'
            },
            ordinalParse : /\d{1,2}일/,
            ordinal : '%d일',
            meridiemParse : /오전|오후/,
            isPM : function (token) {
                return token === '오후';
            },
            meridiem : function (hour, minute, isUpper) {
                return hour < 12 ? '오전' : '오후';
            }
        });
    }));
// moment.js locale configuration
// locale : Luxembourgish (lb)
// author : mweimerskirch : https://github.com/mweimerskirch, David Raison : https://github.com/kwisatz

// Note: Luxembourgish has a very particular phonological rule ('Eifeler Regel') that causes the
// deletion of the final 'n' in certain contexts. That's what the 'eifelerRegelAppliesToWeekday'
// and 'eifelerRegelAppliesToNumber' methods are meant for

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function processRelativeTime(number, withoutSuffix, key, isFuture) {
            var format = {
                'm': ['eng Minutt', 'enger Minutt'],
                'h': ['eng Stonn', 'enger Stonn'],
                'd': ['een Dag', 'engem Dag'],
                'M': ['ee Mount', 'engem Mount'],
                'y': ['ee Joer', 'engem Joer']
            };
            return withoutSuffix ? format[key][0] : format[key][1];
        }

        function processFutureTime(string) {
            var number = string.substr(0, string.indexOf(' '));
            if (eifelerRegelAppliesToNumber(number)) {
                return 'a ' + string;
            }
            return 'an ' + string;
        }

        function processPastTime(string) {
            var number = string.substr(0, string.indexOf(' '));
            if (eifelerRegelAppliesToNumber(number)) {
                return 'viru ' + string;
            }
            return 'virun ' + string;
        }

        /**
         * Returns true if the word before the given number loses the '-n' ending.
         * e.g. 'an 10 Deeg' but 'a 5 Deeg'
         *
         * @param number {integer}
         * @returns {boolean}
         */
        function eifelerRegelAppliesToNumber(number) {
            number = parseInt(number, 10);
            if (isNaN(number)) {
                return false;
            }
            if (number < 0) {
                // Negative Number --> always true
                return true;
            } else if (number < 10) {
                // Only 1 digit
                if (4 <= number && number <= 7) {
                    return true;
                }
                return false;
            } else if (number < 100) {
                // 2 digits
                var lastDigit = number % 10, firstDigit = number / 10;
                if (lastDigit === 0) {
                    return eifelerRegelAppliesToNumber(firstDigit);
                }
                return eifelerRegelAppliesToNumber(lastDigit);
            } else if (number < 10000) {
                // 3 or 4 digits --> recursively check first digit
                while (number >= 10) {
                    number = number / 10;
                }
                return eifelerRegelAppliesToNumber(number);
            } else {
                // Anything larger than 4 digits: recursively check first n-3 digits
                number = number / 1000;
                return eifelerRegelAppliesToNumber(number);
            }
        }

        return moment.defineLocale('lb', {
            months: 'Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
            monthsShort: 'Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
            weekdays: 'Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg'.split('_'),
            weekdaysShort: 'So._Mé._Dë._Më._Do._Fr._Sa.'.split('_'),
            weekdaysMin: 'So_Mé_Dë_Më_Do_Fr_Sa'.split('_'),
            longDateFormat: {
                LT: 'H:mm [Auer]',
                LTS: 'H:mm:ss [Auer]',
                L: 'DD.MM.YYYY',
                LL: 'D. MMMM YYYY',
                LLL: 'D. MMMM YYYY LT',
                LLLL: 'dddd, D. MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Haut um] LT',
                sameElse: 'L',
                nextDay: '[Muer um] LT',
                nextWeek: 'dddd [um] LT',
                lastDay: '[Gëschter um] LT',
                lastWeek: function () {
                    // Different date string for 'Dënschdeg' (Tuesday) and 'Donneschdeg' (Thursday) due to phonological rule
                    switch (this.day()) {
                        case 2:
                        case 4:
                            return '[Leschten] dddd [um] LT';
                        default:
                            return '[Leschte] dddd [um] LT';
                    }
                }
            },
            relativeTime : {
                future : processFutureTime,
                past : processPastTime,
                s : 'e puer Sekonnen',
                m : processRelativeTime,
                mm : '%d Minutten',
                h : processRelativeTime,
                hh : '%d Stonnen',
                d : processRelativeTime,
                dd : '%d Deeg',
                M : processRelativeTime,
                MM : '%d Méint',
                y : processRelativeTime,
                yy : '%d Joer'
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : Lithuanian (lt)
// author : Mindaugas Mozūras : https://github.com/mmozuras

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var units = {
                'm' : 'minutė_minutės_minutę',
                'mm': 'minutės_minučių_minutes',
                'h' : 'valanda_valandos_valandą',
                'hh': 'valandos_valandų_valandas',
                'd' : 'diena_dienos_dieną',
                'dd': 'dienos_dienų_dienas',
                'M' : 'mėnuo_mėnesio_mėnesį',
                'MM': 'mėnesiai_mėnesių_mėnesius',
                'y' : 'metai_metų_metus',
                'yy': 'metai_metų_metus'
            },
            weekDays = 'sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis'.split('_');

        function translateSeconds(number, withoutSuffix, key, isFuture) {
            if (withoutSuffix) {
                return 'kelios sekundės';
            } else {
                return isFuture ? 'kelių sekundžių' : 'kelias sekundes';
            }
        }

        function translateSingular(number, withoutSuffix, key, isFuture) {
            return withoutSuffix ? forms(key)[0] : (isFuture ? forms(key)[1] : forms(key)[2]);
        }

        function special(number) {
            return number % 10 === 0 || (number > 10 && number < 20);
        }

        function forms(key) {
            return units[key].split('_');
        }

        function translate(number, withoutSuffix, key, isFuture) {
            var result = number + ' ';
            if (number === 1) {
                return result + translateSingular(number, withoutSuffix, key[0], isFuture);
            } else if (withoutSuffix) {
                return result + (special(number) ? forms(key)[1] : forms(key)[0]);
            } else {
                if (isFuture) {
                    return result + forms(key)[1];
                } else {
                    return result + (special(number) ? forms(key)[1] : forms(key)[2]);
                }
            }
        }

        function relativeWeekDay(moment, format) {
            var nominative = format.indexOf('dddd HH:mm') === -1,
                weekDay = weekDays[moment.day()];

            return nominative ? weekDay : weekDay.substring(0, weekDay.length - 2) + 'į';
        }

        return moment.defineLocale('lt', {
            months : 'sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio'.split('_'),
            monthsShort : 'sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd'.split('_'),
            weekdays : relativeWeekDay,
            weekdaysShort : 'Sek_Pir_Ant_Tre_Ket_Pen_Šeš'.split('_'),
            weekdaysMin : 'S_P_A_T_K_Pn_Š'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'YYYY-MM-DD',
                LL : 'YYYY [m.] MMMM D [d.]',
                LLL : 'YYYY [m.] MMMM D [d.], LT [val.]',
                LLLL : 'YYYY [m.] MMMM D [d.], dddd, LT [val.]',
                l : 'YYYY-MM-DD',
                ll : 'YYYY [m.] MMMM D [d.]',
                lll : 'YYYY [m.] MMMM D [d.], LT [val.]',
                llll : 'YYYY [m.] MMMM D [d.], ddd, LT [val.]'
            },
            calendar : {
                sameDay : '[Šiandien] LT',
                nextDay : '[Rytoj] LT',
                nextWeek : 'dddd LT',
                lastDay : '[Vakar] LT',
                lastWeek : '[Praėjusį] dddd LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'po %s',
                past : 'prieš %s',
                s : translateSeconds,
                m : translateSingular,
                mm : translate,
                h : translateSingular,
                hh : translate,
                d : translateSingular,
                dd : translate,
                M : translateSingular,
                MM : translate,
                y : translateSingular,
                yy : translate
            },
            ordinalParse: /\d{1,2}-oji/,
            ordinal : function (number) {
                return number + '-oji';
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : latvian (lv)
// author : Kristaps Karlsons : https://github.com/skakri

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var units = {
            'mm': 'minūti_minūtes_minūte_minūtes',
            'hh': 'stundu_stundas_stunda_stundas',
            'dd': 'dienu_dienas_diena_dienas',
            'MM': 'mēnesi_mēnešus_mēnesis_mēneši',
            'yy': 'gadu_gadus_gads_gadi'
        };

        function format(word, number, withoutSuffix) {
            var forms = word.split('_');
            if (withoutSuffix) {
                return number % 10 === 1 && number !== 11 ? forms[2] : forms[3];
            } else {
                return number % 10 === 1 && number !== 11 ? forms[0] : forms[1];
            }
        }

        function relativeTimeWithPlural(number, withoutSuffix, key) {
            return number + ' ' + format(units[key], number, withoutSuffix);
        }

        return moment.defineLocale('lv', {
            months : 'janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris'.split('_'),
            monthsShort : 'jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec'.split('_'),
            weekdays : 'svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena'.split('_'),
            weekdaysShort : 'Sv_P_O_T_C_Pk_S'.split('_'),
            weekdaysMin : 'Sv_P_O_T_C_Pk_S'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD.MM.YYYY',
                LL : 'YYYY. [gada] D. MMMM',
                LLL : 'YYYY. [gada] D. MMMM, LT',
                LLLL : 'YYYY. [gada] D. MMMM, dddd, LT'
            },
            calendar : {
                sameDay : '[Šodien pulksten] LT',
                nextDay : '[Rīt pulksten] LT',
                nextWeek : 'dddd [pulksten] LT',
                lastDay : '[Vakar pulksten] LT',
                lastWeek : '[Pagājušā] dddd [pulksten] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : '%s vēlāk',
                past : '%s agrāk',
                s : 'dažas sekundes',
                m : 'minūti',
                mm : relativeTimeWithPlural,
                h : 'stundu',
                hh : relativeTimeWithPlural,
                d : 'dienu',
                dd : relativeTimeWithPlural,
                M : 'mēnesi',
                MM : relativeTimeWithPlural,
                y : 'gadu',
                yy : relativeTimeWithPlural
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : macedonian (mk)
// author : Borislav Mickov : https://github.com/B0k0

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('mk', {
            months : 'јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември'.split('_'),
            monthsShort : 'јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек'.split('_'),
            weekdays : 'недела_понеделник_вторник_среда_четврток_петок_сабота'.split('_'),
            weekdaysShort : 'нед_пон_вто_сре_чет_пет_саб'.split('_'),
            weekdaysMin : 'нe_пo_вт_ср_че_пе_сa'.split('_'),
            longDateFormat : {
                LT : 'H:mm',
                LTS : 'LT:ss',
                L : 'D.MM.YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd, D MMMM YYYY LT'
            },
            calendar : {
                sameDay : '[Денес во] LT',
                nextDay : '[Утре во] LT',
                nextWeek : 'dddd [во] LT',
                lastDay : '[Вчера во] LT',
                lastWeek : function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 6:
                            return '[Во изминатата] dddd [во] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[Во изминатиот] dddd [во] LT';
                    }
                },
                sameElse : 'L'
            },
            relativeTime : {
                future : 'после %s',
                past : 'пред %s',
                s : 'неколку секунди',
                m : 'минута',
                mm : '%d минути',
                h : 'час',
                hh : '%d часа',
                d : 'ден',
                dd : '%d дена',
                M : 'месец',
                MM : '%d месеци',
                y : 'година',
                yy : '%d години'
            },
            ordinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
            ordinal : function (number) {
                var lastDigit = number % 10,
                    last2Digits = number % 100;
                if (number === 0) {
                    return number + '-ев';
                } else if (last2Digits === 0) {
                    return number + '-ен';
                } else if (last2Digits > 10 && last2Digits < 20) {
                    return number + '-ти';
                } else if (lastDigit === 1) {
                    return number + '-ви';
                } else if (lastDigit === 2) {
                    return number + '-ри';
                } else if (lastDigit === 7 || lastDigit === 8) {
                    return number + '-ми';
                } else {
                    return number + '-ти';
                }
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : malayalam (ml)
// author : Floyd Pink : https://github.com/floydpink

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('ml', {
            months : 'ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ'.split('_'),
            monthsShort : 'ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.'.split('_'),
            weekdays : 'ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച'.split('_'),
            weekdaysShort : 'ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി'.split('_'),
            weekdaysMin : 'ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ'.split('_'),
            longDateFormat : {
                LT : 'A h:mm -നു',
                LTS : 'A h:mm:ss -നു',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY, LT',
                LLLL : 'dddd, D MMMM YYYY, LT'
            },
            calendar : {
                sameDay : '[ഇന്ന്] LT',
                nextDay : '[നാളെ] LT',
                nextWeek : 'dddd, LT',
                lastDay : '[ഇന്നലെ] LT',
                lastWeek : '[കഴിഞ്ഞ] dddd, LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : '%s കഴിഞ്ഞ്',
                past : '%s മുൻപ്',
                s : 'അൽപ നിമിഷങ്ങൾ',
                m : 'ഒരു മിനിറ്റ്',
                mm : '%d മിനിറ്റ്',
                h : 'ഒരു മണിക്കൂർ',
                hh : '%d മണിക്കൂർ',
                d : 'ഒരു ദിവസം',
                dd : '%d ദിവസം',
                M : 'ഒരു മാസം',
                MM : '%d മാസം',
                y : 'ഒരു വർഷം',
                yy : '%d വർഷം'
            },
            meridiemParse: /രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,
            isPM : function (input) {
                return /^(ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി)$/.test(input);
            },
            meridiem : function (hour, minute, isLower) {
                if (hour < 4) {
                    return 'രാത്രി';
                } else if (hour < 12) {
                    return 'രാവിലെ';
                } else if (hour < 17) {
                    return 'ഉച്ച കഴിഞ്ഞ്';
                } else if (hour < 20) {
                    return 'വൈകുന്നേരം';
                } else {
                    return 'രാത്രി';
                }
            }
        });
    }));
// moment.js locale configuration
// locale : Marathi (mr)
// author : Harshad Kale : https://github.com/kalehv

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var symbolMap = {
                '1': '१',
                '2': '२',
                '3': '३',
                '4': '४',
                '5': '५',
                '6': '६',
                '7': '७',
                '8': '८',
                '9': '९',
                '0': '०'
            },
            numberMap = {
                '१': '1',
                '२': '2',
                '३': '3',
                '४': '4',
                '५': '5',
                '६': '6',
                '७': '7',
                '८': '8',
                '९': '9',
                '०': '0'
            };

        return moment.defineLocale('mr', {
            months : 'जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर'.split('_'),
            monthsShort: 'जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.'.split('_'),
            weekdays : 'रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
            weekdaysShort : 'रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि'.split('_'),
            weekdaysMin : 'र_सो_मं_बु_गु_शु_श'.split('_'),
            longDateFormat : {
                LT : 'A h:mm वाजता',
                LTS : 'A h:mm:ss वाजता',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY, LT',
                LLLL : 'dddd, D MMMM YYYY, LT'
            },
            calendar : {
                sameDay : '[आज] LT',
                nextDay : '[उद्या] LT',
                nextWeek : 'dddd, LT',
                lastDay : '[काल] LT',
                lastWeek: '[मागील] dddd, LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : '%s नंतर',
                past : '%s पूर्वी',
                s : 'सेकंद',
                m: 'एक मिनिट',
                mm: '%d मिनिटे',
                h : 'एक तास',
                hh : '%d तास',
                d : 'एक दिवस',
                dd : '%d दिवस',
                M : 'एक महिना',
                MM : '%d महिने',
                y : 'एक वर्ष',
                yy : '%d वर्षे'
            },
            preparse: function (string) {
                return string.replace(/[१२३४५६७८९०]/g, function (match) {
                    return numberMap[match];
                });
            },
            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                });
            },
            meridiemParse: /रात्री|सकाळी|दुपारी|सायंकाळी/,
            meridiemHour : function (hour, meridiem) {
                if (hour === 12) {
                    hour = 0;
                }
                if (meridiem === 'रात्री') {
                    return hour < 4 ? hour : hour + 12;
                } else if (meridiem === 'सकाळी') {
                    return hour;
                } else if (meridiem === 'दुपारी') {
                    return hour >= 10 ? hour : hour + 12;
                } else if (meridiem === 'सायंकाळी') {
                    return hour + 12;
                }
            },
            meridiem: function (hour, minute, isLower)
            {
                if (hour < 4) {
                    return 'रात्री';
                } else if (hour < 10) {
                    return 'सकाळी';
                } else if (hour < 17) {
                    return 'दुपारी';
                } else if (hour < 20) {
                    return 'सायंकाळी';
                } else {
                    return 'रात्री';
                }
            },
            week : {
                dow : 0, // Sunday is the first day of the week.
                doy : 6  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : Bahasa Malaysia (ms-MY)
// author : Weldan Jamili : https://github.com/weldan

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('ms-my', {
            months : 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
            monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
            weekdays : 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
            weekdaysShort : 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
            weekdaysMin : 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
            longDateFormat : {
                LT : 'HH.mm',
                LTS : 'LT.ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY [pukul] LT',
                LLLL : 'dddd, D MMMM YYYY [pukul] LT'
            },
            meridiemParse: /pagi|tengahari|petang|malam/,
            meridiemHour: function (hour, meridiem) {
                if (hour === 12) {
                    hour = 0;
                }
                if (meridiem === 'pagi') {
                    return hour;
                } else if (meridiem === 'tengahari') {
                    return hour >= 11 ? hour : hour + 12;
                } else if (meridiem === 'petang' || meridiem === 'malam') {
                    return hour + 12;
                }
            },
            meridiem : function (hours, minutes, isLower) {
                if (hours < 11) {
                    return 'pagi';
                } else if (hours < 15) {
                    return 'tengahari';
                } else if (hours < 19) {
                    return 'petang';
                } else {
                    return 'malam';
                }
            },
            calendar : {
                sameDay : '[Hari ini pukul] LT',
                nextDay : '[Esok pukul] LT',
                nextWeek : 'dddd [pukul] LT',
                lastDay : '[Kelmarin pukul] LT',
                lastWeek : 'dddd [lepas pukul] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'dalam %s',
                past : '%s yang lepas',
                s : 'beberapa saat',
                m : 'seminit',
                mm : '%d minit',
                h : 'sejam',
                hh : '%d jam',
                d : 'sehari',
                dd : '%d hari',
                M : 'sebulan',
                MM : '%d bulan',
                y : 'setahun',
                yy : '%d tahun'
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : Burmese (my)
// author : Squar team, mysquar.com

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var symbolMap = {
            '1': '၁',
            '2': '၂',
            '3': '၃',
            '4': '၄',
            '5': '၅',
            '6': '၆',
            '7': '၇',
            '8': '၈',
            '9': '၉',
            '0': '၀'
        }, numberMap = {
            '၁': '1',
            '၂': '2',
            '၃': '3',
            '၄': '4',
            '၅': '5',
            '၆': '6',
            '၇': '7',
            '၈': '8',
            '၉': '9',
            '၀': '0'
        };
        return moment.defineLocale('my', {
            months: 'ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ'.split('_'),
            monthsShort: 'ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ'.split('_'),
            weekdays: 'တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ'.split('_'),
            weekdaysShort: 'နွေ_လာ_င်္ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),
            weekdaysMin: 'နွေ_လာ_င်္ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'HH:mm:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[ယနေ.] LT [မှာ]',
                nextDay: '[မနက်ဖြန်] LT [မှာ]',
                nextWeek: 'dddd LT [မှာ]',
                lastDay: '[မနေ.က] LT [မှာ]',
                lastWeek: '[ပြီးခဲ့သော] dddd LT [မှာ]',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'လာမည့် %s မှာ',
                past: 'လွန်ခဲ့သော %s က',
                s: 'စက္ကန်.အနည်းငယ်',
                m: 'တစ်မိနစ်',
                mm: '%d မိနစ်',
                h: 'တစ်နာရီ',
                hh: '%d နာရီ',
                d: 'တစ်ရက်',
                dd: '%d ရက်',
                M: 'တစ်လ',
                MM: '%d လ',
                y: 'တစ်နှစ်',
                yy: '%d နှစ်'
            },
            preparse: function (string) {
                return string.replace(/[၁၂၃၄၅၆၇၈၉၀]/g, function (match) {
                    return numberMap[match];
                });
            },
            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                });
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4 // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : norwegian bokmål (nb)
// authors : Espen Hovlandsdal : https://github.com/rexxars
//           Sigurd Gartmann : https://github.com/sigurdga

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('nb', {
            months : 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
            monthsShort : 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
            weekdays : 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
            weekdaysShort : 'søn_man_tirs_ons_tors_fre_lør'.split('_'),
            weekdaysMin : 'sø_ma_ti_on_to_fr_lø'.split('_'),
            longDateFormat : {
                LT : 'H.mm',
                LTS : 'LT.ss',
                L : 'DD.MM.YYYY',
                LL : 'D. MMMM YYYY',
                LLL : 'D. MMMM YYYY [kl.] LT',
                LLLL : 'dddd D. MMMM YYYY [kl.] LT'
            },
            calendar : {
                sameDay: '[i dag kl.] LT',
                nextDay: '[i morgen kl.] LT',
                nextWeek: 'dddd [kl.] LT',
                lastDay: '[i går kl.] LT',
                lastWeek: '[forrige] dddd [kl.] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : 'om %s',
                past : 'for %s siden',
                s : 'noen sekunder',
                m : 'ett minutt',
                mm : '%d minutter',
                h : 'en time',
                hh : '%d timer',
                d : 'en dag',
                dd : '%d dager',
                M : 'en måned',
                MM : '%d måneder',
                y : 'ett år',
                yy : '%d år'
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : nepali/nepalese
// author : suvash : https://github.com/suvash

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var symbolMap = {
                '1': '१',
                '2': '२',
                '3': '३',
                '4': '४',
                '5': '५',
                '6': '६',
                '7': '७',
                '8': '८',
                '9': '९',
                '0': '०'
            },
            numberMap = {
                '१': '1',
                '२': '2',
                '३': '3',
                '४': '4',
                '५': '5',
                '६': '6',
                '७': '7',
                '८': '8',
                '९': '9',
                '०': '0'
            };

        return moment.defineLocale('ne', {
            months : 'जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर'.split('_'),
            monthsShort : 'जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.'.split('_'),
            weekdays : 'आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार'.split('_'),
            weekdaysShort : 'आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.'.split('_'),
            weekdaysMin : 'आइ._सो._मङ्_बु._बि._शु._श.'.split('_'),
            longDateFormat : {
                LT : 'Aको h:mm बजे',
                LTS : 'Aको h:mm:ss बजे',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY, LT',
                LLLL : 'dddd, D MMMM YYYY, LT'
            },
            preparse: function (string) {
                return string.replace(/[१२३४५६७८९०]/g, function (match) {
                    return numberMap[match];
                });
            },
            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                });
            },
            meridiemParse: /राती|बिहान|दिउँसो|बेलुका|साँझ|राती/,
            meridiemHour : function (hour, meridiem) {
                if (hour === 12) {
                    hour = 0;
                }
                if (meridiem === 'राती') {
                    return hour < 3 ? hour : hour + 12;
                } else if (meridiem === 'बिहान') {
                    return hour;
                } else if (meridiem === 'दिउँसो') {
                    return hour >= 10 ? hour : hour + 12;
                } else if (meridiem === 'बेलुका' || meridiem === 'साँझ') {
                    return hour + 12;
                }
            },
            meridiem : function (hour, minute, isLower) {
                if (hour < 3) {
                    return 'राती';
                } else if (hour < 10) {
                    return 'बिहान';
                } else if (hour < 15) {
                    return 'दिउँसो';
                } else if (hour < 18) {
                    return 'बेलुका';
                } else if (hour < 20) {
                    return 'साँझ';
                } else {
                    return 'राती';
                }
            },
            calendar : {
                sameDay : '[आज] LT',
                nextDay : '[भोली] LT',
                nextWeek : '[आउँदो] dddd[,] LT',
                lastDay : '[हिजो] LT',
                lastWeek : '[गएको] dddd[,] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : '%sमा',
                past : '%s अगाडी',
                s : 'केही समय',
                m : 'एक मिनेट',
                mm : '%d मिनेट',
                h : 'एक घण्टा',
                hh : '%d घण्टा',
                d : 'एक दिन',
                dd : '%d दिन',
                M : 'एक महिना',
                MM : '%d महिना',
                y : 'एक बर्ष',
                yy : '%d बर्ष'
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : dutch (nl)
// author : Joris Röling : https://github.com/jjupiter

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_'),
            monthsShortWithoutDots = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

        return moment.defineLocale('nl', {
            months : 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
            monthsShort : function (m, format) {
                if (/-MMM-/.test(format)) {
                    return monthsShortWithoutDots[m.month()];
                } else {
                    return monthsShortWithDots[m.month()];
                }
            },
            weekdays : 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
            weekdaysShort : 'zo._ma._di._wo._do._vr._za.'.split('_'),
            weekdaysMin : 'Zo_Ma_Di_Wo_Do_Vr_Za'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD-MM-YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd D MMMM YYYY LT'
            },
            calendar : {
                sameDay: '[vandaag om] LT',
                nextDay: '[morgen om] LT',
                nextWeek: 'dddd [om] LT',
                lastDay: '[gisteren om] LT',
                lastWeek: '[afgelopen] dddd [om] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : 'over %s',
                past : '%s geleden',
                s : 'een paar seconden',
                m : 'één minuut',
                mm : '%d minuten',
                h : 'één uur',
                hh : '%d uur',
                d : 'één dag',
                dd : '%d dagen',
                M : 'één maand',
                MM : '%d maanden',
                y : 'één jaar',
                yy : '%d jaar'
            },
            ordinalParse: /\d{1,2}(ste|de)/,
            ordinal : function (number) {
                return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : norwegian nynorsk (nn)
// author : https://github.com/mechuwind

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('nn', {
            months : 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
            monthsShort : 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
            weekdays : 'sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag'.split('_'),
            weekdaysShort : 'sun_mån_tys_ons_tor_fre_lau'.split('_'),
            weekdaysMin : 'su_må_ty_on_to_fr_lø'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD.MM.YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd D MMMM YYYY LT'
            },
            calendar : {
                sameDay: '[I dag klokka] LT',
                nextDay: '[I morgon klokka] LT',
                nextWeek: 'dddd [klokka] LT',
                lastDay: '[I går klokka] LT',
                lastWeek: '[Føregåande] dddd [klokka] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : 'om %s',
                past : 'for %s sidan',
                s : 'nokre sekund',
                m : 'eit minutt',
                mm : '%d minutt',
                h : 'ein time',
                hh : '%d timar',
                d : 'ein dag',
                dd : '%d dagar',
                M : 'ein månad',
                MM : '%d månader',
                y : 'eit år',
                yy : '%d år'
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : polish (pl)
// author : Rafal Hirsz : https://github.com/evoL

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var monthsNominative = 'styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień'.split('_'),
            monthsSubjective = 'stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia'.split('_');

        function plural(n) {
            return (n % 10 < 5) && (n % 10 > 1) && ((~~(n / 10) % 10) !== 1);
        }

        function translate(number, withoutSuffix, key) {
            var result = number + ' ';
            switch (key) {
                case 'm':
                    return withoutSuffix ? 'minuta' : 'minutę';
                case 'mm':
                    return result + (plural(number) ? 'minuty' : 'minut');
                case 'h':
                    return withoutSuffix  ? 'godzina'  : 'godzinę';
                case 'hh':
                    return result + (plural(number) ? 'godziny' : 'godzin');
                case 'MM':
                    return result + (plural(number) ? 'miesiące' : 'miesięcy');
                case 'yy':
                    return result + (plural(number) ? 'lata' : 'lat');
            }
        }

        return moment.defineLocale('pl', {
            months : function (momentToFormat, format) {
                if (/D MMMM/.test(format)) {
                    return monthsSubjective[momentToFormat.month()];
                } else {
                    return monthsNominative[momentToFormat.month()];
                }
            },
            monthsShort : 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
            weekdays : 'niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota'.split('_'),
            weekdaysShort : 'nie_pon_wt_śr_czw_pt_sb'.split('_'),
            weekdaysMin : 'N_Pn_Wt_Śr_Cz_Pt_So'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD.MM.YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd, D MMMM YYYY LT'
            },
            calendar : {
                sameDay: '[Dziś o] LT',
                nextDay: '[Jutro o] LT',
                nextWeek: '[W] dddd [o] LT',
                lastDay: '[Wczoraj o] LT',
                lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return '[W zeszłą niedzielę o] LT';
                        case 3:
                            return '[W zeszłą środę o] LT';
                        case 6:
                            return '[W zeszłą sobotę o] LT';
                        default:
                            return '[W zeszły] dddd [o] LT';
                    }
                },
                sameElse: 'L'
            },
            relativeTime : {
                future : 'za %s',
                past : '%s temu',
                s : 'kilka sekund',
                m : translate,
                mm : translate,
                h : translate,
                hh : translate,
                d : '1 dzień',
                dd : '%d dni',
                M : 'miesiąc',
                MM : translate,
                y : 'rok',
                yy : translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : brazilian portuguese (pt-br)
// author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('pt-br', {
            months : 'janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split('_'),
            monthsShort : 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
            weekdays : 'domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado'.split('_'),
            weekdaysShort : 'dom_seg_ter_qua_qui_sex_sáb'.split('_'),
            weekdaysMin : 'dom_2ª_3ª_4ª_5ª_6ª_sáb'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D [de] MMMM [de] YYYY',
                LLL : 'D [de] MMMM [de] YYYY [às] LT',
                LLLL : 'dddd, D [de] MMMM [de] YYYY [às] LT'
            },
            calendar : {
                sameDay: '[Hoje às] LT',
                nextDay: '[Amanhã às] LT',
                nextWeek: 'dddd [às] LT',
                lastDay: '[Ontem às] LT',
                lastWeek: function () {
                    return (this.day() === 0 || this.day() === 6) ?
                        '[Último] dddd [às] LT' : // Saturday + Sunday
                        '[Última] dddd [às] LT'; // Monday - Friday
                },
                sameElse: 'L'
            },
            relativeTime : {
                future : 'em %s',
                past : '%s atrás',
                s : 'segundos',
                m : 'um minuto',
                mm : '%d minutos',
                h : 'uma hora',
                hh : '%d horas',
                d : 'um dia',
                dd : '%d dias',
                M : 'um mês',
                MM : '%d meses',
                y : 'um ano',
                yy : '%d anos'
            },
            ordinalParse: /\d{1,2}º/,
            ordinal : '%dº'
        });
    }));
// moment.js locale configuration
// locale : portuguese (pt)
// author : Jefferson : https://github.com/jalex79

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('pt', {
            months : 'janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split('_'),
            monthsShort : 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
            weekdays : 'domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado'.split('_'),
            weekdaysShort : 'dom_seg_ter_qua_qui_sex_sáb'.split('_'),
            weekdaysMin : 'dom_2ª_3ª_4ª_5ª_6ª_sáb'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D [de] MMMM [de] YYYY',
                LLL : 'D [de] MMMM [de] YYYY LT',
                LLLL : 'dddd, D [de] MMMM [de] YYYY LT'
            },
            calendar : {
                sameDay: '[Hoje às] LT',
                nextDay: '[Amanhã às] LT',
                nextWeek: 'dddd [às] LT',
                lastDay: '[Ontem às] LT',
                lastWeek: function () {
                    return (this.day() === 0 || this.day() === 6) ?
                        '[Último] dddd [às] LT' : // Saturday + Sunday
                        '[Última] dddd [às] LT'; // Monday - Friday
                },
                sameElse: 'L'
            },
            relativeTime : {
                future : 'em %s',
                past : 'há %s',
                s : 'segundos',
                m : 'um minuto',
                mm : '%d minutos',
                h : 'uma hora',
                hh : '%d horas',
                d : 'um dia',
                dd : '%d dias',
                M : 'um mês',
                MM : '%d meses',
                y : 'um ano',
                yy : '%d anos'
            },
            ordinalParse: /\d{1,2}º/,
            ordinal : '%dº',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : romanian (ro)
// author : Vlad Gurdiga : https://github.com/gurdiga
// author : Valentin Agachi : https://github.com/avaly

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function relativeTimeWithPlural(number, withoutSuffix, key) {
            var format = {
                    'mm': 'minute',
                    'hh': 'ore',
                    'dd': 'zile',
                    'MM': 'luni',
                    'yy': 'ani'
                },
                separator = ' ';
            if (number % 100 >= 20 || (number >= 100 && number % 100 === 0)) {
                separator = ' de ';
            }

            return number + separator + format[key];
        }

        return moment.defineLocale('ro', {
            months : 'ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie'.split('_'),
            monthsShort : 'ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.'.split('_'),
            weekdays : 'duminică_luni_marți_miercuri_joi_vineri_sâmbătă'.split('_'),
            weekdaysShort : 'Dum_Lun_Mar_Mie_Joi_Vin_Sâm'.split('_'),
            weekdaysMin : 'Du_Lu_Ma_Mi_Jo_Vi_Sâ'.split('_'),
            longDateFormat : {
                LT : 'H:mm',
                LTS : 'LT:ss',
                L : 'DD.MM.YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY H:mm',
                LLLL : 'dddd, D MMMM YYYY H:mm'
            },
            calendar : {
                sameDay: '[azi la] LT',
                nextDay: '[mâine la] LT',
                nextWeek: 'dddd [la] LT',
                lastDay: '[ieri la] LT',
                lastWeek: '[fosta] dddd [la] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : 'peste %s',
                past : '%s în urmă',
                s : 'câteva secunde',
                m : 'un minut',
                mm : relativeTimeWithPlural,
                h : 'o oră',
                hh : relativeTimeWithPlural,
                d : 'o zi',
                dd : relativeTimeWithPlural,
                M : 'o lună',
                MM : relativeTimeWithPlural,
                y : 'un an',
                yy : relativeTimeWithPlural
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : russian (ru)
// author : Viktorminator : https://github.com/Viktorminator
// Author : Menelion Elensúle : https://github.com/Oire

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function plural(word, num) {
            var forms = word.split('_');
            return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
        }

        function relativeTimeWithPlural(number, withoutSuffix, key) {
            var format = {
                'mm': withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
                'hh': 'час_часа_часов',
                'dd': 'день_дня_дней',
                'MM': 'месяц_месяца_месяцев',
                'yy': 'год_года_лет'
            };
            if (key === 'm') {
                return withoutSuffix ? 'минута' : 'минуту';
            }
            else {
                return number + ' ' + plural(format[key], +number);
            }
        }

        function monthsCaseReplace(m, format) {
            var months = {
                    'nominative': 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_'),
                    'accusative': 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_')
                },

                nounCase = (/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/).test(format) ?
                    'accusative' :
                    'nominative';

            return months[nounCase][m.month()];
        }

        function monthsShortCaseReplace(m, format) {
            var monthsShort = {
                    'nominative': 'янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек'.split('_'),
                    'accusative': 'янв_фев_мар_апр_мая_июня_июля_авг_сен_окт_ноя_дек'.split('_')
                },

                nounCase = (/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/).test(format) ?
                    'accusative' :
                    'nominative';

            return monthsShort[nounCase][m.month()];
        }

        function weekdaysCaseReplace(m, format) {
            var weekdays = {
                    'nominative': 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
                    'accusative': 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_')
                },

                nounCase = (/\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/).test(format) ?
                    'accusative' :
                    'nominative';

            return weekdays[nounCase][m.day()];
        }

        return moment.defineLocale('ru', {
            months : monthsCaseReplace,
            monthsShort : monthsShortCaseReplace,
            weekdays : weekdaysCaseReplace,
            weekdaysShort : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
            weekdaysMin : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
            monthsParse : [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[й|я]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i],
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD.MM.YYYY',
                LL : 'D MMMM YYYY г.',
                LLL : 'D MMMM YYYY г., LT',
                LLLL : 'dddd, D MMMM YYYY г., LT'
            },
            calendar : {
                sameDay: '[Сегодня в] LT',
                nextDay: '[Завтра в] LT',
                lastDay: '[Вчера в] LT',
                nextWeek: function () {
                    return this.day() === 2 ? '[Во] dddd [в] LT' : '[В] dddd [в] LT';
                },
                lastWeek: function (now) {
                    if (now.week() !== this.week()) {
                        switch (this.day()) {
                            case 0:
                                return '[В прошлое] dddd [в] LT';
                            case 1:
                            case 2:
                            case 4:
                                return '[В прошлый] dddd [в] LT';
                            case 3:
                            case 5:
                            case 6:
                                return '[В прошлую] dddd [в] LT';
                        }
                    } else {
                        if (this.day() === 2) {
                            return '[Во] dddd [в] LT';
                        } else {
                            return '[В] dddd [в] LT';
                        }
                    }
                },
                sameElse: 'L'
            },
            relativeTime : {
                future : 'через %s',
                past : '%s назад',
                s : 'несколько секунд',
                m : relativeTimeWithPlural,
                mm : relativeTimeWithPlural,
                h : 'час',
                hh : relativeTimeWithPlural,
                d : 'день',
                dd : relativeTimeWithPlural,
                M : 'месяц',
                MM : relativeTimeWithPlural,
                y : 'год',
                yy : relativeTimeWithPlural
            },

            meridiemParse: /ночи|утра|дня|вечера/i,
            isPM : function (input) {
                return /^(дня|вечера)$/.test(input);
            },

            meridiem : function (hour, minute, isLower) {
                if (hour < 4) {
                    return 'ночи';
                } else if (hour < 12) {
                    return 'утра';
                } else if (hour < 17) {
                    return 'дня';
                } else {
                    return 'вечера';
                }
            },

            ordinalParse: /\d{1,2}-(й|го|я)/,
            ordinal: function (number, period) {
                switch (period) {
                    case 'M':
                    case 'd':
                    case 'DDD':
                        return number + '-й';
                    case 'D':
                        return number + '-го';
                    case 'w':
                    case 'W':
                        return number + '-я';
                    default:
                        return number;
                }
            },

            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : slovak (sk)
// author : Martin Minka : https://github.com/k2s
// based on work of petrbela : https://github.com/petrbela

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var months = 'január_február_marec_apríl_máj_jún_júl_august_september_október_november_december'.split('_'),
            monthsShort = 'jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec'.split('_');

        function plural(n) {
            return (n > 1) && (n < 5);
        }

        function translate(number, withoutSuffix, key, isFuture) {
            var result = number + ' ';
            switch (key) {
                case 's':  // a few seconds / in a few seconds / a few seconds ago
                    return (withoutSuffix || isFuture) ? 'pár sekúnd' : 'pár sekundami';
                case 'm':  // a minute / in a minute / a minute ago
                    return withoutSuffix ? 'minúta' : (isFuture ? 'minútu' : 'minútou');
                case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'minúty' : 'minút');
                    } else {
                        return result + 'minútami';
                    }
                    break;
                case 'h':  // an hour / in an hour / an hour ago
                    return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
                case 'hh': // 9 hours / in 9 hours / 9 hours ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'hodiny' : 'hodín');
                    } else {
                        return result + 'hodinami';
                    }
                    break;
                case 'd':  // a day / in a day / a day ago
                    return (withoutSuffix || isFuture) ? 'deň' : 'dňom';
                case 'dd': // 9 days / in 9 days / 9 days ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'dni' : 'dní');
                    } else {
                        return result + 'dňami';
                    }
                    break;
                case 'M':  // a month / in a month / a month ago
                    return (withoutSuffix || isFuture) ? 'mesiac' : 'mesiacom';
                case 'MM': // 9 months / in 9 months / 9 months ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'mesiace' : 'mesiacov');
                    } else {
                        return result + 'mesiacmi';
                    }
                    break;
                case 'y':  // a year / in a year / a year ago
                    return (withoutSuffix || isFuture) ? 'rok' : 'rokom';
                case 'yy': // 9 years / in 9 years / 9 years ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'roky' : 'rokov');
                    } else {
                        return result + 'rokmi';
                    }
                    break;
            }
        }

        return moment.defineLocale('sk', {
            months : months,
            monthsShort : monthsShort,
            monthsParse : (function (months, monthsShort) {
                var i, _monthsParse = [];
                for (i = 0; i < 12; i++) {
                    // use custom parser to solve problem with July (červenec)
                    _monthsParse[i] = new RegExp('^' + months[i] + '$|^' + monthsShort[i] + '$', 'i');
                }
                return _monthsParse;
            }(months, monthsShort)),
            weekdays : 'nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota'.split('_'),
            weekdaysShort : 'ne_po_ut_st_št_pi_so'.split('_'),
            weekdaysMin : 'ne_po_ut_st_št_pi_so'.split('_'),
            longDateFormat : {
                LT: 'H:mm',
                LTS : 'LT:ss',
                L : 'DD.MM.YYYY',
                LL : 'D. MMMM YYYY',
                LLL : 'D. MMMM YYYY LT',
                LLLL : 'dddd D. MMMM YYYY LT'
            },
            calendar : {
                sameDay: '[dnes o] LT',
                nextDay: '[zajtra o] LT',
                nextWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return '[v nedeľu o] LT';
                        case 1:
                        case 2:
                            return '[v] dddd [o] LT';
                        case 3:
                            return '[v stredu o] LT';
                        case 4:
                            return '[vo štvrtok o] LT';
                        case 5:
                            return '[v piatok o] LT';
                        case 6:
                            return '[v sobotu o] LT';
                    }
                },
                lastDay: '[včera o] LT',
                lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return '[minulú nedeľu o] LT';
                        case 1:
                        case 2:
                            return '[minulý] dddd [o] LT';
                        case 3:
                            return '[minulú stredu o] LT';
                        case 4:
                        case 5:
                            return '[minulý] dddd [o] LT';
                        case 6:
                            return '[minulú sobotu o] LT';
                    }
                },
                sameElse: 'L'
            },
            relativeTime : {
                future : 'za %s',
                past : 'pred %s',
                s : translate,
                m : translate,
                mm : translate,
                h : translate,
                hh : translate,
                d : translate,
                dd : translate,
                M : translate,
                MM : translate,
                y : translate,
                yy : translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : slovenian (sl)
// author : Robert Sedovšek : https://github.com/sedovsek

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function translate(number, withoutSuffix, key) {
            var result = number + ' ';
            switch (key) {
                case 'm':
                    return withoutSuffix ? 'ena minuta' : 'eno minuto';
                case 'mm':
                    if (number === 1) {
                        result += 'minuta';
                    } else if (number === 2) {
                        result += 'minuti';
                    } else if (number === 3 || number === 4) {
                        result += 'minute';
                    } else {
                        result += 'minut';
                    }
                    return result;
                case 'h':
                    return withoutSuffix ? 'ena ura' : 'eno uro';
                case 'hh':
                    if (number === 1) {
                        result += 'ura';
                    } else if (number === 2) {
                        result += 'uri';
                    } else if (number === 3 || number === 4) {
                        result += 'ure';
                    } else {
                        result += 'ur';
                    }
                    return result;
                case 'dd':
                    if (number === 1) {
                        result += 'dan';
                    } else {
                        result += 'dni';
                    }
                    return result;
                case 'MM':
                    if (number === 1) {
                        result += 'mesec';
                    } else if (number === 2) {
                        result += 'meseca';
                    } else if (number === 3 || number === 4) {
                        result += 'mesece';
                    } else {
                        result += 'mesecev';
                    }
                    return result;
                case 'yy':
                    if (number === 1) {
                        result += 'leto';
                    } else if (number === 2) {
                        result += 'leti';
                    } else if (number === 3 || number === 4) {
                        result += 'leta';
                    } else {
                        result += 'let';
                    }
                    return result;
            }
        }

        return moment.defineLocale('sl', {
            months : 'januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december'.split('_'),
            monthsShort : 'jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.'.split('_'),
            weekdays : 'nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota'.split('_'),
            weekdaysShort : 'ned._pon._tor._sre._čet._pet._sob.'.split('_'),
            weekdaysMin : 'ne_po_to_sr_če_pe_so'.split('_'),
            longDateFormat : {
                LT : 'H:mm',
                LTS : 'LT:ss',
                L : 'DD. MM. YYYY',
                LL : 'D. MMMM YYYY',
                LLL : 'D. MMMM YYYY LT',
                LLLL : 'dddd, D. MMMM YYYY LT'
            },
            calendar : {
                sameDay  : '[danes ob] LT',
                nextDay  : '[jutri ob] LT',

                nextWeek : function () {
                    switch (this.day()) {
                        case 0:
                            return '[v] [nedeljo] [ob] LT';
                        case 3:
                            return '[v] [sredo] [ob] LT';
                        case 6:
                            return '[v] [soboto] [ob] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[v] dddd [ob] LT';
                    }
                },
                lastDay  : '[včeraj ob] LT',
                lastWeek : function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 6:
                            return '[prejšnja] dddd [ob] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[prejšnji] dddd [ob] LT';
                    }
                },
                sameElse : 'L'
            },
            relativeTime : {
                future : 'čez %s',
                past   : '%s nazaj',
                s      : 'nekaj sekund',
                m      : translate,
                mm     : translate,
                h      : translate,
                hh     : translate,
                d      : 'en dan',
                dd     : translate,
                M      : 'en mesec',
                MM     : translate,
                y      : 'eno leto',
                yy     : translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : Albanian (sq)
// author : Flakërim Ismani : https://github.com/flakerimi
// author: Menelion Elensúle: https://github.com/Oire (tests)
// author : Oerd Cukalla : https://github.com/oerd (fixes)

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('sq', {
            months : 'Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor'.split('_'),
            monthsShort : 'Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj'.split('_'),
            weekdays : 'E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë'.split('_'),
            weekdaysShort : 'Die_Hën_Mar_Mër_Enj_Pre_Sht'.split('_'),
            weekdaysMin : 'D_H_Ma_Më_E_P_Sh'.split('_'),
            meridiemParse: /PD|MD/,
            isPM: function (input) {
                return input.charAt(0) === 'M';
            },
            meridiem : function (hours, minutes, isLower) {
                return hours < 12 ? 'PD' : 'MD';
            },
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd, D MMMM YYYY LT'
            },
            calendar : {
                sameDay : '[Sot në] LT',
                nextDay : '[Nesër në] LT',
                nextWeek : 'dddd [në] LT',
                lastDay : '[Dje në] LT',
                lastWeek : 'dddd [e kaluar në] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'në %s',
                past : '%s më parë',
                s : 'disa sekonda',
                m : 'një minutë',
                mm : '%d minuta',
                h : 'një orë',
                hh : '%d orë',
                d : 'një ditë',
                dd : '%d ditë',
                M : 'një muaj',
                MM : '%d muaj',
                y : 'një vit',
                yy : '%d vite'
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : Serbian-cyrillic (sr-cyrl)
// author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var translator = {
            words: { //Different grammatical cases
                m: ['један минут', 'једне минуте'],
                mm: ['минут', 'минуте', 'минута'],
                h: ['један сат', 'једног сата'],
                hh: ['сат', 'сата', 'сати'],
                dd: ['дан', 'дана', 'дана'],
                MM: ['месец', 'месеца', 'месеци'],
                yy: ['година', 'године', 'година']
            },
            correctGrammaticalCase: function (number, wordKey) {
                return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
            },
            translate: function (number, withoutSuffix, key) {
                var wordKey = translator.words[key];
                if (key.length === 1) {
                    return withoutSuffix ? wordKey[0] : wordKey[1];
                } else {
                    return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
                }
            }
        };

        return moment.defineLocale('sr-cyrl', {
            months: ['јануар', 'фебруар', 'март', 'април', 'мај', 'јун', 'јул', 'август', 'септембар', 'октобар', 'новембар', 'децембар'],
            monthsShort: ['јан.', 'феб.', 'мар.', 'апр.', 'мај', 'јун', 'јул', 'авг.', 'сеп.', 'окт.', 'нов.', 'дец.'],
            weekdays: ['недеља', 'понедељак', 'уторак', 'среда', 'четвртак', 'петак', 'субота'],
            weekdaysShort: ['нед.', 'пон.', 'уто.', 'сре.', 'чет.', 'пет.', 'суб.'],
            weekdaysMin: ['не', 'по', 'ут', 'ср', 'че', 'пе', 'су'],
            longDateFormat: {
                LT: 'H:mm',
                LTS : 'LT:ss',
                L: 'DD. MM. YYYY',
                LL: 'D. MMMM YYYY',
                LLL: 'D. MMMM YYYY LT',
                LLLL: 'dddd, D. MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[данас у] LT',
                nextDay: '[сутра у] LT',

                nextWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return '[у] [недељу] [у] LT';
                        case 3:
                            return '[у] [среду] [у] LT';
                        case 6:
                            return '[у] [суботу] [у] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[у] dddd [у] LT';
                    }
                },
                lastDay  : '[јуче у] LT',
                lastWeek : function () {
                    var lastWeekDays = [
                        '[прошле] [недеље] [у] LT',
                        '[прошлог] [понедељка] [у] LT',
                        '[прошлог] [уторка] [у] LT',
                        '[прошле] [среде] [у] LT',
                        '[прошлог] [четвртка] [у] LT',
                        '[прошлог] [петка] [у] LT',
                        '[прошле] [суботе] [у] LT'
                    ];
                    return lastWeekDays[this.day()];
                },
                sameElse : 'L'
            },
            relativeTime : {
                future : 'за %s',
                past   : 'пре %s',
                s      : 'неколико секунди',
                m      : translator.translate,
                mm     : translator.translate,
                h      : translator.translate,
                hh     : translator.translate,
                d      : 'дан',
                dd     : translator.translate,
                M      : 'месец',
                MM     : translator.translate,
                y      : 'годину',
                yy     : translator.translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : Serbian-latin (sr)
// author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var translator = {
            words: { //Different grammatical cases
                m: ['jedan minut', 'jedne minute'],
                mm: ['minut', 'minute', 'minuta'],
                h: ['jedan sat', 'jednog sata'],
                hh: ['sat', 'sata', 'sati'],
                dd: ['dan', 'dana', 'dana'],
                MM: ['mesec', 'meseca', 'meseci'],
                yy: ['godina', 'godine', 'godina']
            },
            correctGrammaticalCase: function (number, wordKey) {
                return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
            },
            translate: function (number, withoutSuffix, key) {
                var wordKey = translator.words[key];
                if (key.length === 1) {
                    return withoutSuffix ? wordKey[0] : wordKey[1];
                } else {
                    return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
                }
            }
        };

        return moment.defineLocale('sr', {
            months: ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'],
            monthsShort: ['jan.', 'feb.', 'mar.', 'apr.', 'maj', 'jun', 'jul', 'avg.', 'sep.', 'okt.', 'nov.', 'dec.'],
            weekdays: ['nedelja', 'ponedeljak', 'utorak', 'sreda', 'četvrtak', 'petak', 'subota'],
            weekdaysShort: ['ned.', 'pon.', 'uto.', 'sre.', 'čet.', 'pet.', 'sub.'],
            weekdaysMin: ['ne', 'po', 'ut', 'sr', 'če', 'pe', 'su'],
            longDateFormat: {
                LT: 'H:mm',
                LTS : 'LT:ss',
                L: 'DD. MM. YYYY',
                LL: 'D. MMMM YYYY',
                LLL: 'D. MMMM YYYY LT',
                LLLL: 'dddd, D. MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[danas u] LT',
                nextDay: '[sutra u] LT',

                nextWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return '[u] [nedelju] [u] LT';
                        case 3:
                            return '[u] [sredu] [u] LT';
                        case 6:
                            return '[u] [subotu] [u] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[u] dddd [u] LT';
                    }
                },
                lastDay  : '[juče u] LT',
                lastWeek : function () {
                    var lastWeekDays = [
                        '[prošle] [nedelje] [u] LT',
                        '[prošlog] [ponedeljka] [u] LT',
                        '[prošlog] [utorka] [u] LT',
                        '[prošle] [srede] [u] LT',
                        '[prošlog] [četvrtka] [u] LT',
                        '[prošlog] [petka] [u] LT',
                        '[prošle] [subote] [u] LT'
                    ];
                    return lastWeekDays[this.day()];
                },
                sameElse : 'L'
            },
            relativeTime : {
                future : 'za %s',
                past   : 'pre %s',
                s      : 'nekoliko sekundi',
                m      : translator.translate,
                mm     : translator.translate,
                h      : translator.translate,
                hh     : translator.translate,
                d      : 'dan',
                dd     : translator.translate,
                M      : 'mesec',
                MM     : translator.translate,
                y      : 'godinu',
                yy     : translator.translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal : '%d.',
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : swedish (sv)
// author : Jens Alm : https://github.com/ulmus

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('sv', {
            months : 'januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december'.split('_'),
            monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
            weekdays : 'söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag'.split('_'),
            weekdaysShort : 'sön_mån_tis_ons_tor_fre_lör'.split('_'),
            weekdaysMin : 'sö_må_ti_on_to_fr_lö'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'YYYY-MM-DD',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd D MMMM YYYY LT'
            },
            calendar : {
                sameDay: '[Idag] LT',
                nextDay: '[Imorgon] LT',
                lastDay: '[Igår] LT',
                nextWeek: 'dddd LT',
                lastWeek: '[Förra] dddd[en] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : 'om %s',
                past : 'för %s sedan',
                s : 'några sekunder',
                m : 'en minut',
                mm : '%d minuter',
                h : 'en timme',
                hh : '%d timmar',
                d : 'en dag',
                dd : '%d dagar',
                M : 'en månad',
                MM : '%d månader',
                y : 'ett år',
                yy : '%d år'
            },
            ordinalParse: /\d{1,2}(e|a)/,
            ordinal : function (number) {
                var b = number % 10,
                    output = (~~(number % 100 / 10) === 1) ? 'e' :
                        (b === 1) ? 'a' :
                            (b === 2) ? 'a' :
                                (b === 3) ? 'e' : 'e';
                return number + output;
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : tamil (ta)
// author : Arjunkumar Krishnamoorthy : https://github.com/tk120404

    (function (factory) {
        factory(moment);
    }(function (moment) {
        /*var symbolMap = {
         '1': '௧',
         '2': '௨',
         '3': '௩',
         '4': '௪',
         '5': '௫',
         '6': '௬',
         '7': '௭',
         '8': '௮',
         '9': '௯',
         '0': '௦'
         },
         numberMap = {
         '௧': '1',
         '௨': '2',
         '௩': '3',
         '௪': '4',
         '௫': '5',
         '௬': '6',
         '௭': '7',
         '௮': '8',
         '௯': '9',
         '௦': '0'
         }; */

        return moment.defineLocale('ta', {
            months : 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
            monthsShort : 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
            weekdays : 'ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை'.split('_'),
            weekdaysShort : 'ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி'.split('_'),
            weekdaysMin : 'ஞா_தி_செ_பு_வி_வெ_ச'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY, LT',
                LLLL : 'dddd, D MMMM YYYY, LT'
            },
            calendar : {
                sameDay : '[இன்று] LT',
                nextDay : '[நாளை] LT',
                nextWeek : 'dddd, LT',
                lastDay : '[நேற்று] LT',
                lastWeek : '[கடந்த வாரம்] dddd, LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : '%s இல்',
                past : '%s முன்',
                s : 'ஒரு சில விநாடிகள்',
                m : 'ஒரு நிமிடம்',
                mm : '%d நிமிடங்கள்',
                h : 'ஒரு மணி நேரம்',
                hh : '%d மணி நேரம்',
                d : 'ஒரு நாள்',
                dd : '%d நாட்கள்',
                M : 'ஒரு மாதம்',
                MM : '%d மாதங்கள்',
                y : 'ஒரு வருடம்',
                yy : '%d ஆண்டுகள்'
            },
            /*        preparse: function (string) {
             return string.replace(/[௧௨௩௪௫௬௭௮௯௦]/g, function (match) {
             return numberMap[match];
             });
             },
             postformat: function (string) {
             return string.replace(/\d/g, function (match) {
             return symbolMap[match];
             });
             },*/
            ordinalParse: /\d{1,2}வது/,
            ordinal : function (number) {
                return number + 'வது';
            },


            // refer http://ta.wikipedia.org/s/1er1
            meridiemParse: /யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,
            meridiem : function (hour, minute, isLower) {
                if (hour < 2) {
                    return ' யாமம்';
                } else if (hour < 6) {
                    return ' வைகறை';  // வைகறை
                } else if (hour < 10) {
                    return ' காலை'; // காலை
                } else if (hour < 14) {
                    return ' நண்பகல்'; // நண்பகல்
                } else if (hour < 18) {
                    return ' எற்பாடு'; // எற்பாடு
                } else if (hour < 22) {
                    return ' மாலை'; // மாலை
                } else {
                    return ' யாமம்';
                }
            },
            meridiemHour : function (hour, meridiem) {
                if (hour === 12) {
                    hour = 0;
                }
                if (meridiem === 'யாமம்') {
                    return hour < 2 ? hour : hour + 12;
                } else if (meridiem === 'வைகறை' || meridiem === 'காலை') {
                    return hour;
                } else if (meridiem === 'நண்பகல்') {
                    return hour >= 10 ? hour : hour + 12;
                } else {
                    return hour + 12;
                }
            },
            week : {
                dow : 0, // Sunday is the first day of the week.
                doy : 6  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : thai (th)
// author : Kridsada Thanabulpong : https://github.com/sirn

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('th', {
            months : 'มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม'.split('_'),
            monthsShort : 'มกรา_กุมภา_มีนา_เมษา_พฤษภา_มิถุนา_กรกฎา_สิงหา_กันยา_ตุลา_พฤศจิกา_ธันวา'.split('_'),
            weekdays : 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_'),
            weekdaysShort : 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์'.split('_'), // yes, three characters difference
            weekdaysMin : 'อา._จ._อ._พ._พฤ._ศ._ส.'.split('_'),
            longDateFormat : {
                LT : 'H นาฬิกา m นาที',
                LTS : 'LT s วินาที',
                L : 'YYYY/MM/DD',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY เวลา LT',
                LLLL : 'วันddddที่ D MMMM YYYY เวลา LT'
            },
            meridiemParse: /ก่อนเที่ยง|หลังเที่ยง/,
            isPM: function (input) {
                return input === 'หลังเที่ยง';
            },
            meridiem : function (hour, minute, isLower) {
                if (hour < 12) {
                    return 'ก่อนเที่ยง';
                } else {
                    return 'หลังเที่ยง';
                }
            },
            calendar : {
                sameDay : '[วันนี้ เวลา] LT',
                nextDay : '[พรุ่งนี้ เวลา] LT',
                nextWeek : 'dddd[หน้า เวลา] LT',
                lastDay : '[เมื่อวานนี้ เวลา] LT',
                lastWeek : '[วัน]dddd[ที่แล้ว เวลา] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'อีก %s',
                past : '%sที่แล้ว',
                s : 'ไม่กี่วินาที',
                m : '1 นาที',
                mm : '%d นาที',
                h : '1 ชั่วโมง',
                hh : '%d ชั่วโมง',
                d : '1 วัน',
                dd : '%d วัน',
                M : '1 เดือน',
                MM : '%d เดือน',
                y : '1 ปี',
                yy : '%d ปี'
            }
        });
    }));
// moment.js locale configuration
// locale : Tagalog/Filipino (tl-ph)
// author : Dan Hagman

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('tl-ph', {
            months : 'Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre'.split('_'),
            monthsShort : 'Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis'.split('_'),
            weekdays : 'Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado'.split('_'),
            weekdaysShort : 'Lin_Lun_Mar_Miy_Huw_Biy_Sab'.split('_'),
            weekdaysMin : 'Li_Lu_Ma_Mi_Hu_Bi_Sab'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'MM/D/YYYY',
                LL : 'MMMM D, YYYY',
                LLL : 'MMMM D, YYYY LT',
                LLLL : 'dddd, MMMM DD, YYYY LT'
            },
            calendar : {
                sameDay: '[Ngayon sa] LT',
                nextDay: '[Bukas sa] LT',
                nextWeek: 'dddd [sa] LT',
                lastDay: '[Kahapon sa] LT',
                lastWeek: 'dddd [huling linggo] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : 'sa loob ng %s',
                past : '%s ang nakalipas',
                s : 'ilang segundo',
                m : 'isang minuto',
                mm : '%d minuto',
                h : 'isang oras',
                hh : '%d oras',
                d : 'isang araw',
                dd : '%d araw',
                M : 'isang buwan',
                MM : '%d buwan',
                y : 'isang taon',
                yy : '%d taon'
            },
            ordinalParse: /\d{1,2}/,
            ordinal : function (number) {
                return number;
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : turkish (tr)
// authors : Erhan Gundogan : https://github.com/erhangundogan,
//           Burak Yiğit Kaya: https://github.com/BYK

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var suffixes = {
            1: '\'inci',
            5: '\'inci',
            8: '\'inci',
            70: '\'inci',
            80: '\'inci',

            2: '\'nci',
            7: '\'nci',
            20: '\'nci',
            50: '\'nci',

            3: '\'üncü',
            4: '\'üncü',
            100: '\'üncü',

            6: '\'ncı',

            9: '\'uncu',
            10: '\'uncu',
            30: '\'uncu',

            60: '\'ıncı',
            90: '\'ıncı'
        };

        return moment.defineLocale('tr', {
            months : 'Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık'.split('_'),
            monthsShort : 'Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara'.split('_'),
            weekdays : 'Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi'.split('_'),
            weekdaysShort : 'Paz_Pts_Sal_Çar_Per_Cum_Cts'.split('_'),
            weekdaysMin : 'Pz_Pt_Sa_Ça_Pe_Cu_Ct'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD.MM.YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd, D MMMM YYYY LT'
            },
            calendar : {
                sameDay : '[bugün saat] LT',
                nextDay : '[yarın saat] LT',
                nextWeek : '[haftaya] dddd [saat] LT',
                lastDay : '[dün] LT',
                lastWeek : '[geçen hafta] dddd [saat] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : '%s sonra',
                past : '%s önce',
                s : 'birkaç saniye',
                m : 'bir dakika',
                mm : '%d dakika',
                h : 'bir saat',
                hh : '%d saat',
                d : 'bir gün',
                dd : '%d gün',
                M : 'bir ay',
                MM : '%d ay',
                y : 'bir yıl',
                yy : '%d yıl'
            },
            ordinalParse: /\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,
            ordinal : function (number) {
                if (number === 0) {  // special case for zero
                    return number + '\'ıncı';
                }
                var a = number % 10,
                    b = number % 100 - a,
                    c = number >= 100 ? 100 : null;

                return number + (suffixes[a] || suffixes[b] || suffixes[c]);
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : Morocco Central Atlas Tamaziɣt in Latin (tzm-latn)
// author : Abdel Said : https://github.com/abdelsaid

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('tzm-latn', {
            months : 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split('_'),
            monthsShort : 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split('_'),
            weekdays : 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
            weekdaysShort : 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
            weekdaysMin : 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd D MMMM YYYY LT'
            },
            calendar : {
                sameDay: '[asdkh g] LT',
                nextDay: '[aska g] LT',
                nextWeek: 'dddd [g] LT',
                lastDay: '[assant g] LT',
                lastWeek: 'dddd [g] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : 'dadkh s yan %s',
                past : 'yan %s',
                s : 'imik',
                m : 'minuḍ',
                mm : '%d minuḍ',
                h : 'saɛa',
                hh : '%d tassaɛin',
                d : 'ass',
                dd : '%d ossan',
                M : 'ayowr',
                MM : '%d iyyirn',
                y : 'asgas',
                yy : '%d isgasn'
            },
            week : {
                dow : 6, // Saturday is the first day of the week.
                doy : 12  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : Morocco Central Atlas Tamaziɣt (tzm)
// author : Abdel Said : https://github.com/abdelsaid

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('tzm', {
            months : 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
            monthsShort : 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
            weekdays : 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
            weekdaysShort : 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
            weekdaysMin : 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS: 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'dddd D MMMM YYYY LT'
            },
            calendar : {
                sameDay: '[ⴰⵙⴷⵅ ⴴ] LT',
                nextDay: '[ⴰⵙⴽⴰ ⴴ] LT',
                nextWeek: 'dddd [ⴴ] LT',
                lastDay: '[ⴰⵚⴰⵏⵜ ⴴ] LT',
                lastWeek: 'dddd [ⴴ] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : 'ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s',
                past : 'ⵢⴰⵏ %s',
                s : 'ⵉⵎⵉⴽ',
                m : 'ⵎⵉⵏⵓⴺ',
                mm : '%d ⵎⵉⵏⵓⴺ',
                h : 'ⵙⴰⵄⴰ',
                hh : '%d ⵜⴰⵙⵙⴰⵄⵉⵏ',
                d : 'ⴰⵙⵙ',
                dd : '%d oⵙⵙⴰⵏ',
                M : 'ⴰⵢoⵓⵔ',
                MM : '%d ⵉⵢⵢⵉⵔⵏ',
                y : 'ⴰⵙⴳⴰⵙ',
                yy : '%d ⵉⵙⴳⴰⵙⵏ'
            },
            week : {
                dow : 6, // Saturday is the first day of the week.
                doy : 12  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : ukrainian (uk)
// author : zemlanin : https://github.com/zemlanin
// Author : Menelion Elensúle : https://github.com/Oire

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function plural(word, num) {
            var forms = word.split('_');
            return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
        }

        function relativeTimeWithPlural(number, withoutSuffix, key) {
            var format = {
                'mm': 'хвилина_хвилини_хвилин',
                'hh': 'година_години_годин',
                'dd': 'день_дні_днів',
                'MM': 'місяць_місяці_місяців',
                'yy': 'рік_роки_років'
            };
            if (key === 'm') {
                return withoutSuffix ? 'хвилина' : 'хвилину';
            }
            else if (key === 'h') {
                return withoutSuffix ? 'година' : 'годину';
            }
            else {
                return number + ' ' + plural(format[key], +number);
            }
        }

        function monthsCaseReplace(m, format) {
            var months = {
                    'nominative': 'січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень'.split('_'),
                    'accusative': 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня'.split('_')
                },

                nounCase = (/D[oD]? *MMMM?/).test(format) ?
                    'accusative' :
                    'nominative';

            return months[nounCase][m.month()];
        }

        function weekdaysCaseReplace(m, format) {
            var weekdays = {
                    'nominative': 'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота'.split('_'),
                    'accusative': 'неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу'.split('_'),
                    'genitive': 'неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи'.split('_')
                },

                nounCase = (/(\[[ВвУу]\]) ?dddd/).test(format) ?
                    'accusative' :
                    ((/\[?(?:минулої|наступної)? ?\] ?dddd/).test(format) ?
                        'genitive' :
                        'nominative');

            return weekdays[nounCase][m.day()];
        }

        function processHoursFunction(str) {
            return function () {
                return str + 'о' + (this.hours() === 11 ? 'б' : '') + '] LT';
            };
        }

        return moment.defineLocale('uk', {
            months : monthsCaseReplace,
            monthsShort : 'січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд'.split('_'),
            weekdays : weekdaysCaseReplace,
            weekdaysShort : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
            weekdaysMin : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD.MM.YYYY',
                LL : 'D MMMM YYYY р.',
                LLL : 'D MMMM YYYY р., LT',
                LLLL : 'dddd, D MMMM YYYY р., LT'
            },
            calendar : {
                sameDay: processHoursFunction('[Сьогодні '),
                nextDay: processHoursFunction('[Завтра '),
                lastDay: processHoursFunction('[Вчора '),
                nextWeek: processHoursFunction('[У] dddd ['),
                lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 5:
                        case 6:
                            return processHoursFunction('[Минулої] dddd [').call(this);
                        case 1:
                        case 2:
                        case 4:
                            return processHoursFunction('[Минулого] dddd [').call(this);
                    }
                },
                sameElse: 'L'
            },
            relativeTime : {
                future : 'за %s',
                past : '%s тому',
                s : 'декілька секунд',
                m : relativeTimeWithPlural,
                mm : relativeTimeWithPlural,
                h : 'годину',
                hh : relativeTimeWithPlural,
                d : 'день',
                dd : relativeTimeWithPlural,
                M : 'місяць',
                MM : relativeTimeWithPlural,
                y : 'рік',
                yy : relativeTimeWithPlural
            },

            // M. E.: those two are virtually unused but a user might want to implement them for his/her website for some reason

            meridiemParse: /ночі|ранку|дня|вечора/,
            isPM: function (input) {
                return /^(дня|вечора)$/.test(input);
            },
            meridiem : function (hour, minute, isLower) {
                if (hour < 4) {
                    return 'ночі';
                } else if (hour < 12) {
                    return 'ранку';
                } else if (hour < 17) {
                    return 'дня';
                } else {
                    return 'вечора';
                }
            },

            ordinalParse: /\d{1,2}-(й|го)/,
            ordinal: function (number, period) {
                switch (period) {
                    case 'M':
                    case 'd':
                    case 'DDD':
                    case 'w':
                    case 'W':
                        return number + '-й';
                    case 'D':
                        return number + '-го';
                    default:
                        return number;
                }
            },

            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : uzbek (uz)
// author : Sardor Muminov : https://github.com/muminoff

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('uz', {
            months : 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_'),
            monthsShort : 'янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек'.split('_'),
            weekdays : 'Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба'.split('_'),
            weekdaysShort : 'Якш_Душ_Сеш_Чор_Пай_Жум_Шан'.split('_'),
            weekdaysMin : 'Як_Ду_Се_Чо_Па_Жу_Ша'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY LT',
                LLLL : 'D MMMM YYYY, dddd LT'
            },
            calendar : {
                sameDay : '[Бугун соат] LT [да]',
                nextDay : '[Эртага] LT [да]',
                nextWeek : 'dddd [куни соат] LT [да]',
                lastDay : '[Кеча соат] LT [да]',
                lastWeek : '[Утган] dddd [куни соат] LT [да]',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'Якин %s ичида',
                past : 'Бир неча %s олдин',
                s : 'фурсат',
                m : 'бир дакика',
                mm : '%d дакика',
                h : 'бир соат',
                hh : '%d соат',
                d : 'бир кун',
                dd : '%d кун',
                M : 'бир ой',
                MM : '%d ой',
                y : 'бир йил',
                yy : '%d йил'
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 7  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : vietnamese (vi)
// author : Bang Nguyen : https://github.com/bangnk

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('vi', {
            months : 'tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12'.split('_'),
            monthsShort : 'Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12'.split('_'),
            weekdays : 'chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy'.split('_'),
            weekdaysShort : 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
            weekdaysMin : 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'LT:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM [năm] YYYY',
                LLL : 'D MMMM [năm] YYYY LT',
                LLLL : 'dddd, D MMMM [năm] YYYY LT',
                l : 'DD/M/YYYY',
                ll : 'D MMM YYYY',
                lll : 'D MMM YYYY LT',
                llll : 'ddd, D MMM YYYY LT'
            },
            calendar : {
                sameDay: '[Hôm nay lúc] LT',
                nextDay: '[Ngày mai lúc] LT',
                nextWeek: 'dddd [tuần tới lúc] LT',
                lastDay: '[Hôm qua lúc] LT',
                lastWeek: 'dddd [tuần rồi lúc] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : '%s tới',
                past : '%s trước',
                s : 'vài giây',
                m : 'một phút',
                mm : '%d phút',
                h : 'một giờ',
                hh : '%d giờ',
                d : 'một ngày',
                dd : '%d ngày',
                M : 'một tháng',
                MM : '%d tháng',
                y : 'một năm',
                yy : '%d năm'
            },
            ordinalParse: /\d{1,2}/,
            ordinal : function (number) {
                return number;
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : chinese (zh-cn)
// author : suupic : https://github.com/suupic
// author : Zeno Zeng : https://github.com/zenozeng

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('zh-cn', {
            months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
            monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
            weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
            weekdaysShort : '周日_周一_周二_周三_周四_周五_周六'.split('_'),
            weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
            longDateFormat : {
                LT : 'Ah点mm',
                LTS : 'Ah点m分s秒',
                L : 'YYYY-MM-DD',
                LL : 'YYYY年MMMD日',
                LLL : 'YYYY年MMMD日LT',
                LLLL : 'YYYY年MMMD日ddddLT',
                l : 'YYYY-MM-DD',
                ll : 'YYYY年MMMD日',
                lll : 'YYYY年MMMD日LT',
                llll : 'YYYY年MMMD日ddddLT'
            },
            meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
            meridiemHour: function (hour, meridiem) {
                if (hour === 12) {
                    hour = 0;
                }
                if (meridiem === '凌晨' || meridiem === '早上' ||
                    meridiem === '上午') {
                    return hour;
                } else if (meridiem === '下午' || meridiem === '晚上') {
                    return hour + 12;
                } else {
                    // '中午'
                    return hour >= 11 ? hour : hour + 12;
                }
            },
            meridiem : function (hour, minute, isLower) {
                var hm = hour * 100 + minute;
                if (hm < 600) {
                    return '凌晨';
                } else if (hm < 900) {
                    return '早上';
                } else if (hm < 1130) {
                    return '上午';
                } else if (hm < 1230) {
                    return '中午';
                } else if (hm < 1800) {
                    return '下午';
                } else {
                    return '晚上';
                }
            },
            calendar : {
                sameDay : function () {
                    return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT';
                },
                nextDay : function () {
                    return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT';
                },
                lastDay : function () {
                    return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT';
                },
                nextWeek : function () {
                    var startOfWeek, prefix;
                    startOfWeek = moment().startOf('week');
                    prefix = this.unix() - startOfWeek.unix() >= 7 * 24 * 3600 ? '[下]' : '[本]';
                    return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
                },
                lastWeek : function () {
                    var startOfWeek, prefix;
                    startOfWeek = moment().startOf('week');
                    prefix = this.unix() < startOfWeek.unix()  ? '[上]' : '[本]';
                    return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
                },
                sameElse : 'LL'
            },
            ordinalParse: /\d{1,2}(日|月|周)/,
            ordinal : function (number, period) {
                switch (period) {
                    case 'd':
                    case 'D':
                    case 'DDD':
                        return number + '日';
                    case 'M':
                        return number + '月';
                    case 'w':
                    case 'W':
                        return number + '周';
                    default:
                        return number;
                }
            },
            relativeTime : {
                future : '%s内',
                past : '%s前',
                s : '几秒',
                m : '1分钟',
                mm : '%d分钟',
                h : '1小时',
                hh : '%d小时',
                d : '1天',
                dd : '%d天',
                M : '1个月',
                MM : '%d个月',
                y : '1年',
                yy : '%d年'
            },
            week : {
                // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
// moment.js locale configuration
// locale : traditional chinese (zh-tw)
// author : Ben : https://github.com/ben-lin

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('zh-tw', {
            months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
            monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
            weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
            weekdaysShort : '週日_週一_週二_週三_週四_週五_週六'.split('_'),
            weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
            longDateFormat : {
                LT : 'Ah點mm',
                LTS : 'Ah點m分s秒',
                L : 'YYYY年MMMD日',
                LL : 'YYYY年MMMD日',
                LLL : 'YYYY年MMMD日LT',
                LLLL : 'YYYY年MMMD日ddddLT',
                l : 'YYYY年MMMD日',
                ll : 'YYYY年MMMD日',
                lll : 'YYYY年MMMD日LT',
                llll : 'YYYY年MMMD日ddddLT'
            },
            meridiemParse: /早上|上午|中午|下午|晚上/,
            meridiemHour : function (hour, meridiem) {
                if (hour === 12) {
                    hour = 0;
                }
                if (meridiem === '早上' || meridiem === '上午') {
                    return hour;
                } else if (meridiem === '中午') {
                    return hour >= 11 ? hour : hour + 12;
                } else if (meridiem === '下午' || meridiem === '晚上') {
                    return hour + 12;
                }
            },
            meridiem : function (hour, minute, isLower) {
                var hm = hour * 100 + minute;
                if (hm < 900) {
                    return '早上';
                } else if (hm < 1130) {
                    return '上午';
                } else if (hm < 1230) {
                    return '中午';
                } else if (hm < 1800) {
                    return '下午';
                } else {
                    return '晚上';
                }
            },
            calendar : {
                sameDay : '[今天]LT',
                nextDay : '[明天]LT',
                nextWeek : '[下]ddddLT',
                lastDay : '[昨天]LT',
                lastWeek : '[上]ddddLT',
                sameElse : 'L'
            },
            ordinalParse: /\d{1,2}(日|月|週)/,
            ordinal : function (number, period) {
                switch (period) {
                    case 'd' :
                    case 'D' :
                    case 'DDD' :
                        return number + '日';
                    case 'M' :
                        return number + '月';
                    case 'w' :
                    case 'W' :
                        return number + '週';
                    default :
                        return number;
                }
            },
            relativeTime : {
                future : '%s內',
                past : '%s前',
                s : '幾秒',
                m : '一分鐘',
                mm : '%d分鐘',
                h : '一小時',
                hh : '%d小時',
                d : '一天',
                dd : '%d天',
                M : '一個月',
                MM : '%d個月',
                y : '一年',
                yy : '%d年'
            }
        });
    }));

    moment.locale('en');


    /************************************
     Exposing Moment
     ************************************/

    function makeGlobal(shouldDeprecate) {
        /*global ender:false */
        if (typeof ender !== 'undefined') {
            return;
        }
        oldGlobalMoment = globalScope.moment;
        if (shouldDeprecate) {
            globalScope.moment = deprecate(
                'Accessing Moment through the global scope is ' +
                'deprecated, and will be removed in an upcoming ' +
                'release.',
                moment);
        } else {
            globalScope.moment = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    } else if (typeof define === 'function' && define.amd) {
        define(function (require, exports, module) {
            if (module.config && module.config() && module.config().noGlobal === true) {
                // release the global variable
                globalScope.moment = oldGlobalMoment;
            }

            return moment;
        });
        makeGlobal(true);
    } else {
        makeGlobal();
    }
}).call(this);

/*! jQuery v1.12.0 | (c) jQuery Foundation | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=a.document,e=c.slice,f=c.concat,g=c.push,h=c.indexOf,i={},j=i.toString,k=i.hasOwnProperty,l={},m="1.12.0",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return e.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:e.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a){return n.each(this,a)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(e.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:g,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(e=arguments[h]))for(d in e)a=g[d],c=e[d],g!==c&&(j&&c&&(n.isPlainObject(c)||(b=n.isArray(c)))?(b?(b=!1,f=a&&n.isArray(a)?a:[]):f=a&&n.isPlainObject(a)?a:{},g[d]=n.extend(j,f,c)):void 0!==c&&(g[d]=c));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray||function(a){return"array"===n.type(a)},isWindow:function(a){return null!=a&&a==a.window},isNumeric:function(a){var b=a&&a.toString();return!n.isArray(a)&&b-parseFloat(b)+1>=0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},isPlainObject:function(a){var b;if(!a||"object"!==n.type(a)||a.nodeType||n.isWindow(a))return!1;try{if(a.constructor&&!k.call(a,"constructor")&&!k.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}if(!l.ownFirst)for(b in a)return k.call(a,b);for(b in a);return void 0===b||k.call(a,b)},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?i[j.call(a)]||"object":typeof a},globalEval:function(b){b&&n.trim(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b){var c,d=0;if(s(a)){for(c=a.length;c>d;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):g.call(c,a)),c},inArray:function(a,b,c){var d;if(b){if(h)return h.call(b,a,c);for(d=b.length,c=c?0>c?Math.max(0,d+c):c:0;d>c;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,b){var c=+b.length,d=0,e=a.length;while(c>d)a[e++]=b[d++];if(c!==c)while(void 0!==b[d])a[e++]=b[d++];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,g=0,h=[];if(s(a))for(d=a.length;d>g;g++)e=b(a[g],g,c),null!=e&&h.push(e);else for(g in a)e=b(a[g],g,c),null!=e&&h.push(e);return f.apply([],h)},guid:1,proxy:function(a,b){var c,d,f;return"string"==typeof b&&(f=a[b],b=a,a=f),n.isFunction(a)?(c=e.call(arguments,2),d=function(){return a.apply(b||this,c.concat(e.call(arguments)))},d.guid=a.guid=a.guid||n.guid++,d):void 0},now:function(){return+new Date},support:l}),"function"==typeof Symbol&&(n.fn[Symbol.iterator]=c[Symbol.iterator]),n.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){i["[object "+b+"]"]=b.toLowerCase()});function s(a){var b=!!a&&"length"in a&&a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ga(),z=ga(),A=ga(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+M+"))|)"+L+"*\\]",O=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+N+")*)|.*)\\)|)",P=new RegExp(L+"+","g"),Q=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),R=new RegExp("^"+L+"*,"+L+"*"),S=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),T=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),U=new RegExp(O),V=new RegExp("^"+M+"$"),W={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M+"|[*])"),ATTR:new RegExp("^"+N),PSEUDO:new RegExp("^"+O),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},X=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Z=/^[^{]+\{\s*\[native \w/,$=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,_=/[+~]/,aa=/'|\\/g,ba=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),ca=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},da=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(ea){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function fa(a,b,d,e){var f,h,j,k,l,o,r,s,w=b&&b.ownerDocument,x=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==x&&9!==x&&11!==x)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==x&&(o=$.exec(a)))if(f=o[1]){if(9===x){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(w&&(j=w.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(o[2])return H.apply(d,b.getElementsByTagName(a)),d;if((f=o[3])&&c.getElementsByClassName&&b.getElementsByClassName)return H.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==x)w=b,s=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(aa,"\\$&"):b.setAttribute("id",k=u),r=g(a),h=r.length,l=V.test(k)?"#"+k:"[id='"+k+"']";while(h--)r[h]=l+" "+qa(r[h]);s=r.join(","),w=_.test(a)&&oa(b.parentNode)||b}if(s)try{return H.apply(d,w.querySelectorAll(s)),d}catch(y){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(Q,"$1"),b,d,e)}function ga(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ha(a){return a[u]=!0,a}function ia(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ja(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function ka(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function la(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function na(a){return ha(function(b){return b=+b,ha(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function oa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=fa.support={},f=fa.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=fa.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ia(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ia(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Z.test(n.getElementsByClassName),c.getById=ia(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}},d.filter.ID=function(a){var b=a.replace(ba,ca);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(ba,ca);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return"undefined"!=typeof b.getElementsByClassName&&p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=Z.test(n.querySelectorAll))&&(ia(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ia(function(a){var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Z.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ia(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",O)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Z.test(o.compareDocumentPosition),t=b||Z.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return ka(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?ka(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},fa.matches=function(a,b){return fa(a,null,null,b)},fa.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(T,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return fa(b,n,null,[a]).length>0},fa.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},fa.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},fa.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},fa.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=fa.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=fa.selectors={cacheLength:50,createPseudo:ha,match:W,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ba,ca),a[3]=(a[3]||a[4]||a[5]||"").replace(ba,ca),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||fa.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&fa.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return W.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&U.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(ba,ca).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=fa.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(P," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||fa.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ha(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ha(function(a){var b=[],c=[],d=h(a.replace(Q,"$1"));return d[u]?ha(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ha(function(a){return function(b){return fa(a,b).length>0}}),contains:ha(function(a){return a=a.replace(ba,ca),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ha(function(a){return V.test(a||"")||fa.error("unsupported lang: "+a),a=a.replace(ba,ca).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Y.test(a.nodeName)},input:function(a){return X.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:na(function(){return[0]}),last:na(function(a,b){return[b-1]}),eq:na(function(a,b,c){return[0>c?c+b:c]}),even:na(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:na(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:na(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:na(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=la(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=ma(b);function pa(){}pa.prototype=d.filters=d.pseudos,d.setFilters=new pa,g=fa.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=R.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=S.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(Q," ")}),h=h.slice(c.length));for(g in d.filter)!(e=W[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?fa.error(a):z(a,i).slice(0)};function qa(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function ra(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j,k=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(j=b[u]||(b[u]={}),i=j[b.uniqueID]||(j[b.uniqueID]={}),(h=i[d])&&h[0]===w&&h[1]===f)return k[2]=h[2];if(i[d]=k,k[2]=a(b,c,g))return!0}}}function sa(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function ta(a,b,c){for(var d=0,e=b.length;e>d;d++)fa(a,b[d],c);return c}function ua(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function va(a,b,c,d,e,f){return d&&!d[u]&&(d=va(d)),e&&!e[u]&&(e=va(e,f)),ha(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||ta(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:ua(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=ua(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=ua(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function wa(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ra(function(a){return a===b},h,!0),l=ra(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[ra(sa(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return va(i>1&&sa(m),i>1&&qa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(Q,"$1"),c,e>i&&wa(a.slice(i,e)),f>e&&wa(a=a.slice(e)),f>e&&qa(a))}m.push(c)}return sa(m)}function xa(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=F.call(i));u=ua(u)}H.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&fa.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ha(f):f}return h=fa.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=wa(b[c]),f[u]?d.push(f):e.push(f);f=A(a,xa(e,d)),f.selector=a}return f},i=fa.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(ba,ca),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=W.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(ba,ca),_.test(j[0].type)&&oa(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&qa(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,!b||_.test(a)&&oa(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ia(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ia(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ja("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ia(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ja("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ia(function(a){return null==a.getAttribute("disabled")})||ja(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),fa}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.uniqueSort=n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&n(a).is(c))break;d.push(a)}return d},v=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},w=n.expr.match.needsContext,x=/^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,y=/^.[^:#\[\.,]*$/;function z(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(y.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return n.inArray(a,b)>-1!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=[],d=this,e=d.length;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;e>b;b++)if(n.contains(d[b],this))return!0}));for(b=0;e>b;b++)n.find(a,d[b],c);return c=this.pushStack(e>1?n.unique(c):c),c.selector=this.selector?this.selector+" "+a:a,c},filter:function(a){return this.pushStack(z(this,a||[],!1))},not:function(a){return this.pushStack(z(this,a||[],!0))},is:function(a){return!!z(this,"string"==typeof a&&w.test(a)?n(a):a||[],!1).length}});var A,B=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,C=n.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||A,"string"==typeof a){if(e="<"===a.charAt(0)&&">"===a.charAt(a.length-1)&&a.length>=3?[null,a,null]:B.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),x.test(e[1])&&n.isPlainObject(b))for(e in b)n.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}if(f=d.getElementById(e[2]),f&&f.parentNode){if(f.id!==e[2])return A.find(a);this.length=1,this[0]=f}return this.context=d,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?"undefined"!=typeof c.ready?c.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};C.prototype=n.fn,A=n(d);var D=/^(?:parents|prev(?:Until|All))/,E={children:!0,contents:!0,next:!0,prev:!0};n.fn.extend({has:function(a){var b,c=n(a,this),d=c.length;return this.filter(function(){for(b=0;d>b;b++)if(n.contains(this,c[b]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=w.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?n.inArray(this[0],n(a)):n.inArray(a.jquery?a[0]:a,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.uniqueSort(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function F(a,b){do a=a[b];while(a&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return u(a,"parentNode")},parentsUntil:function(a,b,c){return u(a,"parentNode",c)},next:function(a){return F(a,"nextSibling")},prev:function(a){return F(a,"previousSibling")},nextAll:function(a){return u(a,"nextSibling")},prevAll:function(a){return u(a,"previousSibling")},nextUntil:function(a,b,c){return u(a,"nextSibling",c)},prevUntil:function(a,b,c){return u(a,"previousSibling",c)},siblings:function(a){return v((a.parentNode||{}).firstChild,a)},children:function(a){return v(a.firstChild)},contents:function(a){return n.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(E[a]||(e=n.uniqueSort(e)),D.test(a)&&(e=e.reverse())),this.pushStack(e)}});var G=/\S+/g;function H(a){var b={};return n.each(a.match(G)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?H(a):n.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){n.each(b,function(b,c){n.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==n.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return n.each(arguments,function(a,b){var c;while((c=n.inArray(b,f,c))>-1)f.splice(c,1),h>=c&&h--}),this},has:function(a){return a?n.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=!0,c||j.disable(),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().progress(c.notify).done(c.resolve).fail(c.reject):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=e.call(arguments),d=c.length,f=1!==d||a&&n.isFunction(a.promise)?d:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(d){b[a]=this,c[a]=arguments.length>1?e.call(arguments):d,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(d>1)for(i=new Array(d),j=new Array(d),k=new Array(d);d>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().progress(h(b,j,i)).done(h(b,k,c)).fail(g.reject):--f;return f||g.resolveWith(k,c),g.promise()}});var I;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){(a===!0?--n.readyWait:n.isReady)||(n.isReady=!0,a!==!0&&--n.readyWait>0||(I.resolveWith(d,[n]),n.fn.triggerHandler&&(n(d).triggerHandler("ready"),n(d).off("ready"))))}});function J(){d.addEventListener?(d.removeEventListener("DOMContentLoaded",K),a.removeEventListener("load",K)):(d.detachEvent("onreadystatechange",K),a.detachEvent("onload",K))}function K(){(d.addEventListener||"load"===a.event.type||"complete"===d.readyState)&&(J(),n.ready())}n.ready.promise=function(b){if(!I)if(I=n.Deferred(),"complete"===d.readyState)a.setTimeout(n.ready);else if(d.addEventListener)d.addEventListener("DOMContentLoaded",K),a.addEventListener("load",K);else{d.attachEvent("onreadystatechange",K),a.attachEvent("onload",K);var c=!1;try{c=null==a.frameElement&&d.documentElement}catch(e){}c&&c.doScroll&&!function f(){if(!n.isReady){try{c.doScroll("left")}catch(b){return a.setTimeout(f,50)}J(),n.ready()}}()}return I.promise(b)},n.ready.promise();var L;for(L in n(l))break;l.ownFirst="0"===L,l.inlineBlockNeedsLayout=!1,n(function(){var a,b,c,e;c=d.getElementsByTagName("body")[0],c&&c.style&&(b=d.createElement("div"),e=d.createElement("div"),e.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(e).appendChild(b),"undefined"!=typeof b.style.zoom&&(b.style.cssText="display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1",l.inlineBlockNeedsLayout=a=3===b.offsetWidth,a&&(c.style.zoom=1)),c.removeChild(e))}),function(){var a=d.createElement("div");l.deleteExpando=!0;try{delete a.test}catch(b){l.deleteExpando=!1}a=null}();var M=function(a){var b=n.noData[(a.nodeName+" ").toLowerCase()],c=+a.nodeType||1;return 1!==c&&9!==c?!1:!b||b!==!0&&a.getAttribute("classid")===b},N=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,O=/([A-Z])/g;function P(a,b,c){if(void 0===c&&1===a.nodeType){var d="data-"+b.replace(O,"-$1").toLowerCase();if(c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:N.test(c)?n.parseJSON(c):c}catch(e){}n.data(a,b,c)}else c=void 0}return c}function Q(a){var b;for(b in a)if(("data"!==b||!n.isEmptyObject(a[b]))&&"toJSON"!==b)return!1;
	return!0}function R(a,b,d,e){if(M(a)){var f,g,h=n.expando,i=a.nodeType,j=i?n.cache:a,k=i?a[h]:a[h]&&h;if(k&&j[k]&&(e||j[k].data)||void 0!==d||"string"!=typeof b)return k||(k=i?a[h]=c.pop()||n.guid++:h),j[k]||(j[k]=i?{}:{toJSON:n.noop}),("object"==typeof b||"function"==typeof b)&&(e?j[k]=n.extend(j[k],b):j[k].data=n.extend(j[k].data,b)),g=j[k],e||(g.data||(g.data={}),g=g.data),void 0!==d&&(g[n.camelCase(b)]=d),"string"==typeof b?(f=g[b],null==f&&(f=g[n.camelCase(b)])):f=g,f}}function S(a,b,c){if(M(a)){var d,e,f=a.nodeType,g=f?n.cache:a,h=f?a[n.expando]:n.expando;if(g[h]){if(b&&(d=c?g[h]:g[h].data)){n.isArray(b)?b=b.concat(n.map(b,n.camelCase)):b in d?b=[b]:(b=n.camelCase(b),b=b in d?[b]:b.split(" ")),e=b.length;while(e--)delete d[b[e]];if(c?!Q(d):!n.isEmptyObject(d))return}(c||(delete g[h].data,Q(g[h])))&&(f?n.cleanData([a],!0):l.deleteExpando||g!=g.window?delete g[h]:g[h]=void 0)}}}n.extend({cache:{},noData:{"applet ":!0,"embed ":!0,"object ":"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(a){return a=a.nodeType?n.cache[a[n.expando]]:a[n.expando],!!a&&!Q(a)},data:function(a,b,c){return R(a,b,c)},removeData:function(a,b){return S(a,b)},_data:function(a,b,c){return R(a,b,c,!0)},_removeData:function(a,b){return S(a,b,!0)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=n.data(f),1===f.nodeType&&!n._data(f,"parsedAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),P(f,d,e[d])));n._data(f,"parsedAttrs",!0)}return e}return"object"==typeof a?this.each(function(){n.data(this,a)}):arguments.length>1?this.each(function(){n.data(this,a,b)}):f?P(f,a,n.data(f,a)):void 0},removeData:function(a){return this.each(function(){n.removeData(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=n._data(a,b),c&&(!d||n.isArray(c)?d=n._data(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return n._data(a,c)||n._data(a,c,{empty:n.Callbacks("once memory").add(function(){n._removeData(a,b+"queue"),n._removeData(a,c)})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=n._data(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}}),function(){var a;l.shrinkWrapBlocks=function(){if(null!=a)return a;a=!1;var b,c,e;return c=d.getElementsByTagName("body")[0],c&&c.style?(b=d.createElement("div"),e=d.createElement("div"),e.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(e).appendChild(b),"undefined"!=typeof b.style.zoom&&(b.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",b.appendChild(d.createElement("div")).style.width="5px",a=3!==b.offsetWidth),c.removeChild(e),a):void 0}}();var T=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,U=new RegExp("^(?:([+-])=|)("+T+")([a-z%]*)$","i"),V=["Top","Right","Bottom","Left"],W=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)};function X(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return n.css(a,b,"")},i=h(),j=c&&c[3]||(n.cssNumber[b]?"":"px"),k=(n.cssNumber[b]||"px"!==j&&+i)&&U.exec(n.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,n.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var Y=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)Y(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},Z=/^(?:checkbox|radio)$/i,$=/<([\w:-]+)/,_=/^$|\/(?:java|ecma)script/i,aa=/^\s+/,ba="abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";function ca(a){var b=ba.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}!function(){var a=d.createElement("div"),b=d.createDocumentFragment(),c=d.createElement("input");a.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",l.leadingWhitespace=3===a.firstChild.nodeType,l.tbody=!a.getElementsByTagName("tbody").length,l.htmlSerialize=!!a.getElementsByTagName("link").length,l.html5Clone="<:nav></:nav>"!==d.createElement("nav").cloneNode(!0).outerHTML,c.type="checkbox",c.checked=!0,b.appendChild(c),l.appendChecked=c.checked,a.innerHTML="<textarea>x</textarea>",l.noCloneChecked=!!a.cloneNode(!0).lastChild.defaultValue,b.appendChild(a),c=d.createElement("input"),c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),a.appendChild(c),l.checkClone=a.cloneNode(!0).cloneNode(!0).lastChild.checked,l.noCloneEvent=!!a.addEventListener,a[n.expando]=1,l.attributes=!a.getAttribute(n.expando)}();var da={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:l.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]};da.optgroup=da.option,da.tbody=da.tfoot=da.colgroup=da.caption=da.thead,da.th=da.td;function ea(a,b){var c,d,e=0,f="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):void 0;if(!f)for(f=[],c=a.childNodes||a;null!=(d=c[e]);e++)!b||n.nodeName(d,b)?f.push(d):n.merge(f,ea(d,b));return void 0===b||b&&n.nodeName(a,b)?n.merge([a],f):f}function fa(a,b){for(var c,d=0;null!=(c=a[d]);d++)n._data(c,"globalEval",!b||n._data(b[d],"globalEval"))}var ga=/<|&#?\w+;/,ha=/<tbody/i;function ia(a){Z.test(a.type)&&(a.defaultChecked=a.checked)}function ja(a,b,c,d,e){for(var f,g,h,i,j,k,m,o=a.length,p=ca(b),q=[],r=0;o>r;r++)if(g=a[r],g||0===g)if("object"===n.type(g))n.merge(q,g.nodeType?[g]:g);else if(ga.test(g)){i=i||p.appendChild(b.createElement("div")),j=($.exec(g)||["",""])[1].toLowerCase(),m=da[j]||da._default,i.innerHTML=m[1]+n.htmlPrefilter(g)+m[2],f=m[0];while(f--)i=i.lastChild;if(!l.leadingWhitespace&&aa.test(g)&&q.push(b.createTextNode(aa.exec(g)[0])),!l.tbody){g="table"!==j||ha.test(g)?"<table>"!==m[1]||ha.test(g)?0:i:i.firstChild,f=g&&g.childNodes.length;while(f--)n.nodeName(k=g.childNodes[f],"tbody")&&!k.childNodes.length&&g.removeChild(k)}n.merge(q,i.childNodes),i.textContent="";while(i.firstChild)i.removeChild(i.firstChild);i=p.lastChild}else q.push(b.createTextNode(g));i&&p.removeChild(i),l.appendChecked||n.grep(ea(q,"input"),ia),r=0;while(g=q[r++])if(d&&n.inArray(g,d)>-1)e&&e.push(g);else if(h=n.contains(g.ownerDocument,g),i=ea(p.appendChild(g),"script"),h&&fa(i),c){f=0;while(g=i[f++])_.test(g.type||"")&&c.push(g)}return i=null,p}!function(){var b,c,e=d.createElement("div");for(b in{submit:!0,change:!0,focusin:!0})c="on"+b,(l[b]=c in a)||(e.setAttribute(c,"t"),l[b]=e.attributes[c].expando===!1);e=null}();var ka=/^(?:input|select|textarea)$/i,la=/^key/,ma=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,na=/^(?:focusinfocus|focusoutblur)$/,oa=/^([^.]*)(?:\.(.+)|)/;function pa(){return!0}function qa(){return!1}function ra(){try{return d.activeElement}catch(a){}}function sa(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)sa(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=qa;else if(!e)return a;return 1===f&&(g=e,e=function(a){return n().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=n.guid++)),a.each(function(){n.event.add(this,b,e,d,c)})}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=n._data(a);if(r){c.handler&&(i=c,c=i.handler,e=i.selector),c.guid||(c.guid=n.guid++),(g=r.events)||(g=r.events={}),(k=r.handle)||(k=r.handle=function(a){return"undefined"==typeof n||a&&n.event.triggered===a.type?void 0:n.event.dispatch.apply(k.elem,arguments)},k.elem=a),b=(b||"").match(G)||[""],h=b.length;while(h--)f=oa.exec(b[h])||[],o=q=f[1],p=(f[2]||"").split(".").sort(),o&&(j=n.event.special[o]||{},o=(e?j.delegateType:j.bindType)||o,j=n.event.special[o]||{},l=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},i),(m=g[o])||(m=g[o]=[],m.delegateCount=0,j.setup&&j.setup.call(a,d,p,k)!==!1||(a.addEventListener?a.addEventListener(o,k,!1):a.attachEvent&&a.attachEvent("on"+o,k))),j.add&&(j.add.call(a,l),l.handler.guid||(l.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,l):m.push(l),n.event.global[o]=!0);a=null}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=n.hasData(a)&&n._data(a);if(r&&(k=r.events)){b=(b||"").match(G)||[""],j=b.length;while(j--)if(h=oa.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=k[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),i=f=m.length;while(f--)g=m[f],!e&&q!==g.origType||c&&c.guid!==g.guid||h&&!h.test(g.namespace)||d&&d!==g.selector&&("**"!==d||!g.selector)||(m.splice(f,1),g.selector&&m.delegateCount--,l.remove&&l.remove.call(a,g));i&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete k[o])}else for(o in k)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(k)&&(delete r.handle,n._removeData(a,"events"))}},trigger:function(b,c,e,f){var g,h,i,j,l,m,o,p=[e||d],q=k.call(b,"type")?b.type:b,r=k.call(b,"namespace")?b.namespace.split("."):[];if(i=m=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!na.test(q+n.event.triggered)&&(q.indexOf(".")>-1&&(r=q.split("."),q=r.shift(),r.sort()),h=q.indexOf(":")<0&&"on"+q,b=b[n.expando]?b:new n.Event(q,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=r.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:n.makeArray(c,[b]),l=n.event.special[q]||{},f||!l.trigger||l.trigger.apply(e,c)!==!1)){if(!f&&!l.noBubble&&!n.isWindow(e)){for(j=l.delegateType||q,na.test(j+q)||(i=i.parentNode);i;i=i.parentNode)p.push(i),m=i;m===(e.ownerDocument||d)&&p.push(m.defaultView||m.parentWindow||a)}o=0;while((i=p[o++])&&!b.isPropagationStopped())b.type=o>1?j:l.bindType||q,g=(n._data(i,"events")||{})[b.type]&&n._data(i,"handle"),g&&g.apply(i,c),g=h&&i[h],g&&g.apply&&M(i)&&(b.result=g.apply(i,c),b.result===!1&&b.preventDefault());if(b.type=q,!f&&!b.isDefaultPrevented()&&(!l._default||l._default.apply(p.pop(),c)===!1)&&M(e)&&h&&e[q]&&!n.isWindow(e)){m=e[h],m&&(e[h]=null),n.event.triggered=q;try{e[q]()}catch(s){}n.event.triggered=void 0,m&&(e[h]=m)}return b.result}},dispatch:function(a){a=n.event.fix(a);var b,c,d,f,g,h=[],i=e.call(arguments),j=(n._data(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,c=0;while((g=f.handlers[c++])&&!a.isImmediatePropagationStopped())(!a.rnamespace||a.rnamespace.test(g.namespace))&&(a.handleObj=g,a.data=g.data,d=((n.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==d&&(a.result=d)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&("click"!==a.type||isNaN(a.button)||a.button<1))for(;i!=this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||"click"!==a.type)){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?n(e,this).index(i)>-1:n.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},fix:function(a){if(a[n.expando])return a;var b,c,e,f=a.type,g=a,h=this.fixHooks[f];h||(this.fixHooks[f]=h=ma.test(f)?this.mouseHooks:la.test(f)?this.keyHooks:{}),e=h.props?this.props.concat(h.props):this.props,a=new n.Event(g),b=e.length;while(b--)c=e[b],a[c]=g[c];return a.target||(a.target=g.srcElement||d),3===a.target.nodeType&&(a.target=a.target.parentNode),a.metaKey=!!a.metaKey,h.filter?h.filter(a,g):a},props:"altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,e,f,g=b.button,h=b.fromElement;return null==a.pageX&&null!=b.clientX&&(e=a.target.ownerDocument||d,f=e.documentElement,c=e.body,a.pageX=b.clientX+(f&&f.scrollLeft||c&&c.scrollLeft||0)-(f&&f.clientLeft||c&&c.clientLeft||0),a.pageY=b.clientY+(f&&f.scrollTop||c&&c.scrollTop||0)-(f&&f.clientTop||c&&c.clientTop||0)),!a.relatedTarget&&h&&(a.relatedTarget=h===a.target?b.toElement:h),a.which||void 0===g||(a.which=1&g?1:2&g?3:4&g?2:0),a}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==ra()&&this.focus)try{return this.focus(),!1}catch(a){}},delegateType:"focusin"},blur:{trigger:function(){return this===ra()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return n.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c){var d=n.extend(new n.Event,c,{type:a,isSimulated:!0});n.event.trigger(d,null,b),d.isDefaultPrevented()&&c.preventDefault()}},n.removeEvent=d.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)}:function(a,b,c){var d="on"+b;a.detachEvent&&("undefined"==typeof a[d]&&(a[d]=null),a.detachEvent(d,c))},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?pa:qa):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={constructor:n.Event,isDefaultPrevented:qa,isPropagationStopped:qa,isImmediatePropagationStopped:qa,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=pa,a&&(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=pa,a&&!this.isSimulated&&(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=pa,a&&a.stopImmediatePropagation&&a.stopImmediatePropagation(),this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!n.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),l.submit||(n.event.special.submit={setup:function(){return n.nodeName(this,"form")?!1:void n.event.add(this,"click._submit keypress._submit",function(a){var b=a.target,c=n.nodeName(b,"input")||n.nodeName(b,"button")?n.prop(b,"form"):void 0;c&&!n._data(c,"submit")&&(n.event.add(c,"submit._submit",function(a){a._submitBubble=!0}),n._data(c,"submit",!0))})},postDispatch:function(a){a._submitBubble&&(delete a._submitBubble,this.parentNode&&!a.isTrigger&&n.event.simulate("submit",this.parentNode,a))},teardown:function(){return n.nodeName(this,"form")?!1:void n.event.remove(this,"._submit")}}),l.change||(n.event.special.change={setup:function(){return ka.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(n.event.add(this,"propertychange._change",function(a){"checked"===a.originalEvent.propertyName&&(this._justChanged=!0)}),n.event.add(this,"click._change",function(a){this._justChanged&&!a.isTrigger&&(this._justChanged=!1),n.event.simulate("change",this,a)})),!1):void n.event.add(this,"beforeactivate._change",function(a){var b=a.target;ka.test(b.nodeName)&&!n._data(b,"change")&&(n.event.add(b,"change._change",function(a){!this.parentNode||a.isSimulated||a.isTrigger||n.event.simulate("change",this.parentNode,a)}),n._data(b,"change",!0))})},handle:function(a){var b=a.target;return this!==b||a.isSimulated||a.isTrigger||"radio"!==b.type&&"checkbox"!==b.type?a.handleObj.handler.apply(this,arguments):void 0},teardown:function(){return n.event.remove(this,"._change"),!ka.test(this.nodeName)}}),l.focusin||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a))};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=n._data(d,b);e||d.addEventListener(a,c,!0),n._data(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=n._data(d,b)-1;e?n._data(d,b,e):(d.removeEventListener(a,c,!0),n._removeData(d,b))}}}),n.fn.extend({on:function(a,b,c,d){return sa(this,a,b,c,d)},one:function(a,b,c,d){return sa(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=qa),this.each(function(){n.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}});var ta=/ jQuery\d+="(?:null|\d+)"/g,ua=new RegExp("<(?:"+ba+")[\\s/>]","i"),va=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,wa=/<script|<style|<link/i,xa=/checked\s*(?:[^=]|=\s*.checked.)/i,ya=/^true\/(.*)/,za=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,Aa=ca(d),Ba=Aa.appendChild(d.createElement("div"));function Ca(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function Da(a){return a.type=(null!==n.find.attr(a,"type"))+"/"+a.type,a}function Ea(a){var b=ya.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function Fa(a,b){if(1===b.nodeType&&n.hasData(a)){var c,d,e,f=n._data(a),g=n._data(b,f),h=f.events;if(h){delete g.handle,g.events={};for(c in h)for(d=0,e=h[c].length;e>d;d++)n.event.add(b,c,h[c][d])}g.data&&(g.data=n.extend({},g.data))}}function Ga(a,b){var c,d,e;if(1===b.nodeType){if(c=b.nodeName.toLowerCase(),!l.noCloneEvent&&b[n.expando]){e=n._data(b);for(d in e.events)n.removeEvent(b,d,e.handle);b.removeAttribute(n.expando)}"script"===c&&b.text!==a.text?(Da(b).text=a.text,Ea(b)):"object"===c?(b.parentNode&&(b.outerHTML=a.outerHTML),l.html5Clone&&a.innerHTML&&!n.trim(b.innerHTML)&&(b.innerHTML=a.innerHTML)):"input"===c&&Z.test(a.type)?(b.defaultChecked=b.checked=a.checked,b.value!==a.value&&(b.value=a.value)):"option"===c?b.defaultSelected=b.selected=a.defaultSelected:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}}function Ha(a,b,c,d){b=f.apply([],b);var e,g,h,i,j,k,m=0,o=a.length,p=o-1,q=b[0],r=n.isFunction(q);if(r||o>1&&"string"==typeof q&&!l.checkClone&&xa.test(q))return a.each(function(e){var f=a.eq(e);r&&(b[0]=q.call(this,e,f.html())),Ha(f,b,c,d)});if(o&&(k=ja(b,a[0].ownerDocument,!1,a,d),e=k.firstChild,1===k.childNodes.length&&(k=e),e||d)){for(i=n.map(ea(k,"script"),Da),h=i.length;o>m;m++)g=k,m!==p&&(g=n.clone(g,!0,!0),h&&n.merge(i,ea(g,"script"))),c.call(a[m],g,m);if(h)for(j=i[i.length-1].ownerDocument,n.map(i,Ea),m=0;h>m;m++)g=i[m],_.test(g.type||"")&&!n._data(g,"globalEval")&&n.contains(j,g)&&(g.src?n._evalUrl&&n._evalUrl(g.src):n.globalEval((g.text||g.textContent||g.innerHTML||"").replace(za,"")));k=e=null}return a}function Ia(a,b,c){for(var d,e=b?n.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||n.cleanData(ea(d)),d.parentNode&&(c&&n.contains(d.ownerDocument,d)&&fa(ea(d,"script")),d.parentNode.removeChild(d));return a}n.extend({htmlPrefilter:function(a){return a.replace(va,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h,i=n.contains(a.ownerDocument,a);if(l.html5Clone||n.isXMLDoc(a)||!ua.test("<"+a.nodeName+">")?f=a.cloneNode(!0):(Ba.innerHTML=a.outerHTML,Ba.removeChild(f=Ba.firstChild)),!(l.noCloneEvent&&l.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(d=ea(f),h=ea(a),g=0;null!=(e=h[g]);++g)d[g]&&Ga(e,d[g]);if(b)if(c)for(h=h||ea(a),d=d||ea(f),g=0;null!=(e=h[g]);g++)Fa(e,d[g]);else Fa(a,f);return d=ea(f,"script"),d.length>0&&fa(d,!i&&ea(a,"script")),d=h=e=null,f},cleanData:function(a,b){for(var d,e,f,g,h=0,i=n.expando,j=n.cache,k=l.attributes,m=n.event.special;null!=(d=a[h]);h++)if((b||M(d))&&(f=d[i],g=f&&j[f])){if(g.events)for(e in g.events)m[e]?n.event.remove(d,e):n.removeEvent(d,e,g.handle);j[f]&&(delete j[f],k||"undefined"==typeof d.removeAttribute?d[i]=void 0:d.removeAttribute(i),c.push(f))}}}),n.fn.extend({domManip:Ha,detach:function(a){return Ia(this,a,!0)},remove:function(a){return Ia(this,a)},text:function(a){return Y(this,function(a){return void 0===a?n.text(this):this.empty().append((this[0]&&this[0].ownerDocument||d).createTextNode(a))},null,a,arguments.length)},append:function(){return Ha(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ca(this,a);b.appendChild(a)}})},prepend:function(){return Ha(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ca(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return Ha(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return Ha(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++){1===a.nodeType&&n.cleanData(ea(a,!1));while(a.firstChild)a.removeChild(a.firstChild);a.options&&n.nodeName(a,"select")&&(a.options.length=0)}return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return Y(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a)return 1===b.nodeType?b.innerHTML.replace(ta,""):void 0;if("string"==typeof a&&!wa.test(a)&&(l.htmlSerialize||!ua.test(a))&&(l.leadingWhitespace||!aa.test(a))&&!da[($.exec(a)||["",""])[1].toLowerCase()]){a=n.htmlPrefilter(a);try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(ea(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return Ha(this,arguments,function(b){var c=this.parentNode;n.inArray(this,a)<0&&(n.cleanData(ea(this)),c&&c.replaceChild(b,this))},a)}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=0,e=[],f=n(a),h=f.length-1;h>=d;d++)c=d===h?this:this.clone(!0),n(f[d])[b](c),g.apply(e,c.get());return this.pushStack(e)}});var Ja,Ka={HTML:"block",BODY:"block"};function La(a,b){var c=n(b.createElement(a)).appendTo(b.body),d=n.css(c[0],"display");return c.detach(),d}function Ma(a){var b=d,c=Ka[a];return c||(c=La(a,b),"none"!==c&&c||(Ja=(Ja||n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=(Ja[0].contentWindow||Ja[0].contentDocument).document,b.write(),b.close(),c=La(a,b),Ja.detach()),Ka[a]=c),c}var Na=/^margin/,Oa=new RegExp("^("+T+")(?!px)[a-z%]+$","i"),Pa=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e},Qa=d.documentElement;!function(){var b,c,e,f,g,h,i=d.createElement("div"),j=d.createElement("div");if(j.style){j.style.cssText="float:left;opacity:.5",l.opacity="0.5"===j.style.opacity,l.cssFloat=!!j.style.cssFloat,j.style.backgroundClip="content-box",j.cloneNode(!0).style.backgroundClip="",l.clearCloneStyle="content-box"===j.style.backgroundClip,i=d.createElement("div"),i.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",j.innerHTML="",i.appendChild(j),l.boxSizing=""===j.style.boxSizing||""===j.style.MozBoxSizing||""===j.style.WebkitBoxSizing,n.extend(l,{reliableHiddenOffsets:function(){return null==b&&k(),f},boxSizingReliable:function(){return null==b&&k(),e},pixelMarginRight:function(){return null==b&&k(),c},pixelPosition:function(){return null==b&&k(),b},reliableMarginRight:function(){return null==b&&k(),g},reliableMarginLeft:function(){return null==b&&k(),h}});function k(){var k,l,m=d.documentElement;m.appendChild(i),j.style.cssText="-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",b=e=h=!1,c=g=!0,a.getComputedStyle&&(l=a.getComputedStyle(j),b="1%"!==(l||{}).top,h="2px"===(l||{}).marginLeft,e="4px"===(l||{width:"4px"}).width,j.style.marginRight="50%",c="4px"===(l||{marginRight:"4px"}).marginRight,k=j.appendChild(d.createElement("div")),k.style.cssText=j.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",k.style.marginRight=k.style.width="0",j.style.width="1px",g=!parseFloat((a.getComputedStyle(k)||{}).marginRight),j.removeChild(k)),j.style.display="none",f=0===j.getClientRects().length,f&&(j.style.display="",j.innerHTML="<table><tr><td></td><td>t</td></tr></table>",k=j.getElementsByTagName("td"),k[0].style.cssText="margin:0;border:0;padding:0;display:none",f=0===k[0].offsetHeight,f&&(k[0].style.display="",k[1].style.display="none",f=0===k[0].offsetHeight)),m.removeChild(i)}}}();var Ra,Sa,Ta=/^(top|right|bottom|left)$/;a.getComputedStyle?(Ra=function(b){var c=b.ownerDocument.defaultView;return c.opener||(c=a),c.getComputedStyle(b)},Sa=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Ra(a),g=c?c.getPropertyValue(b)||c[b]:void 0,c&&(""!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),!l.pixelMarginRight()&&Oa.test(g)&&Na.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0===g?g:g+""}):Qa.currentStyle&&(Ra=function(a){return a.currentStyle},Sa=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Ra(a),g=c?c[b]:void 0,null==g&&h&&h[b]&&(g=h[b]),Oa.test(g)&&!Ta.test(b)&&(d=h.left,e=a.runtimeStyle,f=e&&e.left,f&&(e.left=a.currentStyle.left),h.left="fontSize"===b?"1em":g,g=h.pixelLeft+"px",h.left=d,f&&(e.left=f)),void 0===g?g:g+""||"auto"});function Ua(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Va=/alpha\([^)]*\)/i,Wa=/opacity\s*=\s*([^)]*)/i,Xa=/^(none|table(?!-c[ea]).+)/,Ya=new RegExp("^("+T+")(.*)$","i"),Za={position:"absolute",visibility:"hidden",display:"block"},$a={letterSpacing:"0",fontWeight:"400"},_a=["Webkit","O","Moz","ms"],ab=d.createElement("div").style;function bb(a){if(a in ab)return a;var b=a.charAt(0).toUpperCase()+a.slice(1),c=_a.length;while(c--)if(a=_a[c]+b,a in ab)return a}function cb(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=n._data(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&W(d)&&(f[g]=n._data(d,"olddisplay",Ma(d.nodeName)))):(e=W(d),(c&&"none"!==c||!e)&&n._data(d,"olddisplay",e?c:n.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}function db(a,b,c){var d=Ya.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function eb(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=n.css(a,c+V[f],!0,e)),d?("content"===c&&(g-=n.css(a,"padding"+V[f],!0,e)),"margin"!==c&&(g-=n.css(a,"border"+V[f]+"Width",!0,e))):(g+=n.css(a,"padding"+V[f],!0,e),"padding"!==c&&(g+=n.css(a,"border"+V[f]+"Width",!0,e)));return g}function fb(b,c,e){var f=!0,g="width"===c?b.offsetWidth:b.offsetHeight,h=Ra(b),i=l.boxSizing&&"border-box"===n.css(b,"boxSizing",!1,h);if(d.msFullscreenElement&&a.top!==a&&b.getClientRects().length&&(g=Math.round(100*b.getBoundingClientRect()[c])),0>=g||null==g){if(g=Sa(b,c,h),(0>g||null==g)&&(g=b.style[c]),Oa.test(g))return g;f=i&&(l.boxSizingReliable()||g===b.style[c]),g=parseFloat(g)||0}return g+eb(b,c,e||(i?"border":"content"),f,h)+"px"}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Sa(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":l.cssFloat?"cssFloat":"styleFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;if(b=n.cssProps[h]||(n.cssProps[h]=bb(h)||h),g=n.cssHooks[b]||n.cssHooks[h],void 0===c)return g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b];if(f=typeof c,"string"===f&&(e=U.exec(c))&&e[1]&&(c=X(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(n.cssNumber[h]?"":"px")),l.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),!(g&&"set"in g&&void 0===(c=g.set(a,c,d)))))try{i[b]=c}catch(j){}}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=bb(h)||h),g=n.cssHooks[b]||n.cssHooks[h],g&&"get"in g&&(f=g.get(a,!0,c)),void 0===f&&(f=Sa(a,b,d)),"normal"===f&&b in $a&&(f=$a[b]),""===c||c?(e=parseFloat(f),c===!0||isFinite(e)?e||0:f):f}}),n.each(["height","width"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?Xa.test(n.css(a,"display"))&&0===a.offsetWidth?Pa(a,Za,function(){return fb(a,b,d)}):fb(a,b,d):void 0},set:function(a,c,d){var e=d&&Ra(a);return db(a,c,d?eb(a,b,d,l.boxSizing&&"border-box"===n.css(a,"boxSizing",!1,e),e):0)}}}),l.opacity||(n.cssHooks.opacity={get:function(a,b){return Wa.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=n.isNumeric(b)?"alpha(opacity="+100*b+")":"",f=d&&d.filter||c.filter||"";c.zoom=1,(b>=1||""===b)&&""===n.trim(f.replace(Va,""))&&c.removeAttribute&&(c.removeAttribute("filter"),""===b||d&&!d.filter)||(c.filter=Va.test(f)?f.replace(Va,e):f+" "+e)}}),n.cssHooks.marginRight=Ua(l.reliableMarginRight,function(a,b){return b?Pa(a,{display:"inline-block"},Sa,[a,"marginRight"]):void 0}),n.cssHooks.marginLeft=Ua(l.reliableMarginLeft,function(a,b){return b?(parseFloat(Sa(a,"marginLeft"))||(n.contains(a.ownerDocument,a)?a.getBoundingClientRect().left-Pa(a,{
	marginLeft:0},function(){return a.getBoundingClientRect().left}):0))+"px":void 0}),n.each({margin:"",padding:"",border:"Width"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+V[d]+b]=f[d]||f[d-2]||f[0];return e}},Na.test(a)||(n.cssHooks[a+b].set=db)}),n.fn.extend({css:function(a,b){return Y(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=Ra(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)},a,b,arguments.length>1)},show:function(){return cb(this,!0)},hide:function(){return cb(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){W(this)?n(this).show():n(this).hide()})}});function gb(a,b,c,d,e){return new gb.prototype.init(a,b,c,d,e)}n.Tween=gb,gb.prototype={constructor:gb,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||n.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?"":"px")},cur:function(){var a=gb.propHooks[this.prop];return a&&a.get?a.get(this):gb.propHooks._default.get(this)},run:function(a){var b,c=gb.propHooks[this.prop];return this.options.duration?this.pos=b=n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):gb.propHooks._default.set(this),this}},gb.prototype.init.prototype=gb.prototype,gb.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=n.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[n.cssProps[a.prop]]&&!n.cssHooks[a.prop]?a.elem[a.prop]=a.now:n.style(a.elem,a.prop,a.now+a.unit)}}},gb.propHooks.scrollTop=gb.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},n.fx=gb.prototype.init,n.fx.step={};var hb,ib,jb=/^(?:toggle|show|hide)$/,kb=/queueHooks$/;function lb(){return a.setTimeout(function(){hb=void 0}),hb=n.now()}function mb(a,b){var c,d={height:a},e=0;for(b=b?1:0;4>e;e+=2-b)c=V[e],d["margin"+c]=d["padding"+c]=a;return b&&(d.opacity=d.width=a),d}function nb(a,b,c){for(var d,e=(qb.tweeners[b]||[]).concat(qb.tweeners["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function ob(a,b,c){var d,e,f,g,h,i,j,k,m=this,o={},p=a.style,q=a.nodeType&&W(a),r=n._data(a,"fxshow");c.queue||(h=n._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,m.always(function(){m.always(function(){h.unqueued--,n.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[p.overflow,p.overflowX,p.overflowY],j=n.css(a,"display"),k="none"===j?n._data(a,"olddisplay")||Ma(a.nodeName):j,"inline"===k&&"none"===n.css(a,"float")&&(l.inlineBlockNeedsLayout&&"inline"!==Ma(a.nodeName)?p.zoom=1:p.display="inline-block")),c.overflow&&(p.overflow="hidden",l.shrinkWrapBlocks()||m.always(function(){p.overflow=c.overflow[0],p.overflowX=c.overflow[1],p.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],jb.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(q?"hide":"show")){if("show"!==e||!r||void 0===r[d])continue;q=!0}o[d]=r&&r[d]||n.style(a,d)}else j=void 0;if(n.isEmptyObject(o))"inline"===("none"===j?Ma(a.nodeName):j)&&(p.display=j);else{r?"hidden"in r&&(q=r.hidden):r=n._data(a,"fxshow",{}),f&&(r.hidden=!q),q?n(a).show():m.done(function(){n(a).hide()}),m.done(function(){var b;n._removeData(a,"fxshow");for(b in o)n.style(a,b,o[b])});for(d in o)g=nb(q?r[d]:0,d,m),d in r||(r[d]=g.start,q&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function pb(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function qb(a,b,c){var d,e,f=0,g=qb.prefilters.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=hb||lb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{},easing:n.easing._default},c),originalProperties:b,originalOptions:c,startTime:hb||lb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for(pb(k,j.opts.specialEasing);g>f;f++)if(d=qb.prefilters[f].call(j,a,k,j.opts))return n.isFunction(d.stop)&&(n._queueHooks(j.elem,j.opts.queue).stop=n.proxy(d.stop,d)),d;return n.map(k,nb,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(qb,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return X(c.elem,a,U.exec(b),c),c}]},tweener:function(a,b){n.isFunction(a)?(b=a,a=["*"]):a=a.match(G);for(var c,d=0,e=a.length;e>d;d++)c=a[d],qb.tweeners[c]=qb.tweeners[c]||[],qb.tweeners[c].unshift(b)},prefilters:[ob],prefilter:function(a,b){b?qb.prefilters.unshift(a):qb.prefilters.push(a)}}),n.speed=function(a,b,c){var d=a&&"object"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(W).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=qb(this,n.extend({},a),f);(e||n._data(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=n.timers,g=n._data(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&kb.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=n._data(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each(["toggle","show","hide"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(mb(b,!0),a,d,e)}}),n.each({slideDown:mb("show"),slideUp:mb("hide"),slideToggle:mb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=n.timers,c=0;for(hb=n.now();c<b.length;c++)a=b[c],a()||b[c]!==a||b.splice(c--,1);b.length||n.fx.stop(),hb=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){ib||(ib=a.setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){a.clearInterval(ib),ib=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(b,c){return b=n.fx?n.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a,b=d.createElement("input"),c=d.createElement("div"),e=d.createElement("select"),f=e.appendChild(d.createElement("option"));c=d.createElement("div"),c.setAttribute("className","t"),c.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",a=c.getElementsByTagName("a")[0],b.setAttribute("type","checkbox"),c.appendChild(b),a=c.getElementsByTagName("a")[0],a.style.cssText="top:1px",l.getSetAttribute="t"!==c.className,l.style=/top/.test(a.getAttribute("style")),l.hrefNormalized="/a"===a.getAttribute("href"),l.checkOn=!!b.value,l.optSelected=f.selected,l.enctype=!!d.createElement("form").enctype,e.disabled=!0,l.optDisabled=!f.disabled,b=d.createElement("input"),b.setAttribute("value",""),l.input=""===b.getAttribute("value"),b.value="t",b.setAttribute("type","radio"),l.radioValue="t"===b.value}();var rb=/\r/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(rb,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){var b=n.find.attr(a,"value");return null!=b?b:n.trim(n.text(a))}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],(c.selected||i===e)&&(l.optDisabled?!c.disabled:null===c.getAttribute("disabled"))&&(!c.parentNode.disabled||!n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)if(d=e[g],n.inArray(n.valHooks.option.get(d),f)>=0)try{d.selected=c=!0}catch(h){d.scrollHeight}else d.selected=!1;return c||(a.selectedIndex=-1),e}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>-1:void 0}},l.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var sb,tb,ub=n.expr.attrHandle,vb=/^(?:checked|selected)$/i,wb=l.getSetAttribute,xb=l.input;n.fn.extend({attr:function(a,b){return Y(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),e=n.attrHooks[b]||(n.expr.match.bool.test(b)?tb:sb)),void 0!==c?null===c?void n.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=n.find.attr(a,b),null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!l.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(G);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)?xb&&wb||!vb.test(c)?a[d]=!1:a[n.camelCase("default-"+c)]=a[d]=!1:n.attr(a,c,""),a.removeAttribute(wb?c:d)}}),tb={set:function(a,b,c){return b===!1?n.removeAttr(a,c):xb&&wb||!vb.test(c)?a.setAttribute(!wb&&n.propFix[c]||c,c):a[n.camelCase("default-"+c)]=a[c]=!0,c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=ub[b]||n.find.attr;xb&&wb||!vb.test(b)?ub[b]=function(a,b,d){var e,f;return d||(f=ub[b],ub[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,ub[b]=f),e}:ub[b]=function(a,b,c){return c?void 0:a[n.camelCase("default-"+b)]?b.toLowerCase():null}}),xb&&wb||(n.attrHooks.value={set:function(a,b,c){return n.nodeName(a,"input")?void(a.defaultValue=b):sb&&sb.set(a,b,c)}}),wb||(sb={set:function(a,b,c){var d=a.getAttributeNode(c);return d||a.setAttributeNode(d=a.ownerDocument.createAttribute(c)),d.value=b+="","value"===c||b===a.getAttribute(c)?b:void 0}},ub.id=ub.name=ub.coords=function(a,b,c){var d;return c?void 0:(d=a.getAttributeNode(b))&&""!==d.value?d.value:null},n.valHooks.button={get:function(a,b){var c=a.getAttributeNode(b);return c&&c.specified?c.value:void 0},set:sb.set},n.attrHooks.contenteditable={set:function(a,b,c){sb.set(a,""===b?!1:b,c)}},n.each(["width","height"],function(a,b){n.attrHooks[b]={set:function(a,c){return""===c?(a.setAttribute(b,"auto"),c):void 0}}})),l.style||(n.attrHooks.style={get:function(a){return a.style.cssText||void 0},set:function(a,b){return a.style.cssText=b+""}});var yb=/^(?:input|select|textarea|button|object)$/i,zb=/^(?:a|area)$/i;n.fn.extend({prop:function(a,b){return Y(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return a=n.propFix[a]||a,this.each(function(){try{this[a]=void 0,delete this[a]}catch(b){}})}}),n.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&n.isXMLDoc(a)||(b=n.propFix[b]||b,e=n.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=n.find.attr(a,"tabindex");return b?parseInt(b,10):yb.test(a.nodeName)||zb.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),l.hrefNormalized||n.each(["href","src"],function(a,b){n.propHooks[b]={get:function(a){return a.getAttribute(b,4)}}}),l.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex),null}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this}),l.enctype||(n.propFix.enctype="encoding");var Ab=/[\t\r\n\f]/g;function Bb(a){return n.attr(a,"class")||""}n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,Bb(this)))});if("string"==typeof a&&a){b=a.match(G)||[];while(c=this[i++])if(e=Bb(c),d=1===c.nodeType&&(" "+e+" ").replace(Ab," ")){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=n.trim(d),e!==h&&n.attr(c,"class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,Bb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(G)||[];while(c=this[i++])if(e=Bb(c),d=1===c.nodeType&&(" "+e+" ").replace(Ab," ")){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=n.trim(d),e!==h&&n.attr(c,"class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):n.isFunction(a)?this.each(function(c){n(this).toggleClass(a.call(this,c,Bb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=n(this),f=a.match(G)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(void 0===a||"boolean"===c)&&(b=Bb(this),b&&n._data(this,"__className__",b),n.attr(this,"class",b||a===!1?"":n._data(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+Bb(c)+" ").replace(Ab," ").indexOf(b)>-1)return!0;return!1}}),n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}});var Cb=a.location,Db=n.now(),Eb=/\?/,Fb=/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;n.parseJSON=function(b){if(a.JSON&&a.JSON.parse)return a.JSON.parse(b+"");var c,d=null,e=n.trim(b+"");return e&&!n.trim(e.replace(Fb,function(a,b,e,f){return c&&b&&(d=0),0===d?a:(c=e||b,d+=!f-!e,"")}))?Function("return "+e)():n.error("Invalid JSON: "+b)},n.parseXML=function(b){var c,d;if(!b||"string"!=typeof b)return null;try{a.DOMParser?(d=new a.DOMParser,c=d.parseFromString(b,"text/xml")):(c=new a.ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(b))}catch(e){c=void 0}return c&&c.documentElement&&!c.getElementsByTagName("parsererror").length||n.error("Invalid XML: "+b),c};var Gb=/#.*$/,Hb=/([?&])_=[^&]*/,Ib=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Jb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Kb=/^(?:GET|HEAD)$/,Lb=/^\/\//,Mb=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,Nb={},Ob={},Pb="*/".concat("*"),Qb=Cb.href,Rb=Mb.exec(Qb.toLowerCase())||[];function Sb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(G)||[];if(n.isFunction(c))while(d=f[e++])"+"===d.charAt(0)?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Tb(a,b,c,d){var e={},f=a===Ob;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Ub(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(d in b)void 0!==b[d]&&((e[d]?a:c||(c={}))[d]=b[d]);return c&&n.extend(!0,a,c),a}function Vb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===e&&(e=a.mimeType||b.getResponseHeader("Content-Type"));if(e)for(g in h)if(h[g]&&h[g].test(e)){i.unshift(g);break}if(i[0]in c)f=i[0];else{for(g in c){if(!i[0]||a.converters[g+" "+i[0]]){f=g;break}d||(d=g)}f=f||d}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function Wb(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Qb,type:"GET",isLocal:Jb.test(Rb[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Pb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Ub(Ub(a,n.ajaxSettings),b):Ub(n.ajaxSettings,a)},ajaxPrefilter:Sb(Nb),ajaxTransport:Sb(Ob),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var d,e,f,g,h,i,j,k,l=n.ajaxSetup({},c),m=l.context||l,o=l.context&&(m.nodeType||m.jquery)?n(m):n.event,p=n.Deferred(),q=n.Callbacks("once memory"),r=l.statusCode||{},s={},t={},u=0,v="canceled",w={readyState:0,getResponseHeader:function(a){var b;if(2===u){if(!k){k={};while(b=Ib.exec(g))k[b[1].toLowerCase()]=b[2]}b=k[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===u?g:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return u||(a=t[c]=t[c]||a,s[a]=b),this},overrideMimeType:function(a){return u||(l.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>u)for(b in a)r[b]=[r[b],a[b]];else w.always(a[w.status]);return this},abort:function(a){var b=a||v;return j&&j.abort(b),y(0,b),this}};if(p.promise(w).complete=q.add,w.success=w.done,w.error=w.fail,l.url=((b||l.url||Qb)+"").replace(Gb,"").replace(Lb,Rb[1]+"//"),l.type=c.method||c.type||l.method||l.type,l.dataTypes=n.trim(l.dataType||"*").toLowerCase().match(G)||[""],null==l.crossDomain&&(d=Mb.exec(l.url.toLowerCase()),l.crossDomain=!(!d||d[1]===Rb[1]&&d[2]===Rb[2]&&(d[3]||("http:"===d[1]?"80":"443"))===(Rb[3]||("http:"===Rb[1]?"80":"443")))),l.data&&l.processData&&"string"!=typeof l.data&&(l.data=n.param(l.data,l.traditional)),Tb(Nb,l,c,w),2===u)return w;i=n.event&&l.global,i&&0===n.active++&&n.event.trigger("ajaxStart"),l.type=l.type.toUpperCase(),l.hasContent=!Kb.test(l.type),f=l.url,l.hasContent||(l.data&&(f=l.url+=(Eb.test(f)?"&":"?")+l.data,delete l.data),l.cache===!1&&(l.url=Hb.test(f)?f.replace(Hb,"$1_="+Db++):f+(Eb.test(f)?"&":"?")+"_="+Db++)),l.ifModified&&(n.lastModified[f]&&w.setRequestHeader("If-Modified-Since",n.lastModified[f]),n.etag[f]&&w.setRequestHeader("If-None-Match",n.etag[f])),(l.data&&l.hasContent&&l.contentType!==!1||c.contentType)&&w.setRequestHeader("Content-Type",l.contentType),w.setRequestHeader("Accept",l.dataTypes[0]&&l.accepts[l.dataTypes[0]]?l.accepts[l.dataTypes[0]]+("*"!==l.dataTypes[0]?", "+Pb+"; q=0.01":""):l.accepts["*"]);for(e in l.headers)w.setRequestHeader(e,l.headers[e]);if(l.beforeSend&&(l.beforeSend.call(m,w,l)===!1||2===u))return w.abort();v="abort";for(e in{success:1,error:1,complete:1})w[e](l[e]);if(j=Tb(Ob,l,c,w)){if(w.readyState=1,i&&o.trigger("ajaxSend",[w,l]),2===u)return w;l.async&&l.timeout>0&&(h=a.setTimeout(function(){w.abort("timeout")},l.timeout));try{u=1,j.send(s,y)}catch(x){if(!(2>u))throw x;y(-1,x)}}else y(-1,"No Transport");function y(b,c,d,e){var k,s,t,v,x,y=c;2!==u&&(u=2,h&&a.clearTimeout(h),j=void 0,g=e||"",w.readyState=b>0?4:0,k=b>=200&&300>b||304===b,d&&(v=Vb(l,w,d)),v=Wb(l,v,w,k),k?(l.ifModified&&(x=w.getResponseHeader("Last-Modified"),x&&(n.lastModified[f]=x),x=w.getResponseHeader("etag"),x&&(n.etag[f]=x)),204===b||"HEAD"===l.type?y="nocontent":304===b?y="notmodified":(y=v.state,s=v.data,t=v.error,k=!t)):(t=y,(b||!y)&&(y="error",0>b&&(b=0))),w.status=b,w.statusText=(c||y)+"",k?p.resolveWith(m,[s,y,w]):p.rejectWith(m,[w,y,t]),w.statusCode(r),r=void 0,i&&o.trigger(k?"ajaxSuccess":"ajaxError",[w,l,k?s:t]),q.fireWith(m,[w,y]),i&&(o.trigger("ajaxComplete",[w,l]),--n.active||n.event.trigger("ajaxStop")))}return w},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax(n.extend({url:a,type:b,dataType:e,data:c,success:d},n.isPlainObject(a)&&a))}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},n.fn.extend({wrapAll:function(a){if(n.isFunction(a))return this.each(function(b){n(this).wrapAll(a.call(this,b))});if(this[0]){var b=n(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&1===a.firstChild.nodeType)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){return n.isFunction(a)?this.each(function(b){n(this).wrapInner(a.call(this,b))}):this.each(function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,"body")||n(this).replaceWith(this.childNodes)}).end()}});function Xb(a){return a.style&&a.style.display||n.css(a,"display")}function Yb(a){while(a&&1===a.nodeType){if("none"===Xb(a)||"hidden"===a.type)return!0;a=a.parentNode}return!1}n.expr.filters.hidden=function(a){return l.reliableHiddenOffsets()?a.offsetWidth<=0&&a.offsetHeight<=0&&!a.getClientRects().length:Yb(a)},n.expr.filters.visible=function(a){return!n.expr.filters.hidden(a)};var Zb=/%20/g,$b=/\[\]$/,_b=/\r?\n/g,ac=/^(?:submit|button|image|reset|file)$/i,bc=/^(?:input|select|textarea|keygen)/i;function cc(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||$b.test(a)?d(a,e):cc(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)cc(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)cc(c,a[c],b,e);return d.join("&").replace(Zb,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&bc.test(this.nodeName)&&!ac.test(a)&&(this.checked||!Z.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(_b,"\r\n")}}):{name:b.name,value:c.replace(_b,"\r\n")}}).get()}}),n.ajaxSettings.xhr=void 0!==a.ActiveXObject?function(){return this.isLocal?hc():d.documentMode>8?gc():/^(get|post|head|put|delete|options)$/i.test(this.type)&&gc()||hc()}:gc;var dc=0,ec={},fc=n.ajaxSettings.xhr();a.attachEvent&&a.attachEvent("onunload",function(){for(var a in ec)ec[a](void 0,!0)}),l.cors=!!fc&&"withCredentials"in fc,fc=l.ajax=!!fc,fc&&n.ajaxTransport(function(b){if(!b.crossDomain||l.cors){var c;return{send:function(d,e){var f,g=b.xhr(),h=++dc;if(g.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(f in b.xhrFields)g[f]=b.xhrFields[f];b.mimeType&&g.overrideMimeType&&g.overrideMimeType(b.mimeType),b.crossDomain||d["X-Requested-With"]||(d["X-Requested-With"]="XMLHttpRequest");for(f in d)void 0!==d[f]&&g.setRequestHeader(f,d[f]+"");g.send(b.hasContent&&b.data||null),c=function(a,d){var f,i,j;if(c&&(d||4===g.readyState))if(delete ec[h],c=void 0,g.onreadystatechange=n.noop,d)4!==g.readyState&&g.abort();else{j={},f=g.status,"string"==typeof g.responseText&&(j.text=g.responseText);try{i=g.statusText}catch(k){i=""}f||!b.isLocal||b.crossDomain?1223===f&&(f=204):f=j.text?200:404}j&&e(f,i,j,g.getAllResponseHeaders())},b.async?4===g.readyState?a.setTimeout(c):g.onreadystatechange=ec[h]=c:c()},abort:function(){c&&c(void 0,!0)}}}});function gc(){try{return new a.XMLHttpRequest}catch(b){}}function hc(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}n.ajaxPrefilter(function(a){a.crossDomain&&(a.contents.script=!1)}),n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c=d.head||n("head")[0]||d.documentElement;return{send:function(e,f){b=d.createElement("script"),b.async=!0,a.scriptCharset&&(b.charset=a.scriptCharset),b.src=a.url,b.onload=b.onreadystatechange=function(a,c){(c||!b.readyState||/loaded|complete/.test(b.readyState))&&(b.onload=b.onreadystatechange=null,b.parentNode&&b.parentNode.removeChild(b),b=null,c||f(200,"success"))},c.insertBefore(b,c.firstChild)},abort:function(){b&&b.onload(void 0,!0)}}}});var ic=[],jc=/(=)\?(?=&|$)|\?\?/;n.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=ic.pop()||n.expando+"_"+Db++;return this[a]=!0,a}}),n.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(jc.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&jc.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(jc,"$1"+e):b.jsonp!==!1&&(b.url+=(Eb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||n.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?n(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,ic.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),l.createHTMLDocument=function(){if(!d.implementation.createHTMLDocument)return!1;var a=d.implementation.createHTMLDocument("");return a.body.innerHTML="<form></form><form></form>",2===a.body.childNodes.length}(),n.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||(l.createHTMLDocument?d.implementation.createHTMLDocument(""):d);var e=x.exec(a),f=!c&&[];return e?[b.createElement(e[1])]:(e=ja([a],b,f),f&&f.length&&n(f).remove(),n.merge([],e.childNodes))};var kc=n.fn.load;n.fn.load=function(a,b,c){if("string"!=typeof a&&kc)return kc.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=n.trim(a.slice(h,a.length)),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&n.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(g,f||[a.responseText,b,a])})}),this},n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};function lc(a){return n.isWindow(a)?a:9===a.nodeType?a.defaultView||a.parentWindow:!1}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,"position"),l=n(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=n.css(a,"top"),i=n.css(a,"left"),j=("absolute"===k||"fixed"===k)&&n.inArray("auto",[f,i])>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,n.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d={top:0,left:0},e=this[0],f=e&&e.ownerDocument;if(f)return b=f.documentElement,n.contains(b,e)?("undefined"!=typeof e.getBoundingClientRect&&(d=e.getBoundingClientRect()),c=lc(f),{top:d.top+(c.pageYOffset||b.scrollTop)-(b.clientTop||0),left:d.left+(c.pageXOffset||b.scrollLeft)-(b.clientLeft||0)}):d},position:function(){if(this[0]){var a,b,c={top:0,left:0},d=this[0];return"fixed"===n.css(d,"position")?b=d.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html")||(c=a.offset()),c.top+=n.css(a[0],"borderTopWidth",!0)-a.scrollTop(),c.left+=n.css(a[0],"borderLeftWidth",!0)-a.scrollLeft()),{top:b.top-c.top-n.css(d,"marginTop",!0),left:b.left-c.left-n.css(d,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&!n.nodeName(a,"html")&&"static"===n.css(a,"position"))a=a.offsetParent;return a||Qa})}}),n.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c=/Y/.test(b);n.fn[a]=function(d){return Y(this,function(a,d,e){var f=lc(a);return void 0===e?f?b in f?f[b]:f.document.documentElement[d]:a[d]:void(f?f.scrollTo(c?n(f).scrollLeft():e,c?e:n(f).scrollTop()):a[d]=e)},a,d,arguments.length,null)}}),n.each(["top","left"],function(a,b){
	n.cssHooks[b]=Ua(l.pixelPosition,function(a,c){return c?(c=Sa(a,b),Oa.test(c)?n(a).position()[b]+"px":c):void 0})}),n.each({Height:"height",Width:"width"},function(a,b){n.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return Y(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}}),n.fn.size=function(){return this.length},n.fn.andSelf=n.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return n});var mc=a.jQuery,nc=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=nc),b&&a.jQuery===n&&(a.jQuery=mc),n},b||(a.jQuery=a.$=n),n});
/*
/!*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 *!/

/!*!
 * Generated using the Bootstrap Customizer (http://getbootstrap.com/customize/?id=f080806e0251bdce615c8ecefd6e3e98)
 * Config saved to config.json and https://gist.github.com/f080806e0251bdce615c8ecefd6e3e98
 *!/
if (typeof jQuery === 'undefined') {
    throw new Error('Bootstrap\'s JavaScript requires jQuery')
}
+function ($) {
    'use strict';
    var version = $.fn.jquery.split(' ')[0].split('.')
    if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 2)) {
        throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3')
    }
}(jQuery);

/!* ========================================================================
 * Bootstrap: collapse.js v3.3.6
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== *!/


+function ($) {
    'use strict';

    // COLLAPSE PUBLIC CLASS DEFINITION
    // ================================

    var Collapse = function (element, options) {
        this.$element      = $(element)
        this.options       = $.extend({}, Collapse.DEFAULTS, options)
        this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
            '[data-toggle="collapse"][data-target="#' + element.id + '"]')
        this.transitioning = null

        if (this.options.parent) {
            this.$parent = this.getParent()
        } else {
            this.addAriaAndCollapsedClass(this.$element, this.$trigger)
        }

        if (this.options.toggle) this.toggle()
    }

    Collapse.VERSION  = '3.3.6'

    Collapse.TRANSITION_DURATION = 350

    Collapse.DEFAULTS = {
        toggle: true
    }

    Collapse.prototype.dimension = function () {
        var hasWidth = this.$element.hasClass('width')
        return hasWidth ? 'width' : 'height'
    }

    Collapse.prototype.show = function () {
        if (this.transitioning || this.$element.hasClass('in')) return

        var activesData
        var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

        if (actives && actives.length) {
            activesData = actives.data('bs.collapse')
            if (activesData && activesData.transitioning) return
        }

        var startEvent = $.Event('show.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        if (actives && actives.length) {
            Plugin.call(actives, 'hide')
            activesData || actives.data('bs.collapse', null)
        }

        var dimension = this.dimension()

        this.$element
            .removeClass('collapse')
            .addClass('collapsing')[dimension](0)
            .attr('aria-expanded', true)

        this.$trigger
            .removeClass('collapsed')
            .attr('aria-expanded', true)

        this.transitioning = 1

        var complete = function () {
            this.$element
                .removeClass('collapsing')
                .addClass('collapse in')[dimension]('')
            this.transitioning = 0
            this.$element
                .trigger('shown.bs.collapse')
        }

        if (!$.support.transition) return complete.call(this)

        var scrollSize = $.camelCase(['scroll', dimension].join('-'))

        this.$element
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
    }

    Collapse.prototype.hide = function () {
        if (this.transitioning || !this.$element.hasClass('in')) return

        var startEvent = $.Event('hide.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        var dimension = this.dimension()

        this.$element[dimension](this.$element[dimension]())[0].offsetHeight

        this.$element
            .addClass('collapsing')
            .removeClass('collapse in')
            .attr('aria-expanded', false)

        this.$trigger
            .addClass('collapsed')
            .attr('aria-expanded', false)

        this.transitioning = 1

        var complete = function () {
            this.transitioning = 0
            this.$element
                .removeClass('collapsing')
                .addClass('collapse')
                .trigger('hidden.bs.collapse')
        }

        if (!$.support.transition) return complete.call(this)

        this.$element
            [dimension](0)
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
    }

    Collapse.prototype.toggle = function () {
        this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

    Collapse.prototype.getParent = function () {
        return $(this.options.parent)
            .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
            .each($.proxy(function (i, element) {
                var $element = $(element)
                this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
            }, this))
            .end()
    }

    Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
        var isOpen = $element.hasClass('in')

        $element.attr('aria-expanded', isOpen)
        $trigger
            .toggleClass('collapsed', !isOpen)
            .attr('aria-expanded', isOpen)
    }

    function getTargetFromTrigger($trigger) {
        var href
        var target = $trigger.attr('data-target')
            || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

        return $(target)
    }


    // COLLAPSE PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.collapse')
            var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
            if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.collapse

    $.fn.collapse             = Plugin
    $.fn.collapse.Constructor = Collapse


    // COLLAPSE NO CONFLICT
    // ====================

    $.fn.collapse.noConflict = function () {
        $.fn.collapse = old
        return this
    }


    // COLLAPSE DATA-API
    // =================

    $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
        var $this   = $(this)

        if (!$this.attr('data-target')) e.preventDefault()

        var $target = getTargetFromTrigger($this)
        var data    = $target.data('bs.collapse')
        var option  = data ? 'toggle' : $this.data()

        Plugin.call($target, option)
    })

}(jQuery);

/!* ========================================================================
 * Bootstrap: transition.js v3.3.6
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== *!/


+function ($) {
    'use strict';

    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================

    function transitionEnd() {
        var el = document.createElement('bootstrap')

        var transEndEventNames = {
            WebkitTransition : 'webkitTransitionEnd',
            MozTransition    : 'transitionend',
            OTransition      : 'oTransitionEnd otransitionend',
            transition       : 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return { end: transEndEventNames[name] }
            }
        }

        return false // explicit for ie8 (  ._.)
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false
        var $el = this
        $(this).one('bsTransitionEnd', function () { called = true })
        var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
        setTimeout(callback, duration)
        return this
    }

    $(function () {
        $.support.transition = transitionEnd()

        if (!$.support.transition) return

        $.event.special.bsTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function (e) {
                if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
            }
        }
    })

}(jQuery);*/

/*! version : 4.14.30
 =========================================================
 bootstrap-datetimejs
 https://github.com/Eonasdan/bootstrap-datetimepicker
 Copyright (c) 2015 Jonathan Peterson
 =========================================================
 */
/*
 The MIT License (MIT)

 Copyright (c) 2015 Jonathan Peterson

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
/*global define:false */
/*global exports:false */
/*global require:false */
/*global jQuery:false */
/*global moment:false */
(function ( factory ) {
    'use strict';
    if ( typeof define === 'function' && define.amd ) {
        // AMD is used - Register as an anonymous module.
        define( [ 'jquery', 'moment' ], factory );
    } else if ( typeof exports === 'object' ) {
        factory( require( 'jquery' ), require( 'moment' ) );
    } else {
        // Neither AMD nor CommonJS used. Use global variables.
        if ( typeof jQuery === 'undefined' ) {
            throw 'bootstrap-datetimepicker requires jQuery to be loaded first';
        }
        if ( typeof moment === 'undefined' ) {
            throw 'bootstrap-datetimepicker requires Moment.js to be loaded first';
        }
        factory( jQuery, moment );
    }
}( function ( $, moment ) {
    'use strict';
    if ( !moment ) {
        throw new Error( 'bootstrap-datetimepicker requires Moment.js to be loaded first' );
    }

    var dateTimePicker = function ( element, options ) {
        var picker                        = {},
            date                          = moment().startOf( 'd' ),
            viewDate                      = date.clone(),
            unset                         = true,
            input,
            component                     = false,
            widget                        = false,
            use24Hours,
            minViewModeNumber             = 0,
            actualFormat,
            parseFormats,
            currentViewMode,
            datePickerModes               = [
                {
                    clsName: 'days',
                    navFnc: 'M',
                    navStep: 1
                },
                {
                    clsName: 'months',
                    navFnc: 'y',
                    navStep: 1
                },
                {
                    clsName: 'years',
                    navFnc: 'y',
                    navStep: 10
                },
                {
                    clsName: 'decades',
                    navFnc: 'y',
                    navStep: 100
                }
            ],
            viewModes                     = [ 'days', 'months', 'years', 'decades' ],
            verticalModes                 = [ 'top', 'bottom', 'auto' ],
            horizontalModes               = [ 'left', 'right', 'auto' ],
            toolbarPlacements             = [ 'default', 'top', 'bottom' ],
            keyMap                        = {
                'up': 38,
                38: 'up',
                'down': 40,
                40: 'down',
                'left': 37,
                37: 'left',
                'right': 39,
                39: 'right',
                'tab': 9,
                9: 'tab',
                'escape': 27,
                27: 'escape',
                'enter': 13,
                13: 'enter',
                'pageUp': 33,
                33: 'pageUp',
                'pageDown': 34,
                34: 'pageDown',
                'shift': 16,
                16: 'shift',
                'control': 17,
                17: 'control',
                'space': 32,
                32: 'space',
                't': 84,
                84: 't',
                'delete': 46,
                46: 'delete'
            },
            keyState                      = {},

            /********************************************************************************
             *
             * Private functions
             *
             ********************************************************************************/
            isEnabled                     = function ( granularity ) {
                if ( typeof granularity !== 'string' || granularity.length > 1 ) {
                    throw new TypeError( 'isEnabled expects a single character string parameter' );
                }
                switch ( granularity ) {
                    case 'y':
                        return actualFormat.indexOf( 'Y' ) !== -1;
                    case 'M':
                        return actualFormat.indexOf( 'M' ) !== -1;
                    case 'd':
                        return actualFormat.toLowerCase().indexOf( 'd' ) !== -1;
                    case 'h':
                    case 'H':
                        return actualFormat.toLowerCase().indexOf( 'h' ) !== -1;
                    case 'm':
                        return actualFormat.indexOf( 'm' ) !== -1;
                    case 's':
                        return actualFormat.indexOf( 's' ) !== -1;
                    default:
                        return false;
                }
            },
            hasTime                       = function () {
                return (isEnabled( 'h' ) || isEnabled( 'm' ) || isEnabled( 's' ));
            },

            hasDate                       = function () {
                return (isEnabled( 'y' ) || isEnabled( 'M' ) || isEnabled( 'd' ));
            },

            getDatePickerTemplate         = function () {
                var headTemplate = $( '<thead>' )
                    .append( $( '<tr>' )
                        .append( $( '<th>' ).addClass( 'prev' ).attr( 'data-action', 'previous' )
                            .append( $( '<svg class="svg-basic svg--blue"><use xlink:href="#shape-arrow-left"></use></svg>' ) )
                        )
                        .append( $( '<th>' ).addClass( 'picker-switch' ).attr( 'data-action', 'pickerSwitch' ).attr( 'colspan', (options.calendarWeeks ? '6' : '5') ) )
                        .append( $( '<th>' ).addClass( 'next' ).attr( 'data-action', 'next' )
                            .append( $( '<svg class="svg-basic svg--blue"><use xlink:href="#shape-arrow-right"></use></svg>' ) )
                        )
                    ),
                    contTemplate = $( '<tbody>' )
                        .append( $( '<tr>' )
                            .append( $( '<td>' ).attr( 'colspan', (options.calendarWeeks ? '8' : '7') ) )
                        );

                return [
                    $( '<div>' ).addClass( 'datepicker-days' )
                        .append( $( '<table>' ).addClass( 'table-condensed' )
                            .append( headTemplate )
                            .append( $( '<tbody>' ) )
                        ),
                    $( '<div>' ).addClass( 'datepicker-months' )
                        .append( $( '<table>' ).addClass( 'table-condensed' )
                            .append( headTemplate.clone() )
                            .append( contTemplate.clone() )
                        ),
                    $( '<div>' ).addClass( 'datepicker-years' )
                        .append( $( '<table>' ).addClass( 'table-condensed' )
                            .append( headTemplate.clone() )
                            .append( contTemplate.clone() )
                        ),
                    $( '<div>' ).addClass( 'datepicker-decades' )
                        .append( $( '<table>' ).addClass( 'table-condensed' )
                            .append( headTemplate.clone() )
                            .append( contTemplate.clone() )
                        )
                ];
            },

            getTimePickerMainTemplate     = function () {
                var topRow    = $( '<tr>' ),
                    middleRow = $( '<tr>' ),
                    bottomRow = $( '<tr>' );

                if ( isEnabled( 'h' ) ) {
                    topRow.append( $( '<td>' )
                        .append( $( '<a>' ).attr( {
                            href: '#',
                            tabindex: '-1',
                            'title': 'Increment Hour'
                        } ).addClass( 'btn btn--blue-svg' ).attr( 'data-action', 'incrementHours' )
                            .append(  $( '<svg class="svg-basic svg--white"><use xlink:href="#shape-up"></use></svg>' ) ) ) );
                    middleRow.append( $( '<td>' )
                        .append( $( '<span>' ).addClass( 'timepicker-hour' ).attr( {
                            'data-time-component': 'hours',
                            'title': 'Pick Hour'
                        } ).attr( 'data-action', 'showHours' ) ) );
                    bottomRow.append( $( '<td>' )
                        .append( $( '<a>' ).attr( {
                            href: '#',
                            tabindex: '-1',
                            'title': 'Decrement Hour'
                        } ).addClass( 'btn btn--blue-svg' ).attr( 'data-action', 'decrementHours' )
                            .append(  $( '<svg class="svg-basic svg--white"><use xlink:href="#shape-down"></use></svg>' )) ) );
                }
                if ( isEnabled( 'm' ) ) {
                    if ( isEnabled( 'h' ) ) {
                        topRow.append( $( '<td>' ).addClass( 'separator' ) );
                        middleRow.append( $( '<td>' ).addClass( 'separator' ).html( ':' ) );
                        bottomRow.append( $( '<td>' ).addClass( 'separator' ) );
                    }
                    topRow.append( $( '<td>' )
                        .append( $( '<a>' ).attr( {
                            href: '#',
                            tabindex: '-1',
                            'title': 'Increment Minute'
                        } ).addClass( 'btn btn--blue-svg' ).attr( 'data-action', 'incrementMinutes' )
                            .append($( '<svg class="svg-basic svg--white"><use xlink:href="#shape-up"></use></svg>' ) ) ) );
                    middleRow.append( $( '<td>' )
                        .append( $( '<span>' ).addClass( 'timepicker-minute' ).attr( {
                            'data-time-component': 'minutes',
                            'title': 'Pick Minute'
                        } ).attr( 'data-action', 'showMinutes' ) ) );
                    bottomRow.append( $( '<td>' )
                        .append( $( '<a>' ).attr( {
                            href: '#',
                            tabindex: '-1',
                            'title': 'Decrement Minute'
                        } ).addClass( 'btn btn--blue-svg' ).attr( 'data-action', 'decrementMinutes' )
                            .append( $( '<svg class="svg-basic svg--white"><use xlink:href="#shape-down"></use></svg>' ) ) ) );
                }
                if ( isEnabled( 's' ) ) {
                    if ( isEnabled( 'm' ) ) {
                        topRow.append( $( '<td>' ).addClass( 'separator' ) );
                        middleRow.append( $( '<td>' ).addClass( 'separator' ).html( ':' ) );
                        bottomRow.append( $( '<td>' ).addClass( 'separator' ) );
                    }
                    topRow.append( $( '<td>' )
                        .append( $( '<a>' ).attr( {
                            href: '#',
                            tabindex: '-1',
                            'title': 'Increment Second'
                        } ).addClass( 'btn' ).attr( 'data-action', 'incrementSeconds' )
                            .append( $( '<span>' ).addClass( options.icons.up ) ) ) );
                    middleRow.append( $( '<td>' )
                        .append( $( '<span>' ).addClass( 'timepicker-second' ).attr( {
                            'data-time-component': 'seconds',
                            'title': 'Pick Second'
                        } ).attr( 'data-action', 'showSeconds' ) ) );
                    bottomRow.append( $( '<td>' )
                        .append( $( '<a>' ).attr( {
                            href: '#',
                            tabindex: '-1',
                            'title': 'Decrement Second'
                        } ).addClass( 'btn' ).attr( 'data-action', 'decrementSeconds' )
                            .append( $( '<span>' ).addClass( options.icons.down ) ) ) );
                }

                if ( !use24Hours ) {
                    topRow.append( $( '<td>' ).addClass( 'separator' ) );
                    middleRow.append( $( '<td>' )
                        .append( $( '<button>' ).addClass( 'btn btn-primary' ).attr( {
                            'data-action': 'togglePeriod',
                            tabindex: '-1',
                            'title': 'Toggle Period'
                        } ) ) );
                    bottomRow.append( $( '<td>' ).addClass( 'separator' ) );
                }

                return $( '<div>' ).addClass( 'timepicker-picker' )
                    .append( $( '<table>' ).addClass( 'table-condensed' )
                        .append( [ topRow, middleRow, bottomRow ] ) );
            },

            getTimePickerTemplate         = function () {
                var hoursView   = $( '<div>' ).addClass( 'timepicker-hours' )
                    .append( $( '<table>' ).addClass( 'table-condensed' ) ),
                    minutesView = $( '<div>' ).addClass( 'timepicker-minutes' )
                        .append( $( '<table>' ).addClass( 'table-condensed' ) ),
                    secondsView = $( '<div>' ).addClass( 'timepicker-seconds' )
                        .append( $( '<table>' ).addClass( 'table-condensed' ) ),
                    ret         = [ getTimePickerMainTemplate() ];

                if ( isEnabled( 'h' ) ) {
                    ret.push( hoursView );
                }
                if ( isEnabled( 'm' ) ) {
                    ret.push( minutesView );
                }
                if ( isEnabled( 's' ) ) {
                    ret.push( secondsView );
                }

                return ret;
            },

            getToolbar                    = function () {
                var row = [];
                if ( options.showTodayButton ) {
                    row.push( $( '<td>' ).append( $( '<a>' ).attr( {
                        'data-action': 'today',
                        'title': 'Go to today',
                        'data-toggle':'tooltip'
                    } ).append( $( '<svg class="svg-basic svg--blue"><use xlink:href="#shape-calendar-today"></use></svg>' ) ) ) );
                }
                if ( !options.sideBySide && hasDate() && hasTime() ) {
                    row.push( $( '<td>' ).append( $( '<a>' ).attr( {
                        'data-action': 'togglePicker',
                        'title': 'Select Time',
                        'data-toggle':'tooltip'
                    } ).append($( '<svg class="svg-basic svg--blue"><use xlink:href="#shape-clock"></use></svg>' ) ) ) );
                }
                if ( options.showClear ) {
                    row.push( $( '<td>' ).append( $( '<a>' ).attr( {
                        'data-action': 'clear',
                        'title': 'Clear selection',
                        'data-toggle':'tooltip'
                    } ).append( $( '<svg class="svg-basic svg--alert"><use xlink:href="#shape-trash"></use></svg>' ) ) ) );
                }
                if ( options.showClose ) {
                    row.push( $( '<td>' ).append( $( '<a>' ).attr( {
                        'data-action': 'close',
                        'title': 'Close the picker',
                        'data-toggle':'tooltip'
                    } ).append($( '<svg class="svg-basic svg--alert"><use xlink:href="#shape-close-modal"></use></svg>' )) ) );
                }
                return $( '<table>' ).addClass( 'table-condensed' ).append( $( '<tbody>' ).append( $( '<tr>' ).append( row ) ) );
            },

            getTemplate                   = function () {
                var template = $( '<div>' ).addClass( 'bootstrap-datetimepicker-widget dropdown-menu' ),
                    dateView = $( '<div>' ).addClass( 'datepicker' ).append( getDatePickerTemplate() ),
                    timeView = $( '<div>' ).addClass( 'timepicker' ).append( getTimePickerTemplate() ),
                    content  = $( '<ul>' ).addClass( 'list-unstyled' ),
                    toolbar  = $( '<li>' ).addClass( 'picker-switch' + (options.collapse ? ' accordion-toggle' : '') ).append( getToolbar() );

                if ( options.inline ) {
                    template.removeClass( 'dropdown-menu' );
                }

                if ( use24Hours ) {
                    template.addClass( 'usetwentyfour' );
                }
                if ( isEnabled( 's' ) && !use24Hours ) {
                    template.addClass( 'wider' );
                }
                if ( options.sideBySide && hasDate() && hasTime() ) {
                    template.addClass( 'timepicker-sbs' );
                    template.append(
                        $( '<div>' ).addClass( 'row' )
                            .append( dateView.addClass( 'col-sm-6' ) )
                            .append( timeView.addClass( 'col-sm-6' ) )
                    );
                    template.append( toolbar );
                    return template;
                }

                if ( options.toolbarPlacement === 'top' ) {
                    content.append( toolbar );
                }
                if ( hasDate() ) {
                    content.append( $( '<li>' ).addClass( (options.collapse && hasTime() ? 'collapse in' : '') ).append( dateView ) );
                }
                if ( options.toolbarPlacement === 'default' ) {
                    content.append( toolbar );
                }
                if ( hasTime() ) {
                    content.append( $( '<li>' ).addClass( (options.collapse && hasDate() ? 'collapse' : '') ).append( timeView ) );
                }
                if ( options.toolbarPlacement === 'bottom' ) {
                    content.append( toolbar );
                }
                return template.append( content );
            },

            dataToOptions                 = function () {
                var eData,
                    dataOptions = {};

                if ( element.is( 'input' ) || options.inline ) {
                    eData = element.data();
                } else {
                    eData = element.find( 'input' ).data();
                }

                if ( eData.dateOptions && eData.dateOptions instanceof Object ) {
                    dataOptions = $.extend( true, dataOptions, eData.dateOptions );
                }

                $.each( options, function ( key ) {
                    var attributeName = 'date' + key.charAt( 0 ).toUpperCase() + key.slice( 1 );
                    if ( eData[ attributeName ] !== undefined ) {
                        dataOptions[ key ] = eData[ attributeName ];
                    }
                } );
                return dataOptions;
            },

            place                         = function () {
                var position   = (component || element).position(),
                    offset     = (component || element).offset(),
                    vertical   = options.widgetPositioning.vertical,
                    horizontal = options.widgetPositioning.horizontal,
                    parent;

                if ( options.widgetParent ) {
                    parent = options.widgetParent.append( widget );
                } else if ( element.is( 'input' ) ) {
                    parent = element.after( widget ).parent();
                } else if ( options.inline ) {
                    parent = element.append( widget );
                    return;
                } else {
                    parent = element;
                    element.children().first().after( widget );
                }

                // Top and bottom logic
                if ( vertical === 'auto' ) {
                    if ( offset.top + widget.height() * 1.5 >= $( window ).height() + $( window ).scrollTop() &&
                        widget.height() + element.outerHeight() < offset.top ) {
                        vertical = 'top';
                    } else {
                        vertical = 'bottom';
                    }
                }

                // Left and right logic
                if ( horizontal === 'auto' ) {
                    if ( parent.width() < offset.left + widget.outerWidth() / 2 &&
                        offset.left + widget.outerWidth() > $( window ).width() ) {
                        horizontal = 'right';
                    } else {
                        horizontal = 'left';
                    }
                }

                if ( vertical === 'top' ) {
                    widget.addClass( 'top' ).removeClass( 'bottom' );
                } else {
                    widget.addClass( 'bottom' ).removeClass( 'top' );
                }

                if ( horizontal === 'right' ) {
                    widget.addClass( 'pull-right' );
                } else {
                    widget.removeClass( 'pull-right' );
                }

                // find the first parent element that has a relative css positioning
                if ( parent.css( 'position' ) !== 'relative' ) {
                    parent = parent.parents().filter( function () {
                        return $( this ).css( 'position' ) === 'relative';
                    } ).first();
                }

                if ( parent.length === 0 ) {
                    throw new Error( 'datetimepicker component should be placed within a relative positioned container' );
                }

                widget.css( {
                    top: vertical === 'top' ? 'auto' : position.top + element.outerHeight(),
                    bottom: vertical === 'top' ? position.top + element.outerHeight() : 'auto',
                    left: horizontal === 'left' ? (parent === element ? 0 : position.left) : 'auto',
                    right: horizontal === 'left' ? 'auto' : parent.outerWidth() - element.outerWidth() - (parent === element ? 0 : position.left)
                } );
            },

            notifyEvent                   = function ( e ) {
                if ( e.type === 'dp.change' && ((e.date && e.date.isSame( e.oldDate )) || (!e.date && !e.oldDate)) ) {
                    return;
                }
                element.trigger( e );
            },

            viewUpdate                    = function ( e ) {
                if ( e === 'y' ) {
                    e = 'YYYY';
                }
                notifyEvent( {
                    type: 'dp.update',
                    change: e,
                    viewDate: viewDate.clone()
                } );
            },

            showMode                      = function ( dir ) {
                if ( !widget ) {
                    return;
                }
                if ( dir ) {
                    currentViewMode = Math.max( minViewModeNumber, Math.min( 3, currentViewMode + dir ) );
                }
                widget.find( '.datepicker > div' ).hide().filter( '.datepicker-' + datePickerModes[ currentViewMode ].clsName ).show();
            },

            fillDow                       = function () {
                var row         = $( '<tr>' ),
                    currentDate = viewDate.clone().startOf( 'w' ).startOf( 'd' );

                if ( options.calendarWeeks === true ) {
                    row.append( $( '<th>' ).addClass( 'cw' ).text( '#' ) );
                }

                while ( currentDate.isBefore( viewDate.clone().endOf( 'w' ) ) ) {
                    row.append( $( '<th>' ).addClass( 'dow' ).text( currentDate.format( 'dd' ) ) );
                    currentDate.add( 1, 'd' );
                }
                widget.find( '.datepicker-days thead' ).append( row );
            },

            isInDisabledDates             = function ( testDate ) {
                return options.disabledDates[ testDate.format( 'YYYY-MM-DD' ) ] === true;
            },

            isInEnabledDates              = function ( testDate ) {
                return options.enabledDates[ testDate.format( 'YYYY-MM-DD' ) ] === true;
            },

            isInDisabledHours             = function ( testDate ) {
                return options.disabledHours[ testDate.format( 'H' ) ] === true;
            },

            isInEnabledHours              = function ( testDate ) {
                return options.enabledHours[ testDate.format( 'H' ) ] === true;
            },

            isValid                       = function ( targetMoment, granularity ) {
                if ( !targetMoment.isValid() ) {
                    return false;
                }
                if ( options.disabledDates && granularity === 'd' && isInDisabledDates( targetMoment ) ) {
                    return false;
                }
                if ( options.enabledDates && granularity === 'd' && !isInEnabledDates( targetMoment ) ) {
                    return false;
                }
                if ( options.minDate && targetMoment.isBefore( options.minDate, granularity ) ) {
                    return false;
                }
                if ( options.maxDate && targetMoment.isAfter( options.maxDate, granularity ) ) {
                    return false;
                }
                if ( options.daysOfWeekDisabled && granularity === 'd' && options.daysOfWeekDisabled.indexOf( targetMoment.day() ) !== -1 ) {
                    return false;
                }
                if ( options.disabledHours && (granularity === 'h' || granularity === 'm' || granularity === 's') && isInDisabledHours( targetMoment ) ) {
                    return false;
                }
                if ( options.enabledHours && (granularity === 'h' || granularity === 'm' || granularity === 's') && !isInEnabledHours( targetMoment ) ) {
                    return false;
                }
                if ( options.disabledTimeIntervals && (granularity === 'h' || granularity === 'm' || granularity === 's') ) {
                    var found = false;
                    $.each( options.disabledTimeIntervals, function () {
                        if ( targetMoment.isBetween( this[ 0 ], this[ 1 ] ) ) {
                            found = true;
                            return false;
                        }
                    } );
                    if ( found ) {
                        return false;
                    }
                }
                return true;
            },

            fillMonths                    = function () {
                var spans       = [],
                    monthsShort = viewDate.clone().startOf( 'y' ).startOf( 'd' );
                while ( monthsShort.isSame( viewDate, 'y' ) ) {
                    spans.push( $( '<span>' ).attr( 'data-action', 'selectMonth' ).addClass( 'month' ).text( monthsShort.format( 'MMM' ) ) );
                    monthsShort.add( 1, 'M' );
                }
                widget.find( '.datepicker-months td' ).empty().append( spans );
            },

            updateMonths                  = function () {
                var monthsView       = widget.find( '.datepicker-months' ),
                    monthsViewHeader = monthsView.find( 'th' ),
                    months           = monthsView.find( 'tbody' ).find( 'span' );

                monthsViewHeader.eq( 0 ).find( 'span' ).attr( 'title', 'Previous Year' );
                monthsViewHeader.eq( 1 ).attr( 'title', 'Select Year' );
                monthsViewHeader.eq( 2 ).find( 'span' ).attr( 'title', 'Next Year' );

                monthsView.find( '.disabled' ).removeClass( 'disabled' );

                if ( !isValid( viewDate.clone().subtract( 1, 'y' ), 'y' ) ) {
                    monthsViewHeader.eq( 0 ).addClass( 'disabled' );
                }

                monthsViewHeader.eq( 1 ).text( viewDate.year() );

                if ( !isValid( viewDate.clone().add( 1, 'y' ), 'y' ) ) {
                    monthsViewHeader.eq( 2 ).addClass( 'disabled' );
                }

                months.removeClass( 'active' );
                if ( date.isSame( viewDate, 'y' ) && !unset ) {
                    months.eq( date.month() ).addClass( 'active' );
                }

                months.each( function ( index ) {
                    if ( !isValid( viewDate.clone().month( index ), 'M' ) ) {
                        $( this ).addClass( 'disabled' );
                    }
                } );
            },

            updateYears                   = function () {
                var yearsView       = widget.find( '.datepicker-years' ),
                    yearsViewHeader = yearsView.find( 'th' ),
                    startYear       = viewDate.clone().subtract( 5, 'y' ),
                    endYear         = viewDate.clone().add( 6, 'y' ),
                    html            = '';

                yearsViewHeader.eq( 0 ).find( 'span' ).attr( 'title', 'Previous Decade' );
                yearsViewHeader.eq( 1 ).attr( 'title', 'Select Decade' );
                yearsViewHeader.eq( 2 ).find( 'span' ).attr( 'title', 'Next Decade' );

                yearsView.find( '.disabled' ).removeClass( 'disabled' );

                if ( options.minDate && options.minDate.isAfter( startYear, 'y' ) ) {
                    yearsViewHeader.eq( 0 ).addClass( 'disabled' );
                }

                yearsViewHeader.eq( 1 ).text( startYear.year() + '-' + endYear.year() );

                if ( options.maxDate && options.maxDate.isBefore( endYear, 'y' ) ) {
                    yearsViewHeader.eq( 2 ).addClass( 'disabled' );
                }

                while ( !startYear.isAfter( endYear, 'y' ) ) {
                    html += '<span data-action="selectYear" class="year' + (startYear.isSame( date, 'y' ) && !unset ? ' active' : '') + (!isValid( startYear, 'y' ) ? ' disabled' : '') + '">' + startYear.year() + '</span>';
                    startYear.add( 1, 'y' );
                }

                yearsView.find( 'td' ).html( html );
            },

            updateDecades                 = function () {
                var decadesView       = widget.find( '.datepicker-decades' ),
                    decadesViewHeader = decadesView.find( 'th' ),
                    startDecade       = viewDate.isBefore( moment( { y: 1999 } ) ) ? moment( { y: 1899 } ) : moment( { y: 1999 } ),
                    endDecade         = startDecade.clone().add( 100, 'y' ),
                    html              = '';

                decadesViewHeader.eq( 0 ).find( 'span' ).attr( 'title', 'Previous Century' );
                decadesViewHeader.eq( 2 ).find( 'span' ).attr( 'title', 'Next Century' );

                decadesView.find( '.disabled' ).removeClass( 'disabled' );

                if ( startDecade.isSame( moment( { y: 1900 } ) ) || (options.minDate && options.minDate.isAfter( startDecade, 'y' )) ) {
                    decadesViewHeader.eq( 0 ).addClass( 'disabled' );
                }

                decadesViewHeader.eq( 1 ).text( startDecade.year() + '-' + endDecade.year() );

                if ( startDecade.isSame( moment( { y: 2000 } ) ) || (options.maxDate && options.maxDate.isBefore( endDecade, 'y' )) ) {
                    decadesViewHeader.eq( 2 ).addClass( 'disabled' );
                }

                while ( !startDecade.isAfter( endDecade, 'y' ) ) {
                    html += '<span data-action="selectDecade" class="decade' + (startDecade.isSame( date, 'y' ) ? ' active' : '') +
                        (!isValid( startDecade, 'y' ) ? ' disabled' : '') + '" data-selection="' + (startDecade.year() + 6) + '">' + (startDecade.year() + 1) + ' - ' + (startDecade.year() + 12) + '</span>';
                    startDecade.add( 12, 'y' );
                }
                html += '<span></span><span></span><span></span>'; //push the dangling block over, at least this way it's even

                decadesView.find( 'td' ).html( html );
            },

            fillDate                      = function () {
                var daysView       = widget.find( '.datepicker-days' ),
                    daysViewHeader = daysView.find( 'th' ),
                    currentDate,
                    html           = [],
                    row,
                    clsName,
                    i;

                if ( !hasDate() ) {
                    return;
                }

                daysViewHeader.eq( 0 ).find( 'span' ).attr( 'title', 'Previous Month' );
                daysViewHeader.eq( 1 ).attr( 'title', 'Select Month' );
                daysViewHeader.eq( 2 ).find( 'span' ).attr( 'title', 'Next Month' );

                daysView.find( '.disabled' ).removeClass( 'disabled' );
                daysViewHeader.eq( 1 ).text( viewDate.format( options.dayViewHeaderFormat ) );

                if ( !isValid( viewDate.clone().subtract( 1, 'M' ), 'M' ) ) {
                    daysViewHeader.eq( 0 ).addClass( 'disabled' );
                }
                if ( !isValid( viewDate.clone().add( 1, 'M' ), 'M' ) ) {
                    daysViewHeader.eq( 2 ).addClass( 'disabled' );
                }

                currentDate = viewDate.clone().startOf( 'M' ).startOf( 'w' ).startOf( 'd' );

                for ( i = 0; i < 42; i++ ) { //always display 42 days (should show 6 weeks)
                    if ( currentDate.weekday() === 0 ) {
                        row = $( '<tr>' );
                        if ( options.calendarWeeks ) {
                            row.append( '<td class="cw">' + currentDate.week() + '</td>' );
                        }
                        html.push( row );
                    }
                    clsName = '';
                    if ( currentDate.isBefore( viewDate, 'M' ) ) {
                        clsName += ' old';
                    }
                    if ( currentDate.isAfter( viewDate, 'M' ) ) {
                        clsName += ' new';
                    }
                    if ( currentDate.isSame( date, 'd' ) && !unset ) {
                        clsName += ' active';
                    }
                    if ( !isValid( currentDate, 'd' ) ) {
                        clsName += ' disabled';
                    }
                    if ( currentDate.isSame( moment(), 'd' ) ) {
                        clsName += ' today';
                    }
                    if ( currentDate.day() === 0 || currentDate.day() === 6 ) {
                        clsName += ' weekend';
                    }
                    row.append( '<td data-action="selectDay" data-day="' + currentDate.format( 'L' ) + '" class="day' + clsName + '">' + currentDate.date() + '</td>' );
                    currentDate.add( 1, 'd' );
                }

                daysView.find( 'tbody' ).empty().append( html );

                updateMonths();

                updateYears();

                updateDecades();
            },

            fillHours                     = function () {
                var table       = widget.find( '.timepicker-hours table' ),
                    currentHour = viewDate.clone().startOf( 'd' ),
                    html        = [],
                    row         = $( '<tr>' );

                if ( viewDate.hour() > 11 && !use24Hours ) {
                    currentHour.hour( 12 );
                }
                while ( currentHour.isSame( viewDate, 'd' ) && (use24Hours || (viewDate.hour() < 12 && currentHour.hour() < 12) || viewDate.hour() > 11) ) {
                    if ( currentHour.hour() % 4 === 0 ) {
                        row = $( '<tr>' );
                        html.push( row );
                    }
                    row.append( '<td data-action="selectHour" class="hour' + (!isValid( currentHour, 'h' ) ? ' disabled' : '') + '">' + currentHour.format( use24Hours ? 'HH' : 'hh' ) + '</td>' );
                    currentHour.add( 1, 'h' );
                }
                table.empty().append( html );
            },

            fillMinutes                   = function () {
                var table         = widget.find( '.timepicker-minutes table' ),
                    currentMinute = viewDate.clone().startOf( 'h' ),
                    html          = [],
                    row           = $( '<tr>' ),
                    step          = options.stepping === 1 ? 5 : options.stepping;

                while ( viewDate.isSame( currentMinute, 'h' ) ) {
                    if ( currentMinute.minute() % (step * 4) === 0 ) {
                        row = $( '<tr>' );
                        html.push( row );
                    }
                    row.append( '<td data-action="selectMinute" class="minute' + (!isValid( currentMinute, 'm' ) ? ' disabled' : '') + '">' + currentMinute.format( 'mm' ) + '</td>' );
                    currentMinute.add( step, 'm' );
                }
                table.empty().append( html );
            },

            fillSeconds                   = function () {
                var table         = widget.find( '.timepicker-seconds table' ),
                    currentSecond = viewDate.clone().startOf( 'm' ),
                    html          = [],
                    row           = $( '<tr>' );

                while ( viewDate.isSame( currentSecond, 'm' ) ) {
                    if ( currentSecond.second() % 20 === 0 ) {
                        row = $( '<tr>' );
                        html.push( row );
                    }
                    row.append( '<td data-action="selectSecond" class="second' + (!isValid( currentSecond, 's' ) ? ' disabled' : '') + '">' + currentSecond.format( 'ss' ) + '</td>' );
                    currentSecond.add( 5, 's' );
                }

                table.empty().append( html );
            },

            fillTime                      = function () {
                var toggle, newDate, timeComponents = widget.find( '.timepicker span[data-time-component]' );

                if ( !use24Hours ) {
                    toggle  = widget.find( '.timepicker [data-action=togglePeriod]' );
                    newDate = date.clone().add( (date.hours() >= 12) ? -12 : 12, 'h' );

                    toggle.text( date.format( 'A' ) );

                    if ( isValid( newDate, 'h' ) ) {
                        toggle.removeClass( 'disabled' );
                    } else {
                        toggle.addClass( 'disabled' );
                    }
                }
                timeComponents.filter( '[data-time-component=hours]' ).text( date.format( use24Hours ? 'HH' : 'hh' ) );
                timeComponents.filter( '[data-time-component=minutes]' ).text( date.format( 'mm' ) );
                timeComponents.filter( '[data-time-component=seconds]' ).text( date.format( 'ss' ) );

                fillHours();
                fillMinutes();
                fillSeconds();
            },

            update                        = function () {
                if ( !widget ) {
                    return;
                }
                fillDate();
                fillTime();
            },

            setValue                      = function ( targetMoment ) {
                var oldDate = unset ? null : date;

                // case of calling setValue(null or false)
                if ( !targetMoment ) {
                    unset = true;
                    input.val( '' );
                    element.data( 'date', '' );
                    notifyEvent( {
                        type: 'dp.change',
                        date: false,
                        oldDate: oldDate
                    } );
                    update();
                    return;
                }

                targetMoment = targetMoment.clone().locale( options.locale );

                if ( options.stepping !== 1 ) {
                    targetMoment.minutes( (Math.round( targetMoment.minutes() / options.stepping ) * options.stepping) % 60 ).seconds( 0 );
                }

                if ( isValid( targetMoment ) ) {
                    date     = targetMoment;
                    viewDate = date.clone();
                    input.val( date.format( actualFormat ) );
                    element.data( 'date', date.format( actualFormat ) );
                    unset = false;
                    update();
                    notifyEvent( {
                        type: 'dp.change',
                        date: date.clone(),
                        oldDate: oldDate
                    } );
                } else {
                    if ( !options.keepInvalid ) {
                        input.val( unset ? '' : date.format( actualFormat ) );
                    }
                    notifyEvent( {
                        type: 'dp.error',
                        date: targetMoment
                    } );
                }
            },

            hide                          = function () {
                ///<summary>Hides the widget. Possibly will emit dp.hide</summary>
                var transitioning = false;
                if ( !widget ) {
                    return picker;
                }
                // Ignore event if in the middle of a picker transition
                widget.find( '.collapse' ).each( function () {
                    var collapseData = $( this ).data( 'collapse' );
                    if ( collapseData && collapseData.transitioning ) {
                        transitioning = true;
                        return false;
                    }
                    return true;
                } );
                if ( transitioning ) {
                    return picker;
                }
                if ( component && component.hasClass( 'btn' ) ) {
                    component.toggleClass( 'active' );
                }
                widget.hide();

                $( window ).off( 'resize', place );
                widget.off( 'click', '[data-action]' );
                widget.off( 'mousedown', false );

                widget.remove();
                widget = false;

                notifyEvent( {
                    type: 'dp.hide',
                    date: date.clone()
                } );
                return picker;
            },

            clear                         = function () {
                setValue( null );
            },

            /********************************************************************************
             *
             * Widget UI interaction functions
             *
             ********************************************************************************/
            actions                       = {
                next: function () {
                    var navFnc = datePickerModes[ currentViewMode ].navFnc;
                    viewDate.add( datePickerModes[ currentViewMode ].navStep, navFnc );
                    fillDate();
                    viewUpdate( navFnc );
                },

                previous: function () {
                    var navFnc = datePickerModes[ currentViewMode ].navFnc;
                    viewDate.subtract( datePickerModes[ currentViewMode ].navStep, navFnc );
                    fillDate();
                    viewUpdate( navFnc );
                },

                pickerSwitch: function () {
                    showMode( 1 );
                },

                selectMonth: function ( e ) {
                    var month = $( e.target ).closest( 'tbody' ).find( 'span' ).index( $( e.target ) );
                    viewDate.month( month );
                    if ( currentViewMode === minViewModeNumber ) {
                        setValue( date.clone().year( viewDate.year() ).month( viewDate.month() ) );
                        if ( !options.inline ) {
                            hide();
                        }
                    } else {
                        showMode( -1 );
                        fillDate();
                    }
                    viewUpdate( 'M' );
                },

                selectYear: function ( e ) {
                    var year = parseInt( $( e.target ).text(), 10 ) || 0;
                    viewDate.year( year );
                    if ( currentViewMode === minViewModeNumber ) {
                        setValue( date.clone().year( viewDate.year() ) );
                        if ( !options.inline ) {
                            hide();
                        }
                    } else {
                        showMode( -1 );
                        fillDate();
                    }
                    viewUpdate( 'YYYY' );
                },

                selectDecade: function ( e ) {
                    var year = parseInt( $( e.target ).data( 'selection' ), 10 ) || 0;
                    viewDate.year( year );
                    if ( currentViewMode === minViewModeNumber ) {
                        setValue( date.clone().year( viewDate.year() ) );
                        if ( !options.inline ) {
                            hide();
                        }
                    } else {
                        showMode( -1 );
                        fillDate();
                    }
                    viewUpdate( 'YYYY' );
                },

                selectDay: function ( e ) {
                    var day = viewDate.clone();
                    if ( $( e.target ).is( '.old' ) ) {
                        day.subtract( 1, 'M' );
                    }
                    if ( $( e.target ).is( '.new' ) ) {
                        day.add( 1, 'M' );
                    }
                    setValue( day.date( parseInt( $( e.target ).text(), 10 ) ) );
                    if ( !hasTime() && !options.keepOpen && !options.inline ) {
                        hide();
                    }
                },

                incrementHours: function () {
                    var newDate = date.clone().add( 1, 'h' );
                    if ( isValid( newDate, 'h' ) ) {
                        setValue( newDate );
                    }
                },

                incrementMinutes: function () {
                    var newDate = date.clone().add( options.stepping, 'm' );
                    if ( isValid( newDate, 'm' ) ) {
                        setValue( newDate );
                    }
                },

                incrementSeconds: function () {
                    var newDate = date.clone().add( 1, 's' );
                    if ( isValid( newDate, 's' ) ) {
                        setValue( newDate );
                    }
                },

                decrementHours: function () {
                    var newDate = date.clone().subtract( 1, 'h' );
                    if ( isValid( newDate, 'h' ) ) {
                        setValue( newDate );
                    }
                },

                decrementMinutes: function () {
                    var newDate = date.clone().subtract( options.stepping, 'm' );
                    if ( isValid( newDate, 'm' ) ) {
                        setValue( newDate );
                    }
                },

                decrementSeconds: function () {
                    var newDate = date.clone().subtract( 1, 's' );
                    if ( isValid( newDate, 's' ) ) {
                        setValue( newDate );
                    }
                },

                togglePeriod: function () {
                    setValue( date.clone().add( (date.hours() >= 12) ? -12 : 12, 'h' ) );
                },

                togglePicker: function ( e ) {
                    var $this    = $( e.target ),
                        $parent  = $this.closest( 'ul' ),
                        expanded = $parent.find( '.in' ),
                        closed   = $parent.find( '.collapse:not(.in)' ),
                        collapseData;

                    if ( expanded && expanded.length ) {
                        collapseData = expanded.data( 'collapse' );
                        if ( collapseData && collapseData.transitioning ) {
                            return;
                        }
                        if ( expanded.collapse ) { // if collapse plugin is available through bootstrap.js then use it
                            expanded.collapse( 'hide' );
                            closed.collapse( 'show' );
                        } else { // otherwise just toggle in class on the two views
                            expanded.removeClass( 'in' );
                            closed.addClass( 'in' );
                        }
                        if ( $this.is( 'span' ) ) {
                            $this.toggleClass( options.icons.time + ' ' + options.icons.date );
                        } else {
                            $this.find( 'span' ).toggleClass( options.icons.time + ' ' + options.icons.date );
                        }

                        // NOTE: uncomment if toggled state will be restored in show()
                        //if (component) {
                        //    component.find('span').toggleClass(options.icons.time + ' ' + options.icons.date);
                        //}
                    }
                },

                showPicker: function () {
                    widget.find( '.timepicker > div:not(.timepicker-picker)' ).hide();
                    widget.find( '.timepicker .timepicker-picker' ).show();
                },

                showHours: function () {
                    widget.find( '.timepicker .timepicker-picker' ).hide();
                    widget.find( '.timepicker .timepicker-hours' ).show();
                },

                showMinutes: function () {
                    widget.find( '.timepicker .timepicker-picker' ).hide();
                    widget.find( '.timepicker .timepicker-minutes' ).show();
                },

                showSeconds: function () {
                    widget.find( '.timepicker .timepicker-picker' ).hide();
                    widget.find( '.timepicker .timepicker-seconds' ).show();
                },

                selectHour: function ( e ) {
                    var hour = parseInt( $( e.target ).text(), 10 );

                    if ( !use24Hours ) {
                        if ( date.hours() >= 12 ) {
                            if ( hour !== 12 ) {
                                hour += 12;
                            }
                        } else {
                            if ( hour === 12 ) {
                                hour = 0;
                            }
                        }
                    }
                    setValue( date.clone().hours( hour ) );
                    actions.showPicker.call( picker );
                },

                selectMinute: function ( e ) {
                    setValue( date.clone().minutes( parseInt( $( e.target ).text(), 10 ) ) );
                    actions.showPicker.call( picker );
                },

                selectSecond: function ( e ) {
                    setValue( date.clone().seconds( parseInt( $( e.target ).text(), 10 ) ) );
                    actions.showPicker.call( picker );
                },

                clear: clear,

                today: function () {
                    if ( isValid( moment(), 'd' ) ) {
                        setValue( moment() );
                    }
                },

                close: hide
            },

            doAction                      = function ( e ) {
                if ( $( e.currentTarget ).is( '.disabled' ) ) {
                    return false;
                }
                actions[ $( e.currentTarget ).data( 'action' ) ].apply( picker, arguments );
                return false;
            },

            show                          = function () {
                ///<summary>Shows the widget. Possibly will emit dp.show and dp.change</summary>
                var currentMoment,
                    useCurrentGranularity = {
                        'year': function ( m ) {
                            return m.month( 0 ).date( 1 ).hours( 0 ).seconds( 0 ).minutes( 0 );
                        },
                        'month': function ( m ) {
                            return m.date( 1 ).hours( 0 ).seconds( 0 ).minutes( 0 );
                        },
                        'day': function ( m ) {
                            return m.hours( 0 ).seconds( 0 ).minutes( 0 );
                        },
                        'hour': function ( m ) {
                            return m.seconds( 0 ).minutes( 0 );
                        },
                        'minute': function ( m ) {
                            return m.seconds( 0 );
                        }
                    };

                if ( input.prop( 'disabled' ) || (!options.ignoreReadonly && input.prop( 'readonly' )) || widget ) {
                    return picker;
                }
                if ( input.val() !== undefined && input.val().trim().length !== 0 ) {
                    setValue( parseInputDate( input.val().trim() ) );
                } else if ( options.useCurrent && unset && ((input.is( 'input' ) && input.val().trim().length === 0) || options.inline) ) {
                    currentMoment = moment();
                    if ( typeof options.useCurrent === 'string' ) {
                        currentMoment = useCurrentGranularity[ options.useCurrent ]( currentMoment );
                    }
                    setValue( currentMoment );
                }

                widget = getTemplate();

                fillDow();
                fillMonths();

                widget.find( '.timepicker-hours' ).hide();
                widget.find( '.timepicker-minutes' ).hide();
                widget.find( '.timepicker-seconds' ).hide();

                update();
                showMode();

                $( window ).on( 'resize', place );
                widget.on( 'click', '[data-action]', doAction ); // this handles clicks on the widget
                widget.on( 'mousedown', false );

                if ( component && component.hasClass( 'btn' ) ) {
                    component.toggleClass( 'active' );
                }
                widget.show();
                place();

                if ( options.focusOnShow && !input.is( ':focus' ) ) {
                    input.focus();
                }

                notifyEvent( {
                    type: 'dp.show'
                } );
                return picker;
            },

            toggle                        = function () {
                /// <summary>Shows or hides the widget</summary>
                return (widget ? hide() : show());
            },

            parseInputDate                = function ( inputDate ) {
                if ( options.parseInputDate === undefined ) {
                    if ( moment.isMoment( inputDate ) || inputDate instanceof Date ) {
                        inputDate = moment( inputDate );
                    } else {
                        inputDate = moment( inputDate, parseFormats, options.useStrict );
                    }
                } else {
                    inputDate = options.parseInputDate( inputDate );
                }
                inputDate.locale( options.locale );
                return inputDate;
            },

            keydown                       = function ( e ) {
                var handler          = null,
                    index,
                    index2,
                    pressedKeys      = [],
                    pressedModifiers = {},
                    currentKey       = e.which,
                    keyBindKeys,
                    allModifiersPressed,
                    pressed          = 'p';

                keyState[ currentKey ] = pressed;

                for ( index in keyState ) {
                    if ( keyState.hasOwnProperty( index ) && keyState[ index ] === pressed ) {
                        pressedKeys.push( index );
                        if ( parseInt( index, 10 ) !== currentKey ) {
                            pressedModifiers[ index ] = true;
                        }
                    }
                }

                for ( index in options.keyBinds ) {
                    if ( options.keyBinds.hasOwnProperty( index ) && typeof (options.keyBinds[ index ]) === 'function' ) {
                        keyBindKeys = index.split( ' ' );
                        if ( keyBindKeys.length === pressedKeys.length && keyMap[ currentKey ] === keyBindKeys[ keyBindKeys.length - 1 ] ) {
                            allModifiersPressed = true;
                            for ( index2 = keyBindKeys.length - 2; index2 >= 0; index2-- ) {
                                if ( !(keyMap[ keyBindKeys[ index2 ] ] in pressedModifiers) ) {
                                    allModifiersPressed = false;
                                    break;
                                }
                            }
                            if ( allModifiersPressed ) {
                                handler = options.keyBinds[ index ];
                                break;
                            }
                        }
                    }
                }

                if ( handler ) {
                    handler.call( picker, widget );
                    e.stopPropagation();
                    e.preventDefault();
                }
            },

            keyup                         = function ( e ) {
                keyState[ e.which ] = 'r';
                e.stopPropagation();
                e.preventDefault();
            },

            change                        = function ( e ) {
                var val        = $( e.target ).val().trim(),
                    parsedDate = val ? parseInputDate( val ) : null;
                setValue( parsedDate );
                e.stopImmediatePropagation();
                return false;
            },

            attachDatePickerElementEvents = function () {
                input.on( {
                    'change': change,
                    'blur': options.debug ? '' : hide,
                    'keydown': keydown,
                    'keyup': keyup,
                    'focus': options.allowInputToggle ? show : ''
                } );

                if ( element.is( 'input' ) ) {
                    input.on( {
                        'focus': show
                    } );
                } else if ( component ) {
                    component.on( 'click', toggle );
                    component.on( 'mousedown', false );
                }
            },

            detachDatePickerElementEvents = function () {
                input.off( {
                    'change': change,
                    'blur': hide,
                    'keydown': keydown,
                    'keyup': keyup,
                    'focus': options.allowInputToggle ? hide : ''
                } );

                if ( element.is( 'input' ) ) {
                    input.off( {
                        'focus': show
                    } );
                } else if ( component ) {
                    component.off( 'click', toggle );
                    component.off( 'mousedown', false );
                }
            },

            indexGivenDates               = function ( givenDatesArray ) {
                // Store given enabledDates and disabledDates as keys.
                // This way we can check their existence in O(1) time instead of looping through whole array.
                // (for example: options.enabledDates['2014-02-27'] === true)
                var givenDatesIndexed = {};
                $.each( givenDatesArray, function () {
                    var dDate = parseInputDate( this );
                    if ( dDate.isValid() ) {
                        givenDatesIndexed[ dDate.format( 'YYYY-MM-DD' ) ] = true;
                    }
                } );
                return (Object.keys( givenDatesIndexed ).length) ? givenDatesIndexed : false;
            },

            indexGivenHours               = function ( givenHoursArray ) {
                // Store given enabledHours and disabledHours as keys.
                // This way we can check their existence in O(1) time instead of looping through whole array.
                // (for example: options.enabledHours['2014-02-27'] === true)
                var givenHoursIndexed = {};
                $.each( givenHoursArray, function () {
                    givenHoursIndexed[ this ] = true;
                } );
                return (Object.keys( givenHoursIndexed ).length) ? givenHoursIndexed : false;
            },

            initFormatting                = function () {
                var format = options.format || 'L LT';

                actualFormat = format.replace( /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, function ( formatInput ) {
                    var newinput = date.localeData().longDateFormat( formatInput ) || formatInput;
                    return newinput.replace( /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, function ( formatInput2 ) { //temp fix for #740
                        return date.localeData().longDateFormat( formatInput2 ) || formatInput2;
                    } );
                } );

                parseFormats = options.extraFormats ? options.extraFormats.slice() : [];
                if ( parseFormats.indexOf( format ) < 0 && parseFormats.indexOf( actualFormat ) < 0 ) {
                    parseFormats.push( actualFormat );
                }

                use24Hours = (actualFormat.toLowerCase().indexOf( 'a' ) < 1 && actualFormat.replace( /\[.*?\]/g, '' ).indexOf( 'h' ) < 1);

                if ( isEnabled( 'y' ) ) {
                    minViewModeNumber = 2;
                }
                if ( isEnabled( 'M' ) ) {
                    minViewModeNumber = 1;
                }
                if ( isEnabled( 'd' ) ) {
                    minViewModeNumber = 0;
                }

                currentViewMode = Math.max( minViewModeNumber, currentViewMode );

                if ( !unset ) {
                    setValue( date );
                }
            };

        /********************************************************************************
         *
         * Public API functions
         * =====================
         *
         * Important: Do not expose direct references to private objects or the options
         * object to the outer world. Always return a clone when returning values or make
         * a clone when setting a private variable.
         *
         ********************************************************************************/
        picker.destroy = function () {
            ///<summary>Destroys the widget and removes all attached event listeners</summary>
            hide();
            detachDatePickerElementEvents();
            element.removeData( 'DateTimePicker' );
            element.removeData( 'date' );
        };

        picker.toggle = toggle;

        picker.show = show;

        picker.hide = hide;

        picker.disable = function () {
            ///<summary>Disables the input element, the component is attached to, by adding a disabled="true" attribute to it.
            ///If the widget was visible before that call it is hidden. Possibly emits dp.hide</summary>
            hide();
            if ( component && component.hasClass( 'btn' ) ) {
                component.addClass( 'disabled' );
            }
            input.prop( 'disabled', true );
            return picker;
        };

        picker.enable = function () {
            ///<summary>Enables the input element, the component is attached to, by removing disabled attribute from it.</summary>
            if ( component && component.hasClass( 'btn' ) ) {
                component.removeClass( 'disabled' );
            }
            input.prop( 'disabled', false );
            return picker;
        };

        picker.ignoreReadonly = function ( ignoreReadonly ) {
            if ( arguments.length === 0 ) {
                return options.ignoreReadonly;
            }
            if ( typeof ignoreReadonly !== 'boolean' ) {
                throw new TypeError( 'ignoreReadonly () expects a boolean parameter' );
            }
            options.ignoreReadonly = ignoreReadonly;
            return picker;
        };

        picker.options = function ( newOptions ) {
            if ( arguments.length === 0 ) {
                return $.extend( true, {}, options );
            }

            if ( !(newOptions instanceof Object) ) {
                throw new TypeError( 'options() options parameter should be an object' );
            }
            $.extend( true, options, newOptions );
            $.each( options, function ( key, value ) {
                if ( picker[ key ] !== undefined ) {
                    picker[ key ]( value );
                } else {
                    throw new TypeError( 'option ' + key + ' is not recognized!' );
                }
            } );
            return picker;
        };

        picker.date = function ( newDate ) {
            ///<signature helpKeyword="$.fn.datetimepicker.date">
            ///<summary>Returns the component's model current date, a moment object or null if not set.</summary>
            ///<returns type="Moment">date.clone()</returns>
            ///</signature>
            ///<signature>
            ///<summary>Sets the components model current moment to it. Passing a null value unsets the components model current moment. Parsing of the newDate parameter is made using moment library with the options.format and options.useStrict components configuration.</summary>
            ///<param name="newDate" locid="$.fn.datetimepicker.date_p:newDate">Takes string, Date, moment, null parameter.</param>
            ///</signature>
            if ( arguments.length === 0 ) {
                if ( unset ) {
                    return null;
                }
                return date.clone();
            }

            if ( newDate !== null && typeof newDate !== 'string' && !moment.isMoment( newDate ) && !(newDate instanceof Date) ) {
                throw new TypeError( 'date() parameter must be one of [null, string, moment or Date]' );
            }

            setValue( newDate === null ? null : parseInputDate( newDate ) );
            return picker;
        };

        picker.format = function ( newFormat ) {
            ///<summary>test su</summary>
            ///<param name="newFormat">info about para</param>
            ///<returns type="string|boolean">returns foo</returns>
            if ( arguments.length === 0 ) {
                return options.format;
            }

            if ( (typeof newFormat !== 'string') && ((typeof newFormat !== 'boolean') || (newFormat !== false)) ) {
                throw new TypeError( 'format() expects a sting or boolean:false parameter ' + newFormat );
            }

            options.format = newFormat;
            if ( actualFormat ) {
                initFormatting(); // reinit formatting
            }
            return picker;
        };

        picker.dayViewHeaderFormat = function ( newFormat ) {
            if ( arguments.length === 0 ) {
                return options.dayViewHeaderFormat;
            }

            if ( typeof newFormat !== 'string' ) {
                throw new TypeError( 'dayViewHeaderFormat() expects a string parameter' );
            }

            options.dayViewHeaderFormat = newFormat;
            return picker;
        };

        picker.extraFormats = function ( formats ) {
            if ( arguments.length === 0 ) {
                return options.extraFormats;
            }

            if ( formats !== false && !(formats instanceof Array) ) {
                throw new TypeError( 'extraFormats() expects an array or false parameter' );
            }

            options.extraFormats = formats;
            if ( parseFormats ) {
                initFormatting(); // reinit formatting
            }
            return picker;
        };

        picker.disabledDates = function ( dates ) {
            ///<signature helpKeyword="$.fn.datetimepicker.disabledDates">
            ///<summary>Returns an array with the currently set disabled dates on the component.</summary>
            ///<returns type="array">options.disabledDates</returns>
            ///</signature>
            ///<signature>
            ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of
            ///options.enabledDates if such exist.</summary>
            ///<param name="dates" locid="$.fn.datetimepicker.disabledDates_p:dates">Takes an [ string or Date or moment ] of values and allows the user to select only from those days.</param>
            ///</signature>
            if ( arguments.length === 0 ) {
                return (options.disabledDates ? $.extend( {}, options.disabledDates ) : options.disabledDates);
            }

            if ( !dates ) {
                options.disabledDates = false;
                update();
                return picker;
            }
            if ( !(dates instanceof Array) ) {
                throw new TypeError( 'disabledDates() expects an array parameter' );
            }
            options.disabledDates = indexGivenDates( dates );
            options.enabledDates  = false;
            update();
            return picker;
        };

        picker.enabledDates = function ( dates ) {
            ///<signature helpKeyword="$.fn.datetimepicker.enabledDates">
            ///<summary>Returns an array with the currently set enabled dates on the component.</summary>
            ///<returns type="array">options.enabledDates</returns>
            ///</signature>
            ///<signature>
            ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of options.disabledDates if such exist.</summary>
            ///<param name="dates" locid="$.fn.datetimepicker.enabledDates_p:dates">Takes an [ string or Date or moment ] of values and allows the user to select only from those days.</param>
            ///</signature>
            if ( arguments.length === 0 ) {
                return (options.enabledDates ? $.extend( {}, options.enabledDates ) : options.enabledDates);
            }

            if ( !dates ) {
                options.enabledDates = false;
                update();
                return picker;
            }
            if ( !(dates instanceof Array) ) {
                throw new TypeError( 'enabledDates() expects an array parameter' );
            }
            options.enabledDates  = indexGivenDates( dates );
            options.disabledDates = false;
            update();
            return picker;
        };

        picker.daysOfWeekDisabled = function ( daysOfWeekDisabled ) {
            if ( arguments.length === 0 ) {
                return options.daysOfWeekDisabled.splice( 0 );
            }

            if ( (typeof daysOfWeekDisabled === 'boolean') && !daysOfWeekDisabled ) {
                options.daysOfWeekDisabled = false;
                update();
                return picker;
            }

            if ( !(daysOfWeekDisabled instanceof Array) ) {
                throw new TypeError( 'daysOfWeekDisabled() expects an array parameter' );
            }
            options.daysOfWeekDisabled = daysOfWeekDisabled.reduce( function ( previousValue, currentValue ) {
                currentValue = parseInt( currentValue, 10 );
                if ( currentValue > 6 || currentValue < 0 || isNaN( currentValue ) ) {
                    return previousValue;
                }
                if ( previousValue.indexOf( currentValue ) === -1 ) {
                    previousValue.push( currentValue );
                }
                return previousValue;
            }, [] ).sort();
            if ( options.useCurrent && !options.keepInvalid ) {
                var tries = 0;
                while ( !isValid( date, 'd' ) ) {
                    date.add( 1, 'd' );
                    if ( tries === 7 ) {
                        throw 'Tried 7 times to find a valid date';
                    }
                    tries++;
                }
                setValue( date );
            }
            update();
            return picker;
        };

        picker.maxDate = function ( maxDate ) {
            if ( arguments.length === 0 ) {
                return options.maxDate ? options.maxDate.clone() : options.maxDate;
            }

            if ( (typeof maxDate === 'boolean') && maxDate === false ) {
                options.maxDate = false;
                update();
                return picker;
            }

            if ( typeof maxDate === 'string' ) {
                if ( maxDate === 'now' || maxDate === 'moment' ) {
                    maxDate = moment();
                }
            }

            var parsedDate = parseInputDate( maxDate );

            if ( !parsedDate.isValid() ) {
                throw new TypeError( 'maxDate() Could not parse date parameter: ' + maxDate );
            }
            if ( options.minDate && parsedDate.isBefore( options.minDate ) ) {
                throw new TypeError( 'maxDate() date parameter is before options.minDate: ' + parsedDate.format( actualFormat ) );
            }
            options.maxDate = parsedDate;
            if ( options.useCurrent && !options.keepInvalid && date.isAfter( maxDate ) ) {
                setValue( options.maxDate );
            }
            if ( viewDate.isAfter( parsedDate ) ) {
                viewDate = parsedDate.clone();
            }
            update();
            return picker;
        };

        picker.minDate = function ( minDate ) {
            if ( arguments.length === 0 ) {
                return options.minDate ? options.minDate.clone() : options.minDate;
            }

            if ( (typeof minDate === 'boolean') && minDate === false ) {
                options.minDate = false;
                update();
                return picker;
            }

            if ( typeof minDate === 'string' ) {
                if ( minDate === 'now' || minDate === 'moment' ) {
                    minDate = moment();
                }
            }

            var parsedDate = parseInputDate( minDate );

            if ( !parsedDate.isValid() ) {
                throw new TypeError( 'minDate() Could not parse date parameter: ' + minDate );
            }
            if ( options.maxDate && parsedDate.isAfter( options.maxDate ) ) {
                throw new TypeError( 'minDate() date parameter is after options.maxDate: ' + parsedDate.format( actualFormat ) );
            }
            options.minDate = parsedDate;
            if ( options.useCurrent && !options.keepInvalid && date.isBefore( minDate ) ) {
                setValue( options.minDate );
            }
            if ( viewDate.isBefore( parsedDate ) ) {
                viewDate = parsedDate.clone();
            }
            update();
            return picker;
        };

        picker.defaultDate = function ( defaultDate ) {
            ///<signature helpKeyword="$.fn.datetimepicker.defaultDate">
            ///<summary>Returns a moment with the options.defaultDate option configuration or false if not set</summary>
            ///<returns type="Moment">date.clone()</returns>
            ///</signature>
            ///<signature>
            ///<summary>Will set the picker's inital date. If a boolean:false value is passed the options.defaultDate parameter is cleared.</summary>
            ///<param name="defaultDate" locid="$.fn.datetimepicker.defaultDate_p:defaultDate">Takes a string, Date, moment, boolean:false</param>
            ///</signature>
            if ( arguments.length === 0 ) {
                return options.defaultDate ? options.defaultDate.clone() : options.defaultDate;
            }
            if ( !defaultDate ) {
                options.defaultDate = false;
                return picker;
            }

            if ( typeof defaultDate === 'string' ) {
                if ( defaultDate === 'now' || defaultDate === 'moment' ) {
                    defaultDate = moment();
                }
            }

            var parsedDate = parseInputDate( defaultDate );
            if ( !parsedDate.isValid() ) {
                throw new TypeError( 'defaultDate() Could not parse date parameter: ' + defaultDate );
            }
            if ( !isValid( parsedDate ) ) {
                throw new TypeError( 'defaultDate() date passed is invalid according to component setup validations' );
            }

            options.defaultDate = parsedDate;

            if ( options.defaultDate && options.inline || (input.val().trim() === '' && input.attr( 'placeholder' ) === undefined) ) {
                setValue( options.defaultDate );
            }
            return picker;
        };

        picker.locale = function ( locale ) {
            if ( arguments.length === 0 ) {
                return options.locale;
            }

            if ( !moment.localeData( locale ) ) {
                throw new TypeError( 'locale() locale ' + locale + ' is not loaded from moment locales!' );
            }

            options.locale = locale;
            date.locale( options.locale );
            viewDate.locale( options.locale );

            if ( actualFormat ) {
                initFormatting(); // reinit formatting
            }
            if ( widget ) {
                hide();
                show();
            }
            return picker;
        };

        picker.stepping = function ( stepping ) {
            if ( arguments.length === 0 ) {
                return options.stepping;
            }

            stepping = parseInt( stepping, 10 );
            if ( isNaN( stepping ) || stepping < 1 ) {
                stepping = 1;
            }
            options.stepping = stepping;
            return picker;
        };

        picker.useCurrent = function ( useCurrent ) {
            var useCurrentOptions = [ 'year', 'month', 'day', 'hour', 'minute' ];
            if ( arguments.length === 0 ) {
                return options.useCurrent;
            }

            if ( (typeof useCurrent !== 'boolean') && (typeof useCurrent !== 'string') ) {
                throw new TypeError( 'useCurrent() expects a boolean or string parameter' );
            }
            if ( typeof useCurrent === 'string' && useCurrentOptions.indexOf( useCurrent.toLowerCase() ) === -1 ) {
                throw new TypeError( 'useCurrent() expects a string parameter of ' + useCurrentOptions.join( ', ' ) );
            }
            options.useCurrent = useCurrent;
            return picker;
        };

        picker.collapse = function ( collapse ) {
            if ( arguments.length === 0 ) {
                return options.collapse;
            }

            if ( typeof collapse !== 'boolean' ) {
                throw new TypeError( 'collapse() expects a boolean parameter' );
            }
            if ( options.collapse === collapse ) {
                return picker;
            }
            options.collapse = collapse;
            if ( widget ) {
                hide();
                show();
            }
            return picker;
        };

        picker.icons = function ( icons ) {
            if ( arguments.length === 0 ) {
                return $.extend( {}, options.icons );
            }

            if ( !(icons instanceof Object) ) {
                throw new TypeError( 'icons() expects parameter to be an Object' );
            }
            $.extend( options.icons, icons );
            if ( widget ) {
                hide();
                show();
            }
            return picker;
        };

        picker.useStrict = function ( useStrict ) {
            if ( arguments.length === 0 ) {
                return options.useStrict;
            }

            if ( typeof useStrict !== 'boolean' ) {
                throw new TypeError( 'useStrict() expects a boolean parameter' );
            }
            options.useStrict = useStrict;
            return picker;
        };

        picker.sideBySide = function ( sideBySide ) {
            if ( arguments.length === 0 ) {
                return options.sideBySide;
            }

            if ( typeof sideBySide !== 'boolean' ) {
                throw new TypeError( 'sideBySide() expects a boolean parameter' );
            }
            options.sideBySide = sideBySide;
            if ( widget ) {
                hide();
                show();
            }
            return picker;
        };

        picker.viewMode = function ( viewMode ) {
            if ( arguments.length === 0 ) {
                return options.viewMode;
            }

            if ( typeof viewMode !== 'string' ) {
                throw new TypeError( 'viewMode() expects a string parameter' );
            }

            if ( viewModes.indexOf( viewMode ) === -1 ) {
                throw new TypeError( 'viewMode() parameter must be one of (' + viewModes.join( ', ' ) + ') value' );
            }

            options.viewMode = viewMode;
            currentViewMode  = Math.max( viewModes.indexOf( viewMode ), minViewModeNumber );

            showMode();
            return picker;
        };

        picker.toolbarPlacement = function ( toolbarPlacement ) {
            if ( arguments.length === 0 ) {
                return options.toolbarPlacement;
            }

            if ( typeof toolbarPlacement !== 'string' ) {
                throw new TypeError( 'toolbarPlacement() expects a string parameter' );
            }
            if ( toolbarPlacements.indexOf( toolbarPlacement ) === -1 ) {
                throw new TypeError( 'toolbarPlacement() parameter must be one of (' + toolbarPlacements.join( ', ' ) + ') value' );
            }
            options.toolbarPlacement = toolbarPlacement;

            if ( widget ) {
                hide();
                show();
            }
            return picker;
        };

        picker.widgetPositioning = function ( widgetPositioning ) {
            if ( arguments.length === 0 ) {
                return $.extend( {}, options.widgetPositioning );
            }

            if ( ({}).toString.call( widgetPositioning ) !== '[object Object]' ) {
                throw new TypeError( 'widgetPositioning() expects an object variable' );
            }
            if ( widgetPositioning.horizontal ) {
                if ( typeof widgetPositioning.horizontal !== 'string' ) {
                    throw new TypeError( 'widgetPositioning() horizontal variable must be a string' );
                }
                widgetPositioning.horizontal = widgetPositioning.horizontal.toLowerCase();
                if ( horizontalModes.indexOf( widgetPositioning.horizontal ) === -1 ) {
                    throw new TypeError( 'widgetPositioning() expects horizontal parameter to be one of (' + horizontalModes.join( ', ' ) + ')' );
                }
                options.widgetPositioning.horizontal = widgetPositioning.horizontal;
            }
            if ( widgetPositioning.vertical ) {
                if ( typeof widgetPositioning.vertical !== 'string' ) {
                    throw new TypeError( 'widgetPositioning() vertical variable must be a string' );
                }
                widgetPositioning.vertical = widgetPositioning.vertical.toLowerCase();
                if ( verticalModes.indexOf( widgetPositioning.vertical ) === -1 ) {
                    throw new TypeError( 'widgetPositioning() expects vertical parameter to be one of (' + verticalModes.join( ', ' ) + ')' );
                }
                options.widgetPositioning.vertical = widgetPositioning.vertical;
            }
            update();
            return picker;
        };

        picker.calendarWeeks = function ( calendarWeeks ) {
            if ( arguments.length === 0 ) {
                return options.calendarWeeks;
            }

            if ( typeof calendarWeeks !== 'boolean' ) {
                throw new TypeError( 'calendarWeeks() expects parameter to be a boolean value' );
            }

            options.calendarWeeks = calendarWeeks;
            update();
            return picker;
        };

        picker.showTodayButton = function ( showTodayButton ) {
            if ( arguments.length === 0 ) {
                return options.showTodayButton;
            }

            if ( typeof showTodayButton !== 'boolean' ) {
                throw new TypeError( 'showTodayButton() expects a boolean parameter' );
            }

            options.showTodayButton = showTodayButton;
            if ( widget ) {
                hide();
                show();
            }
            return picker;
        };

        picker.showClear = function ( showClear ) {
            if ( arguments.length === 0 ) {
                return options.showClear;
            }

            if ( typeof showClear !== 'boolean' ) {
                throw new TypeError( 'showClear() expects a boolean parameter' );
            }

            options.showClear = showClear;
            if ( widget ) {
                hide();
                show();
            }
            return picker;
        };

        picker.widgetParent = function ( widgetParent ) {
            if ( arguments.length === 0 ) {
                return options.widgetParent;
            }

            if ( typeof widgetParent === 'string' ) {
                widgetParent = $( widgetParent );
            }

            if ( widgetParent !== null && (typeof widgetParent !== 'string' && !(widgetParent instanceof $)) ) {
                throw new TypeError( 'widgetParent() expects a string or a jQuery object parameter' );
            }

            options.widgetParent = widgetParent;
            if ( widget ) {
                hide();
                show();
            }
            return picker;
        };

        picker.keepOpen = function ( keepOpen ) {
            if ( arguments.length === 0 ) {
                return options.keepOpen;
            }

            if ( typeof keepOpen !== 'boolean' ) {
                throw new TypeError( 'keepOpen() expects a boolean parameter' );
            }

            options.keepOpen = keepOpen;
            return picker;
        };

        picker.focusOnShow = function ( focusOnShow ) {
            if ( arguments.length === 0 ) {
                return options.focusOnShow;
            }

            if ( typeof focusOnShow !== 'boolean' ) {
                throw new TypeError( 'focusOnShow() expects a boolean parameter' );
            }

            options.focusOnShow = focusOnShow;
            return picker;
        };

        picker.inline = function ( inline ) {
            if ( arguments.length === 0 ) {
                return options.inline;
            }

            if ( typeof inline !== 'boolean' ) {
                throw new TypeError( 'inline() expects a boolean parameter' );
            }

            options.inline = inline;
            return picker;
        };

        picker.clear = function () {
            clear();
            return picker;
        };

        picker.keyBinds = function ( keyBinds ) {
            options.keyBinds = keyBinds;
            return picker;
        };

        picker.debug = function ( debug ) {
            if ( typeof debug !== 'boolean' ) {
                throw new TypeError( 'debug() expects a boolean parameter' );
            }

            options.debug = debug;
            return picker;
        };

        picker.allowInputToggle = function ( allowInputToggle ) {
            if ( arguments.length === 0 ) {
                return options.allowInputToggle;
            }

            if ( typeof allowInputToggle !== 'boolean' ) {
                throw new TypeError( 'allowInputToggle() expects a boolean parameter' );
            }

            options.allowInputToggle = allowInputToggle;
            return picker;
        };

        picker.showClose = function ( showClose ) {
            if ( arguments.length === 0 ) {
                return options.showClose;
            }

            if ( typeof showClose !== 'boolean' ) {
                throw new TypeError( 'showClose() expects a boolean parameter' );
            }

            options.showClose = showClose;
            return picker;
        };

        picker.keepInvalid = function ( keepInvalid ) {
            if ( arguments.length === 0 ) {
                return options.keepInvalid;
            }

            if ( typeof keepInvalid !== 'boolean' ) {
                throw new TypeError( 'keepInvalid() expects a boolean parameter' );
            }
            options.keepInvalid = keepInvalid;
            return picker;
        };

        picker.datepickerInput = function ( datepickerInput ) {
            if ( arguments.length === 0 ) {
                return options.datepickerInput;
            }

            if ( typeof datepickerInput !== 'string' ) {
                throw new TypeError( 'datepickerInput() expects a string parameter' );
            }

            options.datepickerInput = datepickerInput;
            return picker;
        };

        picker.parseInputDate = function ( parseInputDate ) {
            if ( arguments.length === 0 ) {
                return options.parseInputDate;
            }

            if ( typeof parseInputDate !== 'function' ) {
                throw new TypeError( 'parseInputDate() sholud be as function' );
            }

            options.parseInputDate = parseInputDate;

            return picker;
        };

        picker.disabledTimeIntervals = function ( disabledTimeIntervals ) {
            ///<signature helpKeyword="$.fn.datetimepicker.disabledTimeIntervals">
            ///<summary>Returns an array with the currently set disabled dates on the component.</summary>
            ///<returns type="array">options.disabledTimeIntervals</returns>
            ///</signature>
            ///<signature>
            ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of
            ///options.enabledDates if such exist.</summary>
            ///<param name="dates" locid="$.fn.datetimepicker.disabledTimeIntervals_p:dates">Takes an [ string or Date or moment ] of values and allows the user to select only from those days.</param>
            ///</signature>
            if ( arguments.length === 0 ) {
                return (options.disabledTimeIntervals ? $.extend( {}, options.disabledTimeIntervals ) : options.disabledTimeIntervals);
            }

            if ( !disabledTimeIntervals ) {
                options.disabledTimeIntervals = false;
                update();
                return picker;
            }
            if ( !(disabledTimeIntervals instanceof Array) ) {
                throw new TypeError( 'disabledTimeIntervals() expects an array parameter' );
            }
            options.disabledTimeIntervals = disabledTimeIntervals;
            update();
            return picker;
        };

        picker.disabledHours = function ( hours ) {
            ///<signature helpKeyword="$.fn.datetimepicker.disabledHours">
            ///<summary>Returns an array with the currently set disabled hours on the component.</summary>
            ///<returns type="array">options.disabledHours</returns>
            ///</signature>
            ///<signature>
            ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of
            ///options.enabledHours if such exist.</summary>
            ///<param name="hours" locid="$.fn.datetimepicker.disabledHours_p:hours">Takes an [ int ] of values and disallows the user to select only from those hours.</param>
            ///</signature>
            if ( arguments.length === 0 ) {
                return (options.disabledHours ? $.extend( {}, options.disabledHours ) : options.disabledHours);
            }

            if ( !hours ) {
                options.disabledHours = false;
                update();
                return picker;
            }
            if ( !(hours instanceof Array) ) {
                throw new TypeError( 'disabledHours() expects an array parameter' );
            }
            options.disabledHours = indexGivenHours( hours );
            options.enabledHours  = false;
            if ( options.useCurrent && !options.keepInvalid ) {
                var tries = 0;
                while ( !isValid( date, 'h' ) ) {
                    date.add( 1, 'h' );
                    if ( tries === 24 ) {
                        throw 'Tried 24 times to find a valid date';
                    }
                    tries++;
                }
                setValue( date );
            }
            update();
            return picker;
        };

        picker.enabledHours = function ( hours ) {
            ///<signature helpKeyword="$.fn.datetimepicker.enabledHours">
            ///<summary>Returns an array with the currently set enabled hours on the component.</summary>
            ///<returns type="array">options.enabledHours</returns>
            ///</signature>
            ///<signature>
            ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of options.disabledHours if such exist.</summary>
            ///<param name="hours" locid="$.fn.datetimepicker.enabledHours_p:hours">Takes an [ int ] of values and allows the user to select only from those hours.</param>
            ///</signature>
            if ( arguments.length === 0 ) {
                return (options.enabledHours ? $.extend( {}, options.enabledHours ) : options.enabledHours);
            }

            if ( !hours ) {
                options.enabledHours = false;
                update();
                return picker;
            }
            if ( !(hours instanceof Array) ) {
                throw new TypeError( 'enabledHours() expects an array parameter' );
            }
            options.enabledHours  = indexGivenHours( hours );
            options.disabledHours = false;
            if ( options.useCurrent && !options.keepInvalid ) {
                var tries = 0;
                while ( !isValid( date, 'h' ) ) {
                    date.add( 1, 'h' );
                    if ( tries === 24 ) {
                        throw 'Tried 24 times to find a valid date';
                    }
                    tries++;
                }
                setValue( date );
            }
            update();
            return picker;
        };

        picker.viewDate = function ( newDate ) {
            ///<signature helpKeyword="$.fn.datetimepicker.viewDate">
            ///<summary>Returns the component's model current viewDate, a moment object or null if not set.</summary>
            ///<returns type="Moment">viewDate.clone()</returns>
            ///</signature>
            ///<signature>
            ///<summary>Sets the components model current moment to it. Passing a null value unsets the components model current moment. Parsing of the newDate parameter is made using moment library with the options.format and options.useStrict components configuration.</summary>
            ///<param name="newDate" locid="$.fn.datetimepicker.date_p:newDate">Takes string, viewDate, moment, null parameter.</param>
            ///</signature>
            if ( arguments.length === 0 ) {
                return viewDate.clone();
            }

            if ( !newDate ) {
                viewDate = date.clone();
                return picker;
            }

            if ( typeof newDate !== 'string' && !moment.isMoment( newDate ) && !(newDate instanceof Date) ) {
                throw new TypeError( 'viewDate() parameter must be one of [string, moment or Date]' );
            }

            viewDate = parseInputDate( newDate );
            viewUpdate();
            return picker;
        };

        // initializing element and component attributes
        if ( element.is( 'input' ) ) {
            input = element;
        } else {
            input = element.find( options.datepickerInput );
            if ( input.size() === 0 ) {
                input = element.find( 'input' );
            } else if ( !input.is( 'input' ) ) {
                throw new Error( 'CSS class "' + options.datepickerInput + '" cannot be applied to non input element' );
            }
        }

        if ( element.hasClass( 'input-group' ) ) {
            // in case there is more then one 'input-group-addon' Issue #48
            if ( element.find( '.datepickerbutton' ).size() === 0 ) {
                component = element.find( '[class^="input-group-"]' );
            } else {
                component = element.find( '.datepickerbutton' );
            }
        }

        if ( !options.inline && !input.is( 'input' ) ) {
            throw new Error( 'Could not initialize DateTimePicker without an input element' );
        }

        $.extend( true, options, dataToOptions() );

        picker.options( options );

        initFormatting();

        attachDatePickerElementEvents();

        if ( input.prop( 'disabled' ) ) {
            picker.disable();
        }
        if ( input.is( 'input' ) && input.val().trim().length !== 0 ) {
            setValue( parseInputDate( input.val().trim() ) );
        }
        else if ( options.defaultDate && input.attr( 'placeholder' ) === undefined ) {
            setValue( options.defaultDate );
        }
        if ( options.inline ) {
            show();
        }
        return picker;
    };

    /********************************************************************************
     *
     * jQuery plugin constructor and defaults object
     *
     ********************************************************************************/

    $.fn.datetimepicker = function ( options ) {
        return this.each( function () {
            var $this = $( this );
            if ( !$this.data( 'DateTimePicker' ) ) {
                // create a private copy of the defaults object
                options = $.extend( true, {}, $.fn.datetimepicker.defaults, options );
                $this.data( 'DateTimePicker', dateTimePicker( $this, options ) );
            }
        } );
    };

    $.fn.datetimepicker.defaults = {
        format: false,
        dayViewHeaderFormat: 'MMMM YYYY',
        extraFormats: false,
        stepping: 1,
        minDate: false,
        maxDate: false,
        useCurrent: true,
        collapse: true,
        locale: moment.locale(),
        defaultDate: false,
        disabledDates: false,
        enabledDates: false,
        icons: {
            time: 'glyphicon glyphicon-time',
            date: 'glyphicon glyphicon-calendar',
            up: 'glyphicon glyphicon-chevron-up',
            down: 'glyphicon glyphicon-chevron-down',
            previous: 'glyphicon glyphicon-chevron-left',
            next: 'glyphicon glyphicon-chevron-right',
            today: 'glyphicon glyphicon-screenshot',
            clear: 'glyphicon glyphicon-trash',
            close: 'glyphicon glyphicon-remove'
        },
        useStrict: false,
        sideBySide: false,
        daysOfWeekDisabled: false,
        calendarWeeks: false,
        viewMode: 'days',
        toolbarPlacement: 'default',
        showTodayButton: false,
        showClear: false,
        showClose: false,
        widgetPositioning: {
            horizontal: 'auto',
            vertical: 'auto'
        },
        widgetParent: null,
        ignoreReadonly: false,
        keepOpen: false,
        focusOnShow: true,
        inline: false,
        keepInvalid: false,
        datepickerInput: '.datepickerinput',
        keyBinds: {
            up: function ( widget ) {
                if ( !widget ) {
                    return;
                }
                var d = this.date() || moment();
                if ( widget.find( '.datepicker' ).is( ':visible' ) ) {
                    this.date( d.clone().subtract( 7, 'd' ) );
                } else {
                    this.date( d.clone().add( 1, 'm' ) );
                }
            },
            down: function ( widget ) {
                if ( !widget ) {
                    this.show();
                    return;
                }
                var d = this.date() || moment();
                if ( widget.find( '.datepicker' ).is( ':visible' ) ) {
                    this.date( d.clone().add( 7, 'd' ) );
                } else {
                    this.date( d.clone().subtract( 1, 'm' ) );
                }
            },
            'control up': function ( widget ) {
                if ( !widget ) {
                    return;
                }
                var d = this.date() || moment();
                if ( widget.find( '.datepicker' ).is( ':visible' ) ) {
                    this.date( d.clone().subtract( 1, 'y' ) );
                } else {
                    this.date( d.clone().add( 1, 'h' ) );
                }
            },
            'control down': function ( widget ) {
                if ( !widget ) {
                    return;
                }
                var d = this.date() || moment();
                if ( widget.find( '.datepicker' ).is( ':visible' ) ) {
                    this.date( d.clone().add( 1, 'y' ) );
                } else {
                    this.date( d.clone().subtract( 1, 'h' ) );
                }
            },
            left: function ( widget ) {
                if ( !widget ) {
                    return;
                }
                var d = this.date() || moment();
                if ( widget.find( '.datepicker' ).is( ':visible' ) ) {
                    this.date( d.clone().subtract( 1, 'd' ) );
                }
            },
            right: function ( widget ) {
                if ( !widget ) {
                    return;
                }
                var d = this.date() || moment();
                if ( widget.find( '.datepicker' ).is( ':visible' ) ) {
                    this.date( d.clone().add( 1, 'd' ) );
                }
            },
            pageUp: function ( widget ) {
                if ( !widget ) {
                    return;
                }
                var d = this.date() || moment();
                if ( widget.find( '.datepicker' ).is( ':visible' ) ) {
                    this.date( d.clone().subtract( 1, 'M' ) );
                }
            },
            pageDown: function ( widget ) {
                if ( !widget ) {
                    return;
                }
                var d = this.date() || moment();
                if ( widget.find( '.datepicker' ).is( ':visible' ) ) {
                    this.date( d.clone().add( 1, 'M' ) );
                }
            },
            enter: function () {
                this.hide();
            },
            escape: function () {
                this.hide();
            },
            //tab: function (widget) { //this break the flow of the form. disabling for now
            //    var toggle = widget.find('.picker-switch a[data-action="togglePicker"]');
            //    if(toggle.length > 0) toggle.click();
            //},
            'control space': function ( widget ) {
                if ( widget.find( '.timepicker' ).is( ':visible' ) ) {
                    widget.find( '.btn[data-action="togglePeriod"]' ).click();
                }
            },
            t: function () {
                this.date( moment() );
            },
            'delete': function () {
                this.clear();
            }
        },
        debug: false,
        allowInputToggle: false,
        disabledTimeIntervals: false,
        disabledHours: false,
        enabledHours: false,
        viewDate: false
    };
} ));
window.addEventListener( 'load', function () {
    var datepickerinfo = $( '#planificateSeanceMeta' );
    if ( datepickerinfo.length ) {
        var oUserInfoDate = {
            'defaultschoolyearbegin': datepickerinfo.data( 'defaultschoolyearbegin' ),
            'defaultschoolyearend': datepickerinfo.data( 'defaultschoolyearend' ),
            'defaultcoursduration': datepickerinfo.data( 'defaultcoursduration' ),
            'defaultdaybegin': datepickerinfo.data( 'defaultdaybegin' ),
            'defaultdayend': datepickerinfo.data( 'defaultdayend' )
        };
        console.log( oUserInfoDate );

        $( '.dateType-1' ).datetimepicker( {
            locale: 'fr',
            useCurrent: false,
            showClear: true,
            format: 'YYYY-MM-DD',
            minDate: moment().format( 'YYYY-MM-DD' ),
            maxDate: moment().add( 1, 'years' )
            //inline: true
        } );
        $( "#from" ).on( "dp.change", function ( e ) {
            $( '#to' ).data( "DateTimePicker" ).minDate( e.date );
        } );
        $( "#to" ).on( "dp.change", function ( e ) {
            $( '#from' ).data( "DateTimePicker" ).maxDate( e.date );
        } );

        $( '.hourType-1' ).datetimepicker( {
            format: 'HH:mm',
            showClear: true,
            useCurrent: false,
            stepping: 5
            //inline: true
        } );
        $( "#from_hour" ).on( "dp.change", function ( e ) {
            $( '#to_hour' ).data( "DateTimePicker" ).minDate( e.date );
        } );
        $( "#to_hour" ).on( "dp.change", function ( e ) {
            $( '#from_hour' ).data( "DateTimePicker" ).maxDate( e.date );
        } );
    }
} );

/*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.6
 *
 */
(function($) {

    $.fn.extend({
        slimScroll: function(options) {

            var defaults = {

                // width in pixels of the visible scroll area
                width : 'auto',

                // height in pixels of the visible scroll area
                height : '250px',

                // width in pixels of the scrollbar and rail
                size : '7px',

                // scrollbar color, accepts any hex/color value
                color: '#000',

                // scrollbar position - left/right
                position : 'right',

                // distance in pixels between the side edge and the scrollbar
                distance : '1px',

                // default scroll position on load - top / bottom / $('selector')
                start : 'top',

                // sets scrollbar opacity
                opacity : .4,

                // enables always-on mode for the scrollbar
                alwaysVisible : false,

                // check if we should hide the scrollbar when user is hovering over
                disableFadeOut : false,

                // sets visibility of the rail
                railVisible : false,

                // sets rail color
                railColor : '#333',

                // sets rail opacity
                railOpacity : .2,

                // whether  we should use jQuery UI Draggable to enable bar dragging
                railDraggable : true,

                // defautlt CSS class of the slimscroll rail
                railClass : 'slimScrollRail',

                // defautlt CSS class of the slimscroll bar
                barClass : 'slimScrollBar',

                // defautlt CSS class of the slimscroll wrapper
                wrapperClass : 'slimScrollDiv',

                // check if mousewheel should scroll the window if we reach top/bottom
                allowPageScroll : false,

                // scroll amount applied to each mouse wheel step
                wheelStep : 20,

                // scroll amount applied when user is using gestures
                touchScrollStep : 200,

                // sets border radius
                borderRadius: '7px',

                // sets border radius of the rail
                railBorderRadius : '7px'
            };

            var o = $.extend(defaults, options);

            // do it for every element that matches selector
            this.each(function(){

                var isOverPanel, isOverBar, isDragg, queueHide, touchDif,
                    barHeight, percentScroll, lastScroll,
                    divS = '<div></div>',
                    minBarHeight = 30,
                    releaseScroll = false;

                // used in event handlers and for better minification
                var me = $(this);

                // ensure we are not binding it again
                if (me.parent().hasClass(o.wrapperClass))
                {
                    // start from last bar position
                    var offset = me.scrollTop();

                    // find bar and rail
                    bar = me.closest('.' + o.barClass);
                    rail = me.closest('.' + o.railClass);

                    getBarHeight();

                    // check if we should scroll existing instance
                    if ($.isPlainObject(options))
                    {
                        // Pass height: auto to an existing slimscroll object to force a resize after contents have changed
                        if ( 'height' in options && options.height == 'auto' ) {
                            me.parent().css('height', 'auto');
                            me.css('height', 'auto');
                            var height = me.parent().parent().height();
                            me.parent().css('height', height);
                            me.css('height', height);
                        }

                        if ('scrollTo' in options)
                        {
                            // jump to a static point
                            offset = parseInt(o.scrollTo);
                        }
                        else if ('scrollBy' in options)
                        {
                            // jump by value pixels
                            offset += parseInt(o.scrollBy);
                        }
                        else if ('destroy' in options)
                        {
                            // remove slimscroll elements
                            bar.remove();
                            rail.remove();
                            me.unwrap();
                            return;
                        }

                        // scroll content by the given offset
                        scrollContent(offset, false, true);
                    }

                    return;
                }
                else if ($.isPlainObject(options))
                {
                    if ('destroy' in options)
                    {
                        return;
                    }
                }

                // optionally set height to the parent's height
                o.height = (o.height == 'auto') ? me.parent().height() : o.height;

                // wrap content
                var wrapper = $(divS)
                    .addClass(o.wrapperClass)
                    .css({
                        position: 'relative',
                        overflow: 'hidden',
                        width: o.width,
                        height: o.height
                    });

                // update style for the div
                me.css({
                    overflow: 'hidden',
                    width: o.width,
                    height: o.height
                });

                // create scrollbar rail
                var rail = $(divS)
                    .addClass(o.railClass)
                    .css({
                        width: o.size,
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        display: (o.alwaysVisible && o.railVisible) ? 'block' : 'none',
                        'border-radius': o.railBorderRadius,
                        background: o.railColor,
                        opacity: o.railOpacity,
                        zIndex: 90
                    });

                // create scrollbar
                var bar = $(divS)
                    .addClass(o.barClass)
                    .css({
                        background: o.color,
                        width: o.size,
                        position: 'absolute',
                        top: 0,
                        opacity: o.opacity,
                        display: o.alwaysVisible ? 'block' : 'none',
                        'border-radius' : o.borderRadius,
                        BorderRadius: o.borderRadius,
                        MozBorderRadius: o.borderRadius,
                        WebkitBorderRadius: o.borderRadius,
                        zIndex: 99
                    });

                // set position
                var posCss = (o.position == 'right') ? { right: o.distance } : { left: o.distance };
                rail.css(posCss);
                bar.css(posCss);

                // wrap it
                me.wrap(wrapper);

                // append to parent div
                me.parent().append(bar);
                me.parent().append(rail);

                // make it draggable and no longer dependent on the jqueryUI
                if (o.railDraggable){
                    bar.bind("mousedown", function(e) {
                        var $doc = $(document);
                        isDragg = true;
                        t = parseFloat(bar.css('top'));
                        pageY = e.pageY;

                        $doc.bind("mousemove.slimscroll", function(e){
                            currTop = t + e.pageY - pageY;
                            bar.css('top', currTop);
                            scrollContent(0, bar.position().top, false);// scroll content
                        });

                        $doc.bind("mouseup.slimscroll", function(e) {
                            isDragg = false;hideBar();
                            $doc.unbind('.slimscroll');
                        });
                        return false;
                    }).bind("selectstart.slimscroll", function(e){
                        e.stopPropagation();
                        e.preventDefault();
                        return false;
                    });
                }

                // on rail over
                rail.hover(function(){
                    showBar();
                }, function(){
                    hideBar();
                });

                // on bar over
                bar.hover(function(){
                    isOverBar = true;
                }, function(){
                    isOverBar = false;
                });

                // show on parent mouseover
                me.hover(function(){
                    isOverPanel = true;
                    showBar();
                    hideBar();
                }, function(){
                    isOverPanel = false;
                    hideBar();
                });

                // support for mobile
                me.bind('touchstart', function(e,b){
                    if (e.originalEvent.touches.length)
                    {
                        // record where touch started
                        touchDif = e.originalEvent.touches[0].pageY;
                    }
                });

                me.bind('touchmove', function(e){
                    // prevent scrolling the page if necessary
                    if(!releaseScroll)
                    {
                        e.originalEvent.preventDefault();
                    }
                    if (e.originalEvent.touches.length)
                    {
                        // see how far user swiped
                        var diff = (touchDif - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
                        // scroll content
                        scrollContent(diff, true);
                        touchDif = e.originalEvent.touches[0].pageY;
                    }
                });

                // set up initial height
                getBarHeight();

                // check start position
                if (o.start === 'bottom')
                {
                    // scroll content to bottom
                    bar.css({ top: me.outerHeight() - bar.outerHeight() });
                    scrollContent(0, true);
                }
                else if (o.start !== 'top')
                {
                    // assume jQuery selector
                    scrollContent($(o.start).position().top, null, true);

                    // make sure bar stays hidden
                    if (!o.alwaysVisible) { bar.hide(); }
                }

                // attach scroll events
                attachWheel(this);

                function _onWheel(e)
                {
                    // use mouse wheel only when mouse is over
                    if (!isOverPanel) { return; }

                    var e = e || window.event;

                    var delta = 0;
                    if (e.wheelDelta) { delta = -e.wheelDelta/120; }
                    if (e.detail) { delta = e.detail / 3; }

                    var target = e.target || e.srcTarget || e.srcElement;
                    if ($(target).closest('.' + o.wrapperClass).is(me.parent())) {
                        // scroll content
                        scrollContent(delta, true);
                    }

                    // stop window scroll
                    if (e.preventDefault && !releaseScroll) { e.preventDefault(); }
                    if (!releaseScroll) { e.returnValue = false; }
                }

                function scrollContent(y, isWheel, isJump)
                {
                    releaseScroll = false;
                    var delta = y;
                    var maxTop = me.outerHeight() - bar.outerHeight();

                    if (isWheel)
                    {
                        // move bar with mouse wheel
                        delta = parseInt(bar.css('top')) + y * parseInt(o.wheelStep) / 100 * bar.outerHeight();

                        // move bar, make sure it doesn't go out
                        delta = Math.min(Math.max(delta, 0), maxTop);

                        // if scrolling down, make sure a fractional change to the
                        // scroll position isn't rounded away when the scrollbar's CSS is set
                        // this flooring of delta would happened automatically when
                        // bar.css is set below, but we floor here for clarity
                        delta = (y > 0) ? Math.ceil(delta) : Math.floor(delta);

                        // scroll the scrollbar
                        bar.css({ top: delta + 'px' });
                    }

                    // calculate actual scroll amount
                    percentScroll = parseInt(bar.css('top')) / (me.outerHeight() - bar.outerHeight());
                    delta = percentScroll * (me[0].scrollHeight - me.outerHeight());

                    if (isJump)
                    {
                        delta = y;
                        var offsetTop = delta / me[0].scrollHeight * me.outerHeight();
                        offsetTop = Math.min(Math.max(offsetTop, 0), maxTop);
                        bar.css({ top: offsetTop + 'px' });
                    }

                    // scroll content
                    me.scrollTop(delta);

                    // fire scrolling event
                    me.trigger('slimscrolling', ~~delta);

                    // ensure bar is visible
                    showBar();

                    // trigger hide when scroll is stopped
                    hideBar();
                }

                function attachWheel(target)
                {
                    if (window.addEventListener)
                    {
                        target.addEventListener('DOMMouseScroll', _onWheel, false );
                        target.addEventListener('mousewheel', _onWheel, false );
                    }
                    else
                    {
                        document.attachEvent("onmousewheel", _onWheel)
                    }
                }

                function getBarHeight()
                {
                    // calculate scrollbar height and make sure it is not too small
                    barHeight = Math.max((me.outerHeight() / me[0].scrollHeight) * me.outerHeight(), minBarHeight);
                    bar.css({ height: barHeight + 'px' });

                    // hide scrollbar if content is not long enough
                    var display = barHeight == me.outerHeight() ? 'none' : 'block';
                    bar.css({ display: display });
                }

                function showBar()
                {
                    // recalculate bar height
                    getBarHeight();
                    clearTimeout(queueHide);

                    // when bar reached top or bottom
                    if (percentScroll == ~~percentScroll)
                    {
                        //release wheel
                        releaseScroll = o.allowPageScroll;

                        // publish approporiate event
                        if (lastScroll != percentScroll)
                        {
                            var msg = (~~percentScroll == 0) ? 'top' : 'bottom';
                            me.trigger('slimscroll', msg);
                        }
                    }
                    else
                    {
                        releaseScroll = false;
                    }
                    lastScroll = percentScroll;

                    // show only when required
                    if(barHeight >= me.outerHeight()) {
                        //allow window scroll
                        releaseScroll = true;
                        return;
                    }
                    bar.stop(true,true).fadeIn('fast');
                    if (o.railVisible) { rail.stop(true,true).fadeIn('fast'); }
                }

                function hideBar()
                {
                    // only hide when options allow it
                    if (!o.alwaysVisible)
                    {
                        queueHide = setTimeout(function(){
                            if (!(o.disableFadeOut && isOverPanel) && !isOverBar && !isDragg)
                            {
                                bar.fadeOut('slow');
                                rail.fadeOut('slow');
                            }
                        }, 1000);
                    }
                }

            });

            // maintain chainability
            return this;
        }
    });

    $.fn.extend({
        slimscroll: $.fn.slimScroll
    });

})(jQuery);

/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

/*!
 * Generated using the Bootstrap Customizer (http://getbootstrap.com/customize/?id=e32e312fd020b0f35cdd)
 * Config saved to config.json and https://gist.github.com/e32e312fd020b0f35cdd
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(t){"use strict";var e=t.fn.jquery.split(" ")[0].split(".");if(e[0]<2&&e[1]<9||1==e[0]&&9==e[1]&&e[2]<1||e[0]>2)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3")}(jQuery),+function(t){"use strict";function e(e){return this.each(function(){var o=t(this),n=o.data("bs.tooltip"),s="object"==typeof e&&e;(n||!/destroy|hide/.test(e))&&(n||o.data("bs.tooltip",n=new i(this,s)),"string"==typeof e&&n[e]())})}var i=function(t,e){this.type=null,this.options=null,this.enabled=null,this.timeout=null,this.hoverState=null,this.$element=null,this.inState=null,this.init("tooltip",t,e)};i.VERSION="3.3.6",i.TRANSITION_DURATION=150,i.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},i.prototype.init=function(e,i,o){if(this.enabled=!0,this.type=e,this.$element=t(i),this.options=this.getOptions(o),this.$viewport=this.options.viewport&&t(t.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport),this.inState={click:!1,hover:!1,focus:!1},this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(var n=this.options.trigger.split(" "),s=n.length;s--;){var r=n[s];if("click"==r)this.$element.on("click."+this.type,this.options.selector,t.proxy(this.toggle,this));else if("manual"!=r){var a="hover"==r?"mouseenter":"focusin",l="hover"==r?"mouseleave":"focusout";this.$element.on(a+"."+this.type,this.options.selector,t.proxy(this.enter,this)),this.$element.on(l+"."+this.type,this.options.selector,t.proxy(this.leave,this))}}this.options.selector?this._options=t.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},i.prototype.getDefaults=function(){return i.DEFAULTS},i.prototype.getOptions=function(e){return e=t.extend({},this.getDefaults(),this.$element.data(),e),e.delay&&"number"==typeof e.delay&&(e.delay={show:e.delay,hide:e.delay}),e},i.prototype.getDelegateOptions=function(){var e={},i=this.getDefaults();return this._options&&t.each(this._options,function(t,o){i[t]!=o&&(e[t]=o)}),e},i.prototype.enter=function(e){var i=e instanceof this.constructor?e:t(e.currentTarget).data("bs."+this.type);return i||(i=new this.constructor(e.currentTarget,this.getDelegateOptions()),t(e.currentTarget).data("bs."+this.type,i)),e instanceof t.Event&&(i.inState["focusin"==e.type?"focus":"hover"]=!0),i.tip().hasClass("in")||"in"==i.hoverState?void(i.hoverState="in"):(clearTimeout(i.timeout),i.hoverState="in",i.options.delay&&i.options.delay.show?void(i.timeout=setTimeout(function(){"in"==i.hoverState&&i.show()},i.options.delay.show)):i.show())},i.prototype.isInStateTrue=function(){for(var t in this.inState)if(this.inState[t])return!0;return!1},i.prototype.leave=function(e){var i=e instanceof this.constructor?e:t(e.currentTarget).data("bs."+this.type);return i||(i=new this.constructor(e.currentTarget,this.getDelegateOptions()),t(e.currentTarget).data("bs."+this.type,i)),e instanceof t.Event&&(i.inState["focusout"==e.type?"focus":"hover"]=!1),i.isInStateTrue()?void 0:(clearTimeout(i.timeout),i.hoverState="out",i.options.delay&&i.options.delay.hide?void(i.timeout=setTimeout(function(){"out"==i.hoverState&&i.hide()},i.options.delay.hide)):i.hide())},i.prototype.show=function(){var e=t.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(e);var o=t.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(e.isDefaultPrevented()||!o)return;var n=this,s=this.tip(),r=this.getUID(this.type);this.setContent(),s.attr("id",r),this.$element.attr("aria-describedby",r),this.options.animation&&s.addClass("fade");var a="function"==typeof this.options.placement?this.options.placement.call(this,s[0],this.$element[0]):this.options.placement,l=/\s?auto?\s?/i,p=l.test(a);p&&(a=a.replace(l,"")||"top"),s.detach().css({top:0,left:0,display:"block"}).addClass(a).data("bs."+this.type,this),this.options.container?s.appendTo(this.options.container):s.insertAfter(this.$element),this.$element.trigger("inserted.bs."+this.type);var h=this.getPosition(),f=s[0].offsetWidth,u=s[0].offsetHeight;if(p){var c=a,d=this.getPosition(this.$viewport);a="bottom"==a&&h.bottom+u>d.bottom?"top":"top"==a&&h.top-u<d.top?"bottom":"right"==a&&h.right+f>d.width?"left":"left"==a&&h.left-f<d.left?"right":a,s.removeClass(c).addClass(a)}var v=this.getCalculatedOffset(a,h,f,u);this.applyPlacement(v,a);var g=function(){var t=n.hoverState;n.$element.trigger("shown.bs."+n.type),n.hoverState=null,"out"==t&&n.leave(n)};t.support.transition&&this.$tip.hasClass("fade")?s.one("bsTransitionEnd",g).emulateTransitionEnd(i.TRANSITION_DURATION):g()}},i.prototype.applyPlacement=function(e,i){var o=this.tip(),n=o[0].offsetWidth,s=o[0].offsetHeight,r=parseInt(o.css("margin-top"),10),a=parseInt(o.css("margin-left"),10);isNaN(r)&&(r=0),isNaN(a)&&(a=0),e.top+=r,e.left+=a,t.offset.setOffset(o[0],t.extend({using:function(t){o.css({top:Math.round(t.top),left:Math.round(t.left)})}},e),0),o.addClass("in");var l=o[0].offsetWidth,p=o[0].offsetHeight;"top"==i&&p!=s&&(e.top=e.top+s-p);var h=this.getViewportAdjustedDelta(i,e,l,p);h.left?e.left+=h.left:e.top+=h.top;var f=/top|bottom/.test(i),u=f?2*h.left-n+l:2*h.top-s+p,c=f?"offsetWidth":"offsetHeight";o.offset(e),this.replaceArrow(u,o[0][c],f)},i.prototype.replaceArrow=function(t,e,i){this.arrow().css(i?"left":"top",50*(1-t/e)+"%").css(i?"top":"left","")},i.prototype.setContent=function(){var t=this.tip(),e=this.getTitle();t.find(".tooltip-inner")[this.options.html?"html":"text"](e),t.removeClass("fade in top bottom left right")},i.prototype.hide=function(e){function o(){"in"!=n.hoverState&&s.detach(),n.$element.removeAttr("aria-describedby").trigger("hidden.bs."+n.type),e&&e()}var n=this,s=t(this.$tip),r=t.Event("hide.bs."+this.type);return this.$element.trigger(r),r.isDefaultPrevented()?void 0:(s.removeClass("in"),t.support.transition&&s.hasClass("fade")?s.one("bsTransitionEnd",o).emulateTransitionEnd(i.TRANSITION_DURATION):o(),this.hoverState=null,this)},i.prototype.fixTitle=function(){var t=this.$element;(t.attr("title")||"string"!=typeof t.attr("data-original-title"))&&t.attr("data-original-title",t.attr("title")||"").attr("title","")},i.prototype.hasContent=function(){return this.getTitle()},i.prototype.getPosition=function(e){e=e||this.$element;var i=e[0],o="BODY"==i.tagName,n=i.getBoundingClientRect();null==n.width&&(n=t.extend({},n,{width:n.right-n.left,height:n.bottom-n.top}));var s=o?{top:0,left:0}:e.offset(),r={scroll:o?document.documentElement.scrollTop||document.body.scrollTop:e.scrollTop()},a=o?{width:t(window).width(),height:t(window).height()}:null;return t.extend({},n,r,a,s)},i.prototype.getCalculatedOffset=function(t,e,i,o){return"bottom"==t?{top:e.top+e.height,left:e.left+e.width/2-i/2}:"top"==t?{top:e.top-o,left:e.left+e.width/2-i/2}:"left"==t?{top:e.top+e.height/2-o/2,left:e.left-i}:{top:e.top+e.height/2-o/2,left:e.left+e.width}},i.prototype.getViewportAdjustedDelta=function(t,e,i,o){var n={top:0,left:0};if(!this.$viewport)return n;var s=this.options.viewport&&this.options.viewport.padding||0,r=this.getPosition(this.$viewport);if(/right|left/.test(t)){var a=e.top-s-r.scroll,l=e.top+s-r.scroll+o;a<r.top?n.top=r.top-a:l>r.top+r.height&&(n.top=r.top+r.height-l)}else{var p=e.left-s,h=e.left+s+i;p<r.left?n.left=r.left-p:h>r.right&&(n.left=r.left+r.width-h)}return n},i.prototype.getTitle=function(){var t,e=this.$element,i=this.options;return t=e.attr("data-original-title")||("function"==typeof i.title?i.title.call(e[0]):i.title)},i.prototype.getUID=function(t){do t+=~~(1e6*Math.random());while(document.getElementById(t));return t},i.prototype.tip=function(){if(!this.$tip&&(this.$tip=t(this.options.template),1!=this.$tip.length))throw new Error(this.type+" `template` option must consist of exactly 1 top-level element!");return this.$tip},i.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},i.prototype.enable=function(){this.enabled=!0},i.prototype.disable=function(){this.enabled=!1},i.prototype.toggleEnabled=function(){this.enabled=!this.enabled},i.prototype.toggle=function(e){var i=this;e&&(i=t(e.currentTarget).data("bs."+this.type),i||(i=new this.constructor(e.currentTarget,this.getDelegateOptions()),t(e.currentTarget).data("bs."+this.type,i))),e?(i.inState.click=!i.inState.click,i.isInStateTrue()?i.enter(i):i.leave(i)):i.tip().hasClass("in")?i.leave(i):i.enter(i)},i.prototype.destroy=function(){var t=this;clearTimeout(this.timeout),this.hide(function(){t.$element.off("."+t.type).removeData("bs."+t.type),t.$tip&&t.$tip.detach(),t.$tip=null,t.$arrow=null,t.$viewport=null})};var o=t.fn.tooltip;t.fn.tooltip=e,t.fn.tooltip.Constructor=i,t.fn.tooltip.noConflict=function(){return t.fn.tooltip=o,this}}(jQuery);
(function(B,n){"object"===typeof exports?n(exports):"function"===typeof define&&define.amd?define(["exports"],n):n(B)})(this,function(B){function n(a){this._targetElement=a;this._options={nextLabel:"Next &rarr;",prevLabel:"&larr; Back",skipLabel:"Skip",doneLabel:"Done",tooltipPosition:"bottom",tooltipClass:"",highlightClass:"",exitOnEsc:!0,exitOnOverlayClick:!0,showStepNumbers:!0,keyboardNavigation:!0,showButtons:!0,showBullets:!0,showProgress:!1,scrollToElement:!0,overlayOpacity:0.8,positionPrecedence:["bottom",
"top","right","left"],disableInteraction:!1}}function M(a){var b=[],c=this;if(this._options.steps)for(var e=0,d=this._options.steps.length;e<d;e++){var f=H(this._options.steps[e]);f.step=b.length+1;"string"===typeof f.element&&(f.element=document.querySelector(f.element));if("undefined"===typeof f.element||null==f.element){var h=document.querySelector(".introjsFloatingElement");null==h&&(h=document.createElement("div"),h.className="introjsFloatingElement",document.body.appendChild(h));f.element=h;
f.position="floating"}null!=f.element&&b.push(f)}else{d=a.querySelectorAll("*[data-intro]");if(1>d.length)return!1;e=0;for(f=d.length;e<f;e++){var h=d[e],q=parseInt(h.getAttribute("data-step"),10);0<q&&(b[q-1]={element:h,intro:h.getAttribute("data-intro"),step:parseInt(h.getAttribute("data-step"),10),tooltipClass:h.getAttribute("data-tooltipClass"),highlightClass:h.getAttribute("data-highlightClass"),position:h.getAttribute("data-position")||this._options.tooltipPosition})}e=q=0;for(f=d.length;e<
f;e++)if(h=d[e],null==h.getAttribute("data-step")){for(;"undefined"!=typeof b[q];)q++;b[q]={element:h,intro:h.getAttribute("data-intro"),step:q+1,tooltipClass:h.getAttribute("data-tooltipClass"),highlightClass:h.getAttribute("data-highlightClass"),position:h.getAttribute("data-position")||this._options.tooltipPosition}}}e=[];for(d=0;d<b.length;d++)b[d]&&e.push(b[d]);b=e;b.sort(function(a,b){return a.step-b.step});c._introItems=b;N.call(c,a)&&(x.call(c),a.querySelector(".introjs-skipbutton"),a.querySelector(".introjs-nextbutton"),
c._onKeyDown=function(b){if(27===b.keyCode&&!0==c._options.exitOnEsc)void 0!=c._introExitCallback&&c._introExitCallback.call(c),y.call(c,a);else if(37===b.keyCode)C.call(c);else if(39===b.keyCode)x.call(c);else if(13===b.keyCode){var d=b.target||b.srcElement;d&&0<d.className.indexOf("introjs-prevbutton")?C.call(c):d&&0<d.className.indexOf("introjs-skipbutton")?(c._introItems.length-1==c._currentStep&&"function"===typeof c._introCompleteCallback&&c._introCompleteCallback.call(c),void 0!=c._introExitCallback&&
c._introExitCallback.call(c),y.call(c,a)):x.call(c);b.preventDefault?b.preventDefault():b.returnValue=!1}},c._onResize=function(a){t.call(c,document.querySelector(".introjs-helperLayer"));t.call(c,document.querySelector(".introjs-tooltipReferenceLayer"))},window.addEventListener?(this._options.keyboardNavigation&&window.addEventListener("keydown",c._onKeyDown,!0),window.addEventListener("resize",c._onResize,!0)):document.attachEvent&&(this._options.keyboardNavigation&&document.attachEvent("onkeydown",
c._onKeyDown),document.attachEvent("onresize",c._onResize)));return!1}function H(a){if(null==a||"object"!=typeof a||"undefined"!=typeof a.nodeType)return a;var b={},c;for(c in a)b[c]="undefined"!=typeof jQuery&&a[c]instanceof jQuery?a[c]:H(a[c]);return b}function x(){this._direction="forward";"undefined"===typeof this._currentStep?this._currentStep=0:++this._currentStep;if(this._introItems.length<=this._currentStep)"function"===typeof this._introCompleteCallback&&this._introCompleteCallback.call(this),
y.call(this,this._targetElement);else{var a=this._introItems[this._currentStep];"undefined"!==typeof this._introBeforeChangeCallback&&this._introBeforeChangeCallback.call(this,a.element);I.call(this,a)}}function C(){this._direction="backward";if(0===this._currentStep)return!1;var a=this._introItems[--this._currentStep];"undefined"!==typeof this._introBeforeChangeCallback&&this._introBeforeChangeCallback.call(this,a.element);I.call(this,a)}function y(a){var b=a.querySelector(".introjs-overlay");if(null!=
b){b.style.opacity=0;setTimeout(function(){b.parentNode&&b.parentNode.removeChild(b)},500);var c=a.querySelector(".introjs-helperLayer");c&&c.parentNode.removeChild(c);(c=a.querySelector(".introjs-tooltipReferenceLayer"))&&c.parentNode.removeChild(c);(a=a.querySelector(".introjs-disableInteraction"))&&a.parentNode.removeChild(a);(a=document.querySelector(".introjsFloatingElement"))&&a.parentNode.removeChild(a);if(a=document.querySelector(".introjs-showElement"))a.className=a.className.replace(/introjs-[a-zA-Z]+/g,
"").replace(/^\s+|\s+$/g,"");if((a=document.querySelectorAll(".introjs-fixParent"))&&0<a.length)for(c=a.length-1;0<=c;c--)a[c].className=a[c].className.replace(/introjs-fixParent/g,"").replace(/^\s+|\s+$/g,"");window.removeEventListener?window.removeEventListener("keydown",this._onKeyDown,!0):document.detachEvent&&document.detachEvent("onkeydown",this._onKeyDown);this._currentStep=void 0}}function J(a,b,c,e){var d="",f,h;b.style.top=null;b.style.right=null;b.style.bottom=null;b.style.left=null;b.style.marginLeft=
null;b.style.marginTop=null;c.style.display="inherit";"undefined"!=typeof e&&null!=e&&(e.style.top=null,e.style.left=null);if(this._introItems[this._currentStep]){d=this._introItems[this._currentStep];d="string"===typeof d.tooltipClass?d.tooltipClass:this._options.tooltipClass;b.className=("introjs-tooltip "+d).replace(/^\s+|\s+$/g,"");h=this._introItems[this._currentStep].position;if(("auto"==h||"auto"==this._options.tooltipPosition)&&"floating"!=h){d=h;f=this._options.positionPrecedence.slice();
h=F();var q=v(b).height+10,r=v(b).width+20,k=v(a),l="floating";k.left+r>h.width||0>k.left+k.width/2-r?(s(f,"bottom"),s(f,"top")):(k.height+k.top+q>h.height&&s(f,"bottom"),0>k.top-q&&s(f,"top"));k.width+k.left+r>h.width&&s(f,"right");0>k.left-r&&s(f,"left");0<f.length&&(l=f[0]);d&&"auto"!=d&&-1<f.indexOf(d)&&(l=d);h=l}d=v(a);a=v(b);f=F();switch(h){case "top":c.className="introjs-arrow bottom";z(d,15,a,f,b);b.style.bottom=d.height+20+"px";break;case "right":b.style.left=d.width+20+"px";d.top+a.height>
f.height?(c.className="introjs-arrow left-bottom",b.style.top="-"+(a.height-d.height-20)+"px"):c.className="introjs-arrow left";break;case "left":!0==this._options.showStepNumbers&&(b.style.top="15px");d.top+a.height>f.height?(b.style.top="-"+(a.height-d.height-20)+"px",c.className="introjs-arrow right-bottom"):c.className="introjs-arrow right";b.style.right=d.width+20+"px";break;case "floating":c.style.display="none";b.style.left="50%";b.style.top="50%";b.style.marginLeft="-"+a.width/2+"px";b.style.marginTop=
"-"+a.height/2+"px";"undefined"!=typeof e&&null!=e&&(e.style.left="-"+(a.width/2+18)+"px",e.style.top="-"+(a.height/2+18)+"px");break;case "bottom-right-aligned":c.className="introjs-arrow top-right";K(d,0,a,b);b.style.top=d.height+20+"px";break;case "bottom-middle-aligned":c.className="introjs-arrow top-middle";c=d.width/2-a.width/2;K(d,c,a,b)&&(b.style.right=null,z(d,c,a,f,b));b.style.top=d.height+20+"px";break;default:c.className="introjs-arrow top",z(d,0,a,f,b),b.style.top=d.height+20+"px"}}}
function z(a,b,c,e,d){if(a.left+b+c.width>e.width)return d.style.left=e.width-c.width-a.left+"px",!1;d.style.left=b+"px";return!0}function K(a,b,c,e){if(0>a.left+a.width-b-c.width)return e.style.left=-a.left+"px",!1;e.style.right=b+"px";return!0}function s(a,b){-1<a.indexOf(b)&&a.splice(a.indexOf(b),1)}function t(a){if(a&&this._introItems[this._currentStep]){var b=this._introItems[this._currentStep],c=v(b.element),e=10;"floating"==b.position&&(e=0);a.setAttribute("style","width: "+(c.width+e)+"px; height:"+
(c.height+e)+"px; top:"+(c.top-5)+"px;left: "+(c.left-5)+"px;")}}function O(){var a=document.querySelector(".introjs-disableInteraction");null===a&&(a=document.createElement("div"),a.className="introjs-disableInteraction",this._targetElement.appendChild(a));t.call(this,a)}function I(a){"undefined"!==typeof this._introChangeCallback&&this._introChangeCallback.call(this,a.element);var b=this,c=document.querySelector(".introjs-helperLayer"),e=document.querySelector(".introjs-tooltipReferenceLayer"),
d="introjs-helperLayer";v(a.element);"string"===typeof a.highlightClass&&(d+=" "+a.highlightClass);"string"===typeof this._options.highlightClass&&(d+=" "+this._options.highlightClass);if(null!=c){var f=e.querySelector(".introjs-helperNumberLayer"),h=e.querySelector(".introjs-tooltiptext"),q=e.querySelector(".introjs-arrow"),r=e.querySelector(".introjs-tooltip"),k=e.querySelector(".introjs-skipbutton"),l=e.querySelector(".introjs-prevbutton"),p=e.querySelector(".introjs-nextbutton");c.className=d;
r.style.opacity=0;r.style.display="none";if(null!=f){var g=this._introItems[0<=a.step-2?a.step-2:0];if(null!=g&&"forward"==this._direction&&"floating"==g.position||"backward"==this._direction&&"floating"==a.position)f.style.opacity=0}t.call(b,c);t.call(b,e);if((g=document.querySelectorAll(".introjs-fixParent"))&&0<g.length)for(d=g.length-1;0<=d;d--)g[d].className=g[d].className.replace(/introjs-fixParent/g,"").replace(/^\s+|\s+$/g,"");g=document.querySelector(".introjs-showElement");g.className=g.className.replace(/introjs-[a-zA-Z]+/g,
"").replace(/^\s+|\s+$/g,"");b._lastShowElementTimer&&clearTimeout(b._lastShowElementTimer);b._lastShowElementTimer=setTimeout(function(){null!=f&&(f.innerHTML=a.step);h.innerHTML=a.intro;r.style.display="block";J.call(b,a.element,r,q,f);e.querySelector(".introjs-bullets li > a.active").className="";e.querySelector('.introjs-bullets li > a[data-stepnumber="'+a.step+'"]').className="active";e.querySelector(".introjs-progress .introjs-progressbar").setAttribute("style","width:"+L.call(b)+"%;");r.style.opacity=
1;f&&(f.style.opacity=1);-1===p.tabIndex?k.focus():p.focus()},350)}else{var n=document.createElement("div"),l=document.createElement("div"),c=document.createElement("div"),m=document.createElement("div"),s=document.createElement("div"),D=document.createElement("div"),E=document.createElement("div"),u=document.createElement("div");n.className=d;l.className="introjs-tooltipReferenceLayer";t.call(b,n);t.call(b,l);this._targetElement.appendChild(n);this._targetElement.appendChild(l);c.className="introjs-arrow";
s.className="introjs-tooltiptext";s.innerHTML=a.intro;D.className="introjs-bullets";!1===this._options.showBullets&&(D.style.display="none");for(var n=document.createElement("ul"),d=0,B=this._introItems.length;d<B;d++){var z=document.createElement("li"),A=document.createElement("a");A.onclick=function(){b.goToStep(this.getAttribute("data-stepnumber"))};d===a.step-1&&(A.className="active");A.href="javascript:void(0);";A.innerHTML="&nbsp;";A.setAttribute("data-stepnumber",this._introItems[d].step);
z.appendChild(A);n.appendChild(z)}D.appendChild(n);E.className="introjs-progress";!1===this._options.showProgress&&(E.style.display="none");d=document.createElement("div");d.className="introjs-progressbar";d.setAttribute("style","width:"+L.call(this)+"%;");E.appendChild(d);u.className="introjs-tooltipbuttons";!1===this._options.showButtons&&(u.style.display="none");m.className="introjs-tooltip";m.appendChild(s);m.appendChild(D);m.appendChild(E);!0==this._options.showStepNumbers&&(g=document.createElement("span"),
g.className="introjs-helperNumberLayer",g.innerHTML=a.step,l.appendChild(g));m.appendChild(c);l.appendChild(m);p=document.createElement("a");p.onclick=function(){b._introItems.length-1!=b._currentStep&&x.call(b)};p.href="javascript:void(0);";p.innerHTML=this._options.nextLabel;l=document.createElement("a");l.onclick=function(){0!=b._currentStep&&C.call(b)};l.href="javascript:void(0);";l.innerHTML=this._options.prevLabel;k=document.createElement("a");k.className="introjs-button introjs-skipbutton";
k.href="javascript:void(0);";k.innerHTML=this._options.skipLabel;k.onclick=function(){b._introItems.length-1==b._currentStep&&"function"===typeof b._introCompleteCallback&&b._introCompleteCallback.call(b);b._introItems.length-1!=b._currentStep&&"function"===typeof b._introExitCallback&&b._introExitCallback.call(b);y.call(b,b._targetElement)};u.appendChild(k);1<this._introItems.length&&(u.appendChild(l),u.appendChild(p));m.appendChild(u);J.call(b,a.element,m,c,g)}!0===this._options.disableInteraction&&
O.call(b);l.removeAttribute("tabIndex");p.removeAttribute("tabIndex");0==this._currentStep&&1<this._introItems.length?(l.className="introjs-button introjs-prevbutton introjs-disabled",l.tabIndex="-1",p.className="introjs-button introjs-nextbutton",k.innerHTML=this._options.skipLabel):this._introItems.length-1==this._currentStep||1==this._introItems.length?(k.innerHTML=this._options.doneLabel,l.className="introjs-button introjs-prevbutton",p.className="introjs-button introjs-nextbutton introjs-disabled",
p.tabIndex="-1"):(l.className="introjs-button introjs-prevbutton",p.className="introjs-button introjs-nextbutton",k.innerHTML=this._options.skipLabel);p.focus();a.element.className+=" introjs-showElement";g=w(a.element,"position");"absolute"!==g&&"relative"!==g&&(a.element.className+=" introjs-relativePosition");for(g=a.element.parentNode;null!=g&&"body"!==g.tagName.toLowerCase();){c=w(g,"z-index");m=parseFloat(w(g,"opacity"));u=w(g,"transform")||w(g,"-webkit-transform")||w(g,"-moz-transform")||w(g,
"-ms-transform")||w(g,"-o-transform");if(/[0-9]+/.test(c)||1>m||"none"!==u&&void 0!==u)g.className+=" introjs-fixParent";g=g.parentNode}P(a.element)||!0!==this._options.scrollToElement||(m=a.element.getBoundingClientRect(),g=F().height,c=m.bottom-(m.bottom-m.top),m=m.bottom-g,0>c||a.element.clientHeight>g?window.scrollBy(0,c-30):window.scrollBy(0,m+100));"undefined"!==typeof this._introAfterChangeCallback&&this._introAfterChangeCallback.call(this,a.element)}function w(a,b){var c="";a.currentStyle?
c=a.currentStyle[b]:document.defaultView&&document.defaultView.getComputedStyle&&(c=document.defaultView.getComputedStyle(a,null).getPropertyValue(b));return c&&c.toLowerCase?c.toLowerCase():c}function F(){if(void 0!=window.innerWidth)return{width:window.innerWidth,height:window.innerHeight};var a=document.documentElement;return{width:a.clientWidth,height:a.clientHeight}}function P(a){a=a.getBoundingClientRect();return 0<=a.top&&0<=a.left&&a.bottom+80<=window.innerHeight&&a.right<=window.innerWidth}
function N(a){var b=document.createElement("div"),c="",e=this;b.className="introjs-overlay";if("body"===a.tagName.toLowerCase())c+="top: 0;bottom: 0; left: 0;right: 0;position: fixed;",b.setAttribute("style",c);else{var d=v(a);d&&(c+="width: "+d.width+"px; height:"+d.height+"px; top:"+d.top+"px;left: "+d.left+"px;",b.setAttribute("style",c))}a.appendChild(b);b.onclick=function(){!0==e._options.exitOnOverlayClick&&(void 0!=e._introExitCallback&&e._introExitCallback.call(e),y.call(e,a))};setTimeout(function(){c+=
"opacity: "+e._options.overlayOpacity.toString()+";";b.setAttribute("style",c)},10);return!0}function v(a){var b={};b.width=a.offsetWidth;b.height=a.offsetHeight;for(var c=0,e=0;a&&!isNaN(a.offsetLeft)&&!isNaN(a.offsetTop);)c+=a.offsetLeft,e+=a.offsetTop,a=a.offsetParent;b.top=e;b.left=c;return b}function L(){return 100*(parseInt(this._currentStep+1,10)/this._introItems.length)}var G=function(a){if("object"===typeof a)return new n(a);if("string"===typeof a){if(a=document.querySelector(a))return new n(a);
throw Error("There is no element with given selector.");}return new n(document.body)};G.version="1.1.1";G.fn=n.prototype={clone:function(){return new n(this)},setOption:function(a,b){this._options[a]=b;return this},setOptions:function(a){var b=this._options,c={},e;for(e in b)c[e]=b[e];for(e in a)c[e]=a[e];this._options=c;return this},start:function(){M.call(this,this._targetElement);return this},goToStep:function(a){this._currentStep=a-2;"undefined"!==typeof this._introItems&&x.call(this);return this},
nextStep:function(){x.call(this);return this},previousStep:function(){C.call(this);return this},exit:function(){y.call(this,this._targetElement);return this},refresh:function(){t.call(this,document.querySelector(".introjs-helperLayer"));t.call(this,document.querySelector(".introjs-tooltipReferenceLayer"));return this},onbeforechange:function(a){if("function"===typeof a)this._introBeforeChangeCallback=a;else throw Error("Provided callback for onbeforechange was not a function");return this},onchange:function(a){if("function"===
typeof a)this._introChangeCallback=a;else throw Error("Provided callback for onchange was not a function.");return this},onafterchange:function(a){if("function"===typeof a)this._introAfterChangeCallback=a;else throw Error("Provided callback for onafterchange was not a function");return this},oncomplete:function(a){if("function"===typeof a)this._introCompleteCallback=a;else throw Error("Provided callback for oncomplete was not a function.");return this},onexit:function(a){if("function"===typeof a)this._introExitCallback=
a;else throw Error("Provided callback for onexit was not a function.");return this}};return B.introJs=G});

/*!
Chosen, a Select Box Enhancer for jQuery and Prototype
by Patrick Filler for Harvest, http://getharvest.com

Version 1.4.2
Full source at https://github.com/harvesthq/chosen
Copyright (c) 2011-2015 Harvest http://getharvest.com

MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
This file is generated by `grunt build`, do not edit it by hand.
*/

(function() {
  var $, AbstractChosen, Chosen, SelectParser, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SelectParser = (function() {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }

    SelectParser.prototype.add_node = function(child) {
      if (child.nodeName.toUpperCase() === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };

    SelectParser.prototype.add_group = function(group) {
      var group_position, option, _i, _len, _ref, _results;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: this.escapeExpression(group.label),
        title: group.title ? group.title : void 0,
        children: 0,
        disabled: group.disabled,
        classes: group.className
      });
      _ref = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push(this.add_option(option, group_position, group.disabled));
      }
      return _results;
    };

    SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
      if (option.nodeName.toUpperCase() === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            title: option.title ? option.title : void 0,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            group_label: group_position != null ? this.parsed[group_position].label : null,
            classes: option.className,
            style: option.style.cssText
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true
          });
        }
        return this.options_index += 1;
      }
    };

    SelectParser.prototype.escapeExpression = function(text) {
      var map, unsafe_chars;
      if ((text == null) || text === false) {
        return "";
      }
      if (!/[\&\<\>\"\'\`]/.test(text)) {
        return text;
      }
      map = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
      };
      unsafe_chars = /&(?!\w+;)|[\<\>\"\'\`]/g;
      return text.replace(unsafe_chars, function(chr) {
        return map[chr] || "&amp;";
      });
    };

    return SelectParser;

  })();

  SelectParser.select_to_array = function(select) {
    var child, parser, _i, _len, _ref;
    parser = new SelectParser();
    _ref = select.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      parser.add_node(child);
    }
    return parser.parsed;
  };

  AbstractChosen = (function() {
    function AbstractChosen(form_field, options) {
      this.form_field = form_field;
      this.options = options != null ? options : {};
      if (!AbstractChosen.browser_is_supported()) {
        return;
      }
      this.is_multiple = this.form_field.multiple;
      this.set_default_text();
      this.set_default_values();
      this.setup();
      this.set_up_html();
      this.register_observers();
      this.on_ready();
    }

    AbstractChosen.prototype.set_default_values = function() {
      var _this = this;
      this.click_test_action = function(evt) {
        return _this.test_active_click(evt);
      };
      this.activate_action = function(evt) {
        return _this.activate_field(evt);
      };
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
      this.disable_search_threshold = this.options.disable_search_threshold || 0;
      this.disable_search = this.options.disable_search || false;
      this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
      this.group_search = this.options.group_search != null ? this.options.group_search : true;
      this.search_contains = this.options.search_contains || false;
      this.single_backstroke_delete = this.options.single_backstroke_delete != null ? this.options.single_backstroke_delete : true;
      this.max_selected_options = this.options.max_selected_options || Infinity;
      this.inherit_select_classes = this.options.inherit_select_classes || false;
      this.display_selected_options = this.options.display_selected_options != null ? this.options.display_selected_options : true;
      this.display_disabled_options = this.options.display_disabled_options != null ? this.options.display_disabled_options : true;
      return this.include_group_label_in_selected = this.options.include_group_label_in_selected || false;
    };

    AbstractChosen.prototype.set_default_text = function() {
      if (this.form_field.getAttribute("data-placeholder")) {
        this.default_text = this.form_field.getAttribute("data-placeholder");
      } else if (this.is_multiple) {
        this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text;
      } else {
        this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
      }
      return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text;
    };

    AbstractChosen.prototype.choice_label = function(item) {
      if (this.include_group_label_in_selected && (item.group_label != null)) {
        return "<b class='group-name'>" + item.group_label + "</b>" + item.html;
      } else {
        return item.html;
      }
    };

    AbstractChosen.prototype.mouse_enter = function() {
      return this.mouse_on_container = true;
    };

    AbstractChosen.prototype.mouse_leave = function() {
      return this.mouse_on_container = false;
    };

    AbstractChosen.prototype.input_focus = function(evt) {
      var _this = this;
      if (this.is_multiple) {
        if (!this.active_field) {
          return setTimeout((function() {
            return _this.container_mousedown();
          }), 50);
        }
      } else {
        if (!this.active_field) {
          return this.activate_field();
        }
      }
    };

    AbstractChosen.prototype.input_blur = function(evt) {
      var _this = this;
      if (!this.mouse_on_container) {
        this.active_field = false;
        return setTimeout((function() {
          return _this.blur_test();
        }), 100);
      }
    };

    AbstractChosen.prototype.results_option_build = function(options) {
      var content, data, _i, _len, _ref;
      content = '';
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        if (data.group) {
          content += this.result_add_group(data);
        } else {
          content += this.result_add_option(data);
        }
        if (options != null ? options.first : void 0) {
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.single_set_selected_text(this.choice_label(data));
          }
        }
      }
      return content;
    };

    AbstractChosen.prototype.result_add_option = function(option) {
      var classes, option_el;
      if (!option.search_match) {
        return '';
      }
      if (!this.include_option_in_results(option)) {
        return '';
      }
      classes = [];
      if (!option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("active-result");
      }
      if (option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("disabled-result");
      }
      if (option.selected) {
        classes.push("result-selected");
      }
      if (option.group_array_index != null) {
        classes.push("group-option");
      }
      if (option.classes !== "") {
        classes.push(option.classes);
      }
      option_el = document.createElement("li");
      option_el.className = classes.join(" ");
      option_el.style.cssText = option.style;
      option_el.setAttribute("data-option-array-index", option.array_index);
      option_el.innerHTML = option.search_text;
      if (option.title) {
        option_el.title = option.title;
      }
      return this.outerHTML(option_el);
    };

    AbstractChosen.prototype.result_add_group = function(group) {
      var classes, group_el;
      if (!(group.search_match || group.group_match)) {
        return '';
      }
      if (!(group.active_options > 0)) {
        return '';
      }
      classes = [];
      classes.push("group-result");
      if (group.classes) {
        classes.push(group.classes);
      }
      group_el = document.createElement("li");
      group_el.className = classes.join(" ");
      group_el.innerHTML = group.search_text;
      if (group.title) {
        group_el.title = group.title;
      }
      return this.outerHTML(group_el);
    };

    AbstractChosen.prototype.results_update_field = function() {
      this.set_default_text();
      if (!this.is_multiple) {
        this.results_reset_cleanup();
      }
      this.result_clear_highlight();
      this.results_build();
      if (this.results_showing) {
        return this.winnow_results();
      }
    };

    AbstractChosen.prototype.reset_single_select_options = function() {
      var result, _i, _len, _ref, _results;
      _ref = this.results_data;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        result = _ref[_i];
        if (result.selected) {
          _results.push(result.selected = false);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    AbstractChosen.prototype.results_toggle = function() {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.results_search = function(evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.winnow_results = function() {
      var escapedSearchText, option, regex, results, results_group, searchText, startpos, text, zregex, _i, _len, _ref;
      this.no_results_clear();
      results = 0;
      searchText = this.get_search_text();
      escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      zregex = new RegExp(escapedSearchText, 'i');
      regex = this.get_search_regex(escapedSearchText);
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        option.search_match = false;
        results_group = null;
        if (this.include_option_in_results(option)) {
          if (option.group) {
            option.group_match = false;
            option.active_options = 0;
          }
          if ((option.group_array_index != null) && this.results_data[option.group_array_index]) {
            results_group = this.results_data[option.group_array_index];
            if (results_group.active_options === 0 && results_group.search_match) {
              results += 1;
            }
            results_group.active_options += 1;
          }
          option.search_text = option.group ? option.label : option.html;
          if (!(option.group && !this.group_search)) {
            option.search_match = this.search_string_match(option.search_text, regex);
            if (option.search_match && !option.group) {
              results += 1;
            }
            if (option.search_match) {
              if (searchText.length) {
                startpos = option.search_text.search(zregex);
                text = option.search_text.substr(0, startpos + searchText.length) + '</em>' + option.search_text.substr(startpos + searchText.length);
                option.search_text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
              }
              if (results_group != null) {
                results_group.group_match = true;
              }
            } else if ((option.group_array_index != null) && this.results_data[option.group_array_index].search_match) {
              option.search_match = true;
            }
          }
        }
      }
      this.result_clear_highlight();
      if (results < 1 && searchText.length) {
        this.update_results_content("");
        return this.no_results(searchText);
      } else {
        this.update_results_content(this.results_option_build());
        return this.winnow_results_set_highlight();
      }
    };

    AbstractChosen.prototype.get_search_regex = function(escaped_search_string) {
      var regex_anchor;
      regex_anchor = this.search_contains ? "" : "^";
      return new RegExp(regex_anchor + escaped_search_string, 'i');
    };

    AbstractChosen.prototype.search_string_match = function(search_string, regex) {
      var part, parts, _i, _len;
      if (regex.test(search_string)) {
        return true;
      } else if (this.enable_split_word_search && (search_string.indexOf(" ") >= 0 || search_string.indexOf("[") === 0)) {
        parts = search_string.replace(/\[|\]/g, "").split(" ");
        if (parts.length) {
          for (_i = 0, _len = parts.length; _i < _len; _i++) {
            part = parts[_i];
            if (regex.test(part)) {
              return true;
            }
          }
        }
      }
    };

    AbstractChosen.prototype.choices_count = function() {
      var option, _i, _len, _ref;
      if (this.selected_option_count != null) {
        return this.selected_option_count;
      }
      this.selected_option_count = 0;
      _ref = this.form_field.options;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (option.selected) {
          this.selected_option_count += 1;
        }
      }
      return this.selected_option_count;
    };

    AbstractChosen.prototype.choices_click = function(evt) {
      evt.preventDefault();
      if (!(this.results_showing || this.is_disabled)) {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.keyup_checker = function(evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0) {
            return this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            return this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) {
            return this.result_select(evt);
          }
          break;
        case 27:
          if (this.results_showing) {
            this.results_hide();
          }
          return true;
        case 9:
        case 38:
        case 40:
        case 16:
        case 91:
        case 17:
          break;
        default:
          return this.results_search();
      }
    };

    AbstractChosen.prototype.clipboard_event_checker = function(evt) {
      var _this = this;
      return setTimeout((function() {
        return _this.results_search();
      }), 50);
    };

    AbstractChosen.prototype.container_width = function() {
      if (this.options.width != null) {
        return this.options.width;
      } else {
        return "" + this.form_field.offsetWidth + "px";
      }
    };

    AbstractChosen.prototype.include_option_in_results = function(option) {
      if (this.is_multiple && (!this.display_selected_options && option.selected)) {
        return false;
      }
      if (!this.display_disabled_options && option.disabled) {
        return false;
      }
      if (option.empty) {
        return false;
      }
      return true;
    };

    AbstractChosen.prototype.search_results_touchstart = function(evt) {
      this.touch_started = true;
      return this.search_results_mouseover(evt);
    };

    AbstractChosen.prototype.search_results_touchmove = function(evt) {
      this.touch_started = false;
      return this.search_results_mouseout(evt);
    };

    AbstractChosen.prototype.search_results_touchend = function(evt) {
      if (this.touch_started) {
        return this.search_results_mouseup(evt);
      }
    };

    AbstractChosen.prototype.outerHTML = function(element) {
      var tmp;
      if (element.outerHTML) {
        return element.outerHTML;
      }
      tmp = document.createElement("div");
      tmp.appendChild(element);
      return tmp.innerHTML;
    };

    AbstractChosen.browser_is_supported = function() {
      if (window.navigator.appName === "Microsoft Internet Explorer") {
        return document.documentMode >= 8;
      }
      if (/iP(od|hone)/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (/Android/i.test(window.navigator.userAgent)) {
        if (/Mobile/i.test(window.navigator.userAgent)) {
          return false;
        }
      }
      return true;
    };

    AbstractChosen.default_multiple_text = "Choisissez-en plusieurs, parmi la liste.";

    AbstractChosen.default_single_text = "Choisissez-en un, parmi la liste.";

    AbstractChosen.default_no_result_text = "Oups, pas de résultats";

    return AbstractChosen;

  })();

  $ = jQuery;

  $.fn.extend({
    chosen: function(options) {
      if (!AbstractChosen.browser_is_supported()) {
        return this;
      }
      return this.each(function(input_field) {
        var $this, chosen;
        $this = $(this);
        chosen = $this.data('chosen');
        if (options === 'destroy' && chosen instanceof Chosen) {
          chosen.destroy();
        } else if (!(chosen instanceof Chosen)) {
          $this.data('chosen', new Chosen(this, options));
        }
      });
    }
  });

  Chosen = (function(_super) {
    __extends(Chosen, _super);

    function Chosen() {
      _ref = Chosen.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Chosen.prototype.setup = function() {
      this.form_field_jq = $(this.form_field);
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.is_rtl = this.form_field_jq.hasClass("chosen-rtl");
    };

    Chosen.prototype.set_up_html = function() {
      var container_classes, container_props;
      container_classes = ["chosen-container"];
      container_classes.push("chosen-container-" + (this.is_multiple ? "multi" : "single"));
      if (this.inherit_select_classes && this.form_field.className) {
        container_classes.push(this.form_field.className);
      }
      if (this.is_rtl) {
        container_classes.push("chosen-rtl");
      }
      container_props = {
        'class': container_classes.join(' '),
        'style': "width: " + (this.container_width()) + ";",
        'title': this.form_field.title
      };
      if (this.form_field.id.length) {
        container_props.id = this.form_field.id.replace(/[^\w]/g, '_') + "_chosen";
      }
      this.container = $("<div />", container_props);
      if (this.is_multiple) {
        this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>');
      } else {
        this.container.html('<a class="chosen-single chosen-default" tabindex="-1"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>');
      }
      this.form_field_jq.hide().after(this.container);
      this.dropdown = this.container.find('div.chosen-drop').first();
      this.search_field = this.container.find('input').first();
      this.search_results = this.container.find('ul.chosen-results').first();
      this.search_field_scale();
      this.search_no_results = this.container.find('li.no-results').first();
      if (this.is_multiple) {
        this.search_choices = this.container.find('ul.chosen-choices').first();
        this.search_container = this.container.find('li.search-field').first();
      } else {
        this.search_container = this.container.find('div.chosen-search').first();
        this.selected_item = this.container.find('.chosen-single').first();
      }
      this.results_build();
      this.set_tab_index();
      return this.set_label_behavior();
    };

    Chosen.prototype.on_ready = function() {
      return this.form_field_jq.trigger("chosen:ready", {
        chosen: this
      });
    };

    Chosen.prototype.register_observers = function() {
      var _this = this;
      this.container.bind('touchstart.chosen', function(evt) {
        _this.container_mousedown(evt);
        return evt.preventDefault();
      });
      this.container.bind('touchend.chosen', function(evt) {
        _this.container_mouseup(evt);
        return evt.preventDefault();
      });
      this.container.bind('mousedown.chosen', function(evt) {
        _this.container_mousedown(evt);
      });
      this.container.bind('mouseup.chosen', function(evt) {
        _this.container_mouseup(evt);
      });
      this.container.bind('mouseenter.chosen', function(evt) {
        _this.mouse_enter(evt);
      });
      this.container.bind('mouseleave.chosen', function(evt) {
        _this.mouse_leave(evt);
      });
      this.search_results.bind('mouseup.chosen', function(evt) {
        _this.search_results_mouseup(evt);
      });
      this.search_results.bind('mouseover.chosen', function(evt) {
        _this.search_results_mouseover(evt);
      });
      this.search_results.bind('mouseout.chosen', function(evt) {
        _this.search_results_mouseout(evt);
      });
      this.search_results.bind('mousewheel.chosen DOMMouseScroll.chosen', function(evt) {
        _this.search_results_mousewheel(evt);
      });
      this.search_results.bind('touchstart.chosen', function(evt) {
        _this.search_results_touchstart(evt);
      });
      this.search_results.bind('touchmove.chosen', function(evt) {
        _this.search_results_touchmove(evt);
      });
      this.search_results.bind('touchend.chosen', function(evt) {
        _this.search_results_touchend(evt);
      });
      this.form_field_jq.bind("chosen:updated.chosen", function(evt) {
        _this.results_update_field(evt);
      });
      this.form_field_jq.bind("chosen:activate.chosen", function(evt) {
        _this.activate_field(evt);
      });
      this.form_field_jq.bind("chosen:open.chosen", function(evt) {
        _this.container_mousedown(evt);
      });
      this.form_field_jq.bind("chosen:close.chosen", function(evt) {
        _this.input_blur(evt);
      });
      this.search_field.bind('blur.chosen', function(evt) {
        _this.input_blur(evt);
      });
      this.search_field.bind('keyup.chosen', function(evt) {
        _this.keyup_checker(evt);
      });
      this.search_field.bind('keydown.chosen', function(evt) {
        _this.keydown_checker(evt);
      });
      this.search_field.bind('focus.chosen', function(evt) {
        _this.input_focus(evt);
      });
      this.search_field.bind('cut.chosen', function(evt) {
        _this.clipboard_event_checker(evt);
      });
      this.search_field.bind('paste.chosen', function(evt) {
        _this.clipboard_event_checker(evt);
      });
      if (this.is_multiple) {
        return this.search_choices.bind('click.chosen', function(evt) {
          _this.choices_click(evt);
        });
      } else {
        return this.container.bind('click.chosen', function(evt) {
          evt.preventDefault();
        });
      }
    };

    Chosen.prototype.destroy = function() {
      $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
      if (this.search_field[0].tabIndex) {
        this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex;
      }
      this.container.remove();
      this.form_field_jq.removeData('chosen');
      return this.form_field_jq.show();
    };

    Chosen.prototype.search_field_disabled = function() {
      this.is_disabled = this.form_field_jq[0].disabled;
      if (this.is_disabled) {
        this.container.addClass('chosen-disabled');
        this.search_field[0].disabled = true;
        if (!this.is_multiple) {
          this.selected_item.unbind("focus.chosen", this.activate_action);
        }
        return this.close_field();
      } else {
        this.container.removeClass('chosen-disabled');
        this.search_field[0].disabled = false;
        if (!this.is_multiple) {
          return this.selected_item.bind("focus.chosen", this.activate_action);
        }
      }
    };

    Chosen.prototype.container_mousedown = function(evt) {
      if (!this.is_disabled) {
        if (evt && evt.type === "mousedown" && !this.results_showing) {
          evt.preventDefault();
        }
        if (!((evt != null) && ($(evt.target)).hasClass("search-choice-close"))) {
          if (!this.active_field) {
            if (this.is_multiple) {
              this.search_field.val("");
            }
            $(this.container[0].ownerDocument).bind('click.chosen', this.click_test_action);
            this.results_show();
          } else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chosen-single").length)) {
            evt.preventDefault();
            this.results_toggle();
          }
          return this.activate_field();
        }
      }
    };

    Chosen.prototype.container_mouseup = function(evt) {
      if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
        return this.results_reset(evt);
      }
    };

    Chosen.prototype.search_results_mousewheel = function(evt) {
      var delta;
      if (evt.originalEvent) {
        delta = evt.originalEvent.deltaY || -evt.originalEvent.wheelDelta || evt.originalEvent.detail;
      }
      if (delta != null) {
        evt.preventDefault();
        if (evt.type === 'DOMMouseScroll') {
          delta = delta * 40;
        }
        return this.search_results.scrollTop(delta + this.search_results.scrollTop());
      }
    };

    Chosen.prototype.blur_test = function(evt) {
      if (!this.active_field && this.container.hasClass("chosen-container-active")) {
        return this.close_field();
      }
    };

    Chosen.prototype.close_field = function() {
      $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
      this.active_field = false;
      this.results_hide();
      this.container.removeClass("chosen-container-active");
      this.clear_backstroke();
      this.show_search_field_default();
      return this.search_field_scale();
    };

    Chosen.prototype.activate_field = function() {
      this.container.addClass("chosen-container-active");
      this.active_field = true;
      this.search_field.val(this.search_field.val());
      return this.search_field.focus();
    };

    Chosen.prototype.test_active_click = function(evt) {
      var active_container;
      active_container = $(evt.target).closest('.chosen-container');
      if (active_container.length && this.container[0] === active_container[0]) {
        return this.active_field = true;
      } else {
        return this.close_field();
      }
    };

    Chosen.prototype.results_build = function() {
      this.parsing = true;
      this.selected_option_count = null;
      this.results_data = SelectParser.select_to_array(this.form_field);
      if (this.is_multiple) {
        this.search_choices.find("li.search-choice").remove();
      } else if (!this.is_multiple) {
        this.single_set_selected_text();
        if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
          this.search_field[0].readOnly = true;
          this.container.addClass("chosen-container-single-nosearch");
        } else {
          this.search_field[0].readOnly = false;
          this.container.removeClass("chosen-container-single-nosearch");
        }
      }
      this.update_results_content(this.results_option_build({
        first: true
      }));
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      return this.parsing = false;
    };

    Chosen.prototype.result_do_highlight = function(el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      if (el.length) {
        this.result_clear_highlight();
        this.result_highlight = el;
        this.result_highlight.addClass("highlighted");
        maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
        visible_top = this.search_results.scrollTop();
        visible_bottom = maxHeight + visible_top;
        high_top = this.result_highlight.position().top + this.search_results.scrollTop();
        high_bottom = high_top + this.result_highlight.outerHeight();
        if (high_bottom >= visible_bottom) {
          return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
        } else if (high_top < visible_top) {
          return this.search_results.scrollTop(high_top);
        }
      }
    };

    Chosen.prototype.result_clear_highlight = function() {
      if (this.result_highlight) {
        this.result_highlight.removeClass("highlighted");
      }
      return this.result_highlight = null;
    };

    Chosen.prototype.results_show = function() {
      if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
        this.form_field_jq.trigger("chosen:maxselected", {
          chosen: this
        });
        return false;
      }
      this.container.addClass("chosen-with-drop");
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.val(this.search_field.val());
      this.winnow_results();
      return this.form_field_jq.trigger("chosen:showing_dropdown", {
        chosen: this
      });
    };

    Chosen.prototype.update_results_content = function(content) {
      return this.search_results.html(content);
    };

    Chosen.prototype.results_hide = function() {
      if (this.results_showing) {
        this.result_clear_highlight();
        this.container.removeClass("chosen-with-drop");
        this.form_field_jq.trigger("chosen:hiding_dropdown", {
          chosen: this
        });
      }
      return this.results_showing = false;
    };

    Chosen.prototype.set_tab_index = function(el) {
      var ti;
      if (this.form_field.tabIndex) {
        ti = this.form_field.tabIndex;
        this.form_field.tabIndex = -1;
        return this.search_field[0].tabIndex = ti;
      }
    };

    Chosen.prototype.set_label_behavior = function() {
      var _this = this;
      this.form_field_label = this.form_field_jq.parents("label");
      if (!this.form_field_label.length && this.form_field.id.length) {
        this.form_field_label = $("label[for='" + this.form_field.id + "']");
      }
      if (this.form_field_label.length > 0) {
        return this.form_field_label.bind('click.chosen', function(evt) {
          if (_this.is_multiple) {
            return _this.container_mousedown(evt);
          } else {
            return _this.activate_field();
          }
        });
      }
    };

    Chosen.prototype.show_search_field_default = function() {
      if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
        this.search_field.val(this.default_text);
        return this.search_field.addClass("default");
      } else {
        this.search_field.val("");
        return this.search_field.removeClass("default");
      }
    };

    Chosen.prototype.search_results_mouseup = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target.length) {
        this.result_highlight = target;
        this.result_select(evt);
        return this.search_field.focus();
      }
    };

    Chosen.prototype.search_results_mouseover = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target) {
        return this.result_do_highlight(target);
      }
    };

    Chosen.prototype.search_results_mouseout = function(evt) {
      if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first())) {
        return this.result_clear_highlight();
      }
    };

    Chosen.prototype.choice_build = function(item) {
      var choice, close_link,
        _this = this;
      choice = $('<li />', {
        "class": "search-choice"
      }).html("<span>" + (this.choice_label(item)) + "</span>");
      if (item.disabled) {
        choice.addClass('search-choice-disabled');
      } else {
        close_link = $('<a />', {
          "class": 'search-choice-close',
          'data-option-array-index': item.array_index
        });
        close_link.bind('click.chosen', function(evt) {
          return _this.choice_destroy_link_click(evt);
        });
        choice.append(close_link);
      }
      return this.search_container.before(choice);
    };

    Chosen.prototype.choice_destroy_link_click = function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if (!this.is_disabled) {
        return this.choice_destroy($(evt.target));
      }
    };

    Chosen.prototype.choice_destroy = function(link) {
      if (this.result_deselect(link[0].getAttribute("data-option-array-index"))) {
        this.show_search_field_default();
        if (this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1) {
          this.results_hide();
        }
        link.parents('li').first().remove();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.results_reset = function() {
      this.reset_single_select_options();
      this.form_field.options[0].selected = true;
      this.single_set_selected_text();
      this.show_search_field_default();
      this.results_reset_cleanup();
      this.form_field_jq.trigger("change");
      if (this.active_field) {
        return this.results_hide();
      }
    };

    Chosen.prototype.results_reset_cleanup = function() {
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.selected_item.find("abbr").remove();
    };

    Chosen.prototype.result_select = function(evt) {
      var high, item;
      if (this.result_highlight) {
        high = this.result_highlight;
        this.result_clear_highlight();
        if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
          this.form_field_jq.trigger("chosen:maxselected", {
            chosen: this
          });
          return false;
        }
        if (this.is_multiple) {
          high.removeClass("active-result");
        } else {
          this.reset_single_select_options();
        }
        high.addClass("result-selected");
        item = this.results_data[high[0].getAttribute("data-option-array-index")];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        this.selected_option_count = null;
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.single_set_selected_text(this.choice_label(item));
        }
        if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple)) {
          this.results_hide();
        }
        this.search_field.val("");
        if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) {
          this.form_field_jq.trigger("change", {
            'selected': this.form_field.options[item.options_index].value
          });
        }
        this.current_selectedIndex = this.form_field.selectedIndex;
        evt.preventDefault();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.single_set_selected_text = function(text) {
      if (text == null) {
        text = this.default_text;
      }
      if (text === this.default_text) {
        this.selected_item.addClass("chosen-default");
      } else {
        this.single_deselect_control_build();
        this.selected_item.removeClass("chosen-default");
      }
      return this.selected_item.find("span").html(text);
    };

    Chosen.prototype.result_deselect = function(pos) {
      var result_data;
      result_data = this.results_data[pos];
      if (!this.form_field.options[result_data.options_index].disabled) {
        result_data.selected = false;
        this.form_field.options[result_data.options_index].selected = false;
        this.selected_option_count = null;
        this.result_clear_highlight();
        if (this.results_showing) {
          this.winnow_results();
        }
        this.form_field_jq.trigger("change", {
          deselected: this.form_field.options[result_data.options_index].value
        });
        this.search_field_scale();
        return true;
      } else {
        return false;
      }
    };

    Chosen.prototype.single_deselect_control_build = function() {
      if (!this.allow_single_deselect) {
        return;
      }
      if (!this.selected_item.find("abbr").length) {
        this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
      }
      return this.selected_item.addClass("chosen-single-with-deselect");
    };

    Chosen.prototype.get_search_text = function() {
      return $('<div/>').text($.trim(this.search_field.val())).html();
    };

    Chosen.prototype.winnow_results_set_highlight = function() {
      var do_high, selected_results;
      selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
      do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
      if (do_high != null) {
        return this.result_do_highlight(do_high);
      }
    };

    Chosen.prototype.no_results = function(terms) {
      var no_results_html;
      no_results_html = $('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>');
      no_results_html.find("span").first().html(terms);
      this.search_results.append(no_results_html);
      return this.form_field_jq.trigger("chosen:no_results", {
        chosen: this
      });
    };

    Chosen.prototype.no_results_clear = function() {
      return this.search_results.find(".no-results").remove();
    };

    Chosen.prototype.keydown_arrow = function() {
      var next_sib;
      if (this.results_showing && this.result_highlight) {
        next_sib = this.result_highlight.nextAll("li.active-result").first();
        if (next_sib) {
          return this.result_do_highlight(next_sib);
        }
      } else {
        return this.results_show();
      }
    };

    Chosen.prototype.keyup_arrow = function() {
      var prev_sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        prev_sibs = this.result_highlight.prevAll("li.active-result");
        if (prev_sibs.length) {
          return this.result_do_highlight(prev_sibs.first());
        } else {
          if (this.choices_count() > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };

    Chosen.prototype.keydown_backstroke = function() {
      var next_available_destroy;
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.find("a").first());
        return this.clear_backstroke();
      } else {
        next_available_destroy = this.search_container.siblings("li.search-choice").last();
        if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
          this.pending_backstroke = next_available_destroy;
          if (this.single_backstroke_delete) {
            return this.keydown_backstroke();
          } else {
            return this.pending_backstroke.addClass("search-choice-focus");
          }
        }
      }
    };

    Chosen.prototype.clear_backstroke = function() {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClass("search-choice-focus");
      }
      return this.pending_backstroke = null;
    };

    Chosen.prototype.keydown_checker = function(evt) {
      var stroke, _ref1;
      stroke = (_ref1 = evt.which) != null ? _ref1 : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8:
          this.backstroke_length = this.search_field.val().length;
          break;
        case 9:
          if (this.results_showing && !this.is_multiple) {
            this.result_select(evt);
          }
          this.mouse_on_container = false;
          break;
        case 13:
          if (this.results_showing) {
            evt.preventDefault();
          }
          break;
        case 32:
          if (this.disable_search) {
            evt.preventDefault();
          }
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          evt.preventDefault();
          this.keydown_arrow();
          break;
      }
    };

    Chosen.prototype.search_field_scale = function() {
      var div, f_width, h, style, style_block, styles, w, _i, _len;
      if (this.is_multiple) {
        h = 0;
        w = 0;
        style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
        styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
        for (_i = 0, _len = styles.length; _i < _len; _i++) {
          style = styles[_i];
          style_block += style + ":" + this.search_field.css(style) + ";";
        }
        div = $('<div />', {
          'style': style_block
        });
        div.text(this.search_field.val());
        $('body').append(div);
        w = div.width() + 25;
        div.remove();
        f_width = this.container.outerWidth();
        if (w > f_width - 10) {
          w = f_width - 10;
        }
        return this.search_field.css({
          'width': w + 'px'
        });
      }
    };

    return Chosen;

  })(AbstractChosen);

}).call(this);

// - - - - - - - - - - - - - - - - - - - - - - - - -

jQuery.fn.clickoutside = function ( callback ) {
    var outside = 1, self = $( this );
    self.cb     = callback;
    this.click( function () {
        outside = 0;
    } );
    $( document ).click( function () {
        outside && self.cb();
        outside = 1;
    } );
    return $( this );
};

// - - - - - - - - - - - - - - - - - - - - - - - - -

var fmask = {

    'select': {

        'scroll': {

            'status': true,
            'mod': { 'small': 90, 'medium': 120, 'large': 170 }
        }
    },

    'total': $( '.mask' ).length,
    'count': 1
};

$( '.mask' ).each( function ( index ) {

    e = this;

    // @ mask element : select

    if ( $( e ).attr( 'data-type' ) == 'select' ) {

        option = '';

        i = 0;
        $( e ).children( 'option' ).each( function ( index ) {

            selected = $( this ).attr( 'selected' ) ? 'data-selected="on"' : '';

            info         = 'data-info-select="' + $( this ).attr( 'data-info-select' ) + '"';
            name         = 'data-info-name="' + $( this ).attr( 'data-info-name' ) + '"';
            color        = 'data-info-color="' + $( this ).attr( 'data-info-color' ) + '"';
            dataSelector = 'data-info-selector="' + $( this ).attr( 'data-info-selector' ) + '"';
            label        = (i == 0) ? $( this ).html() : label;

            label = selected != '' ? $( this ).html() : label;

            option = option + '<li ' + selected + info + name + color + dataSelector + ' data-value="' + $( this ).attr( 'value' ) + '">' + $( this ).html() + '</li>';

            i++;

        } );

        // @ data width

        width = '';

        if ( $( e ).attr( 'data-width' ) ) {
            width = Number( $( e ).attr( 'data-width' ) ) ? $( e ).attr( 'data-width' ) : false;
            width = (width) ? 'style="width:' + width + 'px"' : 'data-width="' + $( e ).attr( 'data-width' ) + '"';
        }

        // @ data scroll

        scroll = '';

        fmask.select.scroll.status = $( e ).attr( 'data-scroll' ) == 'false' ? false : true;

        scroll = $( e ).attr( 'data-scroll' ) ? 'data-scroll="' + $( e ).attr( 'data-scroll' ) + '"' : '';

        if ( fmask.select.scroll.status ) {

            j = $( e ).attr( 'data-scroll' ) ? $( e ).attr( 'data-scroll' ) : fmask.select.scroll.mod.medium;

            if ( !Number( j ) ) {
                switch ( j ) {
                    case 'medium'  :
                        j = fmask.select.scroll.mod.medium;
                        break;
                    case 'small'   :
                        j = fmask.select.scroll.mod.small;
                        break;
                    case 'large'   :
                        j = fmask.select.scroll.mod.large;
                        break;
                }
            }

        }

        // @ select dom html

        data = '<div class="fmask select" id="select-' + $( e ).attr( 'id' ) + '" ' + width + ' ' + scroll + '>'
            + '<div class="h">'
            + '<i></i>'
            + '<i data-icon="arrow"></i>'
            + '<label>' + label + '</label>'
            + '</div>'
            + '<div class="b"><div class="s"><ol>' + option + '</ol></div></div>'
            + '</div>';

        $( e ).addClass( 'hidden' ).after( data );

        // @ scroll status

        if ( fmask.select.scroll.status ) {
            $( '#select-' + $( e ).attr( 'id' ) + ' .s' ).slimScroll( { height: j + 'px' } );
        }

    }

    // @ dongu sonrası tetikle

    if ( fmask.total == fmask.count ) {
        formmask();
    }

    fmask.count++;

} );

// form mask after function

function formmask() {

    $( '.select .h' ).click( function ( event ) {

        s      = $( this ).parent();
        b      = $( this ).next();
        label  = $( this ).children( 'label' );
        option = $( b ).find( 'li' );
        select = $( '#' + $( s ).attr( 'id' ).replace( 'select-', '' ) );

        if ( !$( b ).hasClass( 'on' ) ) {
            $( '.select' ).removeClass( 'on' );
            $( '.select .b' ).removeClass( 'on' ).slideUp( 'fast' );
            $( b ).addClass( 'on' ).slideDown( 'fast' );
            $( s ).addClass( 'on' );

        }
        else {
            $( b ).removeClass( 'on' ).slideUp( 'fast' );
            $( s ).removeClass( 'on' );
        }

        $( option ).click( function () {
            $( b ).removeClass( 'on' ).slideUp( 'fast' );
            $( label ).html( $( this ).html() );
            $( option ).removeAttr( 'data-selected' );
            $( this ).attr( 'data-selected', 'on' );
            $( select ).val( $( this ).attr( 'data-value' ) );
            $( s ).removeClass( 'on' );
            updateStatut( $( this ).data() );
        } );

    } );

    $( '.fmask.select' ).clickoutside( function () {

        fmask_select_close();

    } );

    $( document ).keydown( function ( e ) {

        if ( e.keyCode == 27 ) {

            fmask_select_close();
        }

    } );

}

function fmask_select_close() {
    $( '.fmask.select .b' ).removeClass( 'on' ).slideUp( 'fast' );
    $( '.fmask.select' ).removeClass( 'on' );
}
function updateStatut( objet ) {
    /* infoColor:"#0933FF"
     infoName:"Retard justifiés"
     infoSelect:"undefined"
     infoSelector:"statut-661"
     selected:"on"
     value:3*/
    if ( objet.infoSelector !== "undefined" ) {
        document.querySelectorAll( objet.infoSelector + '>span' )[0].style.background=objet.infoColor;
        document.querySelectorAll( objet.infoSelector + '>span' )[1].innerHTML=objet.infoName;
        document.querySelectorAll( objet.infoSelector + '>img' )[0].style.borderColor=objet.infoColor;
    }
}
jQuery( function ( $ ) {
    $(".chosen-select").chosen();
} );
// Tooltip

$( '[data-toggle="tooltip"]' ).tooltip( {
    'trigger': 'hover focus',
    'html': true,
    'container': 'body',
    'delay': { "show": 500, "hide": 100 },
    'animation':true
} );

jQuery( function ( $ ) {
    $( ".close" ).on( 'click', function () {
        $( this ).parent().remove()
    } );
} );
jQuery( function ( $ ) {
    if ( false ) {
        introJs().start();
        introJs().setOption( "skipLabel", "Finir" );
    }
} );
$('.nav-tabs a').click(function ( event ) {
    event.preventDefault();
    $('.one-tab-container--active').removeClass('one-tab-container--active');
    $('.nav-tabs__item--active').removeClass('nav-tabs__item--active');
    $(this).addClass('nav-tabs__item--active');
    $($(this).attr('href')).addClass('one-tab-container--active');
});
jQuery( function ( $ ) {
    var writteStudent = function ( aStudent ) {
        $( '.list-student' ).empty();
        aStudent.forEach( function ( student ) {
            var sFullname = student.first_name + ' ' + student.last_name;
            $( '.list-student' ).append( "<li>" + sFullname + "</li>" );
        } )
    };

    $( ".load-students-from-cour" ).on( "change", function () {
        $.ajax( {
            url: "http://localhost:8888/classe/" + this.value + "/students",

            success: function ( json, statut ) {
                if ( statut == "success" ) {
                    writteStudent( json );
                }
            }
        } );
    } )
} );
jQuery( function ( $ ) {
    var toggled = false;
    $( "#oLinkPassword" ).click( function ( even ) {
        even.preventDefault();
        toggled = !toggled;
        $( "#password" ).attr( 'type', toggled ? "text" : "password" );
        $( "#oLinkPassword svg use" ).attr( 'xlink:href', toggled ? "#shape-iris" : "#shape-iris_close" );
    } );
} );
jQuery( function ( $ ) {
    $( "[data-form]" ).click( function ( e ) {
        e.preventDefault();
        $( '.' + this.getAttribute( 'data-form' ) ).toggleClass( 'form--show' );
        $('.form--show input[type=text]').first().focus();
        e.stopPropagation();
    } );
    $( document ).click( function () {
        fRemoveClass();
    } );
    $( '.form-hidde form').click( function ( e ) {
        e.stopPropagation();
    } );

    jQuery( document ).keyup( function ( e ) {
        if ( e.keyCode == 27 ) {
            fRemoveClass();
        }
    } );

    var fRemoveClass = function () {
        $( '.form--show' ).removeClass( 'form--show' );
    }

} );


jQuery( function ( $ ) {
    var fReadURL = function ( input ) {
        if ( input.files && input.files[ 0 ] ) {
            var reader = new FileReader();

            reader.onload = function ( e ) {
                $( '#user-avatar' ).attr( {
                    'src': e.target.result
                } );
            };
            reader.readAsDataURL( input.files[ 0 ] );
        }
    };

    $( "#avatar" ).change( function () {
        fReadURL( this );
        $(".profile-avatar__placeholder img").removeClass("animate-avatar").delay(10).queue(function(){
            $(this).addClass("animate-avatar").dequeue();
        });
      /*  $( ".profile-avatar__placeholder img" ).hide( 'slow', function () {
            $( this ).show( 'slow' );
        } );*/
        $( ".profile-avatar__placeholder" ).attr( "class", "profile-avatar__placeholder avatar--success" );
    } );
} );

jQuery( function ( $ ) {

    $( "#student-list" ).change( function () {
        handleFiles( this.files );
    } );
    var handleFiles = function ( files ) {
        // Check for the various File API support.
        if ( window.FileReader ) {
            // FileReader are supported.
            getAsText( files[ 0 ] );
        } else {
            alert( 'Votre navigateur n’est pas en mesure de supporter ça' );
        }
    };

    function getAsText( fileToRead ) {
        var reader = new FileReader();
        // Handle errors load
        reader.onload  = loadHandler;
        reader.onerror = errorHandler;
        // Read file into memory as UTF-8
        reader.readAsText( fileToRead );
    }

    function loadHandler( event ) {
        var csv = event.target.result;
        processData( csv );
    }

    function processData( csv ) {
        var allTextLines = csv.split( /\r\n|\n/ );
        var lines        = [];
        while ( allTextLines.length ) {
            lines.push( allTextLines.shift().split( ',' ) );
        }
        drawOutput( lines );
    }

    function errorHandler( evt ) {
        if ( evt.target.error.name == "NotReadableError" ) {
            alert( "Canno't read file !" );
        }
    }

    function drawOutput( lines ) {
        //Clear previous data
        var li     = $( "<li>", { class: "student-item student-item-succes layout__item u-4/12" } );
        var parent = $( "#student-import-list" ),
            allElement;
        parent.empty();
        for ( var i = 1; i < lines.length; i++ ) {
            allElement = lines[ i ][ 0 ].split( ";" );
            li         = $( "<li>", {
                text: allElement[ 1 ] +' '+ allElement[ 2 ],
                class: "student-item student-item-succes layout__item u-4/12"
            } );
            parent.append( li );
        }
    }

} );
(function () {
    "use strict";
    $( '.is_present :radio' ).change( function () {
        $( this ).closest( '.is_present' ).find('.profile-picture').toggleClass( 'profile-picture--absent' );
    } );
})();
(function (){ var b="",aa="\x00",ba="\n",ca="\n//# sourceURL=",da="\n;return exports});\n//# sourceURL=",k=" ",ea=" &#160;",fa=" onreadystatechange='goog.onScriptLoad_(this, ",ga=" should not be enumerable in Object.prototype.",l='"',ha='");',ia='">\x3c/script>',ja="#",ka="$1",la="%s",q="&",ma="&#0;",na="&#101;",oa="&#39;",pa="&amp;",qa="&gt;",ra="&lt;",sa="&quot;",ta="'",ua="(^",va=")' ",wa=")([a-z])",xa=");",ya=", ",za="-",Aa="-$1",r=".",Ba="..",Ca="...",u="/",Da="/loader.js",v="0",Ea="0,(function(){",w=": ",
x="<",Fa="\x3c/script>",Ga="<br />",Ha="<br>",Ia='<script type="text/javascript" src="',Ja='<script type="text/javascript">',Ka=">",La=">\x3c/script>",Ma="?",Na="Already loaded ",Pa="American Samoa",Qa="Antigua and Barbuda",Ra="Assertion failed",Sa="BY_WHOLE",y="Bolivia",z="Bosna i Hercegovina",Ta="Botswana",Ua="British Virgin Islands",Va="Cayman Islands",Wa="Christmas Island",Xa="Expected Element but got %s: %s.",Ya="Expected array but got %s: %s.",Za="Expected boolean but got %s: %s.",$a="Expected function but got %s: %s.",
ab="Expected instanceof %s but got %s.",bb="Expected number but got %s: %s.",cb="Expected object but got %s: %s.",db="Expected string but got %s: %s.",eb="Failure",fb="Falkland Islands",B="Ghana",gb="Guin\u00e9e \u00e9quatoriale",hb="Guyane fran\u00e7aise",ib="HEAD",jb="Honduras",kb="Indonesia",lb="Itoophiyaa",mb="JavaScript",nb="Kalaallit Nunaat",ob="Kiribati",pb="Load packages + dependencies - previous: ",qb="Loading css files: ",rb="LocaleNameConstants",sb="Luxembourg",tb="Madagascar",ub="Marshall Islands",
C="Micronesia",vb="Moldova, Republica",wb="Nederlandse Antillen",xb="New Zealand",D="Nigeria",yb="Norfolk Island",zb="Northern Mariana Islands",Ab="Nouvelle-Cal\u00e9donie",E="Papua New Guinea",Bb="Paraguay",Cb="Philippines",Db="Polyn\u00e9sie fran\u00e7aise",Eb="Puerto Rico",Fb="Rep\u00fablica Dominicana",F="Rwanda",Gb="Rywvaneth Unys",Hb="R\u00e9publique centrafricaine",Ib="R\u00e9publique d\u00e9mocratique du Congo",Jb="SCRIPT",Kb="Saint Kitts and Nevis",Lb="Saint Vincent and the Grenadines",Mb=
"Saint-Pierre-et-Miquelon",Nb="Serbia and Montenegro",Ob="Seychelles",Pb="Slovensk\u00e1 republika",Qb="Solomon Islands",G="South Africa",Rb="Svalbard og Jan Mayen",Ub="Swaziland",Vb="S\u00e3o Tom\u00e9 e Pr\u00edncipe",H="S\u00e9n\u00e9gal",Wb="Tanzania",Xb="Timor Leste",I="Tokelau",Yb="Turks and Caicos Islands",J="Tuvalu",K="T\u00fcrkiye",Zb="U.S. Virgin Islands",$b="United Kingdom",ac="United States",bc="United States Minor Outlying Islands",cc="Unknown or Invalid Region",L="Vanuatu",dc="Wallis-et-Futuna",
ec="[object Array]",fc="[object Function]",gc="[object Window]",hc="\\$1",ic="\\s",jc="\\u",kc="\\x",lc="\\x08",mc="]+",M="_",nc="amp",oc="annotatedtimeline",N="array",pc="base.js",qc="boolean",O="browserchart",rc="call",sc="callback after loading ",tc="charts",P="complete",uc="corechart",vc="div",wc="document",Q="dygraph",xc="e",yc="en",zc="end loadScript: ",Ac="error",R="function",Bc="g",Cc="get",Dc="goog",Ec="goog.loadModule(",Fc='goog.loadModule(function(exports) {"use strict";',Gc='goog.retrieveAndExecModule_("',
Hc="goog_",Ic="google",Jc="google.charts.load",Kc="google.charts.load version ",Lc="gt",Mc="head",Nc="href",Oc="id",Pc="iframe",S="imagechart",Qc="javascript",Rc="link",Sc="load",Tc="load-css-",Uc="loadCSSFile: ",Vc="loadScript: ",Wc="loading css failed: ",Xc="lt",Yc="native code",Zc="none",$c="null",ad="number",bd="o",T="object",cd="onload",dd="quot",ed="rel",fd="removeAttribute",gd="script",hd="splice",id="string",jd="stylesheet",kd="text/css",ld="text/javascript",U="top",md="type",V="ui",nd="ui_base",
od="unknown",pd="unknown type name",qd="var ",rd="var _evalTest_ = 1;",sd="visualization",td="webfontloader",ud="write",vd="{cssFile}",wd="{language}",xd="{package}",yd="{prefix}",zd="{prefix}/{version}/css/{cssFile}",Ad="{prefix}/{version}/third_party/{package}",Bd="{version}",Cd="|[",Dd="})",Ed="~",Fd="\u0080",Gd="\u010cesk\u00e1 republika",Hd="\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u044c",Id="\u041a\u044b\u0440\u0433\u044b\u0437\u0441\u0442\u0430\u043d",Jd="\u043c\u043e\u043d\u0433\u043e\u043b\u044c\u0441\u043a\u0438\u0439",
Kd="\u0540\u0561\u0575\u0561\u057d\u057f\u0561\u0576\u056b \u0540\u0561\u0576\u0580\u0561\u057a\u0565\u057f\u0578\u0582\u0569\u056b\u0582\u0576",Ld="\u0627\u0641\u063a\u0627\u0646\u0633\u062a\u0627\u0646",Md="\u0627\u0644\u0627\u0645\u0627\u0631\u0627\u062a \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0627\u0644\u0645\u062a\u062d\u062f\u0629",Nd="\u0627\u0644\u0635\u062d\u0631\u0627\u0621 \u0627\u0644\u063a\u0631\u0628\u064a\u0629",Od="\u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0627\u0644\u0633\u0639\u0648\u062f\u064a\u0629",
Pd="\u0627\u0644\u0648\u0644\u0627\u064a\u0627\u062a \u0627\u0644\u0645\u062a\u062d\u062f\u0629 \u0627\u0644\u0623\u0645\u0631\u064a\u0643\u064a\u0629",Qd="\u062c\u0632\u0631 \u0627\u0644\u0642\u0645\u0631",Rd="\u067e\u0627\u06a9\u0633\u062a\u0627\u0646",W="\u092d\u093e\u0930\u0924",X="\u12a2\u1275\u12ee\u1335\u12eb",Sd="\uc870\uc120 \ubbfc\uc8fc\uc8fc\uc758 \uc778\ubbfc \uacf5\ud654\uad6d",Td="\ufffd";function Y(){return function(){}}var Z=Z||{};Z.global=this;Z.P=function(a){return void 0!==a};
Z.Aa=function(a,c,d){a=a.split(r);d=d||Z.global;a[0]in d||!d.execScript||d.execScript(qd+a[0]);for(var e;a.length&&(e=a.shift());)!a.length&&Z.P(c)?d[e]=c:d=d[e]?d[e]:d[e]={}};Z.ue=function(a,c){Z.Aa(a,c)};Z.H=!0;Z.Cd=yc;Z.ra=!0;Z.ec=!1;Z.Ob=!Z.H;Z.Ya=!1;Z.Gf=function(a){if(Z.La())throw Error("goog.provide can not be used within a goog.module.");Z.fb(a)};Z.fb=function(a,c){Z.Aa(a,c)};Z.mc=/^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
Z.Oa=function(a){if(!Z.h(a)||!a||-1==a.search(Z.mc))throw Error("Invalid module identifier");if(!Z.La())throw Error("Module "+a+" has been loaded incorrectly.");if(Z.j.Pa)throw Error("goog.module may only be called once per module.");Z.j.Pa=a};Z.Oa.get=Y();Z.Oa.Ge=Y();Z.j=null;Z.La=function(){return null!=Z.j};Z.Oa.xa=function(){Z.j.xa=!0};Z.Zf=function(a){if(Z.Ob)throw a=a||b,Error("Importing test-only code into non-debug environment"+(a?w+a:r));};Z.Be=Y();
Z.kb=function(){for(var a=[Ic,tc,Sc],c=Z.global,d;d=a.shift();)if(Z.Ic(c[d]))c=c[d];else return null;return c};Z.Re=function(a,c){var d=c||Z.global,e;for(e in a)d[e]=a[e]};Z.Id=function(a,c,d,e){if(Z.Wa){var f;a=a.replace(/\\/g,u);var g=Z.i;e&&typeof e!==qc||(e=e?{module:Dc}:{});for(var h=0;f=c[h];h++)g.U[f]=a,g.Ra[a]=e.module==Dc;for(e=0;c=d[e];e++)a in g.G||(g.G[a]={}),g.G[a][c]=!0}};Z.yg=!1;Z.zd=!0;Z.uf=function(a){Z.global.console&&Z.global.console.error(a)};Z.Uf=Y();Z.F=b;Z.Bf=Y();
Z.Hd=function(){throw Error("unimplemented abstract method");};Z.Jd=function(a){a.Fe=function(){if(a.vb)return a.vb;Z.H&&(Z.wb[Z.wb.length]=a);return a.vb=new a}};Z.wb=[];Z.Vb=!0;Z.cc=Z.H;Z.Sc={};Z.Wa=!1;
Z.Wa&&(Z.i={Ra:{},U:{},G:{},Hb:{},qa:{},X:{}},Z.tb=function(){var a=Z.global.document;return null!=a&&ud in a},Z.Ac=function(){if(Z.P(Z.global.Lb))Z.F=Z.global.Lb;else if(Z.tb())for(var a=Z.global.document.getElementsByTagName(Jb),c=a.length-1;0<=c;--c){var d=a[c].src,e=d.lastIndexOf(Ma),e=-1==e?d.length:e;if(d.substr(e-7,7)==pc){Z.F=d.substr(0,e-7);break}}},Z.Ha=function(a,c){(Z.global.rd||Z.od)(a,c)&&(Z.i.qa[a]=!0)},Z.Ub=!(Z.global.atob||!Z.global.document||!Z.global.document.all),Z.Gc=function(a){Z.Ha(b,
Gc+a+ha)&&(Z.i.qa[a]=!0)},Z.Sa=[],Z.Ag=function(a,c){return Z.Vb&&Z.P(Z.global.JSON)?Ec+Z.global.JSON.stringify(c+ca+a+ba)+xa:Fc+c+da+a+ba},Z.Rc=function(){var a=Z.Sa.length;if(0<a){var c=Z.Sa;Z.Sa=[];for(var d=0;d<a;d++)Z.Bb(c[d])}},Z.vf=function(a){Z.xb(a)&&Z.nc(a)&&Z.Bb(Z.F+Z.Ga(a))},Z.xb=function(a){return(a=Z.Ga(a))&&Z.i.Ra[a]?Z.F+a in Z.i.X:!1},Z.nc=function(a){if((a=Z.Ga(a))&&a in Z.i.G)for(var c in Z.i.G[a])if(!Z.Mc(c)&&!Z.xb(c))return!1;return!0},Z.Bb=function(a){if(a in Z.i.X){var c=Z.i.X[a];
delete Z.i.X[a];Z.Fc(c)}},Z.tf=Y(),Z.sf=function(a){var c=Z.j;try{Z.j={Pa:void 0,xa:!1};var d;if(Z.yb(a))d=a.call(Z.global,{});else if(Z.h(a))d=Z.Pc.call(Z.global,a);else throw Error("Invalid module definition");var e=Z.j.Pa;if(!Z.h(e)||!e)throw Error('Invalid module name "'+e+l);Z.j.xa?Z.fb(e,d):Z.cc&&Object.seal&&Object.seal(d);Z.Sc[e]=d}finally{Z.j=c}},Z.Pc=function(a){eval(a);return{}},Z.md=function(a){Z.global.document.write(Ia+a+ia)},Z.pc=function(a){var c=Z.global.document,d=c.createElement(gd);
d.type=ld;d.src=a;d.defer=!1;d.async=!1;c.head.appendChild(d)},Z.od=function(a,c){if(Z.tb()){var d=Z.global.document;if(!Z.Ya&&d.readyState==P){if(/\bdeps.js$/.test(a))return!1;throw Error('Cannot write "'+a+'" after document load');}var e=Z.Ub;void 0===c?e?(e=fa+ ++Z.zb+va,d.write(Ia+a+l+e+La)):Z.Ya?Z.pc(a):Z.md(a):d.write(Ja+c+Fa);return!0}return!1},Z.zb=0,Z.Df=function(a,c){a.readyState==P&&Z.zb==c&&Z.Rc();return!0},Z.Bg=function(a){function c(a){if(!(a in f.qa||a in f.Hb)){f.Hb[a]=!0;if(a in f.G)for(var g in f.G[a])if(!Z.Mc(g))if(g in
f.U)c(f.U[g]);else throw Error("Undefined nameToPath for "+g);a in e||(e[a]=!0,d.push(a))}}var d=[],e={},f=Z.i;c(a);for(a=0;a<d.length;a++){var g=d[a];Z.i.qa[g]=!0}var h=Z.j;Z.j=null;for(a=0;a<d.length;a++)if(g=d[a])f.Ra[g]?Z.Gc(Z.F+g):Z.Ha(Z.F+g);else throw Z.j=h,Error("Undefined script input");Z.j=h},Z.Ga=function(a){return a in Z.i.U?Z.i.U[a]:null},Z.Ac(),Z.global.td||Z.Ha(Z.F+"deps.js"));
Z.yf=function(a){a=a.split(u);for(var c=0;c<a.length;)a[c]==r?a.splice(c,1):c&&a[c]==Ba&&a[c-1]&&a[c-1]!=Ba?a.splice(--c,2):c++;return a.join(u)};Z.rf=function(a){if(Z.global.Mb)return Z.global.Mb(a);var c=new Z.global.XMLHttpRequest;c.open(Cc,a,!1);c.send();return c.responseText};Z.Vf=Y();
Z.s=function(a){var c=typeof a;if(c==T)if(a){if(a instanceof Array)return N;if(a instanceof Object)return c;var d=Object.prototype.toString.call(a);if(d==gc)return T;if(d==ec||typeof a.length==ad&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable(hd))return N;if(d==fc||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable(rc))return R}else return $c;else if(c==R&&"undefined"==typeof a.call)return T;return c};
Z.gf=function(a){return null===a};Z.Ic=function(a){return null!=a};Z.isArray=function(a){return Z.s(a)==N};Z.Ja=function(a){var c=Z.s(a);return c==N||c==T&&typeof a.length==ad};Z.bf=function(a){return Z.$(a)&&typeof a.getFullYear==R};Z.h=function(a){return typeof a==id};Z.Hc=function(a){return typeof a==qc};Z.Lc=function(a){return typeof a==ad};Z.yb=function(a){return Z.s(a)==R};Z.$=function(a){var c=typeof a;return c==T&&null!=a||c==R};Z.qb=function(a){return a[Z.D]||(a[Z.D]=++Z.hd)};Z.Se=function(a){return!!a[Z.D]};
Z.Zc=function(a){null!==a&&fd in a&&a.removeAttribute(Z.D);try{delete a[Z.D]}catch(c){}};Z.D="closure_uid_"+(1E9*Math.random()>>>0);Z.hd=0;Z.De=Z.qb;Z.Rf=Z.Zc;Z.uc=function(a){var c=Z.s(a);if(c==T||c==N){if(a.clone)return a.clone();var c=c==N?[]:{},d;for(d in a)c[d]=Z.uc(a[d]);return c}return a};Z.tc=function(a,c,d){return a.call.apply(a.bind,arguments)};
Z.rc=function(a,c,d){if(!a)throw Error();if(2<arguments.length){var e=Array.prototype.slice.call(arguments,2);return function(){var d=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(d,e);return a.apply(c,d)}}return function(){return a.apply(c,arguments)}};Z.bind=function(a,c,d){Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf(Yc)?Z.bind=Z.tc:Z.bind=Z.rc;return Z.bind.apply(null,arguments)};
Z.Wc=function(a,c){var d=Array.prototype.slice.call(arguments,1);return function(){var c=d.slice();c.push.apply(c,arguments);return a.apply(this,c)}};Z.wf=function(a,c){for(var d in c)a[d]=c[d]};Z.now=Z.ra&&Date.now||function(){return+new Date};
Z.Fc=function(a){if(Z.global.execScript)Z.global.execScript(a,mb);else if(Z.global.eval){if(null==Z.Y)if(Z.global.eval(rd),"undefined"!=typeof Z.global._evalTest_){try{delete Z.global._evalTest_}catch(e){}Z.Y=!0}else Z.Y=!1;if(Z.Y)Z.global.eval(a);else{var c=Z.global.document,d=c.createElement(Jb);d.type=ld;d.defer=!1;d.appendChild(c.createTextNode(a));c.body.appendChild(d);c.body.removeChild(d)}}else throw Error("goog.globalEval not available");};Z.Y=null;
Z.Ce=function(a,c){function d(a){a=a.split(za);for(var c=[],d=0;d<a.length;d++)c.push(e(a[d]));return c.join(za)}function e(a){return Z.gb[a]||a}var f;f=Z.gb?Z.xc==Sa?e:d:function(a){return a};return c?a+za+f(c):f(a)};Z.Wf=function(a,c){Z.gb=a;Z.xc=c};Z.Je=function(a,c){c&&(a=a.replace(/\{\$([^}]+)}/g,function(a,e){return null!=c&&e in c?c[e]:a}));return a};Z.Ke=function(a){return a};Z.Ba=function(a,c){Z.Aa(a,c,void 0)};Z.ze=function(a,c,d){a[c]=d};
Z.Ia=function(a,c){function d(){}d.prototype=c.prototype;a.oa=c.prototype;a.prototype=new d;a.prototype.constructor=a;a.qc=function(a,d,g){for(var h=Array(arguments.length-2),m=2;m<arguments.length;m++)h[m-2]=arguments[m];return c.prototype[d].apply(a,h)}};
Z.qc=function(a,c,d){var e=arguments.callee.caller;if(Z.ec||Z.H&&!e)throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");if(e.oa){for(var f=Array(arguments.length-1),g=1;g<arguments.length;g++)f[g-1]=arguments[g];return e.oa.constructor.apply(a,f)}f=Array(arguments.length-2);for(g=2;g<arguments.length;g++)f[g-2]=arguments[g];for(var g=!1,h=a.constructor;h;h=h.oa&&h.oa.constructor)if(h.prototype[c]===
e)g=!0;else if(g)return h.prototype[c].apply(a,f);if(a[c]===e)return a.constructor.prototype[c].apply(a,f);throw Error("goog.base called from a method of one name to a method of a different name");};Z.scope=function(a){if(Z.La())throw Error("goog.scope is not supported within a goog.module.");a.call(Z.global)};
Z.u=function(a,c){var d=c.constructor,e=c.cd;d&&d!=Object.prototype.constructor||(d=function(){throw Error("cannot instantiate an interface (no constructor defined).");});d=Z.u.vc(d,a);a&&Z.Ia(d,a);delete c.constructor;delete c.cd;Z.u.$a(d.prototype,c);null!=e&&(e instanceof Function?e(d):Z.u.$a(d,e));return d};Z.u.bc=Z.H;
Z.u.vc=function(a,c){if(Z.u.bc&&Object.seal instanceof Function){if(c&&c.prototype&&c.prototype[Z.kc])return a;var d=function(){var c=a.apply(this,arguments)||this;c[Z.D]=c[Z.D];this.constructor===d&&Object.seal(c);return c};return d}return a};Z.u.Za="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
Z.u.$a=function(a,c){for(var d in c)Object.prototype.hasOwnProperty.call(c,d)&&(a[d]=c[d]);for(var e=0;e<Z.u.Za.length;e++)d=Z.u.Za[e],Object.prototype.hasOwnProperty.call(c,d)&&(a[d]=c[d])};Z.gg=Y();Z.kc="goog_defineClass_legacy_unsealable";Z.debug={};Z.debug.Error=function(a){if(Error.captureStackTrace)Error.captureStackTrace(this,Z.debug.Error);else{var c=Error().stack;c&&(this.stack=c)}a&&(this.message=String(a))};Z.Ia(Z.debug.Error,Error);Z.debug.Error.prototype.name="CustomError";Z.hb={};Z.hb.$b={Pb:1,pd:2,Gd:3,qd:4,Bd:5,Ad:6,Fd:7,ud:8,wd:9,yd:10,xd:11,Dd:12};Z.c={};Z.c.Xa=!1;Z.c.Rb=!1;Z.c.lc={Yb:"\u00a0"};Z.c.startsWith=function(a,c){return 0==a.lastIndexOf(c,0)};Z.c.endsWith=function(a,c){var d=a.length-c.length;return 0<=d&&a.indexOf(c,d)==d};Z.c.je=function(a,c){return 0==Z.c.eb(c,a.substr(0,c.length))};Z.c.fe=function(a,c){return 0==Z.c.eb(c,a.substr(a.length-c.length,c.length))};Z.c.ge=function(a,c){return a.toLowerCase()==c.toLowerCase()};
Z.c.dd=function(a,c){for(var d=a.split(la),e=b,f=Array.prototype.slice.call(arguments,1);f.length&&1<d.length;)e+=d.shift()+f.shift();return e+d.join(la)};Z.c.le=function(a){return a.replace(/[\s\xa0]+/g,k).replace(/^\s+|\s+$/g,b)};Z.c.Ka=function(a){return/^[\s\xa0]*$/.test(a)};Z.c.df=function(a){return 0==a.length};Z.c.Jc=Z.c.Ka;Z.c.Kc=function(a){return Z.c.Ka(Z.c.Tc(a))};Z.c.cf=Z.c.Kc;Z.c.$e=function(a){return!/[^\t\n\r ]/.test(a)};Z.c.Ye=function(a){return!/[^a-zA-Z]/.test(a)};Z.c.hf=function(a){return!/[^0-9]/.test(a)};
Z.c.Ze=function(a){return!/[^a-zA-Z0-9]/.test(a)};Z.c.lf=function(a){return a==k};Z.c.mf=function(a){return 1==a.length&&a>=k&&a<=Ed||a>=Fd&&a<=Td};Z.c.eg=function(a){return a.replace(/(\r\n|\r|\n)+/g,k)};Z.c.Yd=function(a){return a.replace(/(\r\n|\r|\n)/g,ba)};Z.c.Af=function(a){return a.replace(/\xa0|\s/g,k)};Z.c.zf=function(a){return a.replace(/\xa0|[ \t]+/g,k)};Z.c.ke=function(a){return a.replace(/[\t\r\n ]+/g,k).replace(/^[\t\r\n ]+|[\t\r\n ]+$/g,b)};
Z.c.trim=Z.ra&&String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,b)};Z.c.trimLeft=function(a){return a.replace(/^[\s\xa0]+/,b)};Z.c.trimRight=function(a){return a.replace(/[\s\xa0]+$/,b)};Z.c.eb=function(a,c){var d=String(a).toLowerCase(),e=String(c).toLowerCase();return d<e?-1:d==e?0:1};
Z.c.Db=function(a,c,d){if(a==c)return 0;if(!a)return-1;if(!c)return 1;for(var e=a.toLowerCase().match(d),f=c.toLowerCase().match(d),g=Math.min(e.length,f.length),h=0;h<g;h++){d=e[h];var m=f[h];if(d!=m)return a=parseInt(d,10),!isNaN(a)&&(c=parseInt(m,10),!isNaN(c)&&a-c)?a-c:d<m?-1:1}return e.length!=f.length?e.length-f.length:a<c?-1:1};Z.c.We=function(a,c){return Z.c.Db(a,c,/\d+|\D+/g)};Z.c.Dc=function(a,c){return Z.c.Db(a,c,/\d+|\.\d+|\D+/g)};Z.c.Cf=Z.c.Dc;Z.c.xg=function(a){return encodeURIComponent(String(a))};
Z.c.wg=function(a){return decodeURIComponent(a.replace(/\+/g,k))};Z.c.Uc=function(a,c){return a.replace(/(\r\n|\r|\n)/g,c?Ga:Ha)};Z.c.rb=function(a){if(!Z.c.Jb.test(a))return a;-1!=a.indexOf(q)&&(a=a.replace(Z.c.Kb,pa));-1!=a.indexOf(x)&&(a=a.replace(Z.c.Xb,ra));-1!=a.indexOf(Ka)&&(a=a.replace(Z.c.Sb,qa));-1!=a.indexOf(l)&&(a=a.replace(Z.c.ac,sa));-1!=a.indexOf(ta)&&(a=a.replace(Z.c.dc,oa));-1!=a.indexOf(aa)&&(a=a.replace(Z.c.Zb,ma));Z.c.Xa&&-1!=a.indexOf(xc)&&(a=a.replace(Z.c.Qb,na));return a};
Z.c.Kb=/&/g;Z.c.Xb=/</g;Z.c.Sb=/>/g;Z.c.ac=/"/g;Z.c.dc=/'/g;Z.c.Zb=/\x00/g;Z.c.Qb=/e/g;Z.c.Jb=Z.c.Xa?/[\x00&<>"'e]/:/[\x00&<>"']/;Z.c.Fb=function(a){return Z.c.contains(a,q)?!Z.c.Rb&&wc in Z.global?Z.c.Gb(a):Z.c.jd(a):a};Z.c.vg=function(a,c){return Z.c.contains(a,q)?Z.c.Gb(a,c):a};
Z.c.Gb=function(a,c){var d={"&amp;":q,"&lt;":x,"&gt;":Ka,"&quot;":l},e;e=c?c.createElement(vc):Z.global.document.createElement(vc);return a.replace(Z.c.Tb,function(a,c){var h=d[a];if(h)return h;if(c.charAt(0)==ja){var m=Number(v+c.substr(1));isNaN(m)||(h=String.fromCharCode(m))}h||(e.innerHTML=a+k,h=e.firstChild.nodeValue.slice(0,-1));return d[a]=h})};
Z.c.jd=function(a){return a.replace(/&([^;]+);/g,function(a,d){switch(d){case nc:return q;case Xc:return x;case Lc:return Ka;case dd:return l;default:if(d.charAt(0)==ja){var e=Number(v+d.substr(1));if(!isNaN(e))return String.fromCharCode(e)}return a}})};Z.c.Tb=/&([^;\s<&]+);?/g;Z.c.zg=function(a,c){return Z.c.Uc(a.replace(/  /g,ea),c)};Z.c.Ff=function(a){return a.replace(/(^|[\n ]) /g,ka+Z.c.lc.Yb)};
Z.c.fg=function(a,c){for(var d=c.length,e=0;e<d;e++){var f=1==d?c:c.charAt(e);if(a.charAt(0)==f&&a.charAt(a.length-1)==f)return a.substring(1,a.length-1)}return a};Z.c.truncate=function(a,c,d){d&&(a=Z.c.Fb(a));a.length>c&&(a=a.substring(0,c-3)+Ca);d&&(a=Z.c.rb(a));return a};
Z.c.rg=function(a,c,d,e){d&&(a=Z.c.Fb(a));if(e&&a.length>c)e>c&&(e=c),a=a.substring(0,c-e)+Ca+a.substring(a.length-e);else if(a.length>c){e=Math.floor(c/2);var f=a.length-e;a=a.substring(0,e+c%2)+Ca+a.substring(f)}d&&(a=Z.c.rb(a));return a};Z.c.Va={"\x00":"\\0","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\x0B",'"':'\\"',"\\":"\\\\","<":x};Z.c.ea={"'":"\\'"};
Z.c.quote=function(a){a=String(a);for(var c=[l],d=0;d<a.length;d++){var e=a.charAt(d),f=e.charCodeAt(0);c[d+1]=Z.c.Va[e]||(31<f&&127>f?e:Z.c.ib(e))}c.push(l);return c.join(b)};Z.c.ye=function(a){for(var c=[],d=0;d<a.length;d++)c[d]=Z.c.ib(a.charAt(d));return c.join(b)};
Z.c.ib=function(a){if(a in Z.c.ea)return Z.c.ea[a];if(a in Z.c.Va)return Z.c.ea[a]=Z.c.Va[a];var c=a,d=a.charCodeAt(0);if(31<d&&127>d)c=a;else{if(256>d){if(c=kc,16>d||256<d)c+=v}else c=jc,4096>d&&(c+=v);c+=d.toString(16).toUpperCase()}return Z.c.ea[a]=c};Z.c.contains=function(a,c){return-1!=a.indexOf(c)};Z.c.$d=function(a,c){return Z.c.contains(a.toLowerCase(),c.toLowerCase())};Z.c.qe=function(a,c){return a&&c?a.split(c).length-1:0};
Z.c.L=function(a,c,d){var e=a;0<=c&&c<a.length&&0<d&&(e=a.substr(0,c)+a.substr(c+d,a.length-c-d));return e};Z.c.remove=function(a,c){var d=new RegExp(Z.c.Ta(c),b);return a.replace(d,b)};Z.c.Of=function(a,c){var d=new RegExp(Z.c.Ta(c),Bc);return a.replace(d,b)};Z.c.Ta=function(a){return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,hc).replace(/\x08/g,lc)};Z.c.repeat=String.prototype.repeat?function(a,c){return a.repeat(c)}:function(a,c){return Array(c+1).join(a)};
Z.c.Ef=function(a,c,d){a=Z.P(d)?a.toFixed(d):String(a);d=a.indexOf(r);-1==d&&(d=a.length);return Z.c.repeat(v,Math.max(0,c-d))+a};Z.c.Tc=function(a){return null==a?b:String(a)};Z.c.Xd=function(a){return Array.prototype.join.call(arguments,b)};Z.c.Ne=function(){return Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Z.now()).toString(36)};
Z.c.oe=function(a,c){for(var d=0,e=Z.c.trim(String(a)).split(r),f=Z.c.trim(String(c)).split(r),g=Math.max(e.length,f.length),h=0;0==d&&h<g;h++){var m=e[h]||b,n=f[h]||b,p=/(\d*)(\D*)/g,Oa=/(\d*)(\D*)/g;do{var A=p.exec(m)||[b,b,b],t=Oa.exec(n)||[b,b,b];if(0==A[0].length&&0==t[0].length)break;d=Z.c.ua(0==A[1].length?0:parseInt(A[1],10),0==t[1].length?0:parseInt(t[1],10))||Z.c.ua(0==A[2].length,0==t[2].length)||Z.c.ua(A[2],t[2])}while(0==d)}return d};Z.c.ua=function(a,c){return a<c?-1:a>c?1:0};
Z.c.Te=function(a){for(var c=0,d=0;d<a.length;++d)c=31*c+a.charCodeAt(d)>>>0;return c};Z.c.kd=2147483648*Math.random()|0;Z.c.re=function(){return Hc+Z.c.kd++};Z.c.jg=function(a){var c=Number(a);return 0==c&&Z.c.Ka(a)?NaN:c};Z.c.ef=function(a){return/^[a-z]+([A-Z][a-z]*)*$/.test(a)};Z.c.nf=function(a){return/^([A-Z][a-z]*)+$/.test(a)};Z.c.hg=function(a){return String(a).replace(/\-([a-z])/g,function(a,d){return d.toUpperCase()})};Z.c.pg=function(a){return String(a).replace(/([A-Z])/g,Aa).toLowerCase()};
Z.c.qg=function(a,c){var d=Z.h(c)?Z.c.Ta(c):ic;return a.replace(new RegExp(ua+(d?Cd+d+mc:b)+wa,Bc),function(a,c,d){return c+d.toUpperCase()})};Z.c.Zd=function(a){return String(a.charAt(0)).toUpperCase()+String(a.substr(1)).toLowerCase()};Z.c.parseInt=function(a){isFinite(a)&&(a=String(a));return Z.h(a)?/^\s*-?0x/i.test(a)?parseInt(a,16):parseInt(a,10):NaN};Z.c.cg=function(a,c,d){a=a.split(c);for(var e=[];0<d&&a.length;)e.push(a.shift()),d--;a.length&&e.push(a.join(c));return e};
Z.c.qf=function(a,c){if(c)typeof c==id&&(c=[c]);else return a;for(var d=-1,e=0;e<c.length;e++)if(c[e]!=b){var f=a.lastIndexOf(c[e]);f>d&&(d=f)}return-1==d?a:a.slice(d+1)};Z.c.we=function(a,c){var d=[],e=[];if(a==c)return 0;if(!a.length||!c.length)return Math.max(a.length,c.length);for(var f=0;f<c.length+1;f++)d[f]=f;for(f=0;f<a.length;f++){e[0]=f+1;for(var g=0;g<c.length;g++)e[g+1]=Math.min(e[g]+1,d[g+1]+1,d[g]+Number(a[f]!=c[g]));for(g=0;g<d.length;g++)d[g]=e[g]}return e[c.length]};Z.g={};Z.g.o=Z.H;Z.g.V=function(a,c){c.unshift(a);Z.debug.Error.call(this,Z.c.dd.apply(null,c));c.shift()};Z.Ia(Z.g.V,Z.debug.Error);Z.g.V.prototype.name="AssertionError";Z.g.Nb=function(a){throw a;};Z.g.ya=Z.g.Nb;Z.g.A=function(a,c,d,e){var f=Ra;if(d)var f=f+(w+d),g=e;else a&&(f+=w+a,g=c);a=new Z.g.V(b+f,g||[]);Z.g.ya(a)};Z.g.Xf=function(a){Z.g.o&&(Z.g.ya=a)};Z.g.assert=function(a,c,d){Z.g.o&&!a&&Z.g.A(b,null,c,Array.prototype.slice.call(arguments,2));return a};
Z.g.Ca=function(a,c){Z.g.o&&Z.g.ya(new Z.g.V(eb+(a?w+a:b),Array.prototype.slice.call(arguments,1)))};Z.g.Pd=function(a,c,d){Z.g.o&&!Z.Lc(a)&&Z.g.A(bb,[Z.s(a),a],c,Array.prototype.slice.call(arguments,2));return a};Z.g.Sd=function(a,c,d){Z.g.o&&!Z.h(a)&&Z.g.A(db,[Z.s(a),a],c,Array.prototype.slice.call(arguments,2));return a};Z.g.Nd=function(a,c,d){Z.g.o&&!Z.yb(a)&&Z.g.A($a,[Z.s(a),a],c,Array.prototype.slice.call(arguments,2));return a};
Z.g.Qd=function(a,c,d){Z.g.o&&!Z.$(a)&&Z.g.A(cb,[Z.s(a),a],c,Array.prototype.slice.call(arguments,2));return a};Z.g.Kd=function(a,c,d){Z.g.o&&!Z.isArray(a)&&Z.g.A(Ya,[Z.s(a),a],c,Array.prototype.slice.call(arguments,2));return a};Z.g.Ld=function(a,c,d){Z.g.o&&!Z.Hc(a)&&Z.g.A(Za,[Z.s(a),a],c,Array.prototype.slice.call(arguments,2));return a};Z.g.Md=function(a,c,d){!Z.g.o||Z.$(a)&&a.nodeType==Z.hb.$b.Pb||Z.g.A(Xa,[Z.s(a),a],c,Array.prototype.slice.call(arguments,2));return a};
Z.g.Od=function(a,c,d,e){!Z.g.o||a instanceof c||Z.g.A(ab,[Z.g.pb(c),Z.g.pb(a)],d,Array.prototype.slice.call(arguments,3));return a};Z.g.Rd=function(){for(var a in Object.prototype)Z.g.Ca(a+ga)};Z.g.pb=function(a){return a instanceof Function?a.displayName||a.name||pd:a instanceof Object?a.constructor.displayName||a.constructor.name||Object.prototype.toString.call(a):null===a?$c:typeof a};Z.f={};Z.w=Z.ra;Z.f.v=!1;Z.f.Xc=function(a){return a[a.length-1]};Z.f.pf=Z.f.Xc;Z.f.indexOf=Z.w&&(Z.f.v||Array.prototype.indexOf)?function(a,c,d){return Array.prototype.indexOf.call(a,c,d)}:function(a,c,d){d=null==d?0:0>d?Math.max(0,a.length+d):d;if(Z.h(a))return Z.h(c)&&1==c.length?a.indexOf(c,d):-1;for(;d<a.length;d++)if(d in a&&a[d]===c)return d;return-1};
Z.f.lastIndexOf=Z.w&&(Z.f.v||Array.prototype.lastIndexOf)?function(a,c,d){return Array.prototype.lastIndexOf.call(a,c,null==d?a.length-1:d)}:function(a,c,d){d=null==d?a.length-1:d;0>d&&(d=Math.max(0,a.length+d));if(Z.h(a))return Z.h(c)&&1==c.length?a.lastIndexOf(c,d):-1;for(;0<=d;d--)if(d in a&&a[d]===c)return d;return-1};
Z.f.forEach=Z.w&&(Z.f.v||Array.prototype.forEach)?function(a,c,d){Array.prototype.forEach.call(a,c,d)}:function(a,c,d){for(var e=a.length,f=Z.h(a)?a.split(b):a,g=0;g<e;g++)g in f&&c.call(d,f[g],g,a)};Z.f.jb=function(a,c){for(var d=Z.h(a)?a.split(b):a,e=a.length-1;0<=e;--e)e in d&&c.call(void 0,d[e],e,a)};
Z.f.filter=Z.w&&(Z.f.v||Array.prototype.filter)?function(a,c,d){return Array.prototype.filter.call(a,c,d)}:function(a,c,d){for(var e=a.length,f=[],g=0,h=Z.h(a)?a.split(b):a,m=0;m<e;m++)if(m in h){var n=h[m];c.call(d,n,m,a)&&(f[g++]=n)}return f};Z.f.map=Z.w&&(Z.f.v||Array.prototype.map)?function(a,c,d){return Array.prototype.map.call(a,c,d)}:function(a,c,d){for(var e=a.length,f=Array(e),g=Z.h(a)?a.split(b):a,h=0;h<e;h++)h in g&&(f[h]=c.call(d,g[h],h,a));return f};
Z.f.reduce=Z.w&&(Z.f.v||Array.prototype.reduce)?function(a,c,d,e){e&&(c=Z.bind(c,e));return Array.prototype.reduce.call(a,c,d)}:function(a,c,d,e){var f=d;Z.f.forEach(a,function(d,h){f=c.call(e,f,d,h,a)});return f};Z.f.reduceRight=Z.w&&(Z.f.v||Array.prototype.reduceRight)?function(a,c,d,e){e&&(c=Z.bind(c,e));return Array.prototype.reduceRight.call(a,c,d)}:function(a,c,d,e){var f=d;Z.f.jb(a,function(d,h){f=c.call(e,f,d,h,a)});return f};
Z.f.some=Z.w&&(Z.f.v||Array.prototype.some)?function(a,c,d){return Array.prototype.some.call(a,c,d)}:function(a,c,d){for(var e=a.length,f=Z.h(a)?a.split(b):a,g=0;g<e;g++)if(g in f&&c.call(d,f[g],g,a))return!0;return!1};Z.f.every=Z.w&&(Z.f.v||Array.prototype.every)?function(a,c,d){return Array.prototype.every.call(a,c,d)}:function(a,c,d){for(var e=a.length,f=Z.h(a)?a.split(b):a,g=0;g<e;g++)if(g in f&&!c.call(d,f[g],g,a))return!1;return!0};
Z.f.count=function(a,c,d){var e=0;Z.f.forEach(a,function(a,g,h){c.call(d,a,g,h)&&++e},d);return e};Z.f.find=function(a,c,d){c=Z.f.findIndex(a,c,d);return 0>c?null:Z.h(a)?a.charAt(c):a[c]};Z.f.findIndex=function(a,c,d){for(var e=a.length,f=Z.h(a)?a.split(b):a,g=0;g<e;g++)if(g in f&&c.call(d,f[g],g,a))return g;return-1};Z.f.Ae=function(a,c,d){c=Z.f.Bc(a,c,d);return 0>c?null:Z.h(a)?a.charAt(c):a[c]};
Z.f.Bc=function(a,c,d){for(var e=Z.h(a)?a.split(b):a,f=a.length-1;0<=f;f--)if(f in e&&c.call(d,e[f],f,a))return f;return-1};Z.f.contains=function(a,c){return 0<=Z.f.indexOf(a,c)};Z.f.Jc=function(a){return 0==a.length};Z.f.clear=function(a){if(!Z.isArray(a))for(var c=a.length-1;0<=c;c--)delete a[c];a.length=0};Z.f.Ue=function(a,c){Z.f.contains(a,c)||a.push(c)};Z.f.ub=function(a,c,d){Z.f.splice(a,d,0,c)};Z.f.Ve=function(a,c,d){Z.Wc(Z.f.splice,a,d,0).apply(null,c)};
Z.f.insertBefore=function(a,c,d){var e;2==arguments.length||0>(e=Z.f.indexOf(a,d))?a.push(c):Z.f.ub(a,c,e)};Z.f.remove=function(a,c){var d=Z.f.indexOf(a,c),e;(e=0<=d)&&Z.f.L(a,d);return e};Z.f.Tf=function(a,c){var d=Z.f.lastIndexOf(a,c);return 0<=d?(Z.f.L(a,d),!0):!1};Z.f.L=function(a,c){return 1==Array.prototype.splice.call(a,c,1).length};Z.f.Sf=function(a,c,d){c=Z.f.findIndex(a,c,d);return 0<=c?(Z.f.L(a,c),!0):!1};
Z.f.Pf=function(a,c,d){var e=0;Z.f.jb(a,function(f,g){c.call(d,f,g,a)&&Z.f.L(a,g)&&e++});return e};Z.f.concat=function(a){return Array.prototype.concat.apply(Array.prototype,arguments)};Z.f.join=function(a){return Array.prototype.concat.apply(Array.prototype,arguments)};Z.f.fd=function(a){var c=a.length;if(0<c){for(var d=Array(c),e=0;e<c;e++)d[e]=a[e];return d}return[]};Z.f.clone=Z.f.fd;
Z.f.extend=function(a,c){for(var d=1;d<arguments.length;d++){var e=arguments[d];if(Z.Ja(e)){var f=a.length||0,g=e.length||0;a.length=f+g;for(var h=0;h<g;h++)a[f+h]=e[h]}else a.push(e)}};Z.f.splice=function(a,c,d,e){return Array.prototype.splice.apply(a,Z.f.slice(arguments,1))};Z.f.slice=function(a,c,d){return 2>=arguments.length?Array.prototype.slice.call(a,c):Array.prototype.slice.call(a,c,d)};
Z.f.Qf=function(a,c,d){function e(a){return Z.$(a)?bd+Z.qb(a):(typeof a).charAt(0)+a}c=c||a;d=d||e;for(var f={},g=0,h=0;h<a.length;){var m=a[h++],n=d(m);Object.prototype.hasOwnProperty.call(f,n)||(f[n]=!0,c[g++]=m)}c.length=g};Z.f.bb=function(a,c,d){return Z.f.cb(a,d||Z.f.B,!1,c)};Z.f.Vd=function(a,c,d){return Z.f.cb(a,c,!0,void 0,d)};Z.f.cb=function(a,c,d,e,f){for(var g=0,h=a.length,m;g<h;){var n=g+h>>1,p;p=d?c.call(f,a[n],n,a):c(e,a[n]);0<p?g=n+1:(h=n,m=!p)}return m?g:~g};
Z.f.sort=function(a,c){a.sort(c||Z.f.B)};Z.f.dg=function(a,c){for(var d=Array(a.length),e=0;e<a.length;e++)d[e]={index:e,value:a[e]};var f=c||Z.f.B;Z.f.sort(d,function(a,c){return f(a.value,c.value)||a.index-c.index});for(e=0;e<a.length;e++)a[e]=d[e].value};Z.f.bd=function(a,c,d){var e=d||Z.f.B;Z.f.sort(a,function(a,d){return e(c(a),c(d))})};Z.f.ag=function(a,c,d){Z.f.bd(a,function(a){return a[c]},d)};
Z.f.kf=function(a,c,d){c=c||Z.f.B;for(var e=1;e<a.length;e++){var f=c(a[e-1],a[e]);if(0<f||0==f&&d)return!1}return!0};Z.f.xe=function(a,c,d){if(!Z.Ja(a)||!Z.Ja(c)||a.length!=c.length)return!1;var e=a.length;d=d||Z.f.yc;for(var f=0;f<e;f++)if(!d(a[f],c[f]))return!1;return!0};Z.f.me=function(a,c,d){d=d||Z.f.B;for(var e=Math.min(a.length,c.length),f=0;f<e;f++){var g=d(a[f],c[f]);if(0!=g)return g}return Z.f.B(a.length,c.length)};Z.f.B=function(a,c){return a>c?1:a<c?-1:0};
Z.f.Xe=function(a,c){return-Z.f.B(a,c)};Z.f.yc=function(a,c){return a===c};Z.f.Td=function(a,c,d){d=Z.f.bb(a,c,d);return 0>d?(Z.f.ub(a,c,-(d+1)),!0):!1};Z.f.Ud=function(a,c,d){c=Z.f.bb(a,c,d);return 0<=c?Z.f.L(a,c):!1};Z.f.Wd=function(a,c,d){for(var e={},f=0;f<a.length;f++){var g=a[f],h=c.call(d,g,f,a);Z.P(h)&&(e[h]||(e[h]=[])).push(g)}return e};Z.f.og=function(a,c,d){var e={};Z.f.forEach(a,function(f,g){e[c.call(d,f,g,a)]=f});return e};
Z.f.Hf=function(a,c,d){var e=[],f=0,g=a;d=d||1;void 0!==c&&(f=a,g=c);if(0>d*(g-f))return[];if(0<d)for(a=f;a<g;a+=d)e.push(a);else for(a=f;a>g;a+=d)e.push(a);return e};Z.f.repeat=function(a,c){for(var d=[],e=0;e<c;e++)d[e]=a;return d};Z.f.Cc=function(a){for(var c=[],d=0;d<arguments.length;d++){var e=arguments[d];if(Z.isArray(e))for(var f=0;f<e.length;f+=8192)for(var g=Z.f.Cc.apply(null,Z.f.slice(e,f,f+8192)),h=0;h<g.length;h++)c.push(g[h]);else c.push(e)}return c};
Z.f.rotate=function(a,c){a.length&&(c%=a.length,0<c?Array.prototype.unshift.apply(a,a.splice(-c,c)):0>c&&Array.prototype.push.apply(a,a.splice(0,-c)));return a};Z.f.xf=function(a,c,d){c=Array.prototype.splice.call(a,c,1);Array.prototype.splice.call(a,d,0,c[0])};
Z.f.Cg=function(a){if(!arguments.length)return[];for(var c=[],d=arguments[0].length,e=1;e<arguments.length;e++)arguments[e].length<d&&(d=arguments[e].length);for(e=0;e<d;e++){for(var f=[],g=0;g<arguments.length;g++)f.push(arguments[g][e]);c.push(f)}return c};Z.f.$f=function(a,c){for(var d=c||Math.random,e=a.length-1;0<e;e--){var f=Math.floor(d()*(e+1)),g=a[e];a[e]=a[f];a[f]=g}};Z.f.pe=function(a,c){var d=[];Z.f.forEach(c,function(c){d.push(a[c])});return d};Z.locale={};
Z.locale.J={COUNTRY:{AD:"Andorra",AE:Md,AF:Ld,AG:Qa,AI:"Anguilla",AL:"Shqip\u00ebria",AM:Kd,AN:wb,AO:"Angola",AQ:"Antarctica",AR:"Argentina",AS:Pa,AT:"\u00d6sterreich",AU:"Australia",AW:"Aruba",AX:"\u00c5land",AZ:"Az\u0259rbaycan",BA:z,BB:"Barbados",BD:"\u09ac\u09be\u0982\u09b2\u09be\u09a6\u09c7\u09b6",BE:"Belgi\u00eb",BF:"Burkina Faso",BG:"\u0411\u044a\u043b\u0433\u0430\u0440\u0438\u044f",BH:"\u0627\u0644\u0628\u062d\u0631\u064a\u0646",BI:"Burundi",BJ:"B\u00e9nin",BM:"Bermuda",BN:"Brunei",BO:y,BR:"Brasil",
BS:"Bahamas",BT:"\u092d\u0942\u091f\u093e\u0928",BV:"Bouvet Island",BW:Ta,BY:Hd,BZ:"Belize",CA:"Canada",CC:"Cocos (Keeling) Islands",CD:Ib,CF:Hb,CG:"Congo",CH:"Schweiz",CI:"C\u00f4te d\u2019Ivoire",CK:"Cook Islands",CL:"Chile",CM:"Cameroun",CN:"\u4e2d\u56fd",CO:"Colombia",CR:"Costa Rica",CS:Nb,CU:"Cuba",CV:"Cabo Verde",CX:Wa,CY:"\u039a\u03cd\u03c0\u03c1\u03bf\u03c2",CZ:Gd,DD:"East Germany",DE:"Deutschland",DJ:"Jabuuti",DK:"Danmark",DM:"Dominica",DO:Fb,DZ:"\u0627\u0644\u062c\u0632\u0627\u0626\u0631",
EC:"Ecuador",EE:"Eesti",EG:"\u0645\u0635\u0631",EH:Nd,ER:"\u0627\u0631\u064a\u062a\u0631\u064a\u0627",ES:"Espa\u00f1a",ET:X,FI:"Suomi",FJ:"\u092b\u093f\u091c\u0940",FK:fb,FM:C,FO:"F\u00f8royar",FR:"France",FX:"Metropolitan France",GA:"Gabon",GB:$b,GD:"Grenada",GE:"\u10e1\u10d0\u10e5\u10d0\u10e0\u10d7\u10d5\u10d4\u10da\u10dd",GF:hb,GG:"Guernsey",GH:B,GI:"Gibraltar",GL:nb,GM:"Gambia",GN:"Guin\u00e9e",GP:"Guadeloupe",GQ:gb,GR:"\u0395\u03bb\u03bb\u03ac\u03b4\u03b1",GS:"South Georgia and the South Sandwich Islands",
GT:"Guatemala",GU:"Guam",GW:"Guin\u00e9 Bissau",GY:"Guyana",HK:"\u9999\u6e2f",HM:"Heard Island and McDonald Islands",HN:jb,HR:"Hrvatska",HT:"Ha\u00efti",HU:"Magyarorsz\u00e1g",ID:kb,IE:"Ireland",IL:"\u05d9\u05e9\u05e8\u05d0\u05dc",IM:"Isle of Man",IN:W,IO:"British Indian Ocean Territory",IQ:"\u0627\u0644\u0639\u0631\u0627\u0642",IR:"\u0627\u06cc\u0631\u0627\u0646",IS:"\u00cdsland",IT:"Italia",JE:"Jersey",JM:"Jamaica",JO:"\u0627\u0644\u0623\u0631\u062f\u0646",JP:"\u65e5\u672c",KE:"Kenya",KG:Id,KH:"\u1780\u1798\u17d2\u1796\u17bb\u1787\u17b6",
KI:ob,KM:Qd,KN:Kb,KP:Sd,KR:"\ub300\ud55c\ubbfc\uad6d",KW:"\u0627\u0644\u0643\u0648\u064a\u062a",KY:Va,KZ:"\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d",LA:"\u0e25\u0e32\u0e27",LB:"\u0644\u0628\u0646\u0627\u0646",LC:"Saint Lucia",LI:"Liechtenstein",LK:"\u0b87\u0bb2\u0b99\u0bcd\u0b95\u0bc8",LR:"Liberia",LS:"Lesotho",LT:"Lietuva",LU:sb,LV:"Latvija",LY:"\u0644\u064a\u0628\u064a\u0627",MA:"\u0627\u0644\u0645\u063a\u0631\u0628",MC:"Monaco",MD:vb,ME:"\u0426\u0440\u043d\u0430 \u0413\u043e\u0440\u0430",
MG:tb,MH:ub,MK:"\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0438\u0458\u0430",ML:"\u0645\u0627\u0644\u064a",MM:"Myanmar",MN:"\u8499\u53e4",MO:"\u6fb3\u95e8",MP:zb,MQ:"Martinique",MR:"\u0645\u0648\u0631\u064a\u062a\u0627\u0646\u064a\u0627",MS:"Montserrat",MT:"Malta",MU:"Mauritius",MV:"Maldives",MW:"Malawi",MX:"M\u00e9xico",MY:"Malaysia",MZ:"Mo\u00e7ambique",NA:"Namibia",NC:Ab,NE:"Niger",NF:yb,NG:D,NI:"Nicaragua",NL:"Nederland",NO:"Norge",NP:"\u0928\u0947\u092a\u093e\u0932",NR:"Nauru",NT:"Neutral Zone",
NU:"Niue",NZ:xb,OM:"\u0639\u0645\u0627\u0646",PA:"Panam\u00e1",PE:"Per\u00fa",PF:Db,PG:E,PH:Cb,PK:Rd,PL:"Polska",PM:Mb,PN:"Pitcairn",PR:Eb,PS:"\u0641\u0644\u0633\u0637\u064a\u0646",PT:"Portugal",PW:"Palau",PY:Bb,QA:"\u0642\u0637\u0631",QO:"Outlying Oceania",QU:"European Union",RE:"R\u00e9union",RO:"Rom\u00e2nia",RS:"\u0421\u0440\u0431\u0438\u0458\u0430",RU:"\u0420\u043e\u0441\u0441\u0438\u044f",RW:F,SA:Od,SB:Qb,SC:Ob,SD:"\u0627\u0644\u0633\u0648\u062f\u0627\u0646",SE:"Sverige",SG:"\u65b0\u52a0\u5761",
SH:"Saint Helena",SI:"Slovenija",SJ:Rb,SK:Pb,SL:"Sierra Leone",SM:"San Marino",SN:H,SO:"Somali",SR:"Suriname",ST:Vb,SU:"Union of Soviet Socialist Republics",SV:"El Salvador",SY:"\u0633\u0648\u0631\u064a\u0627",SZ:Ub,TC:Yb,TD:"\u062a\u0634\u0627\u062f",TF:"French Southern Territories",TG:"Togo",TH:"\u0e1b\u0e23\u0e30\u0e40\u0e17\u0e28\u0e44\u0e17\u0e22",TJ:"\u062a\u0627\u062c\u06cc\u06a9\u0633\u062a\u0627\u0646",TK:I,TL:Xb,TM:"\u0422\u0443\u0440\u043a\u043c\u0435\u043d\u0438\u0441\u0442\u0430\u043d",
TN:"\u062a\u0648\u0646\u0633",TO:"Tonga",TR:K,TT:"Trinidad y Tobago",TV:J,TW:"\u53f0\u6e7e",TZ:Wb,UA:"\u0423\u043a\u0440\u0430\u0457\u043d\u0430",UG:"Uganda",UM:bc,US:ac,UY:"Uruguay",UZ:"\u040e\u0437\u0431\u0435\u043a\u0438\u0441\u0442\u043e\u043d",VA:"Vaticano",VC:Lb,VE:"Venezuela",VG:Ua,VI:Zb,VN:"Vi\u1ec7t Nam",VU:L,WF:dc,WS:"Samoa",YD:"People's Democratic Republic of Yemen",YE:"\u0627\u0644\u064a\u0645\u0646",YT:"Mayotte",ZA:G,ZM:"Zambia",ZW:"Zimbabwe",ZZ:cc,aa_DJ:"Jabuuti",aa_ER:"\u00c9rythr\u00e9e",
aa_ER_SAAHO:"\u00c9rythr\u00e9e",aa_ET:lb,af_NA:"Namibi\u00eb",af_ZA:"Suid-Afrika",ak_GH:B,am_ET:X,ar_AE:Md,ar_BH:"\u0627\u0644\u0628\u062d\u0631\u064a\u0646",ar_DJ:"\u062c\u064a\u0628\u0648\u062a\u064a",ar_DZ:"\u0627\u0644\u062c\u0632\u0627\u0626\u0631",ar_EG:"\u0645\u0635\u0631",ar_EH:Nd,ar_ER:"\u0627\u0631\u064a\u062a\u0631\u064a\u0627",ar_IL:"\u0627\u0633\u0631\u0627\u0626\u064a\u0644",ar_IQ:"\u0627\u0644\u0639\u0631\u0627\u0642",ar_JO:"\u0627\u0644\u0623\u0631\u062f\u0646",ar_KM:Qd,ar_KW:"\u0627\u0644\u0643\u0648\u064a\u062a",
ar_LB:"\u0644\u0628\u0646\u0627\u0646",ar_LY:"\u0644\u064a\u0628\u064a\u0627",ar_MA:"\u0627\u0644\u0645\u063a\u0631\u0628",ar_MR:"\u0645\u0648\u0631\u064a\u062a\u0627\u0646\u064a\u0627",ar_OM:"\u0639\u0645\u0627\u0646",ar_PS:"\u0641\u0644\u0633\u0637\u064a\u0646",ar_QA:"\u0642\u0637\u0631",ar_SA:Od,ar_SD:"\u0627\u0644\u0633\u0648\u062f\u0627\u0646",ar_SY:"\u0633\u0648\u0631\u064a\u0627",ar_TD:"\u062a\u0634\u0627\u062f",ar_TN:"\u062a\u0648\u0646\u0633",ar_YE:"\u0627\u0644\u064a\u0645\u0646",as_IN:"\u09ad\u09be\u09f0\u09a4",
ay_BO:y,az_AZ:"Az\u0259rbaycan",az_Cyrl_AZ:"\u0410\u0437\u04d9\u0440\u0431\u0430\u0458\u04b9\u0430\u043d",az_Latn_AZ:"Azerbaycan",be_BY:Hd,bg_BG:"\u0411\u044a\u043b\u0433\u0430\u0440\u0438\u044f",bi_VU:L,bn_BD:"\u09ac\u09be\u0982\u09b2\u09be\u09a6\u09c7\u09b6",bn_IN:"\u09ad\u09be\u09b0\u09a4",bo_CN:"\u0f62\u0f92\u0fb1\u0f0b\u0f53\u0f42",bo_IN:"\u0f62\u0f92\u0fb1\u0f0b\u0f42\u0f62\u0f0b",bs_BA:z,byn_ER:"\u12a4\u122d\u1275\u122b",ca_AD:"Andorra",ca_ES:"Espanya",cch_NG:D,ch_GU:"Guam",chk_FM:C,cop_Arab_EG:"\u0645\u0635\u0631",
cop_Arab_US:Pd,cop_EG:"\u0645\u0635\u0631",cop_US:Pd,cs_CZ:Gd,cy_GB:"Prydain Fawr",da_DK:"Danmark",da_GL:"Gr\u00f8nland",de_AT:"\u00d6sterreich",de_BE:"Belgien",de_CH:"Schweiz",de_DE:"Deutschland",de_LI:"Liechtenstein",de_LU:"Luxemburg",dv_MV:"Maldives",dz_BT:"Bhutan",ee_GH:B,ee_TG:"Togo",efi_NG:D,el_CY:"\u039a\u03cd\u03c0\u03c1\u03bf\u03c2",el_GR:"\u0395\u03bb\u03bb\u03ac\u03b4\u03b1",en_AG:Qa,en_AI:"Anguilla",en_AS:Pa,en_AU:"Australia",en_BB:"Barbados",en_BE:"Belgium",en_BM:"Bermuda",en_BS:"Bahamas",
en_BW:Ta,en_BZ:"Belize",en_CA:"Canada",en_CC:"Cocos Islands",en_CK:"Cook Islands",en_CM:"Cameroon",en_CX:Wa,en_DM:"Dominica",en_FJ:"Fiji",en_FK:fb,en_FM:C,en_GB:$b,en_GD:"Grenada",en_GG:"Guernsey",en_GH:B,en_GI:"Gibraltar",en_GM:"Gambia",en_GU:"Guam",en_GY:"Guyana",en_HK:"Hong Kong",en_HN:jb,en_IE:"Ireland",en_IM:"Isle of Man",en_IN:"India",en_JE:"Jersey",en_JM:"Jamaica",en_KE:"Kenya",en_KI:ob,en_KN:Kb,en_KY:Va,en_LC:"Saint Lucia",en_LR:"Liberia",en_LS:"Lesotho",en_MH:ub,en_MP:zb,en_MS:"Montserrat",
en_MT:"Malta",en_MU:"Mauritius",en_MW:"Malawi",en_NA:"Namibia",en_NF:yb,en_NG:D,en_NR:"Nauru",en_NU:"Niue",en_NZ:xb,en_PG:E,en_PH:Cb,en_PK:"Pakistan",en_PN:"Pitcairn",en_PR:Eb,en_RW:F,en_SB:Qb,en_SC:Ob,en_SG:"Singapore",en_SH:"Saint Helena",en_SL:"Sierra Leone",en_SZ:Ub,en_TC:Yb,en_TK:I,en_TO:"Tonga",en_TT:"Trinidad and Tobago",en_TV:J,en_TZ:Wb,en_UG:"Uganda",en_UM:bc,en_US:ac,en_US_POSIX:ac,en_VC:Lb,en_VG:Ua,en_VI:Zb,en_VU:L,en_WS:"Samoa",en_ZA:G,en_ZM:"Zambia",en_ZW:"Zimbabwe",es_AR:"Argentina",
es_BO:y,es_CL:"Chile",es_CO:"Colombia",es_CR:"Costa Rica",es_CU:"Cuba",es_DO:Fb,es_EC:"Ecuador",es_ES:"Espa\u00f1a",es_GQ:"Guinea Ecuatorial",es_GT:"Guatemala",es_HN:jb,es_MX:"M\u00e9xico",es_NI:"Nicaragua",es_PA:"Panam\u00e1",es_PE:"Per\u00fa",es_PH:"Filipinas",es_PR:Eb,es_PY:Bb,es_SV:"El Salvador",es_US:"Estados Unidos",es_UY:"Uruguay",es_VE:"Venezuela",et_EE:"Eesti",eu_ES:"Espainia",fa_AF:Ld,fa_IR:"\u0627\u06cc\u0631\u0627\u0646",fi_FI:"Suomi",fil_PH:Cb,fj_FJ:"Fiji",fo_FO:"F\u00f8royar",fr_BE:"Belgique",
fr_BF:"Burkina Faso",fr_BI:"Burundi",fr_BJ:"B\u00e9nin",fr_CA:"Canada",fr_CD:Ib,fr_CF:Hb,fr_CG:"Congo",fr_CH:"Suisse",fr_CI:"C\u00f4te d\u2019Ivoire",fr_CM:"Cameroun",fr_DJ:"Djibouti",fr_DZ:"Alg\u00e9rie",fr_FR:"France",fr_GA:"Gabon",fr_GF:hb,fr_GN:"Guin\u00e9e",fr_GP:"Guadeloupe",fr_GQ:gb,fr_HT:"Ha\u00efti",fr_KM:"Comores",fr_LU:sb,fr_MA:"Maroc",fr_MC:"Monaco",fr_MG:tb,fr_ML:"Mali",fr_MQ:"Martinique",fr_MU:"Maurice",fr_NC:Ab,fr_NE:"Niger",fr_PF:Db,fr_PM:Mb,fr_RE:"R\u00e9union",fr_RW:F,fr_SC:Ob,fr_SN:H,
fr_SY:"Syrie",fr_TD:"Tchad",fr_TG:"Togo",fr_TN:"Tunisie",fr_VU:L,fr_WF:dc,fr_YT:"Mayotte",fur_IT:"Italia",ga_IE:"\u00c9ire",gaa_GH:B,gez_ER:"\u12a4\u122d\u1275\u122b",gez_ET:X,gil_KI:ob,gl_ES:"Espa\u00f1a",gn_PY:Bb,gu_IN:"\u0aad\u0abe\u0ab0\u0aa4",gv_GB:Gb,ha_Arab_NG:"\u0646\u064a\u062c\u064a\u0631\u064a\u0627",ha_GH:"\u063a\u0627\u0646\u0627",ha_Latn_GH:B,ha_Latn_NE:"Niger",ha_Latn_NG:"Nig\u00e9ria",ha_NE:"\u0627\u0644\u0646\u064a\u062c\u0631",ha_NG:"\u0646\u064a\u062c\u064a\u0631\u064a\u0627",haw_US:"\u02bbAmelika Hui P\u016b \u02bbIa",
he_IL:"\u05d9\u05e9\u05e8\u05d0\u05dc",hi_IN:W,ho_PG:E,hr_BA:z,hr_HR:"Hrvatska",ht_HT:"Ha\u00efti",hu_HU:"Magyarorsz\u00e1g",hy_AM:Kd,hy_AM_REVISED:Kd,id_ID:kb,ig_NG:D,ii_CN:"\ua34f\ua1e9",is_IS:"\u00cdsland",it_CH:"Svizzera",it_IT:"Italia",it_SM:"San Marino",ja_JP:"\u65e5\u672c",ka_GE:"\u10e1\u10d0\u10e5\u10d0\u10e0\u10d7\u10d5\u10d4\u10da\u10dd",kaj_NG:D,kam_KE:"Kenya",kcg_NG:D,kfo_NG:"Nig\u00e9ria",kk_KZ:"\u049a\u0430\u0437\u0430\u049b\u0441\u0442\u0430\u043d",kl_GL:nb,km_KH:"\u1780\u1798\u17d2\u1796\u17bb\u1787\u17b6",
kn_IN:"\u0cad\u0cbe\u0cb0\u0ca4",ko_KP:Sd,ko_KR:"\ub300\ud55c\ubbfc\uad6d",kok_IN:W,kos_FM:C,kpe_GN:"Guin\u00e9e",kpe_LR:"Lib\u00e9ria",ks_IN:W,ku_IQ:"Irak",ku_IR:"\u0130ran",ku_Latn_IQ:"Irak",ku_Latn_IR:"\u0130ran",ku_Latn_SY:"Suriye",ku_Latn_TR:K,ku_SY:"Suriye",ku_TR:K,kw_GB:Gb,ky_Cyrl_KG:Id,ky_KG:"K\u0131rg\u0131zistan",la_VA:"Vaticano",lb_LU:sb,ln_CD:Ib,ln_CG:"Kongo",lo_LA:"Laos",lt_LT:"Lietuva",lv_LV:"Latvija",mg_MG:tb,mh_MH:ub,mi_NZ:xb,mk_MK:"\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0438\u0458\u0430",
ml_IN:"\u0d07\u0d28\u0d4d\u0d24\u0d4d\u0d2f",mn_Cyrl_MN:"\u041c\u043e\u043d\u0433\u043e\u043b\u0438\u044f",mn_MN:"\u041c\u043e\u043d\u0433\u043e\u043b\u0438\u044f",mr_IN:W,ms_BN:"Brunei",ms_MY:"Malaysia",ms_SG:"Singapura",mt_MT:"Malta",my_MM:"Myanmar",na_NR:"Nauru",nb_NO:"Norge",nb_SJ:Rb,ne_NP:"\u0928\u0947\u092a\u093e\u0932",niu_NU:"Niue",nl_AN:wb,nl_AW:"Aruba",nl_BE:"Belgi\u00eb",nl_NL:"Nederland",nl_SR:"Suriname",nn_NO:"Noreg",nr_ZA:G,nso_ZA:G,ny_MW:"Malawi",om_ET:lb,om_KE:"Keeniyaa",or_IN:"\u0b2d\u0b3e\u0b30\u0b24",
pa_Arab_PK:Rd,pa_Guru_IN:"\u0a2d\u0a3e\u0a30\u0a24",pa_IN:"\u0a2d\u0a3e\u0a30\u0a24",pa_PK:Rd,pap_AN:wb,pau_PW:"Palau",pl_PL:"Polska",pon_FM:C,ps_AF:Ld,pt_AO:"Angola",pt_BR:"Brasil",pt_CV:"Cabo Verde",pt_GW:"Guin\u00e9 Bissau",pt_MZ:"Mo\u00e7ambique",pt_PT:"Portugal",pt_ST:Vb,pt_TL:Xb,qu_BO:y,qu_PE:"Per\u00fa",rm_CH:"Schweiz",rn_BI:"Burundi",ro_MD:vb,ro_RO:"Rom\u00e2nia",ru_BY:Hd,ru_KG:Id,ru_KZ:"\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d",ru_RU:"\u0420\u043e\u0441\u0441\u0438\u044f",ru_UA:"\u0423\u043a\u0440\u0430\u0438\u043d\u0430",
rw_RW:F,sa_IN:W,sd_Deva_IN:W,sd_IN:W,se_FI:"Finland",se_NO:"Norge",sg_CF:Hb,sh_BA:"Bosnia and Herzegovina",sh_CS:Nb,si_LK:"Sri Lanka",sid_ET:lb,sk_SK:Pb,sl_SI:"Slovenija",sm_AS:Pa,sm_WS:"Samoa",so_DJ:"Jabuuti",so_ET:"Itoobiya",so_KE:"Kiiniya",so_SO:"Soomaaliya",sq_AL:"Shqip\u00ebria",sr_BA:"\u0411\u043e\u0441\u043d\u0430 \u0438 \u0425\u0435\u0440\u0446\u0435\u0433\u043e\u0432\u0438\u043d\u0430",sr_CS:"\u0421\u0440\u0431\u0438\u0458\u0430 \u0438 \u0426\u0440\u043d\u0430 \u0413\u043e\u0440\u0430",sr_Cyrl_BA:"\u0411\u043e\u0441\u043d\u0438\u044f",
sr_Cyrl_CS:"\u0421\u0435\u0440\u0431\u0438\u044f \u0438 \u0427\u0435\u0440\u043d\u043e\u0433\u043e\u0440\u0438\u044f",sr_Cyrl_ME:"\u0427\u0435\u0440\u043d\u043e\u0433\u043e\u0440\u0438\u044f",sr_Cyrl_RS:"\u0421\u0435\u0440\u0431\u0438\u044f",sr_Latn_BA:z,sr_Latn_CS:"Srbija i Crna Gora",sr_Latn_ME:"Crna Gora",sr_Latn_RS:"Srbija",sr_ME:"\u0426\u0440\u043d\u0430 \u0413\u043e\u0440\u0430",sr_RS:"\u0421\u0440\u0431\u0438\u0458\u0430",ss_SZ:Ub,ss_ZA:G,st_LS:"Lesotho",st_ZA:G,su_ID:kb,sv_AX:"\u00c5land",
sv_FI:"Finland",sv_SE:"Sverige",sw_KE:"Kenya",sw_TZ:Wb,sw_UG:"Uganda",swb_KM:Qd,syr_SY:"Syria",ta_IN:"\u0b87\u0ba8\u0bcd\u0ba4\u0bbf\u0baf\u0bbe",ta_LK:"\u0b87\u0bb2\u0b99\u0bcd\u0b95\u0bc8",ta_SG:"\u0b9a\u0bbf\u0b99\u0bcd\u0b95\u0baa\u0bcd\u0baa\u0bc2\u0bb0\u0bcd",te_IN:"\u0c2d\u0c3e\u0c30\u0c24 \u0c26\u0c47\u0c33\u0c02",tet_TL:Xb,tg_Cyrl_TJ:"\u0422\u0430\u0434\u0436\u0438\u043a\u0438\u0441\u0442\u0430\u043d",tg_TJ:"\u062a\u0627\u062c\u06a9\u0633\u062a\u0627\u0646",th_TH:"\u0e1b\u0e23\u0e30\u0e40\u0e17\u0e28\u0e44\u0e17\u0e22",
ti_ER:"\u12a4\u122d\u1275\u122b",ti_ET:X,tig_ER:"\u12a4\u122d\u1275\u122b",tk_TM:"\u062a\u0631\u06a9\u0645\u0646\u0633\u062a\u0627\u0646",tkl_TK:I,tn_BW:Ta,tn_ZA:G,to_TO:"Tonga",tpi_PG:E,tr_CY:"G\u00fcney K\u0131br\u0131s Rum Kesimi",tr_TR:K,ts_ZA:G,tt_RU:"\u0420\u043e\u0441\u0441\u0438\u044f",tvl_TV:J,ty_PF:Db,uk_UA:"\u0423\u043a\u0440\u0430\u0457\u043d\u0430",uli_FM:C,und_ZZ:cc,ur_IN:"\u0628\u06be\u0627\u0631\u062a",ur_PK:Rd,uz_AF:"Afganistan",uz_Arab_AF:Ld,uz_Cyrl_UZ:"\u0423\u0437\u0431\u0435\u043a\u0438\u0441\u0442\u0430\u043d",
uz_Latn_UZ:"O\u02bfzbekiston",uz_UZ:"\u040e\u0437\u0431\u0435\u043a\u0438\u0441\u0442\u043e\u043d",ve_ZA:G,vi_VN:"Vi\u1ec7t Nam",wal_ET:X,wo_Arab_SN:"\u0627\u0644\u0633\u0646\u063a\u0627\u0644",wo_Latn_SN:H,wo_SN:H,xh_ZA:G,yap_FM:C,yo_NG:D,zh_CN:"\u4e2d\u56fd",zh_HK:"\u9999\u6e2f",zh_Hans_CN:"\u4e2d\u56fd",zh_Hans_SG:"\u65b0\u52a0\u5761",zh_Hant_HK:"\u4e2d\u83ef\u4eba\u6c11\u5171\u548c\u570b\u9999\u6e2f\u7279\u5225\u884c\u653f\u5340",zh_Hant_MO:"\u6fb3\u9580",zh_Hant_TW:"\u81fa\u7063",zh_MO:"\u6fb3\u95e8",
zh_SG:"\u65b0\u52a0\u5761",zh_TW:"\u53f0\u6e7e",zu_ZA:G},LANGUAGE:{aa:"afar",ab:"\u0430\u0431\u0445\u0430\u0437\u0441\u043a\u0438\u0439",ace:"Aceh",ach:"Acoli",ada:"Adangme",ady:"\u0430\u0434\u044b\u0433\u0435\u0439\u0441\u043a\u0438\u0439",ae:"Avestan",af:"Afrikaans",afa:"Afro-Asiatic Language",afh:"Afrihili",ain:"Ainu",ak:"Akan",akk:"Akkadian",ale:"Aleut",alg:"Algonquian Language",alt:"Southern Altai",am:"\u12a0\u121b\u122d\u129b",an:"Aragonese",ang:"Old English",anp:"Angika",apa:"Apache Language",
ar:"\u0627\u0644\u0639\u0631\u0628\u064a\u0629",arc:"Aramaic",arn:"Araucanian",arp:"Arapaho",art:"Artificial Language",arw:"Arawak",as:"\u0985\u09b8\u09ae\u09c0\u09af\u09bc\u09be",ast:"asturiano",ath:"Athapascan Language",aus:"Australian Language",av:"\u0430\u0432\u0430\u0440\u0441\u043a\u0438\u0439",awa:"Awadhi",ay:"aimara",az:"az\u0259rbaycanca",az_Arab:"\u062a\u0631\u06a9\u06cc \u0622\u0630\u0631\u0628\u0627\u06cc\u062c\u0627\u0646\u06cc",az_Cyrl:"\u0410\u0437\u04d9\u0440\u0431\u0430\u0458\u04b9\u0430\u043d",
az_Latn:"Azerice",ba:"\u0431\u0430\u0448\u043a\u0438\u0440\u0441\u043a\u0438\u0439",bad:"Banda",bai:"Bamileke Language",bal:"\u0628\u0644\u0648\u0686\u06cc",ban:"Balin",bas:"Basa",bat:"Baltic Language",be:"\u0431\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0430\u044f",bej:"Beja",bem:"Bemba",ber:"Berber",bg:"\u0431\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438",bh:"\u092c\u093f\u0939\u093e\u0930\u0940",bho:"Bhojpuri",bi:"bichelamar ; bislama",bik:"Bikol",bin:"Bini",bla:"Siksika",bm:"bambara",bn:"\u09ac\u09be\u0982\u09b2\u09be",
bnt:"Bantu",bo:"\u0f54\u0f7c\u0f51\u0f0b\u0f66\u0f90\u0f51\u0f0b",br:"breton",bra:"Braj",bs:"Bosanski",btk:"Batak",bua:"Buriat",bug:"Bugis",byn:"\u1265\u120a\u1295",ca:"catal\u00e0",cad:"Caddo",cai:"Central American Indian Language",car:"Carib",cau:"Caucasian Language",cch:"Atsam",ce:"\u0447\u0435\u0447\u0435\u043d\u0441\u043a\u0438\u0439",ceb:"Cebuano",cel:"Celtic Language",ch:"Chamorro",chb:"Chibcha",chg:"Chagatai",chk:"Chuukese",chm:"\u043c\u0430\u0440\u0438\u0439\u0441\u043a\u0438\u0439 (\u0447\u0435\u0440\u0435\u043c\u0438\u0441\u0441\u043a\u0438\u0439)",
chn:"Chinook Jargon",cho:"Choctaw",chp:"Chipewyan",chr:"Cherokee",chy:"Cheyenne",cmc:"Chamic Language",co:"corse",cop:"\u0642\u0628\u0637\u064a\u0629",cop_Arab:"\u0642\u0628\u0637\u064a\u0629",cpe:"English-based Creole or Pidgin",cpf:"French-based Creole or Pidgin",cpp:"Portuguese-based Creole or Pidgin",cr:"Cree",crh:"Crimean Turkish",crp:"Creole or Pidgin",cs:"\u010de\u0161tina",csb:"Kashubian",cu:"Church Slavic",cus:"Cushitic Language",cv:"\u0447\u0443\u0432\u0430\u0448\u0441\u043a\u0438\u0439",
cy:"Cymraeg",da:"dansk",dak:"Dakota",dar:"\u0434\u0430\u0440\u0433\u0432\u0430",day:"Dayak",de:"Deutsch",del:"Delaware",den:"Slave",dgr:"Dogrib",din:"Dinka",doi:"\u0627\u0644\u062f\u0648\u062c\u0631\u0649",dra:"Dravidian Language",dsb:"Lower Sorbian",dua:"Duala",dum:"Middle Dutch",dv:"Divehi",dyu:"dioula",dz:"\u0f62\u0fab\u0f7c\u0f44\u0f0b\u0f41",ee:"Ewe",efi:"Efik",egy:"Ancient Egyptian",eka:"Ekajuk",el:"\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac",elx:"Elamite",en:"English",enm:"Middle English",
eo:"esperanto",es:"espa\u00f1ol",et:"eesti",eu:"euskara",ewo:"Ewondo",fa:"\u0641\u0627\u0631\u0633\u06cc",fan:"fang",fat:"Fanti",ff:"Fulah",fi:"suomi",fil:"Filipino",fiu:"Finno-Ugrian Language",fj:"Fijian",fo:"f\u00f8royskt",fon:"Fon",fr:"fran\u00e7ais",frm:"Middle French",fro:"Old French",frr:"Northern Frisian",frs:"Eastern Frisian",fur:"friulano",fy:"Fries",ga:"Gaeilge",gaa:"Ga",gay:"Gayo",gba:"Gbaya",gd:"Scottish Gaelic",gem:"Germanic Language",gez:"\u130d\u12d5\u12dd\u129b",gil:"Gilbertese",gl:"galego",
gmh:"Middle High German",gn:"guaran\u00ed",goh:"Old High German",gon:"Gondi",gor:"Gorontalo",got:"Gothic",grb:"Grebo",grc:"\u0391\u03c1\u03c7\u03b1\u03af\u03b1 \u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac",gsw:"Schweizerdeutsch",gu:"\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0",gv:"Gaelg",gwi:"Gwich\u02bcin",ha:"\u0627\u0644\u0647\u0648\u0633\u0627",ha_Arab:"\u0627\u0644\u0647\u0648\u0633\u0627",ha_Latn:"haoussa",hai:"Haida",haw:"\u02bb\u014dlelo Hawai\u02bbi",he:"\u05e2\u05d1\u05e8\u05d9\u05ea",
hi:"\u0939\u093f\u0902\u0926\u0940",hil:"Hiligaynon",him:"Himachali",hit:"Hittite",hmn:"Hmong",ho:"Hiri Motu",hr:"hrvatski",hsb:"Upper Sorbian",ht:"ha\u00eftien",hu:"magyar",hup:"Hupa",hy:"\u0540\u0561\u0575\u0565\u0580\u0567\u0576",hz:"Herero",ia:"interlingvao",iba:"Iban",id:"Bahasa Indonesia",ie:"Interlingue",ig:"Igbo",ii:"\ua188\ua320\ua259",ijo:"Ijo",ik:"Inupiaq",ilo:"Iloko",inc:"Indic Language",ine:"Indo-European Language",inh:"\u0438\u043d\u0433\u0443\u0448\u0441\u043a\u0438\u0439",io:"Ido",
ira:"Iranian Language",iro:"Iroquoian Language",is:"\u00edslenska",it:"italiano",iu:"Inuktitut",ja:"\u65e5\u672c\u8a9e",jbo:"Lojban",jpr:"Judeo-Persian",jrb:"Judeo-Arabic",jv:"Jawa",ka:"\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8",kaa:"\u043a\u0430\u0440\u0430\u043a\u0430\u043b\u043f\u0430\u043a\u0441\u043a\u0438\u0439",kab:"kabyle",kac:"Kachin",kaj:"Jju",kam:"Kamba",kar:"Karen",kaw:"Kawi",kbd:"\u043a\u0430\u0431\u0430\u0440\u0434\u0438\u043d\u0441\u043a\u0438\u0439",kcg:"Tyap",kfo:"koro",kg:"Kongo",
kha:"Khasi",khi:"Khoisan Language",kho:"Khotanese",ki:"Kikuyu",kj:"Kuanyama",kk:"\u049a\u0430\u0437\u0430\u049b",kl:"kalaallisut",km:"\u1797\u17b6\u179f\u17b6\u1781\u17d2\u1798\u17c2\u179a",kmb:"quimbundo",kn:"\u0c95\u0ca8\u0ccd\u0ca8\u0ca1",ko:"\ud55c\uad6d\uc5b4",kok:"\u0915\u094b\u0902\u0915\u0923\u0940",kos:"Kosraean",kpe:"kpell\u00e9",kr:"Kanuri",krc:"\u043a\u0430\u0440\u0430\u0447\u0430\u0435\u0432\u043e-\u0431\u0430\u043b\u043a\u0430\u0440\u0441\u043a\u0438\u0439",krl:"\u043a\u0430\u0440\u0435\u043b\u044c\u0441\u043a\u0438\u0439",
kro:"Kru",kru:"Kurukh",ks:"\u0915\u093e\u0936\u094d\u092e\u093f\u0930\u0940",ku:"K\u00fcrt\u00e7e",ku_Arab:"\u0627\u0644\u0643\u0631\u062f\u064a\u0629",ku_Latn:"K\u00fcrt\u00e7e",kum:"\u043a\u0443\u043c\u044b\u043a\u0441\u043a\u0438\u0439",kut:"Kutenai",kv:"Komi",kw:"kernewek",ky:"K\u0131rg\u0131zca",ky_Arab:"\u0627\u0644\u0642\u064a\u0631\u063a\u0633\u062a\u0627\u0646\u064a\u0629",ky_Cyrl:"\u043a\u0438\u0440\u0433\u0438\u0437\u0441\u043a\u0438\u0439",la:"latino",lad:"\u05dc\u05d3\u05d9\u05e0\u05d5",
lah:"\u0644\u0627\u0647\u0646\u062f\u0627",lam:"Lamba",lb:"luxembourgeois",lez:"\u043b\u0435\u0437\u0433\u0438\u043d\u0441\u043a\u0438\u0439",lg:"Ganda",li:"Limburgs",ln:"lingala",lo:"Lao",lol:"mongo",loz:"Lozi",lt:"lietuvi\u0173",lu:"luba-katanga",lua:"luba-lulua",lui:"Luiseno",lun:"Lunda",luo:"Luo",lus:"Lushai",lv:"latvie\u0161u",mad:"Madura",mag:"Magahi",mai:"Maithili",mak:"Makassar",man:"Mandingo",map:"Austronesian",mas:"Masai",mdf:"\u043c\u043e\u043a\u0448\u0430",mdr:"Mandar",men:"Mende",mg:"malgache",
mga:"Middle Irish",mh:"Marshallese",mi:"Maori",mic:"Micmac",min:"Minangkabau",mis:"Miscellaneous Language",mk:"\u043c\u0430\u043a\u0435\u0434\u043e\u043d\u0441\u043a\u0438",mkh:"Mon-Khmer Language",ml:"\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02",mn:Jd,mn_Cyrl:Jd,mn_Mong:Jd,mnc:"Manchu",mni:"Manipuri",mno:"Manobo Language",mo:"Moldavian",moh:"Mohawk",mos:"mor\u00e9 ; mossi",mr:"\u092e\u0930\u093e\u0920\u0940",ms:"Bahasa Melayu",mt:"Malti",mul:"Multiple Languages",mun:"Munda Language",mus:"Creek",mwl:"Mirandese",
mwr:"Marwari",my:"Burmese",myn:"Mayan Language",myv:"\u044d\u0440\u0437\u044f",na:"Nauru",nah:"Nahuatl",nai:"North American Indian Language",nap:"napoletano",nb:"norsk bokm\u00e5l",nd:"North Ndebele",nds:"Low German",ne:"\u0928\u0947\u092a\u093e\u0932\u0940","new":"Newari",ng:"Ndonga",nia:"Nias",nic:"Niger-Kordofanian Language",niu:"Niuean",nl:"Nederlands",nn:"nynorsk",no:"Norwegian",nog:"\u043d\u043e\u0433\u0430\u0439\u0441\u043a\u0438\u0439",non:"Old Norse",nqo:"N\u2019Ko",nr:"South Ndebele",nso:"Northern Sotho",
nub:"Nubian Language",nv:"Navajo",nwc:"Classical Newari",ny:"nianja; chicheua; cheua",nym:"Nyamwezi",nyn:"Nyankole",nyo:"Nyoro",nzi:"Nzima",oc:"occitan",oj:"Ojibwa",om:"Oromoo",or:"\u0b13\u0b21\u0b3c\u0b3f\u0b06",os:"\u043e\u0441\u0435\u0442\u0438\u043d\u0441\u043a\u0438\u0439",osa:"Osage",ota:"Ottoman Turkish",oto:"Otomian Language",pa:"\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40",pa_Arab:"\u067e\u0646\u062c\u0627\u0628",pa_Guru:"\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40",paa:"Papuan Language",pag:"Pangasinan",
pal:"Pahlavi",pam:"Pampanga",pap:"Papiamento",pau:"Palauan",peo:"Old Persian",phi:"Philippine Language",phn:"Phoenician",pi:"\u0e1a\u0e32\u0e25\u0e35",pl:"polski",pon:"Pohnpeian",pra:"Prakrit Language",pro:"Old Proven\u00e7al",ps:"\u067e\u069a\u062a\u0648",pt:"portugu\u00eas",qu:"quechua",raj:"Rajasthani",rap:"Rapanui",rar:"Rarotongan",rm:"R\u00e4toromanisch",rn:"roundi",ro:"rom\u00e2n\u0103",roa:"Romance Language",rom:"Romany",ru:"\u0440\u0443\u0441\u0441\u043a\u0438\u0439",rup:"Aromanian",rw:"rwanda",
sa:"\u0938\u0902\u0938\u094d\u0915\u0943\u0924 \u092d\u093e\u0937\u093e",sad:"Sandawe",sah:"\u044f\u043a\u0443\u0442\u0441\u043a\u0438\u0439",sai:"South American Indian Language",sal:"Salishan Language",sam:"\u05d0\u05e8\u05de\u05d9\u05ea \u05e9\u05d5\u05de\u05e8\u05d5\u05e0\u05d9\u05ea",sas:"Sasak",sat:"Santali",sc:"Sardinian",scn:"siciliano",sco:"Scots",sd:"\u0938\u093f\u0928\u094d\u0927\u0940",sd_Arab:"\u0633\u0646\u062f\u06cc",sd_Deva:"\u0938\u093f\u0928\u094d\u0927\u0940",se:"nordsamiska",sel:"\u0441\u0435\u043b\u044c\u043a\u0443\u043f\u0441\u043a\u0438\u0439",
sem:"Semitic Language",sg:"sangho",sga:"Old Irish",sgn:"Sign Language",sh:"Serbo-Croatian",shn:"Shan",si:"Sinhalese",sid:"Sidamo",sio:"Siouan Language",sit:"Sino-Tibetan Language",sk:"slovensk\u00fd",sl:"sloven\u0161\u010dina",sla:"Slavic Language",sm:"Samoan",sma:"sydsamiska",smi:"Sami Language",smj:"lulesamiska",smn:"Inari Sami",sms:"Skolt Sami",sn:"Shona",snk:"sonink\u00e9",so:"Soomaali",sog:"Sogdien",son:"Songhai",sq:"shqipe",sr:"\u0421\u0440\u043f\u0441\u043a\u0438",sr_Cyrl:"\u0441\u0435\u0440\u0431\u0441\u043a\u0438\u0439",
sr_Latn:"Srpski",srn:"Sranantongo",srr:"s\u00e9r\u00e8re",ss:"Swati",ssa:"Nilo-Saharan Language",st:"Sesotho",su:"Sundan",suk:"Sukuma",sus:"soussou",sux:"Sumerian",sv:"svenska",sw:"Kiswahili",syc:"Classical Syriac",syr:"Syriac",ta:"\u0ba4\u0bae\u0bbf\u0bb4\u0bcd",tai:"Tai Language",te:"\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41",tem:"Timne",ter:"Tereno",tet:"t\u00e9tum",tg:"\u062a\u0627\u062c\u06a9",tg_Arab:"\u062a\u0627\u062c\u06a9",tg_Cyrl:"\u0442\u0430\u0434\u0436\u0438\u043a\u0441\u043a\u0438\u0439",
th:"\u0e44\u0e17\u0e22",ti:"\u1275\u130d\u122d\u129b",tig:"\u1275\u130d\u1228",tiv:"Tiv",tk:"\u062a\u0631\u06a9\u0645\u0646\u06cc",tkl:I,tl:"Tagalog",tlh:"Klingon",tli:"Tlingit",tmh:"tamacheq",tn:"Tswana",to:"Tonga",tog:"Nyasa Tonga",tpi:"Tok Pisin",tr:"T\u00fcrk\u00e7e",ts:"Tsonga",tsi:"Tsimshian",tt:"\u0442\u0430\u0442\u0430\u0440\u0441\u043a\u0438\u0439",tum:"Tumbuka",tup:"Tupi Language",tut:"\u0430\u043b\u0442\u0430\u0439\u0441\u043a\u0438\u0435 (\u0434\u0440\u0443\u0433\u0438\u0435)",tvl:J,tw:"Twi",
ty:"tahitien",tyv:"\u0442\u0443\u0432\u0438\u043d\u0441\u043a\u0438\u0439",udm:"\u0443\u0434\u043c\u0443\u0440\u0442\u0441\u043a\u0438\u0439",ug:"\u0443\u0439\u0433\u0443\u0440\u0441\u043a\u0438\u0439",uga:"Ugaritic",uk:"\u0443\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430",umb:"umbundu",und:"English",ur:"\u0627\u0631\u062f\u0648",uz:"\u040e\u0437\u0431\u0435\u043a",uz_Arab:"\u0627\u06c9\u0632\u0628\u06d0\u06a9",uz_Cyrl:"\u0443\u0437\u0431\u0435\u043a\u0441\u043a\u0438\u0439",uz_Latn:"o'zbekcha",
vai:"Vai",ve:"Venda",vi:"Ti\u1ebfng Vi\u1ec7t",vo:"volapuko",vot:"Votic",wa:"Wallonisch",wak:"Wakashan Language",wal:"Walamo",war:"Waray",was:"Washo",wen:"Sorbian Language",wo:"wolof",wo_Arab:"\u0627\u0644\u0648\u0644\u0648\u0641",wo_Latn:"wolof",xal:"\u043a\u0430\u043b\u043c\u044b\u0446\u043a\u0438\u0439",xh:"Xhosa",yao:"iao",yap:"Yapese",yi:"\u05d9\u05d9\u05d3\u05d9\u05e9",yo:"Yoruba",ypk:"Yupik Language",za:"Zhuang",zap:"Zapotec",zen:"Zenaga",zh:"\u4e2d\u6587",zh_Hans:"\u4e2d\u6587",zh_Hant:"\u4e2d\u6587",
znd:"Zande",zu:"Zulu",zun:"Zuni",zxx:"No linguistic content",zza:"Zaza"}};Z.locale.Yf=function(a){a=a.replace(/-/g,M);Z.locale.N=a};Z.locale.Fa=function(){Z.locale.N||(Z.locale.N=yc);return Z.locale.N};Z.locale.I={vd:"DateTimeConstants",Ed:"NumberFormatConstants",gc:"TimeZoneConstants",Wb:rb,hc:"TimeZoneSelectedIds",jc:"TimeZoneSelectedShortNames",ic:"TimeZoneSelectedLongNames",fc:"TimeZoneAllLongNames"};Z.locale.Ea=function(a){return(a=a.match(/^\w{2,3}([-_]|$)/))?a[0].replace(/[_-]/g,b):b};
Z.locale.mb=function(a){return(a=a.match(/[-_]([a-zA-Z]{2}|\d{3})([-_]|$)/))?a[0].replace(/[_-]/g,b):b};Z.locale.Pe=function(a){a=a.split(/[-_]/g);return 1<a.length&&a[1].match(/^[a-zA-Z]{4}$/)?a[1]:b};Z.locale.Qe=function(a){return(a=a.match(/[-_]([a-z]{2,})/))?a[1]:b};Z.locale.Le=function(a){var c=Z.locale.Ea(a)+M+Z.locale.mb(a);return c in Z.locale.J.COUNTRY?Z.locale.J.COUNTRY[c]:a};Z.locale.He=function(a,c){c||(c=Z.locale.ob());var d=Z.locale.mb(a);return d in c.COUNTRY?c.COUNTRY[d]:a};
Z.locale.Me=function(a){if(a in Z.locale.J.LANGUAGE)return Z.locale.J.LANGUAGE[a];var c=Z.locale.Ea(a);return c in Z.locale.J.LANGUAGE?Z.locale.J.LANGUAGE[c]:a};Z.locale.Ie=function(a,c){c||(c=Z.locale.ob());if(a in c.LANGUAGE)return c.LANGUAGE[a];var d=Z.locale.Ea(a);return d in c.LANGUAGE?c.LANGUAGE[d]:a};Z.locale.K=function(a,c,d){Z.locale.l[c]||(Z.locale.l[c]={});Z.locale.l[c][d]=a;Z.locale.N||(Z.locale.N=d)};Z.locale.jf=function(a,c){return a in Z.locale.l&&c in Z.locale.l[a]};Z.locale.l={};
Z.locale.Kf=function(a,c){Z.locale.K(a,Z.locale.I.gc,c)};Z.locale.If=function(a,c){Z.locale.K(a,Z.locale.I.Wb,c)};Z.locale.Lf=function(a,c){Z.locale.K(a,Z.locale.I.hc,c)};Z.locale.Nf=function(a,c){Z.locale.K(a,Z.locale.I.jc,c)};Z.locale.Mf=function(a,c){Z.locale.K(a,Z.locale.I.ic,c)};Z.locale.Jf=function(a,c){Z.locale.K(a,Z.locale.I.fc,c)};Z.locale.ob=function(){var a=Z.locale.Fa(),a=a?a:Z.locale.Fa();return rb in Z.locale.l?Z.locale.l.LocaleNameConstants[a]:void 0};
Z.locale.Oe=function(a,c){var d=c?c:Z.locale.Fa();if(a in Z.locale.l){if(d in Z.locale.l[a])return Z.locale.l[a][d];d=d.split(M);return 1<d.length&&d[0]in Z.locale.l[a]?Z.locale.l[a][d[0]]:Z.locale.l[a].en}};var google={a:{}};google.a.b={};
google.a.b.languages={af:!0,am:!0,az:!0,ar:!0,arb:"ar",bg:!0,bn:!0,ca:!0,cs:!0,cmn:"zh",da:!0,de:!0,el:!0,en:!0,en_gb:!0,es:!0,es_419:!0,et:!0,eu:!0,fa:!0,fi:!0,fil:!0,fr:!0,fr_ca:!0,gl:!0,ka:!0,gu:!0,he:"iw",hi:!0,hr:!0,hu:!0,hy:!0,id:!0,"in":Oc,is:!0,it:!0,iw:!0,ja:!0,ji:"yi",jv:!1,jw:"jv",km:!0,kn:!0,ko:!0,lo:!0,lt:!0,lv:!0,ml:!0,mn:!0,mo:"ro",mr:!0,ms:!0,nb:"no",ne:!0,nl:!0,no:!0,pl:!0,pt:"pt_br",pt_br:!0,pt_pt:!0,ro:!0,ru:!0,si:!0,sk:!0,sl:!0,sr:!0,sv:!0,sw:!0,swh:"sw",ta:!0,te:!0,th:!0,tl:"fil",
tr:!0,uk:!0,ur:!0,vi:!0,yi:!1,zh:"zh_cn",zh_cn:!0,zh_hk:!0,zh_tw:!0,zsm:"ms",zu:!0};google.a.b.S={};google.a.b.T=od;google.a.b.log=Y();google.a.b.error=Y();google.a.b.Z=!1;google.a.b.O=window;google.a.b.ld={current:"44",upcoming:"44",41:U,42:U,43:U,44:U};google.a.b.Ua={gstatic:{prefix:"https://www.gstatic.com/charts",debug:"{prefix}/debug/{version}/jsapi_debug_{package}_module.js",compiled:"{prefix}/{version}/js/jsapi_compiled_{package}_module.js",i18n:"{prefix}/{version}/i18n/jsapi_compiled_i18n_{package}_module__{language}.js",css:zd,css_debug:zd,third_party:Ad,third_party_gen:Ad}};
google.a.b.m=google.a.b.Ua.gstatic;
google.a.b.zc={"default":[],format:[],ui:["format","default"],ui_base:["format","default"],annotatedtimeline:[V],annotationchart:[V,"controls",uc,"table"],areachart:[V,O],bar:[V,Q,td],barchart:[V,O],browserchart:[V],calendar:[V],charteditor:[V,uc,S,oc,"gauge","motionchart","orgchart","table"],charteditor_base:[nd,uc,S,oc,"gauge","motionchart","orgchart","table_base"],columnchart:[V,O],controls:[V],controls_base:[nd],corechart:[V],gantt:[V,Q],gauge:[V],geochart:[V],geomap:[V],geomap_base:[nd],helloworld:[V],
imageareachart:[V,S],imagebarchart:[V,S],imagelinechart:[V,S],imagechart:[V],imagepiechart:[V,S],imagesparkline:[V,S],intensitymap:[V],line:[V,Q,td],linechart:[V,O],map:[V],motionchart:[V],orgchart:[V],overtimecharts:[V,uc],piechart:[V,O],sankey:["d3","d3.sankey",V],scatter:[V,Q,td],scatterchart:[V,O],table:[V],table_base:[nd],timeline:[V,Q],treemap:[V],wordtree:[V]};google.a.b.ed={d3:"d3/d3.js","d3.sankey":"d3/d3.sankey.js",webfontloader:"webfontloader/webfont.js"};google.a.b.Eb={dygraph:"dygraphs/dygraph-tickers-combined.js"};
google.a.b.wc={annotatedtimeline:"/annotatedtimeline/annotatedtimeline.css",annotationchart:"annotationchart/annotationchart.css",charteditor:"charteditor/charteditor.css",charteditor_base:"charteditor/charteditor_base.css",controls:"controls/controls.css",imagesparkline:"imagesparkline/imagesparkline.css",intensitymap:"intensitymap/intensitymap.css",orgchart:"orgchart/orgchart.css",table:"table/table.css",table_base:"table/table_base.css",ui:["util/util.css","core/tooltip.css"],ui_base:"util/util_base.css"};
google.a.b.va=function(a,c){for(var d=c||{},e=[],f=0;f<a.length;f++){var g=a[f];if(!d[g]){d[g]=!0;var h=google.a.b.zc[g]||[];0<h.length&&(e=e.concat(google.a.b.va(h,d)));e.push(g)}}return e};google.a.b.Ec=function(a){for(var c={},d=[],e=0;e<a.length;e++){var f=google.a.b.wc[a[e]];Z.isArray(f)||(f=[f]);for(var g=0;g<f.length;g++){var h=f[g];h&&!c[h]&&(c[h]=!0,d.push(h))}}return d};
google.a.b.$c=function(a,c){if(c)if("undefined"===typeof a.onload){var d=!1;a.onreadystatechange=function(){d||(a.readyState&&a.readyState!==P?google.a.b.O.setTimeout(a.onreadystatechange,0):(d=!0,delete a.onreadystatechange,google.a.b.O.setTimeout(c,0)))}}else a.onload=c};
google.a.b.Ab=function(a,c,d){google.a.b.log(Vc+a);var e=c.createElement(gd);e.type=ld;e.language=Qc;e.async=!1;e.defer=!1;c=c.body||c.head||c.getElementsByTagName(ib).item(0)||c.documentElement;c.insertBefore(e,c.lastChild);d&&google.a.b.$c(e,d);e.src=a;google.a.b.log(zc+a)};
google.a.b.Qc=function(a,c){function d(c){var e=google.a.b.sb,f=a[c++];if(f){var g=f,h=google.a.b.ed[f];h?(g=h,f===td&&(e=window.document),f=google.a.b.m.third_party):google.a.b.Eb[f]?(g=google.a.b.Eb[f],f=google.a.b.m.third_party_gen):f=google.a.b.Z?n:t?Oa:p;g=f.replace(yd,m).replace(Bd,A).replace(wd,t).replace(xd,g);google.a.b.Ab(g,e);d(c)}}function e(){for(var d=[],e=0;e<a.length;e++)d.push(Sb[a[e]]);eval(Ea+d.join(b)+Dd)();google.a.b.O.setTimeout(c,0)}a=google.a.b.va(a);for(var f=[],g=0;g<a.length;g++){var h=
a[g];google.a.b.S[h]||f.push(h)}a=f;google.a.b.log(pb+a);var m=google.a.b.m.prefix,n=google.a.b.m.debug,p=google.a.b.m.compiled,Oa=google.a.b.m.i18n,A=google.a.b.T,t=google.a.b.Ma;t===yc&&(t=null);var Sb={},Tb=a.length;google.a.b.Vc=function(a,c){google.a.b.log(sc+a);Sb[a]=c;google.a.b.S[a]=!0;Tb--;0===Tb&&e()};d(0)};
google.a.b.W=function(a){function c(){g=!0;for(var a=e.length,c=0;c<a;c++)e[c]()}function d(){h=!0;for(var a=f.length,c=0;c<a;c++)f[c]()}var e=[],f=[],g=!1,h=!1;google.a.b.W.count||(google.a.b.W.count=0);var m=Tc+google.a.b.W.count++,n={done:function(a){e.push(a);g&&a();return n},Ca:function(a){f.push(a);h&&a();return n}},p=document.createElement(Rc);p.setAttribute(Oc,m);p.setAttribute(ed,jd);p.setAttribute(md,kd);"undefined"!==typeof p.addEventListener?(p.addEventListener(Sc,c,!1),p.addEventListener(Ac,
d,!1)):"undefined"!==typeof p.attachEvent&&p.attachEvent(cd,function(){var a,e=document.styleSheets.length;try{for(;e--;)if(a=document.styleSheets[e],a.id===m){c();return}}catch(f){}g||d()});document.getElementsByTagName(Mc)[0].appendChild(p);p.setAttribute(Nc,a);return n};google.a.b.Nc=function(a,c){google.a.b.log(Uc+a);google.a.b.W(a).done(c).Ca(function(){google.a.b.error(Wc+a)})};
google.a.b.Oc=function(a,c){a=google.a.b.va(a);var d=google.a.b.Ec(a);if(null===d||0===d.length)c();else{google.a.b.log(qb+d.join(ya));var e=google.a.b.m.prefix,f=google.a.b.m.css;google.a.b.Z&&(f=google.a.b.m.css_debug||f);var g=google.a.b.T,h=function(a){var n=d[a],p;p=a<d.length-1?function(){h(a+1)}:c;google.a.b.S[n]?(google.a.b.log(Na+n),google.a.b.O.setTimeout(p,0)):(google.a.b.S[n]=!0,n=f.replace(yd,e).replace(Bd,g).replace(vd,n),google.a.b.Nc(n,p))};h(0)}};
google.a.b.Ee=function(){var a=google.a.b.C;if(!a){a=google.a.b.C=document.createElement(Pc);google.a.b.C=a;a.name=Jc;(document.body||document.head||document).appendChild(a);a.style.display=Zc;var c=google.a.b.sb=a.contentDocument?a.contentDocument:a.contentWindow?a.contentWindow.document:a.document;c.open();c.writeln(b);c.close()}return a};
google.a.b.Cb=function(a){for(var c=a.replace(/-/g,M).toLowerCase();Z.h(c);)a=c,c=google.a.b.languages[c],c===a&&(c=!1);c||(a.match(/_[^_]+$/)?(a=a.replace(/_[^_]+$/,b),a=google.a.b.Cb(a)):a=yc);return a};
google.a.b.Yc=function(a,c){c.log&&(google.a.b.log=c.log);c.error&&(google.a.b.error=c.error);var d=c.debug,e=c.language||b,e=google.a.b.Cb(e);a||(a=c.version||od);(google.a.b.T&&google.a.b.T!==a||google.a.b.Ma&&google.a.b.Ma!==e||google.a.b.Z!==d)&&google.a.b.C&&google.a.b.C.parentNode&&(google.a.b.C.parentNode.removeChild(google.a.b.C),google.a.b.C=null,google.a.b.S={});google.a.b.T=a;google.a.b.Ma=e;google.a.b.Z=d};google.a.b.R=!1;google.a.b.ma=!1;google.a.b.loaded=!1;google.a.b.Da=[];
google.a.b.load=function(a,c,d){var e;e=a.match(/^(testing\/)?(.*)/);var f=e[1]||b;for(a=e[2];;){e=google.a.b.ld[a];if(null==e||e===U)break;a=e}google.a.b.m=d||google.a.b.Ua[a]||google.a.b.Ua.gstatic;a=f+a;if(null==e)f=function(){Z.kb()(a,c,d)},google.a.b.R?google.a.b.M(f):(google.a.b.R=!0,google.a.b.Ab(google.a.b.m.prefix+u+a+Da,window.document,f));else{if(google.a.b.R)throw Error("google.charts.load() cannot be called more than once with version 44 or earlier.");google.a.b.R=!0;if(google.a.b.ma)google.a.b.M(function(){google.a.b.load(a,
c)});else{google.a.b.loaded=!1;google.a.b.ma=!0;google.a.b.Yc(a,c);google.a.b.log(Kc+a);window.google=window.google||{};google.visualization=google.visualization||{};google.visualization.ModulePath=google.a.b.m.prefix;google.a.b.C=null;google.a.b.O=window;google.a.b.sb=document;var g=function(){google.a.b.ma=!1;google.a.b.loaded=!0;google.a.b.Na()},h=c.packages;google.a.b.M(c.callback);google.a.b.Oc(h,function(){google.a.b.Qc(h,g)})}}};
google.a.b.M=function(a){a&&google.a.b.Da.push(a);google.a.b.loaded&&!google.a.b.ma&&google.a.b.Na()};google.a.b.ad=function(a){if(window.addEventListener)window.addEventListener(Sc,a,!1);else if(window.attachEvent)window.attachEvent(cd,a);else{var c=window.onload;window.onload=function(d){c&&c(d);a()}}};google.a.b.Ib=document&&document.readyState===P;google.a.b.ad(function(){google.a.b.Ib=!0;google.a.b.Na()});
google.a.b.Na=function(){if(google.a.b.R&&google.a.b.loaded&&(google.a.b.Ib||document.readyState===P))for(;0<google.a.b.Da.length;)google.a.b.Da.shift()()};google.a.b.Qa=function(a,c){google.a.b.Vc(a,c)};if(Z.kb())throw Error("Google Charts loader.js can only be loaded once.");google.a.load=function(a,c,d){a===sd&&(a=c,c=d);google.a.b.load(String(a),c||{})};google.a.M=function(a){google.a.b.M(a)};google.a.Qa=function(a,c){google.a.b.Qa(a,c)};Z.Ba(Jc,google.a.load);Z.Ba("google.charts.setOnLoadCallback",google.a.M);Z.Ba("google.charts.packageLoadedCallback",google.a.Qa); })();

var ePiechartSeances = $( ".piechart-seances" );
if ( ePiechartSeances.length ) {
    google.charts.load( 'current', { 'packages': [ 'corechart','bar' ] } );
    ePiechartSeances.each(
        function () {
            var that = $( this );
            google.charts.setOnLoadCallback( chartLoader );
            function chartLoader() {
                var aDataTable      = [ [ 'Présences', '' ] ],
                    oDataAttributes = that.data(),
                    slices          = {};
                for ( key in oDataAttributes ) {
                    if ( oDataAttributes.hasOwnProperty( key ) ) {
                        var aCurentData                = oDataAttributes[ key ].split( "," );
                        aDataTable[ aCurentData[ 0 ] ] = [ aCurentData[ 1 ], parseInt( aCurentData[ 2 ] ) ];
                        slices[ (aCurentData[ 0 ])-1 ] = { 'color': aCurentData[ 3 ] }
                    }
                }
                var data    = google.visualization.arrayToDataTable( aDataTable );
                var options = {
                    'tooltip': { 'isHtml': true },
                    slices

                };

                var chart = new google.visualization.PieChart( that.get( 0 ) );
                chart.draw( data, options );
            }
        }
    );

}

var ePiechartSeances = $( ".bar-chart-student" );
if ( ePiechartSeances.length ) {
    ePiechartSeances.each(
        function () {
            var that = $( this );
            google.charts.setOnLoadCallback( chartLoader );
            function chartLoader() {
                var aDataTable      = [ [ 'Cours', 'Nombre de séances' ] ],
                    oDataAttributes = that.data();
                for ( key in oDataAttributes ) {
                    if ( oDataAttributes.hasOwnProperty( key ) ) {
                        var aCurentData                = oDataAttributes[ key ].split( "," );
                        aDataTable[ aCurentData[ 0 ] ] = [ aCurentData[ 1 ], parseInt( aCurentData[ 2 ] ) ];
                    }
                }
                var data    = google.visualization.arrayToDataTable( aDataTable );
                var options = {
                    'tooltip': { 'isHtml': true },
                    bars: 'horizontal' // Required for Material Bar Charts.
                };
                var chart   = new google.charts.Bar( that.get( 0 ) );
                chart.draw( data, options );
            }
        }
    );
}
var ePiechartSeances = $( ".bar-chart-statuts-cours" );
if ( ePiechartSeances.length ) {
    ePiechartSeances.each(
        function () {
            var that = $( this );
            google.charts.setOnLoadCallback( chartLoader );
            function chartLoader() {
                var aDataTable                                                             = [ [ 'Présences/Cours' ]
                        // ['JSKLJSL',10,30,50],
                        // ['JSKLJSL',10,30,50],
                        // ['JSKLJSL',10,30,50]
                    ],
                    oDataAttributes = that.data( 'graph' ), i, sName = '', ii = 0, aColors = [];
                for ( key in oDataAttributes ) {
                    if ( oDataAttributes.hasOwnProperty( key ) ) {
                        ii++;
                        if ( key !== 'meta' ) {
                            //console.log(key);
                            // on va ['nom du cour',valeur1,valeur2];
                            sName = oDataAttributes[ key ].name;
                            aDataTable.push( [ sName ] );

                            // faire un boucle dans les statit pour récupérer l id;
                            for ( statut in oDataAttributes[ 'meta' ] ) {
                                if ( statut !== 'max-statut' ) {
                                    for ( i = 0; i < oDataAttributes[ 'meta' ][ statut ].length; i++ ) {
                                        //console.log( oDataAttributes[ 'meta'][ statut ][ i ].id );
                                        aDataTable[ ii ].push( typeof oDataAttributes[ key ].statuts[ oDataAttributes[ 'meta' ][ statut ][ i ].id ] === "undefined" ? 0 : oDataAttributes[ key ].statuts[ oDataAttributes[ 'meta' ][ statut ][ i ].id ].nbr );
                                    }
                                }
                            }

                        }
                        else {
                            for ( statut in oDataAttributes[ key ] ) {
                                if ( statut !== 'max-statut' ) {
                                    for ( i = 0; i < oDataAttributes[ key ][ statut ].length; i++ ) {
                                        aDataTable[ 0 ].push( oDataAttributes[ key ][ statut ][ i ].name );
                                        aColors.push( oDataAttributes[ key ][ statut ][ i ].color );
                                    }
                                }
                            }
                        }
                    }
                }
                var data    = google.visualization.arrayToDataTable( aDataTable );
                var options = {
                    'tooltip': { 'isHtml': true },
                    bars: 'horizontal', // Required for Material Bar Charts.
                    colors: aColors
                };
                var chart   = new google.charts.Bar( that.get( 0 ) );
                chart.draw( data, options );
            }
        }
    );
}

jQuery( function ( $ ) {
    $( '.link-for-input-action' ).click( function () {
        var infoName = $( this ).attr( 'data-date-begin' );
        if ( user[ 0 ][ infoName ] ) {
            $( this ).next().attr( 'value', user[ 0 ][ infoName ] );
        }
    } )
} );
$('.visitor-nav__header-link--open').click(function () {
    $(this).toggleClass('hide-close');
    $('.list-item-container').toggleClass('list-item-container--close');
});
//# sourceMappingURL=all.js.map
