class ProjectCard extends HTMLElement {
    // Called each time the element is added to the document
    connectedCallback() {
        // shadow DOM
        const shadow = this.attachShadow({ mode: "open" });

        const title = this.getAttribute("cardTitle");
        const src = this.getAttribute("imgSrc");
        const alt = this.getAttribute("imgAlt");
        // console.log(this.getAttribute("imgAlt"));
        // console.log(alt);

        const content = this.innerHTML;
        const id = this.getAttribute("btnId");
        const tags = JSON.parse(this.getAttribute("tags"));

        // Apply external styles to the shadow dom
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute(
            "href",
            "./components/ProjectCard/ProjectCard.css",
        );

        shadow.innerHTML = `
        <div class="project-card">
            <div class="card-image">
                <img src=${src} alt=\"${alt}\"/>
            </div>
            <div class="card-content">
                <h3>${title}</h3>
                <p class="description">
                    ${content}
                </p>
                <div class="pills">
                    ${tags.map((tag) => `<span>${tag}</span>`).join("")}
                </div>
                <button
                    id=${id}
                    type="button"
                    aria-label=\"View project details for ${title} \"
                >
                    <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        height="16px"
                        viewBox="0 -960 960 960"
                        width="16px"
                        fill="currentColor"
                    >
                        <path
                            d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z"
                        />
                    </svg>
                    View details
                </button>
            </div>
        </div>`;

        shadow.appendChild(linkElem);

        shadow.querySelector(`button#${id}`).addEventListener("click", () => {
            // console.log("clicked!");
            this.dispatchEvent(
                new CustomEvent("card-click", {
                    detail: {
                        id: id,
                    },
                    bubbles: true,
                    composed: true,
                }),
            );
        });
    }
}

customElements.define("project-card", ProjectCard);
