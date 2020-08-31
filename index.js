const express = require("express");
const db = require("./database");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

//CREATE
app.post("/", function (req, res) {
  const query = "INSERT INTO messages (text) VALUES (?)";
  const values = [req.body.text];

  db.query(query, values, function (err, result) {
    if (err) throw err;
    const message = { id: result.insertId, text: values[0] };
    res.status(200).send(message);
  });
});

//READ
app.get("/", function (req, res) {
  console.log("GET was called");
  const query = "SELECT * FROM messages";

  db.query(query, function (err, result) {
    if (err) throw err;
    const messages = result;
    res.status(200).send(messages);
  });
});

app.get("/:id", function (req, res) {
  const id = parseInt(req.params.id);
  const query = "SELECT * FROM messages WHERE id = ?";
  const values = [id];
  console.log("GET:id was called and id is", id);
  console.log("all params:", JSON.stringify(req.params));

  db.query(query, values, function (err, result) {
    if (err) throw err;
    const found = result;

    if (found.length > 0) {
      res.status(200).send(found);
    } else {
      res.status(404).send({ msg: `No message with id ${id} found!` });
    }
  });
});

//UPDATE
app.put("/:id", function (req, res) {
  const id = parseInt(req.params.id);
  const query = "UPDATE messages SET text = ? WHERE id = ?";
  const values = [req.body.text, id];

  db.query(query, values, function (err, result) {
    if (err) throw err;
    const updated = [{ id: values[1], message: values[0] }];

    if (result.affectedRows === 0)
      return res
        .status(404)
        .send({ msg: `No message with id ${values[0]} found!` });

    res.status(200).send(updated);
  });
});

//DELETE
app.delete("/:id", function (req, res) {
  const id = parseInt(req.params.id);
  const query = "DELETE FROM messages WHERE id = ?";
  const values = [id];

  db.query(query, values, function (err, result) {
    if (err) throw err;
    const deleted = [{ id: values[0] }];

    if (result.affectedRows === 0)
      return res
        .status(404)
        .send({ msg: `No message with id ${values[0]} found!` });

    res.status(200).send(deleted);
  });
});

app.listen(port, () => console.log(`Running server on port ${port}`));
