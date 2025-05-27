// Listen for message from the main script. The callback is of form () => void.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Depending on the message type, do the fetching, and return the response's text.
    if (message.type === "fetch_go_file") {
        // Make an HTTP request on the url, use follow redirect so that we can keep moving through locations until we can reach the file, since the file is stored in some distant server.
        // This is also why we have to give those websites a permission on manifest.json.
        // As a result though, this code might break if Canvas uses another server, or have other names for those distant servers.
        fetch(message.url, {
            credentials: "include", // Export the cookie (login session) too so that this HTTP request have the authorization.
            redirect: "follow"
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch file.");
            return response.text();
        })
        // With that fetched text returned by the previous .then(), send it back to the main script with success report.
        .then(text => sendResponse({ success: true, content: text }))
        .catch(error => sendResponse({ success: false, error: error.message }));

        // tells Chrome to keep the message channel open for async response
        return true;
    }
});