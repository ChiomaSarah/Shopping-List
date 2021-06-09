const express = require("express");
const app = express();
const port = process.env.PORT || 2021;
const list = require("./items");

// middleware to prevent duplicates and check for unique entries.
const uniqueItemMiddleWare = function (req, res, next) {
  const name = req.body.name;
  let isNew = true;
  for (let i = 0; i < list.length; i++) {
    if (list[i].name === name) {
      isNew = false;
    }
  }
  console.log(name, isNew);
  if (isNew === true) {
    next();
  } else {
    res.json({
      status: 409,
      message: "Item already exists",
    });
  }
};

app.use(express.json());
app.get("/items", function (req, res) {
  if (list.length === 0) {
    res.json({
      status: 404,
      message: "No item found"
    });
  }else{
  res.json({
    status: 200,
    message: "Successful",
    data: list,
  });
}
});

app.post("/items", uniqueItemMiddleWare, function (req, res) {
  const item = req.body;
  item.id = list.length+1;
  list.push(req.body);
  res.status(201).json({
    status: 201,
    message: "Post created",
    data: item,
  });
});

app.get("/items/:id", function (req, res) {
  let found = list.find(function (item) {
    return item.id === parseInt(req.params.id);
  });
  if (found) {
    res.status(200).json({
      status: 200,
      message: "Item found",
      data: found,
    });
  } else {
    res.status(404).json({
      status: 404,
      message: "item not found",
    });
  }
});

app.patch("/items/:id", function (req, res) {
  let found = list.find(function (item) {
    return item.id === parseInt(req.params.id);
  });

  // const id = req.params.id;
  // const fruit = fruits[id];
  found.name = req.body.name || found.name;
  found.quantity = req.body.quantity || found.quantity;
  res.status(200).json({
    status: 200,
    message: "Post updated",
    data: found,
  });
});

app.delete("/items/:id", function (req, res) {
  let found = list.find(function (item) {
    return item.id === parseInt(req.params.id);
  });

  if (found) {
    let targetIndex = list.indexOf(found);
    list.splice(targetIndex, 1);
  }
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`app is listening on ${port}`);
});
