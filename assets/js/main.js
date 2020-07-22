$(window).scroll(function () {
    var sticky = $('.header__bot'),
        scroll = $(window).scrollTop(),
        width = $(this.window).width();

    if (width > 768) {
        if (scroll >= 41) sticky.addClass('sticky');
        else sticky.removeClass('sticky');
    } else {
        if (scroll >= 60) sticky.addClass('sticky');
        else sticky.removeClass('sticky');
    }
});

$.validator.addMethod("phoneLength", function (value, element) {
    return value.replace(/\D+/g, '').length === 12;
}, "Некорректный номер!");

$.validator.addMethod("correctEmail", function (value, element) {
    return value.replace(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/i, '').length === 0;
}, "Некорректный email!");

$("#login").validate({
    rules: {
        number_phone: {
            required: true,
            phoneLength: true,
            minlength: 21,
        },
    },
    messages: {
        number_phone: 'Введите номер телефона',
    },
    submitHandler: function (form) {

        var code = Math.floor(Math.random() * (9999 - 1000) + 1000);
        var phone = $(form).find('input[name="number_phone"]').val();

        $('#number_code_hidden').val(code);
        $('#number_phone_hidden').val(phone);

        var data = {
            phone: phone,
            sms: code,
            action: 'sms_auth'
        };

        $.ajax({
            type: "POST",
            url: document.location.origin + '/wp-admin/admin-ajax.php',
            data: data,
            success: function () {
                $('#login').hide();
                $('#auth-form').show();
                $('#panel-auth').find('.panel__back').show();
                $('#panel-auth').find('.panel__block-title').text('Введите код из СМС');
                $('#auth-form').find('.login-form__title').html('Мы отправили его на номер<br>' + $('#number_phone_hidden').val());
                $('#panel-auth').find('.login-form__text a').css('pointer-events', 'none');
                $('#panel-auth').find('.login-form__text a').css('opacity', '0.5');
                setTimeout(undisabled_again_code, 30000);
                $("input[name='number_code']").focus();
            }
        });
        return false; // required to block normal submit since you used ajax
    }
});

function undisabled_again_code() {
    $('#panel-auth').find('.login-form__text a').css('pointer-events', 'all');
    $('#panel-auth').find('.login-form__text a').css('opacity', '1');
}

$("#auth-form").validate({
    rules: {
        number_code: {
            required: true,
            equalTo: '#number_code_hidden'
        },
    },
    messages: {
        number_code: 'Код введен не верно, или проищошла тех. ошибка, обратитесь в тех. поддержку.',
    },
    submitHandler: function (form) {

        var phone = $('#number_phone_hidden').val();

        var data = {
            phone: phone,
            action: 'eateasy_auth'
        };

        $.ajax({
            type: "POST",
            url: document.location.origin + '/wp-admin/admin-ajax.php',
            data: data,
            success: function () {
                window.document.location = location.href + "?login=true&#program";
            }
        });
        return false; // required to block normal submit since you used ajax
    }
});

function show_order_form() {
    $('#panel-order').addClass('active');
    $('.overlay').addClass('active');
    bodyScrollLock.disableBodyScroll();
}

$('.get_first_auth').click(function () {
    $('#login').show();
    $('#auth-form').hide();
    $('#panel-auth').find('.panel__block-title').text('Авторизуйтесь');
    $(this).hide();
    $("input[name='number_phone']").focus();
});

$(document).on('click', '#get_code_again', function (e) {
    var phone = $('#number_phone_hidden').val();
    var code = $('#number_code_hidden').val();

    var data = {
        phone: phone,
        sms: code,
        action: 'sms_auth'
    };

    $.ajax({
        type: "POST",
        url: document.location.origin + '/wp-admin/admin-ajax.php',
        data: data,
        success: function () {
            $('#panel-auth').find('.login-form__text a').css('pointer-events', 'none');
            $('#panel-auth').find('.login-form__text a').css('opacity', '0.5');
            setTimeout(undisabled_again_code, 30000);
            $("input[name='number_code']").focus();
        }
    });
    return false;
});

$('.phone-mask').inputmask({
    mask: "+375 (25|2\\9|33|44) 999 - 99 - 99",
    showMaskOnHover: false
});

$('.close-popup').click(function () {
    $.fancybox.close();
});

$('.header__menu-btn').click(function () {
    if ($('.header__bot').hasClass('sticky')) {
        $('.mobile-menu').toggleClass('act');
    } else {
        $('.mobile-menu').toggleClass('active');
    }
    if ($(this).hasClass('open')) {
        bodyScrollLock.enableBodyScroll();
    } else {
        bodyScrollLock.disableBodyScroll();
    }
    $(this).toggleClass('open');

});

$('.mobile-menu__nav a').click(function () {
    if ($('.header__bot').hasClass('sticky')) {
        $('.mobile-menu').toggleClass('act');
    } else {
        $('.mobile-menu').toggleClass('active');
    }
    if ($('.header__menu-btn').hasClass('open')) {
        bodyScrollLock.enableBodyScroll();
    } else {
        bodyScrollLock.disableBodyScroll();
    }
    $('.header__menu-btn').toggleClass('open');
});

$('.mobile-menu__nav li').click(function () {
    scrollLock.enableBodyScroll();
    $('.header__menu-btn').toggleClass('open');
    $('.mobile-menu').removeClass('active act');
});

if ($(window).width() > 1199) {
    $('.scroll-to').mPageScroll2id({
        offset: 99
    });
} else if ($(window).width() > 767) {
    $('.scroll-to').mPageScroll2id({
        offset: 85
    });
} else {
    $('.scroll-to').mPageScroll2id({
        offset: 61
    });
}

$('.accardion').each(function () {
    var title = $(this).find('.accardion__title');
    var body = $(this).find('.accardion__body');

    title.click(function () {
        if (title.hasClass('active')) {
            body.slideUp(300);
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
            body.slideDown(300);
        }
    });
});

$('.faq-section__tabs li').click(function () {
    var dataTab = $(this).data('tab');
    $('.faq-section__tabs li').removeClass('active');
    $(this).addClass('active');
    $('.faq-section__content').removeClass('active');
    $('.faq-section-content-' + dataTab).addClass('active');
});

$('.reviews-slider').slick({
    fade: true,
    slidesToShow: 1,
    prevArrow: '<div class="reviews-slider__arrow-prev"><svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 1L1 6L6 11" stroke="#7E7E7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 6H21" stroke="#7E7E7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>',
    nextArrow: '<div class="reviews-slider__arrow-next"><svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 1L21 6L16 11" stroke="#7E7E7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 6H1" stroke="#7E7E7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>',
});


$('.popular-dishes__slider').slick({
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    prevArrow: '<button class="popular-dishes__slider-arrow popular-dishes__slider-arrow--prev"><svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 1L1 6L6 11" stroke="#7E7E7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 6H21" stroke="#7E7E7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>',
    nextArrow: '<button class="popular-dishes__slider-arrow popular-dishes__slider-arrow--next"><svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 1L21 6L16 11" stroke="#7E7E7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 6H1" stroke="#7E7E7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>',
    responsive: [
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: true,
            }
        },
        {
            breakpoint: 577,
            settings: {
                adaptiveHeight: true,
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
});

$('.days li').click(function () {

    var data = $(this).data('day');

    $(this).addClass('active').siblings().removeClass('active');

    $('.day-content').removeClass('active');
    $('.day-content-' + data).addClass('active');

});

$('.days-mobile').change(function () {

    var data = $(this).val();

    $(this).addClass('active').siblings().removeClass('active');

    $('.day-content').removeClass('active');
    $('.day-content-' + data).addClass('active');

});

$(".day-content").each(function () {

    var select = $(this).find('.type-select');
    var dayTypeContainer = $('.day-type');
    var mobileSelect = $(this).find('.type-select-mobile');
    var cal = $('.day-content__cal');

    select.each(function () {

        var current = $(this).find('.type-select__current');
        var list = $(this).find('.type-select__list');
        var item = $(this).find('.type-select__item');


        current.click(function () {

            if ($(this).hasClass('active')) {
                list.hide();
                $(this).removeClass('active');
            } else {
                list.show();
                $(this).addClass('active');
            }
        });

        item.click(function () {
            var val = $(this).data('val');
            var text = $(this).html();
            var itemDataVal = $(this).data('cal');

            dayTypeContainer.each(function () {
                var id = $(this).data('id');

                if (id == val) {
                    $(this).addClass('active');
                }
                else $(this).removeClass('active');
            });

            $(list).hide();

            $('.type-select__current span').each(function () {
                $(this).text(text);
            });

            cal.each(function () {
                $(this).html(itemDataVal);
            });

            $('input[name="type"]').each(function () {
                $(this).prop('checked', false);
            });
            $('input[id="type-' + val + '"]').prop('checked', true);
            $('input[id="type-' + val + '"]').change();
        });

    });

    mobileSelect.change(function () {
        var val = $(this).val();
        var selected = $(this).find('option:selected');
        var itemDataVal = selected.data('cal');

        cal.html(itemDataVal);

        dayTypeContainer.removeClass('active');
        dayTypeContainer.each(function () {
            var id = $(this).data('id');

            if (id == val) {
                $(this).addClass('active');
            }
        });
    });

});


$(document).mouseup(function (e) {
    var container = $("YOUR CONTAINER SELECTOR");

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        $('.type-select__current').removeClass('active');
        $('.type-select__list').hide();
    }
});

/* program */


function change_food_list(images) {
    var html_img = '';
    $(images).each(function (index, value) {
        html_img += '<a href="#select-program-eat" class="open-panel-food" data-id="' + index + '"><img src="' + value + '" alt=""></a>';
    });
    $('.program__eating-list').html(html_img);
}

function change_food_list_slider(data) {
    $('.eating-list-slider').html(data);
    init_slider();
}

function change_program_text() {
    var text = $('input[name="type"]:checked').data('title');
    var text_day = $('input[name="dur"]:checked').data('text');
    $('.program__type').html(text + ' ' + text_day);
}

function change_sum_text(sum) {
    $('.program__coast').html(sum + ' руб./ день');
}

function show_discount(discount) {
    if (discount > 0) {
        $('#discount_block').show();
        $('#discount_block_order').show();
        $('#discount_block_value').html(discount + " %");
        $('#discount_block_order_value').html(discount + " %");
    }
    else {
        $('#discount_block').hide();
        $('#discount_block_order').hide();
    }
}

function change_finish_sum() {
    var days = $('input[name="dur"]:checked').data('days');
    var week = ~~(days / 5);
    var ifpercent = $('input[name="dur"]:checked').data('ifpercent');
    var sum = 0;
    var discount = 0;
    $('input[name="discount"]:checked').each(function () {
        if ($(this).data('discount') == true) {
            discount += Number($(this).val());
        }
        else {
            days += (Number($(this).val()) * week);
        }
    });

    $promocode_discount = $('input[name="promocode"]').data('discount');

    if ($promocode_discount != 0) {
        discount += Number($promocode_discount);
    }

    if ($('input[name="auto-renew"]').prop('checked') === true) {
        if (week >= 1) discount += Number($('input[name="auto-renew"]').val());
    }

    if (ifpercent == true) {
        var price = $('input[name="cal"]:checked').data('price');
        if ($('input[name="dur"]:checked').data('percent') != 0) {
            discount += Number($('input[name="dur"]:checked').data('percent'));
        }
        change_sum_text($('input[name="cal"]:checked').data('price'));
        sum = price * days * ((100 - discount) / 100);
        $('#par_discount').show();
    }
    else {
        sum = $('input[name="dur"]:checked').data('percent');
        change_sum_text(sum);
        $('#par_discount').hide();
    }

    show_discount(discount);

    var text_day = (days == 1) ? "день" : "дней";

    if (sum !== undefined) {
        $('#all_day_value').html('Итого ' + days + ' ' + text_day);
        $('#order_all_duration').html('Итого ' + days + ' ' + text_day);
        $('#all_sum_value').html(sum.toFixed(2) + ' руб.');
        $('#order_all_price').html(sum.toFixed(2) + ' руб.');
        $('input[name="wsb_total"]').val(sum.toFixed(2));
        $('input[name="wsb_invoice_item_price[0]"]').val(sum.toFixed(2));
        $('#order-price').html(sum.toFixed(2) + ' руб.');
    }

    $('.order__program-title').text($('input[name="type"]:checked').data('title'));
    $('input[name="wsb_invoice_item_name[0]"]').val($('input[name="type"]:checked').data('title'));
    $('.order__program-subtitle').text($('input[name="type"]:checked').parent().find('.program-type__text').text());
    $('.order__program-img').attr('src', $('input[name="type"]:checked').parent().find('.program-type__body').data('src'));
    $('#order-ccal').text($('input[name="cal"]:checked').data('count'));
    $('#order-duration').text($('input[name="dur"]:checked').data('text') + ' ( ' + days + ' ' + text_day + ' )');

    get_signature();

}


$(document).on('change', 'input[name="cal"]', function () {

    $('.program__eating-consist').html($(this).data('example'));
    change_finish_sum();
    var data = {
        number: $(this).val(),
        program_number: $('#program_number').val(),
        action: 'change_food_list'
    };

    $.ajax({
        url: document.location.origin + '/wp-admin/admin-ajax.php',
        type: 'POST',
        data: data,
        success: function (data) {
            change_food_list(JSON.parse(data).images);
            change_food_list_slider(JSON.parse(data).slider);
        }
    });
});

$(document).on('change', 'input[name="type"]', function () {
    $('#program_number').val($(this).val());
    var data = {
        number: $(this).val(),
        action: 'change_food_program'
    };

    $.ajax({
        url: document.location.origin + '/wp-admin/admin-ajax.php',
        type: 'POST',
        data: data,
        success: function (data) {
            $('.daily-calories__group').html(JSON.parse(data)['cal']);
            $('.duration__group').html(JSON.parse(data)['dur']);
            change_food_list(JSON.parse(data)['food']);
            var $cal_cur = jQuery('input[name="cal"]:checked');
            $('.program__eating-consist').html($cal_cur.data('example'));
            change_food_list_slider(JSON.parse(data).slider);
            change_finish_sum();
            change_program_text();

            setTimeout(function () {
                $('input[name="cal"]').each(function () {
                    $(this).prop('checked', false);
                    if (parseInt($(this).data('count')) == parseInt($('#select_program').data('maincal'))) {
                        $(this).prop('checked', 'checked');
                    }
                });
            }, 50);
        }
    });
});

$(document).on('change', 'input[name="dur"],input[name="discount"],input[name="auto-renew"],input[name="discount-order"],input[name="auto-renew-order"]', function () {
    if ($(this).attr('name') == "discount") {
        if ($(this).prop('checked') == true) {
            $('#radio-order-' + $(this).data('id')).prop('checked', true);
        }
        else $('#radio-order-' + $(this).data('id')).prop('checked', false);
    }

    if ($(this).attr('name') == "discount-order") {
        if ($(this).prop('checked') == true) {
            $('#radio-' + $(this).data('id')).prop('checked', true);
        }
        else $('#radio-' + $(this).data('id')).prop('checked', false);
    }

    if ($(this).attr('name') == "auto-renew") {
        if ($(this).prop('checked') == true) {
            $('input[name="auto-renew-order"]').prop('checked', true);
        }
        else $('input[name="auto-renew-order"]').prop('checked', false);
    }

    if ($(this).attr('name') == "auto-renew-order") {
        if ($(this).prop('checked') == true) {
            $('input[name="auto-renew"]').prop('checked', true);
        }
        else $('input[name="auto-renew"]').prop('checked', false);
    }

    change_finish_sum();
    change_program_text();
});

change_finish_sum();

$(document).on('submit', '#order', function () {
    var $form = $(this);
    var add_par = [];
    $('input[name="discount"]:checked').each(function () {
        add_par.push($(this).parent().find('.radio__title').text());
    });
    var data = {
        phone: $form.find('input[name="order_phone"]').val(),
        type_program: $('.program__type').text(),
        number_calories: $('input[name="cal"]:checked').parent().find('.cal-item__text').text(),
        duration: $('input[name="dur"]:checked').parent().find('.duration-item__body-title').text(),
        sum: $('#all_sum_value').text(),
        add_par: add_par,
        action: 'send_order'
    };

    $.ajax({
        url: document.location.origin + '/wp-admin/admin-ajax.php',
        type: 'POST',
        data: data,
        success: function (data) {
            $.fancybox.close();
            var form_text = JSON.parse(data);
            $('#thanks').find('.popup__title').text("" + form_text['title']);
            $('#thanks').find('.popup__text').text("" + form_text['text']);
            $('#thanks').find('.btn--black').text("" + form_text['button']);
            $.fancybox.open({
                src: '#thanks',
                type: 'inline'
            });
            $form.find('input[name="callback_phone"]').val("")
        }
    });
    return false;
});


/* program */

$(document).on('submit', '#callback', function () {
    var $form = $(this);
    var data = {
        phone: $form.find('input[name="callback_phone"]').val(),
        action: 'callback_form'
    };

    $.ajax({
        url: document.location.origin + '/wp-admin/admin-ajax.php',
        type: 'POST',
        data: data,
        success: function (data) {
            $.fancybox.close();
            var form_text = JSON.parse(data);
            $('#thanks').find('.popup__title').text("" + form_text['title']);
            $('#thanks').find('.popup__text').text("" + form_text['text']);
            $('#thanks').find('.btn--black').text("" + form_text['button']);
            $.fancybox.open({
                src: '#thanks',
                type: 'inline'
            });
            $form.find('input[name="callback_phone"]').val("")
        }
    });
    return false;
});

var disabledDays = [2, 4, 6, 0];



$('.datepicker-input').datepicker({
    dateFormat: 'd MM, DD   ',
    onRenderCell: function (date, cellType) {
        if (cellType == 'day') {
            var day = date.getDay(),
                isDisabled = disabledDays.indexOf(day) != -1;
            return {
                disabled: isDisabled
            }
        }
    },
    onSelect: function () {
        check_order_field();
    }
});

$('.form__select').niceSelect();

$('.add-comment').click(function () {

    var text = $(this).find('span');

    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        text.html('Добавить комментарий');
        $('.form__group--hidden').hide();
        $('textarea[name="wsb_comment_order"]').val("");
    } else {
        $(this).addClass('active');
        text.html('Удалить комментарий');
        $('.form__group--hidden').show();
        $('textarea[name="wsb_comment_order"]').focus();
    }

});
function init_slider() {
    $('.panel-program__slider').each(function () {
        $(this).not('.slick-initialized').slick({
            slidesToShow: 1,
            fade: true,
            arrows: false,
            infinite: false,
            asNavFor: '.panel-program__others',
            prevArrow: '<div class="panel-program__slider-arrow-prev"><svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 1L1 6L6 11" stroke="#7E7E7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 6H21" stroke="#7E7E7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>',
            nextArrow: '<div class="panel-program__slider-arrow-next"><svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 1L21 6L16 11" stroke="#7E7E7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 6H1" stroke="#7E7E7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>',
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: true,
                    }
                },
            ]
        });
    });

    $('.panel-program__others').each(function () {
        $(this).not('.slick-initialized').slick({
            slidesToShow: 6,
            prevArrow: '<div class="panel-program__others-arrow-prev"><svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 1L1 6L6 11" stroke="#7E7E7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 6H21" stroke="#7E7E7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>',
            nextArrow: '<div class="panel-program__others-arrow-next"><svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 1L21 6L16 11" stroke="#7E7E7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 6H1" stroke="#7E7E7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>',
            asNavFor: '.panel-program__slider',
            focusOnSelect: true,
            infinite: false,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 5,
                        arrows: false,
                    }
                },
            ]
        });
    });
}

$('.programs__list-item').each(function () {

    var btn = $(this).find('.show-more');
    var hiddenText = $(this).find('.programs__list-item-content-part-2');

    btn.click(function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active').html('Подробнее');
            hiddenText.hide();
        } else {
            hiddenText.show();
            $(this).addClass('active').html('Скрыть');
        }
    });

});
$(document).on('click', '.open-panel', function (e) {

    e.preventDefault();
    var data = $(this).attr('href');

    if (data == '#panel-auth') {
        $("input[name='number_phone']").focus();
    }

    $(data).addClass('active');
    $('.overlay').addClass('active');
    bodyScrollLock.disableBodyScroll();
});
$(document).on('click', '.panel__close,.overlay', function (e) {
    $('.panel').removeClass('active');
    $('.overlay').removeClass('active');
    bodyScrollLock.enableBodyScroll();

    history.pushState({}, null, document.location.origin);
});

$('.overlay').click(function () {
    $('.panel').removeClass('active');
    $('.overlay').removeClass('active');
    bodyScrollLock.enableBodyScroll();
});


function calc_program_calories() {
    var calc_koeff;
    var age = $('input[name="program_old"]').val();
    var height = $('input[name="program_height"]').val();
    var weight = $('input[name="program_weight"]').val();

    if (typeof man_program_info !== "undefined" && age != "" && height != "" && weight != "") {
        var gender = $('input[name="sex-group"]:checked').val();
        var activites_group_min = $('input[name="activites-group"]:checked').data('min');
        var target_group = $('input[name="target-group"]:checked').data('koeff');

        if (gender == "man") {
            calc_koeff = man_program_info.koeff;
            koeff_weight = man_program_info.koeff_weight;
            koeff_height = man_program_info.koeff_height;
            koeff_age = man_program_info.koeff_age;
        } else {
            calc_koeff = woman_program_info.koeff;
            koeff_weight = woman_program_info.koeff_weight;
            koeff_height = woman_program_info.koeff_height;
            koeff_age = woman_program_info.koeff_age;
        }

        var main_koeff = (parseFloat(calc_koeff) + parseFloat(koeff_weight) * weight + parseFloat(koeff_height) * height - parseFloat(koeff_age) * age) * activites_group_min * target_group;

        console.log(main_koeff);

        var koer_perc = parseInt(main_koeff) * 1.12;

        var first_checked_program_ccal = $('input[name="type_program"]').data('cal')[0];
        var checked_program_status = false;
        var checked_program = false;
        var checked_program_ccal = false;


        $('input[name="type_program"]').each(function () {
            $(this).attr('checked', false);
            var program = $(this);
            $(program).parents('.programs__list-item').hide();
            jQuery.each(jQuery(program).data('cal'), function () {
                if (((parseInt(main_koeff) <= parseInt(this)) === true) && ((parseInt(koer_perc) > parseInt(this)) === true)) {
                    if (checked_program_status === false) {
                        $(program).prop('checked', 'checked');
                        checked_program_status = true;
                        checked_program_ccal = parseInt(this);
                        checked_program = $(program);
                    }
                    $(program).parents('.programs__list-item').show();
                }
            });

        });

        if (checked_program_ccal === false) {
            $('input[name="type_program"]').each(function () {
                $(this).parents('.programs__list-item').hide();
            });
            if ((parseInt(main_koeff) * 0.9) < parseInt(first_checked_program_ccal)) {
                main_koeff = $('input[name="type_program"]:first').data('cal')[0];
                checked_program_ccal = $('input[name="type_program"]:first').data('cal')[0];
                checked_program = $('input[name="type_program"]:first');
            } else {
                main_koeff = $('input[name="type_program"]:last').data('cal')[2];
                checked_program_ccal = $('input[name="type_program"]:last').data('cal')[2];
                checked_program = $('input[name="type_program"]:last');
            }
            $(checked_program).parents('.programs__list-item').show();
            $(checked_program).prop('checked', 'checked');
        }
        else {
            main_koeff = checked_program_ccal;
        }
        $('#select_program').data('maincal', main_koeff)
        $('#program_select_cal').html(parseInt(main_koeff) + ' ккал/день')
        $('.programs').show();
        $('.panel__block-selection-title').html(checked_program.data('title') + ", " + $('#select_program').data('maincal'));
    }
}

$(document).ready(function () {
    calc_program_calories();
    init_slider();
});

$(document).on('change', 'input[name="sex-group"],input[name="activites-group"],input[name="target-group"]', function () {
    calc_program_calories();
});

$(document).on('keyup', 'input[name="program_old"],input[name="sex-group"],input[name="program_height"],input[name="program_weight"]', function () {
    calc_program_calories();
});

$(document).on('change', 'input[name="type_program"]', function () {
    $('.panel__block-selection-title').html($('input[name="type_program"]:checked').data('title') + ", " + $('#select_program').data('maincal'));
});

$('#select_program').click(function () {
    $('input[name="type"]').each(function () {
        $(this).prop('checked', false);
    });
    $('input[id="type-' + $('input[name="type_program"]:checked').data('id') + '"]').prop('checked', true);
    $('input[id="type-' + $('input[name="type_program"]:checked').data('id') + '"]').change();
    $('.panel').removeClass('active');
    $('.overlay').removeClass('active');
    bodyScrollLock.enableBodyScroll();

});

$(document).on('click', '.open-panel-food', function (e) {

    e.preventDefault();
    var data = $(this).attr('href');
    var this_id = $(this).data('id');
    $(data + ' .panel-program__slider').each(function () {
        $(this).slick('slickGoTo', this_id, true);
    });
    $(data + ' .panel-program__others').each(function () {
        $(this).slick('slickGoTo', this_id, true);
    });
    $(data).addClass('active');
    $('.overlay').addClass('active');
    bodyScrollLock.disableBodyScroll();
});


/* program */

$("#office_callback").validate({
    rules: {
        get_request_name: {
            required: true,
        },
        get_request_company: {
            required: true,
        },
        get_request_email: {
            required: true,
        },
        get_request_tel: {
            required: true,
            phoneLength: true,
        },
    },
    messages: {
        get_request_name: 'Введите Ваше имя',
        get_request_company: 'Введите наззвание компании',
        get_request_email: 'Введите коректный email',
        get_request_tel: 'Введите номер телефона',
    },
    submitHandler: function (form) {
        var data = {
            name: $(form).find('input[name="get_request_name"]').val(),
            company: $(form).find('input[name="get_request_company"]').val(),
            email: $(form).find('input[name="get_request_email"]').val(),
            phone: $(form).find('input[name="get_request_tel"]').val(),
            action: 'callback_form_offices'
        };

        $.ajax({
            url: document.location.origin + '/wp-admin/admin-ajax.php',
            type: 'POST',
            data: data,
            success: function (data) {
                $.fancybox.close();
                var form_text = JSON.parse(data);
                $('#thanks').find('.popup__title').text("" + form_text['title']);
                $('#thanks').find('.popup__text').text("" + form_text['text']);
                $('#thanks').find('.btn--black').text("" + form_text['button']);
                $.fancybox.open({
                    src: '#thanks',
                    type: 'inline'
                });
                $(form).find('input[name="get_request_name"]').val("");
                $(form).find('input[name="get_request_company"]').val("");
                $(form).find('input[name="get_request_email"]').val("");
                $(form).find('input[name="get_request_tel"]').val("");
            }
        });
        return false;
    }
});

$(document).on('click', '#send_promocode', function () {
    var data = {
        promocode: $('input[name="promocode"]').val(),
        action: 'get_promocode'
    };

    $.ajax({
        url: document.location.origin + '/wp-admin/admin-ajax.php',
        type: 'POST',
        data: data,
        success: function (data) {
            var info = JSON.parse(data);
            var text = info.text;

            if (info.status == true) {
                $('.promocode__status').removeClass('error-promocode');
                $('input[name="promocode"]').data('discount', info.discount);
                change_finish_sum();
            }
            else {
                $('.promocode__status').addClass('error-promocode');
            }
            $('.promocode__status').text(text);
        }
    });
    return false;
});


$(document).on('change', 'input[name="wsb_email_order"]', function () {
    $('input[name="wsb_email"]').val($(this).val());
});

$(document).on('change', 'input[name="wsb_phone_order"]', function () {
    $('input[name="wsb_phone"]').val($(this).val());
});


function get_signature() {
    var data = {
        wsb_seed: $('input[name="wsb_seed"]').val(),
        wsb_total: $('input[name="wsb_total"]').val(),
        wsb_customer_id: $('input[name="wsb_customer_id"]').val(),
        wsb_operation_type: $('input[name="wsb_operation_type"]').val(),
        action: 'action_signature'
    };
    var signature = "";
    $.ajax({
        url: document.location.origin + '/wp-admin/admin-ajax.php',
        type: 'POST',
        data: data,
        success: function (data) {
            $('input[name="wsb_signature"]').val(data);
        }
    });
}

function check_order_field() {
    var check_fields = true;

    var data_fields = {
        'wsb_name_order': $('input[name="wsb_name_order"]').val(),
        'wsb_surname_order': $('input[name="wsb_surname_order"]').val(),
        'wsb_email_order': $('input[name="wsb_email_order"]').val(),
        'wsb_phone_order': $('input[name="wsb_phone_order"]').val(),
        'wsb_address_order': $('input[name="wsb_address_order"]').val(),
        'wsb_house_order': $('input[name="wsb_house_order"]').val(),
        'wsb_date_order': $('input[name="wsb_date_order"]').val(),
        'wsb_time_order': $('select[name="wsb_time_order"]').val(),
    }
    $.each(data_fields, function (index, val) {
        if (val == "") check_fields = false;
    });

    if (check_fields == true) {
        $('#order_submit').removeClass('disabled-btn');
    }
    else $('#order_submit').addClass('disabled-btn');
}

$(document).on('keyup', '.form__group .form__input-input,.form__group .form__select', function () {
    check_order_field();
});
check_order_field();

$("#main_form_order").validate({
    rules: {
        wsb_name_order: {
            required: true,
        },
        wsb_surname_order: {
            required: true,
        },
        wsb_email_order: {
            required: true,
            correctEmail: true,
        },
        wsb_phone_order: {
            required: true,
            phoneLength: true,
        },
        wsb_address_order: {
            required: true,
        },
        wsb_house_order: {
            required: true,
        },
    },
    messages: {
        wsb_name_order: 'Введите Ваше имя',
        wsb_surname_order: 'Введите Вашу фамилию',
        wsb_email_order: 'Введите коректный email',
        wsb_phone_order: 'Введите номер телефона',
        wsb_address_order: 'Введите адрес доставки',
        wsb_house_order: 'Введите адрес доставки',
    },
    submitHandler: function (form) {
        return false;
    }
});

$(document).on('click', '#order_submit', function () {
    $(this).hide();

    var add_par = [];
    $('input[name="discount"]:checked').each(function () {
        add_par.push($(this).parent().find('.radio__title').text());
    });
    var auto_renew = "Да";
    if ($('input[name="auto-renew-order"]').prop('checked') === true) {
        auto_renew = "Нет";
    }

    var appliances = "Да";
    if ($('input[name="wsb_appliances_order"]').val() === true) {
        appliances = "Нет";
    }

    var data = {
        customer_id: $('input[name="wsb_customer_id"]').val(),
        type_program: $('input[name="wsb_invoice_item_name[0]').val(),
        ccal: $('#order-ccal').text(),
        duration: $('#order-duration').text(),
        name: $('input[name="wsb_name_order"]').val(),
        surname: $('input[name="wsb_surname_order"]').val(),
        email: $('input[name="wsb_email_order"]').val(),
        phone: $('input[name="wsb_phone_order"]').val(),
        address: $('input[name="wsb_address_order"]').val(),
        house: $('input[name="wsb_house_order"]').val(),
        date: $('input[name="wsb_date_order"]').val(),
        time: $('select[name="wsb_time_order"]').val(),
        appliances: appliances,
        payment_method: $('select[name="order_payment_method"] option:selected').text(),
        add_parametres: add_par,
        auto_renew: auto_renew,
        summ: $('input[name="wsb_total"]').val(),
        order_id: $('input[name="wsb_order_num"]').val(),
        action: 'full_order_send'
    };
    if ($('textarea[name="wsb_comment_order"]').val() != "") {
        data['comment'] = $('textarea[name="wsb_comment_order"]').val();
    }
    $.ajax({
        url: document.location.origin + '/wp-admin/admin-ajax.php',
        type: 'POST',
        data: data,
        success: function (data) {
            if ($('select[name="order_payment_method"]').val() != "card") {
                window.document.location = thanks_page + '?wsb_order_num=' + $('input[name="wsb_order_num"]').val();
            }
        }
    });

    if ($('select[name="order_payment_method"]').val() == "card") {
        $('#form_submit_bank').find('input[type="submit"]').click();
    }
    return false;
});







$('.js-try-btn').on('click', function () {

    $('.duration__group input[type="radio"]').prop('checked', false);

    $('.js-input-try').prop('checked', true);

    $('.js-input-try').trigger('change');

});




$('.recurring-input').on('change', function () {
    var checked = this.checked;
    if (checked) {
        $('#form_submit_bank input[name="wsb_operation_type"]').val('recurring_bind');
    } else {
        $('#form_submit_bank input[name="wsb_operation_type"]').val('');
    }
});