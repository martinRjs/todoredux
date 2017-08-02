class TodoContainer {
    constructor() {
      this.todos = [
        {
          id: 0,
          content: "do some homework",
          isChecked: false
        }
      ];

      $('#addNewTodoForm').on('submit', this.addNewTodo.bind(this));
    }

    addNewTodo(e) {
      e.preventDefault();
      var $newTodo = $('#newTodo');
      var newTodo = {
        id: 1,
        content: $newTodo.val(),
        isChecked: false
      }

      this.todos.push(newTodo);
      $newTodo.val('');
      this.render();
    }

    render () {
      $('#todosContainer').html('');

      this.todos.forEach(function(todo) {
        var $div = $("<div>", {"class": "item"});

        $div.append($("<input>", {"type": "checkbox"}));
        $div.append($("<span>", {"class": "item-body", "text": todo.content}));
        $div.append($("<button>", {"text": "remove"}));

        $('#todosContainer').append($div)
      });
    }
}


$(function() {
  var todoContainer = new TodoContainer();
});
