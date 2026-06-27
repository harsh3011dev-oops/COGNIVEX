INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'What is a process in an operating system?',
'["A program in execution","A program stored in secondary storage","A compilation unit","A CPU register status"]',
0,
'A process is defined as a program in execution, which includes the active state such as program counter and registers.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'Which of the following process states is entered when a process is waiting for some event (such as I/O completion)?',
'["Ready","Running","Waiting (Blocked)","Terminated"]',
2,
'A process enters the waiting or blocked state when it must wait for an event, such as I/O completion or signal reception.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'What is the Process Control Block (PCB)?',
'["A data structure containing process state and control information","A hardware block in CPU","A memory segmentation unit","A software library for multitasking"]',
0,
'The PCB is a kernel data structure that stores all information needed to manage a specific process (state, PC, registers, etc.).',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'What is the primary goal of a multiprogramming operating system?',
'["To maximize CPU utilization","To minimize total execution time of a single program","To reduce physical memory footprint","To allow users to run multiple threads on a single core"]',
0,
'Multiprogramming keeps multiple jobs in memory so that the CPU always has something to execute, maximizing CPU utilization.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'Which Unix system call is used to create a new child process?',
'["exec()","fork()","wait()","clone()"]',
1,
'The fork() system call creates a new child process by duplicating the calling parent process.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'What is a thread in the context of operating systems?',
'["A lightweight process and basic unit of CPU utilization","A security policy descriptor","A program segment that cannot be preempted","An isolated memory address space"]',
0,
'A thread is a lightweight process containing its own program counter, stack, and registers, but sharing the address space with other threads in the same process.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'What defines a zombie process in Unix-like operating systems?',
'["A process that has finished execution but still has an entry in the process table","A process that cannot be killed by any signal","A process waiting for disk I/O","An orphan process whose parent has terminated"]',
0,
'A zombie process is a process that has completed its execution (via exit) but still has an entry in the process table because its parent has not yet read its exit status using wait().',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'When a parent process terminates before its child process, what does the child process become in Unix?',
'["Zombie process","Orphan process","Daemon process","Kernel thread"]',
1,
'An orphan process is one whose parent has terminated. In Unix, orphan processes are automatically adopted by the init process (PID 1).',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'Which region of a process''s memory layout is dynamically allocated at runtime?',
'["Stack","Heap","Text segment","Data segment"]',
1,
'The heap is used for dynamic memory allocation (e.g., via malloc or new) at runtime.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'What occurs during a CPU context switch?',
'["The CPU saves the state of the current process and restores the state of the next process","The operating system formats the virtual memory table","A user switches accounts in the GUI","The hard disk changes from read to write mode"]',
0,
'A context switch is the kernel mechanism that saves CPU registers/state of a running process and loads the state of a ready process.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'Which of the following resources is NOT shared between threads of the same process?',
'["Address space","Open file descriptors","CPU registers and stack","Global variables"]',
2,
'Threads of the same process share code, data, heap, and open files, but each thread has its own private set of registers and stack.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'Which IPC mechanism provides the fastest communication on a single local host?',
'["Message passing","Pipes","Shared memory","Sockets"]',
2,
'Shared memory is the fastest IPC because it maps a memory segment into the address space of participating processes, avoiding kernel-space copy operations.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'What is a race condition in concurrent programming?',
'["A situation where multiple threads write to the same location, and the output depends on execution order","When two processes run at exactly the same clock speed","A scheduling state where processes compete for CPU cycles","An error caused by insufficient thread priority"]',
0,
'A race condition occurs when concurrent execution of multiple threads/processes on shared resources leads to outcomes that depend on the specific scheduling order.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'Which requirement of the critical section problem ensures that a process outside its critical section cannot block others from entering?',
'["Mutual Exclusion","Progress","Bounded Waiting","Atomicity"]',
1,
'The Progress requirement states that only processes not executing in their remainder sections can participate in deciding which process enters the critical section next.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'What is the purpose of Peterson''s solution?',
'["To solve the critical section problem for two processes in software","To allocate memory blocks dynamically","To schedule threads in real-time systems","To handle hardware interrupts"]',
0,
'Peterson''s solution is a classic software-based algorithm that solves the critical section problem for two processes, ensuring mutual exclusion, progress, and bounded waiting.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'Why can a blocking system call in a User-Level Thread (ULT) system be problematic?',
'["It blocks the entire process containing the thread","It causes physical memory corruption","It forces the kernel to crash","It disables interrupts globally"]',
0,
'Since the kernel is unaware of User-Level Threads, if a ULT executes a blocking system call, the kernel blocks the entire process, including all other threads in it.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'What does the ''Bounded Waiting'' requirement in the critical section problem guarantee?',
'["A limit exists on the number of times other processes can enter their critical sections after a process has requested entry","Each process will execute in its critical section for a bounded duration","A process can wait indefinitely if other processes are polite","Mutual exclusion is strictly enforced at all times"]',
0,
'Bounded waiting ensures that after a process makes a request to enter its critical section, there is a limit on the number of times other processes are allowed to enter their critical sections before that request is granted.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'In a Unix-like system, if a parent process opens a file descriptor and then calls fork(), what is the relationship between the parent''s and child''s file descriptors?',
'["They share the same file descriptor table entry and file offset","The child receives a copy with a separate, independent file offset","The child is blocked from reading or writing to that file descriptor","The parent''s file descriptor is automatically closed"]',
0,
'After fork(), the child inherits copies of the parent''s open file descriptors. They share the same underlying system-wide open file table entry, meaning they share the same file offset.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'How many total processes are created (including the initial parent process) after executing the following sequence: fork(); fork(); fork();?',
'["3","4","6","8"]',
3,
'Each fork doubles the number of processes. With 3 sequential forks, we get 2^3 = 8 processes in total.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 6, 'What is the key difference between the Unix system calls fork() and exec()?',
'["fork() creates a duplicate copy of the process; exec() replaces the current process image with a new program","fork() creates a new thread; exec() schedules that thread on the CPU","fork() allocates virtual memory; exec() maps physical memory frames","fork() is for kernel mode; exec() is only for user mode"]',
0,
'fork() creates a new child process which is a clone of the parent, while exec() overwrites the current process''s address space and runs a different program.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'Which hardware component is responsible for translating logical (virtual) addresses to physical addresses?',
'["Memory Management Unit (MMU)","Arithmetic Logic Unit (ALU)","Direct Memory Access (DMA) controller","Translation Lookaside Buffer (TLB) only"]',
0,
'The MMU is the hardware device that maps virtual memory addresses to physical RAM addresses at runtime.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'What is external fragmentation in memory management?',
'["When total memory is sufficient for a request but it is partitioned into non-contiguous blocks","When memory allocated to a process is slightly larger than the requested size","When the disk partition runs out of swap space","When the CPU cache fails to sync with RAM"]',
0,
'External fragmentation occurs when there is enough total free memory space to satisfy an allocation request, but the space is split into small, non-contiguous holes.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'What is internal fragmentation?',
'["Wasted memory space within a fixed-size allocated block","Unused memory blocks scattered between allocated processes","A failure in the page replacement algorithm","A page fault that cannot be resolved"]',
0,
'Internal fragmentation occurs when a process is allocated a fixed-size memory block (like a page frame) that is larger than the requested memory, leaving the excess space inside that block unused.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'In a paging memory management system, physical memory is divided into fixed-size blocks called:',
'["Frames","Pages","Segments","Sectors"]',
0,
'Physical memory is partitioned into fixed-size blocks called frames, while logical memory is partitioned into blocks of the same size called pages.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'Logical memory in a paging system is divided into blocks of equal size called:',
'["Pages","Frames","Segments","Partitions"]',
0,
'Logical memory is divided into pages, which are mapped to physical memory frames by the page table.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'What is a page fault?',
'["An event that occurs when a process references a page that is not present in physical memory","A physical error on the RAM chip","A logical error in the compiler''s offset calculations","An invalid pointer access that terminates the program immediately"]',
0,
'A page fault is an interrupt raised by hardware when a program accesses a page that is mapped in virtual address space but not loaded into physical RAM.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'Which hardware registers are used to implement basic memory protection in contiguous allocation?',
'["Base and Limit registers","Program Counter and Stack Pointer","Index and Segment registers","Instruction Register and Accumulator"]',
0,
'The base register holds the smallest legal physical memory address, and the limit register specifies the range size, protecting other processes'' memory.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'What is the function of the Translation Lookaside Buffer (TLB)?',
'["To cache virtual-to-physical address translations for faster lookup","To buffer disk pages before writing to RAM","To manage the execution queue of threads","To store the interrupt vector table"]',
0,
'The TLB is a fast associative hardware cache that stores recent virtual-to-physical page translations, reducing the need to access the page table in main memory.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'What is thrashing in virtual memory systems?',
'["A state of high paging activity where the system spends more time swapping pages than executing processes","A CPU state of executing instructions at maximum clock frequency","An error caused by writing to read-only page segments","A disk scheduling failure due to conflicting head requests"]',
0,
'Thrashing occurs when a process does not have enough frames in memory, causing it to page fault frequently. The OS spends all its time paging, leading to extremely low CPU utilization.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'In a system with a 32-bit virtual address space and a page size of 4 KB (2^12 bytes), how many bits are allocated for the page offset?',
'["12 bits","20 bits","32 bits","8 bits"]',
0,
'The page offset size is determined by the page size. Since 4 KB = 2^12 bytes, 12 bits are needed to address every byte within a page.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'What does the working-set model attempt to resolve in virtual memory management?',
'["Determining the minimum number of frames a process needs to avoid thrashing","Selecting the next page to swap to disk using future references","Optimizing the layout of files on secondary storage","Coordinating page tables across multiple CPU cores"]',
0,
'The working-set model defines the set of pages a process has referenced recently to approximate its locality, helping the OS allocate enough frames to prevent thrashing.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'Which of the following page replacement algorithms can exhibit Belady''s anomaly?',
'["First-In, First-Out (FIFO)","Least Recently Used (LRU)","Optimal Page Replacement (OPT)","Least Frequently Used (LFU) using stack"]',
0,
'Belady''s anomaly is the phenomenon where the page-fault rate increases as the number of allocated physical frames increases. FIFO is a well-known algorithm that suffers from this anomaly.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'What is the Copy-on-Write (COW) optimization?',
'["A technique that allows parent and child processes to share the same physical pages until one writes to them","A hardware routine to backup RAM pages to disk continuously","A compiler optimization that duplicates code loops","A thread synchronization lock for shared data files"]',
0,
'COW allows parent and child processes to initially share the same pages in memory. If either process writes to a page, a private copy of that page is created for the writing process.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'What is a key structural advantage of Segmentation over Paging?',
'["Segmentation maps to a user''s logical view of program components, whereas paging is invisible to users","Segmentation completely eliminates internal and external fragmentation","Segmentation does not require hardware address translation","Segmentation uses fixed-size blocks which simplifies hardware design"]',
0,
'Segmentation allows memory to be viewed as a collection of variable-length segments reflecting logical structures (functions, objects, stacks), fitting the programmer''s view.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'How does a multi-level page table structure reduce page table memory overhead in sparse address spaces?',
'["It avoids allocating page tables for unmapped virtual address regions","It compresses page table entries using a hashing algorithm","It stores all page tables on secondary storage instead of physical memory","It uses physical frame indexes instead of virtual page indexes"]',
0,
'In a multi-level page table, if a large part of the virtual address space is unused, the corresponding second-level (or lower-level) page tables do not need to be allocated in memory.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'Consider a logical address space of 64 pages of 1024 words each, mapped onto physical memory of 32 frames. How many bits are in the logical address and physical address respectively?',
'["Logical: 16 bits, Physical: 15 bits","Logical: 15 bits, Physical: 16 bits","Logical: 16 bits, Physical: 16 bits","Logical: 12 bits, Physical: 10 bits"]',
0,
'Logical space = 64 pages * 1024 words = 2^6 * 2^10 = 2^16 words (needs 16 bits). Physical memory = 32 frames * 1024 words = 2^5 * 2^10 = 2^15 words (needs 15 bits).',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'A system uses 46-bit virtual addresses and a page size of 8 KB (2^13 bytes). If each page table entry (PTE) requires 4 bytes, what is the size of a conventional single-level page table?',
'["32 GB","8 GB","4 GB","16 MB"]',
0,
'Number of pages = 2^46 / 2^13 = 2^33 pages. Single-level page table size = Number of pages * PTE size = 2^33 * 4 bytes = 2^35 bytes = 32 GB.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'What is an inverted page table?',
'["A page table that has one entry for each physical frame in memory","A page table that maps physical addresses back to virtual addresses for debugging","A stack-based page table designed for LIFO execution","A cache memory placed inside the CPU for virtual translations"]',
0,
'An inverted page table has one entry for each real page (frame) of memory. This drastically reduces page table size for very large virtual address spaces.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'Consider a paging system where page table lookup in memory takes 100 ns. The system has a TLB with access time of 20 ns. If the TLB hit ratio is 90%, what is the Effective Access Time (EAT) for a memory reference?',
'["130 ns","120 ns","110 ns","220 ns"]',
0,
'EAT = Hit_ratio * (TLB_access + Mem_access) + Miss_ratio * (TLB_access + 2 * Mem_access) = 0.90 * (20 + 100) + 0.10 * (20 + 200) = 0.90 * 120 + 0.10 * 220 = 108 + 22 = 130 ns.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 7, 'Why do ''stack algorithms'' (such as Least Recently Used and Optimal page replacement) never exhibit Belady''s anomaly?',
'["The set of pages in memory for n frames is always a subset of the pages in memory for n+1 frames","They use a hardware stack that limits page allocations","They execute in O(1) time regardless of physical frame count","They are deterministic algorithms that utilize future page references"]',
0,
'A stack algorithm has the property that the set of pages in a memory of size n is always a subset of the pages in a memory of size n+1. This containment property mathematically prevents Belady''s anomaly.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'Which CPU scheduling algorithm is non-preemptive and executes processes in their order of arrival?',
'["First-Come, First-Served (FCFS)","Round Robin (RR)","Shortest Job First (SJF)","Priority Scheduling"]',
0,
'FCFS schedules processes in the order they request the CPU (FIFO queue), and is strictly non-preemptive.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'How is Turnaround Time of a process defined in scheduling?',
'["The interval from the time of submission of a process to the time of its completion","The total time a process spends waiting in the ready queue","The time a process spends executing on the CPU","The time from process submission until the first response is produced"]',
0,
'Turnaround Time = Completion Time - Arrival Time. It represents the total time a process spends in the system.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'How is Waiting Time of a process defined?',
'["The total time a process spends waiting in the ready queue","The time the process spends executing on the CPU","The time spent performing I/O operations","The interval between process arrival and its first CPU slice allocation"]',
0,
'Waiting Time = Turnaround Time - Burst Time. It is the accumulated time a process spends in the ready queue.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'Which scheduler is responsible for selecting processes from the disk queue and loading them into memory for execution?',
'["Long-term scheduler (Job scheduler)","Short-term scheduler (CPU scheduler)","Medium-term scheduler","Dispatcher"]',
0,
'The long-term scheduler controls the degree of multiprogramming by selecting jobs from the input queue and loading them into memory.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'What is the time quantum in Round Robin (RR) CPU scheduling?',
'["The maximum contiguous time slot a process is allowed to run on the CPU before preemption","The overhead time needed for a context switch","The total time required for a process to complete its execution","The arrival rate interval of processes in the ready queue"]',
0,
'The time quantum (or time slice) is a small unit of time (e.g., 10 to 100 milliseconds) allocated to a process in Round Robin.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'What is a major risk associated with static Priority Scheduling?',
'["Starvation (Indefinite blocking) of low-priority processes","High CPU utilization overhead","Excessive disk thrashing","Convoy effect in ready queues"]',
0,
'A major problem with priority scheduling is indefinite blocking or starvation, where low-priority processes wait indefinitely if high-priority processes keep arriving.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'How is Response Time defined in CPU scheduling?',
'["The time from process submission until the first output or CPU execution response is produced","The total time from arrival to process termination","The time spent waiting in the ready queue before execution starts","The time taken to swap a process out to disk"]',
0,
'Response time is the time from process submission until the first CPU response is received, which is highly relevant in interactive systems.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'Which scheduling algorithm is theoretically optimal for minimizing average waiting time of a set of stationary processes?',
'["Shortest Job First (SJF)","First-Come, First-Served (FCFS)","Round Robin (RR)","Priority Scheduling"]',
0,
'SJF scheduling is optimal because it associates with each process the length of its next CPU burst, yielding the minimum average waiting time for a given set of processes.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'What is the convoy effect in FCFS CPU scheduling?',
'["Short processes are delayed in the ready queue behind a single long CPU-bound process","Multiple processes are executed in parallel across cores","High priority processes preempt low priority processes continuously","Deadlock occurs when processes share devices"]',
0,
'The convoy effect occurs when a CPU-bound process holds the CPU, causing I/O-bound processes to wait in the ready queue. When the CPU-bound process releases the CPU, all I/O-bound processes finish their short CPU bursts quickly and block on I/O again, leaving the CPU idle.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'How does the technique of ''aging'' prevent starvation in Priority Scheduling?',
'["By gradually increasing the priority of processes that wait in the system for a long time","By dynamically increasing the CPU time quantum","By terminating processes that exceed execution limits","By periodically flushing the CPU cache"]',
0,
'Aging is a technique that gradually increases the priority of processes that wait in the ready queue for a long time, guaranteeing they will eventually obtain the highest priority and execute.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'What is the primary operational difference between preemptive and non-preemptive scheduling?',
'["Preemptive scheduling can interrupt a running process to switch to another; non-preemptive runs a process until it completes or blocks","Preemptive scheduling requires multiple CPU cores; non-preemptive does not","Non-preemptive scheduling is only used for real-time systems","Preemptive scheduling cannot cause starvation"]',
0,
'Preemptive scheduling allows the OS to take the CPU away from a running process (e.g., due to timer interrupt or higher priority arrival), while non-preemptive scheduling lets the process run until it voluntarily yields.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'If the time quantum in a Round Robin scheduling algorithm is set to be extremely large (larger than any burst time), how does it behave?',
'["Like First-Come, First-Served (FCFS) scheduling","Like Shortest Job First (SJF) scheduling","Like Multilevel Feedback Queue scheduling","Like a random queue scheduler"]',
0,
'If the time quantum is extremely large, the processes will run to completion without being preempted, making the scheduler behave exactly like FCFS.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'What is the main disadvantage of selecting an extremely small time quantum in Round Robin scheduling?',
'["High context-switching overhead relative to CPU execution time","Starvation of long-running processes","Conversion of the algorithm to FCFS behavior","Inability to schedule interactive processes"]',
0,
'A very small time quantum leads to frequent context switches, consuming a significant portion of CPU time for scheduling overhead rather than useful work.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'How does a Multilevel Feedback Queue (MLFQ) scheduler differ from a standard Multilevel Queue scheduler?',
'["MLFQ allows processes to move dynamically between queues based on their behavior","MLFQ has only one queue but uses multiple priorities","MLFQ is strictly non-preemptive","MLFQ does not support time-slicing"]',
0,
'In a standard Multilevel Queue, processes are permanently assigned to a queue. MLFQ allows processes to move between queues (e.g., demoting CPU-bound jobs and promoting I/O-bound jobs) to optimize performance.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'In real-time systems, what is the priority assignment rule for Rate-Monotonic (RM) scheduling?',
'["Task priority is inversely proportional to its period (shorter period = higher priority)","Task priority is directly proportional to its execution time","Task priority is dynamically updated based on the nearest deadline","Tasks are scheduled purely in FIFO order"]',
0,
'Rate-Monotonic scheduling is a static priority algorithm where tasks with shorter periods (higher frequencies) are assigned higher priorities.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'Consider three processes P1, P2, and P3 arriving at time 0 with CPU burst times of 10, 4, and 2 respectively. Under preemptive Shortest Remaining Time First (SRTF), what is the average waiting time?',
'["2.67","2.0","4.0","5.33"]',
0,
'P3 runs first (0 to 2), then P2 (2 to 6), and finally P1 (6 to 16). Waiting times: P3 = 0, P2 = 2, P1 = 6. Average waiting time = (0 + 2 + 6) / 3 = 8 / 3 = 2.67.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'Which of the following scheduling algorithms is guaranteed to prevent starvation under all circumstances?',
'["Round Robin (RR)","Shortest Remaining Time First (SRTF)","Non-preemptive Priority Scheduling","Shortest Job First (SJF)"]',
0,
'Round Robin gives every process an equal opportunity to execute within a bounded time quantum, preventing starvation.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'For a set of n independent periodic tasks, what is the CPU utilization bound for Rate Monotonic (RM) scheduling above which schedulability is NOT guaranteed?',
'["n * (2^(1/n) - 1)","0.5","1.0","n * (2^n - 1)"]',
0,
'The scheduling bound for RM is U = n(2^(1/n) - 1). For large n, this approaches ln(2) ≈ 0.693, meaning any task set with CPU utilization below 69.3% is guaranteed to be schedulable.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'Four processes P1, P2, P3, and P4 arrive at time 0 with CPU burst times of 8, 4, 9, and 5 respectively. If scheduled using Round Robin with a quantum of 4, what is the completion order?',
'["P2, P1, P4, P3","P2, P4, P1, P3","P1, P2, P3, P4","P2, P1, P3, P4"]',
0,
'Queue cycle 1: P1 (runs 4, rem 4), P2 (runs 4, finishes at 8), P3 (runs 4, rem 5), P4 (runs 4, rem 1). Queue cycle 2: P1 (runs 4, finishes at 16), P3 (runs 4, rem 1), P4 (runs 1, finishes at 17). Cycle 3: P3 (runs 1, finishes at 26). Completion order: P2, P1, P4, P3.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 8, 'What is the core difference between Rate-Monotonic (RM) and Earliest Deadline First (EDF) scheduling?',
'["RM uses static priority based on period; EDF uses dynamic priority based on absolute deadline","RM is preemptive; EDF is strictly non-preemptive","RM is for batch systems; EDF is for interactive systems","RM guarantees 100% CPU utilization schedulability; EDF does not"]',
0,
'RM is a static priority algorithm (priorities do not change during execution), whereas EDF is dynamic (priorities change based on which task has the closest absolute deadline). EDF can achieve up to 100% utilization.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'What is a deadlock in an operating system?',
'["A state where a set of processes are blocked because each process is holding a resource and waiting for another resource held by some other process","A software bug that causes the system to reboot","A condition where a thread consumes 100% CPU time in an infinite loop","A network collision that drops all data packets"]',
0,
'A deadlock is a situation where two or more processes are unable to proceed because each is waiting for a resource held by another.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'How many necessary conditions (Coffman conditions) must hold simultaneously for a deadlock to occur?',
'["4","3","2","5"]',
0,
'For a deadlock to occur, four conditions must hold simultaneously: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'Which deadlock condition states that a resource can only be held by one process at a time?',
'["Mutual Exclusion","Hold and Wait","No Preemption","Circular Wait"]',
0,
'Mutual Exclusion requires that at least one resource is held in a non-sharable mode; only one process can use it at a time.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'The Banker''s algorithm is primarily used for which deadlock handling strategy?',
'["Deadlock Avoidance","Deadlock Prevention","Deadlock Detection","Deadlock Recovery"]',
0,
'The Banker''s algorithm is a classic deadlock avoidance algorithm that dynamically checks if granting resources keeps the system in a safe state.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'What does the ''Circular Wait'' condition in deadlocks describe?',
'["A closed chain of processes where each process holds resources needed by the next process","A CPU scheduling queue that runs processes in a circle","A loop in a programming language that never terminates","A round-robin memory allocation buffer"]',
0,
'Circular Wait means a set of waiting processes {P0, P1, ..., Pn} exists such that P0 is waiting for a resource held by P1, P1 is waiting for P2, and Pn is waiting for P0.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'What is the simplest and most common method of resolving a detected deadlock in desktop operating systems?',
'["Aborting one or more deadlocked processes","Re-allocating CPU priorities","Increasing physical RAM memory size","Disabling hardware interrupts"]',
0,
'The simplest way to recover from a deadlock is to abort one or more processes to break the dependency cycle.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'In a Resource Allocation Graph (RAG) where all resource types have a single instance, what does a cycle imply?',
'["A deadlock exists","A deadlock may exist but is not guaranteed","The system is in a safe state","A process is starving"]',
0,
'For single-unit resource systems, a cycle in the resource allocation graph is a necessary and sufficient condition for deadlock.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'What is the fundamental difference between Deadlock Prevention and Deadlock Avoidance?',
'["Prevention breaks one of the four Coffman conditions; Avoidance uses dynamic checks of maximum resource needs","Prevention detects deadlocks after they happen; Avoidance prevents them from ever happening","Prevention requires multiple processors; Avoidance works on single cores","Prevention uses software locks; Avoidance uses hardware interrupts"]',
0,
'Deadlock prevention forces the system design to make deadlock impossible by breaking at least one of the 4 conditions. Avoidance decides dynamically whether to grant a resource based on future claim safety.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'If a system is in an unsafe state, does it mean a deadlock has occurred?',
'["No, it only means the system could potentially deadlock if processes request their maximum resource claims","Yes, an unsafe state is mathematically equivalent to a deadlock state","No, it means the operating system will crash in the next cycle","Yes, it means at least one process is in a zombie state"]',
0,
'An unsafe state is not a deadlock. It simply means the OS cannot guarantee that all processes can finish without deadlocking if they all request their worst-case maximum resource limits.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'How can the ''Hold and Wait'' condition be prevented in operating systems?',
'["Require processes to request all resources at once before starting execution","Allow processes to preempt resources from lower priority jobs","Use virtual memory instead of physical memory allocation","Use a FIFO scheduling queue for resource requests"]',
0,
'To prevent Hold and Wait, the system can require a process to request and be allocated all its resources before it begins execution, or to release currently held resources before requesting new ones.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'How can the ''No Preemption'' deadlock condition be prevented?',
'["If a process holding resources is denied a new request, it must release all its currently held resources","Forcibly terminate any process that holds a resource for more than 1 second","Only allow read-only resources in the system","Require all locks to be binary mutexes"]',
0,
'No preemption is prevented by allowing the OS to preempt resources: if a process holding resources requests another that cannot be immediately allocated, all its current resources are released and added to the pool.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'What is a ''wait-for'' graph in deadlock detection?',
'["A directed graph showing dependencies directly between processes, derived by removing resource nodes from a RAG","A plot of average process waiting time against CPU utilization","A queue diagram displaying threads waiting for CPU scheduling","A memory map of processes waiting in swap space"]',
0,
'A wait-for graph is a simplified version of the resource allocation graph used for single-unit resources, where resource nodes are collapsed and edges go directly from process Pi (waiting) to Pj (holding).',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'Which deadlock recovery method involves taking a resource away from one process and giving it to another?',
'["Resource Preemption","Process Termination","Resource Allocation Graph reduction","Context Switching"]',
0,
'Resource Preemption retrieves resources from processes and allocates them to other processes until the deadlock cycle is broken.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'What three issues must be addressed when implementing deadlock recovery via resource preemption?',
'["Selecting a victim, rollback mechanism, and preventing starvation","Mutex locking, thread creation, and process priority","Memory allocation, page replacement, and TLB invalidation","Disk head positioning, seek time, and rotational latency"]',
0,
'Preemption requires deciding which process to take resources from (selecting a victim), returning the victim to a safe state (rollback), and ensuring it does not always get selected (preventing starvation).',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'If a Resource Allocation Graph contains a cycle but resources have multiple instances, what can be concluded?',
'["A deadlock may exist, but further analysis is required to confirm","A deadlock definitely exists","The system is guaranteed to be in a safe state","No deadlock exists"]',
0,
'A cycle in a multi-instance resource graph is a necessary but NOT sufficient condition for deadlock. It indicates a deadlock might exist, but some processes might be able to release resources and resolve it.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'Suppose a system has 12 units of resource R. There are three processes P0, P1, and P2 with maximum claims of 10, 4, and 9 respectively. If P0 currently holds 5, P1 holds 2, and P2 holds 2, is the system in a safe state?',
'["Yes, because there is an execution sequence (P1, P0, P2) that allows all to finish","No, because the remaining resources cannot satisfy any process need","Yes, because the remaining resources are exactly equal to P0''s need","No, because P2''s claim exceeds the total available resource units"]',
0,
'Total allocated = 5+2+2 = 9. Remaining = 12-9 = 3. Remaining needs: P0 = 5, P1 = 2, P2 = 7. Since remaining (3) >= P1''s need (2), P1 can finish and release its 2 units, making available = 5. Now available (5) >= P0''s need (5), P0 can finish and release 5, making available = 10, satisfying P2''s need of 7. The state is safe.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'A system has ''m'' identical resource units shared by ''n'' processes. If each process requires at most ''k'' units, what is the minimum value of ''m'' to guarantee that a deadlock will never occur?',
'["n * (k - 1) + 1","n * k","n * (k - 1)","(n - 1) * k + 1"]',
0,
'The worst-case scenario where processes are blocked but not deadlocked is when each process holds k-1 resources and waits for 1 more. Total held = n * (k-1). If we add 1 resource to the system, at least one process can finish. So minimum resources needed is n*(k-1) + 1.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'In the Banker''s algorithm, what does the ''Need'' matrix represent and how is it calculated?',
'["Need[i][j] = Max[i][j] - Allocation[i][j], representing remaining resources a process may request","Need[i][j] = Max[i][j] + Allocation[i][j], representing total resources allocated","Need[i][j] = Available[j] - Allocation[i][j], representing resources free to allocate","Need[i][j] = Allocation[i][j] - Available[j], representing resource deficits"]',
0,
'The Need matrix is calculated as Max minus Allocation for each process and resource type, showing the maximum resources a process can still request.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'If a system is in an unsafe state, which of the following statements is true?',
'["The operating system cannot prevent processes from requesting resources that could lead to a deadlock","A deadlock has definitely occurred","The system will eventually crash","At least one process is a zombie"]',
0,
'An unsafe state is not a deadlock, but it means that the operating system cannot prevent processes from making a sequence of requests that eventually leads to a deadlock.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 9, 'In deadlock recovery, why is rollback of a process to a checkpoint preferred over restarting the process from the beginning?',
'["It minimizes the amount of lost computation by resuming from a saved intermediate state","It completely avoids the need to select a victim process","It does not release any resources held by the process","It changes the process''s resource allocation graph structure dynamically"]',
0,
'Rollback to a checkpoint allows the process to resume execution from a saved consistent intermediate state, saving the computational work done prior to that checkpoint.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'What does the term ''metadata'' of a file refer to in a file system?',
'["The actual content or data bytes written inside the file","Data about the file such as size, permissions, owner, and timestamps","The physical sectors on the disk where the file is stored","The name and folder path of the file"]',
1,
'Metadata is ''data about data'', storing attributes like permissions, size, creation date, and block pointers, excluding the file''s content itself.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'What is a directory in a typical file system structure?',
'["A special file containing mappings of file names to their corresponding inode or block identifiers","A hardware partition on a solid-state drive","A software library used to compress data blocks","A cache memory that stores open file data"]',
0,
'A directory is structured as a file containing a list of filename-to-identifier (e.g., inode number) mappings.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'Which file block allocation method is the simplest and stores blocks in a contiguous sequence on the disk?',
'["Contiguous Allocation","Linked Allocation","Indexed Allocation","FAT allocation"]',
0,
'Contiguous allocation stores each file as a contiguous set of disk blocks, making it simple but prone to external fragmentation.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'What is a sector in a magnetic disk drive?',
'["The smallest addressable physical unit of storage on a track","A logical folder in the file system structure","A group of tracks on a single platter surface","The arm that holds the read-write heads"]',
0,
'A sector is the smallest physical storage unit on a magnetic disk platter, typically holding 512 bytes or 4 KB.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'What is the primary purpose of a File Control Block (FCB) or Inode?',
'["To store the file''s metadata and pointers to its data blocks","To link files to network directory servers","To map file extensions to default opening applications","To cache physical sectors in memory"]',
0,
'The FCB (or inode in Unix) is a database record storing file attributes, size, permissions, ownership, and pointers to the physical data blocks.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'In a Unix file system, what is a symbolic (soft) link?',
'["A special file containing the text path of another target file","An exact duplicate of the file content on disk","A pointer sharing the same inode number as the original file","A hidden directory entry used for backups"]',
0,
'A symbolic link (symlink) is a file whose content is the path name of another file. Deleting the target makes the symlink a ''dangling'' link.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'What does RAID level 0 provide?',
'["Block-level striping of data across disks without redundancy","Disk mirroring for data backup","Byte-level striping with dedicated parity disks","Block-level striping with distributed parity"]',
0,
'RAID 0 stripes data across multiple disks to increase performance, but provides zero redundancy or fault tolerance.',
'easy');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'What is the main disadvantage of Linked File Allocation?',
'["It does not support efficient random or direct access to files","It causes high external fragmentation on the disk","It requires pre-declaring the maximum file size at creation","It does not support directories"]',
0,
'In linked allocation, blocks are scattered, and each block contains a pointer to the next. To read block N, the system must traverse the first N-1 blocks sequentially, making random access very slow.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'How does Indexed File Allocation solve the issues of contiguous and linked allocations?',
'["It gathers all pointers to data blocks into an index block, supporting direct access without external fragmentation","It compresses file data dynamically using LZW","It mirrors data blocks across two separate physical drives","It uses a central File Allocation Table in memory"]',
0,
'Indexed allocation assigns each file an index block containing pointers to its data blocks, allowing direct access without fragmentation.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'What is the purpose of a Journaling File System?',
'["To write metadata updates to a log before executing them to ensure consistency in case of a system crash","To track the history of user edits in a text document","To compress disk blocks dynamically","To schedule antivirus scans automatically"]',
0,
'Journaling logs metadata changes to a dedicated journal before applying them to the file system structure, enabling fast recovery to a consistent state after a crash.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'What is the difference between a Hard Link and a Soft (Symbolic) Link in Unix?',
'["A Hard Link shares the same inode as the target file; a Soft Link is a separate file containing the target''s pathname","A Hard Link can cross different filesystems; a Soft Link cannot","Deleting the original file breaks a Hard Link, but a Soft Link survives","Hard Links are only used for directories; Soft Links only for files"]',
0,
'Hard links point directly to the same inode, meaning the file exists as long as there is at least one hard link. Soft links are paths; if the target file is deleted, the soft link breaks.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'How does a free-space bitmap represent blocks on a disk?',
'["Using 1 bit per block, where 0 indicates free and 1 indicates allocated","Using a linked list of free block numbers","Using a hash table of file descriptors","Using an array of inode numbers"]',
0,
'A bitmap uses one bit per disk block to track its state, making it easy to find contiguous free blocks.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'What is the role of the mount operation in file systems?',
'["It attaches a filesystem to a directory point in the system''s active directory tree","It formats a new partition with a filesystem structure","It checks a disk partition for errors and inconsistencies","It copies all files from one drive to another"]',
0,
'Mounting makes a filesystem on a storage device accessible by attaching it to a specific directory (the mount point) in the system''s file hierarchy.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'Which RAID level uses block-level striping with distributed parity across all disks?',
'["RAID 5","RAID 0","RAID 1","RAID 4"]',
0,
'RAID 5 stripes data and parity blocks across three or more disks, providing fault tolerance with lower storage overhead than mirroring.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'What is internal fragmentation in the context of file systems?',
'["The wasted space in the last block of a file when the file size is not a multiple of the block size","The unused blocks scattered between files on a disk","The overhead of storing file metadata in the inode table","The loss of sector markers on a corrupted disk track"]',
0,
'If a file is allocated in fixed-size blocks (e.g., 4 KB blocks) and its size is 5 KB, it needs 2 blocks (8 KB), leaving 3 KB wasted inside the second block. This is internal fragmentation.',
'medium');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'In a Unix file system, an inode has 12 direct block pointers, 1 single indirect pointer, 1 double indirect pointer, and 1 triple indirect pointer. If the block size is 4 KB and a block pointer is 4 bytes, what is the maximum file size?',
'["Approximately 4 TB","Approximately 4 GB","Approximately 16 GB","Approximately 256 MB"]',
0,
'A block contains 4 KB / 4 bytes = 1024 pointers. Direct: 12 blocks = 48 KB. Single indirect: 1024 blocks = 4 MB. Double indirect: 1024^2 blocks = 4 GB. Triple indirect: 1024^3 blocks = 4 TB. Total is ~4.004 TB.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'Consider a disk queue with requests for blocks: 98, 183, 37, 122, 14, 124, 65, 67. The read-write head is initially at block 53. Under the Shortest Seek Time First (SSTF) disk scheduling algorithm, what is the total head movement in blocks?',
'["236","322","183","208"]',
0,
'Path of head: 53 -> 65 (dist 12) -> 67 (dist 2) -> 37 (dist 30) -> 14 (dist 23) -> 98 (dist 84) -> 122 (dist 24) -> 124 (dist 2) -> 183 (dist 59). Total seek distance = 12 + 2 + 30 + 23 + 84 + 24 + 2 + 59 = 236.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'In directory implementation, what is the main advantage of using a hash table over a linear list for storing file entries?',
'["O(1) search and insertion time regardless of the number of files","Complete elimination of filename collisions","Automatic sorted ordering of filenames","Lower memory usage"]',
0,
'A hash table uses a hash function on the filename to find the directory entry in O(1) average time, compared to O(N) linear search on a list. However, handling collisions is required.',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'In a Unix-like operating system, what happens to the physical disk blocks of a file when a process deletes it (calls unlink) while another process has it open?',
'["The directory entry is removed immediately, but the inode and data blocks are retained until the opening process closes the file","The file is immediately deleted, causing read/write errors for the opening process","The unlink call is blocked and fails with an error","The file content is moved to a temporary swap space on the system drive"]',
0,
'In Unix, unlink removes the directory entry immediately. However, the system keeps the inode and data blocks active until the reference count of open file descriptors to that inode reaches zero (i.e., when all processes close it).',
'hard');

INSERT INTO questions 
(subject_id, topic_id, question, options, correct_answer, explanation, difficulty) 
VALUES 
(2, 10, 'Which disk scheduling algorithm sweeps back and forth across the tracks, servicing requests in both directions, but only travels as far as the outermost and innermost requested tracks before reversing?',
'["LOOK","SCAN","C-SCAN","C-LOOK"]',
0,
'LOOK is a variation of SCAN (Elevator). While SCAN goes all the way to the end of the disk platter regardless of requests, LOOK reverses direction immediately when there are no more requests in the current direction.',
'hard');