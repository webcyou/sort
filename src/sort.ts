/*
 * Author: Daisuke Takayama
 */
/// <reference path='_all.ts' />

'use strict';
var e = eval, global: NodeJS.Global = e('this');
module Sort {

  /**
   * Sort Model
   * @private {number} _bucket_length
   * @public {number[]} result
  **/
  export class SortModel {
    private static _instance: SortModel = null;
    private _bucket_length: number = 100;
    private util: Utility = new Utility;
    private view: SortView;
    private controller: SortController;
    public result: number[];
    constructor(
      sortArray?: number[],
      bucketLength?: number
      ) {
      if (SortModel._instance) {
        if (bucketLength !== void 0) {
          SortModel._instance._bucket_length = bucketLength;
        }
        if (sortArray !== void 0) {
          SortModel._instance.result = SortModel._instance.quick(sortArray);
        }
        return SortModel._instance;
      } else {
        this.view = new SortView(this.util);
        this.controller = new SortController(this.util);
        SortModel._instance = this;
        if (bucketLength !== void 0) {
          SortModel._instance._bucket_length = bucketLength;
        }
        if (sortArray !== void 0) {
          SortModel._instance.result = SortModel._instance.quick(sortArray);
        }
      }
    }


    /**
     * Swap Function
     * @prams arr
     * @prams a
     * @prams b
     * @returns number[]
    **/
    public swap(arr: number[], a: number, b: number): number[] {
      var tmp: number = arr[a];
      arr[a] = arr[b];
      arr[b] = tmp;
      return arr;
    }


    /**
     * Bubble Sort
     * @prams a
     * @returns number[]
    **/
    public bubble(a: number[]): number[] {
      var i: number = 0, j: number = 0;
      for (; i < a.length; i++) {
        for (j = a.length - 1; j > i; j--) {
          //上の要素と比較し、上のほうが大きければ互いに交換する
          if (a[j] < a[j - 1]) {
            this.swap(a, j - 1, j);
          }
        }
      }
      return a;
    }


    /**
     * Bucket Sort
     * @prams a
     * @returns number[]
    **/
    public bucket(a: number[]): number[] {
      var bucket: number[] = [],
          max: number = this._bucket_length,
          count: number = 0;
      if (a.length > max) {
        max = a.length + 1;
      }
      // バケツを準備
      for (var i: number = 0; i < max; i++) {
        bucket[i] = 0;
      }
      // 全てのデータに対応するバケツを作成
      for (var i: number = 0; i < a.length; i++) {
        var n = a[i];
        bucket[n]++;
      }
      // バケツの順番に中のデータを取り出し配列に格納
      for (var i: number = 0; i < max; i++) {
        if (bucket[i] > 0) {
          for (var j: number = 0; j < bucket[i]; j++) {
            a[count] = i;
            count++;
          }
        }
      }
      return a;
    }


    /**
     * Radix Sort
     * @prams a
     * @returns number[]
    **/
    public radix(a: number[]): number[] {
      var bucket: number[][] = [],
          maxDigit: number = 0,
          d: number = 0, i: number = 0,
          j: number, n: number, r: number = 1;
      // 0 ~ 10 の10個のバケツを準備
      for (; i < 10; i++) {
        bucket[i] = [];
      }
      // 最大桁数取得
      for (var i: number = 0; i < a.length; i++) {
        if (maxDigit < a[i].toString(10).length) {
          maxDigit = a[i].toString(10).length;
        }
      }
      // 桁数分実行
      for (; d < maxDigit; ++d) {
        for (i = 0; i < a.length; i++) {
          bucket[(a[i] / r) % 10 | 0].push(a[i]);
        }
        for (i = 0, j = 0; j < bucket.length; j++) {
          if (bucket[j] === undefined) {
            continue;
          }
          //桁単位で該当するバケツに代入
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
    }


    /**
     * Heap Sort
     * @prams a
     * @returns number[]
    **/
    public heap(a: number[]): number[] {
      var i: number = 0,
        len: number,
        heap = [],
        that = this,
        // 挿入
        insert = (n) => {
          var i: number, j: number;
          // 木構造の最後に追加
          heap.push(n);
          i = heap.length;
          j = i / 2 | 0;
          // 親と比較して子のほうが小さければ入れ替え
          while (i > 1 && heap[i - 1] < heap[j - 1]) {
            that.swap(heap, i - 1, j - 1);
            i = j;
            j = i / 2 | 0;
          }
        },
        shift = (): number => {
          var i: number = 1,
              j: number = i * 2,
              r: number = heap[0];
          // ヒープの最後のデータを根に移動
          heap[0] = heap.pop();
          while (j <= len) {
            if (j + 1 <= len && heap[j - 1] > heap[j]) {
              j++;
            }
            // 子の小さい方のデータと比較して親の方が大きければ、入れ替え
            if (heap[i - 1] > heap[j - 1]) {
              that.swap(heap, i - 1, j - 1);
            }
            i = j;
            j = i * 2;
          }
          return r;
        };
      // ヒープに要素を追加
      for (i = 0; i < a.length; i++) {
        insert(a[i]);
      }
      // ヒープから取り出しながら配列に追加
      for (i = 0, len = heap.length; i < len; i++) {
        a[i] = shift();
      }
      return a;
    }


    /**
     * Marge Sort
     * @prams a
     * @returns number[]
    **/
    public marge(a: number[]): number[] {
      var split: Function = (aArr: number[]): number[] => {
          if (aArr.length < 2) {
            return aArr;
          }
          var a: number[],
              b: number[],
              mid: number = aArr.length / 2 | 0;
          // 分解
          a = split(aArr.slice(0, mid));
          b = split(aArr.slice(mid, aArr.length));
          return marge(aArr, a, b);
        },
        marge: Function = (aArr: number[], a: number[], b: number[]) => {
          if (b === undefined) {
            return aArr;
          }
          // 比較要素が存在すればmarge開始
          var c = [], i: number, j: number;
          while (a.length > 0 && b.length > 0) {
            i = a[0], j = b[0];
            // aとbを比較し、c配列に格納
            if (i < j) {
              c.push(a.shift());
            } else {
              c.push(b.shift());
            }
          }
          // 削除いない要素を結合
          if (a.length === 0) {
            c = c.concat(b);
          } else if (b.length === 0) {
            c = c.concat(a);
          }
          return c;
        };
      return split(a);
    }


    /**
     * Quick Sort
     * @prams a
     * @returns number[]
    **/
    public quick(a: number[]): number[] {
      var that = this,
          recurse: Function = (a: number[], i: number, j: number) => {
          var k, p = pivot(a, i, j);
          if (p !== -1) {
            k = partition(a, i, j, a[p]);
            recurse(a, i, k - 1);
            recurse(a, k, j);
          }
          return a;
        },
        // 軸要素の選択
        pivot: Function = (a: number[], i: number, j: number): number => {
          var k: number = i + 1;
          //順に参照、最初に見つかった異なる2つの要素のうち、大きい方の番号を返却
          while (k <= j && a[i] === a[k]) {
            k++;
          }
          // 全部同じ要素の場合は -1を返却。即時終了
          if (k > j) {
            return -1;
          }
          if (a[i] >= a[k]) {
            return i;
          }
          return k;
        },
        // パーティション分割
        // a[l] ~ a[r]間で、p を軸として分割
        // pより小さい要素は前に、大きい要素は後ろへ
        partition: Function = (a: number[], i: number, j: number, p: number) => {
          var l: number = i, // left
              r: number = j; // right
          // 検索が交差するまで繰り返し
          while (l <= r) {
            // 軸要素以上のデータを検索
            while (l <= j && a[l] < p) {
              l++;
            }
            // 軸要素未満のデータを検索
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
    }
  }
  new SortModel();
}

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
