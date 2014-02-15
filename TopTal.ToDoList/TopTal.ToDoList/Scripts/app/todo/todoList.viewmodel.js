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
    self.todoArray = ko.observableArray();

    // UI state
    self.loading = ko.observable(true);
    self.message = ko.observable();
    self.errors = ko.observableArray();

    // Operations
    self.load = function () { // Load data
        if (!startedLoad) {
            startedLoad = true;

            dataModel.getTodoes()
                .done(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        self.todoArray.push(data[i]);
                    }

                    self.loading(false);
                }).failJSON(function (data) {
                    var errors;

                    self.loading(false);
                    errors = dataModel.toErrorsArray(data);

                    if (errors) {
                        app.errors(errors);
                    } else {
                        app.errors.push("Error retrieving information.");
                    }
                });
        }
    }

    self.addTodo = function () {
        self.todoArray.push(new TodoBindModel(self.priorityEnum[2]));
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
