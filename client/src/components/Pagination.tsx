import React from "react";

import Circle from "../components/graphic/Circle";
import { VARIABLES } from "../data/ENV.js";

import "../assets/css/components/pagination.css";

interface Props {
	numOfPosts: number;
	currentPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination = (props : Props) => {
	let { numOfPosts, setPage, currentPage } = props;
	
	const numOfPages = numOfPosts/VARIABLES['POSTS_PER_PAGE']; 

	return (
		<div className="pagination__container flex-center">

			{/*`${currentPage}, ${numOfPosts}, ${numOfPages}`*/}

			{Array.from({length: numOfPages+1}, (_, i) => i ).map((digit, index) => (
				<Circle key={index} className={`${currentPage>=index ? 'filled' : ''}`} onClick={() => setPage(index)} />
			))}

		</div>
	)
}

export default Pagination;