module.exports = {
  siteMetadata: {
    title: ``,
    description: `Byte-sized episodes, experiences and encounters with software engineering from a junior software engineer and grad computer science student`,
    siteUrl: `https://bitwise.engineer`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    `gatsby-plugin-catch-links`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        useMozJpeg: true,
        stripMetadata: true,
        defaultQuality: 50,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-reading-time`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 900,
              quality: 75,
              withWebp: true,
              linkImagesToOriginal: false,
            },
          },
        ],
      },
    },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-dark-mode`,
    `gatsby-plugin-robots-txt`,
    {
      resolve: 'gatsby-plugin-google-marketing-platform',
      options: {
        dataLayer: {
          gaPropertyId: 'UA-166189314-1',
        },
        tagmanager: {
          id: 'GTM-PP4LRHB',
        },
        analytics: {
          id: 'UA-166189314-1',
        },
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
    },
  ],
};
