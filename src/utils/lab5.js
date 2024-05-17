import randomSeed from './random';
import { BFS, DFS, printMatrix } from './matrix';
import { Canvas, VisaulGraph } from './canvas';

const N = 10 + 1;
const SEED = 3410;
const COEF = 1 - 1 * 0.01 - 0 * 0.005 - 0.15;
const WIDTH = 800;
const HEIGHT = 800;

function init(canvasHtml) {
	const matrixDir = Array.from({ length: N }, () => Array(N).fill(0));
	const random = randomSeed(SEED);
	const canvas = new Canvas(WIDTH, HEIGHT, canvasHtml);

	for (let k = 0; k < N; k++) {
		for (let j = 0; j < N; j++) {
			const v = Math.floor(random(0, 2) * COEF);
			matrixDir[k][j] = v;
		}
	}

	printMatrix(matrixDir, 'Матриця');
	const visualGraph = new VisaulGraph(canvas.ctx, matrixDir);

	let typeBypass;
	let BFSconfig = { queue: [], visited: [], result: [], isFinish: false, currentVertex: [] };

	let DFSpaths = [];
	let activeDFSpaths = 0;

	let changedColor = [];

	function start(type) {
		let start;
		typeBypass = type;

		for (let i = 0; i < N; i++) {
			if (matrixDir[i].indexOf(1) !== -1 && matrixDir[i].indexOf(1) !== i) {
				start = i;
				break;
			}
		}

		if (start === undefined) {
			console.log('Немає вершини що підходить');
			return;
		}

		if (type === 'BFS') {
			BFSconfig = BFS(matrixDir, [start], [start], []);

			visualGraph.peakAddMark(start, '#0b03fc');

			BFSconfig.currentVertex.forEach(el => {
				visualGraph.changeDirectionColor(el.join('_'), '#fc0303');
				changedColor.push(el);
			});
		} else if (type === 'DFS') {
			let { paths, result } = DFS(matrixDir, start, [], []);

			for (let i = 0; i < N; i++) {
				if (!result.includes(i)) {
					const update = DFS(matrixDir, i, result, paths);
					paths = update.paths;
					result = update.result;
				}
			}

			DFSpaths = paths;

			const dir = DFSpaths[activeDFSpaths];

			visualGraph.peakAddMark(dir.from, '#0b03fc');
			visualGraph.changeDirectionColor([dir.from, dir.to].join('_'), '#fc0303');
			changedColor.push([dir.from, dir.to]);
		}
	}

	function next(callBackEnd) {
		if (typeBypass === 'BFS') {
			BFSconfig = BFS(matrixDir, BFSconfig.queue, BFSconfig.visited, BFSconfig.result);

			changedColor.forEach(el => visualGraph.backDirectionColor(el.join('_')));
			changedColor = [];

			BFSconfig.visited
				.filter(el => el !== BFSconfig.result.at(-1))
				.forEach(el => {
					visualGraph.peakAddMark(el, '#fc0303');
				});

			visualGraph.peakAddMark(BFSconfig.result.at(-1), '#0b03fc');

			BFSconfig.currentVertex.forEach(el => {
				visualGraph.changeDirectionColor(el.join('_'), '#fc0303');
				changedColor.push(el);
			});

			if (BFSconfig.isFinish) {
				callBackEnd();
				typeBypass = null;
				visualGraph.resetPeaks();
			}
		} else if (typeBypass === 'DFS') {
			activeDFSpaths += 1;
			changedColor.forEach(el => visualGraph.backDirectionColor(el.join('_')));
			changedColor = [];

			if (!DFSpaths[activeDFSpaths]) {
				callBackEnd();
				typeBypass = null;
				visualGraph.resetPeaks();
				DFSpaths = [];
				activeDFSpaths = 0;

				return;
			}

			const dir = DFSpaths[activeDFSpaths];

			visualGraph.peakAddMark(DFSpaths[activeDFSpaths - 1].from, '#fc0303');
			visualGraph.peakAddMark(DFSpaths[activeDFSpaths - 1].to, '#fc0303');

			visualGraph.peakAddMark(dir.from, '#0b03fc');
			visualGraph.changeDirectionColor([dir.from, dir.to].join('_'), '#fc0303');
			changedColor.push([dir.from, dir.to]);
		}
	}

	return { start, next };
}

export { init };
