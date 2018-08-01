import React, { Component } from 'react'
import Wrapper from './style'

/*
 *   Button component
 *   ------------------------------------------------------
 *
 *   DESCRIPTION
 *   Component for action buttons
 *
 *   VARIANTS
 *   primary, dangerous, minor, link, icon
 *
 *   PROPS
 *   onClick, tabIndex, primary, dangerous, minor,
 *   link, children, icon, alt
 *
 */

export default class Button extends Component {
  render () {
    const props = this.props
    let classes = 'button'
    if (props.primary) classes += ' button_primary'
    if (props.dangerous) classes += ' button_dangerous'
    if (props.minor) classes += ' button_minor'
    if (props.link) classes += ' button_link'
    if (props.icon) classes += ' button_icon'
    return <Wrapper
      tabIndex={props.tabIndex}
      onClick={props.onClick}
      className={classes}>
      {props.children}
      <img
        className='button__icon'
        alt={props.alt}
        src={props.icon} />
    </Wrapper>
  }
}
