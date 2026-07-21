export const PAGE_SIZE = 6;

export const isOverdue = (task, now = new Date()) => {
  if (task.status === 'Completed' || !task.due_date) return false;
  const dueDate = new Date(task.due_date);
  const today = new Date(now);
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return dueDate < today;
};

export const paginate = (items, page, pageSize = PAGE_SIZE) => {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page: safePage, totalPages };
};
