const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

const options = {
  swaggerDefinition: {
    info: {
      title: "APIs",
      version: "1.0.0",
      description: "System Integration Assignment ",
    },
    host: "174.138.40.63:3000",
    basepath: "/",
  },
  apis: ["./server.js"],
};
const specs = swaggerjsdoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());
// const sanitizer = require("sanitize")();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require("sanitize").middleware);

// parse application/json
app.use(bodyParser.json());
const { check, validationResult } = require("express-validator");
const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "sample",
  port: 3306,
  connectionLimit: 5,
});
let conn;
let rows;
//connecting to maria db
// reference: https://mariadb.com/kb/en/getting-started-with-the-nodejs-connector/

//Description about the URI

app.get("/", (req, res) => {
  res.send(
    "you have the following urls that you can hit /n agent  company  customer  agent/'code'  company/'id'  customer/'code'    "
  );
});

/**
 * @swagger
 * /agent:
 *     get:
 *       description: Return all agents
 *       proceduces:
 *             - application/json
 *       responses:
 *           200:
 *               description: Every thing working fine.
 */
app.get("/agent", async (req, res) => {
  try {
    conn = await pool.getConnection();
    console.log("Successfully connected to mariaDB !");
    rows = await conn.query("SELECT * FROM agents");
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) conn.end();
    res.json({ data: rows });
  }
});

// to get all the companies

/**
 * @swagger
 * /company:
 *     get:
 *       description: Return all companies
 *       proceduces:
 *             - application/json
 *       responses:
 *           200:
 *               description: Everything is ok.
 */
app.get("/company", async (req, res) => {
  try {
    conn = await pool.getConnection();
    console.log("Successfully connected to mariaDB !");
    rows = await conn.query("SELECT * FROM company");
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) conn.end();
    res.json({ data: rows });
  }
});

//to get all the customers
/**
 * @swagger
 * /customer:
 *     get:
 *       description: Return all customers
 *       proceduces:
 *             - application/json
 *       responses:
 *           200:
 *               description: Everything is ok.
 */
app.get("/customer", async (req, res) => {
  try {
    conn = await pool.getConnection();
    console.log("Successfully connected to mariaDB !");
    rows = await conn.query("SELECT * FROM customer");
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) conn.end();
    res.json({ data: rows });
  }
});

//to get agent with specific code
/**
 * @swagger
 * /agent/{code}:
 *   get:
 *     description: returns the agent with given code
 *     parameters:
 *       - name: code
 *         in: path
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: OK
 */
app.get("/agent/:code", async (req, res) => {
  try {
    conn = await pool.getConnection();
    console.log("Successfully connected to mariaDB !");
    rows = await conn.query("SELECT * FROM agents WHERE AGENT_CODE=?", [
      req.params.code,
    ]);
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) conn.end();
    res.json({ data: rows[0] });
  }
});

//to get company with specific id

/**
 * @swagger
 * /company/{id}:
 *   get:
 *     description: returns the company with given id
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: OK
 */
app.get("/company/:id", async (req, res) => {
  try {
    conn = await pool.getConnection();
    console.log("Successfully connected to mariaDB !");
    rows = await conn.query("SELECT * FROM company WHERE COMPANY_ID=?", [
      req.params.id,
    ]);
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) conn.end();
    res.json({ data: rows[0] });
  }
});

//to get customer with specific code

/**
 * @swagger
 * /customer/{code}:
 *   get:
 *     description: returns the customer with given code
 *     parameters:
 *       - name: code
 *         in: path
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: OK
 */
app.get("/customer/:code", async (req, res) => {
  try {
    conn = await pool.getConnection();
    console.log("Successfully connected to mariaDB !");
    rows = await conn.query("SELECT * FROM customer WHERE CUST_CODE=?", [
      req.params.code,
    ]);
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) conn.end();
    res.json({ data: rows[0] });
  }
});

/**
 * @swagger
 * /company:
 *   post:
 *     description: Inserts a new company
 *     parameters:
 *       - name: compId
 *         in: formData
 *         type: string
 *         required: true
 *       - name: compName
 *         in: formData
 *         type: string
 *         required: true
 *       - name: compCity
 *         in: formData
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: OK
 */
app.post(
  "/company",
  [check("compId").not().isEmpty().isNumeric().trim().escape()],
  async (req, res) => {
    console.log("hitiing post");
    try {
      let compId = req.body.compId;
      let compName = req.body.compName;
      let compCity = req.body.compCity;

      console.log(compName + compCity);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      conn = await pool.getConnection();
      let result = await conn.query(
        "INSERT INTO `company` (`COMPANY_ID`, `COMPANY_NAME`, `COMPANY_CITY`) VALUES (?, ?, ?)",
        [compId, compName, compCity]
      );

      res.status(201).json({
        message: "company created successfully",
        createdCompany: {
          compId: compId,
          compName: compName,
          compCity: compCity,
          request: {
            type: "GET",
            url: "174.138.40.63:3000/company/" + compId,
          },
        },
      });
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    } finally {
      if (conn) return conn.end();
    }
  }
);

/**
 * @swagger
 * /company/{compId}:
 *   put:
 *     description: updates a customer
 *     parameters:
 *       - name: compId
 *         in: path
 *         type: string
 *         required: true
 *       - name: compName
 *         in: formData
 *         type: string
 *         required: true
 *       - name: compCity
 *         in: formData
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: OK
 */
app.put(
  "/company/:compId",
  [
    check("compName").not().isEmpty().trim().escape(),
    check("compCity").not().isEmpty().trim().escape(),
  ],
  async (req, res) => {
    console.log("hitiing put");
    try {
      let compName = req.body.compName;
      let compCity = req.body.compCity;
      let compId = req.params.compId;

      if (compId == null || compId == "" || !/^\d+$/.test(compId)) {
        res.status(400).send("please enter valid company Id");
      }
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      conn = await pool.getConnection();
      let result = await conn.query(
        "UPDATE  `company` SET  `COMPANY_NAME`=?, `COMPANY_CITY`=? WHERE `COMPANY_ID`= ?",
        [compName, compCity, compId]
      );

      res.status(201).json({
        message: "company updated successfully",
        updatedCompany: {
          compId: compId,
          compName: compName,
          compCity: compCity,
          request: {
            type: "GET",
            url: "174.138.40.63:3000/company/" + compId,
          },
        },
      });
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    } finally {
      if (conn) return conn.end();
    }
  }
);

/**
 * @swagger
 * /company/{compId}:
 *   patch:
 *     description: updates only city of a company
 *     parameters:
 *       - name: compId
 *         in: path
 *         type: string
 *         required: true
 *       - name: compCity
 *         in: formData
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: OK
 */
app.patch(
  "/company/:compId",

  [check("compCity").not().isEmpty().trim().escape()],
  async (req, res) => {
    console.log("hitiing patch");
    try {
      let compCity = req.body.compCity;
      let compId = req.params.compId;

      if (compId == null || compId == "" || !/^\d+$/.test(compId)) {
        res.status(400).send("please enter valid company Id");
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      conn = await pool.getConnection();
      let result = await conn.query(
        "UPDATE  `company` SET  `COMPANY_CITY`=? WHERE `COMPANY_ID`= ?",
        [compCity, compId]
      );

      res.status(201).json({
        message: "city updated successfully",
        updatedCompany: {
          compId: compId,
          compCity: compCity,
          request: {
            type: "GET",
            url: "174.138.40.63:3000/company/" + compId,
          },
        },
      });
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    } finally {
      if (conn) return conn.end();
    }
  }
);

/**
 * @swagger
 * /company/{compId}:
 *   delete:
 *     description: Deletes a company with the given id
 *     parameters:
 *       - name: compId
 *         in: path
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: OK
 */
app.delete("/company/:compId", async (req, res) => {
  try {
    let compId = req.params.compId;
    if (compId == null || compId == "" || !/^\d+$/.test(compId)) {
      res.status(400).send("please enter valid company Id");
    }
    conn = await pool.getConnection();
    let result = await conn.query("DELETE FROM company WHERE `COMPANY_ID`=?", [
      compId,
    ]);

    res.status(201).json({
      message: "company deleted successfully",
      DeletedCompany: {
        compId: compId,
        request: {
          type: "GET",
          url: "174.138.40.63:3000/company/",
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  } finally {
    if (conn) return conn.end();
  }
});

app.listen(port, () => {
  console.log("Example app listening at http://localhost:${port}");
});
