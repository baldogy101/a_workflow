function loadContent(page) {
    let pageMap = {
        "home": "components/main.html",
        "workflow": "components/workflow.html",
        "contact": "components/contact.html",
        "about": "components/about.html"
    };

    let pageUrl = pageMap[page] || "components/404.html"; // Default to 404 if not found

    loadComponent(pageUrl, "main-content");
}


function loadComponent(url, targetId) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Page not found");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(targetId).innerHTML = data;
        })
        .catch(error => {
            console.error("Error loading component:", error);
            // Load the 404 page if there’s an error
            fetch("components/404.html")
                .then(response => response.text())
                .then(data => {
                    document.getElementById(targetId).innerHTML = data;
                })
                .catch(err => console.error("Error loading 404 page:", err));
        });
}