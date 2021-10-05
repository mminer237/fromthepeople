import React from "react"
import { Link } from "gatsby"
import "./style.scss"
import Seo from "../components/seo"

export default function Layout({ children, description, title }) {
	return (
		<>
			<Seo description={description} title={title} />
			<header>
				<Link to="/">
					<h1><span class="from">From</span> <span class="the">the</span> <span class="people">People</span></h1>
				</Link>
			</header>
			{children}
			<footer><div>Made by <a href="https://matthewminer.name">Matthew Miner</a></div></footer>
		</>
	)
}