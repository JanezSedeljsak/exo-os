/*window.onerror = function() {
    ipcRenderer.send('request-failed-to-generate-action');
} // global error handling (if error exsists app closes!)*/

window.$ = window.jQuery = require('jquery');
const electron = require('electron');
const { ipcRenderer } = electron;
const {
    getConfiguration,
    getTheme,
    user_getEverything,
    setUserName,
    setConfiguration,
    setTheme,
    user_setEverything
} = require('../scripts/sqliteQuery'),
    path = require('path'),
    moment = require('moment'),
    weather = require('weather-js'),
    Chart = require('chart.js'),
    fs = require('fs-extra'),
    sysInfo = require('systeminformation'),
    { canvasLoader } = require('../gameFiles/canvasLoading'),
    { determineTheme } = require('../scripts/theme'),
    AColorPicker = require('a-color-picker');

window.dragActivity = {
    active: false,
    target: null
};

$.fn.hasAttr = function (name) {
    return this.attr(name) !== undefined && this.attr(name) != true;
};

const dragStart = e => {
    $('.box-window').css('z-index', '0');
    dragActivity.active = true;
    let element = $(e.target).closest('.box-window').get(0).id;
    if (typeof $(e.target).attr('drag') === typeof undefined) return;
    dragActivity.target = components[element.substr(0, element.length - 11)];
    if ($(document.getElementById(dragActivity.target.id)).hasAttr("fscreen")) {
        console.log("tlke", document.getElementById('notes-box-window'));
        dragActivity.target = null;
        dragActivity.active = false;
        return;
    }

    document.getElementById(dragActivity.target.id).style.zIndex = '1';
    $(`#${dragActivity.target.id}`).css("border", `.2vw solid ${
        $('.box-window-top').css('background-color')
    }`);
    dragActivity.target.initialX = e.clientX - dragActivity.target.xOffset;
    dragActivity.target.initialY = e.clientY - dragActivity.target.yOffset;
};

const drag = e => {
    if (!dragActivity.active || !dragActivity.target) return;
    e.preventDefault();
    dragActivity.target.currentX = e.clientX - dragActivity.target.initialX;
    dragActivity.target.currentY = e.clientY - dragActivity.target.initialY;
    dragActivity.target.xOffset = dragActivity.target.currentX;
    dragActivity.target.yOffset = dragActivity.target.currentY;
    document.getElementById(dragActivity.target.id).style.transform = (`
        translate(${dragActivity.target.currentX}px, ${dragActivity.target.currentY}px)
    `);
};

const dragEnd = () => {
    if (!dragActivity.active || !dragActivity.target) return;
    dragActivity.target.initialX = dragActivity.target.currentX;
    dragActivity.target.initialY = dragActivity.target.currentY;
    dragActivity.active = false;
    dragActivity.target = null;
    $(`.box-window`).css("border", "none");
};

window.Platform = {
    css_id: 'alternate-css',
    nav_id: 'leftNav',
    onLoad: async () => {
        // get theme of UI
        getTheme.then(result => {
            $(document.getElementById(Platform.css_id)).html(result.ui_theme != null ? result.ui_theme : "")
        }).catch(err => console.log(err));
    },

    generateWidgets: async () => {
        // get platform widgets for display
        getConfiguration.then(result => {
            $(document.getElementById(Platform.nav_id)).html("");
            JSON.parse(result.settings).navigationMenu.forEach(obj => {
                if (obj.enabled) {
                    $(document.getElementById(Platform.nav_id)).append(`
                        <div id="${obj.name}_nav" custom_title="${components[obj.name].tooltip}">
                            <img src="../util/icons/${obj.name}.png" alt="/" />
                        </div>
                    `);
                }
            });
            $(document.getElementById('mainDiv')).children().hide();
            $(document.getElementById('accInfoDiv')).children().remove();
            $(document.getElementById('tutorialDiv')).children().remove();
            $('#platformDiv #content').children().remove();
            setTimeout(() => $(document.getElementById('platformDiv')).fadeIn(200), 300);
        }).catch(err => console.log(err));
    }
};

window.components = {
    games: {
        id: 'games-box-window', file: 'games.html', enabled: true,
        tooltip: 'eXo-games', defHeight: '50vh', currentX: null,
        currentY: null, initialX: null, initialY: null, yOffset: 0,
        xOffset: 0
    }, calculator: {
        id: 'calculator-box-window', file: 'calculator.html', enabled: true,
        tooltip: 'eXo-calculator', defHeight: '50vh', currentX: null,
        currentY: null, initialX: null, initialY: null, yOffset: 0,
        xOffset: 0
    }, notes: {
        id: 'notes-box-window', file: 'notes.html', enabled: true,
        tooltip: 'eXo-notes', defHeight: '50vh', currentX: null,
        currentY: null, initialX: null, initialY: null, yOffset: 0,
        xOffset: 0
    }, music: {
        id: 'music-box-window', file: 'music.html', enabled: true,
        tooltip: 'eXo-music', defHeight: '50vh', currentX: null,
        currentY: null, initialX: null, initialY: null, yOffset: 0,
        xOffset: 0
    }, video: {
        id: 'video-box-window', file: 'videoPlayer.html', enabled: true,
        tooltip: 'eXo-video', defHeight: '50vh', currentX: null,
        currentY: null, initialX: null, initialY: null, yOffset: 0,
        xOffset: 0
    }, weather: {
        id: 'weather-box-window', file: 'weather.html', enabled: true,
        tooltip: 'eXo-weather', defHeight: '50vh', currentX: null,
        currentY: null, initialX: null, initialY: null, yOffset: 0,
        xOffset: 0
    }, maps: {
        id: 'maps-box-window', file: 'maps.html', enabled: true,
        tooltip: 'eXo-maps', defHeight: '50vh', currentX: null,
        currentY: null, initialX: null, initialY: null, yOffset: 0,
        xOffset: 0
    }, photoEditor: {
        id: 'photoEditor-box-window', file: 'photoEditor.html', enabled: true,
        tooltip: 'eXo-photoEditor', defHeight: '50vh', currentX: null,
        currentY: null, initialX: null, initialY: null, yOffset: 0,
        xOffset: 0
    }, sysInfo: {
        id: 'sysInfo-box-window', file: 'sysInfo.html', enabled: true,
        tooltip: 'eXo-sysInfo', defHeight: '50vh', currentX: null,
        currentY: null, initialX: null, initialY: null, yOffset: 0,
        xOffset: 0
    }, sysControl: {
        id: 'sysControl-box-window', file: 'sysControl.html', enabled: true,
        tooltip: 'exo-sysControl', defHeight: '35vh', currentX: null,
        currentY: null, initialX: null, initialY: null, yOffset: 0,
        xOffset: 0
    }
};

$(document).ready(() => {
    let container = document.getElementById('content');

    container.onmousedown = dragStart;
    container.onmousemove = drag;
    //$('.box-window').mouseleave(dragEnd);
    document.onmouseup = dragEnd;
    //automated functions 
    setTimeout(() => $('body').fadeIn(500), 1000);
    (() => setInterval(() => $(document.getElementById('clock')).text(`${moment().format('LT')}`), 60000))();
    (() => {
        Platform.onLoad();
        if (!navigator.onLine)
            $.each(['maps', 'weather'], (index, value) =>
                components[value].enabled = false);
    })();

    $(document.getElementById('clock')).text(moment().format('LT'));
    $('.roundBtn').click(element => {
        switch (String(element.target.id)) {
            case 'exit':
                window.close();
                break;
            case 'minimize':
                ipcRenderer.send('request-mainwindow-minimize');
                break;
            case 'reset':
                self.location.assign(location);
                break;
            default:
                ipcRenderer.send('request-failed-to-generate-action');
                break;
        }
    });

    $('.dropbtn').click(() => Platform.generateWidgets());

    $('.data').click(e => {
        $(document.getElementById('mainDiv')).children().hide();
        $('#platformDiv #content').children().remove();
        $(document.getElementById('accInfoDiv')).children().remove();
        $(document.getElementById('tutorialDiv')).children().remove();
        switch (Number(e.target.id[0])) {
            case 1:
                if (document.getElementById('account-info-div-content')) break;
                $.get('../components/account.html', data => $('#accInfoDiv').append(data));
                $('#accInfoDiv').fadeIn(400);
                break;
            case 2:
                if (document.getElementById('tutorial-info-div-content')) break;
                $.get('../components/tutorial.html', data => $('#tutorialDiv').append(data));
                $('#tutorialDiv').fadeIn(400);
                break;
            case 3:
                ipcRenderer.send('request-mainwindow-logOut');
                break;
            default:
                ipcRenderer.send('request-failed-to-generate-action');
                break;
        }
    });

    $('body').keydown(e => {
        if ($('input[type=text]').is(':focus') || $('textarea').is(':focus')) return;
        if (e.which == 81) window.close(); //close application on 'q' pressed
        else if (e.which == 116) e.preventDefault(); //dont refresh with F5
        else if (e.which == 82) self.location.assign(location); //restart app on 'r' pressed
    });

    $(document).on('click', '.exit', e => closeTargetWindow(e.currentTarget.parentNode.parentNode.id));

    $(document).on('mousedown', '.box-window', event => {
        $('#content .box-window').css({ zIndex: '0' });
        event.currentTarget.style.zIndex = '1';
    });

    const find = (object, id_) => {
        for (let component in object)
            if (object[component].id == id_) return component;
    }

    const resetToDefault = (component_, type) => {
        type = type || null;
        component_.currentX = null;
        component_.currentY = null;
        component_.initialX = null;
        component_.initialY = null;
        component_.yOffset = 0;
        component_.xOffset = 0;
        if (!type) return;
        $(document.getElementById(component_.id)).css({
            transform: 'translate(0,0)',
            top: '0',
            left: '0'
        });
    };

    $(document).on('mousedown', '.box-window-top .box-window-toggle-fullScreen', e => {
        let targetID = e.currentTarget.parentNode.parentNode.id;
        console.log(components[find(components, targetID)]);
        if (!document.getElementById(targetID)) return;
        //console.log(e.currentTarget.parentNode.parentNode);
        if (['▢', '&#9634;'].includes(e.target.innerHTML)) {
            goFullScreen(targetID);
        } else if (['−', '&minus;'].includes(e.target.innerHTML)) {
            $('#leftNav').animate({
                width: '7vw',
                opacity: '1'
            });
            $('.box-window').css("resize", "both");
            $(document.getElementById(targetID)).animate({
                top: '8vh',
                left: '15vw',
                width: '50vw',
                height: components[find(components, targetID)].defHeight
            }, 800);
            document.getElementById('leftNav').setAttribute('toggle', '1');
            e.target.innerHTML = '&#9634;';
            $(document.getElementById(targetID)).removeAttr('fscreen');
        }
    });

    const goFullScreen = async targetID => {
        let target_element = document.getElementById(targetID),
            curr_component = components[find(components, targetID)];
        console.log(target_element.style);
        $(target_element).css({
            maxHeight: '100vh',
            maxWidth: '100vw'
        });
        $('.box-window').css("resize", "none");
        $(document.getElementById('leftNav')).animate({
            width: '0',
            opacity: '0'
        });
        document.getElementById('leftNav').setAttribute('toggle', '0');
        $(target_element).animate({
            left: `${0 - Number(curr_component.currentX)}px`,
            top: `${0 - Number(curr_component.currentY)}px`,
            width: '100%',
            height: '100%'
        }, 800);
        setTimeout(() => resetToDefault(curr_component, true), 900);
        $(target_element).attr('fscreen', true);
        $(`#${targetID} .box-window-top .box-window-toggle-fullScreen`).html('&minus;');
    }

    const closeTargetWindow = (targetID, speed) => {
        speed = speed || 700;
        resetToDefault(components[find(components, targetID)]);
        console.log(targetID);
        let obj = $(document.getElementById(targetID));
        if (obj) {
            $(document.getElementById('leftNav')).attr('toggle') == '0' ? $(document.getElementById('leftNav')).animate({
                width: '7vw',
                opacity: '1'
            }) : null;

            obj.css({ minHeight: 0 });
            obj.animate({
                top: '-1vh',
                height: '0',
                opacity: '0'
            }, speed);
            setTimeout(() => obj.remove(), 800);
        }
    };

    const navRequest = (windowId, keyCode) => {
        if (!components[windowId].enabled) {
            $('#content .box-window').css({ zIndex: '0' });
            if (document.getElementById('notEnabled-box-window'))
                $('#notEnabled-box-window').remove();
            $('.box-window').css({ minHeight: 0 });
            $.get(`../components/notEnabled.html`, data => $('#platformDiv #content').append(data));
            return;
        }

        if (keyCode === 0) {
            $('#content .box-window').css({ zIndex: '0' });
            if (!document.getElementById(components[windowId].id)) {
                $.get(`../components/${components[windowId].file}`, data => $('#platformDiv #content').append(data));
            } else {
                $(document.getElementById(components[windowId].id)).css({ zIndex: '1' });
            }
        } else if (keyCode === 1) {
            let opened = false;
            $('.box-window').each((key, window) => window.id !== components[windowId].id ?
                closeTargetWindow(window.id, 400) : opened = true
            );
            if (opened) return;
            setTimeout(() => {
                $.get(`../components/${components[windowId].file}`, data => $('#platformDiv #content').append(data));
            }, 200);
        } else if (keyCode === 2) {
            closeTargetWindow(components[windowId].id);
        }
    };

    $(document).on('mousedown', '#leftNav div', e => {
        let winId = e.currentTarget.id;
        winId = winId.substr(0, winId.indexOf('_'));
        navRequest(String(winId), e.button)
    });
});