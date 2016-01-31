### Sort Algorithm

Sorted by TypeScript


### Use

````
<script src="/js/sort.js"></script>
````

````
var sort = new Sort();
var result = sort.marge(number[]);
````

or

````
var result = new Sort(number[]);
````

### Option

````
var sort = new Sort([], bucketLength);
var result = sort.bucket(number[]);
````
or

````
var sort = new Sort();
var result = sort.bucket(number[], bucketLength);
````


| OptionName           | DefaultValue    |
| -------------------- |-----------------|
| default sort         | Quick Sort      |
| default bucketLength | 100             |
