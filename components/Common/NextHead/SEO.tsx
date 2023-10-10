import { NextSeo, NextSeoProps } from "next-seo"

const SEO = (props: NextSeoProps) => {
  const { noindex, description, canonical, title, openGraph } = props

  return (
    <NextSeo 
      noindex={noindex}
      title="WhatMovie | Looking for information about your favorite movie"
      description={description ? description : "Looking for information about your favorite movie"}
      canonical={canonical}
      openGraph={{
        type: 'website',
        url: openGraph?.url || 'https://book-movie-seven.vercel.app/',
        title: title || "WhatMovie | Looking for information about your favorite movie",
        description: description ? description : "Looking for information about your favorite movie",
        siteName: "WhatMovie | Looking for information about your favorite movie",
      }}
      additionalMetaTags={[
        
      ]}
    />
  )
}

export default SEO