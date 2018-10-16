$(function () {
    //console.log($.mobile)
    if (false) {
        if ($.mobile) {
            $("#outerleftmenu, #outerconsumerpane").hide();
            var leftButton = $("<button>&#9776;</button>").css({
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "47px",
                height: "48px",
                borderRadius: "99px",
                border: 0,
                margin: 10,
                zIndex: 9999
            }).click(function () {
                $("#outerleftmenu").toggle();
            }),
            rightButton = $("<button>&#9776;</button>").css({
                position: "fixed",
                bottom: 0,
                right: 0,
                width: "47px",
                height: "48px",
                borderRadius: "99px",
                border: 0,
                margin: 10,
                zIndex: 9999
            }).click(function () {
                if ($.loadedApp != "adminsingleentry") $("#outerconsumerpane").toggle();
            });
            $("body").append(leftButton).append(rightButton);
        }
    }
});