const express = require("express");
const router = require('./routes/user-routes');
const app = express();

import {hostname, port} from "./config";
import "./db";

app.use(express.json());
app.use('/users', router);
app.use(express.static("./client"));
app.listen(port, hostname, () => console.log(`Server running at http://${hostname}:${port}/`));
