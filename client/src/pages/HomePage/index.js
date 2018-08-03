import React, { Component } from 'react'
import Paragraph from '../../components/text-levels/Paragraph'
import Button from '../../components/buttons/Button'
import Header from '../../components/blocks/Header'
import SearchField from '../../components/inputs/SearchField'
import NotificationsPanel from '../../containers/NotificationsPanel'
import LibeToolThumb from '../../containers/LibeToolThumb'
import LibeBundleThumb from '../../containers/LibeBundleThumb'
import Wrapper from './style'

export default class HomePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bundles: props.bundles,
      filteredBundles: props.bundles.list,
      filters: {
        tools: null,
        bundles: null
      },
      lastFilterUpdate: {
        tools: 0,
        bundles: 0
      },
      shouldApplyFilters: {
        tools: true,
        bundles: true
      },
    }
    this.getBundleCurrentSettings = this.getBundleCurrentSettings.bind(this)
    this.tryFilterBundles = this.tryFilterBundles.bind(this)
    props.getBundles()
      .then(res => this.filterBundles())
  }

  static getDerivedStateFromProps (props, state) {
    const nBundles = props.bundles
    const nFilters = {
      tools: state.filters.tools,
      bundles: state.filters.bundles,  
    }
    const nLastFilterUpdate = {
      tools: state.lastFilterUpdate.tools,
      bundles: state.lastFilterUpdate.bundles,  
    }
    const nShouldApplyFilters = {
      tools: state.shouldApplyFilters.tools,
      bundles: state.shouldApplyFilters.bundles
    }
    if (props.filters.tools !== state.filters.tools) {
      nFilters.tools = props.filters.tools
      nLastFilterUpdate.tools = Date.now()
      nShouldApplyFilters.tools = true
    }
    if (props.filters.bundles !== state.filters.bundles) {
      nFilters.bundles = props.filters.bundles
      nLastFilterUpdate.bundles = Date.now()
      nShouldApplyFilters.bundles = true
    }
    return {
      ...state,
      bundles: nBundles,
      filters: nFilters,
      lastFilterUpdate: nLastFilterUpdate,
      shouldApplyFilters: nShouldApplyFilters
    }
  }

  filterDelay = 100

  componentDidUpdate () {
    setTimeout(this.tryFilterBundles, this.filterDelay)
  }

  tryFilterBundles () {
    const state = this.state
    const timeSinceLastUpdate = Date.now() - state.lastFilterUpdate.bundles
    const shouldApply = state.shouldApplyFilters.bundles
    if (timeSinceLastUpdate > this.filterDelay && shouldApply) {
      this.filterBundles()
    }
  }

  filterBundles () {
    const state = this.state
    const bundles = state.bundles
    const filter = state.filters.bundles
    const filteredBundles = bundles.list.filter(bundle => {
      const slug = bundle.slug
      const splFilters = filter.split(' ')
      const doesBundleMatch = splFilters.every(word => slug.match(word))
      return doesBundleMatch ? bundle : null
    })
    const sortedBundles = filteredBundles.sort((a, b) => {
      const latestEditA = this.getBundleCurrentSettings(a).timestamp || a.created_on
      const latestEditB = this.getBundleCurrentSettings(b).timestamp || b.created_on
      return latestEditB - latestEditA
    })
    this.setState({
      filteredBundles: sortedBundles,
      shouldApplyFilters: {
        ...state.shouldApplyFilters,
        bundles: false
      }
    })
  }

  getBundleCurrentSettings (bundle) {
    const settingsHistory = bundle.settings_history || []
    const currentSettings = settingsHistory
      .sort((a, b) => {
        return (b.timestamp - a.timestamp)
      })[0]
    return currentSettings || {}
  }

  render () {
    const props = this.props
    const state = this.state
    const bundles = state.bundles
    const filteredBundles = state.filteredBundles
    const shouldApplyBundlesFilter = state.shouldApplyFilters.bundles
    const bundleCreation = props.bundleCreation

    /* Bundles list */
    // [WIP] Some pagination here ?
    const bundlesDom = filteredBundles.map((bundle, i) => {
      const settings = this.getBundleCurrentSettings(bundle)
      return <LibeBundleThumb
        key={i}
        type={bundle.type}
        bundleId={bundle._id}
        created={bundle.created_on}
        updated={settings.timestamp || null}
        author={bundle.author || '<sans-nom>'}
        image={`/images/${bundle.type}-small.png`}
        title={settings.name || '<sans-titre>'} />
    })

    /* Assign classes to component */
    const classes = ['home-page']
    if (bundleCreation.isFetching) classes.push('home-page_create-bundle-fetching')
    if (bundleCreation.error) classes.push('home-page_create-bundle-error')
    if (bundles.error) classes.push('home-page_bundles-error')
    if (bundles.isFetching || shouldApplyBundlesFilter) classes.push('home-page_bundles-fetching')
    if (!bundles.list.length) classes.push('home-page_bundles-empty')
    else if (!bundlesDom.length) classes.push('home-page_bundles-empty-search')

    /* Display */
    return <Wrapper className={classes.join(' ')}>
      <div className='home-page__header'><Header /></div>
      <div className='home-page__content'>
        <div className='home-page__notifications'><NotificationsPanel /></div>
        <div className='home-page__tools-panel'>
          <div className='searchable-list'>
            <div className='home-page__tools-search'>
              <SearchField
                placeholder='Rechercher un outil'
                onChange={e => { props.setToolsFilter(e.target.value) }}
                onBlur={e => { props.setToolsFilter(e.target.value) }} />
            </div>
            <div className='home-page__tools-list'>
              <div className='home-page__tools-list-slider'>
                <LibeToolThumb
                  title='Yellow word'
                  type='yellow-word'
                  image='/images/yellow-word-thumb.png'
                  description='Ce module vous permet d&#39;éditer de jolis mots jaunes.' />
                <LibeToolThumb
                  title='Libé box'
                  type='libe-box'
                  image='/images/libe-box-thumb.png'
                  description='Lorem ipsum dolor sit amet consectutor' />
              </div>
            </div>
          </div>
        </div>
        <div className='home-page__bundles-panel'>
          <div className='searchable-list'>
            <div className='home-page__bundles-search'>
              <SearchField
                placeholder='Rechercher un module'
                onChange={e => { props.setBundlesFilter(e.target.value) }}
                onBlur={e => { props.setBundlesFilter(e.target.value) }} />
            </div>
            <div className='home-page__bundles-loader'><img alt='Loader' src='/images/loader.gif' /></div>
            <div className='home-page__bundles-empty'><Paragraph light italic>Aucun module n'a encore été créé !</Paragraph></div>
            <div className='home-page__bundles-empty-search'>
              <Paragraph light italic>La recherche n'a retourné aucun résultat.</Paragraph>
              <Button minor link onClick={e => { props.setBundlesFilter('') }}>Remettre à zero ?</Button>
            </div>
            <div className='home-page__bundles-error'>
              <Paragraph error>Une erreur est survenue lors du chargement des modules:</Paragraph>
              <Paragraph italic light>{bundles.error || 'Erreur inconnue. Prenez une tisane.'}</Paragraph>
              <Button minor link onClick={props.getBundles}>Essayer à nouveau ?</Button>
            </div>
            <div className='home-page__bundles-list'>
              <div className='home-page__bundles-list-slider'>
                {bundlesDom}
              </div>
            </div>
          </div>
        </div>
        <div className='home-page__create-bundle-loader'>
          <img src='/images/loader.gif' alt='Loader' />
        </div>
      </div>
    </Wrapper>
  }
}
