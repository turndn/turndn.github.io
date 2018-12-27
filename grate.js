var scores = new Array();
var elems = ["#coin", "#building", "#city", "#station", "#hazard", "#cow",
             "#aim", "#station_master", "#labor", "#board", "#token"];

function push_score(name) {
  var score = new Vue({
    el: name,
    data: {
      value: NaN
    }
  })
  scores.push(score);
}

for (var i = 0; i < elems.length; i++) {
  push_score(elems[i]);
}

var result = new Vue({
  el: '#result',
  data: {
    message: 0
  }
})

var calc = new Vue({
  el: '#calc',
  methods: {
    calc: function(event) {
      var sum = 0;
      for (var i = 0; i < scores.length; i++) {
        var score = parseInt(scores[i].value, 10);
        if (!isNaN(score)) {
          sum += score;
        }
      }
      result.message = sum;      
    }
  }
})
