function TodoListViewModel(app, dataModel) {
    var self = this,
        startedLoad = false;

    // Non-editable catalog data
    self.priorityEnum = [
        { priorityText: "Critical", value: 3 },
        { priorityText: "Major", value: 2 },
        { priorityText: "Minor", value: 1 }
    ];

    // Data
    self.newTodoDescription = ko.observable();
    self.todoArray = ko.observableArray();

    // UI state
    self.loading = ko.observable(true);
    self.saving = ko.observable(false);
    self.message = ko.observable();
    self.errors = ko.observableArray();

    // Operations
    self.load = function () { // Load data
        if (!startedLoad) {
            startedLoad = true;

            dataModel.getTodoes()
                .done(function (response) {
                    var mappedTasks = $.map(response, function (item) { return new TodoBindModel(item) });
                    self.todoArray(mappedTasks);
                    self.loading(false);
                }).failJSON(function (response) {
                    var errors;

                    self.loading(false);
                    errors = dataModel.toErrorsArray(response);

                    if (errors) {
                        app.errors(errors);
                    } else {
                        app.errors.push("Error retrieving information.");
                    }
                });
        }
    }

    self.addTodo = function () {
        self.saving(true);

        newTodo = new TodoBindModel({
            id: null,
            description: self.newTodoDescription,
            dueDate: null,
            priority: 2,
            completed: false
        });

        request = ko.toJSON(newTodo, function(key, value) {
                    if (value == null) {
                        return;
                    }
                    else {
                        return value;
                    }
                });

        dataModel.postTodo(request)
            .done(function (response) {
                newTodo = new TodoBindModel(response);
                self.todoArray.push(newTodo);
                self.newTodoDescription("");
                self.saving(false);
            }).failJSON(function (response) {
                var errors;

                errors = dataModel.toErrorsArray(response);
                self.saving(false);

                if (errors) {
                    app.errors(errors);
                } else {
                    app.errors.push("Error creating new ToDo.");
                }
            });
    }

    self.removeTodo = function (todo) {
        self.saving(true);

        dataModel.deleteTodo(todo.id())
            .done(function (response) {
                self.todoArray.remove(todo)
                self.saving(false);
            }).failJSON(function (response) {
                var errors;

                errors = dataModel.toErrorsArray(response);
                self.saving(false);

                if (errors) {
                    app.errors(errors);
                } else {
                    app.errors.push("Error deleting ToDo.");
                }
            });
    }

    self.home = function () {
        app.navigateToHome();
    };
};

app.addViewModel({
    name: "TodoList",
    bindingMemberName: "todoList",
    factory: TodoListViewModel,
    navigatorFactory: function (app) {
    return function (externalAccessToken, externalError) {
        app.errors.removeAll();
        app.view(app.Views.TodoList);
        app.todoList().load();
        };
    }
});
