window.onerror = function() {
    ipcRenderer.send('request-failed-to-generate-action');
} // global error handling (if error exsists app closes!)

const { ipcRenderer } = require('electron');
window.$ = window.jQuery = require('jquery');
const { loginFunc } = require('../scripts/sqliteQuery');

$(document).ready(() => {
    $('#usernameId').focus();
    $('#minimize').click(() => ipcRenderer.send('request-login-minimize'));
    $('#exit').click(() => window.close());

    const isLengthOk = element => {
        element = $(document.getElementById(element)) || null;
        element.css(element.val().length > 4 ? {color: 'white' } : {color: '#ff471a'});
    }

    $(document).on("input", "#usernameId", () => isLengthOk("usernameId"));
    $(document).on("input", "#passwordId", () => isLengthOk("passwordId"));
 
    const Login = () => {

        if ($('#usernameId').val().toString().length > 4 && $('#passwordId').val().toString().length > 4)
            loginFunc($('#usernameId').val(), $('#passwordId').val());
        else
            ipcRenderer.send('request-req-not-met-action');

        $('#usernameId').val('');
        $('#passwordId').val('');

    }

    $('#loginButton').click(Login);
    $('#passwordId').keypress(event => event.keyCode == 13 ? Login() : null);
    $('#noAcc').click(() => ipcRenderer.send('request-registration-action'));
});