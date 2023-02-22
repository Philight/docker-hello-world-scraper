import React from "react";

import { ReactComponent as BlocksLoader } from "../../assets/icons/blocks-loader.svg";

interface Props {
    className?: string;
}

const Loader = (props : Props) => {
	let { className } = props;
	
	return (
		<div className={`loader__container flex-center ${className}`}>
			<BlocksLoader />
		</div>
	)
}

export default Loader;