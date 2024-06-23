const express = require('express');
const app = express();
const port = 3000;

const ipRateLimits = {};

function checkRateLimit(ip) {
  const windowMs = 60 * 100;
  const maxRequest = 3;
  console.log(ipRateLimits);
  if (!ipRateLimits[ip]) {
    ipRateLimits[ip] = { count: 1, timestamp: Date.now() };
    return true;
  } else {
    const { count, timestamp } = ipRateLimits[ip];
    if (Date.now() - timestamp > windowMs) {
      ipRateLimits[ip] = { count: 1, timestamp: Date.now() };
      return true;
    } else {
      if (count < maxRequest) {
        ipRateLimits[ip].count++;
        return true;
      } else {
        return false;
      }
    }
  }
}

function rateLimitMiddleware(req, res, next) {
  const clientIP = req.ip;
  if (checkRateLimit(clientIP)) {
    console.log('Request Allowed');
    next();
  } else {
    console.log('rate limit exceeded, please try agin later');
    res.status(429).send('Rate limit exceeded, please try agin later');
  }
}

app.use(rateLimitMiddleware);

app.get('/ok', (req, res) => {
  res.send('Ok');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
