import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [userInput, setUserInput] = useState('')
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callGenerateEndpoint = async () => {
    setIsGenerating(true)
    console.log("Calling OpenAI...")

    setIsGenerating(false)
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
        <div className={styles.description}>
          <h1>IP.translate</h1>
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
            <a className={styles.generateButton} onClick={callGenerateEndpoint}>
              <div className={styles.generate}>
                <p>Generate</p>
              </div>
            </a>
          </div>
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
        </div>
      </main>
    </>
  )
}
