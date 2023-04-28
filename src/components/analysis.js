import React from "react"
import Data from "../data/data.yaml"
import "charts.css"

function makeCell(value, max) {
	return (
		<td style={{ "--size": `calc(${Math.round(value)} / ${max})` }}>
			<span className="data">${Math.round(value).toLocaleString()}</span>
			<span className="tooltip">${Math.round(value).toLocaleString()}</span>
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
		<div className="analysis">
			<table className="charts-css bar hide-data show-labels show-primary-axis multiple stacked">
				<tbody>
					{Data.incomeTaxes.years[incomeTaxYear].incomes.map((income, i, a) => { return (
						<tr key={i}>
							<th scope="row">
								{(i === a.length - 1) ? <span className="no-break">${income.toLocaleString()}+</span> : <><span className="no-break">${income.toLocaleString()}–</span><span className="no-break">${(a[i + 1] - 1).toLocaleString()}</span></>}
							</th>
							{makeCell(Data.incomeTaxes.years[incomeTaxYear].totalTaxPaid[i] / Data.incomeTaxes.years[incomeTaxYear].numbers[i], maxTax)}
							{makeCell(Data.incomeTaxes.years[incomeTaxYear].totalTaxPaid[i] / Data.incomeTaxes.years[incomeTaxYear].numbers[i] * percentIncrease, maxTax)}
						</tr>
					)})}
				</tbody>
			</table>
		</div>
	)
}