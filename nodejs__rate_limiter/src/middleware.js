class RateLimiterMiddleware {
  constructor(options) {
    this.rateLimitStore = new Map();
    this.options = options;
  }

  middleware() {
    return (req, res, next) => {
      const ip = req.ip;

      if (typeof this.rateLimitStore[ip] == "undefined") {
        this.rateLimitStore[ip] = {
          requestCount: 0,
          firstRequestTime: new Date().getTime(),
        };
      }

      const currentTimeStamp = new Date().getTime();

      let requestCount = this.rateLimitStore[ip].requestCount;

      let rateLimitRemaining = this.options.maxRequests - requestCount;

      res.set({
        "x-ratelimit-limit": this.options.maxRequests,
        "x-ratelimit-remaining": rateLimitRemaining - 1,
        "x-ratelimit-reset":
          this.rateLimitStore[ip].firstRequestTime + this.options.timeWindow,
      });

      if (
        requestCount + 1 > this.options.maxRequests &&
        currentTimeStamp - this.rateLimitStore[ip].firstRequestTime <
          this.options.timeWindow
      ) {
        const errorCode = 429;
        rateLimitRemaining = 0;
        res.setHeader("x-ratelimit-remaining", rateLimitRemaining);

        return res.status(errorCode).json({
          message: "You have exceeded the rate limit. Please try again later.",
          errorCode,
        });
      } else {
        requestCount = requestCount + 1;

        if (
          currentTimeStamp - this.rateLimitStore[ip].firstRequestTime >=
          this.options.timeWindow
        ) {
          requestCount = 1;
          this.rateLimitStore[ip].firstRequestTime = currentTimeStamp;

          res.setHeader(
            "x-ratelimit-remaining",
            this.options.maxRequests - requestCount
          );

          res.setHeader("x-ratelimit-reset", currentTimeStamp);
        }
        this.rateLimitStore[ip].requestCount = requestCount;
      }

      next();
    };
  }

  reset() {
    this.rateLimitStore.clear();
    this.rateLimitStore = new Map();
  }
}

module.exports = RateLimiterMiddleware;
