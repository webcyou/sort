var Sort;
(function (Sort) {
    var Utility = (function () {
        function Utility() {
        }
        return Utility;
    })();
    Sort.Utility = Utility;
})(Sort || (Sort = {}));
var Sort;
(function (Sort_1) {
    var Sort = (function () {
        function Sort() {
        }
        return Sort;
    })();
    Sort_1.Sort = Sort;
})(Sort || (Sort = {}));
var Sort;
(function (Sort) {
    var SortController = (function () {
        function SortController(util) {
            this.util = util;
        }
        return SortController;
    })();
    Sort.SortController = SortController;
})(Sort || (Sort = {}));
var Sort;
(function (Sort) {
    var SortView = (function () {
        function SortView(util) {
            this.util = util;
        }
        return SortView;
    })();
    Sort.SortView = SortView;
})(Sort || (Sort = {}));
'use strict';
var e = eval, global = e('this');
var Sort;
(function (Sort) {
    var SortModel = (function () {
        function SortModel(sortArray, bucketLength) {
            this._bucket_length = 100;
            this.util = new Sort.Utility;
            if (SortModel._instance) {
                if (bucketLength !== void 0) {
                    SortModel._instance._bucket_length = bucketLength;
                }
                if (sortArray !== void 0) {
                    SortModel._instance.result = SortModel._instance.quick(sortArray);
                }
                return SortModel._instance;
            }
            else {
                this.view = new Sort.SortView(this.util);
                this.controller = new Sort.SortController(this.util);
                SortModel._instance = this;
                if (bucketLength !== void 0) {
                    SortModel._instance._bucket_length = bucketLength;
                }
                if (sortArray !== void 0) {
                    SortModel._instance.result = SortModel._instance.quick(sortArray);
                }
            }
        }
        SortModel.prototype.swap = function (arr, a, b) {
            var tmp = arr[a];
            arr[a] = arr[b];
            arr[b] = tmp;
            return arr;
        };
        SortModel.prototype.bubble = function (a) {
            var i = 0, j = 0;
            for (; i < a.length; i++) {
                for (j = a.length - 1; j > i; j--) {
                    if (a[j] < a[j - 1]) {
                        this.swap(a, j - 1, j);
                    }
                }
            }
            return a;
        };
        SortModel.prototype.bucket = function (a) {
            var bucket = [], max = this._bucket_length, count = 0;
            if (a.length > max) {
                max = a.length + 1;
            }
            for (var i = 0; i < max; i++) {
                bucket[i] = 0;
            }
            for (var i = 0; i < a.length; i++) {
                var n = a[i];
                bucket[n]++;
            }
            for (var i = 0; i < max; i++) {
                if (bucket[i] > 0) {
                    for (var j = 0; j < bucket[i]; j++) {
                        a[count] = i;
                        count++;
                    }
                }
            }
            return a;
        };
        SortModel.prototype.radix = function (a) {
            var bucket = [], maxDigit = 0, d = 0, i = 0, j, n, r = 1;
            for (; i < 10; i++) {
                bucket[i] = [];
            }
            for (var i = 0; i < a.length; i++) {
                if (maxDigit < a[i].toString(10).length) {
                    maxDigit = a[i].toString(10).length;
                }
            }
            for (; d < maxDigit; ++d) {
                for (i = 0; i < a.length; i++) {
                    bucket[(a[i] / r) % 10 | 0].push(a[i]);
                }
                for (i = 0, j = 0; j < bucket.length; j++) {
                    if (bucket[j] === undefined) {
                        continue;
                    }
                    for (n = 0; n < bucket[j].length; n++) {
                        a[i++] = bucket[j][n];
                    }
                }
                for (i = 0; i < bucket.length; i++) {
                    bucket[i] = [];
                }
                r *= 10;
            }
            return a;
        };
        SortModel.prototype.heap = function (a) {
            var i = 0, len, heap = [], that = this, insert = function (n) {
                var i, j;
                heap.push(n);
                i = heap.length;
                j = i / 2 | 0;
                while (i > 1 && heap[i - 1] < heap[j - 1]) {
                    that.swap(heap, i - 1, j - 1);
                    i = j;
                    j = i / 2 | 0;
                }
            }, shift = function () {
                var i = 1, j = i * 2, r = heap[0];
                heap[0] = heap.pop();
                while (j <= len) {
                    if (j + 1 <= len && heap[j - 1] > heap[j]) {
                        j++;
                    }
                    if (heap[i - 1] > heap[j - 1]) {
                        that.swap(heap, i - 1, j - 1);
                    }
                    i = j;
                    j = i * 2;
                }
                return r;
            };
            for (i = 0; i < a.length; i++) {
                insert(a[i]);
            }
            for (i = 0, len = heap.length; i < len; i++) {
                a[i] = shift();
            }
            return a;
        };
        SortModel.prototype.marge = function (a) {
            var split = function (aArr) {
                if (aArr.length < 2) {
                    return aArr;
                }
                var a, b, mid = aArr.length / 2 | 0;
                a = split(aArr.slice(0, mid));
                b = split(aArr.slice(mid, aArr.length));
                return marge(aArr, a, b);
            }, marge = function (aArr, a, b) {
                if (b === undefined) {
                    return aArr;
                }
                var c = [], i, j;
                while (a.length > 0 && b.length > 0) {
                    i = a[0], j = b[0];
                    if (i < j) {
                        c.push(a.shift());
                    }
                    else {
                        c.push(b.shift());
                    }
                }
                if (a.length === 0) {
                    c = c.concat(b);
                }
                else if (b.length === 0) {
                    c = c.concat(a);
                }
                return c;
            };
            return split(a);
        };
        SortModel.prototype.quick = function (a) {
            var that = this, recurse = function (a, i, j) {
                var k, p = pivot(a, i, j);
                if (p !== -1) {
                    k = partition(a, i, j, a[p]);
                    recurse(a, i, k - 1);
                    recurse(a, k, j);
                }
                return a;
            }, pivot = function (a, i, j) {
                var k = i + 1;
                while (k <= j && a[i] === a[k]) {
                    k++;
                }
                if (k > j) {
                    return -1;
                }
                if (a[i] >= a[k]) {
                    return i;
                }
                return k;
            }, partition = function (a, i, j, p) {
                var l = i, r = j;
                while (l <= r) {
                    while (l <= j && a[l] < p) {
                        l++;
                    }
                    while (r >= i && a[r] >= p) {
                        r--;
                    }
                    if (l > r) {
                        break;
                    }
                    that.swap(a, l++, r--);
                }
                return l;
            };
            return recurse(a, 0, a.length - 1);
        };
        SortModel._instance = null;
        return SortModel;
    })();
    Sort.SortModel = SortModel;
    new SortModel();
})(Sort || (Sort = {}));
if (typeof (module) !== 'undefined') {
    if (typeof (module).exports.Sort === 'undefined') {
        (module).exports.Sort = {};
    }
    (module).exports.Sort = Sort.SortModel;
}
if (typeof (global) !== 'undefined') {
    if (typeof global['Sort'] === 'undefined') {
        global['Sort'] = {};
    }
    global['Sort'] = Sort.SortModel;
}
