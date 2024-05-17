const mulberry32 = a => {
	return () => {
		let t = (a += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
};

const randomSeed = seed => {
	const r = mulberry32(seed);
	return (min, max) => r() * (max - min) + min;
};

export default randomSeed;
