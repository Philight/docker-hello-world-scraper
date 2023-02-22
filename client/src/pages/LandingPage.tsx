import React, { useState, useEffect } from "react";
import axios from 'axios';

import Posts from "../components/Posts";
import Pagination from "../components/Pagination";
import Loader from "../components/graphic/Loader";
import Background from "../components/graphic/Background";

import { VARIABLES } from "../data/ENV.js";

import "../assets/css/pages/landingpage.css";
import { ReactComponent as LuxonisLogo } from "../assets/logos/luxonis-logo.svg";

interface PostData {
	id: number;
	images: Array<string>;
	title: string;
	url: string;
}

interface Props {
//    firstName: string;
}

const LandingPage = (props : Props) => {
//	let { className, redirectUrl, socialFacebookUrl, socialInstagramUrl, title, subtitle, description, subdescription } = props;
	
	const [postsData, setPostsData] = useState<Array<PostData>>( [] );
	const [isLoading, setLoading] = useState<boolean>(true);
	const [currentPage, setPage] = useState<number>(0);

	const getPosts = async () => {
		setLoading(true);
    const result = await axios.get(`${VARIABLES['API_HOST']}:${VARIABLES['API_PORT']+VARIABLES['API_POSTS_PATH']}`);
//        console.log('getPosts posts');
//        console.log(result.data.posts);
    setPostsData(result.data.posts);

    setTimeout(() => {
			setLoading(false);
    }, 2000)
	}

	useEffect(() => {
		getPosts();
	}, [])

	return isLoading? <Loader />
	:( <div className="landing-page__container page-padding flex-col flex-center">
			<Background />

			<a className="landing-page__logo FL" href={`https://philight.github.io/portfolio/`} target="_blank" rel="noreferrer">
				<div className="image-wrapper">
					<h5>FL</h5>
				</div>
			</a>

			<header className="landing-page__header">Flats for Sale</header>

			<div className="landing-page__body flex-col flex-center">
				<Posts 
					postsData={postsData}
					currentPage={currentPage} 
				/>
				<Pagination 
					numOfPosts={postsData.length}
					currentPage={currentPage} 
					setPage={setPage} 
				/>
			</div>

			<a className="landing-page__logo Lux" href={`https://www.luxonis.com/`} target="_blank" rel="noreferrer">
				<div className="image-wrapper">
					<LuxonisLogo />
				</div>
			</a>
		</div>
	)
}

export default LandingPage;