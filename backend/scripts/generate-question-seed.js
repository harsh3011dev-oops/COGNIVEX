/**
 * Generates backend/src/config/question_bank_seed.sql
 * Run: node scripts/generate-question-seed.js
 */

const fs = require('fs');
const path = require('path');

const SUBJECTS = [
  {
    code: 'DSA',
    name: 'DSA',
    topics: ['Arrays & Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming'],
    questions: [
      ['What is the time complexity of binary search on a sorted array of n elements?', ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], 1, 'Binary search halves the search space each step, yielding O(log n) time.', 'easy'],
      ['Which data structure uses LIFO (Last In First Out) ordering?', ['Queue', 'Stack', 'Deque', 'Priority Queue'], 1, 'A stack removes the most recently pushed element first, following LIFO discipline.', 'easy'],
      ['What is the worst-case time complexity of Quick Sort?', ['O(n log n)', 'O(n^2)', 'O(n)', 'O(log n)'], 1, 'Quick Sort degrades to O(n^2) when pivots are consistently poor, e.g., sorted input with first-element pivot.', 'medium'],
      ['In a singly linked list, what is the time complexity to insert at the head?', ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], 2, 'Head insertion only updates pointers without traversing the list.', 'easy'],
      ['Which traversal of a binary tree visits nodes in sorted order for a BST?', ['Pre-order', 'Post-order', 'In-order', 'Level-order'], 2, 'In-order traversal of a BST visits left subtree, node, then right subtree, producing sorted output.', 'easy'],
      ['What is the space complexity of DFS on a graph using recursion (adjacency list)?', ['O(1)', 'O(V)', 'O(E)', 'O(V + E)'], 1, 'Recursion stack depth is bounded by the number of vertices V in the worst case.', 'medium'],
      ['Which algorithm finds the shortest path in a weighted graph with non-negative edges?', ['Bellman-Ford', 'Dijkstra', 'Floyd-Warshall', 'Kruskal'], 1, 'Dijkstra greedily relaxes edges and works correctly when all edge weights are non-negative.', 'medium'],
      ['What is the time complexity of merge sort?', ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], 1, 'Merge sort divides the array in half recursively and merges in linear time per level.', 'easy'],
      ['Which hash collision resolution technique uses a linked list at each bucket?', ['Open addressing', 'Linear probing', 'Chaining', 'Double hashing'], 2, 'Separate chaining stores colliding keys in linked lists attached to hash table buckets.', 'easy'],
      ['What is the maximum number of nodes at level k (root at level 0) in a binary tree?', ['2^k', '2^(k-1)', 'k^2', '2k'], 0, 'Each level k can have at most 2^k nodes in a full binary tree.', 'medium'],
      ['Which sorting algorithm is stable and O(n log n) in the worst case?', ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'], 2, 'Merge sort preserves relative order of equal elements and always runs in O(n log n).', 'medium'],
      ['What does the "master theorem" help analyze?', ['Graph traversals', 'Divide-and-conquer recurrences', 'Hash table load factor', 'NP-completeness'], 1, 'The master theorem gives asymptotic bounds for recurrences of the form T(n) = aT(n/b) + f(n).', 'hard'],
      ['In dynamic programming, what property must a problem exhibit?', ['Greedy choice', 'Optimal substructure and overlapping subproblems', 'Linear structure only', 'No recursion'], 1, 'DP applies when optimal solutions contain optimal subsolutions and subproblems repeat.', 'medium'],
      ['What is the time complexity to search in a hash table (average case)?', ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], 2, 'With a good hash function and low load factor, lookup is expected O(1).', 'easy'],
      ['Which tree height-balancing technique uses rotations after insert/delete?', ['B-tree', 'AVL tree', 'Trie', 'Segment tree'], 1, 'AVL trees maintain balance factor within [-1,1] using single and double rotations.', 'medium'],
      ['What is the auxiliary space of iterative BFS on a graph?', ['O(1)', 'O(V)', 'O(E)', 'O(V + E)'], 1, 'BFS queue can hold up to O(V) vertices in the worst case.', 'medium'],
      ['Which problem is solved by the Floyd-Warshall algorithm?', ['Minimum spanning tree', 'All-pairs shortest paths', 'Topological sort', 'Maximum flow'], 1, 'Floyd-Warshall computes shortest paths between every pair of vertices in O(V^3).', 'hard'],
      ['What is the time complexity to build a heap from n elements using heapify?', ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], 1, 'Bottom-up heapify runs in O(n), faster than inserting n elements one by one.', 'hard'],
      ['Which data structure supports O(1) amortized push/pop at both ends?', ['Stack', 'Queue', 'Deque', 'Priority queue'], 2, 'A deque (double-ended queue) allows constant-time operations at front and rear.', 'easy'],
      ['What is the recurrence for naive recursive Fibonacci without memoization?', ['O(n)', 'O(log n)', 'O(2^n)', 'O(n log n)'], 2, 'Each call branches into two subcalls, leading to exponential time without memoization.', 'medium'],
      ['In a min-heap, where is the minimum element located?', ['Any leaf', 'Root', 'Last level only', 'Middle node'], 1, 'The heap property ensures the smallest key is always at the root of a min-heap.', 'easy'],
      ['Which graph representation is more space-efficient for sparse graphs?', ['Adjacency matrix', 'Adjacency list', 'Incidence matrix', 'Edge list only for dense graphs'], 1, 'Adjacency lists store O(V + E) space versus O(V^2) for a matrix.', 'easy'],
      ['What is the time complexity of inserting into a balanced BST of n nodes?', ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], 1, 'Balanced BST height is O(log n), so insert traverses at most that many levels.', 'easy'],
      ['Which algorithm detects a cycle in a directed graph?', ['Prim', 'Kahn topological sort / DFS coloring', 'Kruskal', 'Bellman-Ford only'], 1, 'DFS with white/gray/black coloring or failed topological sort indicates a directed cycle.', 'medium'],
      ['What is the optimal comparison-based lower bound for sorting?', ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], 1, 'Comparison sorts require at least Omega(n log n) comparisons in the worst case.', 'hard'],
      ['Which DP pattern finds longest increasing subsequence in O(n log n)?', ['Naive recursion', 'Patience sorting with binary search', 'Greedy only', 'BFS'], 1, 'LIS can be computed by maintaining tails of increasing sequences and binary searching.', 'hard'],
      ['What is the time complexity of Kruskal MST algorithm dominated by?', ['BFS', 'Sorting edges + Union-Find', 'DFS only', 'Dijkstra'], 1, 'Kruskal sorts edges O(E log E) then processes with nearly O(1) union-find operations.', 'medium'],
      ['Which structure is best for range minimum query with O(1) query after O(n log n) preprocess?', ['Stack only', 'Sparse table / Segment tree', 'Queue', 'Hash map'], 1, 'Sparse tables and segment trees support fast range queries after preprocessing.', 'hard'],
      ['What happens when load factor of a hash table exceeds a threshold?', ['Table shrinks', 'Rehashing/resizing occurs', 'Search becomes O(1) always', 'Collisions disappear'], 1, 'High load factor triggers rehashing into a larger table to maintain performance.', 'medium'],
      ['In B-tree of order m, what is the maximum number of keys in an internal node (excluding root)?', ['m', 'm - 1', '2m', 'm/2'], 1, 'An internal B-tree node holds at most m-1 keys and m children.', 'hard'],
      ['Which sorting works in O(n) when keys are integers in a small range?', ['Merge sort', 'Counting sort', 'Heap sort', 'Quick sort'], 1, 'Counting sort runs in O(n + k) where k is the range of input integers.', 'medium'],
      ['What is the diameter of a tree with n nodes in terms of traversals needed?', ['One BFS', 'Two BFS/DFS from extremes', 'n DFS calls', 'Cannot be computed'], 1, 'Two passes from farthest node found in first pass compute tree diameter in O(n).', 'hard'],
      ['Which problem does the knapsack 0/1 recurrence optimize?', ['Fractional items allowed', 'Take whole item or leave it', 'Unbounded copies', 'Minimum cost only'], 1, '0/1 knapsack allows each item at most once, classic DP formulation.', 'medium'],
      ['What is tail recursion useful for in compilers?', ['Slower execution', 'Stack space optimization to iteration', 'Heap allocation', 'Parallelism only'], 1, 'Tail-call optimization reuses stack frames, converting recursion to loop-like behavior.', 'medium'],
      ['Which data structure implements undo/redo in text editors efficiently?', ['Array', 'Two stacks', 'Queue', 'BST'], 1, 'Two stacks store undo and redo operation histories for amortized O(1) operations.', 'medium'],
      ['What is the height of a complete binary tree with n nodes?', ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], 1, 'A complete binary tree has height floor(log2 n), which is O(log n).', 'easy'],
      ['Which graph algorithm finds strongly connected components?', ['Prim', 'Kosaraju or Tarjan', 'Dijkstra', 'BFS only'], 1, 'Kosaraju and Tarjan algorithms identify SCCs in directed graphs in linear time.', 'hard'],
      ['What is the time to delete a node with two children in BST (by successor)?', ['O(1)', 'O(log n) average for balanced tree', 'O(n) always', 'O(n^2)'], 1, 'Finding inorder successor and relinking takes O(h) where h is tree height.', 'medium'],
      ['Which string-matching algorithm preprocesses pattern in O(m) and searches in O(n)?', ['Naive O(nm)', 'KMP', 'Brute force only', 'Bubble sort'], 1, 'Knuth-Morris-Pratt builds a failure function to avoid re-comparing characters.', 'hard'],
      ['What property does a red-black tree guarantee?', ['All leaves same depth', 'Black-height balanced within factor 2', 'No rotations', 'O(1) insert'], 1, 'Red-black trees maintain approximate balance via color invariants, keeping height O(log n).', 'hard'],
      ['Which operation is NOT typical for a priority queue?', ['Extract-min', 'Insert', 'Decrease-key (in some heaps)', 'Random access by index in O(1)'], 3, 'Priority queues focus on extremal element access, not arbitrary index lookup.', 'easy'],
      ['What is the space complexity of the tabulation (bottom-up) DP table for knapsack with n items and capacity W?', ['O(1)', 'O(n)', 'O(nW)', 'O(W) with 1D optimization possible'], 2, 'Standard table is n by W; 1D rolling array reduces to O(W) space.', 'medium'],
      ['Which traversal uses a queue?', ['DFS', 'BFS', 'In-order', 'Pre-order recursive only'], 1, 'BFS explores level by level using a FIFO queue.', 'easy'],
      ['What is the result of applying topological sort on a DAG?', ['Linear ordering respecting all edges', 'Shortest path tree', 'MST', 'Random permutation'], 0, 'Topological order places every node before its successors in the DAG.', 'medium'],
      ['Which heap operation has O(log n) complexity?', ['Peek-min', 'Insert', 'Find-min', 'Both insert and extract-min'], 3, 'Insert and extract-min bubble up/down the tree height O(log n).', 'easy'],
      ['What does amortized analysis of dynamic array doubling give for n appends?', ['O(n^2) total', 'O(n) total', 'O(n log n)', 'O(1) per append worst case'], 1, 'Doubling strategy yields O(1) amortized cost per append over n operations.', 'hard'],
      ['Which graph problem is NP-complete?', ['Shortest path with non-negative weights', 'Traveling Salesman Problem (decision)', 'MST', 'BFS reachability'], 1, 'TSP decision variant is NP-complete; MST and Dijkstra are polynomial.', 'hard'],
      ['What is the best-case time complexity of bubble sort on already sorted input (with optimization)?', ['O(n)', 'O(n log n)', 'O(n^2)', 'O(1)'], 0, 'With a flag to stop when no swaps occur, bubble sort runs O(n) on sorted data.', 'easy'],
      ['Which structure stores prefix sums for O(1) range sum queries after O(n) build?', ['Linked list', 'Prefix sum array', 'Stack', 'Queue'], 1, 'Prefix array precomputes cumulative sums enabling constant-time range sums.', 'easy'],
    ],
  },
  {
    code: 'OS',
    name: 'OS',
    topics: ['Process Management', 'Memory Management', 'CPU Scheduling', 'Deadlocks', 'File Systems'],
    questions: [
      ['What are the typical states of a process in an OS?', ['Running, Waiting, Ready', 'Compiled, Linked, Loaded', 'Read, Write, Execute', 'User, Kernel, Idle only'], 0, 'Processes transition among ready, running, and waiting (blocked) states.', 'easy'],
      ['Which scheduling algorithm can cause starvation?', ['FCFS', 'Round Robin', 'Priority scheduling', 'Lottery scheduling with fair tickets'], 2, 'Low-priority processes may never run if higher-priority work always exists.', 'medium'],
      ['Paging primarily helps solve which memory problem?', ['Internal fragmentation in segments', 'External fragmentation', 'Thrashing only', 'Disk failure'], 1, 'Fixed-size pages eliminate external fragmentation though internal fragmentation remains.', 'easy'],
      ['What is a context switch?', ['Switching user accounts', 'Saving/restoring process state when changing CPU execution', 'Changing file permissions', 'Disk seek operation'], 1, 'The kernel swaps CPU registers and memory context between processes or threads.', 'easy'],
      ['Which condition is NOT required for deadlock (Coffman)?', ['Mutual exclusion', 'Hold and wait', 'Preemption always allowed', 'Circular wait'], 2, 'Deadlock requires no preemption of held resources; preemption prevents hold-and-wait deadlocks.', 'medium'],
      ['What does TLB stand for and improve?', ['Total Load Balance', 'Translation Lookaside Buffer for faster address translation', 'Thread Local Block', 'Temporary Lock Bit'], 1, 'TLB caches recent virtual-to-physical page mappings to speed memory access.', 'medium'],
      ['Round Robin scheduling uses which data structure for ready queue?', ['Stack', 'FIFO queue', 'Priority heap only', 'Tree'], 1, 'RR treats the ready queue as circular FIFO, giving each process a time quantum.', 'easy'],
      ['Which page replacement policy may suffer Belady anomaly?', ['OPT', 'FIFO', 'LRU (stack algorithm)', 'MFU rarely'], 1, 'FIFO can perform worse with more frames, unlike stack algorithms like LRU.', 'hard'],
      ['What is thrashing?', ['CPU overheating', 'Excessive paging with low CPU utilization', 'Disk formatting', 'Thread creation storm'], 1, 'Thrashing occurs when processes spend more time paging than executing useful work.', 'medium'],
      ['Which system call creates a new process on Unix?', ['pthread_create', 'fork', 'malloc', 'exec only without fork'], 1, 'fork() duplicates the calling process; exec() often follows to load a new program.', 'easy'],
      ['What is the purpose of semaphores?', ['File encryption', 'Synchronization and resource counting', 'Memory allocation', 'Scheduling only'], 1, 'Semaphores coordinate concurrent processes by controlling access to shared resources.', 'medium'],
      ['Which memory allocation suffers external fragmentation?', ['Paging', 'Segmentation', 'Fixed partitions with equal sizes', 'Virtual memory only'], 1, 'Variable-sized segments leave unusable holes between allocated regions.', 'medium'],
      ['What does the Banker algorithm do?', ['Bank transactions', 'Deadlock avoidance using safe state detection', 'Page replacement', 'File indexing'], 1, 'Banker algorithm checks if granting resources keeps the system in a safe state.', 'hard'],
      ['Which scheduling is optimal for minimizing average waiting time (non-preemptive)?', ['FCFS', 'SJF', 'Round Robin', 'Random'], 1, 'Shortest Job First minimizes average waiting time when job lengths are known.', 'medium'],
      ['What is a zombie process?', ['Malware process', 'Terminated child not yet reaped by parent', 'Idle kernel thread', 'Sleeping daemon'], 1, 'Zombie retains an entry in process table until parent calls wait() to read exit status.', 'medium'],
      ['Which disk scheduling minimizes seek time for requests near current head?', ['FCFS disk', 'SCAN / C-SCAN', 'Random', 'Priority by PID'], 1, 'SCAN sweeps disk arm in one direction servicing requests, reducing seek distance.', 'medium'],
      ['What is internal fragmentation?', ['Unused space outside allocated regions', 'Wasted space inside allocated fixed-size block', 'CPU cache miss', 'Network packet loss'], 1, 'Allocating fixed pages/frames may leave unused bytes within the allocated unit.', 'easy'],
      ['Which IPC mechanism is fastest for large shared data on same machine?', ['Pipes', 'Shared memory', 'Sockets', 'Signals only'], 1, 'Shared memory avoids copying data through kernel buffers for bulk communication.', 'medium'],
      ['What does mutex stand for?', ['Multiple execution text', 'Mutual exclusion lock', 'Memory unit transfer', 'Multi-user extension'], 1, 'Mutex ensures only one thread accesses a critical section at a time.', 'easy'],
      ['Which replacement algorithm is theoretically optimal but impractical?', ['LRU', 'OPT (Belady)', 'FIFO', 'Clock'], 1, 'OPT replaces page used farthest in future; future reference string is unknown at runtime.', 'hard'],
      ['What is spooling related to?', ['CPU cache', 'Overlapping I/O of slow devices like printers', 'Virtual memory', 'Deadlock detection'], 1, 'Spoolers queue jobs for devices so programs need not wait for slow I/O completion.', 'easy'],
      ['Which register stores the address of the next instruction?', ['Stack pointer', 'Program counter', 'Base register', 'MAR only'], 1, 'The program counter (IP) points to the next instruction to fetch.', 'easy'],
      ['What is the main difference between process and thread?', ['Threads share address space; processes typically do not', 'Processes are lighter', 'Threads cannot run concurrently', 'No difference'], 0, 'Threads within a process share memory and resources; processes are isolated units.', 'easy'],
      ['Which scheduling gives each process equal CPU share over long run?', ['SJF', 'Round Robin with same quantum', 'Priority without aging', 'FCFS with long jobs first'], 1, 'Equal time quanta in RR provide proportional CPU time over sufficient interval.', 'medium'],
      ['What causes a page fault?', ['Valid page in TLB', 'Referenced page not in physical memory', 'CPU interrupt disabled', 'Successful disk read'], 1, 'Page fault traps OS to load missing page from backing store into RAM.', 'easy'],
      ['Which file allocation method supports random access easily?', ['Linked allocation', 'Indexed allocation', 'Contiguous only for append', 'None'], 1, 'Indexed allocation uses an index block pointing to data blocks for direct access.', 'medium'],
      ['What is convoy effect in FCFS?', ['Short jobs wait behind long CPU-bound job', 'Deadlock cycle', 'TLB flush', 'Thrashing'], 0, 'FCFS convoy effect delays small jobs queued behind a long-running process.', 'medium'],
      ['Which technique prevents hold-and-wait for deadlock?', ['Require all resources requested at once before execution', 'Ignore resources', 'Increase priority', 'Disable interrupts forever'], 0, 'Requesting all needed resources atomically at start eliminates hold-and-wait.', 'hard'],
      ['What is working set model used for?', ['Compiler optimization', 'Guiding how many pages a process needs in memory', 'Disk formatting', 'Network routing'], 1, 'Working set approximates pages referenced recently to reduce thrashing.', 'hard'],
      ['Which state transition occurs when I/O completes for a blocked process?', ['Running to Ready', 'Waiting to Ready', 'Ready to Waiting', 'Running to Terminated'], 1, 'After I/O completion, blocked process becomes ready to compete for CPU.', 'easy'],
      ['What does RAID level 0 provide?', ['Mirroring', 'Striping without redundancy', 'Parity only', 'No performance gain'], 1, 'RAID 0 stripes data for performance but offers no fault tolerance.', 'medium'],
      ['Which is user mode vs kernel mode boundary crossed by?', ['Regular assignment', 'System call / trap', 'Local variable access', 'Cache hit'], 1, 'System calls trap into kernel mode to perform privileged operations.', 'easy'],
      ['What is aging in scheduling?', ['Process termination', 'Gradually increasing priority of waiting jobs', 'Memory leak', 'File deletion'], 1, 'Aging boosts long-waiting processes priority to prevent starvation.', 'medium'],
      ['Which memory management uses base and limit registers?', ['Paging only', 'Simple relocation / segmentation schemes', 'TLB', 'Cache lines'], 1, 'Base/limit pair relocates and bounds-checks logical addresses in simple schemes.', 'medium'],
      ['What is the critical section problem about?', ['Disk crash recovery', 'Ensuring mutual exclusion for shared data access', 'Sorting files', 'Booting OS'], 1, 'Processes must coordinate entry to critical sections to avoid race conditions.', 'easy'],
      ['Which page table structure saves memory for sparse address spaces?', ['Single-level dense table', 'Multi-level / inverted page table', 'No page table', 'Segment only without pages'], 1, 'Multi-level tables allocate inner levels only where virtual pages exist.', 'hard'],
      ['What does exec() family do after fork?', ['Duplicate parent memory forever', 'Replace process image with new program', 'Create zombie always', 'Close all files always without choice'], 1, 'exec loads and runs a new program in the current process address space.', 'medium'],
      ['Which condition for deadlock means resources cannot be forcibly taken?', ['Mutual exclusion', 'No preemption', 'Circular wait', 'Hold and wait'], 1, 'Resources held by processes cannot be preempted without process cooperation.', 'medium'],
      ['What is the purpose of inode in Unix file systems?', ['User password', 'Metadata about a file (size, permissions, block pointers)', 'CPU scheduling queue', 'Network socket'], 1, 'Inodes store file metadata and locations of data blocks on disk.', 'medium'],
      ['Which scheduling is preemptive by time quantum expiry?', ['Pure FCFS', 'Round Robin', 'Non-preemptive SJF', 'First come never interrupted'], 1, 'RR preempts running process when its quantum expires, moving it to ready queue.', 'easy'],
      ['What is demand paging?', ['Load all pages at process start', 'Load pages only when referenced', 'Never use disk', 'Disable TLB'], 1, 'Demand paging loads pages on first reference, reducing initial memory footprint.', 'easy'],
      ['Which algorithm detects deadlock by resource allocation graph cycle (single instance)?', ['Banker', 'Cycle detection in RAG', 'FIFO replacement', 'SCAN disk'], 1, 'A cycle in RAG with single resource instance indicates deadlock.', 'medium'],
      ['What is swap space used for?', ['CPU cache extension', 'Backing store for paged-out memory', 'ROM storage', 'Register file'], 1, 'Swap holds pages evicted from RAM when physical memory is full.', 'easy'],
      ['Which is true about kernel threads vs user threads?', ['Kernel threads scheduled by OS; user threads need thread library', 'User threads always faster on all kernels', 'Kernel threads cannot block', 'Identical on all OS'], 0, 'Kernel threads are first-class schedulable entities; user threads mapped by library.', 'hard'],
      ['What does copy-on-write optimize after fork?', ['Immediate full memory copy', 'Defer copying pages until one process writes', 'Disable paging', 'Remove TLB'], 1, 'COW shares read-only pages until write, then copies only modified pages.', 'hard'],
      ['Which file system journaling helps?', ['Faster CPU', 'Crash recovery consistency', 'More RAM', 'Eliminate fragmentation entirely'], 1, 'Journaling logs metadata changes to recover consistent state after crash.', 'medium'],
      ['What is response time vs turnaround time?', ['Same metric', 'Response: first output; Turnaround: completion minus arrival', 'Turnaround is CPU only', 'Response is disk seek'], 1, 'Response time measures time to first response; turnaround is total time in system.', 'medium'],
      ['Which mutex operation releases the lock?', ['wait/acquire', 'signal/release', 'fork', 'exec'], 1, 'Release (signal/unlock) frees mutex for waiting threads.', 'easy'],
      ['What is logical vs physical address?', ['Same always', 'Logical generated by CPU; physical on memory bus after translation', 'Physical is virtual', 'Logical is disk sector'], 1, 'MMU translates logical (virtual) addresses to physical RAM locations.', 'easy'],
      ['Which scheduling metric does RR with small quantum increase?', ['Throughput only always', 'Context switch overhead', 'I/O wait zero always', 'No effect'], 1, 'Very small quanta cause frequent context switches, increasing overhead.', 'medium'],
    ],
  },
];

// Continue with remaining subjects - the file is too long for one write
// I'll append more subjects in the generator

const MORE_SUBJECTS = [
  {
    code: 'DBMS',
    name: 'DBMS',
    topics: ['SQL & Queries', 'Normalization', 'Transactions', 'Indexing', 'ER Model'],
    bank: 'dbms',
  },
  {
    code: 'CN',
    name: 'CN',
    topics: ['OSI & TCP/IP', 'Routing', 'IP Addressing', 'Transport Layer', 'Network Security'],
    bank: 'cn',
  },
  {
    code: 'OOP',
    name: 'OOP',
    topics: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Design Patterns', 'Exception Handling'],
    bank: 'oop',
  },
  {
    code: 'SE',
    name: 'Software Engineering',
    topics: ['SDLC', 'Agile & Scrum', 'Software Testing', 'Software Architecture', 'Requirements Engineering'],
    bank: 'se',
  },
  {
    code: 'APT',
    name: 'Aptitude',
    topics: ['Logical Reasoning', 'Quantitative Aptitude', 'Data Interpretation', 'Verbal Ability', 'Probability & Statistics'],
    bank: 'apt',
  },
  {
    code: 'PY',
    name: 'Python',
    topics: ['Python Basics', 'Data Structures in Python', 'OOP in Python', 'Python Libraries', 'Advanced Python'],
    bank: 'py',
  },
  {
    code: 'AIML',
    name: 'AI/ML',
    topics: ['Machine Learning Basics', 'Neural Networks', 'Deep Learning', 'Natural Language Processing', 'Model Evaluation'],
    bank: 'aiml',
  },
];

// Question banks for remaining subjects - loaded from embedded data
const QUESTION_BANKS = require('./question-bank-data');

function esc(str) {
  return str.replace(/'/g, "''");
}

function toJsonOptions(opts) {
  return JSON.stringify(opts).replace(/'/g, "''");
}

function distributeQuestions(questions, topicCount, perTopic) {
  const result = [];
  for (let t = 0; t < topicCount; t++) {
    for (let i = 0; i < perTopic; i++) {
      const q = questions[t * perTopic + i] || questions[i % questions.length];
      result.push({ topicIndex: t, question: q });
    }
  }
  return result;
}

function buildSql() {
  const lines = [];
  lines.push('-- Cognivex Question Bank Seed Data');
  lines.push('-- 9 subjects, 45 topics, 450 questions');
  lines.push('-- Run in Supabase SQL Editor AFTER question bank schema exists');
  lines.push('');
  lines.push('BEGIN;');
  lines.push('');
  lines.push('-- Clear existing seed data (optional - comment out if preserving data)');
  lines.push('DELETE FROM quiz_attempts;');
  lines.push('DELETE FROM user_learning_stats;');
  lines.push('DELETE FROM questions;');
  lines.push('DELETE FROM topics;');
  lines.push('DELETE FROM subjects;');
  lines.push('');
  lines.push('-- Reset sequences if using SERIAL ids');
  lines.push('ALTER SEQUENCE IF EXISTS subjects_id_seq RESTART WITH 1;');
  lines.push('ALTER SEQUENCE IF EXISTS topics_id_seq RESTART WITH 1;');
  lines.push('ALTER SEQUENCE IF EXISTS questions_id_seq RESTART WITH 1;');
  lines.push('');

  const allSubjects = [...SUBJECTS];

  // Merge question banks from external data for subjects 3-9
  for (const meta of MORE_SUBJECTS) {
    const bank = QUESTION_BANKS[meta.bank];
    allSubjects.push({
      code: meta.code,
      name: meta.name,
      topics: meta.topics,
      questions: bank,
    });
  }

  // Insert subjects
  lines.push('-- ========== SUBJECTS ==========');
  allSubjects.forEach((s, idx) => {
    lines.push(`INSERT INTO subjects (id, name, code) VALUES (${idx + 1}, '${esc(s.name)}', '${esc(s.code)}');`);
  });
  lines.push('');

  // Insert topics
  lines.push('-- ========== TOPICS ==========');
  let topicId = 1;
  allSubjects.forEach((s, sIdx) => {
    const subjectId = sIdx + 1;
    s.topics.forEach((topicName) => {
      lines.push(`INSERT INTO topics (id, subject_id, name) VALUES (${topicId}, ${subjectId}, '${esc(topicName)}');`);
      topicId++;
    });
  });
  lines.push('');

  // Insert questions
  lines.push('-- ========== QUESTIONS ==========');
  allSubjects.forEach((s, sIdx) => {
    const subjectId = sIdx + 1;
    const perTopic = 10;
    const distributed = distributeQuestions(s.questions, s.topics.length, perTopic);
    distributed.forEach(({ topicIndex, question }, qIdx) => {
      const topicIdForQ = sIdx * 5 + topicIndex + 1;
      const [text, opts, correct, explanation, difficulty] = question;
      lines.push(
        `INSERT INTO questions (subject_id, topic_id, question, options, correct_answer, explanation, difficulty) VALUES (${subjectId}, ${topicIdForQ}, '${esc(text)}', '${toJsonOptions(opts)}'::jsonb, ${correct}, '${esc(explanation)}', '${difficulty}');`
      );
    });
  });

  lines.push('');
  lines.push('COMMIT;');
  return lines.join('\n');
}

const outPath = path.join(__dirname, '../src/config/question_bank_seed.sql');
fs.writeFileSync(outPath, buildSql(), 'utf8');
console.log(`Generated ${outPath}`);
console.log(`Size: ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB`);
