const {withBlitz} = require("@blitzjs/next")

/** @type {import('next').NextConfig} */
const nextConfig = {
  // typedRoutes breaks build when Link targets routes not yet in the app (e.g. /admin/venues).
}

module.exports = withBlitz(nextConfig)
