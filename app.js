"strict mode";
// CODE BY YOTI
const progressBar = document.querySelector(".progress-bar-fill");
const progText = document.querySelector(".progress-text");
// How to track the download progress of a request made using fetch function.
// For this url, its limited to the download part of the url
fetch("https://fetch-progress.anthum.com/30kbps/images/sunrise-baseline.jpg") // Fetch is used to get a url
    // This is going to return a response object which is accessible with the "then()" method
    .then((resp) => {
        const contentLength = resp.headers.get("content-length"); // The size of the file to be downloaded
        let loaded = 0;

        return new Response(
            new ReadableStream({
                // A new readable stream
                start(controller) {
                    // this reads the stream
                    const reader = resp.body.getReader();
                    read();

                    function read() {
                        reader.read().then((ProgressEvent) => {
                            // this has available in it the amount of progress in bytes
                            if (ProgressEvent.done === true) {
                                // This checks if the progress is done....if its, progressEvent.done will be true.
                                controller.close(); // Once the progress is done, we stop the reading of the stream
                                return;
                            }
                            // The function above will deal with thereading of the stream and monitoring......however, while that is working, we do want to pass the data readings into
                            // the new readableStream that we created above
                            loaded += ProgressEvent.value.byteLength;
                            const percent = Math.round((loaded / contentLength) * 100) + "%";
                            progressBar.style.width = percent;
                            progText.textContent = percent;
                            controller.enqueue(ProgressEvent.value);
                            read();
                        });
                    }
                },
            })
        );
    })
    //This depends on wha type of file you are downloading
    // - "res.text" if you want the result to be read in text
    // - "res.json" if its a json file, and you want it to be read to a javaScript object
    // - "res.blob" if its an image. Like in this test
    .then((resp) => resp.blob())
    .then((blob) => {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.src = url;
        document.body.appendChild(img);
    });