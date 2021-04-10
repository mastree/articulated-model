const m3 = {
	id: (i: number, j: number) => {
		return i * 3 + j;
	},
  multiply: (a: number[], b: number[]): number[] => {
    const c: number[] = new Array<number>(16);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        c[m3.id(i, j)] = 0;
        for (let k = 0; k < 3; k++) {
          c[m3.id(i, j)] += a[m3.id(i, k)] * b[m3.id(k, j)];
        }
      }
    }
    return c;
  }
};

export default m3;
