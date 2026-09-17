import React from 'react'
import Hero from '../components/Hero'
import TrustMarquee from '../components/TrustMarquee'
import Gallery from '../components/Gallery'
import ServicesTabs from '../components/ServicesTabs'
import ProcessSteps from '../components/ProcessSteps'
import ReviewsBand from '../components/ReviewsBand'
import ContactBook from '../components/ContactBook'

export default function Home() {
  return (
    <>
      <Hero />
      <TrustMarquee />
      <Gallery />
      <ServicesTabs />
      <ProcessSteps />
      <ReviewsBand />
      <ContactBook />
    </>
  )
}
