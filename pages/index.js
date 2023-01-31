import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
// import request from 'request'
// import { Cheerio } from 'cheerio'

// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [userInput, setUserInput] = useState('')
  const [patentSummary, setPatentSummary] = useState('')
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callGenerateEndpoint = async () => {
    setIsGenerating(true)
    setApiOutput('')
    console.log("Calling OpenAI...")

    // set the url based on the user input
    const url = `https://patents.google.com/patent/US${userInput}/en`
    
    // call a helper function that will scrape the patent page.
    // helper function return value used in setPatentSummary(returnVal) allowing to pass in the fetch.
    const patentText = scrapePatent(url)
    setPatentSummary(patentText)

    // patentSummary is what will need to be passed to the api.
    // will need to update the base prompt in the api as well in generate.js
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patentSummary }),
    })

    const data = await response.json()
    const { output } = data
    console.log("OpenAI replied...")
    console.log(output)

    setApiOutput(output)
    setIsGenerating(false)
  }

  // need to figure out the logic for this scraping.
  /* Python code from Replit as a guide
    url = f"https://patents.google.com/patent/US{patent}/en"

    response = requests.get(url)
    html = response.content

    soup = BeautifulSoup(html, 'html.parser')

    description = soup.find_all("div", {"class": "description"})[0]

    paragraphs = description.find_all("div", {"class": "description-paragraph"})

    paragraphs_text = []
    for paragraph in paragraphs:
      paragraphs_text.append(paragraph.text)

    paragraphs_text_joined = ''.join(paragraphs_text)[0:14000]
  */

  const scrapePatent = (patentUrl) => {

  }
  
  const onUserChangedText = (event) => {
    console.log(event.target.value)
    setUserInput(event.target.value)
  }
  
  return (
    <>
      <Head>
        <title>ip.translate</title>
        <meta name="description" content="summarize intellectual propert" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.headerTitle}>
          <h1>IP.translate</h1>
        </div>
        <div className={styles.headerSubtitle}>
          <h2>IP summarized easily for your commercialization needs</h2>
        </div>
        <div className={styles.promptContainer}>
          <div className={styles.prompContainerText}>
            <p>Please provide a valid US Patent Number to get started.</p>
          </div>
          <input 
            placeholder="e.g. 123456B2"
            className={styles.promptBox}
            value={userInput}
            onChange={onUserChangedText}
          />
          <div className={styles.promptButtons}>
            <a className={isGenerating ? [styles.generateButton, styles.loading].join(' ')  : styles.generateButton} onClick={callGenerateEndpoint}>
              <div className={styles.generate}>
                {isGenerating ? <span className={styles.loader}></span> : <p>Generate</p>}
              </div>
            </a>
          </div>
          {apiOutput && (
            <div className={styles.output}>
              <div className={styles.outputHeaderContainer}>
                <div className={styles.outputHeader}>
                  <h3>Output</h3>
                </div>
              </div>
              <div className={styles.outputContent}>
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
