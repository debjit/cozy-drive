import { t, Selector } from 'testcafe'
import {
  getElementWithTestId,
  isExistingAndVisibile,
  checkAllImagesExists
} from '../../helpers/utils'

export default class Viewer {
  constructor() {
    this.spinner = Selector('[class*="c-spinner"]')
    this.viewerWrapper = getElementWithTestId('viewer-wrapper')
    this.viewerControls = getElementWithTestId('pho-viewer-controls')
    this.viewerToolbar = getElementWithTestId('viewer-toolbar')
    this.btnDownloadViewerToolbar = getElementWithTestId(
      'viewer-toolbar-download'
    )

    // Navigation in viewer
    this.viewerNavNext = getElementWithTestId('viewer-nav--next')
    this.viewerNavNextBtn = this.viewerNavNext.find(
      '[class*="pho-viewer-nav-arrow"]'
    )
    this.viewerNavPrevious = getElementWithTestId('viewer-nav--previous')
    this.viewerNavPreviousBtn = this.viewerNavPrevious.find(
      '[class*="pho-viewer-nav-arrow"]'
    )
    this.viewerBtnClose = getElementWithTestId('btn-viewer-toolbar-close')

    //image viewer is common to photos and drive
    this.imageViewer = getElementWithTestId('viewer-image')
    this.imageViewerContent = this.imageViewer.find('img')
  }

  async waitForLoading() {
    await t.expect(this.spinner.exists).notOk('Spinner still spinning')
    await isExistingAndVisibile(this.viewerWrapper, 'Viewer Wrapper')
    await isExistingAndVisibile(this.viewerControls, 'Viewer Controls')
    await checkAllImagesExists()
    console.log('Viewer Ok')
  }

  //@param { bool } exitWithEsc : true to exit by pressing esc, false to click on the button
  async closeViewer(exitWithEsc) {
    await t.hover(this.viewerWrapper)
    await isExistingAndVisibile(this.viewerBtnClose, 'Close button')
    exitWithEsc ? await t.pressKey('esc') : await t.click(this.viewerBtnClose)
  }

  //@param {number} index: index of open file (need to know if it's first or last file)
  async navigateToNextFile(index) {
    if (index == t.ctx.totalFilesCount - 1) {
      //this is the last picture, so next button does not exist
      await t
        .expect(this.viewerNavNext.exists)
        .notOk('Next button on last picture')
    } else {
      await t
        .hover(this.viewerNavNext) //not last photo, so next button should exists
        .expect(this.viewerNavNextBtn.visible)
        .ok('Next arrow does not show up')
        .click(this.viewerNavNextBtn)
      await this.waitForLoading()
    }
  }

  //@param {number} index: index of open file (need to know if it's first or last file)
  async navigateToPrevFile(index) {
    if (index == 0) {
      //this is the 1st picture, so previous button does not exist
      await t
        .expect(this.viewerNavPrevious.exists)
        .notOk('Previous button on first picture')
    } else {
      await t
        .hover(this.viewerNavPrevious) //not 1st photo, so previous button should exists
        .expect(this.viewerNavPreviousBtn.visible)
        .ok('Previous arrow does not show up')
        .click(this.viewerNavPrevious)
      await this.waitForLoading()
    }
  }

  //@param {String} screenshotPath : path for screenshots taken in this test
  //@param {number} startIndex : index of the 1st file to open
  //@param {number} numberOfNavigation : the number of file we want to go through during the test.
  async navigateInViewer(screenshotPath, startIndex, numberOfNavigation) {
    console.log(
      `startIndex : ${startIndex} / numberOfNavigation : ${numberOfNavigation}`
    )
    for (let i = startIndex; i < startIndex + numberOfNavigation; i++) {
      await this.navigateToNextFile(i)
      if (t.fixtureCtx.isVR)
        await t.fixtureCtx.vr.takeScreenshotAndUpload(
          `${screenshotPath}-${i}-next`
        )
    }

    for (let i = startIndex + numberOfNavigation - 1; i > startIndex; i--) {
      console.log(` i : ${i} `)

      await this.navigateToPrevFile(i)
      if (t.fixtureCtx.isVR)
        await t.fixtureCtx.vr.takeScreenshotAndUpload(
          `${screenshotPath}-${i}-prev`
        )
    }
  }

  //download using the common download button
  async checkCommonViewerDownload() {
    await t.hover(this.viewerWrapper)
    await isExistingAndVisibile(
      this.btnDownloadViewerToolbar,
      'Download button in toolbar'
    )
    await t
      .setNativeDialogHandler(() => true)
      .click(this.btnDownloadViewerToolbar)
  }

  //Specific check for imageViewer (Common to drive/photos)
  async checkImageViewer() {
    await isExistingAndVisibile(this.imageViewer, 'image viewer')
    await isExistingAndVisibile(
      this.imageViewerContent,
      'image viewer controls'
    )
  }
}
