angular.module('IhmeCtrls', [])
  .controller('BarCtrl', ['$scope', function($scope) {

    //Angular scope vars
    $scope.countries = countryList;
    $scope.notFound = false;
    $scope.sex = 'male';

    //D3 config vars
    var height = 400; //Height of the visualization
    var width = window.innerWidth - 150; //Width of the visualization
    var widthPer = width/25; //Width of each individual bar SVG
    var format = d3.format('.1%'); //1st decimal precision, percentage type
    var colorScale = d3.scale.linear()
      .domain([0,0.6])
      .range(['steelblue', 'red']); //Scale for bar colors

    //Function to retrieve data from CSV
    $scope.fetchData = function() {

      //Basic input validation
      if($scope.countries.indexOf($scope.selected) === -1) {
        $scope.notFound = true;
        $scope.result = '';
        d3.select('.vis svg')
          .remove();
        return;
      }
      $scope.notFound = false;
      $scope.result = $scope.selected;
      d3.select('.vis svg')
        .remove();

      //Select appropriate data from the CSV
      d3.csv("data/data.csv", function(data) {
        var barData = data.filter(function(item) {
          if(item.location_name === $scope.selected && item.metric === 'obese' && item.sex === $scope.sex) {
            return true;
          }
        });

        //Set up scale functions
        var xScale = d3.scale.linear()
          .domain([1990, 2013])
          .range([0, width - widthPer]);

        var yScale = d3.scale.linear()
          .domain([0, 0.02 + d3.max(barData, function(d) {
            return +d.mean;
          })])
          .range([0, height]);

        //Append initial SVG
        var svg = d3.select('.vis').append('svg')
          .attr('width', width)
          .attr('height', height + 100)
          .append('g')
          .attr('height', height + 100);

        //Bind data
        var bar = svg.selectAll('.bar')
          .data(barData);

        //Enter g's for bar elements
        bar.enter()
          .append('g')
          .attr('class', 'bar')
          .transition()
          .duration(function() {
            return Math.floor((Math.random() * 900) + 250);
          })
          .attr('transform', function(d) {
            return 'translate(' + xScale(d.year) + ',' + (height - yScale(d.mean)) + ')';
          });

        //Append the actual rectangles
        bar.append('rect')
          .attr('height', 0)
          .attr('width', 0)
          .transition()
          .duration(function() {
            return Math.floor((Math.random() * 900) + 250);
          })
          .attr('height', function(d) {
            return yScale(d.mean);
          })
          .attr('width', widthPer)
          .attr('fill', function(d) {
            return colorScale(d.mean);
          });

        //Label the bars
        bar.append('text')
          .attr('class', 'y-label')
          .attr('text-anchor', 'middle')
          .attr('dx', widthPer/2)
          .attr('dy', 15)
          .text(function(d) {
            return format(d.mean);
          });

        //Label the years
        svg.selectAll('.x-label')
          .data(barData)
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
    //Slide bar config
    $scope.slider = {
      value: 1990,
      options: {
        floor: 1990,
        ceil: 2013
      }
    };

    $scope.$on('slideEnded', function() {
      $scope.updateMap();
    });

    //Choropleth and related config
    var map = d3.geomap
      .choropleth()
      .geofile('lib/d3-geomap/topojson/world/countries.json')
      .colors(colorbrewer.Reds[9])
      .column('mean')
      .unitId('location')
      .format(d3.format('.1%'))
      .duration(250);

    //Function for updating the map from CSV
    $scope.updateMap = function() {
      d3.csv('data/data.csv', function(data) {
        var mapData = data.filter(function(item) {
          if(item.year == $scope.slider.value && item.metric === 'obese' && item.sex === 'male') {
            return true;
          }
        });
        d3.select('#map svg').remove();
        d3.select('#map')
          .datum(mapData)
          .call(map.draw, map);
      });
    };
    $scope.updateMap();
  }]);
