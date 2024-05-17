const drawArrow = (ctx, fromX, fromY, toX, toY, arrowWidth, color) => {
	const headlen = 5;
	const angle = Math.atan2(toY - fromY, toX - fromX);

	ctx.save();
	ctx.strokeStyle = color;

	ctx.beginPath();
	ctx.moveTo(fromX, fromY);
	ctx.lineTo(toX, toY);
	ctx.lineWidth = arrowWidth;
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(toX, toY);
	ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 7), toY - headlen * Math.sin(angle - Math.PI / 7));

	ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 7), toY - headlen * Math.sin(angle + Math.PI / 7));

	ctx.lineTo(toX, toY);
	ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 7), toY - headlen * Math.sin(angle - Math.PI / 7));

	ctx.stroke();
	ctx.restore();
};

const drawLine = (ctx, fromX, fromY, toX, toY, arrowWidth, color) => {
	ctx.save();
	ctx.strokeStyle = color;

	ctx.beginPath();
	ctx.moveTo(fromX, fromY);
	ctx.lineTo(toX, toY);
	ctx.lineWidth = arrowWidth;
	ctx.stroke();
	ctx.restore();
};

const drawArcArrow = (ctx, fromX, fromY, toX, toY, arrowWidth, color) => {
	const midX = (fromX + toX) / 2;
	const midY = (fromY + toY) / 2;
	const ctrlX = midX + (toY - fromY) * 0.05;
	const ctrlY = midY + (fromX - toX) * 0.05;
	const headlen = 5;
	const angle = Math.atan2(toY - fromY, toX - fromX);

	ctx.save();
	ctx.strokeStyle = color;

	ctx.beginPath();
	ctx.moveTo(fromX, fromY);
	ctx.quadraticCurveTo(ctrlX, ctrlY, toX, toY);
	ctx.lineWidth = arrowWidth;
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(toX, toY);
	ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 7), toY - headlen * Math.sin(angle - Math.PI / 7));

	ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 7), toY - headlen * Math.sin(angle + Math.PI / 7));

	ctx.lineTo(toX, toY);
	ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 7), toY - headlen * Math.sin(angle - Math.PI / 7));

	ctx.stroke();
	ctx.restore();
};

const drawCircleArrow = (ctx, centerX, centerY, concernedX, concernedY, r, arrowWidth, color) => {
	const headlen = 10;
	const angle = Math.atan2(centerY - concernedY, centerX - concernedX) - 8;

	ctx.save();
	ctx.strokeStyle = color;

	ctx.beginPath();
	ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
	ctx.lineWidth = arrowWidth;
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(concernedX, concernedY);
	ctx.lineTo(concernedX - headlen * Math.cos(angle - Math.PI / 7), concernedY - headlen * Math.sin(angle - Math.PI / 7));

	ctx.lineTo(concernedX - headlen * Math.cos(angle + Math.PI / 7), concernedY - headlen * Math.sin(angle + Math.PI / 7));

	ctx.lineTo(concernedX, concernedY);
	ctx.lineTo(concernedX - headlen * Math.cos(angle - Math.PI / 7), concernedY - headlen * Math.sin(angle - Math.PI / 7));

	ctx.stroke();
	ctx.restore();
};

const drawCircleLine = (ctx, centerX, centerY, r, arrowWidth, color) => {
	ctx.save();
	ctx.strokeStyle = color;

	ctx.beginPath();
	ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
	ctx.lineWidth = arrowWidth;

	ctx.stroke();
	ctx.restore();
};

const drawCircle = (ctx, x, y, r, color, text = '') => {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fill();

	ctx.font = '15pt Calibri';
	ctx.fillStyle = '#000';
	ctx.textAlign = 'center';
	ctx.fillText(text, x, y + 7);
};

export { drawArrow, drawLine, drawArcArrow, drawCircleArrow, drawCircleLine, drawCircle };
