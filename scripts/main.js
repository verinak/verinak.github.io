// TODO : refactor this mess
import "../components/ProjectCard/ProjectCard.js";
import { projectDetails } from "./projectDetails.js";

//// displaying projects
const projectGrid = document.querySelector("#work div");
Object.entries(projectDetails).forEach(([key, project]) => {
    const projectCard = document.createElement("project-card");
    projectCard.classList.add("reveal");
    projectCard.setAttribute("cardTitle", project.title);
    projectCard.setAttribute("imgSrc", project.image);
    projectCard.setAttribute("imgAlt", project.altText);
    projectCard.setAttribute("tags", JSON.stringify(project.tags));
    projectCard.setAttribute("btnId", key);
    projectCard.textContent = project.summary;

    // dispatch card click event
    projectCard.addEventListener("card-click", (e) => {
        // console.log("event dispatched");
        // console.log(e.detail.id);
        showProjectDetails(e.detail.id);
    });

    projectCard.setAttribute("id", key);
    projectGrid.insertAdjacentElement("beforeend", projectCard);
});

//// color theme
window.onload = () => {
    const savedTheme = localStorage.getItem("theme");
    // console.log("savedTheme: ", savedTheme);

    if (savedTheme) {
        document.documentElement.dataset.theme = savedTheme;
    }
    if (savedTheme === "dark")
        document.getElementById("themeToggle").checked = true;
};

const toggleTheme = (event) => {
    // update html/css
    const isDark = document.documentElement.dataset.theme === "dark";
    document.documentElement.dataset.theme = isDark ? "light" : "dark";

    // add to session storage
    localStorage.setItem("theme", isDark ? "light" : "dark");
};

const themeToggleCheck = document.getElementById("themeToggle");
themeToggleCheck.addEventListener("change", toggleTheme);

//// copy email
const copyIcon = (event) => {
    const copyIcon = document.getElementById("icon-copy");
    const copiedIcon = document.getElementById("icon-copied");

    copiedIcon.classList.add("visible");
    copyIcon.classList.remove("visible");

    setTimeout(() => {
        copiedIcon.classList.remove("visible");
        copyIcon.classList.add("visible");
    }, 1500);

    navigator.clipboard.writeText("verinamichelk@gmail.com");

    // console.log("copied!!");
};
const copyEmailBtn = document.getElementById("copy-email");
copyEmailBtn.addEventListener("click", copyIcon);

//// navbar menu
let showNavbar = false;

const showMenuBtn = document.getElementById("show-menu");
const toggleNavbar = () => {
    const navbar = document.querySelector("#mobile-nav");
    showNavbar = !showNavbar;
    showNavbar
        ? navbar.classList.add("visible")
        : navbar.classList.remove("visible");
    // set aria
    showMenuBtn.setAttribute(
        "aria-label",
        showNavbar ? "Close navigation menu" : "Open navigation menu",
    );
    showMenuBtn.setAttribute("aria-expanded", showNavbar);
};
showMenuBtn.addEventListener("click", toggleNavbar);

////modal
const detailsModal = document.getElementById("modal");
const modalContent = document.querySelector("#modal .modal-content");

const showDetailsModal = (id) => {
    // console.log(event.target.id);
    // console.log(id);
    const project = projectDetails[id];
    detailsModal.querySelector("h3").textContent = project.title;
    const img = detailsModal.querySelector("img");
    img.src = project.image;
    img.alt = project.altText;
    detailsModal.querySelector("#repoLink").href = project.repoLink;
    if (project.demoLink) {
        detailsModal.querySelector("#demoLink").href = project.demoLink;
        detailsModal.querySelector("#demoLink").style.display = "flex";
    } else {
        detailsModal.querySelector("#demoLink").href = "";
        detailsModal.querySelector("#demoLink").style.display = "none";
    }
    const descriptionDiv = detailsModal.querySelector(".description");
    const tagsDiv = detailsModal.querySelector(".pills");
    // clear old content
    descriptionDiv.textContent = "";
    tagsDiv.textContent = "";

    project.description.map((parText) => {
        const p = document.createElement("p");
        p.innerHTML = parText;
        descriptionDiv.insertAdjacentElement("beforeend", p);
    });

    project.tags.map((tagText) => {
        const span = document.createElement("span");
        span.textContent = tagText;
        tagsDiv.insertAdjacentElement("beforeend", span);
    });

    // show modal
    detailsModal.style.display = "block";
    // handle focus for accessibilty
    detailsModal.querySelector("#closeModal").focus();
    // openProjectId = id;
};

const closeDetailsModal = () => {
    // const url = new URL(window.location);
    // const projectId = url.searchParams.get("project");

    modalContent.style.animationName = "slideOut";
    modalContent.style.webkitAnimationName = "slideOut";

    detailsModal.style.animationName = "fadeOut";
    detailsModal.style.webkitAnimationName = "fadeOut";

    // wait for fadeout and slideout animations before setting display to none
    setTimeout(() => {
        detailsModal.style.display = "none";
        modalContent.style.animationName = "slideIn";
        modalContent.style.webkitAnimationName = "slideIn";

        detailsModal.style.animationName = "fadeIn";
        detailsModal.style.webkitAnimationName = "fadeIn";
    }, 400);

    // handle focus for accessibilty
    const url = new URL(window.location);
    const projectId = url.searchParams.get("project");

    const projectCard = document.querySelector(`project-card#${projectId}`);
    const detailsButton = projectCard.shadowRoot.querySelector(
        `button#${projectId}`,
    );
    detailsButton.focus();

    // console.log(projectFocused);
    document.querySelector("#work h2").focus();
};

const showProjectDetails = (id) => {
    // show modal
    showDetailsModal(id);

    // update query params and browser history
    const url = new URL(window.location);
    url.searchParams.set("project", id);
    history.pushState({ projectId: id }, "", url);
};

const hideProjectDetails = () => {
    // close modal
    closeDetailsModal();

    // update query params and browser history
    const url = new URL(window.location);
    url.searchParams.delete("project");
    history.pushState({}, "", url);
};

const closeModalBtn = document.getElementById("closeModal");
closeModalBtn.addEventListener("click", hideProjectDetails);

// global listeners

// open project modal if url has project
window.addEventListener("load", () => {
    const url = new URL(window.location);
    const projectId = url.searchParams.get("project");

    if (projectId) {
        showDetailsModal(projectId);
    }
});

// When the user clicks anywhere outside of the modal, close it
// and close nav menu when user clicks outside
window.onclick = (event) => {
    // console.log(event.target);
    // if user clicks the modal div (background) not modal-content
    if (event.target == detailsModal) {
        hideProjectDetails();
    }
    // close navbar
    if (showNavbar) {
        if (document.querySelector("#show-menu").contains(event.target)) return;
        // if (document.querySelector("#mobile-nav").contains(event.target))
        //     return;
        toggleNavbar();
    }
};

// Close if user pressed Esc key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        if (showNavbar) {
            toggleNavbar();
        }

        if (
            !detailsModal.style.display ||
            detailsModal.style.display === "none"
        )
            return;
        hideProjectDetails();
    }
});

// on window history change (back/forward buttons)
window.addEventListener("popstate", () => {
    const url = new URL(window.location);
    const projectId = url.searchParams.get("project");

    if (projectId) {
        showDetailsModal(projectId);
    } else {
        if (
            !detailsModal.style.display ||
            detailsModal.style.display === "none"
        )
            return;
        closeDetailsModal();
    }
});

// fade in animation on scroll
const prefersNative = CSS.supports("animation-timeline", "view()");

// If CSS scroll animations are supported, do NOTHING
if (!prefersNative) {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target); // run once
                }
            });
        },
        {
            threshold: 0.15,
        },
    );

    elements.forEach((el) => observer.observe(el));
}
