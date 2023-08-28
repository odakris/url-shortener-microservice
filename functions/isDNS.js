// Import dns
const dns = require("node:dns");

const isDNS = (body_url) => {
  try {
    let url = new URL(body_url);

    if (url.protocol === ("https:" || "http:")) {
      dns.lookup(url.hostname, (err, address, family) => {
        if (err) {
          console.log("err1:", err);
        }
      });
      return "Valid_URL";
    }
  } catch (err) {
    console.log("err2:", err);
  }
};

exports.isDNS = isDNS;
