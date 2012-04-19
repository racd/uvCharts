cv.linegraph = function (graphdef) {
	cv.graph.apply(this, [graphdef]);
	graphdef.stepup = false;
	graphdef.orientation = 'ver';
	this.init(graphdef);

	this.linegroups = [];
	this.dataset = r3.util.getDataArray(this.graphdef.dataset);

	var linegroup, linepath, linefunc,
		domainData = this.graphdef.dataset[0].data;

	this.axes[this.graphdef.orientation === 'hor'?'ver':'hor'].scale.domain(domainData.map(function(d){ return d.name;}));

	for(var idx=0, len=this.dataset.length; idx<len; idx++){
		linegroup = this.panel.append('g').attr('class','chart3rline');
		linepath = linegroup.append('g').attr('class','line_' + idx); linepath.datum(this.dataset[idx]);
		this['draw' + r3.util.getPascalCasedName(this.graphdef.orientation) + 'Lines'](linepath, idx);
		this.linegroups.push(linegroup);
	}

	this.finalize();
};

cv.linegraph.prototype = cv.extend(cv.graph);

cv.linegraph.prototype.drawHorLines = function (linepath, idx) {
	var axes = this.axes;

	var line = d3.svg.line()
				.x(function(d) { return axes.hor.scale(d.value); })
				.y(function(d) { return axes.ver.scale(d.name) + axes.ver.scale.rangeBand()/2; })
				.interpolate("linear");

	var path = linepath.append("svg:path")
				.attr("class", "linepath_" + idx)
				.attr("d", line);

	linepath.selectAll(".dot")
				.data(this.dataset[idx])
				.enter()
				.append("circle")
				.attr("class", "dot")
				.attr("cx", line.x())
				.attr("cy", line.y())
				.attr("r", 3.5).style("fill","white");
};

cv.linegraph.prototype.drawVerLines = function (linepath, idx) {
	var axes = this.axes, height = this.dimension.height;

	var line = d3.svg.line()
				.x(function(d) { return axes.hor.scale(d.name) + axes.hor.scale.rangeBand()/2; })
				.y(function(d) { return axes.ver.scale(d.value); })
				.interpolate("linear");

	var path = linepath.append("svg:path")
				.attr("class", "linepath_" + idx)
				.attr("d", line);

	linepath.selectAll(".dot")
				.data(this.dataset[idx])
				.enter()
				.append("circle")
				.attr("class", "dot")
				.attr("cx", line.x())
				.attr("cy", line.y())
				.attr("r", 3.5).style("fill","white");
};