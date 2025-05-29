# Go Display It, Canvas!

> Allows UCSD Canvas to display .go file correctly in a nice syntax highlight.

![image](https://github.com/user-attachments/assets/cff2aa94-22d1-4f27-b01c-942672506283)


## Feature
Say goodbye to "This document cannot be displayed within Canvas." or downloading .go file to local! This extension automatically fetches the .go file in `canvas.ucsd.edu/courses/*/files/*` and display it for you with PrismJS syntax highlighting.

## Supported Browser
This extension has only been tested for these two browsers.
- Chrome (Manifest V3)
- Firefox (Manifest V2)

## Installation
### From Firefox Add-ons
- [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/go-display-it-canvas/)

### Manual Installation (Especially for Chrome)
- Chrome
  - Download or clone this repository.
  - Go to `chrome://extensions/.`.
  - Enable Developer mode.
  - Click Load unpacked and select the project folder (`./godisplayitcanvas_chrome`).
- Firefox
  - Download or clone this repository.
  - Go to `about:debugging`.
  - Click This Firefox > Load Temporary Add-on.
  - Select the manifest.json file from the project (`./godisplayitcanvas_firefox/manifest.json`).

## How it Works
1. Firstly, the extension will detect if the current URL is `"*://*.canvas.ucsd.edu/courses/*/files/*"` or `"*://ucsd.instructure.com/courses/*/files/*"`.
2. If the URL matches, and the file displayed is a .go code, it'll find the HTML element that stores a link to the download page.
3. The extension will then fetch the link (sending a HTTP request), following all of the redirections until the file is acquired.
4. It will then get the file's content and make a new div element that will apply PrismJS syntax highlighter.
5. And that's it, you should be able to see the file's content, highlighted as if it's in VSC!

## Disclaimer
- Currently, this extension uses pattern matching that’s rigid that might change. As such, it might have to be updated whenever Canvas uses a newer server DNS that points to the true location of the file.
- This extension is developed and tested to work for UCSD Canvas. Although the script will work for any other education institution’s Canvas, I can’t guarantee it since there’s no way for me to test it and know their Canvas page’s links. Furthermore, currently, the manifest.json of this extension specifically has UCSD Canvas's links in its regex for permissions and scripts matching, and as such it won't work for any other institution. In the future, I might add support for other institutions too.
- Similarly, this extension currently only supports displaying .go files. This is because PrismJS requires specification of file type for it to highlight correctly. And since Canvas itself doesn't recognize the file's type, it requires extensive pattern matching that I haven't had the time to support. However, in the future, I might add support for other languages, even those displayable by Canvas (since they turn files like .java to .pdf before displaying it).

## License
MIT License
