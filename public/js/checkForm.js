 function checkingNewAccountDetails(form) {
     if (form.userName.value === "") {
         swal("Oops!", "Username cannot be blank!", "error");
         form.userName.focus();
         return false;
     }
     re = /^\w+$/;
     if (!re.test(form.userName.value)) {
         swal("Oops!", "Username must contain only letters, numbers and underscores!", "error");
         form.userName.focus();
         return false;
     }
     var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

     if (!filter.test(form.email.value)) {
         swal("Oops!", "Please input a valid email address!", "error");
         form.email.focus();
         return false;
     }

     if (form.password1.value !== "" && form.password1.value == form.password2.value) {
         if (form.password1.value.length < 6) {
             swal("Oops!", "Password must contain at least six characters!", "error");
             form.password1.focus();
             return false;
         }
         if (form.password1.value == form.userName.value) {
             swal("Oops!", "Password must be different from Username!", "error");
             form.password1.focus();
             return false;
         }
         re = /[0-9]/;
         if (!re.test(form.password1.value)) {
             swal("Oops!", "Password must contain at least one number (0-9)!", "error");
             form.password1.focus();
             return false;
         }
         re = /[a-z]/;
         if (!re.test(form.password1.value)) {
             swal("Oops!", "Password must contain at least one lowercase letter (a-z)!", "error");
             form.password1.focus();
             return false;
         }
         re = /[A-Z]/;
         if (!re.test(form.password1.value)) {
             swal("Oops!", "Password must contain at least one uppercase letter (A-Z)!", "error");
             form.password1.focus();
             return false;
         }
     } else {
         swal("Oops!", " Please check that you've entered and confirmed your password!", "error");
         form.password1.focus();
         return false;
     }

     return true;
 }