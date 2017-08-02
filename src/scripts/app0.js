function todosReducer(state = [], action) {
  if (typeof state === 'undefined') {
    return null;
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

var store = Redux.createStore(todosReducer);

class TodoContainer {
    constructor() {
      this.todos = store.getState();
      this.idCounter = 0;

      $('#addNewTodoForm').on('submit', this.addNewTodo.bind(this));
    }

    addNewTodo(e) {
      e.preventDefault();
      var $newTodo = $('#newTodo');
      store.dispatch({
        type: 'ADD_TODO',
        id: this.idCounter++,
        content: $newTodo.val()
      });
      $newTodo.val('');
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

      store.getState().forEach(function(todo) {
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
  store.subscribe(todoContainer.render.bind(todoContainer));
});
