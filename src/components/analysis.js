import React, { useEffect } from "react"
import Data from "../data/data.yaml"
import * as d3 from "d3"
import { sankey, sankeyLinkHorizontal, sankeyCenter, SankeyLink } from "d3-sankey"

export default function Analysis({ increase, income = 75_000, targetYear = new Date().getFullYear() }) {
	/* Use year closest to the given year. */
	const budgetYear =
		Object.keys(Data.budget.years).reduce((a, b) =>
			Math.abs(b - targetYear) < Math.abs(a - targetYear) ? b : a
		);
	const budget = Data.budget.years[budgetYear];
	const incomeTaxYear =
		Object.keys(Data.incomeTaxes.years).reduce((a, b) =>
			Math.abs(b - targetYear) < Math.abs(a - targetYear) ? b : a
		);
	const incomeTaxes = Data.incomeTaxes.years[incomeTaxYear];

	const percentIncrease = (increase / budget.spending.total);

	const restrictedFunds = [
		"Social Security and Medicare Taxes",
		"Unemployment Insurance",
		"Other Retirement"
	];
	const generalReceipts =
		Object.entries(budget.receipts.categorized).reduce((a, b) =>
			["", a[1] + (restrictedFunds.includes(b[0]) ? 0 : b[1])], ["", 0]
		)[1];
	const incomeTaxPercentage = budget.receipts.categorized["Individual Income Taxes"] / generalReceipts;

	let incomeTax = 0;
	if (income < 1) {
		incomeTax = 0;
	}
	else if (income >= incomeTaxes.incomes[incomeTaxes.incomes.length - 1].income) {
		incomeTax = 190_000 + (income - 670_000) * 0.37 * 0.9;
	}
	else {
		for (var incomeIndex = incomeTaxes.incomes.length - 2; incomeIndex >= 0; incomeIndex--) {
			if (income >= incomeTaxes.incomes[incomeIndex].income) {
				break;
			}
		}
		const bracketMiddle = (incomeTaxes.incomes[incomeIndex] + incomeTaxes.incomes[incomeIndex + 1]) / 2;
		const bracketRate = bracketMiddle / (incomeTaxes.totalTaxPaid[incomeIndex] / incomeTaxes.numbers[incomeIndex]);
		const otherIndex = income < bracketMiddle ? incomeIndex - 1 : incomeIndex + 1;
		const otherMiddle = otherIndex === incomeTaxes.incomes.length - 1 ?
			22_000_000 :
			(incomeTaxes.incomes[otherIndex].income + incomeTaxes.incomes[otherIndex + 1]) / 2;
		const otherRate = otherMiddle / (incomeTaxes.totalTaxPaid[otherIndex] / incomeTaxes.numbers[otherIndex]);
		const d1 = Math.abs(income - bracketMiddle);
		const d2 = Math.abs(income - otherMiddle);
		const rate = (d1 * otherRate + d2 * bracketRate) / (d1 + d2);
		incomeTax = income * rate;
	}

	function hashToColor(str) {
		const array = str.split('');
		let n = 0;
		for (let i = 0; i < array.length; i++) {
			n += array[i].charCodeAt(0) * (i + 1);
		}
		const hue = Math.abs(n) % 360;
		return `hsl(${hue}deg, 80%, 35%)`;
	}

	// let data = {
	// 	"nodes": [
	// 		{"node": 0, "name": "foo", "color": "#ffaa11"},
	// 		{"node": 1, "name": "bar", "color": "#ffaa55"},
	// 		{"node": 2, "name": "baz", "color": "#ffaa99"}
	// 	],
	// 	"links": [
	// 		{"source":0, "target":2, "value":2},
	// 		{"source":1, "target":2, "value":2}
	// 	]
	// };
	let data = {
		"nodes": [
			{"node": 0, "name": "Total Spending", "color": hashToColor("Income Taxes")},
			{"node": 1, "name": "Receipts", "color": hashToColor("Receipts")},
			{"node": 2, "name": "Borrowing", "color": hashToColor("Borrowing")}
		],
		"links": []
	};

	/* Add spending to chart */
	let budgetTotal = 0;
	for (const category in budget.spending.categorized) {
		budgetTotal += budget.spending.categorized[category];
		data.nodes.push({
			"node": data.nodes.length,
			"name": category,
			"color": hashToColor(category)
		});
		data.links.push({
			"source": data.nodes.length - 1,
			"target": 0,
			"value": budget.spending.categorized[category]
		});
	}

	/* Add receipts to chart */
	let allReceipts = 0;
	for (const category in budget.receipts.categorized) {
		allReceipts += budget.receipts.categorized[category];
		data.nodes.push({
			"node": data.nodes.length,
			"name": category,
			"color": hashToColor(category)
		});
		data.links.push({
			"source": 1,
			"target": data.nodes.length - 1,
			"value": budget.receipts.categorized[category]
		});
	}
	data.links.push({
		"source": 0,
		"target": 1,
		"value": allReceipts
	});
	/* Add lack of receipts to chart */
	data.links.push({
		"source": 0,
		"target": 2,
		"value": budget.spending.total - allReceipts
	});

	const graph = sankey();
	graph.nodeWidth(20);
	graph.nodePadding(15);
	// graph.extent([[15, 15], [500 - 15, 500 - 15]]);
	graph.size([900, 600]);
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