/**
 * Builds backend/src/config/question_bank_seed.sql
 * Run: node scripts/build-all-seed.js
 */
const fs = require('fs');
const path = require('path');

const q = (text, opts, correct, explanation, difficulty) => [text, opts, correct, explanation, difficulty];

function topicSet(topics, topicQuestions) {
  const out = [];
  topics.forEach((_, ti) => {
    for (let i = 0; i < 10; i++) {
      out.push(q(...topicQuestions[ti][i]));
    }
  });
  return out;
}

const SUBJECTS = [
  {
    code: 'DSA', name: 'DSA',
    topics: ['Arrays & Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming'],
    questions: topicSet(['Arrays & Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming'], [
      [
        ['What is the time complexity of binary search on a sorted array?', ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], 1, 'Binary search halves the search space each iteration, giving O(log n).', 'easy'],
        ['Which sorting algorithm is stable and O(n log n) worst-case?', ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'], 2, 'Merge sort preserves order of equal elements with guaranteed O(n log n).', 'medium'],
        ['Two-pointer technique is commonly used on what?', ['Unsorted arrays only', 'Sorted arrays and strings', 'Graphs only', 'Hash tables only'], 1, 'Two pointers efficiently solve problems like pair sum on sorted data.', 'easy'],
        ['What is amortized O(1) for dynamic array append using doubling?', ['True over n appends', 'False always O(n)', 'Only linked lists', 'Only stacks'], 0, 'Doubling strategy yields O(1) amortized cost per append.', 'hard'],
        ['Kadane algorithm solves which problem?', ['Maximum subarray sum', 'Longest path in tree', 'Graph coloring', 'Sorting strings'], 0, 'Kadane computes maximum contiguous subarray sum in O(n).', 'medium'],
        ['Rolling hash is used in what type of problems?', ['String pattern matching / substring search', 'Sorting numbers', 'BFS', 'Heapify'], 0, 'Polynomial rolling hashes compare substrings efficiently in competitive programming.', 'hard'],
        ['Which structure supports O(1) random access by index?', ['Singly linked list', 'Array', 'Stack', 'Queue'], 1, 'Arrays provide constant-time indexed access.', 'easy'],
        ['Sliding window reduces complexity often from O(n^2) to?', ['O(n)', 'O(log n)', 'O(n^3)', 'O(1) always'], 0, 'Maintaining window state while moving endpoints yields linear time.', 'medium'],
        ['An anagram check after sorting characters runs in?', ['O(n log n) due to sort', 'O(1)', 'O(n^2) only', 'O(log n)'], 0, 'Sorting n characters dominates at O(n log n).', 'easy'],
        ['Which problem finds longest substring without repeating characters?', ['Sliding window with hash set', 'DFS only', 'Dijkstra', 'Union find only'], 0, 'Expand/shrink window tracking last seen index solves in O(n).', 'medium'],
      ],
      [
        ['Insert at head of singly linked list complexity?', ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], 0, 'Head insert updates pointers without traversal.', 'easy'],
        ['Detect cycle in linked list uses which algorithm?', ['Floyd tortoise-hare', 'Merge sort', 'KMP', 'Prim'], 0, 'Two pointers at different speeds meet if cycle exists.', 'easy'],
        ['Reverse linked list iteratively needs how many pointers?', ['Three (prev, curr, next)', 'One', 'None', 'Ten'], 0, 'Track previous and next while reversing links.', 'easy'],
        ['Merge two sorted linked lists complexity?', ['O(n+m)', 'O(n*m)', 'O(log n)', 'O(1)'], 0, 'Single pass merging like merge sort merge step.', 'easy'],
        ['Why use dummy sentinel node in list problems?', ['Simplify edge cases at head', 'Increase memory only for fun', 'Required by language', 'Slow down always'], 0, 'Dummy node avoids special-casing empty list or head insert/delete.', 'medium'],
        ['Find middle of linked list in one pass using?', ['Fast/slow pointers', 'Sorting list', 'Stack only', 'Hash map of values only'], 0, 'Fast pointer moves 2 steps, slow 1 step; slow at middle when fast ends.', 'easy'],
        ['Doubly linked list advantage over singly?', ['O(1) deletion given node reference', 'Less memory', 'No pointers', 'Cannot traverse backward'], 0, 'Previous pointer enables backward traversal and easier deletion.', 'medium'],
        ['LRU cache often implemented with?', ['Hash map + doubly linked list', 'Array only', 'Stack only', 'BST only'], 0, 'Map gives O(1) lookup; DLL orders usage for eviction.', 'hard'],
        ['Space complexity of recursive reverse of n nodes?', ['O(n) stack', 'O(1)', 'O(log n)', 'O(n^2)'], 0, 'Recursion depth equals list length in worst case.', 'medium'],
        ['Josephus problem on circular linked list tests understanding of?', ['Pointer manipulation on circular structure', 'Sorting', 'Graph BFS', 'Heap property'], 0, 'Elimination around circle requires careful next pointer updates.', 'hard'],
      ],
      [
        ['In-order traversal of BST yields?', ['Sorted sequence', 'Reverse sorted always', 'Level order', 'Random order'], 0, 'Left-root-right visits nodes in ascending key order.', 'easy'],
        ['Height of balanced BST with n nodes is?', ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)'], 0, 'Balance keeps tree height logarithmic.', 'easy'],
        ['Which traversal uses queue?', ['BFS level-order', 'In-order', 'Pre-order recursive', 'Post-order without queue always'], 0, 'Level-order processes nodes breadth-first using FIFO queue.', 'easy'],
        ['AVL tree balance factor allowed values?', ['-1, 0, 1', '-2, 2 only', 'Any integer', '0 only'], 0, 'AVL requires balance factor within one for every node.', 'medium'],
        ['Lowest common ancestor in BST solved by?', ['Exploiting ordering property', 'Sorting array', 'Hash only', 'Dijkstra'], 0, 'Compare node values with p and q to move left or right.', 'medium'],
        ['Complete binary tree property means?', ['All levels filled except possibly last left-filled', 'Every node two children', 'BST property', 'Heap only'], 0, 'Complete trees fill levels left to right without gaps except last level.', 'easy'],
        ['Segment tree supports range queries in?', ['O(log n) per query/update', 'O(n) only', 'O(1) always', 'O(n^2)'], 0, 'Tree height O(log n) enables efficient range aggregate queries.', 'hard'],
        ['Trie complexity of search for word length L?', ['O(L)', 'O(n)', 'O(log n)', 'O(1)'], 0, 'Search follows one pointer per character.', 'medium'],
        ['Red-black tree guarantees what about height?', ['At most 2 log(n+1)', 'Exactly log n', 'Linear height', 'Constant height'], 0, 'RB trees remain approximately balanced with logarithmic height bound.', 'hard'],
        ['Serialize BST pre-order needs what delimiter handling?', ['Null markers for missing children', 'Only root value', 'In-order only', 'No recursion'], 0, 'Include sentinel for null children to reconstruct unique shape.', 'medium'],
      ],
      [
        ['Adjacency list space for sparse graph?', ['O(V + E)', 'O(V^2)', 'O(E^2)', 'O(1)'], 0, 'Lists store each edge once totaling V + E space.', 'easy'],
        ['Dijkstra fails with negative edges because?', ['Greedy choice invalid', 'Uses too much memory', 'Requires BFS only', 'Only works on trees'], 0, 'Non-negative weights ensure settled distances are final.', 'medium'],
        ['Topological sort exists only for?', ['DAG', 'Any graph with cycle', 'Undirected connected only', 'Complete graph only'], 0, 'Directed acyclic graphs admit linear topological ordering.', 'easy'],
        ['BFS finds shortest path in unweighted graph because?', ['Explores layer by layer', 'Uses stack', 'Sorts edges', 'Random walk'], 0, 'First time reaching node is via minimum edge count path.', 'easy'],
        ['Kruskal algorithm sorts what?', ['Edges by weight', 'Vertices by degree only', 'Adjacency matrix rows', 'Colors'], 0, 'Kruskal processes edges ascending weight using union-find.', 'medium'],
        ['Detect cycle in undirected graph using union-find when?', ['Edge connects already connected components', 'Graph disconnected', 'All vertices degree 1', 'Using BFS only always'], 0, 'Adding edge within same component creates cycle.', 'medium'],
        ['Bellman-Ford handles negative edges and detects?', ['Negative cycles', 'Only positive cycles', 'MST', 'Euler path only'], 0, 'Relax all edges V-1 times; Vth pass detects negative cycles.', 'hard'],
        ['Graph coloring minimum colors problem is?', ['NP-hard in general', 'O(n) always', 'Same as BFS', 'Solvable by sorting'], 0, 'Finding chromatic number is computationally hard.', 'hard'],
        ['Strongly connected components in directed graph via?', ['Kosaraju/Tarjan', 'Prim', 'KMP', 'Heap sort'], 0, 'These algorithms partition vertices into SCCs in linear time.', 'hard'],
        ['Maximum flow problem solved by?', ['Ford-Fulkerson variants', 'Binary search on tree', 'Trie insert', 'Selection sort'], 0, 'Augmenting path methods compute max flow in network.', 'hard'],
      ],
      [
        ['DP requires optimal substructure and?', ['Overlapping subproblems', 'No recursion', 'Sorted input only', 'Greedy always sufficient'], 0, 'Repeated subproblems make memoization/tabulation beneficial.', 'easy'],
        ['0/1 knapsack time with n items capacity W?', ['O(nW) pseudo-polynomial', 'O(n log W) always', 'O(1)', 'O(n^2 W) always required'], 0, 'Classic DP table fills n by W entries.', 'medium'],
        ['Longest common subsequence recurrence compares?', ['Match skip or take diagonal', 'Only sorting strings', 'Graph edges', 'Heap root'], 0, 'If chars match add 1 + LCS(i-1,j-1); else max of excluding one char.', 'medium'],
        ['Coin change minimum coins DP initializes?', ['Infinity for impossible states except 0 coins for amount 0', 'All zero', 'Random values', 'Only largest coin'], 0, 'DP builds min coins bottom-up from base amount 0.', 'medium'],
        ['Fibonacci DP reduces time from exponential to?', ['O(n)', 'O(2^n)', 'O(n^2) only always', 'O(log log n)'], 0, 'Memoization or tabulation computes each subproblem once.', 'easy'],
        ['Edit distance (Levenshtein) allowed operations?', ['Insert delete replace', 'Only swap adjacent', 'Only delete', 'Only insert'], 0, 'Three operations transform one string to another with minimum cost.', 'hard'],
        ['Matrix chain multiplication DP state?', ['Split k between i and j', 'Only diagonal', 'Sort matrices', 'Greedy largest first always optimal'], 0, 'Choose partition minimizing scalar multiplication cost.', 'hard'],
        ['DP on trees often uses?', ['Post-order DFS returning values to parent', 'BFS only', 'Hash collisions', 'No recursion allowed'], 0, 'Compute answers for subtrees before combining at parent.', 'medium'],
        ['Subset sum decision problem DP table dimension?', ['Items x target sum', 'Only items', 'Only sum', 'Graph vertices'], 0, 'Boolean table whether sum achievable using first i items.', 'medium'],
        ['Space optimize 0/1 knapsack to O(W) using?', ['1D rolling array', 'Two matrices always', 'Stack only', 'Trie'], 0, 'Iterate capacity backwards updating single row per item.', 'hard'],
      ],
    ]),
  },
  {
    code: 'OS', name: 'OS',
    topics: ['Process Management', 'Memory Management', 'CPU Scheduling', 'Deadlocks', 'File Systems'],
    questions: topicSet(['Process Management', 'Memory Management', 'CPU Scheduling', 'Deadlocks', 'File Systems'], [
      [
        ['Which is NOT a process state?', ['Ready', 'Running', 'Compiled', 'Waiting'], 2, 'Compiled is not an OS process scheduling state.', 'easy'],
        ['fork() on Unix creates?', ['New thread only', 'Child process copy', 'New file', 'Kernel module'], 1, 'fork duplicates calling process; exec often loads new program.', 'easy'],
        ['Context switch saves?', ['Process/thread CPU state and switches address space info', 'Only file names', 'Only user password', 'Disk contents always full copy'], 0, 'Kernel stores registers and memory management context.', 'easy'],
        ['Zombie process is?', ['Terminated child awaiting wait()', 'Running virus', 'Idle CPU thread', 'Kernel panic'], 0, 'Entry remains until parent reaps exit status.', 'medium'],
        ['Thread shares with peers in process?', ['Address space and open files', 'Stack and registers always', 'Nothing', 'Only PID'], 0, 'Threads share memory and resources; have own stack/registers.', 'easy'],
        ['IPC fastest for bulk same-machine data?', ['Shared memory', 'Pipe copy always faster', 'Signal only', 'File on NFS only'], 0, 'Shared memory avoids kernel copy for large payloads.', 'medium'],
        ['exec() after fork does?', ['Replace process image', 'Create second parent', 'Duplicate only memory forever', 'Close all network always mandatory'], 0, 'exec loads new program into existing process.', 'medium'],
        ['Orphan process adopted by?', ['init/systemd in Unix', 'Parent zombie', 'No one ever', 'Child of itself'], 0, 'When parent dies, init re-parents orphan processes.', 'medium'],
        ['User mode to kernel mode transition via?', ['System call trap', 'printf only', 'Local variable assign', 'Comment in code'], 0, 'Traps/interrupts enter kernel to perform privileged work.', 'easy'],
        ['Multiprogramming increases?', ['CPU utilization by overlapping execution', 'Single process speed always linear', 'Need for one program only', 'Eliminates memory need'], 0, 'Multiple processes keep CPU busy while others wait on I/O.', 'easy'],
      ],
      [
        ['Paging avoids which fragmentation?', ['External', 'Internal only always eliminated too', 'None', 'Disk fragmentation only'], 0, 'Fixed pages eliminate external holes; internal may remain.', 'easy'],
        ['TLB purpose is?', ['Cache page table translations', 'Sort processes', 'Encrypt memory', 'Replace RAM'], 0, 'TLB speeds virtual to physical address translation.', 'medium'],
        ['Page fault occurs when?', ['Referenced page not in RAM', 'Cache hit', 'TLB always hit', 'Successful read from register'], 0, 'OS must fetch page from disk into memory.', 'easy'],
        ['Thrashing means?', ['Excessive paging low CPU utilization', 'CPU overheating', 'Fast execution', 'No swapping'], 0, 'System spends time paging rather than executing processes.', 'medium'],
        ['Working set model guides?', ['How many frames process needs resident', 'File naming', 'DNS cache', 'Scheduling quantum only'], 0, 'Keep working set in memory to avoid thrashing.', 'hard'],
        ['Copy-on-write after fork optimizes?', ['Delay copying pages until write', 'Immediate full copy always', 'Disable paging', 'Remove TLB'], 0, 'Share read-only pages until modified.', 'hard'],
        ['Segmentation uses?', ['Variable sized logical units', 'Fixed pages only', 'No addresses', 'Only cache lines'], 0, 'Segments represent logical program parts like code/data.', 'medium'],
        ['Effective access time formula includes?', ['Hit ratio and miss penalty', 'Only CPU GHz', 'Only disk size', 'Process name length'], 0, 'EAT = hit * t_mem + (1-hit) * (t_mem + page_fault_penalty).', 'hard'],
        ['Inverted page table used to?', ['Save space in large physical memory systems', 'Increase external fragmentation', 'Replace TLB only', 'Sort files'], 0, 'One entry per physical frame rather than per virtual page.', 'hard'],
        ['Belady anomaly seen in?', ['FIFO page replacement', 'LRU stack algorithm', 'OPT theoretical', 'Never occurs'], 0, 'FIFO may fault more when frames increase.', 'hard'],
      ],
      [
        ['Round Robin uses?', ['Time quantum and ready queue', 'Shortest job first always', 'No preemption', 'Random pick forever'], 0, 'Each process gets fixed CPU slice cyclically.', 'easy'],
        ['SJF minimizes?', ['Average waiting time if lengths known', 'Response time always', 'I/O wait only', 'Memory usage'], 0, 'Shortest Job First optimizes average wait when job times known.', 'medium'],
        ['Convoy effect in FCFS?', ['Short jobs wait behind long job', 'Deadlock', 'Starvation impossible', 'TLB flush'], 0, 'Head-of-line blocking delays small processes.', 'medium'],
        ['Priority scheduling risk?', ['Starvation of low priority', 'No preemption ever', 'Equal time slices always', 'Eliminates I/O'], 0, 'Low priority may never run; aging mitigates.', 'medium'],
        ['Multilevel feedback queue adapts?', ['Process behavior between queues', 'Only static assignment', 'Disk scheduling', 'File permissions'], 0, 'Processes move between priority queues based on CPU/I/O behavior.', 'hard'],
        ['Turnaround time equals?', ['Completion time minus arrival time', 'First response only', 'CPU burst only', 'Waiting plus quantum always only'], 0, 'Total time in system from arrival to completion.', 'easy'],
        ['Preemptive scheduling allows?', ['Interrupt running process for higher priority/quantum expiry', 'Never interrupt', 'Only on I/O completion of same process always running', 'Disable ready queue'], 0, 'Running process may be forced to ready state.', 'easy'],
        ['Response time differs from turnaround as?', ['Time to first response vs total completion', 'Same metric', 'Disk seek time', 'Page fault count'], 0, 'Interactive systems care about first output latency.', 'medium'],
        ['Lottery scheduling provides?', ['Probabilistic proportional CPU share', 'Deterministic strict priority only', 'No fairness', 'Real-time guarantees always'], 0, 'Tickets give proportional long-run CPU share.', 'hard'],
        ['Rate monotonic schedules?', ['Periodic real-time tasks by period', 'Only batch jobs', 'Only interactive', 'File blocks'], 0, 'Shorter period tasks get higher priority in RM.', 'hard'],
      ],
      [
        ['Four Coffman conditions include?', ['Mutual exclusion hold-wait no-preemption circular-wait', 'Only one condition', 'Paging and segmentation', 'TCP handshake'], 0, 'All four together necessary for deadlock possibility.', 'medium'],
        ['Banker algorithm is?', ['Deadlock avoidance', 'Page replacement', 'Disk scheduling', 'File allocation'], 0, 'Checks safe state before granting resource requests.', 'hard'],
        ['Resource allocation graph cycle with single instance implies?', ['Deadlock', 'Safe always', 'No wait', 'Thrashing'], 0, 'Cycle with one unit per resource type indicates deadlock.', 'medium'],
        ['Deadlock prevention breaks?', ['One of necessary conditions e.g. hold-and-wait', 'CPU only', 'All locks always', 'User login'], 0, 'Prevent mutual exclusion or hold-wait etc. to avoid deadlock.', 'hard'],
        ['Deadlock detection requires?', ['Wait-for graph cycle detection and recovery', 'Only prevention', 'Disable all threads', 'Remove RAM'], 0, 'Periodically detect cycles and abort or preempt resources.', 'medium'],
        ['Mutex vs semaphore difference?', ['Mutex binary ownership; counting semaphore tracks resources', 'Identical always', 'Semaphore only binary', 'Mutex allows multiple owners'], 0, 'Mutex typically locked by one owner; semaphore can count.', 'medium'],
        ['Monitor constructs provide?', ['High-level mutual exclusion with condition variables', 'Only spinlocks', 'File I/O', 'Paging'], 0, 'Monitors encapsulate shared data and synchronization.', 'hard'],
        ['Dining philosophers problem illustrates?', ['Synchronization and deadlock risk', 'Sorting', 'Paging', 'DNS'], 0, 'Classic problem of competing for limited forks/resources.', 'medium'],
        ['Hold and wait prevented by?', ['Request all resources at once before start', 'Increase priority', 'Disable interrupts forever', 'Use more RAM only'], 0, 'Atomic resource acquisition eliminates hold-and-wait.', 'hard'],
        ['Safe state means?', ['Sequence of allocations exists finishing all processes', 'No processes running', 'CPU idle', 'No files open'], 0, 'There exists safe order avoiding deadlock completion failure.', 'hard'],
      ],
      [
        ['Inode stores?', ['File metadata and block pointers', 'User password', 'CPU registers', 'Routing table'], 0, 'Unix inodes hold permissions size and data block locations.', 'medium'],
        ['Contiguous file allocation weakness?', ['External fragmentation and growth difficulty', 'No sequential access', 'Too many pointers', 'Cannot read'], 0, 'Must preallocate contiguous space hard to extend.', 'medium'],
        ['Indexed allocation enables?', ['Random access without external fragmentation like linked', 'Only sequential', 'No metadata', 'Encryption only'], 0, 'Index block points to data blocks supporting direct access.', 'medium'],
        ['Journaling file system helps?', ['Crash recovery consistency', 'Faster CPU', 'Remove backups', 'Disable writes'], 0, 'Log metadata changes before commit for recovery.', 'medium'],
        ['Directory entry maps?', ['File name to inode number', 'IP to MAC', 'PID to PCB always only', 'Page to frame only'], 0, 'Directories are name to inode lookup tables.', 'easy'],
        ['RAID 1 provides?', ['Mirroring redundancy', 'Striping only', 'No redundancy', 'Parity only without mirror'], 0, 'Mirrored copies tolerate single disk failure.', 'easy'],
        ['Free space management methods include?', ['Bitmap or linked free list', 'Only inode table', 'Only TLB', 'ARP cache'], 0, 'Bitmap tracks available blocks efficiently.', 'medium'],
        ['Hard link vs soft link?', ['Hard link same inode; soft link pathname reference', 'Identical', 'Soft link same inode always', 'Hard link only for directories always allowed'], 0, 'Hard links share inode; symlinks store path to target.', 'hard'],
        ['Access control in Unix uses?', ['Permission bits user/group/other', 'Only MAC addresses', 'Only DNS', 'Only TCP ports'], 0, 'rwx bits control read write execute for u/g/o.', 'easy'],
        ['Mount operation does?', ['Attach filesystem to directory tree', 'Delete partition', 'Format disk always', 'Create process'], 0, 'Mount makes filesystem available at mount point path.', 'easy'],
      ],
    ]),
  },
];

// Import remaining subjects from compact banks file
const banks = require('./question-banks-compact');
SUBJECTS.push(...banks);

function esc(str) {
  return String(str).replace(/'/g, "''");
}

function toJsonOptions(opts) {
  return JSON.stringify(opts).replace(/'/g, "''");
}

function buildSql() {
  const lines = [];
  lines.push('-- Cognivex Question Bank Seed Data');
  lines.push('-- 9 subjects, 45 topics, 450 questions');
  lines.push('-- Run in Supabase SQL Editor');
  lines.push('');
  lines.push('BEGIN;');
  lines.push('DELETE FROM quiz_attempts;');
  lines.push('DELETE FROM user_learning_stats;');
  lines.push('DELETE FROM questions;');
  lines.push('DELETE FROM topics;');
  lines.push('DELETE FROM subjects;');
  lines.push('ALTER SEQUENCE IF EXISTS subjects_id_seq RESTART WITH 1;');
  lines.push('ALTER SEQUENCE IF EXISTS topics_id_seq RESTART WITH 1;');
  lines.push('ALTER SEQUENCE IF EXISTS questions_id_seq RESTART WITH 1;');
  lines.push('');

  lines.push('-- SUBJECTS');
  SUBJECTS.forEach((s, idx) => {
    lines.push(`INSERT INTO subjects (id, name, code) VALUES (${idx + 1}, '${esc(s.name)}', '${esc(s.code)}');`);
  });
  lines.push('');

  lines.push('-- TOPICS');
  let topicId = 1;
  SUBJECTS.forEach((s, sIdx) => {
    s.topics.forEach((name) => {
      lines.push(`INSERT INTO topics (id, subject_id, name) VALUES (${topicId}, ${sIdx + 1}, '${esc(name)}');`);
      topicId += 1;
    });
  });
  lines.push('');

  lines.push('-- QUESTIONS');
  SUBJECTS.forEach((s, sIdx) => {
    const subjectId = sIdx + 1;
    s.questions.forEach((item, qIdx) => {
      const topicIdForQ = sIdx * 5 + (Math.floor(qIdx / 10)) + 1;
      const [text, opts, correct, explanation, difficulty] = item;
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
const sql = buildSql();
fs.writeFileSync(outPath, sql, 'utf8');

const totalQ = SUBJECTS.reduce((n, s) => n + s.questions.length, 0);
console.log(`Subjects: ${SUBJECTS.length}, Questions: ${totalQ}`);
console.log(`Written: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
