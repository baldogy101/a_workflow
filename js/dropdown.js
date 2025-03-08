document.addEventListener("DOMContentLoaded", function () {
    let dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", function () {
            this.classList.toggle("active");
            let menu = this.querySelector(".dropdown-menu");
            if (menu) {
                menu.style.display = menu.style.display === "block" ? "none" : "block";
            }
        });
    });
});