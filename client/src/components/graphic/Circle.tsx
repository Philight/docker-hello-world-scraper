import React from "react";

interface Props {
    className?: string;
    onClick?: React.MouseEventHandler<HTMLCanvasElement>;
}

const Circle = (props : Props) => {
	let { className, onClick } = props;
	
	return (
		<canvas className={`circle__container ${className}`} onClick={onClick} />
	)
}

export default Circle;