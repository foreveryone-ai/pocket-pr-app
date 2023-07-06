describe("/api/formSubmit", function () {
  test("user is able to submit form", async function () {
    const response = await fetch("http://localhost:3000/api/form-submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: "firstName",
        last_name: "lastName",
        email: "k@k.com",
        phone_number: "123-456-7890",
        message: "I am your biggest fan!!",
      }),
    });

    expect(response.status).tobe(200);
  });
});
