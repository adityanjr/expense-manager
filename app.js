const form = document.querySelector("form");
const name = document.querySelector("#name");
const cost = document.querySelector("#cost");
const error = document.querySelector("#error");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (isNaN(cost.value)) {
    error.textContent = "Cost should be a number !!";
  } else if (name.value && cost.value) {
    const item = {
      name: name.value,
      cost: parseInt(cost.value),
    };

    db.collection("expenses")
      .add(item)
      .then((res) => {
        error.textContent = "";
        name.value = "";
        cost.value = "";
      });
  } else {
    error.textContent = "Enter Both Values !!";
  }
});
