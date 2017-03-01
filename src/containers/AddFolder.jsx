import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import styles from '../styles/table'
import FilenameInput from '../components/FilenameInput'
import { translate } from '../lib/I18n'

import { createFolder, abortAddFolder } from '../actions'
import { mustShowAddFolder } from '../reducers'

const AddFolder = ({ f, visible, create, hide }) => {
  if (!visible) return null
  return (
    <div className={styles['fil-content-row']}>
      <div className={classNames(styles['fil-content-cell'], styles['fil-content-file-select'])} />
      <div className={classNames(styles['fil-content-cell'], styles['fil-content-file'], styles['fil-file-folder'])}>
        <FilenameInput onSubmit={create} onAbort={hide} />
      </div>
      <div className={classNames(styles['fil-content-cell'], styles['fil-content-date'])}>
        <time datetime=''>{f(Date.now(), 'MMM D, YYYY')}</time>
      </div>
      <div className={classNames(styles['fil-content-cell'], styles['fil-content-size'])}>—</div>
      <div className={classNames(styles['fil-content-cell'], styles['fil-content-status'])}>—</div>
      <div className={classNames(styles['fil-content-cell'], styles['fil-content-file-action'])} />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  visible: mustShowAddFolder(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  create: name => {
    return dispatch(createFolder(name))
  },
  hide: () => {
    return dispatch(abortAddFolder(name))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(AddFolder))
