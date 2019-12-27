require(["gitbook", "jquery"],
    /**
     * @param gitbook
     * @param {JQueryStatic} $
     */
    function (gitbook, $) {
        $.extend({
            modal({title, content, buttons}) {

            }
        });
        $('.extra-html-donate button').on("click", function () {
            $(".extra-html-donate-qrcode").slideToggle()
        })
    }
);