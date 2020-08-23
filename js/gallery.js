const imageList = [];
var imageListIndex = 0;

const modal = document.getElementById("modal");
const prevImage = modal.querySelector("img.prev");
const nextImage = modal.querySelector("img.next");
const downloadLink = modal.querySelector("a.download");

function updateImage() {
    /* update main image */
    modal.style.backgroundImage=`url("${imageList[imageListIndex]}")`;
    downloadLink.href = imageList[imageListIndex].replace(/^\/images\//, "/images-download/");

    /* update preloaders */
    const prevIndex = imageListIndex - 1 >= 0 ? imageListIndex-1 : imageList.length-1;
    const nextIndex = imageListIndex + 1 < imageList.length ? imageListIndex+1 : 0;
    prevImage.src = imageList[prevIndex];
    nextImage.src = imageList[nextIndex];
}

modal.querySelector("a.close").addEventListener("click", evt => {
    evt.preventDefault();
    modal.style.display = "none";
});

modal.querySelector("a.prev").addEventListener("click", evt => {
    evt.preventDefault();
    if( --imageListIndex < 0 )
        imageListIndex = imageList.length-1;
    updateImage();
});
modal.querySelector("a.next").addEventListener("click", evt => {
    evt.preventDefault();
    if( ++imageListIndex >= imageList.length )
        imageListIndex = 0;
    updateImage();
});

document.querySelectorAll("ul.images a").forEach( link => {
    const src = link.getAttribute("href");
    link.imageListIndex = imageList.length;
    imageList.push(src);

    link.addEventListener("click", evt => {
        evt.preventDefault();

        imageListIndex = link.imageListIndex;
        updateImage();
        modal.style.display = "block";
    });
});
