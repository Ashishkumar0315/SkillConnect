const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    try {
        const response = await fetch("https://skillconnect-production-469d.up.railway.app/api/register", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                role: role
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);

            registerForm.reset();

            window.location.href = "login.html";
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.error(error);

        alert("Unable to connect to server.");
    }
});