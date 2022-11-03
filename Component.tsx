import React, { useState } from 'React';
import { useCallback } from 'react';

const Btn: React.FC = () => {
	const [state, setState] = useState(null);
	const cb = useCallback(() => {
		fetch('http://localhost:3000/stuff')
			.then((res) => res.json())
			.then((data) => setState(data));
	}, []);

	return (
		<div>
			<pre>{JSON.stringify(state, undefined, 4)}</pre>
			<button onClick={cb}>Click me!</button>
		</div>
	);
};

export default Btn;
