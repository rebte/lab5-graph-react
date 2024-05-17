import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import { init } from '../utils/lab5';

function App() {
	const canvas = useRef(null);
	let isAppStarted = false;

	let [isBypassStart, setBypassStart] = useState(false);
	let [matrixEvents, setMatrixEvents] = useState(false);
	let typeBypass = '0'; // BFS, DFS

	useEffect(() => {
		if (!isAppStarted) {
			setMatrixEvents(init(canvas.current));
			isAppStarted = true;
		}
	}, [canvas]);

	const start = type => {
		matrixEvents.start(type);
		setBypassStart(true);
		typeBypass = type;
	};

	const next = () => {
		matrixEvents.next(() => {
			setBypassStart(false);
			typeBypass = null;
		});
	};

	return (
		<div className="App">
			<div className="App-title">Canvas</div>
			<canvas ref={canvas} />
			<div>
				{isBypassStart ? (
					<button className="App-btn" onClick={() => next()}>
						Продовжити
					</button>
				) : (
					<React.Fragment>
						<button className="App-btn" onClick={() => start('BFS')} style={{ marginRight: 20 }}>
							BFS
						</button>
						<button className="App-btn" onClick={() => start('DFS')}>
							DFS
						</button>
					</React.Fragment>
				)}
			</div>
		</div>
	);
}

export default App;
