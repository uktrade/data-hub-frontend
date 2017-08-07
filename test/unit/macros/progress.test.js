const { getMacros } = require('~/test/unit/macro-helper')
const commonMacros = getMacros('common')

describe('Progress component', () => {
  it('should not render if no stage names present', () => {
    const component = commonMacros.renderToDom('Progress', {
      stageNames: [],
    })

    expect(component).to.be.null
  })

  it('should render stages as expected', () => {
    const component = commonMacros.renderToDom('Progress', {
      stageNames: [
        'one',
        'two',
        'three',
        'four',
        'five',
      ],
      currentStageName: 'three',
      currentStageIndex: 2,
    })
    const progressStageLiElems = component.querySelectorAll('.c-progress__stage')
    expect(component.className).to.contain('c-progress')
    expect(component.firstElementChild.className).to.contain('c-progress-bar')

    expect(progressStageLiElems[0].firstElementChild.textContent).to.contain('one')
    expect(progressStageLiElems[1].firstElementChild.textContent).to.contain('two')
    expect(progressStageLiElems[2].firstElementChild.textContent).to.contain('three')
    expect(progressStageLiElems[3].firstElementChild.textContent).to.contain('four')
    expect(progressStageLiElems[4].firstElementChild.textContent).to.contain('five')

    expect(progressStageLiElems[0].className).to.contain('is-complete')
    expect(progressStageLiElems[0].className).to.not.contain('is-active')
    expect(progressStageLiElems[1].className).to.contain('is-complete')
    expect(progressStageLiElems[1].className).to.not.contain('is-active')
    expect(progressStageLiElems[2].className).to.contain('is-active')
    expect(progressStageLiElems[2].className).to.not.contain('is-complete')
    expect(progressStageLiElems[3].className).to.not.contain('is-active')
    expect(progressStageLiElems[3].className).to.not.contain('is-complete')
    expect(progressStageLiElems[4].className).to.not.contain('is-active')
    expect(progressStageLiElems[4].className).to.not.contain('is-complete')
  })

  it('should render stages as expected when at first stage', () => {
    const component = commonMacros.renderToDom('Progress', {
      stageNames: [
        'one',
        'two',
        'three',
        'four',
        'five',
      ],
      currentStageName: 'one',
      currentStageIndex: 0,
    })

    const progressStageLiElems = component.querySelectorAll('.c-progress__stage')
    expect(component.className).to.contain('c-progress')
    expect(component.firstElementChild.className).to.contain('c-progress-bar')
    expect(progressStageLiElems[0].firstElementChild.textContent).to.contain('one')
    expect(progressStageLiElems[1].firstElementChild.textContent).to.contain('two')
    expect(progressStageLiElems[2].firstElementChild.textContent).to.contain('three')
    expect(progressStageLiElems[3].firstElementChild.textContent).to.contain('four')
    expect(progressStageLiElems[4].firstElementChild.textContent).to.contain('five')
    expect(progressStageLiElems[0].className).to.contain('is-active')
    expect(progressStageLiElems[0].className).to.not.contain('is-complete')
    expect(progressStageLiElems[1].className).to.not.contain('is-active')
    expect(progressStageLiElems[1].className).to.not.contain('is-complete')
    expect(progressStageLiElems[2].className).to.not.contain('is-active')
    expect(progressStageLiElems[2].className).to.not.contain('is-complete')
    expect(progressStageLiElems[3].className).to.not.contain('is-active')
    expect(progressStageLiElems[3].className).to.not.contain('is-complete')
    expect(progressStageLiElems[4].className).to.not.contain('is-active')
    expect(progressStageLiElems[4].className).to.not.contain('is-complete')
  })
})
