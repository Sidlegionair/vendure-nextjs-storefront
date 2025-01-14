import React from 'react';
import '../styles/global.css';
import 'keen-slider/keen-slider.min.css';
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { Global, ThemeProvider } from '@emotion/react';
import { LightTheme } from '@/src/theme';
import { CartProvider } from '@/src/state/cart';
import { CheckoutProvider } from '@/src/state/checkout';
import { ProductProvider } from '@/src/state/product';
import { CollectionProvider } from '@/src/state/collection';
import { ChannelsProvider } from '../state/channels';
import AllArticles from '@/src/components/storyblok/AllArticles';
import Article from '@/src/components/storyblok/Article';
import ArticleTeaser from '@/src/components/storyblok/ArticleTeaser';
import Feature from '@/src/components/storyblok/Feature';
import Footer from '@/src/components/storyblok/Footer';
import Grid from '@/src/components/storyblok/Grid';
import Hero from '@/src/components/storyblok/Hero';
import Layout from '@/src/components/storyblok/Layout';
import Navigation from '@/src/components/storyblok/Navigation';
import Page from '@/src/components/storyblok/Page';
import PopularArticles from '@/src/components/storyblok/PopularArticles';
import Teaser from '@/src/components/storyblok/Teaser';
import { ReactCookieFirst } from '@cookiefirst/cookiefirst-react'


import { apiPlugin, storyblokInit } from '@storyblok/react';
import AboutUsBlockInverted from '@/src/components/storyblok/AboutUsBlockInverted';
import Carousel from '@/src/components/storyblok/Carousel';
import AboutUsBlock from '@/src/components/storyblok/AboutUsBlock';
import RichTextEditor from '@/src/components/storyblok/RichTextEditor';
import MosaicBlock from '@/src/components/storyblok/MosaicBlock';
import PageHeading from '@/src/components/storyblok/PageHeading';
import ContainerBlock from '@/src/components/storyblok/ContainerBlock';
import BlogPost from '@/src/components/storyblok/BlogPost';
import ArticleCard from '@/src/components/storyblok/ArticleCard';
import ArticleGrid from '@/src/components/storyblok/ArticleGrid';
import ArticlesOverviewPage from '@/src/components/storyblok/ArticlesOverviewPage';
import RelatedArticles from '@/src/components/storyblok/RelatedArticles';
import ProfileGrid from '@/src/components/storyblok/ProfileGrid';
import TwoColGrid from '@/src/components/storyblok/TwoColGrid';
import MultiColGrid from '@/src/components/storyblok/MultiColGrid';
// import { VendureCollectionSlider } from '@/src/components/molecules/VendureCollectionSlider';

// Register your components
const components = {
    'all-articles': AllArticles,
    'article': Article,
    'article-teaser': ArticleTeaser,
    'feature': Feature,
    'footer': Footer,
    'grid': Grid,
    'two-col-grid': TwoColGrid,
    'multi-col-grid': MultiColGrid,
    'hero': Hero,
    'layout': Layout,
    'navigation': Navigation,
    'page': Page,
    'popular-articles': PopularArticles,
    'teaser': Teaser,
    'about-us-block': AboutUsBlock, // Registering AboutUsBlock component here
    'about-us-block-inverted': AboutUsBlockInverted, // Registering AboutUsBlock component here
    'carousel': Carousel,
    'rich-text-editor': RichTextEditor,
    'mosaic-block': MosaicBlock,
    'page-heading': PageHeading,
    'container-block': ContainerBlock,
    'Blogpost': BlogPost,
    'article-card': ArticleCard,
    'article-grid': ArticleGrid,
    'article-overview-page': ArticlesOverviewPage,
    'related-articles': RelatedArticles,
    'profile-grid': ProfileGrid,
    // 'vendure-collection-slider': VendureCollectionSlider,
};


// Initialize Storyblok with the apiPlugin
storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
    components

});


// Global CSS styles applied for the font family
const customFontStyle = `

`;

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <ReactCookieFirst url="https://consent.cookiefirst.com/sites/demo.boardrush.com-e0a83e47-ae65-43a0-915c-89dc0a764efc/consent.js">

        <ThemeProvider theme={LightTheme}>
            <ChannelsProvider initialState={{ channel: pageProps.channel, locale: pageProps.locale }}>
                {/* Apply the custom font globally */}
                <Global styles={customFontStyle} />
                {/* Checkout provider logic */}
                {'checkout' in pageProps ? (
                    <CheckoutProvider initialState={{ checkout: pageProps.checkout }}>
                        <Component {...pageProps} />
                    </CheckoutProvider>
                ) : (
                    <CartProvider>
                        <ProductProvider
                            initialState={{
                                product: 'product' in pageProps ? pageProps.product : undefined,
                            }}>
                            <CollectionProvider
                                initialState={{
                                    collection: 'collection' in pageProps ? pageProps.collection : undefined,
                                    products: 'products' in pageProps ? pageProps.products : undefined,
                                    facets: 'facets' in pageProps ? pageProps.facets : undefined,
                                    totalProducts: 'totalProducts' in pageProps ? pageProps.totalProducts : undefined,
                                    filters: 'filters' in pageProps ? pageProps.filters : undefined,
                                    searchQuery: 'searchQuery' in pageProps ? pageProps.searchQuery : undefined,
                                    page: 'page' in pageProps ? pageProps.page : undefined,
                                    sort: 'sort' in pageProps ? pageProps.sort : undefined,
                                }}>
                                <Component {...pageProps} />
                            </CollectionProvider>
                        </ProductProvider>
                    </CartProvider>
                )}
            </ChannelsProvider>
        </ThemeProvider>
        </ReactCookieFirst>
    );
};

export default appWithTranslation(App);
