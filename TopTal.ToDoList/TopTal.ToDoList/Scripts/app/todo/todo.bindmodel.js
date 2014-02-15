// Class to represent a row in the seat reservations grid
function TodoBindModel(data) {
    var self = this;

    // Data
    self.id = ko.observable(data.id);
    self.description = ko.observable(data.description);
    self.dueDate = ko.observable(data.dueDate);
    self.priority = ko.observable(data.priority);
    self.completed = ko.observable(data.completed);
}