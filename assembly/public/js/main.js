$(function () {
    if ($('textarea#ta').length) {
        CKEDITOR.replace('ta');

    }

    $('a.confirmDeletion').on('click', function (e) {
        if (!confirm('Are you sure you want to DELETE this page?')) return false;
    });

    if ($("[data-fancybox]".length))
        $("[data-fancybox]").fancybox();
});