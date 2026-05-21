const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const {
  SignJWT,
  jwtVerify,
  generateKeyPair,
  createRemoteJWKSet,
} = require("jose-cjs");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const validUser = async (req, res, next) => {
  const authorization = req?.headers?.authorization;

  if (!authorization) {
    return res.status(401).send({ error: true, message: "Unauthorized" });
  }

  const token = authorization.split(" ")[1];

  try {
    const JWKS = createRemoteJWKSet(
      new URL(`${process.env.CLIENT_URL}/api/auth/jwks`),
    );
    const { payload } = await jwtVerify(token, JWKS);

    req.user = payload;

    next();
    return;
  } catch (error) {
    return res.status(401).send({ error: true, message: "Unauthorized" });
  }
};

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("doc-appoint");
    const apppointmentsCollection = database.collection("appointments");
    const bookingsCollection = database.collection("bookings");
    //doc-appoint all api

    app.get("/", (req, res) => {
      res.send({ success: true, message: "Server is running fine" });
    });

    app.get("/appointments", async (req, res) => {
      const queryParams = req.query;

      if (queryParams?.search) {
        const search = queryParams?.search;

        let query = {};

        if (search && typeof search === "string" && search.trim() !== "") {
          query.name = { $regex: search.trim(), $options: "i" };
        }

        const cursor = apppointmentsCollection.find(query);

        const result = await cursor.toArray();

        return res.json(result);
      }

      const cursor = apppointmentsCollection.find();
      const result = await cursor.toArray();

      res.json(result);
    });

    // specific doctor api

    app.get("/appointments/:id", validUser, async (req, res) => {
      const { id } = req?.params;

      const query = { _id: new ObjectId(id) };

      const result = await apppointmentsCollection.findOne(query);

      res.json(result);
    });

    app.get("/top-rated-doctors", async (req, res) => {
      const cursor = apppointmentsCollection
        .find()
        .sort({ rating: -1 })
        .limit(3);
      const result = await cursor.toArray();

      res.json(result);
    });

    // bookings data post api

    app.post("/bookings", validUser, async (req, res) => {
      const { body } = req;

      const result = await bookingsCollection.insertOne(body);

      res.json(result);
    });

    //  specific user booking data get api

    app.get("/bookings/:id", validUser, async (req, res) => {
      const { id } = req?.params;

      const cursor = bookingsCollection.find({ userId: id });

      const result = await cursor.toArray();

      res.json(result);
    });

    // specific booking data update / patch api
    app.patch("/bookings/:bookingId", validUser, async (req, res) => {
      const { bookingId } = req?.params;
      const { body } = req;
      const query = { _id: new ObjectId(bookingId) };
      const result = await bookingsCollection.updateOne(query, {
        $set: {
          ...body,
        },
      });

      res.json(result);
    });

    // specific booking delete api

    app.delete("/bookings/:bookingId", validUser, async (req, res) => {
      const { bookingId } = req?.params;

      const query = { _id: new ObjectId(bookingId) };
      const result = await bookingsCollection.deleteOne(query);

      res.json(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
