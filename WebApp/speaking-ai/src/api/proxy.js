const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (req, res) => {
  const proxy = createProxyMiddleware({
    target: "http://sai.runasp.net/api", // Backend HTTP
    changeOrigin: true, // Đổi origin để backend nhận diện
    pathRewrite: {
      "^/api": "", // Bỏ prefix /api trong yêu cầu
    },
  });
  proxy(req, res);
};
