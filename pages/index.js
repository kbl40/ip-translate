import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import axios from 'axios'
import cheerio from 'cheerio'
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

    console.log(patentSummary)

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

  // helper function to scrape the patent html. need to drill down to the correct elements similar to python code above.
  const callScrapePatent = async () => {
    setPatentSummary('')
    const herokuProxyUrl = process.env.NEXT_PUBLIC_HEROKU_PROXY_URL

    // set the url based on the user input
    try {
      const url = `https://patents.google.com/patent/US${userInput}/en`
      const result = await axios.get(`${herokuProxyUrl}/${url}`, {baseURL: ""})
      const $ = cheerio.load(result.data) // result.data returns the html. I'll want this to drill down to what I need.

      let list = []
      $('div[class="description"]').find('.description-paragraph').each(function(index, element) {
        list.push($(element).text())
      })
      const patentString = list.join(' ').slice(0, 14000)
      console.log(patentString)

      console.log(patentString.length)
      console.log(typeof patentString)
      
      // console.log to check if valid input was provided.
      if (patentString.length === 0) {
        alert(`Nothing returned for US Patent Number ${userInput}. Please verify that a valid patent number was provided.`)
      } else {
        alert(`US Patent Number ${userInput} text returned successfully.`)
      }

      setPatentSummary(patentString)
    } catch (error) {
      console.error(error)
      alert(`Nothing returned for US Patent Number ${userInput}. Please verify that a valid patent number was provided.`)
    }
    
  }

  
  
  const onUserChangedText = (event) => {
    console.log(event.target.value)
    setUserInput(event.target.value.trim())
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
            <a className={styles.generateButton} onClick={callScrapePatent}>
              <div className={styles.generate}>
                <p>Get</p>
              </div>
            </a>
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
