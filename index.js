const https = require("https");
const username = process.argv[2];

const options = {
  hostname: "api.github.com",
  path: `/users/${username}/events`,
  method: "GET",
  headers: {
    "User-Agent": "Node.js",
  },
};

const req = https.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    if (username) {
      const events = JSON.parse(data);
      events.forEach((event) => {
        switch (event.type) {
          case "PushEvent":
            console.log(
              `Pushed ${event.payload.commits.length} ${
                event.payload.commits.length === 1 ? "commit" : "commits"
              } to ${event.repo.name}`
            );
            break;
          case "WatchEvent":
            console.log(`Starred ${event.repo.name}`);
            break;
          case "IssuesEvent":
            console.log(`Opened a new issue in ${event.repo.name}`);
            break;
        }
      });
    } else {
      console.log("Please provide a username");
    }
  });
});

req.on("error", (e) => {
  console.error("Error:", e.message);
});

req.end();
