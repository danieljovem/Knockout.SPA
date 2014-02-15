// Class to represent a row in the seat reservations grid
function TodoBindModel(initialPriority) {
    var self = this;

    // Data
    self.id = ko.observable();
    self.description = ko.observable();
    self.dueDate = ko.observable();
    self.priority = ko.observable(initialPriority);
    self.completed = ko.observable();
}
