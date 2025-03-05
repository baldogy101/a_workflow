// Function to store selected products and finish
function finalizeSelection() {
    let selectedProducts = [];

    // Get all checked radio button values
    document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
        if (input.value !== "" && input.value !== "N/A") {
            selectedProducts.push(input.value);
        }
    });

    if (selectedProducts.length === 0) {
        alert("Please select at least one valid product.");
        return;
    }

    // Retrieve current selections
    let selections = JSON.parse(sessionStorage.getItem("userSelections")) || [];

    // Filter out "start" and "discount_request"
    selections = selections.filter(item => item !== "start" && item !== "discount_request");

    // Add selected products
    selections.push("Product/s: " + selectedProducts.join(", "));

    // Update sessionStorage
    sessionStorage.setItem("userSelections", JSON.stringify(selections));

    // Debugging: Log selections
    console.log("Final Selections:", selections);

    // Define multiple links for each option
    const linkMap = {
        "CCP": [
            { text: "CCP Overview", url: "https://example.com/ccp-overview" },
            { text: "CCP Pricing", url: "https://example.com/ccp-pricing" },
            { text: "CCP Documentation", url: "https://example.com/ccp-docs" }
        ],
        "ADA": [
            { text: "ADA Features", url: "https://example.com/ada-features" },
            { text: "ADA Compliance", url: "https://example.com/ada-compliance" }
        ],
        "JSW_Premium": [
            { text: "JSW Premium Benefits", url: "https://example.com/jsw-benefits" }
        ],
        "Confluence_Enterprise": [
            { text: "Confluence Enterprise Guide", url: "https://example.com/confluence-guide" },
            { text: "Confluence Enterprise Support", url: "https://example.com/confluence-support" }
        ]
    };

    // Define links for specific **combinations of selections**
    const comboLinkMap = {
        "partner+CCP": [
            { text: "CCP Partner Program", url: "https://example.com/ccp-partner" }
        ],
        "direct+ADA": [
            { text: "Direct ADA Integration", url: "https://example.com/direct-ada" }
        ]
    };

    // Generate summary list HTML
    let summaryHTML = selections.map(item => `<li>${item}</li>`).join("");

    // Generate separate link section HTML
    let selectedLinks = [];

    // Check for individual option links
    selections.forEach(item => {
        for (const key in linkMap) {
            if (item.includes(key)) {
                selectedLinks.push(...linkMap[key]); // Add all links for this selection
            }
        }
    });

    // Check for **combinations of options** (e.g., "partner" + "CCP")
    let selectedKeys = selections.filter(item => Object.keys(comboLinkMap).some(key => key.includes(item)));  
    selectedKeys.sort(); // Sort to match predefined order

    for (const key in comboLinkMap) {
        let comboKeys = key.split("+").sort(); // Split and sort stored key (e.g., ["CCP", "partner"])
        if (JSON.stringify(comboKeys) === JSON.stringify(selectedKeys)) {
            selectedLinks.push(...comboLinkMap[key]); // Add combination-specific links
        }
    }

    // Convert links to HTML
    let linkHTML = selectedLinks.length > 0 
        ? `<h3>Related Links:</h3><ul>` + 
          selectedLinks.map(link => `<li><a href="${link.url}" target="_blank">${link.text}</a></li>`).join("") + 
          `</ul>` 
        : ""; // Hide section if no links are needed

    // Update summary list
    document.getElementById("summary-list").innerHTML = summaryHTML;

    // Update the separate links section
    document.getElementById("selection-links").innerHTML = linkHTML;

    // Show final message
    document.getElementById("workflow-steps").innerHTML = `<h2>Thank you! Your selections have been recorded.</h2>`;
}



function clearSelections() {
    sessionStorage.removeItem("userSelections"); // Clear stored selections
    document.getElementById("summary-list").innerHTML = ""; // Clear the UI
    
    // Reload the initial workflow page
    loadComponent("components/workflow.html", "main-content");
}

function saveRenewalDate() {
    let dateInput = document.getElementById("renewal-date").value;

    if (!dateInput) {
        alert("Please select a renewal date before proceeding.");
        return;
    }

    // Get today's date in PST
    let today = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
    let todayDate = new Date(today).setHours(0, 0, 0, 0); // Remove time part

    // Convert user input to date
    let renewalDate = new Date(dateInput).setHours(0, 0, 0, 0); // Remove time part

    // Calculate the difference in days
    let timeDiff = renewalDate - todayDate;
    let daysUntilRenewal = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert ms to days

    // Retrieve current selections
    let selections = JSON.parse(sessionStorage.getItem("userSelections")) || [];

    // Store the renewal date and the number of days until renewal
    selections.push(`Renewal Date: ${dateInput}`);
    selections.push(`Days Until Renewal: ${daysUntilRenewal}`);
    sessionStorage.setItem("userSelections", JSON.stringify(selections));

    // Proceed to the next step (e.g., discount selection)
    nextStep("discount_request");
}
