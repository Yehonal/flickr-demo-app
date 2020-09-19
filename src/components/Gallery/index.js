import style from "./style.scss";
import template from "./template.html";
import FlickrService from "@this/services/FlickrService";

class Gallery extends HTMLElement {
  constructor() {
    super();
    const templateEl = document.createElement("template");
    templateEl.innerHTML = template;

    const styleEl = document.createElement("style");
    styleEl.appendChild(document.createTextNode(style));

    // create indipendent DOM
    const shadowRoot = this.attachShadow({ mode: "closed" });
    shadowRoot.appendChild(templateEl.content.cloneNode(true));
    shadowRoot.appendChild(styleEl);

    this.shadowDom = shadowRoot;
    this.galleryDom = this.shadowDom.querySelector(".gallery");
    this.currentPage = 0;
    this.searchText = "";

    // start flickr service
    this.flickrService = new FlickrService("a31291fbb92c2078dc081e40fa6ab76c");
  }

  async loadPictures(search="", page = 0, reset=false) {
    if (reset) {
      this.galleryDom.innerHTML="";
    }

    const pictures = await this.flickrService.search(search, page);
    const rowEl = document.createElement("div");
    rowEl.classList = ["row"];

    let colEl = document.createElement("div");
    colEl.classList = ["col"];
    console.log(Math.round(pictures.length / 3));
    pictures.map((p, k) => {
      // append prev column & create new one
      if (k > 0 && k % Math.round(pictures.length / 3) === 0) {
        rowEl.appendChild(colEl);
        colEl = colEl.cloneNode(false);
      }

      const imgEl = document.createElement("img");
      imgEl.src = p.link;

      colEl.appendChild(imgEl);
    });

    this.galleryDom.appendChild(rowEl);
  }

  galleryHandler() {
    this.loadPictures(this.searchText, this.currentPage);
    // Detect when scrolled to bottom.
    const galleryDom = this.galleryDom;
    document.addEventListener("scroll", () => {
      if (
         document.body.scrollTop +  document.body.clientHeight >=
        galleryDom.scrollHeight
      ) {
        this.currentPage++;
        this.loadPictures(this.searchText, this.currentPage);
      }
    });

    // Search on enter press
    var input = this.shadowDom.querySelector(".search-box");

    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", (event) => {
      if (event.code === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        console.log(`Searching for ${input.value}`);
        this.searchText = input.value;
        this.loadPictures(this.searchText, this.currentPage, true)
      }
    });
  }

  async connectedCallback() {
    this.galleryHandler();
  }

  onSearch() {

  }
}

customElements.define("flickr-gallery", Gallery);

export default Gallery;
