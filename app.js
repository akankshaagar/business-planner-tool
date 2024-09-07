document.addEventListener("DOMContentLoaded", function () {
  const businessTypeSelect = document.getElementById("businessType");
  const dynamicFields = document.getElementById("dynamicFields");
  const submitBtn = document.getElementById("submitBtn");
  const statusMessage = document.getElementById("statusMessage");

  const fieldData = {
    ecommerce: ["Product Name", "Product Price", "Stock Quantity"],
    retail: ["Store Name", "Location", "Total Sales"],
    saas: ["Product Name", "License Type", "Monthly Users"],
  };

  businessTypeSelect.addEventListener("change", function () {
    const selectedType = businessTypeSelect.value;
    dynamicFields.innerHTML = "";

    if (selectedType) {
      fieldData[selectedType].forEach((field) => {
        const input = document.createElement("input");
        input.type = "text";
        input.name = field;
        input.placeholder = field;
        input.required = true;
        dynamicFields.appendChild(input);
      });

      dynamicFields.classList.remove("hidden");
      submitBtn.classList.remove("hidden");
    } else {
      dynamicFields.classList.add("hidden");
      submitBtn.classList.add("hidden");
    }
  });

  const disableButton = () => {
    submitBtn.classList.add("disabled");
    submitBtn.disabled = true;
  };

  const enableButton = () => {
    submitBtn.classList.remove("disabled");
    submitBtn.disabled = false;
  };

  document
    .getElementById("businessForm")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent the default form submission behavior

      disableButton(); // Disable submit button during submission
      statusMessage.textContent = "Submitting... Please wait";

      // Collecting form data
      const formData = new FormData(e.target);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Adding the business type to the data
      data["businessType"] = document.getElementById("businessType").value;

      // Sending the data to the Google Apps Script via fetch (POST request)
      fetch(
        "https://script.google.com/macros/s/AKfycbzDDN5OaBB1sqq6HAt17SbCrqQEjxX9XTiatGMJFQfRc_xrCzoPCOkL2GK44HndBcqxwA/exec",
        {
          method: "POST",
          mode: "cors", // Enable CORS (since the web app is hosted separately)
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )
        .then((response) => response.json()) // Parsing JSON response
        .then((result) => {
          if (result.status === "success") {
            statusMessage.textContent = "Form submitted successfully!";
          } else {
            statusMessage.textContent = "Error: " + result.message;
          }
          enableButton(); // Re-enable the submit button after completion
        })
        .catch((error) => {
          statusMessage.textContent = "An error occurred: " + error.message;
          enableButton(); // Re-enable the submit button even if there was an error
        });
    });

  //   function submitFormData(data, businessType) {
  //     // Here, you can implement the Google Sheets API call.
  //     console.log(data, businessType);

  //     // After submitting data
  //     setTimeout(() => {
  //       statusMessage.textContent = "Form submitted successfully!";
  //       enableButton();
  //     }, 1000); // simulate response delay
  //   }
});
