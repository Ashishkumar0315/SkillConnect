const bcrypt = require("bcrypt");
const db = require("./database");

async function resetPassword() {

    const email = "aaa@gmail.com";

    // Choose your new password here
    const newPassword = "123";

    try {

        // Create bcrypt hash
        const hashedPassword =
            await bcrypt.hash(newPassword, 10);

        // Update password
        const sql = `
            UPDATE users
            SET password = ?
            WHERE email = ?
        `;

        db.query(
            sql,
            [hashedPassword, email],
            (err, result) => {

                if (err) {

                    console.error(
                        "Password reset failed:",
                        err
                    );

                    return;
                }

                if (result.affectedRows === 0) {

                    console.log(
                        "User not found."
                    );

                    return;
                }

                console.log(
                    "Password reset successfully!"
                );

                console.log(
                    "Email:",
                    email
                );

                db.end();

            }
        );

    } catch (error) {

        console.error(error);

        db.end();

    }

}

resetPassword();