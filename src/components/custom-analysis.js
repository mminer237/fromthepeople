import React from "react"
import Analysis from "../components/analysis"

export default function CustomAnalysis({ defaultIncrease = 1000000000 }) {
	const [amount, setAmount] = React.useState(defaultIncrease);
	
	return <div className="split">
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