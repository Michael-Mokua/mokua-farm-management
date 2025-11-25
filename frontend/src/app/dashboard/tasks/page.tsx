"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Circle, Clock, AlertTriangle, Zap, User, Calendar, X, Plus } from "lucide-react";

interface Task {
    _id: string;
    title: string;
    description: string;
    assignedTo: string | null;
    dueDate: string;
    priority: 'urgent' | 'high' | 'normal' | 'low';
    status: 'pending' | 'in-progress' | 'completed';
    category: string;
}

const FAMILY_MEMBERS = [
    { id: 'patrick', name: 'Patrick', color: 'bg-blue-500', avatar: '👨‍🌾' },
    { id: 'carolyne', name: 'Carolyne', color: 'bg-pink-500', avatar: '👩‍🌾' },
    { id: 'fadhili', name: 'Fadhili', color: 'bg-green-500', avatar: '👦' },
    { id: 'michael', name: 'Michael', color: 'bg-purple-500', avatar: '👦' },
];

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterAssignee, setFilterAssignee] = useState<string>('all');
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        priority: 'normal' as const,
        category: 'general'
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await api.get("/tasks");
            setTasks(data);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/tasks', newTask);
            setShowAddModal(false);
            setNewTask({
                title: '',
                description: '',
                assignedTo: '',
                dueDate: '',
                priority: 'normal',
                category: 'general'
            });
            fetchTasks();
        } catch (error) {
            console.error("Failed to create task", error);
        }
    };

    const toggleTaskComplete = async (id: string, currentStatus: string) => {
        try {
            if (currentStatus === 'completed') {
                await api.put(`/tasks/${id}`, { status: 'pending' });
            } else {
                await api.put(`/tasks/${id}/complete`);
            }
            fetchTasks();
        } catch (error) {
            console.error("Failed to toggle task", error);
        }
    };

    const assignTask = async (taskId: string, assignee: string) => {
        try {
            await api.put(`/tasks/${taskId}/assign`, { assignedTo: assignee });
            fetchTasks();
        } catch (error) {
            console.error("Failed to assign task", error);
        }
    };

    const getPriorityBadge = (priority: string) => {
        const config = {
            urgent: { icon: <Zap className="h-3 w-3" />, color: 'bg-red-100 text-red-700 border-red-300', label: 'Urgent' },
            high: { icon: <AlertTriangle className="h-3 w-3" />, color: 'bg-orange-100 text-orange-700 border-orange-300', label: 'High' },
            normal: { icon: <Clock className="h-3 w-3" />, color: 'bg-blue-100 text-blue-700 border-blue-300', label: 'Normal' },
            low: { icon: <Circle className="h-3 w-3" />, color: 'bg-gray-100 text-gray-700 border-gray-300', label: 'Low' },
        };
        const p = config[priority as keyof typeof config] || config.normal;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${p.color}`}>
                {p.icon}
                {p.label}
            </span>
        );
    };

    const getMemberAvatar = (memberId: string | null) => {
        if (!memberId) return null;
        const member = FAMILY_MEMBERS.find(m => m.id === memberId);
        if (!member) return null;
        return (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium ${member.color}`}>
                <span>{member.avatar}</span>
                <span>{member.name}</span>
            </div>
        );
    };

    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date();
    };

    const filteredTasks = tasks.filter(task => {
        if (filterStatus !== 'all' && task.status !== filterStatus) return false;
        if (filterAssignee !== 'all' && task.assignedTo !== filterAssignee) return false;
        return true;
    });

    const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        overdue: tasks.filter(t => t.status !== 'completed' && isOverdue(t.dueDate)).length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Family Tasks
                    </h1>
                    <p className="text-muted-foreground">Coordinate farm work across your family</p>
                </div>
                <Button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Task
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                        <Clock className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Circle className="h-5 w-5 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">{stats.overdue}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">Status:</Label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm bg-white hover:border-green-500 transition-colors"
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">Assigned to:</Label>
                    <select
                        value={filterAssignee}
                        onChange={(e) => setFilterAssignee(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm bg-white hover:border-green-500 transition-colors"
                    >
                        <option value="all">Everyone</option>
                        {FAMILY_MEMBERS.map(member => (
                            <option key={member.id} value={member.id}>{member.avatar} {member.name}</option>
                        ))}
                        <option value="">Unassigned</option>
                    </select>
                </div>
            </div>

            {/* Tasks Grid */}
            <div className="grid gap-4">
                {filteredTasks.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Circle className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No tasks found</p>
                        <p className="text-sm text-muted-foreground mt-1">Create a new task to get started</p>
                    </Card>
                ) : (
                    filteredTasks.map((task) => (
                        <Card
                            key={task._id}
                            className={`group hover:shadow-xl transition-all duration-300 hover:scale-[1.01] ${task.status === 'completed' ? 'opacity-60' : ''
                                } ${isOverdue(task.dueDate) && task.status !== 'completed' ? 'border-l-4 border-l-red-500' : ''}`}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => toggleTaskComplete(task._id, task.status)}
                                        className="mt-1 flex-shrink-0 hover:scale-110 transition-transform"
                                    >
                                        {task.status === 'completed' ? (
                                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                                        ) : (
                                            <Circle className="h-6 w-6 text-gray-400 hover:text-green-500" />
                                        )}
                                    </button>

                                    {/* Task Content */}
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                                                {task.title}
                                            </h3>
                                            {task.description && (
                                                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                                            )}
                                        </div>

                                        {/* Meta Info */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            {getPriorityBadge(task.priority)}

                                            {task.dueDate && (
                                                <span className={`flex items-center gap-1 text-sm ${isOverdue(task.dueDate) && task.status !== 'completed'
                                                        ? 'text-red-600 font-medium'
                                                        : 'text-muted-foreground'
                                                    }`}>
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(task.dueDate).toLocaleDateString()}
                                                    {isOverdue(task.dueDate) && task.status !== 'completed' && (
                                                        <span className="text-xs">(Overdue)</span>
                                                    )}
                                                </span>
                                            )}

                                            {task.category && (
                                                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                                                    {task.category}
                                                </span>
                                            )}
                                        </div>

                                        {/* Assignment */}
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            {task.assignedTo ? (
                                                <div className="flex items-center gap-2">
                                                    {getMemberAvatar(task.assignedTo)}
                                                    <select
                                                        value={task.assignedTo}
                                                        onChange={(e) => assignTask(task._id, e.target.value)}
                                                        className="text-sm border rounded px-2 py-1 hover:border-green-500 transition-colors"
                                                    >
                                                        {FAMILY_MEMBERS.map(member => (
                                                            <option key={member.id} value={member.id}>
                                                                {member.avatar} {member.name}
                                                            </option>
                                                        ))}
                                                        <option value="">Unassign</option>
                                                    </select>
                                                </div>
                                            ) : (
                                                <select
                                                    value=""
                                                    onChange={(e) => assignTask(task._id, e.target.value)}
                                                    className="text-sm border rounded px-3 py-1 text-muted-foreground hover:border-green-500 transition-colors"
                                                >
                                                    <option value="">Assign to...</option>
                                                    {FAMILY_MEMBERS.map(member => (
                                                        <option key={member.id} value={member.id}>
                                                            {member.avatar} {member.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Add Task Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-lg animate-in fade-in zoom-in duration-200">
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    Create New Task
                                </CardTitle>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-muted-foreground hover:text-foreground hover:bg-gray-100 p-2 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleAddTask} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Task Title *</Label>
                                    <Input
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        placeholder="e.g., Water the tomato field"
                                        required
                                        className="border-2 focus:border-green-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <textarea
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                        placeholder="Add details about the task..."
                                        className="w-full min-h-[80px] px-3 py-2 border-2 rounded-md focus:outline-none focus:border-green-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Priority *</Label>
                                        <select
                                            value={newTask.priority}
                                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                                            className="w-full h-10 px-3 border-2 rounded-md focus:outline-none focus:border-green-500"
                                        >
                                            <option value="low">🔵 Low</option>
                                            <option value="normal">⚪ Normal</option>
                                            <option value="high">🟠 High</option>
                                            <option value="urgent">🔴 Urgent</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Due Date *</Label>
                                        <Input
                                            type="date"
                                            value={newTask.dueDate}
                                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                            required
                                            className="border-2 focus:border-green-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Assign To</Label>
                                    <select
                                        value={newTask.assignedTo}
                                        onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                        className="w-full h-10 px-3 border-2 rounded-md focus:outline-none focus:border-green-500"
                                    >
                                        <option value="">Unassigned</option>
                                        {FAMILY_MEMBERS.map(member => (
                                            <option key={member.id} value={member.id}>
                                                {member.avatar} {member.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <select
                                        value={newTask.category}
                                        onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                                        className="w-full h-10 px-3 border-2 rounded-md focus:outline-none focus:border-green-500"
                                    >
                                        <option value="general">General</option>
                                        <option value="planting">Planting</option>
                                        <option value="harvesting">Harvesting</option>
                                        <option value="irrigation">Irrigation</option>
                                        <option value="livestock">Livestock</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                    >
                                        Create Task
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
