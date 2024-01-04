import React, { useEffect } from "react"
import Data from "../data/data.yaml"
import * as d3 from "d3"
import { sankey, sankeyLinkHorizontal, sankeyCenter, SankeyLink } from "d3-sankey"

export default function Analysis({ increase, targetYear = new Date().getFullYear() }) {
	/* Use year closest to the given year. */
	const budgetYear = Object.keys(Data.budget.years).reduce((a, b) => Math.abs(b - targetYear) < Math.abs(a - targetYear) ? b : a);
	const incomeTaxYear = Object.keys(Data.incomeTaxes.years).reduce((a, b) => Math.abs(b - targetYear) < Math.abs(a - targetYear) ? b : a);

	const percentIncrease = (increase / Data.budget.years[budgetYear].spending.total);

	const maxPaid = Math.round(Data.incomeTaxes.years[incomeTaxYear].totalTaxPaid[Data.incomeTaxes.years[incomeTaxYear].totalTaxPaid.length - 1] / Data.incomeTaxes.years[incomeTaxYear].numbers[Data.incomeTaxes.years[incomeTaxYear].totalTaxPaid.length - 1]);
	const maxTax = Math.log(maxPaid) + Math.log(maxPaid * percentIncrease);

	useEffect(() => {
		const svg = d3.select(".analysis > svg");
		const data = {
			"nodes": [
				{"node": 0, "name": "foo"},
				{"node": 1, "name": "bar"},
				{"node": 2, "name": "baz"}
			],
			"links": [
				{"source":0, "target":2, "value":2},
				{"source":1, "target":2, "value":2}
			]
		};
		const graph = sankey();
		graph.nodeWidth(15);
		graph.nodePadding(5);
		graph.size([500, 500]);
		const { nodes, links } = graph(data);
		console.log(data);
		console.log(graph);
		console.log(nodes);
		console.log(links);
		// console.log(graph.nodes);
		// console.log(graph.links());
		// console.log(sankey().nodes(graph));

		console.log(sankeyLinkHorizontal());
		// add in the links
		var link = svg.append("g")
			.selectAll()
			.data(links)
			.enter()
			.append("path")
				.attr("class", "link")
				.attr("d", sankeyLinkHorizontal())
				// .attr("d", sankeyLinkHorizontal())
				.style("stroke-width", function(d) { return Math.max(1, d.dy); })
				.sort(function(a, b) { return b.dy - a.dy; });
		
		// add in the nodes
		var node = svg.append("g")
			.selectAll(".node")
			.data(nodes)
			.enter().append("g")
				.attr("class", "node")
				.attr("transform", function(node) { console.log(node); return "translate(" + node.x0 + "," + node.y0 + ")"; });

		// add the rectangles for the nodes
		node
			.append("rect")
			.attr("height", graph.nodeWidth())
			.attr("width", graph.nodeWidth())
			.style("fill", "#ffaa11")
			.style("stroke", function(node) { return d3.rgb(node.color).darker(2); })
			// Add hover text
			.append("title")
			.text(function(node) { return node.name + "\n" + "There is " + node.value + " stuff in this node"; });
		
		// return () => {
		// 	svg.selectChildren().remove();
		// }
	}, []);

	return (
		<div className="analysis">
			<svg></svg>
		</div>
	)
}