module.exports = {
  siteMetadata: {
    siteUrl: "https://fromthepeople.net",
    title: "From the People",
  },
  plugins: [
    "gatsby-plugin-netlify",
    "gatsby-plugin-sass",
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "G-87XS5CQ7SB",
      },
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
  ],
};
