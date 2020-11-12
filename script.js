d3.csv('driving.csv',d3.autoType).then(data=>{
	console.log(data)

	const margin = ({top: 40, right: 20, bottom: 24, left: 100})
	const width=750-margin.left-margin.right,
	  height=550-margin.top-margin.bottom

	let svg=d3.select('body').append('svg')
		.attr('width',width+margin.left+margin.right)
		.attr('height',height+margin.top+margin.bottom)
		.append('g')
		.attr('transform','translate('+margin.left+','+margin.top+')')

	let xScale=d3.scaleLinear()
		.domain(d3.extent(data,d=>d.miles)).nice()
		.range([0,width])
	
	let yScale=d3.scaleLinear()
		.domain(d3.extent(data,d=>d.gas)).nice()
		.range([height,0])

	let xAxis=d3.axisBottom()
		.scale(xScale)
	
	let yAxis=d3.axisLeft()
		.scale(yScale)

	svg.append('g')
		.attr('class','x-axis')
	svg.append('g')
		.attr('class','y-axis')

	svg.append("g")
		.attr("fill", "white")
		.attr("stroke", "black")
		.attr("stroke-width", 2)
		.selectAll("circle")
	  	.data(data)
	  	.join("circle")
		.attr("cx", function(d){
			return xScale(d.miles)
		})
		.attr("cy", d => yScale(d.gas))
		.attr("r", 3);

	const label = svg.append("g")
		.attr("font-family", "sans-serif")
		.attr("font-size", 10)
	 	.selectAll("g")
	  	.data(data)
	  	.join("g")
		.attr("transform", d => `translate(${xScale(d.miles)},${yScale(d.gas)})`)
		.attr("opacity", 1);
	
	label.append("text")
		.text(d=>d.year)
		.each(position)
		.call(halo)

	const line = d3.line()
		.x(d => xScale(d.miles))
		.y(d => yScale(d.gas))

	const l=length(line(data))

	svg.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("stroke-width", 1.5)
		.attr("stroke-linejoin", "round")
      	.attr("stroke-linecap", "round")
      	.attr("stroke-dasharray", `0,${l}`)
		.attr("d", line)
		.transition()
		.duration(5000)
		.ease(d3.easeLinear)
		.attr("stroke-dasharray", `${l},${l}`);
	
	svg.select('.x-axis')
		.call(xAxis)
		.attr('transform',`translate(0,${height})`)
		.call(g => g.select(".domain").remove())
		.selectAll(".tick line")
    	.clone()
    	.attr("y2", -height)
		.attr("stroke-opacity", 0.1) // make it transparent 

	svg.append('text')
		.attr('x',width-150)
		.attr('y',height-4)
		.text('Miles per person per year')
		.call(halo)
	
	svg.select('.y-axis')
		.call(yAxis)
		.call(g => g.select(".domain").remove())
		.selectAll(".tick line")
    	.clone()
    	.attr("x2", width)
    	.attr("stroke-opacity", 0.1) // make it transparent 

	svg.append('text')
		.attr('x',5)
		.attr('y',0)
		.text('Cost per gallon')
		.call(halo)

	function position(d) {
		const t = d3.select(this);
		switch (d.side) {
			case "top":
			t.attr("text-anchor", "middle").attr("dy", "-0.7em");
			break;
			case "right":
			t.attr("dx", "0.5em")
				.attr("dy", "0.32em")
				.attr("text-anchor", "start");
			break;
			case "bottom":
			t.attr("text-anchor", "middle").attr("dy", "1.4em");
			break;
			case "left":
			t.attr("dx", "-0.5em")
				.attr("dy", "0.32em")
				.attr("text-anchor", "end");
			break;
		}
	}

	function halo(text) {
		text
		  .select(function() {
			return this.parentNode.insertBefore(this.cloneNode(true), this);
		  })
		  .attr("fill", "none")
		  .attr("stroke", "white")
		  .attr("stroke-width", 4)
		  .attr("stroke-linejoin", "round");
	  }

	function length(path) {
		return d3.create("svg:path").attr("d", path).node().getTotalLength();
	  }
})



