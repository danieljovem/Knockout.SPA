function TodoListViewModel(app, dataModel) {
    var self = this,
        startedLoad = false;

    // UI state
    self.loading = ko.observable(true);
    self.saving = ko.observable(false);
    self.message = ko.observable();
    self.errors = ko.observableArray();

    self.sortingAscending = -1;
    self.sortingInactive = 0;
    self.sortingDescending = 1;

    self.sortingByPriority = ko.observable(self.sortingInactive);
    self.sortingByDescription = ko.observable(self.sortingInactive);
    self.sortingByDueDate = ko.observable(self.sortingInactive);

    // Non-editable catalog data
    self.priorityEnum = [
        { priorityText: "Critical", value: 3 },
        { priorityText: "Major", value: 2 },
        { priorityText: "Minor", value: 1 }
    ];

    // Data
    self.newTodoDescription = ko.observable();
    self.todoArray = ko.observableArray();

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
            description: self.newTodoDescription,
            priority: 2
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

    self.updateTodo = function (todo) {
        self.saving(true);

        request = ko.toJSON(todo, function (key, value) {
            if (value == null) {
                return;
            }
            else {
                return value;
            }
        });

        dataModel.putTodo(todo.id(), request)
            .done(function (response) {
                self.saving(false);
            }).failJSON(function (response) {
                var errors;

                errors = dataModel.toErrorsArray(response);
                self.saving(false);

                if (errors) {
                    app.errors(errors);
                } else {
                    app.errors.push("Error updating ToDo.");
                }
            });
    }

    self.patchTodo = function (todo) {
        self.saving(true);

        request = ko.toJSON({ dueDate: todo.dueDate() }, function (key, value) {
            if (value == null) {
                return;
            }
            else {
                return value;
            }
        });

        dataModel.patchTodo(todo.id(), request)
            .done(function (response) {
                self.saving(false);
            }).failJSON(function (response) {
                var errors;

                errors = dataModel.toErrorsArray(response);
                self.saving(false);

                if (errors) {
                    app.errors(errors);
                } else {
                    app.errors.push("Error patching ToDo.");
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

    self.sortByPriority = function () {
        if (self.sortingByPriority() == self.sortingAscending) {
            self.sortingByPriority(self.sortingDescending);
        } else {
            self.sortingByPriority(self.sortingAscending);
        }
        self.sortingByDescription(self.sortingInactive);
        self.sortingByDueDate(self.sortingInactive);

        self.todoArray.sort(function (left, right) {
            return (left.priority() == right.priority() ? 0 :
                        (left.priority() < right.priority() ?
                            self.sortingByPriority() : self.sortingByPriority() * -1));
        });
    }

    self.sortByDescription = function () {
        if (self.sortingByDescription() == self.sortingAscending) {
            self.sortingByDescription(self.sortingDescending);
        } else {
            self.sortingByDescription(self.sortingAscending);
        }
        self.sortingByPriority(self.sortingInactive);
        self.sortingByDueDate(self.sortingInactive);

        self.todoArray.sort(function (left, right) {
            return (left.description().toLowerCase() == right.description().toLowerCase() ? 0 :
                        (left.description().toLowerCase() < right.description().toLowerCase() ?
                            self.sortingByDescription() : self.sortingByDescription() * -1));
        });
    }

    self.sortByDueDate = function () {
        if (self.sortingByDueDate() == self.sortingAscending) {
            self.sortingByDueDate(self.sortingDescending);
        } else {
            self.sortingByDueDate(self.sortingAscending);
        }
        self.sortingByDescription(self.sortingInactive);
        self.sortingByPriority(self.sortingInactive);

        self.todoArray.sort(function (left, right) {
            return (left.dueDate() == right.dueDate() ? 0 :
                        (left.dueDate() < right.dueDate() ?
                            self.sortingByDueDate() : self.sortingByDueDate() * -1));
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
