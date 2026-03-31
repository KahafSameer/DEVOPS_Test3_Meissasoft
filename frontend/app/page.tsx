'use client';

import { useEffect, useState, FormEvent } from 'react';
import axios from 'axios';

type Todo = {
  id: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdAt: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Todo[]>(`${API_BASE_URL}/todos`);
      setTodos(res.data);
    } catch (error) {
      console.error('Failed to fetch todos', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setCreating(true);
      await axios.post(`${API_BASE_URL}/todos`, {
        title,
        description: description || null,
      });
      setTitle('');
      setDescription('');
      await fetchTodos();
    } catch (error) {
      console.error('Failed to create todo', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Failed to delete todo', error);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const updated = { ...todo, isCompleted: !todo.isCompleted };
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? updated : t)),
      );
      await axios.patch(`${API_BASE_URL}/todos/${todo.id}`, {
        isCompleted: updated.isCompleted,
      });
    } catch (error) {
      console.error('Failed to update todo', error);
      // revert on error
      setTodos((prev) =>
        prev.map((t) =>
          t.id === todo.id ? { ...t, isCompleted: todo.isCompleted } : t,
        ),
      );
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (activeFilter === 'active') return !todo.isCompleted;
    if (activeFilter === 'completed') return todo.isCompleted;
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center">Smart ToDo List</h1>
        <p className="text-center text-slate-400 mb-6 text-sm">
          Track tasks, focus on what matters, and keep your day under control.
        </p>

        <form
          onSubmit={handleAddTodo}
          className="bg-slate-800 rounded-xl p-4 mb-6 shadow-lg space-y-3"
        >
          <input
            type="text"
            placeholder="Todo title"
            className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description (optional)"
            className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            type="submit"
            disabled={creating || !title.trim()}
            className="w-full py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed font-semibold transition"
          >
            {creating ? 'Adding...' : 'Add Todo'}
          </button>
        </form>

        <section className="bg-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex flex-col gap-3 mb-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Todos</h2>
              <p className="text-xs text-slate-400">
                {todos.length} total ·{' '}
                {todos.filter((t) => !t.isCompleted).length} active ·{' '}
                {todos.filter((t) => t.isCompleted).length} completed
              </p>
            </div>
            <div className="flex gap-2 self-start">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-full text-xs border transition ${
                  activeFilter === 'all'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                    : 'border-slate-600 text-slate-300 hover:border-emerald-500/70'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('active')}
                className={`px-3 py-1 rounded-full text-xs border transition ${
                  activeFilter === 'active'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                    : 'border-slate-600 text-slate-300 hover:border-emerald-500/70'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveFilter('completed')}
                className={`px-3 py-1 rounded-full text-xs border transition ${
                  activeFilter === 'completed'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                    : 'border-slate-600 text-slate-300 hover:border-emerald-500/70'
                }`}
              >
                Completed
              </button>
            </div>
            {loading && (
              <span className="text-xs text-slate-400 self-start">Loading...</span>
            )}
          </div>
          {filteredTodos.length === 0 && !loading ? (
            <p className="text-slate-400 mt-2 text-sm">
              No todos yet. Add your first one above.
            </p>
          ) : (
            <ul className="divide-y divide-slate-700">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-start justify-between gap-3 py-3"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleComplete(todo)}
                      className={`mt-1 h-4 w-4 rounded border flex items-center justify-center text-[10px] ${
                        todo.isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                          : 'border-slate-500 text-slate-500 hover:border-emerald-400'
                      }`}
                      aria-label={
                        todo.isCompleted ? 'Mark as incomplete' : 'Mark as completed'
                      }
                    >
                      {todo.isCompleted && '✓'}
                    </button>
                    <div>
                      <p
                        className={`font-medium ${
                          todo.isCompleted ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {todo.title}
                      </p>
                    {todo.description && (
                      <p className="text-sm text-slate-300">
                        {todo.description}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      Created:{' '}
                      {new Date(todo.createdAt).toLocaleString(undefined, {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </p>
                    {todo.isCompleted && (
                      <span className="inline-flex mt-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold uppercase tracking-wide">
                        Done
                      </span>
                    )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-xs px-3 py-1 rounded-full bg-red-500/80 hover:bg-red-400 font-semibold h-fit"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

