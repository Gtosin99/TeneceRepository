const fs = require('fs');

const requestHandler = (req, res) => {
  const url = req.url; //parse the url
  const method = req.method; //parse the method

  if (url === "/") {
    res.write("<html>");
    res.write("<head>");
    res.write("<title>My First Page</title>");
    res.write("</head>");
    res.write("<body>");
    res.write(
      '<form action="/message" method="POST"><input type="text" name="message"><button type="submit"> Send</button></form>'
    );
    res.write("</body>");
    res.write("</html>");
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = []; //creating an array to hold data entered
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk); // we are pushing the data into the array
    }); //request for when data is entered it performs the function after th comma
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString(); //converting the array into a string
      console.log(parsedBody);
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head>");
  res.write("<title>My First Page</title>");
  res.write("</head>");
  res.write("<body>");
  res.write("<h1>Hello World</h1>");
  res.write("<p>This is my first page</p>");
  res.write("</body>");
  res.write("</html>");
  res.end();
};

module.exports= requestHandler;
