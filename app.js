const form = $("form");
const name = $("#name");
const cost = $("#cost");
const error = $("#error");
form.submit((e) => {
  e.preventDefault();

  if (name.value && cost.value) {
    const item = {
      name: name.value,
      cost: parseInt(cost.value),
    };
    console.log("wahtasfka");
    db.collection("expenses")
      .add(item)
      .then((res) => {
        error.textContent = "";
        name.value = "";
        cost.value = "";
      });
  } else {
    error.textContent = "Enter both Values !!";
  }
});
