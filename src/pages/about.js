import React from 'react';
import { graphql } from 'gatsby';

import {
  Button,
  HeaderBack,
  HeadingXL,
  Layout,
  SEO,
  TextBody,
} from '../components';

const About = () => {
  return (
    <>
      <SEO title="About" />
      <HeaderBack />
      <Layout>
        <HeadingXL>About</HeadingXL>
        <TextBody>
          Hello! வணக்கம்! Salut! नमस्ते! <br /> <br />
          In early May 2020 - the middle of a worldwide pandemic, I decided to
          put my learning to the test by making, hopefully, most of what I learn
          everyday, from both grad school and from working as a junior software
          engineer, available to everyone who stops by this space on the
          Internet. <br /> <br />
          What could you expect to see? <br />
          Short writes on lower-level concepts such as in-memory (or) even
          disk-based data structures and algorithms to distributed applications
          and microservices.
          <br /> <br />- Warren White
        </TextBody>
        <Button href="mailto:warren1linux&#64;gmail.com">Get in touch</Button>
      </Layout>
    </>
  );
};

export default About;

export const query = graphql`
  query {
    RandomPhoto: file(relativePath: { eq: "assets/images/RandomPhoto.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 1400) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`;
