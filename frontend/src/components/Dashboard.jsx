import { useEffect, useMemo, useState } from 'react';
import { FiCalendar, FiCheckCircle, FiClock, FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import { api } from '../context/AuthContext';

const priorities = ['Low', 'Medium', 'High'];
const statuses = ['Pending', 'In Progress', 'Completed'];

const emptyForm = { title: '', description: '', priority: 'Medium', status: 'Pending', due_date: '' };

const formatDate = (value, withTime = false) => {
  if (!value) return 'No date';
  return new Intl.DateTimeFormat('en-US', withTime
    ? { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }
    : { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
};

const dateInputValue = (value) => value ? new Date(value).toISOString().slice(0, 10) : '';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.error || 'Unable to load your tasks.');
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const query = search.toLowerCase();
    const matchesSearch = task.title.toLowerCase().includes(query)
      || (task.description || '').toLowerCase().includes(query);
    return matchesSearch
      && (statusFilter === 'All' || task.status === statusFilter)
      && (priorityFilter === 'All' || task.priority === priorityFilter);
  }), [tasks, search, statusFilter, priorityFilter]);

  const summary = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter((task) => task.status === 'Completed').length,
    active: tasks.filter((task) => task.status !== 'Completed').length,
  }), [tasks]);

  const openCreate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setEditingTask(null);
    setForm({ ...emptyForm, due_date: dateInputValue(tomorrow) });
    setFormError('');
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      due_date: dateInputValue(task.due_date),
    });
    setFormError('');
  };

  const closeForm = () => {
    setEditingTask(null);
    setFormError('');
  };

  const submitTask = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.due_date) {
      setFormError('Title and due date are required.');
      return;
    }

    setSaving(true);
    setFormError('');
    const payload = { ...form, title: form.title.trim(), description: form.description.trim() || null, due_date: new Date(`${form.due_date}T12:00:00`).toISOString() };
    try {
      const response = editingTask
        ? await api.put(`/tasks/${editingTask.id}`, payload)
        : await api.post('/tasks', payload);
      setTasks((currentTasks) => editingTask
        ? currentTasks.map((task) => task.id === editingTask.id ? response.data : task)
        : [response.data, ...currentTasks]);
      closeForm();
    } catch (requestError) {
      setFormError(requestError.response?.data?.error || 'Unable to save this task.');
    } finally {
      setSaving(false);
    }
  };

  const removeTask = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      await api.delete(`/tasks/${task.id}`);
      setTasks((currentTasks) => currentTasks.filter((item) => item.id !== task.id));
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to delete this task.');
    }
  };

  return (
    <section className="dashboard">
      <div className="dashboard-heading">
        <div><p className="eyebrow">Your workspace</p><h1>Tasks, in focus.</h1><p className="subtitle">Keep the important work moving.</p></div>
        <button type="button" className="button button-primary" onClick={openCreate}><FiPlus /> New task</button>
      </div>

      <div className="summary-grid">
        <div className="summary-card"><FiCheckCircle /><span><strong>{summary.total}</strong> total tasks</span></div>
        <div className="summary-card"><FiClock /><span><strong>{summary.active}</strong> active</span></div>
        <div className="summary-card"><FiCalendar /><span><strong>{summary.completed}</strong> completed</span></div>
      </div>

      <div className="toolbar">
        <label className="search-field"><FiSearch /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks" /></label>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status"><option>All</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
        <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} aria-label="Filter by priority"><option>All</option>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select>
      </div>

      {error && <div className="notice notice-error">{error}</div>}
      {loading ? <div className="page-state">Loading tasks...</div> : filteredTasks.length === 0 ? <div className="empty-state"><FiCheckCircle /><h2>No tasks found</h2><p>Create a task or adjust your filters to get started.</p></div> : (
        <div className="task-list">
          {filteredTasks.map((task) => (
            <article className="task-card" key={task.id}>
              <div className="task-card-main"><div className="task-title-row"><h2>{task.title}</h2><span className={`status status-${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span></div>{task.description && <p>{task.description}</p>}<div className="task-meta"><span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span><span><FiCalendar /> Due {formatDate(task.due_date)}</span><span>Updated {formatDate(task.updated_at, true)}</span></div></div>
              <div className="task-actions"><button type="button" className="icon-button" onClick={() => openEdit(task)} title="Edit task"><FiEdit2 /></button><button type="button" className="icon-button danger" onClick={() => removeTask(task)} title="Delete task"><FiTrash2 /></button></div>
            </article>
          ))}
        </div>
      )}

      {editingTask !== null || form.title !== '' ? <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeForm()}><form className="task-form" onSubmit={submitTask}><div className="form-heading"><div><p className="eyebrow">Task details</p><h2>{editingTask ? 'Edit task' : 'New task'}</h2></div><button type="button" className="icon-button" onClick={closeForm} title="Close">×</button></div>{formError && <div className="notice notice-error">{formError}</div>}<label>Title<input autoFocus value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} maxLength="255" required /></label><label>Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows="4" /></label><div className="form-grid"><label>Priority<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label><label>Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label></div><label>Due date<input type="date" value={form.due_date} onChange={(event) => setForm({ ...form, due_date: event.target.value })} required /></label><div className="form-actions"><button type="button" className="button button-secondary" onClick={closeForm}>Cancel</button><button type="submit" className="button button-primary" disabled={saving}>{saving ? 'Saving...' : editingTask ? 'Save changes' : 'Create task'}</button></div></form></div> : null}
    </section>
  );
};

export default Dashboard;