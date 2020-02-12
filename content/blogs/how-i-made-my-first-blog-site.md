---
path: "/blogs/how-i-made-my-first-blog-site"
date: "2020-02-06"
title: "How I Made My First Blog Site"
---

First, I installed Gatsby CLI globally using

```
npm i -g gatsby-cli
```

Then, get the default starter from Gatsby to a local directory simply with

```
gatsby new gatsby-blog
```

cd into the created directory before doing anything else

```
cd gatsby-blog
```

After that, I had to install gatsby-source-filesystem so that Gatsby can get data from my local filesystem and gatsby-transformer-remark so that Gatsby can read my markdown blog files. The command to install these packages is

```
npm i gatsby-source-filesystem && npm i gatsby-transformer-remark
```

However, there is one more step we need to do to for these packages to be included in the Gatsby plugin system. Open `gatsby-config.js`, and under the `plugins` array, I inserted

```
{
    resolve: `gatsby-source-filesystem`,
    options: {
    path: `${__dirname}/content/blogs`,
    name: `blogs`,
    },
},
"gatsby-transformer-remark"
```

I also changed the title, description, and author in the metadata in this file.

The next step is creating a markdown blog for Gatsby to display. In my case I wrote this blog under `content/blogs` with the name `how-i-made-my-first-blog-site.md`, and I followed a template like this

```
---
path: "/blogs/post-1"
date: "2020-02-12"
title: "First Post"
---

Actual content
```

In my `gatsby-node.js`, I wrote the code that will create separate pages for every blog post, read `path`s from markdown files and use them as links for the these blogs.

```
const path = require("path")

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions
  const template = path.resolve("src/templates/blog-post.js")

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    return result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.path,
        component: template,
        context: {
          slug: node.slug,
        },
      })
    })
  })
}
```

I also created a `blog-post.js` under `src/templates` to create a general layout that I can use for all blog posts.

```
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
```
