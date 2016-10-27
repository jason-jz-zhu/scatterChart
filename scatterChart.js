var scatterChart = function() {
  "use strict";

  // Internals
  var _data, // must
      _x_scale,
      _y_scale,
      _r_scale,
      _x_axis,
      _y_axis,
      _x_axis_label = null,
      _y_axis_label = null,
      _width,
      _height,
      _padding = 20,
      _circle_group,
      _basic_helper, // must
      _color_scale,
      _hightlight_scale,
      _opacity_circles = 0.5,
      _x_axis_tick,
      _y_axis_tick,
      _x_tick_label = true,
      _y_tick_label = true;


  function _scatterChart() {

    _init(this);

    _appendAxis(this);

    _displayMonth(_data);

  };

  function _init(selection) {
    // set xAxis
    _x_axis = d3.svg.axis()
      .orient("bottom")
      .scale(_x_scale);
    if(_x_axis_tick) {
      _x_axis.ticks(_x_axis_tick);
    }
    if(!_x_tick_label) {
      _x_axis.tickFormat("");
    }
    // set yAxis
    _y_axis = d3.svg.axis()
      .orient("left")
      .scale(_y_scale);
    if(_y_axis_tick) {
      _y_axis.ticks(_y_axis_tick);
    }
    if(!_y_tick_label) {
      _y_axis.tickFormat("");
    }
    // create a wrapper for circle
    var circleWrapperExist = selection.select(".circleWrapper").shift().shift();
    if (!circleWrapperExist) {
      _circle_group = selection.append("g")
        .attr("class", "circleWrapper");
    } else {
      _circle_group = selection.select(".circleWrapper");
    }
  };

  // append axis function
  function _appendAxis(selection) {
    var exist = selection.select(".x").shift().shift();
    if(!exist) {
      // append x axis
      selection.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 0 + "," + (_height-_padding) + ")")
        .call(_x_axis);
      // append x axis label
      selection.append("g")
        .append("text")
  	    .attr("class", "x title")
  	    .attr("text-anchor", "middle")
  	    .style("font-size", "12 px")
  	    .attr("transform", "translate(" + _width/2 + "," + (_height + 20) + ")")
  	    .text(_x_axis_label);
      // append y axis
      selection.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + _padding + ", 0)")
        .call(_y_axis);
      // append y axis label
      selection.append("g")
      	.append("text")
      	.attr("class", "y title")
      	.attr("text-anchor", "middle")
      	.style("font-size", "12 px")
      	.attr("transform", "translate(-16, " + _height/2 + ") rotate(-90)")
      	.text(_y_axis_label);
    };
  }

  function _displayMonth(month_data) {
    // append data to circle
    var current_circle = _circle_group.selectAll("circle")
      .data(month_data, _basic_helper.key);

    // Update circle
    current_circle.transition()
      .duration(1000)
      .ease("linear")
      // .each("start", function() { console.log("d");})
      .style("opacity", function(d) {
        return _hightlight_scale(_basic_helper.higthlight(d));
      })
      .style("fill", function(d) { return _color_scale(_basic_helper.color(d)); })
      .call(_circlePosition).sort(_basic_helper.order);
    // Exit circle
    current_circle.exit()
      .transition()
      .duration(400)
      .attr("r", 30)
      .style("fill-opacity", 1e-6)
      .remove();
    // Create circle
    current_circle.enter()
      .append("circle")
      .attr("class", function(d,i) { return "Employee_Vendor " + d.Employee_Vendor; })
      .style("opacity", function(d) {
        return _hightlight_scale(_basic_helper.higthlight(d));
      })
      .style("fill", function(d) { return _color_scale(_basic_helper.color(d)); })
      .on("mouseover", _removeTooltip)
      .on("mouseout", _showTooltip)
      .transition()
      .duration(2000)
      .call(_circlePosition)
      .sort(_basic_helper.order)



    // append data to text
    var currentText = _circle_group.selectAll("text")
      .data(month_data, basicHelper.key);
    // Update text
    currentText.transition()
      .duration(1000)
      .ease("linear")
      .call(_textPosition);
    // Exit text
    currentText.exit()
      .transition()
      .duration(200)
      .remove();
    // Create text
    currentText.enter()
      .append("text")
      .call(_textPosition)
      .style("font-size","10px")
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .text(function(d) {
        var Employee_Vendor = d.Employee_Vendor.split(", ");
        return Employee_Vendor[0][0] + Employee_Vendor[1][0];
      });
  };

  function _circlePosition(selection) {
    selection.attr("cx", function(d) { return _x_scale(_basic_helper.x(d)); })
      .attr("cy", function(d) { return _y_scale(_basic_helper.y(d)); })
      .attr("r", function(d) { return _r_scale(_basic_helper.radius(d)); });
  }

  function _textPosition(selection) {
    selection.attr("dx", 0)
      .attr("dy", ".35em")
      .attr("x", function(d) { return _x_scale(_basic_helper.x(d)); })
      .attr("y", function(d) { return _y_scale(_basic_helper.y(d)); });
  }


  ///////////////////////////////////////////////////////////////////////////
  /////////////////// Hover functions of the circles ////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  //Hide the tooltip when the mouse moves away
  function _removeTooltip (d) {

  	//Save the chosen circle (so not the voronoi)
  	var element = d3.select(this);
    console.log("_removeTooltip");
  	// //Fade out the bubble again
  	// element.style("opacity", opacityCircles);
    //
  	// //Hide tooltip
  	// d3.select('.popover').each(function(d) {
  	// 	d.remove();
  	// });

  }//function removeTooltip

  //Show the tooltip on the hovered over slice
  function _showTooltip (d) {
    var element = d3.select(this);
    console.log("_showTooltip");
  	//Save the chosen circle (so not the voronoi)
  	// var element = d3.selectAll(".countries."+d.CountryCode);
    //
  	// //Define and show the tooltip
  	// $(element).popover({
  	// 	placement: 'auto top',
  	// 	container: '#chart',
  	// 	trigger: 'manual',
  	// 	html : true,
  	// 	content: function() {
  	// 		return "<span style='font-size: 11px; text-align: center;'>" + d.Country + "</span>"; }
  	// });
  	// $(element).popover('show');

  	//Make chosen circle more visible
  	element.style("opacity", 1);

  }//function showTooltip


  _scatterChart.setBasicHelper = function(_) {
    if (!arguments.length) { return _basic_helper; }
    _basic_helper = _;
    return _scatterChart;
  };

  _scatterChart.xAxisTick = function(_) {
    if (!arguments.length) { return _x_axis_tick; }
    _x_axis_tick = _;
    return _scatterChart;
  };

  _scatterChart.yAxisTick = function(_) {
    if (!arguments.length) { return _y_axis_tick; }
    _y_axis_tick = _;
    return _scatterChart;
  };

  _scatterChart.setWidth = function(_) {
    if (!arguments.length) { return _width; }
    _width = _;
    return _scatterChart;
  };

  _scatterChart.setHeight = function(_) {
    if (!arguments.length) { return _height; }
    _height = _;
    return _scatterChart;
  };

  _scatterChart.getData = function(_) {
    if (!arguments.length) { return _data; }
    _data = _;
    return _scatterChart;
  };

  _scatterChart.rScale = function(_) {
    if (!arguments.length) { return _r_scale; }
    _r_scale = _;
    return _scatterChart;
  };

  _scatterChart.colorScale = function(_) {
    if (!arguments.length) { return _color_scale; }
    _color_scale = _;
    return _scatterChart;
};

  _scatterChart.xAxisLabel = function(_) {
    if (!arguments.length) { return _x_axis_label; }
    _x_axis_label = _;
    return _scatterChart;
  };

  _scatterChart.yAxisLabel = function(_) {
    if (!arguments.length) { return _y_axis_label; }
    _y_axis_label = _;
    return _scatterChart;
  };

  _scatterChart.setPadding = function(_) {
    if (!arguments.length) { return _padding; }
    _padding = _;
    return _scatterChart;
  };

  _scatterChart.xScale = function(_) {
    if (!arguments.length) { return _x_scale; }
    _x_scale = _;
    return _scatterChart;
  };

  _scatterChart.yScale = function(_) {
    if (!arguments.length) { return _y_scale; }
    _y_scale = _;
    return _scatterChart;
  };

  _scatterChart.xTickLabel = function(_) {
    if (!arguments.length) { return _x_tick_label; }
    _x_tick_label = _;
    return _scatterChart;
  };

  _scatterChart.yTickLabel = function(_) {
    if (!arguments.length) { return _y_tick_label; }
    _y_tick_label = _;
    return _scatterChart;
  };

  _scatterChart.hightlightScale = function(_) {
    if (!arguments.length) { return _hightlight_scale; }
    _hightlight_scale = _;
    return _scatterChart;
  };
  return _scatterChart;
}
