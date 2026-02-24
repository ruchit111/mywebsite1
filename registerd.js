document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const fname = document.getElementById("fname");
  const lname = document.getElementById("lname");
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const password = document.getElementById("password");
  const confirm = document.getElementById("confirm");

  let valid = true;

  const userRegex = /^[a-zA-Z0-9]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

  document.querySelectorAll("small").forEach(s => s.innerText = "");


  if (!userRegex.test(username.value)) {
    username.nextElementSibling.innerText = "Only letters & numbers allowed";
    valid = false;
  }

  if (!emailRegex.test(email.value)) {
    email.nextElementSibling.innerText = "Invalid email format";
    valid = false;
  }

  if (!phoneRegex.test(phone.value)) {
    phone.nextElementSibling.innerText = "Phone must be 10 digits";
    valid = false;
  }

  if (!passRegex.test(password.value)) {
    password.nextElementSibling.innerText =
      "Password must include upper, lower, number & special char";
    valid = false;
  }

  if (password.value !== confirm.value) {
    confirm.nextElementSibling.innerText = "Passwords do not match";
    valid = false;
  }
 if (!valid) return;
   
    const fullName = fname.value + " " + lname.value;

    localStorage.setItem("user", JSON.stringify({
      name: fullName,
      isLoggedIn: true
    }));

    // localStorage.setItem("justRegistered", "true");

    alert("Registered Successfully!");
    window.location.href = "index.html";
  
});

