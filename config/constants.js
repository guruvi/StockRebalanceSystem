const envSchema = require("env-schema");

const schema = {
  type: "object",
  properties: {
    VALUE_URL: {
      type: "string"
    },
    API_KEY: {
      type: "string"
    },
    PRICE_FUNCTION: {
      type: "string"
    }
  }
};

const config = envSchema({
  schema: schema,
  dotenv: true
});

module.exports = config;