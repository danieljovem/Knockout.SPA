// ----------------------------------------------------------------------------
// Reusable bindings 

ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor) {
        $(element).datepicker({
            format: "dd/mm/yyyy",
            todayHighlight: true,
            todayBtn: "linked",
            clearBtn: true,
		    autoclose: true
        }).on("changeDate", function (ev) {
            var observable = valueAccessor();
            observable(ev.date == null ? null : ev.date);
        });
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).datepicker("setDate", value == null ? null : new Date(value));
    }
};