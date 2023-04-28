import React from "react"
import Data from "../data/data.yaml"
import "charts.css"

function makeCell(value, max) {
	return (
		<td style={{ "--size": `calc(${Math.round(value)} / ${max})` }}>
			<span class="data">${Math.round(value).toLocaleString()}</span>
			<span class="tooltip">${Math.round(value).toLocaleString()}</span>
		</td>
	)
}

export default function Analysis({ increase, targetYear = new Date().getFullYear() }) {
	/* Use year closest to the given year. */
	const budgetYear = Object.keys(Data.budget.years).reduce((a, b) => Math.abs(b - targetYear) < Math.abs(a - targetYear) ? b : a);
	const incomeTaxYear = Object.keys(Data.incomeTaxes.years).reduce((a, b) => Math.abs(b - targetYear) < Math.abs(a - targetYear) ? b : a);

	const percentIncrease = (increase / Data.budget.years[budgetYear].spending.total);

	const maxTax = Math.round(Data.incomeTaxes.years[incomeTaxYear].totalTaxPaid[Data.incomeTaxes.years[incomeTaxYear].totalTaxPaid.length - 1] / Data.incomeTaxes.years[incomeTaxYear].numbers[Data.incomeTaxes.years[incomeTaxYear].totalTaxPaid.length - 1] * (1 + percentIncrease));

	return (
		<div class="analysis">
			<table class="charts-css bar hide-data show-labels show-primary-axis multiple stacked">
				{Data.incomeTaxes.years[incomeTaxYear].incomes.map((income, i, a) => { return (
					<tr>
						<th scope="row">
							{(income == 1) ? "$0" : `$${a[i - 1]}–$${income}`}
						</th>
						{makeCell(Data.incomeTaxes.years[incomeTaxYear].totalTaxPaid[i] / Data.incomeTaxes.years[incomeTaxYear].numbers[i], maxTax)}
						{makeCell(Data.incomeTaxes.years[incomeTaxYear].totalTaxPaid[i] / Data.incomeTaxes.years[incomeTaxYear].numbers[i] * percentIncrease, maxTax)}
					</tr>
				)})}
			</table>
		</div>
	)
}