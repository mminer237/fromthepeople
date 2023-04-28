import React from "react"
import Analysis from "../components/analysis"

export default function CustomAnalysis({ }) {
	const [amount, setAmount] = React.useState(1000000000);
	
	return <div class="split">
		<Analysis increase={amount} />
		<div>
			<h3>Custom Analysis</h3>
			<p>Enter the amount of money you would like to increase spending by and see how much taxes would have to increase to pay for it.</p>
			$<input
				type="number"
				value={amount}
				onChange={(event) => setAmount(event.target.value)}
			/>
		</div>
	</div>
}