function nextStep(choice) {
    console.log("User selected:", choice); // Debugging log

    let workflowContainer = document.getElementById("workflow-steps");
    let summaryList = document.getElementById("summary-list");

    if (!workflowContainer || !summaryList) return;

    // Retrieve previous selections or start fresh
    let selections = JSON.parse(sessionStorage.getItem("userSelections")) || [];

    // Add new selection
    selections.push(choice);
    sessionStorage.setItem("userSelections", JSON.stringify(selections));

    // Update the summary list
    summaryList.innerHTML = selections.map(item => `<li>${item}</li>`).join("");

    // Define the next step based on the user's choice
    let stepHTML = "";

    switch (choice) {
        case "start":
            stepHTML = `
                <h2>Partner or Direct?</h2>
                <button onclick="nextStep('partner')">Partner</button>
                <button onclick="nextStep('direct')">Direct</button>
            `;
            break;

        case "partner":
        case "direct":
            stepHTML =`
                <h2>Cloud, Data Center, or Server?</h2>
                <button onclick="nextStep('cloud')">Cloud</button>
                <button onclick="nextStep('data_center')">Data Center</button>
                <button onclick="nextStep('server')">Server</button>
            `;
            break;

        case "server":
            stepHTML = `
                <h2>Support for server licenses is now deprecated.</h2>
            `;
            break;

        case "cloud":
        case "data_center":
            stepHTML = `
                <h2>Billing System?</h2>
                <button onclick="nextStep('ADA')">ADA</button>
                <button onclick="nextStep('CCP')">CCP</button>
                <button onclick="nextStep('ADA_and_CCP')">both</button>
                `;
            break;

        case "ADA":
        case "CCP":
        case "ADA_and_CCP":
            stepHTML = `
                <h2>New, Upgrade, Downgrade, or Renewal?</h2>
                <button onclick="nextStep('new')">New</button>
                <button onclick="nextStep('upgrade')">Upgrade</button>
                <button onclick="nextStep('downgrade')">Downgrade</button>
                <button onclick="nextStep('renewal')">Renewal</button>
            `;
            break;

        case "upgrade":
        case "downgrade":
            stepHTML = `
                <h2>Future date request</h2>
                <button onclick="nextStep('future_date_request')">Yes</button>
                <button onclick="nextStep('not_future_date_request')">No</button>
            `;
            break;
            
        case "renewal":
            stepHTML = `
                <h2>Renewal + Upgrade, Downgrade, or Renewal only?</h2>
                <button onclick="nextStep('renewal_upgrade')">Renewal + Upgrade</button>
                <button onclick="nextStep('renewal_downgrade')">Renewal + Downgrade</button>
                <button onclick="nextStep('renewal_new')">Renewal + New Product</button>
                <button onclick="nextStep('renewal_only')">Renewal only</button>
            `;
            break;

        case "renewal_upgrade":
        case "renewal_downgrade":
        case "renewal_only":
        stepHTML = `
                <h2>Input renewal date</h2>
                <input type="date" id="renewal-date" required>
                <button onclick="saveRenewalDate()">Next</button>
            `;
            break;

        case "discount_request":
        case "new":
        case "renewal_upgrade":
        case "renewal_downgrade":
        case "renewal_new":
        case "future_date_request":
        case "not_future_date_request":
            stepHTML = `
                <h2>With Discounts?</h2>
                <button onclick="nextStep('with_discount')">Yes</button>
                <button onclick="nextStep('no_discount')">No</button>
            `;
            break;

        case "with_discount":
        case "no_discount":
            stepHTML = `
                <h2>Select Products:</h2>
                <form id="product-selection">
                    <table class="product-table">
                        <tr>
                            <th>Product</th>
                            <th colspan="4">Type</th>
                        </tr>
                        <tr>
                            <td>JSW</td>
                            <td>
                                <label><input type="radio" name="JSW" value="JSW_Standard">Std</label><br>
                            </td>
                            <td>
                                <label><input type="radio" name="JSW" value="JSW_Premium">Prem</label><br>
                            </td>
                            <td>
                                <label><input type="radio" name="JSW" value="JSW_Enterprise">Ent</label><br>
                            </td>
                            <td>
                                <label><input type="radio" name="JSW" value="">N/A</label><br>
                            </td>
                        </tr>
                        <tr>

                        <tr>
                            <td>JSM</td>
                            <td>
                                <label><input type="radio" name="JSM" value="JSM_Standard">Std</label><br>
                            </td>
                            <td>
                                <label><input type="radio" name="JSM" value="JSM_Premium">Prem</label><br>
                            </td>
                            <td>
                                <label><input type="radio" name="JSM" value="JSM_Enterprise">Ent</label><br>
                            </td>
                            <td>
                                <label><input type="radio" name="JSM" value="">N/A</label><br>
                            </td>
                        </tr>
                        <tr>                        

                        <tr>
                            <td>Confluence</td>
                            <td>
                                <label><input type="radio" name="Confluence" value="Confluence_Standard">Std</label><br>
                            </td>
                            <td>
                                <label><input type="radio" name="Confluence" value="Confluence_Premium">Prem</label><br>
                            </td>
                            <td>
                                <label><input type="radio" name="Confluence" value="Confluence_Enterprise">Ent</label><br>
                            </td>
                            <td>
                                <label><input type="radio" name="Confluence" value="">N/A</label><br>
                            </td>
                        </tr>
                        <tr>

                        <tr>
                            <td>Atlassian Guard</td>
                            <td>
                                <label><input type="radio" name="AG" value="AG_Standard">Std</label><br>
                            </td>
                            <td>
                                <label><input type="radio" name="AG" value="AG_Premium">Prem</label><br>
                            </td>
                            <td>
                                <label><input type="radio" name="AG" value="AG_Enterprise">Ent</label><br>
                            </td>
                            <td>
                                <label><input type="radio" name="AG" value="">N/A</label><br>
                            </td>
                        </tr>
                        <tr>
                    </table>

                    <button type="button" onclick="finalizeSelection()">Submit</button>
                </form>
            `;
            break;

        default:
            console.error("Invalid choice received:", choice);
            stepHTML = `<h2>Invalid selection. Please go back.</h2>`;
    }

    // Update workflow container
    workflowContainer.innerHTML = stepHTML;
}