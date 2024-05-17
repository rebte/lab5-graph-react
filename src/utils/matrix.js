function printMatrix(matrix, name = 'Matrix') {
	let str = '';
	matrix.forEach((el, i) => {
		if (i !== 0) {
			str += '\n';
		}
		str += el.join(', ');
	});
	console.log(name + '\n' + str);
}

function BFS(matrix, queue, visited, result) {
	let vertex = queue.shift();
	let currentVertex = [];
	result.push(vertex);

	for (let i = 0; i < matrix.length; i++) {
		if (matrix[vertex][i] === 1 && !visited.includes(i)) {
			visited.push(i);
			queue.push(i);
			currentVertex.push([vertex, i]);
		}
	}

	if (queue.length === 0) {
		for (let i = 0; i < matrix.length; i++) {
			if (!visited.includes(i)) {
				visited.push(i);
				queue.push(i);
				break;
			}
		}
	}

	return { isFinish: queue.length === 0, queue, visited, result, currentVertex };
}

function DFS(matrix, vertex, result, paths) {
	result.push(vertex);

	for (let i = 0; i < matrix.length; i++) {
		if (matrix[vertex][i] === 1 && !result.includes(i)) {
			paths.push({ from: vertex, to: i });
			DFS(matrix, i, result, paths);
		}
	}

	return { paths, result };
}

export { printMatrix, BFS, DFS };
