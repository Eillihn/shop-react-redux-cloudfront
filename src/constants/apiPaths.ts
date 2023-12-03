const API_PATHS = {
  product: "https://ei8y1j35m9.execute-api.us-east-1.amazonaws.com/dev",
  order: "http://eillihn-cart-api-prod.us-east-1.elasticbeanstalk.com/api",
  import: "https://spf1zoytrk.execute-api.us-east-1.amazonaws.com/dev",
  bff: "http://eillihn-bff-api-dev.us-east-1.elasticbeanstalk.com",
  cart: "http://eillihn-cart-api-prod.us-east-1.elasticbeanstalk.com/api",
};

API_PATHS.product = `${API_PATHS.bff}/product`;
API_PATHS.cart = `${API_PATHS.bff}/cart`;

export default API_PATHS;
