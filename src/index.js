import _ from "lodash";

class Item {
	/**
	 * @param  {Number}  position [description]
	 * @param  {TotalSum}	 totalSum
	 * @param  {Number}  value    [description]
	 */
	constructor(position, totalSum, value = 0) {
		this.position = position;
		this.value = value;
		this.totalSum = totalSum;
	}

	toString() {
		let number = this.value.toString();

		if(this.value === 0) {
			number = this.totalSum.toString();
		}

		if(number.length === 1) {
			number = number.concat(' ');
		}

		return number;
	}
}

class TotalSum {

	/**
	 * @param  {Number} totalSum
	 * @return {[type]}          [description]
	 */
	constructor(totalSum) {
		this.orginalSum = totalSum;
		this.totalSum = totalSum;
	}

	canSubtract(num) {
		const sub = this.orginalSum - num;

		if(sub <= 0) {
			return false;
		}

		return true;
	}

	toString() {
		return this.totalSum.toString();
	}
}

class Group {
	/**
	 * @param  {number} totalSum [description]
	 * @param  {number[]} positions [description]
	 */
	constructor(totalSum, positions) {
		this.totalSum = new TotalSum(totalSum);
		this.positions = positions;
		this._items = positions.map(p => new Item(p, this.totalSum));
	}

	/**
	 * @return {Item[]} [description]
	 */
	get items() {
		return this._items;
	}
}

/**
 * @public {Group[]} groups
 */
class Board {

	/**
	 * @param  {Group[]} groups
	 */
	constructor(groups) {
		this.groups = groups;
	}

	/**
	 * @return {Item[]} Sorted items from left to right
	 */
	get items() {
		return this.groups
			.map(g => g.items)
			.flat()
			.sort((a, b) => {
				if(a.position > b.position) {
					return 1;
				}

				if(a.position < b.position) {
					return -1;
				}

				return 0;
			});
	}

	/**
	 * @param  {Item[][]} board [description]
	 * @return {[type]}       [description]
	 */
	solve(board) {
		const empty = this.findEmpty(board);

		if(!empty) {
			return true;
		}

		const [row, col] = empty;

		for (const i of _.range(1, 10)) {
			if(this.valid(board, i, empty)) {
				const item = board[row][col];
				item.value = i;
				item.totalSum.totalSum = item.totalSum.totalSum - i;

				if(this.solve(board)) {
					return true;
				}

				item.totalSum.totalSum = item.totalSum.orginalSum;
				item.value = 0;
			} 
		}

		return false;
	}

	/**
	 * @param  {Item[][]} board [description]
	 * @param  {Number} num
	 * @param  {[Number, Number]} pos
	 * @return {Boolean}      [description]
	 */
	valid(board, num, pos) {
		const [row, col] = pos;

		//Check row
		for(const i of _.range(board[0].length)) {
			if(board[row][i].value === num && col !== i) {
				return false;
			}
		}

		//Check column
		for(const i of _.range(board.length -1)) {
			if(board[i][col].value === num && row !== i) {
				return false;
			}
		}
		
		//Check box
		let box_x = Math.floor(col / 3);
		let box_y = Math.floor(row / 3);

		for (const i of _.range(box_y*3, box_y*3 + 3)) {
			for(const j of _.range(box_x * 3, box_x*3 + 3)) {
				if(board[i][j]?.value === num && row !== i && col !== j) {
					return false;
				}
			}
		}
		
		//Check totalSum
		let item = board[row][col];

		if(item.totalSum <= 0) {
			return false;
		}

		return true;
	}

	/**
	 * [findEmpty description]
	 * @param  {Item[][]} board
	 * @return {[Number, Number]} first row second column
	 */
	findEmpty(board) {
		for(const [row, items] of board.entries()) {
			for(const [col, item] of items.entries()) {
				if(item.value === 0)
				{
					return [row, col];
				}
			}
		}

		return undefined;
	}

	findGroupByItem(item) {
		return this.groups.find(g => g.items.includes(item))
	}

	draw() {
		this.items
		.reduce((resultArray, item, index) => { 
		  const chunkIndex = Math.floor(index/9);

		  if(!resultArray[chunkIndex]) {
		    resultArray[chunkIndex] = [] // start a new chunk
		  }

		  resultArray[chunkIndex].push(item)

		  return resultArray
		}, []).forEach((row, i) => {
			let str = "";

			row.forEach((item, index) => {
				str += ` ${item} `;

				if(index % 3 === 2 && index % 9 !== 8) {
					str += " | ";
				}

				if(index % 9 === 8) {
					console.log(str);	
					str = "";
				}
			});

			if(i % 3 === 2 && i % 8 !== 0 ) {
				console.log('-----------------------------------------');
			}
		})
	}
}

//total 81 items because the board is 9 by 9 and multiply them is 81.
const board = new Board([
	//Row 1
	new Group(3, [0, 1]),
	new Group(15, [2, 3, 4]),
	new Group(22, [5, 13, 14, 22]),
	new Group(4, [6, 15]),
	new Group(16, [7, 16]),
	new Group(15, [8,17,26,35]),

	//Row 2
	new Group(25, [9, 10, 18, 19]),
	new Group(17, [11, 12]),

	//Row 3
	new Group(9, [20, 21, 30]),
	new Group(8, [23,32,41]),
	new Group(20, [24,25,33]),

	//Row 4
	new Group(6, [27,36]),
	new Group(14, [28,29]),
	new Group(17, [31,40,49]),
	new Group(17, [34,43,42]),

	//Row 5
	new Group(13, [37,38,46]),
	new Group(20, [39,48,57]),
	new Group(12, [44,53]),

	//Row 6
	new Group(27, [45,54,63,72]),
	new Group(6, [47,55,56]),
	new Group(20, [50,59,60]),
	new Group(6, [51, 52]),

	//Row 7
	new Group(10, [58, 67,66,75]),
	new Group(14, [61, 62, 70, 71]),

	//Row 8
	new Group(8, [64, 73]),
	new Group(16, [65, 74]),
	new Group(15, [68, 69]),

	//Row 9
	new Group(13, [76, 77, 78]),
	new Group(17, [79, 80])
]);

console.log('------------------sudoku-----------------');
console.log();
board.draw();
console.log();
board.solve(_.chunk(board.items, 9));
console.log();
console.log('--------------solving sudoku-------------');
console.log();
board.draw();
console.log();