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

	let data = {
		"nodes": [
			{"node": 0, "name": "foo", "color": "#ffaa11"},
			{"node": 1, "name": "bar", "color": "#ffaa55"},
			{"node": 2, "name": "baz", "color": "#ffaa99"}
		],
		"links": [
			{"source":0, "target":2, "value":2},
			{"source":1, "target":2, "value":2}
		]
	};
	const graph = sankey();
	graph.nodeWidth(20);
	graph.nodePadding(20);
	// graph.extent([[15, 15], [500 - 15, 500 - 15]]);
	graph.size([500, 500]);
	const { nodes, links } = graph(data);
	console.log(data);
	console.log(graph);
	console.log(nodes);
	console.log(links);

	useEffect(() => {
		const svg = d3.select(".analysis > svg");

		/* Add links */
		svg.select("#links")
			.selectAll("path")
			.data(links)
			.join("path")
				.attr("class", "link")
				.attr("d", sankeyLinkHorizontal())
				.style("stroke", d => d.source.color)
				.style("stroke-width", d => d.width)
				.sort((a, b) => b.dy - a.dy);
		
		/* Add nodes */
		svg.select("#nodes")
			.selectAll(".node")
			.data(nodes)
			.join("rect")
			.attr("class", "node")
			.attr("x", node => node.x0)
			.attr("y", node => node.y0)
			.attr("height", node => node.y1 - node.y0)
			.attr("width", graph.nodeWidth())
			.style("fill", node => node.color)
			.style("stroke", node => d3.rgb(node.color).darker(2));

		/* Add node labels */
		svg.select("#labels")
			.selectAll("text")
			.data(nodes)
			.join("text")
				.attr("x", node => node.x0 < graph.size()[0] / 2 ?
					node.x1 + 6 :
					node.x0 - 6
				)
				.attr("text-anchor", node => node.x0 < graph.size()[0] / 2 ?
					"start" :
					"end"
				)
				.attr("y", node => (node.y1 + node.y0) / 2)
				.attr("dy", "0.35em")
				.text(node => node.name);
	}, [data]);

	return (
		<div className="analysis">
			<svg>
				<g id="links"></g>
				<g id="nodes"></g>
				<g id="labels"></g>
			</svg>
		</div>
	)
}