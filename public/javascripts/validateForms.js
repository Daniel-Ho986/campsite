// Initializes Bootstrap validation for forms with the 'validated-form' class, preventing submission if there are invalid fields.
(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Boostrap validation styles to
  const forms = document.querySelectorAll(".validated-form");

  // Loop over them and prevent submission
  Array.from(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();
