const MDCRipple = mdc.ripple.MDCRipple
for (const button of document.getElementsByClassName('mdc-button')) {
    new MDCRipple(button)
}
// const iconButtonRipple = new MDCRipple(document.querySelector('#lang'));
// iconButtonRipple.unbounded = true;
// const MDCMenu = mdc.menu.MDCMenu
// const menu = new MDCMenu(document.querySelector('.mdc-menu'))
// menu.setFixedPosition(true)
// document.querySelector('#lang').addEventListener('click', function () {
//     menu.open = true
// })

const MDCDialog = mdc.dialog.MDCDialog
const resetDialog = new MDCDialog(document.querySelector('#reset-dialog'))
const clearDialog = new MDCDialog(document.querySelector('#clear-dialog'))

const MDCSnackbar = mdc.snackbar.MDCSnackbar
const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'))

const MDCSwitch = mdc.switchControl.MDCSwitch
const popupSwitch = new MDCSwitch(
    document.querySelector('#show-popup .mdc-switch'),
)

const autoKickSwitch = new MDCSwitch(
    document.querySelector('#auto-kick .mdc-switch'),
)

const autoAdmitSwitch = new MDCSwitch(
    document.querySelector('#auto-admit .mdc-switch'),
)

const openButton = document.querySelector('#open')

const powerButton = document.querySelector('#myCheck')


let showPopup = false
let on = false
let autokicking = false
let autoAdmitting = false

chrome.storage.sync.get(
    ['show-popup', 'myCheck', 'auto-kick', 'auto-admit'],
    function (result) {
        if (result['show-popup']) {
            popupSwitch.checked = true
            showPopup = true
        }

        if (result['myCheck']) {
            powerButton.checked = true
            on = true
        }

        if (result['auto-kick']) {
            autoKickSwitch.checked = true
            autokicking = true
        }

        if (result['auto-admit']) {
            autoAdmitSwitch.checked = true
            autoAdmitting = true
        }
    }
)


document.querySelector('#show-popup').addEventListener('click', function () {
    if (popupSwitch.checked !== showPopup) {
        showPopup = popupSwitch.checked
        chrome.storage.sync.set({ 'show-popup': popupSwitch.checked })
    }
})

document.querySelector('#auto-kick').addEventListener('click', function () {
    if (autoKickSwitch.checked !== autokicking) {
        autokicking = autoKickSwitch.checked
        chrome.storage.sync.set({ 'auto-kick': autoKickSwitch.checked })
    }
})

document.querySelector('#auto-admit').addEventListener('click', function () {
    if (autoAdmitSwitch.checked !== autoAdmitting) {
        autoAdmitting = autoAdmitSwitch.checked
        chrome.storage.sync.set({ 'auto-admit': autoAdmitSwitch.checked })
    }

})

const moreOptions = document.querySelector('#more-options')
const expandButton = document.querySelector('#expand')
expandButton.addEventListener('click', function () {
    if (moreOptions.hidden) {
        moreOptions.hidden = false
        expandButton.querySelector('.mdc-button__label').innerHTML =
            'Hide Advanced'
    } else {
        moreOptions.hidden = true
        expandButton.querySelector('.mdc-button__label').innerHTML =
            'Show Advanced'
    }
})

document.querySelector('#myCheck').addEventListener('click', function () {
    if (powerButton.checked !== on) {
        on = powerButton.checked
        chrome.storage.sync.set({ 'myCheck': powerButton.checked })
    }
})

const refreshButton = document.querySelector('#refresh')
refreshButton.addEventListener('click', function () {
    chrome.storage.sync.get('last-token-refresh', function (result) {
        const unix = ~~(Date.now() / 1000)
        let valid = true
        if (result.hasOwnProperty('last-token-refresh')) {
            if (unix - result['last-token-refresh'] < 86400) {
                valid = false
            }
        }
        if (valid) {
            chrome.storage.sync.set({ 'last-token-refresh': unix })
            refreshButton.disabled = true
            try {
                chrome.identity.getAuthToken({ interactive: false }, function (
                    token
                ) {
                    chrome.identity.removeCachedAuthToken(
                        { token: token },
                        function () {
                            console.log(`Removed auth token ${token}.`)
                            snackbar.close()
                            snackbar.labelText =
                                'Successfully refreshed auth token.'
                            snackbar.open()
                            refreshButton.disabled = false
                        }
                    )
                })
            } catch (error) {
                console.log(error)
                snackbar.close()
                snackbar.labelText =
                    'An error occurred while refreshing your auth token.'
                snackbar.open()
                refreshButton.disabled = false
            }
        } else {
            snackbar.close()
            snackbar.labelText =
                'Please wait until tomorrow to refresh your token again.'
            snackbar.open()
        }
    })
})


document.querySelector('#clear').addEventListener('click', function () {
    clearDialog.open()
})
document.querySelector('#confirm-clear').addEventListener('click', function () {
    chrome.storage.sync.get(null, function (result) {
        for (const key in result) {
            if (key !== 'spreadsheet-id') {
                chrome.storage.sync.remove(key)
            }
        }
        snackbar.close()
        snackbar.labelText = 'Successfully cleared storage.'
        snackbar.open()
    })
})
