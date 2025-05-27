// Check if element can't be displayed
// Finding id "doc_preview" (the file previewer that we check if it fails)
const previewer = document.getElementById("doc_preview");

if (previewer.hasAttribute("data-attachment_preview_processing") &&
    previewer.getAttribute("data-attachment_preview_processing") == "true"){
    console.log("Data is previewed correctly, extension doesn't need to do anything!");
} else {
    // Get the <a> that has download = "true"
    const a_elements = document.getElementsByTagName("a");

    // The element that will have the file download link on its href
    let download_element = null;

    // Find the element that contain the file we want to download.
    for (let i = 0; i < a_elements.length; i++){
        if (a_elements[i].download === "true"){
            download_element = a_elements[i];
            break;
        }
    }
    
    // Only continue ahead if we can both fetch the download element, and that our file is .go.
    // The checking of file type can only be done this way as the Canvas remote server can't recognize the file type anyway. As such, this is our best bet.
    if (download_element && download_element.textContent.toLowerCase().endsWith(".go")){
        // Hide the previewer as it'll say that this document cannot be displayed in Canvas.
        previewer.style.display = "none";

        // Adding a new displayer element to the appropriate location. It should be of format: <pre><code>the given file here</code></pre>
        const content_element = document.getElementById("content");

        const displayer = document.createElement("div");
        displayer.style.overflow = "scroll";
        displayer.style.height = "30vw";

        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.id = "extension_displayer";
        code.className = "language-go";

        pre.appendChild(code);
        pre.style.display = "none";

        displayer.appendChild(pre);

        content_element.insertBefore(document.createElement("hr"), previewer);
        content_element.insertBefore(displayer, previewer);

        // Fetch the file and display it.
        getGoFileContent(download_element.href)
        .then(text => {
            // If the function returns a text, display it in the prepared displayer element.
            code.textContent = text;
            pre.style.display = "block";
            if (typeof Prism !== "undefined") {
                Prism.highlightElement(code);
            }
        })
        .catch(error => {
            // If it returns with an error on fetching, say it in a <p> element.
            const error_message = document.createElement("p");
            error_message.textContent = error;
            content_element.insertBefore(error_message, previewer);
            console.error(error);
        })
    } 
}

// Fetch the file from a given url, and return the file's contents.
// Manifest V3 version: instead of fetching here, we ask the background script to do it. This is because in version 3, we have to do this as CORS permission is only given to background.
function getGoFileContent(url) {
    // Since previously it was async function, we return a Promise here.
    return new Promise((resolve, reject) => {
        // send a message to background to do fetch_go_file type of operation. The message should also contain the url we want to fetch. The callback will be put to the second argument's function of form (response: any) => void.
        chrome.runtime.sendMessage({ type: "fetch_go_file", url: url }, (response) => {
            // Process the response, and return the success / failure of the Promise.
            if (response && response.success) {
                resolve(response.content);
            } else {
                reject(response ? response.error : "No response from background script.");
            }
        });
    });
}