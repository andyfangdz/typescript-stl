/// <reference path="API.ts" />

/// <reference path="Iterator.ts" />

///**
// * @hidden
// */
//namespace std.vector
//{
//	export type iterator<T> = std.VectorIterator<T>;
//	export type reverse_iterator<T> = std.VectorReverseIterator<T>;
//}
namespace std.Vector
{
	export type Iterator<T> = std.VectorIterator<T>;
	export type ReverseIterator<T> = std.VectorReverseIterator<T>;
}

namespace std
{
	/**
	 * <p> Vector, the dynamic array. </p>
	 *
	 * <p> {@link Vector}s are sequence containers representing arrays that can change in size. </p>
	 *
	 * <p> Just like arrays, {@link Vector}s use contiguous storage locations for their elements, which means that 
	 * their elements can also be accessed using offsets on regular pointers to its elements, and just as efficiently 
	 * as in arrays. But unlike arrays, their size can change dynamically, with their storage being handled 
	 * automatically by the  </p>
	 *
	 * <p> Internally, {@link Vector}s use a dynamically allocated array to store their elements. This array may need 
	 * to be reallocated in order to grow in size when new elements are inserted, which implies allocating a new 
	 * array and moving all elements to it. This is a relatively expensive task in terms of processing time, and 
	 * thus, {@link Vector}s do not reallocate each time an element is added to the  </p>
	 *
	 * <p> Instead, {@link Vector} containers may allocate some extra storage to accommodate for possible growth, and 
	 * thus the container may have an actual {@link capacity} greater than the storage strictly needed to contain its 
	 * elements (i.e., its {@link size}). Libraries can implement different strategies for growth to balance between 
	 * memory usage and reallocations, but in any case, reallocations should only happen at logarithmically growing 
	 * intervals of {@link size} so that the insertion of individual elements at the end of the {@link Vector} can be 
	 * provided with amortized constant time complexity (see {@link push_back push_back()}). </p>
	 *
	 * <p> Therefore, compared to arrays, {@link Vector}s consume more memory in exchange for the ability to manage 
	 * storage and grow dynamically in an efficient way. </p>
	 *
	 * <p> Compared to the other dynamic sequence containers ({@link Deque}s, {@link List}s), {@link Vector Vectors} 
	 * are very efficient accessing its elements (just like arrays) and relatively efficient adding or removing 
	 * elements from its end. For operations that involve inserting or removing elements at positions other than the 
	 * end, they perform worse than the others, and have less consistent iterators and references than {@link List}s. 
	 * </p>
	 * 
	 * <p> <a href="http://samchon.github.io/typescript-stl/api/assets/images/design/linear_containers.png" target="_blank"> 
	 * <img src="http://samchon.github.io/typescript-stl/api/assets/images/design/linear_containers.png" style="max-width: 100%" /> 
	 * </a> </p>
	 * 
	 * <h3> Container properties </h3>
	 * <dl>
	 *	<dt> Sequence </dt>
	 *	<dd> 
	 *		Elements in sequence containers are ordered in a strict linear sequence. Individual elements are 
	 *		accessed by their position in this sequence. 
	 *	</dd>
	 *
	 *	<dt> Dynamic array </dt>
	 *	<dd> 
	 *		Allows direct access to any element in the sequence, even through pointer arithmetics, and provides 
	 *		relatively fast addition/removal of elements at the end of the sequence. 
	 *	</dd>
	 * </dl>
	 *
	 * @param <T> Type of the elements.
	 *
	 * @reference http://www.cplusplus.com/reference/vector/vector
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class Vector<T>
		extends Array<T>
		implements base.IArrayContainer<T>
	{
		/* =========================================================
			CONSTRUCTORS & SEMI-CONSTRUCTORS
				- CONSTRUCTORS
				- ASSIGN & CLEAR
		============================================================
			CONSTURCTORS
		--------------------------------------------------------- */
		/**
		 * <p> Default Constructor. </p>
		 *
		 * <p> Constructs an empty container, with no elements. </p>
		 */
		public constructor();

		/**
		 * @inheritdoc
		 */
		public constructor(array: Array<T>);

		/**
		 * <p> Initializer list Constructor. </p>
		 *
		 * <p> Constructs a container with a copy of each of the elements in <i>array</i>, in the same order. </p>
		 *
		 * @param array An array containing elements to be copied and contained.
		 */
		public constructor(n: number);

		/**
		 * <p> Fill Constructor. </p>
		 *
		 * <p> Constructs a container with <i>n</i> elements. Each element is a copy of <i>val</i> (if provided). </p>
		 *
		 * @param n Initial container size (i.e., the number of elements in the container at construction).
		 * @param val Value to fill the container with. Each of the <i>n</i> elements in the container is 
		 *			  initialized to a copy of this value.
		 */
		public constructor(n: number, val: T);

		/**
		 * <p> Copy Constructor. </p>
		 *
		 * <p> Constructs a container with a copy of each of the elements in <i>container</i>, in the same order. </p>
		 *
		 * @param container Another container object of the same type (with the same class template 
		 *					arguments <i>T</i>), whose contents are either copied or acquired.
		 */
		public constructor(container: base.IContainer<T>);

		/**
		 * <p> Range Constructor. </p>
		 *
		 * <p> Constructs a container with as many elements as the range (<i>begin</i>, <i>end<i>), with each 
		 * element emplace-constructed from its corresponding element in that range, in the same order. </p>
		 *
		 * @param begin Input interator of the initial position in a sequence.
		 * @param end Input interator of the final position in a sequence.
		 */
		public constructor(begin: Iterator<T>, end: Iterator<T>);
		
		public constructor(...args: any[])
		{
			super();

			if (args.length == 0)
			{
				// DEFAULT CONSTRUCTOR
			}
			else if (args.length == 1 && args[0] instanceof Array)
			{
				// CONSTRUCT FROM AN ARRAY OF ITEMS
				let array: Array<T> = args[0];
				
				super.push(...array);
			}
			else if (args.length == 1 && typeof args[0] == "number")
			{
				// CONSTRUCT FROM SIZE
				let size: number = args[0];
				
				this.length = size;
			}
			else if (args.length == 2 && typeof args[0] == "number")
			{
				// CONSTRUCT FROM SIZE AND REPEATING VALUE
				let size: number = args[0];
				let val: T = args[1];
				
				this.assign(size, val);
			}
			else if (args.length == 1 && (args[0] instanceof Vector || args[0] instanceof base.Container))
			{
				// COPY CONSTRUCTOR
				let container: base.Container<T> = <base.Container<T>>args[0];
				
				this.assign(container.begin(), container.end());
			}
			else if (args.length == 2 && args[0] instanceof Iterator && args[1] instanceof Iterator)
			{
				// CONSTRUCT FROM INPUT ITERATORS
				let begin: Iterator<T> = args[0];
				let end: Iterator<T> = args[1];

				this.assign(begin, end);
			}
		}

		/* ---------------------------------------------------------
			ASSIGN & CLEAR
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public assign<U extends T, InputIterator extends Iterator<U>>
			(begin: InputIterator, end: InputIterator): void;

		/**
		 * @inheritdoc
		 */
		public assign(n: number, val: T): void;

		public assign<U extends T, InputIterator extends Iterator<U>>
			(first: any, second: any): void
		{
			this.clear();
			this.insert(this.end(), first, second);
		}

		/**
		 * @inheritdoc
		 */
		public reserve(size: number): void
		{
			// NOTHING TO DO ESPECIALLY
		}

		/**
		 * @inheritdoc
		 */
		public clear(): void
		{
			this.erase(this.begin(), this.end());
		}

		/* =========================================================
			ACCESSORS
		========================================================= */
		/**
		 * @inheritdoc
		 */
		public begin(): VectorIterator<T>
		{
			if (this.empty() == true)
				return this.end();
			else
				return new VectorIterator<T>(this, 0);
		}

		/**
		 * @inheritdoc
		 */
		public end(): VectorIterator<T>
		{
			return new VectorIterator<T>(this, -1);
		}

		/**
		 * @inheritdoc
		 */
		public rbegin(): VectorReverseIterator<T>
		{
			return new VectorReverseIterator<T>(this.end());
		}

		/**
		 * @inheritdoc
		 */
		public rend(): VectorReverseIterator<T>
		{
			return new VectorReverseIterator<T>(this.begin());
		}

		/**
		 * @inheritdoc
		 */
		public size(): number
		{
			return this.length;
		}

		/**
		 * @inheritdoc
		 */
		public capacity(): number
		{
			return this.length;
		}

		/**
		 * @inheritdoc
		 */
		public empty(): boolean
		{
			return this.length == 0;
		}

		/**
		 * @inheritdoc
		 */
		public at(index: number): T
		{
			if (index < this.size())
				return this[index];
			else
				throw new std.OutOfRange("Target index is greater than Vector's size.");
		}

		/**
		 * @inheritdoc
		 */
		public set(index: number, val: T): T
		{
			if (index > this.length)
				throw new std.OutOfRange("Target index is greater than Vector's size.");

			let prev: T = this[index];
			this[index] = val;

			return prev;
		}

		/**
		 * @inheritdoc
		 */
		public front(): T
		{
			return this.at(0);
		}

		/**
		 * @inheritdoc
		 */
		public back(): T
		{
			return this.at(this.length - 1);
		}

		/* =========================================================
			ELEMENTS I/O
				- INSERT
				- ERASE
		============================================================
			INSERT
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public push_back(val: T): void
		{
			super.push(val);
		}

		/**
		 * <p> Insert an element. </p>
		 *
		 * <p> The {@link Vector} is extended by inserting new element before the element at the specified 
		 * <i>position</i>, effectively increasing the container size by one. </p>
		 *
		 * <p> This causes an automatic reallocation of the allocated storage space if -and only if- the new 
		 * {@link size} surpasses the current {@link capacity}. </p>
		 *
		 * <p> Because {@link Vector}s use an <code>Array</code> as their underlying storage, inserting element in 
		 * positions other than the {@link end end()} causes the container to relocate all the elements that were 
		 * after <i>position</i> to its new position. This is generally an inefficient operation compared to the one 
		 * performed for the same operation by other kinds of sequence containers (such as {@link List}). </p>
		 *
		 * @param position Position in the {@link Vector} where the new element is inserted.
		 *				   {@link iterator} is a member type, defined as a 
		 *				   {@link VectorIterator random access iterator} type that points to elements.
		 * @param val Value to be copied to the inserted element.
		 *
		 * @return An iterator that points to the newly inserted element.
		 */
		public insert(position: VectorIterator<T>, val: T): VectorIterator<T>;

		/**
		 * <p> Insert elements by repeated filling. </p>
		 *
		 * <p> The {@link Vector} is extended by inserting new elements before the element at the specified 
		 * <i>position</i>, effectively increasing the container size by the number of elements inserted. </p>
		 * 
		 * <p> This causes an automatic reallocation of the allocated storage space if -and only if- the new 
		 * {@link size} surpasses the current {@link capacity}. </p>
		 * 
		 * <p> Because {@link Vector}s use an <code>Array</code> as their underlying storage, inserting elements in 
		 * positions other than the {@link end end()} causes the container to relocate all the elements that were 
		 * after <i>position</i> to their new positions. This is generally an inefficient operation compared to the 
		 * one performed for the same operation by other kinds of sequence containers (such as {@link List}).
		 * 
		 * @param position Position in the {@link Vector} where the new elements are inserted.
		 *				   {@link iterator} is a member type, defined as a 
		 *				   {@link VectorIterator random access iterator} type that points to elements.
		 * @param n Number of elements to insert. Each element is initialized to a copy of <i>val</i>.
		 * @param val Value to be copied (or moved) to the inserted elements.
		 *
		 * @return An iterator that points to the first of the newly inserted elements.
		 */
		public insert(position: VectorIterator<T>, n: number, val: T): VectorIterator<T>;

		/**
		 * <p> Insert elements by range iterators. </p>
		 *
		 * <p> The {@link Vector} is extended by inserting new elements before the element at the specified 
		 * <i>position</i>, effectively increasing the container size by the number of elements inserted by range 
		 * iterators. </p>
		 * 
		 * <p> This causes an automatic reallocation of the allocated storage space if -and only if- the new 
		 * {@link size} surpasses the current {@link capacity}. </p>
		 * 
		 * <p> Because {@link Vector}s use an <code>Array</code> as their underlying storage, inserting elements in 
		 * positions other than the {@link end end()} causes the container to relocate all the elements that were 
		 * after <i>position</i> to their new positions. This is generally an inefficient operation compared to the 
		 * one performed for the same operation by other kinds of sequence containers (such as {@link List}).
		 *
		 * @param position Position in the {@link Vector} where the new elements are inserted.
		 *				   {@link iterator} is a member type, defined as a 
		 *				   {@link VectorIterator random access iterator} type that points to elements.
		 * @param begin Input interator of the initial position in a sequence.
		 * @param end Input interator of the final position in a sequence.
		 *
		 * @return An iterator that points to the first of the newly inserted elements.
		 */
		public insert<U extends T, InputIterator extends Iterator<U>>
			(position: VectorIterator<T>, begin: InputIterator, end: InputIterator): VectorIterator<T>;

		/**
		 * <p> Insert an element. </p>
		 *
		 * <p> The {@link Vector} is extended by inserting new element before the element at the specified 
		 * <i>position</i>, effectively increasing the container size by one. </p>
		 *
		 * <p> This causes an automatic reallocation of the allocated storage space if -and only if- the new 
		 * {@link size} surpasses the current {@link capacity}. </p>
		 *
		 * <p> Because {@link Vector}s use an <code>Array</code> as their underlying storage, inserting element in 
		 * positions other than the {@link end end()} causes the container to relocate all the elements that were 
		 * after <i>position</i> to its new position. This is generally an inefficient operation compared to the one 
		 * performed for the same operation by other kinds of sequence containers (such as {@link List}). </p>
		 *
		 * @param position Position in the {@link Vector} where the new element is inserted.
		 *				   {@link iterator} is a member type, defined as a 
		 *				   {@link VectorIterator random access iterator} type that points to elements.
		 * @param val Value to be copied to the inserted element.
		 *
		 * @return An iterator that points to the newly inserted element.
		 */
		public insert(position: VectorReverseIterator<T>, val: T): VectorReverseIterator<T>;

		/**
		 * <p> Insert elements by repeated filling. </p>
		 *
		 * <p> The {@link Vector} is extended by inserting new elements before the element at the specified 
		 * <i>position</i>, effectively increasing the container size by the number of elements inserted. </p>
		 * 
		 * <p> This causes an automatic reallocation of the allocated storage space if -and only if- the new 
		 * {@link size} surpasses the current {@link capacity}. </p>
		 * 
		 * <p> Because {@link Vector}s use an <code>Array</code> as their underlying storage, inserting elements in 
		 * positions other than the {@link end end()} causes the container to relocate all the elements that were 
		 * after <i>position</i> to their new positions. This is generally an inefficient operation compared to the 
		 * one performed for the same operation by other kinds of sequence containers (such as {@link List}).
		 * 
		 * @param position Position in the {@link Vector} where the new elements are inserted.
		 *				   {@link iterator} is a member type, defined as a 
		 *				   {@link VectorIterator random access iterator} type that points to elements.
		 * @param n Number of elements to insert. Each element is initialized to a copy of <i>val</i>.
		 * @param val Value to be copied (or moved) to the inserted elements.
		 *
		 * @return An iterator that points to the first of the newly inserted elements.
		 */
		public insert(position: VectorReverseIterator<T>, n: number, val: T): VectorReverseIterator<T>;

		/**
		 * <p> Insert elements by range iterators. </p>
		 *
		 * <p> The {@link Vector} is extended by inserting new elements before the element at the specified 
		 * <i>position</i>, effectively increasing the container size by the number of elements inserted by range 
		 * iterators. </p>
		 * 
		 * <p> This causes an automatic reallocation of the allocated storage space if -and only if- the new 
		 * {@link size} surpasses the current {@link capacity}. </p>
		 * 
		 * <p> Because {@link Vector}s use an <code>Array</code> as their underlying storage, inserting elements in 
		 * positions other than the {@link end end()} causes the container to relocate all the elements that were 
		 * after <i>position</i> to their new positions. This is generally an inefficient operation compared to the 
		 * one performed for the same operation by other kinds of sequence containers (such as {@link List}).
		 *
		 * @param position Position in the {@link Vector} where the new elements are inserted.
		 *				   {@link iterator} is a member type, defined as a 
		 *				   {@link VectorIterator random access iterator} type that points to elements.
		 * @param begin Input interator of the initial position in a sequence.
		 * @param end Input interator of the final position in a sequence.
		 *
		 * @return An iterator that points to the first of the newly inserted elements.
		 */
		public insert<U extends T, InputIterator extends Iterator<U>>
			(position: VectorReverseIterator<T>, begin: InputIterator, end: InputIterator): VectorReverseIterator<T>;

		public insert<U extends T>(...args: any[]): VectorIterator<T> | VectorReverseIterator<T>
		{
			// REVERSE_ITERATOR TO ITERATOR
			let ret: VectorIterator<T>;
			let is_reverse_iterator: boolean = false;

			if (args[0] instanceof VectorReverseIterator)
			{
				is_reverse_iterator = true;
				args[0] = (args[0] as VectorReverseIterator<T>).base().prev();
			}

			// BRANCHES
			if (args.length == 2)
				ret = this.insert_by_val(args[0], args[1]);
			else if (args.length == 3 && typeof args[1] == "number")
				ret = this.insert_by_repeating_val(args[0], args[1], args[2]);
			else
				ret = this.insert_by_range(args[0], args[1], args[2]);

			// RETURNS
			if (is_reverse_iterator == true)
				return new VectorReverseIterator<T>(ret.next());
			else
				return ret;
		}

		/**
		 * @hidden
		 */
		private insert_by_val(position: VectorIterator<T>, val: T): VectorIterator<T>
		{
			return this.insert_by_repeating_val(position, 1, val);
		}

		/**
		 * @hidden
		 */
		protected insert_by_repeating_val(position: VectorIterator<T>, n: number, val: T): VectorIterator<T>
		{
			if (position.index == -1)
			{ 
				// WHEN INSERT TO THE LAST
				for (let i = 0; i < n; i++)
					super.push(val);

				return this.begin();
			}
			else
			{
				///////
				// INSERT TO THE MIDDLE POSITION
				///////
				// CUT RIGHT SIDE
				let spliced_array = super.splice(position.index);
				let insert_size: number = 0;

				// INSERT ELEMENTS
				for (let i = 0; i < n; i++)
				{
					super.push(val);
					insert_size++;
				}
				super.push(...spliced_array); // CONCAT THE SPLICEDS

				return position;
			}
		}

		/**
		 * @hidden
		 */
		protected insert_by_range<InputIterator extends Iterator<T>>
			(position: VectorIterator<T>, first: InputIterator, last: InputIterator): VectorIterator<T>
		{
			if (position.index == -1)
			{ 
				// WHEN INSERT TO THE LAST
				for (; !first.equal_to(last); first = first.next() as InputIterator)
					super.push(first.value);
				
				return this.begin();
			}
			else
			{ 
				///////
				// INSERT TO THE MIDDLE POSITION
				///////
				// CUT RIGHT SIDE
				let spliced_array = super.splice(position.index);
				let insert_size: number = 0;

				// INSERT ELEMENTS
				for (; !first.equal_to(last); first = first.next() as InputIterator)
				{
					super.push(first.value);
					insert_size++;
				}
				super.push(...spliced_array); // CONCAT THE SPLICEDS
				
				return position;
			}
		}
		
		/* ---------------------------------------------------------
			ERASE
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public pop_back(): void
		{
			this.erase(this.end().prev());
		}

		/**
		 * <p> Erase element. </p>
		 *
		 * <p> Removes from the {@link Vector} either a single element; <i>position</i>. </p>
		 *
		 * <p> This effectively reduces the container size by the number of element removed. </p>
		 *
		 * <p> Because {@link Vector}s use an <code>Array</code> as their underlying storage, erasing an element in 
		 * position other than the {@link end end()} causes the container to relocate all the elements after the 
		 * segment erased to their new positions. This is generally an inefficient operation compared to the one 
		 * performed for the same operation by other kinds of sequence containers (such as {@link List}). </p>
		 * 
		 * @param position Iterator pointing to a single element to be removed from the {@link Vector}.
		 *
		 * @return An iterator pointing to the new location of the element that followed the last element erased by 
		 *		   the function call. This is the {@link end end()} if the operation erased the last element in the 
		 *		   sequence.
		 */
		public erase(position: VectorIterator<T>): VectorIterator<T>;
		
		/**
		 * <p> Erase element. </p>
		 *
		 * <p> Removes from the <ode>Vector</code> either a single element; <i>position</i>. </p>
		 *
		 * <p> This effectively reduces the container size by the number of elements removed. </p>
		 *
		 * <p> Because {@link Vector}s use an <code>Array</code> as their underlying storage, erasing elements in 
		 * position other than the {@link end end()} causes the container to relocate all the elements after the 
		 * segment erased to their new positions. This is generally an inefficient operation compared to the one 
		 * performed for the same operation by other kinds of sequence containers (such as {@link List}). </p>
		 * 
		 * @param begin An iterator specifying a range of beginning to erase.
		 * @param end An iterator specifying a range of end to erase.
		 *
		 * @return An iterator pointing to the new location of the element that followed the last element erased by 
		 *		   the function call. This is the {@link rend rend()} if the operation erased the last element in the 
		 *		   sequence.
		 */
		public erase(first: VectorIterator<T>, last: VectorIterator<T>): VectorIterator<T>;

		/**
		 * <p> Erase element. </p>
		 *
		 * <p> Removes from the {@link Vector} either a single element; <i>position</i>. </p>
		 *
		 * <p> This effectively reduces the container size by the number of element removed. </p>
		 *
		 * <p> Because {@link Vector}s use an <code>Array</code> as their underlying storage, erasing an element in 
		 * position other than the {@link end end()} causes the container to relocate all the elements after the 
		 * segment erased to their new positions. This is generally an inefficient operation compared to the one 
		 * performed for the same operation by other kinds of sequence containers (such as {@link List}). </p>
		 * 
		 * @param position Iterator pointing to a single element to be removed from the {@link Vector}.
		 *
		 * @return An iterator pointing to the new location of the element that followed the last element erased by 
		 *		   the function call. This is the {@link rend rend()} if the operation erased the last element in the 
		 *		   sequence.
		 */
		public erase(position: VectorReverseIterator<T>): VectorReverseIterator<T>;

		/**
		 * <p> Erase element. </p>
		 *
		 * <p> Removes from the <ode>Vector</code> either a single element; <i>position</i>. </p>
		 *
		 * <p> This effectively reduces the container size by the number of elements removed. </p>
		 *
		 * <p> Because {@link Vector}s use an <code>Array</code> as their underlying storage, erasing elements in 
		 * position other than the {@link end end()} causes the container to relocate all the elements after the 
		 * segment erased to their new positions. This is generally an inefficient operation compared to the one 
		 * performed for the same operation by other kinds of sequence containers (such as {@link List}). </p>
		 * 
		 * @param begin An iterator specifying a range of beginning to erase.
		 * @param end An iterator specifying a range of end to erase.
		 *
		 * @return An iterator pointing to the new location of the element that followed the last element erased by 
		 *		   the function call. This is the {@link end end()} if the operation erased the last element in the 
		 *		   sequence.
		 */
		public erase(first: VectorReverseIterator<T>, last: VectorReverseIterator<T>): VectorReverseIterator<T>;

		public erase(first: any, last: any = first.next()): any
		{
			let ret: VectorIterator<T>;
			let is_reverse_iterator: boolean = false;

			// REVERSE_ITERATOR TO ITERATOR
			if (first instanceof VectorReverseIterator)
			{
				is_reverse_iterator = true;

				let first_it = (last as VectorReverseIterator<T>).base();
				let last_it = (first as VectorReverseIterator<T>).base();

				first = first_it;
				last = last_it;
			}

			// ERASE ELEMENTS
			ret = this.erase_by_range(first, last);

			// RETURN BRANCHES
			if (is_reverse_iterator == true)
				return new VectorReverseIterator<T>(ret.next());
			else
				return ret;	
		}

		/**
		 * @hiddde
		 */
		protected erase_by_range(first: VectorIterator<T>, last: VectorIterator<T>): VectorIterator<T>
		{
			if (first.index == -1)
				return first;

			// ERASE ELEMENTS
			if (last.index == -1)
			{
				super.splice(first.index);
				return this.end();
			}
			else
				super.splice(first.index, last.index - first.index);

			return first;
		}

		/* ===============================================================
			UTILITIES
		=============================================================== */
		/**
		 * @inheritdoc
		 */
		public swap(obj: base.IContainer<T>): void
		{
			let supplement: Vector<T> = new Vector<T>(this.begin(), this.end());

			this.assign(obj.begin(), obj.end());
			obj.assign(supplement.begin(), supplement.end());
		}
	}
}

namespace std
{
	/**
	 * <p> An iterator of Vector. </p>
	 * 
	 * <p> <a href="http://samchon.github.io/typescript-stl/api/assets/images/design/linear_containers.png" target="_blank"> 
	 * <img src="http://samchon.github.io/typescript-stl/api/assets/images/design/linear_containers.png" style="max-width: 100%" /> 
	 * </p>
	 *
	 * @param <T> Type of the elements.
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class VectorIterator<T>
		extends Iterator<T>
		implements base.IArrayIterator<T>
	{
		/**
		 * Sequence number of iterator in the source {@link Vector}.
		 */
		private index_: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * <p> Construct from the source {@link Vector container}. </p>
		 *
		 * <h4> Note </h4>
		 * <p> Do not create the iterator directly, by yourself. </p>
		 * <p> Use {@link Vector.begin begin()}, {@link Vector.end end()} in {@link Vector container} instead. </p> 
		 *
		 * @param source The source {@link Vector container} to reference.
		 * @param index Sequence number of the element in the source {@link Vector}.
		 */
		public constructor(source: Vector<T>, index: number)
		{
			super(source);

			this.index_ = index;
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		private get vector(): Vector<T>
		{
			return this.source_ as Vector<T>;
		}

		/**
		 * @inheritdoc
		 */
		public get value(): T
		{
			return this.vector.at(this.index_);
		}

		/**
		 * Set value.
		 */
		public set value(val: T)
		{
			this.vector.set(this.index_, val);
		}

		/**
		 * Get index.
		 */
		public get index(): number
		{
			return this.index_;
		}

		/* ---------------------------------------------------------
			MOVERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public prev(): VectorIterator<T>
		{
			if (this.index_ == -1)
				return new VectorIterator(this.vector, this.vector.size() - 1);
			else if (this.index_ - 1 < 0)
				return this.vector.end();
			else
				return new VectorIterator<T>(this.vector, this.index_ - 1);
		}

		/**
		 * @inheritdoc
		 */
		public next(): VectorIterator<T>
		{
			if (this.index_ >= this.source_.size() - 1)
				return this.vector.end();
			else
				return new VectorIterator<T>(this.vector, this.index_ + 1);
		}

		/**
		 * @inheritdoc
		 */
		public advance(n: number): VectorIterator<T>
		{
			let newIndex: number = this.index_ + n;

			if (newIndex < 0 || newIndex >= this.vector.size())
				return this.vector.end();
			else
				return new VectorIterator<T>(this.vector, newIndex);
		}

		/* ---------------------------------------------------------
			COMPARES
		--------------------------------------------------------- */
		/**
		 * <p> Whether an iterator is equal with the iterator. </p>
		 * 
		 * <p> Compare two iterators and returns whether they are equal or not. </p>
		 * 
		 * <h4> Note </h4> 
		 * <p> Iterator's equal_to() only compare souce container and index number. </p>
		 *
		 * <p> Although elements in a pair, key and value are equal_to, if the source map or
		 * index number is different, then the {@link equal_to equal_to()} will return false. If you want to
		 * compare the elements of a pair, compare them directly by yourself. </p>
		 *
		 * @param obj An iterator to compare
		 * @return Indicates whether equal or not.
		 */
		public equal_to<U extends T>(obj: VectorIterator<U>): boolean
		{
			return super.equal_to(obj) && this.index_ == obj.index_;
		}

		/**
		 * @inheritdoc
		 */
		public swap(obj: VectorIterator<T>): void
		{
			[this.value, obj.value] = [obj.value, this.value];
		}
	}
}

namespace std
{
	/**
	 * <p> A reverse-iterator of Vector. </p>
	 * 
	 * <p> <a href="http://samchon.github.io/typescript-stl/api/assets/images/design/linear_containers.png" target="_blank"> 
	 * <img src="http://samchon.github.io/typescript-stl/api/assets/images/design/linear_containers.png" style="max-width: 100%" /> 
	 * </p>
	 *
	 * @param <T> Type of the elements.
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class VectorReverseIterator<T>
		extends ReverseIterator<T, VectorIterator<T>, VectorReverseIterator<T>>
		implements base.IArrayIterator<T>
	{
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(base: VectorIterator<T>)
		{
			super(base);
		}

		/**
		 * @inheritdoc
		 */
		protected create_neighbor(): VectorReverseIterator<T>
		{
			return new VectorReverseIterator<T>(null);
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Set value.
		 */
		public set value(val: T)
		{
			this.base_.value = val;
		}

		/**
		 * Get index.
		 */
		public get index(): number
		{
			return this.base_.index;
		}
	}
}