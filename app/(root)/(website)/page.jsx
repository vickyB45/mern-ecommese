import Banner from '@/components/Aplication/website/Banner'
import FeaturedProduct from '@/components/Aplication/website/FeaturedProduct'
import FeatureSection from '@/components/Aplication/website/FeatureSection'
import MainSlider from '@/components/Aplication/website/MainSlider'
import ProductCard from '@/components/Aplication/website/ProductCart'
import React from 'react'

const Home = () => {
  return (
    <section>
      <MainSlider />
      <FeatureSection />
      <Banner />
      <FeaturedProduct title='Newly Added Products' tag="Newly" category="women collection" />
      <div className='md:h-96 sm:h-64 h-44 overflow-hidden  py-4 md:py-8'>
        <img src="/assets/images/advertising-banner.png" className='h-full w-full object-cover' alt="" />
      </div>
      <FeaturedProduct title='Feature Products ' tag="sale" category="mens collection" />
    </section>
  )
}

export default Home