"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { getTopicProgress, saveTopicProgress } from "@/lib/api"
import { Check, ArrowLeft, Brain, Sparkles, AlertTriangle } from "lucide-react"

// Hardcoded topics mapping for standard CS/IT subjects
const subjectsMapping: Record<string, { name: string; topics: { title: string; desc: string; highWeightage: boolean }[] }> = {
  dsa: {
    name: "Data Structures & Algorithms",
    topics: [
      { title: "Arrays & Strings", desc: "Linear data layouts, sliding window patterns, two-pointer strategies, and string parsing algorithms.", highWeightage: true },
      { title: "Linked Lists", desc: "Singly, doubly, and circular chains. Common operations, loop detection, and pointer swapping.", highWeightage: false },
      { title: "Stacks & Queues", desc: "LIFO/FIFO structures. Monotonic stacks, circular queues, and implementation of expression parsing.", highWeightage: false },
      { title: "Trees", desc: "Binary Trees, BSTs, Traversals (Pre/In/Post/Level), AVL trees, Trie insertions, and heaps.", highWeightage: true },
      { title: "Graphs", desc: "Adjacency representations. BFS, DFS, Dijkstra's algorithm, MST (Kruskal/Prim), and Cycle detection.", highWeightage: true },
      { title: "Dynamic Programming", desc: "Overlapping subproblems. Memoization vs Tabulation, Knapsack, LCS, and Grid traversal algorithms.", highWeightage: false }
    ]
  },
  os: {
    name: "Operating Systems",
    topics: [
      { title: "Process Management", desc: "Forking, process states, IPC, thread concurrency, semaphores, mutexes, and critical sections.", highWeightage: true },
      { title: "CPU Scheduling", desc: "FCFS, SJF, Priority scheduling, Round Robin, and Multi-level feedback queue implementations.", highWeightage: false },
      { title: "Deadlocks", desc: "Conditions for Deadlock, Banker's algorithm, Resource allocation graphs, and recovery procedures.", highWeightage: true },
      { title: "Memory Management", desc: "Paging, Segmentation, Translation Lookaside Buffer (TLB), Page replacement policies (FIFO, LRU, Optimal).", highWeightage: true },
      { title: "File Systems", desc: "Directory structures, file allocation methods (Continuous, Linked, Indexed), and disk scheduling.", highWeightage: false },
      { title: "Virtualization", desc: "Hypervisors, virtual machine architectures, containerization concepts, and cloud resource scaling.", highWeightage: false }
    ]
  },
  dbms: {
    name: "Database Management Systems",
    topics: [
      { title: "Entity-Relationship Model", desc: "Entities, attributes, relationships, Cardinality ratios, and conversion of ER to relational tables.", highWeightage: false },
      { title: "Relational Algebra", desc: "Selection, Projection, Joins (Theta, Equi, Natural, Outer), Cartesian product, and Set operations.", highWeightage: false },
      { title: "SQL Queries", desc: "Aggregate functions, Group By, Having, Subqueries, Correlated subqueries, and window functions.", highWeightage: true },
      { title: "Normalization", desc: "Functional dependencies, candidate key derivation, 1NF, 2NF, 3NF, BCNF, and lossless join testing.", highWeightage: true },
      { title: "Transactions & Concurrency", desc: "ACID properties, Serializability, conflict serializability, 2PL (Two-Phase Locking), and recovery protocols.", highWeightage: true },
      { title: "Indexing", desc: "Primary, secondary, clustered, and unclustered indexing. B Trees and B+ Trees query optimization.", highWeightage: false }
    ]
  },
  cn: {
    name: "Computer Networks",
    topics: [
      { title: "OSI Model", desc: "7 layers functionality, data encapsulation, protocols mapped to each layer (HTTP, TCP, IP, Ethernet).", highWeightage: false },
      { title: "TCP/IP Protocol Suite", desc: "TCP 3-way handshake, flow control (sliding window), congestion control algorithms, and UDP comparison.", highWeightage: true },
      { title: "Routing Algorithms", desc: "Unicast and Multicast routing. Link State (OSPF) vs Distance Vector (RIP) protocols, BGP.", highWeightage: true },
      { title: "IP Addressing & Subnets", desc: "Classful vs Classless addressing. VLSM, CIDR notations, and subnet mask calculations.", highWeightage: true },
      { title: "DNS & HTTP", desc: "Domain Name resolution, caching, HTTP request/response headers, keep-alive, SSL/TLS handshake.", highWeightage: false },
      { title: "Network Security", desc: "Symmetric and asymmetric cryptography, firewalls, VPNs, IDS/IPS, and preventing DDoS attacks.", highWeightage: false }
    ]
  },
  oop: {
    name: "Object Oriented Programming",
    topics: [
      { title: "Classes & Objects", desc: "Dynamic memory allocation, static variables, pointer to objects, and memory layouts.", highWeightage: false },
      { title: "Inheritance & Polymorphism", desc: "Single, Multiple, Hierarchical inheritance. Method overloading, overriding, virtual functions, and VTABLE.", highWeightage: true },
      { title: "Encapsulation & Abstraction", desc: "Access specifiers (Private, Protected, Public), data hiding, and abstract design patterns.", highWeightage: false },
      { title: "Constructors & Destructors", desc: "Default, parameterized, and copy constructors. Deep vs shallow copying, and virtual destructors.", highWeightage: false },
      { title: "Interface & Abstract Classes", desc: "Pure virtual functions, implementing multiple inheritance via interfaces, and abstract base structures.", highWeightage: true },
      { title: "Exception Handling", desc: "Try, catch, throw blocks, custom exceptions, stack unwinding, and resource cleanup.", highWeightage: true }
    ]
  },
  se: {
    name: "Software Engineering",
    topics: [
      { title: "Software Development Life Cycle (SDLC)", desc: "Waterfall, Spiral, V-Model, prototyping, incremental development paradigms comparison.", highWeightage: false },
      { title: "Agile & Scrum", desc: "User stories, sprints, daily standups, burn-down charts, roles (Scrum Master, Product Owner), and planning.", highWeightage: true },
      { title: "Software Architecture", desc: "Monolith vs Microservices, MVC (Model-View-Controller) design, client-server, and event-driven patterns.", highWeightage: false },
      { title: "Software Testing", desc: "Black-box vs White-box testing, Unit, Integration, System, Acceptance, regression testing and boundary value analysis.", highWeightage: true },
      { title: "Git & Version Control", desc: "Branching models (Gitflow), merge conflict resolution, rebasing, pull requests, and commit practices.", highWeightage: false },
      { title: "System Design Basics", desc: "Load balancing, horizontal scaling, caching strategies, CDNs, and microservices architecture.", highWeightage: true }
    ]
  }
};

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subjectSlug = (params?.subject as string) || "dsa";
  const subjectInfo = subjectsMapping[subjectSlug] || subjectsMapping.dsa;

  const [progress, setProgress] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchProgress() {
      try {
        const data = await getTopicProgress();
        setProgress(data || []);
      } catch (err) {
        console.error("Failed to load progress from DB, loading localStorage fallback", err);
        const saved = localStorage.getItem("cognivex_topic_progress");
        if (saved) {
          setProgress(JSON.parse(saved));
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, []);

  const handleToggle = async (topicTitle: string) => {
    const isCompleted = progress.some(t => t.subject === subjectInfo.name && t.topic === topicTitle && t.completed);
    const updatedCompleted = !isCompleted;

    // Optimistic UI state update
    const updatedProgress = [...progress];
    const index = updatedProgress.findIndex(t => t.subject === subjectInfo.name && t.topic === topicTitle);
    
    if (index > -1) {
      updatedProgress[index].completed = updatedCompleted;
    } else {
      updatedProgress.push({ subject: subjectInfo.name, topic: topicTitle, completed: updatedCompleted });
    }
    setProgress(updatedProgress);
    localStorage.setItem("cognivex_topic_progress", JSON.stringify(updatedProgress));

    try {
      await saveTopicProgress(subjectInfo.name, topicTitle, updatedCompleted);
    } catch (err) {
      console.error("Failed to sync checkbox state with database:", err);
    }
  };

  const isTopicDone = (topicTitle: string) => {
    return progress.some(t => t.subject === subjectInfo.name && t.topic === topicTitle && t.completed);
  };

  return (
    <DashboardLayout title={subjectInfo.name}>
      <div className="mb-8 flex items-center justify-between">
        <Button variant="ghost" className="flex items-center gap-2 text-foreground/70" onClick={() => router.push("/exam-prep")}>
          <ArrowLeft size={16} />
          <span>Back to Hub</span>
        </Button>
        <span className="text-xs font-semibold px-3 py-1 bg-secondary rounded-full border border-secondary text-foreground/70 uppercase tracking-wider">
          Subject Details
        </span>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">{subjectInfo.name}</h2>
        <p className="text-sm text-foreground/50 leading-relaxed max-w-2xl">
          Check off the topics as you learn them. Access placement practice exams, or consult the AI Mentor for dynamic weightage tips.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {subjectInfo.topics.map((topic, index) => {
            const completed = isTopicDone(topic.title);
            return (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
              >
                <Card className={`border border-secondary/40 shadow-sm transition-all duration-200 ${completed ? 'bg-primary/5 border-primary/20 opacity-85' : 'bg-card'}`}>
                  <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex gap-4 items-start flex-1">
                      <button 
                        onClick={() => handleToggle(topic.title)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all border-2 ${
                          completed 
                            ? 'bg-primary border-primary text-white' 
                            : 'bg-white hover:bg-orange-50 border-gray-200 text-transparent'
                        }`}
                      >
                        <Check size={14} strokeWidth={3} />
                      </button>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className={`font-bold text-base ${completed ? 'line-through text-foreground/50' : 'text-foreground'}`}>
                            {topic.title}
                          </h4>
                          {topic.highWeightage && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-md">
                              <AlertTriangle size={10} />
                              HIGH WEIGHTAGE
                            </span>
                          )}
                        </div>
                        <p className={`text-xs leading-relaxed ${completed ? 'text-foreground/40' : 'text-foreground/60'}`}>
                          {topic.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1.5 text-xs rounded-lg flex-1 md:flex-initial"
                        onClick={() => router.push('/practice')}
                      >
                        <Brain size={14} />
                        <span>Practice</span>
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex items-center gap-1.5 text-xs rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 flex-1 md:flex-initial shadow-sm"
                        onClick={() => router.push(`/ai-mentor?topic=${encodeURIComponent(topic.title)}&subject=${encodeURIComponent(subjectInfo.name)}`)}
                      >
                        <Sparkles size={14} />
                        <span>Ask AI</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
