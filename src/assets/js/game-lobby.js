"use strict";

document.addEventListener('DOMContentLoaded', init);

function init() {
    document.querySelector('#copy').addEventListener('click', copyToClipboard);
}

function copyToClipboard() {
    let copyURL = document.querySelector('#inviteURL');
    let range = document.createRange();
    range.selectNode(copyURL);
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    document.querySelector('#copy').addEventListener('click', copyToClipboard);

}


