import * as React from "react"
import CustomAnalysis from "../components/custom-analysis"
import Layout from "../components/layout"
import Data from "../data/data.yaml"

// markup
const IndexPage = () => {
	return (
		<Layout
			description="From the People helps convey the practical costs of government spending on an easily-accessible website."
		>
			<main>
				<h2>The U.S. Budget and You</h2>
				<p>
					The U.S. annual spending budget currently sits at ${Data.budget.years[Math.max(Object.keys(Data.budget.years))].spending.total.toLocaleString()} per year. (As of {Math.max(Object.keys(Data.budget.years))}) To pay for this, it taxes ${Data.budget.years[Math.max(Object.keys(Data.budget.years))].receipts.total.toLocaleString()} per year and borrows the rest.
				</p>
				<p>The harsh reality is that even the United States government cannot just make all its money out of thin air forever. While it can accrue some debt (<a href="https://www.usdebtclock.org/">and does it ever</a>), eventually increased spending will require increased taxes. Likewise, tax cuts for some without reducing spending will require increased taxes for others. Therefore, it is every American's concern how much the government spends. However, given the extraordinarily high numbers of dollars the federal government deals in and the complexity of taxation, it can be hard to understand the practical effects of government spending.</p>
				<p>This site looks to alleviate that trouble by estimating the practical increases in taxes that would be required by different spending proposals which retaining our current debt ratio.</p>
				<CustomAnalysis />
			</main>
		</Layout>
	)
}

export default IndexPage
