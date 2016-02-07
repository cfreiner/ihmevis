angular.module('IhmeCtrls', [])
  .controller('BarCtrl', ['$scope', function($scope) {
    $scope.countries = countryList;

    //D3 config vars
    var height = 400; //Height of the visualization
    var width = window.innerWidth - 150; //Width of the visualization
    var widthPer = width/25; //Width of each individual bar SVG
    var format = d3.format('.1%'); //1st decimal precision, percentage type

    $scope.fetchData = function() {
      d3.select('.vis svg').remove();
      d3.csv("data/adult.csv", function(data) {
        var test = data.filter(function(item) {
          if(item.location_name === $scope.selected && item.metric === 'obese' && item.sex === 'male') {
            return true;
          }
        });

        var xScale = d3.scale.linear()
          .domain([1990, 2013])
          .range([0, width - widthPer]);

        var yScale = d3.scale.linear()
          .domain([0, 0.02 + d3.max(test, function(d) {
            return +d.mean;
          })])
          .range([0, height]);

        var svg = d3.select('.vis').append('svg')
          .attr('width', width)
          .attr('height', height + 100)
          .append('g')
          .attr('height', height + 100);


        var bar = svg.selectAll('.bar')
          .data(test)
          .enter()
          .append('g')
          .attr('class', 'bar')
          .attr('transform', function(d) {
            return 'translate(' + xScale(d.year) + ',' + (height - yScale(d.mean)) + ')';
          });

        bar.append('rect')
          .attr('height', function(d) {
            return yScale(d.mean);
          })
          .attr('width', widthPer);

        bar.append('text')
          .attr('class', 'y-label')
          .attr('text-anchor', 'middle')
          .attr('dx', widthPer/2)
          .attr('dy', 15)
          .text(function(d) {
            return format(d.mean);
          });

        svg.selectAll('.x-label')
          .data(test)
          .enter()
          .append('text')
          .attr('class', 'x-label')
          .attr('text-anchor', 'middle')
          .attr('x', function(d) {
            return xScale(d.year);
          })
          .attr('y', height + 15)
          .attr('dx', widthPer/2)
          .text(function(d) {
            return d.year;
          });
      });
    };

  }])
  .controller('MapCtrl', ['$scope', function($scope) {
    var map = d3.geomap
      .choropleth()
      .geofile('lib/d3-geomap/topojson/world/countries.json')
      .colors(colorbrewer.Reds[9])
      .column('mean')
      .unitId('location');

    d3.csv('data/adult.csv', function(data) {
      var mapData = data.filter(function(item) {
        if(item.year === '2013' && item.metric === 'obese' && item.sex === 'male') {
          return true;
        }
      });
      d3.select('#map')
        .datum(mapData)
        .call(map.draw, map);
    });

  }]);
