const axios = require("axios");
const fs = require("fs");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { type } = require("os");

// const image = fs.readFileSync("YOUR_IMAGE.jpg", {
//     encoding: "base64"
// });

app.use(express.static("src"));
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/index.html");
});
app.post("/predict", async (req, res) => {
  axios({
    method: "POST",
    url: "https://detect.roboflow.com/proj-ex/1",
    params: {
      api_key: "QDbKOXh3RpVEGto84m05",
    },
    data: req.body.image,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).catch(function (error) {
    res.status(500).send("Photo was too big to process.");
  }).then(function (response) {
      if (response.data.predicted_classes.length > 0) {
        var foodJSONdata =
          JSON.parse( fs.readFileSync("foodInfo.json"))[response.data.predicted_classes[0]];
          foodJSONdata['name'] = response.data.predicted_classes[0];
        res.status(200).send(JSON.stringify(foodJSONdata));
      } else {
        res
          .status(404)
          .send(
            "Unable To Detect. Either The Image Was Not Clear Or This Item Is Not Yet Supported. Please Try Again."
          );
      }
    })
    .catch(function (error) {
      res.status(500).send("Some Issue Occured, Try Again Later.");
    });
});

app.get("/team", (req, res) => {
  res.send("<h1>PRAKHAR BSDKE KARDE</h1>")
  // res.sendFile(__dirname + "/src/team.html");
})