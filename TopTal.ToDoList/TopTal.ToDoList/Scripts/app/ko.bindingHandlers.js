// ----------------------------------------------------------------------------
// Reusable bindings 

ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor) {
        $(element).datepicker({
		    format: "dd/mm/yyyy",
		    todayBtn: "linked",
		    autoclose: true
        }).on("changeDate", function (ev) {
            var observable = valueAccessor();
            observable(ev.date);
        });
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());

        var widget = $(element).data("datepicker");
        //when the view model is updated, update the widget
        if (widget) {
            widget.date = value;
            widget.setValue();
        }
    }
};