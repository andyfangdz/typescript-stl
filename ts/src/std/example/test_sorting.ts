﻿/// <reference path="../API.ts" />

namespace std.example
{
	export function sorting(): void
	{
		let cubes: std.Deque<Cube> = new std.Deque<Cube>();
		for (let i: number = 0; i < 0; i++)
			cubes.push_back(new Cube());

		///////////////////////////////
		// SORT BY Cube.less()
		///////////////////////////////
		std.sort(cubes.begin(), cubes.end());

		for (let it = cubes.begin(); !it.equal_to(cubes.end()); it = it.next())
			it.value.debug_size();

		console.log("------------------------------");

		///////////////////////////////
		// SORT BY inline function
		///////////////////////////////
		std.sort(cubes.begin(), cubes.end(),
			function (left: Cube, right: Cube): boolean
			{
				if (left.x != right.x) return left.x < right.x;
				else if (left.y != right.y) return left.y < right.y;
				else return left.z < right.z;
			}
		);

		for (let it = cubes.begin(); !it.equal_to(cubes.end()); it = it.next())
			it.value.debug_position();
	}

	class Cube
	{
		public width: number;
		public height: number;
		public length: number;
		public x: number;
		public y: number;
		public z: number;

		public constructor()
		{
			this.width = Math.random() * 10;
			this.height = Math.random() * 10;
			this.length = Math.random() * 10;
			this.x = Math.random() * 100 - 50;
			this.y = Math.random() * 100 - 50;
			this.z = Math.random() * 100 - 50;
		}
		public get volume(): number
		{
			return this.width * this.height * this.length;
		}

		public less(obj: Cube): boolean
		{
			return this.volume < obj.volume;
		}

		public debug_size(): void
		{
			console.log(this.width, this.height, this.length + " => " + this.volume);
		}
		public debug_position(): void
		{
			console.log(this.x, this.y, this.z);
		}
	}
}