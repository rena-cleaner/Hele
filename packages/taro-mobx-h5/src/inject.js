import { createElement } from 'nervjs'
import { Component } from '@tarojs/taro-h5'
import { mapStoreToProps, generateDisplayName } from '@tarojs/mobx-common'

export function createStoreInjector (grabStoresFn, injectNames, sourceComponent) {
  class Injector extends Component {
    static isMobxInjector = true
    static config = sourceComponent.config || {}
    static displayName = generateDisplayName(sourceComponent, injectNames)
    __observeInstance

    render () {
      const originProps = mapStoreToProps(grabStoresFn, this.props)
      return createElement(sourceComponent, {
        ...originProps,
        ref: ref => {
          originProps.ref && originProps.ref(ref)
          if (ref) {
            this.__observeInstance = ref
          }
        }
      })
    }

    componentDidShow () {
      const { componentDidShow } = sourceComponent.prototype
      if (typeof componentDidShow === 'function') {
        componentDidShow.call(this.__observeInstance)
      }
    }

    componentDidHide () {
      const { componentDidHide } = sourceComponent.prototype
      if (typeof componentDidHide === 'function') {
        componentDidHide.call(this.__observeInstance)
      }
    }
  }

  return Injector
}
