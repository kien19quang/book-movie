import { NextSeoProps } from "next-seo";
import SEO from "./SEO";
import Head from 'next/head'
import { seoDefault } from "../../../configs/ConfigSeo";


const NextHead = (props: NextSeoProps) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale = 1, maximum-scale=1.0, user-scalable=0, minimal-ui"></meta>
        <meta name="version" content="1.2.1" />
        <meta name="og:image" content="https://cdn-icons-png.flaticon.com/512/1038/1038100.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        {/* <!-- Bootstrap CSS --> */}
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />

        {/* <!-- Bootstrap JS --> */}
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" async/>

        {/* <!-- Google Fonts --> */}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet" />

        {/* <!-- Fontawesome --> */}
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet" />
      </Head>
      <SEO {...seoDefault} {...props} />
    </>
  )
}

export default NextHead