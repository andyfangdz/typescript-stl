/// <reference path="API.ts" />

/// <reference path="base/UniqueSet.ts" />
/// <reference path="base/MultiSet.ts" />

///**
// * @hidden
// */
//namespace std.set
//{
//	export type iterator<T> = std.SetIterator<T>;
//	export type reverse_iterator<T> = std.SetReverseIterator<T>;
//}
namespace std.TreeSet
{
	export type Iterator<T> = std.SetIterator<T>;
	export type ReverseIterator<T> = std.SetReverseIterator<T>;
}

namespace std
{
	/**
	 * <p> Tree-structured set, <code>std::set</code> of STL. </p>
	 *
	 * <p> {@link TreeSet}s are containers that store unique elements following a specific order. </p>
	 *
	 * <p> In a {@link TreeSet}, the value of an element also identifies it (the value is itself the 
	 * <i>key</i>, of type <i>T</i>), and each value must be unique. The value of the elements in a 
	 * {@link TreeSet} cannot be modified once in the container (the elements are always const), but they 
	 * can be inserted or removed from the  </p>
	 *
	 * <p> Internally, the elements in a {@link TreeSet} are always sorted following a specific strict weak 
	 * ordering criterion indicated by its internal comparison method (of {@link less}). </p>
	 *
	 * <p> {@link TreeSet} containers are generally slower than {@link HashSet} containers to access 
	 * individual elements by their <i>key</i>, but they allow the direct iteration on subsets based on their 
	 * order. </p>
	 *
	 * <p> {@link TreeSet}s are typically implemented as binary search trees. </p>
	 * 
	 * <p> <a href="http://samchon.github.io/typescript-stl/api/assets/images/design/set_containers.png" target="_blank"> 
	 * <img src="http://samchon.github.io/typescript-stl/api/assets/images/design/set_containers.png" style="max-width: 100%" /> </a></p>
	 * 
	 * <h3> Container properties </h3>
	 * <dl>
	 *	<dt> Associative </dt>
	 *	<dd> 
	 *		Elements in associative containers are referenced by their <i>key</i> and not by their absolute 
	 *		position in the container.
	 *	</dd>
	 * 
	 *	<dt> Ordered </dt>
	 *	<dd> 
	 *		The elements in the container follow a strict order at all times. All inserted elements are 
	 *		given a position in this order. 
	 *	</dd>
	 *
	 *	<dt> Set </dt>
	 *	<dd> The value of an element is also the <i>key</i> used to identify it. </dd>
	 *
	 *	<dt> Unique keys </dt>
	 *	<dd> No two elements in the container can have equivalent <i>keys</i>. </dd>
	 * </dl>
	 *
	 * @param <T> Type of the elements. 
	 *			  Each element in an {@link TreeSet} is also uniquely identified by this value.
	 *
	 * @reference http://www.cplusplus.com/reference/set/set
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class TreeSet<T>
		extends base.UniqueSet<T>
		implements base.ITreeSet<T>
	{
		/**
		 * <i>RB-Tree+</i> object for implemeting the {@link TreeSet}.
		 */
		private tree_: base.AtomicTree<T>;

		/* =========================================================
			CONSTRUCTORS & SEMI-CONSTRUCTORS
				- CONSTRUCTORS
				- ASSIGN & CLEAR
		============================================================
			CONSTURCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor();

		/**
		 * Construct from compare.
		 * 
		 * @param compare A binary predicate determines order of elements.
		 */
		public constructor(compare: (x: T, y: T) => boolean);

		/**
		 * Contruct from elements.
		 *
		 * @param array Elements to be contained.
		 */
		public constructor(array: Array<T>);

		/**
		 * Contruct from elements with compare.
		 *
		 * @param array Elements to be contained.
		 * @param compare A binary predicate determines order of elements.
		 */
		public constructor(array: Array<T>, compare: (x: T, y: T) => boolean);

		/**
		 * Copy Constructor.
		 */
		public constructor(container: base.IContainer<T>);

		/**
		 * Copy Constructor with compare.
		 * 
		 * @param container A container to be copied.
		 * @param compare A binary predicate determines order of elements.
		 */
		public constructor(container: base.IContainer<T>, compare: (x: T, y: T) => boolean);

		/**
		 * Range Constructor.
		 *
		 * @param begin Input interator of the initial position in a sequence.
		 * @param end Input interator of the final position in a sequence.
		 */
		public constructor(begin: Iterator<T>, end: Iterator<T>);

		/**
		 * Range Constructor with compare.
		 * 
		 * @param begin Input interator of the initial position in a sequence.
		 * @param end Input interator of the final position in a sequence.
		 * @param compare A binary predicate determines order of elements.
		 */
		public constructor
			(
				begin: Iterator<T>, end: Iterator<T>,
				compare: (x: T, y: T) => boolean
			);
		
		public constructor(...args: any[])
		{
			super();

			// CONSTRUCT TREE WITH COMPARE
			let compare: (x: T, y: T) => boolean = std.less;
			let fn: Function = null;

			// OVERLOADINGS
			if (args.length == 0) { } // DO NOTHING
			else if (args.length >= 1 && (args[0] instanceof base.Container || args[0] instanceof Vector))
			{
				fn = this.construct_from_container;

				if (args.length == 2)
					compare = args[1];
			}
			else if (args.length >= 1 && args[0] instanceof Array)
			{
				fn = this.construct_from_array;

				if (args.length == 2)
					compare = args[1];
			}
			else if (args.length >= 2 && args[0] instanceof Iterator && args[1] instanceof Iterator)
			{
				fn = this.construct_from_range;

				if (args.length == 3)
					compare = args[2];
			}
			else if (args.length == 1)
				compare = args[0];

			// CONSTRUCT TREE
			this.tree_ = new base.AtomicTree<T>(this, compare);

			// BRANCH - CALL OVERLOADED CONSTRUCTORS
			if (fn != null)
				fn.apply(this, args);
		}

		/* ---------------------------------------------------------
			ASSIGN & CLEAR
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public clear(): void
		{
			super.clear();

			this.tree_.clear();
		}
		
		/* =========================================================
			ACCESSORS
		========================================================= */
		/**
		 * @inheritdoc
		 */
		public find(val: T): SetIterator<T>
		{
			let node = this.tree_.find(val);

			if (node == null || std.equal_to(node.value.value, val) == false)
				return this.end();
			else
				return node.value;
		}

		/**
		 * @inheritdoc
		 */
		public key_comp(): (x: T, y: T) => boolean
		{
			return this.tree_.key_comp();
		}

		/**
		 * @inheritdoc
		 */
		public value_comp(): (x: T, y: T) => boolean
		{
			return this.tree_.key_comp();
		}

		/**
		 * @inheritdoc
		 */
		public lower_bound(val: T): SetIterator<T>
		{
			return this.tree_.lower_bound(val);
		}

		/**
		 * @inheritdoc
		 */
		public upper_bound(val: T): SetIterator<T>
		{
			return this.tree_.lower_bound(val);
		}

		/**
		 * @inheritdoc
		 */
		public equal_range(val: T): Pair<SetIterator<T>, SetIterator<T>>
		{
			return this.tree_.equal_range(val);
		}

		/* =========================================================
			ELEMENTS I/O
				- INSERT
				- POST-PROCESS
		============================================================
			INSERT
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		protected insert_by_val(val: T): any
		{
			let node = this.tree_.find(val);

			// IF EQUALS, THEN RETURN FALSE
			if (node != null && std.equal_to(node.value.value, val) == true)
				return make_pair(node.value, false);
			
			// FIND NODE
			let it: SetIterator<T>;

			if (node == null)
				it = this.end();
			else if (std.less(node.value.value, val) == true)
				it = node.value.next();
			else
				it = node.value;

			/////
			// INSERTS
			/////
			it = new SetIterator<T>(this, this.data_.insert(it.get_list_iterator(), val));
			this.handle_insert(it, it.next()); // POST-PROCESS

			return make_pair(it, true);
		}

		protected insert_by_hint(hint: SetIterator<T>, val: T): SetIterator<T>
		{
			// FIND KEY
			if (this.has(val) == true)
				return this.end();

			// VALIDATE HINT
			let ret: SetIterator<T>;
			let compare = this.tree_.key_comp();

			// hint < current && current < next
			if (compare(hint.value, val) == true
				&& (hint.next().equal_to(this.end()) || compare(val, hint.next().value) == true))
			{
				///////
				// RIGHT HINT
				///////
				// INSERT
				ret = new SetIterator<T>(this, this.data_.insert(hint.get_list_iterator(), val));

				// POST-PROCESS
				this.handle_insert(ret, ret.next());
			}
			else
			{
				///////
				// WRONG HINT
				///////
				// INSERT BY AUTOMATIC NODE FINDING
				ret = this.insert_by_val(val).first;
			}
			return ret;
		}

		/**
		 * @hidden
		 */
		protected insert_by_range<U extends T, InputIterator extends Iterator<U>>
			(first: InputIterator, last: InputIterator): void
		{
			for (; !first.equal_to(last); first = first.next() as InputIterator)
				this.insert_by_val(first.value);
		}

		/* ---------------------------------------------------------
			POST-PROCESS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		protected handle_insert(first: SetIterator<T>, last: SetIterator<T>): void
		{
			this.tree_.insert(first);
		}

		/**
		 * @inheritdoc
		 */
		protected handle_erase(first: SetIterator<T>, last: SetIterator<T>): void
		{
			for (; !first.equal_to(last); first = first.next())
				this.tree_.erase(last);
		}

		/* ===============================================================
			UTILITIES
		=============================================================== */
		/**
		 * @inheritdoc
		 */
		public swap(obj: base.UniqueSet<T>): void
		{
			if (obj instanceof TreeSet)
				this.swap_tree_set(obj);
			else
				super.swap(obj);
		}

		/**
		 * @hidden
		 */
		private swap_tree_set(obj: TreeSet<T>): void
		{
			[this.data_, obj.data_] = [obj.data_, this.data_];
			[this.tree_, obj.tree_] = [obj.tree_, this.tree_];
		}
	}
}

/**
 * @hidden
 */
namespace std.multiset
{
	export type iterator<T> = std.SetIterator<T>;
	export type reverse_iterator<T> = std.SetReverseIterator<T>;
}
namespace std.TreeMultiSet
{
	export type Iterator<T> = std.SetIterator<T>;
	export type ReverseIterator<T> = std.SetReverseIterator<T>;
}

namespace std
{
	/**
	 * <p> Tree-structured multiple-key set. </p>
	 *
	 * <p> {@link TreeMultiSet TreeMultiSets} are containers that store elements following a specific order, and 
	 * where multiple elements can have equivalent values. </p>
	 *
	 * <p> In a {@link TreeMultiSet}, the value of an element also identifies it (the value is itself 
	 * the <i>key</i>, of type <i>T</i>). The value of the elements in a {@link TreeMultiSet} cannot 
	 * be modified once in the container (the elements are always const), but they can be inserted or removed 
	 * from the  </p>
	 *
	 * <p> Internally, the elements in a {@link TreeMultiSet TreeMultiSets} are always sorted following a strict 
	 * weak ordering criterion indicated by its internal comparison method (of {@link IComparable.less less}). </p>
	 *
	 * <p> {@link TreeMultiSet} containers are generally slower than {@link HashMultiSet} containers 
	 * to access individual elements by their <i>key</i>, but they allow the direct iteration on subsets based on 
	 * their order. </p>
	 *
	 * <p> {@link TreeMultiSet TreeMultiSets} are typically implemented as binary search trees. </p>
	 * 
	 * <p> <a href="http://samchon.github.io/typescript-stl/api/assets/images/design/set_containers.png" target="_blank"> 
	 * <img src="http://samchon.github.io/typescript-stl/api/assets/images/design/set_containers.png" style="max-width: 100%" /> </a></p>
	 * 
	 * <h3> Container properties </h3>
	 * <dl>
	 *	<dt> Associative </dt>
	 *	<dd> 
	 *		Elements in associative containers are referenced by their <i>key</i> and not by their absolute 
	 *		position in the container.
	 *	</dd>
	 * 
	 *	<dt> Ordered </dt>
	 *	<dd> 
	 *		The elements in the container follow a strict order at all times. All inserted elements are 
	 *		given a position in this order. 
	 *	</dd>
	 *
	 *	<dt> Set </dt>
	 *	<dd> The value of an element is also the <i>key</i> used to identify it. </dd>
	 *
	 *	<dt> Multiple equivalent keys </dt>
	 *	<dd> Multiple elements in the container can have equivalent <i>keys</i>. </dd>
	 * </dl>
	 * 
	 * @param <T> Type of the elements. Each element in a {@link TreeMultiSet} container is also identified 
	 *			  by this value (each value is itself also the element's <i>key</i>).
	 *
	 * @reference http://www.cplusplus.com/reference/set/multiset
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class TreeMultiSet<T>
		extends base.MultiSet<T>
		implements base.ITreeSet<T>
	{
		/**
		 * <i>RB-Tree+</i> object for implemeting the {@link TreeMultiSet}.
		 */
		private tree_: base.AtomicTree<T>;

		/* =========================================================
			CONSTRUCTORS & SEMI-CONSTRUCTORS
				- CONSTRUCTORS
				- ASSIGN & CLEAR
		============================================================
			CONSTURCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor();

		/**
		 * Construct from compare.
		 * 
		 * @param compare A binary predicate determines order of elements.
		 */
		public constructor(compare: (x: T, y: T) => boolean);

		/**
		 * Contruct from elements.
		 *
		 * @param array Elements to be contained.
		 */
		public constructor(array: Array<T>);

		/**
		 * Contruct from elements with compare.
		 *
		 * @param array Elements to be contained.
		 * @param compare A binary predicate determines order of elements.
		 */
		public constructor(array: Array<T>, compare: (x: T, y: T) => boolean);

		/**
		 * Copy Constructor.
		 */
		public constructor(container: base.Container<T>);

		/**
		 * Copy Constructor with compare.
		 * 
		 * @param container A container to be copied.
		 * @param compare A binary predicate determines order of elements.
		 */
		public constructor(container: base.Container<T>, compare: (x: T, y: T) => boolean);

		/**
		 * Range Constructor.
		 *
		 * @param begin Input interator of the initial position in a sequence.
		 * @param end Input interator of the final position in a sequence.
		 */
		public constructor(begin: Iterator<T>, end: Iterator<T>);

		/**
		 * Construct from range and compare.
		 * 
		 * @param begin Input interator of the initial position in a sequence.
		 * @param end Input interator of the final position in a sequence.
		 * @param compare A binary predicate determines order of elements.
		 */
		public constructor(begin: Iterator<T>, end: Iterator<T>, compare: (x: T, y: T) => boolean);
		
		public constructor(...args: any[])
		{
			super();

			// CONSTRUCT TREE WITH COMPARE
			let compare: (x: T, y: T) => boolean = std.less;
			let fn: Function = null;

			// OVERLOADINGS
			if (args.length == 0) { } // DO NOTHING
			else if (args.length >= 1 && (args[0] instanceof base.Container || args[0] instanceof Vector))
			{
				fn = this.construct_from_container;

				if (args.length == 2)
					compare = args[1];
			}
			else if (args.length >= 1 && args[0] instanceof Array)
			{
				fn = this.construct_from_array;

				if (args.length == 2)
					compare = args[1];
			}
			else if (args.length >= 2 && args[0] instanceof Iterator && args[1] instanceof Iterator)
			{
				fn = this.construct_from_range;

				if (args.length == 3)
					compare = args[2];
			}
			else if (args.length == 1)
				compare = args[0];

			// CONSTRUCT TREE
			this.tree_ = new base.AtomicTree<T>(this, compare);

			// BRANCH - CALL OVERLOADED CONSTRUCTORS
			if (fn != null)
				fn.apply(this, args);
		}

		/* ---------------------------------------------------------
			ASSIGN & CLEAR
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public clear(): void
		{
			super.clear();

			this.tree_.clear();
		}

		/* =========================================================
			ACCESSORS
		========================================================= */
		/**
		 * @inheritdoc
		 */
		public find(val: T): SetIterator<T>
		{
			var node = this.tree_.find(val);

			if (node == null || std.equal_to(val, node.value.value) == false)
				return this.end();
			else
				return node.value;
		}

		/**
		 * @inheritdoc
		 */
		public count(val: T): number
		{
			let it = this.find(val);
			let cnt: number = 0;

			for (; !it.equal_to(this.end()) && std.equal_to(it.value, val); it = it.next())
				cnt++;

			return cnt;
		}

		/**
		 * @inheritdoc
		 */
		public key_comp(): (x: T, y: T) => boolean
		{
			return this.tree_.key_comp();
		}

		/**
		 * @inheritdoc
		 */
		public value_comp(): (x: T, y: T) => boolean
		{
			return this.tree_.key_comp();
		}

		/**
		 * @inheritdoc
		 */
		public lower_bound(val: T): SetIterator<T>
		{
			return this.tree_.lower_bound(val);
		}

		/**
		 * @inheritdoc
		 */
		public upper_bound(val: T): SetIterator<T>
		{
			return this.tree_.upper_bound(val);
		}

		/**
		 * @inheritdoc
		 */
		public equal_range(val: T): Pair<SetIterator<T>, SetIterator<T>>
		{
			return this.tree_.equal_range(val);
		}

		/* =========================================================
			ELEMENTS I/O
				- INSERT
				- POST-PROCESS
		============================================================
			INSERT
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		protected insert_by_val(val: T): any
		{
			var node = this.tree_.find(val);
			var it: SetIterator<T>;

			// FIND NODE
			if (node == null)
			{
				it = this.end();
			}
			else if (std.equal_to(node.value.value, val) == true)
			{
				it = node.value.next();
			}
			else if (std.less(node.value.value, val) == true)
			{
				it = node.value.next();

				while (it.equal_to(this.end()) == false && std.less(it.value, val))
					it = it.next();
			}
			else
			{
				it = node.value;
			}

			/////
			// INSERTS
			/////
			it = new SetIterator<T>(this, this.data_.insert(it.get_list_iterator(), val));
			this.handle_insert(it, it.next()); // POST-PROCESS

			return it;
		}

		/**
		 * @hidden
		 */
		protected insert_by_hint(hint: SetIterator<T>, val: T): SetIterator<T>
		{
			// VALIDATE HINT
			let ret: SetIterator<T>;
			let compare = this.tree_.key_comp();

			// hint <= current && current <= next
			if ((compare(hint.value, val) || std.equal_to(hint.value, val))
				&& (hint.next().equal_to(this.end()) || (compare(val, hint.next().value) || std.equal_to(val, hint.next().value))))
			{
				///////
				// RIGHT HINT
				///////
				// INSERT
				ret = new SetIterator<T>(this, this.data_.insert(hint.get_list_iterator(), val));

				// POST-PROCESS
				this.handle_insert(ret, ret.next());
			}
			else
			{
				///////
				// WRONG HINT
				///////
				// INSERT BY AUTOMATIC NODE FINDING
				ret = this.insert_by_val(val);
			}
			return ret;
		}

		/**
		 * @hidden
		 */
		protected insert_by_range<U extends T, InputIterator extends Iterator<U>>
			(first: InputIterator, last: InputIterator): void
		{
			for (; !first.equal_to(last); first = first.next() as InputIterator)
				this.insert_by_val(first.value);
		}

		/* ---------------------------------------------------------
			POST-PROCESS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		protected handle_insert(first: SetIterator<T>, last: SetIterator<T>): void
		{
			this.tree_.insert(first);
		}

		/**
		 * @inheritdoc
		 */
		protected handle_erase(first: SetIterator<T>, last: SetIterator<T>): void
		{
			for (; !first.equal_to(last); first = first.next())
				this.tree_.erase(last);
		}

		/* ===============================================================
			UTILITIES
		=============================================================== */
		/**
		 * @inheritdoc
		 */
		public swap(obj: base.MultiSet<T>): void
		{
			if (obj instanceof TreeMultiSet)
				this.swap_tree_set(obj);
			else
				super.swap(obj);
		}

		/**
		 * @hidden
		 */
		private swap_tree_set(obj: TreeMultiSet<T>): void
		{
			[this.data_, obj.data_] = [obj.data_, this.data_];
			[this.tree_, obj.tree_] = [obj.tree_, this.tree_];
		}
	}
}