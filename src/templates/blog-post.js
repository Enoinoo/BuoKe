import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"

export default function Template({ data }) {
  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="font-bold mb-8 text-4xl">{frontmatter.title}</h1>
        <h2 className="font-semibold mb-8 text-base">
          Published on {frontmatter.date}
        </h2>
        <div
          className="text-xl font-serif leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`
