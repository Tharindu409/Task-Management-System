import { useEffect, useMemo, useState } from 'react';
import { FiAlertCircle, FiCalendar, FiEdit2, FiGrid, FiHelpCircle, FiHome, FiList, FiMoon, FiPlus, FiSearch, FiSettings, FiSun, FiTrash2, FiUsers } from 'react-icons/fi';
import { api } from '../context/AuthContext';
import { isOverdue, paginate } from '../utils/taskUtils';

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
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [page, setPage] = useState(1);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('taskflow-theme') === 'dark');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    localStorage.setItem('taskflow-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.error || 'Unable to load your tasks.');
        showToast('Unable to load tasks.', 'error');
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
      && (priorityFilter === 'All' || task.priority === priorityFilter);
  }), [tasks, search, priorityFilter]);

  const paginatedTasks = useMemo(() => paginate(filteredTasks, page), [filteredTasks, page]);

  useEffect(() => {
    setPage(1);
  }, [search, priorityFilter]);

  const summary = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((task) => task.status === 'Pending').length,
    inProgress: tasks.filter((task) => task.status === 'In Progress').length,
    completed: tasks.filter((task) => task.status === 'Completed').length,
    overdue: tasks.filter(isOverdue).length,
  }), [tasks]);

  const columns = [
    { status: 'In Progress', label: 'In Progress', count: summary.inProgress, className: 'column-progress' },
    { status: 'Pending', label: 'Pending', count: summary.pending, className: 'column-pending' },
    { status: 'Completed', label: 'Completed', count: summary.completed, className: 'column-completed' },
  ];

  const openCreate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setEditingTask(null);
    setForm({ ...emptyForm, due_date: dateInputValue(tomorrow) });
    setFormError('');
    setShowForm(true);
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
    setShowForm(true);
  };

  const closeForm = () => {
    setEditingTask(null);
    setFormError('');
    setShowForm(false);
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
      showToast(editingTask ? 'Task updated.' : 'Task created.');
    } catch (requestError) {
      setFormError(requestError.response?.data?.error || 'Unable to save this task.');
      showToast('Task could not be saved.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const removeTask = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      await api.delete(`/tasks/${task.id}`);
      setTasks((currentTasks) => currentTasks.filter((item) => item.id !== task.id));
      showToast('Task deleted.');
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to delete this task.');
      showToast('Task could not be deleted.', 'error');
    }
  };

  return (
    <section className={`dashboard-shell${darkMode ? ' dark-mode' : ''}`}>
      <aside className="sidebar">
        <div className="side-brand"><span className="brand-mark">S</span><strong>slothui</strong></div>
        <label className="side-search"><FiSearch /><input placeholder="Search" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        <nav className="side-nav">
          <button className="side-link active"><FiHome /> Home <span>{summary.total}</span></button>
          <button className="side-link"><FiList /> Tasks</button>
          <button className="side-link"><FiUsers /> Users</button>
          <button className="side-link"><FiGrid /> APIs</button>
          <button className="side-link"><FiCalendar /> Subscription</button>
          <button className="side-link"><FiSettings /> Settings</button>
          <button className="side-link"><FiHelpCircle /> Help &amp; Support</button>
        </nav>
        <div className="pro-banner"><span>Go Pro</span><span>☆</span></div>
      </aside>

      <div className="workspace">
        <header className="workspace-header">
          <div><h1>Kanban Dashboard <span>🗂️</span></h1></div>
          <div className="header-actions"><button className="header-icon" title="Toggle dark mode" onClick={() => setDarkMode((current) => !current)}>{darkMode ? <FiSun /> : <FiMoon />}</button><button className="header-icon" title="Search"><FiSearch /></button><button className="share-button">Share <span>⌘</span></button><button className="header-icon" title="Export">⇧</button><button className="header-icon" onClick={openCreate} title="Add task"><FiPlus /></button></div>
        </header>
        <div className="workspace-tabs"><button className="tab">By Status</button><button className="tab selected">By Total Tasks <b>{summary.total}</b></button><button className="tab">Tasks Due</button><button className="tab">Extra Tasks</button><button className="tab">Tasks Completed</button><label className="sort-control">Sort By <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}><option value="All">Newest</option>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label></div>
        {error && <div className="notice notice-error">{error}</div>}
        {loading ? <div className="page-state">Loading tasks...</div> : (
          <div className="kanban-board">
            {columns.map((column) => {
              const columnTasks = paginatedTasks.items.filter((task) => task.status === column.status);
              return <div className={`kanban-column ${column.className}`} key={column.status}>
                <div className="column-heading"><span><b>{column.count}</b> {column.label}</span><button onClick={openCreate} title={`Add ${column.label} task`}><FiPlus /></button></div>
                <div className="column-tasks">{columnTasks.length === 0 ? <div className="column-empty">No tasks here</div> : columnTasks.map((task) => (
                  <article className="task-card" key={task.id}>
                    <div className={`task-tag priority-${task.priority.toLowerCase()}`}>{isOverdue(task) ? 'Overdue' : `${task.priority} priority`}</div>
                    <div className="task-title-row"><h2>{task.title}</h2></div>{task.description && <p>{task.description}</p>}
                    <div className="task-meta"><span><FiCalendar /> {formatDate(task.due_date)}</span><span>{formatDate(task.updated_at, true)}</span></div>
                    <div className="task-card-footer"><span className="avatar-stack"><i>{(task.title[0] || 'T').toUpperCase()}</i></span><span className="task-actions"><button type="button" className="icon-button" onClick={() => openEdit(task)} title="Edit task"><FiEdit2 /></button><button type="button" className="icon-button danger" onClick={() => removeTask(task)} title="Delete task"><FiTrash2 /></button></span></div>
                  </article>
                ))}</div>
              </div>;
            })}
          </div>
        )}
        {paginatedTasks.totalPages > 1 && <div className="pagination"><button type="button" onClick={() => setPage((current) => current - 1)} disabled={page === 1}>Previous</button><span>Page {paginatedTasks.page} of {paginatedTasks.totalPages}</span><button type="button" onClick={() => setPage((current) => current + 1)} disabled={page === paginatedTasks.totalPages}>Next</button></div>}
        <div className="dashboard-footnote"><span><FiAlertCircle /> {summary.overdue} overdue tasks</span><button type="button" className="button button-primary" onClick={openCreate}><FiPlus /> New task</button></div>
      </div>

      {showForm ? <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeForm()}><form className="task-form" onSubmit={submitTask}><div className="form-heading"><div><p className="eyebrow">Task details</p><h2>{editingTask ? 'Edit task' : 'New task'}</h2></div><button type="button" className="icon-button" onClick={closeForm} title="Close">×</button></div>{formError && <div className="notice notice-error">{formError}</div>}<label>Title<input autoFocus value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} maxLength="255" required /></label><label>Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows="4" /></label><div className="form-grid"><label>Priority<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label><label>Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label></div><label>Due date<input type="date" value={form.due_date} onChange={(event) => setForm({ ...form, due_date: event.target.value })} required /></label><div className="form-actions"><button type="button" className="button button-secondary" onClick={closeForm}>Cancel</button><button type="submit" className="button button-primary" disabled={saving}>{saving ? 'Saving...' : editingTask ? 'Save changes' : 'Create task'}</button></div></form></div> : null}
      {toast && <div className={`toast toast-${toast.type}`} role="status">{toast.message}</div>}
    </section>
  );
};

export default Dashboard;