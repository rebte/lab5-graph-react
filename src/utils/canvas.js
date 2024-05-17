import { drawArrow, drawLine, drawCircleArrow, drawCircle, drawCircleLine, drawArcArrow } from './canvasPrimitives';

class Canvas {
	canvas;
	ctx;

	constructor(width, height, html) {
		this.canvas = html;
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = width;
		this.canvas.height = height;

		this.ctx.fillStyle = '#dee3e3';
		this.ctx.fillRect(0, 0, width, height);
	}
}

class VisaulGraph {
	N;
	width;
	height;

	peaksCoord = [];
	distance = 0;
	center = [];
	peakRadius = 30;

	canvas = null;
	ctx = null;

	data = new Map();

	type;

	constructor(ctx, matrix, type = 'dir') {
		this.ctx = ctx;
		this.matrix = matrix;
		this.N = this.matrix.length;
		this.type = type;

		this.distance = (ctx.canvas.width + ctx.canvas.height) / 2 / 2.5;
		this.center[0] = ctx.canvas.width / 2;
		this.center[1] = ctx.canvas.height / 2;

		for (let i = 0; i < this.N; i++) {
			this.peaksCoord.push({
				x: this.center[0] + this.distance * Math.cos((2 * Math.PI * i) / this.N),
				y: this.center[1] + this.distance * Math.sin((2 * Math.PI * i) / this.N),
			});
		}

		this.drawPeaks();
		if (type === 'dir') {
			this.drawDirGraph();
		} else {
			this.drawUndirGraph();
		}
	}

	drawDirGraph() {
		for (let k = 0; k < this.N; k++) {
			for (let j = 0; j < this.N; j++) {
				if (this.matrix[k][j] === 1) {
					const lineData = { key: `${k}_${j}` };

					if (this.matrix[k][j] === 1 && this.matrix[j][k] === 1 && j === k) {
						const circleDrawRadius = 20;
						const vector = [this.peaksCoord[j].x - this.center[0], this.peaksCoord[j].y - this.center[1]];
						const vectorLength = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
						vector[0] = vector[0] / vectorLength;
						vector[1] = vector[1] / vectorLength;

						lineData.data = {
							type: 'circle-arrow',
							width: 3,
							color: '#a104c4',
							centerX: this.peaksCoord[j].x + (this.peakRadius + circleDrawRadius) * vector[0],
							centerY: this.peaksCoord[j].y + (this.peakRadius + circleDrawRadius) * vector[1],
							concernedX: this.peaksCoord[j].x + this.peakRadius * vector[0],
							concernedY: this.peaksCoord[j].y + this.peakRadius * vector[1],
							circleDrawRadius,
						};

						drawCircleArrow(
							this.ctx,
							lineData.data.centerX,
							lineData.data.centerY,
							lineData.data.concernedX,
							lineData.data.concernedY,
							circleDrawRadius,
							lineData.data.width,
							lineData.data.color
						);
					} else {
						const vector = [this.peaksCoord[j].x - this.peaksCoord[k].x, this.peaksCoord[j].y - this.peaksCoord[k].y];
						const vectorLength = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
						vector[0] = vector[0] / vectorLength;
						vector[1] = vector[1] / vectorLength;

						const fromX = this.peaksCoord[k].x + this.peakRadius * vector[0];
						const fromY = this.peaksCoord[k].y + this.peakRadius * vector[1];
						const toX = this.peaksCoord[j].x - this.peakRadius * vector[0];
						const toY = this.peaksCoord[j].y - this.peakRadius * vector[1];

						if (this.matrix[k][j] === 1 && this.matrix[j][k] === 1) {
							const toDXY = [this.peaksCoord[k].x - toX, this.peaksCoord[k].y - toY];
							const angleTo = Math.atan2(toDXY[1], toDXY[0]);

							lineData.data = {
								type: 'arc-arrow',
								width: 3,
								color: '#0469cf',
								toX: this.peaksCoord[j].x + this.peakRadius * Math.cos(angleTo + Math.PI / 15),
								toY: this.peaksCoord[j].y + this.peakRadius * Math.sin(angleTo + Math.PI / 15),
								fromX,
								fromY,
							};

							drawArcArrow(this.ctx, lineData.data.fromX, lineData.data.fromY, lineData.data.toX, lineData.data.toY, lineData.data.width, lineData.data.color);
						} else {
							lineData.data = {
								type: 'arrow',
								width: 3,
								color: '#04b807',
								toX,
								toY,
								fromX,
								fromY,
							};

							drawArrow(this.ctx, lineData.data.fromX, lineData.data.fromY, lineData.data.toX, lineData.data.toY, lineData.data.width, lineData.data.color);
						}
					}
					this.data.set(lineData.key, lineData.data);
				}
			}
		}
	}

	changeDirectionColor(key, color) {
		const line = this.data.get(key);
		if (!line || this.type === 'undir') return;

		line.preColor = line.color;
		line.color = color;

		switch (line.type) {
			case 'arrow':
				drawArrow(this.ctx, line.fromX, line.fromY, line.toX, line.toY, line.width - 1, line.color);
				break;
			case 'arc-arrow':
				drawArcArrow(this.ctx, line.fromX, line.fromY, line.toX, line.toY, line.width - 1, line.color);
				break;
			case 'circle-arrow':
				drawCircleArrow(this.ctx, line.centerX, line.centerY, line.concernedX, line.concernedY, line.circleDrawRadius, line.width - 1, line.color);
				break;
		}
	}

	backDirectionColor(key) {
		const line = this.data.get(key);
		if (!line || this.type === 'undir') return;

		line.color = line.preColor;
		line.preColor = null;

		switch (line.type) {
			case 'arrow':
				drawArrow(this.ctx, line.fromX, line.fromY, line.toX, line.toY, line.width, line.color);
				break;
			case 'arc-arrow':
				drawArcArrow(this.ctx, line.fromX, line.fromY, line.toX, line.toY, line.width, line.color);
				break;
			case 'circle-arrow':
				drawCircleArrow(this.ctx, line.centerX, line.centerY, line.concernedX, line.concernedY, line.circleDrawRadius, line.width, line.color);
				break;
		}
	}

	peakAddMark(peakN, color) {
		const peak = this.peaksCoord[peakN];

		if (peak) {
			drawCircleLine(this.ctx, peak.x, peak.y, 13, 5, '#fcba03');
			drawCircleLine(this.ctx, peak.x, peak.y, 13, 1.8, color);
		}
	}

	resetPeaks() {
		this.peaksCoord.forEach(peak => drawCircleLine(this.ctx, peak.x, peak.y, 13, 5, '#fcba03'));
	}

	drawUndirGraph() {
		for (let k = 0; k < this.N; k++) {
			for (let j = 0; j < this.N; j++) {
				if (j >= k && this.matrix[k][j] === 1) {
					if (j === k) {
						const circleDrawR = 20;
						const vector = [this.peaksCoord[j].x - this.center[0], this.peaksCoord[j].y - this.center[1]];
						const vectorLength = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
						vector[0] = vector[0] / vectorLength;
						vector[1] = vector[1] / vectorLength;

						drawCircleLine(
							this.ctx,
							this.peaksCoord[j].x + (this.peakRadius + circleDrawR) * vector[0],
							this.peaksCoord[j].y + (this.peakRadius + circleDrawR) * vector[1],
							circleDrawR,
							3,
							'#a104c4'
						);
					} else {
						const vector = [this.peaksCoord[j].x - this.peaksCoord[k].x, this.peaksCoord[j].y - this.peaksCoord[k].y];
						const vectorLength = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
						vector[0] = vector[0] / vectorLength;
						vector[1] = vector[1] / vectorLength;

						const fromX = this.peaksCoord[k].x + this.peakRadius * vector[0];
						const fromY = this.peaksCoord[k].y + this.peakRadius * vector[1];
						const toX = this.peaksCoord[j].x - this.peakRadius * vector[0];
						const toY = this.peaksCoord[j].y - this.peakRadius * vector[1];

						drawLine(this.ctx, fromX, fromY, toX, toY, 3, '#0469cf');
					}
				}
			}
		}
	}

	drawPeaks() {
		this.peaksCoord.forEach((el, index) => {
			drawCircle(this.ctx, el.x, el.y, this.peakRadius, '#fcba03', index + 1);
		});
	}
}

export { Canvas, VisaulGraph };
