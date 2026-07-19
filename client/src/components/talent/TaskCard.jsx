import { claimTask } from '../../api/talent';

const STATUS_CLASS = {
  Open:      'status-badge-Open',
  Claimed:   'status-badge-Claimed',
  Submitted: 'status-badge-Submitted',
  Approved:  'status-badge-Approved',
  Rejected:  'status-badge-Rejected',
};

const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;
  const match = String(dateStr).match(/^(\d{4})[-/](\d{2})[-/](\d{2})/);
  if (match) {
    return new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10));
  }
  const d = new Date(dateStr);
  return isNaN(d) ? null : d;
};

const TaskCard = ({ task, showClaimButton = false, onClaimed }) => {
  const due = task.dueDate ? parseLocalDate(task.dueDate) : null;
  if (due) due.setHours(23, 59, 59, 999);
  const isOverdue = due && due < new Date() && task.status !== 'Approved';
  const isDueSoon = due && !isOverdue && (due - new Date() <= 86400000) && task.status !== 'Approved';

  const handleClaim = async () => {
    try {
      await claimTask(task._id);
      if (onClaimed) onClaimed();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to claim task');
    }
  };

  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-border-light hover:-translate-y-0.5 transition-all cursor-default">

      {/* Header: title + status */}
      <div className="flex items-start justify-between gap-2.5">
        <p className="text-[15px] font-semibold text-text-primary leading-snug">{task.title || 'Untitled Task'}</p>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {task.status && (
            <span className={`inline-block px-2.5 py-[3px] rounded-full text-[11px] font-semibold tracking-[0.3px] ${STATUS_CLASS[task.status] || ''}`}>
              {task.status}
            </span>
          )}
          {isOverdue && (
            <span className="inline-block px-2 py-[2px] rounded-full text-[9.5px] font-semibold uppercase tracking-[0.5px] badge-overdue">
              Overdue
            </span>
          )}
          {isDueSoon && (
            <span className="inline-block px-2 py-[2px] rounded-full text-[9.5px] font-semibold uppercase tracking-[0.5px] badge-due-soon">
              Due Soon
            </span>
          )}
        </div>
      </div>

      
      {task.description && (
        <p className="text-[13px] text-text-muted leading-relaxed">{task.description}</p>
      )}

      {/* Meta row */}
      <div className="flex items-center justify-between flex-wrap gap-2 mt-auto">
        
        <span className="text-[12px] text-text-faint">
          {task.dueDate ? `Due: ${task.dueDate}` : 'No due date'}
        </span>
        {task.createdBy?.name && (
          <span className="text-[12px] text-text-faint">By {task.createdBy.name}</span>
        )}
      </div>

      {showClaimButton && (
        <button onClick={handleClaim}
          className="w-full py-2.5 rounded-lg border-none text-[13px] font-semibold text-white cursor-pointer btn-gradient font-sans mt-1">
          Claim Task →
        </button>
      )}
    </div>
  );
};

export default TaskCard;
