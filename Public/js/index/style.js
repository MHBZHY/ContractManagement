/**
 * Created by zhy on 16/6/11.
 */
$(function () {
    $.setFrame();
});

$(window).resize(function () {
    $.setFrame();
});

$.setFrame = function () {
    $("h2").css("margin-top", ($(window).height() - $("div.main").height() - $("h2").height()) / 3);
    // alert($("body").height() + ", " + $("div.main").height() + ", " + $("h2").height());
};