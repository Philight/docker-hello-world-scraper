import React from "react";

import "../../assets/css/components/background.css";

interface Props {
//    firstName: string;
}

const Background = (props : Props) => {
//	let { className, redirectUrl, socialFacebookUrl, socialInstagramUrl, title, subtitle, description, subdescription } = props;
	
	return (
		<div className="background__container absolute-center">
			<canvas className="background__picture" />
			<canvas className="background__overlay absolute-center" />
		</div>
	)
}

export default Background;