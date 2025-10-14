import Banner from '@/components/Aplication/website/Banner'
import FAQ from '@/components/Aplication/website/FAQ'
import FeaturedProduct from '@/components/Aplication/website/FeaturedProduct'
import FeatureSection from '@/components/Aplication/website/FeatureSection'
import MainSlider from '@/components/Aplication/website/MainSlider'
import ProductCard from '@/components/Aplication/website/ProductCart'
import TestimonialSlider from '@/components/Aplication/website/TestimonialSlider'
import React from 'react'

const Home = () => {
  return (
    <section>
      <MainSlider />
      <Banner />
      <FeaturedProduct title='Newly Added Products'  category="women collection" />
      <div className='md:h-96 h-66 overflow-hidden  py-4 md:py-8'>
        <img src="/assets/images/advertising-banner.png" className='h-full w-full object-cover' alt="" />
      </div>
      <FeaturedProduct title='Feature Products ' category="mens collection" />
      <FeaturedProduct title='Show New Accecaries ' category="Accessories collection" />
      <FeaturedProduct title='Added New Footwares ' category="footware collection" />
      <FeatureSection />
      <FAQ />
      <TestimonialSlider />
    </section>
  )
}

export default Home