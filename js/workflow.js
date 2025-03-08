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
    selections = selections.filter(item => item !== "start" && item !== "discount_request" && item !== "downgrade");

    // Create bulletized product list
    let productHTML = selectedProducts.length > 0
        ? `<li>Product/s:<ul>` + 
          selectedProducts.map(product => `<li>${product}</li>`).join("") + 
          `</ul></li>`
        : "";

    // Update sessionStorage
    sessionStorage.setItem("userSelections", JSON.stringify(selections));

    // Debugging: Log selections
    console.log("Final Selections:", selections);

    // Define multiple links for each option
    const linkMap = {
        "CCP": [
            { text: "CCP Overview", url: "https://hello.atlassian.net/wiki/spaces/CW/pages/1503691722/CCP+Overview" },
            { text: "CCP: Quoting concepts", url: "https://hello.atlassian.net/wiki/spaces/CW/pages/3541957974/CCP+Quoting+concepts+invalidations+billing+details+overview" },
            { text: "CCP: Contact Change and Access Request", url: "https://hello.atlassian.net/wiki/spaces/CW/pages/1587124639/CCP+Contact+change+access+policy" }
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
        ],
        "direct+new+CCP": [
            { text: "CCP: Create a Quote for Direct Customer", url: "https://hello.atlassian.net/wiki/spaces/CW/pages/2599535252/CCP+Create+a+quote+for+direct+customers" }
        ],
        "trial+CCP": [
            { text: "CCP Trial Request", url: "https://hello.atlassian.net/wiki/spaces/CW/pages/1525188671/CCP+Cloud+trials+grace+periods" }
        ],
        "trial+ADA": [
            { text: "ADA Trial Request", url: "https://hello.atlassian.net/wiki/spaces/CW/pages/256308254/Generating+and+Extending+Cloud+Trials" }
        ],
        "direct+renewal_new+ADA": [
            { text: "Co-terming rules", url: "https://hello.atlassian.net/wiki/spaces/CW/pages/294192277/Co-terming+aligning+licenses+subscriptions" }
        ],
        "renewal_new+CCP": [
            { text: "CCP: Known Issues & Workarounds", url: "https://hello.atlassian.net/wiki/spaces/CW/pages/2918894167/CCP+Known+issues+workarounds#Co-terming-or-aligning-bill-dates-on-quotes" }
        ]
    };

    // **Define reference mappings separately**
    const comboLinkReferences = {
        "direct+upgrade+CCP": "direct+new+CCP",
        "direct+renewal_new+CCP": "direct+new+CCP",
        "direct+renewal_upgrade+CCP": ["renewal_new+CCP", "direct+new+CCP"],
        "direct+renewal_downgrade+CCP": ["renewal_new+CCP", "direct+new+CCP"],
        "direct+renewal_only+CCP":"direct+new+CCP",
        "direct+renewal_upgrade+ADA": "direct+renewal_new+ADA",
        "direct+renewal_downgrade+ADA": "direct+renewal_new+ADA"
    };

    // Generate summary list HTML
    let summaryHTML = selections.map(item => `<li>${item}</li>`).join("");

    // Add the bulletized product list separately
    summaryHTML += productHTML;

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

    // Extract selected combinations correctly (including referenced keys)
    let selectedKeys = [
        ...Object.keys(comboLinkMap),
        ...Object.keys(comboLinkReferences) // Include referenced keys
    ].filter(combo => combo.split("+").every(key => selections.includes(key)));

    // Function to resolve references recursively
    function resolveComboReference(key) {
        let resolvedKeys = [];
    
        while (comboLinkReferences[key]) {
            let ref = comboLinkReferences[key];
    
            if (Array.isArray(ref)) {
                // If the reference is an array, add all referenced keys
                resolvedKeys.push(...ref);
                break; // Stop further recursion since we resolved multiple keys
            } else {
                // If it's a single reference, follow it
                key = ref;
            }
        }
    
        if (!resolvedKeys.length) {
            resolvedKeys.push(key); // If no reference found, use the original key
        }
    
        return resolvedKeys;
    }
    

    // Loop through selected combinations
    selectedKeys.forEach(key => {
        let resolvedKeys = resolveComboReference(key); // Get all resolved keys (array)
    
        resolvedKeys.forEach(resolvedKey => {
            let links = comboLinkMap[resolvedKey]; // Get links for each resolved key
    
            if (links) {
                selectedLinks.push(...links);
            }
        });
    });
    



    // Convert links to HTML
    let linkHTML = selectedLinks.length > 0 
        ? `<h3>Related Links:</h3><ul>` + 
          selectedLinks.map(link => `<li><a href="${link.url}" target="_blank">${link.text}</a></li>`).join("") + 
          `</ul>` 
        : ""; // Hide section if no links are needed

    // Update summary list
    document.getElementById("summary-title").innerHTML = `<h3>Your Selections:</h3>`;
    document.getElementById("summary-list").innerHTML = summaryHTML;

    // Update the separate links section
    document.getElementById("selection-links").innerHTML = linkHTML;

    // Make elements visible and add border
    ["summary-list", "selection-links", "helpful-links"].forEach(id => {
        let element = document.getElementById(id);
        if (element) {
            element.style.display = "block"; // Make visible
            element.style.border = "1px solid #ccc"; // Add border
            element.style.borderRadius = "5px"; // Add border radius
            element.style.boxShadow = "2px 2px 5px #ccc"; // Add shadow
        }
    });

    // Show final message
    document.getElementById("workflow-steps").innerHTML = `<h2>Thank you! Your selections have been recorded.</h2>`;

    document.getElementById("helpful-links").innerHTML = `
        <h3>Helpful Links:</h3>
        <ul>
            <li><a href="https://www.atlassian.com/software/pricing-calculator" target="_new">Atlassian Pricing Calculator</a></li>
            <li><a href="https://hello.atlassian.net/wiki/spaces/CW/overview" target="_new">Advocate World</a></li>
            <li><a href="https://hello.atlassian.net/wiki/spaces/CW/pages/300626104/Sales+Transfers" target="_new">Sales Transfer</a></li>
        </ul>
    `; 
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
