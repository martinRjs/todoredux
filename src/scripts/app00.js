function todos(state = [], action) {
  if (typeof state === 'undefined') {
    return state;
  }

  switch (action.type) {
    case 'ADD_TODO':
      var newState = state.slice();
      newState.push({
        id: action.id,
        content: action.content,
        isChecked: false
      });

      return newState;
    case 'REMOVE_TODO':
        return state.filter(function(todo) {
          if(todo.id === action.id) {
            return false;
          }

          return true;
        });
    case 'CHECK_TODO':
      return state.map(function(todo) {
        if(todo.id === action.id) {
          todo.isChecked = true;
        }
      });
    default:
      return state
  }
}

function visibilityFilter( state = 'showAll', action) {
  switch (action.type) {
    case 'CHANGE_FILTER':
      return action.option;
    default:
      return state;
  }
};

const todoApp = (state = {}, action) => {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action)
  };
};

var persistedState = localStorage.reduxState !== undefined ? JSON.parse(localStorage.reduxState) : {};
var store = Redux.createStore(todoApp, persistedState);

class TodoContainer {
    constructor() {
      this.todos = store.getState();
      this.idCounter = 0;

      $('#addNewTodoForm').on('submit', this.addNewTodo.bind(this));
      $('#showAll').on('click', this.changeFilter.bind(this));
      $('#showPending').on('click', this.changeFilter.bind(this));
    }

    addNewTodo(e) {
      e.preventDefault();
      var id = localStorage.idCounter !== null ? JSON.parse(localStorage.idCounter) : this.idCounter;
      var $newTodo = $('#newTodo');
      store.dispatch({
        type: 'ADD_TODO',
        id: id++,
        content: $newTodo.val()
      });
      $newTodo.val('');
      localStorage.idCounter = id;
    }

    changeFilter(e) {
      e.preventDefault();
      store.dispatch({
        type: 'CHANGE_FILTER',
        option: e.target.textContent
      });
      console.log('changeFilter');
    }

    removeTodo(id, e) {
      store.dispatch({
        type: 'REMOVE_TODO',
        id: id,
      });
    }

    render () {
      $('#todosContainer').html('');
      var self = this;

        store.getState().todos.forEach(function(todo) {
          var $div = $("<div>", {"class": "item"});

          $div.append($("<input>", {"type": "checkbox"}));
          $div.append($("<span>", {"class": "item-body", "text": todo.content}));
          $div.append($("<button>", {"text": "remove"}).on('click', self.removeTodo.bind(self, todo.id)));

          $('#todosContainer').append($div)
        });

    }
}


$(function() {
  var todoContainer = new TodoContainer();
  todoContainer.render();
  store.subscribe(todoContainer.render.bind(todoContainer));
  store.subscribe(function() {
    localStorage.setItem('reduxState', JSON.stringify(store.getState()));
  })
});
