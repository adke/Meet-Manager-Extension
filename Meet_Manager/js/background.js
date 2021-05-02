chrome.runtime.onInstalled.addListener(function (details) {
    chrome.storage.local.get(null, function (data) {
        if (details.reason === 'update') {
            const pv = details.previousVersion
            if (
                pv === '1.0.3' ||
                pv === '1.0.2' ||
                pv === '1.0.1' ||
                pv === '1.0.0'
            ) {
                chrome.storage.sync.set(data)
                chrome.storage.local.clear()
            }
        }
        if (!data.hasOwnProperty('auto-export')) {
            chrome.storage.sync.set({ 'auto-export': false })
        }
        if (!data.hasOwnProperty('show-popup')) {
            chrome.storage.sync.set({ 'show-popup': true })
        }
    })
})

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.data === 'instantiate') {
        chrome.tabs.executeScript(
            {
                file: 'js/attendance.js',
            },
            function (result) {
                sendResponse(result)
            }
        )
        return true
    } else if (message.data === 'open-url') {
        chrome.tabs.create({ url: message.url })
    } else if (message.data === 'check-active') {
        chrome.tabs.query({ active: true }, function (tabs) {
            let ready = false
            for (const tab of tabs) {
                if (tab.id === sender.tab.id) {
                    sendResponse({ ready: true })
                    ready = true
                }
            }
            if (!ready) {
                chrome.tabs.onActivated.addListener(function tabListener(
                    activeInfo
                ) {
                    if (activeInfo.tabId === sender.tab.id) {
                        chrome.tabs.onActivated.removeListener(tabListener)
                        sendResponse({ ready: true })
                    }
                })
            }
        })
        return true
    }
})


function postMessage(port, message) {
    if (port) {
        port.postMessage(message)
    }
}
