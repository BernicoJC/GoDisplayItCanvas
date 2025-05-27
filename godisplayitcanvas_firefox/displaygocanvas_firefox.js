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

        // Adding a new displayer element to the appropriate location. It should be of format: <div><pre><code>the given file here</code></pre></div>
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
            // If the function returns a text, display it in the prepared code element.
            code.innerHTML = text;
            pre.style.display = "block";
            if (typeof Prism !== "undefined") {
                Prism.highlightElement(code);
            }
        })
        .catch(error => {
            // If it returns with an error on fetching, say it in a <p> element.
            const error_message = document.createElement("p");
            error_message.innerHTML = error;
            content_element.insertBefore(error_message, previewer);
            console.error(error);
        })
    } 
}

// Fetch the file from a given url, and return the file's contents.
async function getGoFileContent(url) {
    // Make an HTTP request on the url, use follow redirect so that we can keep moving through locations until we can reach the file, since the file is stored in some distant server.
    // This is also why we have to give those websites a permission on manifest.json.
    // As a result though, this code might break if Canvas uses another server, or have other names for those distant servers.
    let response = await fetch(url, {
        method: 'GET',
        credentials: 'include', // Export the cookie (login session) too so that this HTTP request have the authorization.
        redirect: 'follow'
    });

    if (response.ok){
        // Get the file's content
        let text = await response.text();
        return text;
    }
    else{
        throw new Error("Unable to fetch the file from the given URL.");
    }
}