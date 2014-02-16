// ----------------------------------------------------------------------------
// Reusable bindings 

ko.bindingHandlers.datepicker = {
	init: function (element, valueAccessor) {
		$(element).datepicker({
		    format: "dd/mm/yyyy",
		    todayBtn: "linked",
		    autoclose: true
		});
	}
};