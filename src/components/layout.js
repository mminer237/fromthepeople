import React from "react"
import "./style.scss"
export default function Layout({ children }) {
	return (
		<>
			<header><h1><span class="from">From</span> <span class="the">the</span> <span class="people">People</span></h1></header>
			{children}
			<footer><div>Made by <a href="https://matthewminer.name">Matthew Miner</a></div></footer>
		</>
	)
}