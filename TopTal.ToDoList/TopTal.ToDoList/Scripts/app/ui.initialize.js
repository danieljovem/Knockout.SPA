$(function () {
    $.datepicker.setDefaults($.datepicker.regional['pt-BR']);
    $.datepicker.setDefaults({
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        showOtherMonths: true,
        selectOtherMonths: true,
        dateFormat: "dd/mm/yy"
    });

    $(document).ready(function () {
        Globalize.culture('pt-BR');
    });
});