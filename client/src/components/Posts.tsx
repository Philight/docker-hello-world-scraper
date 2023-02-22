import React, { useState } from "react";

import "../assets/css/components/posts.css";

import { ReactComponent as SRealityLogo } from "../assets/logos/sreality-logo.svg";

interface PostData {
	id: number;
	images: Array<string>;
	title: string;
	url: string;
}

interface Props {
	className?: string;
    postsData: Array<PostData>;
	currentPage: number;
}

const Posts = (props : Props) => {
	let { className, postsData, currentPage } = props;

	const [currentPost, setPost] = useState<PostData>( {id:0, images: [], title: 'Default', url: ''} );
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	
	const openModal = (articleData: PostData) => {
		setModalOpen(true);
		setPost(articleData);
	}

	const closeModal = () => {
		setModalOpen(false);
	}

	return (
		<div className={`posts__container flex-col ${className}`}>

			<div className={`posts__modal flex-center ${modalOpen? 'open' : ''}`}>
				<canvas className="posts__modal-dropshadow" onClick={() => closeModal()} />
				<div className="posts__modal-content flex-col">
					<a href={currentPost['url']} target="_blank" rel="noreferrer"><h3>{currentPost['title']}</h3></a>
					<div className="posts__modal-images flex-center">
					{currentPost['images'].map((imageSrc, index) => (
						<div className="image-wrapper">
							<img className="posts__modal-image" src={imageSrc} alt="View of the interior in the Apartment" />
						</div>
					))}
					</div>
					<div className="image-wrapper logo">
						<SRealityLogo />
					</div>
				</div>

			</div>

			<h2>Newest 500 Apartments on the Czech market</h2>

			<div className="posts__articles__carousel-view">
				<div 
					className="posts__articles-container carousel-slider flex-col" 
					style={{ transform: `translateX(-${currentPage * 100}%)`}}
				>

				{postsData.map((article, index) => (
					<article className="posts__article carousel-slide" onClick={() => openModal(article)} >
						<div className="image-wrapper">
							<img className="posts__article-image" src={article['images'][0]} alt="View of the interior in the Apartment" />
						</div>
					</article>
				))}

				</div>
			</div>
		</div>
	)
}

export default Posts;