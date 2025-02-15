// eslint-disable-next-line
import React from 'react'
import RecentProducts from '../RecentProducts/RecentProducts.jsx'
// eslint-disable-next-line
import Loading from '../Loading/Loading.jsx'
import MainSlider from '../MainSlider/MainSlider.jsx'
import CategorySlider from '../CategorySlider/CategorySlider.jsx'

export default function Home() {
  
  return <>
    <MainSlider/>
    <CategorySlider/>
   <RecentProducts/>
  </>
}