new Vue({
el: '#app',
data: () => ({
  drawer: null,
  scores: [],
  result: null
}),
methods: {
  run: function(event) {
    var sum = 0;
    for (var i = 0; i < this.scores.length; i++) {
      if (typeof this.scores[i] !== "undefined") {
        var score = parseInt(this.scores[i], 10);
        if (!isNaN(score)) {
          sum += score;
        }
      }
    }
    this.result = sum;
  }
}})
