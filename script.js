let tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || [];

const todoTasks = document.getElementById('todoTasks');
const inprogressTasks = document.getElementById('inprogressTasks');
const doneTasks = document.getElementById('doneTasks');

const todoCount = document.getElementById('todoCount');
const inprogressCount = document.getElementById('inprogressCount');
const doneCount = document.getElementById('doneCount');

const addTaskBtn = document.getElementById('addTaskBtn');
const newTaskInput = document.getElementById('newTask');
const dueDateInput = document.getElementById('dueDate');
const priorityInput = document.getElementById('priority');

// Dark Mode
const toggleMode = document.getElementById('toggleMode');
toggleMode.addEventListener('click', ()=>{
  document.body.classList.toggle('dark-mode');
  toggleMode.innerHTML = document.body.classList.contains('dark-mode') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Save to LocalStorage
function saveTasks(){ localStorage.setItem('kanbanTasks', JSON.stringify(tasks)); }

// Render Tasks
function renderTasks(){
  todoTasks.innerHTML=''; inprogressTasks.innerHTML=''; doneTasks.innerHTML='';
  let todo=0, inprogress=0, done=0;

  tasks.forEach((task,index)=>{
    const div = document.createElement('div');
    div.className='task';
    div.draggable=true;
    div.innerHTML = `
      ${task.title} 
      <span class="badge ${task.priority.toLowerCase()}">${task.priority}</span>
      <small class="text-muted d-block">${task.dueDate}</small>
    `;

    // Buttons
    const editBtn = document.createElement('button'); editBtn.className='btn btn-sm btn-info'; editBtn.innerHTML='<i class="fas fa-edit"></i>';
    editBtn.addEventListener('click', ()=>{
      const newTitle = prompt('Edit task', task.title);
      if(newTitle) { task.title=newTitle; saveTasks(); renderTasks(); }
    });
    const delBtn = document.createElement('button'); delBtn.className='btn btn-sm btn-danger'; delBtn.innerHTML='<i class="fas fa-trash"></i>';
    delBtn.addEventListener('click', ()=>{ tasks.splice(index,1); saveTasks(); renderTasks(); });
    div.appendChild(editBtn); div.appendChild(delBtn);

    // Drag
    div.addEventListener('dragstart', ()=>div.classList.add('dragging'));
    div.addEventListener('dragend', ()=>div.classList.remove('dragging'));

    if(task.status==='todo'){ todoTasks.appendChild(div); todo++; }
    else if(task.status==='inprogress'){ inprogressTasks.appendChild(div); inprogress++; }
    else{ doneTasks.appendChild(div); done++; }
  });

  todoCount.textContent=todo; inprogressCount.textContent=inprogress; doneCount.textContent=done;
}

// Add Task
addTaskBtn.addEventListener('click', ()=>{
  const title = newTaskInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;
  if(!title || !dueDate || !priority) return alert('Fill all fields');
  tasks.push({title,status:'todo',dueDate,priority});
  saveTasks();
  renderTasks();
  newTaskInput.value=''; dueDateInput.value=''; priorityInput.value='Low';
});

// Drag & Drop
const columns = document.querySelectorAll('.column');
columns.forEach(column=>{
  column.addEventListener('dragover', e=>{ e.preventDefault(); column.classList.add('drag-over'); });
  column.addEventListener('dragleave', ()=>column.classList.remove('drag-over'));
  column.addEventListener('drop', ()=>{
    const draggingTask = document.querySelector('.dragging');
    const status = column.dataset.status;
    const taskText = draggingTask.childNodes[0].textContent.trim();
    const taskIndex = tasks.findIndex(t=>t.title===taskText);
    if(taskIndex!==-1){ tasks[taskIndex].status=status; saveTasks(); renderTasks(); }
    column.classList.remove('drag-over');
  });
});

// Initial Render
renderTasks();