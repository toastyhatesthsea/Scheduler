/**
 * @class Model
 *
 * Data Manager.
 */
class Model 
{
  constructor() 
  {
    this.schedules = JSON.parse(localStorage.getItem('tasks')) || []
  }

  scheduleChanged(callback) 
  {
    this.scheduleChanged = callback
  }

  _commit(tasks) 
  {
    this.scheduleChanged(tasks)
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }

  addTodo(taskText) 
  {
    const task = 
    {
      identifier: this.schedules.length > 0 ? this.schedules[this.schedules.length - 1].identifier + 1 : 1,
      someText: taskText,
      done: false,
    }

    this.schedules.push(task)

    this._commit(this.schedules)
  }

  editTodo(identifier, updatedText) 
  {
    this.schedules = this.schedules.map(task =>
      task.identifier === identifier ? { identifier: task.identifier, someText: updatedText, done: task.done } : task
    )

    this._commit(this.schedules)
  }

  deleteTodo(identifier) 
  {
    this.schedules = this.schedules.filter(todo => todo.identifier !== identifier)

    this._commit(this.schedules)
  }

  changeDone(identifier) 
  {
    this.schedules = this.schedules.map(task =>
      task.identifier === identifier ? { identifier: task.identifier, someText: task.someText, done: !task.done } : task
    )

    this._commit(this.schedules)
  }
}

/**
 * @class View
 *
 * visual representation
 */
class View {
  constructor() {
    this.app = this.getElement('#theRoot')
    this.form = this.createElement('form')
    this.input = this.createElement('input')
    this.input.type = 'text'
    this.input.placeholder = 'Add task'

    this.input.name = 'task'
    this.submitButton = this.createElement('button')
    this.submitButton.textContent = 'Submit'
    this.form.append(this.input, this.submitButton)
    this.title = this.createElement('h1')
    this.title.textContent = 'Scheduler'

    this.scheduleList = this.createElement('ul', 'todo-list')
    this.app.append(this.title, this.form, this.scheduleList)

    this._temporaryTodoText = ''
    this._initLocalListeners()
  }

  get _scheduleText() {
    return this.input.value
  }

  _resetInput() {
    this.input.value = ''
  }

  createElement(tag, className) {
    const element = document.createElement(tag)

    if (className) element.classList.add(className)

    return element
  }

  getElement(selector) {
    const element = document.querySelector(selector)

    return element
  }

  displayTodos(tasks) 
  {
    
    while (this.scheduleList.firstChild) {
      this.scheduleList.removeChild(this.scheduleList.firstChild)
    }

    /*Default */
    if (tasks.length === 0) {
      const p = this.createElement('p')
      p.textContent = 'Type to add a task!'
      this.scheduleList.append(p)
    } else {
      
      tasks.forEach(task => 
        {
        const li = this.createElement('li')
        li.id = task.identifier

        const aCheckBox = this.createElement('input')
        aCheckBox.type = 'checkbox'
        aCheckBox.checked = task.done

        const span = this.createElement('span')
        span.contentEditable = true
        span.classList.add('editable')

        if (task.done) 
        {
          const strikeOut = this.createElement('s')
          strikeOut.textContent = task.someText
          span.append(strikeOut)
        } 
        else 
        {
          span.textContent = task.someText
        }

        const deleteButton = this.createElement('button', 'delete')
        deleteButton.textContent = 'Delete'
        li.append(aCheckBox, span, deleteButton)

     
        this.scheduleList.append(li)
      })
    }

    console.log(tasks)
  }

  _initLocalListeners() 
  {
    this.scheduleList.addEventListener('input', someEvent => 
    {
      if (someEvent.target.className === 'editable') 
      {
        this._temporaryTodoText = someEvent.target.innerText
      }
    })
  }

  addBinder(someHandler) 
  {
    this.form.addEventListener('submit', someEvent => 
    {
      someEvent.preventDefault()

      if (this._scheduleText) {
        someHandler(this._scheduleText)
        this._resetInput()
      }
    })
  }

  deleteBinder(someHandler) 
  {
    this.scheduleList.addEventListener('click', someEvent => 
    {
      if (someEvent.target.className === 'delete') 
      {
        const id = parseInt(someEvent.target.parentElement.id)

        someHandler(id)
      }
    })
  }

  editBinder(someHandler) 
  {
    this.scheduleList.addEventListener('focusout', someEvent => {
      if (this._temporaryTodoText) {
        const id = parseInt(someEvent.target.parentElement.id)

        someHandler(id, this._temporaryTodoText)
        this._temporaryTodoText = ''
      }
    })
  }

  completeBinder(someHandler) 
  {
    this.scheduleList.addEventListener('change', someEvent => 
    {
      if (someEvent.target.type === 'checkbox') {
        const id = parseInt(someEvent.target.parentElement.id)

        someHandler(id)
      }
    })
  }
}

/**
 * @class Controller
 *
 * Linker between View and Model
 *
 */
class Controller 
{
  constructor(model, view) 
  {
    this.someModel = model
    this.someView = view

    
    this.someModel.scheduleChanged(this.scheduleListChanger)
    this.someView.addBinder(this.addTaskEvent)
    this.someView.editBinder(this.editTaskEvent)
    this.someView.deleteBinder(this.deleteTaskEvent)
    this.someView.completeBinder(this.completeTaskEvent)

  
    this.scheduleListChanger(this.someModel.todos)
  }

  scheduleListChanger = tasks => 
  {
    this.someView.displayTodos(tasks)
  }

  addTaskEvent = someText => 
  {
    this.someModel.addTodo(someText)
  }

  editTaskEvent = (identifier, someText) => 
  {
    this.someModel.editTodo(identifier, someText)
  }

  deleteTaskEvent = identifier => 
  {
    this.someModel.deleteTodo(identifier)
  }

  completeTaskEvent = identifier => 
  {
    this.someModel.changeDone(identifier)
  }
}

const schedulerApp = new Controller(new Model(), new View())
