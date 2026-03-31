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

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">ToDo List</h1>

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
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Todos</h2>
            {loading && (
              <span className="text-xs text-slate-400">Loading...</span>
            )}
          </div>
          {todos.length === 0 && !loading ? (
            <p className="text-slate-400 mt-2 text-sm">
              No todos yet. Add your first one above.
            </p>
          ) : (
            <ul className="divide-y divide-slate-700">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-start justify-between gap-3 py-3"
                >
                  <div>
                    <p className="font-medium">{todo.title}</p>
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

