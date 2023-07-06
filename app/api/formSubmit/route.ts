import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  // Check if the request method is POST
  if (req.method === "POST") {
    try {
      // Set the headers for the google scripts api
      const headers = new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
      });

      // Get the request body as JSON
      const body = await req.json();

      // Convert the JSON data to URL parameters
      const formData = new URLSearchParams(body).toString();

      // Send the data to the google scripts api endpoint
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzwXBinvCWlespYmjxHrt1ioxoHDK_vl4CBAA6eMPodmQlrqotdDj7td7VbELyyfwjx/exec",
        {
          method: "POST",
          headers,
          body: formData,
        }
      );

      // Return the response from the google scripts api
      const data = await response.json();
      return new NextResponse(JSON.stringify(data), {
        status: response.status,
      });
    } catch (error) {
      // Return a 500 Internal Server Error response
      return new NextResponse(
        JSON.stringify({ message: "Error submitting form", error }),
        { status: 500 }
      );
    }
  } else {
    // Return a 405 Method Not Allowed response for other methods
    return new NextResponse(null, { status: 405 });
  }
}
