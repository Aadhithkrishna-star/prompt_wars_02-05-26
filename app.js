// Mock Data for Tasks
const initialTasks = [
    {
        id: 't1',
        title: 'Design System Architecture',
        description: 'Create the foundational CSS variables and mixins for the new UI kit.',
        status: 'todo',
        priority: 'high',
        category: 'design',
        comments: 3,
        attachments: 1,
        assignees: ['Alex', 'Sarah']
    },
    {
        id: 't2',
        title: 'Implement Authentication',
        description: 'Set up JWT based auth and create login/register pages.',
        status: 'todo',
        priority: 'high',
        category: 'dev',
        comments: 5,
        attachments: 0,
        assignees: ['Mike']
    },
    {
        id: 't3',
        title: 'Create Dashboard Layout',
        description: 'Build the responsive sidebar and top navigation components.',
        status: 'progress',
        priority: 'med',
        category: 'dev',
        comments: 2,
        attachments: 0,
        assignees: ['Alex', 'Mike']
    },
    {
        id: 't4',
        title: 'User Testing Interviews',
        description: 'Conduct 5 sessions with beta users and summarize findings.',
        status: 'progress',
        priority: 'low',
        category: 'design',
        comments: 8,
        attachments: 3,
        assignees: ['Sarah']
    },
    {
        id: 't5',
        title: 'Optimize Database Queries',
        description: 'Review slow queries on the users table and add necessary indexes.',
        status: 'review',
        priority: 'high',
        category: 'dev',
        comments: 1,
        attachments: 0,
        assignees: ['Mike']
    },
    {
        id: 't6',
        title: 'Initial wireframes',
        description: 'Low fidelity mockups for the landing page.',
        status: 'done',
        priority: 'med',
        category: 'design',
        comments: 12,
        attachments: 4,
        assignees: ['Sarah']
    }
];

// Mock Data for Activity
const initialActivity = [
    {
        id: 'a1',
        type: 'message',
        user: 'Sarah Lee',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Lee&background=EC4899&color=fff',
        time: '10 mins ago',
        content: 'I\'ve uploaded the new wireframes for the dashboard.'
    },
    {
        id: 'a2',
        type: 'system',
        icon: '🔄',
        time: '1 hour ago',
        content: '<strong>Mike</strong> moved <em>Optimize Database Queries</em> to Review'
    },
    {
        id: 'a3',
        type: 'message',
        user: 'Mike Chen',
        avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=10B981&color=fff',
        time: '2 hours ago',
        content: 'PR is up for the auth implementation. Needs review.'
    },
    {
        id: 'a4',
        type: 'system',
        icon: '✅',
        time: 'Yesterday',
        content: '<strong>Sarah</strong> completed <em>Initial wireframes</em>'
    }
];

// App State
let tasks = [...initialTasks];
let activities = [...initialActivity];

// DOM Elements
const lists = {
    todo: document.getElementById('list-todo'),
    progress: document.getElementById('list-progress'),
    review: document.getElementById('list-review'),
    done: document.getElementById('list-done')
};
const activityFeed = document.getElementById('activity-feed');

// Render Tasks
function renderTasks() {
    // Clear lists
    Object.values(lists).forEach(list => list.innerHTML = '');

    // Render each task
    tasks.forEach(task => {
        const list = lists[task.status];
        if (list) {
            const card = createTaskElement(task);
            list.appendChild(card);
        }
    });

    // Update counts
    updateCounts();
}

function updateCounts() {
    ['todo', 'progress', 'review', 'done'].forEach(status => {
        const count = tasks.filter(t => t.status === status).length;
        const column = document.getElementById(`col-${status}`);
        if(column) {
            column.querySelector('.task-count').textContent = count;
        }
    });
}

function getAvatarUrl(name) {
    const colors = {
        'Alex': '0D8ABC',
        'Sarah': 'EC4899',
        'Mike': '10B981'
    };
    const color = colors[name] || '6366F1';
    return `https://ui-avatars.com/api/?name=${name}&background=${color}&color=fff`;
}

function createTaskElement(task) {
    const el = document.createElement('div');
    el.className = 'task-card';
    el.draggable = true;
    el.dataset.id = task.id;

    const assigneesHtml = task.assignees.map(a => 
        `<img src="${getAvatarUrl(a)}" alt="${a}" title="${a}">`
    ).join('');

    el.innerHTML = `
        <div class="task-labels">
            <span class="label ${task.priority}">${task.priority}</span>
            <span class="label ${task.category}">${task.category}</span>
        </div>
        <h4>${task.title}</h4>
        <p>${task.description}</p>
        <div class="task-footer">
            <div class="task-assignees">
                ${assigneesHtml}
            </div>
            <div class="task-meta">
                <span>💬 ${task.comments}</span>
                ${task.attachments ? `<span>📎 ${task.attachments}</span>` : ''}
            </div>
        </div>
    `;

    // Drag events
    el.addEventListener('dragstart', handleDragStart);
    el.addEventListener('dragend', handleDragEnd);

    return el;
}

// Render Activity Feed
function renderActivity() {
    activityFeed.innerHTML = '';
    activities.forEach(activity => {
        const el = document.createElement('div');
        el.className = `activity-item ${activity.type === 'system' ? 'system' : ''}`;
        
        if (activity.type === 'message') {
            el.innerHTML = `
                <img src="${activity.avatar}" alt="${activity.user}" class="avatar">
                <div class="activity-content">
                    <div class="activity-header">
                        <span class="activity-name">${activity.user}</span>
                        <span class="activity-time">${activity.time}</span>
                    </div>
                    <div class="activity-text">${activity.content}</div>
                </div>
            `;
        } else {
            el.innerHTML = `
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <div class="activity-header">
                        <span class="activity-time">${activity.time}</span>
                    </div>
                    <div class="activity-text">${activity.content}</div>
                </div>
            `;
        }
        activityFeed.appendChild(el);
    });
}

// Drag & Drop Logic
let draggedTask = null;

function handleDragStart(e) {
    draggedTask = this;
    setTimeout(() => this.classList.add('dragging'), 0);
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd() {
    this.classList.remove('dragging');
    draggedTask = null;
    
    // Remove all drag-over highlights
    document.querySelectorAll('.task-list').forEach(list => {
        list.classList.remove('drag-over');
    });
}

// Setup Column Drop Zones
document.querySelectorAll('.task-list').forEach(list => {
    list.addEventListener('dragover', e => {
        e.preventDefault();
        list.classList.add('drag-over');
        
        // Find element to insert before
        const afterElement = getDragAfterElement(list, e.clientY);
        if (draggedTask) {
            if (afterElement == null) {
                list.appendChild(draggedTask);
            } else {
                list.insertBefore(draggedTask, afterElement);
            }
        }
    });

    list.addEventListener('dragleave', () => {
        list.classList.remove('drag-over');
    });

    list.addEventListener('drop', e => {
        e.preventDefault();
        list.classList.remove('drag-over');
        
        if (draggedTask) {
            const taskId = draggedTask.dataset.id;
            const newStatus = list.parentElement.dataset.status;
            
            // Update state
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex > -1 && tasks[taskIndex].status !== newStatus) {
                const oldStatus = tasks[taskIndex].status;
                tasks[taskIndex].status = newStatus;
                
                // Add system activity
                const statusNames = {
                    todo: 'To Do',
                    progress: 'In Progress',
                    review: 'Review',
                    done: 'Done'
                };
                
                activities.unshift({
                    id: 'a' + Date.now(),
                    type: 'system',
                    icon: '🔄',
                    time: 'Just now',
                    content: `<strong>Alex</strong> moved <em>${tasks[taskIndex].title}</em> to ${statusNames[newStatus]}`
                });
                
                updateCounts();
                renderActivity();
            }
        }
    });
});

// Helper for drag sorting
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Chat input handling
const chatInput = document.querySelector('.chat-input');
const sendBtn = document.querySelector('.btn-send');

function sendMessage() {
    const text = chatInput.value.trim();
    if (text) {
        activities.unshift({
            id: 'a' + Date.now(),
            type: 'message',
            user: 'Alex Doe',
            avatar: 'https://ui-avatars.com/api/?name=Alex+Doe&background=0D8ABC&color=fff',
            time: 'Just now',
            content: text
        });
        chatInput.value = '';
        renderActivity();
    }
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    renderActivity();
});
